package com.example.hotelreservation.repository;

import com.example.hotelreservation.entity.Room;
import com.example.hotelreservation.enums.ReservationStatus;
import com.example.hotelreservation.enums.RoomStatus;
import com.example.hotelreservation.enums.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long>, JpaSpecificationExecutor<Room> {

    List<Room> findByHotelId(Long hotelId);

    Optional<Room> findByHotelIdAndRoomNumber(Long hotelId, String roomNumber);

    long countByStatus(RoomStatus status);

    @Query("""
        SELECT r FROM Room r
        JOIN FETCH r.hotel h
        WHERE r.status = 'AVAILABLE'
          AND (:hotelId IS NULL OR r.hotel.id = :hotelId)
          AND (:city IS NULL OR LOWER(h.city) LIKE LOWER(CONCAT('%', :city, '%')))
          AND (:capacity IS NULL OR r.capacity >= :capacity)
          AND (:roomType IS NULL OR r.roomType = :roomType)
          AND r.id NOT IN (
              SELECT res.room.id FROM Reservation res
              WHERE res.reservationStatus NOT IN :excludedStatuses
                AND res.checkInDate < :checkOutDate
                AND res.checkOutDate > :checkInDate
          )
    """)
    List<Room> findAvailableRooms(
        @Param("hotelId") Long hotelId,
        @Param("city") String city,
        @Param("capacity") Integer capacity,
        @Param("roomType") RoomType roomType,
        @Param("checkInDate") LocalDate checkInDate,
        @Param("checkOutDate") LocalDate checkOutDate,
        @Param("excludedStatuses") Collection<ReservationStatus> excludedStatuses
    );
}
