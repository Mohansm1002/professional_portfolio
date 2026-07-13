package com.antiportfolio.backend;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    Optional<AdminUser> findByEmail(String email);
}

interface HeroContentRepository extends JpaRepository<HeroContent, Long> {
    Optional<HeroContent> findFirstByOrderByIdAsc();
}

interface AboutContentRepository extends JpaRepository<AboutContent, Long> {
    Optional<AboutContent> findFirstByOrderByIdAsc();
}

interface SocialLinkRepository extends JpaRepository<SocialLink, Long> {
}

interface StatRepository extends JpaRepository<Stat, Long> {
}

interface SkillCategoryRepository extends JpaRepository<SkillCategory, Long> {
    Optional<SkillCategory> findByNameIgnoreCase(String name);
}

interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByCategory(SkillCategory category);
}

interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {
}

interface ProjectCategoryRepository extends JpaRepository<ProjectCategory, Long> {
    Optional<ProjectCategory> findByNameIgnoreCase(String name);
}

interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findBySlug(String slug);
}

interface ExperienceEntryRepository extends JpaRepository<ExperienceEntry, Long> {
}

interface TestimonialRepository extends JpaRepository<Testimonial, Long> {
}

interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    long countByIsReadFalse();
}

interface SiteSettingsRepository extends JpaRepository<SiteSettings, Long> {
    Optional<SiteSettings> findFirstByOrderByIdAsc();
}

interface MediaLibraryItemRepository extends JpaRepository<MediaLibraryItem, Long> {
}
