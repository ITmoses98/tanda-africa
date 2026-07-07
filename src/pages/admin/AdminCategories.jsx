import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";

const defaultCat = { name: "", slug: "", icon: "📖" };
const icons = ["📖", "📚", "👤", "💼", "🧒", "🙏", "💪", "📰", "🎭", "🔬", "🎨", "🌍", "💻", "📝", "🎵", "🏛️", "🧘", "📜"];

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();
  const [form, setForm] = useState(defaultCat);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      updateCategory({ id: editing, ...form });
    } else {
      addCategory({ ...form, id: form.slug || form.name.toLowerCase().replace(/\s+/g, "-") });
    }
    setForm(defaultCat);
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon });
    setEditing(cat.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this category?")) {
      deleteCategory(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    setForm(defaultCat);
  };

  return (
    <div className="adm-page">
      <div className="adm-header">
        <div>
          <h1>Manage Categories</h1>
          <p className="page-sub">{categories.length} categories</p>
        </div>
        <button className="btn-primary" style={{ padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
          onClick={() => { setForm(defaultCat); setEditing(null); setShowForm(true); }}>+ Add Category</button>
      </div>

      {showForm && (
        <div style={{ marginBottom: 24 }}>
          <form className="adm-form" onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
            <div className="form-group">
              <label>Category Name</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Slug</label>
              <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="e.g. science-fiction" />
            </div>
            <div className="form-group">
              <label>Icon</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {icons.map(ico => (
                  <span key={ico} onClick={() => setForm(p => ({ ...p, icon: ico }))}
                    style={{ fontSize: 24, cursor: "pointer", padding: 6, borderRadius: 6, background: form.icon === ico ? "rgba(124,58,237,.15)" : "rgba(255,255,255,.03)" }}>
                    {ico}
                  </span>
                ))}
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
              <button type="submit" className="btn-primary">{editing ? "Update" : "Create"} Category</button>
            </div>
          </form>
        </div>
      )}

      <div className="adm-grid three">
        {categories.map(cat => (
          <div key={cat.id} className="adm-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: 18 }}>
            <span style={{ fontSize: 30 }}>{cat.icon}</span>
            <div style={{ flex: 1 }}>
              <strong style={{ color: "#fff", fontSize: 14, display: "block" }}>{cat.name}</strong>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>/{cat.slug}</span>
            </div>
            <div className="adm-table-actions">
              <button className="adm-btn-sm" onClick={() => handleEdit(cat)}>✏️</button>
              <button className="adm-btn-sm danger" onClick={() => handleDelete(cat.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
