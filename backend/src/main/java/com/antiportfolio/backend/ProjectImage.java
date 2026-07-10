package com.antiportfolio.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "project_images")
public class ProjectImage extends BaseEntity {
    public String imageUrl;
    public Integer orderIndex = 0;
}
