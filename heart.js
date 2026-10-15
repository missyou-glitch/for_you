(function () {
  const canvas = document.getElementById("heart");
  const ctx = canvas.getContext("2d");

  // Sharp on phones: draw at the screen's pixel density
  const W = 260, H = 240;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

  const UNIT = 6.2;          // overall heart size
  const COUNT = 650;         // number of dots
  const TEXT = "I love you"; // change the words here

  // Build the dots along the heart shape
  const dots = [];
  for (let i = 0; i < COUNT; i++) {
    const t = Math.random() * Math.PI * 2;
    // k pulls some dots inward, so the edge is dense and the middle is sparse
    const k = 1 - Math.pow(Math.random(), 3) * 0.7;
    dots.push({
      x: 16 * Math.pow(Math.sin(t), 3) * k,
      y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) -
           2 * Math.cos(3 * t) - Math.cos(4 * t)) * k,
      size: Math.random() * 1.6 + 0.7,
      phase: Math.random() * Math.PI * 2,
      hue: 325 + Math.random() * 20,
      light: 60 + Math.random() * 20
    });
  }

  function draw(ms) {
    const s = ms / 1000;

    // Heartbeat: a strong beat followed by a smaller one
    const beat =
      1 + 0.08 * Math.pow(Math.abs(Math.sin(s * 2.6)), 14) +
          0.05 * Math.pow(Math.abs(Math.sin(s * 2.6 + 0.7)), 14);

    ctx.clearRect(0, 0, W, H);
    const cx = W / 2;
    const cy = H / 2 - 4;

    ctx.shadowColor = "#ff4fa3";
    ctx.shadowBlur = 6;

    for (const d of dots) {
      // each dot twinkles and wobbles a little
      const wobbleX = Math.sin(s * 2 + d.phase) * 0.25;
      const wobbleY = Math.cos(s * 2.3 + d.phase) * 0.25;
      const px = cx + (d.x + wobbleX) * UNIT * beat;
      const py = cy + (d.y + wobbleY) * UNIT * beat;

      ctx.globalAlpha = 0.55 + 0.45 * Math.sin(s * 3 + d.phase);
      ctx.fillStyle = `hsl(${d.hue}, 100%, ${d.light}%)`;
      ctx.beginPath();
      ctx.arc(px, py, d.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // The words in the middle
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#ff2fd0";
    ctx.font = "italic 22px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText(TEXT, cx, cy + 10);

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();