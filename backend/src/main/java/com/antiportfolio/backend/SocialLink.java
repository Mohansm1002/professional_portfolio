package com.antiportfolio.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "social_links")
public class SocialLink extends BaseEntity {
    public String platform;
    public String url;
    public String icon;
    public Integer orderIndex = 0;
}
