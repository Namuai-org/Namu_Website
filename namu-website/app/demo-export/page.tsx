import { StudioDemo } from "@/components/landing/StudioDemo";

export default function DemoExportPage() {
  return (
    <main
      style={{
        height: "100vh",
        background: "#050805",
        display: "grid",
        placeItems: "center",
        padding: "20px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "min(1440px, calc((100vh - 40px) * 16 / 9), 100%)",
        }}
      >
        <StudioDemo autoPlay loop={false} startDelayMs={2000} showControls={false} showStoryPills={false} />
      </div>
    </main>
  );
}
