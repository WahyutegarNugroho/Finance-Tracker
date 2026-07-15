export function MockChart() {
  const data = [60, 65, 40, 50, 75, 100];
  const w = 100;
  const h = 36;
  const max = 120;
  const min = 0;
  const range = max - min;
  const stepX = w / (data.length - 1);
  const pts = data.map((v, i) => `${(i * stepX).toFixed(1)},${(h - ((v - min) / range) * h).toFixed(1)}`).join(' ');
  const fillPts = `0,${h} ${pts} ${w},${h}`;
  const color = '#4648d4';

  return (
    <div className="absolute inset-0 w-full h-full pb-2" aria-hidden="true">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
        <polygon points={fillPts} fill={`${color}26`} />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((v, i) => (
          <circle key={i} cx={(i * stepX).toFixed(1)} cy={(h - ((v - min) / range) * h).toFixed(1)} r="0.8" fill={color} />
        ))}
      </svg>
    </div>
  );
}
