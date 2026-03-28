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

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository    postRepository;
    private final UserRepository    userRepository;
    private final StickerRepository stickerRepository;
    private final StickerService    stickerService;

    @Transactional
    public PostResponse createPost(Long userId, CreatePostRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Post post = new Post();
        post.setUser(user);
        post.setText(request.getText());
        post.setWantedStickerIds(
            request.getWantedStickerIds() != null ? request.getWantedStickerIds() : new ArrayList<>());
        post.setOfferedStickerIds(
            request.getOfferedStickerIds() != null ? request.getOfferedStickerIds() : new ArrayList<>());

        post = postRepository.save(post);
        return toPostResponse(post);
    }

    public List<PostResponse> getFeed() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toPostResponse)
                .collect(Collectors.toList());
    }

    public List<PostResponse> getUserPosts(Long userId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toPostResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deletePost(Long userId, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post não encontrado"));
        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Sem permissão para deletar este post");
        }
        postRepository.delete(post);
    }

    private PostResponse toPostResponse(Post post) {
        PostResponse r = new PostResponse();
        r.setId(post.getId());
        r.setUserId(post.getUser().getId());
        r.setUserName(post.getUser().getName());
        r.setText(post.getText());
        r.setCreatedAt(post.getCreatedAt());

        List<StickerResponse> wanted = post.getWantedStickerIds().stream()
                .flatMap(id -> stickerRepository.findById(id).stream())
                .map(stickerService::toStickerResponse)
                .collect(Collectors.toList());

        List<StickerResponse> offered = post.getOfferedStickerIds().stream()
                .flatMap(id -> stickerRepository.findById(id).stream())
                .map(stickerService::toStickerResponse)
                .collect(Collectors.toList());

        r.setWantedStickers(wanted);
        r.setOfferedStickers(offered);
        return r;
    }
}
