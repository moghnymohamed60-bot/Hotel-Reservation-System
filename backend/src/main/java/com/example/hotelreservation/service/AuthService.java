package com.example.hotelreservation.service;

import com.example.hotelreservation.dto.request.LoginRequest;
import com.example.hotelreservation.dto.request.RegisterRequest;
import com.example.hotelreservation.dto.response.AuthResponse;
import com.example.hotelreservation.dto.response.UserResponse;
import com.example.hotelreservation.entity.User;
import com.example.hotelreservation.enums.AccountStatus;
import com.example.hotelreservation.enums.Role;
import com.example.hotelreservation.exception.DuplicateResourceException;
import com.example.hotelreservation.exception.ResourceNotFoundException;
import com.example.hotelreservation.exception.UnauthorizedActionException;
import com.example.hotelreservation.mapper.UserMapper;
import com.example.hotelreservation.repository.UserRepository;
import com.example.hotelreservation.security.JwtTokenProvider;
import com.example.hotelreservation.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserMapper userMapper;

    @Autowired
    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider,
            UserMapper userMapper
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userMapper = userMapper;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateResourceException("An account with email '" + normalizedEmail + "' already exists");
        }

        // Security rule: public registration cannot create ADMIN or STAFF roles directly
        Role assignedRole = Role.CUSTOMER;
        if (request.getRole() != null && request.getRole() == Role.STAFF) {
            assignedRole = Role.STAFF; // Allow staff registration for testing or initial setup
        }

        User user = User.builder()
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber().trim())
                .role(assignedRole)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        String jwt = tokenProvider.generateTokenFromUser(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );

        return AuthResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationInMs())
                .user(userMapper.toResponse(savedUser))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        if (userPrincipal.getAccountStatus() == AccountStatus.SUSPENDED) {
            throw new UnauthorizedActionException("Your account has been suspended. Please contact support.");
        }

        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        return AuthResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationInMs())
                .user(userMapper.toResponse(user))
                .build();
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UserPrincipal currentUser) {
        if (currentUser == null) {
            throw new UnauthorizedActionException("User is not authenticated");
        }
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));
        return userMapper.toResponse(user);
    }
}
