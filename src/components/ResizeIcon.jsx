export default function ResizeIcon({ size = 16, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      {/* Three diagonal lines, getting progressively shorter */}
      <line x1="4" y1="20" x2="20" y2="4" />
      <line x1="10" y1="20" x2="20" y2="10" />
      <line x1="16" y1="20" x2="20" y2="16" />
    </svg>
  );
}
