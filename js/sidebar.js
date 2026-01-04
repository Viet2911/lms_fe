// Sidebar Builder - ARMY Technology LMS v4.0
// Builds navigation based on user role

function buildSidebar(containerId, activePage = '') {
  const nav = document.getElementById(containerId);
  if (!nav) return;

  const role = auth.user?.role_name;
  const currentPath = window.location.pathname;
  const branches = auth.user?.branches || [];

  const isActive = (page) => currentPath.includes(page) ? 'active' : '';
  const prefix = currentPath.includes('/pages/') ? '' : 'pages/';
  const homeLink = currentPath.includes('/pages/') ? '../index.html' : 'index.html';

  let html = `
    <div class="sidebar-logo">
      <i class="fas fa-graduation-cap"></i>
      <span>ARMY Tech</span>
    </div>
  `;

  // Branch selector (if user has multiple branches or is admin)
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
  // ADMIN - Toàn quyền
  // ========================
  if (role === 'ADMIN' || role === 'GDV' || role === 'CHU') {
    html += `
      <div class="nav-section-title">Tuyển sinh</div>
      <a href="${prefix}leads.html" class="nav-item ${isActive('leads')}"><i class="fas fa-user-plus"></i><span>Leads</span></a>
      <a href="${prefix}trial-calendar.html" class="nav-item ${isActive('trial-calendar')}"><i class="fas fa-calendar-alt"></i><span>Lịch trải nghiệm</span></a>
      <a href="${prefix}students.html" class="nav-item ${isActive('students')}"><i class="fas fa-user-graduate"></i><span>Học viên</span></a>
      
      <div class="nav-section-title">Quản lý lớp</div>
      <a href="${prefix}classes.html" class="nav-item ${isActive('classes')}"><i class="fas fa-chalkboard"></i><span>Lớp học</span></a>
      <a href="${prefix}sessions.html" class="nav-item ${isActive('sessions')}"><i class="fas fa-calendar-check"></i><span>Buổi học</span></a>
      <a href="${prefix}attendance.html" class="nav-item ${isActive('attendance')}"><i class="fas fa-clipboard-check"></i><span>Điểm danh</span></a>
      
      <div class="nav-section-title">Kinh doanh</div>
      <a href="${prefix}sale-reports.html" class="nav-item ${isActive('sale-reports')}"><i class="fas fa-chart-line"></i><span>Báo cáo Sale</span></a>
      <a href="${prefix}kpi.html" class="nav-item ${isActive('kpi')}"><i class="fas fa-bullseye"></i><span>KPI</span></a>
      <a href="${prefix}promotions.html" class="nav-item ${isActive('promotions')}"><i class="fas fa-gift"></i><span>Khuyến mại</span></a>
      
      <div class="nav-section-title">Tài liệu</div>
      <a href="${prefix}files.html" class="nav-item ${isActive('files')}"><i class="fas fa-folder"></i><span>Thư viện File</span></a>
      <a href="${prefix}assignments.html" class="nav-item ${isActive('assignments')}"><i class="fas fa-tasks"></i><span>Bài tập</span></a>
      
      <div class="nav-section-title">Hệ thống</div>
      <a href="${prefix}admin-settings.html" class="nav-item ${isActive('admin-settings')}"><i class="fas fa-cog"></i><span>Cài đặt</span></a>
      <a href="${prefix}packages.html" class="nav-item ${isActive('packages')}"><i class="fas fa-box"></i><span>Gói học phí</span></a>
      <a href="${prefix}branches.html" class="nav-item ${isActive('branches')}"><i class="fas fa-building"></i><span>Cơ sở</span></a>
      <a href="${prefix}users.html" class="nav-item ${isActive('users')}"><i class="fas fa-users-cog"></i><span>Người dùng</span></a>
    `;
  }

  // ========================
  // CHU - Chủ doanh nghiệp
  // ========================
  else if (role === 'CHU') {
    html += `
      <div class="nav-section-title">Tổng quan</div>
      <a href="${prefix}students.html" class="nav-item ${isActive('students')}"><i class="fas fa-user-graduate"></i><span>Học viên</span></a>
      <a href="${prefix}classes.html" class="nav-item ${isActive('classes')}"><i class="fas fa-chalkboard"></i><span>Lớp học</span></a>
      
      <div class="nav-section-title">Báo cáo</div>
      <a href="${prefix}sale-reports.html" class="nav-item ${isActive('sale-reports')}"><i class="fas fa-chart-line"></i><span>Báo cáo Sale</span></a>
      <a href="${prefix}fee-warning.html" class="nav-item ${isActive('fee-warning')}"><i class="fas fa-exclamation-triangle"></i><span>Cảnh báo học phí</span></a>
    `;
  }

  // ========================
  // OM - Operation Manager
  // ========================
  else if (role === 'OM') {
    html += `
      <div class="nav-section-title">Quản lý lớp</div>
      <a href="${prefix}classes.html" class="nav-item ${isActive('classes')}"><i class="fas fa-chalkboard"></i><span>Lớp học</span></a>
      <a href="${prefix}sessions.html" class="nav-item ${isActive('sessions')}"><i class="fas fa-calendar-check"></i><span>Buổi học</span></a>
      <a href="${prefix}students.html" class="nav-item ${isActive('students')}"><i class="fas fa-user-graduate"></i><span>Học viên</span></a>
      
      <div class="nav-section-title">Cảnh báo</div>
      <a href="${prefix}fee-warning.html" class="nav-item ${isActive('fee-warning')}"><i class="fas fa-exclamation-triangle"></i><span>Sắp hết phí</span></a>
    `;
  }

  // ========================
  // HOEC - Head of EC
  // ========================
  else if (role === 'HOEC') {
    html += `
      <div class="nav-section-title">Quản lý Sale</div>
      <a href="${prefix}sale-reports.html" class="nav-item ${isActive('sale-reports')}"><i class="fas fa-chart-line"></i><span>Báo cáo Sale</span></a>
      <a href="${prefix}kpi.html" class="nav-item ${isActive('kpi')}"><i class="fas fa-bullseye"></i><span>KPI</span></a>
      <a href="${prefix}ec-management.html" class="nav-item ${isActive('ec-management')}"><i class="fas fa-users"></i><span>Quản lý EC</span></a>
      
      <div class="nav-section-title">Tuyển sinh</div>
      <a href="${prefix}leads.html" class="nav-item ${isActive('leads')}"><i class="fas fa-user-plus"></i><span>Leads</span></a>
    `;
  }

  // ========================
  // CM - Class Manager
  // ========================
  else if (role === 'CM') {
    html += `
      <div class="nav-section-title">Quản lý</div>
      <a href="${prefix}classes.html" class="nav-item ${isActive('classes')}"><i class="fas fa-chalkboard"></i><span>Lớp học</span></a>
      <a href="${prefix}students.html" class="nav-item ${isActive('students')}"><i class="fas fa-user-graduate"></i><span>Học viên</span></a>
      <a href="${prefix}sessions.html" class="nav-item ${isActive('sessions')}"><i class="fas fa-calendar-check"></i><span>Buổi học</span></a>
      <a href="${prefix}attendance.html" class="nav-item ${isActive('attendance')}"><i class="fas fa-clipboard-check"></i><span>Điểm danh</span></a>
      
      <div class="nav-section-title">Cảnh báo</div>
      <a href="${prefix}fee-warning.html" class="nav-item ${isActive('fee-warning')}"><i class="fas fa-exclamation-triangle"></i><span>Sắp hết phí</span></a>
      
      <div class="nav-section-title">Tài liệu</div>
      <a href="${prefix}files.html" class="nav-item ${isActive('files')}"><i class="fas fa-folder"></i><span>Thư viện File</span></a>
      <a href="${prefix}assignments.html" class="nav-item ${isActive('assignments')}"><i class="fas fa-tasks"></i><span>Bài tập</span></a>
    `;
  }

  // ========================
  // TEACHER - Giáo viên
  // ========================
  else if (role === 'TEACHER') {
    html += `
      <div class="nav-section-title">Giảng dạy</div>
      <a href="${prefix}classes.html" class="nav-item ${isActive('classes')}"><i class="fas fa-chalkboard"></i><span>Lớp của tôi</span></a>
      <a href="${prefix}sessions.html" class="nav-item ${isActive('sessions')}"><i class="fas fa-calendar-check"></i><span>Buổi học</span></a>
      <a href="${prefix}attendance.html" class="nav-item ${isActive('attendance')}"><i class="fas fa-clipboard-check"></i><span>Điểm danh</span></a>
      <a href="${prefix}assignments.html" class="nav-item ${isActive('assignments')}"><i class="fas fa-tasks"></i><span>Bài tập</span></a>
    `;
  }

  // ========================
  // EC (SALE) - Education Consultant
  // ========================
  else if (role === 'EC' || role === 'SALE') {
    html += `
      <div class="nav-section-title">Tuyển sinh</div>
      <a href="${prefix}leads.html" class="nav-item ${isActive('leads')}"><i class="fas fa-user-plus"></i><span>Leads</span></a>
      <a href="${prefix}trial-calendar.html" class="nav-item ${isActive('trial-calendar')}"><i class="fas fa-calendar-alt"></i><span>Lịch trải nghiệm</span></a>
      <a href="${prefix}students.html" class="nav-item ${isActive('students')}"><i class="fas fa-user-graduate"></i><span>Học viên</span></a>
      
      <div class="nav-section-title">KPI</div>
      <a href="${prefix}my-kpi.html" class="nav-item ${isActive('my-kpi')}"><i class="fas fa-chart-bar"></i><span>KPI của tôi</span></a>
    `;
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

  // Initialize branch selector after sidebar is rendered
  setTimeout(() => {
    if (typeof branch !== 'undefined') {
      branch.renderSelector();
    }
  }, 100);
}

// Helper function to get role display name
function getRoleDisplay(role) {
  const roleNames = {
    'GDV': 'Giám đốc vùng',
    'ADMIN': 'Administrator',
    'CHU': 'Chủ doanh nghiệp',
    'OM': 'Operation Manager',
    'HOEC': 'Head of EC',
    'CM': 'Class Manager',
    'TEACHER': 'Giáo viên',
    'EC': 'EC Sale',
    'SALE': 'Sale'
  };
  return roleNames[role] || role;
}

window.buildSidebar = buildSidebar;
window.getRoleDisplay = getRoleDisplay;