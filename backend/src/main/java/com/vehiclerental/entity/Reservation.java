package com.vehiclerental.entity;
import jakarta.persistence.*; import java.time.LocalDate;
@Entity @Table(name="reservations") public class Reservation {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false) private Long customerId; @Column(nullable=false) private Long vehicleId; @Column(nullable=false) private LocalDate startDate; @Column(nullable=false) private LocalDate endDate; @Column(nullable=false) private double totalCost; @Column(nullable=false) private String status;
 public Reservation(){} public Long getId(){return id;} public Long getCustomerId(){return customerId;} public Long getVehicleId(){return vehicleId;} public LocalDate getStartDate(){return startDate;} public LocalDate getEndDate(){return endDate;} public double getTotalCost(){return totalCost;} public String getStatus(){return status;}
 public void setCustomerId(Long v){customerId=v;} public void setVehicleId(Long v){vehicleId=v;} public void setStartDate(LocalDate v){startDate=v;} public void setEndDate(LocalDate v){endDate=v;} public void setTotalCost(double v){totalCost=v;} public void setStatus(String v){status=v;}
}