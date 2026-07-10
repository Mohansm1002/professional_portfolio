package com.antiportfolio.backend;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/admin/media")
public class MediaController {
    private final MediaLibraryItemRepository media;
    private final Path uploadRoot;

    public MediaController(MediaLibraryItemRepository media, @Value("${app.upload-dir}") String uploadDir) {
        this.media = media;
        this.uploadRoot = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    @GetMapping
    public List<MediaLibraryItem> all() {
        return media.findAll(Sort.by("uploadedAt").descending());
    }

    @PostMapping("/upload")
    public MediaLibraryItem upload(@RequestParam("file") MultipartFile file) throws IOException {
        Files.createDirectories(uploadRoot);

        String originalName = StringUtils.cleanPath(Objects.requireNonNullElse(file.getOriginalFilename(), "upload.bin"));
        String safeName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String storedName = UUID.randomUUID() + "-" + safeName;
        Path destination = uploadRoot.resolve(storedName).normalize();

        if (!destination.startsWith(uploadRoot)) {
            throw new IllegalArgumentException("Invalid upload destination");
        }

        file.transferTo(destination);

        MediaLibraryItem item = new MediaLibraryItem();
        item.fileName = originalName;
        item.fileType = file.getContentType();
        item.fileUrl = "/uploads/" + storedName;
        return media.save(item);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) throws IOException {
        MediaLibraryItem item = media.findById(id).orElseThrow();
        if (item.fileUrl != null && item.fileUrl.startsWith("/uploads/")) {
            Path file = uploadRoot.resolve(item.fileUrl.substring("/uploads/".length())).normalize();
            if (file.startsWith(uploadRoot)) {
                Files.deleteIfExists(file);
            }
        }
        media.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
