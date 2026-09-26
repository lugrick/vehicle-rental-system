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
   addIfMissing(repo, "Toyota Glanza", "Car", "KL-11-AB-1009", 1900);
   addIfMissing(repo, "Honda Amaze", "Car", "KL-11-AB-1010", 2000);
   addIfMissing(repo, "Maruti Baleno", "Car", "KL-11-AB-1011", 1850);
   addIfMissing(repo, "Kia Sonet", "Car", "KL-11-AB-1012", 2300);
   addIfMissing(repo, "Mahindra XUV700", "Car", "KL-11-AB-1013", 3500);
   addIfMissing(repo, "Toyota Urban Cruiser", "Car", "KL-11-AB-1014", 2700);
   addIfMissing(repo, "Tata Punch", "Car", "KL-11-AB-1015", 1950);
   addIfMissing(repo, "Hyundai Verna", "Car", "KL-11-AB-1016", 2400);
   addIfMissing(repo, "Honda Hornet 2.0", "Bike", "KL-11-AB-2009", 850);
   addIfMissing(repo, "KTM Duke 390", "Bike", "KL-11-AB-2010", 1500);
   addIfMissing(repo, "Yamaha MT-15", "Bike", "KL-11-AB-2011", 1050);
   addIfMissing(repo, "Bajaj Dominar 400", "Bike", "KL-11-AB-2012", 1300);
   addIfMissing(repo, "TVS Ronin", "Bike", "KL-11-AB-2013", 900);
   addIfMissing(repo, "Hero Xpulse 200", "Bike", "KL-11-AB-2014", 850);
   addIfMissing(repo, "Bajaj Avenger 160", "Bike", "KL-11-AB-2015", 800);
   addIfMissing(repo, "TVS Ntorq 125", "Bike", "KL-11-AB-2016", 600);
  };
 }

 private void addIfMissing(VehicleRepository repo, String name, String type, String registrationNumber, double pricePerDay) {
  if (repo.findByRegistrationNumber(registrationNumber).isEmpty()) {
   repo.save(new Vehicle(name, type, registrationNumber, pricePerDay, true));
  }
 }
}