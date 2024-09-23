package com.bjm.kanban.Entities;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "board")
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @ManyToOne
    private User user;
}
