import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  ArrowRight,
  Mail,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { getResumeDownloadUrl } from "../../lib/api";

const stackImages = [
  {
    name: "HTML5",
    src: "https://img.icons8.com/color/96/html-5--v1.png",
  },
  {
    name: "CSS3",
    src: "https://img.icons8.com/color/96/css3.png",
  },
  {
    name: "JavaScript",
    src: "https://img.icons8.com/color/96/javascript--v1.png",
  },
  {
    name: "Java",
    src: "https://img.icons8.com/color/96/java-coffee-cup-logo--v1.png",
  },
];

const Hero = ({ hero, socialLinks = [] }) => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const roles = hero?.roles?.length ? hero.roles : ["Full Stack Developer"];
  const resumeHref = getResumeDownloadUrl(hero);
  const hasResume = resumeHref && resumeHref !== "#";
  const profileImageUrl = hero?.profile_image_url;
  const hasProfileImage =
    profileImageUrl && profileImageUrl !== "#" && !imageFailed;
  const initials = (hero?.name || "M")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  useEffect(() => {
    setImageFailed(false);
  }, [profileImageUrl]);

  const getIcon = (name) => {
    switch ((name || "").toLowerCase()) {
      case "github":
        return <FaGithub size={20} />;
      case "linkedin":
        return <FaLinkedin size={20} />;
      case "gmail":
      case "mail":
      case "email":
      case "twitter":
        return <Mail size={20} />;
      default:
        return null;
    }
  };

  return (
    <section
      id="home"
      className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-start space-y-6 z-10"
        >
          {hero?.availability_badge && (
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-slate-300">
                {hero.availability_text}
              </span>
            </div>
          )}

          <h1 className="text-5xl md:text-7xl font-bold font-heading leading-tight">
            Hi, I'm{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              {hero?.name}
            </span>
          </h1>

          <div className="text-2xl md:text-3xl font-heading text-slate-300 h-10 flex items-center">
            I'm a{" "}
            <motion.span
              key={currentRoleIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="ml-2 font-bold text-white border-b-2 border-cyan-400 pb-1 inline-block"
            >
              &lt; {roles[currentRoleIndex % roles.length] || roles[0]} &gt;
            </motion.span>
          </div>

          <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
            {hero?.bio}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href={hero?.primary_btn_link}
              className="btn-primary flex items-center space-x-2"
            >
              <span>{hero?.primary_btn_text}</span>
              <ArrowRight size={18} />
            </a>
            <a
              href={resumeHref}
              download
              onClick={(event) => {
                if (!hasResume) event.preventDefault();
              }}
              className={`btn-secondary flex items-center space-x-2 ${hasResume ? "" : "pointer-events-none opacity-60"}`}
            >
              <Download size={18} />
              <span>{hero?.secondary_btn_text}</span>
            </a>
          </div>

          <div className="flex space-x-5 pt-8">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                className="text-slate-400 hover:text-cyan-400 transition-colors transform hover:-translate-y-1 duration-300"
                target="_blank"
                rel="noreferrer"
              >
                {getIcon(link.icon)}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right Column - Image & Orbits */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex justify-center items-center h-[500px]"
        >
          {/* Orbits Background */}
          <div className="absolute w-[400px] h-[400px] border border-white/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
          <div className="absolute w-[500px] h-[500px] border border-white/5 rounded-full animate-[spin_30s_linear_infinite_reverse]"></div>

          {/* Profile Photo */}
          <div className="relative w-72 h-72 rounded-full p-2 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 z-10 shadow-2xl shadow-purple-500/20">
            {hasProfileImage ? (
              <img
                src={profileImageUrl}
                alt={hero?.name || "Profile"}
                referrerPolicy="no-referrer"
                onError={() => setImageFailed(true)}
                className="w-full h-full rounded-full object-cover border-4 border-background"
              />
            ) : (
              <div className="w-full h-full rounded-full border-4 border-background bg-background/90 flex items-center justify-center text-6xl font-bold font-heading text-white">
                {initials}
              </div>
            )}
          </div>

          {/* Orbiting Stack Images */}
          <div className="absolute w-full h-full animate-[spin_20s_linear_infinite] pointer-events-none">
            <div className="absolute top-[10%] left-[20%] h-16 w-16 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg -rotate-[20deg] animate-[spin_20s_linear_infinite_reverse]">
              <img
                src={stackImages[0].src}
                alt={stackImages[0].name}
                className="h-full w-full object-contain drop-shadow-lg"
              />
            </div>
            <div className="absolute bottom-[15%] right-[15%] h-16 w-16 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg -rotate-[20deg] animate-[spin_20s_linear_infinite_reverse]">
              <img
                src={stackImages[1].src}
                alt={stackImages[1].name}
                className="h-full w-full object-contain drop-shadow-lg"
              />
            </div>
          </div>

          <div className="absolute w-full h-full animate-[spin_30s_linear_infinite_reverse] pointer-events-none">
            <div className="absolute top-[40%] right-[5%] h-16 w-16 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg rotate-[30deg] animate-[spin_30s_linear_infinite]">
              <img
                src={stackImages[2].src}
                alt={stackImages[2].name}
                className="h-full w-full object-contain drop-shadow-lg"
              />
            </div>
            <div className="absolute bottom-[30%] left-[5%] h-16 w-16 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg rotate-[30deg] animate-[spin_30s_linear_infinite]">
              <img
                src={stackImages[3].src}
                alt={stackImages[3].name}
                className="h-full w-full object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
