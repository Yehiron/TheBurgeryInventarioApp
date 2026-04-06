import os

base_pkg = "com.theburgery.backend"
base_dir = "c:/Users/SEBASTIAN/Desktop/CocinaApp/backend/src/main/java/com/theburgery/backend/"

entities = {
    "Category": {
        "fields": [
            ("Long", "id", "@Id @GeneratedValue(strategy = GenerationType.IDENTITY)"),
            ("String", "nombre", "@NotBlank"),
            ("String", "descripcion", "")
        ]
    },
    "Supplier": {
        "fields": [
            ("Long", "id", "@Id @GeneratedValue(strategy = GenerationType.IDENTITY)"),
            ("String", "nombre", "@NotBlank"),
            ("String", "telefono", ""),
            ("String", "direccion", ""),
            ("String", "contacto", "")
        ]
    },
    "Product": {
        "fields": [
            ("Long", "id", "@Id @GeneratedValue(strategy = GenerationType.IDENTITY)"),
            ("String", "nombre", "@NotBlank"),
            ("String", "unidadCompra", "@NotBlank @Column(name=\"unidad_compra\")"),
            ("java.math.BigDecimal", "precioEstimado", "@Column(name=\"precio_estimado\")"),
            ("Boolean", "activo", ""),
            ("Category", "category", "@ManyToOne @JoinColumn(name=\"category_id\")"),
            ("Supplier", "supplier", "@ManyToOne @JoinColumn(name=\"supplier_id\")")
        ]
    },
    "Ingredient": {
        "fields": [
            ("Long", "id", "@Id @GeneratedValue(strategy = GenerationType.IDENTITY)"),
            ("String", "nombre", "@NotBlank"),
            ("String", "unidadMedida", "@NotBlank @Column(name=\"unidad_medida\")"),
            ("Category", "category", "@ManyToOne @JoinColumn(name=\"category_id\")"),
            ("Supplier", "supplier", "@ManyToOne @JoinColumn(name=\"supplier_id\")")
        ]
    },
    "Recipe": {
        "fields": [
            ("Long", "id", "@Id @GeneratedValue(strategy = GenerationType.IDENTITY)"),
            ("String", "nombre", "@NotBlank"),
            ("String", "descripcion", ""),
            ("java.util.List<RecipeIngredient>", "ingredients", "@OneToMany(mappedBy=\"recipe\", cascade=CascadeType.ALL, orphanRemoval=true)")
        ]
    },
    "RecipeIngredient": {
        "fields": [
            ("Long", "id", "@Id @GeneratedValue(strategy = GenerationType.IDENTITY)"),
            ("Recipe", "recipe", "@ManyToOne @JoinColumn(name=\"recipe_id\") @com.fasterxml.jackson.annotation.JsonIgnore"),
            ("Ingredient", "ingredient", "@ManyToOne @JoinColumn(name=\"ingredient_id\")"),
            ("java.math.BigDecimal", "cantidadRequerida", "@Column(name=\"cantidad_requerida\")")
        ]
    },
    "PurchaseOrder": {
        "fields": [
            ("Long", "id", "@Id @GeneratedValue(strategy = GenerationType.IDENTITY)"),
            ("java.time.LocalDateTime", "fecha", "@Column(name=\"fecha\")"),
            ("java.util.List<PurchaseOrderItem>", "items", "@OneToMany(mappedBy=\"order\", cascade=CascadeType.ALL, orphanRemoval=true)")
        ]
    },
    "PurchaseOrderItem": {
        "fields": [
            ("Long", "id", "@Id @GeneratedValue(strategy = GenerationType.IDENTITY)"),
            ("PurchaseOrder", "order", "@ManyToOne @JoinColumn(name=\"order_id\") @com.fasterxml.jackson.annotation.JsonIgnore"),
            ("Ingredient", "ingredient", "@ManyToOne @JoinColumn(name=\"ingredient_id\")"),
            ("java.math.BigDecimal", "cantidad", "")
        ]
    }
}

def create_model(name, detail):
    content = f"package {base_pkg}.entity;\n\n"
    content += "import jakarta.persistence.*;\nimport lombok.*;\nimport jakarta.validation.constraints.*;\n\n"
    if name == "PurchaseOrder": content += "@Entity\n@Table(name=\"purchase_orders\")\n"
    elif name == "Category": content += "@Entity\n@Table(name=\"categories\")\n"
    elif name == "Product" or name == "Supplier" or name == "Ingredient" or name == "Recipe":
        content += f"@Entity\n@Table(name=\"{name.lower()}s\")\n"
    else:
        if name == "RecipeIngredient": content += f"@Entity\n@Table(name=\"recipe_ingredients\")\n"
        elif name == "PurchaseOrderItem": content += f"@Entity\n@Table(name=\"purchase_order_items\")\n"
        
    content += "@Data\n@NoArgsConstructor\n@AllArgsConstructor\n"
    content += f"public class {name} {{\n"
    for type_name, field_name, annons in detail["fields"]:
        if annons:
            content += f"    {annons}\n"
        content += f"    private {type_name} {field_name};\n"
    content += "}\n"
    
    with open(f"{base_dir}entity/{name}.java", "w") as f:
        f.write(content)

def create_repo(name):
    content = f"package {base_pkg}.repository;\n\n"
    content += f"import {base_pkg}.entity.{name};\n"
    content += "import org.springframework.data.jpa.repository.JpaRepository;\nimport org.springframework.stereotype.Repository;\n\n"
    content += "@Repository\n"
    content += f"public interface {name}Repository extends JpaRepository<{name}, Long> {{\n"
    if name == "Product":
         content += "    java.util.List<Product> findByCategoryId(Long categoryId);\n"
         content += "    java.util.List<Product> findBySupplierId(Long supplierId);\n"
    content += "}\n"
    with open(f"{base_dir}repository/{name}Repository.java", "w") as f:
        f.write(content)

def create_service(name):
    content = f"package {base_pkg}.service;\n\n"
    content += f"import {base_pkg}.entity.{name};\n"
    content += f"import {base_pkg}.repository.{name}Repository;\n"
    content += f"import {base_pkg}.exception.ResourceNotFoundException;\n"
    content += "import org.springframework.stereotype.Service;\n"
    content += "import lombok.RequiredArgsConstructor;\n"
    content += "import java.util.List;\n\n"
    content += "@Service\n@RequiredArgsConstructor\n"
    content += f"public class {name}Service {{\n"
    content += f"    private final {name}Repository repository;\n\n"
    
    content += f"    public List<{name}> findAll() {{ return repository.findAll(); }}\n"
    content += f"    public {name} findById(Long id) {{ return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException(\"{name} not found\")); }}\n"
    content += f"    public {name} save({name} entity) {{ return repository.save(entity); }}\n"
    
    content += f"    public {name} update(Long id, {name} entity) {{\n"
    content += f"        {name} existing = findById(id);\n"
    
    # Update logic (shallow copy for simplicity in MVP, but let's just do a naive setting or ID update)
    # Proper update logic needs DTOs. For now we will overwrite but set ID correctly.
    # Actually better approach: Spring Data JPA saves by id if present.
    content += f"        entity.setId(id);\n"
    if name == "Recipe" or name == "PurchaseOrder":
        content += f"        if(entity.get{ 'Ingredients' if name == 'Recipe' else 'Items'}() != null) {{\n"
        content += f"             entity.get{ 'Ingredients' if name == 'Recipe' else 'Items'}().forEach(item -> item.set{ 'Recipe' if name == 'Recipe' else 'Order' }(entity));\n"
        content += f"        }}\n"
    content += f"        return repository.save(entity);\n"
    content += f"    }}\n\n"
    
    content += f"    public void delete(Long id) {{\n"
    content += f"        if (!repository.existsById(id)) throw new ResourceNotFoundException(\"{name} not found\");\n"
    content += f"        repository.deleteById(id);\n"
    content += f"    }}\n"
    content += "}\n"
    with open(f"{base_dir}service/{name}Service.java", "w") as f:
        f.write(content)

def create_controller(name):
    path = "/" + ("categories" if name == "Category" else ("recipes" if name == "Recipe" else name.lower() + "s"))
    if name == "RecipeIngredient" or name == "PurchaseOrderItem": return
    
    content = f"package {base_pkg}.controller;\n\n"
    content += f"import {base_pkg}.entity.{name};\n"
    content += f"import {base_pkg}.service.{name}Service;\n"
    content += "import org.springframework.web.bind.annotation.*;\nimport org.springframework.http.ResponseEntity;\n"
    content += "import lombok.RequiredArgsConstructor;\nimport java.util.List;\nimport jakarta.validation.Valid;\n\n"
    content += f"@RestController\n@RequestMapping(\"/api{path}\")\n"
    content += f"@RequiredArgsConstructor\n"
    content += f"public class {name}Controller {{\n"
    content += f"    private final {name}Service service;\n\n"
    content += f"    @GetMapping\n    public List<{name}> getAll() {{ return service.findAll(); }}\n"
    content += f"    @GetMapping(\"/{{id}}\")\n    public {name} getById(@PathVariable Long id) {{ return service.findById(id); }}\n"
    content += f"    @PostMapping\n    public {name} create(@Valid @RequestBody {name} entity) {{\n"
    if name == "Recipe" or name == "PurchaseOrder":
        content += f"        if(entity.get{ 'Ingredients' if name == 'Recipe' else 'Items'}() != null) {{\n"
        content += f"             entity.get{ 'Ingredients' if name == 'Recipe' else 'Items'}().forEach(item -> item.set{ 'Recipe' if name == 'Recipe' else 'Order' }(entity));\n"
        content += f"        }}\n"
    content += f"        return service.save(entity); }}\n"
    content += f"    @PutMapping(\"/{{id}}\")\n    public {name} update(@PathVariable Long id, @Valid @RequestBody {name} entity) {{ return service.update(id, entity); }}\n"
    content += f"    @DeleteMapping(\"/{{id}}\")\n    public ResponseEntity<Void> delete(@PathVariable Long id) {{ service.delete(id); return ResponseEntity.noContent().build(); }}\n"
    content += "}\n"
    with open(f"{base_dir}controller/{name}Controller.java", "w") as f:
        f.write(content)

for e, d in entities.items():
    create_model(e, d)
    create_repo(e)
    create_service(e)
    create_controller(e)

print("Generated everything.")
