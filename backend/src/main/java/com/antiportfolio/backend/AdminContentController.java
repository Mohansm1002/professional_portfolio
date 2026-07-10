package com.antiportfolio.backend;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminContentController {
    private final HeroContentRepository hero;
    private final AboutContentRepository about;
    private final SocialLinkRepository socials;
    private final StatRepository stats;
    private final SkillCategoryRepository skillCategories;
    private final SkillRepository skills;
    private final ServiceItemRepository services;
    private final ProjectCategoryRepository projectCategories;
    private final ProjectRepository projects;
    private final ExperienceEntryRepository experience;
    private final TestimonialRepository testimonials;
    private final ContactMessageRepository messages;
    private final SiteSettingsRepository settings;
    private final MediaLibraryItemRepository media;

    public AdminContentController(
        HeroContentRepository hero,
        AboutContentRepository about,
        SocialLinkRepository socials,
        StatRepository stats,
        SkillCategoryRepository skillCategories,
        SkillRepository skills,
        ServiceItemRepository services,
        ProjectCategoryRepository projectCategories,
        ProjectRepository projects,
        ExperienceEntryRepository experience,
        TestimonialRepository testimonials,
        ContactMessageRepository messages,
        SiteSettingsRepository settings,
        MediaLibraryItemRepository media
    ) {
        this.hero = hero;
        this.about = about;
        this.socials = socials;
        this.stats = stats;
        this.skillCategories = skillCategories;
        this.skills = skills;
        this.services = services;
        this.projectCategories = projectCategories;
        this.projects = projects;
        this.experience = experience;
        this.testimonials = testimonials;
        this.messages = messages;
        this.settings = settings;
        this.media = media;
    }

    @GetMapping("/dashboard")
    public Map<String, Long> dashboard() {
        return Map.of(
            "total_projects", projects.count(),
            "total_messages", messages.count(),
            "unread_messages", messages.countByIsReadFalse(),
            "total_skills", skills.count(),
            "total_media", media.count()
        );
    }

    @GetMapping("/hero")
    public HeroContent hero() {
        return hero.findFirstByOrderByIdAsc().orElseGet(HeroContent::new);
    }

    @PutMapping("/hero")
    public HeroContent saveHero(@RequestBody HeroContent body) {
        body.id = hero.findFirstByOrderByIdAsc().map(existing -> existing.id).orElse(body.id);
        return hero.save(body);
    }

    @GetMapping("/about")
    public AboutContent about() {
        return about.findFirstByOrderByIdAsc().orElseGet(AboutContent::new);
    }

    @PutMapping("/about")
    public AboutContent saveAbout(@RequestBody AboutContent body) {
        body.id = about.findFirstByOrderByIdAsc().map(existing -> existing.id).orElse(body.id);
        return about.save(body);
    }

    @GetMapping("/settings")
    public SiteSettings settings() {
        return settings.findFirstByOrderByIdAsc().orElseGet(SiteSettings::new);
    }

    @PutMapping("/settings")
    public SiteSettings saveSettings(@RequestBody SiteSettings body) {
        body.id = settings.findFirstByOrderByIdAsc().map(existing -> existing.id).orElse(body.id);
        return settings.save(body);
    }

    @GetMapping("/social-links")
    public List<SocialLink> socialLinks() {
        return socials.findAll(Sort.by("orderIndex").ascending());
    }

    @PostMapping("/social-links")
    public SocialLink createSocialLink(@RequestBody SocialLink body) {
        return socials.save(body);
    }

    @PutMapping("/social-links/{id}")
    public SocialLink updateSocialLink(@PathVariable Long id, @RequestBody SocialLink body) {
        body.id = id;
        return socials.save(body);
    }

    @DeleteMapping("/social-links/{id}")
    public ResponseEntity<Void> deleteSocialLink(@PathVariable Long id) {
        return delete(socials, id);
    }

    @GetMapping("/stats")
    public List<Stat> stats() {
        return stats.findAll(Sort.by("orderIndex").ascending());
    }

    @PostMapping("/stats")
    public Stat createStat(@RequestBody Stat body) {
        return stats.save(body);
    }

    @PutMapping("/stats/{id}")
    public Stat updateStat(@PathVariable Long id, @RequestBody Stat body) {
        body.id = id;
        return stats.save(body);
    }

    @DeleteMapping("/stats/{id}")
    public ResponseEntity<Void> deleteStat(@PathVariable Long id) {
        return delete(stats, id);
    }

    @GetMapping("/skill-categories")
    public List<SkillCategory> skillCategories() {
        return skillCategories.findAll(Sort.by("orderIndex").ascending());
    }

    @PostMapping("/skill-categories")
    public SkillCategory createSkillCategory(@RequestBody SkillCategory body) {
        return skillCategories.save(body);
    }

    @PutMapping("/skill-categories/{id}")
    public SkillCategory updateSkillCategory(@PathVariable Long id, @RequestBody SkillCategory body) {
        body.id = id;
        return skillCategories.save(body);
    }

    @DeleteMapping("/skill-categories/{id}")
    public ResponseEntity<Void> deleteSkillCategory(@PathVariable Long id) {
        return delete(skillCategories, id);
    }

    @GetMapping("/skills")
    public List<Skill> skills() {
        return skills.findAll(Sort.by("orderIndex").ascending());
    }

    @PostMapping("/skills")
    public Skill createSkill(@RequestBody Skill body) {
        prepareSkill(body);
        return skills.save(body);
    }

    @PutMapping("/skills/{id}")
    public Skill updateSkill(@PathVariable Long id, @RequestBody Skill body) {
        body.id = id;
        prepareSkill(body);
        return skills.save(body);
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        return delete(skills, id);
    }

    @GetMapping("/services")
    public List<ServiceItem> services() {
        return services.findAll(Sort.by("orderIndex").ascending());
    }

    @PostMapping("/services")
    public ServiceItem createService(@RequestBody ServiceItem body) {
        return services.save(body);
    }

    @PutMapping("/services/{id}")
    public ServiceItem updateService(@PathVariable Long id, @RequestBody ServiceItem body) {
        body.id = id;
        return services.save(body);
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        return delete(services, id);
    }

    @GetMapping("/project-categories")
    public List<ProjectCategory> projectCategories() {
        return projectCategories.findAll(Sort.by("name").ascending());
    }

    @PostMapping("/project-categories")
    public ProjectCategory createProjectCategory(@RequestBody ProjectCategory body) {
        return projectCategories.save(body);
    }

    @PutMapping("/project-categories/{id}")
    public ProjectCategory updateProjectCategory(@PathVariable Long id, @RequestBody ProjectCategory body) {
        body.id = id;
        return projectCategories.save(body);
    }

    @DeleteMapping("/project-categories/{id}")
    public ResponseEntity<Void> deleteProjectCategory(@PathVariable Long id) {
        return delete(projectCategories, id);
    }

    @GetMapping("/projects")
    public List<Project> projects() {
        return projects.findAll(Sort.by("orderIndex").ascending());
    }

    @PostMapping("/projects")
    public Project createProject(@RequestBody Project body) {
        prepareProject(body);
        return projects.save(body);
    }

    @PutMapping("/projects/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project body) {
        body.id = id;
        prepareProject(body);
        return projects.save(body);
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        return delete(projects, id);
    }

    @GetMapping("/experience")
    public List<ExperienceEntry> experience() {
        return experience.findAll(Sort.by("orderIndex").ascending());
    }

    @PostMapping("/experience")
    public ExperienceEntry createExperience(@RequestBody ExperienceEntry body) {
        return experience.save(body);
    }

    @PutMapping("/experience/{id}")
    public ExperienceEntry updateExperience(@PathVariable Long id, @RequestBody ExperienceEntry body) {
        body.id = id;
        return experience.save(body);
    }

    @DeleteMapping("/experience/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long id) {
        return delete(experience, id);
    }

    @GetMapping("/testimonials")
    public List<Testimonial> testimonials() {
        return testimonials.findAll(Sort.by("orderIndex").ascending());
    }

    @PostMapping("/testimonials")
    public Testimonial createTestimonial(@RequestBody Testimonial body) {
        return testimonials.save(body);
    }

    @PutMapping("/testimonials/{id}")
    public Testimonial updateTestimonial(@PathVariable Long id, @RequestBody Testimonial body) {
        body.id = id;
        return testimonials.save(body);
    }

    @DeleteMapping("/testimonials/{id}")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable Long id) {
        return delete(testimonials, id);
    }

    @GetMapping("/messages")
    public List<ContactMessage> messages() {
        return messages.findAll(Sort.by("createdAt").descending());
    }

    @PatchMapping("/messages/{id}")
    public ContactMessage markMessageRead(@PathVariable Long id) {
        ContactMessage message = messages.findById(id).orElseThrow();
        message.isRead = true;
        return messages.save(message);
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        return delete(messages, id);
    }

    private <T> ResponseEntity<Void> delete(JpaRepository<T, Long> repository, Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void prepareProject(Project project) {
        project.category = resolveProjectCategory(project.category);
        if (project.slug == null || project.slug.isBlank()) {
            project.slug = slugify(project.title);
        }
        if (project.tags == null) {
            project.tags = new ArrayList<>();
        }
        if (project.images == null) {
            project.images = new ArrayList<>();
        }
    }

    private void prepareSkill(Skill skill) {
        if (skill.category == null) {
            return;
        }
        if (skill.category.id != null) {
            skill.category = skillCategories.findById(skill.category.id).orElse(skill.category);
            return;
        }
        if (skill.category.name == null || skill.category.name.isBlank()) {
            skill.category = null;
            return;
        }
        SkillCategory requestedCategory = skill.category;
        String requestedName = requestedCategory.name;
        skill.category = skillCategories.findAll().stream()
            .filter(category -> category.name != null && category.name.equalsIgnoreCase(requestedName))
            .findFirst()
            .orElseGet(() -> skillCategories.save(requestedCategory));
    }

    private ProjectCategory resolveProjectCategory(ProjectCategory category) {
        if (category == null) {
            return null;
        }
        if (category.id != null) {
            return projectCategories.findById(category.id).orElse(category);
        }
        if (category.name == null || category.name.isBlank()) {
            return null;
        }
        return projectCategories.findByNameIgnoreCase(category.name)
            .orElseGet(() -> projectCategories.save(category));
    }

    private String slugify(String value) {
        if (value == null || value.isBlank()) {
            return "project-" + System.currentTimeMillis();
        }
        String slug = value.toLowerCase(Locale.ROOT)
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("^-|-$", "");
        return slug.isBlank() ? "project-" + System.currentTimeMillis() : slug;
    }
}
