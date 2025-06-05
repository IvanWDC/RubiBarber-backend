package com.rubi.barber.repository;

import com.rubi.barber.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServicioRepository extends JpaRepository<Servicio, Long> {
    List<Servicio> findByPeluqueriaIdAndActivoTrue(Long peluqueriaId);
    List<Servicio> findByPeluqueriaId(Long peluqueriaId);
}
