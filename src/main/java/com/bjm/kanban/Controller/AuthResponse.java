package com.bjm.kanban.Controller;

import com.bjm.kanban.Entities.Board;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {
    private String jwt;
    private Board board;
    private Long boardId;

    public AuthResponse(String jwt, Board board, Long boardId) {
        this.jwt = jwt;
        this.board = board;
        this.boardId = boardId;
    }

}
