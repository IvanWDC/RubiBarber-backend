package com.rubi.barber.dto;

public class DiaHorarioDto {
    private String start;
    private String end;
    private boolean available;

    // Constructor
    public DiaHorarioDto(String start, String end, boolean available) {
        this.start = start;
        this.end = end;
        this.available = available;
    }

    // Getters y Setters
    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getEnd() {
        return end;
    }

    public void setEnd(String end) {
        this.end = end;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
} 