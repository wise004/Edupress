package com.edupress.controller;

import com.edupress.model.*;
import com.edupress.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Comment CRUD operations
    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable Long id) {
        Optional<Comment> comment = commentService.findById(id);
        return comment.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/video/{videoId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Comment> createVideoComment(
            @PathVariable Long videoId,
            @RequestParam Long userId,
            @RequestParam String content) {
        try {
            Comment comment = commentService.createVideoComment(videoId, userId, content);
            return ResponseEntity.ok(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/lesson/{lessonId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Comment> createLessonComment(
            @PathVariable Long lessonId,
            @RequestParam Long userId,
            @RequestParam String content) {
        try {
            Comment comment = commentService.createLessonComment(lessonId, userId, content);
            return ResponseEntity.ok(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/{parentCommentId}/reply")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Comment> replyToComment(
            @PathVariable Long parentCommentId,
            @RequestParam Long userId,
            @RequestParam String content) {
        try {
            Comment reply = commentService.replyToComment(parentCommentId, userId, content);
            return ResponseEntity.ok(reply);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Comment> updateComment(
            @PathVariable Long id,
            @RequestParam String content) {
        try {
            Comment updatedComment = commentService.updateComment(id, content);
            return ResponseEntity.ok(updatedComment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        try {
            commentService.deleteComment(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get comments
    @GetMapping("/video/{videoId}")
    public ResponseEntity<List<Comment>> getVideoComments(@PathVariable Long videoId) {
        List<Comment> comments = commentService.getVideoTopLevelComments(videoId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/video/{videoId}/paginated")
    public ResponseEntity<Page<Comment>> getVideoCommentsPaginated(
            @PathVariable Long videoId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> comments = commentService.getVideoComments(videoId, pageable);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<Comment>> getLessonComments(@PathVariable Long lessonId) {
        List<Comment> comments = commentService.getLessonTopLevelComments(lessonId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/lesson/{lessonId}/paginated")
    public ResponseEntity<Page<Comment>> getLessonCommentsPaginated(
            @PathVariable Long lessonId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> comments = commentService.getLessonComments(lessonId, pageable);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/{commentId}/replies")
    public ResponseEntity<List<Comment>> getCommentReplies(@PathVariable Long commentId) {
        List<Comment> replies = commentService.getCommentReplies(commentId);
        return ResponseEntity.ok(replies);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Comment>> getUserComments(@PathVariable Long userId) {
        List<Comment> comments = commentService.getUserComments(userId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/instructor/{instructorId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Comment>> getInstructorComments(@PathVariable Long instructorId) {
        List<Comment> comments = commentService.getInstructorComments(instructorId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Comment>> searchComments(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> comments = commentService.searchComments(query, pageable);
        return ResponseEntity.ok(comments);
    }

    // Comment statistics
    @GetMapping("/video/{videoId}/count")
    public ResponseEntity<Long> getVideoCommentCount(@PathVariable Long videoId) {
        long count = commentService.getVideoCommentCount(videoId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/lesson/{lessonId}/count")
    public ResponseEntity<Long> getLessonCommentCount(@PathVariable Long lessonId) {
        long count = commentService.getLessonCommentCount(lessonId);
        return ResponseEntity.ok(count);
    }
}
