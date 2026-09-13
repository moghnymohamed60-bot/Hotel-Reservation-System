package com.example.hotelreservation.dto.response;

import com.example.hotelreservation.enums.RoomStatus;
import com.example.hotelreservation.enums.RoomType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RoomResponse {

    private Long id;
    private Long hotelId;
    private String hotelName;
    private String hotelCity;
    private String roomNumber;
    private RoomType roomType;
    private BigDecimal pricePerNight;
    private Integer capacity;
    private Integer floor;
    private String description;
    private RoomStatus status;
    private String imageUrl;
    private String amenities;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public RoomResponse() {}

    public RoomResponse(Long id, Long hotelId, String hotelName, String hotelCity, String roomNumber, RoomType roomType, BigDecimal pricePerNight, Integer capacity, Integer floor, String description, RoomStatus status, String imageUrl, String amenities, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.hotelId = hotelId;
        this.hotelName = hotelName;
        this.hotelCity = hotelCity;
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.pricePerNight = pricePerNight;
        this.capacity = capacity;
        this.floor = floor;
        this.description = description;
        this.status = status;
        this.imageUrl = imageUrl;
        this.amenities = amenities;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long hotelId;
        private String hotelName;
        private String hotelCity;
        private String roomNumber;
        private RoomType roomType;
        private BigDecimal pricePerNight;
        private Integer capacity;
        private Integer floor;
        private String description;
        private RoomStatus status;
        private String imageUrl;
        private String amenities;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder hotelId(Long hotelId) { this.hotelId = hotelId; return this; }
        public Builder hotelName(String hotelName) { this.hotelName = hotelName; return this; }
        public Builder hotelCity(String hotelCity) { this.hotelCity = hotelCity; return this; }
        public Builder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public Builder roomType(RoomType roomType) { this.roomType = roomType; return this; }
        public Builder pricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; return this; }
        public Builder capacity(Integer capacity) { this.capacity = capacity; return this; }
        public Builder floor(Integer floor) { this.floor = floor; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder status(RoomStatus status) { this.status = status; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder amenities(String amenities) { this.amenities = amenities; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public RoomResponse build() {
            return new RoomResponse(id, hotelId, hotelName, hotelCity, roomNumber, roomType, pricePerNight, capacity, floor, description, status, imageUrl, amenities, createdAt, updatedAt);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getHotelId() { return hotelId; }
    public void setHotelId(Long hotelId) { this.hotelId = hotelId; }

    public String getHotelName() { return hotelName; }
    public void setHotelName(String hotelName) { this.hotelName = hotelName; }

    public String getHotelCity() { return hotelCity; }
    public void setHotelCity(String hotelCity) { this.hotelCity = hotelCity; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public RoomType getRoomType() { return roomType; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; }

    public BigDecimal getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public RoomStatus getStatus() { return status; }
    public void setStatus(RoomStatus status) { this.status = status; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getAmenities() { return amenities; }
    public void setAmenities(String amenities) { this.amenities = amenities; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
