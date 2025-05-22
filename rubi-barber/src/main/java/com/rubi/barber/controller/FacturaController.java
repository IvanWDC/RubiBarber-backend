package com.rubi.barber.controller;

import com.rubi.barber.model.Cita;
import com.rubi.barber.model.Factura;
import com.rubi.barber.model.Usuario;
import com.rubi.barber.repository.CitaRepository;
import com.rubi.barber.repository.FacturaRepository;
import com.rubi.barber.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/facturas")
@CrossOrigin(origins = "*")
public class FacturaController {

    @Autowired
    private FacturaRepository facturaRepository;

    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Obtener todas las facturas (solo admin)
    @GetMapping
    public List<Factura> getAll() {
        return facturaRepository.findAll();
    }

    // Obtener facturas del cliente autenticado
    @GetMapping("/mis-facturas")
    public ResponseEntity<?> getMisFacturas(@AuthenticationPrincipal User user) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(user.getUsername());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
        List<Factura> facturas = facturaRepository.findByCitaClienteId(usuarioOpt.get().getId());
        return ResponseEntity.ok(facturas);
    }

    // Crear factura asociada a una cita confirmada
    @PostMapping("/{citaId}")
    public ResponseEntity<?> createFactura(@PathVariable Long citaId, @RequestBody Factura facturaData) {
        Optional<Cita> citaOpt = citaRepository.findById(citaId);
        if (citaOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Cita no encontrada");
        }

        Cita cita = citaOpt.get();
        if (!cita.isConfirmada()) {
            return ResponseEntity.badRequest().body("No se puede facturar una cita no confirmada");
        }

        Factura factura = new Factura();
        factura.setCita(cita);
        factura.setFechaEmision(LocalDateTime.now());
        factura.setMetodoPago(facturaData.getMetodoPago());
        factura.setMontoTotal(facturaData.getMontoTotal());

        return ResponseEntity.ok(facturaRepository.save(factura));
    }
}
