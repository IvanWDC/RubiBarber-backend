package com.rubi.barber.controller;

import com.rubi.barber.model.Cita;
import com.rubi.barber.model.Peluquero;
import com.rubi.barber.model.Servicio;
import com.rubi.barber.model.Usuario;
import com.rubi.barber.repository.CitaRepository;
import com.rubi.barber.repository.PeluqueroRepository;
import com.rubi.barber.repository.ServicioRepository;
import com.rubi.barber.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "*")
public class CitaController {

    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private PeluqueroRepository peluqueroRepository;

    // Obtener todas las citas
    @GetMapping
    public List<Cita> getAll() {
        return citaRepository.findAll();
    }

    @PostMapping("/{usuarioId}/{servicioId}/{peluqueroId}")
    public ResponseEntity<?> create(
            @PathVariable Long usuarioId,
            @PathVariable Long servicioId,
            @PathVariable Long peluqueroId,
            @RequestBody Cita cita
    ) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);
        Servicio servicio = servicioRepository.findById(servicioId).orElse(null);
        Peluquero peluquero = peluqueroRepository.findById(peluqueroId).orElse(null);

        if (usuario == null || servicio == null || peluquero == null) {
            return ResponseEntity.badRequest().body("Usuario, servicio o peluquero no encontrado.");
        }

        LocalDateTime inicio = cita.getFechaHora();
        LocalDateTime fin = inicio.plusMinutes(servicio.getDuracion());

        boolean haySolapamiento = citaRepository.existeSolapamiento(peluqueroId, inicio, fin);
        if (haySolapamiento) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El peluquero ya tiene una cita en ese horario.");
        }

        cita.setCliente(usuario);      // Se asigna aquí, no viene del JSON
        cita.setServicio(servicio);    // Lo mismo
        cita.setPeluquero(peluquero);  // Y este también
        cita.setConfirmada(true); // Confirmar la cita automáticamente

        return ResponseEntity.ok(citaRepository.save(cita));
    }


}
