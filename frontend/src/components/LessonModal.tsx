import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import type { Lesson } from '../types/api';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: Lesson) => void;
  lesson?: Lesson | null;
  courseId: number;
}

export default function LessonModal({ isOpen, onClose, onSave, lesson, courseId }: LessonModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentText: '',
    videoUrl: '',
    duration: 0,
    orderIndex: 0,
    isFree: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title,
        description: lesson.description || '',
        contentText: lesson.contentText || '',
        videoUrl: lesson.videoUrl || '',
        duration: lesson.duration,
        orderIndex: lesson.orderIndex,
        isFree: lesson.isFree
      });
    } else {
      setFormData({
        title: '',
        description: '',
        contentText: '',
        videoUrl: '',
        duration: 0,
        orderIndex: 0,
        isFree: false
      });
    }
  }, [lesson]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      // For now, we'll just mock the API call
      // In a real implementation, this would call LessonAPI.createLesson or updateLesson
      const savedLesson = {
        id: lesson?.id || Date.now(),
        ...formData,
        courseId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Lesson;

      onSave(savedLesson);
      onClose();
    } catch (err: any) {
      console.error('Error saving lesson:', err);
      setError(err.response?.data?.message || 'Failed to save lesson');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {lesson ? 'Edit Lesson' : 'Create Lesson'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lesson Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lesson Content
            </label>
            <textarea
              value={formData.contentText}
              onChange={(e) => setFormData({ ...formData, contentText: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={5}
              placeholder="Write your lesson content here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video URL
            </label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="YouTube video URL (masalan: https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Bepul kurslar uchun faqat YouTube video linklari qo'llab-quvvatlanadi
            </p>
            {formData.videoUrl && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Video oldindan ko'rish:</p>
                {formData.videoUrl.includes('youtube.com') || formData.videoUrl.includes('youtu.be') ? (
                  <div className="text-sm text-green-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    To'g'ri YouTube link
                  </div>
                ) : (
                  <div className="text-sm text-orange-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    YouTube linkini kiriting
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Index
              </label>
              <input
                type="number"
                value={formData.orderIndex}
                onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isFree}
                onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                This lesson is free to preview
              </span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (lesson ? 'Update Lesson' : 'Create Lesson')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
