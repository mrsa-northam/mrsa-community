import { OtpScreen } from "../tennis-app";

export default async function OtpPage({
  searchParams
}: {
  searchParams: Promise<{ email?: string; next?: string }>;
}) {
  const { email, next } = await searchParams;

  return <OtpScreen email={email || "player@mrsa.com"} nextPath={next} />;
}
