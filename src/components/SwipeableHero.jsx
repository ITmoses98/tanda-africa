import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

const slides = [
  {
    tag: "Welcome to Tanda Africa",
    title: "Discover Books That <span class='highlight'>Inspire</span> Change",
    text: "Africa's largest online bookstore. From timeless classics to the latest bestsellers — find your next great read with us.",
    actions: [
      { to: "/catalog", label: "Browse Books", className: "btn btn-primary" },
      { to: "/catalog?category=novels", label: "Best Sellers", className: "btn btn-outline" },
    ],
    stats: [
      { num: "50K+", label: "Books" },
      { num: "10K+", label: "Authors" },
      { num: "500K+", label: "Readers" },
      { num: "50+", label: "Countries" },
    ],
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600",
  },
  {
    tag: "New Arrivals",
    title: "Explore the <span class='highlight'>Latest</span> Releases",
    text: "Stay ahead with newly released books across all genres. From fiction to academic, we've got you covered.",
    actions: [
      { to: "/catalog?sort=newest", label: "New Arrivals", className: "btn btn-primary" },
      { to: "/catalog", label: "All Books", className: "btn btn-outline" },
    ],
    stats: [],
    img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600",
  },
  {
    tag: "Academic Sale",
    title: "Up to <span class='highlight'>40% Off</span> Textbooks",
    text: "Gear up for the semester with huge discounts on academic textbooks and professional development books.",
    actions: [
      { to: "/catalog?category=academic", label: "Shop Textbooks", className: "btn btn-primary" },
      { to: "/catalog", label: "Browse Deals", className: "btn btn-outline" },
    ],
    stats: [],
    img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600",
  },
];

export default function SwipeableHero() {
  const [active, setActive] = useState(0);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const slideWidth = 100;

  const handlers = useSwipeable({
    onSwiping: (e) => {
      setDragging(true);
      setOffset(-active * slideWidth + (e.deltaX / window.innerWidth) * 100);
    },
    onSwipedLeft: () => {
      setDragging(false);
      setOffset(0);
      setActive(Math.min(active + 1, slides.length - 1));
    },
    onSwipedRight: () => {
      setDragging(false);
      setOffset(0);
      setActive(Math.max(active - 1, 0));
    },
    onSwiped: () => {
      setDragging(false);
      setOffset(0);
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  const goTo = useCallback((i) => {
    setActive(i);
    setOffset(0);
  }, []);

  const slide = slides[active];

  return (
    <section className="hero hero-swipe-wrap" {...handlers}>
      <div className="hero-swipe-track" style={{ transform: dragging ? `translateX(${offset}%)` : undefined }}>
        {slides.map((s, i) => (
          <div className="hero-swipe-slide" key={i}>
            <div className="container">
              <div className="hero-content">
                <span className="hero-tag">{s.tag}</span>
                <h1 dangerouslySetInnerHTML={{ __html: s.title }} />
                <p>{s.text}</p>
                <div className="hero-actions">
                  {s.actions.map((a, j) => (
                    <Link key={j} to={a.to} className={a.className}>{a.label}</Link>
                  ))}
                </div>
                {s.stats.length > 0 && (
                  <div className="hero-stats">
                    {s.stats.map((st, j) => (
                      <div className="stat" key={j}>
                        <span className="stat-num">{st.num}</span>
                        <span className="stat-label">{st.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="hero-image">
                <img src={s.img} alt="" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button key={i} className={`hero-dot${i === active ? " active" : ""}`} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </section>
  );
}
