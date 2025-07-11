package com.edupress.repository;

import com.edupress.model.BlogPost;
import com.edupress.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    
    Optional<BlogPost> findBySlug(String slug);
    
    Page<BlogPost> findByStatus(BlogPost.Status status, Pageable pageable);
    
    Page<BlogPost> findByAuthor(User author, Pageable pageable);
    
    @Query("SELECT b FROM BlogPost b WHERE b.status = 'PUBLISHED'")
    Page<BlogPost> findPublishedPosts(Pageable pageable);
    
    @Query("SELECT b FROM BlogPost b WHERE b.status = 'PUBLISHED' AND " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.content) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.tags) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<BlogPost> findPublishedPostsBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT b FROM BlogPost b WHERE b.status = 'PUBLISHED' AND " +
           "LOWER(b.tags) LIKE LOWER(CONCAT('%', :tag, '%'))")
    Page<BlogPost> findPublishedPostsByTag(@Param("tag") String tag, Pageable pageable);
    
    @Query("SELECT b FROM BlogPost b WHERE b.status = 'PUBLISHED' ORDER BY b.viewCount DESC")
    List<BlogPost> findPopularPosts(Pageable pageable);
    
    @Query("SELECT b FROM BlogPost b WHERE b.status = 'PUBLISHED' ORDER BY b.createdAt DESC")
    List<BlogPost> findLatestPosts(Pageable pageable);
    
    @Query("SELECT COUNT(b) FROM BlogPost b WHERE b.status = 'PUBLISHED'")
    long countPublishedPosts();
}
