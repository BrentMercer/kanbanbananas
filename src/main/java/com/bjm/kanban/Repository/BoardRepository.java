package com.bjm.kanban.Repository;

import com.bjm.kanban.Entities.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    @Query("SELECT b FROM Board b LEFT JOIN FETCH b.columns c LEFT JOIN FETCH c.tasks WHERE b.id = :id")
    Optional<Board> findByIdWithColumnsAndTasks(@Param("id") Long id);

    Optional<Board> findByUserId(Long userId);
}
