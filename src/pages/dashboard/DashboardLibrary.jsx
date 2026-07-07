import { useDashboard } from "../../context/DashboardContext";
import { useBooks } from "../../context/BookContext";

export default function DashboardLibrary() {
  const { readingProgress, updateProgress } = useDashboard();
  const { books } = useBooks();

  const libraryBooks = readingProgress.map(rp => {
    const book = books.find(b => b.id === rp.bookId);
    return { ...rp, ...book };
  });

  return (
    <div className="dash-page">
      <div className="dash-header">
        <h1>My Book Library</h1>
        <p className="dash-sub">{libraryBooks.length} digital books</p>
      </div>

      <div className="dash-grid three">
        {libraryBooks.map(b => (
          <div key={b.bookId} className="dash-card dash-library-card">
            <img src={b.cover} alt={b.title} className="dash-library-cover" />
            <div className="dash-library-body">
              <h3>{b.title}</h3>
              <p>{b.author}</p>
              <div className="dash-progress-wrap">
                <div className="dash-progress-bar">
                  <div className="dash-progress-fill" style={{ width: `${b.progress}%`, background: "linear-gradient(90deg, #7c3aed, #a78bfa)" }} />
                </div>
                <span className="dash-progress-text">{b.progress}%</span>
              </div>
              <div className="dash-library-actions">
                <button className="dash-btn tiny">Continue Reading</button>
                <button className="dash-btn tiny outline">Download</button>
              </div>
              <div className="dash-library-meta">
                <span>{b.bookmarks?.length || 0} bookmarks</span>
                <span>{b.highlights || 0} highlights</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
