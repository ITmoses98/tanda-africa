import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page not-found-page">
      <div className="page-hero">
        <div className="container">
          <h1>404</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
        </div>
      </div>
      <div className="container">
        <div className="empty-state">
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
