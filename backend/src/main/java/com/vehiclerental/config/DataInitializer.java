package com.vehiclerental.config;

import com.vehiclerental.entity.Vehicle;
import com.vehiclerental.repository.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
 @Bean
 CommandLineRunner seedVehicles(VehicleRepository repo){
  return args -> {
   if(repo.count()>0) return;
   repo.save(new Vehicle("Toyota Innova","Car","KL-11-AB-1001",2500,true));
   repo.save(new Vehicle("Hyundai i20","Car","KL-11-AB-1002",1800,true));
   repo.save(new Vehicle("Honda City","Car","KL-11-AB-1003",2200,true));
   repo.save(new Vehicle("Royal Enfield Classic 350","Bike","KL-11-AB-2001",900,true));
   repo.save(new Vehicle("Yamaha R15","Bike","KL-11-AB-2002",1000,true));
   repo.save(new Vehicle("Honda Activa","Bike","KL-11-AB-2003",500,true));
  };
 }
}
