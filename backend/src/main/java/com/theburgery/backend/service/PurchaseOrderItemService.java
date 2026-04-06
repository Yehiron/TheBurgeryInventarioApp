package com.theburgery.backend.service;

import com.theburgery.backend.entity.PurchaseOrderItem;
import com.theburgery.backend.repository.PurchaseOrderItemRepository;
import com.theburgery.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseOrderItemService {
    private final PurchaseOrderItemRepository repository;

    public List<PurchaseOrderItem> findAll() { return repository.findAll(); }
    public PurchaseOrderItem findById(Long id) { return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("PurchaseOrderItem not found")); }
    public PurchaseOrderItem save(PurchaseOrderItem entity) { return repository.save(entity); }
    public PurchaseOrderItem update(Long id, PurchaseOrderItem entity) {
        PurchaseOrderItem existing = findById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("PurchaseOrderItem not found");
        repository.deleteById(id);
    }
}
