package com.example.hotelreservation.config;

import com.example.hotelreservation.entity.*;
import com.example.hotelreservation.enums.*;
import com.example.hotelreservation.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(
            UserRepository userRepository,
            HotelRepository hotelRepository,
            RoomRepository roomRepository,
            ReservationRepository reservationRepository,
            PaymentRepository paymentRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
        this.paymentRepository = paymentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Database already initialized. Skipping seed data generation.");
            return;
        }

        logger.info("Seeding realistic production demo data...");

        String defaultEncodedPassword = passwordEncoder.encode("password123");

        // 1. Seed Users (1 Admin, 2 Staff, 7 Customers)
        User admin = User.builder()
                .firstName("System")
                .lastName("Administrator")
                .email("admin@grandhotel.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+1-555-0100")
                .role(Role.ADMIN)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User staff1 = User.builder()
                .firstName("Sarah")
                .lastName("Jenkins")
                .email("sarah.staff@grandhotel.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+1-555-0101")
                .role(Role.STAFF)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User staff2 = User.builder()
                .firstName("Marcus")
                .lastName("Vance")
                .email("marcus.staff@grandhotel.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+1-555-0102")
                .role(Role.STAFF)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User cust1 = User.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+1-555-0201")
                .role(Role.CUSTOMER)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User cust2 = User.builder()
                .firstName("Emma")
                .lastName("Watson")
                .email("emma.watson@example.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+44-770-0900")
                .role(Role.CUSTOMER)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User cust3 = User.builder()
                .firstName("Michael")
                .lastName("Brown")
                .email("michael.brown@example.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+1-555-0203")
                .role(Role.CUSTOMER)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User cust4 = User.builder()
                .firstName("Sophia")
                .lastName("Garcia")
                .email("sophia.garcia@example.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+34-600-1122")
                .role(Role.CUSTOMER)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User cust5 = User.builder()
                .firstName("David")
                .lastName("Kim")
                .email("david.kim@example.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+82-10-5555")
                .role(Role.CUSTOMER)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User cust6 = User.builder()
                .firstName("Elena")
                .lastName("Rostova")
                .email("elena.rostova@example.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+33-612-3456")
                .role(Role.CUSTOMER)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User cust7 = User.builder()
                .firstName("Lucas")
                .lastName("Silva")
                .email("lucas.silva@example.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+55-11-9876")
                .role(Role.CUSTOMER)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        userRepository.saveAll(List.of(admin, staff1, staff2, cust1, cust2, cust3, cust4, cust5, cust6, cust7));

        // 2. Seed 5 Luxury Hotels
        Hotel h1 = Hotel.builder()
                .name("The Manhattan Grand Luxury Hotel")
                .description("Iconic 5-star skyscraper hotel offering breathtaking panoramic views of Central Park, Michelin-starred dining, spa, and world-class concierge services in Midtown Manhattan.")
                .address("768 5th Ave")
                .city("New York")
                .country("United States")
                .phoneNumber("+1-212-555-0199")
                .email("concierge.nyc@grandhotel.com")
                .starRating(5)
                .checkInTime("15:00")
                .checkOutTime("11:00")
                .imageUrl("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80")
                .amenities("Free High-Speed WiFi, Central Park Views, Luxury Spa, Michelin Star Restaurant, Valet Parking, Rooftop Lounge, 24/7 Room Service")
                .build();

        Hotel h2 = Hotel.builder()
                .name("Le Palais Royale Boutique & Spa")
                .description("Elegant Parisian palace with classical Haussmann architecture, private manicured courtyard gardens, luxury suites, and steps away from the Champs-Élysées.")
                .address("25 Rue de Rivoli")
                .city("Paris")
                .country("France")
                .phoneNumber("+33-1-4268-5500")
                .email("contact@lepalaisparis.fr")
                .starRating(5)
                .checkInTime("14:00")
                .checkOutTime("12:00")
                .imageUrl("https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80")
                .amenities("Free WiFi, Gourmet French Bakery, Courtyard Garden, Luxury Marble Bath, Airport Chauffeur, Champagne Bar, Heated Indoor Pool")
                .build();

        Hotel h3 = Hotel.builder()
                .name("Tokyo Imperial Skyline Resort")
                .description("Futuristic architectural sanctuary in Shinjuku overlooking Mount Fuji and the Tokyo skyline, featuring authentic onsen hot springs and tea ceremonies.")
                .address("2-8-1 Nishi-Shinjuku")
                .city("Tokyo")
                .country("Japan")
                .phoneNumber("+81-3-3344-0111")
                .email("stay@tokyoimperialskyline.jp")
                .starRating(5)
                .checkInTime("15:00")
                .checkOutTime("11:00")
                .imageUrl("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80")
                .amenities("Free Ultra-Fast WiFi, Traditional Japanese Onsen, Mount Fuji View Terraces, Kaiseki Dining, Smart Room Automation")
                .build();

        Hotel h4 = Hotel.builder()
                .name("The Palm Oasis Marina Beach Resort")
                .description("Opulent beachfront oasis along the Arabian Gulf featuring private cabanas, infinity pools, submarine dining experiences, and gold-leaf architectural grandeur.")
                .address("Jumeirah Beach Road")
                .city("Dubai")
                .country("United Arab Emirates")
                .phoneNumber("+971-4-888-3444")
                .email("reservations@palmoasisdubai.ae")
                .starRating(5)
                .checkInTime("14:00")
                .checkOutTime("12:00")
                .imageUrl("https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80")
                .amenities("Private White Sand Beach, Infinity Lagoon Pools, Helipad, Luxury Yacht Charters, Kids Club, Butler Service")
                .build();

        Hotel h5 = Hotel.builder()
                .name("Villa Borghese Renaissance Heritage")
                .description("Historic Roman villa converted into an intimate boutique hotel near the Spanish Steps, featuring antique fresco ceilings and panoramic rooftop sunset views.")
                .address("Via Veneto 125")
                .city("Rome")
                .country("Italy")
                .phoneNumber("+39-06-6992-3300")
                .email("welcome@villaborgheserome.it")
                .starRating(4)
                .checkInTime("14:00")
                .checkOutTime("11:00")
                .imageUrl("https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80")
                .amenities("Free WiFi, Sunset Rooftop Terrace, Sommelier Wine Tastings, Historic Architecture, Pet Friendly, Vespa Rentals")
                .build();

        hotelRepository.saveAll(List.of(h1, h2, h3, h4, h5));

        // 3. Seed Rooms
        Room r1 = Room.builder().hotel(h1).roomNumber("101").roomType(RoomType.SINGLE).pricePerNight(new BigDecimal("180.00")).capacity(1).floor(1).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80").description("Cozy executive single room with plush queen bed, ergonomic workspace, and city skyline views.").build();
        Room r2 = Room.builder().hotel(h1).roomNumber("205").roomType(RoomType.DOUBLE).pricePerNight(new BigDecimal("260.00")).capacity(2).floor(2).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80").description("Spacious double room with king-size bed, luxury linen, marble bath, and Central Park glimpses.").build();
        Room r3 = Room.builder().hotel(h1).roomNumber("310").roomType(RoomType.DELUXE).pricePerNight(new BigDecimal("380.00")).capacity(3).floor(3).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80").description("Deluxe park-view room with king bed, convertible sofa, walk-in closet, and private balcony.").build();
        Room r4 = Room.builder().hotel(h1).roomNumber("401").roomType(RoomType.SUITE).pricePerNight(new BigDecimal("650.00")).capacity(4).floor(4).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80").description("Presidential Penthouse Suite with master bedroom, separate living room, dining area, and 24/7 butler.").build();
        Room r5 = Room.builder().hotel(h1).roomNumber("502").roomType(RoomType.FAMILY).pricePerNight(new BigDecimal("420.00")).capacity(5).floor(5).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80").description("Interconnected 2-bedroom family suite with two queen beds and one twin bed, plus gaming console.").build();

        Room r6 = Room.builder().hotel(h2).roomNumber("P-101").roomType(RoomType.SINGLE).pricePerNight(new BigDecimal("210.00")).capacity(1).floor(1).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80").description("Chic Parisian single studio with antique wooden furnishings and street cafe views.").build();
        Room r7 = Room.builder().hotel(h2).roomNumber("P-202").roomType(RoomType.DOUBLE).pricePerNight(new BigDecimal("320.00")).capacity(2).floor(2).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80").description("Romantic Parisian double with velvet accents, wrought-iron balcony, and garden views.").build();
        Room r8 = Room.builder().hotel(h2).roomNumber("P-305").roomType(RoomType.TWIN).pricePerNight(new BigDecimal("290.00")).capacity(2).floor(3).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80").description("Elegant twin room with two plush single beds, art deco lighting, and courtyard silence.").build();
        Room r9 = Room.builder().hotel(h2).roomNumber("P-401").roomType(RoomType.DELUXE).pricePerNight(new BigDecimal("450.00")).capacity(3).floor(4).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80").description("Grand deluxe room with Eiffel Tower horizon views, fireplace, and lounge seating.").build();
        Room r10 = Room.builder().hotel(h2).roomNumber("P-501").roomType(RoomType.SUITE).pricePerNight(new BigDecimal("750.00")).capacity(4).floor(5).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=800&q=80").description("Palatial Royal Suite with antique chandeliers, private salon, and panoramic city vistas.").build();

        Room r11 = Room.builder().hotel(h3).roomNumber("T-110").roomType(RoomType.SINGLE).pricePerNight(new BigDecimal("160.00")).capacity(1).floor(1).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80").description("Minimalist Japanese zen single room with tatami touches and smart electronic controls.").build();
        Room r12 = Room.builder().hotel(h3).roomNumber("T-215").roomType(RoomType.DOUBLE).pricePerNight(new BigDecimal("250.00")).capacity(2).floor(2).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80").description("Modern Japanese double room overlooking the neon skyline of Shinjuku.").build();
        Room r13 = Room.builder().hotel(h3).roomNumber("T-320").roomType(RoomType.TWIN).pricePerNight(new BigDecimal("270.00")).capacity(2).floor(3).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80").description("Tranquil twin room designed for serene relaxation with organic linens and aromatherapy.").build();
        Room r14 = Room.builder().hotel(h3).roomNumber("T-405").roomType(RoomType.DELUXE).pricePerNight(new BigDecimal("410.00")).capacity(3).floor(4).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80").description("Deluxe Fuji View room with private Hinoki cedar wood soaking tub and tatami lounge.").build();
        Room r15 = Room.builder().hotel(h3).roomNumber("T-501").roomType(RoomType.SUITE).pricePerNight(new BigDecimal("680.00")).capacity(4).floor(5).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80").description("Imperial Skyline Penthouse with 360-degree glass walls and private meditation chamber.").build();

        Room r16 = Room.builder().hotel(h4).roomNumber("D-101").roomType(RoomType.DOUBLE).pricePerNight(new BigDecimal("310.00")).capacity(2).floor(1).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80").description("Beachside luxury double room with direct access to private marina and lagoon pools.").build();
        Room r17 = Room.builder().hotel(h4).roomNumber("D-202").roomType(RoomType.DELUXE).pricePerNight(new BigDecimal("490.00")).capacity(3).floor(2).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80").description("Deluxe ocean-front room with crystal chandelier, gold fixtures, and sunset terrace.").build();
        Room r18 = Room.builder().hotel(h4).roomNumber("D-303").roomType(RoomType.SUITE).pricePerNight(new BigDecimal("890.00")).capacity(4).floor(3).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80").description("Palatial Arabian Suite with private plunge pool, dining room, and 24-hour private chauffeur.").build();
        Room r19 = Room.builder().hotel(h4).roomNumber("D-404").roomType(RoomType.FAMILY).pricePerNight(new BigDecimal("580.00")).capacity(5).floor(4).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80").description("Grand family villa suite with kids themed playroom and sunbathing terrace.").build();
        Room r20 = Room.builder().hotel(h4).roomNumber("D-505").roomType(RoomType.TWIN).pricePerNight(new BigDecimal("340.00")).capacity(2).floor(5).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80").description("High-floor twin room with marina skyline and mega-yacht harbor views.").build();

        Room r21 = Room.builder().hotel(h5).roomNumber("R-101").roomType(RoomType.SINGLE).pricePerNight(new BigDecimal("150.00")).capacity(1).floor(1).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80").description("Charming classic single with terracotta tiles, high ceilings, and garden outlook.").build();
        Room r22 = Room.builder().hotel(h5).roomNumber("R-202").roomType(RoomType.DOUBLE).pricePerNight(new BigDecimal("240.00")).capacity(2).floor(2).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80").description("Renaissance style double room with restored fresco wall accents and king bed.").build();
        Room r23 = Room.builder().hotel(h5).roomNumber("R-303").roomType(RoomType.DELUXE).pricePerNight(new BigDecimal("360.00")).capacity(3).floor(3).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80").description("Deluxe Roman rooftop suite with private terrace and view of St. Peter’s Basilica dome.").build();
        Room r24 = Room.builder().hotel(h5).roomNumber("R-404").roomType(RoomType.TWIN).pricePerNight(new BigDecimal("230.00")).capacity(2).floor(4).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80").description("Comfortable twin room decorated with classical Italian artwork and warm timber.").build();
        Room r25 = Room.builder().hotel(h5).roomNumber("R-505").roomType(RoomType.FAMILY).pricePerNight(new BigDecimal("410.00")).capacity(4).floor(5).status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80").description("Spacious Roman apartment-style suite with 2 bedrooms and kitchen area.").build();

        roomRepository.saveAll(List.of(
                r1, r2, r3, r4, r5, r6, r7, r8, r9, r10,
                r11, r12, r13, r14, r15, r16, r17, r18, r19, r20,
                r21, r22, r23, r24, r25
        ));

        // 4. Seed Reservations & Payments
        Reservation res1 = Reservation.builder()
                .reservationCode("HTL-2026-100001")
                .user(cust1)
                .room(r1)
                .checkInDate(LocalDate.of(2026, 8, 1))
                .checkOutDate(LocalDate.of(2026, 8, 5))
                .numberOfGuests(1)
                .totalPrice(new BigDecimal("720.00"))
                .reservationStatus(ReservationStatus.COMPLETED)
                .specialRequests("Early check-in requested.")
                .build();
        reservationRepository.save(res1);

        Payment pay1 = Payment.builder()
                .reservation(res1)
                .amount(new BigDecimal("720.00"))
                .paymentStatus(PaymentStatus.PAID)
                .paymentMethod(PaymentMethod.CARD)
                .transactionReference("TXN-CARD-20260801-001")
                .build();
        paymentRepository.save(pay1);

        Reservation res2 = Reservation.builder()
                .reservationCode("HTL-2026-100002")
                .user(cust1)
                .room(r2)
                .checkInDate(LocalDate.of(2026, 10, 10))
                .checkOutDate(LocalDate.of(2026, 10, 15))
                .numberOfGuests(2)
                .totalPrice(new BigDecimal("1300.00"))
                .reservationStatus(ReservationStatus.CONFIRMED)
                .specialRequests("Anniversary setup with flowers.")
                .build();
        reservationRepository.save(res2);

        Payment pay2 = Payment.builder()
                .reservation(res2)
                .amount(new BigDecimal("1300.00"))
                .paymentStatus(PaymentStatus.PAID)
                .paymentMethod(PaymentMethod.ONLINE)
                .transactionReference("TXN-ONL-20260901-002")
                .build();
        paymentRepository.save(pay2);

        Reservation res3 = Reservation.builder()
                .reservationCode("HTL-2026-100003")
                .user(cust2)
                .room(r7)
                .checkInDate(LocalDate.of(2026, 10, 12))
                .checkOutDate(LocalDate.of(2026, 10, 16))
                .numberOfGuests(2)
                .totalPrice(new BigDecimal("1280.00"))
                .reservationStatus(ReservationStatus.CONFIRMED)
                .specialRequests("High floor preferred.")
                .build();
        reservationRepository.save(res3);

        Payment pay3 = Payment.builder()
                .reservation(res3)
                .amount(new BigDecimal("1280.00"))
                .paymentStatus(PaymentStatus.PAID)
                .paymentMethod(PaymentMethod.CARD)
                .transactionReference("TXN-CARD-20260902-003")
                .build();
        paymentRepository.save(pay3);

        Reservation res4 = Reservation.builder()
                .reservationCode("HTL-2026-100004")
                .user(cust3)
                .room(r12)
                .checkInDate(LocalDate.of(2026, 11, 1))
                .checkOutDate(LocalDate.of(2026, 11, 6))
                .numberOfGuests(2)
                .totalPrice(new BigDecimal("1250.00"))
                .reservationStatus(ReservationStatus.CONFIRMED)
                .build();
        reservationRepository.save(res4);

        Payment pay4 = Payment.builder()
                .reservation(res4)
                .amount(new BigDecimal("1250.00"))
                .paymentStatus(PaymentStatus.PAID)
                .paymentMethod(PaymentMethod.ONLINE)
                .transactionReference("TXN-ONL-20260903-004")
                .build();
        paymentRepository.save(pay4);

        Reservation res5 = Reservation.builder()
                .reservationCode("HTL-2026-100005")
                .user(cust4)
                .room(r18)
                .checkInDate(LocalDate.of(2026, 12, 20))
                .checkOutDate(LocalDate.of(2026, 12, 27))
                .numberOfGuests(4)
                .totalPrice(new BigDecimal("6230.00"))
                .reservationStatus(ReservationStatus.CONFIRMED)
                .build();
        reservationRepository.save(res5);

        Payment pay5 = Payment.builder()
                .reservation(res5)
                .amount(new BigDecimal("6230.00"))
                .paymentStatus(PaymentStatus.PAID)
                .paymentMethod(PaymentMethod.CARD)
                .transactionReference("TXN-CARD-20260904-005")
                .build();
        paymentRepository.save(pay5);

        logger.info("Demo data seeding completed successfully! Ready for production testing.");
    }
}
