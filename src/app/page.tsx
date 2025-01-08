"use client";

import { HorsePosition, RacingHorse, State, Status } from "@/types/types";
import React, { useEffect, useState } from "react";
import Race from "./race";
import BettingPanel from "./bettingPanel";
import useMessage from "@/hooks/useMessage";
import RaceResults from "./raceResults";
import { useAuth } from "@clerk/nextjs";
import socket from "@/socket";

export default function HomePage() {
  const [balance, setBalance] = useState<number>(0);
  const [state, setState] = useState<State>(State.PAUSED);
  const [currentRaceHorses, setCurrentRaceHorses] = useState<RacingHorse[]>([]);
  const [currentRacePositions, setCurrentRacePositions] = useState<
    HorsePosition[]
  >([]);
  const [winnerHorse, setWinnerHorse] = useState<RacingHorse | null>(null);
  const { message, showMessage } = useMessage();
  const { isLoaded, userId, getToken } = useAuth();

  useEffect(() => {
    fetchStatus();
    fetchBalance();

    socket.on("stateChange", (data) => {
      setState(data.state);

      if (data.state === State.OPEN_TO_BETS) {
        setCurrentRaceHorses(data.currentRaceHorses);
      }

      if (data.state === State.RACE_STARTING) {
        setCurrentRacePositions(data.currentRacePositions);
      }
    });

    socket.on("positionsUpdate", (data) => {
      setCurrentRacePositions(data.currentRacePositions);
    });

    socket.on("raceResult", (data: { winnerHorse: RacingHorse }) => {
      setWinnerHorse(data.winnerHorse);
      fetchBalance();
    });

    return () => {
      socket.off("stateChange");
      socket.off("positionsUpdate");
      socket.off("raceResult");
    };
  }, []);

  const fetchBalance = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/balance", {
      headers: {
        Authorization: "Bearer " + (await getToken()),
      },
    });

    const data = await res.json();
    if (data.balance != null) {
      setBalance(data.balance);
    } else {
      showMessage(data.error || "Error");
    }
  };

  const fetchStatus = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/status");
    const data: Status = await res.json();
    setState(data.state);

    if (data.currentRaceHorses) {
      setCurrentRaceHorses(data.currentRaceHorses);
    }

    if (data.currentRacePositions) {
      setCurrentRacePositions(data.currentRacePositions);
    }
  };

  const onBetSuccess = () => {
    fetchBalance();
    showMessage("Betting completed successfully!");
  };

  const getStateText = (state: State): string => {
    switch (state) {
      case State.PAUSED:
        return "Paused";
      case State.OPEN_TO_BETS:
        return "Open to bets";
      case State.RACE_STARTING:
        return "Race starting";
      case State.RACING:
        return "Racing";
      case State.RACE_FINISHED:
        return "Race finished";
    }
  };

  const onBetError = (err?: string) => {
    showMessage(err || "Error");
  };

  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <div className="p-2 md:p-6 font-sans">
      <div className="flex justify-between items-center">
        <p className="">{getStateText(state)}</p>
        <p className="text-green-900 border px-2 py-1">${balance}</p>
      </div>

      {(state === State.RACE_STARTING || state === State.RACING) && (
        <Race
          racingHorses={currentRaceHorses}
          horsePositions={currentRacePositions}
        />
      )}

      {state === State.OPEN_TO_BETS && (
        <BettingPanel
          horsesToBet={currentRaceHorses}
          onSuccess={onBetSuccess}
          onError={onBetError}
        />
      )}

      {state === State.RACE_FINISHED && !!winnerHorse && (
        <RaceResults winnerHorse={winnerHorse} />
      )}

      {message && <p className="font-bold mt-4">{message}</p>}
    </div>
  );
}
