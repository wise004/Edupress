import { useState, useEffect } from 'react';
import { Upload, File, Clock, CheckCircle, XCircle, Download, AlertCircle } from 'lucide-react';
import { AssignmentAPI } from '../services/api';
import type { Assignment, AssignmentSubmission } from '../types/api';

interface AssignmentViewProps {
  lessonId: number;
  onComplete?: (submission: AssignmentSubmission) => void;
  onCancel?: () => void;
}

export default function AssignmentView({ lessonId, onComplete, onCancel }: AssignmentViewProps) {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    loadAssignment();
  }, [lessonId]);

  const loadAssignment = async () => {
    try {
      setLoading(true);
      const assignmentData = await AssignmentAPI.getAssignmentByLessonId(lessonId);
      setAssignment(assignmentData);
      
      // Load user's submissions
      const userSubmissions = await AssignmentAPI.getUserSubmissions(assignmentData.id);
      setSubmissions(userSubmissions);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!assignment) return;

    // Check file size
    const maxSize = assignment.maxFileSize || 140 * 1024 * 1024; // 140MB default
    if (selectedFile.size > maxSize) {
      setError(`File size exceeds limit of ${(maxSize / (1024 * 1024)).toFixed(0)}MB`);
      return;
    }

    // Check file type if specified
    if (assignment.allowedFileTypes) {
      const allowedTypes = assignment.allowedFileTypes.split(',').map(type => type.trim().toLowerCase());
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension && !allowedTypes.includes('.' + fileExtension)) {
        setError(`File type not allowed. Allowed types: ${assignment.allowedFileTypes}`);
        return;
      }
    }

    setFile(selectedFile);
    setError('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const submitAssignment = async () => {
    if (!assignment || !file) return;

    // Check submission limit
    if (assignment.maxAttempts && submissions.length >= assignment.maxAttempts) {
      setError('Maximum number of submissions reached');
      return;
    }

    try {
      setUploading(true);
      const submission = await AssignmentAPI.submitAssignment(
        assignment.id, 
        file, 
        submissionText.trim() || undefined
      );
      
      // Refresh submissions
      await loadAssignment();
      
      // Reset form
      setFile(null);
      setSubmissionText('');
      
      if (onComplete) {
        onComplete(submission);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setUploading(false);
    }
  };

  const downloadSubmission = async (submissionId: number, filename: string) => {
    try {
      const blob = await AssignmentAPI.downloadSubmissionFile(submissionId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError('Failed to download file');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'GRADED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'RETURNED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'text-yellow-600 bg-yellow-50';
      case 'GRADED':
        return 'text-green-600 bg-green-50';
      case 'RETURNED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isSubmissionAllowed = () => {
    if (!assignment) return false;
    
    // Check if due date has passed
    if (assignment.dueDate && new Date(assignment.dueDate) < new Date()) {
      return false;
    }
    
    // Check submission limit
    if (assignment.maxAttempts && submissions.length >= assignment.maxAttempts) {
      return false;
    }
    
    return true;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading assignment...</span>
      </div>
    );
  }

  if (error && !assignment) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <XCircle className="h-6 w-6 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No assignment found for this lesson.</p>
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Assignment Details */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-4">{assignment.title}</h1>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {assignment.dueDate && (
            <div>
              <span className="text-sm font-medium text-gray-600">Due Date:</span>
              <div className="text-gray-900">
                {new Date(assignment.dueDate).toLocaleDateString()} at{' '}
                {new Date(assignment.dueDate).toLocaleTimeString()}
              </div>
            </div>
          )}
          <div>
            <span className="text-sm font-medium text-gray-600">Submissions:</span>
            <div className="text-gray-900">
              {submissions.length}{assignment.maxAttempts ? `/${assignment.maxAttempts}` : ''} submitted
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          <h3>Description</h3>
          <p>{assignment.description}</p>
          
          <h3>Instructions</h3>
          <p>{assignment.instructions}</p>
        </div>

        {assignment.allowedFileTypes && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Allowed file types:</strong> {assignment.allowedFileTypes}
            </p>
          </div>
        )}

        {assignment.maxFileSize && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Maximum file size:</strong> {formatFileSize(assignment.maxFileSize)}
            </p>
          </div>
        )}
      </div>

      {/* Submission Form */}
      {isSubmissionAllowed() && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Submit Assignment</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File *
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {file ? (
                <div className="flex items-center justify-center">
                  <File className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="ml-4 text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drag and drop your file here, or</p>
                  <input
                    type="file"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                  >
                    browse to choose a file
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Optional text submission */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Comments (Optional)
            </label>
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any comments or notes about your submission..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              onClick={submitAssignment}
              disabled={!file || uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Submit Assignment'}
            </button>
          </div>
        </div>
      )}

      {/* Previous Submissions */}
      {submissions.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Your Submissions</h2>
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {getStatusIcon(submission.status)}
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                      {submission.status}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(submission.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <File className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="font-medium">{submission.fileName}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({formatFileSize(submission.fileSize)})
                    </span>
                  </div>
                  <button
                    onClick={() => downloadSubmission(submission.id, submission.fileName)}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                </div>

                {submission.submissionText && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-700">{submission.submissionText}</p>
                  </div>
                )}

                {submission.status === 'GRADED' && (
                  <div className="mt-3 p-3 bg-green-50 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-green-800">Grade: {submission.score}/100</span>
                      <span className="text-sm text-green-600">
                        Graded on {new Date(submission.gradedAt!).toLocaleDateString()}
                      </span>
                    </div>
                    {submission.feedback && (
                      <p className="text-sm text-green-700">{submission.feedback}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No submissions message */}
      {!isSubmissionAllowed() && submissions.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-yellow-800 mb-2">No Submissions Available</h3>
          <p className="text-yellow-700">
            {assignment.dueDate && new Date(assignment.dueDate) < new Date()
              ? 'The due date for this assignment has passed.'
              : 'You have reached the maximum number of submissions for this assignment.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
