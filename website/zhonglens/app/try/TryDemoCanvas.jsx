"use client";

import { useEffect, useRef } from "react";

const DEMO_LINE = "原来学中文可以这么容易！";
const DEMO_BACKGROUND_SRC = "/one_punch_man.png";

export default function TryDemoCanvas({
  completed = false,
  readyToHover = false,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = 1040;
    const cssHeight = 585;

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.width = "100%";
    canvas.style.height = "auto";

    ctx.scale(dpr, dpr);

    let cancelled = false;
    const backgroundImage = new Image();

    backgroundImage.onload = () => {
      if (cancelled) return;
      drawFrame(ctx, cssWidth, cssHeight, backgroundImage, {
        completed,
        readyToHover,
      });
    };

    backgroundImage.onerror = () => {
      if (cancelled) return;
      drawFrame(ctx, cssWidth, cssHeight, null, { completed, readyToHover });
    };

    backgroundImage.src = DEMO_BACKGROUND_SRC;

    return () => {
      cancelled = true;
    };
  }, [completed, readyToHover]);

  return (
    <canvas
      ref={canvasRef}
      className="block aspect-video w-full rounded-2xl bg-slate-950 shadow-2xl"
      aria-label="Demo video frame with burned-in Chinese subtitles for ZhongLens OCR"
    />
  );
}

function drawFrame(ctx, cssWidth, cssHeight, backgroundImage, state) {
  const { completed, readyToHover } = state;

  if (backgroundImage) {
    drawImageCover(ctx, backgroundImage, 0, 0, cssWidth, cssHeight);
  } else {
    ctx.fillStyle = "#191510";
    ctx.fillRect(0, 0, cssWidth, cssHeight);
  }

  ctx.fillStyle = "rgba(25,21,16,0.22)";
  ctx.fillRect(0, 0, cssWidth, cssHeight);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;

  if (completed) {
    ctx.fillStyle = "rgba(2, 6, 23, 0.72)";
    roundRect(ctx, 136, 124, 768, 230, 24);
    ctx.fill();

    ctx.font =
      '700 40px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.strokeStyle = "rgba(0,0,0,0.55)";
    ctx.lineWidth = 5;
    ctx.strokeText("Great! You're ready to use ZhongLens.", cssWidth / 2, 208);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Great! You're ready to use ZhongLens.", cssWidth / 2, 208);
    ctx.font =
      '600 24px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.strokeStyle = "rgba(0,0,0,0.45)";
    ctx.lineWidth = 4;
    ctx.strokeText(
      "Tip: you can also use CTRL + O to start and CTRL + L to close.",
      cssWidth / 2,
      258,
    );
    ctx.fillStyle = "#d1fae5";
    ctx.fillText(
      "Tip: you can also use CTRL + O to start and CTRL + L to close.",
      cssWidth / 2,
      258,
    );

    ctx.font =
      '600 20px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.strokeStyle = "rgba(0,0,0,0.45)";
    ctx.lineWidth = 3;
    ctx.strokeText(
      "Don't see a popup? Install a pop-up dictionary, turn it on, refresh, then try again.",
      cssWidth / 2,
      314,
    );
    ctx.fillStyle = "#fef3c7";
    ctx.fillText(
      "Don't see a popup? Install a pop-up dictionary, turn it on, refresh, then try again.",
      cssWidth / 2,
      314,
    );
  } else if (readyToHover) {
    ctx.fillStyle = "rgba(2, 6, 23, 0.72)";
    roundRect(ctx, 210, 176, 620, 112, 22);
    ctx.fill();

    ctx.font =
      '700 34px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.strokeStyle = "rgba(0,0,0,0.55)";
    ctx.lineWidth = 5;
    ctx.strokeText("Hover the Chinese text", cssWidth / 2, 222);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Hover the Chinese text", cssWidth / 2, 222);

    ctx.font =
      '600 22px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.strokeStyle = "rgba(0,0,0,0.45)";
    ctx.lineWidth = 4;
    ctx.strokeText("to see the pop-up dictionary.", cssWidth / 2, 260);
    ctx.fillStyle = "#d1fae5";
    ctx.fillText("to see the pop-up dictionary.", cssWidth / 2, 260);
  }

  const subtitleWidth = 680;
  const subtitleX = (cssWidth - subtitleWidth) / 2;
  const subtitleY = 430;
  ctx.fillStyle = "rgba(0,0,0,0.76)";
  roundRect(ctx, subtitleX, subtitleY, subtitleWidth, 86, 16);
  ctx.fill();

  ctx.font =
    '700 54px "PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", "Heiti SC", sans-serif';

  ctx.strokeStyle = "rgba(0,0,0,0.9)";
  ctx.lineWidth = 8;
  ctx.strokeText(DEMO_LINE, cssWidth / 2, subtitleY + 44);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(DEMO_LINE, cssWidth / 2, subtitleY + 44);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawImageCover(ctx, image, x, y, width, height) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const targetRatio = width / height;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;
  let sourceX = 0;
  let sourceY = 0;

  if (imageRatio > targetRatio) {
    sourceWidth = image.naturalHeight * targetRatio;
    sourceX = (image.naturalWidth - sourceWidth) / 2;
  } else {
    sourceHeight = image.naturalWidth / targetRatio;
    sourceY = (image.naturalHeight - sourceHeight) / 2;
  }

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  );
}
