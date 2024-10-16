package com.bjm.kanban.Entities;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table(name = "board_columns")
@NoArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
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
    @JsonIgnoreProperties("columns")
    private Board board;

    @OneToMany(mappedBy = "column", cascade = CascadeType.ALL, orphanRemoval = true)
    @Setter
    @JsonManagedReference
    private List<Task> tasks = new ArrayList<>();


    public Column(String title, int orderIndex, Board board) {
        this.title = title;
        this.orderIndex = orderIndex;
        this.board = board;
    }
}
