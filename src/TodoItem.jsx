import { useEffect, useRef, useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import { PRIORITIES } from './constants'

export default function TodoItem({ todo, onToggle, onDelete, onEdit, onCycle }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const [leaving, setLeaving] = useState(false)
  const inputRef = useRef(null)
  const pr = PRIORITIES[todo.priority]

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

  return (
    <li className={`todo entering mb-2.5 ${leaving ? 'leaving' : ''}`}>
      <div className="relative flex items-center gap-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 pl-4 pr-2 py-3 overflow-hidden">
        <span className={`absolute left-0 top-0 bottom-0 w-1 ${pr.bar}`} />

        <button
          onClick={() => onToggle(todo.id)}
          aria-label={todo.done ? 'ทำเครื่องหมายว่ายังไม่เสร็จ' : 'ทำเครื่องหมายว่าเสร็จแล้ว'}
          className={`shrink-0 h-6 w-6 rounded-md border-2 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
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
              className={`break-words cursor-text select-none ${
                todo.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              {todo.text}
            </p>
          )}
        </div>

        <button
          onClick={() => onCycle(todo.id)}
          title="แตะเพื่อเปลี่ยนความสำคัญ"
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${pr.badge}`}
        >
          {pr.label}
        </button>

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
