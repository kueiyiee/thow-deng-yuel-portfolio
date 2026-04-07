import { useEffect, useMemo, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import * as THREE from "three";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import {
  FiArrowDown,
  FiBarChart2,
  FiCheckCircle,
  FiDownload,
  FiGlobe,
  FiMail,
  FiMoon,
  FiPhone,
  FiSend,
  FiSun,
} from "react-icons/fi";
import {
  FaHeartbeat,
  FaFacebookF,
  FaInstagram,
  FaSchool,
  FaUserGraduate,
} from "react-icons/fa";

const NAV_ITEMS = [
  ["home", "Home"],
  ["profile", "Profile"],
  ["features", "Features"],
  ["competencies", "Competencies"],
  ["projects", "Projects"],
  ["experience", "Timeline"],
  ["global-impact", "Impact"],
  ["education", "Education"],
  ["contact", "Contact"],
];

const FEATURE_CARDS = [
  {
    icon: <FiBarChart2 />,
    title: "Data-Led Surveillance",
    text: "Monitoring systems designed for faster detection, clearer reporting, and timely action.",
  },
  {
    icon: <FaHeartbeat />,
    title: "CMAM Clinical Leadership",
    text: "Hands-on oversight of SAM and MAM pathways, therapeutic feeding, and case review.",
  },
  {
    icon: <FiGlobe />,
    title: "Cross-Sector Coordination",
    text: "Integrated nutrition, WASH, and community systems aligned around shared outcomes.",
  },
  {
    icon: <FiGlobe />,
    title: "Global Program Delivery",
    text: "Field experience across multiple settings, agencies, and operational contexts.",
  },
];

const PROFILE_FACTS = [
  ["Specialty", "Human nutrition, acute malnutrition, and public health coordination"],
  ["Strength", "Clinical supervision, field operations, and data quality"],
  ["Style", "Calm, accountable, and outcome-driven collaboration"],
];

const COMPETENCIES = [
  "Acute Malnutrition (CMAM)",
  "Public Health Programming",
  "SAM/MAM Case Management",
  "Nutrition Surveillance",
  "WASH Integration",
  "Team Supervision",
  "Monitoring and Reporting",
  "Cross-Cultural Coordination",
];

const PROJECTS = [
  {
    icon: "🔗",
    category: "Integration",
    title: "WASH-Nutrition Integration Pilot",
    desc: "Cross-functional implementation protocol linking sanitation and outcomes.",
  },
  {
    icon: "📊",
    category: "Monitoring",
    title: "CMAM Operations Dashboard",
    desc: "Program monitoring model for early warning and high-risk caseload triage.",
  },
  {
    icon: "🧾",
    category: "Data Quality",
    title: "Nutrition Data Quality Initiative",
    desc: "Field data workflow redesign for cleaner reporting and faster analytics.",
  },
  {
    icon: "👥",
    category: "Capacity Building",
    title: "Humanitarian Workforce Training",
    desc: "Capacity-building curriculum for frontline staff and supervisors.",
  },
];

const SOCIAL_MODULES = [
  {
    label: "Email",
    href: "mailto:thowjdeng@gmail.com",
    Icon: FiMail,
    accent: "email",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/stev.enthow?igsh=YTdoZHMwZnRzcjUz",
    Icon: FaInstagram,
    accent: "instagram",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1RwBXTYBaF/",
    Icon: FaFacebookF,
    accent: "facebook",
  },
];

const TIMELINE = [
  {
    role: "Nutrition Supervisor",
    org: "Action Against Hunger - Pugnido 2 Refugee Camp",
    date: "2019-2021",
    points: [
      "Led frontline nutrition teams delivering SAM/MAM services.",
      "Enforced quality standards aligned with international protocols.",
      "Integrated WASH coordination into core nutrition programming.",
    ],
  },
  {
    role: "Nutrition Intern - Stabilization Center",
    org: "Adare Hospital, Hawassa",
    date: "Mar 2025",
    points: [
      "Managed complicated SAM cases under clinical supervision.",
      "Applied therapeutic feeding protocols in inpatient settings.",
      "Contributed to multidisciplinary patient assessments.",
    ],
  },
  {
    role: "Nutrition Data and Analysis Intern",
    org: "Sidama Public Health Institute",
    date: "Apr-May 2025",
    points: [
      "Executed nutrition data collection and analytical reporting.",
      "Supported evidence-based planning across public health programs.",
      "Improved reporting clarity for institutional stakeholders.",
    ],
  },
];

const IMPACT = [
  ["50,000+", "Beneficiaries"],
  ["3", "Countries"],
  ["12+", "Programs"],
  ["100+", "Workers Trained"],
];

const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "rr76iLUBpXiBeYrGh";
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_2xhgsri";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_xf55sff";

function App() {
  const [lightMode, setLightMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [formStatus, setFormStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [particlesReady, setParticlesReady] = useState(false);
  const globeRef = useRef(null);
  const glowRef = useRef(null);
  const profileRef = useRef(null);

  const particlesOptions = useMemo(
    () => ({
      fpsLimit: 60,
      background: { color: { value: "transparent" } },
      particles: {
        number: { value: 80, density: { enable: true, area: 800 } },
        color: {
          value: lightMode
            ? ["#1f2937", "#316ed6", "#22d3ee"]
            : ["#ffffff", "#a0c4ff", "#d0f4f7"],
        },
        shape: { type: "circle" },
        opacity: { value: { min: 0.3, max: 0.65 } },
        size: { value: { min: 1.2, max: 3.6 } },
        links: {
          enable: true,
          distance: 120,
          color: lightMode ? "#1f2937" : "#ffffff",
          opacity: lightMode ? 0.18 : 0.3,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.65,
          direction: "none",
          random: true,
          straight: false,
          outModes: { default: "out" },
          attract: {
            enable: true,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: { enable: true, mode: "attract" },
          onClick: { enable: false },
        },
        modes: {
          attract: { distance: 200, duration: 0.3, factor: 1 },
        },
      },
      detectRetina: true,
    }),
    [lightMode]
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.className = lightMode ? "light" : "dark";
  }, [lightMode]);

  useEffect(() => {
    const sections = [...document.querySelectorAll("section[id]")];
    const onScroll = () => {
      let current = "home";
      for (const section of sections) {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) {
          current = section.id;
        }
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.18 }
    );

    const revealables = document.querySelectorAll(".reveal");
    revealables.forEach((el) => observer.observe(el));

    return () => {
      revealables.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setParticlesReady(true));
  }, []);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const onMove = (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const profile = profileRef.current;
    if (!profile) return;

    const setInteraction = (clientX, clientY) => {
      const rect = profile.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      const clampX = Math.min(Math.max(x, 0), 1);
      const clampY = Math.min(Math.max(y, 0), 1);
      profile.style.setProperty("--px", `${clampX}`);
      profile.style.setProperty("--py", `${clampY}`);
      profile.classList.add("is-interacting");
    };

    const onPointerMove = (event) => {
      setInteraction(event.clientX, event.clientY);
    };

    const onTouchMove = (event) => {
      const touch = event.touches[0];
      if (touch) setInteraction(touch.clientX, touch.clientY);
    };

    const onLeave = () => {
      profile.classList.remove("is-interacting");
      profile.style.setProperty("--px", "0.5");
      profile.style.setProperty("--py", "0.5");
    };

    onLeave();
    profile.addEventListener("pointermove", onPointerMove);
    profile.addEventListener("touchmove", onTouchMove, { passive: true });
    profile.addEventListener("pointerleave", onLeave);
    profile.addEventListener("touchend", onLeave);

    return () => {
      profile.removeEventListener("pointermove", onPointerMove);
      profile.removeEventListener("touchmove", onTouchMove);
      profile.removeEventListener("pointerleave", onLeave);
      profile.removeEventListener("touchend", onLeave);
    };
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;

    const container = globeRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 6.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const textureLoader = new THREE.TextureLoader();
    const earthMap = textureLoader.load(
      "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
    );
    const earthNormalMap = textureLoader.load(
      "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg"
    );
    const earthSpecularMap = textureLoader.load(
      "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg"
    );
    const cloudMap = textureLoader.load(
      "https://threejs.org/examples/textures/planets/earth_clouds_1024.png"
    );

    earthMap.colorSpace = THREE.SRGBColorSpace;
    cloudMap.colorSpace = THREE.SRGBColorSpace;

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    const key = new THREE.PointLight(0x8ef2ff, 1.8, 100);
    key.position.set(5, 4, 7);
    const rim = new THREE.PointLight(lightMode ? 0xffd7a8 : 0x5f7bff, 1.3, 80);
    rim.position.set(-6, -1, -4);
    scene.add(ambient, key, rim);

    const globeMaterial = new THREE.MeshPhysicalMaterial({
      map: earthMap,
      normalMap: earthNormalMap,
      normalScale: new THREE.Vector2(0.45, 0.45),
      metalness: 0.08,
      roughness: 0.78,
      clearcoat: 0.18,
      clearcoatRoughness: 0.72,
      specularIntensity: 0.45,
      specularColor: lightMode ? 0xaed6ff : 0x9bc9ff,
    });

    const globe = new THREE.Mesh(new THREE.SphereGeometry(2.05, 96, 96), globeMaterial);
    group.add(globe);

    const specularShell = new THREE.Mesh(
      new THREE.SphereGeometry(2.052, 96, 96),
      new THREE.MeshPhongMaterial({
        map: earthMap,
        specularMap: earthSpecularMap,
        shininess: 12,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
      })
    );
    group.add(specularShell);

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(2.105, 96, 96),
      new THREE.MeshStandardMaterial({
        map: cloudMap,
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
      })
    );
    group.add(clouds);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.16, 96, 96),
      new THREE.MeshBasicMaterial({
        color: lightMode ? 0x7ccfff : 0x7be8ff,
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
      })
    );
    group.add(atmosphere);

    const aura = new THREE.Mesh(
      new THREE.SphereGeometry(2.32, 64, 64),
      new THREE.MeshBasicMaterial({
        color: lightMode ? 0x6d9dff : 0x66ffe0,
        transparent: true,
        opacity: 0.05,
        side: THREE.BackSide,
      })
    );
    group.add(aura);

    const markerData = [
      [8.5, 33.0, 0xffb347],
      [7.5, 34.5, 0xff6f61],
      [15.0, 30.0, 0x66ffc2],
      [-1.0, 30.0, 0x8ef2ff],
    ];

    markerData.forEach(([lat, lon, color]) => {
      const latR = (lat * Math.PI) / 180;
      const lonR = (lon * Math.PI) / 180;
      const radius = 2.09;
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 20, 20),
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.25 })
      );
      marker.position.set(
        radius * Math.cos(latR) * Math.cos(lonR),
        radius * Math.sin(latR),
        radius * Math.cos(latR) * Math.sin(lonR)
      );
      group.add(marker);
    });

    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(2.65, 0.02, 16, 240),
      new THREE.MeshBasicMaterial({
        color: lightMode ? 0x9fd2ff : 0x8ef2ff,
        transparent: true,
        opacity: 0.28,
      })
    );
    orbit.rotation.x = 1.08;
    orbit.rotation.z = 0.45;
    group.add(orbit);

    const animate = () => {
      group.rotation.y += 0.0009;
      globe.rotation.z += 0.00012;
      clouds.rotation.y += 0.0011;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    let animationId = requestAnimationFrame(animate);

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationId);
      earthMap.dispose();
      earthNormalMap.dispose();
      earthSpecularMap.dispose();
      cloudMap.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, [lightMode]);

  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY) {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormStatus({ type: "", text: "" });
    const form = event.currentTarget;

    const data = new FormData(event.currentTarget);
    const payload = {
      name: data.get("name")?.toString().trim(),
      email: data.get("email")?.toString().trim(),
      subject: data.get("subject")?.toString().trim(),
      message: data.get("message")?.toString().trim(),
      time: new Date().toLocaleString(),
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setFormStatus({ type: "error", text: "Please complete all fields." });
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
    if (!isValidEmail) {
      setFormStatus({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      setFormStatus({
        type: "error",
        text: "Message service is not configured. Please set EmailJS environment variables.",
      });
      return;
    }

    setSending(true);
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload);
      if (form && typeof form.reset === "function") {
        form.reset();
      }
      setFormStatus({
        type: "success",
        text: "Your message has been successfully received. Thank you for reaching out; I will respond at the earliest opportunity.",
      });
    } catch (error) {
      console.error("EmailJS send failed:", error);

      const raw = `${error?.text || error?.message || ""}`.toLowerCase();
      let message = "Message failed. Try again later.";

      if (raw.includes("origin") || raw.includes("domain") || raw.includes("not allowed")) {
        message = "Message failed: this website domain is not allowed in EmailJS settings.";
      } else if (raw.includes("service") || raw.includes("template") || raw.includes("public key") || raw.includes("user id")) {
        message = "Message failed: EmailJS service/template/public key is invalid.";
      } else if (raw.includes("quota") || raw.includes("limit") || raw.includes("too many")) {
        message = "Message failed: EmailJS sending limit reached.";
      }

      setFormStatus({ type: "error", text: message });
    } finally {
      setSending(false);
    }
  };

  const smoothJump = (id) => {
    const target = document.getElementById(id);
    if (!target) {
      setMenuOpen(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
      setMenuOpen(false);
      return;
    }

    const headerOffset = 110;
    const startY = window.scrollY;
    const targetY = target.getBoundingClientRect().top + startY - headerOffset;
    const distance = targetY - startY;
    const duration = 760;
    let startTime = null;

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo({ top: startY + distance * eased });

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
    setMenuOpen(false);
  };

  return (
    <>
      {particlesReady ? (
        <Particles id="tsparticles" className="particle-layer" options={particlesOptions} />
      ) : null}
      <div className="cursor-glow" ref={glowRef} aria-hidden="true" />
      <div className="collab-badge glass" role="status" aria-live="polite">
        Portfolio currently open for collaboration, internships, and career opportunities in Human
        Nutrition, Global Health, and related digital solutions.
      </div>

      <header className="topbar glass">
        <button
          className="logo"
          type="button"
          onClick={() => smoothJump("home")}
          aria-label="Scroll to Home"
        >
          <FiGlobe /> <span>TDY</span>
        </button>

        <nav className="desktop-nav" aria-label="Primary">
          {NAV_ITEMS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={active === id ? "active" : ""}
              onClick={() => smoothJump(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <button
          className="mode-toggle"
          type="button"
          onClick={() => setLightMode((state) => !state)}
          aria-label="Toggle color mode"
        >
          {lightMode ? <FiMoon /> : <FiSun />}
        </button>
      </header>

      <button
        className="mobile-dot-menu"
        type="button"
        aria-expanded={menuOpen}
        aria-label="Open mobile menu"
        onClick={() => setMenuOpen((state) => !state)}
      >
        <span />
        <span />
        <span />
      </button>

      <aside className={`mobile-panel ${menuOpen ? "open" : ""}`}>
        {NAV_ITEMS.map(([id, label]) => (
          <button key={id} type="button" onClick={() => smoothJump(id)}>
            {label}
          </button>
        ))}
      </aside>

      <main>
        <section id="home" className="hero section">
          <div className="hero-glow" />
          <div className="container hero-wrap">
            <aside className="portrait reveal portrait-hero">
              <div className="portrait-image glass">
                <img
                  src="https://i.postimg.cc/Tw724Ht0/5874999714988625229-(1).jpg"
                  alt="Thow Deng Yuel"
                />
              </div>
              <div className="portrait-card glass">
                <p className="portrait-card__eyebrow">Profile Snapshot</p>
                <h3>Nutrition supervisor and field coordinator</h3>
                <p>
                  Experienced in CMAM delivery, program reporting, and collaboration with
                  multidisciplinary teams.
                </p>
              </div>
            </aside>

            <article className="hero-content reveal">
              <p className="eyebrow">HUMAN NUTRITION AND GLOBAL HEALTH</p>
              <h1>Thow Deng Yuel</h1>
              <h2>Humanitarian nutrition professional focused on measurable impact.</h2>
              <p>
                I design and support nutrition programs that combine clinical rigor, field
                leadership, and data-informed decision-making in humanitarian settings.
              </p>
              <div className="hero-cta">
                <a
                  className="btn primary"
                  href="https://drive.google.com/file/d/1VAhdk7DPscXd11ZwlIcVkkR_dyyiVNpf/view"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FiDownload /> View CV
                </a>
                <button className="btn ghost" type="button" onClick={() => smoothJump("contact")}>
                  <FiSend /> Connect
                </button>
              </div>
            </article>
          </div>
          <button className="scroll-hint" type="button" onClick={() => smoothJump("profile")}>
            Explore <FiArrowDown />
          </button>
        </section>

        <section id="profile" className="section profile-section" ref={profileRef}>
          <div className="container reveal">
            <div className="section-head">
              <p>PROFILE</p>
              <h3>Professional identity</h3>
              <p className="section-lead">
                A concise summary of training, field leadership, and collaborative working style.
              </p>
            </div>
            <article className="glass panel section-shell profile-grid">
              <div className="profile-story">
                <p>
                  Results-oriented Human Nutrition professional (CGPA: 3.61/4.00) with proven
                  leadership in humanitarian programming, clinical case management, and public
                  health information systems.
                </p>
                <p>
                  Demonstrated capacity to manage acute malnutrition interventions, coordinate
                  multidisciplinary teams, and integrate WASH and community health strategies in
                  refugee and facility-based settings.
                </p>
              </div>
              <div className="profile-facts">
                {PROFILE_FACTS.map(([label, value]) => (
                  <div key={label} className="profile-fact">
                    <span>{label}</span>
                    <p>{value}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section id="features" className="section tone">
          <div className="container reveal">
            <div className="section-head">
              <p>HIGHLIGHTS</p>
              <h3>Core strengths</h3>
              <p className="section-lead">
                Selected capabilities that shape the way I plan, supervise, and deliver work.
              </p>
            </div>
            <div className="grid cards4">
              {FEATURE_CARDS.map((feature) => (
                <article key={feature.title} className="glass card">
                  <div className="icon">{feature.icon}</div>
                  <h4>{feature.title}</h4>
                  <p>{feature.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="competencies" className="section">
          <div className="container reveal">
            <div className="section-head">
              <p>EXPERTISE</p>
              <h3>Competencies</h3>
              <p className="section-lead">
                Technical and leadership capabilities that support nutrition program delivery.
              </p>
            </div>
            <div className="grid competency-grid">
              {COMPETENCIES.map((item) => (
                <article key={item} className="glass skill">
                  <FiCheckCircle />
                  <span>{item}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="section tone">
          <div className="container reveal">
            <div className="section-head">
              <p>PORTFOLIO</p>
              <h3>Selected projects</h3>
              <p className="section-lead">
                Concept work and delivery examples shaped around public health, reporting, and
                workflow quality.
              </p>
            </div>
            <div className="projects-grid">
              {loaded
                ? PROJECTS.map((project, index) => (
                    <article key={project.title} className="project-card glass">
                      <div className="project-symbol" aria-hidden="true">
                        {project.icon}
                      </div>
                      <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
                      <span className="project-category">{project.category}</span>
                      <h4>{project.title}</h4>
                      <p>{project.desc}</p>
                    </article>
                  ))
                : [...Array(4)].map((_, index) => <div key={index} className="skeleton glass" />)}
            </div>
          </div>
        </section>

        <section id="experience" className="section">
          <div className="container reveal">
            <div className="section-head">
              <p>CAREER</p>
              <h3>Professional timeline</h3>
              <p className="section-lead">
                Roles that show progression across humanitarian delivery, clinical support, and
                public health analysis.
              </p>
            </div>
            <div className="timeline">
              {TIMELINE.map((item) => (
                <article key={item.role} className="glass line-item">
                  <div className="line-dot" />
                  <div>
                    <div className="line-head">
                      <h4>{item.role}</h4>
                      <span>{item.date}</span>
                    </div>
                    <p className="org">{item.org}</p>
                    <ul>
                      {item.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="global-impact" className="section tone">
          <div className="container reveal">
            <div className="section-head">
              <p>GLOBAL IMPACT</p>
              <h3>Reach and outcomes</h3>
              <p className="section-lead">
                A snapshot of scale, geography, and training delivery across field programs.
              </p>
            </div>
            <div className="impact-summary glass">
              Built through field service, reliable reporting, and collaborative implementation.
            </div>
            <div className="globe glass">
              <div ref={globeRef} className="globe-stage" />
            </div>
            <div className="grid impact-grid">
              {IMPACT.map(([num, label]) => (
                <article key={label} className="glass impact-card">
                  <h4>{num}</h4>
                  <p>{label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="section">
          <div className="container reveal">
            <div className="section-head">
              <p>EDUCATION</p>
              <h3>Education</h3>
              <p className="section-lead">
                Academic background supporting practice in nutrition, care, and public health.
              </p>
            </div>
            <div className="education-stack">
              <article className="glass edu edu-current">
                <div className="edu-marker">
                  <FaUserGraduate />
                </div>
                <div className="edu-body">
                  <p className="edu-label">Current Degree</p>
                  <h4>B.Sc. Human Nutrition</h4>
                  <p>Hawassa University, Ethiopia</p>
                  <small>2022-2025 | CGPA 3.61/4.00</small>
                </div>
              </article>

              <article className="glass edu">
                <div className="edu-marker">
                  <FaSchool />
                </div>
                <div className="edu-body">
                  <p className="edu-label">Foundational Education</p>
                  <h4>Secondary Education</h4>
                  <p>DICAC-RADD High School</p>
                  <small>Pugnido Refugee Camp | 2018-2022</small>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="contact" className="section tone">
          <div className="container reveal">
            <div className="section-head">
              <p>CONTACT</p>
              <h3>Let’s connect</h3>
              <p className="section-lead">
                Open to professional conversations, program collaboration, and field opportunities.
              </p>
            </div>
            <div className="contact-wrap">
              <aside className="contact-cards">
                <article className="glass mini">
                  <FiPhone />
                  <a href="tel:+251977427821">+251 977 427 821</a>
                  <a href="tel:+251991768409">+251 991 768 409</a>
                </article>
                <article className="glass social-panel">
                  <div className="social-panel-head" aria-label="Social presence">
                    <span className="presence-status" title="Active online presence" aria-label="Active online presence">
                      <i aria-hidden="true" />
                    </span>
                  </div>
                  <div className="social-module-grid">
                    {SOCIAL_MODULES.map(({ label, href, Icon, accent }) => (
                      <a
                        key={label}
                        className={`social-module ${accent}`}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        title="Open social profile"
                        aria-label={`${label} profile`}
                      >
                        <span className="module-icon">
                          <Icon />
                        </span>
                        <span className="sr-only">{label}</span>
                      </a>
                    ))}
                  </div>
                </article>
              </aside>

              <form className="glass contact-form" onSubmit={onSubmit}>
                <input name="name" type="text" placeholder="Your Name" required />
                <input name="email" type="email" placeholder="Email Address" required />
                <input name="subject" type="text" placeholder="Subject" required />
                <textarea name="message" rows="5" placeholder="Your Message" required />

                {formStatus.text ? (
                  <p className={`form-status ${formStatus.type}`}>{formStatus.text}</p>
                ) : null}

                <button type="submit" className="btn primary block" disabled={sending}>
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Copyright 2026 Thow Deng Yuel | Human Nutrition and Global Health</p>
      </footer>
    </>
  );
}

export default App;
