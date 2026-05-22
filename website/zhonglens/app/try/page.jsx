import { CheckCircle2, MousePointer2, ScanLine } from "lucide-react";
import TryDemoCanvas from "./TryDemoCanvas";

const ZHONGWEN_URL =
  "https://chromewebstore.google.com/detail/zhongwen-chinese-english/kkmlkkjojmombglmlpbpapmhcaljjkde";

export const metadata = {
  title: "Try ZhongLens",
  description:
    "Try ZhongLens on a reliable demo page with burned-in Chinese subtitles.",
};

export default function TryPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-5 text-slate-950 sm:px-6">
      <section className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl items-center gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div id="demo-frame" className="mx-auto w-full max-w-6xl">
          <h1 className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome to ZhongLens!
          </h1>
          <p className="mx-auto mb-5 max-w-3xl text-center text-base leading-7 text-slate-600 sm:text-lg">
            ZhongLens turns Chinese text in images and videos into hoverable
            text. Try it now!
          </p>
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
            <TryDemoCanvas />
          </div>
        </div>

        <aside className="mx-auto w-full max-w-6xl rounded-lg border border-slate-200 bg-white/88 p-4 shadow-sm lg:max-w-none">
          <h2 className="text-lg font-bold tracking-tight">Try ZhongLens</h2>

          <ol className="mt-4 space-y-3">
            <Step
              icon={<CheckCircle2 className="size-5" />}
              text="Open ZhongLens"
            />
            <Step
              icon={<ScanLine className="size-5" />}
              text="Click Capture Tab"
            />
            <Step
              icon={<MousePointer2 className="size-5" />}
              text="Hover the Chinese"
            />
          </ol>

          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-5 text-amber-950">
            No popup? Install Zhongwen, click it to turn it on, then try again.
          </div>

          <a
            href={ZHONGWEN_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Install Zhongwen
          </a>
        </aside>
      </section>
    </main>
  );
}

function Step({ icon, text }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-teal-100 text-teal-800">
        {icon}
      </span>
      <span className="font-semibold text-lg">{text}</span>
    </li>
  );
}
