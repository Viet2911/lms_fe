// LMS Frontend - API & Utilities (Production Ready)

// ===========================================
// CONFIG
// ===========================================
const API_BASE = window.LMS_CONFIG?.API_BASE || '/api';

// ===========================================
// SECURITY - XSS Protection
// ===========================================
const security = {
  escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  },

  sanitize(obj) {
    if (typeof obj === 'string') return this.escapeHtml(obj);
    if (Array.isArray(obj)) return obj.map(item => this.sanitize(item));
    if (typeof obj === 'object' && obj !== null) {
      const sanitized = {};
      for (const key in obj) {
        sanitized[key] = this.sanitize(obj[key]);
      }
      return sanitized;
    }
    return obj;
  }
};

// ===========================================
// API MODULE
// ===========================================
const api = {
  getToken() {
    return localStorage.getItem('token');
  },

  setToken(token) {
    localStorage.setItem('token', token);
  },

  removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async request(method, endpoint, data = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const token = this.getToken();
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, options);

      // Handle network errors
      if (!response.ok && response.status === 0) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }

      const result = await response.json();

      if (response.status === 401) {
        this.removeToken();
        ui.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => {
          window.location.href = '/login.html';
        }, 1500);
        return;
      }

      if (response.status === 403) {
        throw new Error('Bạn không có quyền thực hiện thao tác này.');
      }

      if (response.status === 404) {
        throw new Error('Không tìm thấy dữ liệu yêu cầu.');
      }

      if (response.status >= 500) {
        throw new Error('Lỗi hệ thống. Vui lòng thử lại sau.');
      }

      if (!result.success && result.message) {
        throw new Error(result.message);
      }

      return result;
    } catch (error) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đã chạy chưa.');
      }
      throw error;
    }
  },

  get(endpoint) { return this.request('GET', endpoint); },
  post(endpoint, data) { return this.request('POST', endpoint, data); },
  put(endpoint, data) { return this.request('PUT', endpoint, data); },
  delete(endpoint) { return this.request('DELETE', endpoint); }
};

// ===========================================
// AUTH MODULE
// ===========================================
const auth = {
  user: null,

  init() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
      } catch (e) {
        this.logout();
      }
    }
  },

  isLoggedIn() {
    return !!api.getToken() && !!localStorage.getItem('user');
  },

  checkAuth() {
    if (!this.isLoggedIn()) {
      const isInPages = window.location.pathname.includes('/pages/');
      window.location.href = isInPages ? '../login.html' : 'login.html';
      return false;
    }
    this.init();
    return true;
  },

  // Async version for pages
  async requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = window.location.pathname.includes('/pages/') ? '../login.html' : 'login.html';
      return false;
    }
    this.init();
    return true;
  },

  async login(username, password) {
    if (!username || !password) {
      throw new Error('Vui lòng nhập tên đăng nhập và mật khẩu');
    }

    if (username.length < 3) {
      throw new Error('Tên đăng nhập phải có ít nhất 3 ký tự');
    }

    if (password.length < 6) {
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
    }

    const result = await api.post('/auth/login', { username, password });
    if (result.success) {
      api.setToken(result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      this.user = result.data.user;
    }
    return result;
  },

  logout() {
    api.removeToken();
    this.user = null;
    window.location.href = '/login.html';
  },

  hasRole(...roles) {
    if (!this.user) return false;
    const userRole = this.user.role_name?.toUpperCase();
    // ADMIN và GDV luôn có tất cả quyền
    if (userRole === 'ADMIN' || userRole === 'GDV') return true;
    return roles.map(r => r.toUpperCase()).includes(userRole);
  },

  // Check permission from user.permissions array (loaded from API)
  hasPermission(permission) {
    if (!this.user) return false;
    const userRole = this.user.role_name?.toUpperCase();
    // ADMIN và GDV luôn có tất cả quyền
    if (userRole === 'ADMIN' || userRole === 'GDV') return true;
    // Check từ permissions được load từ API
    const permissions = this.user.permissions || [];
    return permissions.includes(permission);
  },

  // Check nếu user có ít nhất 1 trong các permissions
  hasAnyPermission(...permissions) {
    if (!this.user) return false;
    const userRole = this.user.role_name?.toUpperCase();
    if (userRole === 'ADMIN' || userRole === 'GDV') return true;
    const userPerms = this.user.permissions || [];
    return permissions.some(p => userPerms.includes(p));
  },

  // Check module access
  canAccess(module) {
    const modulePermissions = {
      leads: ['leads.view', 'leads.create', 'leads.edit'],
      students: ['students.view', 'students.create', 'students.edit'],
      classes: ['classes.view', 'classes.create', 'classes.edit'],
      attendance: ['attendance.view', 'attendance.checkin'],
      reports: ['reports.view', 'reports.export'],
      settings: ['settings.view', 'settings.edit'],
      users: ['users.view', 'users.create'],
      renewals: ['renewals.view', 'renewals.create'],
      schedule: ['schedule.view'],
      dashboard: ['dashboard.view']
    };
    const perms = modulePermissions[module] || [];
    return this.hasAnyPermission(...perms);
  },

  isSystemWide() {
    return this.user?.is_system_wide === 1 || ['ADMIN', 'GDV', 'CHU'].includes(this.user?.role_name?.toUpperCase());
  }
};

// ===========================================
// UI MODULE
// ===========================================
const ui = {
  toast(message, type = 'info', duration = 4000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="fas ${icons[type] || icons.info}"></i>
      <span>${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success(message) { this.toast(message, 'success'); },
  error(message) { this.toast(message, 'error', 5000); },
  warning(message) { this.toast(message, 'warning'); },
  info(message) { this.toast(message, 'info'); },

  confirm(message, title = 'Xác nhận') {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay active';
      overlay.innerHTML = `
        <div class="modal" style="max-width:400px;">
          <div class="modal-header">
            <h3 class="modal-title"><i class="fas fa-question-circle text-warning"></i> ${title}</h3>
          </div>
          <div class="modal-body">
            <p style="font-size:15px;color:var(--text-primary);">${message}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="confirmNo">Hủy</button>
            <button class="btn btn-danger" id="confirmYes">Xác nhận</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      overlay.querySelector('#confirmYes').onclick = () => {
        overlay.remove();
        resolve(true);
      };
      overlay.querySelector('#confirmNo').onclick = () => {
        overlay.remove();
        resolve(false);
      };
    });
  },

  formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
      // Handle date string without timezone (YYYY-MM-DD)
      if (typeof dateStr === 'string' && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
      }
      // Handle date string with time (YYYY-MM-DDTHH:mm:ss)
      if (typeof dateStr === 'string' && dateStr.includes('T')) {
        const datePart = dateStr.split('T')[0];
        const [year, month, day] = datePart.split('-');
        return `${day}/${month}/${year}`;
      }
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  },

  formatDateTime(dateStr) {
    if (!dateStr) return '-';
    try {
      // Handle date string format YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
      if (typeof dateStr === 'string') {
        if (dateStr.includes('T')) {
          const [datePart, timePart] = dateStr.split('T');
          const [year, month, day] = datePart.split('-');
          const time = timePart.substring(0, 5);
          return `${day}/${month}/${year} ${time}`;
        } else if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const [year, month, day] = dateStr.split('-');
          return `${day}/${month}/${year}`;
        }
      }
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  },

  formatNumber(num) {
    if (num === null || num === undefined) return '0';
    return new Intl.NumberFormat('vi-VN').format(num);
  },

  formatCurrency(amount) {
    if (amount === null || amount === undefined) return '0 đ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  },

  timeAgo(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} ngày trước`;
    return this.formatDate(dateStr);
  },

  truncate(str, length = 50) {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
  },

  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

// ===========================================
// MODAL MODULE
// ===========================================
const modal = {
  show(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Focus first input
      setTimeout(() => {
        const firstInput = el.querySelector('input:not([type="hidden"]), select, textarea');
        if (firstInput) firstInput.focus();
      }, 100);
    }
  },

  hide(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  hideAll() {
    document.querySelectorAll('.modal-overlay.active').forEach(el => {
      el.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
};

// Close modal on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.hideAll();
  }
});

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    modal.hideAll();
  }
});

// ===========================================
// FORM MODULE
// ===========================================
const form = {
  getData(formEl) {
    const data = {};
    const formData = new FormData(formEl);
    formData.forEach((value, key) => {
      // Convert empty strings to null for optional fields
      data[key] = value === '' ? null : value;
    });
    return data;
  },

  setData(formEl, data) {
    Object.keys(data).forEach(key => {
      const input = formEl.querySelector(`[name="${key}"]`);
      if (input) {
        if (input.type === 'checkbox') {
          input.checked = !!data[key];
        } else {
          input.value = data[key] ?? '';
        }
      }
    });
  },

  reset(formEl) {
    formEl.reset();
    // Clear custom validation states
    formEl.querySelectorAll('.is-invalid').forEach(el => {
      el.classList.remove('is-invalid');
    });
    formEl.querySelectorAll('.error-message').forEach(el => {
      el.remove();
    });
  },

  validate(formEl) {
    let valid = true;

    // Clear previous errors
    formEl.querySelectorAll('.is-invalid').forEach(el => {
      el.classList.remove('is-invalid');
    });
    formEl.querySelectorAll('.error-message').forEach(el => {
      el.remove();
    });

    // Check required fields
    formEl.querySelectorAll('[required]').forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        this.showError(input, 'Trường này là bắt buộc');
      }
    });

    // Check email format
    formEl.querySelectorAll('[type="email"]').forEach(input => {
      if (input.value && !this.isValidEmail(input.value)) {
        valid = false;
        this.showError(input, 'Email không hợp lệ');
      }
    });

    // Check phone format
    formEl.querySelectorAll('[type="tel"]').forEach(input => {
      if (input.value && !this.isValidPhone(input.value)) {
        valid = false;
        this.showError(input, 'Số điện thoại không hợp lệ');
      }
    });

    // Check min length
    formEl.querySelectorAll('[minlength]').forEach(input => {
      const minLength = parseInt(input.getAttribute('minlength'));
      if (input.value && input.value.length < minLength) {
        valid = false;
        this.showError(input, `Tối thiểu ${minLength} ký tự`);
      }
    });

    // Check max length
    formEl.querySelectorAll('[maxlength]').forEach(input => {
      const maxLength = parseInt(input.getAttribute('maxlength'));
      if (input.value && input.value.length > maxLength) {
        valid = false;
        this.showError(input, `Tối đa ${maxLength} ký tự`);
      }
    });

    // Check number range
    formEl.querySelectorAll('[type="number"]').forEach(input => {
      const min = input.getAttribute('min');
      const max = input.getAttribute('max');
      const value = parseFloat(input.value);

      if (input.value && min !== null && value < parseFloat(min)) {
        valid = false;
        this.showError(input, `Giá trị tối thiểu là ${min}`);
      }
      if (input.value && max !== null && value > parseFloat(max)) {
        valid = false;
        this.showError(input, `Giá trị tối đa là ${max}`);
      }
    });

    return valid;
  },

  showError(input, message) {
    input.classList.add('is-invalid');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    input.parentNode.appendChild(errorDiv);
  },

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  isValidPhone(phone) {
    // Vietnam phone format
    return /^(0|\+84)[0-9]{9,10}$/.test(phone.replace(/\s/g, ''));
  },

  isValidPassword(password) {
    // At least 6 chars, 1 uppercase, 1 lowercase, 1 number
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
  }
};

// ===========================================
// BRANCH MODULE (Multi-branch support)
// ===========================================
const branch = {
  current: null,
  list: [],

  async init() {
    // Load branches from user data
    this.list = auth.user?.branches || [];
    this.current = this.getCurrent();
    this.renderSelector();
  },

  getCurrent() {
    // Priority: localStorage > primaryBranch > first branch
    const savedId = localStorage.getItem('currentBranchId');
    if (savedId) {
      const found = this.list.find(b => b.id == savedId);
      if (found) return found;
    }
    return auth.user?.primaryBranch || this.list[0] || null;
  },

  setCurrent(branchId) {
    const found = this.list.find(b => b.id == branchId);
    if (found) {
      this.current = found;
      localStorage.setItem('currentBranchId', branchId);
      // Reload current page data
      if (typeof loadData === 'function') loadData();
      if (typeof loadTableData === 'function') loadTableData();
      ui.success(`Đã chuyển sang cơ sở: ${found.name}`);
    }
  },

  getId() {
    return this.current?.id || null;
  },

  getCode() {
    return this.current?.code || '';
  },

  getName() {
    return this.current?.name || '';
  },

  // Add branchId to API query string
  addToQuery(params = {}) {
    if (this.current && !auth.user?.is_system_wide) {
      params.branchId = this.current.id;
    }
    return params;
  },

  // Build query string with branch filter
  buildQuery(params = {}) {
    const withBranch = this.addToQuery(params);
    const query = new URLSearchParams();
    Object.keys(withBranch).forEach(key => {
      if (withBranch[key] !== null && withBranch[key] !== undefined && withBranch[key] !== '') {
        query.append(key, withBranch[key]);
      }
    });
    return query.toString() ? '?' + query.toString() : '';
  },

  renderSelector() {
    const container = document.getElementById('branchSelector');
    if (!container) return;

    // Admin can see all, others only see their branches
    if (auth.user?.is_system_wide) {
      // Admin: show dropdown with "All" option
      container.innerHTML = `
        <div class="branch-selector">
          <i class="fas fa-building"></i>
          <select id="branchSelect" onchange="branch.setCurrent(this.value)">
            <option value="">Tất cả cơ sở</option>
            ${this.list.map(b => `
              <option value="${b.id}" ${this.current?.id == b.id ? 'selected' : ''}>
                ${b.name}
              </option>
            `).join('')}
          </select>
        </div>
      `;
    } else if (this.list.length > 1) {
      // Multiple branches: show dropdown
      container.innerHTML = `
        <div class="branch-selector">
          <i class="fas fa-building"></i>
          <select id="branchSelect" onchange="branch.setCurrent(this.value)">
            ${this.list.map(b => `
              <option value="${b.id}" ${this.current?.id == b.id ? 'selected' : ''}>
                ${b.name}
              </option>
            `).join('')}
          </select>
        </div>
      `;
    } else if (this.list.length === 1) {
      // Single branch: just show name
      container.innerHTML = `
        <div class="branch-badge">
          <i class="fas fa-building"></i>
          <span>${this.list[0].name}</span>
        </div>
      `;
    }
  }
};

// ===========================================
// THEME MODULE
// ===========================================
const theme = {
  init() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.set(savedTheme);
  },

  set(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  },

  toggle() {
    const current = localStorage.getItem('theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    this.set(next);
  },

  get() {
    return localStorage.getItem('theme') || 'light';
  }
};

// ===========================================
// LOADING MODULE
// ===========================================
const loading = {
  show(container) {
    if (typeof container === 'string') {
      container = document.getElementById(container);
    }
    if (container) {
      container.innerHTML = `
        <div class="loading">
          <div class="spinner"></div>
          <p style="margin-top:12px;color:var(--text-muted);">Đang tải dữ liệu...</p>
        </div>
      `;
    }
  },

  hide(container) {
    if (typeof container === 'string') {
      container = document.getElementById(container);
    }
    const loadingEl = container?.querySelector('.loading');
    if (loadingEl) {
      loadingEl.remove();
    }
  },

  button(btn, isLoading, originalText = '') {
    if (isLoading) {
      btn.disabled = true;
      btn.dataset.originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    } else {
      btn.disabled = false;
      btn.innerHTML = originalText || btn.dataset.originalText || 'Submit';
    }
  }
};

// ===========================================
// INIT
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
  // Init theme first
  theme.init();

  // Check auth on protected pages
  const isLoginPage = window.location.pathname.includes('login');
  if (!isLoginPage && !auth.checkAuth()) {
    return;
  }

  // Init user info
  auth.init();

  // Init branch selector
  branch.init();

  // Update user info in header
  const userNameEl = document.getElementById('userName');
  const userRoleEl = document.getElementById('userRole');
  const userAvatarEl = document.getElementById('userAvatar');

  if (auth.user) {
    if (userNameEl) userNameEl.textContent = auth.user.full_name || 'User';
    if (userRoleEl) userRoleEl.textContent = auth.user.role_name || 'Role';
    if (userAvatarEl) userAvatarEl.textContent = (auth.user.full_name || 'U').charAt(0).toUpperCase();
  }
});

// ===========================================
// GLOBAL ERROR HANDLER
// ===========================================
window.onerror = function (message, source, lineno, colno, error) {
  console.error('Global error:', { message, source, lineno, colno, error });
  // Don't show UI error for script errors
  return false;
};

window.addEventListener('unhandledrejection', function (event) {
  console.error('Unhandled promise rejection:', event.reason);
  if (event.reason?.message) {
    ui.error(event.reason.message);
  }
});

// ===========================================
// EXPORT
// ===========================================
window.API_BASE = API_BASE;
window.api = api;
window.auth = auth;
window.ui = ui;
window.modal = modal;
window.form = form;
window.theme = theme;
window.loading = loading;
window.branch = branch;