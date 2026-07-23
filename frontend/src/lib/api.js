import {
  heroContent,
  socialLinks,
  stats,
  skills,
  services,
  projects,
  experience,
} from "./mockData";

export const DEFAULT_RESUME_URL =
  "https://drive.google.com/file/d/1u4_uwM0rlibn2P8SDm61nKDUbYLFmKOx/view?usp=sharing";

const DEFAULT_SOCIAL_LINK_URLS = {
  github: "https://github.com/Mohansm1002",
  linkedin: "https://www.linkedin.com/in/mohan-mohan-b45222259?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  gmail: "mailto:mohansm1002@gmail.com",
  mail: "mailto:mohansm1002@gmail.com",
  email: "mailto:mohansm1002@gmail.com",
};

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://professional-portfolio-o6m9.onrender.com/api/v1"
).replace(/\/$/, "");
const API_PUBLIC_ROOT = API_BASE_URL.replace(/\/api\/v1$/, "");
const TOKEN_KEY = "portfolio_admin_token";
const REFRESH_KEY = "portfolio_data_updated_at";
const ADMIN_SESSION_EXPIRED_EVENT = "portfolio-admin-session-expired";

const defaultAbout = {
  heading: "B.Tech IT Student & Full Stack Developer",
  photo_url:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  bio: "I am a passionate and dedicated B.Tech Information Technology student with strong knowledge of programming and web development. I build responsive web applications using HTML, CSS, JavaScript, React.js, Java, Node.js, Express.js, and MySQL, and I am looking for an entry-level opportunity to contribute to innovative projects.",
  highlights: [
    "Full Stack Developer Intern at Roriri Software Solutions PVT. LTD.",
    "Hands-on experience building responsive interfaces and REST APIs.",
    "Comfortable with CRUD operations, MySQL databases, Git, GitHub, VS Code, and Postman.",
    "Strong problem-solving mindset, quick learning ability, and time management.",
  ],
  cv_url: DEFAULT_RESUME_URL,
};

const defaultSettings = {
  site_title: "Alex Developer Portfolio",
  meta_description:
    "Building beautiful, performant digital experiences with clean code and great UX.",
  primary_color: "#6366f1",
  secondary_color: "#22d3ee",
  bg_color: "#0A0A12",
  font_heading: "Sora",
  font_body: "Inter",
};

export const fallbackPortfolioData = normalizePortfolioData({
  hero: heroContent,
  about: defaultAbout,
  socialLinks,
  stats,
  skills,
  services,
  projects,
  experience,
  settings: defaultSettings,
});

export function notifyPortfolioUpdated() {
  const value = String(Date.now());
  localStorage.setItem(REFRESH_KEY, value);
  window.dispatchEvent(
    new CustomEvent("portfolio-data-updated", { detail: value }),
  );
}

export function addPortfolioUpdateListeners(callback) {
  const onStorage = (event) => {
    if (event.key === REFRESH_KEY) callback();
  };
  const onCustom = () => callback();
  const onFocus = () => callback();

  window.addEventListener("storage", onStorage);
  window.addEventListener("portfolio-data-updated", onCustom);
  window.addEventListener("focus", onFocus);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("portfolio-data-updated", onCustom);
    window.removeEventListener("focus", onFocus);
  };
}

export function addAdminSessionExpiredListener(callback) {
  window.addEventListener(ADMIN_SESSION_EXPIRED_EVENT, callback);

  return () => {
    window.removeEventListener(ADMIN_SESSION_EXPIRED_EVENT, callback);
  };
}

export async function loadPortfolioData() {
  const [
    hero,
    about,
    socialLinksData,
    statsData,
    skillsData,
    servicesData,
    projectsData,
    experienceData,
    settings,
  ] = await Promise.all([
    apiGet("/hero"),
    apiGet("/about"),
    apiGet("/social-links"),
    apiGet("/stats"),
    apiGet("/skills"),
    apiGet("/services"),
    apiGet("/projects"),
    apiGet("/experience"),
    apiGet("/settings"),
  ]);

  return normalizePortfolioData({
    hero,
    about,
    socialLinks: socialLinksData,
    stats: statsData,
    skills: skillsData,
    services: servicesData,
    projects: projectsData,
    experience: experienceData,
    settings,
  });
}

export async function login(email, password) {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  if (!response?.token) {
    throw new Error("Login failed: the backend did not return a token.");
  }

  localStorage.setItem(TOKEN_KEY, response.token);
  return response;
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function getAdminDashboard() {
  return adminRequest("/admin/dashboard");
}

export async function getAdminHero() {
  return normalizeHero(await adminRequest("/admin/hero"));
}

export async function saveAdminHero(hero) {
  const saved = await adminRequest("/admin/hero", {
    method: "PUT",
    body: hero,
  });
  notifyPortfolioUpdated();
  return normalizeHero(saved);
}

export async function uploadAdminMedia(file) {
  const formData = new FormData();
  formData.append("file", file);

  const media = await adminRequest("/admin/media/upload", {
    method: "POST",
    body: formData,
  });

  return normalizeMedia(media);
}

export function getResumeDownloadUrl(hero) {
  const resumeUrl = isUsableUrl(hero?.resume_url)
    ? hero.resume_url
    : DEFAULT_RESUME_URL;

  if (!isUsableUrl(resumeUrl)) {
    return hero?.secondary_btn_link || "#";
  }

  const publicUrl = resolvePublicUrl(resumeUrl);
  if (isPublicUploadUrl(publicUrl)) {
    return `${API_BASE_URL}/resume/download`;
  }

  return getFileDownloadUrl(publicUrl);
}

export function getFileDownloadUrl(value) {
  const publicUrl = resolvePublicUrl(value);
  if (!isUsableUrl(publicUrl)) return "#";

  try {
    const url = new URL(publicUrl);
    if (url.hostname.includes("drive.google.com")) {
      const fileId = googleDriveFileId(url);
      if (fileId) {
        return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;
      }
    }
  } catch {
    return publicUrl;
  }

  return publicUrl;
}

export async function getAdminProjects() {
  const data = await adminRequest("/admin/projects");
  return data.map(normalizeProject);
}

export async function getProjectCategories() {
  return adminRequest("/admin/project-categories");
}

export async function saveAdminProject(project) {
  const method = project.id ? "PUT" : "POST";
  const path = project.id ? `/admin/projects/${project.id}` : "/admin/projects";
  const saved = await adminRequest(path, {
    method,
    body: toProjectPayload(project),
  });
  notifyPortfolioUpdated();
  return normalizeProject(saved);
}

export async function deleteAdminProject(id) {
  await adminRequest(`/admin/projects/${id}`, { method: "DELETE" });
  notifyPortfolioUpdated();
}

export async function getAdminSkills() {
  const data = await adminRequest("/admin/skills");
  return data.map(normalizeSkill);
}

export async function getSkillCategories() {
  const data = await adminRequest("/admin/skill-categories");
  return data.map(normalizeSkillCategory);
}

export async function saveSkillCategory(category) {
  const method = category.id ? "PUT" : "POST";
  const path = category.id
    ? `/admin/skill-categories/${category.id}`
    : "/admin/skill-categories";
  const saved = await adminRequest(path, {
    method,
    body: toSkillCategoryPayload(category),
  });
  notifyPortfolioUpdated();
  return normalizeSkillCategory(saved);
}

export async function deleteSkillCategory(id) {
  await adminRequest(`/admin/skill-categories/${id}`, { method: "DELETE" });
  notifyPortfolioUpdated();
}

export async function saveAdminSkill(skill) {
  const method = skill.id ? "PUT" : "POST";
  const path = skill.id ? `/admin/skills/${skill.id}` : "/admin/skills";
  const saved = await adminRequest(path, {
    method,
    body: toSkillPayload(skill),
  });
  notifyPortfolioUpdated();
  return normalizeSkill(saved);
}

export async function deleteAdminSkill(id) {
  await adminRequest(`/admin/skills/${id}`, { method: "DELETE" });
  notifyPortfolioUpdated();
}

export async function getAdminServices() {
  const data = await adminRequest("/admin/services");
  return data.map(normalizeService);
}

export async function saveAdminService(service) {
  const method = service.id ? "PUT" : "POST";
  const path = service.id ? `/admin/services/${service.id}` : "/admin/services";
  const saved = await adminRequest(path, {
    method,
    body: toServicePayload(service),
  });
  notifyPortfolioUpdated();
  return normalizeService(saved);
}

export async function deleteAdminService(id) {
  await adminRequest(`/admin/services/${id}`, { method: "DELETE" });
  notifyPortfolioUpdated();
}

export async function getAdminExperience() {
  const data = await adminRequest("/admin/experience");
  return data.map(normalizeExperience);
}

export async function saveAdminExperience(item) {
  const method = item.id ? "PUT" : "POST";
  const path = item.id ? `/admin/experience/${item.id}` : "/admin/experience";
  const saved = await adminRequest(path, {
    method,
    body: toExperiencePayload(item),
  });
  notifyPortfolioUpdated();
  return normalizeExperience(saved);
}

export async function deleteAdminExperience(id) {
  await adminRequest(`/admin/experience/${id}`, { method: "DELETE" });
  notifyPortfolioUpdated();
}

export async function getAdminMessages() {
  const data = await adminRequest("/admin/messages");
  return data.map(normalizeMessage);
}

export async function markMessageRead(id) {
  return normalizeMessage(
    await adminRequest(`/admin/messages/${id}`, { method: "PATCH" }),
  );
}

export async function deleteAdminMessage(id) {
  return adminRequest(`/admin/messages/${id}`, { method: "DELETE" });
}

export async function sendContactMessage(message) {
  return apiRequest("/contact", {
    method: "POST",
    body: message,
  });
}

async function adminRequest(path, options = {}) {
  const token = getStoredToken();
  if (!token) {
    const error = new Error("Please log in to continue.");
    error.status = 401;
    throw error;
  }

  try {
    return await apiRequest(path, {
      ...options,
      token,
    });
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      logout();
      window.dispatchEvent(new Event(ADMIN_SESSION_EXPIRED_EVENT));
      const sessionError = new Error(
        "Your admin session expired. Please log in again.",
      );
      sessionError.status = error.status;
      throw sessionError;
    }
    throw error;
  }
}

async function apiGet(path) {
  return apiRequest(path);
}

async function apiRequest(path, options = {}) {
  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  const request = {
    method: options.method || "GET",
    headers,
  };

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  if (options.body !== undefined && isFormData) {
    request.body = options.body;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    request.body = JSON.stringify(options.body);
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, request);

  if (response.status === 204) return null;

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const error = new Error(
      data?.error ||
        data?.message ||
        `Request failed with HTTP ${response.status}`,
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function normalizePortfolioData(data) {
  return {
    hero: normalizeHero(data.hero),
    about: normalizeAbout(data.about),
    socialLinks: (data.socialLinks || socialLinks).map(normalizeSocialLink),
    stats: (data.stats || stats).map(normalizeStat),
    skills: (data.skills || skills).map(normalizeSkill),
    services: (data.services || services).map(normalizeService),
    projects: (data.projects || projects).map(normalizeProject),
    experience: (data.experience || experience).map(normalizeExperience),
    settings: { ...defaultSettings, ...(data.settings || {}) },
  };
}

function normalizeHero(hero = heroContent) {
  const merged = {
    ...heroContent,
    ...hero,
    roles:
      Array.isArray(hero?.roles) && hero.roles.length
        ? hero.roles
        : heroContent.roles,
  };
  const resumeUrl = isUsableUrl(merged.resume_url)
    ? merged.resume_url
    : DEFAULT_RESUME_URL;
  const secondaryLink = isUsableUrl(merged.secondary_btn_link)
    ? merged.secondary_btn_link
    : resumeUrl;

  return {
    ...merged,
    profile_image_url: resolveImageUrl(merged.profile_image_url),
    resume_url: resolvePublicUrl(resumeUrl),
    secondary_btn_link: resolvePublicUrl(secondaryLink),
  };
}

function normalizeAbout(about = defaultAbout) {
  const cvUrl = isUsableUrl(about?.cv_url)
    ? about.cv_url
    : defaultAbout.cv_url;

  return {
    ...defaultAbout,
    ...about,
    cv_url: resolvePublicUrl(cvUrl),
    highlights:
      Array.isArray(about?.highlights) && about.highlights.length
        ? about.highlights
        : defaultAbout.highlights,
  };
}

function normalizeSocialLink(link) {
  const key = String(link.icon || link.platform || "link").toLowerCase().replace(/[^a-z0-9]/g, "");

  return {
    id: link.id,
    platform: link.platform || link.icon || "Link",
    url: DEFAULT_SOCIAL_LINK_URLS[key] || link.url || "#",
    icon: link.icon || link.platform || "link",
  };
}

function normalizeStat(stat) {
  return {
    ...stat,
    number: String(stat.number ?? "0"),
    suffix: stat.suffix ?? "",
    label: stat.label || "Stat",
    icon: stat.icon || "star",
  };
}

function normalizeSkill(skill) {
  const iconUrl = skill.icon_url || skill.iconUrl || skill.name || "code";

  return {
    id: skill.id,
    name: skill.name || "Skill",
    icon_url: resolveImageUrl(iconUrl),
    category:
      typeof skill.category === "string"
        ? skill.category
        : skill.category?.name || "Tools",
    category_id:
      typeof skill.category === "object"
        ? skill.category?.id
        : skill.category_id,
    proficiency: Number(skill.proficiency ?? 0),
    order_index: Number(skill.order_index ?? skill.orderIndex ?? 0),
  };
}

function normalizeSkillCategory(category) {
  return {
    id: category.id,
    name: category.name || "Tools",
    order_index: Number(category.order_index ?? category.orderIndex ?? 0),
  };
}

function normalizeService(service) {
  return {
    id: service.id,
    icon: service.icon || "monitor",
    title: service.title || "Service",
    description: service.description || service.desc || "",
    desc: service.description || service.desc || "",
    is_visible: service.is_visible ?? service.isVisible ?? true,
    order_index: Number(service.order_index ?? service.orderIndex ?? 0),
  };
}

function normalizeProject(project) {
  const categoryName =
    typeof project.category === "string"
      ? project.category
      : project.category?.name;
  const coverUrl =
    project.cover ||
    project.cover_image_url ||
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";
  return {
    ...project,
    category: categoryName || "Web",
    category_id:
      typeof project.category === "object"
        ? project.category?.id
        : project.category_id,
    category_object:
      typeof project.category === "object" ? project.category : undefined,
    cover: resolveImageUrl(coverUrl),
    cover_image_url: resolveImageUrl(coverUrl),
    desc: project.description || project.desc || "",
    description: project.description || project.desc || "",
    tags: Array.isArray(project.tags) ? project.tags : [],
    live_url: project.live_url || "#",
    repo_url: project.repo_url || "#",
    is_featured: project.is_featured ?? false,
    is_published: project.is_published ?? true,
  };
}

function normalizeExperience(item) {
  const title = `${item.role || ""} ${item.company || ""}`;
  const inferredType =
    /\b(b\.?tech|education|certificate|higher secondary|hsc|college|school)\b/i.test(
      title,
    )
      ? "education"
      : "work";
  const companyLogoUrl = item.company_logo_url || item.companyLogoUrl || "";
  const start = item.start || item.start_date || item.startDate || "";
  const end = item.end || item.end_date || item.endDate || "";
  const description = item.desc || item.description || "";

  return {
    ...item,
    company_logo_url: resolveImageUrl(companyLogoUrl),
    start,
    start_date: start,
    end,
    end_date: end,
    is_present: item.is_present ?? item.isPresent ?? false,
    description,
    desc: description,
    type: item.type || inferredType,
    order_index: Number(item.order_index ?? item.orderIndex ?? 0),
  };
}

function normalizeTestimonial(testimonial) {
  return {
    ...testimonial,
    name: testimonial.name || testimonial.client_name || "Client",
    photo:
      testimonial.photo ||
      testimonial.photo_url ||
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    rating: Number(testimonial.rating ?? 5),
  };
}

function normalizeMessage(message) {
  return {
    ...message,
    date: message.date || formatDate(message.created_at),
    is_read: message.is_read ?? false,
  };
}

function normalizeMedia(media) {
  const fileUrl = media.file_url || media.fileUrl || "";

  return {
    ...media,
    file_url: resolvePublicUrl(fileUrl),
    raw_file_url: fileUrl,
    file_name: media.file_name || media.fileName || "Uploaded file",
    file_type: media.file_type || media.fileType || "",
  };
}

function toProjectPayload(project) {
  const category = project.category_id
    ? { id: project.category_id, name: project.category }
    : { name: project.category };

  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    category,
    cover_image_url: project.cover_image_url || project.cover,
    description: project.description || project.desc,
    live_url: project.live_url || "#",
    repo_url: project.repo_url || "#",
    is_featured: Boolean(project.is_featured),
    is_published: Boolean(project.is_published),
    order_index: project.order_index || 0,
    tags: project.tags || [],
    images: project.images || [],
  };
}

function toSkillPayload(skill) {
  const categoryName = skill.category || "Tools";
  const category = skill.category_id
    ? { id: skill.category_id, name: categoryName }
    : { name: categoryName };

  return {
    id: skill.id,
    name: skill.name,
    icon_url: skill.icon_url || skill.iconUrl || skill.name,
    category,
    proficiency: Number(skill.proficiency ?? 0),
    order_index: Number(skill.order_index ?? skill.orderIndex ?? 0),
  };
}

function toSkillCategoryPayload(category) {
  return {
    id: category.id,
    name: category.name,
    order_index: Number(category.order_index ?? category.orderIndex ?? 0),
  };
}

function toServicePayload(service) {
  return {
    id: service.id,
    icon: service.icon || "monitor",
    title: service.title,
    description: service.description || service.desc,
    is_visible: Boolean(service.is_visible ?? service.isVisible ?? true),
    order_index: Number(service.order_index ?? service.orderIndex ?? 0),
  };
}

function toExperiencePayload(item) {
  return {
    id: item.id,
    role: item.role,
    company: item.company,
    company_logo_url: item.company_logo_url || item.companyLogoUrl || "",
    start_date: item.start_date || item.start || "",
    end_date:
      item.is_present || item.isPresent ? "" : item.end_date || item.end || "",
    is_present: Boolean(item.is_present ?? item.isPresent ?? false),
    description: item.description || item.desc,
    order_index: Number(item.order_index ?? item.orderIndex ?? 0),
  };
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString();
}

function resolvePublicUrl(value) {
  if (!value || value === "#") return value || "#";
  if (/^(https?:|data:|blob:|mailto:|tel:|#)/i.test(value)) return value;

  if (value.startsWith("/")) {
    return `${API_PUBLIC_ROOT}${value}`;
  }

  return value;
}

function isUsableUrl(value) {
  return typeof value === "string" && value.trim() !== "" && value.trim() !== "#";
}

function isPublicUploadUrl(value) {
  const publicUrl = resolvePublicUrl(value);
  if (!isUsableUrl(publicUrl)) return false;
  if (publicUrl.startsWith("/uploads/")) return true;

  try {
    const url = new URL(publicUrl);
    const publicRoot = new URL(API_PUBLIC_ROOT);
    return url.origin === publicRoot.origin && url.pathname.startsWith("/uploads/");
  } catch {
    return false;
  }
}

function resolveImageUrl(value) {
  const publicUrl = resolvePublicUrl(value);
  if (!publicUrl || publicUrl === "#") return publicUrl;

  try {
    const url = new URL(publicUrl);
    if (url.hostname.includes("drive.google.com")) {
      const fileId = googleDriveFileId(url);
      if (fileId) {
        return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w1000`;
      }
    }
  } catch {
    return publicUrl;
  }

  return publicUrl;
}

function googleDriveFileId(url) {
  const fileMatch = url.pathname.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) return decodeURIComponent(fileMatch[1]);

  return url.searchParams.get("id");
}
