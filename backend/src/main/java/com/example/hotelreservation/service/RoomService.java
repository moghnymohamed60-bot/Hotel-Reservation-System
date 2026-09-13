package com.example.hotelreservation.service;

import com.example.hotelreservation.dto.request.RoomRequest;
import com.example.hotelreservation.dto.response.RoomResponse;
import com.example.hotelreservation.entity.Hotel;
import com.example.hotelreservation.entity.Room;
import com.example.hotelreservation.enums.ReservationStatus;
import com.example.hotelreservation.enums.RoomStatus;
import com.example.hotelreservation.enums.RoomType;
import com.example.hotelreservation.exception.DuplicateResourceException;
import com.example.hotelreservation.exception.ResourceNotFoundException;
import com.example.hotelreservation.mapper.RoomMapper;
import com.example.hotelreservation.repository.HotelRepository;
import com.example.hotelreservation.repository.RoomRepository;
import com.example.hotelreservation.specification.RoomSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;
    private final RoomMapper roomMapper;

    @Autowired
    public RoomService(RoomRepository roomRepository, HotelRepository hotelRepository, RoomMapper roomMapper) {
        this.roomRepository = roomRepository;
        this.hotelRepository = hotelRepository;
        this.roomMapper = roomMapper;
    }

    @Transactional(readOnly = true)
    public Page<RoomResponse> getAllRooms(
            Long hotelId,
            RoomType roomType,
            Integer capacity,
            RoomStatus status,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    ) {
        Specification<Room> spec = RoomSpecification.filterRooms(hotelId, roomType, capacity, status, minPrice, maxPrice);
        return roomRepository.findAll(spec, pageable).map(roomMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public RoomResponse getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", id));
        return roomMapper.toResponse(room);
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> getRoomsByHotelId(Long hotelId) {
        if (!hotelRepository.existsById(hotelId)) {
            throw new ResourceNotFoundException("Hotel", "id", hotelId);
        }
        return roomRepository.findByHotelId(hotelId).stream()
                .map(roomMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> findAvailableRooms(
            Long hotelId,
            String city,
            LocalDate checkInDate,
            LocalDate checkOutDate,
            Integer guests,
            RoomType roomType
    ) {
        if (checkInDate == null || checkOutDate == null) {
            throw new IllegalArgumentException("Both check-in and check-out dates are required to check availability");
        }
        if (!checkOutDate.isAfter(checkInDate)) {
            throw new IllegalArgumentException("Check-out date must be strictly after check-in date");
        }

        List<ReservationStatus> excludedStatuses = Arrays.asList(
                ReservationStatus.CANCELLED,
                ReservationStatus.REJECTED
        );

        List<Room> availableRooms = roomRepository.findAvailableRooms(
                hotelId,
                city,
                guests,
                roomType,
                checkInDate,
                checkOutDate,
                excludedStatuses
        );

        return availableRooms.stream()
                .map(roomMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public RoomResponse createRoom(RoomRequest request) {
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel", "id", request.getHotelId()));

        if (roomRepository.findByHotelIdAndRoomNumber(hotel.getId(), request.getRoomNumber().trim()).isPresent()) {
            throw new DuplicateResourceException(
                    "Room number '" + request.getRoomNumber() + "' already exists in hotel '" + hotel.getName() + "'"
            );
        }

        Room room = roomMapper.toEntity(request, hotel);
        Room savedRoom = roomRepository.save(room);
        return roomMapper.toResponse(savedRoom);
    }

    @Transactional
    public RoomResponse updateRoom(Long id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", id));

        // Check if room number changed and clashes with another room in the same hotel
        if (!room.getRoomNumber().equalsIgnoreCase(request.getRoomNumber().trim())) {
            roomRepository.findByHotelIdAndRoomNumber(room.getHotel().getId(), request.getRoomNumber().trim())
                    .ifPresent(existing -> {
                        if (!existing.getId().equals(id)) {
                            throw new DuplicateResourceException("Room number '" + request.getRoomNumber() + "' already exists in this hotel");
                        }
                    });
        }

        roomMapper.updateEntityFromRequest(room, request);
        Room updatedRoom = roomRepository.save(room);
        return roomMapper.toResponse(updatedRoom);
    }

    @Transactional
    public RoomResponse updateRoomStatus(Long id, RoomStatus status) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", id));
        room.setStatus(status);
        Room updatedRoom = roomRepository.save(room);
        return roomMapper.toResponse(updatedRoom);
    }

    @Transactional
    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new ResourceNotFoundException("Room", "id", id);
        }
        roomRepository.deleteById(id);
    }
}
