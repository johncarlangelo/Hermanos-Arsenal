import React from 'react';
import { motion } from 'motion/react';

export default function ToggleSwitch({ checked, onChange, colorClass = 'bg-theme-primary' }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="sr-only" 
        checked={checked} 
        onChange={onChange} 
      />
      <div 
        className={`w-[60px] h-[30px] box-content rounded-[20px] overflow-hidden flex items-center border-[4px] border-transparent transition-colors duration-300 shadow-[inset_0_0_10px_rgba(0,0,0,0.25)] ${
          checked ? colorClass : 'bg-theme-border/50'
        }`}
      >
        <motion.div 
          initial={false}
          animate={{ x: checked ? 30 : -30 }}
          whileTap={{ x: 0 }}
          transition={{ type: "tween", duration: 0.3 }}
          className="w-full h-full bg-white rounded-[20px] shadow-[0_0_10px_3px_rgba(0,0,0,0.25)]"
        />
      </div>
    </label>
  );
}
