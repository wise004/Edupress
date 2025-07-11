package com.edupress.service;

import com.edupress.dto.request.LoginRequest;
import com.edupress.dto.request.SignupRequest;
import com.edupress.dto.response.JwtResponse;
import com.edupress.model.User;
import com.edupress.repository.UserRepository;
import com.edupress.security.JwtUtils;
import com.edupress.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserService userService;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        User user = userPrincipal.getUser();
        return new JwtResponse(jwt, user.getId(), user.getUsername(), 
                              user.getEmail(), user.getRole().toString());
    }

    public User registerUser(SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        return userService.createUser(signupRequest);
    }

    public void logoutUser() {
        SecurityContextHolder.clearContext();
    }
}
