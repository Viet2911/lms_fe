/**
 * LMS CRUD Mixin - Easy reactive CRUD for any page
 * Usage: const crud = createCrud({ ... options });
 */

function createCrud(options) {
    const {
        // API endpoints
        apiBase,                    // e.g., '/students'

        // DOM selectors
        tableId,                    // e.g., 'studentsTable'
        gridId,                     // e.g., 'studentsGrid' (for card layout)
        formModalId,                // e.g., 'formModal'
        formId,                     // e.g., 'studentForm'

        // State key
        stateKey,                   // e.g., 'students'

        // Render functions
        renderRow,                  // (item) => '<tr>...</tr>'
        renderCard,                 // (item) => '<div>...</div>'
        renderEmptyState,           // () => '<div>...</div>'

        // Validation schema
        validationSchema,           // { fieldName: [rules] }

        // Data mapping
        formToData,                 // (form) => data object
        dataToForm,                 // (data, form) => void

        // Callbacks
        onBeforeSave,               // async (data, isEdit) => data or false
        onAfterSave,                // async (result, isEdit) => void
        onBeforeDelete,             // async (id) => true/false
        onAfterDelete,              // async (id) => void

        // Messages
        messages = {}
    } = options;

    const defaultMessages = {
        createSuccess: 'Tạo thành công',
        updateSuccess: 'Cập nhật thành công',
        deleteSuccess: 'Xóa thành công',
        deleteConfirm: 'Bạn có chắc muốn xóa?',
        validationError: 'Vui lòng kiểm tra lại thông tin',
        loadError: 'Không thể tải dữ liệu',
        ...messages
    };

    // Initialize state
    if (!state.get(stateKey)) {
        state.set(stateKey, []);
    }

    return {
        // Load data from API
        async load(params = {}) {
            const container = document.getElementById(tableId) || document.getElementById(gridId);
            if (container) {
                loading.skeleton(container, 5, gridId ? 'card' : 'row');
            }

            try {
                const query = new URLSearchParams(params).toString();
                const url = query ? `${apiBase}?${query}` : apiBase;
                const result = await api.get(url);

                const items = result.data || [];
                state.set(stateKey, items);

                this.render(items, result.pagination);
                return { items, pagination: result.pagination };
            } catch (e) {
                notify.error(defaultMessages.loadError);
                if (container) {
                    container.innerHTML = `<div class="empty-state"><p>${e.message}</p></div>`;
                }
                throw e;
            }
        },

        // Render items
        render(items, pagination) {
            const table = document.getElementById(tableId);
            const grid = document.getElementById(gridId);

            if (table) {
                const tbody = table.querySelector('tbody') || table;
                if (!items.length) {
                    tbody.innerHTML = renderEmptyState ? renderEmptyState() : '<tr><td colspan="100" class="text-center">Không có dữ liệu</td></tr>';
                } else {
                    tbody.innerHTML = items.map(renderRow).join('');
                    animate.staggerChildren(tbody, 'tr', 'fadeIn', 30);
                }
            }

            if (grid) {
                if (!items.length) {
                    grid.innerHTML = renderEmptyState ? renderEmptyState() : '<div class="empty-state">Không có dữ liệu</div>';
                } else {
                    grid.innerHTML = items.map(renderCard).join('');
                    animate.staggerChildren(grid, '[data-id]', 'scaleIn', 50);
                }
            }
        },

        // Open form for create/edit
        async openForm(id = null) {
            const form = document.getElementById(formId);
            const modal = document.getElementById(formModalId);

            if (!form || !modal) return;

            // Reset form
            form.reset();
            form.querySelectorAll('.error-message').forEach(el => el.remove());
            form.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
                el.classList.remove('is-invalid', 'is-valid');
            });

            // Set form ID field
            const idField = form.querySelector('[name="id"]') || form.querySelector('#formId');
            if (idField) idField.value = id || '';

            // Update modal title
            const title = modal.querySelector('.modal-title');
            if (title) {
                title.textContent = id ? 'Chỉnh sửa' : 'Thêm mới';
            }

            // Load data if editing
            if (id && dataToForm) {
                try {
                    const result = await api.get(`${apiBase}/${id}`);
                    dataToForm(result.data, form);
                } catch (e) {
                    notify.error('Không thể tải dữ liệu');
                    return;
                }
            }

            // Setup realtime validation
            if (validationSchema) {
                validate.setupRealtimeValidation(form, validationSchema);
            }

            // Show modal
            reactive.modal.show(formModalId);
        },

        // Save form (create or update)
        async save() {
            const form = document.getElementById(formId);
            if (!form) return;

            const submitBtn = form.querySelector('button[type="submit"]') ||
                document.querySelector(`#${formModalId} .btn-primary`);

            // Validate
            if (validationSchema) {
                const { isValid } = validate.validateForm(form, validationSchema);
                if (!isValid) {
                    notify.warning(defaultMessages.validationError);
                    animate.shake(form);
                    return;
                }
            }

            // Get data
            const idField = form.querySelector('[name="id"]') || form.querySelector('#formId');
            const id = idField?.value;
            const isEdit = !!id;

            let data = formToData ? formToData(form) : new FormData(form);

            // Before save callback
            if (onBeforeSave) {
                data = await onBeforeSave(data, isEdit);
                if (data === false) return;
            }

            // Show loading
            loading.buttonStart(submitBtn, isEdit ? 'Đang cập nhật...' : 'Đang tạo...');

            try {
                let result;

                if (isEdit) {
                    result = await api.put(`${apiBase}/${id}`, data);

                    // Update state
                    state.updateItem(stateKey, parseInt(id), { ...data, id: parseInt(id) });

                    // Update UI
                    const row = document.querySelector(`tr[data-id="${id}"]`);
                    const card = document.querySelector(`[data-id="${id}"]`);

                    if (row && renderRow) {
                        await animate.highlight(row, '#dcfce7', 800);
                        row.outerHTML = renderRow({ ...data, id: parseInt(id), ...result.data });
                    }
                    if (card && renderCard) {
                        await animate.highlight(card, '#dbeafe', 800);
                        card.outerHTML = renderCard({ ...data, id: parseInt(id), ...result.data });
                    }

                    notify.success(defaultMessages.updateSuccess);
                } else {
                    result = await api.post(apiBase, data);

                    const newItem = { ...data, ...result.data };
                    state.addItem(stateKey, newItem);

                    // Add to UI
                    if (tableId && renderRow) {
                        crud.renderRow(tableId, newItem, renderRow, true);
                    }
                    if (gridId && renderCard) {
                        crud.renderCard(gridId, newItem, renderCard, true);
                    }

                    notify.success(defaultMessages.createSuccess);
                }

                // After save callback
                if (onAfterSave) {
                    await onAfterSave(result, isEdit);
                }

                // Close modal
                await reactive.modal.hide(formModalId);

            } catch (e) {
                notify.error(e.message);
                animate.shake(form);
            } finally {
                loading.buttonEnd(submitBtn);
            }
        },

        // Delete item
        async delete(id) {
            if (!confirm(defaultMessages.deleteConfirm)) return;

            // Before delete callback
            if (onBeforeDelete) {
                const canDelete = await onBeforeDelete(id);
                if (!canDelete) return;
            }

            try {
                await api.delete(`${apiBase}/${id}`);

                // Remove from state
                state.removeItem(stateKey, id);

                // Remove from UI
                const result = await crud.removeRow(tableId, id) || await crud.removeCard(gridId, id);

                // Show empty state if needed
                if (result === 'empty' && renderEmptyState) {
                    const container = document.getElementById(tableId) || document.getElementById(gridId);
                    if (container) {
                        const tbody = container.querySelector('tbody') || container;
                        tbody.innerHTML = renderEmptyState();
                    }
                }

                notify.success(defaultMessages.deleteSuccess);

                // After delete callback
                if (onAfterDelete) {
                    await onAfterDelete(id);
                }

            } catch (e) {
                notify.error(e.message);
            }
        },

        // Get current items from state
        getItems() {
            return state.get(stateKey) || [];
        },

        // Find item by ID
        findById(id) {
            const items = this.getItems();
            return items.find(item => item.id === parseInt(id));
        }
    };
}

// Export
window.createCrud = createCrud;

