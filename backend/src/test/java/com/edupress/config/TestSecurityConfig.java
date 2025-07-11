package com.edupress.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@TestConfiguration
@EnableWebSecurity
public class TestSecurityConfig {

    @Bean
    @Primary
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.disable())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> 
                    auth.requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/lessons").hasAnyRole("INSTRUCTOR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/lessons/**").hasAnyRole("INSTRUCTOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/lessons/**").hasAnyRole("INSTRUCTOR", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/lessons/instructor/**").hasAnyRole("INSTRUCTOR", "ADMIN")
                        .anyRequest().authenticated()
                )
                .httpBasic(httpBasic -> {});

        return http.build();
    }

    @Bean
    @Primary
    public UserDetailsService userDetailsService() {
        UserDetails admin = User.builder()
                .username("admin")
                .password(passwordEncoder().encode("password"))
                .roles("ADMIN")
                .build();

        UserDetails instructor = User.builder()
                .username("instructor")
                .password(passwordEncoder().encode("password"))
                .roles("INSTRUCTOR")
                .build();

        UserDetails student = User.builder()
                .username("student")
                .password(passwordEncoder().encode("password"))
                .roles("STUDENT")
                .build();

        return new InMemoryUserDetailsManager(admin, instructor, student);
    }

    @Bean
    @Primary
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
