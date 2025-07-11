package com.edupress.repository;

import com.edupress.model.VideoRating;
import com.edupress.model.Video;
import com.edupress.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoRatingRepository extends JpaRepository<VideoRating, Long> {
    
    Optional<VideoRating> findByVideoAndUser(Video video, User user);
    
    List<VideoRating> findByVideoOrderByCreatedAtDesc(Video video);
    
    List<VideoRating> findByUserOrderByCreatedAtDesc(User user);
    
    @Query("SELECT AVG(vr.rating) FROM VideoRating vr WHERE vr.video.id = :videoId")
    Double getAverageRatingByVideoId(@Param("videoId") Long videoId);
    
    @Query("SELECT COUNT(vr) FROM VideoRating vr WHERE vr.video.id = :videoId")
    long countByVideoId(@Param("videoId") Long videoId);
    
    @Query("SELECT COUNT(vr) FROM VideoRating vr WHERE vr.video.id = :videoId AND vr.rating = :rating")
    long countByVideoIdAndRating(@Param("videoId") Long videoId, @Param("rating") Integer rating);
    
    boolean existsByVideoAndUser(Video video, User user);
}
