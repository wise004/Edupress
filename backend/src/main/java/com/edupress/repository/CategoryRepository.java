package com.edupress.repository;

import com.edupress.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    Optional<Category> findByName(String name);
    
    Boolean existsByName(String name);
    
    List<Category> findByIsActiveTrue();
    
    @Query("SELECT c FROM Category c WHERE c.isActive = true ORDER BY c.courseCount DESC")
    List<Category> findActiveCategoriesOrderByCourseCount();
    
    @Query("SELECT c FROM Category c WHERE c.isActive = true AND c.courseCount > 0")
    List<Category> findCategoriesWithCourses();
}
