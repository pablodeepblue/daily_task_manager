import { useMemo, useState } from "react";

type Category = "body" | "phd" | "tech" | "rest" | "admin" | "wind";

type Block = {
  id: string;
  title: string;
  category: Category;
  duration: number;
  notes: string[];
  minimum: string;
};

type Day = {
  name: string;
  start: number;
  blocks: Block[];
};

const categoryLabel: Record<Category, string> = {
  body: "Body",
  phd: "PhD",
  tech: "GitHub / Tech",
  rest: "Rest",
  admin: "Admin / Jobs",
  wind: "Wind down",
};

const categoryStyle: Record<Category, string> = {
  body: "border-emerald-500 text-emerald-700",
  phd: "border-sky-600 text-sky-700",
  tech: "border-violet-500 text-violet-700",
  rest: "border-amber-500 text-amber-700",
  admin: "border-slate-400 text-slate-600",
  wind: "border-indigo-700 text-indigo-700",
};

let nextId = 1;
const block = (
  title: string,
  category: Category,
  duration: number,
  notes: string[],
  minimum: string,
): Block => ({ id: `block-${nextId++}`, title, category, duration, notes, minimum });

const workday = (friday = false): Block[] => [
  block("Wake up and reset", "body", 30, ["Water, breakfast, 15–20 min outdoor light", "Get dressed, even at home"], "A glass of water and 5 minutes outside"),
  block("Move your body", "body", 60, ["Rotate strength, cardio, easy walk", "Finish feeling better, not punished"], "A 10-minute walk"),
  block("PhD deep work", "phd", 120, ["One deliverable only", "Hardest writing first"], "20 focused minutes"),
  block("Break", "rest", 30, ["Stretch, snack, step outside"], "Look out a window for 5 minutes"),
  block("GitHub and technical growth", "tech", 90, ["Improve one existing project", "README, demo, tests"], "20 minutes, one commit"),
  block("Lunch and real rest", "rest", 60, ["Eat away from your desk"], "Eat a real meal, sitting down"),
  block("Admin and job search", "admin", 75, ["Advisor emails, application tracker", "One job posting or outreach"], "Answer one email"),
  ...(friday ? [block("Weekly review", "admin", 20, ["Write down what you finished this week"], "Three bullet points")] : []),
  block("Shutdown ritual", "wind", 15, ["Write tomorrow’s one task", "Close tabs"], "One line about tomorrow"),
  block("Evening off", "rest", 330, ["Cook, friends, games, hobbies", "No application checking"], "One thing purely for enjoyment"),
  block("Wind down", "wind", 90, ["Dim lights, no portals"], "Phone away 30 min before bed"),
];

const initialDays: Day[] = [
  ["Mon", "Tue", "Wed", "Thu", "Fri"].map((name, index) => ({ name, start: 540, blocks: workday(index === 4) })),
  { name: "Sat", start: 600, blocks: [block("Wake up slowly", "body", 60, ["No alarm pressure"], "Water and daylight"), block("Fully off", "rest", 720, ["No applications, no GitHub"], "Do one thing you enjoy"), block("Wind down", "wind", 90, ["Dim lights, no portals"], "")] },
  { name: "Sun", start: 600, blocks: [block("Wake up slowly", "body", 60, ["No alarm pressure"], "Water and daylight"), block("Optional: walk or friend", "body", 60, ["Social contact that is not about applications"], ""), block("Optional: light GitHub", "tech", 30, ["Only if you feel like it"], ""), block("Rest of the day off", "rest", 540, ["Prep nothing for Monday"], "Skip it"), block("Wind down", "wind", 90, ["Dim lights, no portals"], "")] },
];

function formatTime(minutes: number) {
  const hour = Math.floor(minutes / 60) % 24;
  const minute = minutes % 60;
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${hours ? `${hours}h` : ""}${hours && remainder ? " " : ""}${remainder ? `${remainder}m` : ""}`;
}

export function WeekPlanner() {
  const today = (new Date().getDay() + 6) % 7;
  const [activeDay, setActiveDay] = useState(today);
  const [minimumMode, setMinimumMode] = useState(false);
  const [locked, setLocked] = useState(false);
  const [days, setDays] = useState(initialDays);
  const [done, setDone] = useState<Set<string>>(() => new Set());
  const active = days[activeDay];

  const completed = useMemo(
    () => active.blocks.filter(({ id }) => done.has(id)).length,
    [active.blocks, done],
  );

  function toggleDone(id: string) {
    setDone((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function moveBlock(index: number, direction: -1 | 1) {
    if (locked || index + direction < 0 || index + direction >= active.blocks.length) return;
    setDays((current) => current.map((day, dayIndex) => {
      if (dayIndex !== activeDay) return day;
      const blocks = [...day.blocks];
      [blocks[index], blocks[index + direction]] = [blocks[index + direction], blocks[index]];
      return { ...day, blocks };
    }));
  }

  return (
    <main className="min-h-screen bg-[#eef3f3] px-4 py-3 text-[#14303a] sm:px-6">
      <div className="mx-auto max-w-2xl">
        <header className="sticky top-0 z-10 -mx-4 border-b border-[#d3dfe0] bg-[#eef3f3]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Week Planner</h1>
            <div className="flex flex-wrap gap-2">
              <div className="overflow-hidden rounded-full border border-[#d3dfe0] bg-white">
                <button className={`px-3 py-1.5 text-sm ${!minimumMode ? "bg-[#14303a] text-white" : ""}`} onClick={() => setMinimumMode(false)}>Full</button>
                <button className={`px-3 py-1.5 text-sm ${minimumMode ? "bg-[#14303a] text-white" : ""}`} onClick={() => setMinimumMode(true)}>Minimum</button>
              </div>
              <button className="rounded-lg border border-[#d3dfe0] bg-white px-3 py-1.5 text-sm" onClick={() => setLocked(!locked)}>{locked ? "🔒 Locked" : "🔓 Lock"}</button>
            </div>
          </div>
          <div className="mt-3 flex gap-1 overflow-x-auto pb-1" role="tablist" aria-label="Day">
            {days.map((day, index) => <button key={day.name} role="tab" aria-selected={index === activeDay} onClick={() => setActiveDay(index)} className={`min-w-12 flex-1 rounded-lg border px-3 py-1.5 text-sm ${index === activeDay ? "border-[#14303a] bg-[#14303a] text-white" : "border-[#d3dfe0] bg-white"}`}>{day.name}</button>)}
          </div>
          <p className="mt-2 text-xs text-[#5b7580]">Pick a day. Lock freezes the plan so you can only tick things off.</p>
        </header>

        <section className="mt-4 rounded-xl bg-[#e3f0ee] p-3">
          <div className="mb-3 flex items-center justify-between">
            <div><h2 className="text-lg font-bold">{active.name}{activeDay === today ? " · today" : ""}</h2><p className="text-sm text-[#5b7580]">Starts {formatTime(active.start)} · ends {formatTime(active.start + active.blocks.reduce((sum, item) => sum + item.duration, 0))}</p></div>
            <span className="text-sm text-[#5b7580]">{completed}/{active.blocks.length} done</span>
          </div>
          <div className="space-y-2">
            {active.blocks.map((item, index) => {
              const start = active.start + active.blocks.slice(0, index).reduce((sum, current) => sum + current.duration, 0);
              const isDone = done.has(item.id);
              return <article key={item.id} className={`rounded-lg border border-[#d3dfe0] border-l-4 bg-white p-3 ${categoryStyle[item.category]} ${isDone ? "opacity-55" : ""}`}>
                <div className="flex items-start gap-3"><input aria-label={`Mark ${item.title} done`} type="checkbox" checked={isDone} onChange={() => toggleDone(item.id)} className="mt-1 size-4 accent-current" /><div className="min-w-0 flex-1"><div className="flex flex-wrap justify-between gap-x-3 text-xs font-semibold text-[#5b7580]"><span>{formatTime(start)} – {formatTime(start + item.duration)}</span><span>{categoryLabel[item.category]} · {formatDuration(item.duration)}</span></div><h3 className={`mt-1 font-semibold ${isDone ? "line-through" : ""}`}>{item.title}</h3>{minimumMode ? <p className="mt-2 rounded bg-[#fff1c9] px-2 py-1 text-sm text-[#5c4300]">Minimum: {item.minimum || "any small version counts."}</p> : item.notes.length > 0 ? <ul className="mt-2 list-disc space-y-0.5 pl-4 text-sm text-[#5b7580]">{item.notes.map((note) => <li key={note}>{note}</li>)}</ul> : null}</div>{!locked && <div className="flex gap-1"><button aria-label={`Move ${item.title} up`} disabled={index === 0} onClick={() => moveBlock(index, -1)} className="rounded border border-[#d3dfe0] px-2 py-1 disabled:opacity-30">↑</button><button aria-label={`Move ${item.title} down`} disabled={index === active.blocks.length - 1} onClick={() => moveBlock(index, 1)} className="rounded border border-[#d3dfe0] px-2 py-1 disabled:opacity-30">↓</button></div>}</div>
              </article>;
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
