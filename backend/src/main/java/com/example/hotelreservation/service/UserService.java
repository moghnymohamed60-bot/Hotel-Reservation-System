package com.example.hotelreservation.service;

import com.example.hotelreservation.dto.request.PasswordChangeRequest;
import com.example.hotelreservation.dto.request.UserUpdateRequest;
import com.example.hotelreservation.dto.response.UserResponse;
import com.example.hotelreservation.entity.User;
import com.example.hotelreservation.enums.Role;
import com.example.hotelreservation.exception.DuplicateResourceException;
import com.example.hotelreservation.exception.InvalidReservationException;
import com.example.hotelreservation.exception.ResourceNotFoundException;
import com.example.hotelreservation.exception.UnauthorizedActionException;
import com.example.hotelreservation.mapper.UserMapper;
import com.example.hotelreservation.repository.UserRepository;
import com.example.hotelreservation.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id, UserPrincipal currentUser) {
        validateAccess(id, currentUser);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request, UserPrincipal currentUser) {
        validateAccess(id, currentUser);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (!user.getEmail().equalsIgnoreCase(normalizedEmail) && userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateResourceException("Email '" + normalizedEmail + "' is already in use by another account");
        }

        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setEmail(normalizedEmail);
        user.setPhoneNumber(request.getPhoneNumber().trim());

        // Only ADMIN can change roles and account statuses
        if (currentUser.getRole() == Role.ADMIN) {
            if (request.getRole() != null) user.setRole(request.getRole());
            if (request.getAccountStatus() != null) user.setAccountStatus(request.getAccountStatus());
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

    @Transactional
    public void changePassword(Long id, PasswordChangeRequest request, UserPrincipal currentUser) {
        validateAccess(id, currentUser);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidReservationException("Current password does not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", "id", id);
        }
        userRepository.deleteById(id);
    }

    private void validateAccess(Long targetUserId, UserPrincipal currentUser) {
        if (currentUser.getRole() != Role.ADMIN && !targetUserId.equals(currentUser.getId())) {
            throw new UnauthorizedActionException("You are not authorized to access or modify this user account");
        }
    }
}
