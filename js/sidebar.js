// Sidebar Builder - ARMY Technology LMS v4.0
// Builds navigation based on user role and permissions

function buildSidebar(containerId, activePage = '') {
  const nav = document.getElementById(containerId);
  if (!nav) return;

  const role = auth.user?.role_name?.toUpperCase();
  const currentPath = window.location.pathname;
  const branches = auth.user?.branches || [];

  const isActive = (page) => currentPath.includes(page) ? 'active' : '';
  const prefix = currentPath.includes('/pages/') ? '' : 'pages/';
  const homeLink = currentPath.includes('/pages/') ? '../index.html' : 'index.html';

  // Check permission helper
  const can = (perm) => auth.hasPermission(perm);
  const canAny = (...perms) => auth.hasAnyPermission(...perms);

  let html = `
    <div class="sidebar-logo">
      <i class="fas fa-graduation-cap"></i>
      <span>ARMY Tech</span>
    </div>
  `;

  // Branch selector
  if (branches.length > 1 || auth.user?.is_system_wide) {
    html += `<div id="branchSelector" class="sidebar-branch"></div>`;
  } else if (branches.length === 1) {
    html += `
      <div class="sidebar-branch">
        <div class="branch-badge">
          <i class="fas fa-building"></i>
          <span>${branches[0].name}</span>
        </div>
      </div>
    `;
  }

  html += `<div class="sidebar-nav">`;
  html += `<a href="${homeLink}" class="nav-item ${currentPath.endsWith('index.html') || currentPath.endsWith('/') ? 'active' : ''}"><i class="fas fa-home"></i><span>Dashboard</span></a>`;

  // ========================
  // TUYỂN SINH - Leads, Trial
  // ========================
  if (canAny('leads.view', 'trial.view')) {
    html += `<div class="nav-section-title">Tuyển sinh</div>`;
    if (can('leads.view')) {
      html += `<a href="${prefix}leads.html" class="nav-item ${isActive('leads')}"><i class="fas fa-user-plus"></i><span>Leads</span></a>`;
    }
    if (can('trial.view')) {
      html += `<a href="${prefix}trial-calendar.html" class="nav-item ${isActive('trial-calendar')}"><i class="fas fa-calendar-alt"></i><span>Lịch trải nghiệm</span></a>`;
    }
  }

  // ========================
  // HỌC VIÊN
  // ========================
  if (can('students.view')) {
    html += `<a href="${prefix}students.html" class="nav-item ${isActive('students')}"><i class="fas fa-user-graduate"></i><span>Học viên</span></a>`;
  }

  // ========================
  // QUẢN LÝ LỚP
  // ========================
  if (canAny('classes.view', 'sessions.view', 'attendance.view', 'attendance.checkin')) {
    html += `<div class="nav-section-title">Quản lý lớp</div>`;
    if (can('classes.view')) {
      html += `<a href="${prefix}classes.html" class="nav-item ${isActive('classes')}"><i class="fas fa-chalkboard"></i><span>Lớp học</span></a>`;
    }
    if (can('sessions.view')) {
      html += `<a href="${prefix}sessions.html" class="nav-item ${isActive('sessions')}"><i class="fas fa-calendar-check"></i><span>Buổi học</span></a>`;
    }
    if (canAny('attendance.view', 'attendance.checkin')) {
      html += `<a href="${prefix}attendance.html" class="nav-item ${isActive('attendance')}"><i class="fas fa-clipboard-check"></i><span>Điểm danh</span></a>`;
    }
  }

  // ========================
  // TÁI PHÍ
  // ========================
  if (canAny('renewals.view', 'renewals.create')) {
    html += `<div class="nav-section-title">Học phí</div>`;
    if (can('renewals.view')) {
      html += `<a href="${prefix}fee-warning.html" class="nav-item ${isActive('fee-warning')}"><i class="fas fa-exclamation-triangle"></i><span>Cảnh báo phí</span></a>`;
    }
  }

  // ========================
  // BÁO CÁO & KPI
  // ========================
  if (canAny('reports.view', 'dashboard.revenue', 'checkin.view')) {
    html += `<div class="nav-section-title">Báo cáo</div>`;
    if (can('reports.view')) {
      html += `<a href="${prefix}sale-reports.html" class="nav-item ${isActive('sale-reports')}"><i class="fas fa-chart-line"></i><span>Báo cáo Sale</span></a>`;
    }
    // Báo cáo trải nghiệm cho quản lý
    if (auth.hasRole('HOEC', 'QLCS', 'CHU', 'GDV', 'ADMIN', 'OM', 'CM', 'EC')) {
      html += `<a href="${prefix}trial-report.html" class="nav-item ${isActive('trial-report')}"><i class="fas fa-clipboard-check"></i><span>Báo cáo Trải nghiệm</span></a>`;
    }
    // KPI cho HOEC, QLCS, Admin
    if (auth.hasRole('HOEC', 'QLCS', 'CHU', 'GDV', 'ADMIN')) {
      html += `<a href="${prefix}kpi.html" class="nav-item ${isActive('kpi')}"><i class="fas fa-bullseye"></i><span>KPI</span></a>`;
    }
    // EC xem KPI của mình
    if (role === 'EC' || role === 'SALE') {
      html += `<a href="${prefix}my-kpi.html" class="nav-item ${isActive('my-kpi')}"><i class="fas fa-chart-bar"></i><span>KPI của tôi</span></a>`;
    }
  }

  // ========================
  // BÀI TẬP & TÀI LIỆU
  // ========================
  if (canAny('assignments.view', 'assignments.create')) {
    html += `<div class="nav-section-title">Tài liệu</div>`;
    html += `<a href="${prefix}assignments.html" class="nav-item ${isActive('assignments')}"><i class="fas fa-tasks"></i><span>Bài tập</span></a>`;
    html += `<a href="${prefix}files.html" class="nav-item ${isActive('files')}"><i class="fas fa-folder"></i><span>Thư viện File</span></a>`;
  }

  // ========================
  // HỆ THỐNG (Admin only)
  // ========================
  if (auth.hasRole('ADMIN', 'GDV')) {
    html += `<div class="nav-section-title">Hệ thống</div>`;
    html += `<a href="${prefix}admin-settings.html" class="nav-item ${isActive('admin-settings')}"><i class="fas fa-cog"></i><span>Cài đặt</span></a>`;
    html += `<a href="${prefix}packages.html" class="nav-item ${isActive('packages')}"><i class="fas fa-box"></i><span>Gói học phí</span></a>`;
    html += `<a href="${prefix}promotions.html" class="nav-item ${isActive('promotions')}"><i class="fas fa-gift"></i><span>Khuyến mại</span></a>`;
    html += `<a href="${prefix}branches.html" class="nav-item ${isActive('branches')}"><i class="fas fa-building"></i><span>Cơ sở</span></a>`;
    html += `<a href="${prefix}users.html" class="nav-item ${isActive('users')}"><i class="fas fa-users-cog"></i><span>Người dùng</span></a>`;
  }

  html += `</div>`;

  // User info & Logout
  html += `
    <div class="sidebar-footer">
      <div class="user-info">
        <i class="fas fa-user-circle"></i>
        <div class="user-details">
          <span class="user-name">${auth.user?.full_name || 'User'}</span>
          <span class="user-role">${getRoleDisplay(role)}</span>
        </div>
      </div>
      <a href="#" class="nav-item logout" onclick="auth.logout(); return false;">
        <i class="fas fa-sign-out-alt"></i>
        <span>Đăng xuất</span>
      </a>
    </div>
  `;

  nav.innerHTML = html;

  // Initialize branch selector
  setTimeout(() => {
    if (typeof branch !== 'undefined') {
      branch.renderSelector();
    }
  }, 100);
}

// Helper function to get role display name
function getRoleDisplay(role) {
  const roleNames = {
    'ADMIN': 'Administrator',
    'GDV': 'Giám đốc vùng',
    'CHU': 'Chủ cơ sở',
    'QLCS': 'Quản lý cơ sở',
    'HOEC': 'Trưởng EC',
    'OM': 'Trưởng vận hành',
    'CM': 'Quản lý lớp',
    'EC': 'Tư vấn viên',
    'SALE': 'Tư vấn viên',
    'TEACHER': 'Giáo viên',
    'TA': 'Trợ giảng'
  };
  return roleNames[role?.toUpperCase()] || role;
}

window.buildSidebar = buildSidebar;
window.getRoleDisplay = getRoleDisplay;