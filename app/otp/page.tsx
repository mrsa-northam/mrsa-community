import { OtpScreen } from "../tennis-app";

export default async function OtpPage({
  searchParams
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return <OtpScreen email={email || "player@mrsa.com"} />;
}
