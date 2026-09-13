package com.example.hotelreservation.service;

import com.example.hotelreservation.dto.request.HotelRequest;
import com.example.hotelreservation.dto.response.HotelResponse;
import com.example.hotelreservation.dto.response.RoomResponse;
import com.example.hotelreservation.entity.Hotel;
import com.example.hotelreservation.exception.ResourceNotFoundException;
import com.example.hotelreservation.mapper.HotelMapper;
import com.example.hotelreservation.mapper.RoomMapper;
import com.example.hotelreservation.repository.HotelRepository;
import com.example.hotelreservation.specification.HotelSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;
    private final HotelMapper hotelMapper;
    private final RoomMapper roomMapper;

    @Autowired
    public HotelService(HotelRepository hotelRepository, HotelMapper hotelMapper, RoomMapper roomMapper) {
        this.hotelRepository = hotelRepository;
        this.hotelMapper = hotelMapper;
        this.roomMapper = roomMapper;
    }

    @Transactional(readOnly = true)
    public Page<HotelResponse> getAllHotels(
            String city,
            String name,
            Integer starRating,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    ) {
        Specification<Hotel> spec = HotelSpecification.filterHotels(city, name, starRating, minPrice, maxPrice);
        Page<Hotel> hotelPage = hotelRepository.findAll(spec, pageable);

        return hotelPage.map(hotel -> {
            List<RoomResponse> roomResponses = hotel.getRooms() != null ?
                    hotel.getRooms().stream().map(roomMapper::toResponse).collect(Collectors.toList()) :
                    List.of();
            return hotelMapper.toResponse(hotel, roomResponses);
        });
    }

    @Transactional(readOnly = true)
    public HotelResponse getHotelById(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel", "id", id));

        List<RoomResponse> roomResponses = hotel.getRooms() != null ?
                hotel.getRooms().stream().map(roomMapper::toResponse).collect(Collectors.toList()) :
                List.of();

        return hotelMapper.toResponse(hotel, roomResponses);
    }

    @Transactional(readOnly = true)
    public List<String> getAvailableCities() {
        return hotelRepository.findDistinctCities();
    }

    @Transactional
    public HotelResponse createHotel(HotelRequest request) {
        Hotel hotel = hotelMapper.toEntity(request);
        Hotel savedHotel = hotelRepository.save(hotel);
        return hotelMapper.toResponse(savedHotel, List.of());
    }

    @Transactional
    public HotelResponse updateHotel(Long id, HotelRequest request) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel", "id", id));

        hotelMapper.updateEntityFromRequest(hotel, request);
        Hotel updatedHotel = hotelRepository.save(hotel);

        List<RoomResponse> roomResponses = updatedHotel.getRooms() != null ?
                updatedHotel.getRooms().stream().map(roomMapper::toResponse).collect(Collectors.toList()) :
                List.of();

        return hotelMapper.toResponse(updatedHotel, roomResponses);
    }

    @Transactional
    public void deleteHotel(Long id) {
        if (!hotelRepository.existsById(id)) {
            throw new ResourceNotFoundException("Hotel", "id", id);
        }
        hotelRepository.deleteById(id);
    }
}
