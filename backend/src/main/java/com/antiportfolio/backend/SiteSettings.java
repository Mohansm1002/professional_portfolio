package com.antiportfolio.backend;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "site_settings")
public class SiteSettings extends BaseEntity {
    public String siteTitle;
    public String metaDescription;
    public String ogImageUrl;
    public String faviconUrl;
    public String primaryColor;
    public String secondaryColor;
    public String bgColor;
    public String fontHeading;
    public String fontBody;

    @Column(columnDefinition = "TEXT")
    public String analyticsScript;

    public Instant updatedAt;

    @PrePersist
    @PreUpdate
    void touched() {
        updatedAt = Instant.now();
    }
}
