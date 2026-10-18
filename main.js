/**
 * ==========================================================================
 * MAIN.JS - Interactividad General, Tema, Modales, Formularios y GitHub API
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. GESTIÓN DE TEMA CLARO/OSCURO CON PERSISTENCIA Y SERIALIZACIÓN JSON
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  const THEME_STORAGE_KEY = 'user_theme_preference';

  function getSavedTheme() {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      return stored ? JSON.parse(stored) : 'light';
    } catch (e) {
      console.warn('Error al leer el tema de localStorage:', e);
      return 'light';
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    } catch (e) {
      console.warn('Error al guardar el tema en localStorage:', e);
    }
  }

  function updateThemeUI(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'dark') {
      if (themeIcon) themeIcon.textContent = '☀️';
      if (themeText) themeText.textContent = 'Modo Claro';
      themeToggleBtn.setAttribute('aria-pressed', 'true');
    } else {
      if (themeIcon) themeIcon.textContent = '🌙';
      if (themeText) themeText.textContent = 'Modo Oscuro';
      themeToggleBtn.setAttribute('aria-pressed', 'false');
    }
  }

  const initialTheme = getSavedTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);
  updateThemeUI(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      saveTheme(newTheme);
      updateThemeUI(newTheme);
    });
  }


  // ==========================================================================
  // 2. CONTROL DEL MODAL <dialog> CON ACCESIBILIDAD
  // ==========================================================================
  const dialog = document.querySelector('.info-dialog');
  if (dialog) {
    setTimeout(() => {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      }
    }, 700);

    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        dialog.close();
      }
    });
  }


  // ==========================================================================
  // 3. MENÚ HAMBURGUESA RESPONSIVO CON WAI-ARIA
  // ==========================================================================
  const hamburgerBtn = document.getElementById('hamburger-toggle');
  const navMenu = document.getElementById('primary-navigation');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      hamburgerBtn.classList.toggle('active');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);

      if (isOpen) {
        hamburgerBtn.setAttribute('aria-label', 'Cerrar menú de navegación');
      } else {
        hamburgerBtn.setAttribute('aria-label', 'Abrir menú de navegación');
      }
    });

    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          hamburgerBtn.classList.remove('active');
          hamburgerBtn.setAttribute('aria-expanded', 'false');
          hamburgerBtn.setAttribute('aria-label', 'Abrir menú de navegación');
        }
      });
    });
  }

  // Activar dinámicamente el enlace según la página actual
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.main-nav a');

  allNavLinks.forEach(link => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');

    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });


  // ==========================================================================
  // 4. BUSCADOR CON REDIRECCIÓN GARANTIZADA (MOUSEDOWN / CLICK)
  // ==========================================================================
  const searchInput = document.getElementById('dynamic-search');
  const resultsList = document.getElementById('search-results-list');

  const siteNavigationData = Object.freeze([
    { title: 'Inicio / Bienvenida', url: 'index.html', category: 'Página', keywords: ['inicio', 'home', 'bienvenida', 'camila'] },
    { title: 'Acerca de mí', url: 'acerca_de_mi.html', category: 'Biografía', keywords: ['acerca', 'biografia', 'sobre mi', 'intereses'] },
    { title: 'Perfil Profesional', url: 'perfil_profesional.html', category: 'Perfil', keywords: ['perfil', 'resumen', 'ingeniera', 'sistemas'] },
    { title: 'Formación Académica', url: 'formacion_academica.html', category: 'Educación', keywords: ['educacion', 'colegio', 'universidad', 'ucb', 'bachiller'] },
    { title: 'Experiencia Profesional', url: 'experiencia_profesional.html', category: 'Experiencia', keywords: ['experiencia', 'trabajo', 'trayectoria', 'desarrollo'] },
    { title: 'Habilidades Técnicas', url: 'habilidades.html', category: 'Skills', keywords: ['habilidades', 'skills', 'java', 'c++', 'python', 'postgresql', 'css', 'html', 'javascript'] },
    { title: 'Cursos y Capacitaciones', url: 'cursos.html', category: 'Cursos', keywords: ['cursos', 'certificados', 'capacitacion', 'estudios'] },
    { title: 'Idiomas', url: 'idiomas.html', category: 'Idiomas', keywords: ['idiomas', 'ingles', 'ruso', 'chino', 'espanol'] },
    { title: 'Proyectos Destacados', url: 'proyectos.html', category: 'Proyectos', keywords: ['proyectos', 'tienda virtual', 'ballet ucb', 'recursividad', 'juego python'] },
    { title: 'Portafolio Multimedia', url: 'portafolio.html', category: 'Portafolio', keywords: ['portafolio', 'videos', 'galeria', 'audios'] },
    { title: 'Formulario de Contacto', url: 'formulario.html', category: 'Contacto', keywords: ['contacto', 'mensaje', 'correo', 'email', 'telefono', 'conta'] }
  ]);

  if (searchInput && resultsList) {
    const getFilteredSuggestions = (collection, query) => {
      const term = query.toLowerCase().trim();
      if (!term) return [];

      return collection
        .filter(item => 
          item.title.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          item.keywords.some(kw => kw.toLowerCase().includes(term))
        )
        .map(item => ({ ...item }));
    };

    const renderDropdown = (items) => {
      if (items.length === 0) {
        resultsList.innerHTML = `<li class="search-item" style="padding: 14px 20px; color: var(--text-muted, #b1a3c7);">No se encontraron páginas.</li>`;
        resultsList.classList.add('active');
        return;
      }

      resultsList.innerHTML = items.map(item => `
        <li class="search-item">
          <a href="${item.url}">
            <span>🔍 ${item.title}</span>
            <span class="search-item-badge">${item.category}</span>
          </a>
        </li>
      `).join('');

      resultsList.classList.add('active');
    };

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      if (query.trim() === '') {
        resultsList.classList.remove('active');
        resultsList.innerHTML = '';
        return;
      }

      const filtered = getFilteredSuggestions(siteNavigationData, query);
      renderDropdown(filtered);
    });

    resultsList.addEventListener('mousedown', (e) => {
      const link = e.target.closest('a');
      if (link) {
        const url = link.getAttribute('href');
        if (url) {
          window.location.href = url;
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !resultsList.contains(e.target)) {
        resultsList.classList.remove('active');
      }
    });
  }


  // ==========================================================================
  // 5. VALIDACIÓN EN TIEMPO REAL E INTERCEPCIÓN DEL FORMULARIO DE CONTACTO
  // ==========================================================================
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    const motivoInput = document.getElementById('motivo');
    const mensajeInput = document.getElementById('mensaje');
    const confirmacionInput = document.getElementById('confirmacion');
    const successAlert = document.getElementById('form-success-alert');

    const validateField = (input) => {
      if (!input) return true;
      const errorSpan = document.getElementById(`error-${input.id}`);

      if (input.type === 'checkbox') {
        if (!input.checked) {
          if (errorSpan) errorSpan.textContent = 'Debes aceptar la confirmación antes de enviar.';
          input.classList.add('invalid');
          return false;
        } else {
          if (errorSpan) errorSpan.textContent = '';
          input.classList.remove('invalid');
          return true;
        }
      }

      if (input.validity.valueMissing) {
        if (errorSpan) errorSpan.textContent = 'Este campo es obligatorio.';
        input.classList.add('invalid');
        input.classList.remove('valid');
        return false;
      } 
      
      if (input.validity.tooShort) {
        if (errorSpan) errorSpan.textContent = `Mínimo ${input.getAttribute('minlength')} caracteres requeridos.`;
        input.classList.add('invalid');
        input.classList.remove('valid');
        return false;
      } 
      
      if (input.validity.typeMismatch || (input.type === 'email' && !input.value.includes('@'))) {
        if (errorSpan) errorSpan.textContent = 'Por favor, introduce un correo electrónico válido.';
        input.classList.add('invalid');
        input.classList.remove('valid');
        return false;
      } 

      if (input.validity.patternMismatch) {
        if (errorSpan) errorSpan.textContent = 'Ingresa un formato válido de celular boliviano (+591 70000000).';
        input.classList.add('invalid');
        input.classList.remove('valid');
        return false;
      }

      if (errorSpan) errorSpan.textContent = '';
      input.classList.remove('invalid');
      input.classList.add('valid');
      return true;
    };

    const formFields = [nombreInput, emailInput, telefonoInput, motivoInput, mensajeInput, confirmacionInput];
    formFields.forEach(field => {
      if (field) {
        const eventType = field.type === 'checkbox' ? 'change' : 'input';
        field.addEventListener(eventType, () => {
          validateField(field);
          if (successAlert) successAlert.style.display = 'none';
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNombreValid = validateField(nombreInput);
      const isEmailValid = validateField(emailInput);
      const isTelefonoValid = validateField(telefonoInput);
      const isMotivoValid = validateField(motivoInput);
      const isMensajeValid = validateField(mensajeInput);
      const isConfirmacionValid = validateField(confirmacionInput);

      const isFormValid = isNombreValid && isEmailValid && isTelefonoValid && isMotivoValid && isMensajeValid && isConfirmacionValid;

      if (isFormValid) {
        const nombre = nombreInput.value.trim();
        const email = emailInput.value.trim();

        if (successAlert) {
          successAlert.textContent = `¡Muchas gracias, ${nombre}! Tu mensaje ha sido procesado con éxito. Te responderemos muy pronto a ${email}.`;
          successAlert.style.display = 'block';
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        contactForm.reset();
        formFields.forEach(field => {
          if (field) field.classList.remove('valid', 'invalid');
        });

        setTimeout(() => {
          if (successAlert) successAlert.style.display = 'none';
        }, 7000);

      } else {
        const firstInvalid = contactForm.querySelector('.form-input.invalid');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }


  // ==========================================================================
  // 6. MÓDULO ASÍNCRONO E INTEGRACIÓN REST (GITHUB API, ASYNC/AWAIT & TRY...CATCH)
  // ==========================================================================
  const loadingState = document.getElementById('api-loading');
  const errorState = document.getElementById('api-error');
  const errorMessage = document.getElementById('error-message');
  const successState = document.getElementById('api-success');
  const reposList = document.getElementById('repos-list');

  if (loadingState && successState && errorState && reposList) {
      const fetchGitHubRepos = async () => {
          loadingState.style.display = 'block';
          errorState.style.display = 'none';
          successState.style.display = 'none';

          try {
              const response = await fetch('https://api.github.com/users/octocat/repos?per_page=4');

              if (!response.ok) {
                  let detalleHttpError = `Error HTTP: ${response.status} ${response.statusText}`;
                  switch (response.status) {
                      case 400: detalleHttpError = '400 Bad Request: La solicitud enviada es incorrecta.'; break;
                      case 404: detalleHttpError = '404 Not Found: El recurso o perfil de la API no fue encontrado.'; break;
                      case 500: detalleHttpError = '500 Internal Server Error: Error interno en el servidor remoto.'; break;
                      default: detalleHttpError = `Error de red o estado no contemplado (${response.status}).`;
                  }
                  throw new Error(detalleHttpError);
              }

              const repositories = await response.json();
              reposList.innerHTML = '';

              repositories.forEach(repo => {
                  const cardItem = document.createElement('li');
                  cardItem.style.cssText = 'padding: 1.25rem; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--color-border); border-radius: var(--radius-sm); display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem;';
                  
                  cardItem.innerHTML = `
                      <div>
                          <span style="font-size: 0.8rem; padding: 0.2rem 0.5rem; background: rgba(68,224,177,0.1); color: var(--color-green2); border-radius: 4px; font-weight: 600;">${repo.language || 'Código Fuente'}</span>
                          <h4 style="margin: 0.5rem 0 0.25rem 0; font-size: 1.05rem;">
                              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" style="color: var(--color-green2); text-decoration: none;">
                                  📁 ${repo.name}
                              </a>
                          </h4>
                          <p style="margin: 0; font-size: 0.88rem; opacity: 0.85; line-height: 1.4;">
                              ${repo.description ? repo.description : 'Sin descripción detallada para este repositorio.'}
                          </p>
                      </div>
                  `;
                  reposList.appendChild(cardItem);
              });

              loadingState.style.display = 'none';
              successState.style.display = 'block';

          } catch (error) {
              console.error('Captura de error asíncrono:', error);
              loadingState.style.display = 'none';
              errorMessage.textContent = `❌ ${error.message}`;
              errorState.style.display = 'block';
          }
      };

      fetchGitHubRepos();
  }

});


// ==========================================================================
// 7. EFECTO SCROLL REVEAL (EJECUTADO FUERA PARA EVENTOS GLOBALES DE SCROLL)
// ==========================================================================
window.addEventListener('scroll', revealElements);

function revealElements() {
  const reveals = document.querySelectorAll('.card, section, .project-card, .portfolio-card, .table-container');

  reveals.forEach(element => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 100;

    if (elementTop < windowHeight - elementVisible) {
      element.classList.add('active');
    }
  });
}