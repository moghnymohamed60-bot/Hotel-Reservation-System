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
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final ExpenseRepository expenseRepository;
    private final AuditLogRepository auditLogRepository;
    private final SystemAlertRepository systemAlertRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(
            UserRepository userRepository,
            HotelRepository hotelRepository,
            RoomRepository roomRepository,
            ReservationRepository reservationRepository,
            PaymentRepository paymentRepository,
            ExpenseRepository expenseRepository,
            AuditLogRepository auditLogRepository,
            SystemAlertRepository systemAlertRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
        this.paymentRepository = paymentRepository;
        this.expenseRepository = expenseRepository;
        this.auditLogRepository = auditLogRepository;
        this.systemAlertRepository = systemAlertRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Database already initialized. Skipping seed data generation.");
            return;
        }

        logger.info("Seeding realistic enterprise production demo data...");

        String defaultEncodedPassword = passwordEncoder.encode("password123");

        // 1. Seed Executive and Staff Users
        User admin = User.builder()
                .firstName("System")
                .lastName("Administrator")
                .email("admin@grandhotel.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+1 212 555 0100")
                .role(Role.ADMIN)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User ceo = User.builder()
                .firstName("Alexander")
                .lastName("Sterling")
                .email("ceo@grandhotel.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+1 212 555 0101")
                .role(Role.CEO)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User cfo = User.builder()
                .firstName("Victoria")
                .lastName("Vance")
                .email("cfo@grandhotel.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+1 212 555 0102")
                .role(Role.CFO)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User accountant = User.builder()
                .firstName("Marcus")
                .lastName("Brooke")
                .email("accountant@grandhotel.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+1 212 555 0103")
                .role(Role.ACCOUNTANT)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User coo = User.builder()
                .firstName("David")
                .lastName("Mercer")
                .email("coo@grandhotel.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+1 212 555 0104")
                .role(Role.COO)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User cmo = User.builder()
                .firstName("Elena")
                .lastName("Rostova")
                .email("cmo@grandhotel.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+1 212 555 0105")
                .role(Role.CMO)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User cto = User.builder()
                .firstName("Julian")
                .lastName("Hayes")
                .email("cto@grandhotel.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+1 212 555 0106")
                .role(Role.CTO)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User staff1 = User.builder()
                .firstName("Sarah")
                .lastName("Staff")
                .email("sarah.staff@grandhotel.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+1 212 555 0107")
                .role(Role.STAFF)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User cust1 = User.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+1 212 555 0108")
                .role(Role.CUSTOMER)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User cust2 = User.builder()
                .firstName("Emma")
                .lastName("Watson")
                .email("emma.watson@example.com")
                .password(defaultEncodedPassword)
                .phoneNumber("+1 212 555 0109")
                .role(Role.CUSTOMER)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        userRepository.saveAll(List.of(admin, ceo, cfo, accountant, coo, cmo, cto, staff1, cust1, cust2));

        // 2. Seed Hotels
        Hotel hotel1 = Hotel.builder()
                .name("The Manhattan Grand Luxury Hotel")
                .description("Iconic 5-star flagship hotel located in the heart of Midtown Manhattan.")
                .address("768 5th Ave, Central Park South")
                .city("New York")
                .country("United States")
                .phoneNumber("+1 (212) 759-3000")
                .email("reservations@manhattangrand.com")
                .starRating(5)
                .imageUrl("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80")
                .build();

        Hotel hotel2 = Hotel.builder()
                .name("The Beverly Hills Oasis Resort")
                .description("Legendary palace hotel surrounded by tropical gardens and world-renowned dining.")
                .address("9641 Sunset Blvd")
                .city("Los Angeles")
                .country("United States")
                .phoneNumber("+1 (310) 276-2251")
                .email("concierge@beverlyhillsoasis.com")
                .starRating(5)
                .imageUrl("https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80")
                .build();

        Hotel hotel3 = Hotel.builder()
                .name("The Ritz Paris Experience")
                .description("Timeless Parisian elegance with Belle Époque suites and Michelin-starred dining.")
                .address("15 Place Vendôme")
                .city("Paris")
                .country("France")
                .phoneNumber("+33 1 43 16 30 30")
                .email("info@ritzparis.com")
                .starRating(5)
                .imageUrl("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80")
                .build();

        Hotel hotel4 = Hotel.builder()
                .name("Alpine Grand Lodge & Chalet")
                .description("Ski-in ski-out luxury mountain lodge offering private chalets and thermal spas.")
                .address("Via Serlas 27")
                .city("St. Moritz")
                .country("Switzerland")
                .phoneNumber("+41 81 837 10 00")
                .starRating(5)
                .email("chalet@alpinelodge.ch")
                .imageUrl("https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80")
                .build();

        Hotel hotel5 = Hotel.builder()
                .name("Overwater Villa & Spa Maldives")
                .description("Exclusive private island retreat featuring overwater bungalows and marine sanctuary.")
                .address("Baa Atoll Island")
                .city("Malé")
                .country("Maldives")
                .phoneNumber("+960 660-0888")
                .email("island@overwatervillas.mv")
                .starRating(5)
                .imageUrl("https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80")
                .build();

        hotelRepository.saveAll(List.of(hotel1, hotel2, hotel3, hotel4, hotel5));

        // 3. Seed Rooms
        Room r1 = Room.builder().hotel(hotel1).roomNumber("101").roomType(RoomType.SINGLE).pricePerNight(BigDecimal.valueOf(180.00)).capacity(1).floor(1).description("Classic Single Room").status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80").build();
        Room r2 = Room.builder().hotel(hotel1).roomNumber("102").roomType(RoomType.DOUBLE).pricePerNight(BigDecimal.valueOf(260.00)).capacity(2).floor(1).description("Deluxe City Double").status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80").build();
        Room r3 = Room.builder().hotel(hotel1).roomNumber("201").roomType(RoomType.SUITE).pricePerNight(BigDecimal.valueOf(450.00)).capacity(3).floor(2).description("Executive Park Suite").status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80").build();
        Room r4 = Room.builder().hotel(hotel1).roomNumber("301").roomType(RoomType.DELUXE).pricePerNight(BigDecimal.valueOf(650.00)).capacity(4).floor(3).description("Grand Luxury Deluxe Suite").status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80").build();
        Room r5 = Room.builder().hotel(hotel1).roomNumber("PH1").roomType(RoomType.SUITE).pricePerNight(BigDecimal.valueOf(1500.00)).capacity(6).floor(10).description("Presidential Skyline Penthouse").status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80").build();

        Room r6 = Room.builder().hotel(hotel2).roomNumber("101").roomType(RoomType.DOUBLE).pricePerNight(BigDecimal.valueOf(320.00)).capacity(2).floor(1).description("Garden View King Room").status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80").build();
        Room r7 = Room.builder().hotel(hotel2).roomNumber("201").roomType(RoomType.SUITE).pricePerNight(BigDecimal.valueOf(550.00)).capacity(4).floor(2).description("Palm Suite with Terrace").status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80").build();

        Room r8 = Room.builder().hotel(hotel3).roomNumber("101").roomType(RoomType.DELUXE).pricePerNight(BigDecimal.valueOf(750.00)).capacity(2).floor(1).description("Place Vendôme Prestige Room").status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80").build();
        Room r9 = Room.builder().hotel(hotel4).roomNumber("101").roomType(RoomType.SUITE).pricePerNight(BigDecimal.valueOf(620.00)).capacity(4).floor(1).description("Alpine Panorama Suite").status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80").build();
        Room r10 = Room.builder().hotel(hotel5).roomNumber("OV1").roomType(RoomType.SUITE).pricePerNight(BigDecimal.valueOf(1800.00)).capacity(4).floor(1).description("Lagoon Overwater Villa").status(RoomStatus.AVAILABLE).imageUrl("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80").build();

        roomRepository.saveAll(List.of(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10));

        // 4. Seed Multi-Channel Historical Reservations & Payments
        Reservation res1 = Reservation.builder()
                .reservationCode("HTL-2026-100101")
                .user(cust1)
                .room(r3)
                .checkInDate(LocalDate.now().minusDays(20))
                .checkOutDate(LocalDate.now().minusDays(16))
                .numberOfGuests(2)
                .totalPrice(BigDecimal.valueOf(1800.00))
                .addOnRevenue(BigDecimal.valueOf(250.00))
                .bookingChannel(BookingChannel.DIRECT_WEBSITE)
                .reservationStatus(ReservationStatus.COMPLETED)
                .specialRequests("Late check-in requested")
                .build();
        Payment p1 = Payment.builder().reservation(res1).amount(BigDecimal.valueOf(2050.00)).gatewayFee(BigDecimal.valueOf(59.45)).refundAmount(BigDecimal.ZERO).paymentStatus(PaymentStatus.PAID).paymentMethod(PaymentMethod.CARD).transactionReference("TXN-CARD-2026-001").build();
        res1.setPayment(p1);

        Reservation res2 = Reservation.builder()
                .reservationCode("HTL-2026-100102")
                .user(cust2)
                .room(r5)
                .checkInDate(LocalDate.now().minusDays(15))
                .checkOutDate(LocalDate.now().minusDays(12))
                .numberOfGuests(4)
                .totalPrice(BigDecimal.valueOf(4500.00))
                .addOnRevenue(BigDecimal.valueOf(600.00))
                .bookingChannel(BookingChannel.BOOKING_COM)
                .reservationStatus(ReservationStatus.COMPLETED)
                .specialRequests("VIP arrival amenities")
                .build();
        Payment p2 = Payment.builder().reservation(res2).amount(BigDecimal.valueOf(5100.00)).gatewayFee(BigDecimal.valueOf(147.90)).refundAmount(BigDecimal.ZERO).paymentStatus(PaymentStatus.PAID).paymentMethod(PaymentMethod.ONLINE).transactionReference("TXN-ONL-2026-002").build();
        res2.setPayment(p2);

        Reservation res3 = Reservation.builder()
                .reservationCode("HTL-2026-100103")
                .user(cust1)
                .room(r8)
                .checkInDate(LocalDate.now().minusDays(8))
                .checkOutDate(LocalDate.now().minusDays(4))
                .numberOfGuests(2)
                .totalPrice(BigDecimal.valueOf(3000.00))
                .addOnRevenue(BigDecimal.valueOf(350.00))
                .bookingChannel(BookingChannel.AIRBNB)
                .reservationStatus(ReservationStatus.COMPLETED)
                .build();
        Payment p3 = Payment.builder().reservation(res3).amount(BigDecimal.valueOf(3350.00)).gatewayFee(BigDecimal.valueOf(97.15)).refundAmount(BigDecimal.ZERO).paymentStatus(PaymentStatus.PAID).paymentMethod(PaymentMethod.CARD).transactionReference("TXN-CARD-2026-003").build();
        res3.setPayment(p3);

        Reservation res4 = Reservation.builder()
                .reservationCode("HTL-2026-100104")
                .user(cust2)
                .room(r10)
                .checkInDate(LocalDate.now().minusDays(3))
                .checkOutDate(LocalDate.now().plusDays(2))
                .numberOfGuests(2)
                .totalPrice(BigDecimal.valueOf(9000.00))
                .addOnRevenue(BigDecimal.valueOf(1200.00))
                .bookingChannel(BookingChannel.EXPEDIA)
                .reservationStatus(ReservationStatus.CONFIRMED)
                .specialRequests("Honeymoon package setup")
                .build();
        Payment p4 = Payment.builder().reservation(res4).amount(BigDecimal.valueOf(10200.00)).gatewayFee(BigDecimal.valueOf(295.80)).refundAmount(BigDecimal.ZERO).paymentStatus(PaymentStatus.PAID).paymentMethod(PaymentMethod.CARD).transactionReference("TXN-CARD-2026-004").build();
        res4.setPayment(p4);

        Reservation res5 = Reservation.builder()
                .reservationCode("HTL-2026-100105")
                .user(cust1)
                .room(r4)
                .checkInDate(LocalDate.now().plusDays(5))
                .checkOutDate(LocalDate.now().plusDays(9))
                .numberOfGuests(2)
                .totalPrice(BigDecimal.valueOf(2600.00))
                .addOnRevenue(BigDecimal.valueOf(180.00))
                .bookingChannel(BookingChannel.DIRECT_WEBSITE)
                .reservationStatus(ReservationStatus.CONFIRMED)
                .build();
        Payment p5 = Payment.builder().reservation(res5).amount(BigDecimal.valueOf(2780.00)).gatewayFee(BigDecimal.valueOf(80.62)).refundAmount(BigDecimal.ZERO).paymentStatus(PaymentStatus.PAID).paymentMethod(PaymentMethod.ONLINE).transactionReference("TXN-ONL-2026-005").build();
        res5.setPayment(p5);

        Reservation res6 = Reservation.builder()
                .reservationCode("HTL-2026-100106")
                .user(cust2)
                .room(r2)
                .checkInDate(LocalDate.now().minusDays(10))
                .checkOutDate(LocalDate.now().minusDays(8))
                .numberOfGuests(2)
                .totalPrice(BigDecimal.valueOf(520.00))
                .addOnRevenue(BigDecimal.ZERO)
                .bookingChannel(BookingChannel.BOOKING_COM)
                .reservationStatus(ReservationStatus.CANCELLED)
                .specialRequests("Guest flight cancelled")
                .build();
        Payment p6 = Payment.builder().reservation(res6).amount(BigDecimal.valueOf(520.00)).gatewayFee(BigDecimal.valueOf(15.08)).refundAmount(BigDecimal.valueOf(520.00)).paymentStatus(PaymentStatus.REFUNDED).paymentMethod(PaymentMethod.CARD).transactionReference("TXN-REF-2026-006").build();
        res6.setPayment(p6);

        reservationRepository.saveAll(List.of(res1, res2, res3, res4, res5, res6));

        // 5. Seed Realistic Categorized Expenses
        Expense exp1 = Expense.builder().category(ExpenseCategory.FIXED_COST).department("Administration").description("Executive & Staff Payroll (Monthly)").amount(BigDecimal.valueOf(8500.00)).paymentMethod(PaymentMethod.BANK_TRANSFER).vendor("ADP Payroll Services").status(ExpenseStatus.PAID).expenseDate(LocalDate.now().minusDays(15)).createdBy("cfo@grandhotel.com").approvedBy("ceo@grandhotel.com").build();
        Expense exp2 = Expense.builder().category(ExpenseCategory.FIXED_COST).department("Facilities").description("Property Insurance & Premium Coverage").amount(BigDecimal.valueOf(2200.00)).paymentMethod(PaymentMethod.BANK_TRANSFER).vendor("Chubb Commercial Insurance").status(ExpenseStatus.PAID).expenseDate(LocalDate.now().minusDays(20)).createdBy("cfo@grandhotel.com").approvedBy("ceo@grandhotel.com").build();
        Expense exp3 = Expense.builder().category(ExpenseCategory.FIXED_COST).department("IT & Systems").description("Oracle Hospitality PMS & Cloud Infrastructure").amount(BigDecimal.valueOf(1450.00)).paymentMethod(PaymentMethod.CARD).vendor("Oracle Cloud Systems").status(ExpenseStatus.PAID).expenseDate(LocalDate.now().minusDays(12)).createdBy("cto@grandhotel.com").approvedBy("cfo@grandhotel.com").build();

        Expense exp4 = Expense.builder().category(ExpenseCategory.VARIABLE_COST).department("Housekeeping").description("Eco-Luxury Linen, Robes & Towel Replenishment").amount(BigDecimal.valueOf(1850.00)).paymentMethod(PaymentMethod.CARD).vendor("Frette Hospitality Group").status(ExpenseStatus.PAID).expenseDate(LocalDate.now().minusDays(18)).createdBy("coo@grandhotel.com").approvedBy("cfo@grandhotel.com").build();
        Expense exp5 = Expense.builder().category(ExpenseCategory.VARIABLE_COST).department("Food & Beverage").description("Gourmet Continental Breakfast & Caviar Restock").amount(BigDecimal.valueOf(2400.00)).paymentMethod(PaymentMethod.CARD).vendor("Sysco Gourmet Foods").status(ExpenseStatus.PAID).expenseDate(LocalDate.now().minusDays(8)).createdBy("coo@grandhotel.com").approvedBy("cfo@grandhotel.com").build();
        Expense exp6 = Expense.builder().category(ExpenseCategory.VARIABLE_COST).department("Facilities").description("Monthly Electricity, Water & Thermal Heating").amount(BigDecimal.valueOf(3100.00)).paymentMethod(PaymentMethod.BANK_TRANSFER).vendor("ConEdison Commercial").status(ExpenseStatus.PAID).expenseDate(LocalDate.now().minusDays(5)).createdBy("coo@grandhotel.com").approvedBy("cfo@grandhotel.com").build();

        Expense exp7 = Expense.builder().category(ExpenseCategory.SALES_MARKETING).department("Marketing").description("Google Performance Max & Search Ads").amount(BigDecimal.valueOf(1900.00)).paymentMethod(PaymentMethod.CARD).vendor("Google Ads LLC").status(ExpenseStatus.PAID).expenseDate(LocalDate.now().minusDays(14)).createdBy("cmo@grandhotel.com").approvedBy("cfo@grandhotel.com").build();
        Expense exp8 = Expense.builder().category(ExpenseCategory.SALES_MARKETING).department("Marketing").description("Summer Luxury Escape Influencer Campaign").amount(BigDecimal.valueOf(1300.00)).paymentMethod(PaymentMethod.CARD).vendor("Meta Ad Network").status(ExpenseStatus.PAID).expenseDate(LocalDate.now().minusDays(7)).createdBy("cmo@grandhotel.com").approvedBy("cfo@grandhotel.com").build();

        Expense exp9 = Expense.builder().category(ExpenseCategory.FINANCIAL_COST).department("Finance").description("Merchant Payment Terminal Lease & Compliance Fee").amount(BigDecimal.valueOf(380.00)).paymentMethod(PaymentMethod.CARD).vendor("Stripe Terminal Global").status(ExpenseStatus.PAID).expenseDate(LocalDate.now().minusDays(10)).createdBy("accountant@grandhotel.com").approvedBy("cfo@grandhotel.com").build();

        Expense exp10 = Expense.builder().category(ExpenseCategory.OTHER).department("Operations").description("Annual Fire Safety Inspection & Certification").amount(BigDecimal.valueOf(650.00)).paymentMethod(PaymentMethod.CARD).vendor("City Safety Bureau").status(ExpenseStatus.APPROVED).expenseDate(LocalDate.now().minusDays(2)).createdBy("coo@grandhotel.com").approvedBy("cfo@grandhotel.com").build();
        Expense exp11 = Expense.builder().category(ExpenseCategory.VARIABLE_COST).department("Housekeeping").description("Organic Spa & Botanical Amenities Restock").amount(BigDecimal.valueOf(920.00)).paymentMethod(PaymentMethod.CARD).vendor("Aesop Hospitality").status(ExpenseStatus.PENDING).expenseDate(LocalDate.now().minusDays(1)).createdBy("coo@grandhotel.com").build();

        expenseRepository.saveAll(List.of(exp1, exp2, exp3, exp4, exp5, exp6, exp7, exp8, exp9, exp10, exp11));

        // 6. Seed Audit Logs
        AuditLog al1 = AuditLog.builder().userId(ceo.getId()).userEmail("ceo@grandhotel.com").userRole("ROLE_CEO").action("LOGIN").entityName("Auth").entityId("1").ipAddress("192.168.1.10").description("CEO authenticated into Executive Portal").timestamp(LocalDateTime.now().minusHours(4)).build();
        AuditLog al2 = AuditLog.builder().userId(cfo.getId()).userEmail("cfo@grandhotel.com").userRole("ROLE_CFO").action("APPROVE").entityName("Expense").entityId("1").ipAddress("192.168.1.15").description("CFO approved monthly payroll expense ($8,500.00)").timestamp(LocalDateTime.now().minusHours(3)).build();
        AuditLog al3 = AuditLog.builder().userId(admin.getId()).userEmail("admin@grandhotel.com").userRole("ROLE_ADMIN").action("CREATE").entityName("Reservation").entityId("HTL-2026-100105").ipAddress("127.0.0.1").description("Created reservation HTL-2026-100105").timestamp(LocalDateTime.now().minusHours(2)).build();
        AuditLog al4 = AuditLog.builder().userId(accountant.getId()).userEmail("accountant@grandhotel.com").userRole("ROLE_ACCOUNTANT").action("EXPORT").entityName("Report").entityId("P&L").ipAddress("192.168.1.20").description("Generated Monthly P&L CSV statement").timestamp(LocalDateTime.now().minusMinutes(45)).build();
        auditLogRepository.saveAll(List.of(al1, al2, al3, al4));

        // 7. Seed System & Financial Alerts
        SystemAlert a1 = SystemAlert.builder().severity(AlertSeverity.INFO).category(AlertCategory.FINANCIAL).title("Record Q3 RevPAR Performance").description("RevPAR increased by 14.2% driven by surge in Penthouse suite bookings.").relatedEntity("Revenue").status("ACTIVE").createdAt(LocalDateTime.now().minusDays(1)).build();
        SystemAlert a2 = SystemAlert.builder().severity(AlertSeverity.WARNING).category(AlertCategory.OPERATIONAL).title("Elevated Housekeeping Turnaround").description("Average cleaning turnaround exceeded 45 minutes on weekend turnover.").relatedEntity("Operations").status("ACTIVE").createdAt(LocalDateTime.now().minusHours(12)).build();
        SystemAlert a3 = SystemAlert.builder().severity(AlertSeverity.INFO).category(AlertCategory.SYSTEM).title("Zero Anomaly Financial Verification").description("Automated ledger audit completed with 100% balance reconciliation.").relatedEntity("Treasury").status("RESOLVED").createdAt(LocalDateTime.now().minusHours(6)).build();
        systemAlertRepository.saveAll(List.of(a1, a2, a3));

        logger.info("Enterprise demo data seeding completed successfully! All executive platforms ready.");
    }
}
