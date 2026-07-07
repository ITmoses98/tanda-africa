import { createContext, useContext, useReducer } from "react";
import { books as initialBooks } from "../data/books";
import { useAdmin } from "./AdminContext";

const BookContext = createContext();

function bookReducer(state, action) {
  switch (action.type) {
    case "ADD_BOOK":
      return [...state, { ...action.payload, id: Date.now(), rating: 0, reviewCount: 0 }];
    case "UPDATE_BOOK":
      return state.map(b => b.id === action.payload.id ? { ...b, ...action.payload } : b);
    case "DELETE_BOOK":
      return state.filter(b => b.id !== action.payload);
    default:
      return state;
  }
}

export function BookProvider({ children }) {
  const [books, dispatch] = useReducer(bookReducer, initialBooks);
  const { categories } = useAdmin();

  const addBook = (book) => dispatch({ type: "ADD_BOOK", payload: book });
  const updateBook = (book) => dispatch({ type: "UPDATE_BOOK", payload: book });
  const deleteBook = (id) => dispatch({ type: "DELETE_BOOK", payload: id });
  const getBook = (id) => books.find(b => b.id === parseInt(id));

  const featuredBooks = books.filter(b => b.featured);
  const bestsellerBooks = books.filter(b => b.bestseller);

  return (
    <BookContext.Provider value={{
      books, categories, featuredBooks, bestsellerBooks,
      addBook, updateBook, deleteBook, getBook
    }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error("useBooks must be used within BookProvider");
  return ctx;
}
