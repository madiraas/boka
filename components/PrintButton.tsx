"use client";

export default function PrintButton() {
  return (
    <button className="pill-btn solid" onClick={() => window.print()}>
      Save as PDF
    </button>
  );
}
