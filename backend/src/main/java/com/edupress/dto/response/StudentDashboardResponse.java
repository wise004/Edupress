package com.edupress.dto.response;

import java.util.List;

public class StudentDashboardResponse {
    private long totalEnrolledCourses;
    private long completedCourses;
    private long inProgressCourses;
    private long certificatesEarned;
    private double averageProgress;
    private int streakDays;
    private int totalHoursLearned;
    private List<String> recentCourses;
    private List<String> upcomingDeadlines;

    // Constructors
    public StudentDashboardResponse() {}

    // Getters and setters
    public long getTotalEnrolledCourses() {
        return totalEnrolledCourses;
    }

    public void setTotalEnrolledCourses(long totalEnrolledCourses) {
        this.totalEnrolledCourses = totalEnrolledCourses;
    }

    public long getCompletedCourses() {
        return completedCourses;
    }

    public void setCompletedCourses(long completedCourses) {
        this.completedCourses = completedCourses;
    }

    public long getInProgressCourses() {
        return inProgressCourses;
    }

    public void setInProgressCourses(long inProgressCourses) {
        this.inProgressCourses = inProgressCourses;
    }

    public long getCertificatesEarned() {
        return certificatesEarned;
    }

    public void setCertificatesEarned(long certificatesEarned) {
        this.certificatesEarned = certificatesEarned;
    }

    public double getAverageProgress() {
        return averageProgress;
    }

    public void setAverageProgress(double averageProgress) {
        this.averageProgress = averageProgress;
    }

    public int getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(int streakDays) {
        this.streakDays = streakDays;
    }

    public int getTotalHoursLearned() {
        return totalHoursLearned;
    }

    public void setTotalHoursLearned(int totalHoursLearned) {
        this.totalHoursLearned = totalHoursLearned;
    }

    public List<String> getRecentCourses() {
        return recentCourses;
    }

    public void setRecentCourses(List<String> recentCourses) {
        this.recentCourses = recentCourses;
    }

    public List<String> getUpcomingDeadlines() {
        return upcomingDeadlines;
    }

    public void setUpcomingDeadlines(List<String> upcomingDeadlines) {
        this.upcomingDeadlines = upcomingDeadlines;
    }
}
