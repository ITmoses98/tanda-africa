export default function Shipping() {
  return (
    <div className="page policy-page">
      <div className="container">
        <div className="page-hero">
          <h1>Shipping Policy</h1>
          <p>Fast and reliable delivery across Africa and beyond</p>
        </div>
        <div className="policy-content">
          <section>
            <h2>Delivery Options</h2>
            <div className="shipping-table">
              <div className="shipping-row header">
                <span>Method</span><span>Est. Time</span><span>Cost</span><span>Tracking</span>
              </div>
              <div className="shipping-row">
                <span>Standard</span><span>5-7 business days</span><span>$4.99</span><span>✓</span>
              </div>
              <div className="shipping-row">
                <span>Express</span><span>2-3 business days</span><span>$12.99</span><span>✓</span>
              </div>
              <div className="shipping-row">
                <span>Same Day (Select cities)</span><span>Same day</span><span>$19.99</span><span>✓</span>
              </div>
              <div className="shipping-row">
                <span>International</span><span>7-14 business days</span><span>$24.99</span><span>✓</span>
              </div>
            </div>
          </section>
          <section>
            <h2>Free Shipping</h2>
            <p>Free standard shipping is available on all orders over $50 within Nigeria, Kenya, Ghana, and South Africa.</p>
          </section>
          <section>
            <h2>Delivery Areas</h2>
            <p>We currently deliver to all 54 African countries. International shipping is available to over 50 countries worldwide. Some remote areas may experience longer delivery times.</p>
          </section>
          <section>
            <h2>Tracking Your Order</h2>
            <p>Once your order ships, you will receive a tracking number via email. You can also track your order from your account dashboard.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
