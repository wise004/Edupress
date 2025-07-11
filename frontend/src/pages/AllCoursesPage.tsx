import { useState, useEffect } from 'react'
import { Search, Grid, List } from 'lucide-react'
import CourseCard from '../components/CourseCard'
import { CourseAPI, CategoryAPI } from '../services/api'
import type { Course } from '../types'
import { useTranslation } from 'react-i18next'

const AllCoursesPage = () => {
  const { t } = useTranslation()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedPrice, setSelectedPrice] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [loading, setLoading] = useState(true)
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const coursesPerPage = 12

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Load courses and categories in parallel
        const [coursesData, categoriesData] = await Promise.all([
          CourseAPI.getAllCourses(),
          CategoryAPI.getAllCategories()
        ])
        
        setAllCourses(coursesData.content || coursesData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Failed to load courses:', error)
        setAllCourses([])
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const searchCourses = async () => {
      if (searchTerm.trim()) {
        try {
          const searchResults = await CourseAPI.searchCourses(searchTerm)
          setAllCourses(searchResults.content || searchResults)
        } catch (error) {
          console.error('Search failed:', error)
        }
      }
    }

    const debounceTimer = setTimeout(searchCourses, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  // Filter and sort courses
  useEffect(() => {
    let filtered = [...allCourses]

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => 
        course.category === selectedCategory
      )
    }

    // Apply level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel)
    }

    // Apply price filter
    if (selectedPrice !== 'all') {
      if (selectedPrice === 'free') {
        filtered = filtered.filter(course => course.isFree)
      } else if (selectedPrice === 'paid') {
        filtered = filtered.filter(course => !course.isFree)
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        // Since we don't have createdAt, sort by id (newer courses likely have higher IDs)
        filtered.sort((a, b) => Number(b.id) - Number(a.id))
        break
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'rating':
        filtered.sort((a, b) => (b.averageRating || b.rating || 0) - (a.averageRating || a.rating || 0))
        break
      case 'popular':
      default:
        filtered.sort((a, b) => (b.enrollmentCount || b.students || 0) - (a.enrollmentCount || a.students || 0))
        break
    }

    setFilteredCourses(filtered)
    setTotalPages(Math.ceil(filtered.length / coursesPerPage))
    setCurrentPage(1) // Reset to first page when filters change
  }, [allCourses, searchTerm, selectedCategory, selectedLevel, selectedPrice, sortBy, coursesPerPage])

  // Get courses for current page
  const getCurrentPageCourses = () => {
    const startIndex = (currentPage - 1) * coursesPerPage
    const endIndex = startIndex + coursesPerPage
    return filteredCourses.slice(startIndex, endIndex)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const levels = [
    { value: 'all', label: t('allLevels') },
    { value: 'Beginner', label: t('beginner') },
    { value: 'Intermediate', label: t('intermediate') },
    { value: 'Advanced', label: t('advanced') }
  ]

  const sortOptions = [
    { value: 'popular', label: t('mostPopular') },
    { value: 'newest', label: t('newest') },
    { value: 'price-low', label: t('priceLowToHigh') },
    { value: 'price-high', label: t('priceHighToLow') },
    { value: 'rating', label: t('highestRated') }
  ]

  const categoryOptions = [
    { value: 'all', label: t('allCategories') },
    ...categories.map(cat => ({ value: cat.id, label: cat.name }))
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">{t('loading')}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('allCourses')}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {t('bestLearningMaterials')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6 flex items-center">
                <Search className="w-5 h-5 mr-2 text-blue-600" />
                {t('searchAndFilter')}
              </h3>
              
              {/* Search */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {t('searchCourses')}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t('searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {t('category')}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {t('level')}
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {levels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {t('price')}
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="price" 
                        value="all" 
                        checked={selectedPrice === 'all'}
                        onChange={(e) => setSelectedPrice(e.target.value)}
                        className="mr-2" 
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('allPrices')}</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="price" 
                        value="free" 
                        checked={selectedPrice === 'free'}
                        onChange={(e) => setSelectedPrice(e.target.value)}
                        className="mr-2" 
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('free')}</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="price" 
                        value="paid" 
                        checked={selectedPrice === 'paid'}
                        onChange={(e) => setSelectedPrice(e.target.value)}
                        className="mr-2" 
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('paid')}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                {t('popularCategories')}
              </h4>
              <div className="space-y-2">
                {[t('programming'), t('design'), t('marketing'), t('business'), t('languages')].map((cat) => (
                  <button 
                    key={cat}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredCourses.length} {t('coursesFound')}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {t('bestLearningMaterials')}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 ${viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 ${viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {getCurrentPageCourses().map((course) => (
                <CourseCard key={course.id} course={course} viewMode={viewMode} />
              ))}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('noResults')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('noCoursesMessage')}
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredCourses.length > 0 && totalPages > 1 && (
              <div className="flex justify-center mt-16">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('previous')}
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    if (totalPages <= 5) {
                      return (
                        <button 
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === page 
                              ? 'bg-blue-600 text-white' 
                              : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    }
                    return null
                  })}
                  
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('next')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllCoursesPage
