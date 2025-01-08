import { RacingHorse } from "@/types/types";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

interface BettingCardProps {
  horse: RacingHorse;
  placeBet: (horseId: string, amount: number) => void;
}

function BettingCard({ horse, placeBet }: BettingCardProps) {
  const [betAmount, setBetAmount] = useState(100);

  const onBetClick = () => {
    placeBet(horse.id, betAmount);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-2">{horse.name}</h2>
      <p className="text-sm text-gray-600">Odds: {horse.odd}x</p>

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
        onClick={onBetClick}
      >
        Bet
      </button>
    </div>
  );
}

interface BettingPanelProps {
  horsesToBet: RacingHorse[];
  onSuccess: () => void;
  onError: (err?: string) => void;
}

export default function BettingPanel({
  horsesToBet,
  onSuccess,
  onError,
}: BettingPanelProps) {
  const { getToken } = useAuth();

  const placeBet = async (horseId: string, amount: number) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/bet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (await getToken()),
      },
      body: JSON.stringify({
        horseId,
        amount,
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

      <div className="flex flex-wrap gap-4">
        {horsesToBet.map((horse) => (
          <BettingCard key={horse.id} horse={horse} placeBet={placeBet} />
        ))}
      </div>
    </>
  );
}
