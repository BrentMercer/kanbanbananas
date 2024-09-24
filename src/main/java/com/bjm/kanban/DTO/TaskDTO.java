package com.bjm.kanban.DTO;

public class TaskDTO {
    private Long id;
    private String title;
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

    // Constructor without id
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


