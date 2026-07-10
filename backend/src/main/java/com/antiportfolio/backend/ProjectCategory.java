package com.antiportfolio.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "project_categories")
public class ProjectCategory extends BaseEntity {
    public String name;
}
