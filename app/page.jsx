'use client';

import { useEffect, useRef, useState } from 'react';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randBetween(min, max) {
  return min + Math.random() * (max - min);
}

function drawBackground(ctx, w, h) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#07070a');
  grad.addColorStop(0.4, '#20050a');
  grad.addColorStop(1, '#430006');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function drawFlames(ctx, w, h) {
  // Glow
  ctx.save();
  const baseGrad = ctx.createRadialGradient(w * 0.5, h * 0.9, 10, w * 0.5, h * 0.9, h * 0.7);
  baseGrad.addColorStop(0, 'rgba(255, 0, 0, 0.25)');
  baseGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  const flameCount = 70;
  for (let i = 0; i < flameCount; i++) {
    const baseX = randBetween(-w * 0.1, w * 1.1);
    const baseY = h * 0.98;
    const flameH = randBetween(h * 0.2, h * 0.55);
    const flameW = randBetween(w * 0.02, w * 0.07);

    const tipX = baseX + randBetween(-flameW * 0.8, flameW * 0.8);
    const tipY = baseY - flameH;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.bezierCurveTo(
      baseX - flameW, baseY - flameH * 0.35,
      tipX - flameW * 0.7, tipY + flameH * 0.25,
      tipX, tipY
    );
    ctx.bezierCurveTo(
      tipX + flameW * 0.7, tipY + flameH * 0.25,
      baseX + flameW, baseY - flameH * 0.35,
      baseX, baseY
    );
    ctx.closePath();

    const g = ctx.createLinearGradient(baseX, baseY, tipX, tipY);
    g.addColorStop(0, 'rgba(255, 30, 0, 0.75)');
    g.addColorStop(0.45, 'rgba(255, 90, 0, 0.85)');
    g.addColorStop(0.8, 'rgba(255, 200, 0, 0.9)');
    g.addColorStop(1, 'rgba(255, 255, 180, 0.95)');

    ctx.fillStyle = g;
    ctx.shadowColor = 'rgba(255, 60, 0, 0.45)';
    ctx.shadowBlur = 18;
    ctx.fill();

    // inner tongue
    ctx.beginPath();
    ctx.moveTo(baseX, baseY - flameH * 0.15);
    ctx.quadraticCurveTo(
      tipX + randBetween(-flameW * 0.3, flameW * 0.3),
      tipY + flameH * 0.45,
      tipX,
      tipY
    );
    ctx.strokeStyle = 'rgba(255, 240, 200, 0.5)';
    ctx.lineWidth = clamp(flameW * 0.15, 0.6, 2.2);
    ctx.stroke();
    ctx.restore();
  }

  // ground ember glow
  ctx.save();
  const grd = ctx.createLinearGradient(0, h * 0.8, 0, h);
  grd.addColorStop(0, 'rgba(255, 0, 0, 0)');
  grd.addColorStop(1, 'rgba(255, 0, 0, 0.35)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, h * 0.8, w, h * 0.2);
  ctx.restore();

  // sparks
  for (let i = 0; i < 200; i++) {
    const x = randBetween(0, w);
    const y = randBetween(h * 0.2, h);
    const r = randBetween(0.4, 1.8);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, ${Math.floor(randBetween(120, 220))}, 0, ${randBetween(0.2, 0.7)})`;
    ctx.fill();
  }
}

function drawDog(ctx, cx, cy, scale) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  const coat = '#1f2329';
  const stroke = '#3a414d';

  // body
  ctx.beginPath();
  ctx.ellipse(0, 40, 120, 75, 0, 0, Math.PI * 2);
  ctx.fillStyle = coat;
  ctx.fill();

  // legs
  const legW = 26, legH = 80;
  const legX = [-70, -25, 20, 65];
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.roundRect(legX[i] - legW / 2, 70, legW, legH, 12);
    ctx.fillStyle = coat;
    ctx.fill();
  }

  // tail
  ctx.beginPath();
  ctx.moveTo(115, 10);
  ctx.quadraticCurveTo(155, -10, 130, -60);
  ctx.quadraticCurveTo(105, -95, 95, -50);
  ctx.lineWidth = 22;
  ctx.strokeStyle = coat;
  ctx.lineCap = 'round';
  ctx.stroke();

  // head
  ctx.save();
  ctx.translate(-120, -10);
  ctx.beginPath();
  ctx.ellipse(0, 0, 55, 50, -0.1, 0, Math.PI * 2);
  ctx.fillStyle = coat;
  ctx.fill();

  // ears
  ctx.beginPath();
  ctx.moveTo(-35, -40);
  ctx.quadraticCurveTo(-50, -80, -20, -60);
  ctx.quadraticCurveTo(-10, -45, -10, -30);
  ctx.closePath();
  ctx.fillStyle = coat;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(20, -42);
  ctx.quadraticCurveTo(35, -80, 5, -62);
  ctx.quadraticCurveTo(-5, -47, -5, -32);
  ctx.closePath();
  ctx.fill();

  // muzzle
  ctx.beginPath();
  ctx.ellipse(35, 10, 28, 20, 0.1, 0, Math.PI * 2);
  ctx.fillStyle = '#2a2f37';
  ctx.fill();

  // nose
  ctx.beginPath();
  ctx.arc(55, 3, 5.5, 0, Math.PI * 2);
  ctx.fillStyle = '#0f1216';
  ctx.fill();

  // mouth
  ctx.beginPath();
  ctx.moveTo(52, 10);
  ctx.quadraticCurveTo(60, 20, 50, 22);
  ctx.strokeStyle = '#0f1216';
  ctx.lineWidth = 2;
  ctx.stroke();

  // eye
  ctx.beginPath();
  ctx.arc(-5, -10, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#0f1216';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-3.5, -11.5, 2, 0, Math.PI * 2);
  ctx.fillStyle = '#cacfd9';
  ctx.fill();

  ctx.restore();

  // stroke outline for definition
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = stroke;
  ctx.beginPath();
  ctx.ellipse(0, 40, 120, 75, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

export default function Page() {
  const canvasRef = useRef(null);
  const [seed, setSeed] = useState(0);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const size = Math.min(1024, Math.floor(window.innerWidth - 32));
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    drawBackground(ctx, w, h);
    drawFlames(ctx, w, h);

    // slight parallax based on seed
    const dx = Math.sin(seed * 1.13) * (w * 0.01);
    const dy = Math.cos(seed * 0.89) * (h * 0.01);

    drawDog(ctx, w * 0.48 + dx, h * 0.55 + dy, clamp(w / 900, 0.7, 1.3));
  }, [seed]);

  const handleRegenerate = () => {
    setSeed((s) => s + 1);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExporting(true);
    try {
      const link = document.createElement('a');
      link.download = 'dog-with-red-flames.png';
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="container">
      <h1 className="title">Dog with Red Flames</h1>
      <div className="controls">
        <button onClick={handleRegenerate} className="btn">Regenerate</button>
        <button onClick={handleDownload} className="btn" disabled={exporting}>
          {exporting ? 'Exporting?' : 'Download PNG'}
        </button>
      </div>
      <div className="canvasWrap">
        <canvas ref={canvasRef} aria-label="Generated dog with red flames" />
      </div>
      <p className="hint">Art is generated in-browser. No uploads needed.</p>
    </main>
  );
}
