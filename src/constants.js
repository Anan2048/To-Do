export const PRIORITIES = {
  low: {
    label: 'ต่ำ',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
    bar: 'bg-emerald-400',
  },
  medium: {
    label: 'กลาง',
    badge: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
    bar: 'bg-amber-400',
  },
  high: {
    label: 'สูง',
    badge: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30',
    bar: 'bg-red-500',
  },
}

export const NEXT_PRIORITY = { low: 'medium', medium: 'high', high: 'low' }

export const CATEGORIES = {
  work: {
    label: 'งาน',
    tag: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/30',
    dot: 'bg-sky-500',
  },
  personal: {
    label: 'ส่วนตัว',
    tag: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/30',
    dot: 'bg-violet-500',
  },
  shopping: {
    label: 'ช้อปปิ้ง',
    tag: 'bg-pink-50 text-pink-700 ring-pink-200 dark:bg-pink-500/10 dark:text-pink-300 dark:ring-pink-500/30',
    dot: 'bg-pink-500',
  },
  health: {
    label: 'สุขภาพ',
    tag: 'bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-500/30',
    dot: 'bg-teal-500',
  },
}
export const NO_CATEGORY_TAG =
  'bg-slate-50 text-slate-500 ring-slate-200 dark:bg-slate-700/50 dark:text-slate-400 dark:ring-slate-600'

export const DUE_STYLES = {
  overdue: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30',
  today: 'bg-yellow-100 text-yellow-800 ring-yellow-300 dark:bg-yellow-500/10 dark:text-yellow-300 dark:ring-yellow-500/30',
  later: 'bg-slate-50 text-slate-600 ring-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:ring-slate-600',
  none: 'bg-slate-50 text-slate-400 ring-slate-200 dark:bg-slate-700/50 dark:text-slate-400 dark:ring-slate-600',
}

export const FILTERS = [
  ['all', 'ทั้งหมด'],
  ['active', 'ยังไม่เสร็จ'],
  ['done', 'เสร็จแล้ว'],
]

/* ---------- date helpers (local time, YYYY-MM-DD strings) ---------- */
const pad = (n) => String(n).padStart(2, '0')
export const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const todayISO = () => toISO(new Date())
export const offsetISO = (days) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return toISO(d)
}
export const dueStatus = (iso) => {
  if (!iso) return 'none'
  const t = todayISO()
  return iso < t ? 'overdue' : iso === t ? 'today' : 'later'
}
export const formatDue = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })

export const SEED_TODOS = [
  { id: 1, text: 'ส่งรายงานแล็บให้อาจารย์', done: false, priority: 'high', dueDate: offsetISO(0), category: 'work' },
  { id: 2, text: 'อ่านบทที่ 5 วิชาโครงสร้างข้อมูล', done: false, priority: 'medium', dueDate: offsetISO(-1), category: 'work' },
  { id: 3, text: 'ซื้อของเข้าห้อง', done: true, priority: 'low', dueDate: '', category: 'shopping' },
  { id: 4, text: 'วิ่งสวนสาธารณะ 30 นาที', done: false, priority: 'low', dueDate: offsetISO(2), category: 'health' },
  { id: 5, text: 'โทรหาที่บ้าน', done: false, priority: 'medium', dueDate: '', category: 'personal' },
]
