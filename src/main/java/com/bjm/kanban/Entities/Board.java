package com.bjm.kanban.Entities;

import jakarta.persistence.*;

@Entity
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;

//    private String[] columns;

    @ManyToOne
    private User user;
}
