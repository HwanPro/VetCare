package com.example.back.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.entity.Employee;
import com.example.back.service.EmployeeService;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    // Obtener empleado por ID
    @GetMapping("/{employeeId}")
    public ResponseEntity<?> getEmployeeById(@PathVariable("employeeId") Long employeeId) {
        Optional<Employee> employee = employeeService.getEmployee(employeeId);

        // Si el empleado está presente, retorna el objeto. Si no, retorna un error 404.
        return employee.isPresent()
            ? ResponseEntity.ok(employee.get())
            : ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("El empleado con el ID proporcionado no existe.");
    }

   // Crear empleado con usuario
   @PostMapping("/create")
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee) {
        try {
            // Validar datos del empleado
            if (employee.getDni() == null || employee.getDni().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("El DNI del empleado es obligatorio.");
            }
            if (employee.getUser() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("El usuario asociado al empleado es obligatorio.");
            }
            if (employee.getUser().getPassword() == null || employee.getUser().getPassword().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("La contraseña del usuario asociado es obligatoria.");
            }
            if (employee.getRol() == null || employee.getRol().getIdRol() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("El rol del empleado es obligatorio.");
            }

            // Crear el empleado
            Employee createdEmployee = employeeService.createEmployeeWithUser(employee);

            return ResponseEntity.status(HttpStatus.CREATED).body(createdEmployee);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el empleado: " + e.getMessage());
        }
    }

    // Actualizar empleado
    @PutMapping("/update/{employeeId}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long employeeId, @RequestBody Employee employee) {
        try {
            employee.setIdEmployee(employeeId);
            employeeService.updateEmployee(employee);
            return ResponseEntity.ok("Empleado actualizado exitosamente.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el empleado.");
        }
    }

    // Buscar empleados con filtros
    @GetMapping("/search")
    public ResponseEntity<?> searchEmployees(
            @RequestParam(required = false) String dni,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Character status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Employee> employees = employeeService.searchEmployees(dni, name, role, status, pageable);

        if (employees.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "content", employees.getContent(),
                    "message", "No se encontraron empleados con los criterios proporcionados."
            ));
        }

        return ResponseEntity.ok(Map.of(
                "content", employees.getContent(),
                "totalPages", employees.getTotalPages(),
                "message", "Empleados encontrados con éxito."
        ));
    }

    // Bloquear empleado
    @PutMapping("/{employeeId}/block")
    public ResponseEntity<?> blockEmployee(@PathVariable Long employeeId) {
        boolean isBlocked = employeeService.blockEmployee(employeeId);
        if (isBlocked) {
            return ResponseEntity.ok("Empleado bloqueado con éxito.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("El empleado con el ID proporcionado no existe o ya fue bloqueado.");
        }
    }

    // Eliminar empleado
    @DeleteMapping("/{employeeId}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long employeeId) {
        try {
            employeeService.delete(employeeId);
            return ResponseEntity.ok("Empleado eliminado con éxito.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar el empleado.");
        }
    }
    @GetMapping("/dni-exists")
    public ResponseEntity<Boolean> checkDniExists(@RequestParam String dni) {
        boolean exists = employeeService.dniExists(dni);
        return ResponseEntity.ok(exists);
    }
    //nuevo empleado
    @GetMapping("/cellphone-exists")
    public ResponseEntity<Boolean> checkCellphoneExists(@RequestParam String cellphone) {
        boolean exists = employeeService.cellphoneExists(cellphone);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/cmvp-exists")
    public ResponseEntity<Boolean> checkCmvpExists(@RequestParam String cmvp) {
        boolean exists = employeeService.cmvpExists(cmvp);
        return ResponseEntity.ok(exists);
    }

    //actualizar empleado

    // Validar si el número de celular está en uso por otro empleado
    @GetMapping("/update/cellphone-exists")
    public ResponseEntity<Boolean> checkCellphoneExists(@RequestParam String cellphone, @RequestParam Long id) {
        boolean exists = employeeService.cellphoneExistsExcludingId(cellphone, id);
        return ResponseEntity.ok(exists);
    }

    // Validar si el CMVP está en uso por otro empleado
    @GetMapping("/update/cmvp-exists")
    public ResponseEntity<Boolean> checkCmvpExists(@RequestParam String cmvp, @RequestParam Long id) {
        boolean exists = employeeService.cmvpExistsExcludingId(cmvp, id);
        return ResponseEntity.ok(exists);
    }




}
