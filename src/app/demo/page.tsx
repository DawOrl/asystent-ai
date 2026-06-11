import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ChatPanel } from "@/components/chat/ChatPanel";

export const metadata: Metadata = {
  title: "Demo czatu",
  description:
    "Porozmawiaj na żywo z asystentem AI — pyta o cennik, zakres i czas wdrożenia. Demo.",
};

export default function DemoPage() {
  return (
    <>
      <Header />
      <main className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-2xl">
          <div className="mb-6 text-center">
            <p className="eyebrow justify-center">{"// demo"}</p>
            <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">
              Porozmawiaj z asystentem
            </h1>
            <p className="mt-2 text-sm text-muted">
              Zadaj pytanie o ofertę wdrożeń AI — odpowiada na żywo.
            </p>
          </div>
          <ChatPanel
            viewTransitionName="chat-surface"
            className="h-[60vh] min-h-[28rem]"
          />
        </div>
      </main>
    </>
  );
}
