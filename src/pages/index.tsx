import Layout from "@src/components/common/Layout";
import StarAnimation from "@src/components/StarAnimation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export default function Home() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  const handleClick = () => {
    setIsLoading(true);

    setTimeout(() => {
      router.push("/hadith");
    }, 1500);
  };

  // Only start the content visibility animation after audio has been enabled
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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

        <main
          className={`
              flex-1 flex flex-col items-center justify-center 
              w-full space-y-[2rem] px-4 sm:px-6 mt-8
              transition-all duration-1000 ease-out
              ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }
            `}
        >
          <div className="w-full max-w-4xl mx-auto text-center">
            <h1 className="flex justify-center items-center text-center mx-auto text-5xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-300 drop-shadow-lg">
              {!isMobile && (
                <div className="relative group mr-3">
                  <svg
                    className="transform transition-transform duration-300 group-hover:rotate-12"
                    fill="url(#moonGradient)"
                    height="54"
                    width="54"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512"
                    xmlSpace="preserve"
                    stroke="none"
                  >
                    {/* Define gradient for the moon */}
                    <defs>
                      <linearGradient
                        id="moonGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#ffd700" />
                      </linearGradient>
                    </defs>

                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <g>
                        <g>
                          <path d="M413.497,174.718c-4.189-1.102-8.534,1.053-10.203,5.039c-18.307,43.68-60.738,71.904-108.096,71.904 c-64.599,0-117.153-52.554-117.153-117.153c0-57.696,42.97-107.522,99.952-115.899c4.283-0.63,7.447-4.321,7.415-8.65 c-0.033-4.331-3.252-7.974-7.544-8.539C270.718,0.478,263.41,0,256.146,0C165.23,0,91.774,73.965,91.774,164.881 c0,79.007,54.747,145.184,130.679,161.174v23.411c-6.508,3.009-8.678,8.602-8.678,15.008c0,6.407,2.169,12,8.678,15.009v81.968 c-10.847,3.585-17.866,13.205-17.866,24.515c0,14.356,11.424,26.034,25.779,26.034c14.356,0,26.416-11.678,26.416-26.034 c0-11.309-8.295-20.93-16.973-24.515v-81.968c4.339-3.008,8.678-8.602,8.678-15.009c0-6.407-4.339-12-8.678-15.008v-20.623 c4.339,0.599,10.984,0.919,16.846,0.919c83.713,0,153.864-62.614,163.516-145.648C420.67,179.82,417.678,175.814,413.497,174.718z M230.112,494.644c-4.785,0-8.678-3.892-8.678-8.678c0-4.786,3.893-8.678,8.678-8.678c4.785,0,8.678,3.892,8.678,8.678 C238.79,490.752,234.897,494.644,230.112,494.644z M256.146,312.407c-81.345,0-147.525-66.18-147.525-147.525 c0-69.976,48.973-128.73,114.445-143.786c-37.652,24.163-62.377,66.526-62.377,113.413c0,74.168,60.34,134.508,134.508,134.508 c34.995,0,67.643-13.422,92.074-36.358C362.603,280.388,312.78,312.407,256.146,312.407z"></path>
                        </g>
                      </g>
                    </g>
                  </svg>

                  {/* Small stars around the moon */}
                  <div className="absolute -top-2 -right-2 w-2 h-2 bg-yellow-200 rounded-full animate-pulse"></div>
                  <div
                    className="absolute -bottom-1 -left-1 w-1 h-1 bg-yellow-200 rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                </div>
              )}
              <span className="text-center">Maktabah Ramadan</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
              Destinasi himpunan hadis-hadis Ramadan untuk rujukan anda.
            </p>

            <div
              className={`relative max-w-3xl mx-auto p-8 mb-12 bg-violet-800 rounded-lg shadow-xl border-l-4 border-amber-400 transition-all duration-1500 ease-out
                ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
            >
              <div className="absolute -top-6 -left-6 text-6xl text-amber-400 opacity-50">
                &quot;
              </div>
              <div className="absolute -bottom-16 -right-6 text-6xl text-amber-400 opacity-50">
                &quot;
              </div>

              <p className="text-gray-100 text-lg leading-relaxed italic z-10 relative">
                Daripada Abu Hurairah RA, daripada Nabi ﷺ bersabda:
                &quot;Sesiapa yang berpuasa Ramadan dengan penuh keimanan dan{" "}
                <span className="text-amber-300 font-semibold italic">
                  ihtisab
                </span>{" "}
                (mengharapkan keredhaan Allah) akan diampunkan dosanya yang
                terdahulu.&quot;
              </p>

              <div className="mt-6 pt-4 border-t border-violet-600 text-gray-300 text-sm italic">
                Riwayat al-Bukhari, Kitab al-Iman, Bab Shawmu Ramadhan Ihtisaban
                Minaal-Iman, no.38
              </div>
            </div>

            <div className="mb-6 pb-2 text-gray-200 text-sm italic">
              Sumber data hadis diperoleh dari PDF: <br />{" "}
              <span className="font-semibold">
                Himpunan Hadith-Hadith Sahih Amalan Sunnah Puasa & Ramadan
              </span>
              , terbitan <span className="font-semibold">JAKIM</span>
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

          <footer className="pt-12 pb-6 md:pb-0 lg:pb-0 text-center text-sm opacity-70">
            &copy; 2025 Maktabah Ramadan. Hak Cipta Terpelihara.
          </footer>
        </main>
      </div>
    </Layout>
  );
}
