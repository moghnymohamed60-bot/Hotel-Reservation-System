package com.example.hotelreservation.service;

import com.example.hotelreservation.dto.request.RoomRequest;
import com.example.hotelreservation.dto.response.RoomResponse;
import com.example.hotelreservation.entity.Hotel;
import com.example.hotelreservation.entity.Room;
import com.example.hotelreservation.enums.RoomStatus;
import com.example.hotelreservation.enums.RoomType;
import com.example.hotelreservation.exception.DuplicateResourceException;
import com.example.hotelreservation.mapper.RoomMapper;
import com.example.hotelreservation.repository.HotelRepository;
import com.example.hotelreservation.repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private HotelRepository hotelRepository;

    @Mock
    private RoomMapper roomMapper;

    @InjectMocks
    private RoomService roomService;

    private Hotel hotel;
    private Room room;
    private RoomRequest roomRequest;
    private RoomResponse roomResponse;

    @BeforeEach
    void setUp() {
        hotel = Hotel.builder().id(1L).name("Hotel Mirage").build();

        room = Room.builder()
                .id(10L)
                .hotel(hotel)
                .roomNumber("101")
                .roomType(RoomType.DOUBLE)
                .pricePerNight(new BigDecimal("200.00"))
                .capacity(2)
                .floor(1)
                .status(RoomStatus.AVAILABLE)
                .build();

        roomRequest = RoomRequest.builder()
                .hotelId(1L)
                .roomNumber("101")
                .roomType(RoomType.DOUBLE)
                .pricePerNight(new BigDecimal("200.00"))
                .capacity(2)
                .floor(1)
                .build();

        roomResponse = RoomResponse.builder()
                .id(10L)
                .roomNumber("101")
                .roomType(RoomType.DOUBLE)
                .pricePerNight(new BigDecimal("200.00"))
                .capacity(2)
                .build();
    }

    @Test
    @DisplayName("Should create room successfully when room number is unique for hotel")
    void testCreateRoomSuccess() {
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(hotel));
        when(roomRepository.findByHotelIdAndRoomNumber(1L, "101")).thenReturn(Optional.empty());
        when(roomMapper.toEntity(roomRequest, hotel)).thenReturn(room);
        when(roomRepository.save(room)).thenReturn(room);
        when(roomMapper.toResponse(room)).thenReturn(roomResponse);

        RoomResponse result = roomService.createRoom(roomRequest);

        assertNotNull(result);
        assertEquals("101", result.getRoomNumber());
        verify(roomRepository, times(1)).save(room);
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when room number already exists in hotel")
    void testCreateRoomDuplicateNumber() {
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(hotel));
        when(roomRepository.findByHotelIdAndRoomNumber(1L, "101")).thenReturn(Optional.of(room));

        assertThrows(DuplicateResourceException.class, () -> roomService.createRoom(roomRequest));
        verify(roomRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should find available rooms with valid date parameters")
    void testFindAvailableRooms() {
        LocalDate checkIn = LocalDate.now().plusDays(1);
        LocalDate checkOut = LocalDate.now().plusDays(3);

        when(roomRepository.findAvailableRooms(eq(1L), any(), eq(2), any(), eq(checkIn), eq(checkOut), any()))
                .thenReturn(List.of(room));
        when(roomMapper.toResponse(room)).thenReturn(roomResponse);

        List<RoomResponse> result = roomService.findAvailableRooms(1L, null, checkIn, checkOut, 2, null);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("101", result.get(0).getRoomNumber());
    }
}
