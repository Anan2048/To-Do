import { useRef, useState } from 'react'
import { ClipboardList, Plus } from 'lucide-react'
import TodoItem from './TodoItem'
import { FILTERS, NEXT_PRIORITY, PRIORITIES, SEED_TODOS } from './constants'

export default function App() {
  const nextId = useRef(SEED_TODOS.length + 1)
  const [todos, setTodos] = useState(SEED_TODOS)
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [filter, setFilter] = useState('all')

  const add = () => {
    const t = text.trim()
    if (!t) return
    setTodos((ts) => [{ id: nextId.current++, text: t, done: false, priority }, ...ts])
    setText('')
  }
  const toggle = (id) => setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const del = (id) => setTodos((ts) => ts.filter((t) => t.id !== id))
  const edit = (id, v) => setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, text: v } : t)))
  const cycle = (id) =>
    setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, priority: NEXT_PRIORITY[t.priority] } : t)))
  const clearDone = () => setTodos((ts) => ts.filter((t) => !t.done))

  const remaining = todos.filter((t) => !t.done).length
  const doneCount = todos.length - remaining
  const shown = todos.filter((t) => (filter === 'all' ? true : filter === 'active' ? !t.done : t.done))
  const emptyMsg =
    todos.length === 0
      ? 'ยังไม่มีรายการ เพิ่มงานแรกของคุณด้านบน'
      : filter === 'active'
      ? 'ไม่มีงานที่ค้างอยู่'
      : 'ยังไม่มีงานที่เสร็จ'

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">สิ่งที่ต้องทำ</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        ดับเบิลคลิกที่ข้อความเพื่อแก้ไข แตะป้ายเพื่อเปลี่ยนความสำคัญ
      </p>

      <section className="mt-6 rounded-2xl bg-white dark:bg-slate-800 shadow-md ring-1 ring-slate-100 dark:ring-slate-700 p-4">
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
        <div className="mt-3 flex items-center gap-2 text-sm">
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
      </section>

      <div role="tablist" className="mt-6 grid grid-cols-3 gap-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 p-1">
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
          <TodoItem key={t.id} todo={t} onToggle={toggle} onDelete={del} onEdit={edit} onCycle={cycle} />
        ))}
      </ul>

      {shown.length === 0 && (
        <div className="mt-2 flex flex-col items-center gap-2 rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 py-10 text-slate-400">
          <ClipboardList size={36} strokeWidth={1.5} />
          <p className="text-sm">{emptyMsg}</p>
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
    </main>
  )
}
