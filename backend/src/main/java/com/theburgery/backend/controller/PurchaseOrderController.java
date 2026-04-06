package com.theburgery.backend.controller;

import com.theburgery.backend.entity.PurchaseOrder;
import com.theburgery.backend.service.PurchaseOrderService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/purchase_orders")
@RequiredArgsConstructor
public class PurchaseOrderController {
    private final PurchaseOrderService service;

    @GetMapping
    public List<PurchaseOrder> getAll() { return service.findAll(); }
    @GetMapping("/{id}")
    public PurchaseOrder getById(@PathVariable Long id) { return service.findById(id); }
    @PostMapping
    public PurchaseOrder create(@Valid @RequestBody PurchaseOrder entity) {
        if(entity.getItems() != null) {
             entity.getItems().forEach(item -> item.setOrder(entity));
        }
        return service.save(entity); }
    @PutMapping("/{id}")
    public PurchaseOrder update(@PathVariable Long id, @Valid @RequestBody PurchaseOrder entity) { return service.update(id, entity); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
