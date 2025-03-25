import loaderData from "@src/components/LottieFiles/Error.json";
import Link from "next/link";
import Lottie from "react-lottie";
export default function SomethingWrong() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="container mx-auto px-6 md:px-12 relative flex items-center py-32">
      <div className="container mx-auto px-6 flex flex-col justify-between items-center relative">
        <Lottie options={defaultOptions} height={500} width={500} />
        <Link href="/">
          <button className="px-3 py-2 w-full mb-8 font-light transition ease-in duration-200 hover:bg-violet-600 hover:text-white border-b text-2xl border-violet-600 focus:outline-none cursor-pointer rounded-sm">
            Kembali ke laman utama
          </button>
        </Link>
      </div>
    </div>
  );
}
