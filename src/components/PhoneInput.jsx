import { useState } from "react";
import { countryCodes, getDialByCode } from "../data/countryCodes";

export default function PhoneInput({ value = "", onChange, required, defaultCode = "NG" }) {
  const [code, setCode] = useState(defaultCode);
  const [number, setNumber] = useState(value);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (onChange) onChange({ code: newCode, dial: getDialByCode(newCode), number });
  };

  const handleNumberChange = (e) => {
    const val = e.target.value.replace(/[^0-9\s-]/g, "");
    setNumber(val);
    if (onChange) onChange({ code, dial: getDialByCode(code), number: val });
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <select
        value={code}
        onChange={handleCodeChange}
        required={required}
        style={{ width: 140, flexShrink: 0, padding: "10px 12px", borderRadius: 8, border: "1px solid var(--gray-200)", fontSize: 13, background: "#fff", color: "var(--gray-700)" }}
      >
        {countryCodes.map(c => (
          <option key={c.code} value={c.code}>{c.dial} {c.name}</option>
        ))}
      </select>
      <input
        type="tel"
        value={number}
        onChange={handleNumberChange}
        required={required}
        style={{ flex: 1 }}
      />
    </div>
  );
}
