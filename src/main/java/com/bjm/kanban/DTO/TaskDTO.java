package com.bjm.kanban.DTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TaskDTO {
    private Long id;

    @NotBlank(message = "Title cannot be blank")
    @Size(max = 30, message = "Title must be less than 30 characters")
    private String title;

    @Size(max = 1000, message = "Details must be less than 1000 characters")
    private String details;
    private Long columnId;
    private int orderIndex;

    public TaskDTO() {}

    public TaskDTO(Long id, String title, String details, Long columnId, int orderIndex) {
        this.id = id;
        this.title = title;
        this.details = details;
        this.columnId = columnId;
        this.orderIndex = orderIndex;
    }

    public TaskDTO(String title, String details, Long columnId, int orderIndex) {
        this.title = title;
        this.details = details;
        this.columnId = columnId;
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

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Long getColumnId() {
        return columnId;
    }

    public void setColumnId(Long columnId) {
        this.columnId = columnId;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }
}


