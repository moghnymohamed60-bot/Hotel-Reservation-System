package com.example.hotelreservation.service;

import com.example.hotelreservation.dto.request.LoginRequest;
import com.example.hotelreservation.dto.request.RegisterRequest;
import com.example.hotelreservation.dto.response.AuthResponse;
import com.example.hotelreservation.dto.response.UserResponse;
import com.example.hotelreservation.entity.User;
import com.example.hotelreservation.enums.AccountStatus;
import com.example.hotelreservation.enums.Role;
import com.example.hotelreservation.exception.DuplicateResourceException;
import com.example.hotelreservation.mapper.UserMapper;
import com.example.hotelreservation.repository.UserRepository;
import com.example.hotelreservation.security.JwtTokenProvider;
import com.example.hotelreservation.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User user;
    private UserResponse userResponse;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("securePassword123")
                .phoneNumber("+1234567890")
                .build();

        loginRequest = LoginRequest.builder()
                .email("john.doe@example.com")
                .password("securePassword123")
                .build();

        user = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("encodedPassword")
                .phoneNumber("+1234567890")
                .role(Role.CUSTOMER)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        userResponse = UserResponse.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .phoneNumber("+1234567890")
                .role(Role.CUSTOMER)
                .accountStatus(AccountStatus.ACTIVE)
                .build();
    }

    @Test
    @DisplayName("Should successfully register a new user")
    void testRegisterSuccess() {
        when(userRepository.existsByEmail("john.doe@example.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(tokenProvider.generateTokenFromUser(anyLong(), anyString(), anyString())).thenReturn("mockJwtToken");
        when(tokenProvider.getExpirationInMs()).thenReturn(86400000L);
        when(userMapper.toResponse(any(User.class))).thenReturn(userResponse);

        AuthResponse result = authService.register(registerRequest);

        assertNotNull(result);
        assertEquals("mockJwtToken", result.getToken());
        assertEquals("Bearer", result.getTokenType());
        assertEquals("john.doe@example.com", result.getUser().getEmail());

        verify(userRepository, times(1)).existsByEmail("john.doe@example.com");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when email already registered")
    void testRegisterDuplicateEmail() {
        when(userRepository.existsByEmail("john.doe@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should successfully authenticate user and return token")
    void testLoginSuccess() {
        Authentication auth = mock(Authentication.class);
        UserPrincipal principal = UserPrincipal.create(user);
        when(auth.getPrincipal()).thenReturn(principal);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mockJwtToken");
        when(tokenProvider.getExpirationInMs()).thenReturn(86400000L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toResponse(user)).thenReturn(userResponse);

        AuthResponse result = authService.login(loginRequest);

        assertNotNull(result);
        assertEquals("mockJwtToken", result.getToken());
        assertEquals("John", result.getUser().getFirstName());
    }
}
