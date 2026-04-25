import { useState, useEffect, useRef } from "react";

const FIREBASE_URL = "https://huamei-pos-default-rtdb.asia-southeast1.firebasedatabase.app";

const DEFAULT_ADMIN_PASSWORD = "HuaMei2026";

const SAMPLE_PRODUCTS = [];

function useStorage(key, defaultVal) {
  const [val, setVal] = useState(defaultVal);
  const [loaded, setLoaded] = useState(false);
  const dbKey = key.replace(/[:.]/g, "_");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`${FIREBASE_URL}/${dbKey}.json`, { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) {
          setVal(data !== null && data !== undefined ? data : defaultVal);
          setLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setVal(defaultVal);
          setLoaded(true);
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [dbKey]);

  const save = async (v) => {
    setVal(v);
    try {
      const res = await fetch(`${FIREBASE_URL}/${dbKey}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v)
      });
      if (!res.ok) throw new Error("Save failed");
    } catch (e) {
      console.error("Firebase error:", e);
    }
  };

  return [val, save, loaded];
}

// ─── Icon Components ───────────────────────────────────────────────────────────
const IconCart = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const IconTrash = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IconPackage = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconOrders = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);
const IconPlus = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconUpload = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);
const IconCheck = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconEdit = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

// ─── Image Placeholder ─────────────────────────────────────────────────────────
const GlassesPlaceholder = ({ name }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #e8f4f8 0%, #d1e8f0 100%)", gap: 8 }}>
    <svg width="64" height="32" viewBox="0 0 80 40" fill="none">
      <rect x="2" y="10" width="28" height="18" rx="9" stroke="#94b8c8" strokeWidth="2.5" fill="white" fillOpacity="0.5"/>
      <rect x="50" y="10" width="28" height="18" rx="9" stroke="#94b8c8" strokeWidth="2.5" fill="white" fillOpacity="0.5"/>
      <line x1="30" y1="19" x2="50" y2="19" stroke="#94b8c8" strokeWidth="2.5"/>
      <line x1="2" y1="19" x2="0" y2="24" stroke="#94b8c8" strokeWidth="2"/>
      <line x1="78" y1="19" x2="80" y2="24" stroke="#94b8c8" strokeWidth="2"/>
    </svg>
    <span style={{ fontSize: 11, color: "#94b8c8", fontWeight: 500 }}>{name}</span>
  </div>
);

// ─── EMPLOYEE VIEW ─────────────────────────────────────────────────────────────
function EmployeeView({ products, onOrder }) {
  const [cart, setCartState] = useState(() => {
    try { const s = sessionStorage.getItem("glasses:cart"); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const setCart = (v) => {
    const next = typeof v === "function" ? v(cart) : v;
    setCartState(next);
    try { sessionStorage.setItem("glasses:cart", JSON.stringify(next)); } catch {}
  };
  const [page, setPage] = useState("shop");
  const [form, setForm] = useState({ name: "", employeeId: "" });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerExpired, setTimerExpired] = useState(false);
  const timerRef = useRef(null);

  // 購物車有商品時啟動倒數
  useEffect(() => {
    if (cart.length > 0 && timeLeft === null) {
      setTimeLeft(600); // 10分鐘
    }
    if (cart.length === 0) {
      setTimeLeft(null);
      clearInterval(timerRef.current);
    }
  }, [cart]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      setCart([]);
      setTimeLeft(null);
      setPage("shop");
      setTimerExpired(true);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const addToCart = (p) => {
    if (p.stock <= 0) return;
    setCart(prev => {
      const ex = prev.find(c => c.id === p.id);
      if (ex) {
        if (ex.qty >= p.stock) return prev; // 不超過庫存
        return prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...p, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cart.reduce((s, c) => s + c.qty * c.price, 0);

  const [submitting, setSubmitting] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  const submitOrder = () => {
    if (!form.name.trim() || !form.employeeId.trim()) return;
    if (submitting) return;
    setSubmitting(true);
    const orderData = { items: cart, ...form, total: cartTotal, date: new Date().toLocaleString("zh-TW") };
    const orderNo = onOrder(orderData);
    setLastOrder({ ...orderData, orderNo });
    setCart([]);
    setForm({ name: "", employeeId: "" });
    setPage("done");
    setSubmitting(false);
  };

  // 即時剩餘庫存 = 實際庫存 - 購物車中的數量
  const getAvailableStock = (p) => {
    const inCart = cart.find(c => c.id === p.id);
    return p.stock - (inCart ? inCart.qty : 0);
  };

  const [category, setCategory] = useState("adult"); // adult | kids

  const inStock = products.filter(p => getAvailableStock(p) > 0 || cart.find(c => c.id === p.id));

  if (page === "done") return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, animation: "fadeInUp 0.5s ease" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn { 0% { transform:scale(0); } 60% { transform:scale(1.2); } 100% { transform:scale(1); } }
        @keyframes confetti { 0% { transform:translateY(0) rotate(0); opacity:1; } 100% { transform:translateY(-60px) rotate(360deg); opacity:0; } }
      `}</style>
      <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg, #4CAF50, #81C784)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(76,175,80,0.4)", animation: "popIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275)" }}>
        <IconCheck />
      </div>
      <div style={{ fontSize: 32, animation: "confetti 1s ease 0.3s both" }}>🎉</div>
      <h2 style={{ fontSize: 24, fontWeight: 900, color: "#1a2b3c", margin: 0 }}>訂單已送出！</h2>

      {/* 訂單明細卡片 */}
      <div style={{ background: "white", borderRadius: 20, padding: "22px 24px", width: "100%", maxWidth: 400, boxShadow: "0 4px 24px rgba(0,0,0,0.12)", border: "2px solid #e8f5e9" }}>

        {/* 訂單編號 - 超大顯示 */}
        <div style={{ textAlign: "center", marginBottom: 16, background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 12, color: "#78909c", marginBottom: 6, letterSpacing: 1.5, fontWeight: 600 }}>訂 單 編 號</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#1a2b3c", letterSpacing: 3, fontFamily: "monospace" }}>{lastOrder?.orderNo || "—"}</div>
          <div style={{ fontSize: 11, color: "#4CAF50", marginTop: 4, fontWeight: 600 }}>📸 請截圖保存此編號作為領取憑證</div>
        </div>

        <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#475569", marginBottom: 6 }}>
            <span style={{ color: "#78909c" }}>姓名</span><span style={{ fontWeight: 700, color: "#1a2b3c" }}>{lastOrder?.name}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#475569" }}>
            <span style={{ color: "#78909c" }}>工號</span><span style={{ fontWeight: 700, color: "#1a2b3c" }}>{lastOrder?.employeeId}</span>
          </div>
        </div>

        <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: 12, marginBottom: 12 }}>
          {lastOrder?.items?.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#475569", padding: "4px 0" }}>
              <span>{item.name} × {item.qty}</span><span style={{ fontWeight: 600 }}>${item.price * item.qty}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid #e2e8f0", fontWeight: 900, color: "#e53935", fontSize: 20 }}>
            <span>總計</span><span>${lastOrder?.total}</span>
          </div>
        </div>

        <div style={{ background: "#fff8e1", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#795548", lineHeight: 1.8, borderLeft: "3px solid #FFC107" }}>
          商品備齊後將主動通知您領取時間與地點，屆時請備妥現金付款，謝謝！
        </div>
      </div>
      <button onClick={() => setPage("shop")} style={{ ...btnStyle("#2196F3"), marginTop: 4, padding: "12px 32px", fontSize: 15 }}>繼續瀏覽</button>
    </div>
  );

  return (
    <div>
      {timerExpired && (
        <div style={{ background: "#ffebee", border: "1.5px solid #ef9a9a", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>⏰</span>
          <div style={{ flex: 1, fontSize: 13, color: "#b71c1c", fontWeight: 600 }}>購物時間已到，購物車已自動清空，請重新選購！</div>
          <button onClick={() => setTimerExpired(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#b71c1c", fontSize: 18 }}>✕</button>
        </div>
      )}

      {/* 倒數計時提示 */}
      {timeLeft !== null && (
        <div style={{ background: timeLeft <= 60 ? "#ffebee" : "#fff8e1", border: `1.5px solid ${timeLeft <= 60 ? "#ef9a9a" : "#ffe082"}`, borderRadius: 12, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{timeLeft <= 60 ? "🚨" : "⏰"}</span>
          <div style={{ flex: 1, fontSize: 13, color: "#5d4037" }}>
            <strong>結帳倒數：{formatTime(timeLeft)}</strong>
            <span style={{ color: "#8d6e63", marginLeft: 8 }}>— 時間到未結帳，將自動清空購物車並釋放庫存</span>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1a2b3c" }}>
            {page === "cart" ? "🛒 購物車" : page === "form" ? "📝 填寫資料" : ""}
          </h2>
        </div>
        {page !== "shop" && (
          <button onClick={() => setPage(page === "cart" ? "shop" : "cart")} style={{ ...btnStyle("#6b7f8e", true), fontSize: 13 }}>← 返回</button>
        )}
      </div>

      {/* Shop */}
      {page === "shop" && (
        <div>
          {/* Category Tabs */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {[["adult", "成人款式", "#1565C0", "#e3f2fd"], ["kids", "兒童款式", "#c62828", "#fce4ec"]].map(([key, label, activeColor, activeBg]) => (
              <button key={key} onClick={() => setCategory(key)} style={{ flex: 1, padding: "14px 0", borderRadius: 12, border: `3px solid ${category === key ? activeColor : "#dee2e6"}`, cursor: "pointer", fontWeight: 900, fontSize: 17, transition: "all 0.2s", background: category === key ? activeColor : "#f8f9fa", color: category === key ? "white" : "#adb5bd", boxShadow: category === key ? `0 4px 14px ${activeColor}55` : "none", letterSpacing: "1px" }}>
                {label}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
            {products.filter(p => (p.category || "adult") === category).length === 0 && (
              <p style={{ color: "#94a3b8", gridColumn: "1/-1", textAlign: "center", padding: 40 }}>此分類目前無商品</p>
            )}
            {products.filter(p => (p.category || "adult") === category).map(p => {
              const inCart = cart.find(c => c.id === p.id);
              const availableStock = getAvailableStock(p);
              const isLow = availableStock > 0 && availableStock <= 3;
              return (
                <div key={p.id} style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", transition: "transform 0.2s, box-shadow 0.2s", cursor: p.stock <= 0 ? "default" : "pointer", filter: p.stock <= 0 ? "grayscale(40%)" : "none", opacity: p.stock <= 0 ? 0.9 : 1, border: isLow ? "2px solid #ff7043" : "2px solid transparent" }}
                  onMouseEnter={e => { if(p.stock > 0) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.14)"; }}}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"; }}>
                  <div style={{ height: 140, overflow: "hidden", position: "relative" }} onClick={() => setSelectedProduct(p)}>
                    <div style={{ position: "absolute", top: 8, left: 8, zIndex: 2, background: "rgba(26,43,60,0.75)", color: "white", fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 20, backdropFilter: "blur(4px)" }}>No.{String(products.filter(x => (x.category || "adult") === category).indexOf(p) + 1).padStart(2, "0")}</div>
                    {p.image
                      ? <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <GlassesPlaceholder name={p.name} />}
                    {p.stock <= 0 && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(180,180,180,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ border: "4px solid #c62828", borderRadius: 8, padding: "6px 14px", transform: "rotate(-20deg)", background: "rgba(255,255,255,0.7)", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                          <span style={{ color: "#c62828", fontWeight: 900, fontSize: 22, letterSpacing: 3, fontFamily: "monospace", display: "block", lineHeight: 1 }}>已售完</span>
                        </div>
                      </div>
                    )}
                    {isLow && (
                      <div style={{ position: "absolute", top: 8, right: 8, background: "#ff7043", color: "white", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>即將售完</div>
                    )}
                  </div>
                  <div style={{ padding: "12px 14px 14px" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#1a2b3c", marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>{p.description || ""}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 800, color: "#e53935", fontSize: 16 }}>${p.price}</span>
                      <span style={{ fontSize: 11, fontWeight: isLow ? 700 : 400, color: isLow ? "#ff7043" : "#78909c" }}>剩 {availableStock} 件{isLow ? " ⚠️" : ""}</span>
                    </div>
                    {p.stock > 0 && (
                      inCart ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
                          <button onClick={() => { if (inCart.qty <= 1) removeFromCart(p.id); else setCart(prev => prev.map(c => c.id === p.id ? { ...c, qty: c.qty - 1 } : c)); }}
                            style={{ background: "none", border: "none", fontSize: 20, fontWeight: 700, color: "#e53935", cursor: "pointer", padding: "6px 14px", lineHeight: 1 }}>−</button>
                          <span style={{ fontWeight: 700, color: "#1a2b3c", fontSize: 15 }}>{inCart.qty}</span>
                          <button onClick={() => { if (availableStock > 0) setCart(prev => prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c)); }}
                            style={{ background: "none", border: "none", fontSize: 20, fontWeight: 700, color: availableStock <= 0 ? "#ccc" : "#2196F3", cursor: availableStock <= 0 ? "not-allowed" : "pointer", padding: "6px 14px", lineHeight: 1 }}>＋</button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(p)} style={{ ...btnStyle("#2196F3"), width: "100%", marginTop: 10, fontSize: 13, padding: "7px 0" }}>加入購物車</button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cart */}
      {page === "cart" && (
        <div>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
              <p>購物車是空的，快去挑選吧！</p>
              <button onClick={() => setPage("shop")} style={btnStyle("#2196F3")}>去逛逛</button>
            </div>
          ) : (
            <div>
              {cart.map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, background: "white", borderRadius: 14, padding: "12px 16px", marginBottom: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ width: 60, height: 60, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <GlassesPlaceholder name="" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#1a2b3c" }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: "#94a3b8" }}>${item.price} × {item.qty}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: "#e53935", marginRight: 8 }}>${item.price * item.qty}</div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef5350", padding: 4 }}><IconTrash /></button>
                </div>
              ))}
              <div style={{ background: "linear-gradient(135deg, #1a2b3c, #2d4a6b)", borderRadius: 16, padding: "18px 20px", marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "white", fontWeight: 600 }}>合計</span>
                <span style={{ color: "white", fontSize: 24, fontWeight: 800 }}>${cartTotal}</span>
              </div>
              <button onClick={() => setPage("form")} style={{ ...btnStyle("#e53935"), width: "100%", marginTop: 14, padding: "14px 0", fontSize: 16 }}>前往填寫資料 →</button>
            </div>
          )}
        </div>
      )}

      {/* Form */}
      {page === "form" && (
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <h3 style={{ margin: "0 0 20px", color: "#1a2b3c", fontSize: 18 }}>填寫員工資訊</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#455a64", marginBottom: 6 }}>姓名 *</label>
              <input
                value={form.name}
                onChange={e => setForm(v => ({ ...v, name: e.target.value }))}
                placeholder="請輸入您的姓名"
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "#2196F3"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#455a64", marginBottom: 6 }}>工號 * <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>(8碼數字)</span></label>
              <input
                value={form.employeeId}
                onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 8); setForm(f => ({ ...f, employeeId: v })); }}
                placeholder="請輸入8碼員工工號"
                inputMode="numeric"
                maxLength={8}
                style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${form.employeeId.length > 0 && form.employeeId.length < 8 ? "#ff7043" : "#e2e8f0"}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", letterSpacing: "2px" }}
                onFocus={e => e.target.style.borderColor = "#2196F3"}
                onBlur={e => e.target.style.borderColor = form.employeeId.length > 0 && form.employeeId.length < 8 ? "#ff7043" : "#e2e8f0"}
              />
              {form.employeeId.length > 0 && form.employeeId.length < 8 && (
                <div style={{ fontSize: 11, color: "#ff7043", marginTop: 4 }}>⚠️ 工號需為8碼，目前已輸入 {form.employeeId.length} 碼</div>
              )}
            </div>
            <div style={{ background: "#f8fafc", borderRadius: 12, padding: "12px 14px", marginTop: 4, marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>訂單明細：</div>
              {cart.map(c => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#475569", padding: "2px 0" }}>
                  <span>{c.name} × {c.qty}</span><span>${c.price * c.qty}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #e2e8f0", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#1a2b3c" }}>
                <span>總計</span><span>${cartTotal}</span>
              </div>
              <div style={{ marginTop: 12, padding: "10px 12px", background: "#fff8e1", borderRadius: 8, fontSize: 12, color: "#795548", lineHeight: 1.7 }}>
                🙏 感謝您的購買！商品備齊後，我們將主動通知您領取時間與地點，屆時請以現金付款，謝謝您的配合。
              </div>
              <div style={{ marginTop: 8, padding: "10px 12px", background: "#fff3e0", borderRadius: 8, fontSize: 12, color: "#bf360c", lineHeight: 1.7, borderLeft: "3px solid #FF6D00" }}>
                📌 本次活動為員工內部特賣出清，商品均以優惠價提供，售出後恕不提供保固、退換貨服務，敬請於購買前確認款式，謝謝您的理解與配合。
              </div>
            </div>
            <button
              onClick={submitOrder}
              disabled={!form.name.trim() || form.employeeId.length !== 8 || submitting}
              style={{ ...btnStyle("#e53935"), width: "100%", padding: "14px 0", fontSize: 16, opacity: (!form.name.trim() || form.employeeId.length !== 8 || submitting) ? 0.5 : 1, cursor: (!form.name.trim() || form.employeeId.length !== 8 || submitting) ? "not-allowed" : "pointer" }}>
              {submitting ? "送出中..." : "確認送出訂單"}
            </button>
          </div>
        </div>
      )}

      {/* 浮動結帳按鈕 */}
      {page === "shop" && cartCount > 0 && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 500 }}>
          <style>{`@keyframes floatUp { from { opacity:0; transform: translateX(-50%) translateY(20px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }`}</style>
          <button onClick={() => setPage("cart")} style={{ background: "linear-gradient(135deg, #1a2b3c, #2d4a6b)", color: "white", border: "none", borderRadius: 50, padding: "15px 32px", fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 28px rgba(26,43,60,0.45)", display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap", animation: "floatUp 0.3s ease" }}>
            <IconCart />
            <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "2px 10px", fontSize: 14, fontWeight: 900 }}>{cartCount} 件</span>
            <span style={{ fontWeight: 700, color: "#90caf9" }}>${cartTotal}</span>
            <span>前往結帳 →</span>
          </button>
        </div>
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}
          onClick={() => setSelectedProduct(null)}>
          <div style={{ background: "white", borderRadius: 20, maxWidth: 360, width: "100%", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ height: 220, overflow: "hidden" }}>
              {selectedProduct.image
                ? <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <GlassesPlaceholder name={selectedProduct.name} />}
            </div>
            <div style={{ padding: 24 }}>
              <h3 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800, color: "#1a2b3c" }}>{selectedProduct.name}</h3>
              <p style={{ margin: "0 0 16px", color: "#64748b", fontSize: 14 }}>{selectedProduct.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#e53935" }}>${selectedProduct.price}</span>
                <span style={{ color: "#78909c", fontSize: 14 }}>庫存：{selectedProduct.stock} 件</span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setSelectedProduct(null)} style={{ ...btnStyle("#78909c", true), flex: 1 }}>關閉</button>
                {selectedProduct.stock > 0 && (
                  <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} style={{ ...btnStyle("#2196F3"), flex: 2 }}>加入購物車</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN VIEW ────────────────────────────────────────────────────────────────
function AdminView({ products, setProducts, orders, setOrders, adminPwd, setAdminPwd, archiveOrder, archivedOrders }) {
  const [tab, setTab] = useState("orders");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: 100, stock: 1, image: null });
  const [showPwdChange, setShowPwdChange] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [archiveModal, setArchiveModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [orderFilter, setOrderFilter] = useState("全部");
  const fileRef = useRef();
  const editFileRef = useRef();

  const savePwd = () => {
    if (newPwd.length < 6) { setPwdMsg("密碼至少需要 6 個字元"); return; }
    if (newPwd !== confirmPwd) { setPwdMsg("兩次密碼不一致"); return; }
    setAdminPwd(newPwd);
    setNewPwd(""); setConfirmPwd("");
    setPwdMsg("✅ 密碼已更新！");
    setTimeout(() => { setPwdMsg(""); setShowPwdChange(false); }, 2000);
  };

  const handleImageUpload = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (isEdit) setEditingProduct(p => ({ ...p, image: ev.target.result }));
      else setNewProduct(p => ({ ...p, image: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const addProduct = () => {
    if (!newProduct.name.trim()) return;
    const p = { ...newProduct, id: Date.now(), price: Number(newProduct.price), stock: Number(newProduct.stock) };
    setProducts([...products, p]);
    setNewProduct({ name: "", description: "", price: 100, stock: 1, image: null });
    setShowAddForm(false);
  };

  const saveEdit = () => {
    setProducts(products.map(p => p.id === editingProduct.id ? { ...editingProduct, price: Number(editingProduct.price), stock: Number(editingProduct.stock) } : p));
    setEditingProduct(null);
  };

  const deleteProduct = (id) => {
    setConfirmModal({
      title: "確定刪除此商品？",
      message: "刪除後無法復原，請確認。",
      onConfirm: () => {
        setProducts(products.filter(p => p.id !== id));
        setConfirmModal(null);
      }
    });
  };

  const updateOrderStatus = (idx, status) => {
    const order = orders[idx];
    const prevStatus = order.status || "待處理";

    // 選擇「刪除此筆訂單」→ 觸發封存彈窗
    if (status === "🗑 刪除此筆訂單") {
      setArchiveModal({ idx, inputId: "", error: "" });
      return;
    }

    // 已取消 → 先確認，再退庫存
    if (status === "已取消" && prevStatus !== "已取消") {
      const itemList = order.items.map(i => `${i.name} × ${i.qty}`).join("、");
      setConfirmModal({
        title: "確定取消此筆訂單？",
        message: `以下商品庫存將自動退回：\n${itemList}`,
        onConfirm: () => {
          const updatedProducts = products.map(p => {
            const orderItem = order.items.find(item => item.id === p.id);
            if (orderItem) return { ...p, stock: p.stock + orderItem.qty };
            return p;
          });
          setProducts(updatedProducts);
          const updated = [...orders];
          updated[idx] = { ...updated[idx], status };
          setOrders(updated);
          setConfirmModal(null);
        }
      });
      return;
    }

    // 從已取消改回其他狀態 → 再次扣庫存
    if (prevStatus === "已取消" && status !== "已取消") {
      const insufficient = order.items.filter(item => {
        const p = products.find(p => p.id === item.id);
        return !p || p.stock < item.qty;
      });
      if (insufficient.length > 0) {
        alert(`⚠️ 庫存不足，無法恢復此訂單：\n${insufficient.map(i => i.name).join("、")}`);
        return;
      }
      const updatedProducts = products.map(p => {
        const orderItem = order.items.find(item => item.id === p.id);
        if (orderItem) return { ...p, stock: Math.max(0, p.stock - orderItem.qty) };
        return p;
      });
      setProducts(updatedProducts);
    }

    const updated = [...orders];
    updated[idx] = { ...updated[idx], status };
    setOrders(updated);
  };

  const statusColor = {
    "待處理": "#FF9800",
    "備貨中": "#2196F3",
    "已取消": "#ef5350",
    "已完成訂單": "#4CAF50",
    "🗑 刪除此筆訂單": "#455a64"
  };

  const statusBg = {
    "待處理": "#fff8e1",
    "備貨中": "#e3f2fd",
    "已取消": "#ffebee",
    "已完成訂單": "#e8f5e9",
    "🗑 刪除此筆訂單": "#eceff1"
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1a2b3c" }}>🔧 管理後台</h2>
        <button onClick={() => setShowPwdChange(!showPwdChange)} style={{ ...btnStyle("#78909c", true), fontSize: 12, padding: "6px 12px" }}>🔑 修改密碼</button>
      </div>

      {showPwdChange && (
        <div style={{ background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 18, border: "1.5px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h4 style={{ margin: "0 0 12px", color: "#1a2b3c", fontSize: 15 }}>修改管理員密碼</h4>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4 }}>新密碼（至少6碼）</label>
              <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="輸入新密碼"
                style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4 }}>確認新密碼</label>
              <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="再輸入一次"
                style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <button onClick={savePwd} style={{ ...btnStyle("#4CAF50"), padding: "8px 16px", fontSize: 13 }}>儲存</button>
          </div>
          {pwdMsg && <div style={{ marginTop: 8, fontSize: 13, color: pwdMsg.startsWith("✅") ? "#4CAF50" : "#e53935" }}>{pwdMsg}</div>}
        </div>
      )}

      {/* 儀表板 */}
      {(() => {
        const total = orders.length;
        const pending = orders.filter(o => (o.status || "待處理") === "待處理").length;
        const inProgress = orders.filter(o => o.status === "備貨中").length;
        const done = orders.filter(o => o.status === "已完成訂單").length;
        const cancelled = orders.filter(o => o.status === "已取消").length;
        const revenue = orders.filter(o => o.status !== "已取消").reduce((s, o) => s + o.total, 0);
        const lowStock = products.filter(p => p.stock > 0 && p.stock <= 3);
        return (
          <div style={{ background: "linear-gradient(135deg, #0f1f2e 0%, #1a2f45 50%, #0d1e2c 100%)", borderRadius: 20, padding: "16px 18px", marginBottom: 20, boxShadow: "0 8px 28px rgba(0,0,0,0.25)" }}>
            {/* 標題列 + 總營收同一行 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>📊</span>
                <span style={{ color: "#90CAF9", fontSize: 14, fontWeight: 800, letterSpacing: 2 }}>營運總覽</span>
                <span style={{ color: "#ffffff", fontSize: 12, marginLeft: 4, opacity: 0.7 }}>共 {total} 筆</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#ffffff", fontSize: 11, letterSpacing: 1, opacity: 0.7 }}>總營收</div>
                <div style={{ fontSize: 30, fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1 }}>${revenue.toLocaleString()}</div>
              </div>
            </div>

            {/* 4個狀態 - 一排顯示 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[
                { label: "待處理", value: pending, color: "#FFD54F", bg: "rgba(255,213,79,0.12)", border: "rgba(255,213,79,0.3)", icon: "⏳" },
                { label: "備貨中", value: inProgress, color: "#4DD0E1", bg: "rgba(77,208,225,0.12)", border: "rgba(77,208,225,0.3)", icon: "📦" },
                { label: "已完成", value: done, color: "#69F0AE", bg: "rgba(105,240,174,0.12)", border: "rgba(105,240,174,0.3)", icon: "✅" },
                { label: "已取消", value: cancelled, color: "#FF8A80", bg: "rgba(255,138,128,0.12)", border: "rgba(255,138,128,0.3)", icon: "❌" },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "12px 8px", border: `1.5px solid ${s.border}`, textAlign: "center" }}>
                  <div style={{ fontSize: 20 }}>{s.icon}</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: s.color, lineHeight: 1.1 }}>{s.value}</div>
                  <div style={{ color: "#B0BEC5", fontSize: 12, marginTop: 3, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* 庫存警示 */}
            {lowStock.length > 0 && (
              <div style={{ marginTop: 12, background: "rgba(255,112,67,0.1)", borderRadius: 12, padding: "10px 14px", border: "1.5px solid rgba(255,112,67,0.25)" }}>
                <div style={{ color: "#ff8a65", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>⚠️ 庫存警示 — 剩餘 ≤ 3 件</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {lowStock.map(p => (
                    <span key={p.id} style={{ background: "rgba(255,112,67,0.2)", color: "#ffccbc", fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>
                      {p.name} · 剩 {p.stock} 件
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {[
          ["orders",   <IconOrders />, "訂單管理",    "#ffffff", "#1565C0", "#1976D2"],
          ["top3",     "🏆",          "熱賣TOP3",    "#ffffff", "#E65100", "#F57F17"],
          ["archived", "🗑",          "刪除訂單紀錄","#ffffff", "#37474f", "#546e7a"],
          ["inventory",<IconPackage />,"商品管理",    "#ffffff", "#B71C1C", "#E53935"],
        ].map(([key, icon, label, textColor, bgColor, activeBg]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
            padding: "12px 4px", borderRadius: 12,
            border: `2.5px solid ${tab === key ? bgColor : bgColor + "88"}`,
            cursor: "pointer", fontWeight: 700, transition: "all 0.2s",
            background: tab === key ? bgColor : bgColor + "18",
            color: tab === key ? textColor : bgColor,
            boxShadow: tab === key ? `0 4px 14px ${bgColor}44` : "none",
            transform: tab === key ? "translateY(-2px)" : "none"
          }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{ fontSize: 12, fontWeight: 800, marginTop: 2 }}>{label}</span>
          </button>
        ))}
      </div>
      {tab === "orders" && (
        <div>
          {/* 篩選器 + 清空按鈕 同一行 */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#94a3b8", marginRight: 2 }}>篩選：</span>
              {["全部", "待處理", "備貨中", "已取消", "已完成訂單"].map(f => {
                const count = f === "全部" ? orders.length : orders.filter(o => (o.status || "待處理") === f).length;
                const isActive = orderFilter === f;
                const color = statusColor[f] || "#1a2b3c";
                return (
                  <button key={f} onClick={() => setOrderFilter(f)}
                    style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${isActive ? color : "#e2e8f0"}`, background: isActive ? color : "white", color: isActive ? "white" : "#94a3b8", fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all 0.15s" }}>
                    {f} · {count}
                  </button>
                );
              })}
            </div>
            {orders.length > 0 && (
              <button onClick={() => setConfirmModal({
                title: "確定清空所有訂單？",
                message: "此操作將清除所有訂單紀錄（不影響商品庫存），確定繼續？",
                onConfirm: () => { setOrders([]); setConfirmModal(null); }
              })} style={{ ...btnStyle("#ef5350", true), fontSize: 11, padding: "4px 10px", flexShrink: 0 }}>
                🗑 清空訂單
              </button>
            )}
          </div>
          {orders.length > 0 && (
            <button onClick={() => {
              const header = "訂單編號,日期,姓名,工號,商品,數量,總金額,狀態";
              const rows = orders.map(o =>
                o.items.map(item =>
                  `${o.orderNo || ""},${o.date},${o.name},${o.employeeId},${item.name},${item.qty},${o.total},${o.status || "待處理"}`
                ).join("\n")
              ).join("\n");
              const csv = "\uFEFF" + header + "\n" + rows;
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `華美光學訂單_${new Date().toLocaleDateString("zh-TW").replace(/\//g, "")}.csv`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }} style={{ ...btnStyle("#4CAF50"), display: "flex", alignItems: "center", gap: 6, marginBottom: 16, fontSize: 13 }}>
              📥 匯出 CSV（Excel）
            </button>
          )}
          {orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
              <p>目前還沒有訂單</p>
            </div>
          ) : (() => {
            const filtered = orders.map((o, i) => ({ ...o, _idx: i }))
              .filter(o => orderFilter === "全部" || (o.status || "待處理") === orderFilter)
              .reverse();
            if (filtered.length === 0) return (
              <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
                <p>此狀態目前沒有訂單</p>
              </div>
            );
            return filtered.map((order) => {
              const idx = order._idx;
              return (
                <div key={idx} style={{ background: "white", borderRadius: 16, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>訂單編號：{order.orderNo || "—"}</div>
                      <div style={{ fontWeight: 700, color: "#1a2b3c", fontSize: 15 }}>{order.name} <span style={{ color: "#78909c", fontWeight: 400, fontSize: 13 }}>工號：{order.employeeId}</span></div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>🕐 {order.date}</div>
                    </div>
                    <select value={order.status || "待處理"} onChange={e => updateOrderStatus(idx, e.target.value)}
                      style={{ padding: "8px 14px", borderRadius: 20, border: `2.5px solid ${statusColor[order.status || "待處理"]}`, color: statusColor[order.status || "待處理"], fontWeight: 800, fontSize: 14, cursor: "pointer", outline: "none", background: statusBg[order.status || "待處理"], minWidth: 130 }}>
                      {["待處理", "備貨中", "已取消", "已完成訂單", "🗑 刪除此筆訂單"].map(s => (
                        <option key={s} value={s} style={{ color: statusColor[s], background: statusBg[s], fontWeight: 600 }}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#475569", padding: "2px 0" }}>
                        <span>{item.name} × {item.qty}</span><span>${item.price * item.qty}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                      <div style={{ fontWeight: 800, color: "#e53935", fontSize: 16 }}>總計 ${order.total}</div>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}

      {/* Inventory Tab */}
      {tab === "inventory" && (
        <div>
          {/* 商品管理警示提示 */}
          <div style={{ background: "linear-gradient(135deg, #fff3e0, #fff8e1)", borderRadius: 14, padding: "12px 16px", marginBottom: 18, border: "2px solid #FFB300", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 800, color: "#E65100", fontSize: 14, marginBottom: 4 }}>商品管理注意事項</div>
              <div style={{ fontSize: 13, color: "#795548", lineHeight: 1.7 }}>
                此頁面僅供新增商品或補貨時調整庫存使用。<br/>
                若非特殊情況，請勿隨意修改庫存數量，以免影響實際銷售紀錄的準確性。
              </div>
            </div>
          </div>

          <button onClick={() => setShowAddForm(!showAddForm)} style={{ ...btnStyle("#2196F3"), display: "flex", alignItems: "center", gap: 6, marginBottom: 18 }}>
            <IconPlus /> 新增商品
          </button>

          {/* Add Form */}
          {showAddForm && (
            <div style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 18, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", border: "2px solid #e3f2fd" }}>
              <h4 style={{ margin: "0 0 16px", color: "#1a2b3c" }}>新增商品</h4>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>商品分類 *</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[["adult", "成人款式", "#1565C0", "#e3f2fd"], ["kids", "兒童款式", "#c62828", "#fce4ec"]].map(([val, lbl, activeColor, activeBg]) => (
                    <button key={val} onClick={() => setNewProduct(p => ({ ...p, category: val }))} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `2px solid ${(newProduct.category || "adult") === val ? activeColor : "#e2e8f0"}`, background: (newProduct.category || "adult") === val ? activeBg : "white", color: (newProduct.category || "adult") === val ? activeColor : "#94a3b8", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>{lbl}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                {[
                  { label: "商品名稱 *", key: "name", placeholder: "款式 A" },
                  { label: "說明", key: "description", placeholder: "經典黑框" },
                  { label: "價格", key: "price", placeholder: "100", type: "number" },
                  { label: "庫存", key: "stock", placeholder: "5", type: "number" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>{f.label}</label>
                    <input type={f.type || "text"} value={newProduct[f.key]} onChange={e => setNewProduct(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                      style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>商品圖片</label>
                <input type="file" accept="image/*" ref={fileRef} onChange={(e) => handleImageUpload(e)} style={{ display: "none" }} />
                <div onClick={() => fileRef.current.click()} style={{ border: "2px dashed #cbd5e1", borderRadius: 10, padding: 16, textAlign: "center", cursor: "pointer", background: newProduct.image ? "#f0fdf4" : "#f8fafc" }}>
                  {newProduct.image
                    ? <img src={newProduct.image} alt="preview" style={{ maxHeight: 80, maxWidth: "100%", borderRadius: 6 }} />
                    : <><IconUpload /><div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>點擊上傳圖片</div></>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setShowAddForm(false)} style={{ ...btnStyle("#78909c", true), flex: 1 }}>取消</button>
                <button onClick={addProduct} style={{ ...btnStyle("#2196F3"), flex: 2 }}>新增</button>
              </div>
            </div>
          )}

          {/* Product List with drag sorting */}
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>☰ 長按拖曳可調整商品順序</div>
          {products.map((p, index) => (
            <div key={p.id}
              draggable
              onDragStart={e => { e.dataTransfer.setData("dragIndex", index); }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                const from = parseInt(e.dataTransfer.getData("dragIndex"));
                const to = index;
                if (from === to) return;
                const newProducts = [...products];
                const [moved] = newProducts.splice(from, 1);
                newProducts.splice(to, 0, moved);
                setProducts(newProducts);
              }}
              style={{ background: "white", borderRadius: 14, padding: "12px 14px", marginBottom: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 14, cursor: "grab", userSelect: "none" }}>
              <div style={{ color: "#cbd5e1", fontSize: 18, flexShrink: 0 }}>⠿</div>
              <div style={{ width: 56, height: 56, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                {p.image ? <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <GlassesPlaceholder name="" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#1a2b3c", fontSize: 14 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{p.description}</div>
                <div style={{ display: "flex", gap: 10, marginTop: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#e53935" }}>${p.price}</span>
                  <span style={{ fontSize: 12, color: p.stock <= 3 ? "#ff7043" : "#78909c" }}>庫存 {p.stock}{p.stock <= 3 && p.stock > 0 ? " ⚠️" : ""}</span>
                  <span style={{ fontSize: 11, color: p.category === "kids" ? "#c62828" : "#1565C0", fontWeight: 600 }}>{p.category === "kids" ? "兒童" : "成人"}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setEditingProduct({ ...p })} style={{ ...btnStyle("#455a64", true), padding: "6px 10px", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}><IconEdit />編輯</button>
                <button onClick={() => deleteProduct(p.id)} style={{ ...btnStyle("#ef5350", true), padding: "6px 10px", fontSize: 12 }}>刪除</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TOP3 Tab */}
      {tab === "top3" && (() => {
        const salesMap = {};
        orders.forEach(o => {
          if (o.status === "已取消") return;
          (o.items || []).forEach(item => {
            salesMap[item.id] = (salesMap[item.id] || { name: item.name, qty: 0, image: item.image });
            salesMap[item.id].qty += item.qty;
          });
        });
        const top3 = Object.values(salesMap).sort((a, b) => b.qty - a.qty).slice(0, 3);
        const medals = ["🥇", "🥈", "🥉"];
        const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
        return (
          <div>
            <div style={{ background: "linear-gradient(135deg, #1a2b3c, #2d4a6b)", borderRadius: 16, padding: "16px 20px", marginBottom: 20, color: "white" }}>
              <div style={{ fontSize: 13, opacity: 0.8 }}>統計自所有已成立訂單（不含已取消）</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>🏆 熱賣商品 TOP 3</div>
            </div>
            {top3.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
                <p>目前還沒有訂單資料</p>
              </div>
            ) : (
              top3.map((item, i) => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 16, background: "white", borderRadius: 16, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `2px solid ${medalColors[i]}22` }}>
                  <div style={{ fontSize: 36, width: 44, textAlign: "center" }}>{medals[i]}</div>
                  <div style={{ width: 56, height: 56, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                    {item.image ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <GlassesPlaceholder name="" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#1a2b3c", fontSize: 15 }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: "#78909c", marginTop: 2 }}>累計銷售</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: medalColors[i] }}>{item.qty}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>件</div>
                  </div>
                  {/* Progress bar */}
                  <div style={{ position: "absolute" }} />
                </div>
              ))
            )}
            {top3.length > 0 && (
              <div style={{ background: "#f8fafc", borderRadius: 12, padding: "12px 16px", marginTop: 8 }}>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>銷售比例</div>
                {top3.map((item, i) => {
                  const max = top3[0].qty;
                  return (
                    <div key={item.name} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#475569", marginBottom: 4 }}>
                        <span>{medals[i]} {item.name}</span><span>{item.qty} 件</span>
                      </div>
                      <div style={{ background: "#e2e8f0", borderRadius: 99, height: 8, overflow: "hidden" }}>
                        <div style={{ width: `${(item.qty / max) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${medalColors[i]}, ${medalColors[i]}99)`, borderRadius: 99, transition: "width 0.5s" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* Archived Tab */}
      {tab === "archived" && (
        <div>
          <div style={{ background: "linear-gradient(135deg, #37474f, #546e7a)", borderRadius: 16, padding: "14px 20px", marginBottom: 20, color: "white" }}>
            <div style={{ fontSize: 13, opacity: 0.8 }}>封存的訂單永久保存，不會影響庫存</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>🗑 刪除訂單紀錄（{archivedOrders.length} 筆）</div>
          </div>
          {archivedOrders.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🗄</div>
              <p>目前沒有封存的訂單</p>
            </div>
          ) : (
            [...archivedOrders].reverse().map((order, i) => (
              <div key={i} style={{ background: "white", borderRadius: 16, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", opacity: 0.85, border: "1.5px dashed #b0bec5" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>訂單編號：{order.orderNo || "—"}</div>
                    <div style={{ fontWeight: 700, color: "#455a64", fontSize: 15 }}>{order.name} <span style={{ color: "#78909c", fontWeight: 400, fontSize: 13 }}>工號：{order.employeeId}</span></div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>🕐 {order.date}</div>
                    <div style={{ fontSize: 11, color: "#b0bec5", marginTop: 2 }}>封存時間：{order.archivedAt}　封存者工號：{order.archivedBy}</div>
                  </div>
                  <span style={{ background: "#eceff1", color: "#607d8b", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>已封存</span>
                </div>
                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
                  {order.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#78909c", padding: "2px 0" }}>
                      <span>{item.name} × {item.qty}</span><span>${item.price * item.qty}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8, fontWeight: 800, color: "#90a4ae", fontSize: 15 }}>總計 ${order.total}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {archiveModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}
          onClick={() => setArchiveModal(null)}>
          <div style={{ background: "white", borderRadius: 20, padding: 28, maxWidth: 340, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🗄</div>
              <h3 style={{ margin: 0, color: "#1a2b3c", fontSize: 18 }}>確認封存訂單</h3>
              <p style={{ color: "#78909c", fontSize: 13, marginTop: 6 }}>此訂單將移至「封存紀錄」<br/>請輸入您的工號確認身份</p>
            </div>
            <input
              value={archiveModal.inputId}
              onChange={e => setArchiveModal(m => ({ ...m, inputId: e.target.value, error: "" }))}
              placeholder="請輸入您的工號"
              onKeyDown={e => {
                if (e.key === "Enter") {
                  if (!archiveModal.inputId.trim()) { setArchiveModal(m => ({ ...m, error: "請輸入工號" })); return; }
                  archiveOrder(archiveModal.idx, archiveModal.inputId.trim());
                  setArchiveModal(null);
                }
              }}
              style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${archiveModal.error ? "#ef5350" : "#e2e8f0"}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 6 }}
            />
            {archiveModal.error && <div style={{ color: "#ef5350", fontSize: 12, marginBottom: 10 }}>{archiveModal.error}</div>}
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button onClick={() => setArchiveModal(null)} style={{ ...btnStyle("#78909c", true), flex: 1 }}>取消</button>
              <button onClick={() => {
                if (!archiveModal.inputId.trim()) { setArchiveModal(m => ({ ...m, error: "請輸入工號" })); return; }
                archiveOrder(archiveModal.idx, archiveModal.inputId.trim());
                setArchiveModal(null);
              }} style={{ ...btnStyle("#455a64"), flex: 2 }}>確認封存</button>
            </div>
          </div>
        </div>
      )}
      {/* Custom Confirm Modal */}
      {confirmModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 20 }}>
          <div style={{ background: "white", borderRadius: 20, padding: 28, maxWidth: 340, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>⚠️</div>
              <h3 style={{ margin: "0 0 8px", color: "#1a2b3c", fontSize: 17 }}>{confirmModal.title}</h3>
              <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-line", margin: 0 }}>{confirmModal.message}</p>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setConfirmModal(null)} style={{ ...btnStyle("#78909c", true), flex: 1 }}>取消</button>
              <button onClick={confirmModal.onConfirm} style={{ ...btnStyle("#ef5350"), flex: 2 }}>確認</button>
            </div>
          </div>
        </div>
      )}

      {editingProduct && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}
          onClick={() => setEditingProduct(null)}>
          <div style={{ background: "white", borderRadius: 20, padding: 28, maxWidth: 380, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 18px", color: "#1a2b3c" }}>編輯商品</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>商品分類</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[["adult", "成人款式", "#1565C0", "#e3f2fd"], ["kids", "兒童款式", "#c62828", "#fce4ec"]].map(([val, lbl, activeColor, activeBg]) => (
                  <button key={val} onClick={() => setEditingProduct(p => ({ ...p, category: val }))}
                    style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `2px solid ${(editingProduct.category || "adult") === val ? activeColor : "#e2e8f0"}`, background: (editingProduct.category || "adult") === val ? activeBg : "white", color: (editingProduct.category || "adult") === val ? activeColor : "#94a3b8", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>{lbl}</button>
                ))}
              </div>
            </div>
            <input type="file" accept="image/*" ref={editFileRef} onChange={(e) => handleImageUpload(e, true)} style={{ display: "none" }} />
            <div onClick={() => editFileRef.current.click()} style={{ border: "2px dashed #cbd5e1", borderRadius: 10, padding: 10, textAlign: "center", cursor: "pointer", marginBottom: 14, background: "#f8fafc" }}>
              {editingProduct.image
                ? <img src={editingProduct.image} alt="preview" style={{ maxHeight: 80, maxWidth: "100%", borderRadius: 6 }} />
                : <><IconUpload /><div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>點擊更換圖片</div></>}
            </div>
            {[
              { label: "商品名稱", key: "name" },
              { label: "說明", key: "description" },
              { label: "價格", key: "price", type: "number" },
              { label: "庫存數量", key: "stock", type: "number" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>{f.label}</label>
                <input type={f.type || "text"} value={editingProduct[f.key] ?? ""} onChange={e => setEditingProduct(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <button onClick={() => setEditingProduct(null)} style={{ ...btnStyle("#78909c", true), flex: 1 }}>取消</button>
              <button onClick={saveEdit} style={{ ...btnStyle("#4CAF50"), flex: 2 }}>儲存變更</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared Style Helper ───────────────────────────────────────────────────────
function btnStyle(color, outline = false) {
  return {
    background: outline ? "transparent" : color,
    color: outline ? color : "white",
    border: `2px solid ${color}`,
    borderRadius: 10,
    padding: "9px 18px",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    transition: "opacity 0.2s",
  };
}

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [products, setProductsRaw, prodLoaded] = useStorage("glasses:products", SAMPLE_PRODUCTS);
  const [orders, setOrdersRaw, ordLoaded] = useStorage("glasses:orders", []);
  const [archivedOrders, setArchivedOrdersRaw, archLoaded] = useStorage("glasses:archived", []);
  const [adminPwd, setAdminPwdRaw, pwdLoaded] = useStorage("glasses:adminpwd", DEFAULT_ADMIN_PASSWORD);
  const [view, setView] = useState("shop");
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdErr, setPwdErr] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [showAdminBtn, setShowAdminBtn] = useState(true);
  const logoClickTimer = useRef(null);

  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
    if (newCount >= 3) {
      setShowAdminBtn(true);
      setLogoClicks(0);
    } else {
      logoClickTimer.current = setTimeout(() => setLogoClicks(0), 2000);
    }
  };

  const setProducts = (v) => setProductsRaw(typeof v === "function" ? v(products) : v);
  const setOrders = (v) => setOrdersRaw(typeof v === "function" ? v(orders) : v);
  const setArchivedOrders = (v) => setArchivedOrdersRaw(typeof v === "function" ? v(archivedOrders) : v);
  const setAdminPwd = (v) => setAdminPwdRaw(v);

  const handleOrder = (order) => {
    const insufficient = order.items.filter(item => {
      const p = products.find(p => p.id === item.id);
      return !p || p.stock < item.qty;
    });
    if (insufficient.length > 0) {
      alert(`⚠️ 很抱歉，以下商品庫存不足，請重新選購：\n${insufficient.map(i => i.name).join("、")}`);
      return null;
    }
    const today = new Date();
    const dateStr = today.getFullYear().toString() +
      String(today.getMonth() + 1).padStart(2, '0') +
      String(today.getDate()).padStart(2, '0');
    const todayOrders = orders.filter(o => o.orderNo && o.orderNo.startsWith(dateStr));
    const seq = String(todayOrders.length + 1).padStart(3, '0');
    const orderNo = `${dateStr}-${seq}`;
    const updatedProducts = products.map(p => {
      const orderItem = order.items.find(item => item.id === p.id);
      if (orderItem) return { ...p, stock: Math.max(0, p.stock - orderItem.qty) };
      return p;
    });
    setProducts(updatedProducts);
    setOrders([...orders, { ...order, orderNo, status: "待處理" }]);
    return orderNo;
  };

  const archiveOrder = (idx, confirmedId) => {
    const order = orders[idx];
    const archivedAt = new Date().toLocaleString("zh-TW");
    setArchivedOrders([...archivedOrders, { ...order, archivedAt, archivedBy: confirmedId }]);
    setOrders(orders.filter((_, i) => i !== idx));
  };

  const enterAdmin = () => {
    if (pwd === adminPwd) { setView("admin"); setShowPwdModal(false); setPwd(""); setPwdErr(false); }
    else setPwdErr(true);
  };

  if (!prodLoaded || !ordLoaded || !pwdLoaded || !archLoaded) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1a2b3c 0%, #2d4a6b 100%)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "white", fontSize: 36, fontWeight: 900, letterSpacing: 4, marginBottom: 8 }}>華美光學</div>
        <div style={{ color: "#90caf9", fontSize: 20, fontWeight: 600, letterSpacing: 6 }}>員工特賣會</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #e8f4f8 0%, #f0f4f8 50%, #fce4ec 100%)", fontFamily: "'Noto Sans TC', 'PingFang TC', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="data:image/png;base64,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" alt="華美光學" style={{ width: 44, height: 44, objectFit: "contain" }} />
            <span style={{ fontWeight: 800, fontSize: "clamp(13px, 3.5vw, 18px)", color: "#1a2b3c", whiteSpace: "nowrap" }}>華美光學　員工特賣會</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {view === "admin" ? (
              <>
                <button onClick={() => { setView("shop"); }} style={{ ...btnStyle("#2196F3", true), fontSize: 13 }}>← 員工購物頁</button>
                <button onClick={() => { setView("shop"); }} style={{ ...btnStyle("#ef5350", true), fontSize: 13 }}>登出</button>
              </>
            ) : showAdminBtn ? (
              <button onClick={() => setShowPwdModal(true)} style={{ ...btnStyle("#455a64", true), fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}>
                🔒 管理後台
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px" }}>
        {view === "shop"
          ? <EmployeeView products={products} onOrder={handleOrder} />
          : <AdminView products={products} setProducts={setProducts} orders={orders} setOrders={setOrders} adminPwd={adminPwd} setAdminPwd={setAdminPwd} archiveOrder={archiveOrder} archivedOrders={archivedOrders} />}
      </div>

      {/* Password Modal */}
      {showPwdModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20 }}
          onClick={() => { setShowPwdModal(false); setPwd(""); setPwdErr(false); }}>
          <div style={{ background: "white", borderRadius: 20, padding: 32, maxWidth: 320, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🔒</div>
              <h3 style={{ margin: 0, color: "#1a2b3c" }}>管理員登入</h3>
            </div>
            <input
              type="password"
              placeholder="請輸入管理員密碼"
              value={pwd}
              onChange={e => { setPwd(e.target.value); setPwdErr(false); }}
              onKeyDown={e => e.key === "Enter" && enterAdmin()}
              style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${pwdErr ? "#ef5350" : "#e2e8f0"}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: pwdErr ? 6 : 16 }}
            />
            {pwdErr && <p style={{ color: "#ef5350", fontSize: 13, margin: "0 0 12px" }}>密碼錯誤，請重試</p>}
            <button onClick={enterAdmin} style={{ ...btnStyle("#1a2b3c"), width: "100%", padding: "12px 0" }}>進入後台</button>
          </div>
        </div>
      )}
    </div>
  );
}
