import { Suspense } from "react";
import { PlayerScreen } from "../tennis-app";

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <PlayerScreen />
    </Suspense>
  );
}
