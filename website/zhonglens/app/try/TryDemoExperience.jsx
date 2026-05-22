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
    <>
      {!popupOpened && <OpenExtensionHint />}

      <section className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl items-center gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="mx-auto w-full max-w-6xl lg:max-w-none">
          <div className="mb-5">
            <h1 className="text-5xl font-bold tracking-tight">
              Welcome to ZhongLens!
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              ZhongLens turns Chinese text in images and videos into hoverable
              text, which will let you use a pop-up dictionary anywhere. Try it
              now!
            </p>
          </div>

          <aside className="rounded-lg border border-teal-300 bg-teal-50 p-4 shadow-lg shadow-teal-900/10">
            <h2 className="text-3xl font-bold tracking-tight">
              Complete this quick tutorial
            </h2>

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
                text="Hover Chinese"
              />
            </ol>
          </aside>
        </div>
        <div id="demo-frame" className="mx-auto w-full max-w-6xl">
          <div
            className={`relative rounded-xl border bg-white p-3 shadow-xl transition duration-500 ${
              scanCompleted
                ? "border-teal-300 shadow-teal-200/70"
                : "border-slate-200"
            }`}
          >
            <TryDemoCanvas
              completed={textHovered}
              readyToHover={scanCompleted && !textHovered}
            />
            {textHovered && (
              <a
                href={ZHONGWEN_URL}
                target="_blank"
                rel="noreferrer"
                className="absolute top-[60%] left-1/2 inline-flex -translate-x-1/2 items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg transition hover:bg-slate-100"
              >
                Install Pop-up dictionary
              </a>
            )}
          </div>
        </div>
      </section>
    </>
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

function OpenExtensionHint() {
  return (
    <div className="pointer-events-none fixed top-0 right-20 z-50 hidden h-24 md:block">
      <div className="absolute top-12 right-22 text-xl font-bold leading-tight text-teal-800 drop-shadow-[0_2px_8px_rgba(15,23,42,0.3)] w-[19ch]">
        Open ZhongLens Here
      </div>
      <svg
        className="h-24 w-28 overflow-visible text-teal-700 drop-shadow-sm"
        viewBox="0 0 302.816 302.816"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          transform="translate(302.816 0) scale(-1 1) rotate(180 151.408 151.408)"
          d="M298.423,152.996c-5.857-5.858-15.354-5.858-21.213,0l-35.137,35.136
            c-5.871-59.78-50.15-111.403-112.001-123.706c-45.526-9.055-92.479,5.005-125.596,37.612
            c-5.903,5.813-5.977,15.31-0.165,21.213c5.813,5.903,15.31,5.977,21.212,0.164
            c26.029-25.628,62.923-36.679,98.695-29.565c48.865,9.72,83.772,50.677,88.07,97.978
            l-38.835-38.835c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213
            l62.485,62.485c2.929,2.929,6.768,4.393,10.606,4.393s7.678-1.464,10.607-4.393l62.483-62.482
            C304.281,168.352,304.281,158.854,298.423,152.996z"
        />
      </svg>
    </div>
  );
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
