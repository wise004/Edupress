package com.edupress.service;

import com.edupress.model.*;
import com.edupress.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserRepository userRepository;

    // Comment CRUD operations
    public Comment createComment(Comment comment) {
        return commentRepository.save(comment);
    }

    public Optional<Comment> findById(Long id) {
        return commentRepository.findById(id);
    }

    public List<Comment> findAll() {
        return commentRepository.findAll();
    }

    public Page<Comment> findAll(Pageable pageable) {
        return commentRepository.findAll(pageable);
    }

    public Comment updateComment(Long id, String content) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));

        comment.setContent(content);
        return commentRepository.save(comment);
    }

    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
        
        comment.setIsActive(false);
        commentRepository.save(comment);
    }

    public void hardDeleteComment(Long id) {
        commentRepository.deleteById(id);
    }

    // Business logic methods
    public Comment createVideoComment(Long videoId, Long userId, String content) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + videoId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Comment comment = new Comment(content, Comment.CommentType.VIDEO, user);
        comment.setVideo(video);

        return commentRepository.save(comment);
    }

    public Comment createLessonComment(Long lessonId, Long userId, String content) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Comment comment = new Comment(content, Comment.CommentType.LESSON, user);
        comment.setLesson(lesson);

        return commentRepository.save(comment);
    }

    public Comment replyToComment(Long parentCommentId, Long userId, String content) {
        Comment parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new RuntimeException("Parent comment not found with id: " + parentCommentId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Comment reply = new Comment(content, parentComment.getType(), user);
        reply.setParentComment(parentComment);
        
        // Set the same video or lesson as parent comment
        if (parentComment.getVideo() != null) {
            reply.setVideo(parentComment.getVideo());
        }
        if (parentComment.getLesson() != null) {
            reply.setLesson(parentComment.getLesson());
        }

        return commentRepository.save(reply);
    }

    public List<Comment> getVideoComments(Long videoId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + videoId));
        return commentRepository.findByVideoAndIsActiveTrueOrderByCreatedAtDesc(video);
    }

    public List<Comment> getVideoTopLevelComments(Long videoId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + videoId));
        return commentRepository.findTopLevelCommentsByVideo(video);
    }

    public List<Comment> getLessonComments(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));
        return commentRepository.findByLessonAndIsActiveTrueOrderByCreatedAtDesc(lesson);
    }

    public List<Comment> getLessonTopLevelComments(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));
        return commentRepository.findTopLevelCommentsByLesson(lesson);
    }

    public List<Comment> getCommentReplies(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));
        return commentRepository.findByParentCommentAndIsActiveTrueOrderByCreatedAtAsc(comment);
    }

    public List<Comment> getUserComments(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return commentRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Comment> getInstructorComments(Long instructorId) {
        return commentRepository.findByInstructorId(instructorId);
    }

    public long getVideoCommentCount(Long videoId) {
        return commentRepository.countByVideoId(videoId);
    }

    public long getLessonCommentCount(Long lessonId) {
        return commentRepository.countByLessonId(lessonId);
    }

    public Page<Comment> searchComments(String searchTerm, Pageable pageable) {
        return commentRepository.searchByContent(searchTerm, pageable);
    }

    public Page<Comment> getVideoComments(Long videoId, Pageable pageable) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + videoId));
        return commentRepository.findByVideo(video, pageable);
    }

    public Page<Comment> getLessonComments(Long lessonId, Pageable pageable) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));
        return commentRepository.findByLesson(lesson, pageable);
    }
}
