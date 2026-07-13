import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const distDir = join(process.cwd(), "dist");
const source = join(distDir, "index.html");

const routes = [
  "admin",
  "admin/login",
  "admin/hero",
  "admin/projects",
  "admin/skills",
  "admin/services",
  "admin/experience",
  "admin/testimonials",
  "admin/messages",
  "admin/theme",
  "admin/settings",
  "admin/media",
];

await Promise.all(
  routes.map(async (route) => {
    const target = join(distDir, route, "index.html");
    await mkdir(dirname(target), { recursive: true });
    await copyFile(source, target);
  }),
);
