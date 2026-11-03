import { useId } from "react";
import { memorySeries, cpuSeries } from "../../data/mock-data";

function pointsFor(values: number[], width: number, height: number) {
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - (value / 100) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

export function ResourceChart() {
  const id = useId();
  const width = 720;
  const height = 190;
  const cpuPoints = pointsFor(cpuSeries, width, height);
  const memoryPoints = pointsFor(memorySeries, width, height);
  const cpuArea = `0,${height} ${cpuPoints} ${width},${height}`;

  return (
    <section className="panel-card min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-4 px-5 pt-5 sm:px-6">
        <div>
          <h2 className="panel-title">Resource utilization</h2>
          <p className="mt-1 text-xs text-slate-500">Average across production services</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-blue-600" /> CPU
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-violet-400" /> Memory
          </span>
        </div>
      </div>
      <div className="px-3 pb-2 pt-5 sm:px-5">
        <div className="relative">
          <div className="chart-labels" aria-hidden="true">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>
          <svg
            className="h-[210px] w-full overflow-visible"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            role="img"
            aria-labelledby={`${id}-title ${id}-description`}
          >
            <title id={`${id}-title`}>CPU and memory utilization over 24 hours</title>
            <desc id={`${id}-description`}>
              CPU is currently at 61 percent and memory is at 54 percent.
            </desc>
            <defs>
              <linearGradient id={`${id}-gradient`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity=".16" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 0.25, 0.5, 0.75, 1].map((line) => (
              <line
                key={line}
                x1="0"
                y1={height * line}
                x2={width}
                y2={height * line}
                stroke="#e9edf4"
                strokeDasharray={line === 1 ? undefined : "3 5"}
              />
            ))}
            <polygon points={cpuArea} fill={`url(#${id}-gradient)`} />
            <polyline points={memoryPoints} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <polyline points={cpuPoints} fill="none" stroke="#2563eb" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="ml-10 mt-2 flex justify-between text-[10px] text-slate-400">
            <span>12 AM</span><span>4 AM</span><span>8 AM</span><span>12 PM</span><span>4 PM</span><span>8 PM</span><span>Now</span>
          </div>
        </div>
      </div>
    </section>
  );
}
