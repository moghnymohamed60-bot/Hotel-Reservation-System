package com.example.hotelreservation.specification;

import com.example.hotelreservation.entity.Room;
import com.example.hotelreservation.enums.RoomStatus;
import com.example.hotelreservation.enums.RoomType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class RoomSpecification {

    public static Specification<Room> filterRooms(
        Long hotelId,
        RoomType roomType,
        Integer capacity,
        RoomStatus status,
        BigDecimal minPrice,
        BigDecimal maxPrice
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (hotelId != null) {
                predicates.add(criteriaBuilder.equal(root.get("hotel").get("id"), hotelId));
            }

            if (roomType != null) {
                predicates.add(criteriaBuilder.equal(root.get("roomType"), roomType));
            }

            if (capacity != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("capacity"), capacity));
            }

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("pricePerNight"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("pricePerNight"), maxPrice));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
