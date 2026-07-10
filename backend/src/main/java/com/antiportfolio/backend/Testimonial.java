package com.antiportfolio.backend;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "testimonials")
public class Testimonial extends BaseEntity {
    public String clientName;
    public String designation;
    public String company;
    public String photoUrl;

    @Column(columnDefinition = "TEXT")
    public String quote;

    public Integer rating = 5;
    public Boolean isVisible = true;
    public Integer orderIndex = 0;
}
