package com.antiportfolio.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "skills")
public class Skill extends BaseEntity {
    public String name;
    public String iconUrl;

    @ManyToOne
    public SkillCategory category;

    public Integer proficiency = 0;
    public Integer orderIndex = 0;
}
