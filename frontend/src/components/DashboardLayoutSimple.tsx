import type { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
          </div>
          <nav className="mt-6">
            <div className="px-3">
              <div className="space-y-1">
                <a
                  href="/dashboard"
                  className="bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-50 hover:text-blue-700 group border-r-2 px-3 py-2 flex items-center text-sm font-medium"
                >
                  Overview
                </a>
                <a
                  href="/courses"
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group px-3 py-2 flex items-center text-sm font-medium"
                >
                  Courses
                </a>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
