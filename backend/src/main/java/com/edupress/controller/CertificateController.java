package com.edupress.controller;

import com.edupress.model.*;
import com.edupress.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    // Certificate operations
    @PostMapping("/generate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<Certificate> generateCertificate(
            @RequestParam Long courseId,
            @RequestParam Long studentId) {
        try {
            Certificate certificate = certificateService.generateCertificate(courseId, studentId);
            return ResponseEntity.ok(certificate);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Certificate> getCertificateById(@PathVariable Long id) {
        Optional<Certificate> certificate = certificateService.findById(id);
        return certificate.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/verify/{certificateId}")
    public ResponseEntity<Certificate> getCertificateByCertificateId(@PathVariable String certificateId) {
        Optional<Certificate> certificate = certificateService.findByCertificateId(certificateId);
        return certificate.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Certificate>> getStudentCertificates(@PathVariable Long studentId) {
        List<Certificate> certificates = certificateService.getStudentCertificates(studentId);
        return ResponseEntity.ok(certificates);
    }

    @GetMapping("/student/{studentId}/paginated")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Page<Certificate>> getStudentCertificatesPaginated(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Certificate> certificates = certificateService.getStudentCertificates(studentId, pageable);
        return ResponseEntity.ok(certificates);
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Certificate>> getCourseCertificates(@PathVariable Long courseId) {
        List<Certificate> certificates = certificateService.getCourseCertificates(courseId);
        return ResponseEntity.ok(certificates);
    }

    @GetMapping("/course/{courseId}/paginated")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Page<Certificate>> getCourseCertificatesPaginated(
            @PathVariable Long courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Certificate> certificates = certificateService.getCourseCertificates(courseId, pageable);
        return ResponseEntity.ok(certificates);
    }

    @GetMapping("/instructor/{instructorId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Certificate>> getInstructorCertificates(@PathVariable Long instructorId) {
        List<Certificate> certificates = certificateService.getInstructorCertificates(instructorId);
        return ResponseEntity.ok(certificates);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<Resource> downloadCertificatePdf(@PathVariable Long id) {
        try {
            Path pdfPath = certificateService.getCertificatePdfPath(id);
            Resource resource = new UrlResource(pdfPath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"certificate.pdf\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCertificate(@PathVariable Long id) {
        try {
            certificateService.deleteCertificate(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Page<Certificate>> searchCertificates(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Certificate> certificates = certificateService.searchCertificates(query, pageable);
        return ResponseEntity.ok(certificates);
    }

    // Certificate verification
    @GetMapping("/verify-id/{certificateId}")
    public ResponseEntity<Boolean> verifyCertificateId(@PathVariable String certificateId) {
        boolean isValid = certificateService.verifyCertificate(certificateId);
        return ResponseEntity.ok(isValid);
    }

    // Statistics
    @GetMapping("/student/{studentId}/count")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Long> getStudentCertificateCount(@PathVariable Long studentId) {
        long count = certificateService.getStudentCertificateCount(studentId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/course/{courseId}/count")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Long> getCourseCertificateCount(@PathVariable Long courseId) {
        long count = certificateService.getCourseCertificateCount(courseId);
        return ResponseEntity.ok(count);
    }
}
