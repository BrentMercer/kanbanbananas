package com.bjm.kanban.Repository;

import com.bjm.kanban.Entities.Column;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColumnRepository extends JpaRepository<Column, Long> {
    // JpaRepository already provides methods like findAll, findById, save, delete, etc.
}
