import Layout from "@src/components/common/Layout";
import FilterHadithSidebar from "@src/components/FilterHadithSidebar";
import HadithCard from "@src/components/HadithCard";
import HadithDetailsModal from "@src/components/HadithDetailsModal";
import { Hadith, useHadithStore } from "@src/store";
import React, { useEffect } from "react";

const HadithSearchApp: React.FC = () => {
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

  useEffect(() => {
    const mockHadiths: Hadith[] = [
      {
        id: 1,
        collection: "Sahih Bukhari",
        book: "Book of Revelation",
        number: "1",
        narrator: "Umar ibn Al-Khattab",
        text: 'I heard Allah\'s Messenger (ﷺ) saying, "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration was for what he emigrated for."',
        arabicText:
          "سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ: إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ",
        grade: "sahih",
        chapter: "How the Divine Revelation started",
        topics: ["Intention", "Deeds", "Hijrah"],
        reference: "Bukhari 1",
      },
      {
        id: 2,
        collection: "Sahih Muslim",
        book: "Book of Faith",
        number: "8",
        narrator: "Abu Hurairah",
        text: "I heard Allah's Messenger (ﷺ) saying, \"Islam is based on five principles: to testify that none has the right to be worshipped but Allah and Muhammad is Allah's Messenger, to offer the prayers, to pay the Zakat, to perform Hajj, and to observe fast during the month of Ramadan.\"",
        arabicText:
          "سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ: بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ",
        grade: "sahih",
        chapter: "What is Islam and explanation of its qualities",
        topics: ["Pillars of Islam", "Faith", "Fundamentals"],
        reference: "Muslim 8",
      },
      {
        id: 3,
        collection: "Sunan Abu Dawud",
        book: "Book of Prayer",
        number: "123",
        narrator: "Aisha",
        text: 'The Prophet (ﷺ) said, "The prayer of a person who does not recite Al-Fatihah is invalid."',
        arabicText:
          "قَالَ النَّبِيُّ صلى الله عليه وسلم: لَا صَلَاةَ لِمَنْ لَمْ يَقْرَأْ بِفَاتِحَةِ الْكِتَابِ",
        grade: "sahih",
        chapter: "Prayer requirements",
        topics: ["Prayer", "Quran", "Al-Fatihah"],
        reference: "Abu Dawud 123",
      },
      {
        id: 4,
        collection: "Sahih Bukhari",
        book: "Book of Knowledge",
        number: "79",
        narrator: "Abu Musa",
        text: "The Prophet (ﷺ) said, \"The example of guidance and knowledge with which Allah has sent me is like abundant rain falling on the earth. Some of the earth was fertile soil which absorbed rain water and brought forth vegetation and grass in abundance. Another portion of it was hard and held the rain water, and Allah benefited the people with it, they utilized it for drinking and irrigating the land for cultivation. A third portion was barren which could neither hold the water nor bring forth vegetation. The first is the example of the person who comprehends Allah's religion and gets benefit from the knowledge Allah has revealed through me and learns and then teaches others. The last example is that of a person who does not care for it and does not take Allah's guidance revealed through me.\"",
        arabicText:
          "قَالَ النَّبِيُّ صلى الله عليه وسلم: مَثَلُ مَا بَعَثَنِي اللَّهُ بِهِ مِنَ الْهُدَى وَالْعِلْمِ كَمَثَلِ غَيْثٍ أَصَابَ أَرْضًا فَكَانَتْ مِنْهَا طَائِفَةٌ طَيِّبَةٌ قَبِلَتِ الْمَاءَ فَأَنْبَتَتِ الْكَلَأَ وَالْعُشْبَ الْكَثِيرَ وَكَانَ مِنْهَا أَجَادِبُ أَمْسَكَتِ الْمَاءَ فَنَفَعَ اللَّهُ بِهَا النَّاسَ فَشَرِبُوا وَسَقَوْا وَزَرَعُوا وَأَصَابَ طَائِفَةً مِنْهَا أُخْرَى إِنَّمَا هِيَ قِيعَانٌ لَا تُمْسِكُ مَاءً وَلَا تُنْبِتُ كَلَأً فَذَلِكَ مَثَلُ مَنْ فَقُهَ فِي دِينِ اللَّهِ وَنَفَعَهُ مَا بَعَثَنِي اللَّهُ بِهِ فَعَلِمَ وَعَلَّمَ وَمَثَلُ مَنْ لَمْ يَرْفَعْ بِذَلِكَ رَأْسًا وَلَمْ يَقْبَلْ هُدَى اللَّهِ الَّذِي أُرْسِلْتُ بِهِ",
        grade: "sahih",
        chapter: "The superiority of knowledge",
        topics: ["Knowledge", "Teaching", "Guidance"],
        reference: "Bukhari 79",
      },
      {
        id: 5,
        collection: "Jami at-Tirmidhi",
        book: "Book of Zuhd",
        number: "2318",
        narrator: "Abdullah bin Amr",
        text: 'The Messenger of Allah (ﷺ) said, "Be in this world as if you were a stranger or a traveler."',
        arabicText:
          "قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم: كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ",
        grade: "hasan_sahih",
        chapter: "On having little regard for the world",
        topics: ["Zuhd", "Worldly life", "Detachment"],
        reference: "Tirmidhi 2318",
      },
      {
        id: 6,
        collection: "Sunan Ibn Majah",
        book: "Book of Asceticism",
        number: "4112",
        narrator: "Abu Dharr",
        text: 'The Messenger of Allah (ﷺ) said to me: "Fear Allah wherever you are, and follow an evil deed with a good one to wipe it out, and treat the people with good behavior."',
        arabicText:
          "قَالَ لِي رَسُولُ اللَّهِ صلى الله عليه وسلم: اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ",
        grade: "hasan",
        chapter: "Good character",
        topics: ["Taqwa", "Character", "Good deeds"],
        reference: "Ibn Majah 4112",
      },
      {
        id: 7,
        collection: "Sahih Bukhari",
        book: "Book of Faith",
        number: "42",
        narrator: "Anas",
        text: 'The Prophet (ﷺ) said, "None of you will have faith till he wishes for his (Muslim) brother what he likes for himself."',
        arabicText:
          "قَالَ النَّبِيُّ صلى الله عليه وسلم: لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
        grade: "sahih",
        chapter: "From the signs of faith",
        topics: ["Faith", "Brotherhood", "Love"],
        reference: "Bukhari 42",
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

  // Update book options when collection changes
  useEffect(() => {
    if (selectedCollection === "all") {
      setBookOptions(books);
    } else {
      const filteredBooks = [
        ...new Set(
          hadiths
            .filter((h) => h.collection === selectedCollection)
            .map((h) => h.book)
        ),
      ];
      setBookOptions(filteredBooks);
    }
    setSelectedBook("all"); // Reset book selection when collection changes
  }, [selectedCollection, hadiths, books]);

  // Search and filter function
  useEffect(() => {
    let results = hadiths;

    // Show only bookmarks if the bookmark filter is active
    if (showBookmarks) {
      results = results.filter((hadith) =>
        bookmarks.some((bookmark) => bookmark.id === hadith.id)
      );
    }

    // Filter by collection
    if (selectedCollection !== "all") {
      results = results.filter(
        (hadith) => hadith.collection === selectedCollection
      );
    }

    // Filter by book
    if (selectedBook !== "all") {
      results = results.filter((hadith) => hadith.book === selectedBook);
    }

    // Filter by narrator
    if (selectedNarrator !== "all") {
      results = results.filter(
        (hadith) => hadith.narrator === selectedNarrator
      );
    }

    // Filter by grade
    if (selectedGrade !== "all") {
      results = results.filter((hadith) => hadith.grade === selectedGrade);
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (hadith) =>
          hadith.text.toLowerCase().includes(term) ||
          hadith.arabicText?.toLowerCase().includes(term) ||
          hadith.narrator.toLowerCase().includes(term) ||
          hadith.book.toLowerCase().includes(term) ||
          hadith.number.includes(term) ||
          hadith.chapter.toLowerCase().includes(term) ||
          (hadith.topics &&
            hadith.topics.some((topic) =>
              topic.toLowerCase().includes(term)
            )) ||
          (hadith.reference && hadith.reference.toLowerCase().includes(term))
      );
    }

    setFilteredHadiths(results);
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

  // Toggle bookmark for a hadith
  const toggleBookmark = (
    id: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    const isBookmarked = bookmarks.some((bookmark) => bookmark.id === id);
    let newBookmarks;

    if (isBookmarked) {
      // Remove the bookmark if it's already bookmarked
      newBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
    } else {
      // Add the bookmark if it's not already bookmarked
      // Based on the error, we can see that Bookmark and Hadith are different types
      // We need to find the hadith and store its ID in the bookmarks array
      const hadithToBookmark = hadiths.find((hadith) => hadith.id === id);
      if (hadithToBookmark) {
        // Create a new bookmark object with the required structure
        const newBookmark = {
          id: hadithToBookmark.id,
          hadithId: hadithToBookmark.id,
          dateAdded: new Date().toISOString(),
        };
        newBookmarks = [...bookmarks, newBookmark];
      } else {
        newBookmarks = [...bookmarks];
      }
    }

    setBookmarks(newBookmarks);
    localStorage.setItem("hadithBookmarks", JSON.stringify(newBookmarks));
  };

  // Close hadith details
  const closeHadithDetails = () => {
    setSelectedHadith(null);
  };

  // Copy hadith text
  const copyHadithText = (text: string, arabicText: string) => {
    let copyText = "";

    if (displayLanguage === "both") {
      copyText = `${text}\n\n${arabicText}`;
    } else if (displayLanguage === "arabic") {
      copyText = arabicText;
    } else {
      copyText = text;
    }

    navigator.clipboard.writeText(copyText).then(() => {
      alert("Hadith copied to clipboard");
    });
  };

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
                  displayLanguage === "english" ? "bg-gray-900 text-white" : ""
                }`}
                onClick={() => setDisplayLanguage("english")}
              >
                English
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex flex-1 overflow-hidden">
          {/* Search sidebar */}
          <FilterHadithSidebar
            isSidebarOpen={isSidebarOpen}
            searchTerm={searchTerm}
            handleSearchChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />

          {/* Results */}
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
                    viewHadithDetails={(hadith) => {
                      setSelectedHadith(hadith);
                    }}
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
            copyHadithText={copyHadithText}
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

export default HadithSearchApp;
