package com.rubi.barber.controller;

import com.rubi.barber.model.Cita;
import com.rubi.barber.model.Peluquero;
import com.rubi.barber.model.Usuario;
import com.rubi.barber.repository.CitaRepository;
import com.rubi.barber.repository.PeluqueroRepository;
import com.rubi.barber.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

    // Obtener todos los peluqueros
    @GetMapping("/todos")
    public List<Peluquero> getAllPeluqueros() {
        return peluqueroRepository.findAll();
    }

    // Crear nuevo peluquero
    @PostMapping("/crear")
    public Peluquero createPeluquero(@RequestBody Peluquero peluquero) {
        return peluqueroRepository.save(peluquero);
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
}
