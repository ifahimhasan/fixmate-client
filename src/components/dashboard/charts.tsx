"use client";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const tooltipStyle = {
  borderRadius: 13,
  border: "1px solid var(--line)",
  background: "var(--surface)",
  color: "var(--ink)",
  fontFamily: "var(--font-sans)",
  fontSize: 13,
};

export function MoneyArea({ data, dataKey = "amount", label = "Amount" }: { data: { month: string; amount: number }[]; dataKey?: string; label?: string }) {
  return (
    <div className="h-[260px] w-full" role="img" aria-label={`${label} over the last 6 months`}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="fmArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5b3df5" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#5b3df5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--line)" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--muted)", fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted)", fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${v}`, label]} />
          <Area type="monotone" dataKey={dataKey} stroke="#5b3df5" strokeWidth={3} fill="url(#fmArea)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthBars({ data, label = "Earnings" }: { data: { month: string; amount: number }[]; label?: string }) {
  const max = Math.max(...data.map((d) => d.amount), 0);
  return (
    <div className="h-[260px] w-full" role="img" aria-label={`${label} by month`}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--line)" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--muted)", fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted)", fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--brand-soft)" }} formatter={(v) => [`$${v}`, label]} />
          <Bar dataKey="amount" radius={[10, 10, 4, 4]} maxBarSize={48}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.amount === max && max > 0 ? "#5b3df5" : "#c9c0ff"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  requested: "#3b6fe8",
  accepted: "#6366f1",
  "in-progress": "#f59e0b",
  completed: "#12b886",
  rejected: "#ef4444",
  cancelled: "#9ca3af",
};
const STATUS_LABEL: Record<string, string> = {
  requested: "Requested",
  accepted: "Accepted",
  "in-progress": "In progress",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export function StatusDonut({ counts }: { counts: Record<string, number> }) {
  const data = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: STATUS_LABEL[k] ?? k, key: k, value: v }));
  const total = data.reduce((a, b) => a + b.value, 0);
  if (!total) return <p className="py-10 text-center text-sm text-muted">No jobs yet.</p>;
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative h-[180px] w-full sm:w-[180px]" role="img" aria-label="Jobs by status">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={55} outerRadius={82} paddingAngle={3} stroke="none">
              {data.map((d) => (
                <Cell key={d.key} fill={STATUS_COLORS[d.key]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <span className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <span>
            <span className="block text-2xl font-bold">{total}</span>
            <span className="text-xs text-muted">jobs</span>
          </span>
        </span>
      </div>
      <ul className="flex flex-1 flex-col gap-2.5">
        {data.map((d) => (
          <li key={d.key} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-[4px]" style={{ background: STATUS_COLORS[d.key] }} />
              {d.name}
            </span>
            <span className="font-bold">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CategoryBars({ data }: { data: { category: string; count: number }[] }) {
  if (!data.length) return <p className="py-10 text-center text-sm text-muted">No bookings yet.</p>;
  const max = Math.max(...data.map((d) => d.count));
  const colors = ["#5b3df5", "#12b886", "#2ba6d9", "#e2558e", "#0e7490", "#f59e0b", "#6366f1"];
  return (
    <ul className="flex flex-col gap-4">
      {data.map((d, i) => (
        <li key={d.category} className="flex flex-col gap-2">
          <span className="flex justify-between text-sm">
            <span className="font-bold">{d.category}</span>
            <span className="text-muted">{d.count}</span>
          </span>
          <span className="h-2.5 overflow-hidden rounded-full bg-line">
            <span className="block h-2.5 rounded-full" style={{ width: `${(d.count / max) * 100}%`, background: colors[i % colors.length] }} />
          </span>
        </li>
      ))}
    </ul>
  );
}
