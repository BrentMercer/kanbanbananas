package com.bjm.kanban.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ColumnDTO {
    private Long id;

    @NotBlank(message = "Title cannot be blank")
    @Size(max = 20, message = "Title must be less than 20 characters")
    private String title;
    private int orderIndex;

    public ColumnDTO() {}

    public ColumnDTO(String title, int orderIndex) {
        this.title = title;
        this.orderIndex = orderIndex;
    }

    public ColumnDTO(Long id, String title, int orderIndex) {
        this.id = id;
        this.title = title;
        this.orderIndex = orderIndex;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }
}

