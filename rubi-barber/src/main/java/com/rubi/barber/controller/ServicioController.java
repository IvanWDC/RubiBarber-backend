package com.rubi.barber.controller;

import com.rubi.barber.model.Servicio;
import com.rubi.barber.model.Usuario;
import com.rubi.barber.model.Rol;
import com.rubi.barber.model.Peluqueria;
import com.rubi.barber.repository.ServicioRepository;
import com.rubi.barber.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = "*")
public class ServicioController {

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<Servicio>> getServiciosDeMiPeluqueria(@AuthenticationPrincipal User user) {
        Usuario admin = usuarioRepository.findByEmail(user.getUsername())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (admin.getRol() != Rol.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Servicio> servicios = servicioRepository.findByPeluqueriaId(admin.getPeluqueria().getId());
        return ResponseEntity.ok(servicios);
    }

    @PostMapping
    public ResponseEntity<Servicio> createServicio(@RequestBody Servicio servicio, @AuthenticationPrincipal User user) {
        Usuario admin = usuarioRepository.findByEmail(user.getUsername())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (admin.getRol() != Rol.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        servicio.setPeluqueria(admin.getPeluqueria());
        Servicio saved = servicioRepository.save(servicio);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Servicio> updateServicio(@PathVariable Long id, @RequestBody Servicio servicioDetails, @AuthenticationPrincipal User user) {
        Usuario admin = usuarioRepository.findByEmail(user.getUsername())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (admin.getRol() != Rol.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return servicioRepository.findById(id)
            .map(servicio -> {
                // Verificar si el servicio pertenece a la misma peluquería que el admin
                if (!servicio.getPeluqueria().getId().equals(admin.getPeluqueria().getId())) {
                    // Si no pertenece, devolvemos null o lanzamos una excepción para que el orElseGet lo maneje como no encontrado,
                    // o manejamos el ResponseEntity FORBIDDEN fuera del Optional. Esta última es más clara.
                    return null; // Indicamos que no se debe proceder con la actualización y debe ser tratado como no encontrado/prohibido.
                }

                servicio.setNombre(servicioDetails.getNombre());
                servicio.setDescripcion(servicioDetails.getDescripcion());
                servicio.setPrecio(servicioDetails.getPrecio());
                servicio.setDuracion(servicioDetails.getDuracion());
                Servicio updatedServicio = servicioRepository.save(servicio);
                return updatedServicio; // map debe devolver el objeto Servicio, no un ResponseEntity
            })
            .map(ResponseEntity::ok) // Si el map devolvió un Servicio (no null), lo envolvemos en ResponseEntity.ok()
            .orElseGet(() -> ResponseEntity.notFound().build()); // Si findById no encontró o map devolvió null, devolvemos notFound.
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteServicio(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Usuario admin = usuarioRepository.findByEmail(user.getUsername())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (admin.getRol() != Rol.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Corregir manejo del Optional y ResponseEntities con if/else
        Servicio servicio = servicioRepository.findById(id).orElse(null);

        if (servicio == null) {
            // Servicio no encontrado
            return ResponseEntity.notFound().build();
        }

        // Verificar si el servicio pertenece a la misma peluquería que el admin
        if (!servicio.getPeluqueria().getId().equals(admin.getPeluqueria().getId())) {
            // No tiene permisos para eliminar este servicio
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Si todo está correcto, eliminar el servicio
        servicioRepository.delete(servicio);

        // Devolver respuesta de éxito sin contenido
        return ResponseEntity.noContent().build();
    }
}
