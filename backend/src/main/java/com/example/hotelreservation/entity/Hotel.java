package com.example.hotelreservation.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hotels", indexes = {
    @Index(name = "idx_hotels_city", columnList = "city"),
    @Index(name = "idx_hotels_star_rating", columnList = "star_rating"),
    @Index(name = "idx_hotels_name", columnList = "name")
})
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String country;

    @Column(name = "phone_number", nullable = false, length = 30)
    private String phoneNumber;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(name = "star_rating", nullable = false)
    private Integer starRating;

    @Column(name = "check_in_time", nullable = false, length = 10)
    private String checkInTime = "14:00";

    @Column(name = "check_out_time", nullable = false, length = 10)
    private String checkOutTime = "11:00";

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String amenities;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Room> rooms = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Hotel() {}

    public Hotel(Long id, String name, String description, String address, String city, String country, String phoneNumber, String email, Integer starRating, String checkInTime, String checkOutTime, String imageUrl, String amenities, List<Room> rooms, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.address = address;
        this.city = city;
        this.country = country;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.starRating = starRating;
        this.checkInTime = checkInTime != null ? checkInTime : "14:00";
        this.checkOutTime = checkOutTime != null ? checkOutTime : "11:00";
        this.imageUrl = imageUrl;
        this.amenities = amenities;
        this.rooms = rooms != null ? rooms : new ArrayList<>();
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
        private String checkInTime = "14:00";
        private String checkOutTime = "11:00";
        private String imageUrl;
        private String amenities;
        private List<Room> rooms = new ArrayList<>();
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
        public Builder checkOutOutTime(String checkOutTime) { this.checkOutTime = checkOutTime; return this; }
        public Builder checkOutTime(String checkOutTime) { this.checkOutTime = checkOutTime; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder amenities(String amenities) { this.amenities = amenities; return this; }
        public Builder rooms(List<Room> rooms) { this.rooms = rooms; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Hotel build() {
            return new Hotel(id, name, description, address, city, country, phoneNumber, email, starRating, checkInTime, checkOutTime, imageUrl, amenities, rooms, createdAt, updatedAt);
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

    public List<Room> getRooms() { return rooms; }
    public void setRooms(List<Room> rooms) { this.rooms = rooms; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
