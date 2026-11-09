// Conductor ERP MDI Desktop Application Manager
const App = {
    currentUser: null,
    windows: {},
    activeWinId: null,
    baseZIndex: 100,

    showToast(message, type = 'success', duration = 1800) {
        let container = document.getElementById('erp-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'erp-toast-container';
            container.style.cssText = 'position:fixed; top:52px; left:50%; transform:translateX(-50%); z-index:9999999; display:flex; flex-direction:column; align-items:center; gap:8px; pointer-events:none;';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `erp-toast erp-toast-${type}`;
        
        let iconHtml = '✔';
        let color = '#2E7D32';
        let border = '#81C784';

        if (type === 'info') {
            iconHtml = 'ℹ';
            color = '#1565C0';
            border = '#64B5F6';
        } else if (type === 'warning') {
            iconHtml = '⚠️';
            color = '#E65100';
            border = '#FFB74D';
        } else if (type === 'error') {
            iconHtml = '✖';
            color = '#C62828';
            border = '#E57373';
        }

        toast.style.cssText = `
            pointer-events: auto;
            min-width: 200px;
            max-width: 480px;
            padding: 8px 16px;
            background: #FFFFFF;
            border: 1px solid ${border};
            border-left: 5px solid ${color};
            box-shadow: 0 4px 14px rgba(0,0,0,0.22);
            color: #222222;
            font-size: 13px;
            font-family: "PMingLiU", "Microsoft JhengHei", sans-serif;
            border-radius: 3px;
            display: flex;
            align-items: center;
            gap: 10px;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.25s ease, transform 0.25s ease;
            cursor: pointer;
        `;

        toast.innerHTML = `
            <span style="font-weight:bold; font-size:16px; color:${color}; line-height:1;">${iconHtml}</span>
            <span style="flex:1; line-height:1.4;">${String(message).replace(/\\n/g, '<br>')}</span>
        `;

        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        const closeToast = () => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 250);
        };

        toast.addEventListener('click', closeToast);
        setTimeout(closeToast, duration);
    },

    async init() {
        // 全域攔截 alert，改為自動消失的 Toast 提示，不阻斷使用者操作
        window.alert = (msg) => {
            this.showToast(msg, 'info', 2000);
        };

        // Check current session
        const res = await ERP_API.get('current_user');
        if (res.success && res.user) {
            this.currentUser = res.user;
            this.showConductor();
        } else {
            this.showLogin();
        }

        this.bindGlobalEvents();
    },

    showLogin() {
        document.getElementById('login-modal').style.display = 'flex';
        document.getElementById('conductor-app').style.display = 'none';
    },

    showConductor() {
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('conductor-app').style.display = 'flex';
        
        // 確保剛登入時為空白主畫面，不殘留或自動跳出任何子系統視窗
        this.closeAllWindows(true);
        
        // Update user & company labels in topbar
        if (this.currentUser) {
            const label = `Conductor [${this.currentUser.username}-${this.currentUser.display_name}]`;
            document.title = label;
            const topTitle = document.getElementById('conductor-title-text');
            if (topTitle) topTitle.textContent = label;

            const userDisplay = document.getElementById('top-user-display');
            if (userDisplay) userDisplay.textContent = `${this.currentUser.display_name} [${this.currentUser.company || '學生區B18'}]`;

            const companySelect = document.getElementById('ribbon-company-select');
            if (companySelect && this.currentUser) {
                const userComp = this.currentUser.company || ('學生區' + (this.currentUser.username || ''));
                companySelect.innerHTML = `<option value="${userComp}">${userComp}</option>`;
                companySelect.value = userComp;
                companySelect.disabled = true;
                companySelect.style.background = '#ECE9D8';
                companySelect.style.color = '#333333';
                companySelect.style.cursor = 'not-allowed';
            }
        }

        // Permission check: ribbon button for admin
        const isAdmin = this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.username === 'admin');
        const adminTree = document.getElementById('tree-node-admin');
        if (adminTree) {
            adminTree.style.display = 'block';
        }
        const adminRibbon = document.getElementById('ribbon-btn-sec-user');
        if (adminRibbon) {
            adminRibbon.style.display = isAdmin ? 'inline-flex' : 'none';
        }

        // Render initial flowchart
        if (typeof Flowcharts !== 'undefined') {
            Flowcharts.render('order');
        }

        // 支援網址參數直接開啟特定模組作業 (例如 ?open=COPI06 或 ?open=INVI02)
        const urlParams = new URLSearchParams(window.location.search);
        const autoModule = urlParams.get('open') || urlParams.get('auto_open');
        if (autoModule && typeof Modules !== 'undefined' && Modules.open) {
            setTimeout(() => {
                Modules.open(autoModule);
            }, 120);
        }

        // 支援網址參數模擬開窗挑選對話框測試 (例如 ?lookup=customer)
        if (urlParams.get('lookup') && typeof Modules !== 'undefined' && Modules.openLookup) {
            setTimeout(() => {
                Modules.openLookup(urlParams.get('lookup'), (row) => console.log('Selected:', row));
            }, 300);
        }

        // 支援網址參數模擬平板側邊選單開啟測試 (例如 ?drawer=1)
        if (urlParams.get('drawer') === '1' && window.innerWidth <= 850) {
            const navSidebar = document.querySelector('.nav-sidebar');
            const backdrop = document.getElementById('sidebar-backdrop');
            if (navSidebar) navSidebar.classList.add('drawer-open');
            if (backdrop) backdrop.classList.add('active');
        }
    },

    bindGlobalEvents() {
        // Login Submit
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const u = document.getElementById('login-username').value.trim();
                const p = document.getElementById('login-password').value.trim();
                const c = document.getElementById('login-company').value;
                if (!u) {
                    alert('請輸入帳號');
                    return;
                }
                const res = await ERP_API.post('login', { username: u, password: p, company: c });
                if (res.success) {
                    this.currentUser = res.user;
                    this.showConductor();
                } else {
                    alert(res.error || '登入失敗');
                }
            });
        }

        // Real-time Company Sync: 只要輸入帳號，公司自動轉換為「學生區+帳號名」
        const usernameInp = document.getElementById('login-username');
        const companySel = document.getElementById('login-company');
        if (usernameInp && companySel) {
            let dynamicOpt = null;
            const syncCompany = () => {
                const val = usernameInp.value.trim();
                const targetCompany = val ? ('學生區' + val) : '學生區';
                if (!dynamicOpt) {
                    dynamicOpt = new Option(targetCompany, targetCompany);
                    companySel.add(dynamicOpt, 0);
                } else {
                    dynamicOpt.value = targetCompany;
                    dynamicOpt.text = targetCompany;
                }
                companySel.value = targetCompany;
            };
            usernameInp.addEventListener('input', syncCompany);
            usernameInp.addEventListener('change', syncCompany);
            usernameInp.addEventListener('keyup', syncCompany);
        }

        // Tree Node Expand / Collapse Handler (1:1 擷取4 - 支援點選收合與展開，並連動切換流程圖)
        const sidebarTree = document.getElementById('sidebar-tree');
        if (sidebarTree) {
            sidebarTree.addEventListener('click', (e) => {
                const label = e.target.closest('.tree-item-label[data-action="toggle-folder"]');
                if (!label) return;
                const node = label.closest('.folder-node');
                if (!node) return;
                const children = node.querySelector(':scope > .tree-children');
                const arrow = label.querySelector('.tree-arrow');
                const folder = label.querySelector('.tree-folder');
                
                const isExpanded = node.classList.contains('expanded');
                if (isExpanded) {
                    node.classList.remove('expanded');
                    node.classList.add('collapsed');
                    if (children) children.style.display = 'none';
                    if (arrow) arrow.textContent = '>';
                    if (folder) folder.textContent = '📁';
                } else {
                    node.classList.remove('collapsed');
                    node.classList.add('expanded');
                    if (children) children.style.display = 'block';
                    if (arrow) arrow.textContent = 'v';
                    if (folder) folder.textContent = '📂';
                }

                // Automatic flowchart switching when clicking major system folders
                const labelText = label.textContent || '';
                if (labelText.includes('主系統架構圖')) {
                    if (typeof Flowcharts !== 'undefined') Flowcharts.render('all');
                    if (typeof switchCanvasTab === 'function') switchCanvasTab('flow');
                } else if (labelText.includes('訂單管理系統')) {
                    if (typeof Flowcharts !== 'undefined') Flowcharts.render('order');
                    if (typeof switchCanvasTab === 'function') switchCanvasTab('flow');
                } else if (labelText.includes('採購管理系統')) {
                    if (typeof Flowcharts !== 'undefined') Flowcharts.render('purchase');
                    if (typeof switchCanvasTab === 'function') switchCanvasTab('flow');
                } else if (labelText.includes('庫存管理系統')) {
                    if (typeof Flowcharts !== 'undefined') Flowcharts.render('inventory');
                    if (typeof switchCanvasTab === 'function') switchCanvasTab('flow');
                }
            });
        }

        // Sidebar Splitter & Collapse / Expand Toggle
        const navSidebar = document.querySelector('.nav-sidebar');
        const splitter = document.getElementById('sidebar-splitter');
        const toggleBtn = document.getElementById('sidebar-toggle-btn');
        const tabletToggleBtn = document.getElementById('tablet-menu-toggle-btn');
        const backdrop = document.getElementById('sidebar-backdrop');
        let lastSidebarWidth = 270;

        // 平板專用選單按鈕 (☰ 選單) 與遮罩控制
        if (tabletToggleBtn && navSidebar) {
            tabletToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isTabletPortrait = window.innerWidth <= 850;
                if (isTabletPortrait) {
                    const isOpen = navSidebar.classList.contains('drawer-open');
                    if (isOpen) {
                        navSidebar.classList.remove('drawer-open');
                        if (backdrop) backdrop.classList.remove('active');
                    } else {
                        navSidebar.classList.add('drawer-open');
                        if (backdrop) backdrop.classList.add('active');
                    }
                } else {
                    // 平板橫向或桌面模式切換
                    navSidebar.classList.toggle('collapsed');
                    if (toggleBtn) {
                        toggleBtn.textContent = navSidebar.classList.contains('collapsed') ? '▶' : '◀';
                        toggleBtn.title = navSidebar.classList.contains('collapsed') ? '展開左側選單' : '收合左側選單';
                    }
                }
            });
        }

        if (backdrop && navSidebar) {
            backdrop.addEventListener('click', () => {
                navSidebar.classList.remove('drawer-open');
                backdrop.classList.remove('active');
            });
        }

        // 平板直向模式下點選作業節點自動關閉抽屜選單
        if (sidebarTree && navSidebar) {
            sidebarTree.addEventListener('click', (e) => {
                const leaf = e.target.closest('.leaf-node');
                if (leaf && window.innerWidth <= 850) {
                    navSidebar.classList.remove('drawer-open');
                    if (backdrop) backdrop.classList.remove('active');
                }
            });
        }

        if (toggleBtn && navSidebar) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isCollapsed = navSidebar.classList.contains('collapsed');
                if (isCollapsed) {
                    navSidebar.classList.remove('collapsed');
                    navSidebar.style.width = lastSidebarWidth + 'px';
                    toggleBtn.textContent = '◀';
                    toggleBtn.title = '收合左側選單';
                } else {
                    const currW = navSidebar.offsetWidth;
                    if (currW > 100) lastSidebarWidth = currW;
                    navSidebar.classList.add('collapsed');
                    toggleBtn.textContent = '▶';
                    toggleBtn.title = '展開左側選單';
                }
            });
        }

        // Draggable Splitter
        if (splitter && navSidebar) {
            let isDragging = false;
            let startX = 0;
            let startW = 0;

            splitter.addEventListener('mousedown', (e) => {
                if (e.target === toggleBtn) return;
                if (navSidebar.classList.contains('collapsed')) return;
                isDragging = true;
                startX = e.clientX;
                startW = navSidebar.offsetWidth;
                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const newW = Math.max(180, Math.min(500, startW + (e.clientX - startX)));
                navSidebar.style.width = newW + 'px';
                lastSidebarWidth = newW;
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    document.body.style.cursor = '';
                    document.body.style.userSelect = '';
                }
            });
        }

        // 監聽螢幕旋轉與視窗大小變更 (平板橫直向自適應)
        window.addEventListener('resize', () => {
            this.handleViewportResize();
        });
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleViewportResize(), 200);
        });

        // Search in Sidebar
        const searchInput = document.getElementById('sidebar-prog-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterTree(e.target.value.trim().toLowerCase());
            });
        }

        // Ribbon Tabs
        document.querySelectorAll('.ribbon-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.ribbon-tab').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // Re-login button
        const reloginBtn = document.getElementById('btn-relogin');
        if (reloginBtn) {
            reloginBtn.addEventListener('click', async () => {
                if (confirm('確定要切換帳號或重新登入嗎？')) {
                    await ERP_API.get('logout');
                    this.currentUser = null;
                    this.closeAllWindows();
                    this.showLogin();
                }
            });
        }

        // Exit button
        const exitBtn = document.getElementById('btn-exit');
        if (exitBtn) {
            exitBtn.addEventListener('click', async () => {
                if (confirm('確定要關閉系統並登出嗎？')) {
                    await ERP_API.get('logout');
                    window.location.reload();
                }
            });
        }
    },

    // TreeView search filter
    filterTree(term) {
        const tree = document.getElementById('sidebar-tree');
        if (!tree) return;
        const allNodes = tree.querySelectorAll('.tree-node');
        if (!term) {
            allNodes.forEach(el => el.style.display = '');
            return;
        }
        allNodes.forEach(node => {
            const label = node.querySelector(':scope > .tree-item-label');
            const text = label ? label.textContent.toLowerCase() : '';
            const matches = text.includes(term);
            const isFolder = node.classList.contains('folder-node');

            if (matches && !isFolder) {
                node.style.display = '';
                // expand all parent folders
                let p = node.parentElement;
                while (p && p !== tree) {
                    if (p.classList.contains('tree-children')) {
                        p.style.display = 'block';
                    }
                    if (p.classList.contains('folder-node')) {
                        p.style.display = '';
                        p.classList.remove('collapsed');
                        p.classList.add('expanded');
                        const arrow = p.querySelector(':scope > .tree-item-label .tree-arrow');
                        const folder = p.querySelector(':scope > .tree-item-label .tree-folder');
                        if (arrow) arrow.textContent = 'v';
                        if (folder) folder.textContent = '📂';
                    }
                    p = p.parentElement;
                }
            } else if (!isFolder) {
                node.style.display = 'none';
            }
        });
    },

    isTabletDevice() {
        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
        return window.innerWidth <= 1366 && (isTouch || window.innerWidth <= 1280 || window.innerHeight <= 850);
    },

    // ==========================================
    // MDI WINDOW MANAGER
    // ==========================================
    openWindow(winId, title, htmlContent, width = 940, height = 580, onInit = null) {
        // If window already open, bring to front and focus
        if (this.windows[winId]) {
            const winEl = this.windows[winId].element;
            if (winEl.style.display === 'none') {
                winEl.style.display = 'flex';
            }
            this.focusWindow(winId);
            return this.windows[winId];
        }

        const isTablet = this.isTabletDevice();
        const canvasArea = document.getElementById('canvas-body');
        const canvasW = canvasArea ? canvasArea.clientWidth : window.innerWidth;
        const canvasH = canvasArea ? canvasArea.clientHeight : (window.innerHeight - 120);

        // 平板上自適應充滿可用區域，桌面上保持經典視窗大小
        const targetW = isTablet ? canvasW : Math.min(width, Math.max(320, canvasW - 20));
        const targetH = isTablet ? canvasH : Math.min(height, Math.max(300, canvasH - 20));

        const win = document.createElement('div');
        win.className = 'erp-window' + (isTablet ? ' maximized' : '');
        win.id = 'win-' + winId;
        win.style.width = targetW + 'px';
        win.style.height = targetH + 'px';

        // Cascade positioning
        const winCount = Object.keys(this.windows).length;
        const leftPos = isTablet ? 0 : Math.min(15 + (winCount % 8) * 20, Math.max(10, canvasW - targetW - 20));
        const topPos = isTablet ? 0 : Math.min(10 + (winCount % 8) * 20, Math.max(10, canvasH - targetH - 20));
        win.style.left = leftPos + 'px';
        win.style.top = topPos + 'px';
        win.style.zIndex = ++this.baseZIndex;

        // 平板直向模式下開窗自動關閉左側抽屜選單
        if (window.innerWidth <= 850) {
            const navSidebar = document.querySelector('.nav-sidebar');
            const backdrop = document.getElementById('sidebar-backdrop');
            if (navSidebar) navSidebar.classList.remove('drawer-open');
            if (backdrop) backdrop.classList.remove('active');
        }

        // Window Frame HTML
        win.innerHTML = `
            <div class="erp-window-titlebar" data-winid="${winId}">
                <div class="win-title">
                    <span class="win-wf-badge">Wf</span>
                    <span>${title}</span>
                </div>
                <div class="win-controls">
                    <button class="win-btn minimize" title="最小化" onclick="App.minimizeWindow('${winId}')">_</button>
                    <button class="win-btn maximize" title="最大化" onclick="App.maximizeWindow('${winId}')">▢</button>
                    <button class="win-btn close" title="關閉" onclick="App.closeWindow('${winId}')">✕</button>
                </div>
            </div>
            <div class="erp-window-body">
                ${htmlContent}
            </div>
        `;

        canvasArea.appendChild(win);

        // Record window
        this.windows[winId] = {
            id: winId,
            title: title,
            element: win,
            isMaximized: isTablet,
            restoreRect: { left: leftPos, top: topPos, width: targetW, height: targetH }
        };

        // Add taskbar item
        this.addTaskbarItem(winId, title);

        // Bind Window drag and click-to-focus
        this.makeDraggable(win, win.querySelector('.erp-window-titlebar'));
        win.addEventListener('mousedown', () => this.focusWindow(winId));

        this.focusWindow(winId);

        if (typeof onInit === 'function') {
            onInit(win);
        }

        // 自動聚焦至視窗內的第一個可輸入欄位（第一格）
        setTimeout(() => {
            const firstInput = win.querySelector('input:not([readonly]):not([disabled]):not([type="hidden"]), select:not([disabled])');
            if (firstInput) {
                firstInput.focus();
                if (firstInput.select && typeof firstInput.select === 'function') {
                    firstInput.select();
                }
            }
        }, 60);

        return this.windows[winId];
    },

    focusWindow(winId) {
        if (!this.windows[winId]) return;
        this.activeWinId = winId;
        
        // Remove active class from other windows
        document.querySelectorAll('.erp-window').forEach(w => w.classList.add('inactive'));
        const win = this.windows[winId].element;
        win.classList.remove('inactive');
        win.style.zIndex = ++this.baseZIndex;

        // Update taskbar active state
        document.querySelectorAll('.taskbar-item').forEach(tb => tb.classList.remove('active'));
        const tbItem = document.getElementById('tb-' + winId);
        if (tbItem) tbItem.classList.add('active');
    },

    minimizeWindow(winId) {
        if (!this.windows[winId]) return;
        this.windows[winId].element.style.display = 'none';
        const tbItem = document.getElementById('tb-' + winId);
        if (tbItem) tbItem.classList.remove('active');
    },

    maximizeWindow(winId) {
        if (!this.windows[winId]) return;
        const winObj = this.windows[winId];
        const winEl = winObj.element;

        if (!winObj.isMaximized) {
            winObj.restoreRect = {
                left: parseInt(winEl.style.left, 10),
                top: parseInt(winEl.style.top, 10),
                width: parseInt(winEl.style.width, 10),
                height: parseInt(winEl.style.height, 10)
            };
            winEl.classList.add('maximized');
            winObj.isMaximized = true;
        } else {
            winEl.classList.remove('maximized');
            winEl.style.left = winObj.restoreRect.left + 'px';
            winEl.style.top = winObj.restoreRect.top + 'px';
            winEl.style.width = winObj.restoreRect.width + 'px';
            winEl.style.height = winObj.restoreRect.height + 'px';
            winObj.isMaximized = false;
        }
        this.focusWindow(winId);
    },

    closeWindow(winId) {
        if (!this.windows[winId]) return;
        if (typeof this.windows[winId].beforeClose === 'function') {
            const canClose = this.windows[winId].beforeClose();
            if (canClose === false) return;
        }
        const win = this.windows[winId].element;
        win.remove();
        delete this.windows[winId];

        const tbItem = document.getElementById('tb-' + winId);
        if (tbItem) tbItem.remove();

        // Focus next window
        const keys = Object.keys(this.windows);
        if (keys.length > 0) {
            this.focusWindow(keys[keys.length - 1]);
        } else {
            this.activeWinId = null;
        }
    },

    closeAllWindows(force = false) {
        for (const k of Object.keys(this.windows)) {
            if (force && this.windows[k]) {
                this.windows[k].beforeClose = null;
            }
            this.closeWindow(k);
        }
        if (force) {
            document.querySelectorAll('.erp-window').forEach(el => el.remove());
            const tbList = document.getElementById('taskbar-windows-list');
            if (tbList) tbList.innerHTML = '';
            this.windows = {};
            this.activeWinId = null;
        }
    },

    addTaskbarItem(winId, title) {
        const tbList = document.getElementById('taskbar-windows-list');
        if (!tbList) return;
        const item = document.createElement('div');
        item.className = 'taskbar-item active';
        item.id = 'tb-' + winId;
        item.innerHTML = `<span class="win-wf-badge" style="width:12px;height:12px;font-size:8px;margin-right:4px;">Wf</span><span>${title}</span>`;
        item.addEventListener('click', () => {
            const winEl = this.windows[winId]?.element;
            if (!winEl) return;
            if (winEl.style.display === 'none') {
                winEl.style.display = 'flex';
                this.focusWindow(winId);
            } else if (this.activeWinId === winId) {
                this.minimizeWindow(winId);
            } else {
                this.focusWindow(winId);
            }
        });
        tbList.appendChild(item);
    },

    handleViewportResize() {
        const isTablet = this.isTabletDevice();
        const isTabletPortrait = window.innerWidth <= 850;
        const navSidebar = document.querySelector('.nav-sidebar');
        const backdrop = document.getElementById('sidebar-backdrop');

        if (!isTabletPortrait && navSidebar && backdrop) {
            navSidebar.classList.remove('drawer-open');
            backdrop.classList.remove('active');
        }

        if (isTablet) {
            // 平板模式下自動將所有未最大化的視窗最大化適應
            for (const winId in this.windows) {
                const winObj = this.windows[winId];
                if (winObj && winObj.element && !winObj.isMaximized) {
                    winObj.element.classList.add('maximized');
                    winObj.isMaximized = true;
                }
            }
        }
        if (typeof Flowcharts !== 'undefined' && Flowcharts.updateScale) {
            Flowcharts.updateScale();
        }
    },

    makeDraggable(element, handle) {
        let isDragging = false;
        let startX, startY, origX, origY;

        const startDrag = (clientX, clientY, target) => {
            if (target.closest('.win-controls')) return false;
            if (element.classList.contains('maximized')) return false;

            isDragging = true;
            startX = clientX;
            startY = clientY;
            origX = element.offsetLeft;
            origY = element.offsetTop;
            document.body.style.userSelect = 'none';
            return true;
        };

        const doDrag = (clientX, clientY) => {
            if (!isDragging) return;
            const dx = clientX - startX;
            const dy = clientY - startY;
            element.style.left = Math.max(0, origX + dx) + 'px';
            element.style.top = Math.max(0, origY + dy) + 'px';
        };

        const endDrag = () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = '';
            }
        };

        // 滑鼠拖曳處理
        handle.addEventListener('mousedown', (e) => {
            if (startDrag(e.clientX, e.clientY, e.target)) {
                const onMouseMove = (moveEvent) => doDrag(moveEvent.clientX, moveEvent.clientY);
                const onMouseUp = () => {
                    endDrag();
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                };
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            }
        });

        // 平板手指觸控拖曳支援 (Touch Events)
        handle.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length === 1) {
                const touch = e.touches[0];
                if (startDrag(touch.clientX, touch.clientY, e.target)) {
                    // prevent scrolling while dragging window
                    e.preventDefault();
                }
            }
        }, { passive: false });

        handle.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches && e.touches.length === 1) {
                const touch = e.touches[0];
                doDrag(touch.clientX, touch.clientY);
                e.preventDefault();
            }
        }, { passive: false });

        handle.addEventListener('touchend', endDrag);
        handle.addEventListener('touchcancel', endDrag);
    }
};

window.addEventListener('DOMContentLoaded', () => {
    App.init();
});
