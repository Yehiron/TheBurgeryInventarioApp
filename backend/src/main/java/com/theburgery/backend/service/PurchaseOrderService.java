package com.theburgery.backend.service;

import com.theburgery.backend.entity.PurchaseOrder;
import com.theburgery.backend.repository.PurchaseOrderRepository;
import com.theburgery.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseOrderService {
    private final PurchaseOrderRepository repository;

    public List<PurchaseOrder> findAll() { return repository.findAll(); }
    public PurchaseOrder findById(Long id) { return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("PurchaseOrder not found")); }
    public PurchaseOrder save(PurchaseOrder entity) { return repository.save(entity); }
    public PurchaseOrder update(Long id, PurchaseOrder entity) {
        PurchaseOrder existing = findById(id);
        entity.setId(id);
        if(entity.getItems() != null) {
             entity.getItems().forEach(item -> item.setOrder(entity));
        }
        return repository.save(entity);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("PurchaseOrder not found");
        repository.deleteById(id);
    }
}
