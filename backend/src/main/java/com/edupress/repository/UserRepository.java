package com.edupress.repository;

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
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsername(String username);
    
    Boolean existsByEmail(String email);
    
    Boolean existsByUsername(String username);
    
    Page<User> findByRole(User.Role role, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.role = 'INSTRUCTOR' AND u.isActive = true")
    Page<User> findActiveInstructors(Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE " +
           "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "u.role = :role")
    Page<User> findByRoleAndSearchTerm(@Param("role") User.Role role, 
                                      @Param("searchTerm") String searchTerm, 
                                      Pageable pageable);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'STUDENT'")
    long countStudents();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'INSTRUCTOR'")
    long countInstructors();

    // Add missing methods
    List<User> findByRole(User.Role role);
    
    long countByRole(User.Role role);
    
    long countByIsActiveTrue();
    
    long countByEmailVerifiedTrue();

    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<User> searchUsers(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    Page<User> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            String username, String email, String firstName, String lastName, Pageable pageable);
}
