package com.bjm.kanban.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Table(name = "task")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter
    private Long id;

    @Setter
    private String title;

    @Setter
    private String details;

    @Setter
    private int orderIndex;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "column_id", nullable = false)
    @Setter
    @JsonBackReference
    private Column column;

    public Task(){}

    public Task(String title, String details, int orderIndex, Column column) {
        this.title = title;
        this.details = details;
        this.orderIndex = orderIndex;
        this.column = column;
    }
}
