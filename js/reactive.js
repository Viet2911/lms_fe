/**
 * LMS Reactive UI System
 * - State management without page reload
 * - Smooth animations
 * - Form validation
 */

// ==================== REACTIVE STATE ====================
class ReactiveState {
    constructor() {
        this.state = {};
        this.listeners = {};
    }

    // Set state and notify listeners
    set(key, value) {
        const oldValue = this.state[key];
        this.state[key] = value;

        if (this.listeners[key]) {
            this.listeners[key].forEach(callback => {
                callback(value, oldValue);
            });
        }
    }

    // Get state
    get(key) {
        return this.state[key];
    }

    // Subscribe to state changes
    subscribe(key, callback) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(callback);

        // Return unsubscribe function
        return () => {
            this.listeners[key] = this.listeners[key].filter(cb => cb !== callback);
        };
    }

    // Update item in array state
    updateItem(key, id, updates) {
        const items = this.state[key] || [];
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            this.set(key, [...items]);
            return items[index];
        }
        return null;
    }

    // Add item to array state
    addItem(key, item) {
        const items = this.state[key] || [];
        this.set(key, [item, ...items]);
        return item;
    }

    // Remove item from array state
    removeItem(key, id) {
        const items = this.state[key] || [];
        this.set(key, items.filter(item => item.id !== id));
    }
}

const state = new ReactiveState();

// ==================== ANIMATIONS ====================
const animate = {
    // Fade in element
    fadeIn(element, duration = 300) {
        if (!element) return Promise.resolve();
        element.style.opacity = '0';
        element.style.display = '';
        element.style.transition = `opacity ${duration}ms ease`;

        return new Promise(resolve => {
            requestAnimationFrame(() => {
                element.style.opacity = '1';
                setTimeout(resolve, duration);
            });
        });
    },

    // Fade out element
    fadeOut(element, duration = 300) {
        if (!element) return Promise.resolve();
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = '0';

        return new Promise(resolve => {
            setTimeout(() => {
                element.style.display = 'none';
                element.style.opacity = '';
                element.style.transition = '';
                resolve();
            }, duration);
        });
    },

    // Slide down (expand)
    slideDown(element, duration = 300) {
        if (!element) return Promise.resolve();
        element.style.display = '';
        const height = element.scrollHeight;
        element.style.height = '0';
        element.style.overflow = 'hidden';
        element.style.transition = `height ${duration}ms ease`;

        return new Promise(resolve => {
            requestAnimationFrame(() => {
                element.style.height = height + 'px';
                setTimeout(() => {
                    // Xóa inline styles sau animation
                    element.style.height = '';
                    element.style.overflow = '';
                    element.style.transition = '';
                    resolve();
                }, duration);
            });
        });
    },

    // Slide up (collapse)
    slideUp(element, duration = 300) {
        if (!element) return Promise.resolve();
        element.style.height = element.scrollHeight + 'px';
        element.style.overflow = 'hidden';
        element.style.transition = `height ${duration}ms ease`;

        return new Promise(resolve => {
            requestAnimationFrame(() => {
                element.style.height = '0';
                setTimeout(() => {
                    element.style.display = 'none';
                    // Xóa tất cả inline styles animation để không conflict với lần sau
                    element.style.height = '';
                    element.style.overflow = '';
                    element.style.transition = '';
                    resolve();
                }, duration);
            });
        });
    },

    // Scale in (pop)
    scaleIn(element, duration = 200) {
        if (!element) return Promise.resolve();
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0';
        element.style.display = '';
        element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;

        return new Promise(resolve => {
            requestAnimationFrame(() => {
                element.style.transform = 'scale(1)';
                element.style.opacity = '1';
                setTimeout(resolve, duration);
            });
        });
    },

    // Scale out
    scaleOut(element, duration = 200) {
        if (!element) return Promise.resolve();
        element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0';

        return new Promise(resolve => {
            setTimeout(() => {
                element.style.display = 'none';
                // Xóa tất cả inline styles để không conflict
                element.style.transform = '';
                element.style.opacity = '';
                element.style.transition = '';
                resolve();
            }, duration);
        });
    },

    // Highlight (flash)
    highlight(element, color = '#fef3c7', duration = 1000) {
        if (!element) return Promise.resolve();
        const originalBg = element.style.backgroundColor;
        element.style.transition = `background-color ${duration / 2}ms ease`;
        element.style.backgroundColor = color;

        return new Promise(resolve => {
            setTimeout(() => {
                element.style.backgroundColor = originalBg;
                setTimeout(resolve, duration / 2);
            }, duration / 2);
        });
    },

    // Shake (error)
    shake(element, duration = 400) {
        if (!element) return Promise.resolve();
        element.style.animation = `shake ${duration}ms ease`;

        return new Promise(resolve => {
            setTimeout(() => {
                element.style.animation = '';
                resolve();
            }, duration);
        });
    },

    // Pulse
    pulse(element, duration = 300) {
        if (!element) return Promise.resolve();
        element.style.animation = `pulse ${duration}ms ease`;

        return new Promise(resolve => {
            setTimeout(() => {
                element.style.animation = '';
                resolve();
            }, duration);
        });
    },

    // Stagger children animations
    staggerChildren(container, selector, animation = 'fadeIn', delay = 50) {
        const children = container.querySelectorAll(selector);
        const promises = [];

        children.forEach((child, index) => {
            child.style.opacity = '0';
            setTimeout(() => {
                promises.push(this[animation](child));
            }, index * delay);
        });

        return Promise.all(promises);
    }
};

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes slideInRight {
    from { transform: translateX(20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideInUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.05); }
    70% { transform: scale(0.9); }
    100% { transform: scale(1); opacity: 1; }
  }
  
  .animate-fade-in { animation: fadeIn 0.3s ease; }
  .animate-slide-in-right { animation: slideInRight 0.3s ease; }
  .animate-slide-in-up { animation: slideInUp 0.3s ease; }
  .animate-bounce-in { animation: bounceIn 0.4s ease; }
  
  /* Row animations */
  .row-enter { animation: slideInUp 0.3s ease; }
  .row-exit { animation: slideInUp 0.3s ease reverse; }
  .row-update { animation: pulse 0.3s ease; }
  
  /* Card animations */
  .card-enter { animation: bounceIn 0.4s ease; }
  
  /* Smooth transitions */
  .transition-all { transition: all 0.3s ease; }
  .transition-colors { transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease; }
  .transition-transform { transition: transform 0.2s ease; }
  .transition-opacity { transition: opacity 0.2s ease; }
  
  /* Loading skeleton */
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
  }
  
  @keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(animationStyles);

// ==================== FORM VALIDATION ====================
const validate = {
    rules: {
        required: (value, message = 'Trường này là bắt buộc') => {
            if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
                return message;
            }
            return null;
        },

        email: (value, message = 'Email không hợp lệ') => {
            if (!value) return null;
            // TLD phải có ít nhất 2 ký tự
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
            return regex.test(value) ? null : message;
        },

        phone: (value, message = 'Số điện thoại không hợp lệ') => {
            if (!value) return null;
            // Số điện thoại Việt Nam: đầu số hợp lệ (03x,05x,07x,08x,09x,02x)
            const normalized = value.replace(/\s/g, '').replace(/^\+84/, '0');
            const regex = /^0(2[0-9]|3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
            return regex.test(normalized) ? null : message;
        },

        minLength: (min) => (value, message = `Tối thiểu ${min} ký tự`) => {
            if (!value) return null;
            return value.length >= min ? null : message;
        },

        maxLength: (max) => (value, message = `Tối đa ${max} ký tự`) => {
            if (!value) return null;
            return value.length <= max ? null : message;
        },

        min: (minVal) => (value, message = `Giá trị tối thiểu là ${minVal}`) => {
            if (value === '' || value === null) return null;
            return Number(value) >= minVal ? null : message;
        },

        max: (maxVal) => (value, message = `Giá trị tối đa là ${maxVal}`) => {
            if (value === '' || value === null) return null;
            return Number(value) <= maxVal ? null : message;
        },

        pattern: (regex, message = 'Định dạng không hợp lệ') => (value) => {
            if (!value) return null;
            return regex.test(value) ? null : message;
        },

        match: (fieldId, message = 'Giá trị không khớp') => (value) => {
            const matchField = document.getElementById(fieldId);
            if (!matchField || !value) return null;
            return value === matchField.value ? null : message;
        },

        date: (value, message = 'Ngày không hợp lệ') => {
            if (!value) return null;
            // Parse YYYY-MM-DD as local date, không bị lệch timezone
            if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                const [y, m, d] = value.split('-').map(Number);
                const date = new Date(y, m - 1, d);
                return (date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d)
                    ? null : message;
            }
            const date = new Date(value);
            return isNaN(date.getTime()) ? message : null;
        },

        futureDate: (value, message = 'Ngày phải trong tương lai') => {
            if (!value) return null;
            // Parse local date để tránh lệch timezone
            let date;
            if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                const [y, m, d] = value.split('-').map(Number);
                date = new Date(y, m - 1, d);
            } else {
                date = new Date(value);
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date >= today ? null : message;
        },

        number: (value, message = 'Phải là số') => {
            if (!value && value !== 0) return null;
            return !isNaN(Number(value)) ? null : message;
        }
    },

    // Show error for a field
    showError(input, message) {
        const formGroup = input.closest('.form-group') || input.parentElement;
        formGroup.classList.add('has-error');
        input.classList.add('is-invalid');

        // Remove existing error
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = 'color:#dc2626;font-size:12px;margin-top:4px;display:flex;align-items:center;gap:4px;animation:fadeIn 0.2s ease';
        const errIcon = document.createElement('i');
        errIcon.className = 'fas fa-exclamation-circle';
        errorDiv.appendChild(errIcon);
        errorDiv.appendChild(document.createTextNode(' ' + message));
        formGroup.appendChild(errorDiv);

        // Shake animation
        animate.shake(input, 300);
    },

    // Clear error for a field
    clearError(input) {
        const formGroup = input.closest('.form-group') || input.parentElement;
        formGroup.classList.remove('has-error');
        input.classList.remove('is-invalid');

        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.style.animation = 'fadeIn 0.2s ease reverse';
            setTimeout(() => errorDiv.remove(), 200);
        }
    },

    // Show success for a field
    showSuccess(input) {
        const formGroup = input.closest('.form-group') || input.parentElement;
        formGroup.classList.remove('has-error');
        formGroup.classList.add('has-success');
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    },

    // Validate single field
    validateField(input, rules = []) {
        const value = input.type === 'checkbox' ? input.checked : input.value;

        for (const rule of rules) {
            const error = typeof rule === 'function' ? rule(value) : this.rules[rule]?.(value);
            if (error) {
                this.showError(input, error);
                return false;
            }
        }

        this.clearError(input);
        if (value) this.showSuccess(input);
        return true;
    },

    // Validate entire form
    validateForm(form, schema) {
        let isValid = true;
        const errors = {};

        for (const [fieldName, rules] of Object.entries(schema)) {
            const input = form.querySelector(`[name="${fieldName}"]`) || form.querySelector(`#${fieldName}`);
            if (!input) continue;

            if (!this.validateField(input, rules)) {
                isValid = false;
                errors[fieldName] = true;
            }
        }

        return { isValid, errors };
    },

    // Setup realtime validation
    setupRealtimeValidation(form, schema) {
        for (const [fieldName, rules] of Object.entries(schema)) {
            const input = form.querySelector(`[name="${fieldName}"]`) || form.querySelector(`#${fieldName}`);
            if (!input) continue;

            // Validate on blur
            input.addEventListener('blur', () => {
                this.validateField(input, rules);
            });

            // Clear error on input
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    this.validateField(input, rules);
                }
            });
        }
    }
};

// Add validation styles
const validationStyles = document.createElement('style');
validationStyles.textContent = `
  .form-group.has-error input,
  .form-group.has-error select,
  .form-group.has-error textarea,
  input.is-invalid,
  select.is-invalid,
  textarea.is-invalid {
    border-color: #dc2626 !important;
    background-color: #fef2f2 !important;
  }
  
  .form-group.has-success input,
  .form-group.has-success select,
  .form-group.has-success textarea,
  input.is-valid,
  select.is-valid,
  textarea.is-valid {
    border-color: #16a34a !important;
  }
  
  .form-group.has-error label {
    color: #dc2626;
  }
  
  .error-message {
    color: #dc2626;
    font-size: 12px;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;
document.head.appendChild(validationStyles);

// ==================== CRUD HELPERS ====================
const crud = {
    // Render single row in table
    renderRow(tableId, item, renderFn, prepend = true) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const tbody = table.querySelector('tbody') || table;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = renderFn(item);
        const newRow = tempDiv.firstElementChild;

        if (newRow) {
            newRow.style.opacity = '0';
            if (prepend && tbody.firstChild) {
                tbody.insertBefore(newRow, tbody.firstChild);
            } else {
                tbody.appendChild(newRow);
            }

            // Animate in
            requestAnimationFrame(() => {
                newRow.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                newRow.style.opacity = '1';
                newRow.classList.add('row-enter');
            });

            return newRow;
        }
    },

    // Update existing row
    updateRow(tableId, itemId, item, renderFn) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const existingRow = table.querySelector(`tr[data-id="${itemId}"]`) ||
            table.querySelector(`[data-id="${itemId}"]`);

        if (existingRow) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = renderFn(item);
            const newRow = tempDiv.firstElementChild;

            if (newRow) {
                // Flash highlight
                animate.highlight(existingRow, '#fef3c7', 800);

                // Update content after brief delay
                setTimeout(() => {
                    existingRow.innerHTML = newRow.innerHTML;
                    existingRow.className = newRow.className;
                    animate.pulse(existingRow);
                }, 200);

                return existingRow;
            }
        }

        return null;
    },

    // Remove row with animation
    async removeRow(tableId, itemId) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const row = table.querySelector(`tr[data-id="${itemId}"]`) ||
            table.querySelector(`[data-id="${itemId}"]`);

        if (row) {
            row.style.transition = 'opacity 0.3s ease, transform 0.3s ease, height 0.3s ease';
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';

            await new Promise(resolve => setTimeout(resolve, 300));
            row.remove();

            // Check if table is empty
            const tbody = table.querySelector('tbody') || table;
            if (!tbody.children.length) {
                return 'empty';
            }
        }
    },

    // Render card in grid
    renderCard(gridId, item, renderFn, prepend = true) {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = renderFn(item);
        const newCard = tempDiv.firstElementChild;

        if (newCard) {
            newCard.style.opacity = '0';
            newCard.style.transform = 'scale(0.8)';

            if (prepend && grid.firstChild) {
                grid.insertBefore(newCard, grid.firstChild);
            } else {
                grid.appendChild(newCard);
            }

            // Animate in
            requestAnimationFrame(() => {
                newCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                newCard.style.opacity = '1';
                newCard.style.transform = 'scale(1)';
            });

            return newCard;
        }
    },

    // Update card
    updateCard(gridId, itemId, item, renderFn) {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        const existingCard = grid.querySelector(`[data-id="${itemId}"]`);

        if (existingCard) {
            animate.highlight(existingCard, '#dbeafe', 800);

            setTimeout(() => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = renderFn(item);
                const newCard = tempDiv.firstElementChild;

                if (newCard) {
                    existingCard.innerHTML = newCard.innerHTML;
                    existingCard.className = newCard.className;
                    animate.pulse(existingCard);
                }
            }, 200);

            return existingCard;
        }

        return null;
    },

    // Remove card with animation
    async removeCard(gridId, itemId) {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        const card = grid.querySelector(`[data-id="${itemId}"]`);

        if (card) {
            await animate.scaleOut(card, 300);
            card.remove();

            if (!grid.children.length) {
                return 'empty';
            }
        }
    }
};

// ==================== ENHANCED MODAL ====================
const modalEnhanced = {
    show(modalId, options = {}) {
        const modalOverlay = document.getElementById(modalId);
        if (!modalOverlay) return;

        const modalContent = modalOverlay.querySelector('.modal-content');

        modalOverlay.style.display = 'flex';
        modalOverlay.style.opacity = '0';

        if (modalContent) {
            modalContent.style.transform = 'scale(0.9) translateY(-20px)';
            modalContent.style.opacity = '0';
        }

        requestAnimationFrame(() => {
            modalOverlay.style.transition = 'opacity 0.2s ease';
            modalOverlay.style.opacity = '1';
            modalOverlay.classList.add('show');

            if (modalContent) {
                modalContent.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                modalContent.style.transform = 'scale(1) translateY(0)';
                modalContent.style.opacity = '1';
            }
        });

        // Focus first input
        if (options.focusFirst !== false) {
            setTimeout(() => {
                const firstInput = modalOverlay.querySelector('input:not([type="hidden"]), select, textarea');
                if (firstInput) firstInput.focus();
            }, 300);
        }
    },

    async hide(modalId) {
        const modalOverlay = document.getElementById(modalId);
        if (!modalOverlay) return;

        const modalContent = modalOverlay.querySelector('.modal-content');

        if (modalContent) {
            modalContent.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
            modalContent.style.transform = 'scale(0.9) translateY(-20px)';
            modalContent.style.opacity = '0';
        }

        modalOverlay.style.transition = 'opacity 0.2s ease';
        modalOverlay.style.opacity = '0';

        await new Promise(resolve => setTimeout(resolve, 200));

        modalOverlay.classList.remove('show');
        modalOverlay.style.display = 'none';

        // Reset form if exists
        const form = modalOverlay.querySelector('form');
        if (form) {
            form.reset();
            form.querySelectorAll('.error-message').forEach(el => el.remove());
            form.querySelectorAll('.is-invalid, .is-valid, .has-error, .has-success').forEach(el => {
                el.classList.remove('is-invalid', 'is-valid', 'has-error', 'has-success');
            });
        }
    }
};

// ==================== ENHANCED NOTIFICATIONS ====================
const notify = {
    container: null,

    init() {
        if (this.container) return;

        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    `;
        document.body.appendChild(this.container);
    },

    show(message, type = 'info', duration = 4000) {
        this.init();

        // Giới hạn tối đa 5 notifications, xóa cái cũ nhất nếu vượt
        const existing = this.container.querySelectorAll('.notification');
        if (existing.length >= 5) {
            existing[0].remove();
        }

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        const colors = {
            success: { bg: '#dcfce7', border: '#22c55e', text: '#166534', icon: '#22c55e' },
            error: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', icon: '#ef4444' },
            warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', icon: '#f59e0b' },
            info: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', icon: '#3b82f6' }
        };

        const color = colors[type] || colors.info;

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
      background: ${color.bg};
      border: 1px solid ${color.border};
      border-left: 4px solid ${color.border};
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateX(120%);
      transition: transform 0.3s ease;
    `;

        const notifIcon = document.createElement('i');
        notifIcon.className = `fas ${icons[type]}`;
        notifIcon.style.cssText = `color:${color.icon};font-size:18px;margin-top:2px`;
        const notifText = document.createElement('div');
        notifText.style.cssText = `flex:1;color:${color.text};font-size:14px`;
        notifText.textContent = message;
        const notifClose = document.createElement('button');
        notifClose.style.cssText = `background:none;border:none;color:${color.text};cursor:pointer;padding:0;font-size:16px;opacity:0.7`;
        notifClose.innerHTML = '<i class="fas fa-times"></i>';
        notifClose.addEventListener('click', () => notification.remove());
        notification.appendChild(notifIcon);
        notification.appendChild(notifText);
        notification.appendChild(notifClose);

        this.container.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                notification.style.transform = 'translateX(120%)';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }

        return notification;
    },

    success(message, duration) { return this.show(message, 'success', duration); },
    error(message, duration) { return this.show(message, 'error', duration); },
    warning(message, duration) { return this.show(message, 'warning', duration); },
    info(message, duration) { return this.show(message, 'info', duration); }
};

// ==================== LOADING STATES ====================
const reactiveLoading = {
    // Show loading overlay
    show(container, message = 'Đang tải...') {
        const el = typeof container === 'string' ? document.getElementById(container) : container;
        if (!el) return;

        // Store original content
        el.dataset.originalContent = el.innerHTML;

        el.innerHTML = `
      <div class="loading-overlay" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;gap:16px">
        <div class="spinner" style="width:40px;height:40px;border:3px solid #e5e7eb;border-top-color:#3b82f6;border-radius:50%;animation:spin 0.8s linear infinite"></div>
        <div style="color:#6b7280;font-size:14px">${message}</div>
      </div>
    `;
    },

    // Hide loading and restore content
    hide(container) {
        const el = typeof container === 'string' ? document.getElementById(container) : container;
        if (!el) return;

        if (el.dataset.originalContent) {
            el.innerHTML = el.dataset.originalContent;
            delete el.dataset.originalContent;
        }
    },

    // Button loading state — chặn double-click ngay lập tức
    buttonStart(button, text = 'Đang xử lý...') {
        const btn = typeof button === 'string' ? document.querySelector(button) : button;
        if (!btn) return;
        if (btn.dataset.loading === 'true') return;

        btn.dataset.loading = 'true';
        btn.dataset.originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    },

    // Button restore
    buttonEnd(button) {
        const btn = typeof button === 'string' ? document.querySelector(button) : button;
        if (!btn) return;

        btn.dataset.loading = '';
        btn.disabled = false;
        if (btn.dataset.originalText) {
            btn.innerHTML = btn.dataset.originalText;
            delete btn.dataset.originalText;
        }
    },

    // Skeleton loading
    skeleton(container, count = 3, type = 'row') {
        const el = typeof container === 'string' ? document.getElementById(container) : container;
        if (!el) return;

        const skeletons = {
            row: `<div class="skeleton" style="height:60px;border-radius:8px;margin-bottom:8px"></div>`,
            card: `<div class="skeleton" style="height:200px;border-radius:12px"></div>`,
            text: `<div class="skeleton" style="height:20px;border-radius:4px;margin-bottom:8px"></div>`
        };

        el.innerHTML = Array(count).fill(skeletons[type] || skeletons.row).join('');
    }
};

// Add spinner animation
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);

// ==================== EXPORT ====================
window.reactive = {
    state,
    animate,
    validate,
    crud,
    modal: modalEnhanced,
    notify,
    loading: reactiveLoading
};

// Global shortcuts for easy access
window.state = state;
window.animate = animate;
window.validate = validate;
window.notify = notify;
window.crud = crud;

// Extend existing loading if exists, otherwise create new
if (window.loading) {
    window.loading.buttonStart = reactiveLoading.buttonStart;
    window.loading.buttonEnd = reactiveLoading.buttonEnd;
    window.loading.skeleton = reactiveLoading.skeleton;
} else {
    window.loading = reactiveLoading;
}

// Backward compatibility
window.ui = window.ui || {};
window.ui.success = (msg) => notify.success(msg);
window.ui.error = (msg) => notify.error(msg);
window.ui.warning = (msg) => notify.warning(msg);
window.ui.info = (msg) => notify.info(msg);

console.log('✅ LMS Reactive UI System loaded');