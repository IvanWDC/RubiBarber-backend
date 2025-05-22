package com.rubi.barber.controller;

import com.rubi.barber.model.Cita;
import com.rubi.barber.model.Servicio;
import com.rubi.barber.model.Peluquero;
import com.rubi.barber.model.Usuario;
import com.rubi.barber.repository.CitaRepository;
import com.rubi.barber.repository.ServicioRepository;
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
@RequestMapping("/api/cliente")
@CrossOrigin(origins = "*")
public class ClienteController {

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private PeluqueroRepository peluqueroRepository;

    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Ver servicios disponibles
    @GetMapping("/servicios")
    public List<Servicio> obtenerServiciosDisponibles() {
        return servicioRepository.findAll();
    }

    // Ver peluqueros disponibles
    @GetMapping("/peluqueros")
    public List<Peluquero> obtenerPeluquerosDisponibles() {
        return peluqueroRepository.findAll();
    }

    // Reservar una cita
    @PostMapping("/reservar")
    public ResponseEntity<?> reservarCita(@AuthenticationPrincipal User user, @RequestBody Cita cita) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(user.getUsername());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
        cita.setCliente(usuarioOpt.get()); // ⬅️ USAR cliente, no usuario
        citaRepository.save(cita);
        return ResponseEntity.ok("Cita reservada correctamente");
    }

    // Ver citas del propio usuario
    @GetMapping("/mis-citas")
    public ResponseEntity<?> verMisCitas(@AuthenticationPrincipal User user) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(user.getUsername());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
        List<Cita> citas = citaRepository.findByClienteId(usuarioOpt.get().getId()); // ⬅️ USAR clienteId
        return ResponseEntity.ok(citas);
    }

    // Cancelar cita propia
    @DeleteMapping("/cancelar/{id}")
    public ResponseEntity<?> cancelarCita(@AuthenticationPrincipal User user, @PathVariable Long id) {
        Optional<Cita> citaOpt = citaRepository.findById(id);
        if (citaOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Cita no encontrada");
        }

        Cita cita = citaOpt.get();
        if (!cita.getCliente().getEmail().equals(user.getUsername())) { // ⬅️ USAR cliente
            return ResponseEntity.status(403).body("No tienes permiso para cancelar esta cita");
        }

        citaRepository.deleteById(id);
        return ResponseEntity.ok("Cita cancelada correctamente");
    }
}
