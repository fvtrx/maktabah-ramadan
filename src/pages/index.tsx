import Layout from "@src/components/common/Layout";
import StarAnimation from "@src/components/StarAnimation";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);

    setTimeout(() => {
      router.push("/hadith");
    }, 1500);
  };

  return (
    <Layout
      title="Maktabah Ramadan"
      description="Sebuah platform yang menghimpunkan kesemua hadis-hadis yang berkaitan dengan bulan Ramadan"
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.25)",
          backdropFilter: "blur(4px)",
          opacity: 1,
          transition: "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          visibility: "visible",
          willChange: "opacity",
        }}
        className="min-h-screen bg-gradient-to-br from-black-900 to-violet-700 text-white overflow-hidden relative flex flex-col"
      >
        <StarAnimation />
        <div className="absolute top-[-10%] right-[-5%] w-72 h-72 bg-yellow-400 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-yellow-600 rounded-full opacity-30 blur-3xl"></div>

        <div className="absolute top-12 right-[10%] w-48 h-48 opacity-10">
          <svg viewBox="0 0 100 100">
            <path
              d="M50,0 A50,50 0 1,1 50,100 A40,40 0 1,0 50,0 Z"
              fill="white"
            />
          </svg>
        </div>

        <main className="flex-1 flex flex-col items-center justify-center w-full space-y-[2rem] px-4 sm:px-6 mt-8">
          <div className="w-full max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-300 drop-shadow-lg">
              <span className="text-6xl mr-2">☪</span> Maktabah Ramadan
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
              Destinasi himpunan hadis-hadis Ramadan untuk rujukan anda.
            </p>

            <div className="relative max-w-3xl mx-auto p-8 mb-12 bg-violet-800 rounded-lg shadow-xl border-l-4 border-amber-400">
              <div className="absolute -top-6 -left-6 text-6xl text-amber-400 opacity-50">
                "
              </div>
              <div className="absolute -bottom-16 -right-6 text-6xl text-amber-400 opacity-50">
                "
              </div>

              <p className="text-gray-100 text-lg leading-relaxed italic z-10 relative">
                Daripada Abu Hurairah RA, daripada Nabi ﷺ bersabda: "Sesiapa
                yang berpuasa Ramadan dengan penuh keimanan dan{" "}
                <span className="text-amber-300 font-semibold italic">
                  ihtisab
                </span>{" "}
                (mengharapkan keredhaan Allah) akan diampunkan dosanya yang
                terdahulu."
              </p>

              <div className="mt-6 pt-4 border-t border-violet-600 text-gray-300 text-sm italic">
                Riwayat al-Bukhari, Kitab al-Iman, Bab Shawmu Ramadhan Ihtisaban
                Minaal-Iman, no.38
              </div>
            </div>

            <button
              onClick={handleClick}
              disabled={isLoading}
              className={`
        px-8 py-4 text-lg font-semibold bg-yellow-500 text-emerald-900 
        rounded-full shadow-lg hover:shadow-xl 
        transition-all duration-300 hover:-translate-y-1 
        relative overflow-hidden group cursor-pointer
        ${isLoading ? "opacity-90 pointer-events-none" : ""}
      `}
            >
              <span
                className={`relative z-10 flex items-center justify-center transition-opacity duration-200 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
              >
                Terokai Hadis
              </span>

              {/* Loading Spinner */}
              {isLoading && (
                <span className="absolute inset-0 flex items-center justify-center z-20">
                  <svg
                    className="animate-spin h-6 w-6 text-emerald-900"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
              )}

              {/* Hover effect - white swipe animation */}
              <span className="absolute inset-0 bg-white opacity-20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
            </button>
          </div>

          <footer className="pt-12 text-center text-sm opacity-70">
            &copy; 2025 Maktabah Ramadan. Hak Cipta Terpelihara.
          </footer>
        </main>
      </div>
    </Layout>
  );
}
