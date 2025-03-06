import { useRouter } from "next/router";

import dynamic from "next/dynamic";
const HomePage = dynamic(() => import("../index"), { ssr: true });

export default function HadithPage() {
  const router = useRouter();
  const { id } = router.query;

  const hadithId = id ? (Array.isArray(id) ? id[0] : id) : undefined;

  return <HomePage initialHadithId={hadithId} />;
}
