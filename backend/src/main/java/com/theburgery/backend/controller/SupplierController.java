package com.theburgery.backend.controller;

import com.theburgery.backend.entity.Supplier;
import com.theburgery.backend.service.SupplierService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {
    private final SupplierService service;

    @GetMapping
    public List<Supplier> getAll() { return service.findAll(); }
    @GetMapping("/{id}")
    public Supplier getById(@PathVariable Long id) { return service.findById(id); }
    @PostMapping
    public Supplier create(@Valid @RequestBody Supplier entity) {
        return service.save(entity); }
    @PutMapping("/{id}")
    public Supplier update(@PathVariable Long id, @Valid @RequestBody Supplier entity) { return service.update(id, entity); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
