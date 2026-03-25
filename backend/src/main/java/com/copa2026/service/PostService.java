package com.copa2026.service;

import com.copa2026.dto.*;
import com.copa2026.model.*;
import com.copa2026.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Serviço para criação e listagem de posts no feed global.
 */
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final StickerRepository stickerRepository;
    private final StickerService stickerService;

    /**
     * Cria um novo post no feed.
     */
    @Transactional
    public PostResponse createPost(Long userId, CreatePostRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Post post = Post.builder()
                .user(user)
                .text(request.getText())
                .wantedStickerIds(
                    request.getWantedStickerIds() != null ? request.getWantedStickerIds() : new ArrayList<>()
                )
                .offeredStickerIds(
                    request.getOfferedStickerIds() != null ? request.getOfferedStickerIds() : new ArrayList<>()
                )
                .build();

        post = postRepository.save(post);
        return toPostResponse(post);
    }

    /**
     * Retorna o feed global com todos os posts, do mais recente ao mais antigo.
     */
    public List<PostResponse> getFeed() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toPostResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retorna os posts de um usuário específico.
     */
    public List<PostResponse> getUserPosts(Long userId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toPostResponse)
                .collect(Collectors.toList());
    }

    /**
     * Deleta um post (apenas o próprio usuário pode deletar).
     */
    @Transactional
    public void deletePost(Long userId, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post não encontrado"));

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Você não tem permissão para deletar este post");
        }

        postRepository.delete(post);
    }

    /** Converte entidade Post para PostResponse */
    private PostResponse toPostResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setUserId(post.getUser().getId());
        response.setUserName(post.getUser().getName());
        response.setText(post.getText());
        response.setCreatedAt(post.getCreatedAt());

        // Resolve IDs de figurinhas para objetos completos
        List<StickerResponse> wanted = post.getWantedStickerIds().stream()
                .flatMap(id -> stickerRepository.findById(id).stream())
                .map(stickerService::toStickerResponse)
                .collect(Collectors.toList());

        List<StickerResponse> offered = post.getOfferedStickerIds().stream()
                .flatMap(id -> stickerRepository.findById(id).stream())
                .map(stickerService::toStickerResponse)
                .collect(Collectors.toList());

        response.setWantedStickers(wanted);
        response.setOfferedStickers(offered);
        return response;
    }
}
