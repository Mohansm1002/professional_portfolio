import React, { useEffect, useState } from 'react';
import { Code2 } from 'lucide-react';
import {
  SiCss,
  SiExpress,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiNodedotjs,
  SiNumpy,
  SiPandas,
  SiPostman,
  SiPython,
  SiReact,
  SiScikitlearn,
  SiSpring,
  SiStreamlit,
  SiTailwindcss,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { VscVscode } from 'react-icons/vsc';

const techIconMap = {
  css: [SiCss, '#1572B6'],
  css3: [SiCss, '#1572B6'],
  express: [SiExpress, '#F8FAFC'],
  expressjs: [SiExpress, '#F8FAFC'],
  git: [SiGit, '#F05032'],
  github: [SiGithub, '#F8FAFC'],
  html: [SiHtml5, '#E34F26'],
  html5: [SiHtml5, '#E34F26'],
  java: [FaJava, '#F89820'],
  javascript: [SiJavascript, '#F7DF1E'],
  js: [SiJavascript, '#F7DF1E'],
  matplotlib: [SiPython, '#3776AB'],
  mysql: [SiMysql, '#4479A1'],
  node: [SiNodedotjs, '#68A063'],
  nodejs: [SiNodedotjs, '#68A063'],
  numpy: [SiNumpy, '#4D77CF'],
  pandas: [SiPandas, '#150458'],
  postman: [SiPostman, '#FF6C37'],
  python: [SiPython, '#3776AB'],
  react: [SiReact, '#61DAFB'],
  reactjs: [SiReact, '#61DAFB'],
  scikitlearn: [SiScikitlearn, '#F7931E'],
  sklearn: [SiScikitlearn, '#F7931E'],
  spring: [SiSpring, '#6DB33F'],
  springboot: [SiSpring, '#6DB33F'],
  sql: [SiMysql, '#4479A1'],
  streamlit: [SiStreamlit, '#FF4B4B'],
  tailwind: [SiTailwindcss, '#38BDF8'],
  tailwindcss: [SiTailwindcss, '#38BDF8'],
  vscode: [VscVscode, '#007ACC'],
  visualstudiocode: [VscVscode, '#007ACC'],
  vscodeeditor: [VscVscode, '#007ACC'],
};

export const techIconOptions = [
  { label: 'Java', key: 'java' },
  { label: 'Python', key: 'python' },
  { label: 'HTML5', key: 'html' },
  { label: 'CSS3', key: 'css' },
  { label: 'JavaScript', key: 'javascript' },
  { label: 'React.js', key: 'react' },
  { label: 'Node.js', key: 'nodejs' },
  { label: 'Express.js', key: 'express' },
  { label: 'MySQL', key: 'mysql' },
  { label: 'SQL', key: 'sql' },
  { label: 'Git', key: 'git' },
  { label: 'GitHub', key: 'github' },
  { label: 'VS Code', key: 'vscode' },
  { label: 'Postman', key: 'postman' },
  { label: 'Pandas', key: 'pandas' },
  { label: 'NumPy', key: 'numpy' },
  { label: 'Scikit-learn', key: 'scikitlearn' },
  { label: 'Matplotlib', key: 'matplotlib' },
  { label: 'Streamlit', key: 'streamlit' },
  { label: 'Spring Boot', key: 'springboot' },
  { label: 'Tailwind CSS', key: 'tailwindcss' },
];

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
  xl: 'h-12 w-12',
};

export function normalizeTechKey(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function getTechIcon(value) {
  const key = normalizeTechKey(value);
  return techIconMap[key] || [Code2, '#22D3EE'];
}

function isImageSource(value = '') {
  return /^(https?:|data:image|blob:|\/)/i.test(String(value).trim());
}

export const TechLogo = ({ name, size = 'md', className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const source = String(name || '').trim();
  const imageCls = `${sizeMap[size] || sizeMap.md} flex-shrink-0 object-contain ${className}`;

  useEffect(() => {
    setImageError(false);
  }, [source]);

  if (source && isImageSource(source) && !imageError) {
    return (
      <img
        src={source}
        alt=""
        aria-hidden="true"
        className={imageCls}
        onError={() => setImageError(true)}
      />
    );
  }

  const [Icon, color] = getTechIcon(name);

  return (
    <Icon
      aria-hidden="true"
      className={`${sizeMap[size] || sizeMap.md} flex-shrink-0 ${className}`}
      style={{ color }}
    />
  );
};

export const TechChip = ({ name, className = '' }) => (
  <span className={`inline-flex min-w-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-xs font-semibold text-slate-300 ${className}`}>
    <TechLogo name={name} size="sm" />
    <span className="truncate">{name}</span>
  </span>
);
