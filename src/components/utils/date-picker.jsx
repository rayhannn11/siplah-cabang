import { Calendar } from "lucide-react";

export default function DatePicker({ date, onChange }) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="relative">
        <label className="block text-sm font-medium">Tanggal</label>
        <input
          type="date"
          value={date}
          onChange={(e) => onChange(e.target.value)}
          className="input input-bordered input-sm bg-white text-slate-800 dark:bg-slate-800 dark:text-white border-slate-300 dark:border-slate-600 appearance-none pr-4"
        />
        <Calendar className="absolute right-3 top-7 w-4 h-4 text-white pointer-events-none hidden dark:block" />
      </div>
    </div>
  );
}
