package com.rubi.barber.repository;

import com.rubi.barber.model.Valoracion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ValoracionRepository extends JpaRepository<Valoracion, Long> {

    List<Valoracion> findByPeluqueroId(Long peluqueroId);
}
