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
@Table(name = "hero_content")
public class HeroContent extends BaseEntity {
    public String name;
    public Boolean availabilityBadge = true;
    public String availabilityText;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "hero_roles", joinColumns = @JoinColumn(name = "hero_id"))
    @Column(name = "role")
    public List<String> roles = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    public String bio;

    public String profileImageUrl;
    public String resumeUrl;
    public String primaryBtnText;
    public String primaryBtnLink;
    public String secondaryBtnText;
    public String secondaryBtnLink;
    public Instant updatedAt;

    @PrePersist
    @PreUpdate
    void touched() {
        updatedAt = Instant.now();
    }
}
