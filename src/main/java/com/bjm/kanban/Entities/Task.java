package com.bjm.kanban.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private String name;

    @Getter
    @Setter
    private String status;

    @Getter
    @Setter
    private String description;

    @ManyToOne
    private Board board; // A task belongs to one board
}
