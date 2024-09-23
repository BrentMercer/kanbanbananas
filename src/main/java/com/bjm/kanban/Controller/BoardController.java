package com.bjm.kanban.Controller;

import com.bjm.kanban.Entities.Board;
import com.bjm.kanban.Services.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/boards")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @GetMapping
    public List<Board> getAllBoards() {
        return boardService.getAllBoards();
    }

    @GetMapping("/{id}")
    public Board getBoardById(@PathVariable Long id) {
        return boardService.getBoardById(id);
    }

    @PostMapping
    public Board createOrUpdateBoard(@RequestBody Board board) {
        return boardService.createOrUpdateBoard(board);
    }

    @DeleteMapping("/{id}")
    public void deleteBoard(@PathVariable Long id) {
        boardService.deleteBoard(id);
    }
}