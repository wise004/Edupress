package com.edupress.controller;

import com.edupress.model.User;
import com.edupress.service.UserService;
import com.edupress.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users;
        
        if (search != null && !search.isEmpty()) {
            users = userService.searchUsers(search, pageable);
        } else if (role != null && !role.isEmpty()) {
            users = userService.findUsersByRole(User.Role.valueOf(role.toUpperCase()), pageable);
        } else {
            users = userService.findAllUsers(pageable);
        }
        
        return ResponseEntity.ok(users);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsersList() {
        List<User> users = userService.findAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.findById(id);
        return user.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.findByEmail(email);
        return user.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userService.findByUsername(username);
        return user.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.id")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        boolean exists = userService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/check-username/{username}")
    public ResponseEntity<Boolean> checkUsernameExists(@PathVariable String username) {
        boolean exists = userService.existsByUsername(username);
        return ResponseEntity.ok(exists);
    }

    // Enhanced admin user management endpoints
    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        try {
            User updatedUser = userService.updateUserRole(id, User.Role.valueOf(role.toUpperCase()));
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long id) {
        try {
            User updatedUser = userService.toggleUserStatus(id);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/instructors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<User>> getAllInstructors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> instructors = userService.findUsersByRole(User.Role.INSTRUCTOR, pageable);
        return ResponseEntity.ok(instructors);
    }

    @GetMapping("/students")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<Page<User>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> students = userService.findUsersByRole(User.Role.STUDENT, pageable);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/stats/total")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getTotalUsers() {
        long total = userService.getTotalUsers();
        return ResponseEntity.ok(total);
    }

    @GetMapping("/stats/by-role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserStatsByRole() {
        return ResponseEntity.ok(userService.getUserStatsByRole());
    }

    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.id")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody String newPassword) {
        try {
            userService.changePassword(id, newPassword);
            return ResponseEntity.ok("Password changed successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/avatar")
    @PreAuthorize("#id == principal.id or hasRole('ADMIN')")
    public ResponseEntity<User> uploadAvatar(@PathVariable Long id, @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            User updatedUser = userService.uploadAvatar(id, file);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> getCurrentUserProfile(Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User currentUser = userPrincipal.getUser();
            // Remove sensitive information before returning
            currentUser.setPassword(null);
            return ResponseEntity.ok(currentUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> updateCurrentUserProfile(@RequestBody User userDetails, Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User currentUser = userPrincipal.getUser();
            
            // Update only allowed fields
            currentUser.setFirstName(userDetails.getFirstName());
            currentUser.setLastName(userDetails.getLastName());
            currentUser.setBio(userDetails.getBio());
            currentUser.setProfileImage(userDetails.getProfileImage());
            
            User updatedUser = userService.updateUser(currentUser.getId(), currentUser);
            // Remove sensitive information before returning
            updatedUser.setPassword(null);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
