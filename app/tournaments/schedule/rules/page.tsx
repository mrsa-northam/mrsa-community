import { Suspense } from "react";
import { TournamentScheduleRulesScreen } from "../../../tennis-app";

export default function TournamentScheduleRulesPage() {
  return (
    <Suspense fallback={null}>
      <TournamentScheduleRulesScreen />
    </Suspense>
  );
}
