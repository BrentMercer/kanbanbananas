package com.bjm.kanban.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Table(name = "task")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private String title;

    @Setter
    private String details;

    @Setter
    private int orderIndex = 0;

    @ManyToOne
    @JoinColumn(name = "column_id", nullable = false)
    private Column column;

}
