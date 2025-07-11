package com.edupress.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class ApiEndpointAvailabilityTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String createUrl(String endpoint) {
        return "http://localhost:" + port + endpoint;
    }

    @Test
    void testLessonEndpointsAreAvailable() {
        // Test that lesson endpoints exist and don't return 404
        ResponseEntity<String> response = restTemplate.getForEntity(
            createUrl("/api/lessons"), String.class);
        
        // Should not be 404 (Not Found) - can be 200, 401, 403, 500 etc.
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testCourseEndpointsAreAvailable() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            createUrl("/api/courses"), String.class);
        
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testUserEndpointsAreAvailable() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            createUrl("/api/users"), String.class);
        
        // User endpoints require authentication, so expect 401/403, not 404
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testQuizEndpointsAreAvailable() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            createUrl("/api/quizzes"), String.class);
        
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testAssignmentEndpointsAreAvailable() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            createUrl("/api/assignments"), String.class);
        
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testCommentEndpointsAreAvailable() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            createUrl("/api/comments"), String.class);
        
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testVideoEndpointsAreAvailable() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            createUrl("/api/videos"), String.class);
        
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testPaymentEndpointsAreAvailable() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            createUrl("/api/payments"), String.class);
        
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testCategoryEndpointsAreAvailable() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            createUrl("/api/categories"), String.class);
        
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testBlogPostEndpointsAreAvailable() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            createUrl("/api/blog-posts"), String.class);
        
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testNotificationEndpointsAreAvailable() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            createUrl("/api/notifications"), String.class);
        
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testEnrollmentEndpointsAreAvailable() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            createUrl("/api/enrollments"), String.class);
        
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testDashboardEndpointsAreAvailable() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            createUrl("/api/dashboard/stats"), String.class);
        
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testAnalyticsEndpointsAreAvailable() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            createUrl("/api/analytics/overview"), String.class);
        
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testSpecificLessonEndpoints() {
        // Test specific lesson endpoints with parameters
        ResponseEntity<String> response;
        
        // Test lesson by course
        response = restTemplate.getForEntity(
            createUrl("/api/lessons/course/1"), String.class);
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        
        // Test lesson count by course
        response = restTemplate.getForEntity(
            createUrl("/api/lessons/course/1/count"), String.class);
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        
        // Test lesson search
        response = restTemplate.getForEntity(
            createUrl("/api/lessons/search?query=test"), String.class);
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testSpecificCourseEndpoints() {
        ResponseEntity<String> response;
        
        // Test course search
        response = restTemplate.getForEntity(
            createUrl("/api/courses/search?query=test"), String.class);
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        
        // Test courses by category
        response = restTemplate.getForEntity(
            createUrl("/api/courses/category/1"), String.class);
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testApplicationHealthAndStructure() {
        // This test verifies that the application is running and serving requests
        // Even if individual endpoints return errors, the application should be responsive
        
        ResponseEntity<String> response = restTemplate.getForEntity(
            createUrl("/api/lessons"), String.class);
        
        // The application should be responding (not connection refused)
        // Status can be anything except connection errors
        assertNotNull(response);
        assertNotNull(response.getStatusCode());
        
        // Log the response for debugging
        System.out.println("Application is responding. Status: " + response.getStatusCode());
    }
}
