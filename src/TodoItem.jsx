import { useEffect, useRef, useState } from 'react'
import { CalendarDays, Check, Trash2, X } from 'lucide-react'
import { CATEGORIES, DUE_STYLES, NO_CATEGORY_TAG, PRIORITIES, dueStatus, formatDue } from './constants'

export default function TodoItem({ todo, onToggle, onDelete, onEdit, onCycle, onDue, onCategory }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const [leaving, setLeaving] = useState(false)
  const inputRef = useRef(null)
  const dueRef = useRef(null)
  const pr = PRIORITIES[todo.priority]

  const status = dueStatus(todo.dueDate)
  // Finished tasks never show as overdue / today
  const dueTone = todo.done && todo.dueDate ? 'later' : status
  const dueLabel = !todo.dueDate
    ? 'กำหนดวันที่'
    : todo.done
    ? formatDue(todo.dueDate)
    : status === 'overdue'
    ? `เลยกำหนด ${formatDue(todo.dueDate)}`
    : status === 'today'
    ? 'วันนี้'
    : formatDue(todo.dueDate)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const save = () => {
    const t = draft.trim()
    if (t && t !== todo.text) onEdit(todo.id, t)
    else setDraft(todo.text)
    setEditing(false)
  }

  const remove = () => {
    setLeaving(true)
    setTimeout(() => onDelete(todo.id), 250)
  }

  const openPicker = () => {
    const el = dueRef.current
    if (!el) return
    try {
      el.showPicker()
    } catch {
      el.focus()
      el.click()
    }
  }

  const cat = todo.category ? CATEGORIES[todo.category] : null

  return (
    <li className={`todo entering mb-2.5 ${leaving ? 'leaving' : ''}`}>
      <div className="relative flex items-start gap-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 pl-4 pr-2 py-3 overflow-hidden">
        <span className={`absolute left-0 top-0 bottom-0 w-1 ${pr.bar}`} />

        <button
          onClick={() => onToggle(todo.id)}
          aria-label={todo.done ? 'ทำเครื่องหมายว่ายังไม่เสร็จ' : 'ทำเครื่องหมายว่าเสร็จแล้ว'}
          className={`mt-0.5 shrink-0 h-6 w-6 rounded-md border-2 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
            todo.done
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-slate-300 dark:border-slate-500 hover:border-indigo-400'
          }`}
        >
          {todo.done && <Check size={14} strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={save}
              onKeyDown={(e) => {
                if (e.key === 'Enter') save()
                if (e.key === 'Escape') {
                  setDraft(todo.text)
                  setEditing(false)
                }
              }}
              className="w-full rounded-md border border-indigo-300 bg-white dark:bg-slate-900 dark:text-slate-100 px-2 py-1 text-base outline-none focus:ring-2 focus:ring-indigo-300"
            />
          ) : (
            <p
              onDoubleClick={() => {
                setDraft(todo.text)
                setEditing(true)
              }}
              title="ดับเบิลคลิกเพื่อแก้ไข"
              className={`pt-0.5 break-words cursor-text select-none ${
                todo.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              {todo.text}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => onCycle(todo.id)}
              title="แตะเพื่อเปลี่ยนความสำคัญ"
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${pr.badge}`}
            >
              {pr.label}
            </button>

            <span className="relative inline-flex items-center">
              <button
                onClick={openPicker}
                title="เลือกวันที่กำหนดส่ง"
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${DUE_STYLES[dueTone]}`}
              >
                <CalendarDays size={12} />
                {dueLabel}
              </button>
              <input
                ref={dueRef}
                type="date"
                value={todo.dueDate}
                onChange={(e) => onDue(todo.id, e.target.value)}
                tabIndex={-1}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
              />
              {todo.dueDate && (
                <button
                  onClick={() => onDue(todo.id, '')}
                  aria-label="ล้างวันที่กำหนดส่ง"
                  className="ml-0.5 rounded-full p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X size={12} />
                </button>
              )}
            </span>

            <select
              value={todo.category || ''}
              onChange={(e) => onCategory(todo.id, e.target.value || null)}
              aria-label="หมวดหมู่"
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset border-0 cursor-pointer outline-none focus-visible:ring-2 ${
                cat ? cat.tag : NO_CATEGORY_TAG
              }`}
            >
              <option value="">ไม่มีหมวด</option>
              {Object.entries(CATEGORIES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={remove}
          aria-label="ลบรายการ"
          className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </li>
  )
}
