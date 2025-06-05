package com.rubi.barber.controller;

import com.rubi.barber.model.Cita;
import com.rubi.barber.model.Peluquero;
import com.rubi.barber.model.Usuario;
import com.rubi.barber.model.Rol;
import com.rubi.barber.dto.PeluqueroDTO;
import com.rubi.barber.repository.CitaRepository;
import com.rubi.barber.repository.PeluqueroRepository;
import com.rubi.barber.repository.UsuarioRepository;
import com.rubi.barber.service.PasswordResetService;
import com.rubi.barber.service.PeluqueroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/peluquero")
@CrossOrigin(origins = "*")
public class PeluqueroController {

    @Autowired
    private PeluqueroRepository peluqueroRepository;

    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordResetService passwordResetService;

    @Autowired
    private PeluqueroService peluqueroService;

    // Obtener peluqueros de mi peluquería (para administradores)
    @GetMapping("")
    public ResponseEntity<?> getPeluquerosDeMiPeluqueria(@AuthenticationPrincipal User user) {
        try {
            // 1. Obtener el usuario administrador
            Usuario admin = usuarioRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // 2. Verificar que el usuario es administrador
            if (admin.getRol() != Rol.ADMIN) {
                return ResponseEntity.status(403).body("Solo los administradores pueden acceder a este recurso");
            }

            // 3. Verificar que tiene una peluquería asociada
            if (admin.getPeluqueria() == null) {
                return ResponseEntity.status(400).body("El administrador no tiene una peluquería asociada");
            }

            // 4. Obtener los peluqueros de la peluquería y convertirlos a DTOs
            List<Peluquero> peluqueros = peluqueroRepository.findByPeluqueriaId(admin.getPeluqueria().getId());
            List<PeluqueroDTO> peluquerosDTO = peluqueros.stream()
                .map(PeluqueroDTO::new)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(peluquerosDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body("Error al obtener los peluqueros: " + e.getMessage());
        }
    }

    // Endpoint para obtener todos los peluqueros (mantenido por compatibilidad)
    @GetMapping("/todos")
    public List<Peluquero> getAllPeluqueros() {
        return peluqueroRepository.findAll();
    }

    // Crear nuevo peluquero
    @PostMapping("/crear")
    public ResponseEntity<?> createPeluquero(@RequestBody Peluquero peluquero, @AuthenticationPrincipal User adminUser) {
        try {
            // 1. Obtener el admin que está creando el peluquero
            Usuario admin = usuarioRepository.findByEmail(adminUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Admin no encontrado"));

            // 2. Verificar que el admin tiene una peluquería asociada
            if (admin.getPeluqueria() == null) {
                return ResponseEntity.badRequest().body("El administrador no tiene una peluquería asociada");
            }

            // 3. Crear y guardar primero el usuario
            if (peluquero.getUsuario() == null) {
                return ResponseEntity.badRequest().body("Se requiere información del usuario");
            }

            Usuario nuevoUsuario = peluquero.getUsuario();
            nuevoUsuario.setRol(Rol.PELUQUERO);
            nuevoUsuario = usuarioRepository.save(nuevoUsuario);

            // 4. Crear el peluquero con el usuario ya persistido
            Peluquero nuevoPeluquero = new Peluquero();
            nuevoPeluquero.setUsuario(nuevoUsuario);
            nuevoPeluquero.setPeluqueria(admin.getPeluqueria());
            nuevoPeluquero.setEspecialidad(peluquero.getEspecialidad());
            nuevoPeluquero.setActivo(true);
            nuevoPeluquero.setNombre(nuevoUsuario.getNombre());

            // 5. Guardar el peluquero
            Peluquero peluqueroGuardado = peluqueroRepository.save(nuevoPeluquero);

            // 6. Enviar email de recuperación de contraseña
            passwordResetService.solicitarRecuperacion(nuevoUsuario.getEmail());

            // 7. Convertir a DTO antes de devolver la respuesta
            return ResponseEntity.ok(new PeluqueroDTO(peluqueroGuardado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear el peluquero: " + e.getMessage());
        }
    }

    // Nuevo endpoint: Obtener perfil del peluquero autenticado
    @GetMapping("/perfil")
    public ResponseEntity<?> getPerfilPeluquero(@AuthenticationPrincipal User user) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(user.getUsername());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        Optional<Peluquero> peluqueroOpt = peluqueroRepository.findByUsuarioId(usuarioOpt.get().getId());
        if (peluqueroOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Peluquero no asociado a este usuario");
        }

        return ResponseEntity.ok(peluqueroOpt.get());
    }

    // Ver citas asignadas a este peluquero
    @GetMapping("/mis-citas")
    public ResponseEntity<?> verMisCitas(@AuthenticationPrincipal User user) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(user.getUsername());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        Optional<Peluquero> peluqueroOpt = peluqueroRepository.findByUsuarioId(usuarioOpt.get().getId());
        if (peluqueroOpt.isEmpty()) {
             return ResponseEntity.status(404).body("Peluquero no asociado a este usuario");
        }

        List<Cita> citas = citaRepository.findByPeluqueroId(peluqueroOpt.get().getId());
        
        return ResponseEntity.ok(citas);
    }

    // Confirmar asistencia a una cita
    @PostMapping("/confirmar/{citaId}")
    public ResponseEntity<?> confirmarCita(@AuthenticationPrincipal User user, @PathVariable Long citaId) {
        Optional<Cita> citaOpt = citaRepository.findById(citaId);
        if (citaOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Cita no encontrada");
        }

        Cita cita = citaOpt.get();
        if (!cita.getPeluquero().getUsuario().getEmail().equals(user.getUsername())) {
            return ResponseEntity.status(403).body("No tienes permiso para confirmar esta cita");
        }

        cita.setConfirmada(true);
        citaRepository.save(cita);

        return ResponseEntity.ok("Cita confirmada correctamente");
    }

    // Rechazar una cita
    @PostMapping("/rechazar/{citaId}")
    public ResponseEntity<?> rechazarCita(@AuthenticationPrincipal User user, @PathVariable Long citaId) {
        Optional<Cita> citaOpt = citaRepository.findById(citaId);
        if (citaOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Cita no encontrada");
        }

        Cita cita = citaOpt.get();
        if (!cita.getPeluquero().getUsuario().getEmail().equals(user.getUsername())) {
            return ResponseEntity.status(403).body("No tienes permiso para rechazar esta cita");
        }

        citaRepository.deleteById(citaId);
        return ResponseEntity.ok("Cita rechazada y eliminada correctamente");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarPeluquero(@PathVariable Long id) {
        peluqueroService.eliminarPeluqueroYUsuario(id);
        return ResponseEntity.ok().build();
    }
}
