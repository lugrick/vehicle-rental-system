package com.vehiclerental.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins="*")
public class AdminController {
 @Value("${app.admin.username:admin}") private String username;
 @Value("${app.admin.password:admin123}") private String password;

 @PostMapping("/login")
 public ResponseEntity<?> login(@RequestBody Map<String,String> i){
  if(username.equals(i.get("username")) && password.equals(i.get("password")))
   return ResponseEntity.ok(Map.of("username",username,"role","ADMIN"));
  return ResponseEntity.status(401).body("Invalid admin username or password");
 }
}
