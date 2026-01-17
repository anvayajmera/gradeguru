const ROUTES = {
  default: {
    viewId: 'outsideColorGPAHelper',
    title: 'GPA Calculator',
    subtitle: 'Calculate your weighted and unweighted GPA.',
  },
  login: {
    viewId: 'section4',
    title: 'Log In',
    subtitle: 'Log in to save calculated grades.',
  },
};

function updateHeaderHeight() {
  const header = document.getElementById('header');
  if (!header) {
    return;
  }

  document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
}

function normalizePath(pathname) {
  if (!pathname) {
    return '/';
  }

  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function getRoute(pathname) {
  const path = normalizePath(pathname);

  if (path.endsWith('/login')) {
    return ROUTES.login;
  }

  return ROUTES.default;
}

function showSection(viewId, title, subtitle) {
  // Hide all views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });

  // Show requested view
  const view = document.getElementById(viewId);
  if (view) {
    view.classList.add('active');
  }

  // Header text
  const header = document.getElementById('header');
  if (header) {
    header.classList.add('active');
  }

  document.getElementById('headerTitle').textContent = title;
  document.getElementById('contentText').textContent = subtitle;
  updateHeaderHeight();

  // Scroll reset for mobile
  window.scrollTo(0, 0);
}

function updateActiveNav(pathname) {
  const path = normalizePath(pathname);

  document.querySelectorAll('.navbar a[href]').forEach(link => {
    const href = link.getAttribute('href');
    const normalizedHref = normalizePath(href);
    const isLogin = path.endsWith('/login');
    const isActive = (normalizedHref === '/login' && isLogin) || (normalizedHref === '/' && !isLogin);

    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function renderRoute(pathname) {
  const route = getRoute(pathname);
  showSection(route.viewId, route.title, route.subtitle);
  updateActiveNav(pathname);
}

function navigateTo(path) {
  const targetPath = normalizePath(path || '/');
  const currentPath = normalizePath(window.location.pathname);

  if (currentPath !== targetPath) {
    history.pushState({}, '', targetPath);
  }

  renderRoute(targetPath);
}

function shouldHandleClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

function initNavigation() {
  document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', event => {
      if (!shouldHandleClick(event)) {
        return;
      }

      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      event.preventDefault();
      navigateTo(href);
    });
  });

  window.addEventListener('popstate', () => {
    renderRoute(window.location.pathname);
  });

  window.addEventListener('resize', updateHeaderHeight);

  renderRoute(window.location.pathname);
}

// Function to show the GPA calculator section
function showCalculator() {
  navigateTo('/');
}

initNavigation();



