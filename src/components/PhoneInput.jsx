import { useState, useRef, useEffect } from "react";
import { countryCodes, getDialByCode } from "../data/countryCodes";

const codeToFlag = (code) =>
  String.fromCodePoint(...code.split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

export default function PhoneInput({ value = "", onChange, required, defaultCode = "NG" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [code, setCode] = useState(defaultCode);
  const [number, setNumber] = useState(value);
  const ref = useRef(null);
  const inputRef = useRef(null);
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      if (onChange) onChange({ code: defaultCode, dial: getDialByCode(defaultCode), number: "" });
    }
  }, []);

  const selected = countryCodes.find((c) => c.code === code);
  const filtered = query
    ? countryCodes.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.dial.includes(query) ||
          c.code.toLowerCase().includes(query)
      )
    : countryCodes;

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    document.addEventListener("touchstart", handle);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("touchstart", handle);
    };
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
      setQuery("");
    }
  }, [open]);

  const select = (c) => {
    setCode(c.code);
    setOpen(false);
    setQuery("");
    if (onChange) onChange({ code: c.code, dial: c.dial, number });
  };

  const handleNumberChange = (e) => {
    const val = e.target.value.replace(/[^0-9\s-]/g, "");
    setNumber(val);
    if (onChange) onChange({ code, dial: getDialByCode(code), number: val });
  };

  return (
    <div style={{ display: "flex", gap: 8, position: "relative" }}>
      <div ref={ref} style={{ position: "relative", width: 160, flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          style={{
            width: "100%",
            padding: "10px 8px",
            borderRadius: 8,
            border: "1px solid var(--gray-200)",
            fontSize: 13,
            background: "#fff",
            color: "var(--gray-700)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {selected && (
            <>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{codeToFlag(selected.code)}</span>
              <span>{selected.dial}</span>
            </>
          )}
          <span style={{ marginLeft: "auto", fontSize: 10 }}>{open ? "▲" : "▼"}</span>
        </button>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 999,
              marginTop: 4,
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: 8,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              maxHeight: 280,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country..."
              style={{
                margin: 8,
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid #ddd",
                fontSize: 13,
                flexShrink: 0,
              }}
            />
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.length === 0 ? (
                <div style={{ padding: "12px 16px", color: "#999", fontSize: 13, textAlign: "center" }}>
                  No countries found
                </div>
              ) : (
                filtered.map((c) => (
                  <button
                    type="button"
                    key={c.code}
                    onClick={() => select(c)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      padding: "8px 12px",
                      border: "none",
                      background: c.code === code ? "#f3e8ff" : "transparent",
                      fontSize: 13,
                      textAlign: "left",
                      cursor: "pointer",
                      color: "var(--gray-700)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = c.code === code ? "#f3e8ff" : "transparent")
                    }
                  >
                    <span style={{ fontSize: 18, lineHeight: 1 }}>{codeToFlag(c.code)}</span>
                    <span style={{ color: "#888", minWidth: 50 }}>{c.dial}</span>
                    <span>{c.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

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
