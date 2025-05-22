package com.rubi.barber.repository;

import com.rubi.barber.model.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface FacturaRepository extends JpaRepository<Factura, Long> {

    List<Factura> findByCitaClienteId(Long clienteId);

    @Query("SELECT COALESCE(SUM(f.montoTotal), 0) FROM Factura f")
    Double sumMontoTotal();

    @Query("SELECT COALESCE(SUM(f.montoTotal), 0) FROM Factura f WHERE f.fechaEmision BETWEEN :inicio AND :fin")
    Double sumMontoTotalByFechaEmisionBetween(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);
}
