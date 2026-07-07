import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useBooks } from "../../context/BookContext";

const emptyBook = {
  title: "", author: "", isbn: "", publisher: "", category: "novels",
  price: "", originalPrice: "", cover: "", description: "",
  pages: "", language: "English", publicationYear: new Date().getFullYear(),
  featured: false, bestseller: false, stock: "", format: ["Paperback"],
  tags: ""
};

const PAGE_SIZE = 8;

export default function AdminBooks() {
  const { books, categories, addBook, updateBook, deleteBook } = useBooks();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");

  const [form, setForm] = useState(emptyBook);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(action === "add");
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.isbn.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleEdit = (book) => {
    setForm({
      ...book,
      tags: Array.isArray(book.tags) ? book.tags.join(", ") : book.tags
    });
    setEditingId(book.id);
    setShowForm(true);
  };

  const handleNew = () => {
    setForm(emptyBook);
    setEditingId(null);
    setShowForm(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteBook(id);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookData = {
      ...form,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
      pages: parseInt(form.pages) || 0,
      stock: parseInt(form.stock) || 0,
      publicationYear: parseInt(form.publicationYear) || new Date().getFullYear(),
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      format: Array.isArray(form.format) ? form.format : [form.format]
    };

    if (editingId) {
      updateBook({ ...bookData, id: editingId });
    } else {
      addBook(bookData);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyBook);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyBook);
  };

  if (showForm) {
    return (
      <div className="adm-page">
        <div className="adm-header">
          <h1>{editingId ? "Edit Book" : "Add New Book"}</h1>
          <button className="btn-secondary" style={{ padding: "8px 20px", borderRadius: 10, background: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.6)", border: "1px solid rgba(255,255,255,.06)", fontSize: 13, cursor: "pointer" }} onClick={handleCancel}>Cancel</button>
        </div>
        <form className="adm-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Author *</label>
              <input name="author" value={form.author} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>ISBN</label>
              <input name="isbn" value={form.isbn} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Publisher</label>
              <input name="publisher" value={form.publisher} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Language</label>
              <input name="language" value={form.language} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price ($) *</label>
              <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Original Price ($)</label>
              <input name="originalPrice" type="number" step="0.01" value={form.originalPrice} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Stock *</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Pages</label>
              <input name="pages" type="number" value={form.pages} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Publication Year</label>
              <input name="publicationYear" type="number" value={form.publicationYear} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Cover Image URL</label>
              <input name="cover" value={form.cover} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" rows="4" value={form.description} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} />
          </div>
          <div className="form-checkboxes">
            <label className="checkbox-label">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              Featured Book
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="bestseller" checked={form.bestseller} onChange={handleChange} />
              Best Seller
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
            <button type="submit" className="btn-primary">
              {editingId ? "Update Book" : "Publish Book"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="adm-page">
      <div className="adm-header">
        <div>
          <h1>Manage Books</h1>
          <p className="page-sub">{books.length} books total</p>
        </div>
        <button className="btn-primary" style={{ padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all .2s" }} onClick={handleNew}>+ Add New Book</button>
      </div>

      <div className="adm-search">
        <input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="adm-empty">
                    <div className="empty-icon">📚</div>
                    <h3>No books found</h3>
                    <p>Try a different search or add a new book</p>
                  </div>
                </td>
              </tr>
            ) : paged.map(book => (
              <tr key={book.id}>
                <td className="td-book">
                  <img src={book.cover} alt={book.title} />
                  <div>
                    <span className="book-title">{book.title}</span>
                    <span className="book-sub">{book.author}</span>
                  </div>
                </td>
                <td><span className="adm-badge purple">{book.category}</span></td>
                <td style={{ fontWeight: 600, color: "rgba(255,255,255,.8)" }}>${book.price.toFixed(2)}</td>
                <td>
                  <span className={`adm-badge ${book.stock < 20 ? "red" : book.stock < 50 ? "amber" : "green"}`}>
                    {book.stock} left
                  </span>
                </td>
                <td>
                  {book.featured && <span className="adm-badge amber" style={{ marginRight: 4 }}>Featured</span>}
                  {book.bestseller && <span className="adm-badge green">Bestseller</span>}
                  {!book.featured && !book.bestseller && <span className="adm-badge gray">Standard</span>}
                </td>
                <td style={{ textAlign: "right" }}>
                  <div className="adm-table-actions" style={{ justifyContent: "flex-end" }}>
                    <button className="adm-btn-sm" onClick={() => handleEdit(book)} title="Edit">✏️</button>
                    <button className="adm-btn-sm danger" onClick={() => handleDelete(book.id, book.title)} title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="adm-pagination">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} style={{ opacity: page <= 1 ? .4 : 1 }}>← Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} className={page === p ? "active" : ""} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ opacity: page >= totalPages ? .4 : 1 }}>Next →</button>
        </div>
      )}
    </div>
  );
}
