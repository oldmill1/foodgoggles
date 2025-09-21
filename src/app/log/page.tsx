'use client'

import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import Link from 'next/link'

interface User {
  id: string
  email: string
}

interface LogEntry {
  id: string
  slugId: string
  calories: number
  fats: number
  sugars: number
  carbohydrates: number
  proteins: number
  notes: string
  slug: string
  timestamp: string
}

interface PaginationInfo {
  total: number
  limit: number
  offset: number
  hasMore: boolean
  hasPrevious: boolean
}

export default function LogPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoadingPage, setIsLoadingPage] = useState(false)
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  useEffect(() => {
    if (user) {
      setIsLoadingInitialData(true)
      fetchLogEntries(0)
    }
  }, [user])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error('Error checking auth status:', error)
      setUser(null)
    } finally {
      setAuthChecked(true)
      setIsLoading(false)
    }
  }

  const fetchLogEntries = async (page: number) => {
    if (!user) return
    
    setIsLoadingPage(true)
    try {
      const limit = 10
      const offset = page * limit
      const response = await fetch(`/api/logs/recent?userId=${user.id}&limit=${limit}&offset=${offset}`)
      const data = await response.json()
      setLogEntries(data.logEntries || [])
      setPagination(data.pagination || null)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching log entries:', error)
    } finally {
      setIsLoadingPage(false)
      setIsLoadingInitialData(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    fetchLogEntries(newPage)
  }

  const handleLogMealClick = () => {
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }
    setIsLogModalOpen(true)
  }

  const handleAuthClick = () => {
    if (user) {
      handleLogout()
    } else {
      setIsLoginModalOpen(true)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/login', { method: 'DELETE' })
      setUser(null)
      setLogEntries([])
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(timestamp))
  }

  const formatMealName = (slug: string): string => {
    // Convert "turkey-avocado-wrap-mixed-greens" to "Turkey Avocado Wrap Mixed Greens"
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const filteredLogEntries = logEntries.filter(entry =>
    entry.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.notes.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const PaginationControls = () => {
    if (!pagination || pagination.total <= pagination.limit) return null

    const totalPages = Math.ceil(pagination.total / pagination.limit)
    const currentPageNum = currentPage + 1

    return (
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing {currentPage * pagination.limit + 1} to {Math.min((currentPage + 1) * pagination.limit, pagination.total)} of {pagination.total} entries
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrevious || isLoadingPage}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPageNum <= 3) {
                pageNum = i + 1
              } else if (currentPageNum >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPageNum - 2 + i
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum - 1)}
                  disabled={isLoadingPage}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pageNum === currentPageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasMore || isLoadingPage}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen" style={{backgroundColor: '#fefbf7'}}>
        <div className="text-center">
          <img src="/assets/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto min-w-0">
        <Header 
          onLogMealClick={handleLogMealClick} 
          onAuthClick={handleAuthClick}
          isLoggedIn={!!user}
          userEmail={user?.email}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* First Column - Log History */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Logs</h2>
              
              {!user && authChecked ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Please log in to view your meal history</p>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Log In
                  </button>
                </div>
              ) : user && logEntries.length === 0 && !isLoadingPage && !isLoadingInitialData ? (
                <div className="text-center py-8">
                  <img src="/assets/hamburger.png" alt="No meals" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-600 mb-4">No meals logged yet</p>
                  <button
                    onClick={handleLogMealClick}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Log Your First Meal
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {isLoadingPage || isLoadingInitialData ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading logs...</p>
                    </div>
                  ) : filteredLogEntries.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No logs found matching your search</p>
                    </div>
                  ) : (
                    <>
                      {filteredLogEntries.map((entry) => (
                        <Link
                          key={entry.id}
                          href={`/logs/${entry.slugId}`}
                          className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg">{formatMealName(entry.slug)}</h3>
                            <span className="text-sm text-gray-500">{formatTimestamp(entry.timestamp)}</span>
                          </div>
                          <div className="flex gap-4 text-sm text-gray-600 mb-2">
                            <span>🔥 {entry.calories} cal</span>
                            <span>💪 {entry.proteins}g protein</span>
                            <span>⚡ {entry.carbohydrates}g carbs</span>
                          </div>
                          {entry.notes && (
                            <p className="text-sm text-gray-600 line-clamp-2">{entry.notes}</p>
                          )}
                        </Link>
                      ))}
                      <PaginationControls />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Second Column - Search */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Search Logs</h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by meal name or notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute right-3 top-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                {searchQuery && (
                  <div className="text-sm text-gray-600">
                    {filteredLogEntries.length} result{filteredLogEntries.length !== 1 ? "s" : ""} found
                    {pagination && (
                      <span className="ml-2 text-gray-400">
                        (of {pagination.total} total entries)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleLogMealClick}
                  className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <img src="/assets/hamburger.png" alt="Log Meal" className="w-6 h-6" />
                  <span className="font-medium text-gray-900">Log New Meal</span>
                </button>
                
                <Link
                  href="/"
                  className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <img src="/assets/logo.png" alt="Dashboard" className="w-6 h-6" />
                  <span className="font-medium text-gray-900">Back to Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
