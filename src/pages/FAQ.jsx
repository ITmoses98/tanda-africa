import { useState } from "react";
import { faqCategories } from "../data/faq";

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("orders");
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentCategory = faqCategories.find(c => c.id === activeCategory);

  return (
    <div className="page faq-page">
      <div className="container">
        <div className="page-hero">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about shopping on Tanda Africa.</p>
        </div>

        <div className="faq-tabs">
          {faqCategories.map(cat => (
            <button
              key={cat.id}
              className={`faq-tab ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="faq-list">
          {currentCategory?.questions.map((item, i) => (
            <div className={`faq-item ${openItems[i] ? "open" : ""}`} key={i}>
              <button className="faq-question" onClick={() => toggleItem(i)}>
                <span>{item.q}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
