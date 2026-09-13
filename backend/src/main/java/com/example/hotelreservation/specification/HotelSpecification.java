package com.example.hotelreservation.specification;

import com.example.hotelreservation.entity.Hotel;
import com.example.hotelreservation.entity.Room;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class HotelSpecification {

    public static Specification<Hotel> filterHotels(
        String city,
        String name,
        Integer starRating,
        BigDecimal minPrice,
        BigDecimal maxPrice
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (city != null && !city.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("city")),
                    "%" + city.trim().toLowerCase() + "%"
                ));
            }

            if (name != null && !name.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("name")),
                    "%" + name.trim().toLowerCase() + "%"
                ));
            }

            if (starRating != null) {
                predicates.add(criteriaBuilder.equal(root.get("starRating"), starRating));
            }

            if (minPrice != null || maxPrice != null) {
                Join<Hotel, Room> roomJoin = root.join("rooms", JoinType.INNER);
                query.distinct(true);

                if (minPrice != null) {
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(roomJoin.get("pricePerNight"), minPrice));
                }
                if (maxPrice != null) {
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(roomJoin.get("pricePerNight"), maxPrice));
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
