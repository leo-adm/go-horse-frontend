"use client";

import { HorsePosition, RacingHorse, State, Status, User } from "@/types/types";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Race from "./race";
import BettingPanel from "./bettingPanel";
import Link from "next/link";
import useMessage from "@/hooks/useMessage";
import RaceResults from "./raceResults";

const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL);

export default function HomePage() {
  const userId = "1";
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<State>(State.PAUSED);
  const [currentRaceHorses, setCurrentRaceHorses] = useState<RacingHorse[]>([]);
  const [currentRacePositions, setCurrentRacePositions] = useState<
    HorsePosition[]
  >([]);
  const [winnerHorse, setWinnerHorse] = useState<RacingHorse | null>(null);
  const { message, showMessage } = useMessage();

  useEffect(() => {
    fetchStatus();

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
      console.log(data.currentRacePositions);
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
        "x-user-id": userId,
      },
    });

    const data = await res.json();
    if (data.balance != null) {
      setUser((curr) => {
        return {
          ...curr!,
          balance: data.balance,
        };
      });
    } else {
      showMessage(data.error || "Error");
    }
  };

  const fetchStatus = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/status", {
      headers: {
        "x-user-id": userId,
      },
    });
    const data: Status = await res.json();
    setState(data.state);
    setUser(data.user);

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

  const onBetError = (err?: string) => {
    showMessage(err || "Error");
  };

  return (
    <div className="p-6 font-sans">
      <Link
        href="/admin"
        className="text-blue-600 underline block mb-4 text-lg"
      >
        Go to Admin Panel
      </Link>

      <h1 className="text-2xl font-bold mb-4">Go Horse</h1>

      {!!user && <p className="mb-4">Your balance: {user.balance}</p>}

      <p className="mb-4">Current state: {state.toString()}</p>

      {(state === State.RACE_STARTING || state === State.RACING) && (
        <Race
          racingHorses={currentRaceHorses}
          horsePositions={currentRacePositions}
        />
      )}

      {state === State.OPEN_TO_BETS && (
        <BettingPanel
          userId={userId}
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
