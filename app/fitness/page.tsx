import { Suspense } from "react";
import { FitnessScreen } from "../tennis-app";

export default function FitnessPage() {
  return (
    <Suspense fallback={null}>
      <FitnessScreen />
    </Suspense>
  );
}
