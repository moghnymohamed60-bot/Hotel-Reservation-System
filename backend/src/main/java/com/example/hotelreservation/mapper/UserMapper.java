package com.example.hotelreservation.mapper;

import com.example.hotelreservation.dto.request.RegisterRequest;
import com.example.hotelreservation.dto.response.UserResponse;
import com.example.hotelreservation.entity.User;
import com.example.hotelreservation.enums.AccountStatus;
import com.example.hotelreservation.enums.Role;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .accountStatus(user.getAccountStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    public User toEntity(RegisterRequest request, String encodedPassword) {
        if (request == null) {
            return null;
        }
        return User.builder()
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(encodedPassword)
                .phoneNumber(request.getPhoneNumber().trim())
                .role(request.getRole() != null ? request.getRole() : Role.CUSTOMER)
                .accountStatus(AccountStatus.ACTIVE)
                .build();
    }
}
