import { Check } from 'lucide-react';

export default function Checkbox({ checked, onChange, className = "", colorClass = "text-theme-primary" }) {
  return (
    <label className={`relative flex items-center justify-center cursor-pointer ${className}`}>
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange}
        className="peer sr-only" 
      />
      <div className={`w-4 h-4 flex items-center justify-center rounded-[4px] border transition-all ${
        checked 
          ? `bg-current border-current ${colorClass}` 
          : 'border-theme-border/60 bg-theme-background/50 peer-hover:border-theme-text-secondary/60'
      }`}>
        {checked && <Check size={12} strokeWidth={4} className="text-white" />}
      </div>
    </label>
  );
}
