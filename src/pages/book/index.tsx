import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
const languageMap: Record<string, string> = {
  eng: "English",
  fre: "French",
  spa: "Spanish",
  ger: "German",
  ita: "Italian",
  rus: "Russian",
  jpn: "Japanese",
  chi: "Chinese",
  kor: "Korean",
  ara: "Arabic",
  por: "Portuguese",
  hin: "Hindi",
  ben: "Bengali",
  urd: "Urdu",
  tam: "Tamil",
  tel: "Telugu",
  tur: "Turkish",
  vie: "Vietnamese",
  tha: "Thai",
  pol: "Polish",
  dut: "Dutch",
  gre: "Greek",
  heb: "Hebrew",
  ind: "Indonesian",
  mal: "Malay",
  per: "Persian",
  swe: "Swedish",
  nor: "Norwegian",
  dan: "Danish",
  fin: "Finnish",
  hun: "Hungarian",
  cze: "Czech",
  slo: "Slovak",
  rom: "Romanian",
  bul: "Bulgarian",
  ukr: "Ukrainian",
  lit: "Lithuanian",
  lav: "Latvian",
  est: "Estonian",
  srp: "Serbian",
  // slo: "Slovenian",
  mac: "Macedonian",
  alb: "Albanian",
  bos: "Bosnian",
  amh: "Amharic",
  som: "Somali",
  swa: "Swahili",
  yor: "Yoruba",
  zul: "Zulu",
  afr: "Afrikaans",
  kur: "Kurdish",
  taj: "Tajik",
  // tur: "Turkmen",
  uzb: "Uzbek",
  kaz: "Kazakh",
  kir: "Kyrgyz",
  aze: "Azerbaijani",
  geo: "Georgian",
  arm: "Armenian",
  mya: "Burmese",
  khm: "Khmer",
  lao: "Lao",
  sin: "Sinhala",
  nep: "Nepali",
  pus: "Pashto",
  mar: "Marathi",
  guj: "Gujarati",
  pan: "Punjabi",
  // mal: "Malayalam",
  kan: "Kannada",
  ori: "Odia",
  ass: "Assamese",
  bur: "Burmese",
  mon: "Mongolian",
  tib: "Tibetan",
  // bos: "Bosnian",
  cat: "Catalan",
  gla: "Scottish Gaelic",
  gle: "Irish Gaelic",
  wel: "Welsh",
  bre: "Breton",
  lux: "Luxembourgish",
  fri: "Frisian",
  man: "Mandingo",
  hau: "Hausa",
  ful: "Fula",
  bam: "Bambara",
  ewe: "Ewe",
  dag: "Dagbani",
  fuf: "Pular",
  ibo: "Igbo",
  lua: "Luba-Lulua",
  // lit: "Luba-Katanga",
  ber: "Berber",
  // tam: "Tamazight",
  cop: "Coptic",
  akk: "Akkadian",
  sdn: "Sardinian",
  // Add additional languages as needed
};

function Book() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [storedBookData, setStoredBookData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  console.log(storedBookData, "details page", book);

  function fromMainPage() {
    setStoredBookData(JSON.parse(localStorage.getItem("bookData") as any));
  }

  function getFullLanguageName(shortName: string) {
    // Check if the short name exists in the mapping
    return languageMap[shortName] || "Unknown Language";
  }

  // Example usage:
  const languageShortNames = storedBookData?.language || [];
  const fullLanguageNames = languageShortNames.map((name: string) =>
    getFullLanguageName(name)
  );

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(
          `https://openlibrary.org/works/${id}.json`
        );
        if (!response?.ok) {
          throw new Error("Failed to fetch book details");
        }
        const data = await response?.json();
        setBook(data);
      } catch (error) {
        setError("An error occurred while fetching book details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetails();
    fromMainPage();
  }, [id]);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>{error}</p>;

  return (
    <div className="h-full w-full bg-gradient-to-b from-purple-500 to-indigo-500 hidden-scrollbar">
      <div className="mx-auto max-w-[80%] py-4">
        <div className="text-lg ">
          <button
            onClick={() => navigate(-1)}
            className="text-black text-xl font-semibold mb-4 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          <h1 className="text:xl md:text-2xl font-bold text-white mb-4">
            {book?.title}
          </h1>
          <p className=" text-white mb-2">
            Author(s): {storedBookData?.author_name?.join(", ") || "Unknown"}
          </p>
          <p className="text-white mb-2">
            First Published: {storedBookData?.first_publish_year || "N/A"}
          </p>
          <p className="text-white mb-2">
            Last Modified:{" "}
            {new Date(book?.last_modified?.value)?.toLocaleString() || "N/A"}
          </p>
          <p className="text-white mb-2">
            Edition Count: {storedBookData?.edition_count || "Not Available"}
          </p>
          <p className="text-white mb-2">
            No of Page Count:{" "}
            {storedBookData?.number_of_pages_median || "Not Available"}
          </p>
          <p className="text-white mb-2 capitalize">
            Language: {fullLanguageNames.join(", ") || "Not Specified"}
          </p>
          <p className="text-white mb-2 capitalize">
            Subjects :{" "}
            <div className="flex flex-wrap">
              {book?.subjects?.map((subject: string, index: number) => {
                return (
                  <span
                    key={index}
                    className="px-2 py-0.5 border border-black bg-white text-black m-1 rounded-md"
                  >
                    {subject}
                  </span>
                );
              }) || "Not Specified"}
            </div>
          </p>
          <p className="text-base text-white mb-6">
            Description : {book?.description?.value || "Not Available"}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {book?.covers?.map((coverId: number, index: number) => (
              <div key={index} className="overflow-hidden">
                <img
                  src={`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`}
                  alt={`${book?.title} cover ${index + 1}`}
                  className="w-full h-auto object-cover bg-white duration-300 transform hover:-translate-y-1"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Book;
