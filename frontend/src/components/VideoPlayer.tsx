import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Star, MessageCircle, Share2 } from 'lucide-react';
import { VideoAPI, CommentAPI } from '../services/api';
import VideoComments from './VideoComments';
import type { Video, Comment } from '../types/api';

interface VideoPlayerProps {
  lessonId: number;
  videoId?: number;
  onVideoComplete?: (videoId: number, watchTime: number) => void;
}

// YouTube video ID extraction
const getYouTubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const isYouTubeVideo = (url: string) => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

interface VideoPlayerProps {
  lessonId: number;
  videoId?: number;
  onVideoComplete?: (videoId: number, watchTime: number) => void;
}

export default function VideoPlayer({ lessonId, videoId, onVideoComplete }: VideoPlayerProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const watchTimeRef = useRef<number>(0);

  useEffect(() => {
    loadVideos();
  }, [lessonId]);

  useEffect(() => {
    if (videos.length > 0) {
      const targetIndex = videoId ? videos.findIndex(v => v.id === videoId) : 0;
      if (targetIndex >= 0) {
        setCurrentVideoIndex(targetIndex);
        setCurrentVideo(videos[targetIndex]);
      }
    }
  }, [videos, videoId]);

  useEffect(() => {
    if (currentVideo) {
      loadVideoData();
    }
  }, [currentVideo]);

  // Watch time tracking
  useEffect(() => {
    if (isPlaying && currentVideo) {
      const interval = setInterval(() => {
        watchTimeRef.current += 1;
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentVideo]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const videosData = await VideoAPI.getVideosByLessonId(lessonId);
      setVideos(videosData.sort((a: Video, b: Video) => a.orderIndex - b.orderIndex));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const loadVideoData = async () => {
    if (!currentVideo) return;

    try {
      // Load ratings
      const ratingsData = await VideoAPI.getVideoRatings(currentVideo.id);
      setAverageRating(ratingsData.averageRating || 0);
      setTotalRatings(ratingsData.totalRatings || 0);

      // Load user's rating
      try {
        const userRatingData = await VideoAPI.getUserVideoRating(currentVideo.id);
        setUserRating(userRatingData.rating || 0);
      } catch {
        setUserRating(0);
      }

      // Load comments
      const commentsData = await CommentAPI.getCommentsByVideoId(currentVideo.id);
      setComments(commentsData.content || []);
    } catch (err: any) {
      console.error('Failed to load video data:', err);
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleProgressClick = (e: React.MouseEvent) => {
    if (!videoRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleMute = () => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleVideoEnd = async () => {
    if (currentVideo && onVideoComplete) {
      // Mark video as watched
      try {
        await VideoAPI.markVideoWatched(currentVideo.id, watchTimeRef.current);
        onVideoComplete(currentVideo.id, watchTimeRef.current);
      } catch (err) {
        console.error('Failed to mark video as watched:', err);
      }
    }

    // Auto-play next video
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
      setCurrentVideo(videos[currentVideoIndex + 1]);
      watchTimeRef.current = 0;
    }
  };

  const handleRating = async (rating: number) => {
    if (!currentVideo) return;

    try {
      await VideoAPI.rateVideo(currentVideo.id, rating);
      setUserRating(rating);
      
      // Reload ratings
      const ratingsData = await VideoAPI.getVideoRatings(currentVideo.id);
      setAverageRating(ratingsData.averageRating || 0);
      setTotalRatings(ratingsData.totalRatings || 0);
    } catch (err: any) {
      console.error('Failed to rate video:', err);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderStars = (rating: number, interactive = false, size = 'w-5 h-5') => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-300' : ''}`}
            onClick={interactive ? () => handleRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading videos...</span>
      </div>
    );
  }

  if (error || !currentVideo) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">{error || 'No videos available for this lesson.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="bg-black rounded-lg overflow-hidden relative group">
        {isYouTubeVideo(currentVideo.videoUrl || '') ? (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(currentVideo.videoUrl || '')}?autoplay=0&rel=0&modestbranding=1`}
              className="absolute top-0 left-0 w-full h-full"
              allowFullScreen
              title={currentVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-auto"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleVideoEnd}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={currentVideo.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Progress Bar */}
              <div
                ref={progressRef}
                className="w-full h-1 bg-white/30 rounded cursor-pointer mb-4"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-blue-500 rounded"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button onClick={handlePlayPause} className="text-white hover:text-blue-400">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button onClick={handleMute} className="text-white hover:text-blue-400">
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-20 h-1 bg-white/30 rounded"
                    />
                  </div>

                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <button onClick={handleFullscreen} className="text-white hover:text-blue-400">
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Video Info */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
            {currentVideo.description && (
              <p className="text-gray-600 mb-4">{currentVideo.description}</p>
            )}
            
            {/* Video Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-500">
              {currentVideo.duration && (
                <span>Duration: {Math.floor(currentVideo.duration / 60)}:{String(currentVideo.duration % 60).padStart(2, '0')}</span>
              )}
              <div className="flex items-center gap-1">
                {renderStars(averageRating)}
                <span className="ml-1">({totalRatings} ratings)</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{comments.length} Comments</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Rating Section */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium mb-2">Rate this video</h3>
              {renderStars(userRating, true, 'w-6 h-6')}
              {userRating > 0 && (
                <p className="text-sm text-gray-600 mt-1">You rated this video {userRating} stars</p>
              )}
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">
                {totalRatings} ratings
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Playlist */}
      {videos.length > 1 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="font-semibold mb-4">Lesson Videos ({videos.length})</h3>
          <div className="space-y-2">
            {videos.map((video, index) => (
              <div
                key={video.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  video.id === currentVideo.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  setCurrentVideoIndex(index);
                  setCurrentVideo(video);
                  watchTimeRef.current = 0;
                }}
              >
                <div className="flex-shrink-0 w-16 h-10 bg-gray-200 rounded mr-3 flex items-center justify-center">
                  <Play className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{video.title}</h4>
                  {video.duration && (
                    <p className="text-sm text-gray-500">
                      {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                    </p>
                  )}
                </div>
                {video.id === currentVideo.id && (
                  <div className="text-blue-600 text-sm font-medium">Playing</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <VideoComments
          videoId={currentVideo.id}
          comments={comments}
          onCommentsUpdate={setComments}
        />
      )}
    </div>
  );
}
