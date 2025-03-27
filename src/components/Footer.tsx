import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-2 sm:py-4 px-3 sm:px-6 border-t border-gray-100 text-center text-gray-400 text-xs sm:text-sm">
      <span className="font-semibold text-black/60">Maktabah Ramadan</span> •
      Develop by{" "}
      <Link
        href={"https://fvtrx.com"}
        className="text-black/60 font-semibold hover:text-blue-500 transition-colors duration-300"
      >
        @fvtrx
      </Link>{" "}
      {""} & {""}
      <Link
        href={"https://x.com/Lolzilla45"}
        className="text-black/60 font-semibold hover:text-blue-500 transition-colors duration-300"
      >
        @lolzilla45
      </Link>{" "}
      {""}
      &copy;.
    </footer>
  );
}
