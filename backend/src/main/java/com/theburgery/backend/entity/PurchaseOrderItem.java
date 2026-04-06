package com.theburgery.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name="purchase_order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name="order_id") @com.fasterxml.jackson.annotation.JsonIgnore
    private PurchaseOrder order;
    @ManyToOne @JoinColumn(name="ingredient_id")
    private Ingredient ingredient;
    private java.math.BigDecimal cantidad;
}
