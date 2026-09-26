package com.vehiclerental.entity;
import jakarta.persistence.*;
@Entity @Table(name="vehicles") public class Vehicle {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false) private String name; @Column(nullable=false) private String type; @Column(nullable=false,unique=true) private String registrationNumber; @Column(nullable=false) private double pricePerDay; private boolean available=true;
 public Vehicle(){} public Vehicle(String n,String t,String r,double p,boolean a){name=n;type=t;registrationNumber=r;pricePerDay=p;available=a;}
 public Long getId(){return id;} public String getName(){return name;} public String getType(){return type;} public String getRegistrationNumber(){return registrationNumber;} public double getPricePerDay(){return pricePerDay;} public boolean isAvailable(){return available;}
 public void setName(String v){name=v;} public void setType(String v){type=v;} public void setRegistrationNumber(String v){registrationNumber=v;} public void setPricePerDay(double v){pricePerDay=v;} public void setAvailable(boolean v){available=v;}
}