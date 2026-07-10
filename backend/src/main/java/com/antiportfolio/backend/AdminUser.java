package com.antiportfolio.backend;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "admin_users")
public class AdminUser extends BaseEntity {
    @Column(nullable = false, unique = true)
    public String email;

    @JsonIgnore
    @Column(nullable = false)
    public String passwordHash;

    @Column(nullable = false)
    public String role = "ROLE_ADMIN";

    @Column(nullable = false, updatable = false)
    public Instant createdAt;

    @PrePersist
    void created() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
