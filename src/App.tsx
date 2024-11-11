import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Book from "./pages/book";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/book/:id" element={<Book />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
