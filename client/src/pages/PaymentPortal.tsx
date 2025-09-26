// PaymentPortal.tsx
import React, { useMemo, useState } from "react";
import QRCode from "qrcode";

type Props = {
  orderId?: string;
  returnUrl?: string; // unused now, since all redirect → /allocate
};

export default function PaymentPortal({ orderId = "" }: Props) {
  const amount = 10;
  const [active, setActive] = useState<"none" | "upi" | "card" | "apps">(
    "none"
  );
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // UPI state
  const [vpa, setVpa] = useState("");
  const [upiQRDataUrl, setUpiQRDataUrl] = useState<string | null>(null);
  const [upiGenerateLoading, setUpiGenerateLoading] = useState(false);

  // Card state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Apps
  const apps = useMemo(
    () => ["PhonePe", "Google Pay", "Paytm", "Amazon Pay"],
    []
  );
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  // Helpers
  function formatCardNumber(input: string) {
    return input.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
  }
  function formatExpiry(input: string) {
    return input.replace(/\D/g, "").slice(0, 4).replace(/(.{2})/, "$1/");
  }
  function validVpa(v: string) {
    return /^[a-zA-Z0-9._%-]+@[a-zA-Z]{2,}$/.test(v);
  }
  function validCard() {
    const num = cardNumber.replace(/\s/g, "");
    if (!/^\d{12,19}$/.test(num)) return false;
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    if (!/^\d{3,4}$/.test(cvv)) return false;
    return true;
  }

  // ✅ QR generator
  async function generateUpiQr() {
    try {
      setUpiGenerateLoading(true);
      const upiUrl = `upi://pay?pa=${encodeURIComponent(
        vpa || "test@upi"
      )}&pn=CarSpot&am=${amount}&cu=INR`;
      const dataUrl = await QRCode.toDataURL(upiUrl);
      setUpiQRDataUrl(dataUrl);
    } catch (err) {
      console.error("QR generation failed:", err);
      setMessage("Failed to generate QR code");
    } finally {
      setUpiGenerateLoading(false);
    }
  }

  // ✅ Simplified payment → always redirect
  function handlePayment() {
    setProcessing(true);
    setMessage("Redirecting to allocate page...");
    setTimeout(() => {
      window.location.href = "https://intermalar-kaylen-corticate.ngrok-free.dev/allocateslot";
    }, 500);
  }

  // Tile component
  const Tile = ({
    title,
    subtitle,
    icon,
    activeKey,
    onClick,
  }: {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    activeKey: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full p-4 rounded-xl shadow-md transition-transform transform hover:-translate-y-0.5 focus:outline-none ${
        active === activeKey
          ? "ring-2 ring-indigo-500 bg-indigo-50"
          : "hover:shadow-lg"
      }`}
      aria-expanded={active === activeKey}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white text-lg font-semibold">
          {icon}
        </div>
        <div className="text-left">
          <div className="font-medium text-slate-800">{title}</div>
          {subtitle && <div className="text-sm text-slate-500">{subtitle}</div>}
        </div>
      </div>
      <div className="text-sm text-slate-500">
        {active === activeKey ? "Open" : "Choose"}
      </div>
    </button>
  );

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4 sm:p-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <div className="w-full sm:max-w-lg md:max-w-3xl lg:max-w-[80%] bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/30">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Complete payment
            </h2>
            <div className="text-sm text-slate-600">
              Pay ₹{amount.toFixed(2)} — Order ID {orderId || "—"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">Secure</div>
            <div className="text-xs text-slate-400">Encrypted checkout</div>
          </div>
        </header>

        <div className="grid gap-3">
          {/* UPI */}
          <Tile
            title="UPI"
            subtitle="Instant bank transfers (QR / VPA)"
            icon={<span>UPI</span>}
            activeKey="upi"
            onClick={() => setActive((s) => (s === "upi" ? "none" : "upi"))}
          />
          {active === "upi" && (
            <div className="p-4 bg-slate-50 rounded-xl shadow-inner transition-all">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Enter VPA (example@upi)
                  </label>
                  <input
                    value={vpa}
                    onChange={(e) => setVpa(e.target.value)}
                    placeholder="yourname@bank"
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        if (!validVpa(vpa)) {
                          setMessage(
                            "Please enter a valid VPA (e.g. name@bank)"
                          );
                          return;
                        }
                        handlePayment();
                      }}
                      className="px-4 py-2 rounded-md bg-blue-600 text-white hover:brightness-105 transition"
                    >
                      Pay with VPA
                    </button>
                    <button
                      onClick={generateUpiQr}
                      className="px-4 py-2 rounded-md border text-black hover:bg-slate-100 transition"
                      disabled={upiGenerateLoading}
                    >
                      {upiGenerateLoading ? "Generating..." : "Show QR"}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="text-sm text-slate-500">
                    Scan QR from your app
                  </div>
                  <div className="relative w-44 h-44 p-2 bg-white rounded-lg shadow-md flex items-center justify-center">
                    {upiQRDataUrl ? (
                      <img
                        src={upiQRDataUrl}
                        alt="UPI QR"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <>
                        <div className="w-full h-full bg-slate-200 rounded-lg blur-sm" />
                        <div className="absolute text-xs text-slate-500 text-center">
                          Press "Show QR" to reveal
                        </div>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Or copy VPA to clipboard
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card */}
          <Tile
            title="Card"
            subtitle="Credit / Debit / Netbanking via card"
            icon={<span>💳</span>}
            activeKey="card"
            onClick={() => setActive((s) => (s === "card" ? "none" : "card"))}
          />
          {active === "card" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!validCard()) {
                  setMessage("Please enter valid card details");
                  return;
                }
                handlePayment();
              }}
              className="p-4 bg-slate-50 rounded-xl shadow-inner"
            >
              <div className="grid gap-3">
                <input
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value))
                  }
                  placeholder="1234 5678 9012 3456"
                  maxLength={22}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                />
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                  />
                  <input
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3 items-end">
                  <input
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 text-black"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:brightness-105 transition"
                  >
                    Pay ₹{amount.toFixed(2)}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Apps */}
          <Tile
            title="Payment Apps"
            subtitle="PhonePe, GPay, Paytm, etc."
            icon={<span>⚡</span>}
            activeKey="apps"
            onClick={() => setActive((s) => (s === "apps" ? "none" : "apps"))}
          />
          {active === "apps" && (
            <div className="p-4 bg-slate-50 rounded-xl shadow-inner">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  {apps.map((a) => (
                    <button
                      key={a}
                      onClick={() => setSelectedApp(a)}
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md border transition hover:bg-white ${
                        selectedApp === a ? "ring-2 ring-indigo-400" : ""
                      }`}
                    >
                      <div className="text-sm font-medium text-slate-800">
                        {a}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="text-sm text-slate-500">
                    Open your app and scan / confirm
                  </div>
                  <button
                    onClick={() => {
                      if (!selectedApp)
                        return setMessage("Choose an app first");
                      handlePayment();
                    }}
                    className="px-4 py-2 rounded-md bg-emerald-600 text-white"
                  >
                    {selectedApp ? `Go to ${selectedApp}` : "Choose an app"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-3 gap-3">
            <div className="text-sm text-slate-600">
              Secure payment powered by Cypher
            </div>
            <div className="flex items-center gap-2">
              {message && <div className="text-sm text-red-600">{message}</div>}
              <button
                onClick={() => (window.location.href = "http://localhost:8080/allocateslot")}
                className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
          {processing && (
            <div className="text-sm text-slate-500 mt-2">Processing…</div>
          )}
        </div>
      </div>
    </div>
  );
}
