import React, { useEffect, useState } from "react";

export default function ZPaymentsWidget() {
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Dynamically load Zoho Payments script
    const script = document.createElement("script");
    script.src = "https://static.zohocdn.com/zpay/zpay-js/v1/zpayments.js";
    script.async = true;
    script.onload = () => {
      const config = {
        account_id: "60033155221", // Replace with your actual account ID
        domain: "IN",
        otherOptions: {
          api_key: "1003.10089eb1a5980d8df584432ab4e5ea9e.800d171a8eb6783da7117f643fca0a29", // Replace with your actual API key (public-facing)
        },
      };
      const zpInstance = new window.ZPayments(config);
      setInstance(zpInstance);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initiatePayment = async () => {
    if (!instance) {
      alert("Payment widget is still loading.");
      return;
    }

    setLoading(true);

    try {
      const options = {
        amount: "100.5",
        currency_code: "INR",
        payments_session_id: "2000000012001", // ⚠️ Replace with a valid session ID from your Zoho dashboard
        currency_symbol: "₹",
        business: "Zylker",
        description: "Purchase of Zylker electronics.",
        invoice_number: "INV-12345",
        reference_number: "REF-12345",
        address: {
          name: "Canon",
          email: "canonbolt@zylker.com",
          phone: "98XXXXXXXX",
        },
      };

      const data = await instance.requestPaymentMethod(options);

      console.log("✅ Payment completed", data);
      alert("Payment successful! Payment ID: " + data.payment_id);
    } catch (err) {
      if (err.code !== "widget_closed") {
        console.error("❌ Payment error:", err);
        alert("Payment failed. Check console for details.");
      }
    } finally {
      await instance.close();
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={initiatePayment}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Processing..." : "Pay ₹100.50"}
      </button>
    </div>
  );
}
