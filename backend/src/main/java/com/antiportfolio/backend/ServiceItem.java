package com.antiportfolio.backend;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "services")
public class ServiceItem extends BaseEntity {
    public String icon;
    public String title;

    @Column(columnDefinition = "TEXT")
    public String description;

    public Integer orderIndex = 0;
    public Boolean isVisible = true;
}
