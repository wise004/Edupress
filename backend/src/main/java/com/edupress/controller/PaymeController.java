package com.edupress.controller;

import com.edupress.dto.request.PaymeRequest;
import com.edupress.dto.response.PaymeResponse;
import com.edupress.service.PaymeService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payme")
public class PaymeController {
    
    private static final Logger logger = LoggerFactory.getLogger(PaymeController.class);
    
    @Autowired
    private PaymeService paymeService;
    
    @Value("${payme.merchant.key}")
    private String merchantKey;
    
    @Value("${payme.test.key}")
    private String testKey;
    
    @Value("${payme.allowed.ips:#{null}}")
    private List<String> allowedIps;
    
    /**
     * Main Payme Merchant API endpoint
     * Receives all Payme requests via POST with JSON-RPC 2.0 protocol
     */
    @PostMapping(value = "/endpoint", 
                 consumes = MediaType.APPLICATION_JSON_VALUE,
                 produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PaymeResponse> handlePaymeRequest(
            @RequestBody PaymeRequest request,
            HttpServletRequest httpRequest) {
        
        try {
            // Log incoming request for debugging
            logger.info("Payme request received: method={}, id={}", 
                       request.getMethod(), request.getId());
            
            // Check IP whitelist if configured
            if (allowedIps != null && !allowedIps.isEmpty()) {
                String clientIp = getClientIpAddress(httpRequest);
                if (!allowedIps.contains(clientIp)) {
                    logger.warn("Unauthorized IP attempt: {}", clientIp);
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new PaymeResponse(
                            new PaymeResponse.PaymeError(-32504, "Insufficient privilege"),
                            request.getId()
                        ));
                }
            }
            
            // Validate authentication header
            String authHeader = httpRequest.getHeader("Authorization");
            if (!isValidAuthentication(authHeader)) {
                logger.warn("Invalid authentication for Payme request");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new PaymeResponse(
                        new PaymeResponse.PaymeError(-32504, "Insufficient privilege"),
                        request.getId()
                    ));
            }
            
            // Process the request
            PaymeResponse response = paymeService.processRequest(request);
            
            logger.info("Payme response: method={}, success={}", 
                       request.getMethod(), response.getError() == null);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error processing Payme request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new PaymeResponse(
                    new PaymeResponse.PaymeError(-32603, "Internal error"),
                    request.getId()
                ));
        }
    }
    
    /**
     * Generate payment URL for frontend
     */
    @PostMapping("/payment-url")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> generatePaymentUrl(
            @RequestBody Map<String, Object> paymentData) {
        
        try {
            Long courseId = Long.valueOf(paymentData.get("courseId").toString());
            Long userId = Long.valueOf(paymentData.get("userId").toString());
            
            String paymentUrl = paymeService.generatePaymentUrl(courseId, userId);
            
            return ResponseEntity.ok(Map.of(
                "paymentUrl", paymentUrl,
                "status", "success"
            ));
            
        } catch (Exception e) {
            logger.error("Error generating payment URL", e);
            return ResponseEntity.badRequest()
                .body(Map.of(
                    "error", "Failed to generate payment URL",
                    "message", e.getMessage()
                ));
        }
    }
    
    /**
     * Get payment statistics for admin
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getPaymentStats(
            @RequestParam(required = false) String period) {
        
        try {
            Map<String, Object> stats = paymeService.getPaymentStats(period);
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            logger.error("Error getting payment stats", e);
            return ResponseEntity.badRequest()
                .body(Map.of(
                    "error", "Failed to get payment statistics",
                    "message", e.getMessage()
                ));
        }
    }
    
    /**
     * Get user's Payme transactions
     */
    @GetMapping("/my-transactions")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getUserTransactions(
            @RequestParam Long userId) {
        
        try {
            List<Map<String, Object>> transactions = paymeService.getUserTransactions(userId);
            return ResponseEntity.ok(transactions);
            
        } catch (Exception e) {
            logger.error("Error getting user transactions", e);
            return ResponseEntity.badRequest()
                .body(List.of(Map.of(
                    "error", "Failed to get transactions",
                    "message", e.getMessage()
                )));
        }
    }
    
    /**
     * Check transaction status for frontend polling
     */
    @GetMapping("/transaction/{transactionId}/status")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getTransactionStatus(
            @PathVariable String transactionId) {
        
        try {
            Map<String, Object> status = paymeService.getTransactionStatus(transactionId);
            return ResponseEntity.ok(status);
            
        } catch (Exception e) {
            logger.error("Error getting transaction status", e);
            return ResponseEntity.badRequest()
                .body(Map.of(
                    "error", "Failed to get transaction status",
                    "message", e.getMessage()
                ));
        }
    }
    
    /**
     * Get all Payme transactions for admin
     */
    @GetMapping("/admin/transactions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllTransactions(
            @RequestParam(required = false) String period,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        
        try {
            List<Map<String, Object>> transactions = paymeService.getAllTransactionsForAdmin(period, status, page, size);
            return ResponseEntity.ok(transactions);
            
        } catch (Exception e) {
            logger.error("Error getting admin transactions", e);
            return ResponseEntity.badRequest()
                .body(List.of(Map.of(
                    "error", "Failed to get transactions",
                    "message", e.getMessage()
                )));
        }
    }
    
    /**
     * Validate Payme authentication header
     */
    private boolean isValidAuthentication(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Basic ")) {
            return false;
        }
        
        try {
            String credentials = authHeader.substring(6);
            String decoded = new String(Base64.getDecoder().decode(credentials));
            String[] parts = decoded.split(":");
            
            if (parts.length != 2) {
                return false;
            }
            
            String username = parts[0];
            String password = parts[1];
            
            // Check if it's Payme (username should be "Paycom")
            if (!"Paycom".equals(username)) {
                return false;
            }
            
            // Check password against merchant key or test key
            return merchantKey.equals(password) || testKey.equals(password);
            
        } catch (Exception e) {
            logger.error("Error validating authentication", e);
            return false;
        }
    }
    
    /**
     * Get client IP address from request
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}
