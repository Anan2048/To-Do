import { dueStatus } from './constants'

export default function StatsCard({ todos }) {
  const total = todos.length
  const done = todos.filter((t) => t.done).length
  const overdue = todos.filter((t) => !t.done && dueStatus(t.dueDate) === 'overdue').length
  const active = total - done - overdue
  const pct = total ? Math.round((done / total) * 100) : 0

  const segments = [
    { label: 'เสร็จแล้ว', value: done, stroke: 'stroke-emerald-500', dot: 'bg-emerald-500' },
    { label: 'ยังไม่เสร็จ', value: active, stroke: 'stroke-indigo-400', dot: 'bg-indigo-400' },
    { label: 'เลยกำหนด', value: overdue, stroke: 'stroke-red-500', dot: 'bg-red-500' },
  ]

  // circle radius chosen so circumference = 100 → dash lengths are percentages
  let offset = 25 // start at 12 o'clock
  const arcs = segments.map((s) => {
    const len = total ? (s.value / total) * 100 : 0
    const arc = { ...s, len, offset }
    offset -= len
    return arc
  })

  return (
    <section
      aria-label="สถิติ"
      className="mt-4 flex items-center gap-4 sm:gap-6 rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 p-4"
    >
      <div className="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 36 36" className="h-full w-full" role="img" aria-label={`เสร็จแล้ว ${pct}%`}>
          <circle cx="18" cy="18" r="15.9155" fill="none" strokeWidth="4" className="stroke-slate-200 dark:stroke-slate-700" />
          {arcs.map(
            (a) =>
              a.len > 0 && (
                <circle
                  key={a.label}
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  strokeWidth="4"
                  className={a.stroke}
                  strokeDasharray={`${a.len} ${100 - a.len}`}
                  strokeDashoffset={a.offset}
                />
              )
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-tight">
          <span className="text-lg font-bold text-slate-900 dark:text-white">{pct}%</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">เสร็จแล้ว</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          งานทั้งหมด <b className="text-base text-slate-900 dark:text-white">{total}</b> งาน
        </p>
        <ul className="mt-2 space-y-1 text-sm">
          {segments.map((s) => (
            <li key={s.label} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
              <span className="flex-1">{s.label}</span>
              <b className="text-slate-900 dark:text-white">{s.value}</b>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
