package com.example.hotelreservation.specification;

import com.example.hotelreservation.entity.Reservation;
import com.example.hotelreservation.enums.ReservationStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ReservationSpecification {

    public static Specification<Reservation> filterReservations(
        Long userId,
        Long hotelId,
        Long roomId,
        ReservationStatus status,
        LocalDate startDate,
        LocalDate endDate
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (userId != null) {
                predicates.add(criteriaBuilder.equal(root.get("user").get("id"), userId));
            }

            if (hotelId != null) {
                predicates.add(criteriaBuilder.equal(root.get("room").get("hotel").get("id"), hotelId));
            }

            if (roomId != null) {
                predicates.add(criteriaBuilder.equal(root.get("room").get("id"), roomId));
            }

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("reservationStatus"), status));
            }

            if (startDate != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("checkInDate"), startDate));
            }

            if (endDate != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("checkOutDate"), endDate));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
