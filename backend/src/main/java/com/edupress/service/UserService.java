package com.edupress.service;

import com.edupress.dto.request.SignupRequest;
import com.edupress.dto.response.JwtResponse;
import com.edupress.model.User;
import com.edupress.repository.UserRepository;
import com.edupress.security.JwtUtils;
import com.edupress.security.UserPrincipal;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public User createUser(SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setFirstName(signupRequest.getFirstName());
        user.setLastName(signupRequest.getLastName());
        user.setRole(User.Role.STUDENT);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setBio(userDetails.getBio());
        user.setProfileImage(userDetails.getProfileImage());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        userRepository.delete(user);
    }

    public JwtResponse authenticateUser(UserPrincipal userPrincipal) {
        String jwt = jwtUtils.generateJwtToken(userPrincipal.getUsername());
        User user = userPrincipal.getUser();
        
        return new JwtResponse(jwt, user.getId(), user.getUsername(), 
                              user.getEmail(), user.getRole().toString());
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public Page<User> findUsersByRole(User.Role role, Pageable pageable) {
        return userRepository.findByRole(role, pageable);
    }

    public Page<User> searchUsers(String searchTerm, Pageable pageable) {
        return userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                searchTerm, searchTerm, searchTerm, searchTerm, pageable);
    }

    public Page<User> findAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public long countUsersByRole(User.Role role) {
        return userRepository.countByRole(role);
    }

    public long getActiveUsersCount() {
        return userRepository.countByIsActiveTrue();
    }

    public long getVerifiedUsersCount() {
        return userRepository.countByEmailVerifiedTrue();
    }

    public long countAllUsers() {
        return userRepository.count();
    }

    public User updateUserRole(Long userId, User.Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setRole(newRole);
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }

    public User toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setIsActive(!user.getIsActive());
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }

    public long getTotalUsers() {
        return userRepository.count();
    }

    public Object getUserStatsByRole() {
        return new Object() {
            public final long totalUsers = userRepository.count();
            public final long admins = userRepository.countByRole(User.Role.ADMIN);
            public final long instructors = userRepository.countByRole(User.Role.INSTRUCTOR);
            public final long students = userRepository.countByRole(User.Role.STUDENT);
        };
    }

    public void changePassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new RuntimeException("Password cannot be empty");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        
        userRepository.save(user);
    }

    public User uploadAvatar(Long userId, org.springframework.web.multipart.MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Save file logic would go here - for now just return user
        // In a real implementation, you'd save the file and update the user's avatar URL
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            throw new RuntimeException("Current user not found in security context");
        }
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userPrincipal.getUser();
    }

    public User updateCurrentUserProfile(User userDetails) {
        // In a real implementation, you'd get the current user from security context
        User currentUser = getCurrentUser();
        
        currentUser.setFirstName(userDetails.getFirstName());
        currentUser.setLastName(userDetails.getLastName());
        currentUser.setEmail(userDetails.getEmail());
        currentUser.setBio(userDetails.getBio());
        currentUser.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(currentUser);
    }
}
