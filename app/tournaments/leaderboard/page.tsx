import { Suspense } from "react";
import { TournamentLeaderboardScreen } from "../../tennis-app";

export default function TournamentLeaderboardPage() {
  return (
    <Suspense fallback={null}>
      <TournamentLeaderboardScreen />
    </Suspense>
  );
}
