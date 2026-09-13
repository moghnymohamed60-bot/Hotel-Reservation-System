package com.example.hotelreservation.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class HotelResponse {

    private Long id;
    private String name;
    private String description;
    private String address;
    private String city;
    private String country;
    private String phoneNumber;
    private String email;
    private Integer starRating;
    private String checkInTime;
    private String checkOutTime;
    private String imageUrl;
    private String amenities;
    private BigDecimal minPrice;
    private Integer totalRooms;
    private List<RoomResponse> rooms;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public HotelResponse() {}

    public HotelResponse(Long id, String name, String description, String address, String city, String country, String phoneNumber, String email, Integer starRating, String checkInTime, String checkOutTime, String imageUrl, String amenities, BigDecimal minPrice, Integer totalRooms, List<RoomResponse> rooms, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.address = address;
        this.city = city;
        this.country = country;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.starRating = starRating;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.imageUrl = imageUrl;
        this.amenities = amenities;
        this.minPrice = minPrice;
        this.totalRooms = totalRooms;
        this.rooms = rooms;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private String description;
        private String address;
        private String city;
        private String country;
        private String phoneNumber;
        private String email;
        private Integer starRating;
        private String checkInTime;
        private String checkOutTime;
        private String imageUrl;
        private String amenities;
        private BigDecimal minPrice;
        private Integer totalRooms;
        private List<RoomResponse> rooms;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder city(String city) { this.city = city; return this; }
        public Builder country(String country) { this.country = country; return this; }
        public Builder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder starRating(Integer starRating) { this.starRating = starRating; return this; }
        public Builder checkInTime(String checkInTime) { this.checkInTime = checkInTime; return this; }
        public Builder checkOutTime(String checkOutTime) { this.checkOutTime = checkOutTime; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder amenities(String amenities) { this.amenities = amenities; return this; }
        public Builder minPrice(BigDecimal minPrice) { this.minPrice = minPrice; return this; }
        public Builder totalRooms(Integer totalRooms) { this.totalRooms = totalRooms; return this; }
        public Builder rooms(List<RoomResponse> rooms) { this.rooms = rooms; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public HotelResponse build() {
            return new HotelResponse(id, name, description, address, city, country, phoneNumber, email, starRating, checkInTime, checkOutTime, imageUrl, amenities, minPrice, totalRooms, rooms, createdAt, updatedAt);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getStarRating() { return starRating; }
    public void setStarRating(Integer starRating) { this.starRating = starRating; }

    public String getCheckInTime() { return checkInTime; }
    public void setCheckInTime(String checkInTime) { this.checkInTime = checkInTime; }

    public String getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(String checkOutTime) { this.checkOutTime = checkOutTime; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getAmenities() { return amenities; }
    public void setAmenities(String amenities) { this.amenities = amenities; }

    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }

    public Integer getTotalRooms() { return totalRooms; }
    public void setTotalRooms(Integer totalRooms) { this.totalRooms = totalRooms; }

    public List<RoomResponse> getRooms() { return rooms; }
    public void setRooms(List<RoomResponse> rooms) { this.rooms = rooms; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
