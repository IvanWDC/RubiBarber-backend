package com.rubi.barber.controller;

import com.rubi.barber.model.Cita;
import com.rubi.barber.model.Usuario;
import com.rubi.barber.model.Peluquero;
import com.rubi.barber.model.Valoracion;
import com.rubi.barber.repository.CitaRepository;
import com.rubi.barber.repository.UsuarioRepository;
import com.rubi.barber.repository.PeluqueroRepository;
import com.rubi.barber.repository.ValoracionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/valoraciones")
@CrossOrigin(origins = "*")
public class ValoracionController {

    @Autowired
    private ValoracionRepository valoracionRepository;

    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PeluqueroRepository peluqueroRepository;

    // Obtener todas las valoraciones (admin)
    @GetMapping
    public List<Valoracion> getAll() {
        return valoracionRepository.findAll();
    }

    // Crear valoración (cliente tras cita confirmada)
    @PostMapping("/{citaId}")
    public ResponseEntity<?> create(@AuthenticationPrincipal User user, @PathVariable Long citaId, @RequestBody Valoracion valoracion) {
        Optional<Cita> citaOpt = citaRepository.findById(citaId);
        if (citaOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Cita no encontrada");
        }

        Cita cita = citaOpt.get();

        // Verificar que el cliente sea el que hace la valoración
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(user.getUsername());
        if (usuarioOpt.isEmpty() || !cita.getCliente().getId().equals(usuarioOpt.get().getId())) {
            return ResponseEntity.status(403).body("No tienes permiso para valorar esta cita");
        }

        // Verificar que la cita esté confirmada
        if (!cita.isConfirmada()) {
            return ResponseEntity.badRequest().body("Solo puedes valorar citas confirmadas");
        }

        valoracion.setCliente(usuarioOpt.get());
        valoracion.setPeluquero(cita.getPeluquero());
        valoracion.setCita(cita);

        return ResponseEntity.ok(valoracionRepository.save(valoracion));
    }

    // Obtener valoraciones de un peluquero concreto
    @GetMapping("/peluquero/{peluqueroId}")
    public ResponseEntity<?> getValoracionesByPeluquero(@PathVariable Long peluqueroId) {
        Optional<Peluquero> peluqueroOpt = peluqueroRepository.findById(peluqueroId);
        if (peluqueroOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Peluquero no encontrado");
        }
        List<Valoracion> valoraciones = valoracionRepository.findByPeluqueroId(peluqueroId);
        return ResponseEntity.ok(valoraciones);
    }
    
 // Consultar valoraciones recibidas por el peluquero autenticado
    @GetMapping("/mis-valoraciones")
    public ResponseEntity<?> verMisValoraciones(@AuthenticationPrincipal User user) {
        Optional<Usuario> peluqueroUsuarioOpt = usuarioRepository.findByEmail(user.getUsername());
        if (peluqueroUsuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Peluquero no encontrado");
        }
        Optional<Peluquero> peluqueroOpt = peluqueroRepository.findByUsuarioId(peluqueroUsuarioOpt.get().getId());
        if (peluqueroOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Peluquero no encontrado");
        }

        List<Valoracion> valoraciones = valoracionRepository.findByPeluqueroId(peluqueroOpt.get().getId());
        return ResponseEntity.ok(valoraciones);
    }

}
