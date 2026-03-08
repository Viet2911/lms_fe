// Sidebar Builder - ARMY Technology LMS v4.0
// Grouped collapsible navigation with dropdown support

(function injectSidebarStyles() {
  if (document.getElementById('sb-styles')) return;
  const style = document.createElement('style');
  style.id = 'sb-styles';
  style.textContent = `
    /* ===== Sidebar Overrides ===== */
    .sidebar {
      display: flex;
      flex-direction: column;
    }

    /* Logo */
    .sb-logo {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 18px 16px 16px;
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }
    .sb-logo-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, #34a853, #1a7a3a);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #fff;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(52,168,83,0.35);
    }
    .sb-logo-name {
      font-size: 15px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.2;
    }
    .sb-logo-tagline {
      font-size: 10px;
      color: var(--text-muted);
      display: block;
      letter-spacing: 0.5px;
    }

    /* Branch area */
    .sb-branch {
      padding: 8px 12px;
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    /* Scrollable nav area */
    .sb-nav {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 8px 0 4px;
    }
    .sb-nav::-webkit-scrollbar { width: 4px; }
    .sb-nav::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 2px; }

    /* Top-level single links (Dashboard) */
    .sb-top {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 16px;
      margin: 1px 8px;
      border-radius: 8px;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 500;
      transition: background 0.15s, color 0.15s;
    }
    .sb-top i { width: 18px; text-align: center; font-size: 14px; flex-shrink: 0; }
    .sb-top:hover { background: var(--sidebar-hover); color: var(--primary); text-decoration: none; }
    .sb-top.active {
      background: rgba(52,168,83,0.1);
      color: var(--primary);
      font-weight: 600;
    }
    .sb-top.active i { color: var(--primary); }

    /* Group */
    .sb-group { margin: 2px 0; }

    /* Group header button */
    .sb-group-hd {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 14px 8px 16px;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      text-align: left;
      transition: color 0.15s;
      margin-top: 4px;
    }
    .sb-group-hd:hover { color: var(--text-primary); }
    .sb-group-hd .sb-gicon { font-size: 13px; color: var(--text-muted); width: 16px; text-align: center; }
    .sb-group-hd .sb-glabel { flex: 1; }
    .sb-group-hd .sb-chevron {
      font-size: 10px;
      transition: transform 0.25s;
      color: var(--text-muted);
    }
    .sb-group.open .sb-chevron { transform: rotate(180deg); }
    .sb-group.has-active .sb-group-hd { color: var(--primary); }
    .sb-group.has-active .sb-gicon { color: var(--primary); }

    /* Group body */
    .sb-group-body {
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.28s ease;
    }
    .sb-group.open .sb-group-body { max-height: 600px; }

    /* Child links */
    .sb-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px 8px 34px;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      border-left: 2px solid transparent;
      margin: 1px 0;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
      position: relative;
    }
    .sb-link i { width: 16px; text-align: center; font-size: 13px; flex-shrink: 0; }
    .sb-link:hover { background: var(--sidebar-hover); color: var(--primary); text-decoration: none; }
    .sb-link.active {
      color: var(--primary);
      font-weight: 600;
      background: rgba(52,168,83,0.08);
      border-left-color: var(--primary);
    }
    .sb-link.active i { color: var(--primary); }

    /* Footer */
    .sb-footer {
      border-top: 1px solid var(--border);
      padding: 8px 0 4px;
      flex-shrink: 0;
    }
    .sb-user {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
    }
    .sb-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #34a853, #1a7a3a);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .sb-user-name { font-size: 13px; font-weight: 600; color: var(--text-primary); line-height: 1.2; }
    .sb-user-role { font-size: 11px; color: var(--text-muted); }
    .sb-logout {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      margin: 1px 8px;
      border-radius: 8px;
      color: #ef4444;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: background 0.15s;
    }
    .sb-logout i { width: 16px; text-align: center; }
    .sb-logout:hover { background: rgba(239,68,68,0.1); text-decoration: none; color: #ef4444; }

    /* Divider line between sections */
    .sb-divider { height: 1px; background: var(--border); margin: 4px 16px; }
  `;
  document.head.appendChild(style);
})();

function buildSidebar(containerId) {
  const nav = document.getElementById(containerId);
  if (!nav) return;

  const role = auth.user?.role_name?.toUpperCase();
  const currentPath = window.location.pathname;
  const branches = auth.user?.branches || [];
  const prefix = currentPath.includes('/pages/') ? '' : 'pages/';
  const homeLink = currentPath.includes('/pages/') ? '../index.html' : 'index.html';

  const isActive = (page) => currentPath.includes(page);
  const can = (perm) => auth.hasPermission(perm);
  const canAny = (...perms) => auth.hasAnyPermission(...perms);

  // Helper: build a collapsible group
  // autoOpen = true if any child is active
  function group(id, icon, label, linksHtml) {
    const hasActive = linksHtml.includes('class="sb-link active"');
    return `
      <div class="sb-group ${hasActive ? 'open has-active' : ''}" id="${id}">
        <button class="sb-group-hd" onclick="toggleSbGroup('${id}')">
          <i class="${icon} sb-gicon"></i>
          <span class="sb-glabel">${label}</span>
          <i class="fas fa-chevron-down sb-chevron"></i>
        </button>
        <div class="sb-group-body">${linksHtml}</div>
      </div>`;
  }

  function link(href, icon, label) {
    const active = isActive(href.replace('.html', '')) ? 'active' : '';
    return `<a href="${prefix}${href}" class="sb-link ${active}"><i class="${icon}"></i><span>${label}</span></a>`;
  }

  // ── Build HTML ──────────────────────────────────────────────
  let html = `
    <div class="sb-logo">
      <div class="sb-logo-icon"><i class="fas fa-graduation-cap"></i></div>
      <div>
        <div class="sb-logo-name">ARMY Tech</div>
        <span class="sb-logo-tagline">LMS PLATFORM</span>
      </div>
    </div>
  `;

  // Branch selector
  if (branches.length > 1 || auth.user?.is_system_wide) {
    html += `<div class="sb-branch" id="branchSelector"></div>`;
  } else if (branches.length === 1) {
    html += `<div class="sb-branch"><div class="branch-badge"><i class="fas fa-building"></i><span>${branches[0].name}</span></div></div>`;
  }

  html += `<div class="sb-nav">`;

  // Dashboard
  const dashActive = (currentPath.endsWith('index.html') || currentPath.endsWith('/')) ? 'active' : '';
  html += `<a href="${homeLink}" class="sb-top ${dashActive}"><i class="fas fa-home"></i><span>Dashboard</span></a>`;

  // ── Tuyển sinh ──
  if (canAny('leads.view', 'trial.view')) {
    let links = '';
    if (can('leads.view')) links += link('leads.html', 'fas fa-user-plus', 'Leads');
    if (can('trial.view')) links += link('trial-calendar.html', 'fas fa-calendar-alt', 'Lịch trải nghiệm');
    if (can('trial.view')) links += link('trial.html', 'fas fa-user-clock', 'Học sinh thử');
    html += group('grp-tuyen-sinh', 'fas fa-bullhorn', 'Tuyển sinh', links);
  }

  // ── Học viên (standalone) ──
  if (can('students.view')) {
    const active = isActive('students') ? 'active' : '';
    html += `<a href="${prefix}students.html" class="sb-top ${active}"><i class="fas fa-user-graduate"></i><span>Học viên</span></a>`;
  }

  // ── Quản lý lớp ──
  if (canAny('classes.view', 'sessions.view', 'attendance.view', 'attendance.checkin')) {
    let links = '';
    if (can('classes.view')) links += link('classes.html', 'fas fa-chalkboard', 'Lớp học');
    if (can('sessions.view')) links += link('sessions.html', 'fas fa-calendar-check', 'Buổi học');
    if (canAny('attendance.view', 'attendance.checkin')) links += link('attendance.html', 'fas fa-clipboard-check', 'Điểm danh');
    html += group('grp-lop', 'fas fa-chalkboard-teacher', 'Quản lý lớp', links);
  }

  // ── Học phí ──
  if (canAny('renewals.view', 'renewals.create')) {
    let links = '';
    if (can('renewals.view')) links += link('fee-warning.html', 'fas fa-exclamation-triangle', 'Cảnh báo phí');
    if (can('renewals.view')) links += link('renewals.html', 'fas fa-sync-alt', 'Tái phí');
    html += group('grp-hocphi', 'fas fa-wallet', 'Học phí', links);
  }

  // ── Báo cáo & KPI ──
  const canReports = can('reports.view') || auth.hasRole('HOEC', 'QLCS', 'CHU', 'GDV', 'ADMIN', 'OM', 'CM', 'EC', 'ACCOUNTANT', 'SALE');
  if (canReports) {
    let links = link('reports.html', 'fas fa-chart-pie', 'Báo cáo & KPI');
    html += group('grp-baocao', 'fas fa-chart-pie', 'Báo cáo & KPI', links);
  }

  // ── Tài liệu ──
  if (canAny('assignments.view', 'assignments.create')) {
    let links = '';
    links += link('assignments.html', 'fas fa-tasks', 'Bài tập');
    links += link('files.html', 'fas fa-folder-open', 'Thư viện File');
    html += group('grp-tailieu', 'fas fa-book-open', 'Tài liệu', links);
  }

  // ── Hệ thống ──
  if (auth.hasRole('ADMIN', 'GDV')) {
    let links = '';
    links += link('admin-settings.html', 'fas fa-cog', 'Cài đặt hệ thống');
    html += group('grp-hethong', 'fas fa-shield-alt', 'Hệ thống', links);
  }

  html += `</div>`; // end sb-nav

  // Footer
  const userName = auth.user?.full_name || 'User';
  const initial = userName.trim().split(' ').pop()[0]?.toUpperCase() || 'U';
  html += `
    <div class="sb-footer">
      <div class="sb-user">
        <div class="sb-avatar">${initial}</div>
        <div>
          <div class="sb-user-name">${userName}</div>
          <div class="sb-user-role">${getRoleDisplay(role)}</div>
        </div>
      </div>
      <a href="#" class="sb-logout" onclick="auth.logout(); return false;">
        <i class="fas fa-sign-out-alt"></i><span>Đăng xuất</span>
      </a>
    </div>
  `;

  nav.innerHTML = html;

  // Branch selector init
  if (typeof branch !== 'undefined' && branch.list.length > 0) {
    branch.renderSelector();
  }

  // Restore open state from localStorage for groups not auto-opened
  document.querySelectorAll('.sb-group:not(.open)').forEach(g => {
    if (localStorage.getItem('sb_' + g.id) === '1') {
      g.classList.add('open');
    }
  });
}

function toggleSbGroup(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const isOpen = el.classList.toggle('open');
  localStorage.setItem('sb_' + id, isOpen ? '1' : '0');
}

// Helper function to get role display name
function getRoleDisplay(role) {
  const roleNames = {
    'ADMIN': 'Administrator',
    'GDV': 'Giám đốc vùng',
    'CHU': 'Chủ cơ sở',
    'QLCS': 'Quản lý cơ sở',
    'BM': 'Branch Manager',
    'HOEC': 'Trưởng EC',
    'OM': 'Trưởng vận hành',
    'CM': 'Quản lý lớp',
    'HOCM': 'Trưởng CM',
    'EC': 'Tư vấn viên',
    'SALE': 'Tư vấn viên',
    'TEACHER': 'Giáo viên',
    'TA': 'Trợ giảng',
    'ACCOUNTANT': 'Kế toán',
    'MKT': 'Marketing',
    'RIOM': 'Regional OM'
  };
  return roleNames[role?.toUpperCase()] || role;
}

window.buildSidebar = buildSidebar;
window.toggleSbGroup = toggleSbGroup;
window.getRoleDisplay = getRoleDisplay;
