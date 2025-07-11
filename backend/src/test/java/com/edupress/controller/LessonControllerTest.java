package com.edupress.controller;

import com.edupress.config.TestSecurityConfig;
import com.edupress.model.Lesson;
import com.edupress.service.LessonService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LessonController.class)
@Import(TestSecurityConfig.class)
@ActiveProfiles("test")
class LessonControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LessonService lessonService;

    @Autowired
    private ObjectMapper objectMapper;

    private Lesson testLesson;

    @BeforeEach
    void setUp() {
        testLesson = new Lesson();
        testLesson.setId(1L);
        testLesson.setTitle("Test Lesson");
        testLesson.setDescription("Test description");
        testLesson.setContentText("Test content text");
        testLesson.setDuration(60);
        testLesson.setOrderIndex(1);
        testLesson.setIsFree(true);
        testLesson.setCreatedAt(LocalDateTime.now());
        testLesson.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    @WithMockUser(roles = "INSTRUCTOR")
    void getAllLessons_ShouldReturnPageOfLessons() throws Exception {
        // Given
        List<Lesson> lessons = Arrays.asList(testLesson);
        Page<Lesson> lessonPage = new PageImpl<>(lessons, PageRequest.of(0, 10), 1);
        when(lessonService.findAll(any(Pageable.class))).thenReturn(lessonPage);

        // When & Then
        mockMvc.perform(get("/api/lessons")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Test Lesson"))
                .andExpect(jsonPath("$.content[0].duration").value(60))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(lessonService, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @WithMockUser(roles = "INSTRUCTOR")
    void getLessonById_WhenLessonExists_ShouldReturnLesson() throws Exception {
        // Given
        when(lessonService.findById(1L)).thenReturn(Optional.of(testLesson));

        // When & Then
        mockMvc.perform(get("/api/lessons/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Lesson"))
                .andExpect(jsonPath("$.contentText").value("Test content text"))
                .andExpect(jsonPath("$.duration").value(60));

        verify(lessonService, times(1)).findById(1L);
    }

    @Test
    @WithMockUser(roles = "INSTRUCTOR")
    void getLessonById_WhenLessonNotExists_ShouldReturnNotFound() throws Exception {
        // Given
        when(lessonService.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/lessons/999"))
                .andExpect(status().isNotFound());

        verify(lessonService, times(1)).findById(999L);
    }

    @Test
    @WithMockUser(roles = "INSTRUCTOR")
    void getLessonsByCourse_ShouldReturnLessonsForCourse() throws Exception {
        // Given
        List<Lesson> lessons = Arrays.asList(testLesson);
        when(lessonService.findByCourseId(1L)).thenReturn(lessons);

        // When & Then
        mockMvc.perform(get("/api/lessons/course/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Lesson"))
                .andExpect(jsonPath("$[0].duration").value(60));

        verify(lessonService, times(1)).findByCourseId(1L);
    }

    @Test
    @WithMockUser(roles = "INSTRUCTOR")
    void getLessonsByInstructor_WithInstructorRole_ShouldReturnLessons() throws Exception {
        // Given
        List<Lesson> lessons = Arrays.asList(testLesson);
        when(lessonService.findByInstructorId(1L)).thenReturn(lessons);

        // When & Then
        mockMvc.perform(get("/api/lessons/instructor/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Lesson"));

        verify(lessonService, times(1)).findByInstructorId(1L);
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    void getLessonsByInstructor_WithStudentRole_ShouldReturnForbidden() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/lessons/instructor/1"))
                .andExpect(status().isForbidden());

        verify(lessonService, never()).findByInstructorId(anyLong());
    }

    @Test
    @WithMockUser(roles = "INSTRUCTOR")
    void searchLessons_ShouldReturnFilteredResults() throws Exception {
        // Given
        List<Lesson> lessons = Arrays.asList(testLesson);
        Page<Lesson> lessonPage = new PageImpl<>(lessons, PageRequest.of(0, 10), 1);
        when(lessonService.searchLessons(eq("test"), any(Pageable.class))).thenReturn(lessonPage);

        // When & Then
        mockMvc.perform(get("/api/lessons/search")
                .param("query", "test")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Test Lesson"));

        verify(lessonService, times(1)).searchLessons(eq("test"), any(Pageable.class));
    }

    @Test
    @WithMockUser(roles = "INSTRUCTOR")
    void createLesson_WithValidData_ShouldCreateLesson() throws Exception {
        // Given
        when(lessonService.createLesson(any(Lesson.class))).thenReturn(testLesson);

        // When & Then
        mockMvc.perform(post("/api/lessons")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testLesson)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Lesson"));

        verify(lessonService, times(1)).createLesson(any(Lesson.class));
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    void createLesson_WithStudentRole_ShouldReturnForbidden() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/lessons")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testLesson)))
                .andExpect(status().isForbidden());

        verify(lessonService, never()).createLesson(any(Lesson.class));
    }

    @Test
    @WithMockUser(roles = "INSTRUCTOR")
    void updateLesson_WhenLessonExists_ShouldUpdateLesson() throws Exception {
        // Given
        testLesson.setTitle("Updated Lesson");
        when(lessonService.updateLesson(eq(1L), any(Lesson.class))).thenReturn(testLesson);

        // When & Then
        mockMvc.perform(put("/api/lessons/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testLesson)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Lesson"));

        verify(lessonService, times(1)).updateLesson(eq(1L), any(Lesson.class));
    }

    @Test
    @WithMockUser(roles = "INSTRUCTOR")
    void updateLesson_WhenLessonNotExists_ShouldReturnNotFound() throws Exception {
        // Given
        when(lessonService.updateLesson(eq(999L), any(Lesson.class)))
                .thenThrow(new RuntimeException("Lesson not found"));

        // When & Then
        mockMvc.perform(put("/api/lessons/999")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testLesson)))
                .andExpect(status().isNotFound());

        verify(lessonService, times(1)).updateLesson(eq(999L), any(Lesson.class));
    }

    @Test
    @WithMockUser(roles = "INSTRUCTOR")
    void deleteLesson_WhenLessonExists_ShouldDeleteLesson() throws Exception {
        // Given
        doNothing().when(lessonService).deleteLesson(1L);

        // When & Then
        mockMvc.perform(delete("/api/lessons/1").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("Lesson deleted successfully!"));

        verify(lessonService, times(1)).deleteLesson(1L);
    }

    @Test
    @WithMockUser(roles = "INSTRUCTOR")
    void deleteLesson_WhenLessonNotExists_ShouldReturnNotFound() throws Exception {
        // Given
        doThrow(new RuntimeException("Lesson not found")).when(lessonService).deleteLesson(999L);

        // When & Then
        mockMvc.perform(delete("/api/lessons/999").with(csrf()))
                .andExpect(status().isNotFound());

        verify(lessonService, times(1)).deleteLesson(999L);
    }

    @Test
    @WithMockUser(roles = "INSTRUCTOR")
    void getLessonCountByCourse_ShouldReturnCount() throws Exception {
        // Given
        when(lessonService.countByCourseId(1L)).thenReturn(5L);

        // When & Then
        mockMvc.perform(get("/api/lessons/course/1/count"))
                .andExpect(status().isOk())
                .andExpect(content().string("5"));

        verify(lessonService, times(1)).countByCourseId(1L);
    }

    @Test
    @WithMockUser(roles = "INSTRUCTOR")
    void reorderLesson_WithValidData_ShouldReorderLesson() throws Exception {
        // Given
        testLesson.setOrderIndex(3);
        when(lessonService.reorderLesson(1L, 3)).thenReturn(testLesson);

        // When & Then
        mockMvc.perform(put("/api/lessons/1/reorder")
                .with(csrf())
                .param("newOrder", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderIndex").value(3));

        verify(lessonService, times(1)).reorderLesson(1L, 3);
    }

    @Test
    @WithMockUser(roles = "INSTRUCTOR")
    void reorderLesson_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        // Given
        when(lessonService.reorderLesson(1L, -1))
                .thenThrow(new RuntimeException("Invalid order"));

        // When & Then
        mockMvc.perform(put("/api/lessons/1/reorder")
                .with(csrf())
                .param("newOrder", "-1"))
                .andExpect(status().isBadRequest());

        verify(lessonService, times(1)).reorderLesson(1L, -1);
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    void completeLesson_WithValidData_ShouldMarkAsCompleted() throws Exception {
        // Given
        doNothing().when(lessonService).markLessonAsCompleted(1L, 1L);

        // When & Then
        mockMvc.perform(post("/api/lessons/1/complete")
                .with(csrf())
                .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Lesson marked as completed!"));

        verify(lessonService, times(1)).markLessonAsCompleted(1L, 1L);
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    void completeLesson_WithError_ShouldReturnBadRequest() throws Exception {
        // Given
        doThrow(new RuntimeException("Already completed"))
                .when(lessonService).markLessonAsCompleted(1L, 1L);

        // When & Then
        mockMvc.perform(post("/api/lessons/1/complete")
                .with(csrf())
                .param("userId", "1"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Already completed"));

        verify(lessonService, times(1)).markLessonAsCompleted(1L, 1L);
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    void getLessonCompletionStatus_ShouldReturnCompletionStatus() throws Exception {
        // Given
        when(lessonService.isLessonCompletedByUser(1L, 1L)).thenReturn(true);

        // When & Then
        mockMvc.perform(get("/api/lessons/1/completion-status")
                .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        verify(lessonService, times(1)).isLessonCompletedByUser(1L, 1L);
    }
}
