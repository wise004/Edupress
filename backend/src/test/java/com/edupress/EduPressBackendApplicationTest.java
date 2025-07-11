package com.edupress;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
class EduPressBackendApplicationTest {

    @Test
    void contextLoads() {
        // This test will verify that the Spring application context loads successfully
        // with all beans and configurations
    }

    @Test
    void applicationStarts() {
        // This test verifies that the application can start without errors
        // All controllers, services, and repositories should be initialized
    }
}
