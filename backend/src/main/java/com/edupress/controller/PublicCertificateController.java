package com.edupress.controller;

import com.edupress.dto.response.CertificateShareResponse;
import com.edupress.dto.response.CertificateVerificationResponse;
import com.edupress.model.Certificate;
import com.edupress.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/public/certificates")
public class PublicCertificateController {

    @Autowired
    private CertificateService certificateService;

    // Public certificate verification (no authentication required)
    @GetMapping("/verify/{certificateId}")
    public ResponseEntity<CertificateVerificationResponse> verifyCertificate(@PathVariable String certificateId) {
        Optional<Certificate> certificate = certificateService.findByCertificateId(certificateId);
        
        if (certificate.isPresent()) {
            Certificate cert = certificate.get();
            CertificateVerificationResponse response = new CertificateVerificationResponse();
            response.setCertificateId(cert.getCertificateId());
            response.setStudentName(cert.getStudentName());
            response.setCourseName(cert.getCourseName());
            response.setInstructorName(cert.getInstructorName());
            response.setIssueDate(cert.getIssueDate().toString());
            response.setCompletionDate(cert.getCompletionDate().toString());
            response.setIsActive(cert.getIsActive());
            response.setIsValid(true);
            return ResponseEntity.ok(response);
        } else {
            CertificateVerificationResponse response = new CertificateVerificationResponse(false, "Certificate not found or invalid");
            return ResponseEntity.ok(response);
        }
    }

    // Public certificate PDF download (no authentication required)
    @GetMapping("/download/{certificateId}")
    public ResponseEntity<Resource> downloadCertificate(@PathVariable String certificateId) {
        Optional<Certificate> certificateOpt = certificateService.findByCertificateId(certificateId);
        
        if (certificateOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Certificate certificate = certificateOpt.get();
        
        if (certificate.getPdfFilePath() == null) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            Path filePath = Path.of(certificate.getPdfFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION, 
                               "attachment; filename=\"" + certificate.getCertificateId() + ".pdf\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Public certificate sharing page data
    @GetMapping("/share/{certificateId}")
    public ResponseEntity<CertificateShareResponse> getCertificateShareData(@PathVariable String certificateId) {
        Optional<Certificate> certificate = certificateService.findByCertificateId(certificateId);
        
        if (certificate.isPresent()) {
            Certificate cert = certificate.get();
            CertificateShareResponse response = new CertificateShareResponse();
            response.setCertificateId(cert.getCertificateId());
            response.setStudentName(cert.getStudentName());
            response.setCourseName(cert.getCourseName());
            response.setInstructorName(cert.getInstructorName());
            response.setIssueDate(cert.getIssueDate().toString());
            response.setCompletionDate(cert.getCompletionDate().toString());
            response.setPublicShareUrl(cert.getPublicShareUrl());
            response.setCertificateUrl(cert.getCertificateUrl());
            response.setIsActive(cert.getIsActive());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
