package com.example.back.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.back.entity.Category;
import com.example.back.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/search")
    public ResponseEntity<?> searchCategories(@RequestParam String name) {
        List<Category> categories = categoryService.searchCategoriesByName(name);
        if (categories.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "content", List.of(),
                "message", "No se encontraron categorías que coincidan con el criterio de búsqueda."
            ));
        }
        return ResponseEntity.ok(Map.of(
            "content", categories,
            "message", "Categorías encontradas con éxito."
        ));
    }

    // Crear una nueva categoría
    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        try {
            Category createdCategory = categoryService.createCategory(category);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear la categoría");
        }
    }


    // Actualizar una categoría existente
    @PutMapping("/{idCategory}")
    public Category updateCategory(@PathVariable Long idCategory, @RequestBody Category category) {
        return categoryService.updateCategory(idCategory, category);
    }

    // Listar categorías activas con paginación
    @GetMapping
    public Page<Category> listActiveCategories(Pageable pageable) {
        return categoryService.listActiveCategories(pageable);
    }

    // Bloquear una categoría
    @PatchMapping("/{idCategory}/block")
    public void blockCategory(@PathVariable Long idCategory) {
        categoryService.blockCategory(idCategory);
    }


    // Obtener una categoría por ID
    @GetMapping("/{idCategory}")
    public Category getCategoryById(@PathVariable Long idCategory) {
        return categoryService.getCategoryById(idCategory);
    }

}

