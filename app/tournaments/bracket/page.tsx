import { Suspense } from "react";
import { TournamentLiveBracketScreen } from "../../tennis-app";

export default function TournamentBracketPage() {
  return (
    <Suspense fallback={null}>
      <TournamentLiveBracketScreen />
    </Suspense>
  );
}
