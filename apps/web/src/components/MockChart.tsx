export function MockChart() {
  const data = [60, 65, 40, 50, 75, 100];
  const w = 100;
  const h = 36;
  const max = 120;
  const min = 0;
  const range = max - min;
  const stepX = w / (data.length - 1);
  
  const pts = data.map((v, i) => ({
    x: i * stepX,
    y: h - ((v - min) / range) * h
  }));

  let pathD = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? 0 : i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2 === pts.length ? i + 1 : i + 2];
    
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    
    pathD += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }

  const fillPathD = `${pathD} L ${w},${h} L 0,${h} Z`;

  return (
    <div className="absolute inset-0 w-full h-full pb-2" aria-hidden="true">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
        <path d={fillPathD} className="fill-primary/15" />
        <path d={pathD} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="0.8" className="fill-primary" />
        ))}
      </svg>
    </div>
  );
}
