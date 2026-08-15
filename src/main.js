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
const galleryGrids = document.querySelectorAll('.gallery-grid');
if (galleryGrids.length > 0) {
  galleryGrids.forEach(galleryGrid => {
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

      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-item';

      const img = document.createElement('img');
      img.src = url;
      img.alt = title;

      const overlay = document.createElement('div');
      overlay.className = 'overlay';

      const h3 = document.createElement('h3');
      h3.textContent = title;

      const p = document.createElement('p');
      p.textContent = folder === 'vendues' ? 'Vendue' : 'Acrylique sur toile';

      overlay.appendChild(h3);
      overlay.appendChild(p);

      galleryItem.appendChild(img);
      galleryItem.appendChild(overlay);

      galleryGrid.appendChild(galleryItem);
    });
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
const lightboxWrapper = document.getElementById('lightbox-wrapper');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

let isZoomed = false;

function closeLightbox() {
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
  isZoomed = false;
  if(lightboxWrapper) {
    lightboxWrapper.classList.remove('zoomed');
    lightboxImg.style.transformOrigin = 'center center';
  }
}

if (lightbox && lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    // Si on clique en dehors de l'image (sur le fond noir)
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  if (lightboxWrapper) {
    lightboxWrapper.addEventListener('click', (e) => {
      e.stopPropagation();
      isZoomed = !isZoomed;
      if (isZoomed) {
        lightboxWrapper.classList.add('zoomed');
        updateZoomOrigin(e);
      } else {
        lightboxWrapper.classList.remove('zoomed');
        lightboxImg.style.transformOrigin = 'center center';
      }
    });

    lightboxWrapper.addEventListener('mousemove', (e) => {
      if (isZoomed) {
        updateZoomOrigin(e);
      }
    });
  }
}

function updateZoomOrigin(e) {
  if (!lightboxWrapper || !lightboxImg) return;
  const rect = lightboxWrapper.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  lightboxImg.style.transformOrigin = `${x}% ${y}%`;
}

if (galleryGrids.length > 0) {
  galleryGrids.forEach(galleryGrid => {
    galleryGrid.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (item) {
        const img = item.querySelector('img');
        if (img && lightbox && lightboxImg) {
          lightboxImg.src = img.src;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden'; // prevent scroll
        }
      }
    });
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
