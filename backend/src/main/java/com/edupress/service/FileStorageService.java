package com.edupress.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);

    private final Path fileStorageLocation;

    // Allowed file types
    private static final String[] ALLOWED_IMAGE_TYPES = {
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    };
    
    private static final String[] ALLOWED_VIDEO_TYPES = {
        "video/mp4", "video/avi", "video/mov", "video/wmv", "video/flv"
    };
    
    private static final String[] ALLOWED_DOCUMENT_TYPES = {
        "application/pdf", "application/msword", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    };

    public FileStorageService(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file, String type) {
        // Validate file
        validateFile(file);

        // Normalize file name
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.trim().isEmpty()) {
            throw new RuntimeException("Original filename is required");
        }
        originalFileName = StringUtils.cleanPath(originalFileName);
        
        try {
            // Check if the file's name contains invalid characters
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + originalFileName);
            }

            // Generate unique filename
            String fileExtension = getFileExtension(originalFileName);
            String uniqueFileName = generateUniqueFileName(type, fileExtension);

            // Create type-specific directory
            Path typeDirectory = this.fileStorageLocation.resolve(type);
            Files.createDirectories(typeDirectory);

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = typeDirectory.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            logger.info("File stored successfully: {}", uniqueFileName);
            return type + "/" + uniqueFileName;

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + fileName, ex);
        }
    }

    public void deleteFile(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
            logger.info("File deleted successfully: {}", fileName);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file " + fileName, ex);
        }
    }

    public Map<String, Object> getFileInfo(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            
            if (!Files.exists(filePath)) {
                throw new RuntimeException("File not found " + fileName);
            }

            Map<String, Object> fileInfo = new HashMap<>();
            fileInfo.put("filename", fileName);
            fileInfo.put("size", Files.size(filePath));
            fileInfo.put("contentType", Files.probeContentType(filePath));
            fileInfo.put("lastModified", Files.getLastModifiedTime(filePath).toString());
            fileInfo.put("exists", true);

            return fileInfo;
        } catch (IOException ex) {
            throw new RuntimeException("Could not get file info " + fileName, ex);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file.");
        }

        // Check file size (10MB limit)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException("File size exceeds maximum limit of 10MB.");
        }

        // Check file type
        String contentType = file.getContentType();
        if (!isAllowedContentType(contentType)) {
            throw new RuntimeException("File type not allowed: " + contentType);
        }
    }

    private boolean isAllowedContentType(String contentType) {
        if (contentType == null) {
            return false;
        }

        for (String allowedType : ALLOWED_IMAGE_TYPES) {
            if (contentType.equals(allowedType)) {
                return true;
            }
        }

        for (String allowedType : ALLOWED_VIDEO_TYPES) {
            if (contentType.equals(allowedType)) {
                return true;
            }
        }

        for (String allowedType : ALLOWED_DOCUMENT_TYPES) {
            if (contentType.equals(allowedType)) {
                return true;
            }
        }

        return false;
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }

    private String generateUniqueFileName(String type, String extension) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        return type + "_" + timestamp + "_" + uuid + extension;
    }

    public boolean fileExists(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            return Files.exists(filePath);
        } catch (Exception ex) {
            return false;
        }
    }

    public String getFileUrl(String fileName) {
        return "/api/files/view/" + fileName;
    }
}
