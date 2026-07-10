package com.antiportfolio.backend;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "contact_messages")
public class ContactMessage extends BaseEntity {
    public String name;
    public String email;
    public String subject;

    @Column(columnDefinition = "TEXT")
    public String message;

    public Boolean isRead = false;
    public Instant createdAt;

    @PrePersist
    void created() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
