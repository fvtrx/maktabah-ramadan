import { useRouter } from "next/router";

import dynamic from "next/dynamic";
const HadithListPage = dynamic(() => import("@src/pages/hadith"), {
  ssr: true,
});

export default function HadithPage() {
  const router = useRouter();
  const { id } = router.query;

  const hadithId = id ? (Array.isArray(id) ? id[0] : id) : undefined;

  return <HadithListPage initialHadithId={hadithId} />;
}
