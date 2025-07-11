package com.edupress.service;

import com.edupress.model.BlogPost;
import com.edupress.repository.BlogPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class BlogPostService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    public Page<BlogPost> findAllBlogPosts(Pageable pageable) {
        return blogPostRepository.findAll(pageable);
    }

    public Page<BlogPost> findPublishedBlogPosts(Pageable pageable) {
        return blogPostRepository.findPublishedPosts(pageable);
    }

    public Optional<BlogPost> findById(Long id) {
        return blogPostRepository.findById(id);
    }

    public Optional<BlogPost> findBySlug(String slug) {
        return blogPostRepository.findBySlug(slug);
    }

    public BlogPost createBlogPost(BlogPost blogPost) {
        blogPost.setCreatedAt(LocalDateTime.now());
        blogPost.setUpdatedAt(LocalDateTime.now());
        return blogPostRepository.save(blogPost);
    }

    public BlogPost updateBlogPost(Long id, BlogPost blogPostDetails) {
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));

        blogPost.setTitle(blogPostDetails.getTitle());
        blogPost.setContent(blogPostDetails.getContent());
        blogPost.setExcerpt(blogPostDetails.getExcerpt());
        blogPost.setSlug(blogPostDetails.getSlug());
        blogPost.setFeaturedImage(blogPostDetails.getFeaturedImage());
        blogPost.setStatus(blogPostDetails.getStatus());
        blogPost.setUpdatedAt(LocalDateTime.now());

        return blogPostRepository.save(blogPost);
    }

    public void deleteBlogPost(Long id) {
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));
        blogPostRepository.delete(blogPost);
    }

    public BlogPost publishBlogPost(Long id) {
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));
        blogPost.setStatus(BlogPost.Status.PUBLISHED);
        blogPost.setUpdatedAt(LocalDateTime.now());
        return blogPostRepository.save(blogPost);
    }

    public BlogPost unpublishBlogPost(Long id) {
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));
        blogPost.setStatus(BlogPost.Status.DRAFT);
        blogPost.setUpdatedAt(LocalDateTime.now());
        return blogPostRepository.save(blogPost);
    }
}
