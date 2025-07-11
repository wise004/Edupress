package com.edupress.service;

import com.edupress.model.*;
import com.edupress.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private VideoRatingRepository videoRatingRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserRepository userRepository;

    private final String uploadDir = "uploads/videos/";

    // Video CRUD operations
    public Video createVideo(Video video) {
        return videoRepository.save(video);
    }

    public Optional<Video> findById(Long id) {
        return videoRepository.findById(id);
    }

    public List<Video> findAll() {
        return videoRepository.findAll();
    }

    public Page<Video> findAll(Pageable pageable) {
        return videoRepository.findAll(pageable);
    }

    public Video updateVideo(Long id, Video videoDetails) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + id));

        video.setTitle(videoDetails.getTitle());
        video.setDescription(videoDetails.getDescription());
        video.setDuration(videoDetails.getDuration());
        video.setType(videoDetails.getType());
        video.setVideoUrl(videoDetails.getVideoUrl());
        video.setThumbnailUrl(videoDetails.getThumbnailUrl());
        video.setOrderIndex(videoDetails.getOrderIndex());
        video.setIsActive(videoDetails.getIsActive());

        return videoRepository.save(video);
    }

    public void deleteVideo(Long id) {
        videoRepository.deleteById(id);
    }

    // Business logic methods
    public List<Video> findByLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));
        return videoRepository.findByLessonOrderByOrderIndexAsc(lesson);
    }

    public List<Video> findByCourse(Long courseId) {
        return videoRepository.findByCourseIdAndIsActiveTrue(courseId);
    }

    public List<Video> findByInstructor(Long instructorId) {
        return videoRepository.findByInstructorId(instructorId);
    }

    public long countActiveByCourse(Long courseId) {
        return videoRepository.countActiveByCourseId(courseId);
    }

    // Video upload operations
    public Video uploadVideo(Long lessonId, String title, String description, 
                           Integer orderIndex, MultipartFile file) throws IOException {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));

        // Validate file
        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isEmpty()) {
            throw new RuntimeException("Invalid file name");
        }

        String fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        if (!isValidVideoFormat(fileExtension)) {
            throw new RuntimeException("Invalid video format. Supported formats: mp4, avi, mov, wmv, flv");
        }

        // Save file
        String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Create video record
        Video video = new Video(title, description, Video.VideoType.FILE, lesson);
        video.setFilePath(filePath.toString());
        video.setFileSize(file.getSize());
        video.setOrderIndex(orderIndex);

        return videoRepository.save(video);
    }

    public Video createYouTubeVideo(Long lessonId, String title, String description, 
                                   String youtubeUrl, Integer orderIndex, Integer duration) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));

        Video video = new Video(title, description, Video.VideoType.YOUTUBE, lesson);
        video.setVideoUrl(youtubeUrl);
        video.setOrderIndex(orderIndex);
        video.setDuration(duration);

        return videoRepository.save(video);
    }

    private boolean isValidVideoFormat(String extension) {
        String[] validFormats = {"mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"};
        for (String format : validFormats) {
            if (format.equals(extension)) {
                return true;
            }
        }
        return false;
    }

    // Video rating operations
    public VideoRating rateVideo(Long videoId, Long userId, Integer rating) {
        Video video = findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + videoId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Check if user already rated this video
        Optional<VideoRating> existingRating = videoRatingRepository.findByVideoAndUser(video, user);
        
        VideoRating videoRating;
        if (existingRating.isPresent()) {
            // Update existing rating
            videoRating = existingRating.get();
            videoRating.setRating(rating);
        } else {
            // Create new rating
            videoRating = new VideoRating(rating, video, user);
        }

        videoRating = videoRatingRepository.save(videoRating);

        // Update video average rating
        updateVideoAverageRating(videoId);

        return videoRating;
    }

    private void updateVideoAverageRating(Long videoId) {
        Double averageRating = videoRatingRepository.getAverageRatingByVideoId(videoId);
        long totalRatings = videoRatingRepository.countByVideoId(videoId);

        Video video = findById(videoId).orElse(null);
        if (video != null) {
            video.setAverageRating(averageRating != null ? averageRating : 0.0);
            video.setTotalRatings((int) totalRatings);
            videoRepository.save(video);
        }
    }

    public List<VideoRating> getVideoRatings(Long videoId) {
        Video video = findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + videoId));
        return videoRatingRepository.findByVideoOrderByCreatedAtDesc(video);
    }

    public Optional<VideoRating> getUserVideoRating(Long videoId, Long userId) {
        Video video = findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + videoId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        return videoRatingRepository.findByVideoAndUser(video, user);
    }

    public List<Video> findByType(Video.VideoType type) {
        return videoRepository.findByTypeAndIsActiveTrue(type);
    }

    public List<Video> findByMinimumRating(Double minRating) {
        return videoRepository.findByMinimumRating(minRating);
    }

    public Page<Video> searchVideos(String searchTerm, Pageable pageable) {
        return videoRepository.searchByTitleOrDescription(searchTerm, pageable);
    }

    // File access method
    public Path getVideoFilePath(Long videoId) {
        Video video = findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + videoId));
        
        if (video.getType() != Video.VideoType.FILE || video.getFilePath() == null) {
            throw new RuntimeException("Video is not a file upload");
        }
        
        return Paths.get(video.getFilePath());
    }
}
