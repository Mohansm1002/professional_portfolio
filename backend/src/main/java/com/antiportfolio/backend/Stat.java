package com.antiportfolio.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "stats")
public class Stat extends BaseEntity {
    public String icon;
    public String number;
    public String suffix;
    public String label;
    public Integer orderIndex = 0;
}
