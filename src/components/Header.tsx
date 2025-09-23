'use client'

import Link from 'next/link'

interface HeaderProps {
  onLogMealClick: () => void
  onAuthClick: () => void
  isLoggedIn: boolean
  userEmail?: string
}

export default function Header({ onLogMealClick, onAuthClick, isLoggedIn, userEmail }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6 md:mb-8">
      <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity duration-200">
        <img src="/assets/logo.png" alt="Logo" className="w-8 h-8 md:w-10 md:h-10" />
        <img src="/assets/wordmark.png" alt="Food Goggles" className="h-8 md:h-12 w-auto" />
      </Link>
      
      <div className="flex items-center gap-2 md:gap-4">
        <div 
          className="flex flex-col items-center gap-0.5 md:gap-1 hover:scale-110 transition-transform duration-200 cursor-pointer"
          onClick={onLogMealClick}
        >
          <img src="/assets/hamburger.png" alt="Menu" className="w-8 h-8 md:w-10 md:h-10" />
          <span className="text-xs md:text-sm font-semibold font-inter px-2 md:px-4 py-0.5 bg-white rounded-full shadow-md" style={{color: 'rgba(31, 41, 55, var(--tw-text-opacity, 1))'}}>Log Meal</span>
        </div>
        
        <div 
          className="flex flex-col items-center gap-0.5 md:gap-1 hover:scale-110 transition-transform duration-200 cursor-pointer"
          onClick={onAuthClick}
        >
          <img src="/assets/goal.png" alt="Auth" className="w-8 h-8 md:w-10 md:h-10" />
          <span className="text-xs md:text-sm font-semibold font-inter px-2 md:px-4 py-0.5 bg-white rounded-full shadow-md" style={{color: 'rgba(31, 41, 55, var(--tw-text-opacity, 1))'}}>
            {isLoggedIn ? 'Log Out' : 'Log In'}
          </span>
        </div>
      </div>
    </div>
  )
}
