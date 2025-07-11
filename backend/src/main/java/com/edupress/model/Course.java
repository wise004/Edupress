package com.edupress.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    @Column(length = 1000)
    private String description;

    @Column(length = 2000)
    private String fullDescription;

    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal price = BigDecimal.ZERO;

    private BigDecimal originalPrice;

    private Boolean isFree = false;

    private String thumbnailImage;

    private String videoPreviewUrl;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Level level = Level.BEGINNER;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Status status = Status.DRAFT;

    private Integer duration; // in minutes

    private Integer enrollmentCount = 0;

    private Double averageRating = 0.0;

    private Integer totalRatings = 0;

    private String language = "English";

    private String requirements;

    private String whatYouWillLearn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id")
    @JsonIgnoreProperties({"enrolledCourses", "instructedCourses", "quizAttempts", "assignmentSubmissions", "gradedSubmissions", "videoRatings", "comments", "certificates", "password"})
    private User instructor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Lesson> lessons = new HashSet<>();

    @ManyToMany(mappedBy = "enrolledCourses", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<User> enrolledStudents = new HashSet<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Review> reviews = new HashSet<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Constructors
    public Course() {}

    public Course(String title, String description, BigDecimal price, User instructor, Category category) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.instructor = instructor;
        this.category = category;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFullDescription() {
        return fullDescription;
    }

    public void setFullDescription(String fullDescription) {
        this.fullDescription = fullDescription;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(BigDecimal originalPrice) {
        this.originalPrice = originalPrice;
    }

    public String getThumbnailImage() {
        return thumbnailImage;
    }

    public void setThumbnailImage(String thumbnailImage) {
        this.thumbnailImage = thumbnailImage;
    }

    public String getVideoPreviewUrl() {
        return videoPreviewUrl;
    }

    public void setVideoPreviewUrl(String videoPreviewUrl) {
        this.videoPreviewUrl = videoPreviewUrl;
    }

    public Level getLevel() {
        return level;
    }

    public void setLevel(Level level) {
        this.level = level;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Integer getEnrollmentCount() {
        return enrollmentCount;
    }

    public void setEnrollmentCount(Integer enrollmentCount) {
        this.enrollmentCount = enrollmentCount;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getTotalRatings() {
        return totalRatings;
    }

    public void setTotalRatings(Integer totalRatings) {
        this.totalRatings = totalRatings;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public String getWhatYouWillLearn() {
        return whatYouWillLearn;
    }

    public void setWhatYouWillLearn(String whatYouWillLearn) {
        this.whatYouWillLearn = whatYouWillLearn;
    }

    public User getInstructor() {
        return instructor;
    }

    public void setInstructor(User instructor) {
        this.instructor = instructor;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Set<Lesson> getLessons() {
        return lessons;
    }

    public void setLessons(Set<Lesson> lessons) {
        this.lessons = lessons;
    }

    public Set<User> getEnrolledStudents() {
        return enrolledStudents;
    }

    public void setEnrolledStudents(Set<User> enrolledStudents) {
        this.enrolledStudents = enrolledStudents;
    }

    public Set<Review> getReviews() {
        return reviews;
    }

    public void setReviews(Set<Review> reviews) {
        this.reviews = reviews;
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

    public Boolean getIsFree() {
        return isFree;
    }

    public void setIsFree(Boolean isFree) {
        this.isFree = isFree;
    }

    public enum Level {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED
    }

    public enum Status {
        DRAFT,
        PUBLISHED,
        ARCHIVED
    }
}
