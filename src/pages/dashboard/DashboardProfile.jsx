import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";

export default function DashboardProfile() {
  const { user } = useAuth();
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useDashboard();
  const [editing, setEditing] = useState(false);
  const [passForm, setPassForm] = useState(false);
  const [addrForm, setAddrForm] = useState(false);
  const [addrData, setAddrData] = useState({ label: "", street: "", city: "", state: "", zip: "", country: "Nigeria" });
  const [profile, setProfile] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [saved, setSaved] = useState(false);

  const handleProfileSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setEditing(false);
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setPassForm(false);
    setPasswords({ current: "", newPass: "", confirm: "" });
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    addAddress({ ...addrData, id: Date.now(), default: addresses.length === 0 });
    setAddrData({ label: "", street: "", city: "", state: "", zip: "", country: "Nigeria" });
    setAddrForm(false);
  };

  return (
    <div className="dash-page">
      <div className="dash-header">
        <h1>My Profile</h1>
        <p className="dash-sub">Manage your personal information and addresses</p>
      </div>
      {saved && <div className="dash-toast">✓ Changes saved successfully!</div>}

      <div className="dash-grid two">
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>Personal Information</h3>
            <button className="dash-btn-sm" onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit"}</button>
          </div>
          <form onSubmit={handleProfileSave}>
            <div className="dash-form-group">
              <label>Full Name</label>
              <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} disabled={!editing} />
            </div>
            <div className="dash-form-group">
              <label>Email</label>
              <input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} disabled={!editing} />
            </div>
            <div className="dash-form-group">
              <label>Phone</label>
              <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} disabled={!editing} />
            </div>
            <div className="dash-form-group">
              <label>Avatar URL</label>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <img src={user?.avatar} alt="" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
                <input value={user?.avatar || ""} disabled={!editing} style={{ flex: 1 }} />
              </div>
            </div>
            {editing && <button type="submit" className="dash-btn primary">Save Changes</button>}
          </form>
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <h3>Change Password</h3>
            <button className="dash-btn-sm" onClick={() => setPassForm(!passForm)}>{passForm ? "Cancel" : "Change"}</button>
          </div>
          {passForm && (
            <form onSubmit={handlePasswordSave}>
              <div className="dash-form-group">
                <label>Current Password</label>
                <input type="password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} required />
              </div>
              <div className="dash-form-group">
                <label>New Password</label>
                <input type="password" value={passwords.newPass} onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))} required />
              </div>
              <div className="dash-form-group">
                <label>Confirm New Password</label>
                <input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} required />
              </div>
              <button type="submit" className="dash-btn primary">Update Password</button>
            </form>
          )}
        </div>
      </div>

      <div className="dash-card" style={{ marginTop: 24 }}>
        <div className="dash-card-header">
          <h3>Delivery Addresses</h3>
          <button className="dash-btn-sm" onClick={() => setAddrForm(!addrForm)}>{addrForm ? "Cancel" : "+ Add Address"}</button>
        </div>
        {addrForm && (
          <form onSubmit={handleAddAddress} className="dash-addr-form">
            <div className="dash-form-row">
              <div className="dash-form-group">
                <label>Label</label>
                <input value={addrData.label} onChange={e => setAddrData(p => ({ ...p, label: e.target.value }))} placeholder="Home / Office" required />
              </div>
              <div className="dash-form-group">
                <label>Street</label>
                <input value={addrData.street} onChange={e => setAddrData(p => ({ ...p, street: e.target.value }))} required />
              </div>
            </div>
            <div className="dash-form-row">
              <div className="dash-form-group">
                <label>City</label>
                <input value={addrData.city} onChange={e => setAddrData(p => ({ ...p, city: e.target.value }))} required />
              </div>
              <div className="dash-form-group">
                <label>State</label>
                <input value={addrData.state} onChange={e => setAddrData(p => ({ ...p, state: e.target.value }))} />
              </div>
            </div>
            <div className="dash-form-row">
              <div className="dash-form-group">
                <label>ZIP Code</label>
                <input value={addrData.zip} onChange={e => setAddrData(p => ({ ...p, zip: e.target.value }))} />
              </div>
              <div className="dash-form-group">
                <label>Country</label>
                <input value={addrData.country} onChange={e => setAddrData(p => ({ ...p, country: e.target.value }))} />
              </div>
            </div>
            <button type="submit" className="dash-btn primary">Add Address</button>
          </form>
        )}
        <div className="dash-addr-list">
          {addresses.map(a => (
            <div key={a.id} className={`dash-addr-item ${a.default ? "default" : ""}`}>
              <div className="dash-addr-info">
                <strong>{a.label}</strong>
                <p>{a.street}, {a.city}, {a.state} {a.zip}, {a.country}</p>
              </div>
              <div className="dash-addr-actions">
                {!a.default && <button className="dash-btn-tiny" onClick={() => setDefaultAddress(a.id)}>Set Default</button>}
                {a.default && <span className="dash-default-badge">Default</span>}
                <button className="dash-btn-tiny danger" onClick={() => deleteAddress(a.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
