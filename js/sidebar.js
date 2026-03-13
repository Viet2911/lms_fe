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

    /* User dropdown */
    .sb-user-dropdown { display: flex; flex-direction: column; }
    .sb-user-chevron {
      font-size: 10px;
      color: var(--text-muted);
      transition: transform 0.2s;
      margin-left: auto;
    }
    .sb-user-dropdown.open .sb-user-chevron { transform: rotate(180deg); }
    .sb-user-menu {
      display: none;
      order: -1;
      margin: 0 8px 6px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }
    .sb-user-dropdown.open .sb-user-menu { display: block; }
    .sb-user-menu-info {
      padding: 16px;
      text-align: center;
      background: var(--bg-secondary);
    }
    .sb-avatar-lg {
      width: 44px;
      height: 44px;
      font-size: 18px;
      margin: 0 auto 8px;
    }
    .sb-menu-divider { height: 1px; background: var(--border); }
    .sb-menu-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      font-size: 13px;
      color: var(--text-secondary);
      text-decoration: none;
      transition: background 0.15s, color 0.15s;
    }
    .sb-menu-item:hover { background: var(--bg-hover); color: var(--primary); text-decoration: none; }
    .sb-menu-item i { width: 16px; text-align: center; font-size: 13px; }
    .sb-menu-logout { color: #ef4444; }
    .sb-menu-logout:hover { background: rgba(239,68,68,0.08); color: #ef4444; }
    .sb-dev-info {
      padding: 10px 14px 12px;
      background: var(--bg-secondary);
    }
    .sb-dev-link {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--text-muted);
      text-decoration: none;
      padding: 3px 0;
      transition: color 0.15s;
    }
    .sb-dev-link:hover { color: var(--primary); text-decoration: none; }
    .sb-dev-link i { width: 14px; text-align: center; font-size: 11px; }

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
    .sb-logout { display: none; }

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
  if (can('classes.view')) {
    let links = '';
    links += link('classes.html', 'fas fa-chalkboard', 'Lớp học');
    html += group('grp-lop', 'fas fa-chalkboard-teacher', 'Quản lý lớp', links);
  }

  // ── Học phí ──
  if (canAny('renewals.view', 'renewals.create')) {
    let links = '';
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
      <div class="sb-user-dropdown" id="sbUserDropdown">
        <div class="sb-user" onclick="toggleUserDropdown()" style="cursor:pointer">
          <div class="sb-avatar">${initial}</div>
          <div style="flex:1">
            <div class="sb-user-name">${userName}</div>
            <div class="sb-user-role">${getRoleDisplay(role)}</div>
          </div>
          <i class="fas fa-chevron-up sb-user-chevron"></i>
        </div>
        <div class="sb-user-menu">
          <div class="sb-user-menu-info">
            <div class="sb-avatar sb-avatar-lg">${initial}</div>
            <div class="sb-user-name" style="font-size:14px">${userName}</div>
            <div class="sb-user-role">${getRoleDisplay(role)}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${auth.user?.email || ''}</div>
          </div>
          <div class="sb-menu-divider"></div>
          <a href="#" class="sb-menu-item" onclick="showChangePasswordModal(); return false;">
            <i class="fas fa-key"></i> Đổi mật khẩu
          </a>
          <div class="sb-menu-divider"></div>
          <div class="sb-dev-info">
            <div style="font-size:10px;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Liên hệ Dev</div>
            <a href="tel:0973436564" class="sb-dev-link"><i class="fas fa-phone"></i> 0973 436 564</a>
            <a href="https://zalo.me/0973436564" target="_blank" class="sb-dev-link"><i class="fas fa-comment"></i> Zalo</a>
            <a href="mailto:levietth001@gmail.com" class="sb-dev-link"><i class="fas fa-envelope"></i> levietth001@gmail.com</a>
          </div>
          <div class="sb-menu-divider"></div>
          <a href="#" class="sb-menu-item sb-menu-logout" onclick="auth.logout(); return false;">
            <i class="fas fa-sign-out-alt"></i> Đăng xuất
          </a>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div class="modal-overlay" id="changePasswordModal" onclick="if(event.target===this)closeChangePasswordModal()">
      <div class="modal-content" style="max-width:400px">
        <div class="modal-header">
          <div class="modal-title"><i class="fas fa-key"></i> Đổi mật khẩu</div>
          <button class="modal-close" onclick="closeChangePasswordModal()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Mật khẩu hiện tại</label>
            <input type="password" id="cpOldPassword" class="form-control" placeholder="Nhập mật khẩu hiện tại">
          </div>
          <div class="form-group">
            <label>Mật khẩu mới</label>
            <input type="password" id="cpNewPassword" class="form-control" placeholder="Ít nhất 6 ký tự">
          </div>
          <div class="form-group">
            <label>Xác nhận mật khẩu mới</label>
            <input type="password" id="cpConfirmPassword" class="form-control" placeholder="Nhập lại mật khẩu mới">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeChangePasswordModal()">Hủy</button>
          <button class="btn btn-primary" onclick="submitChangePassword()"><i class="fas fa-save"></i> Lưu</button>
        </div>
      </div>
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

  // Inject user chip into topbar
  buildTopbarUser();
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
    'HEAD_TEACHER': 'Trưởng giáo viên',
    'TA': 'Trợ giảng',
    'ACCOUNTANT': 'Kế toán',
    'MKT': 'Marketing',
    'RIOM': 'Regional OM'
  };
  return roleNames[role?.toUpperCase()] || role;
}

function toggleUserDropdown() {
  const el = document.getElementById('sbUserDropdown');
  if (!el) return;
  el.classList.toggle('open');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const el = document.getElementById('sbUserDropdown');
  if (el && !el.contains(e.target)) el.classList.remove('open');
});

function showChangePasswordModal() {
  document.getElementById('sbUserDropdown')?.classList.remove('open');
  document.getElementById('cpOldPassword').value = '';
  document.getElementById('cpNewPassword').value = '';
  document.getElementById('cpConfirmPassword').value = '';
  document.getElementById('changePasswordModal').style.display = 'flex';
}

function closeChangePasswordModal() {
  document.getElementById('changePasswordModal').style.display = 'none';
}

async function submitChangePassword() {
  const oldPw = document.getElementById('cpOldPassword').value;
  const newPw = document.getElementById('cpNewPassword').value;
  const confirmPw = document.getElementById('cpConfirmPassword').value;
  if (!oldPw || !newPw || !confirmPw) { notify.warning('Vui lòng điền đầy đủ thông tin'); return; }
  if (newPw.length < 6) { notify.warning('Mật khẩu mới phải có ít nhất 6 ký tự'); return; }
  if (newPw !== confirmPw) { notify.warning('Mật khẩu xác nhận không khớp'); return; }
  const btn = document.querySelector('#changePasswordModal .btn-primary');
  const orig = btn.innerHTML;
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
  try {
    await api.put('/users/change-password', { oldPassword: oldPw, newPassword: newPw });
    notify.success('Đổi mật khẩu thành công');
    closeChangePasswordModal();
  } catch (e) {
    notify.error(e.message || 'Đổi mật khẩu thất bại');
  } finally {
    btn.disabled = false; btn.innerHTML = orig;
  }
}

function buildTopbarUser() {
  const topbarRight = document.querySelector('.topbar-right');
  if (!topbarRight || document.getElementById('tbUserBtn')) return;

  const userName = auth.user?.full_name || 'User';
  const role = auth.user?.role || '';
  const initial = userName.trim().split(' ').pop()[0]?.toUpperCase() || 'U';

  // Inject styles once
  if (!document.getElementById('tb-user-styles')) {
    const st = document.createElement('style');
    st.id = 'tb-user-styles';
    st.textContent = `
      .tb-user-sep { width: 1px; height: 28px; background: var(--border); margin: 0 4px; }
      .tb-user-btn {
        display: flex; align-items: center; gap: 8px;
        padding: 5px 10px 5px 6px;
        border-radius: 50px;
        cursor: pointer;
        border: 1px solid var(--border);
        background: var(--bg-secondary);
        transition: background 0.15s, border-color 0.15s;
        position: relative;
      }
      .tb-user-btn:hover { background: var(--bg-hover); border-color: var(--primary); }
      .tb-user-btn.open { border-color: var(--primary); }
      .tb-avatar {
        width: 28px; height: 28px; border-radius: 50%;
        background: var(--primary); color: #fff;
        display: flex; align-items: center; justify-content: center;
        font-size: 12px; font-weight: 700; flex-shrink: 0;
      }
      .tb-user-info { line-height: 1.2; }
      .tb-user-name { font-size: 12px; font-weight: 600; color: var(--text-primary); white-space: nowrap; }
      .tb-user-role { font-size: 10px; color: var(--text-muted); }
      .tb-chevron { font-size: 9px; color: var(--text-muted); transition: transform 0.2s; margin-left: 2px; }
      .tb-user-btn.open .tb-chevron { transform: rotate(180deg); }
      .tb-dropdown {
        display: none;
        position: fixed;
        top: 0; right: 0;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: 14px;
        box-shadow: var(--shadow-lg);
        min-width: 220px;
        overflow: hidden;
        z-index: 9999;
      }
      .tb-dropdown.open { display: block; }
      .tb-dd-info {
        padding: 16px;
        text-align: center;
        background: var(--bg-secondary);
      }
      .tb-dd-avatar {
        width: 44px; height: 44px; border-radius: 50%;
        background: var(--primary); color: #fff;
        display: flex; align-items: center; justify-content: center;
        font-size: 18px; font-weight: 700;
        margin: 0 auto 8px;
      }
      .tb-dd-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
      .tb-dd-role { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
      .tb-dd-email { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
      .tb-dd-divider { height: 1px; background: var(--border); }
      .tb-dd-item {
        display: flex; align-items: center; gap: 10px;
        padding: 10px 14px;
        font-size: 13px; color: var(--text-secondary);
        text-decoration: none; cursor: pointer;
        transition: background 0.15s, color 0.15s;
        background: none; border: none; width: 100%; text-align: left;
      }
      .tb-dd-item:hover { background: var(--bg-hover); color: var(--primary); text-decoration: none; }
      .tb-dd-item i { width: 16px; text-align: center; font-size: 13px; }
      .tb-dd-logout { color: #ef4444; }
      .tb-dd-logout:hover { background: rgba(239,68,68,0.08); color: #ef4444; }
    `;
    document.head.appendChild(st);
  }

  // Separator + button
  const sep = document.createElement('div');
  sep.className = 'tb-user-sep';

  const btn = document.createElement('div');
  btn.id = 'tbUserBtn';
  btn.className = 'tb-user-btn';
  btn.innerHTML = `
    <div class="tb-avatar">${initial}</div>
    <div class="tb-user-info">
      <div class="tb-user-name">${userName}</div>
      <div class="tb-user-role">${getRoleDisplay(role)}</div>
    </div>
    <i class="fas fa-chevron-down tb-chevron"></i>
  `;

  // Dropdown (fixed position, positioned by JS)
  const dd = document.createElement('div');
  dd.id = 'tbDropdown';
  dd.className = 'tb-dropdown';
  dd.innerHTML = `
    <div class="tb-dd-info">
      <div class="tb-dd-avatar">${initial}</div>
      <div class="tb-dd-name">${userName}</div>
      <div class="tb-dd-role">${getRoleDisplay(role)}</div>
      <div class="tb-dd-email">${auth.user?.email || ''}</div>
    </div>
    <div class="tb-dd-divider"></div>
    <button class="tb-dd-item" onclick="closeTbDropdown(); showChangePasswordModal();">
      <i class="fas fa-key"></i> Đổi mật khẩu
    </button>
    <div class="tb-dd-divider"></div>
    <button class="tb-dd-item tb-dd-logout" onclick="closeTbDropdown(); auth.logout();">
      <i class="fas fa-sign-out-alt"></i> Đăng xuất
    </button>
  `;
  document.body.appendChild(dd);

  topbarRight.appendChild(sep);
  topbarRight.appendChild(btn);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = btn.classList.toggle('open');
    dd.classList.toggle('open', isOpen);
    if (isOpen) {
      // Position dropdown below the button
      const rect = btn.getBoundingClientRect();
      dd.style.top = (rect.bottom + 6) + 'px';
      dd.style.right = (window.innerWidth - rect.right) + 'px';
      dd.style.left = 'auto';
    }
  });

  document.addEventListener('click', () => closeTbDropdown());
  dd.addEventListener('click', (e) => e.stopPropagation());
}

function closeTbDropdown() {
  document.getElementById('tbUserBtn')?.classList.remove('open');
  document.getElementById('tbDropdown')?.classList.remove('open');
}

window.buildSidebar = buildSidebar;
window.buildTopbarUser = buildTopbarUser;
window.closeTbDropdown = closeTbDropdown;
window.toggleSbGroup = toggleSbGroup;
window.getRoleDisplay = getRoleDisplay;
window.toggleUserDropdown = toggleUserDropdown;
window.showChangePasswordModal = showChangePasswordModal;
window.closeChangePasswordModal = closeChangePasswordModal;
window.submitChangePassword = submitChangePassword;
