package com.antiportfolio.backend;

import java.util.List;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SeedData {
    private static final String DEFAULT_RESUME_URL = "https://drive.google.com/file/d/1u4_uwM0rlibn2P8SDm61nKDUbYLFmKOx/view?usp=sharing";
    private static final String DEFAULT_ABOUT_PHOTO_URL = "https://lh3.googleusercontent.com/d/1Dki8UacpcDhZ-ZdiD1hlOmtGipuUwW2z=w1000?authuser=2";
    private static final String OLD_ABOUT_PHOTO_URL = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80";
    private static final String GITHUB_URL = "https://github.com/Mohansm1002";
    private static final String LINKEDIN_URL = "https://www.linkedin.com/in/mohan-mohan-b45222259?utm_source=share_via&utm_content=profile&utm_medium=member_android";
    private static final String EMAIL_URL = "mailto:mohansm1002@gmail.com";
    private static final String FOOD_DELIVERY_LIVE_URL = "https://food-delivery-application-o1ww.onrender.com/";
    private static final String FOOD_DELIVERY_REPO_URL = "https://github.com/Mohansm1002/Food_Delivery_Application";
    private static final String LAPTOP_PRICE_LIVE_URL = "https://predict-laptop-price-6gz4.onrender.com/";
    private static final String LAPTOP_PRICE_REPO_URL = "https://github.com/Mohansm1002/Predict_Laptop_Price";

    @Bean
    CommandLineRunner seedPortfolioData(
        @Value("${app.seed.enabled}") boolean enabled,
        @Value("${app.seed.admin-email}") String adminEmail,
        @Value("${app.seed.admin-password}") String adminPassword,
        PasswordEncoder passwordEncoder,
        AdminUserRepository adminUsers,
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
        SiteSettingsRepository settings
    ) {
        return args -> {
            if (!enabled) {
                return;
            }

            String seededAdminEmail = adminEmail.trim().toLowerCase(Locale.ROOT);
            if (seededAdminEmail.isBlank() || adminPassword == null || adminPassword.isBlank()) {
                throw new IllegalStateException("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set when seeding is enabled.");
            }

            AdminUser admin = adminUsers.findByEmail(seededAdminEmail).orElseGet(AdminUser::new);
            admin.email = seededAdminEmail;
            admin.passwordHash = passwordEncoder.encode(adminPassword);
            admin.role = "ROLE_ADMIN";
            adminUsers.save(admin);

            if (hero.count() == 0) {
                HeroContent content = new HeroContent();
                content.name = "Mohan S";
                content.availabilityBadge = true;
                content.availabilityText = "Available for Work";
                content.roles = List.of("Full Stack Developer", "Java Developer", "Problem Solver");
                content.bio = "Passionate and dedicated B.Tech IT student with strong knowledge of programming and web development. Skilled in building responsive web applications using HTML, CSS, JavaScript, React.js, Java, Node.js, Express.js, and MySQL.";
                content.profileImageUrl = "https://drive.google.com/file/d/1Dki8UacpcDhZ-ZdiD1hlOmtGipuUwW2z/view?usp=sharing";
                content.resumeUrl = DEFAULT_RESUME_URL;
                content.primaryBtnText = "Contact Me ->";
                content.primaryBtnLink = "#contact";
                content.secondaryBtnText = "Download Resume";
                content.secondaryBtnLink = DEFAULT_RESUME_URL;
                hero.save(content);
            } else {
                hero.findFirstByOrderByIdAsc().ifPresent(content -> {
                    boolean changed = false;
                    if (!isUsableUrl(content.resumeUrl)) {
                        content.resumeUrl = DEFAULT_RESUME_URL;
                        changed = true;
                    }
                    if (!isUsableUrl(content.secondaryBtnLink)) {
                        content.secondaryBtnLink = DEFAULT_RESUME_URL;
                        changed = true;
                    }
                    if (changed) {
                        hero.save(content);
                    }
                });
            }

            if (about.count() == 0) {
                AboutContent content = new AboutContent();
                content.heading = "B.Tech IT Student & Full Stack Developer";
                content.bio = "I am a passionate and dedicated B.Tech Information Technology student with strong knowledge of programming and web development. I build responsive web applications using HTML, CSS, JavaScript, React.js, Java, Node.js, Express.js, and MySQL, and I am looking for an entry-level opportunity to contribute to innovative projects.";
                content.highlights = List.of(
                    "Full Stack Developer Intern at Roriri Software Solutions PVT. LTD.",
                    "Hands-on experience building responsive interfaces and REST APIs.",
                    "Comfortable with CRUD operations, MySQL databases, Git, GitHub, VS Code, and Postman.",
                    "Strong problem-solving mindset, quick learning ability, and time management."
                );
                content.photoUrl = DEFAULT_ABOUT_PHOTO_URL;
                content.cvUrl = DEFAULT_RESUME_URL;
                about.save(content);
            } else {
                about.findFirstByOrderByIdAsc().ifPresent(content -> {
                    boolean changed = false;
                    if (!isUsableUrl(content.photoUrl) || OLD_ABOUT_PHOTO_URL.equals(content.photoUrl)) {
                        content.photoUrl = DEFAULT_ABOUT_PHOTO_URL;
                        changed = true;
                    }
                    if (!isUsableUrl(content.cvUrl)) {
                        content.cvUrl = DEFAULT_RESUME_URL;
                        changed = true;
                    }
                    if (changed) {
                        about.save(content);
                    }
                });
            }

            List<SocialLink> existingSocials = socials.findAll();
            upsertSocial(existingSocials, socials, "GitHub", GITHUB_URL, "github", 1);
            upsertSocial(existingSocials, socials, "LinkedIn", LINKEDIN_URL, "linkedin", 2);
            upsertSocial(existingSocials, socials, "Gmail", EMAIL_URL, "gmail", 3);

            if (stats.count() == 0) {
                stats.saveAll(List.of(
                    stat("folder", "3", "", "Projects", 1),
                    stat("clock", "1", "", "Internship", 2),
                    stat("users", "18", "+", "Skills", 3),
                    stat("star", "7.8", "", "GPA", 4)
                ));
            }

            SkillCategory programming = null;
            SkillCategory webTech = null;
            SkillCategory backend = null;
            SkillCategory tools = null;
            SkillCategory data = null;
            if (skillCategories.count() == 0) {
                programming = skillCategory("Programming Languages", 1);
                webTech = skillCategory("Web Technologies", 2);
                backend = skillCategory("Backend & Database", 3);
                tools = skillCategory("Tools", 4);
                data = skillCategory("Data & ML", 5);
                skillCategories.saveAll(List.of(programming, webTech, backend, tools, data));
            } else {
                List<SkillCategory> categories = skillCategories.findAll();
                programming = categories.stream().filter(category -> "Programming Languages".equalsIgnoreCase(category.name)).findFirst().orElse(null);
                webTech = categories.stream().filter(category -> "Web Technologies".equalsIgnoreCase(category.name)).findFirst().orElse(null);
                backend = categories.stream().filter(category -> "Backend & Database".equalsIgnoreCase(category.name)).findFirst().orElse(null);
                tools = categories.stream().filter(category -> "Tools".equalsIgnoreCase(category.name)).findFirst().orElse(null);
                data = categories.stream().filter(category -> "Data & ML".equalsIgnoreCase(category.name)).findFirst().orElse(null);
            }

            if (skills.count() == 0) {
                skills.saveAll(List.of(
                    skill("Java", "java", programming, 88, 1),
                    skill("Python", "python", programming, 82, 2),
                    skill("HTML5", "html", webTech, 92, 3),
                    skill("CSS3", "css", webTech, 90, 4),
                    skill("JavaScript", "javascript", webTech, 88, 5),
                    skill("React.js", "react", webTech, 86, 6),
                    skill("Node.js", "nodejs", backend, 78, 7),
                    skill("Express.js", "express", backend, 76, 8),
                    skill("MySQL", "mysql", backend, 82, 9),
                    skill("SQL", "sql", backend, 80, 10),
                    skill("Git", "git", tools, 86, 11),
                    skill("GitHub", "github", tools, 84, 12),
                    skill("VS Code", "vscode", tools, 88, 13),
                    skill("Postman", "postman", tools, 78, 14),
                    skill("Pandas", "pandas", data, 72, 15),
                    skill("NumPy", "numpy", data, 72, 16),
                    skill("Scikit-learn", "scikitlearn", data, 68, 17),
                    skill("Streamlit", "streamlit", data, 70, 18)
                ));
            }

            if (services.count() == 0) {
                services.saveAll(List.of(
                    service("monitor", "Web Development", "Modern, fast, and responsive web applications.", 1),
                    service("smartphone", "App Development", "Cross-platform mobile app experiences with clean flows.", 2),
                    service("pen-tool", "UI/UX Design", "Intuitive interfaces with attention to every detail.", 3)
                ));
            }

            ProjectCategory web = null;
            ProjectCategory machineLearning = null;
            ProjectCategory java = null;
            if (projectCategories.count() == 0) {
                web = projectCategory("Web");
                machineLearning = projectCategory("Machine Learning");
                java = projectCategory("Java");
                projectCategories.saveAll(List.of(web, machineLearning, java));
            } else {
                List<ProjectCategory> categories = projectCategories.findAll();
                web = categories.stream().filter(category -> "Web".equalsIgnoreCase(category.name)).findFirst().orElse(null);
                machineLearning = categories.stream().filter(category -> "Machine Learning".equalsIgnoreCase(category.name)).findFirst().orElse(null);
                java = categories.stream().filter(category -> "Java".equalsIgnoreCase(category.name)).findFirst().orElse(null);
            }

            if (projects.count() == 0) {
                projects.saveAll(List.of(
                    project(
                        "Food Delivery Application",
                        "food-delivery-application",
                        web,
                        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
                        "Developed a full-stack food delivery web application that lets users browse restaurants, view menus, add items to a cart, place orders, and manage order flow.",
                        List.of("HTML", "CSS", "JavaScript", "React.js", "Node.js", "MySQL", "Git"),
                        FOOD_DELIVERY_LIVE_URL,
                        FOOD_DELIVERY_REPO_URL,
                        1
                    ),
                    project(
                        "Laptop Price Prediction System",
                        "laptop-price-prediction-system",
                        machineLearning,
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
                        "Developed a machine learning model to predict laptop prices based on processor, RAM, storage, GPU, and display features, with a Streamlit interface for user input.",
                        List.of("Python", "Pandas", "NumPy", "Scikit-learn", "Matplotlib", "Streamlit", "Git"),
                        LAPTOP_PRICE_LIVE_URL,
                        LAPTOP_PRICE_REPO_URL,
                        2
                    ),
                    project(
                        "Train Ticket Booking System",
                        "train-ticket-booking-system",
                        java,
                        "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
                        "Developed a Java-based train ticket booking system using OOP concepts for train search, seat availability, booking, cancellation, and fare calculation.",
                        List.of("Java", "OOP", "Git"),
                        "#",
                        "#",
                        3
                    )
                ));
            }
            setProjectLinks(projects, "food-delivery-application", FOOD_DELIVERY_LIVE_URL, FOOD_DELIVERY_REPO_URL);
            setProjectLinks(projects, "laptop-price-prediction-system", LAPTOP_PRICE_LIVE_URL, LAPTOP_PRICE_REPO_URL);

            if (experience.count() == 0) {
                experience.saveAll(List.of(
                    experience("Full Stack Developer Intern", "Roriri Software Solutions PVT. LTD.", "Apr 2026", "Jul 2026", false, "Designed responsive interfaces using React.js, HTML, CSS, and JavaScript. Built RESTful APIs with Node.js and Express.js, integrated MySQL CRUD operations, and collaborated on features, debugging, and deployment optimization.", 1),
                    experience("B.Tech Information Technology", "Francis Xavier Engineering College, Tirunelveli", "2022", "2026", false, "Current GPA: 7.8.", 2),
                    experience("Higher Secondary Certificate", "Govt HR Sec School (Boys), Eruvadi", "2020", "2022", false, "HSC score: 86%.", 3)
                ));
            }

            if (settings.count() == 0) {
                SiteSettings site = new SiteSettings();
                site.siteTitle = "Alex Developer Portfolio";
                site.metaDescription = "Dark animated developer portfolio with a customizable admin panel.";
                site.primaryColor = "#6366f1";
                site.secondaryColor = "#22d3ee";
                site.bgColor = "#0A0A12";
                site.fontHeading = "Sora";
                site.fontBody = "Inter";
                settings.save(site);
            }
        };
    }

    private static SocialLink social(String platform, String url, String icon, int orderIndex) {
        SocialLink item = new SocialLink();
        item.platform = platform;
        item.url = url;
        item.icon = icon;
        item.orderIndex = orderIndex;
        return item;
    }

    private static void upsertSocial(
        List<SocialLink> existingSocials,
        SocialLinkRepository socials,
        String platform,
        String url,
        String icon,
        int orderIndex
    ) {
        SocialLink item = existingSocials.stream()
            .filter(link -> matchesSocial(link, platform, icon))
            .findFirst()
            .orElseGet(SocialLink::new);

        item.platform = platform;
        item.url = url;
        item.icon = icon;
        item.orderIndex = orderIndex;
        socials.save(item);
    }

    private static boolean matchesSocial(SocialLink link, String platform, String icon) {
        return equalsIgnoreCase(link.platform, platform) || equalsIgnoreCase(link.icon, icon);
    }

    private static boolean equalsIgnoreCase(String left, String right) {
        return left != null && right != null && left.equalsIgnoreCase(right);
    }

    private static Stat stat(String icon, String number, String suffix, String label, int orderIndex) {
        Stat item = new Stat();
        item.icon = icon;
        item.number = number;
        item.suffix = suffix;
        item.label = label;
        item.orderIndex = orderIndex;
        return item;
    }

    private static SkillCategory skillCategory(String name, int orderIndex) {
        SkillCategory item = new SkillCategory();
        item.name = name;
        item.orderIndex = orderIndex;
        return item;
    }

    private static Skill skill(String name, String iconUrl, SkillCategory category, int proficiency, int orderIndex) {
        Skill item = new Skill();
        item.name = name;
        item.iconUrl = iconUrl;
        item.category = category;
        item.proficiency = proficiency;
        item.orderIndex = orderIndex;
        return item;
    }

    private static ServiceItem service(String icon, String title, String description, int orderIndex) {
        ServiceItem item = new ServiceItem();
        item.icon = icon;
        item.title = title;
        item.description = description;
        item.orderIndex = orderIndex;
        item.isVisible = true;
        return item;
    }

    private static ProjectCategory projectCategory(String name) {
        ProjectCategory item = new ProjectCategory();
        item.name = name;
        return item;
    }

    private static Project project(String title, String slug, ProjectCategory category, String coverImageUrl, String description, List<String> tags, String liveUrl, String repoUrl, int orderIndex) {
        Project item = new Project();
        item.title = title;
        item.slug = slug;
        item.category = category;
        item.coverImageUrl = coverImageUrl;
        item.description = description;
        item.liveUrl = liveUrl;
        item.repoUrl = repoUrl;
        item.isFeatured = orderIndex == 1;
        item.isPublished = true;
        item.tags = tags;
        item.orderIndex = orderIndex;

        ProjectImage image = new ProjectImage();
        image.imageUrl = coverImageUrl;
        image.orderIndex = 1;
        item.images = List.of(image);

        return item;
    }

    private static void setProjectLinks(ProjectRepository projects, String slug, String liveUrl, String repoUrl) {
        projects.findBySlug(slug).ifPresent(project -> {
            boolean changed = false;
            if (!liveUrl.equals(project.liveUrl)) {
                project.liveUrl = liveUrl;
                changed = true;
            }
            if (!repoUrl.equals(project.repoUrl)) {
                project.repoUrl = repoUrl;
                changed = true;
            }
            if (changed) {
                projects.save(project);
            }
        });
    }

    private static ExperienceEntry experience(String role, String company, String start, String end, boolean present, String description, int orderIndex) {
        ExperienceEntry item = new ExperienceEntry();
        item.role = role;
        item.company = company;
        item.startDate = start;
        item.endDate = end;
        item.isPresent = present;
        item.description = description;
        item.orderIndex = orderIndex;
        return item;
    }

    private static boolean isUsableUrl(String value) {
        return value != null && !value.isBlank() && !"#".equals(value.trim());
    }

    private static Testimonial testimonial(String clientName, String designation, String company, String quote, int rating, int orderIndex) {
        Testimonial item = new Testimonial();
        item.clientName = clientName;
        item.designation = designation;
        item.company = company;
        item.quote = quote;
        item.rating = rating;
        item.isVisible = true;
        item.orderIndex = orderIndex;
        item.photoUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80";
        return item;
    }
}
