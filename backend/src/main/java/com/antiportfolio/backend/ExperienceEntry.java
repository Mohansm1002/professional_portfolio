package com.antiportfolio.backend;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "experience")
public class ExperienceEntry extends BaseEntity {
    public String role;
    public String company;
    public String companyLogoUrl;
    public String startDate;
    public String endDate;
    public Boolean isPresent = false;

    @Column(columnDefinition = "TEXT")
    public String description;

    public Integer orderIndex = 0;
}
