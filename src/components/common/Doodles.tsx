interface DoodleProps {
  size?: number;
  color?: string;
  className?: string;
  opacity?: number;
}

export function DoodlePlane({ size = 48, color = 'currentColor', className = '', opacity = 1 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={{ opacity }} aria-hidden="true">
      <path d="M5 24 L43 9 L35 41 L22 29 L5 24Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 29 L26 42" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M22 29 L43 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3"/>
    </svg>
  );
}

export function DoodleCompass({ size = 44, color = 'currentColor', className = '', opacity = 1 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={{ opacity }} aria-hidden="true">
      <circle cx="22" cy="22" r="18" stroke={color} strokeWidth="1.5"/>
      {/* tick marks */}
      <path d="M22 4 L22 9 M22 35 L22 40 M4 22 L9 22 M35 22 L40 22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      {/* diagonal ticks */}
      <path d="M8.5 8.5 L11.5 11.5 M32.5 32.5 L35.5 35.5 M35.5 8.5 L32.5 11.5 M11.5 32.5 L8.5 35.5"
        stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      {/* North needle (solid) */}
      <path d="M22 8 L24.5 19 L22 22 L19.5 19 Z" fill={color}/>
      {/* South needle (outline) */}
      <path d="M22 36 L19.5 25 L22 22 L24.5 25 Z" stroke={color} strokeWidth="1.5"/>
      {/* Center */}
      <circle cx="22" cy="22" r="2.5" fill={color}/>
      {/* N label */}
      <text x="22" y="5.5" textAnchor="middle" fontSize="4.5" fill={color} fontFamily="sans-serif" fontWeight="bold" letterSpacing="0.02em">N</text>
    </svg>
  );
}

export function DoodleMountain({ size = 72, color = 'currentColor', className = '', opacity = 1 }: DoodleProps) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 72 44" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={{ opacity }} aria-hidden="true">
      <path d="M4 40 L20 10 L30 24 L40 8 L58 40" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* snow caps */}
      <path d="M17 15 L20 10 L23 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M37 13 L40 8 L43 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* extra distant peaks */}
      <path d="M52 40 L62 22 L70 40" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
    </svg>
  );
}

export function DoodleStar({ size = 28, color = 'currentColor', className = '', opacity = 1 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={{ opacity }} aria-hidden="true">
      <path d="M14 3 L14 25 M3 14 L25 14 M6 6 L22 22 M22 6 L6 22" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="14" cy="14" r="2.5" fill={color}/>
    </svg>
  );
}

export function DoodlePalmTree({ size = 52, color = 'currentColor', className = '', opacity = 1 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 56" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={{ opacity }} aria-hidden="true">
      {/* trunk */}
      <path d="M26 52 C24 44 22 36 24 28 C25 23 26 20 26 20" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {/* fronds */}
      <path d="M26 20 C18 14 8 12 4 6 C12 8 22 16 26 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M26 20 C22 10 24 2 28 -2 C30 8 28 16 26 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M26 20 C34 12 44 10 48 6 C42 12 32 18 26 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M26 20 C18 18 10 24 8 30 C16 24 22 20 26 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M26 20 C34 22 40 28 42 34 C36 26 28 22 26 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      {/* coconuts */}
      <circle cx="26" cy="20" r="2.5" fill={color} opacity="0.6"/>
    </svg>
  );
}

export function DoodleDotPath({ width = 140, color = 'currentColor', className = '', opacity = 1 }: { width?: number; color?: string; className?: string; opacity?: number }) {
  return (
    <svg width={width} height={36} viewBox="0 0 140 36" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={{ opacity }} aria-hidden="true">
      <path d="M8 28 C25 16 50 8 70 18 C90 28 115 12 130 6"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 6"/>
      {/* small pin at start */}
      <path d="M8 28 C8 24 4 20 8 16 C12 20 8 24 8 28Z" stroke={color} strokeWidth="1.2" fill="none"/>
      {/* plane at end */}
      <path d="M126 8 L136 2 L132 14 L128 10 Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function DoodleWave({ width = 120, color = 'currentColor', className = '', opacity = 1 }: { width?: number; color?: string; className?: string; opacity?: number }) {
  return (
    <svg width={width} height={20} viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={{ opacity }} aria-hidden="true">
      <path d="M4 10 Q16 4 28 10 Q40 16 52 10 Q64 4 76 10 Q88 16 100 10 Q112 4 118 8"
        stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

export function DoodleCircle({ size = 48, color = 'currentColor', className = '', opacity = 1 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={{ opacity }} aria-hidden="true">
      {/* rough hand-drawn circle using 4 arcs */}
      <path d="M24 4 C34 3 44 12 45 22 C46 33 38 44 26 45 C14 46 4 38 3 26 C2 14 12 5 24 4Z"
        stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
