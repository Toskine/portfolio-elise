// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Smooth reveal animation using Intersection Observer
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Dynamic Gallery Generation using Vite Glob
const galleryGrid = document.getElementById('gallery-grid');
if (galleryGrid) {
  const folder = galleryGrid.getAttribute('data-folder');
  let imagesObj = {};
  
  // Vite va lire le contenu de ces dossiers au moment du build
  if (folder === 'images') {
    imagesObj = import.meta.glob('./assets/images/*.{jpg,jpeg,png}', { query: '?url', import: 'default', eager: true });
  } else if (folder === 'vendues') {
    imagesObj = import.meta.glob('./assets/vendues/*.{jpg,jpeg,png}', { query: '?url', import: 'default', eager: true });
  }

  const imageUrls = Object.values(imagesObj);

  imageUrls.forEach((url, index) => {
    const title = `Œuvre ${index + 1}`;
    const subtitle = folder === 'vendues' ? "Vendue" : "Peinture d'Élise";

    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <img src="${url}" alt="${title}" loading="lazy" class="gallery-image">
      <div class="overlay">
        <h3>${title}</h3>
        <p>${subtitle}</p>
      </div>
    `;
    galleryGrid.appendChild(item);
  });
}

// Apply reveal styles initially and observe
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.gallery-item, .about-container, .contact-form').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
  });
});

// Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('lightbox-close');

if (lightbox && lightboxImg && closeBtn) {
  if (galleryGrid) {
    galleryGrid.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (item) {
        const img = item.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden'; // prevent scroll
        }
      }
    });
  }

  closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
}

// Contact Form Logic
document.getElementById('contact-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const submitButton = this.querySelector('button[type="submit"]');
  const originalText = submitButton.innerText;
  submitButton.innerText = 'Envoi en cours...';
  submitButton.disabled = true;

  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-message').value;
  
  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: "624bbf65-3135-4e39-b3ec-cca48dba84c0", 
        name: name,
        email: email,
        message: message,
        subject: `Nouveau message de ${name} sur le Portfolio`,
        from_name: "Portfolio Élise"
      }),
    });
    
    const result = await response.json();
    if (result.success) {
      alert("Merci ! Votre message a bien été envoyé.");
      this.reset();
    } else {
      alert("Une erreur est survenue lors de l'envoi.");
    }
  } catch (error) {
    alert("Erreur de connexion.");
  } finally {
    submitButton.innerText = originalText;
    submitButton.disabled = false;
  }
});
