import { Layers } from 'lucide-react'
import { CATEGORIES } from './constants'

export default function CategorySidebar({ todos, selected, onSelect }) {
  const items = [
    { key: 'all', label: 'ทั้งหมด', count: todos.length, dot: null },
    ...Object.entries(CATEGORIES).map(([key, c]) => ({
      key,
      label: c.label,
      dot: c.dot,
      count: todos.filter((t) => t.category === key).length,
    })),
  ]

  return (
    <aside className="md:sticky md:top-6" aria-label="กรองตามหมวดหมู่">
      <h2 className="hidden md:block mb-2 px-2 text-sm font-semibold text-slate-500 dark:text-slate-400">หมวดหมู่</h2>
      <div className="flex md:flex-col gap-1.5 overflow-x-auto pb-1 md:pb-0 md:rounded-2xl md:bg-white md:dark:bg-slate-800 md:shadow-sm md:ring-1 md:ring-slate-100 md:dark:ring-slate-700 md:p-2">
        {items.map((it) => {
          const active = selected === it.key
          return (
            <button
              key={it.key}
              onClick={() => onSelect(it.key)}
              aria-pressed={active}
              className={`shrink-0 flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white md:bg-transparent dark:bg-slate-800 md:dark:bg-transparent text-slate-700 dark:text-slate-200 ring-1 ring-slate-100 dark:ring-slate-700 md:ring-0 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {it.dot ? <span className={`h-2.5 w-2.5 rounded-full ${it.dot}`} /> : <Layers size={14} />}
              <span className="flex-1 text-left">{it.label}</span>
              <span
                className={`min-w-[1.5rem] rounded-full px-1.5 text-center text-xs ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                }`}
              >
                {it.count}
              </span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
