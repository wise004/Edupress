package com.edupress.controller;

import com.edupress.model.BlogPost;
import com.edupress.service.BlogPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/blog/posts")
public class BlogPostController {

    @Autowired
    private BlogPostService blogPostService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<Page<BlogPost>> getAllBlogPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BlogPost> blogPosts = blogPostService.findAllBlogPosts(pageable);
        return ResponseEntity.ok(blogPosts);
    }

    @GetMapping("/published")
    public ResponseEntity<Page<BlogPost>> getPublishedBlogPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BlogPost> blogPosts = blogPostService.findPublishedBlogPosts(pageable);
        return ResponseEntity.ok(blogPosts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogPost> getBlogPostById(@PathVariable Long id) {
        Optional<BlogPost> blogPost = blogPostService.findById(id);
        return blogPost.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<BlogPost> getBlogPostBySlug(@PathVariable String slug) {
        Optional<BlogPost> blogPost = blogPostService.findBySlug(slug);
        return blogPost.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<BlogPost> createBlogPost(@RequestBody BlogPost blogPost) {
        BlogPost createdBlogPost = blogPostService.createBlogPost(blogPost);
        return ResponseEntity.ok(createdBlogPost);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<BlogPost> updateBlogPost(@PathVariable Long id, @RequestBody BlogPost blogPostDetails) {
        try {
            BlogPost updatedBlogPost = blogPostService.updateBlogPost(id, blogPostDetails);
            return ResponseEntity.ok(updatedBlogPost);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBlogPost(@PathVariable Long id) {
        try {
            blogPostService.deleteBlogPost(id);
            return ResponseEntity.ok("Blog post deleted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<BlogPost> publishBlogPost(@PathVariable Long id) {
        try {
            BlogPost publishedBlogPost = blogPostService.publishBlogPost(id);
            return ResponseEntity.ok(publishedBlogPost);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/unpublish")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<BlogPost> unpublishBlogPost(@PathVariable Long id) {
        try {
            BlogPost unpublishedBlogPost = blogPostService.unpublishBlogPost(id);
            return ResponseEntity.ok(unpublishedBlogPost);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
