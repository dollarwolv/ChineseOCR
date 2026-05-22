"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, MousePointer2, ScanLine } from "lucide-react";
import TryDemoCanvas from "./TryDemoCanvas";

const ZHONGWEN_URL =
  "https://chromewebstore.google.com/detail/zhongwen-chinese-english/kkmlkkjojmombglmlpbpapmhcaljjkde";

export default function TryDemoExperience() {
  const [popupOpened, setPopupOpened] = useState(false);
  const [captureClicked, setCaptureClicked] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [textHovered, setTextHovered] = useState(false);

  useEffect(() => {
    function handleMessage(event) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.source !== "zhonglens-extension") return;

      if (event.data?.type === "ZHONGLENS_POPUP_OPENED") {
        setPopupOpened(true);
      }

      if (event.data?.type === "ZHONGLENS_CAPTURE_TAB_CLICKED") {
        setPopupOpened(true);
        setCaptureClicked(true);
      }

      if (event.data?.type === "ZHONGLENS_OCR_COMPLETED") {
        setPopupOpened(true);
        setCaptureClicked(true);
        setScanCompleted(true);
        shootConfetti();
      }

      if (event.data?.type === "ZHONGLENS_OCR_TEXT_HOVERED") {
        setTextHovered(true);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <section className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl items-center gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <div className="mx-auto w-full max-w-6xl lg:max-w-none">
        <aside className="rounded-lg border border-slate-200 bg-white/88 p-4 shadow-sm">
          <h2 className="text-lg font-bold tracking-tight">Try ZhongLens</h2>

          <ol className="mt-4 space-y-3">
            <Step
              active={!popupOpened}
              complete={popupOpened || captureClicked || scanCompleted}
              icon={<CheckCircle2 className="size-5" />}
              text="Open ZhongLens"
            />
            <Step
              active={popupOpened && !captureClicked}
              complete={captureClicked || scanCompleted}
              icon={<ScanLine className="size-5" />}
              text="Click Capture Tab"
            />
            <Step
              active={scanCompleted && !textHovered}
              complete={textHovered}
              icon={<MousePointer2 className="size-5" />}
              text="Click page and hover Chinese"
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

        <p
          className={`mt-5 min-h-32 text-3xl font-bold leading-tight tracking-tight text-teal-700 transition-opacity ${
            scanCompleted ? "opacity-100" : "opacity-0"
          }`}
        >
          {textHovered
            ? "You're ready to use ZhongLens! You can now close this page."
            : "Great job! Hover the text to see the dictionary."}
        </p>
      </div>
      <div id="demo-frame" className="mx-auto w-full max-w-6xl">
        <h1 className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome to ZhongLens!
        </h1>
        <p className="mx-auto mb-5 max-w-3xl text-center text-base leading-7 text-slate-600 sm:text-lg">
          ZhongLens turns Chinese text in images and videos into hoverable text.
          Try it now!
        </p>
        <div
          className={`relative rounded-xl border bg-white p-3 shadow-xl transition duration-500 ${
            scanCompleted
              ? "border-teal-300 shadow-teal-200/70"
              : "border-slate-200"
          }`}
        >
          <TryDemoCanvas />
        </div>
      </div>
    </section>
  );
}

function shootConfetti() {
  const defaults = {
    origin: { x: 0.5, y: 0.8 },
    spread: 90,
    startVelocity: 56,
    gravity: 0.9,
    ticks: 220,
    zIndex: 10000,
    disableForReducedMotion: true,
  };

  confetti({
    ...defaults,
    particleCount: 90,
    scalar: 1,
    angle: 72,
  });
  confetti({
    ...defaults,
    particleCount: 90,
    scalar: 1,
    angle: 108,
  });

  window.setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 70,
      scalar: 0.85,
      angle: 90,
      spread: 95,
      startVelocity: 48,
    });
  }, 180);
}

function Step({ active = false, complete = false, icon, text }) {
  return (
    <li className="flex items-center gap-3">
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-md border transition ${
          complete
            ? "border-teal-600 bg-teal-600 text-white"
            : "border-slate-300 bg-slate-100 text-slate-400"
        }`}
      >
        {complete ? <CheckCircle2 className="size-5" /> : icon}
      </span>
      <span
        className={`text-lg font-semibold ${active ? "text-teal-800" : ""}`}
      >
        {text}
      </span>
    </li>
  );
}
