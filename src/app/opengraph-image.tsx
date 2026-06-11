import { ImageResponse } from "next/og";
import { company } from "@/data/company";

export const alt = `${company.name} — asystent AI dla małych firm`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          backgroundColor: "#0a0a0b",
          color: "#ededef",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* aurora */}
        <div
          style={{
            position: "absolute",
            top: -160,
            left: -120,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.55) 0%, rgba(10,10,11,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.45) 0%, rgba(10,10,11,0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", fontSize: 28, color: "#34d399" }}>
          {"// asystent-ai"}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 78,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
            fontFamily: "sans-serif",
            maxWidth: 900,
          }}
        >
          {company.tagline}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 30,
            color: "#8a8f98",
            fontFamily: "sans-serif",
          }}
        >
          {company.heroLead}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 24,
            color: "#8a8f98",
          }}
        >
          {company.author} · {company.role}
        </div>
      </div>
    ),
    size
  );
}
