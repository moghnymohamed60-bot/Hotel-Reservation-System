package com.example.hotelreservation.repository;

import com.example.hotelreservation.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long>, JpaSpecificationExecutor<Hotel> {

    List<Hotel> findByCityIgnoreCase(String city);

    @Query("SELECT DISTINCT h.city FROM Hotel h ORDER BY h.city ASC")
    List<String> findDistinctCities();
}
