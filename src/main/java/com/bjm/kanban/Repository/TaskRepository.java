package com.bjm.kanban.Repository;

import com.bjm.kanban.Entities.Column;
import com.bjm.kanban.Entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Inheritance example
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByColumn(Column column);
    List<Task> findByColumnIdOrderByOrderIndex(Long columnId);

}


