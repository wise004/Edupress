import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AssignmentAPI } from '../services/api';
import type { Assignment } from '../types/api';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignment: Assignment) => void;
  assignment?: Assignment | null;
  lessonId: number;
}

export default function AssignmentModal({ isOpen, onClose, onSave, assignment, lessonId }: AssignmentModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    maxScore: 100,
    maxAttempts: 3,
    maxFileSize: 10, // MB
    allowedFileTypes: 'pdf,doc,docx,txt',
    dueDate: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title,
        description: assignment.description,
        instructions: assignment.instructions || '',
        maxScore: assignment.maxScore,
        maxAttempts: assignment.maxAttempts,
        maxFileSize: assignment.maxFileSize,
        allowedFileTypes: assignment.allowedFileTypes,
        dueDate: assignment.dueDate ? assignment.dueDate.split('T')[0] : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        instructions: '',
        maxScore: 100,
        maxAttempts: 3,
        maxFileSize: 10,
        allowedFileTypes: 'pdf,doc,docx,txt',
        dueDate: ''
      });
    }
  }, [assignment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      const assignmentData = {
        ...formData,
        lessonId,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined
      };

      let savedAssignment;
      if (assignment) {
        savedAssignment = await AssignmentAPI.updateAssignment(assignment.id, assignmentData);
      } else {
        savedAssignment = await AssignmentAPI.createAssignment(assignmentData);
      }

      onSave(savedAssignment);
      onClose();
    } catch (err: any) {
      console.error('Error saving assignment:', err);
      setError(err.response?.data?.message || 'Failed to save assignment');
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
            {assignment ? 'Edit Assignment' : 'Create Assignment'}
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
              Assignment Title *
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
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Detailed instructions for students..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Score
              </label>
              <input
                type="number"
                value={formData.maxScore}
                onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Attempts
              </label>
              <input
                type="number"
                value={formData.maxAttempts}
                onChange={(e) => setFormData({ ...formData, maxAttempts: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max File Size (MB)
              </label>
              <input
                type="number"
                value={formData.maxFileSize}
                onChange={(e) => setFormData({ ...formData, maxFileSize: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="140"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date (optional)
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allowed File Types
            </label>
            <input
              type="text"
              value={formData.allowedFileTypes}
              onChange={(e) => setFormData({ ...formData, allowedFileTypes: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="pdf,doc,docx,txt,png,jpg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Comma-separated file extensions (e.g., pdf,doc,docx,txt)
            </p>
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
              {loading ? 'Saving...' : (assignment ? 'Update Assignment' : 'Create Assignment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
