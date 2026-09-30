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

export const FILTERS = [
  ['all', 'ทั้งหมด'],
  ['active', 'ยังไม่เสร็จ'],
  ['done', 'เสร็จแล้ว'],
]

export const SEED_TODOS = [
  { id: 1, text: 'ส่งรายงานแล็บให้อาจารย์', done: false, priority: 'high' },
  { id: 2, text: 'อ่านบทที่ 5 วิชาโครงสร้างข้อมูล', done: false, priority: 'medium' },
  { id: 3, text: 'ซื้อของเข้าห้อง', done: true, priority: 'low' },
]
