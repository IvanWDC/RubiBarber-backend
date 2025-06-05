package com.rubi.barber.controller;

import com.rubi.barber.model.Cita;
import com.rubi.barber.model.Factura;
import com.rubi.barber.model.Peluquero;
import com.rubi.barber.model.Servicio;
import com.rubi.barber.model.Usuario;
import com.rubi.barber.model.Valoracion;
import com.rubi.barber.repository.CitaRepository;
import com.rubi.barber.repository.FacturaRepository;
import com.rubi.barber.repository.PeluqueroRepository;
import com.rubi.barber.repository.ServicioRepository;
import com.rubi.barber.repository.UsuarioRepository;
import com.rubi.barber.repository.ValoracionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PeluqueroRepository peluqueroRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private FacturaRepository facturaRepository;

    @Autowired
    private ValoracionRepository valoracionRepository;

    // --- Gestión de usuarios ---

    @GetMapping("/usuarios")
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    @PostMapping("/usuario/{id}/activar")
    public ResponseEntity<?> activarUsuario(@PathVariable Long id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
        Usuario usuario = usuarioOpt.get();
        usuario.setActivo(!usuario.isActivo());
        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Estado del usuario actualizado correctamente");
    }

    // --- Gestión de peluqueros ---

    @GetMapping("/peluqueros")
    public List<Peluquero> getAllPeluqueros() {
        return peluqueroRepository.findAll();
    }

    @PostMapping("/peluquero")
    public Peluquero createPeluquero(@RequestBody Peluquero peluquero) {
        return peluqueroRepository.save(peluquero);
    }

    @PostMapping("/peluquero/{id}/activar")
    public ResponseEntity<?> activarPeluquero(@PathVariable Long id) {
        Optional<Peluquero> peluqueroOpt = peluqueroRepository.findById(id);
        if (peluqueroOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Peluquero no encontrado");
        }
        Peluquero peluquero = peluqueroOpt.get();
        peluquero.setActivo(!peluquero.isActivo());
        peluqueroRepository.save(peluquero);
        return ResponseEntity.ok("Estado del peluquero actualizado correctamente");
    }

    // --- Estadísticas y citas ---

    @GetMapping("/citas/fecha")
    public ResponseEntity<?> getCitasPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        LocalDateTime inicio = fecha.atStartOfDay();
        LocalDateTime fin = fecha.atTime(LocalTime.MAX);
        List<Cita> citas = citaRepository.findByFechaHoraBetween(inicio, fin);
        return ResponseEntity.ok(citas);
    }

    @GetMapping("/citas/peluquero/{peluqueroId}")
    public ResponseEntity<?> getCitasPorPeluquero(@PathVariable Long peluqueroId) {
        List<Cita> citas = citaRepository.findByPeluqueroId(peluqueroId);
        return ResponseEntity.ok(citas);
    }

    // --- Facturación ---

    @GetMapping("/ingresos/total")
    public Double getIngresosTotales() {
        return facturaRepository.sumMontoTotal();
    }

    @GetMapping("/ingresos/por-fecha")
    public Double getIngresosPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return facturaRepository.sumMontoTotalByFechaEmisionBetween(inicio.atStartOfDay(), fin.atTime(LocalTime.MAX));
    }

    // --- Valoraciones ---

    @GetMapping("/valoraciones")
    public List<Valoracion> getAllValoraciones() {
        return valoracionRepository.findAll();
    }

    @GetMapping("/valoraciones/peluquero/{peluqueroId}")
    public List<Valoracion> getValoracionesPorPeluquero(@PathVariable Long peluqueroId) {
        return valoracionRepository.findByPeluqueroId(peluqueroId);
    }
}
