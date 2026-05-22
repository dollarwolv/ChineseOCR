import TryDemoExperience from "./TryDemoExperience";

export const metadata = {
  title: "Try ZhongLens",
  description:
    "Try ZhongLens on a reliable demo page with burned-in Chinese subtitles.",
};

export default function TryPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-5 text-slate-950 sm:px-6">
      <TryDemoExperience />
    </main>
  );
}
