package com.rubi.barber.controller;

import com.rubi.barber.model.Servicio;
import com.rubi.barber.repository.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = "*")
public class ServicioController {

    @Autowired
    private ServicioRepository servicioRepository;

    @GetMapping
    public List<Servicio> getAllServicios() {
        return servicioRepository.findAll();
    }

    @PostMapping
    public Servicio createServicio(@RequestBody Servicio servicio) {
        return servicioRepository.save(servicio);
    }
}
