package com.bjm.kanban.Controller;

import com.bjm.kanban.Entities.Board;
import com.bjm.kanban.Entities.User;
import com.bjm.kanban.Security.CustomUserDetails;
import com.bjm.kanban.Services.BoardService;
import com.bjm.kanban.Services.CustomUserDetailsService;
import com.bjm.kanban.Services.UserService;
import com.bjm.kanban.Security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private BoardService boardService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public User createOrUpdateUser(@RequestBody User user) {
        return userService.createOrUpdateUser(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AuthRequest authRequest) {
        String encodedPassword = passwordEncoder.encode(authRequest.getPassword());
        User newUser = new User();
        newUser.setEmail(authRequest.getEmail());
        newUser.setPassword(encodedPassword);

        User savedUser = userService.createOrUpdateUser(newUser);

//        userService.createDefaultUserBoard(savedUser);

        return ResponseEntity.ok("User registered successfully with a new default board and columns");
    }



    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtils.generateToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userService.getUserByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userDetails.getUsername()));

        Board userBoard = boardService.getBoardByUserId(user.getId());

        Long boardId = userBoard.getId();

        return ResponseEntity.ok(new AuthResponse(token, userBoard, boardId));
    }


}

