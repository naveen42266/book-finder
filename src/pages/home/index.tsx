import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FadeLoader } from "react-spinners";

interface Book {
  key: string;
  cover_i?: number;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  edition_count?: number;
}

const trending = [
  {
    author_name: ["Kaveh Akbar"],
    title: "Martyr!",
    first_publish_year: 2024,
    publisher: ["Penguin Random House"],
    isbn: ["9780593316927"],
    language: ["eng"],
    key: "/works/OL39050007W",
    subject: ["Fiction", "Literary Fiction", "Psychological Fiction"],
    cover:
      "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSDNQL_lQ2foKapbVV2MFmoK1p6b3pFfTjH5QG-Y0AMb2MLPcV3",
  },
  {
    author_name: ["Kiley Reid"],
    title: "Come and Get It",
    first_publish_year: 2024,
    publisher: ["Penguin Books"],
    isbn: ["9781984881675"],
    language: ["eng"],
    key: "/works/OL39048845W",
    subject: ["Fiction", "Literary Fiction"],
    cover:
      "https://m.media-amazon.com/images/I/91iVDjSMMXL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    author_name: ["Ashley Elston"],
    title: "First Lie Wins",
    first_publish_year: 2024,
    publisher: ["St. Martin's Press"],
    isbn: ["9781250279290"],
    language: ["eng"],
    key: "/works/OL39048847W",
    subject: ["Thriller", "Mystery", "Suspense"],
    cover:
      "https://m.media-amazon.com/images/I/81CPwEFaBnL._UF1000,1000_QL80_.jpg",
  },
  {
    author_name: ["Tommy Orange"],
    title: "Wandering Stars",
    first_publish_year: 2024,
    publisher: ["Knopf"],
    isbn: ["9780525657267"],
    language: ["eng"],
    key: "/works/OL39049914W",
    subject: ["Fiction", "Historical Fiction", "Native American Fiction"],
    cover:
      "https://m.media-amazon.com/images/I/A1kv-p2X5tL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    author_name: ["Percival Everett"],
    title: "James",
    first_publish_year: 2024,
    publisher: ["Graywolf Press"],
    isbn: ["9781644452582"],
    language: ["eng"],
    key: "/works/OL39049913W",
    subject: ["Fiction", "Historical Fiction"],
    cover:
      "https://m.media-amazon.com/images/I/61aU1rC4L2L._AC_UF1000,1000_QL80_.jpg",
  },
  {
    author_name: ["Nick Medina"],
    title: "Sisters of the Lost Nation",
    first_publish_year: 2024,
    publisher: ["Sourcebooks Landmark"],
    isbn: ["9781728253681"],
    language: ["eng"],
    key: "/works/OL39049911W",
    subject: ["Thriller", "Mystery", "Suspense"],
    cover:
      "https://m.media-amazon.com/images/I/91IaISqtwdL._UF1000,1000_QL80_.jpg",
  },
  {
    author_name: ["Alex Finlay"],
    title: "The Night Shift",
    first_publish_year: 2024,
    publisher: ["Minotaur Books"],
    isbn: ["9781250802065"],
    language: ["eng"],
    key: "/works/OL39049910W",
    subject: ["Thriller", "Mystery"],
    cover:
      "https://m.media-amazon.com/images/I/61qjMWxDK7L._AC_UF1000,1000_QL80_.jpg",
  },
  {
    author_name: ["Rebecca Yarros"],
    title: "Fourth Wing",
    first_publish_year: 2024,
    publisher: ["Red Tower Books"],
    isbn: ["9781949677277"],
    language: ["eng"],
    key: "/works/OL39049909W",
    subject: ["Fantasy", "Romance"],
    cover:
      "https://m.media-amazon.com/images/I/914-JotHxWL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    author_name: ["Justin Cronin"],
    title: "The Ferryman",
    first_publish_year: 2024,
    publisher: ["Ballantine Books"],
    isbn: ["9781984818377"],
    language: ["eng"],
    key: "/works/OL39049908W",
    subject: ["Dystopian Fiction", "Science Fiction"],
    cover:
      "https://m.media-amazon.com/images/I/71Yt5F+GzJL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    author_name: ["Gabrielle Zevin"],
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    first_publish_year: 2024,
    publisher: ["Knopf"],
    isbn: ["9780593318204"],
    language: ["eng"],
    key: "/works/OL39049907W",
    subject: ["Fiction", "Literary Fiction", "Gaming"],
    cover:
      "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1636978687l/58784475._SY475_.jpg",
  },
];
const categories = [
  "Action",
  "Adventure",
  "Alternate History",
  "Anthology",
  "Art",
  "Autobiography",
  "Biography",
  "Business",
  "Children's",
  "Classic",
  "Comedy",
  "Comic",
  "Coming-of-Age",
  "Crime",
  "Dictionary",
  "Drama",
  "Dystopian",
  "Fantasy",
  "Fiction",
  "Graphic Novel",
  "Historical Fiction",
  "Horror",
  "Humor",
  "Illustrated",
  "Journal",
  "Literary Fiction",
  "Memoir",
  "Mystery",
  "Non-Fiction",
  "Novella",
  "Philosophy",
  "Poetry",
  "Psychology",
  "Romance",
  "Science",
  "Science Fiction",
  "Self-Help",
  "Short Stories",
  "Social Science",
  "Sports",
  "Suspense",
  "Thriller",
  "Travel",
  "Western",
  "Young Adult",
];

function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [books, setBooks] = useState<Book[]>([]); // Define books as an array of Book
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = async (text: string, pageNumber = 1) => {
    if (!text) return;

    setLoading(true);
    setError("");
    setBooks([]);
    const limit = 10;
    const offset = (pageNumber - 1) * limit;

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${text}&limit=${limit}&offset=${offset}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.docs.length > 0) {
        setBooks(data.docs as Book[]); // Type cast the data.docs array to Book[]
        setTotalPages(Math.ceil(data.numFound / limit));
      } else {
        setError("No results found");
      }
    } catch (error) {
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleBookDetail = (book: any) => {
    localStorage.setItem("navigate", "bookId");
    localStorage.setItem("bookData", JSON.stringify(book));
  };

  const handleCategoryClick = (category: string) => {
    localStorage.setItem("search", category);
    setSearchTerm(category);
    handleSearch(category);
    setPage(1);
  };

  function truncateText(text: string, wordLimit = 5) {
    const words = text.split(" ");
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(" ") + " ...";
  }

  function arrayToString(data: string[] | undefined) {
    return truncateText(data?.join(", ") || "Unknown");
  }

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
    handleSearch(searchTerm, page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
      handleSearch(searchTerm, page - 1);
    }
  };

  function splitBookId(id: string) {
    const bookId = id.split("/")[2];
    return bookId;
  }

  useEffect(() => {
    if (localStorage.getItem("navigate") == "bookId") {
      handleSearch(localStorage.getItem("search") as string, page);
      localStorage.removeItem("navigate");
      localStorage.removeItem("search");
    }
  }, []);

  return (
    <div
      className={`${
        books?.length > 0 ? "h-full" : "h-screen"
      } overflow-y-scroll hidden-scrollbar w-full bg-gradient-to-b from-purple-500 to-indigo-500`}
    >
      <div className="mx-auto max-w-[80%] py-4">
        <h1 className="text-3xl font-bold mb-4">Book Finder</h1>
        <div className="w-full flex mb-4">
          <input
            type="text"
            className="flex-1 p-2 border rounded-l-md"
            placeholder="Search for a book..."
            value={searchTerm}
            onChange={(e) => {
              localStorage.setItem("search", e.target.value);
              setSearchTerm(e.target.value);
              handleSearch(e.target.value);
            }}
          />
        </div>
        <div className="flex space-x-2 mb-6 overflow-x-scroll hidden-scrollbar w-full p-2">
          <div className="flex space-x-2 w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`${
                  searchTerm === category
                    ? "text-white bg-black"
                    : "text-slate-800 bg-white"
                } px-5 py-2 text-xs rounded-md border border-black whitespace-nowrap`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        {loading && (
          <div className="flex flex-row justify-center items-center py-40">
            <FadeLoader />
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-12">
          {books.map((book) => {
            return (
              <Link
                key={book.key}
                to={`/book/${splitBookId(book.key)}`}
                onClick={() => {
                  handleBookDetail(book);
                }}
              >
                <div className="bg-white shadow-md hover:shadow-xl rounded-md w-40 md:w-52 duration-300 transform hover:-translate-y-1">
                  <img
                    src={`${
                      book.cover_i
                        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                        : "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="
                    }`}
                    alt={book.title}
                    className="h-fit w-full object-fit mb-2"
                    width={200}
                  />
                  <div className="p-1 md:p-5 text-base">
                    <h3 className="font-bold text-blue-900 hover:text-black hover:underline">
                      {truncateText(book.title)}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Author: {arrayToString(book.author_name)}
                    </p>
                    <p className="text-gray-600 text-sm">
                      First Published: {book.first_publish_year || "N/A"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Total Edition Count:{" "}
                      {book.edition_count || "Not Available"}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {!books?.length && !searchTerm && !loading && (
          <div>
            <div className="text-2xl italic font-semibold pb-5">
              Trending Now
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-12">
              {trending?.map((book) => {
                return (
                  <div
                    key={book.key}
                    // to={`/book/${splitBookId(book.key)}`}
                    // onClick={() => {
                    //   handleBookDetail(book);
                    // }}
                  >
                    <div className="bg-white shadow-md hover:shadow-xl rounded-md w-40 md:w-52 duration-300 transform hover:-translate-y-1">
                      <img
                        src={`${
                          book.cover
                            ? book.cover
                            : "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="
                        }`}
                        alt={book.title}
                        className="h-fit w-full object-fit mb-2"
                        width={200}
                      />
                      <div className="p-1 md:p-5 text-base">
                        <h3 className="font-bold text-blue-900 hover:text-black hover:underline">
                          {truncateText(book.title)}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Author: {arrayToString(book.author_name)}
                        </p>
                        <p className="text-gray-600 text-sm">
                          First Published: {book.first_publish_year || "N/A"}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Total Edition Count:{" "}
                          {/* {book.edition_count || "Not Available"} */}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {books?.length > 0 && (
          <div className="flex justify-center items-center my-6">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`px-4 py-2 mx-2 rounded-md ${
                page === 1
                  ? "bg-gray-300"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Prev
            </button>
            <span className="text-white mx-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className={`px-4 py-2 mx-2 rounded-md ${
                page === totalPages
                  ? "bg-gray-300"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
