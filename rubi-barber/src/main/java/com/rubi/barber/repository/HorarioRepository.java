package com.rubi.barber.repository;

import com.rubi.barber.model.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, Long> {
    Optional<Horario> findByPeluqueroId(Long peluqueroId);
}
