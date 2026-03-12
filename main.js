(function() {
  'use strict';

  // ==================== LOADING SCREEN ====================
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingBar = document.getElementById('loadingBar');
  const profileImage = document.getElementById('profileImage');
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 30;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => loadingScreen?.classList.add('fade-out'), 500);
    }
    if (loadingBar) loadingBar.style.width = progress + '%';
  }, 200);

  if (profileImage) {
    profileImage.onload = () => {
      if (progress >= 100) loadingScreen?.classList.add('fade-out');
    };
  }

  // ==================== THEME TOGGLE ====================
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
  });

  // ==================== NAVBAR ====================
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    // active link
    let current = '';
    document.querySelectorAll('section[id]').forEach(section => {
      const top = section.offsetTop - 100;
      const bottom = top + section.clientHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });

  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('active');
      navToggle?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ==================== PARTICLE CANVAS ====================
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];
    const particleCount = 150;

    function initParticles() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 2 + 1,
          color: `rgba(0, 224, 255, ${Math.random() * 0.3 + 0.1})`
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });
      requestAnimationFrame(drawParticles);
    }

    initParticles();
    drawParticles();
    window.addEventListener('resize', initParticles);
  }

  // ==================== INTERACTIVE 3D GLOBE ====================
  const globeCanvas = document.getElementById('globeCanvas');
  if (globeCanvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    const camera = new THREE.PerspectiveCamera(45, globeCanvas.clientWidth / globeCanvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 15);
    const renderer = new THREE.WebGLRenderer({ canvas: globeCanvas, antialias: true, alpha: true });
    renderer.setSize(globeCanvas.clientWidth, globeCanvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Lights
    const ambient = new THREE.AmbientLight(0x404060);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);
    const pointLight = new THREE.PointLight(0x00e0ff, 0.8);
    pointLight.position.set(-3, 2, 5);
    scene.add(pointLight);

    // Earth
    const geometry = new THREE.SphereGeometry(5, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    const material = new THREE.MeshPhongMaterial({ map: earthTexture, shininess: 5 });
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Markers
    const markers = [
      { lat: 8.5, lon: 33.0, color: 0xffaa00, name: 'South Sudan' },
      { lat: 7.5, lon: 34.5, color: 0xff5500, name: 'Ethiopia' },
      { lat: 15.0, lon: 30.0, color: 0x00ffaa, name: 'Sudan' },
      { lat: -1.0, lon: 30.0, color: 0x00e0ff, name: 'Rwanda' }
    ];
    const markerGroup = [];
    markers.forEach(pos => {
      const lat = pos.lat * Math.PI / 180;
      const lon = pos.lon * Math.PI / 180;
      const radius = 5.1;
      const x = radius * Math.cos(lat) * Math.cos(lon);
      const y = radius * Math.sin(lat);
      const z = radius * Math.cos(lat) * Math.sin(lon);
      const markerGeom = new THREE.SphereGeometry(0.15, 16, 16);
      const markerMat = new THREE.MeshStandardMaterial({ color: pos.color, emissive: pos.color, emissiveIntensity: 0.8 });
      const marker = new THREE.Mesh(markerGeom, markerMat);
      marker.position.set(x, y, z);
      marker.userData = { name: pos.name, originalColor: pos.color };
      scene.add(marker);
      markerGroup.push(marker);
    });

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    globeCanvas.addEventListener('mousemove', (event) => {
      const rect = globeCanvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    });

    function animate() {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.001;

      // Marker hover effect
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markerGroup);
      markerGroup.forEach(m => m.scale.set(1, 1, 1));
      if (intersects.length > 0) {
        intersects[0].object.scale.set(1.5, 1.5, 1.5);
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = globeCanvas.clientWidth / globeCanvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(globeCanvas.clientWidth, globeCanvas.clientHeight);
    });
  }

  // ==================== SCROLL REVEAL ====================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.2, rootMargin: '0px' });
  document.querySelectorAll('.section, .competency-card, .timeline-item, .impact-card, .education-card, .contact-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
  });

  // ==================== EMAILJS CONTACT FORM ====================
  (function() {
    // 🔑 Your EmailJS credentials
    const EMAILJS_PUBLIC_KEY = 'rr76iLUBpXiBeYrGh';
    const EMAILJS_SERVICE_ID = 'service_2xhgsri';
    const EMAILJS_TEMPLATE_ID = 'template_xf55sff';
    
    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);
    
    // Get form elements
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');
    
    // Create status div if it doesn't exist
    if (!formStatus && contactForm) {
      const statusDiv = document.createElement('div');
      statusDiv.id = 'formStatus';
      statusDiv.className = 'form-group';
      statusDiv.style.display = 'none';
      contactForm.appendChild(statusDiv);
    }
    
    if (contactForm) {
      contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        
        // Validate elements exist
        if (!nameInput || !emailInput || !subjectInput || !messageInput) {
          console.error('Form elements not found');
          showStatus('Form configuration error', 'error');
          return;
        }
        
        const formData = {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          subject: subjectInput.value.trim(),
          message: messageInput.value.trim(),
          time: new Date().toLocaleString()
        };
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
          showStatus('Please fill in all fields', 'error');
          return;
        }
        
        if (!isValidEmail(formData.email)) {
          showStatus('Please enter a valid email address', 'error');
          return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
          // Send email using EmailJS
          const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            formData
          );
          
          if (response.status === 200) {
            // Success
            showStatus('✨ Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
          } else {
            throw new Error('Failed to send message');
          }
        } catch (error) {
          console.error('EmailJS Error:', error);
          showStatus('❌ Failed to send message. Please try again later.', 'error');
        } finally {
          // Reset button state
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }
      });
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
    
    // Helper function to show status messages
    function showStatus(message, type) {
      const statusDiv = document.getElementById('formStatus');
      if (statusDiv) {
        statusDiv.style.display = 'block';
        statusDiv.textContent = message;
        statusDiv.className = `form-group form-status ${type}`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          statusDiv.style.display = 'none';
        }, 5000);
      } else {
        alert(message); // Fallback
      }
    }
  })();

  // ==================== DOWNLOAD CV ====================
  // The CV button is a normal link with download attribute, no JS needed.
  // We keep this comment for clarity.

})();