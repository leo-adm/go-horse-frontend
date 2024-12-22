import { RacingHorse } from "@/types/types";

interface RaceResultsProps {
  winnerHorse: RacingHorse;
}

export default function RaceResults({ winnerHorse }: RaceResultsProps) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-2">Race results</h2>
      <p>
        Winner horse: <b>{winnerHorse.name}</b> ({winnerHorse.odd}x)
      </p>
    </>
  );
}
