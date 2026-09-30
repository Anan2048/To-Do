import { useRef, useState } from 'react'
import { CalendarDays, ClipboardList, Plus, Search, X } from 'lucide-react'
import TodoItem from './TodoItem'
import CategorySidebar from './CategorySidebar'
import StatsCard from './StatsCard'
import { CATEGORIES, FILTERS, NEXT_PRIORITY, PRIORITIES, SEED_TODOS } from './constants'

export default function App() {
  const nextId = useRef(SEED_TODOS.length + 1)
  const [todos, setTodos] = useState(SEED_TODOS)
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState(null)
  const [filter, setFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')
  const [query, setQuery] = useState('')

  const add = () => {
    const t = text.trim()
    if (!t) return
    setTodos((ts) => [{ id: nextId.current++, text: t, done: false, priority, dueDate, category }, ...ts])
    setText('')
    setDueDate('')
  }
  const patch = (id, changes) => setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, ...changes } : t)))
  const toggle = (id) => setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const del = (id) => setTodos((ts) => ts.filter((t) => t.id !== id))
  const edit = (id, v) => patch(id, { text: v })
  const cycle = (id) =>
    setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, priority: NEXT_PRIORITY[t.priority] } : t)))
  const setDue = (id, v) => patch(id, { dueDate: v })
  const setCat = (id, v) => patch(id, { category: v })
  const clearDone = () => setTodos((ts) => ts.filter((t) => !t.done))

  const q = query.trim().toLowerCase()
  const remaining = todos.filter((t) => !t.done).length
  const doneCount = todos.length - remaining
  const shown = todos.filter(
    (t) =>
      (filter === 'all' ? true : filter === 'active' ? !t.done : t.done) &&
      (catFilter === 'all' ? true : t.category === catFilter) &&
      (!q || t.text.toLowerCase().includes(q))
  )

  const emptyMsg =
    todos.length === 0
      ? 'ยังไม่มีรายการ เพิ่มงานแรกของคุณด้านบน'
      : q
      ? `ไม่พบงานที่ตรงกับ "${query.trim()}"`
      : catFilter !== 'all' && filter === 'all'
      ? 'ยังไม่มีงานในหมวดนี้'
      : filter === 'active'
      ? 'ไม่มีงานที่ค้างอยู่'
      : 'ยังไม่มีงานที่เสร็จ'

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">สิ่งที่ต้องทำ</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        ดับเบิลคลิกที่ข้อความเพื่อแก้ไข แตะป้ายเพื่อเปลี่ยนความสำคัญ วันที่ หรือหมวดหมู่
      </p>

      <div className="mt-6 grid gap-4 md:gap-6 md:grid-cols-[13rem_minmax(0,1fr)] md:items-start">
        <CategorySidebar todos={todos} selected={catFilter} onSelect={setCatFilter} />

        <div className="min-w-0">
          {/* Add form */}
          <section className="rounded-2xl bg-white dark:bg-slate-800 shadow-md ring-1 ring-slate-100 dark:ring-slate-700 p-4">
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && add()}
                placeholder="เพิ่มงานใหม่..."
                aria-label="งานใหม่"
                className="flex-1 min-w-0 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-slate-100 px-3.5 py-2.5 text-base outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/30"
              />
              <button
                onClick={add}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition px-4 py-2.5 text-white font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">เพิ่ม</span>
                <span className="sr-only sm:hidden">เพิ่ม</span>
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400">ความสำคัญ</span>
                {Object.entries(PRIORITIES).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => setPriority(k)}
                    aria-pressed={priority === k}
                    className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition ${v.badge} ${
                      priority === k ? 'ring-2 scale-105' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <CalendarDays size={16} />
                <span>กำหนดส่ง</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-slate-100 px-2 py-1 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/30"
                />
              </label>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-slate-500 dark:text-slate-400">หมวดหมู่</span>
              {Object.entries(CATEGORIES).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setCategory(category === k ? null : k)}
                  aria-pressed={category === k}
                  className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition ${v.tag} ${
                    category === k ? 'ring-2 scale-105' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </section>

          <StatsCard todos={todos} />

          {/* Search */}
          <div className="relative mt-4">
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหางาน..."
              aria-label="ค้นหางาน"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-100 pl-10 pr-10 py-2.5 text-base outline-none shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/30"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="ล้างคำค้นหา"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Status tabs */}
          <div role="tablist" className="mt-4 grid grid-cols-3 gap-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 p-1">
            {FILTERS.map(([k, label]) => (
              <button
                key={k}
                role="tab"
                aria-selected={filter === k}
                onClick={() => setFilter(k)}
                className={`rounded-lg py-2 text-sm font-medium transition ${
                  filter === k
                    ? 'bg-white dark:bg-slate-600 text-indigo-700 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <ul className="mt-4">
            {shown.map((t) => (
              <TodoItem
                key={t.id}
                todo={t}
                onToggle={toggle}
                onDelete={del}
                onEdit={edit}
                onCycle={cycle}
                onDue={setDue}
                onCategory={setCat}
              />
            ))}
          </ul>

          {shown.length === 0 && (
            <div className="mt-2 flex flex-col items-center gap-2 rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 py-10 px-4 text-center text-slate-400">
              {q ? <Search size={36} strokeWidth={1.5} /> : <ClipboardList size={36} strokeWidth={1.5} />}
              <p className="text-sm break-words">{emptyMsg}</p>
            </div>
          )}

          <footer className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>
              เหลืออีก <b className="text-slate-900 dark:text-white">{remaining}</b> งาน
            </span>
            <button
              onClick={clearDone}
              disabled={doneCount === 0}
              className="rounded-lg px-3 py-1.5 font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition"
            >
              ล้างที่เสร็จแล้ว{doneCount > 0 ? ` (${doneCount})` : ''}
            </button>
          </footer>
        </div>
      </div>
    </main>
  )
}
