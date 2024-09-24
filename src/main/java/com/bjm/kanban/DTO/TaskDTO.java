package com.bjm.kanban.DTO;

public class TaskDTO {
    private Long id;
    private String title;
    private String details;
    private Long columnId;

    public TaskDTO() {}

    public TaskDTO(Long id, String title, String details, Long columnId) {
        this.id = id;
        this.title = title;
        this.details = details;
        this.columnId = columnId;
    }

    public TaskDTO(String title, String details, Long columnId) {
        this.title = title;
        this.details = details;
        this.columnId = columnId;
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
}


