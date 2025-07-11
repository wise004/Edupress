package com.edupress.dto.response;

import java.util.List;

public class InstructorDashboardResponse {
    private long totalCourses;
    private long publishedCourses;
    private long totalStudents;
    private long totalRevenue;
    private double averageRating;
    private long totalQuizzes;
    private long totalAssignments;
    private long totalVideos;
    private List<String> topCourses;
    private List<String> recentEnrollments;

    // Constructors
    public InstructorDashboardResponse() {}

    // Getters and setters
    public long getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(long totalCourses) {
        this.totalCourses = totalCourses;
    }

    public long getPublishedCourses() {
        return publishedCourses;
    }

    public void setPublishedCourses(long publishedCourses) {
        this.publishedCourses = publishedCourses;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(long totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public long getTotalQuizzes() {
        return totalQuizzes;
    }

    public void setTotalQuizzes(long totalQuizzes) {
        this.totalQuizzes = totalQuizzes;
    }

    public long getTotalAssignments() {
        return totalAssignments;
    }

    public void setTotalAssignments(long totalAssignments) {
        this.totalAssignments = totalAssignments;
    }

    public long getTotalVideos() {
        return totalVideos;
    }

    public void setTotalVideos(long totalVideos) {
        this.totalVideos = totalVideos;
    }

    public List<String> getTopCourses() {
        return topCourses;
    }

    public void setTopCourses(List<String> topCourses) {
        this.topCourses = topCourses;
    }

    public List<String> getRecentEnrollments() {
        return recentEnrollments;
    }

    public void setRecentEnrollments(List<String> recentEnrollments) {
        this.recentEnrollments = recentEnrollments;
    }
}
