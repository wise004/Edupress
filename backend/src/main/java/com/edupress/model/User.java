package com.edupress.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users", 
       uniqueConstraints = {
           @UniqueConstraint(columnNames = "email"),
           @UniqueConstraint(columnNames = "username")
       })
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 3, max = 20)
    @Column(unique = true)
    private String username;

    @NotBlank
    @Size(max = 50)
    private String firstName;

    @NotBlank
    @Size(max = 50)
    private String lastName;

    @NotBlank
    @Size(max = 120)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 120)
    private String password;

    @Column(length = 500)
    private String bio;

    private String profileImage;

    private String phoneNumber;

    private Boolean isActive = true;

    private Boolean emailVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Role role = Role.STUDENT;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Many-to-Many relationship with courses (for enrolled courses)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_course_enrollments",
               joinColumns = @JoinColumn(name = "user_id"),
               inverseJoinColumns = @JoinColumn(name = "course_id"))
    @JsonIgnore
    private Set<Course> enrolledCourses = new HashSet<>();

    // One-to-Many relationship with courses (for instructor's courses)
    @OneToMany(mappedBy = "instructor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Course> instructedCourses = new HashSet<>();

    // One-to-Many relationship with quiz attempts
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<QuizAttempt> quizAttempts = new HashSet<>();

    // One-to-Many relationship with assignment submissions
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<AssignmentSubmission> assignmentSubmissions = new HashSet<>();

    // One-to-Many relationship with graded assignments
    @OneToMany(mappedBy = "gradedBy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<AssignmentSubmission> gradedSubmissions = new HashSet<>();

    // One-to-Many relationship with video ratings
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<VideoRating> videoRatings = new HashSet<>();

    // One-to-Many relationship with comments
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Comment> comments = new HashSet<>();

    // One-to-Many relationship with certificates
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Certificate> certificates = new HashSet<>();

    // Constructors
    public User() {}

    public User(String firstName, String lastName, String email, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<Course> getEnrolledCourses() {
        return enrolledCourses;
    }

    public void setEnrolledCourses(Set<Course> enrolledCourses) {
        this.enrolledCourses = enrolledCourses;
    }

    public Set<Course> getInstructedCourses() {
        return instructedCourses;
    }

    public void setInstructedCourses(Set<Course> instructedCourses) {
        this.instructedCourses = instructedCourses;
    }

    public Set<QuizAttempt> getQuizAttempts() {
        return quizAttempts;
    }

    public void setQuizAttempts(Set<QuizAttempt> quizAttempts) {
        this.quizAttempts = quizAttempts;
    }

    public Set<AssignmentSubmission> getAssignmentSubmissions() {
        return assignmentSubmissions;
    }

    public void setAssignmentSubmissions(Set<AssignmentSubmission> assignmentSubmissions) {
        this.assignmentSubmissions = assignmentSubmissions;
    }

    public Set<AssignmentSubmission> getGradedSubmissions() {
        return gradedSubmissions;
    }

    public void setGradedSubmissions(Set<AssignmentSubmission> gradedSubmissions) {
        this.gradedSubmissions = gradedSubmissions;
    }

    public Set<VideoRating> getVideoRatings() {
        return videoRatings;
    }

    public void setVideoRatings(Set<VideoRating> videoRatings) {
        this.videoRatings = videoRatings;
    }

    public Set<Comment> getComments() {
        return comments;
    }

    public void setComments(Set<Comment> comments) {
        this.comments = comments;
    }

    public Set<Certificate> getCertificates() {
        return certificates;
    }

    public void setCertificates(Set<Certificate> certificates) {
        this.certificates = certificates;
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public enum Role {
        STUDENT,
        INSTRUCTOR,
        ADMIN
    }
}
