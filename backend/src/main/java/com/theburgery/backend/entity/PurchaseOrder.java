package com.theburgery.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name="purchase_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="fecha")
    private java.time.LocalDateTime fecha;
    @OneToMany(mappedBy="order", cascade=CascadeType.ALL, orphanRemoval=true)
    private java.util.List<PurchaseOrderItem> items;
}
