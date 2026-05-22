"use client";

import { useEffect, useRef } from "react";

const DEMO_LINE = "我今天终于明白了。";

export default function TryDemoCanvas() {
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

    const gradient = ctx.createLinearGradient(0, 0, cssWidth, cssHeight);
    gradient.addColorStop(0, "#172554");
    gradient.addColorStop(0.42, "#0f766e");
    gradient.addColorStop(1, "#111827");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    for (let i = 0; i < 9; i += 1) {
      ctx.beginPath();
      ctx.arc(120 + i * 120, 120 + Math.sin(i) * 52, 80, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "rgba(0,0,0,0.32)";
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    const subtitleWidth = 680;
    const subtitleX = (cssWidth - subtitleWidth) / 2;
    const subtitleY = 430;
    ctx.fillStyle = "rgba(0,0,0,0.76)";
    roundRect(ctx, subtitleX, subtitleY, subtitleWidth, 86, 16);
    ctx.fill();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;
    ctx.font =
      '700 54px "PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", "Heiti SC", sans-serif';

    ctx.strokeStyle = "rgba(0,0,0,0.9)";
    ctx.lineWidth = 8;
    ctx.strokeText(DEMO_LINE, cssWidth / 2, subtitleY + 44);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(DEMO_LINE, cssWidth / 2, subtitleY + 44);

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="block aspect-video w-full rounded-lg bg-slate-950 shadow-2xl"
      aria-label="Demo video frame with burned-in Chinese subtitles for ZhongLens OCR"
    />
  );
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
