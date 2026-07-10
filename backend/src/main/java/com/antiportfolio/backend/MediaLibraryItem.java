package com.antiportfolio.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "media_library")
public class MediaLibraryItem extends BaseEntity {
    public String fileUrl;
    public String fileName;
    public String fileType;
    public Instant uploadedAt;

    @PrePersist
    void uploaded() {
        if (uploadedAt == null) {
            uploadedAt = Instant.now();
        }
    }
}
