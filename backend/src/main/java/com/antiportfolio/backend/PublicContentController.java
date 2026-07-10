package com.antiportfolio.backend;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Sort;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class PublicContentController {
    private static final Pattern GOOGLE_DRIVE_FILE_ID = Pattern.compile("/file/d/([^/]+)");

    private final HeroContentRepository hero;
    private final AboutContentRepository about;
    private final SocialLinkRepository socials;
    private final StatRepository stats;
    private final SkillRepository skills;
    private final ServiceItemRepository services;
    private final ProjectRepository projects;
    private final ExperienceEntryRepository experience;
    private final TestimonialRepository testimonials;
    private final SiteSettingsRepository settings;
    private final Path uploadRoot;

    public PublicContentController(
        HeroContentRepository hero,
        AboutContentRepository about,
        SocialLinkRepository socials,
        StatRepository stats,
        SkillRepository skills,
        ServiceItemRepository services,
        ProjectRepository projects,
        ExperienceEntryRepository experience,
        TestimonialRepository testimonials,
        SiteSettingsRepository settings,
        @Value("${app.upload-dir}") String uploadDir
    ) {
        this.hero = hero;
        this.about = about;
        this.socials = socials;
        this.stats = stats;
        this.skills = skills;
        this.services = services;
        this.projects = projects;
        this.experience = experience;
        this.testimonials = testimonials;
        this.settings = settings;
        this.uploadRoot = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    @GetMapping("/hero")
    public HeroContent hero() {
        return hero.findFirstByOrderByIdAsc().orElseGet(HeroContent::new);
    }

    @GetMapping("/resume/download")
    public ResponseEntity<?> downloadResume() throws IOException {
        HeroContent content = hero.findFirstByOrderByIdAsc().orElseThrow();
        String resumeUrl = content.resumeUrl;

        if (resumeUrl == null || resumeUrl.isBlank() || "#".equals(resumeUrl.trim())) {
            throw new NoSuchElementException();
        }

        String resumePath = pathFromUrl(resumeUrl);
        if (resumePath.startsWith("/uploads/")) {
            Path resumeFile = uploadRoot.resolve(resumePath.substring("/uploads/".length())).normalize();

            if (!resumeFile.startsWith(uploadRoot) || !Files.exists(resumeFile) || !Files.isRegularFile(resumeFile)) {
                throw new NoSuchElementException();
            }

            Resource resource = new UrlResource(resumeFile.toUri());
            String contentType = Files.probeContentType(resumeFile);
            MediaType mediaType = contentType == null
                ? MediaType.APPLICATION_OCTET_STREAM
                : MediaType.parseMediaType(contentType);

            return ResponseEntity.ok()
                .contentType(mediaType)
                .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    ContentDisposition.attachment().filename(resumeFile.getFileName().toString()).build().toString()
                )
                .body(resource);
        }

        return ResponseEntity.status(HttpStatus.FOUND)
            .location(toDirectDownloadUri(resumeUrl))
            .build();
    }

    @GetMapping("/about")
    public AboutContent about() {
        return about.findFirstByOrderByIdAsc().orElseGet(AboutContent::new);
    }

    @GetMapping("/social-links")
    public List<SocialLink> socialLinks() {
        return socials.findAll(Sort.by("orderIndex").ascending());
    }

    @GetMapping("/stats")
    public List<Stat> stats() {
        return stats.findAll(Sort.by("orderIndex").ascending());
    }

    @GetMapping("/skills")
    public List<Skill> skills() {
        return skills.findAll(Sort.by("orderIndex").ascending());
    }

    @GetMapping("/services")
    public List<ServiceItem> services() {
        return services.findAll(Sort.by("orderIndex").ascending()).stream()
            .filter(service -> !Boolean.FALSE.equals(service.isVisible))
            .toList();
    }

    @GetMapping("/projects")
    public List<Project> projects(
        @RequestParam(required = false) String category,
        @RequestParam(required = false) Boolean featured
    ) {
        return projects.findAll(Sort.by("orderIndex").ascending()).stream()
            .filter(project -> !Boolean.FALSE.equals(project.isPublished))
            .filter(project -> featured == null || Objects.equals(project.isFeatured, featured))
            .filter(project -> category == null || category.isBlank() || (
                project.category != null && project.category.name != null && project.category.name.equalsIgnoreCase(category)
            ))
            .toList();
    }

    @GetMapping("/projects/{slug}")
    public Project project(@PathVariable String slug) {
        return projects.findBySlug(slug).orElseThrow();
    }

    @GetMapping("/experience")
    public List<ExperienceEntry> experience() {
        return experience.findAll(Sort.by("orderIndex").ascending());
    }

    @GetMapping("/testimonials")
    public List<Testimonial> testimonials() {
        return testimonials.findAll(Sort.by("orderIndex").ascending()).stream()
            .filter(testimonial -> !Boolean.FALSE.equals(testimonial.isVisible))
            .sorted(Comparator.comparing(testimonial -> testimonial.orderIndex == null ? 0 : testimonial.orderIndex))
            .toList();
    }

    @GetMapping("/settings")
    public SiteSettings settings() {
        return settings.findFirstByOrderByIdAsc().orElseGet(SiteSettings::new);
    }

    private String pathFromUrl(String value) {
        if (value.startsWith("http://") || value.startsWith("https://")) {
            return URI.create(value).getPath();
        }

        return value;
    }

    private URI toDirectDownloadUri(String value) {
        URI uri = URI.create(value);

        if (uri.getHost() != null && uri.getHost().contains("drive.google.com")) {
            String id = driveFileId(uri);
            if (id != null && !id.isBlank()) {
                return URI.create("https://drive.google.com/uc?export=download&id=" + id);
            }
        }

        return uri;
    }

    private String driveFileId(URI uri) {
        Matcher fileMatcher = GOOGLE_DRIVE_FILE_ID.matcher(uri.getPath());
        if (fileMatcher.find()) {
            return fileMatcher.group(1);
        }

        String query = uri.getQuery();
        if (query == null) {
            return null;
        }

        for (String part : query.split("&")) {
            String[] pair = part.split("=", 2);
            if (pair.length == 2 && "id".equals(pair[0])) {
                return pair[1];
            }
        }

        return null;
    }
}
