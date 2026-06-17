import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'category';
  size?: 'sm' | 'md';
  className?: string;
}

const variantClasses = {
  default:  'bg-[#F0E4D7] text-[#8A7060] border border-[#E8D5C4]',
  primary:  'bg-[#D6E4F0] text-[#3D6089] border border-[#B8D0E8]',
  accent:   'bg-[#FDEAE3] text-[#C44D27] border border-[#F4C4B0]',
  success:  'bg-[#E4F4EC] text-[#3D8B60] border border-[#B8DFC8]',
  warning:  'bg-[#FEF3E8] text-[#A06020] border border-[#F4CEAD]',
  category: 'bg-[#EDE8F8] text-[#5040A0] border border-[#D0C8F0]',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
}
