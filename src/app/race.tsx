import { HorsePosition, RacingHorse } from "@/types/types";

interface RaceProps {
  racingHorses: RacingHorse[];
  horsePositions: HorsePosition[];
}

export default function Race({ racingHorses, horsePositions }: RaceProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Race</h2>
      {horsePositions.map((horsePos) => {
        const horse = racingHorses.find(
          (horse) => horse.id === horsePos.horseId
        )!;

        return (
          <div key={horse.id} className="mb-4">
            <strong>{horse.name}</strong> - position: {horsePos.position}
            <div className="bg-gray-200 w-64 h-2 mt-2 relative">
              <div
                className="bg-blue-500 w-2 h-2 absolute"
                style={{ left: `${(horsePos.position / 100) * 256}px` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
