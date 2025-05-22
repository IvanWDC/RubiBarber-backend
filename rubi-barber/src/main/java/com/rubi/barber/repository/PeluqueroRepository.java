package com.rubi.barber.repository;

import com.rubi.barber.model.Peluquero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PeluqueroRepository extends JpaRepository<Peluquero, Long> {

    Optional<Peluquero> findByUsuarioId(Long usuarioId);

    List<Peluquero> findByPeluqueriaId(Long peluqueriaId);

}
