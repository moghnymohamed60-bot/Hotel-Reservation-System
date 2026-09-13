package com.example.hotelreservation.dto.request;

import com.example.hotelreservation.enums.RoomStatus;
import com.example.hotelreservation.enums.RoomType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class RoomRequest {

    @NotNull(message = "Hotel ID is required")
    private Long hotelId;

    @NotBlank(message = "Room number is required")
    @Size(max = 20, message = "Room number cannot exceed 20 characters")
    private String roomNumber;

    @NotNull(message = "Room type is required")
    private RoomType roomType;

    @NotNull(message = "Price per night is required")
    @DecimalMin(value = "0.01", message = "Price per night must be greater than zero")
    private BigDecimal pricePerNight;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1 guest")
    @Max(value = 20, message = "Capacity cannot exceed 20 guests")
    private Integer capacity;

    @NotNull(message = "Floor is required")
    private Integer floor;

    private String description;
    private RoomStatus status;
    private String imageUrl;
    private String amenities;

    public RoomRequest() {}

    public RoomRequest(Long hotelId, String roomNumber, RoomType roomType, BigDecimal pricePerNight, Integer capacity, Integer floor, String description, RoomStatus status, String imageUrl, String amenities) {
        this.hotelId = hotelId;
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.pricePerNight = pricePerNight;
        this.capacity = capacity;
        this.floor = floor;
        this.description = description;
        this.status = status;
        this.imageUrl = imageUrl;
        this.amenities = amenities;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long hotelId;
        private String roomNumber;
        private RoomType roomType;
        private BigDecimal pricePerNight;
        private Integer capacity;
        private Integer floor;
        private String description;
        private RoomStatus status;
        private String imageUrl;
        private String amenities;

        public Builder hotelId(Long hotelId) { this.hotelId = hotelId; return this; }
        public Builder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public Builder roomType(RoomType roomType) { this.roomType = roomType; return this; }
        public Builder pricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; return this; }
        public Builder capacity(Integer capacity) { this.capacity = capacity; return this; }
        public Builder floor(Integer floor) { this.floor = floor; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder status(RoomStatus status) { this.status = status; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder amenities(String amenities) { this.amenities = amenities; return this; }

        public RoomRequest build() {
            return new RoomRequest(hotelId, roomNumber, roomType, pricePerNight, capacity, floor, description, status, imageUrl, amenities);
        }
    }

    public Long getHotelId() { return hotelId; }
    public void setHotelId(Long hotelId) { this.hotelId = hotelId; }

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
}
