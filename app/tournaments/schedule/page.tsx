import { Suspense } from "react";
import { TournamentScheduleScreen } from "../../tennis-app";

export default function TournamentSchedulePage() {
  return (
    <Suspense fallback={null}>
      <TournamentScheduleScreen />
    </Suspense>
  );
}
