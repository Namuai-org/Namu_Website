export default function LoginPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px", fontFamily: "var(--font-body)" }}>
      <div style={{ maxWidth: "520px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 56px)", marginBottom: "12px" }}>Shiga Namu</h1>
        <p style={{ color: "#4A4A45", marginBottom: "24px" }}>Wannan shafin login ne na Namu AI-Studio.</p>
        <a href="/" className="btn-outline">
          Koma shafin gida
        </a>
      </div>
    </main>
  );
}
