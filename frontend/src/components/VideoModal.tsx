import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { VideoAPI } from '../services/api';
import type { Video } from '../types/api';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (video: Video) => void;
  video?: Video | null;
  lessonId: number;
}

export default function VideoModal({ isOpen, onClose, onSave, video, lessonId }: VideoModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'YOUTUBE' as 'FILE' | 'YOUTUBE',
    videoUrl: '',
    duration: 0,
    orderIndex: 0
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title,
        description: video.description || '',
        type: video.type === 'EXTERNAL_LINK' ? 'YOUTUBE' : video.type,
        videoUrl: video.videoUrl || '',
        duration: video.duration,
        orderIndex: video.orderIndex
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'YOUTUBE',
        videoUrl: '',
        duration: 0,
        orderIndex: 0
      });
    }
    setSelectedFile(null);
  }, [video]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/wmv'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid video file (MP4, MOV, AVI, WMV)');
        return;
      }

      // Check file size (max 500MB)
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        setError('File size must be less than 500MB');
        return;
      }

      setSelectedFile(file);
      setFormData({ ...formData, type: 'FILE' });
      setError('');
    }
  };

  const extractYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.type === 'YOUTUBE' && !formData.videoUrl) {
      setError('Please provide a YouTube URL');
      return;
    }

    if (formData.type === 'FILE' && !selectedFile && !video) {
      setError('Please select a video file to upload');
      return;
    }

    try {
      setLoading(true);
      setError('');

      let videoData: any = {
        ...formData,
        lessonId
      };

      // For YouTube videos, extract video ID and create thumbnail URL
      if (formData.type === 'YOUTUBE' && formData.videoUrl) {
        const videoId = extractYouTubeVideoId(formData.videoUrl);
        if (!videoId) {
          setError('Invalid YouTube URL');
          return;
        }
        
        videoData = {
          ...videoData,
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
          youtubeThumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        };
      }

      let savedVideo;
      if (video) {
        savedVideo = await VideoAPI.updateVideo(video.id, videoData);
      } else {
        savedVideo = await VideoAPI.createVideo(videoData);
      }

      // Upload file if it's a file type video
      if (formData.type === 'FILE' && selectedFile) {
        setUploadProgress(0);
        
        // Simulate upload progress (in real implementation, this would track actual upload)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        try {
          await VideoAPI.uploadVideo(savedVideo.id, selectedFile);
          setUploadProgress(100);
          clearInterval(progressInterval);
        } catch (uploadError) {
          clearInterval(progressInterval);
          throw uploadError;
        }
      }

      onSave(savedVideo);
      onClose();
    } catch (err: any) {
      console.error('Error saving video:', err);
      setError(err.response?.data?.message || 'Failed to save video');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {video ? 'Edit Video' : 'Add Video'}
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
              Video Title *
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
              Video Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="YOUTUBE"
                  checked={formData.type === 'YOUTUBE'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'YOUTUBE' })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-2">YouTube Video</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="FILE"
                  checked={formData.type === 'FILE'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'FILE' })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-2">Upload Video File</span>
              </label>
            </div>
          </div>

          {formData.type === 'YOUTUBE' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL *
              </label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://www.youtube.com/watch?v=..."
                required={formData.type === 'YOUTUBE'}
              />
            </div>
          )}

          {formData.type === 'FILE' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video File {!video && '*'}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600 mb-2">
                  Drop your video file here, or{' '}
                  <label className="text-blue-600 cursor-pointer hover:text-blue-700">
                    browse
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Supports MP4, MOV, AVI, WMV (max 500MB)
                </p>
                {selectedFile && (
                  <div className="mt-2 text-sm text-green-600">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Uploading...</span>
                <span className="text-sm text-gray-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (seconds)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave 0 for auto-detection (YouTube videos)
              </p>
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
              disabled={loading || (uploadProgress > 0 && uploadProgress < 100)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (video ? 'Update Video' : 'Add Video')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
