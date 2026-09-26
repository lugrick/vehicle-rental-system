package com.vehiclerental.entity;
import jakarta.persistence.*;
@Entity @Table(name="customers") public class Customer {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false) private String name; @Column(unique=true,nullable=false) private String phoneNumber; @Column(nullable=false) private String password;
 public Customer(){} public Customer(String n,String p,String pw){name=n;phoneNumber=p;password=pw;}
 public Long getId(){return id;} public String getName(){return name;} public String getPhoneNumber(){return phoneNumber;} public String getPassword(){return password;}
 public void setName(String v){name=v;} public void setPhoneNumber(String v){phoneNumber=v;} public void setPassword(String v){password=v;}
}