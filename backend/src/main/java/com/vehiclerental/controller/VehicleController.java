package com.vehiclerental.controller;
import com.vehiclerental.entity.Vehicle; import com.vehiclerental.repository.VehicleRepository; import org.springframework.http.ResponseEntity; import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/api/vehicles") @CrossOrigin(origins="*") public class VehicleController {
 private final VehicleRepository repo; public VehicleController(VehicleRepository r){repo=r;}
 @GetMapping public List<Vehicle> all(){return repo.findAll();}
 @GetMapping("/{id}") public ResponseEntity<Vehicle> one(@PathVariable Long id){return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());}
 @PostMapping public Vehicle add(@RequestBody Vehicle v){v.setAvailable(true);return repo.save(v);}
 @PutMapping("/{id}") public ResponseEntity<Vehicle> update(@PathVariable Long id,@RequestBody Vehicle i){return repo.findById(id).map(v->{v.setName(i.getName());v.setType(i.getType());v.setRegistrationNumber(i.getRegistrationNumber());v.setPricePerDay(i.getPricePerDay());v.setAvailable(i.isAvailable());return ResponseEntity.ok(repo.save(v));}).orElse(ResponseEntity.notFound().build());}
 @DeleteMapping("/{id}") public ResponseEntity<?> delete(@PathVariable Long id){if(!repo.existsById(id))return ResponseEntity.notFound().build();repo.deleteById(id);return ResponseEntity.ok().build();}
}