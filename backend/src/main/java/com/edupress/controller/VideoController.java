package com.edupress.controller;

import com.edupress.model.*;
import com.edupress.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/videos")
public class VideoController {

    @Autowired
    private VideoService videoService;

    // Video CRUD operations
    @GetMapping
    public ResponseEntity<Page<Video>> getAllVideos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Video> videos = videoService.findAll(pageable);
        return ResponseEntity.ok(videos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Video> getVideoById(@PathVariable Long id) {
        Optional<Video> video = videoService.findById(id);
        return video.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<Video>> getVideosByLesson(@PathVariable Long lessonId) {
        List<Video> videos = videoService.findByLesson(lessonId);
        return ResponseEntity.ok(videos);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Video>> getVideosByCourse(@PathVariable Long courseId) {
        List<Video> videos = videoService.findByCourse(courseId);
        return ResponseEntity.ok(videos);
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Video> uploadVideo(
            @RequestParam Long lessonId,
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam Integer orderIndex,
            @RequestParam("file") MultipartFile file) {
        try {
            Video video = videoService.uploadVideo(lessonId, title, description, orderIndex, file);
            return ResponseEntity.ok(video);
        } catch (IOException | RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/youtube")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Video> createYouTubeVideo(
            @RequestParam Long lessonId,
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam String youtubeUrl,
            @RequestParam Integer orderIndex,
            @RequestParam Integer duration) {
        try {
            Video video = videoService.createYouTubeVideo(lessonId, title, description, youtubeUrl, orderIndex, duration);
            return ResponseEntity.ok(video);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Video> updateVideo(@PathVariable Long id, @RequestBody Video videoDetails) {
        try {
            Video updatedVideo = videoService.updateVideo(id, videoDetails);
            return ResponseEntity.ok(updatedVideo);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteVideo(@PathVariable Long id) {
        try {
            videoService.deleteVideo(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Video rating operations
    @PostMapping("/{videoId}/rate")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<VideoRating> rateVideo(
            @PathVariable Long videoId,
            @RequestParam Long userId,
            @RequestParam Integer rating) {
        try {
            VideoRating videoRating = videoService.rateVideo(videoId, userId, rating);
            return ResponseEntity.ok(videoRating);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{videoId}/ratings")
    public ResponseEntity<List<VideoRating>> getVideoRatings(@PathVariable Long videoId) {
        List<VideoRating> ratings = videoService.getVideoRatings(videoId);
        return ResponseEntity.ok(ratings);
    }

    @GetMapping("/{videoId}/ratings/user/{userId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<VideoRating> getUserVideoRating(
            @PathVariable Long videoId,
            @PathVariable Long userId) {
        Optional<VideoRating> rating = videoService.getUserVideoRating(videoId, userId);
        return rating.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    // Video streaming/download
    @GetMapping("/{videoId}/stream")
    public ResponseEntity<Resource> streamVideo(@PathVariable Long videoId) {
        try {
            Path filePath = videoService.getVideoFilePath(videoId);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filePath.getFileName().toString() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Video>> searchVideos(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Video> videos = videoService.searchVideos(query, pageable);
        return ResponseEntity.ok(videos);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Video>> getVideosByType(@PathVariable String type) {
        try {
            Video.VideoType videoType = Video.VideoType.valueOf(type.toUpperCase());
            List<Video> videos = videoService.findByType(videoType);
            return ResponseEntity.ok(videos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<Video>> getTopRatedVideos(
            @RequestParam(defaultValue = "4.0") Double minRating) {
        List<Video> videos = videoService.findByMinimumRating(minRating);
        return ResponseEntity.ok(videos);
    }

    @GetMapping("/course/{courseId}/count")
    public ResponseEntity<Long> getVideoCountByCourse(@PathVariable Long courseId) {
        long count = videoService.countActiveByCourse(courseId);
        return ResponseEntity.ok(count);
    }
}
