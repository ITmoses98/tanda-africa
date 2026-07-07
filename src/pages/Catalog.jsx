import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import { useBooks } from "../context/BookContext";

export default function Catalog() {
  const { books, categories } = useBooks();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";
  const formatFilter = searchParams.get("format") || "";
  const sortBy = searchParams.get("sort") || "relevance";

  const [priceRange, setPriceRange] = useState([0, 200]);
const [selectedPublisher, setSelectedPublisher] = useState("");
const [selectedAuthor, setSelectedAuthor] = useState("");
const [showFilters, setShowFilters] = useState(false);
const publishers = [...new Set(books.map(b => b.publisher))].sort();
const authors = [...new Set(books.map(b => b.author))].sort();

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.includes(q) ||
        b.publisher.toLowerCase().includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (categoryFilter) {
      result = result.filter(b => b.category === categoryFilter);
    }

    if (formatFilter) {
      result = result.filter(b => b.format.some(f => f.toLowerCase().includes(formatFilter.toLowerCase())));
    }

    if (selectedPublisher) {
      result = result.filter(b => b.publisher === selectedPublisher);
    }

    if (selectedAuthor) {
      result = result.filter(b => b.author === selectedAuthor);
    }

    result = result.filter(b => b.price >= priceRange[0] && b.price <= priceRange[1]);

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "title": result.sort((a, b) => a.title.localeCompare(b.title)); break;
      default: break;
    }

    return result;
  }, [searchQuery, categoryFilter, formatFilter, sortBy, selectedPublisher, selectedAuthor, priceRange]);

  const currentCategory = categories.find(c => c.id === categoryFilter);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <div className="container">
          {searchQuery ? (
            <>
              <h1>Search Results</h1>
              <p className="catalog-subtitle">{filteredBooks.length} result{filteredBooks.length !== 1 ? "s" : ""} for "{searchQuery}"</p>
            </>
          ) : (
            <>
              <h1>{currentCategory ? currentCategory.name : "All Books"}</h1>
              <p className="catalog-subtitle">{filteredBooks.length} books available</p>
            </>
          )}
        </div>
      </div>

      <div className="container">
        <div className="catalog-layout">
          <aside className={`catalog-filters ${showFilters ? "open" : ""}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button className="filters-close" onClick={() => setShowFilters(false)}>✕</button>
            </div>

            <div className="filter-group">
              <h4>Category</h4>
              <div className="filter-options">
                <button className={`filter-chip ${!categoryFilter ? "active" : ""}`} onClick={() => updateFilter("category", "")}>All</button>
                {categories.map(cat => (
                  <button key={cat.id} className={`filter-chip ${categoryFilter === cat.id ? "active" : ""}`} onClick={() => updateFilter("category", cat.id)}>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Format</h4>
              <div className="filter-options">
                {["", "Paperback", "Hardcover", "eBook", "Audiobook"].map(f => (
                  <label key={f} className="filter-radio">
                    <input
                      type="radio"
                      name="format"
                      checked={formatFilter === f.toLowerCase()}
                      onChange={() => updateFilter("format", f ? f.toLowerCase() : "")}
                    />
                    <span>{f || "All"}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-range">
                <input type="range" min="0" max="200" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])} />
                <div className="price-labels">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            <div className="filter-group">
              <h4>Publisher</h4>
              <select value={selectedPublisher} onChange={e => setSelectedPublisher(e.target.value)}>
                <option value="">All Publishers</option>
                {publishers.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <h4>Author</h4>
              <select value={selectedAuthor} onChange={e => setSelectedAuthor(e.target.value)}>
                <option value="">All Authors</option>
                {authors.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <button className="btn btn-secondary" onClick={() => {
              setSelectedPublisher("");
              setSelectedAuthor("");
              setPriceRange([0, 200]);
              updateFilter("category", "");
              updateFilter("format", "");
            }}>
              Clear All Filters
            </button>
          </aside>

          <div className="catalog-main">
            <div className="catalog-toolbar">
              <button className="filter-toggle" onClick={() => setShowFilters(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
                Filters
              </button>
              <div className="sort-select">
                <label>Sort by:</label>
                <select value={sortBy} onChange={e => updateFilter("sort", e.target.value)}>
                  <option value="relevance">Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
            </div>

            {filteredBooks.length === 0 ? (
              <div className="no-results">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <h3>No books found</h3>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="books-grid">
                {filteredBooks.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
