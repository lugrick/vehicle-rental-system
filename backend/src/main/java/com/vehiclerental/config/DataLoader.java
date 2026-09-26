package com.vehiclerental.config;

import com.vehiclerental.entity.Vehicle;
import com.vehiclerental.repository.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;

@Configuration
public class DataLoader {

 @Bean
 CommandLineRunner seedVehicles(VehicleRepository repo) {
  return args -> {
   addIfMissing(repo, "Toyota Innova", "Car", "KL-11-AB-1001", 2500);
   addIfMissing(repo, "Hyundai i20", "Car", "KL-11-AB-1002", 1800);
   addIfMissing(repo, "Honda City", "Car", "KL-11-AB-1003", 2200);
   addIfMissing(repo, "Maruti Swift", "Car", "KL-11-AB-1004", 1700);
   addIfMissing(repo, "Kia Seltos", "Car", "KL-11-AB-1005", 2800);
   addIfMissing(repo, "Mahindra Thar", "Car", "KL-11-AB-1006", 3200);
   addIfMissing(repo, "Tata Nexon", "Car", "KL-11-AB-1007", 2100);
   addIfMissing(repo, "Hyundai Creta", "Car", "KL-11-AB-1008", 2900);
   addIfMissing(repo, "Royal Enfield Classic 350", "Bike", "KL-11-AB-2001", 900);
   addIfMissing(repo, "Yamaha R15", "Bike", "KL-11-AB-2002", 1000);
   addIfMissing(repo, "Honda Activa", "Bike", "KL-11-AB-2003", 500);
   addIfMissing(repo, "Royal Enfield Hunter 350", "Bike", "KL-11-AB-2004", 950);
   addIfMissing(repo, "KTM Duke 200", "Bike", "KL-11-AB-2005", 1100);
   addIfMissing(repo, "Bajaj Pulsar N160", "Bike", "KL-11-AB-2006", 750);
   addIfMissing(repo, "TVS Apache RTR 200", "Bike", "KL-11-AB-2007", 800);
   addIfMissing(repo, "Suzuki Access 125", "Bike", "KL-11-AB-2008", 550);
  };
 }

 private void addIfMissing(VehicleRepository repo, String name, String type, String registrationNumber, double pricePerDay) {
  if (repo.findByRegistrationNumber(registrationNumber).isEmpty()) {
   repo.save(new Vehicle(name, type, registrationNumber, pricePerDay, true));
  }
 }
}