package com.antiportfolio.backend;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class ContactController {
    private final ContactMessageRepository messages;

    public ContactController(ContactMessageRepository messages) {
        this.messages = messages;
    }

    @PostMapping("/contact")
    @ResponseStatus(HttpStatus.CREATED)
    public ContactMessage submit(@Valid @RequestBody ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.name = request.name();
        message.email = request.email();
        message.subject = request.subject();
        message.message = request.message();
        message.isRead = false;
        return messages.save(message);
    }

    public record ContactRequest(
        @NotBlank @Size(max = 120) String name,
        @Email @NotBlank @Size(max = 180) String email,
        @NotBlank @Size(max = 160) String subject,
        @NotBlank @Size(max = 4000) String message
    ) {
    }
}
