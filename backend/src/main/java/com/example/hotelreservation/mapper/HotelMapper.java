package com.example.hotelreservation.mapper;

import com.example.hotelreservation.dto.request.HotelRequest;
import com.example.hotelreservation.dto.response.HotelResponse;
import com.example.hotelreservation.dto.response.RoomResponse;
import com.example.hotelreservation.entity.Hotel;
import com.example.hotelreservation.entity.Room;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class HotelMapper {

    public HotelResponse toResponse(Hotel hotel, List<RoomResponse> roomResponses) {
        if (hotel == null) {
            return null;
        }

        BigDecimal minPrice = null;
        if (hotel.getRooms() != null && !hotel.getRooms().isEmpty()) {
            minPrice = hotel.getRooms().stream()
                    .map(Room::getPricePerNight)
                    .min(BigDecimal::compareTo)
                    .orElse(null);
        }

        int totalRooms = hotel.getRooms() != null ? hotel.getRooms().size() : 0;

        return HotelResponse.builder()
                .id(hotel.getId())
                .name(hotel.getName())
                .description(hotel.getDescription())
                .address(hotel.getAddress())
                .city(hotel.getCity())
                .country(hotel.getCountry())
                .phoneNumber(hotel.getPhoneNumber())
                .email(hotel.getEmail())
                .starRating(hotel.getStarRating())
                .checkInTime(hotel.getCheckInTime())
                .checkOutTime(hotel.getCheckOutTime())
                .imageUrl(hotel.getImageUrl())
                .amenities(hotel.getAmenities())
                .minPrice(minPrice)
                .totalRooms(totalRooms)
                .rooms(roomResponses != null ? roomResponses : Collections.emptyList())
                .createdAt(hotel.getCreatedAt())
                .updatedAt(hotel.getUpdatedAt())
                .build();
    }

    public Hotel toEntity(HotelRequest request) {
        if (request == null) {
            return null;
        }
        return Hotel.builder()
                .name(request.getName().trim())
                .description(request.getDescription().trim())
                .address(request.getAddress().trim())
                .city(request.getCity().trim())
                .country(request.getCountry().trim())
                .phoneNumber(request.getPhoneNumber().trim())
                .email(request.getEmail().trim().toLowerCase())
                .starRating(request.getStarRating())
                .checkInTime(request.getCheckInTime() != null ? request.getCheckInTime() : "14:00")
                .checkOutTime(request.getCheckOutTime() != null ? request.getCheckOutTime() : "11:00")
                .imageUrl(request.getImageUrl())
                .amenities(request.getAmenities())
                .build();
    }

    public void updateEntityFromRequest(Hotel hotel, HotelRequest request) {
        if (hotel == null || request == null) return;
        hotel.setName(request.getName().trim());
        hotel.setDescription(request.getDescription().trim());
        hotel.setAddress(request.getAddress().trim());
        hotel.setCity(request.getCity().trim());
        hotel.setCountry(request.getCountry().trim());
        hotel.setPhoneNumber(request.getPhoneNumber().trim());
        hotel.setEmail(request.getEmail().trim().toLowerCase());
        hotel.setStarRating(request.getStarRating());
        if (request.getCheckInTime() != null) hotel.setCheckInTime(request.getCheckInTime());
        if (request.getCheckOutTime() != null) hotel.setCheckOutTime(request.getCheckOutTime());
        if (request.getImageUrl() != null) hotel.setImageUrl(request.getImageUrl());
        if (request.getAmenities() != null) hotel.setAmenities(request.getAmenities());
    }
}
