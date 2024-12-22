import { Horse } from "@/types/types";
import { useState } from "react";

interface BettingPanelProps {
  userId: string;
  horsesToBet: Horse[];
  onSuccess: () => void;
  onError: (err?: string) => void;
}

export default function BettingPanel({
  userId,
  horsesToBet,
  onSuccess,
  onError,
}: BettingPanelProps) {
  const [selectedHorseId, setSelectedHorseId] = useState(horsesToBet[0].id);
  const [betAmount, setBetAmount] = useState<number>(100);

  const placeBet = async () => {
    const res = await fetch("http://localhost:3333/bet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify({
        horseId: selectedHorseId,
        amount: betAmount,
      }),
    });

    const data = await res.json();

    if (data.success) {
      onSuccess();
    } else {
      onError(data.error);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-2">Betting Panel</h2>
      <div className="mb-2">
        <label className="mr-2">Horse:</label>
        <select
          value={selectedHorseId}
          onChange={(e) => {
            console.log(e.target.value);
            setSelectedHorseId(e.target.value);
          }}
          className="border p-1"
        >
          {horsesToBet.map((horse) => (
            <option key={horse.id} value={horse.id}>
              {horse.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="mr-2">Bet amount:</label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className="border p-1 w-20"
        />
      </div>

      <button
        className="bg-green-600 text-white py-1 px-3 rounded"
        onClick={placeBet}
      >
        Bet
      </button>
    </>
  );
}
