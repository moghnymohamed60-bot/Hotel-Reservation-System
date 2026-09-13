package com.example.hotelreservation.mapper;

import com.example.hotelreservation.dto.request.RoomRequest;
import com.example.hotelreservation.dto.response.RoomResponse;
import com.example.hotelreservation.entity.Hotel;
import com.example.hotelreservation.entity.Room;
import com.example.hotelreservation.enums.RoomStatus;
import org.springframework.stereotype.Component;

@Component
public class RoomMapper {

    public RoomResponse toResponse(Room room) {
        if (room == null) {
            return null;
        }
        return RoomResponse.builder()
                .id(room.getId())
                .hotelId(room.getHotel() != null ? room.getHotel().getId() : null)
                .hotelName(room.getHotel() != null ? room.getHotel().getName() : null)
                .hotelCity(room.getHotel() != null ? room.getHotel().getCity() : null)
                .roomNumber(room.getRoomNumber())
                .roomType(room.getRoomType())
                .pricePerNight(room.getPricePerNight())
                .capacity(room.getCapacity())
                .floor(room.getFloor())
                .description(room.getDescription())
                .status(room.getStatus())
                .imageUrl(room.getImageUrl())
                .amenities(room.getAmenities())
                .createdAt(room.getCreatedAt())
                .updatedAt(room.getUpdatedAt())
                .build();
    }

    public Room toEntity(RoomRequest request, Hotel hotel) {
        if (request == null) {
            return null;
        }
        return Room.builder()
                .hotel(hotel)
                .roomNumber(request.getRoomNumber().trim())
                .roomType(request.getRoomType())
                .pricePerNight(request.getPricePerNight())
                .capacity(request.getCapacity())
                .floor(request.getFloor())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : RoomStatus.AVAILABLE)
                .imageUrl(request.getImageUrl())
                .amenities(request.getAmenities())
                .build();
    }

    public void updateEntityFromRequest(Room room, RoomRequest request) {
        if (room == null || request == null) return;
        room.setRoomNumber(request.getRoomNumber().trim());
        room.setRoomType(request.getRoomType());
        room.setPricePerNight(request.getPricePerNight());
        room.setCapacity(request.getCapacity());
        room.setFloor(request.getFloor());
        room.setDescription(request.getDescription());
        if (request.getStatus() != null) room.setStatus(request.getStatus());
        if (request.getImageUrl() != null) room.setImageUrl(request.getImageUrl());
        if (request.getAmenities() != null) room.setAmenities(request.getAmenities());
    }
}
