package com.example.hotelreservation.service;

import com.example.hotelreservation.dto.request.HotelRequest;
import com.example.hotelreservation.dto.response.HotelResponse;
import com.example.hotelreservation.entity.Hotel;
import com.example.hotelreservation.exception.ResourceNotFoundException;
import com.example.hotelreservation.mapper.HotelMapper;
import com.example.hotelreservation.mapper.RoomMapper;
import com.example.hotelreservation.repository.HotelRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HotelServiceTest {

    @Mock
    private HotelRepository hotelRepository;

    @Mock
    private HotelMapper hotelMapper;

    @Mock
    private RoomMapper roomMapper;

    @InjectMocks
    private HotelService hotelService;

    private Hotel hotel;
    private HotelResponse hotelResponse;
    private HotelRequest hotelRequest;

    @BeforeEach
    void setUp() {
        hotel = Hotel.builder()
                .id(1L)
                .name("Grand Luxury")
                .city("Paris")
                .country("France")
                .starRating(5)
                .build();

        hotelResponse = HotelResponse.builder()
                .id(1L)
                .name("Grand Luxury")
                .city("Paris")
                .country("France")
                .starRating(5)
                .build();

        hotelRequest = HotelRequest.builder()
                .name("Grand Luxury")
                .description("Luxury Hotel")
                .address("10 Avenue")
                .city("Paris")
                .country("France")
                .phoneNumber("+3312345678")
                .email("paris@grandluxury.com")
                .starRating(5)
                .build();
    }

    @Test
    @DisplayName("Should return hotel by ID")
    void testGetHotelByIdSuccess() {
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(hotel));
        when(hotelMapper.toResponse(eq(hotel), any())).thenReturn(hotelResponse);

        HotelResponse result = hotelService.getHotelById(1L);

        assertNotNull(result);
        assertEquals("Grand Luxury", result.getName());
        assertEquals("Paris", result.getCity());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when hotel not found")
    void testGetHotelByIdNotFound() {
        when(hotelRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> hotelService.getHotelById(999L));
    }

    @Test
    @DisplayName("Should create new hotel successfully")
    void testCreateHotelSuccess() {
        when(hotelMapper.toEntity(hotelRequest)).thenReturn(hotel);
        when(hotelRepository.save(hotel)).thenReturn(hotel);
        when(hotelMapper.toResponse(eq(hotel), any())).thenReturn(hotelResponse);

        HotelResponse result = hotelService.createHotel(hotelRequest);

        assertNotNull(result);
        assertEquals("Grand Luxury", result.getName());
        verify(hotelRepository, times(1)).save(hotel);
    }
}
