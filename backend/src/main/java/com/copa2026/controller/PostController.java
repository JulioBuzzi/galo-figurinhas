package com.copa2026.controller;

import com.copa2026.dto.*;
import com.copa2026.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller do feed de posts.
 */
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    /**
     * GET /api/posts
     * Retorna o feed global, mais recentes primeiro.
     */
    @GetMapping
    public ResponseEntity<List<PostResponse>> getFeed() {
        return ResponseEntity.ok(postService.getFeed());
    }

    /**
     * GET /api/posts/mine
     * Retorna apenas os posts do usuário logado.
     */
    @GetMapping("/mine")
    public ResponseEntity<List<PostResponse>> getMyPosts(Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        return ResponseEntity.ok(postService.getUserPosts(userId));
    }

    /**
     * POST /api/posts
     * Cria um novo post no feed.
     */
    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @RequestBody CreatePostRequest request,
            Authentication auth
    ) {
        Long userId = (Long) auth.getCredentials();
        return ResponseEntity.ok(postService.createPost(userId, request));
    }

    /**
     * DELETE /api/posts/{id}
     * Remove um post (apenas o autor pode deletar).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        postService.deletePost(userId, id);
        return ResponseEntity.noContent().build();
    }
}
