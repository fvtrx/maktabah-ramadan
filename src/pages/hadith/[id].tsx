import { useRouter } from "next/router";
import MainPage from "../index"; // Import your main page component

export default function HadithPage() {
  const router = useRouter();
  const { id } = router.query;

  const hadithId = id ? (Array.isArray(id) ? id[0] : id) : undefined;

  return <MainPage initialHadithId={hadithId} />;
}
