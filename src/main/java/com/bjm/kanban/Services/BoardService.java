package com.bjm.kanban.Services;

import com.bjm.kanban.Entities.Board;
import com.bjm.kanban.Repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BoardService {

    private final BoardRepository boardRepository;

    @Autowired
    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }

    public Board getBoardById(Long id) {
        return boardRepository.findById(id).orElse(null);
    }

    public Board createOrUpdateBoard(Board board) {
        return boardRepository.save(board);
    }

    public void deleteBoard(Long id) {
        boardRepository.deleteById(id);
    }
}
