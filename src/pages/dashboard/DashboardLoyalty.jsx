import { useState } from "react";
import { useDashboard } from "../../context/DashboardContext";

export default function DashboardLoyalty() {
  const { loyaltyPoints, membershipLevel, membershipColors, referralCode, redeemPoints } = useDashboard();
  const [redeemAmount, setRedeemAmount] = useState(100);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const levels = [
    { name: "Silver", points: 0, color: "#94a3b8", icon: "🥈", benefit: "Free shipping on orders over $30" },
    { name: "Gold", points: 500, color: "#f59e0b", icon: "🥇", benefit: "10% bonus points + birthday reward" },
    { name: "Platinum", points: 2000, color: "#a78bfa", icon: "💎", benefit: "15% bonus points + exclusive early access" },
  ];

  const nextLevel = levels.find(l => l.points > loyaltyPoints) || levels[levels.length - 1];
  const prevLevel = [...levels].reverse().find(l => l.points <= loyaltyPoints) || levels[0];
  const progress = nextLevel.points > prevLevel.points ? ((loyaltyPoints - prevLevel.points) / (nextLevel.points - prevLevel.points)) * 100 : 100;

  return (
    <div className="dash-page">
      <div className="dash-header">
        <h1>Loyalty & Rewards</h1>
        <p className="dash-sub">Earn points with every purchase</p>
      </div>

      <div className="dash-loyalty-hero">
        <div className="dash-loyalty-level">
          <span style={{ fontSize: 48 }}>{prevLevel.icon}</span>
          <div>
            <h2 style={{ color: prevLevel.color }}>{prevLevel.name} Member</h2>
            <p>{prevLevel.benefit}</p>
          </div>
        </div>
        <div className="dash-loyalty-points">
          <span className="dash-loyalty-num">{loyaltyPoints}</span>
          <span className="dash-loyalty-label">Points</span>
        </div>
      </div>

      <div className="dash-card" style={{ marginBottom: 24 }}>
        <div className="dash-card-header"><h3>Progress to {nextLevel.name}</h3></div>
        <div className="dash-progress-wrap" style={{ padding: "8px 0" }}>
          <div className="dash-progress-bar" style={{ height: 8 }}>
            <div className="dash-progress-fill" style={{ width: `${Math.min(progress, 100)}%`, background: `linear-gradient(90deg, ${prevLevel.color}, ${nextLevel.color})` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 6 }}>
            <span>{prevLevel.name} ({prevLevel.points} pts)</span>
            <span>{nextLevel.name} ({nextLevel.points} pts)</span>
          </div>
        </div>
      </div>

      <div className="dash-grid two">
        <div className="dash-card">
          <div className="dash-card-header"><h3>Redeem Points</h3></div>
          <div className="dash-redeem">
            <p style={{ color: "rgba(255,255,255,.5)", fontSize: 13, marginBottom: 12 }}>100 points = $1.00 discount</p>
            <div className="dash-form-row">
              <div className="dash-form-group" style={{ flex: 1 }}>
                <label>Points to Redeem</label>
                <input type="number" value={redeemAmount} onChange={e => setRedeemAmount(parseInt(e.target.value) || 0)} min={100} max={loyaltyPoints} />
              </div>
              <div className="dash-form-group">
                <label>You'll Get</label>
                <div style={{ padding: "10px 14px", background: "rgba(255,255,255,.03)", borderRadius: 8, fontSize: 16, fontWeight: 700, color: "#4ade80" }}>
                  ${(redeemAmount / 100).toFixed(2)}
                </div>
              </div>
            </div>
            <button className="dash-btn primary" onClick={() => redeemPoints(redeemAmount)} disabled={redeemAmount < 100 || redeemAmount > loyaltyPoints}>
              Redeem Points
            </button>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-header"><h3>Refer a Friend</h3></div>
          <p style={{ color: "rgba(255,255,255,.5)", fontSize: 13, marginBottom: 12 }}>Share your referral code and earn 200 points when they make their first purchase!</p>
          <div className="dash-referral-box">
            <code className="dash-ref-code">{referralCode}</code>
            <button className="dash-btn sm" onClick={handleCopy}>{copied ? "✓ Copied!" : "Copy Code"}</button>
          </div>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-card-header"><h3>Membership Levels</h3></div>
        <div className="dash-levels-grid">
          {levels.map(l => (
            <div key={l.name} className={`dash-level-card ${l.name === prevLevel.name ? "current" : ""}`} style={{ borderColor: l.color }}>
              <span style={{ fontSize: 32 }}>{l.icon}</span>
              <h3 style={{ color: l.color }}>{l.name}</h3>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>{l.points} points required</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,.7)", marginTop: 8 }}>{l.benefit}</p>
              {l.name === prevLevel.name && <span className="dash-current-badge">Current</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
