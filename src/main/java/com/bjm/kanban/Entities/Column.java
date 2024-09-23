package com.bjm.kanban.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Entity
@Table(name = "board_columns")
public class Column {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private String title;

    @Setter
    private int orderIndex = 0;

    @ManyToOne
    @JoinColumn(name = "board_id", nullable = false)
    @Setter
    private Board board;

    @OneToMany(mappedBy = "column", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks;
}
