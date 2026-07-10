package com.antiportfolio.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "skill_categories")
public class SkillCategory extends BaseEntity {
    public String name;
    public Integer orderIndex = 0;
}
