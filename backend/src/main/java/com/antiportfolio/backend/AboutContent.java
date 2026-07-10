package com.antiportfolio.backend;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "about_content")
public class AboutContent extends BaseEntity {
    public String heading;

    @Column(columnDefinition = "TEXT")
    public String bio;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "about_highlights", joinColumns = @JoinColumn(name = "about_id"))
    @Column(name = "highlight")
    public List<String> highlights = new ArrayList<>();

    public String photoUrl;
    public String cvUrl;
    public Instant updatedAt;

    @PrePersist
    @PreUpdate
    void touched() {
        updatedAt = Instant.now();
    }
}
