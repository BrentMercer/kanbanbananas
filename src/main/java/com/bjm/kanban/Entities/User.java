package com.bjm.kanban.Entities;

import jakarta.persistence.*;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    private String password;
}
