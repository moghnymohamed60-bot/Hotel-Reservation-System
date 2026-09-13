package com.example.hotelreservation.repository;

import com.example.hotelreservation.entity.Expense;
import com.example.hotelreservation.enums.ExpenseCategory;
import com.example.hotelreservation.enums.ExpenseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long>, JpaSpecificationExecutor<Expense> {

    List<Expense> findByExpenseDateBetween(LocalDate startDate, LocalDate endDate);

    Page<Expense> findByStatus(ExpenseStatus status, Pageable pageable);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.expenseDate BETWEEN :startDate AND :endDate AND e.status IN ('APPROVED', 'PAID')")
    BigDecimal sumTotalExpensesBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.category = :category AND e.expenseDate BETWEEN :startDate AND :endDate AND e.status IN ('APPROVED', 'PAID')")
    BigDecimal sumByCategoryBetween(@Param("category") ExpenseCategory category, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT e.category, COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.expenseDate BETWEEN :startDate AND :endDate AND e.status IN ('APPROVED', 'PAID') GROUP BY e.category")
    List<Object[]> sumGroupedByCategoryBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT e.department, COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.expenseDate BETWEEN :startDate AND :endDate AND e.status IN ('APPROVED', 'PAID') GROUP BY e.department")
    List<Object[]> sumGroupedByDepartmentBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
