import Layout from "@src/components/common/Layout";
import FilterHadithSidebar from "@src/components/FilterHadithSidebar";
import HadithCard from "@src/components/HadithCard";
import HadithDetailsModal from "@src/components/HadithDetailsModal";
import { Bookmark, Hadith, useHadithStore } from "@src/store";
import { copyHadithText } from "@src/utils/helpers/string";
import useToast from "@src/utils/hooks/useToast";
import React, { useEffect, useState } from "react";

const MainPage: React.FC<{ initialHadithId?: string }> = ({
  initialHadithId,
}) => {
  const {
    hadiths,
    filteredHadiths,
    isLoading,
    selectedHadith,
    displayLanguage,
    books,
    selectedCollection,
    selectedBook,
    showBookmarks,
    searchTerm,
    isSidebarOpen,
    selectedNarrator,
    bookmarks,
    selectedGrade,

    // Actions
    setHadiths,
    setDisplayLanguage,
    setFilteredHadiths,
    setSelectedHadith,
    setIsLoading,
    setCollections,
    setBookOptions,
    setNarrators,
    setBookmarks,
    setBooks,
    setSelectedBook,
    setSearchTerm,
    resetFilters,
    toggleSidebar,
  } = useHadithStore();
  const toast = useToast();

  const [viewingHadithId, setViewingHadithId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const mockHadiths: Hadith[] = [
      {
        id: 1,
        number: "16",
        chapter: "PUASA RAMADAN ADALAH RUKUN ISLAM",
        narrator: "Ibn 'Umar RA",
        source:
          "Riwayat Muslim, Kitab al-Iman, Bab Bayanu Arkani al-Islami wa Daáimihial-Ízhom, no. 16",
        book: "Kitab al-Iman",
        collection: "Riwayat Muslim",
        translation:
          "Daripada Ibn 'Umar RA, dari Nabi ﷺ bersabda: 'Islam dibangun di atas lima rukun; Mentauhidkan Allah, mendirikan solat, menunaikan zakat, berpuasa Ramadan dan (menunaikan) haji.' Lantas seorang lelaki bertanya: 'Apakah haji dan (kemudian) puasa Ramadan?' Baginda menjawab: 'Tidak, puasa Ramadan dan (kemudian) haji.' Demikianlah aku mendengarnya daripada Rasulullah ﷺ.'",
        lessons: [
          "Islam tertegak di atas lima rukun. Setiap rukun Islam mempunyai tuntutannya tersendiri yang hendaklah dilaksanakan oleh setiap muslim.",
          "Berpuasa di bulan Ramadan merupakan rukun Islam yang ke-empat sebelum menunaikan haji. Ianya mengikut tuntutan yang lebih utama dalam kefarduannya.",
          "Tanpa salah satu daripada rukun Islam ini, keislaman seseorang itu boleh musnah sebagaimana sebuah khemah yang mempunyai lima batang tiang tetapi apabila satu tiangnya patah akan merobohkan seluruh khemah tersebut.",
        ],
      },
      {
        id: 2,
        number: "1891",
        chapter: "KEFARDUAN PUASA",
        narrator: "Talhah bin Ubaidullah RA",
        source:
          "Riwayat al-Bukhari, Kitab ash-Shiyam, Bab Wujubi Shaumi Ramadhan, no.1891",
        book: "Kitab ash-Shiyam",
        collection: "Riwayat al-Bukhari",
        translation:
          "Daripada Talhah bin Ubaidullah RA, bahawa seorang arab badwi menemui Rasulullah ﷺ dalam keadaan kepalanya penuh debu, lalu berkata: 'Ya Rasulullah, beritahukanlah kepadaku solat apakah yang Allah wajibkan atasku?.' Baginda ﷺ menjawab: 'Solat lima waktu, kecuali jika engkau suka mengerjakan solat sunat.' Si arab badwi tadi bertanya lagi: 'Beritahukanlah kepadaku puasa apakah yang Allah wajibkan bagiku?' Baginda ﷺ menjawab: 'Puasa bulan Ramadan, kecuali jika engkau suka mengerjakan puasa sunat.' Si arab badwi tadi bertanya lagi: 'Beritahukanlah kepadaku, zakat apakah yang Allah wajibkan atasku?', maka Rasulullah ﷺ memberitahukan kepadanya tentang syariat-syariat Islam, lalu arab badwi tersebut mengatakan: 'Demi Zat yang memuliakanmu, saya tidak suka melakukan yang sunat dan tidak akan mengurangi sedikitpun yang telah Allah fardhukan ke atas diriku.' Maka Rasulullah ﷺ bersabda: 'Dia seorang yang beruntung jika dia benar atau dia akan memasuki syurga jika dia benar.'",
        lessons: [
          "Setiap muslim diwajibkan melaksanakan ibadah fardu seperti solat, puasa dan zakat bagi memenuhi tuntutan amalan yang telah difardukan.",
          "Dijelaskan bahawa ibadah fardu sudah memadai jika dilaksanakan dengan sempurna. Namun, ibadah sunat menjadi pelengkap kepada mana-mana kekurangan dalam amalan fardu tersebut.",
          "Pelaksanaan ibadah fardu dengan sempurna akan mendapat ganjaran syurga dan diikuti dengan amalan sunat akan meningkatkan lagi nilai sesuatu amalan.",
        ],
      },
      {
        id: 3,
        chapter: "RAMADAN BULAN KETAATAN",
        narrator: "Abu Hurairah RA",
        source:
          "Riwayat Ibnu Majah, Kitab ash-Shiyam, Bab Ma Jaá Fi Fadhli Syahru Ramadhana, no. 1642, berkata al-Arnaút: Hadith sahih dan sanadnya hasan",
        book: "Kitab ash-Shiyam",
        collection: "Riwayat Ibnu Majah",
        number: "1642",
        translation:
          "Daripada Abu Hurairah RA, beliau berkata, Rasulullah ﷺ bersabda: 'Apabila tiba malam pertama bulan Ramadan, syaitan-syaitan dan jin-jin yang jahat dibelenggu, pintu-pintu neraka ditutup, tidak ada satupun pintunya yang terbuka. Pintu-pintu syurga dibuka, tidak ada satupun pintunya yang tertutup. Lalu seorang penyeru menyeru: 'Wahai yang mengharapkan kebaikan, bersegeralah (kepada ketaatan). Wahai yang mengharapkan keburukan, berhentilah (daripada melakukan keburukan). Allah SWT akan membebaskan hamba-hamba -Nya daripada api neraka dan perkara tersebut berlaku pada setiap malam (di bulan Ramadan).'",
        lessons: [
          "Allah SWT telah menjanjikan pada bulan Ramadan ganjaran pahala yang berganda-ganda.",
          "Ramadan adalah kesempatan bagi orang yang berpuasa dapat menjalani amal ibadah dengan bersungguh-sungguh tanpa gangguan dan godaan daripada syaitan. Ini kerana, syaitan dan iblis akan dirantai serta dibelenggu.",
          "Pintu neraka akan ditutup serapat-rapatnya dan pintu syurga dibuka seluas-luasnya bagi menyambut orang yang berpuasa dengan bersungguh-sungguh dengan melakukan amal kebaikan di bulan Ramadan.",
        ],
      },
      {
        id: 4,
        chapter: "RAMADAN BULAN KEAMPUNAN",
        narrator: "Abu Hurairah RA",
        source:
          "Riwayat al-Bukhari, Kitab al-Iman, Bab Shawmu Ramadhan Ihtisaban Mina al-Iman, no. 38",
        book: "Kitab al-Iman",
        collection: "Riwayat al-Bukhari",
        number: "38",
        translation:
          "Daripada Abu Hurairah RA, daripada Nabi ﷺ bersabda: 'Sesiapa yang berpuasa Ramadan dengan penuh keimanan dan ihtisab (mengharapkan keredhaan Allah) akan diampunkan dosanya yang terdahulu.'",
        lessons: [
          "Ibadah puasa merupakan satu amalan yang dapat mendidik dan membentuk ketaqwaan seseorang hamba.",
          "Disebalik kewajipan berpuasa itu, terdapat hakikat yang tersirat iaitu menanamkan kebiasaan mengadakan pengawasan terhadap diri sendiri dan menanam akhlak kesabaran di dalam jiwa setiap pelakunya.",
          "Seorang hamba yang berpuasa terutamanya di bulan Ramadan, maka Allah SWT akan menghapuskan dosa-dosanya yang terdahulu dan apabila dosa seorang hamba diampunkan, maka hamba itu akan lebih dekat dengan ketaqwaan.",
        ],
      },
      {
        id: 5,
        chapter: "MENDAPAT SYAFAAT DARIPADA PUASA & AL-QURAN",
        narrator: "Abdullah bin Amru RA",
        source:
          "Riwayat Ahmad, Musnad al-Mukaththirin Mina ashShohabah, Musnad Abdullah bin Amru bin al-Ash RA, no. 6337, berkata Ahmad Syakir: Isnadnya Sahih",
        book: "Musnad al-Mukaththirin Mina ashShohabah",
        collection: "Riwayat Ahmad",
        number: "6337",
        translation:
          "Daripada Abdullah bin Amru RA, bahawa Rasulullah ﷺ bersabda: 'Puasa dan alQuran akan memberikan syafaat kepada hamba (orang yang berpuasa dan yang sentiasa membaca al-Quran) di hari kiamat nanti. Puasa akan berkata: 'Wahai Tuhan! Sesungguhnya aku telah menahan hamba-Mu ini daripada makan, minum dan perkara syahwat pada waktu siang, maka terimalah syafaatku kepadanya.' Manakala al-Quran pula akan berkata: 'Wahai Tuhan! Sesungguhnya aku telah menahan hamba-Mu ini daripada tidur di malam hari, maka terimalah syafaatku kepadanya.' Baginda ﷺ bersabda: 'Maka Allah pun menerima kedua-dua syafaat tersebut.'",
        lessons: [
          "Pada hari kiamat nanti semua manusia akan membawa diri masing-masing kerana tiada siapa lagi dapat memberikan pertolongan pada hari tersebut. Namun selain daripada syafaat Nabi SAW ke atas umat Baginda, ibadah solat, puasa, membaca al-Quran dan amalan amalan kebaikan lain akan menjadi syafaat yang diterima oleh Allah.",
          "Alangkah indah dan beruntungnya kehidupan seorang muslim yang senantiasa berpuasa pada waktu siangnya dan membaca al-Quran pada waktu malamnya di samping melakukan amal ibadah yang lain untuk mendekatkan diri kepada Allah SWT.",
          "Sebaliknya, mereka yang mengabaikan perintah Allah akan berasa rugi dan kesal kerana melakukan amal ibadah tersebut secara sambil lewa. Bahkan amalanamalan tersebut akan mengutuk dan mendoakan kecelakaan kepada mereka di hari kiamat nanti.",
        ],
      },
      {
        id: 6,
        chapter: "PUASA RAMADAN MENGHAPUSKAN DOSA",
        narrator: "Abu Hurairah RA",
        source:
          "Riwayat Muslim, Kitab at-Toharah, Bab ashSholawat al-Khamsi wa al-Jumati 'Ila alJumaati' wa Ramadhana Ila Ramadhana Mukaffiratun Lima Bainahunna Ma Ijtinabati al-Kabair, no. 233",
        book: "Kitab at-Toharah",
        collection: "Riwayat Muslim",
        number: "223",
        translation:
          'Daripada Abu Hurairah RA, bahawa Rasulullah ﷺ bersabda: "Solat lima waktu, hari Jumaat ke Jumaat (berikutnya) dan Ramadan ke Ramadan (berikutnya) akan menghapuskan (dosa-dosa) di antara tempoh tersebut sekiranya (seseorang itu) menjauhi dosadosa besar."',
        lessons: [
          "Seseorang yang melakukan amalan wajib akan diganjari pahala dan keampunan oleh Allah SWT.",
          "Setiap amalan yang dilaksanakan dengan penuh keikhlasan akan melahirkan kemanisan dan ketenangan dalam diri dalam beramal.",
          "Keampunan yang dimaksudkan adalah untuk dosa-dosa kecil sahaja manakala dosa-dosa besar tidak akan terhapus melainkan dengan hanya bertaubat kepada Allah SWT (dengan sebenar-benar taubat).",
        ],
      },
      {
        id: 7,
        chapter: "GANJARAN ORANG YANG BERPUASA DARI ALLAH SWT",
        narrator: "Abu Hurairah RA",
        source:
          "Muttafaqun 'Alayhi, riwayat al-Bukhari, Kitab ash-Shaum, Bab Hal Yaqulu Inni Shaimun Iza Sutima, no. 1904, Muslim, Kitab ash-Shiyam, Bab Fadhlu ash-Shiyam, no. 1151",
        book: "Kitab ash-Shaum",
        collection: "Muttafaqun 'Alayhi",
        number: "1151",
        translation:
          "Daripada Abu Hurairah RA, beliau berkata, Rasulullah ﷺ bersabda: 'Allah SWT berfirman (hadith qudsi): Setiap amalan anak Adam adalah untuk dirinya melainkan puasa. Sesungguhnya puasa itu milik-Ku (Allah) dan Akulah yang akan membalasnya.'",
        lessons: [
          "Makna 'Sesungguhnya puasa itu milik-Ku (Allah) dan Akulah yang akan membalasnya' adalah puasa merupakan amalan batin yang hakikatnya tidak diketahui melainkan Allah SWT yang Maha Mengetahui dan orang yang melakukannya sahaja.",
          "Di hari kiamat, Allah 'Azza Wajalla akan menghisab setiap amalan hamba-Nya. Setiap kezaliman akan disempurnakan pembalasannya dengan semua amalan pelaku kezaliman itu akan dijadikan kafarah kepada dosa kezalimannya sehinggalah tidak tinggal sedikit pun daripada amalannya kecuali puasa. Lalu Allah SWT menghapuskan dosa yang berbaki daripada kezaliman tersebut dan dimasukkan ke dalam syurga dengan sebab amalan puasa yang telah dilakukan.",
          "Sesungguhnya puasa adalah milik Allah 'Azza Wajalla. Tidak ada jalan bagi seseorangpun untuk merampas pahala puasa, bahkan ia akan kekal bersama pemiliknya.",
        ],
      },
    ];

    setHadiths(mockHadiths);
    setFilteredHadiths(mockHadiths);
    setIsLoading(false);

    // Extract unique collections, books, narrators, etc.
    const uniqueCollections = [
      ...new Set(mockHadiths.map((h) => h.collection)),
    ];
    setCollections(uniqueCollections);

    const uniqueBooks = [...new Set(mockHadiths.map((h) => h.book))];
    setBooks(uniqueBooks);
    setBookOptions(uniqueBooks);

    const uniqueNarrators = [...new Set(mockHadiths.map((h) => h.narrator))];
    setNarrators(uniqueNarrators);

    // Load saved bookmarks from localStorage if available
    const savedBookmarks = localStorage.getItem("hadithBookmarks");
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  useEffect(() => {
    const newBookOptions =
      selectedCollection === "all"
        ? books
        : [
            ...new Set(
              hadiths
                .filter((h) => h.collection === selectedCollection)
                .map((h) => h.book)
            ),
          ];

    setBookOptions(newBookOptions);
    setSelectedBook("all");
  }, [selectedCollection, hadiths, books]);

  useEffect(() => {
    const applyFilters = (results: Hadith[]): Hadith[] => {
      if (showBookmarks) {
        results = results.filter((hadith) =>
          bookmarks.some((bookmark) => bookmark.id === hadith.id)
        );
      }

      if (selectedCollection !== "all") {
        results = results.filter(
          (hadith) => hadith.collection === selectedCollection
        );
      }

      if (selectedBook !== "all") {
        results = results.filter((hadith) => hadith.book === selectedBook);
      }

      if (selectedNarrator !== "all") {
        results = results.filter(
          (hadith) => hadith.narrator === selectedNarrator
        );
      }

      return results;
    };

    const applySearch = (results: Hadith[]): Hadith[] => {
      if (searchTerm.trim() === "") return results;

      const term = searchTerm.toLowerCase();
      return results.filter(
        (hadith) =>
          hadith.translation.toLowerCase().includes(term) ||
          hadith.arabicText?.toLowerCase().includes(term) ||
          hadith.narrator.toLowerCase().includes(term) ||
          hadith.book.toLowerCase().includes(term) ||
          hadith.number.includes(term) ||
          hadith.chapter.toLowerCase().includes(term)
      );
    };

    const filteredResults = applySearch(applyFilters([...hadiths]));
    setFilteredHadiths(filteredResults);
  }, [
    searchTerm,
    selectedCollection,
    selectedBook,
    selectedNarrator,
    selectedGrade,
    hadiths,
    bookmarks,
    showBookmarks,
  ]);

  const updateBookmarks = (
    newBookmarks: (
      | Bookmark
      | { id: number; hadithId: number; dateAdded: string }
    )[],
    message: string
  ): void => {
    setBookmarks(newBookmarks);
    localStorage.setItem("hadithBookmarks", JSON.stringify(newBookmarks));

    toast.open({
      content: message,
      variant: "success",
    });
  };

  const toggleBookmark = (
    id: number,
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.stopPropagation();

    const isBookmarked = bookmarks.some((bookmark) => bookmark.id === id);

    if (isBookmarked) {
      const newBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
      updateBookmarks(newBookmarks, "Hadith removed from bookmarks");
      return;
    }

    const hadithToBookmark = hadiths.find((hadith) => hadith.id === id);
    if (!hadithToBookmark) return;

    const newBookmark = {
      id: hadithToBookmark.id,
      hadithId: hadithToBookmark.id,
      dateAdded: new Date().toISOString(),
    };

    const newBookmarks = [...bookmarks, newBookmark];
    updateBookmarks(newBookmarks, "Hadith bookmarked!");
  };

  useEffect(() => {
    if (initialHadithId && hadiths.length > 0) {
      const id = parseInt(initialHadithId, 10);
      const hadith = hadiths.find((h) => h.id === id);
      if (hadith) {
        setSelectedHadith(hadith);
        setViewingHadithId(hadith.id);
      }
    }
  }, [initialHadithId, hadiths]);

  const openHadithDetails = (hadith: Hadith) => {
    setSelectedHadith(hadith);
    setViewingHadithId(hadith.id);

    if (!initialHadithId || parseInt(initialHadithId, 10) !== hadith.id) {
      window.history.pushState(
        { hadithId: hadith.id },
        "",
        `/hadith/${hadith.id}`
      );
    }
  };

  const closeHadithDetails = () => {
    setSelectedHadith(null);
    setViewingHadithId(null);

    if (!initialHadithId) {
      window.history.pushState({ hadithId: null }, "", "/");
    } else {
      window.history.back();
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const matches = window.location.pathname.match(/\/hadith\/(\d+)/);

      if (matches && matches[1]) {
        const id = parseInt(matches[1], 10);
        if (id !== viewingHadithId) {
          const hadith = hadiths.find((h) => h.id === id);
          if (hadith) {
            setSelectedHadith(hadith);
            setViewingHadithId(id);
          }
        }
      } else {
        setSelectedHadith(null);
        setViewingHadithId(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [hadiths, viewingHadithId]);

  return (
    <Layout
      title="Maktabah Ramadan"
      description="Sebuah platform yang menghimpunkan kesemua hadis-hadis yang berkaitan dengan bulan Ramadan"
      keywords="hadis, ramadan, maktabah-ramadan"
    >
      <div className="flex flex-col h-screen bg-white text-gray-900">
        {/* Header */}
        <header className="border-b border-gray-100 py-4 px-6 bg-white sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Toggle sidebar"
              >
                ☰
              </button>
              <h1 className="text-2xl font-bold">Maktabah Ramadan</h1>
            </div>

            {/* Language switcher */}
            <div className="flex gap-1 text-sm bg-gray-50 rounded-full overflow-hidden">
              <button
                className={`px-4 py-2 ${
                  displayLanguage === "both" ? "bg-gray-900 text-white" : ""
                }`}
                onClick={() => setDisplayLanguage("both")}
              >
                Both
              </button>
              <button
                className={`px-4 py-2 ${
                  displayLanguage === "arabic" ? "bg-gray-900 text-white" : ""
                }`}
                onClick={() => setDisplayLanguage("arabic")}
              >
                Arabic
              </button>
              <button
                className={`px-4 py-2 ${
                  displayLanguage === "malay" ? "bg-gray-900 text-white" : ""
                }`}
                onClick={() => setDisplayLanguage("malay")}
              >
                Malay
              </button>
            </div>
          </div>
        </header>

        <main className="flex flex-1 overflow-hidden">
          <FilterHadithSidebar
            isSidebarOpen={isSidebarOpen}
            searchTerm={searchTerm}
            handleSearchChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />

          <div className="flex-1 p-6 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <p>Loading...</p>
              </div>
            ) : filteredHadiths.length > 0 ? (
              <div className="space-y-6">
                {filteredHadiths.map((hadith) => (
                  <HadithCard
                    key={hadith.id}
                    hadith={hadith}
                    viewHadithDetails={openHadithDetails}
                    displayLanguage={displayLanguage}
                    bookmarks={bookmarks}
                    toggleBookmark={toggleBookmark}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-gray-400 mb-4">
                  No hadith found matching your search criteria.
                </p>
                <button
                  className="text-sm text-gray-500 border p-2 rounded-sm relative overflow-hidden group hover:cursor-pointer"
                  onClick={resetFilters}
                >
                  <span className="relative z-10 transition-colors duration-150 group-hover:text-white">
                    Clear filters
                  </span>
                  <span className="absolute inset-0 bg-black/80 transform scale-x-0 origin-left transition-transform duration-150 ease-in-out group-hover:scale-x-100"></span>
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Hadith detail modal */}
        {selectedHadith && (
          <HadithDetailsModal
            selectedHadith={selectedHadith}
            closeHadithDetails={closeHadithDetails}
            toggleBookmark={toggleBookmark}
            bookmarks={bookmarks}
            displayLanguage={displayLanguage}
            isCopied={copied}
            copyHadithText={(text) => {
              copyHadithText(setCopied, { text, displayLanguage });
              toast.open({
                content: "Hadith copied successfully!",
                variant: "success",
              });
            }}
          />
        )}

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-gray-100 text-center text-gray-400 text-sm">
          Maktabah Ramadan • Designed with modern simplicity
        </footer>
      </div>
    </Layout>
  );
};

export default MainPage;
