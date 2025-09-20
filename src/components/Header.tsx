'use client'

interface HeaderProps {
  onLogMealClick: () => void
}

export default function Header({ onLogMealClick }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
        <img src="/assets/logo.png" alt="Logo" className="w-10 h-10" />
        <img src="/assets/wordmark.png" alt="Food Goggles" className="h-12 w-auto" />
      </div>
      <div 
        className="flex flex-col items-center gap-1 hover:scale-110 transition-transform duration-200 cursor-pointer"
        onClick={onLogMealClick}
      >
        <img src="/assets/hamburger.png" alt="Menu" className="w-10 h-10" />
        <span className="text-sm font-semibold font-inter px-4 py-0.5 bg-white rounded-full shadow-md" style={{color: 'rgba(31, 41, 55, var(--tw-text-opacity, 1))'}}>Log Meal</span>
      </div>
    </div>
  )
}
