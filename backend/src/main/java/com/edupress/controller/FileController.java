package com.edupress.controller;

import com.edupress.service.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/files")
public class FileController {

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN') or hasRole('STUDENT')")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
                                       @RequestParam(value = "type", defaultValue = "general") String type) {
        try {
            String fileName = fileStorageService.storeFile(file, type);
            
            Map<String, Object> response = new HashMap<>();
            response.put("filename", fileName);
            response.put("originalFilename", file.getOriginalFilename());
            response.put("url", "/api/files/download/" + fileName);
            response.put("contentType", file.getContentType());
            response.put("size", file.getSize());
            response.put("type", type);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error uploading file: ", e);
            return ResponseEntity.badRequest()
                    .body("Could not upload file: " + e.getMessage());
        }
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName,
                                               HttpServletRequest request) {
        try {
            Resource resource = fileStorageService.loadFileAsResource(fileName);

            String contentType = null;
            try {
                contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            } catch (IOException ex) {
                logger.info("Could not determine file type.");
            }

            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                           "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            logger.error("Error downloading file: ", e);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/view/{fileName:.+}")
    public ResponseEntity<Resource> viewFile(@PathVariable String fileName,
                                           HttpServletRequest request) {
        try {
            Resource resource = fileStorageService.loadFileAsResource(fileName);

            String contentType = null;
            try {
                contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            } catch (IOException ex) {
                logger.info("Could not determine file type.");
            }

            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                    .body(resource);
        } catch (Exception e) {
            logger.error("Error viewing file: ", e);
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{fileName:.+}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteFile(@PathVariable String fileName) {
        try {
            fileStorageService.deleteFile(fileName);
            return ResponseEntity.ok("File deleted successfully");
        } catch (Exception e) {
            logger.error("Error deleting file: ", e);
            return ResponseEntity.badRequest()
                    .body("Could not delete file: " + e.getMessage());
        }
    }

    @GetMapping("/info/{fileName:.+}")
    public ResponseEntity<?> getFileInfo(@PathVariable String fileName) {
        try {
            Map<String, Object> fileInfo = fileStorageService.getFileInfo(fileName);
            return ResponseEntity.ok(fileInfo);
        } catch (Exception e) {
            logger.error("Error getting file info: ", e);
            return ResponseEntity.notFound().build();
        }
    }
}
