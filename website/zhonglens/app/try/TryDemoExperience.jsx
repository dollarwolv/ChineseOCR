"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import TryDemoCanvas from "./TryDemoCanvas";

const ZHONGWEN_URL =
  "https://chromewebstore.google.com/detail/zhongwen-chinese-english/kkmlkkjojmombglmlpbpapmhcaljjkde";

export default function TryDemoExperience() {
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const [popupOpened, setPopupOpened] = useState(false);
  const [captureClicked, setCaptureClicked] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [textHovered, setTextHovered] = useState(false);
  const activeStep = textHovered ? -1 : scanCompleted ? 2 : popupOpened ? 1 : 0;
  const steps = [
    {
      text: "Open ZhongLens",
      complete: popupOpened || captureClicked || scanCompleted || textHovered,
    },
    {
      text: "Capture Tab",
      complete: captureClicked || scanCompleted || textHovered,
    },
    {
      text: "Hover Chinese",
      complete: textHovered,
    },
  ];

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

  if (!welcomeDismissed) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-5xl items-center justify-center px-2">
        <div className="w-full max-w-2xl rounded-4xl border border-[#ded6c9] bg-[#fffdf8] px-8 py-12 text-center shadow-2xl shadow-[#3d2f22]/10 sm:px-12 sm:py-14">
          <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-[#8f4f36] uppercase">
            20-second tutorial
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#191510] sm:text-5xl">
            Welcome to ZhongLens!
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-[#665f55]">
            ZhongLens turns Chinese text in images and videos into hoverable
            text, so you can use a pop-up dictionary anywhere.
          </p>
          <button
            type="button"
            onClick={() => setWelcomeDismissed(true)}
            className="mt-9 inline-flex items-center cursor-pointer justify-center gap-2 rounded-full bg-[#191510] px-6 py-3 text-base font-bold text-[#fffdf8] shadow-lg shadow-[#3d2f22]/15 transition hover:bg-[#2a241d] focus-visible:ring-2 focus-visible:ring-[#8f4f36] focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            See how it works
            <ArrowRight className="size-5" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      {!popupOpened && <OpenExtensionHint />}

      <section className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl flex-col justify-center gap-6">
        <div id="demo-frame" className="mx-auto w-full max-w-4xl">
          <div
            className={`relative rounded-3xl border bg-[#fffdf8] p-3 shadow-xl shadow-[#3d2f22]/12 transition duration-500 ${
              scanCompleted
                ? "border-[#c8795a] shadow-[#8f4f36]/15"
                : "border-[#ded6c9]"
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
                className="absolute top-[60%] left-1/2 inline-flex -translate-x-1/2 items-center justify-center rounded-full bg-[#fffdf8] px-5 py-2.5 text-sm font-bold text-[#191510] shadow-lg ring-1 ring-[#ded6c9] transition hover:bg-[#f3eadf]"
              >
                Install Pop-up dictionary
              </a>
            )}
          </div>
        </div>

        <header className="mx-auto w-full max-w-5xl">
          <Stepper steps={steps} activeStep={activeStep} />
          <p className="mx-auto mt-5 min-h-9 max-w-3xl text-center text-xl font-semibold text-[#3d2f22] sm:text-2xl">
            {getInstruction({ popupOpened, scanCompleted, textHovered })}
          </p>
        </header>
      </section>
    </>
  );
}

function getInstruction({ popupOpened, scanCompleted, textHovered }) {
  if (textHovered) return "Done. You are ready to use ZhongLens.";
  if (scanCompleted) return "Hover the Chinese subtitle in the demo frame.";
  if (popupOpened)
    return "Great! Now click Capture Tab in the ZhongLens popup.";
  return "Open ZhongLens from the Chrome toolbar on the top right.";
}

function Stepper({ steps, activeStep }) {
  return (
    <ol className="relative mx-auto grid max-w-4xl grid-cols-3 gap-3 px-2">
      <span
        className="absolute top-6 right-[16%] left-[16%] h-px bg-[#d8cfc2]"
        aria-hidden="true"
      />
      {steps.map((step, index) => (
        <Step
          key={step.text}
          active={activeStep === index}
          complete={step.complete}
          number={index + 1}
          text={step.text}
        />
      ))}
    </ol>
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
    <div className="pointer-events-none fixed top-0 right-22 z-50 hidden h-24 md:block">
      <div className="absolute top-10 right-16 w-[19ch] text-xl font-bold leading-tight text-[#8f4f36] drop-shadow-[0_2px_8px_rgba(61,47,34,0.18)]">
        Open ZhongLens Here
      </div>
      <svg
        className="h-20 w-24 overflow-visible text-[#8f4f36] drop-shadow-sm"
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

function Step({ active = false, complete = false, number, text }) {
  return (
    <li className="relative z-10 flex min-w-0 flex-col items-center text-center">
      <span
        className={`flex size-12 shrink-0 items-center justify-center rounded-full border text-base font-bold transition ${
          complete
            ? "border-[#191510] bg-[#191510] text-[#fffdf8]"
            : active
              ? "border-[#8f4f36] bg-[#8f4f36] text-[#fffdf8]"
              : "border-[#d8cfc2] bg-[#f7f2ea] text-[#81766a]"
        }`}
      >
        {complete ? <CheckCircle2 className="size-5" /> : number}
      </span>
      <span
        className={`mt-3 truncate text-base font-semibold leading-tight sm:text-lg ${
          active ? "text-[#191510]" : "text-[#665f55]"
        }`}
      >
        {text}
      </span>
    </li>
  );
}
