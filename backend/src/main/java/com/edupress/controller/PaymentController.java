package com.edupress.controller;

import com.edupress.dto.request.PaymentRequest;
import com.edupress.dto.response.PaymentResponse;
import com.edupress.service.PaymentService;
import com.stripe.exception.StripeException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-intent")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> createPaymentIntent(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails,
            @Valid @RequestBody PaymentRequest request) {
        try {
            // Get user ID from userDetails (you'll need to implement this based on your UserPrincipal)
            Long userId = getUserIdFromUserDetails(userDetails);
            
            PaymentResponse response = paymentService.createPaymentIntent(userId, request);
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Payment processing error: " + e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/confirm/{paymentIntentId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> confirmPayment(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails,
            @PathVariable String paymentIntentId,
            @RequestParam(required = false) String paymentMethodId) {
        try {
            Long userId = getUserIdFromUserDetails(userDetails);
            
            PaymentResponse response = paymentService.confirmPayment(userId, paymentIntentId, paymentMethodId);
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Payment processing error: " + e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/status/{paymentIntentId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getPaymentStatus(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails,
            @PathVariable String paymentIntentId) {
        try {
            Long userId = getUserIdFromUserDetails(userDetails);
            
            PaymentResponse response = paymentService.getPaymentStatus(userId, paymentIntentId);
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Payment processing error: " + e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-payments")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<PaymentResponse>> getUserPayments(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        try {
            Long userId = getUserIdFromUserDetails(userDetails);
            
            List<PaymentResponse> payments = paymentService.getUserPayments(userId);
            return ResponseEntity.ok(payments);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<PaymentResponse>> getCoursePayments(
            @PathVariable Long courseId) {
        try {
            List<PaymentResponse> payments = paymentService.getCoursePayments(courseId);
            return ResponseEntity.ok(payments);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getPaymentStats() {
        try {
            Map<String, Object> stats = paymentService.getPaymentStats();
            return ResponseEntity.ok(stats);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // TODO: Add webhook endpoint for Stripe webhooks
    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        // Webhook implementation for handling Stripe events
        // This would verify the webhook signature and process events like payment.succeeded
        try {
            // Verify webhook signature
            // Process relevant events
            // Update payment status if needed
            
            return ResponseEntity.ok("Webhook received");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Webhook processing failed");
        }
    }

    private Long getUserIdFromUserDetails(org.springframework.security.core.userdetails.UserDetails userDetails) {
        // This method should extract the user ID from your UserPrincipal implementation
        // For now, assuming UserPrincipal has a getId() method
        if (userDetails instanceof com.edupress.security.UserPrincipal) {
            return ((com.edupress.security.UserPrincipal) userDetails).getId();
        }
        throw new RuntimeException("Unable to extract user ID from authentication details");
    }
}
