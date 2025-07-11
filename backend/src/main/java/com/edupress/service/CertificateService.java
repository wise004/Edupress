package com.edupress.service;

import com.edupress.model.*;
import com.edupress.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private AssignmentSubmissionRepository submissionRepository;

    @Value("${app.upload.dir:uploads/}")
    private String uploadDir;

    private final String certificateDir = "certificates/";

    // Certificate CRUD operations
    public Certificate createCertificate(Certificate certificate) {
        return certificateRepository.save(certificate);
    }

    public Optional<Certificate> findById(Long id) {
        return certificateRepository.findById(id);
    }

    public Optional<Certificate> findByCertificateId(String certificateId) {
        return certificateRepository.findByCertificateId(certificateId);
    }

    public List<Certificate> findAll() {
        return certificateRepository.findAll();
    }

    public Page<Certificate> findAll(Pageable pageable) {
        return certificateRepository.findAll(pageable);
    }

    public void deleteCertificate(Long id) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found with id: " + id));
        certificate.setIsActive(false);
        certificateRepository.save(certificate);
    }

    // Business logic methods
    public Certificate generateCertificate(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        // Check if certificate already exists
        if (certificateRepository.existsByStudentAndCourse(student, course)) {
            throw new RuntimeException("Certificate already exists for this student and course");
        }

        // Check if student has completed all requirements
        if (!hasCompletedCourse(courseId, studentId)) {
            throw new RuntimeException("Student has not completed all course requirements");
        }

        // Generate unique certificate ID
        String certificateId = generateCertificateId();

        // Create certificate
        Certificate certificate = new Certificate(
                certificateId,
                student.getFirstName() + " " + student.getLastName(),
                course.getTitle(),
                course.getInstructor().getFirstName() + " " + course.getInstructor().getLastName(),
                LocalDateTime.now(),
                course,
                student
        );

        // Generate public share URL
        String shareUrl = generatePublicShareUrl(certificateId);
        certificate.setPublicShareUrl(shareUrl);

        // Save certificate first
        certificate = certificateRepository.save(certificate);

        // Generate PDF
        try {
            String pdfPath = generateCertificatePDF(certificate);
            certificate.setPdfFilePath(pdfPath);
            certificate.setCertificateUrl("/api/certificates/" + certificate.getId() + "/pdf");
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate certificate PDF: " + e.getMessage());
        }

        return certificateRepository.save(certificate);
    }

    private boolean hasCompletedCourse(Long courseId, Long studentId) {
        // Check quiz completion - all quizzes must be passed
        List<QuizAttempt> quizAttempts = quizAttemptRepository.findByCourseIdAndUserId(courseId, studentId);
        
        // Get all course quizzes
        // TODO: Implement quiz checking logic
        // For now, assuming course is completed if there are any quiz attempts
        
        // Check assignment completion - all assignments must be submitted and graded
        List<AssignmentSubmission> submissions = submissionRepository.findByCourseIdAndStudentId(courseId, studentId);
        
        // TODO: Implement proper completion checking logic
        // For now, returning true if there are submissions
        return !submissions.isEmpty() || !quizAttempts.isEmpty();
    }

    private String generateCertificateId() {
        LocalDateTime now = LocalDateTime.now();
        String dateStr = now.format(DateTimeFormatter.ofPattern("yyyy"));
        String randomStr = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "CERT-" + dateStr + "-" + randomStr;
    }

    private String generatePublicShareUrl(String certificateId) {
        return "/public/certificate/" + certificateId;
    }

    private String generateCertificatePDF(Certificate certificate) throws IOException {
        // Create certificates directory if it doesn't exist
        Path certificatesPath = Paths.get(uploadDir, certificateDir);
        if (!Files.exists(certificatesPath)) {
            Files.createDirectories(certificatesPath);
        }

        String fileName = "certificate_" + certificate.getCertificateId() + ".pdf";
        Path pdfPath = certificatesPath.resolve(fileName);

        // TODO: Implement actual PDF generation using a library like iText or PDFBox
        // For now, creating a simple text file as placeholder
        String content = generateCertificateContent(certificate);
        Files.write(pdfPath, content.getBytes());

        return pdfPath.toString();
    }

    private String generateCertificateContent(Certificate certificate) {
        return """
                CERTIFICATE OF COMPLETION
                
                This is to certify that
                
                %s
                
                has successfully completed the course
                
                %s
                
                Instructor: %s
                Completion Date: %s
                Certificate ID: %s
                
                This certificate can be verified at: %s
                """.formatted(
                certificate.getStudentName(),
                certificate.getCourseName(),
                certificate.getInstructorName(),
                certificate.getCompletionDate().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy")),
                certificate.getCertificateId(),
                certificate.getPublicShareUrl()
        );
    }

    public List<Certificate> getStudentCertificates(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        return certificateRepository.findByStudentOrderByCreatedAtDesc(student);
    }

    public List<Certificate> getCourseCertificates(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        return certificateRepository.findByCourseOrderByCreatedAtDesc(course);
    }

    public List<Certificate> getInstructorCertificates(Long instructorId) {
        return certificateRepository.findByInstructorId(instructorId);
    }

    public Optional<Certificate> findByPublicShareUrl(String shareUrl) {
        return certificateRepository.findByPublicShareUrl(shareUrl);
    }

    public long getStudentCertificateCount(Long studentId) {
        return certificateRepository.countByStudentId(studentId);
    }

    public long getCourseCertificateCount(Long courseId) {
        return certificateRepository.countByCourseId(courseId);
    }

    public Page<Certificate> searchCertificates(String searchTerm, Pageable pageable) {
        return certificateRepository.searchByStudentNameOrCourseName(searchTerm, pageable);
    }

    public Page<Certificate> getStudentCertificates(Long studentId, Pageable pageable) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        return certificateRepository.findByStudent(student, pageable);
    }

    public Page<Certificate> getCourseCertificates(Long courseId, Pageable pageable) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        return certificateRepository.findByCourse(course, pageable);
    }

    public Path getCertificatePdfPath(Long certificateId) {
        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found with id: " + certificateId));
        
        if (certificate.getPdfFilePath() == null) {
            throw new RuntimeException("Certificate PDF not found");
        }
        
        return Paths.get(certificate.getPdfFilePath());
    }

    public boolean verifyCertificate(String certificateId) {
        return certificateRepository.findByCertificateId(certificateId).isPresent();
    }

    public long getStudentCertificatesCount(Long studentId) {
        // Count certificates for student
        return certificateRepository.countByStudentId(studentId);
    }

    public Object getStudentRecentCertificates(Long studentId, int limit) {
        // Return recent certificates for student
        User student = userRepository.findById(studentId).orElse(null);
        if (student == null) return new Object[0];
        
        var certificates = certificateRepository.findByStudentOrderByCreatedAtDesc(student);
        return certificates.stream()
                .limit(limit)
                .map(cert -> new Object() {
                    public final Long id = cert.getId();
                    public final String certificateId = cert.getCertificateId();
                    public final String courseName = cert.getCourseName();
                    public final String studentName = cert.getStudentName();
                    public final Object issueDate = cert.getIssueDate();
                    public final String publicShareUrl = cert.getPublicShareUrl();
                })
                .toArray();
    }
}
