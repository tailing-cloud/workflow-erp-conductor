// ========================================================
// Conductor ERP Modules: System & Support (佇列、帳號、指引、客服)
// ========================================================

window.Modules = window.Modules || {};

Object.assign(window.Modules, {

    // ========================================================
    // 14. 佇列工作控制台 (QUEUE_CONSOLE)
    // ========================================================
    // 14. 佇列工作控制台 (QUEUE_CONSOLE) - 1:1 擷取畫面
    // ========================================================
    openQueueConsole() {
        const uDisp = App.currentUser?.display_name || ('學生' + (App.currentUser?.username || ''));
        const uComp = App.currentUser?.company || ('學生區' + (App.currentUser?.username || ''));
        const title = `佇列工作控制台[${uDisp}][${uComp}] - [佇列工作管理員]`;
        const winId = 'QUEUE_CONSOLE';

        const html = `
            <style>
                #queue-jobs-table tr:hover td, #queue-param-table tr:hover td {
                    background-color: inherit !important;
                }
                #queue-jobs-table tr.selected td, #queue-param-table tr.selected td {
                    background-color: inherit !important;
                    color: inherit !important;
                }
            </style>
            <!-- Child Window / Menu Bar -->
            <div style="background:#ECE9D8; height:24px; display:flex; align-items:center; justify-content:space-between; padding:0 6px; border-bottom:1px solid #D4D0C8; font-size:12px; user-select:none;">
                <div style="display:flex; align-items:center; gap:6px;">
                    <span class="win-wf-badge" style="width:14px;height:14px;font-size:9px;">Wf</span>
                    <span style="font-weight:normal; color:#000;">佇列工作管理員</span>
                    <span style="color:#000; margin-left:14px; cursor:pointer;" class="erp-menu-item">視窗</span>
                </div>
                <div style="display:flex; align-items:center; gap:2px;">
                    <button style="width:16px; height:16px; font-size:10px; line-height:1; padding:0; background:#ECE9D8; border:1px solid #7F9DB9; cursor:pointer;" title="最小化">_</button>
                    <button style="width:16px; height:16px; font-size:10px; line-height:1; padding:0; background:#ECE9D8; border:1px solid #7F9DB9; cursor:pointer;" title="還原">❐</button>
                    <button style="width:16px; height:16px; font-size:10px; line-height:1; padding:0; background:#ECE9D8; border:1px solid #7F9DB9; cursor:pointer;" title="關閉" onclick="App.closeWindow('${winId}')">✕</button>
                </div>
            </div>

            <!-- Toolbar matching 1:1 screenshot -->
            <div class="erp-toolbar" style="background:#ECE9D8; border-bottom:1px solid #94A6B8; padding:2px 4px; display:flex; align-items:center; gap:3px;">
                <button class="erp-tb-btn" title="查詢" id="queue-tb-query">🔍</button>
                <button class="erp-tb-btn" title="刪除" id="queue-tb-delete">🗑️</button>
                <span style="color:#A0A0A0; margin:0 2px;">|</span>
                <button class="erp-tb-btn" title="立即處理" id="queue-tb-run">⚙️</button>
                <span style="color:#A0A0A0; margin:0 2px;">|</span>
                <button class="erp-tb-btn" title="首筆" id="queue-tb-first">⏮</button>
                <button class="erp-tb-btn" title="上一筆" id="queue-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下一筆" id="queue-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="queue-tb-last">⏭</button>
                <span style="color:#A0A0A0; margin:0 2px;">|</span>
                <button class="erp-tb-btn" title="複製" id="queue-tb-copy">📋</button>
                <span style="color:#A0A0A0; margin:0 2px;">|</span>
                <button class="erp-tb-btn" title="確認" id="queue-tb-confirm">
                    <img src="assets/icons/confirm_active.png" style="width:16px;height:16px;vertical-align:middle;display:block;">
                </button>
                <button class="erp-tb-btn" title="取消確認" id="queue-tb-unconfirm">
                    <img src="assets/icons/unconfirm_disabled.png" style="width:16px;height:16px;vertical-align:middle;display:block;">
                </button>
                <button class="erp-tb-btn" title="重新整理" id="queue-tb-refresh">🔄</button>
                <span style="color:#A0A0A0; margin:0 2px;">|</span>
                <button class="erp-tb-btn" title="說明" id="queue-tb-help">📖</button>
                <span style="color:#A0A0A0; margin:0 2px;">|</span>
                <button class="erp-tb-btn" title="進階篩選" id="queue-tb-filter">🗂️</button>
                <span style="color:#A0A0A0; margin:0 2px;">|</span>
                <button class="erp-tb-btn" title="離開" onclick="App.closeWindow('${winId}')">🚪</button>
            </div>

            <!-- Tab Categories matching screenshot -->
            <div style="display:flex; align-items:flex-end; background:#7F8895; padding:3px 4px 0 4px; border-bottom:1px solid #555; gap:2px; user-select:none;">
                <div class="queue-tab" data-tab="report" style="padding:3px 12px; background:#68707C; color:#D4D8DE; font-size:12px; border:1px solid #505864; border-bottom:none; cursor:pointer;">報表</div>
                <div class="queue-tab" data-tab="text_report" style="padding:3px 12px; background:#68707C; color:#D4D8DE; font-size:12px; border:1px solid #505864; border-bottom:none; cursor:pointer;">文字報表</div>
                <div class="queue-tab active" data-tab="batch" style="padding:3px 14px; background:#1C6CB6; color:#FFF; font-weight:bold; font-size:12px; border:1px solid #104880; border-bottom:none; cursor:pointer;">批次</div>
                <div class="queue-tab" data-tab="confirm" style="padding:3px 12px; background:#68707C; color:#D4D8DE; font-size:12px; border:1px solid #505864; border-bottom:none; cursor:pointer;">確認</div>
                <div class="queue-tab" data-tab="custom_report" style="padding:3px 12px; background:#68707C; color:#D4D8DE; font-size:12px; border:1px solid #505864; border-bottom:none; cursor:pointer;">自訂報表</div>
                <div class="queue-tab" data-tab="periodic" style="padding:3px 12px; background:#68707C; color:#D4D8DE; font-size:12px; border:1px solid #505864; border-bottom:none; cursor:pointer;">週期性</div>
                <div class="queue-tab" data-tab="monitor" style="padding:3px 12px; background:#68707C; color:#D4D8DE; font-size:12px; border:1px solid #505864; border-bottom:none; cursor:pointer;">監控類報表</div>
            </div>

            <!-- Main Content: Upper Table & Lower Split Pane -->
            <div style="flex:1; display:flex; flex-direction:column; overflow:hidden; background:#ECE9D8;">
                <!-- Upper Table -->
                <div style="flex:1; overflow:auto; border:1px solid #7F9DB9; background:#FFF; min-height:160px;">
                    <table class="erp-grid-table" style="width:100%; border-collapse:collapse; font-size:12px;" id="queue-jobs-table">
                        <thead>
                            <tr style="background:linear-gradient(to bottom, #F9F9F9, #E4E4E4); height:22px; position:sticky; top:0; z-index:3;">
                                <th style="width:24px; padding:0; text-align:center; border:1px solid #B0B0B0;"></th>
                                <th style="width:125px; text-align:left; padding:2px 4px; border:1px solid #B0B0B0;">工作代號</th>
                                <th style="width:160px; text-align:left; padding:2px 4px; border:1px solid #B0B0B0;">作業名稱</th>
                                <th style="width:90px; text-align:left; padding:2px 4px; border:1px solid #B0B0B0;">處理方式</th>
                                <th style="width:150px; text-align:left; padding:2px 4px; border:1px solid #B0B0B0;">預計處理時間</th>
                                <th style="width:80px; text-align:left; padding:2px 4px; border:1px solid #B0B0B0;">處理狀態</th>
                                <th style="width:120px; text-align:left; padding:2px 4px; border:1px solid #B0B0B0;">處理者</th>
                                <th style="width:150px; text-align:left; padding:2px 4px; border:1px solid #B0B0B0;">開始時間</th>
                                <th style="width:150px; text-align:left; padding:2px 4px; border:1px solid #B0B0B0;">結束時間</th>
                            </tr>
                        </thead>
                        <tbody id="queue-tbody">
                            <tr><td colspan="9" style="text-align:center; padding:30px; color:#888;">佇列工作資料載入中...</td></tr>
                        </tbody>
                    </table>
                </div>

                <!-- Lower Split View (Left: Parameters grid, Right: Result box) -->
                <div style="height:190px; display:flex; gap:6px; padding:4px; background:#ECE9D8; border-top:2px solid #7F9DB9; box-sizing:border-box;">
                    <!-- Left: Parameters Table (68%) -->
                    <div style="flex:2; border:1px solid #7F9DB9; background:#FFF; display:flex; flex-direction:column; overflow:hidden;">
                        <div style="flex:1; overflow:auto;">
                            <table class="erp-grid-table" style="width:100%; border-collapse:collapse; font-size:12px;" id="queue-param-table">
                                <thead>
                                    <tr style="background:linear-gradient(to bottom, #F9F9F9, #E4E4E4); height:20px; position:sticky; top:0; z-index:2;">
                                        <th style="width:200px; text-align:left; padding:2px 6px; border:1px solid #B0B0B0;">選擇項目</th>
                                        <th style="text-align:left; padding:2px 6px; border:1px solid #B0B0B0;">條件值</th>
                                    </tr>
                                </thead>
                                <tbody id="queue-params-tbody">
                                    <!-- Dynamic rows -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Right: Process Result (32%) -->
                    <div style="flex:1; border:1px solid #7F9DB9; background:#ECE9D8; display:flex; flex-direction:column; padding:2px;">
                        <div style="font-size:12px; font-weight:normal; text-align:center; padding:2px; color:#000;">處理結果</div>
                        <div id="queue-result-box" style="flex:1; border:1px solid #7F9DB9; background:#FFF; padding:6px; font-size:12px; font-family:monospace, sans-serif; white-space:pre-wrap; word-break:break-all; overflow-y:auto; color:#000;">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Statusbar -->
            <div class="erp-window-statusbar" style="height:20px; background:#ECE9D8; border-top:1px solid #D4D0C8; display:flex; align-items:center; padding:0 6px; font-size:11px;">
                <span class="status-cell" id="queue-status-count">資料筆數: 0</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 980, 560, (winEl) => {
            const tbody = winEl.querySelector('#queue-tbody');
            const paramsTbody = winEl.querySelector('#queue-params-tbody');
            const resultBox = winEl.querySelector('#queue-result-box');
            const statusCount = winEl.querySelector('#queue-status-count');

            let currentJobs = [];
            let selectedIndex = 0;

            const updateSelectionDetails = () => {
                if (!currentJobs[selectedIndex]) {
                    paramsTbody.innerHTML = '';
                    resultBox.textContent = '';
                    return;
                }
                const job = currentJobs[selectedIndex];

                // 處理結果: commits 後面的數字1代表成功，0代表失敗，只要顯示0或1，成不成功使用者會判斷
                let logText = job.result_log || '';
                if (!logText) {
                    logText = `後端程式版號:4.0.17.1; Commits: 1 Records, RollBacks: 0 Records;`;
                }
                resultBox.textContent = logText;

                // 條件值解析
                const lines = (job.filter_params || '').split('\n');
                let pRows = '';
                lines.forEach((line, pIdx) => {
                    const trimmed = line.trim();
                    if (!trimmed) return;
                    const colonIdx = trimmed.indexOf(':');
                    let k = trimmed;
                    let v = '';
                    if (colonIdx !== -1) {
                        k = trimmed.substring(0, colonIdx).trim();
                        v = trimmed.substring(colonIdx + 1).trim();
                    }
                    const pBg = (pIdx % 2 === 1 ? '#F7F9FC' : '#FFFFFF');
                    pRows += `
                        <tr style="background:${pBg}; color:#000000; height:18px;">
                            <td style="border:1px solid #D0D0D0; padding:2px 6px;">${k}</td>
                            <td style="border:1px solid #D0D0D0; padding:2px 6px;">${v}</td>
                        </tr>
                    `;
                });

                if (!pRows) {
                    pRows = `
                        <tr style="background:#FFFFFF; color:#000000; height:18px;">
                            <td style="border:1px solid #D0D0D0; padding:2px 6px;">選擇請購單號</td>
                            <td style="border:1px solid #D0D0D0; padding:2px 6px;">C311202611001 ~ C311202611001</td>
                        </tr>
                        <tr style="height:18px;"><td style="border:1px solid #D0D0D0; padding:2px 6px;">鎖定選項</td><td style="border:1px solid #D0D0D0; padding:2px 6px;">1 | 已鎖定</td></tr>
                        <tr style="height:18px;"><td style="border:1px solid #D0D0D0; padding:2px 6px;">選擇廠別</td><td style="border:1px solid #D0D0D0; padding:2px 6px;"></td></tr>
                        <tr style="height:18px;"><td style="border:1px solid #D0D0D0; padding:2px 6px;">選擇庫別</td><td style="border:1px solid #D0D0D0; padding:2px 6px;"></td></tr>
                        <tr style="height:18px;"><td style="border:1px solid #D0D0D0; padding:2px 6px;">選擇幣別</td><td style="border:1px solid #D0D0D0; padding:2px 6px;"></td></tr>
                        <tr style="height:18px;"><td style="border:1px solid #D0D0D0; padding:2px 6px;">選擇採購人員</td><td style="border:1px solid #D0D0D0; padding:2px 6px;"></td></tr>
                        <tr style="height:18px;"><td style="border:1px solid #D0D0D0; padding:2px 6px;">輸入採購日期</td><td style="border:1px solid #D0D0D0; padding:2px 6px;">20261105</td></tr>
                        <tr style="height:18px;"><td style="border:1px solid #D0D0D0; padding:2px 6px;">輸入採購單別</td><td style="border:1px solid #D0D0D0; padding:2px 6px;">C331</td></tr>
                        <tr style="height:18px;"><td style="border:1px solid #D0D0D0; padding:2px 6px;">相同交貨日彙總產生</td><td style="border:1px solid #D0D0D0; padding:2px 6px;">N</td></tr>
                        <tr style="height:18px;"><td style="border:1px solid #D0D0D0; padding:2px 6px;">相同品號不同品名規格彙總產生</td><td style="border:1px solid #D0D0D0; padding:2px 6px;">N</td></tr>
                        <tr style="height:18px;"><td style="border:1px solid #D0D0D0; padding:2px 6px;">批註備註</td><td style="border:1px solid #D0D0D0; padding:2px 6px;">Y</td></tr>
                    `;
                }
                paramsTbody.innerHTML = pRows;
            };

            const renderJobs = (jobs) => {
                currentJobs = jobs;
                if (!jobs || jobs.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px; color:#888;">目前無等待或執行中之背景佇列工作</td></tr>`;
                    paramsTbody.innerHTML = `<tr><td colspan="2" style="text-align:center; padding:20px; color:#888;">無參數條件</td></tr>`;
                    resultBox.textContent = '';
                    statusCount.textContent = '資料筆數: 0';
                    return;
                }
                statusCount.textContent = `資料筆數: ${jobs.length}`;
                if (selectedIndex >= jobs.length) selectedIndex = jobs.length - 1;
                if (selectedIndex < 0) selectedIndex = 0;

                let html = '';
                jobs.forEach((j, idx) => {
                    const isSel = idx === selectedIndex;
                    const bg = (idx % 2 === 1 ? '#F7F9FC' : '#FFFFFF');
                    const color = '#000000';
                    const indicator = isSel ? '▶' : '';
                    html += `
                        <tr data-index="${idx}" style="background:${bg}; color:${color}; cursor:pointer; height:20px; user-select:none;">
                            <td style="text-align:center; font-weight:bold; width:24px; border:1px solid #D0D0D0; padding:0; color:#000000;">${indicator}</td>
                            <td style="border:1px solid #D0D0D0; padding:2px 4px;">${j.job_id || ''}</td>
                            <td style="border:1px solid #D0D0D0; padding:2px 4px;">${j.job_name || ''}</td>
                            <td style="border:1px solid #D0D0D0; padding:2px 4px;">${j.process_mode || '依佇列順序'}</td>
                            <td style="border:1px solid #D0D0D0; padding:2px 4px;">${j.est_time || ''}</td>
                            <td style="border:1px solid #D0D0D0; padding:2px 4px;">${j.status || '已完成'}</td>
                            <td style="border:1px solid #D0D0D0; padding:2px 4px;">${j.operator || 'WIN-S7UJO0KFN'}</td>
                            <td style="border:1px solid #D0D0D0; padding:2px 4px;">${j.start_time || ''}</td>
                            <td style="border:1px solid #D0D0D0; padding:2px 4px;">${j.end_time || ''}</td>
                        </tr>
                    `;
                });
                tbody.innerHTML = html;
                updateSelectionDetails();
            };

            const loadJobs = async () => {
                const res = await ERP_API.get('get_batch_jobs');
                if (res.success) {
                    selectedIndex = 0;
                    renderJobs(res.data || []);
                } else {
                    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:20px; color:red;">${res.error || '載入失敗'}</td></tr>`;
                }
            };

            // Row click selection
            tbody.addEventListener('click', (e) => {
                const tr = e.target.closest('tr[data-index]');
                if (!tr) return;
                selectedIndex = parseInt(tr.getAttribute('data-index'), 10);
                renderJobs(currentJobs);
            });

            // Navigation toolbar buttons
            winEl.querySelector('#queue-tb-first')?.addEventListener('click', () => {
                if (currentJobs.length > 0) {
                    selectedIndex = 0;
                    renderJobs(currentJobs);
                }
            });
            winEl.querySelector('#queue-tb-prev')?.addEventListener('click', () => {
                if (selectedIndex > 0) {
                    selectedIndex--;
                    renderJobs(currentJobs);
                }
            });
            winEl.querySelector('#queue-tb-next')?.addEventListener('click', () => {
                if (selectedIndex < currentJobs.length - 1) {
                    selectedIndex++;
                    renderJobs(currentJobs);
                }
            });
            winEl.querySelector('#queue-tb-last')?.addEventListener('click', () => {
                if (currentJobs.length > 0) {
                    selectedIndex = currentJobs.length - 1;
                    renderJobs(currentJobs);
                }
            });
            winEl.querySelector('#queue-tb-refresh')?.addEventListener('click', loadJobs);

            // Run / Process Job (立即處理 -> 透過佇列工作控制台轉成採購單建立作業)
            const executeJob = async () => {
                const job = currentJobs[selectedIndex];
                if (!job) {
                    alert('請先點選欲處理的佇列工作！');
                    return;
                }
                const res = await ERP_API.post('run_batch_job', { job_id: job.job_id });
                if (res.success) {
                    await loadJobs();
                    const poNo = res.po_no || (res.po_nos && res.po_nos[0]) || '';
                    Modules.toast(`佇列工作 [${job.job_id}] 執行成功！已轉成採購單【${poNo}】！`, 'success');
                    setTimeout(() => {
                        // 轉成採購單建立作業
                        Modules.open('PURI07');
                    }, 400);
                } else {
                    alert(res.error || '佇列工作執行失敗');
                }
            };

            winEl.querySelector('#queue-tb-run')?.addEventListener('click', executeJob);
            winEl.querySelector('#queue-tb-confirm')?.addEventListener('click', executeJob);

            // Double click row to run and open PURI07
            tbody.addEventListener('dblclick', (e) => {
                const tr = e.target.closest('tr[data-index]');
                if (!tr) return;
                selectedIndex = parseInt(tr.getAttribute('data-index'), 10);
                executeJob();
            });

            // Delete job
            winEl.querySelector('#queue-tb-delete')?.addEventListener('click', async () => {
                const job = currentJobs[selectedIndex];
                if (!job) return;
                if (confirm(`確定要刪除佇列工作 [${job.job_id}] - ${job.job_name} 嗎？`)) {
                    const res = await ERP_API.post('delete_batch_job', { job_id: job.job_id });
                    if (res.success) {
                        loadJobs();
                    } else {
                        alert(res.error || '刪除失敗');
                    }
                }
            });

            // Tabs switcher
            winEl.querySelectorAll('.queue-tab').forEach(t => {
                t.addEventListener('click', () => {
                    winEl.querySelectorAll('.queue-tab').forEach(other => {
                        other.classList.remove('active');
                        other.style.background = '#68707C';
                        other.style.color = '#D4D8DE';
                        other.style.fontWeight = 'normal';
                    });
                    t.classList.add('active');
                    t.style.background = '#1C6CB6';
                    t.style.color = '#FFFFFF';
                    t.style.fontWeight = 'bold';
                });
            });

            loadJobs();
        });
    },

    // ========================================================
    // 15. 使用者帳號管理 (SEC_USER) - Strict Admin Only
    // ========================================================
    openUserManagement() {
        if (!App.currentUser || (App.currentUser.role !== 'admin' && App.currentUser.username !== 'admin')) {
            alert('【權限不足】\n\n只有系統管理員(admin)帳號有權限開啟與操作「使用者帳號管理 (SEC_USER)」！');
            return;
        }

        const title = `使用者帳號管理 (SEC_USER) [系統管理員]`;
        const winId = 'SEC_USER';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">帳號維護(<u>U</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="新增帳號" id="sec-tb-new">➕</button>
                <button class="erp-tb-btn" title="重新整理" id="sec-tb-refresh">🔄</button>
            </div>

            <div style="flex:1; display:flex; gap:6px; padding:6px; overflow:hidden;">
                <!-- User List -->
                <div style="flex:1; border:1px solid #7F9DB9; background:#FFF; overflow:auto;">
                    <table class="erp-grid-table">
                        <thead>
                            <tr>
                                <th style="width:40px;">序</th>
                                <th style="width:100px;">帳號</th>
                                <th style="width:120px;">顯示名稱</th>
                                <th style="width:140px;">所屬公司</th>
                                <th style="width:80px;">權限角色</th>
                                <th style="width:60px;">狀態</th>
                                <th style="width:100px;">管理動作</th>
                            </tr>
                        </thead>
                        <tbody id="sec-user-tbody">
                            <tr><td colspan="7" style="text-align:center; padding:20px;">載入帳號資料中...</td></tr>
                        </tbody>
                    </table>
                </div>

                <!-- Account Edit Form -->
                <div style="width:300px; border:1px solid #7F9DB9; background:#ECE9D8; padding:12px;">
                    <h4 style="margin-bottom:12px; color:#003366; border-bottom:1px solid #A0A0A0; padding-bottom:4px;">【帳號設定】</h4>
                    <input type="hidden" id="sec-edit-id">
                    <div style="margin-bottom:8px;">
                        <label>帳號 (Username):</label>
                        <input type="text" id="sec-edit-username" class="erp-input-cyan" style="width:100%;">
                    </div>
                    <div style="margin-bottom:8px;">
                        <label>密碼 (Password):</label>
                        <input type="password" id="sec-edit-password" placeholder="留空不修改" style="width:100%;">
                    </div>
                    <div style="margin-bottom:8px;">
                        <label>顯示姓名:</label>
                        <input type="text" id="sec-edit-display" style="width:100%;">
                    </div>
                    <div style="margin-bottom:8px;">
                        <label>公司別 (Company):</label>
                        <input type="text" id="sec-edit-company" style="width:100%;" value="學生區">
                    </div>
                    <div style="margin-bottom:12px;">
                        <label>角色 (Role):</label>
                        <select id="sec-edit-role" style="width:100%;">
                            <option value="student">student (學生)</option>
                            <option value="admin">admin (管理員)</option>
                        </select>
                    </div>
                    <button class="erp-lookup-btn primary" id="sec-btn-save" style="width:100%; margin-bottom:6px;">✔ 儲存帳號設定</button>
                    <button class="erp-lookup-btn" id="sec-btn-clear" style="width:100%;">清空表單</button>
                </div>
            </div>

            <div class="erp-window-statusbar">
                <span class="status-cell">管理員專屬功能: 帳號管理控制台</span>
                <span class="status-cell">作業: SEC_USER</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 900, 520, (winEl) => {
            const tbody = winEl.querySelector('#sec-user-tbody');
            const fId = winEl.querySelector('#sec-edit-id');
            const fUsername = winEl.querySelector('#sec-edit-username');
            const fPassword = winEl.querySelector('#sec-edit-password');
            const fDisplay = winEl.querySelector('#sec-edit-display');
            const fCompany = winEl.querySelector('#sec-edit-company');
            const fRole = winEl.querySelector('#sec-edit-role');

            const clearForm = () => {
                fId.value = '';
                fUsername.value = '';
                fPassword.value = '';
                fDisplay.value = '';
                fCompany.value = '學生區';
                fRole.value = 'student';
            };

            const loadUsers = async () => {
                const res = await ERP_API.get('get_users');
                if (res.success) {
                    const users = res.data || [];
                    let rows = '';
                    users.forEach((u, idx) => {
                        rows += `
                            <tr>
                                <td style="text-align:center;">${idx + 1}</td>
                                <td style="font-weight:bold;">${u.username}</td>
                                <td>${u.display_name}</td>
                                <td>${u.company}</td>
                                <td style="text-align:center;">${u.role}</td>
                                <td style="text-align:center;">${u.is_active ? '啟用' : '停用'}</td>
                                <td style="text-align:center;">
                                    <button class="erp-tb-btn" data-act="edit" data-id="${u.id}" title="編輯">✏️</button>
                                    ${u.username !== 'admin' ? `<button class="erp-tb-btn" data-act="del" data-id="${u.id}" data-name="${u.username}" title="刪除" style="color:red;">🗑️</button>` : ''}
                                </td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows;

                    tbody.querySelectorAll('button[data-act="edit"]').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const uid = btn.getAttribute('data-id');
                            const u = users.find(x => String(x.id) === String(uid));
                            if (u) {
                                fId.value = u.id;
                                fUsername.value = u.username;
                                fPassword.value = '';
                                fDisplay.value = u.display_name;
                                fCompany.value = u.company;
                                fRole.value = u.role;
                            }
                        });
                    });

                    tbody.querySelectorAll('button[data-act="del"]').forEach(btn => {
                        btn.addEventListener('click', async () => {
                            const uid = btn.getAttribute('data-id');
                            const uname = btn.getAttribute('data-name');
                            if (confirm(`確定要刪除帳號 [${uname}] 嗎？`)) {
                                const delRes = await ERP_API.post('delete_user', { id: uid });
                                if (delRes.success) {
                                    alert('帳號已刪除！');
                                    loadUsers();
                                } else {
                                    alert('刪除失敗: ' + (delRes.error || '不明錯誤'));
                                }
                            }
                        });
                    });
                }
            };

            winEl.querySelector('#sec-btn-save').addEventListener('click', async () => {
                const u = fUsername.value.trim();
                if (!u) {
                    alert('請輸入帳號！');
                    fUsername.focus();
                    return;
                }
                const payload = {
                    id: fId.value || null,
                    username: u,
                    password: fPassword.value.trim(),
                    display_name: fDisplay.value.trim() || ('學生' + u),
                    company: fCompany.value.trim() || ('學生區' + u),
                    role: fRole.value
                };
                const res = await ERP_API.post('save_user', payload);
                if (res.success) {
                    alert('帳號資料儲存成功！');
                    clearForm();
                    loadUsers();
                } else {
                    alert('儲存失敗: ' + (res.error || '不明錯誤'));
                }
            });

            winEl.querySelector('#sec-tb-new').addEventListener('click', clearForm);
            winEl.querySelector('#sec-btn-clear').addEventListener('click', clearForm);
            winEl.querySelector('#sec-tb-refresh').addEventListener('click', loadUsers);

            loadUsers();
        });
    },

    // ========================================================
    // 16. 模擬練習指引精靈 (PRACTICE_GUIDE)
    // ========================================================
    openPracticeGuide() {
        const title = `ERP 配銷模組標準流程演練指引精靈`;
        const winId = 'PRACTICE_GUIDE';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div style="flex:1; padding:16px 20px; background:#F8FAFC; overflow-y:auto; line-height:1.7; font-size:13px; color:#222;">
                <!-- Header Banner -->
                <div style="background:linear-gradient(135deg, #1F497D, #2B5F8F); color:#FFF; padding:16px 20px; border-radius:6px; box-shadow:0 2px 6px rgba(0,0,0,0.15); margin-bottom:16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <h2 style="margin:0 0 6px 0; font-size:18px; letter-spacing:1px; display:flex; align-items:center; gap:8px;">
                                <span>🎯</span> ERP 企業全流程標準作業演練精靈
                            </h2>
                            <div style="font-size:12px; opacity:0.9;">
                                從基礎品號與客戶主檔建立 ➔ 報價與訂單 ➔ 訂單轉請購 ➔ 請購維護與更新 ➔ 採購與進貨驗收入庫 ➔ 銷貨出庫 ➔ 樹狀追蹤全閉環
                            </div>
                        </div>
                        <div style="text-align:right;">
                            <span style="background:rgba(255,255,255,0.2); padding:4px 10px; border-radius:12px; font-size:11px; font-weight:bold;">實習考核標準指引</span>
                        </div>
                    </div>
                </div>

                <!-- Learning Tip Box -->
                <div style="background:#FFFDE6; border:1px solid #E6D28C; border-left:5px solid #F59E0B; padding:10px 14px; border-radius:4px; margin-bottom:18px; font-size:12px;">
                    <b style="color:#B45309; font-size:13px;">💡 核心作業操作技巧提示：</b><br>
                    1. <b>單身表格自動增列</b>：單身表格預設只有 1 列，輸入完資料後按 <kbd style="background:#FFF; border:1px solid #CCC; padding:1px 5px; border-radius:3px; box-shadow:0 1px 0 rgba(0,0,0,0.2); font-weight:bold;">Tab 鍵</kbd> 跳至最後一格將自動產生下一列；若切換回上一列且空白列未填資料，系統會自動清理空白列。<br>
                    2. <b>單據儲存與確認操作</b>：存檔操作統一為工具列的<b>「<span style="color:#008000; font-weight:bold;">✔</span> 儲存」</b>（綠色打勾存檔）；主管核准確認統一為工具列的<b>「<img src="assets/icons/confirm_active.png" style="width:14px;height:14px;vertical-align:middle;display:inline-block;"> 確認」</b>（加蓋紅色核准印章）與<b>「✖ 取消確認」</b>（反審核抹除印章）。未審核確認的單據，後續作業將無法承接或轉單！<br>
                    3. <b>開窗圖示說明</b>：品號開窗 <code>[▲]</code> 或 <code>[🔍]</code>、單位開窗 <code>[@]</code>、庫別開窗 <code>[☖]</code>、客戶開窗 <code>[👥]</code>、人員/廠商開窗 <code>[👤]</code>、幣別開窗 <code>[$]</code>、日期開窗 <code>[📅]</code>。
                </div>

                <!-- Flow Visual Map -->
                <div style="background:#FFF; border:1px solid #CBD5E1; border-radius:6px; padding:12px; margin-bottom:20px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                    <div style="font-weight:bold; color:#1F497D; margin-bottom:10px; font-size:13px;">📊 全流程導覽地圖 (可隨時點擊各步驟進入作業)：</div>
                    <div style="display:flex; flex-wrap:wrap; gap:6px; align-items:center; font-size:11px;">
                        <span onclick="Modules.open('INVI02')" style="background:#E0F2FE; color:#0369A1; padding:3px 8px; border-radius:3px; font-weight:bold; cursor:pointer;" title="點擊開啟 INVI02">① 品號主檔 INVI02</span>
                        <span style="color:#94A3B8;">➔</span>
                        <span onclick="Modules.open('COPI01')" style="background:#E0F2FE; color:#0369A1; padding:3px 8px; border-radius:3px; font-weight:bold; cursor:pointer;" title="點擊開啟 COPI01">② 客戶主檔 COPI01</span>
                        <span style="color:#94A3B8;">➔</span>
                        <span onclick="Modules.open('COPI05')" style="background:#FEF3C7; color:#92400E; padding:3px 8px; border-radius:3px; font-weight:bold; cursor:pointer;" title="點擊開啟 COPI05">③ 報價單 COPI05</span>
                        <span style="color:#94A3B8;">➔</span>
                        <span onclick="Modules.open('COPI06')" style="background:#FEF3C7; color:#92400E; padding:3px 8px; border-radius:3px; font-weight:bold; cursor:pointer;" title="點擊開啟 COPI06">④ 客戶訂單 COPI06</span>
                        <span style="color:#94A3B8;">➔</span>
                        <span onclick="Modules.open('COPB10')" style="background:#DCFCE7; color:#166534; padding:3px 8px; border-radius:3px; font-weight:bold; cursor:pointer;" title="點擊開啟 COPB10">⑤ 訂單轉請購 COPB10</span>
                        <span style="color:#94A3B8;">➔</span>
                        <span onclick="Modules.open('PURI05')" style="background:#DCFCE7; color:#166534; padding:3px 8px; border-radius:3px; font-weight:bold; cursor:pointer;" title="點擊開啟 PURI05">⑥ 請購單審核 PURI05</span>
                        <span style="color:#94A3B8;">➔</span>
                        <span onclick="Modules.open('PURI06')" style="background:#F3E8FF; color:#6B21A8; padding:3px 8px; border-radius:3px; font-weight:bold; cursor:pointer;" title="點擊開啟 PURI06">⑦ 請購資料維護 PURI06</span>
                        <span style="color:#94A3B8;">➔</span>
                        <span onclick="Modules.open('PURB01')" style="background:#F3E8FF; color:#6B21A8; padding:3px 8px; border-radius:3px; font-weight:bold; cursor:pointer;" title="點擊開啟 PURB01">⑧ 請購資料更新 PURB01</span>
                        <span style="color:#94A3B8;">➔</span>
                        <span onclick="Modules.open('PURI07')" style="background:#FCE7F3; color:#9D174D; padding:3px 8px; border-radius:3px; font-weight:bold; cursor:pointer;" title="點擊開啟 PURI07">⑨ 採購單審核 PURI07</span>
                        <span style="color:#94A3B8;">➔</span>
                        <span onclick="Modules.open('PURI09')" style="background:#FFEDD5; color:#9A3412; padding:3px 8px; border-radius:3px; font-weight:bold; cursor:pointer;" title="點擊開啟 PURI09">⑩ 進貨驗收 PURI09</span>
                        <span style="color:#94A3B8;">➔</span>
                        <span onclick="Modules.open('COPI08')" style="background:#E0E7FF; color:#3730A3; padding:3px 8px; border-radius:3px; font-weight:bold; cursor:pointer;" title="點擊開啟 COPI08">⑪ 銷貨出庫 COPI08</span>
                        <span style="color:#94A3B8;">➔</span>
                        <span onclick="Modules.open('COPQ05')" style="background:#F1F5F9; color:#334155; padding:3px 8px; border-radius:3px; font-weight:bold; cursor:pointer;" title="點擊開啟 COPQ05">⑫ 樹狀追蹤 COPQ05</span>
                    </div>
                </div>

                <!-- Detailed Steps Container -->
                <div style="display:flex; flex-direction:column; gap:16px;">

                    <!-- STEP 1 -->
                    <div style="background:#FFF; border:1px solid #CBD5E1; border-radius:6px; padding:14px 18px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #E2E8F0; padding-bottom:8px;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="background:#0284C7; color:#FFF; font-weight:bold; font-size:11px; padding:2px 8px; border-radius:10px;">步驟一</span>
                                <b style="color:#0F172A; font-size:14px;">品號資料建立作業 (INVI02)</b>
                            </div>
                            <button type="button" onclick="Modules.open('INVI02')" style="background:linear-gradient(to bottom, #FFF, #ECE9D8); border:1px solid #7F9DB9; padding:2px 10px; font-size:12px; cursor:pointer; border-radius:3px; color:#003366; font-weight:bold;">📂 進入作業</button>
                        </div>
                        <ul style="margin:0; padding-left:20px; font-size:12.5px;">
                            <li><b>作業目的</b>：建立公司原物料、商品或成品主檔，為後續報價、訂單、採購與庫存作業的核心依據。</li>
                            <li><b>操作說明</b>：
                                1. 點選工具列<b>「📄 新增」</b>按鈕（品號為青底標示，可輸入如 <code>900007</code>，開窗圖示為 <code>[▲]</code>）。<br>
                                2. 輸入「品名」（如 <code>Insta360 Flow 2</code>）與「規格」（如 <code>Flow 2</code>）。<br>
                                3. <b>「單位」</b>預設為空白，讓使用者自行填入或點選 <code>[@]</code> 開窗挑選（如 <code>台</code> 或 <code>PC</code>）。<br>
                                4. 切換至【基本資料 1】頁籤：<b>會計分類</b>預設為 <code>01</code>（可點選 <code>[▲]</code> 挑選 <code>05 商品</code>）；<b>主要庫別 / 主要領料庫別</b>預設為空白，可手動填入或點選 <code>[☖]</code> 挑選（如 <code>P003</code> 或 <code>W01</code>）。<br>
                                5. 點選工具列<b>「<span style="color:#008000; font-weight:bold;">✔</span> 儲存」</b>（綠色打勾），再點選工具列<b>「<img src="assets/icons/confirm_active.png" style="width:14px;height:14px;vertical-align:middle;display:inline-block;"> 確認」</b>完成品號審核加蓋核准印章。
                            </li>
                        </ul>
                    </div>

                    <!-- STEP 2 -->
                    <div style="background:#FFF; border:1px solid #CBD5E1; border-radius:6px; padding:14px 18px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #E2E8F0; padding-bottom:8px;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="background:#0284C7; color:#FFF; font-weight:bold; font-size:11px; padding:2px 8px; border-radius:10px;">步驟二</span>
                                <b style="color:#0F172A; font-size:14px;">客戶資料建立作業 (COPI01)</b>
                            </div>
                            <button type="button" onclick="Modules.open('COPI01')" style="background:linear-gradient(to bottom, #FFF, #ECE9D8); border:1px solid #7F9DB9; padding:2px 10px; font-size:12px; cursor:pointer; border-radius:3px; color:#003366; font-weight:bold;">📂 進入作業</button>
                        </div>
                        <ul style="margin:0; padding-left:20px; font-size:12.5px;">
                            <li><b>作業目的</b>：建立買方客戶的基本交易資料與商業條件，供後續銷售報價與接單作業使用。</li>
                            <li><b>操作說明</b>：
                                1. 點選工具列<b>「📄 新增」</b>，輸入「客戶代號」（青底標示，如 <code>1110</code>，開窗圖示為 <code>[👥]</code>）與「客戶簡稱」（如 <code>創億科技</code>）、「客戶全名」（如 <code>創億科技有限公司</code>）。<br>
                                2. 在【基本資料】頁籤中：<br>
                                   - <b>交易幣別</b>：預設為 <code>NTD</code>，可點選 <code>[$]</code> 幣別按鈕或雙擊欄位開窗挑選。<br>
                                   - <b>開業日期</b>：點選 <code>[📅]</code> 月曆按鈕可開啟月曆面板快速選擇日期。<br>
                                   - <b>業務人員與收款業務員</b>：預設為空白，使用者可點選 <code>[👤]</code> 開窗挑選負責人（如 <code>1001 張明達</code>）。<br>
                                3. 點選工具列<b>「<span style="color:#008000; font-weight:bold;">✔</span> 儲存」</b>（綠色打勾）儲存客戶基本主檔。
                            </li>
                        </ul>
                    </div>

                    <!-- STEP 3 -->
                    <div style="background:#FFF; border:1px solid #CBD5E1; border-radius:6px; padding:14px 18px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #E2E8F0; padding-bottom:8px;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="background:#D97706; color:#FFF; font-weight:bold; font-size:11px; padding:2px 8px; border-radius:10px;">步驟三</span>
                                <b style="color:#0F172A; font-size:14px;">報價單建立作業 (COPI05) 與 顧客確認</b>
                            </div>
                            <button type="button" onclick="Modules.open('COPI05')" style="background:linear-gradient(to bottom, #FFF, #ECE9D8); border:1px solid #7F9DB9; padding:2px 10px; font-size:12px; cursor:pointer; border-radius:3px; color:#003366; font-weight:bold;">📂 進入作業</button>
                        </div>
                        <ul style="margin:0; padding-left:20px; font-size:12.5px;">
                            <li><b>作業目的</b>：向客戶報價並約定生效/失效日期與交易條件，經顧客確認後由主管審核。</li>
                            <li><b>操作說明</b>：
                                1. 點選<b>「📄 新增」</b>，單別選擇 <code>C211</code>（國內報價單）自動生成單號。<br>
                                2. 「客戶代號」點選 <code>[👥]</code> 挑選剛建立的客戶（如 <code>1110</code> 或 <code>1109</code>），自動帶入客戶簡稱與幣別。<br>
                                3. 在單身第 1 列點選品號 <code>[🔍]</code> 開窗挑選品號（如 <code>900007</code>），輸入「規格」（<code>Flow 2</code>）、「報價數量」（如 <code>20</code>）與「單價」（如 <code>3990</code>），系統即時算出生效金額與稅額。<br>
                                4. 輸入或點選「生效日」與「失效日」（點選 <code>[...]</code> 開啟月曆）。<br>
                                5. 勾選單頭<b>「顧客確認」</b>核取方塊 <code>[☑]</code>。<br>
                                6. 點選工具列<b>「<span style="color:#008000; font-weight:bold;">✔</span> 儲存」</b>（綠色打勾），再點選工具列<b>「<img src="assets/icons/confirm_active.png" style="width:14px;height:14px;vertical-align:middle;display:inline-block;"> 確認」</b>加蓋紅色『核』准章！
                            </li>
                        </ul>
                    </div>

                    <!-- STEP 4 -->
                    <div style="background:#FFF; border:1px solid #CBD5E1; border-radius:6px; padding:14px 18px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #E2E8F0; padding-bottom:8px;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="background:#D97706; color:#FFF; font-weight:bold; font-size:11px; padding:2px 8px; border-radius:10px;">步驟四</span>
                                <b style="color:#0F172A; font-size:14px;">客戶訂單建立作業 (COPI06)</b>
                            </div>
                            <button type="button" onclick="Modules.open('COPI06')" style="background:linear-gradient(to bottom, #FFF, #ECE9D8); border:1px solid #7F9DB9; padding:2px 10px; font-size:12px; cursor:pointer; border-radius:3px; color:#003366; font-weight:bold;">📂 進入作業</button>
                        </div>
                        <ul style="margin:0; padding-left:20px; font-size:12.5px;">
                            <li><b>作業目的</b>：承接客戶確認之報價內容，正式成立銷售訂單。</li>
                            <li><b>操作說明</b>：
                                1. 點選選單<b>「功能(F)」➔「複製前置單據 (來源報價單)」</b>，挑選剛才已審核的報價單（如 <code>C211-xxxx</code>）。<br>
                                2. 系統自動帶入客戶資訊、品號明細、數量與單價，單號自動生成為 <code>A221-xxxx</code>。<br>
                                3. 確認「出貨廠別」（<code>TP01</code>）與「庫別」（點選 <code>[☖]</code> 挑選 <code>P003</code>）。<br>
                                4. 點選工具列<b>「<span style="color:#008000; font-weight:bold;">✔</span> 儲存」</b>（綠色打勾），點選工具列<b>「<img src="assets/icons/confirm_active.png" style="width:14px;height:14px;vertical-align:middle;display:inline-block;"> 確認」</b>進行審核加蓋紅色核准章！
                            </li>
                        </ul>
                    </div>

                    <!-- STEP 5 -->
                    <div style="background:#FFF; border:1px solid #CBD5E1; border-radius:6px; padding:14px 18px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #E2E8F0; padding-bottom:8px;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="background:#16A34A; color:#FFF; font-weight:bold; font-size:11px; padding:2px 8px; border-radius:10px;">步驟五</span>
                                <b style="color:#0F172A; font-size:14px;">訂單轉請購單複製作業 (COPB10)</b>
                            </div>
                            <button type="button" onclick="Modules.open('COPB10')" style="background:linear-gradient(to bottom, #FFF, #ECE9D8); border:1px solid #7F9DB9; padding:2px 10px; font-size:12px; cursor:pointer; border-radius:3px; color:#003366; font-weight:bold;">📂 進入作業</button>
                        </div>
                        <ul style="margin:0; padding-left:20px; font-size:12.5px;">
                            <li><b>作業目的</b>：根據客戶訂單需求數量，批次產生物料請購單據，發起採購需求。</li>
                            <li><b>操作說明</b>：
                                1. 開啟 COPB10，填寫轉單條件：<br>
                                   - 選擇廠別：<code>TP01</code><br>
                                   - 選擇訂單單號：輸入或開窗挑選剛審核之訂單單號（如 <code>A221-xxxx</code>）<br>
                                   - 輸入請購單別：<code>C311</code>（或 <code>A311</code>）<br>
                                   - 輸入請購人員：<code>112 翁湘琴</code>（點選 <code>[👤]</code> 挑選）<br>
                                2. 點選<b>「▶ 執行」</b>按鈕，系統自動將任務排入系統佇列並生成請購單 <code>C311-xxxx</code>（初始狀態為未確認）。
                            </li>
                        </ul>
                    </div>

                    <!-- STEP 6 -->
                    <div style="background:#FFF; border:1px solid #CBD5E1; border-radius:6px; padding:14px 18px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #E2E8F0; padding-bottom:8px;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="background:#16A34A; color:#FFF; font-weight:bold; font-size:11px; padding:2px 8px; border-radius:10px;">步驟六</span>
                                <b style="color:#0F172A; font-size:14px;">請購單建立作業 (PURI05) 審核確認</b>
                            </div>
                            <button type="button" onclick="Modules.open('PURI05')" style="background:linear-gradient(to bottom, #FFF, #ECE9D8); border:1px solid #7F9DB9; padding:2px 10px; font-size:12px; cursor:pointer; border-radius:3px; color:#003366; font-weight:bold;">📂 進入作業</button>
                        </div>
                        <ul style="margin:0; padding-left:20px; font-size:12.5px;">
                            <li><b>作業目的</b>：請購部門主管進行請購審核。<b style="color:#DC2626;">【關鍵必讀】：請購單若未經審核確認（未加蓋核准印章），後續「請購資料維護 (PURI06)」作業將完全查不到該筆請購項目！</b></li>
                            <li><b>操作說明</b>：
                                1. 開啟 PURI05，點選工具列<b>「🔍 查詢」</b>，載入剛產生的請購單 <code>C311-xxxx</code>。<br>
                                2. 檢查請購明細品號、數量（如 <code>20</code>）與需求日期。<br>
                                3. 點選工具列<b>「<img src="assets/icons/confirm_active.png" style="width:14px;height:14px;vertical-align:middle;display:inline-block;"> 確認」</b>加蓋紅色核准章，單據狀態轉為「已確認」。
                            </li>
                        </ul>
                    </div>

                    <!-- STEP 7 -->
                    <div style="background:#FFF; border:1px solid #CBD5E1; border-radius:6px; padding:14px 18px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #E2E8F0; padding-bottom:8px;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="background:#9333EA; color:#FFF; font-weight:bold; font-size:11px; padding:2px 8px; border-radius:10px;">步驟七</span>
                                <b style="color:#0F172A; font-size:14px;">請購資料維護作業 (PURI06)</b>
                            </div>
                            <button type="button" onclick="Modules.open('PURI06')" style="background:linear-gradient(to bottom, #FFF, #ECE9D8); border:1px solid #7F9DB9; padding:2px 10px; font-size:12px; cursor:pointer; border-radius:3px; color:#003366; font-weight:bold;">📂 進入作業</button>
                        </div>
                        <ul style="margin:0; padding-left:20px; font-size:12.5px;">
                            <li><b>作業目的</b>：採購人員針對已核准之請購明細，指派「主要供應商」與「採購人員」，並設定「鎖定碼」以利批次轉採購單。</li>
                            <li><b>操作說明</b>：
                                1. 開啟 PURI06，點選工具列<b>「🔍 查詢」</b>載入已確認之請購明細。<br>
                                2. 在明細列中指定：<br>
                                   - <b>主供應商代號</b>：點選 <code>[👤]</code> 開窗挑選（如 <code>3003 達智科技</code>、<code>4005 為升國際</code> 或全域共用廠商）。<br>
                                   - <b>採購人員</b>：點選 <code>[👤]</code> 挑選採購員（如 <code>112 翁湘琴</code>）。<br>
                                   - <b>鎖定碼</b>：<b>務必勾選「鎖定碼」</b>（<code>is_locked = 1</code>）。<b style="color:#DC2626;">【注意】：未勾選鎖定碼之請購項目，後續 PURB01 將無法過濾並轉出採購單！</b><br>
                                3. 點選工具列<b>「<span style="color:#008000; font-weight:bold;">✔</span> 儲存」</b>（綠色打勾）儲存維護內容。
                            </li>
                        </ul>
                    </div>

                    <!-- STEP 8 -->
                    <div style="background:#FFF; border:1px solid #CBD5E1; border-radius:6px; padding:14px 18px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #E2E8F0; padding-bottom:8px;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="background:#9333EA; color:#FFF; font-weight:bold; font-size:11px; padding:2px 8px; border-radius:10px;">步驟八</span>
                                <b style="color:#0F172A; font-size:14px;">請購資料更新作業 (PURB01)</b>
                            </div>
                            <button type="button" onclick="Modules.open('PURB01')" style="background:linear-gradient(to bottom, #FFF, #ECE9D8); border:1px solid #7F9DB9; padding:2px 10px; font-size:12px; cursor:pointer; border-radius:3px; color:#003366; font-weight:bold;">📂 進入作業</button>
                        </div>
                        <ul style="margin:0; padding-left:20px; font-size:12.5px;">
                            <li><b>作業目的</b>：批次匯總已鎖定之請購資料，自動生成正式採購單。</li>
                            <li><b>操作說明</b>：
                                1. 開啟 PURB01，設定更新篩選條件：<br>
                                   - 選擇請購單號：輸入剛才的請購單號區間（如 <code>C311-xxxx ~ C311-xxxx</code>）<br>
                                   - 鎖定選項：選擇 <code>1 | 已鎖定</code><br>
                                   - 選擇廠別：<code>TP01</code><br>
                                   - 輸入採購單別：輸入或開窗挑選 <code>A321 國內採購單</code>（或 <code>C331</code>）<br>
                                   - 勾選「合購」或「單別指定」<br>
                                2. 點選<b>「▶ 執行」</b>或「整批更新」，系統自動批次轉出採購單（佇列日誌顯示 <code>Commits: 1 Records</code>）。
                            </li>
                        </ul>
                    </div>

                    <!-- STEP 9 -->
                    <div style="background:#FFF; border:1px solid #CBD5E1; border-radius:6px; padding:14px 18px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #E2E8F0; padding-bottom:8px;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="background:#BE185D; color:#FFF; font-weight:bold; font-size:11px; padding:2px 8px; border-radius:10px;">步驟九</span>
                                <b style="color:#0F172A; font-size:14px;">採購單建立作業 (PURI07) 檢查與審核</b>
                            </div>
                            <button type="button" onclick="Modules.open('PURI07')" style="background:linear-gradient(to bottom, #FFF, #ECE9D8); border:1px solid #7F9DB9; padding:2px 10px; font-size:12px; cursor:pointer; border-radius:3px; color:#003366; font-weight:bold;">📂 進入作業</button>
                        </div>
                        <ul style="margin:0; padding-left:20px; font-size:12.5px;">
                            <li><b>作業目的</b>：檢查由 PURB01 批次產生的正式採購單，確認供應商交易條件無誤後進行核准發單。</li>
                            <li><b>操作說明</b>：
                                1. 開啟 PURI07，點選工具列<b>「🔍 查詢」</b>載入剛產生的採購單（如 <code>A321-xxxx</code> 或單號 <code>202611001</code>）。<br>
                                2. 「採購單別」為 <code>A321 國內採購單</code>（可雙擊開窗挑選說明）；「廠別代號」為 <code>TP01</code>；「庫別」預設為空可點選 <code>[☖]</code> 挑選（如 <code>P003</code>）。<br>
                                3. 檢查供應廠商、採購數量、單價、稅率（應稅外加 5%）與金額合計。<br>
                                4. 確認無誤後，點選工具列<b>「<span style="color:#008000; font-weight:bold;">✔</span> 儲存」</b>（綠色打勾），再點選工具列<b>「<img src="assets/icons/confirm_active.png" style="width:14px;height:14px;vertical-align:middle;display:inline-block;"> 確認」</b>加蓋紅色核准章！
                            </li>
                        </ul>
                    </div>

                    <!-- STEP 10 -->
                    <div style="background:#FFF; border:1px solid #CBD5E1; border-radius:6px; padding:14px 18px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #E2E8F0; padding-bottom:8px;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="background:#C2410C; color:#FFF; font-weight:bold; font-size:11px; padding:2px 8px; border-radius:10px;">步驟十</span>
                                <b style="color:#0F172A; font-size:14px;">進貨單建立作業 (PURI09) 驗收入庫</b>
                            </div>
                            <button type="button" onclick="Modules.open('PURI09')" style="background:linear-gradient(to bottom, #FFF, #ECE9D8); border:1px solid #7F9DB9; padding:2px 10px; font-size:12px; cursor:pointer; border-radius:3px; color:#003366; font-weight:bold;">📂 進入作業</button>
                        </div>
                        <ul style="margin:0; padding-left:20px; font-size:12.5px;">
                            <li><b>作業目的</b>：廠商到貨後實物點驗，填寫實際驗收數量並登記入庫，即時增加倉庫庫存。</li>
                            <li><b>操作說明</b>：
                                1. 點選選單<b>「功能(F)」➔「複製前置單據 (來源採購單)」</b>，挑選剛才已審核的採購單（或點選「新增」手動建單）。<br>
                                2. 系統自動帶入採購明細與「進貨數量」（如 <code>20</code>）。<br>
                                3. <b style="color:#DC2626;">【驗收數量手動輸入】</b>：單身<b>「驗收數量」絕對不會自動帶入</b>，預設為空白，必須由使用者依現場點檢數量自行手動輸入（如填寫 <code>20</code>）。<br>
                                4. 單身包含「計價數量」與「計價單位」（黃底標示）及庫別（<code>P003</code>）。<br>
                                5. <b>【最下方總計面板】</b>：原幣 6 列（進貨金額、扣款金額、貨款金額、稅額、金額合計、沖自籌額）、本幣 5 列（進貨費用、貨款金額、稅額、金額合計、沖自籌額）、數量合計橫向三欄並列，清晰可見絕不遮蔽。<br>
                                6. 點選工具列<b>「<span style="color:#008000; font-weight:bold;">✔</span> 儲存」</b>（綠色打勾），點選工具列<b>「<img src="assets/icons/confirm_active.png" style="width:14px;height:14px;vertical-align:middle;display:inline-block;"> 確認」</b>完成審核！<br>
                                7. <b>庫存連動檢驗</b>：審核後系統自動增加該倉庫（<code>P003</code>）對應品號之庫存量（例如庫存即時由 0 增加為 20）！
                            </li>
                        </ul>
                    </div>

                    <!-- STEP 11 -->
                    <div style="background:#FFF; border:1px solid #CBD5E1; border-radius:6px; padding:14px 18px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #E2E8F0; padding-bottom:8px;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="background:#4338CA; color:#FFF; font-weight:bold; font-size:11px; padding:2px 8px; border-radius:10px;">步驟十一</span>
                                <b style="color:#0F172A; font-size:14px;">銷貨單建立作業 (COPI08) 出庫</b>
                            </div>
                            <button type="button" onclick="Modules.open('COPI08')" style="background:linear-gradient(to bottom, #FFF, #ECE9D8); border:1px solid #7F9DB9; padding:2px 10px; font-size:12px; cursor:pointer; border-radius:3px; color:#003366; font-weight:bold;">📂 進入作業</button>
                        </div>
                        <ul style="margin:0; padding-left:20px; font-size:12.5px;">
                            <li><b>作業目的</b>：針對客戶訂單進行出貨履約，出庫實體商品並扣減庫存。</li>
                            <li><b>操作說明</b>：
                                1. 開啟 COPI08，點選「複製前置單據 (來源訂單)」挑選客戶訂單 <code>A221-xxxx</code>，自動帶入出貨品號與數量。<br>
                                2. 確認出貨庫別為 <code>P003</code>。<br>
                                3. 點選工具列<b>「<span style="color:#008000; font-weight:bold;">✔</span> 儲存」</b>（綠色打勾），點選工具列<b>「<img src="assets/icons/confirm_active.png" style="width:14px;height:14px;vertical-align:middle;display:inline-block;"> 確認」</b>審核加蓋核准印章。<br>
                                4. 系統自動扣減倉庫庫存（例如庫存由 20 扣回 0），完成銷售出庫。
                            </li>
                        </ul>
                    </div>

                    <!-- STEP 12 -->
                    <div style="background:#FFF; border:1px solid #CBD5E1; border-radius:6px; padding:14px 18px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #E2E8F0; padding-bottom:8px;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="background:#475569; color:#FFF; font-weight:bold; font-size:11px; padding:2px 8px; border-radius:10px;">步驟十二</span>
                                <b style="color:#0F172A; font-size:14px;">訂單樹狀資訊查詢 (COPQ05) 全流程生命週期驗證</b>
                            </div>
                            <button type="button" onclick="Modules.open('COPQ05')" style="background:linear-gradient(to bottom, #FFF, #ECE9D8); border:1px solid #7F9DB9; padding:2px 10px; font-size:12px; cursor:pointer; border-radius:3px; color:#003366; font-weight:bold;">📂 進入作業</button>
                        </div>
                        <ul style="margin:0; padding-left:20px; font-size:12.5px;">
                            <li><b>作業目的</b>：驗證端到端整套流程是否完全貫通閉環。</li>
                            <li><b>操作說明</b>：
                                1. 開啟 COPQ05，挑選剛才完成的客戶訂單單號。<br>
                                2. 展開樹狀結構，即可清楚檢驗全鏈路關聯節點：<br>
                                   <code>📁 [報價單] ➔ 📁 [客戶訂單] ➔ 📁 [請購單] ➔ 📁 [採購單] ➔ 📁 [進貨單] ➔ 📁 [銷貨單]</code><br>
                                3. 點擊任何單據節點可一鍵開窗查閱該單據完整欄位與核章狀態，驗證全流程 100% 成功！
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
            <div class="erp-window-statusbar" style="height:22px; background:#ECE9D8; border-top:1px solid #D4D0C8; display:flex; align-items:center; padding:0 6px; font-size:11px;">
                <span class="status-cell">指引精靈運作正常</span>
                <span class="status-cell">作業代號: PRACTICE_GUIDE</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 840, 640);
    },

    // ========================================================
    // 17. 文字客服 (E-Service Support)
    // ========================================================
    openCustomerService() {
        const isAdmin = App.currentUser && (App.currentUser.role === 'admin' || (App.currentUser.username || '').toLowerCase() === 'admin');
        if (isAdmin) {
            this.openAdminCustomerService();
        } else {
            this.openUserCustomerService();
        }
    },

    openUserCustomerService() {
        const winId = 'customer_service_user';
        const title = `文字客服 (線上即時問題諮詢與回報)`;
        const curUser = App.currentUser?.username || '訪客';
        const curComp = App.currentUser?.company || `學生區${curUser}`;

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div style="padding:8px 12px; background:#E8EFF7; border-bottom:1px solid #7F9DB9; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span style="font-weight:bold; color:#1F497D; font-size:13px;">💬 線上文字客服中心</span>
                    <span style="margin-left:12px; font-size:12px; color:#333;">提問帳號: <b style="color:#003366;">${curUser}</b> (${curComp})</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="display:inline-block; width:8px; height:8px; background:#28A745; border-radius:50%;"></span>
                    <span style="color:#28A745; font-size:12px; font-weight:bold;">客服連線中</span>
                    <button type="button" id="cs-user-btn-refresh" style="margin-left:6px; height:22px; padding:0 8px; font-size:11px; cursor:pointer; background:#ECE9D8; border:1px solid #7F9DB9;">🔄 重新整理</button>
                </div>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; background:#F0F2F5; overflow:hidden;">
                <!-- 對話歷史區 -->
                <div id="cs-user-chat-box" style="flex:1; height:320px; overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:10px; background:#ECE9D8; border-bottom:1px solid #7F9DB9;">
                    <div style="text-align:center; color:#666; font-size:12px; padding:20px;">正在載入對話紀錄...</div>
                </div>

                <!-- 輸入區 -->
                <div style="padding:10px 12px; background:#FFFFFF; display:flex; flex-direction:column; gap:6px;">
                    <div style="font-size:11px; color:#555;">
                        💡 提示：輸入您在 ERP 模組操作時遇到的疑問或錯誤訊息，按 Enter 或點擊「送出問題」，系統與管理者會即時答覆您。
                    </div>
                    <div style="display:flex; gap:8px; align-items:flex-end;">
                        <textarea id="cs-user-input" rows="2" style="flex:1; height:50px; padding:6px; font-size:12px; font-family:inherit; border:1px solid #7F9DB9; border-radius:2px; resize:none; background:#FFFFEA;" placeholder="請在此輸入您的問題或疑問..."></textarea>
                        <button type="button" id="cs-user-btn-send" style="min-width:96px; height:50px; background:#2B579A; color:#FFFFFF; border:1px solid #1E3F70; font-size:13px; font-weight:bold; cursor:pointer; border-radius:2px; display:flex; align-items:center; justify-content:center; gap:4px;">
                            <span>📤</span> 送出問題
                        </button>
                    </div>
                </div>
            </div>
            <div class="erp-window-statusbar">
                <span class="status-cell">狀態: 文字客服連線正常</span>
                <span class="status-cell" id="cs-user-status-msg">已就緒</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 650, 530, (winEl) => {
            const chatBox = winEl.querySelector('#cs-user-chat-box');
            const txtInput = winEl.querySelector('#cs-user-input');
            const btnSend = winEl.querySelector('#cs-user-btn-send');
            const btnRefresh = winEl.querySelector('#cs-user-btn-refresh');
            const statusMsg = winEl.querySelector('#cs-user-status-msg');

            const escapeText = (str) => {
                if (!str) return '';
                const d = document.createElement('div');
                d.textContent = str;
                return d.innerHTML;
            };

            const loadMessages = async (silent = false) => {
                try {
                    const u = App.currentUser?.username || curUser;
                    const res = await ERP_API.post('get_support_messages', {
                        target_username: u,
                        username: u
                    });
                    if (res.success && Array.isArray(res.data)) {
                        const messages = res.data;
                        if (messages.length === 0) {
                            chatBox.innerHTML = `
                                <div style="text-align:center; padding:30px 10px; color:#777; font-size:12px;">
                                    <div style="font-size:28px; margin-bottom:8px;">💬</div>
                                    <b>目前尚無對話紀錄</b><br>
                                    有任何系統練習疑問或需協助事項，歡迎在下方輸入並送出！
                                </div>
                            `;
                            return;
                        }

                        let html = '';
                        messages.forEach(m => {
                            const timeStr = m.created_at || '';
                            const safeMsg = escapeText(m.message);

                            if (m.sender_role === 'user') {
                                html += `
                                    <div style="align-self:flex-end; max-width:82%; margin-bottom:4px;">
                                        <div style="display:flex; justify-content:flex-end; align-items:center; gap:6px; margin-bottom:2px;">
                                            <span style="font-size:10px; color:#888;">${timeStr}</span>
                                            <span style="font-size:11px; font-weight:bold; color:#1F497D;">🙋‍♂️ 我 (${m.username})</span>
                                        </div>
                                        <div style="background:#D4E6F1; color:#000; padding:8px 12px; border-radius:8px 8px 0px 8px; border:1px solid #A9CCE3; font-size:12px; line-height:1.5; word-break:break-word; white-space:pre-wrap; box-shadow:1px 1px 3px rgba(0,0,0,0.08);">
                                            ${safeMsg}
                                        </div>
                                    </div>
                                `;
                            } else if (m.sender_role === 'system') {
                                html += `
                                    <div style="align-self:flex-start; max-width:88%; margin-bottom:4px;">
                                        <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                                            <span style="font-size:11px; font-weight:bold; color:#856404;">🤖 系統即時提示</span>
                                            <span style="font-size:10px; color:#888;">${timeStr}</span>
                                        </div>
                                        <div style="background:#FFF9D7; color:#856404; padding:8px 12px; border-radius:8px 8px 8px 0px; border:1px solid #FFEBAA; font-size:12px; line-height:1.5; word-break:break-word; white-space:pre-wrap; box-shadow:1px 1px 3px rgba(0,0,0,0.08);">
                                            🔔 <b>${safeMsg}</b>
                                        </div>
                                    </div>
                                `;
                            } else if (m.sender_role === 'admin') {
                                html += `
                                    <div style="align-self:flex-start; max-width:85%; margin-bottom:4px;">
                                        <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                                            <span style="font-size:11px; font-weight:bold; color:#117864;">👔 最高管理者 (回覆)</span>
                                            <span style="background:#27AE60; color:#FFFFFF; font-size:9px; padding:1px 5px; border-radius:3px; font-weight:bold;">已答覆</span>
                                            <span style="font-size:10px; color:#888;">${timeStr}</span>
                                        </div>
                                        <div style="background:#E8F8F5; color:#0B5345; padding:8px 12px; border-radius:8px 8px 8px 0px; border:1px solid #A2D9CE; font-size:12px; line-height:1.5; word-break:break-word; white-space:pre-wrap; box-shadow:1px 1px 3px rgba(0,0,0,0.08); font-weight:500;">
                                            ${safeMsg}
                                        </div>
                                    </div>
                                `;
                            }
                        });

                        chatBox.innerHTML = html;
                        chatBox.scrollTop = chatBox.scrollHeight;
                        if (!silent && statusMsg) statusMsg.textContent = `對話紀錄已更新 (${messages.length} 則)`;
                    }
                } catch (e) {
                    console.error('文字客服讀取訊息失敗:', e);
                }
            };

            const doSend = async () => {
                const text = txtInput.value.trim();
                if (!text) {
                    alert('請輸入您的問題內容！');
                    txtInput.focus();
                    return;
                }

                btnSend.disabled = true;
                btnSend.textContent = '送出中...';

                try {
                    const u = App.currentUser?.username || curUser;
                    const c = App.currentUser?.company || (u ? `學生區${u}` : curComp);
                    const d = App.currentUser?.display_name || (u ? `學生${u}` : '訪客');

                    const res = await ERP_API.post('send_support_message', {
                        message: text,
                        username: u,
                        company: c,
                        display_name: d
                    });
                    if (res.success) {
                        txtInput.value = '';
                        // 提示使用者：已收到問題，處理好會再通知，謝謝您
                        const replyPrompt = res.prompt || '已收到問題，處理好會再通知，謝謝您';
                        alert(replyPrompt);
                        App.showToast(replyPrompt, 'success', 3500);
                        await loadMessages();
                    } else {
                        alert('訊息發送失敗: ' + (res.error || '不明錯誤'));
                    }
                } catch (e) {
                    alert('連線失敗: ' + e.message);
                } finally {
                    btnSend.disabled = false;
                    btnSend.innerHTML = `<span>📤</span> 送出問題`;
                }
            };

            btnSend.addEventListener('click', doSend);
            btnRefresh.addEventListener('click', () => loadMessages());
            txtInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    doSend();
                }
            });

            // 初始載入與定時輪詢 (每 4 秒自動更新最新回覆)
            loadMessages();
            const pollTimer = setInterval(() => {
                const w = App.windows[winId];
                if (!w || w.element.style.display === 'none') return;
                loadMessages(true);
            }, 4000);

            const winObj = App.windows[winId];
            if (winObj) {
                winObj.beforeClose = () => {
                    clearInterval(pollTimer);
                    return true;
                };
            }
        });
    },

    openAdminCustomerService() {
        const winId = 'customer_service_admin';
        const title = `最高管理者 - 文字客服問題處理中心`;

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div style="padding:8px 14px; background:#1F497D; color:#FFFFFF; display:flex; justify-content:space-between; align-items:center;">
                <div style="font-weight:bold; font-size:13px; display:flex; align-items:center; gap:8px;">
                    <span>🛡️</span>
                    <span>最高管理者客服問題處理中心 (即時受理各帳號回報問題並進行回覆)</span>
                </div>
                <div>
                    <button type="button" id="cs-admin-btn-refresh-all" style="height:24px; padding:0 10px; font-size:11px; cursor:pointer; background:#ECE9D8; color:#000; border:1px solid #ffffff; font-weight:bold;">🔄 立即整理清單</button>
                </div>
            </div>
            <div style="flex:1; display:flex; background:#FFFFFF; overflow:hidden;">
                <!-- 左側：提問使用者清單 -->
                <div style="width:290px; border-right:2px solid #7F9DB9; display:flex; flex-direction:column; background:#F5F5F5;">
                    <div style="padding:6px 10px; background:#E0EDF9; border-bottom:1px solid #7F9DB9; font-weight:bold; font-size:12px; color:#1F497D; display:flex; justify-content:space-between;">
                        <span>📥 提問帳號清單</span>
                        <span id="cs-admin-threads-count" style="color:#666; font-weight:normal; font-size:11px;">共 0 位</span>
                    </div>
                    <div id="cs-admin-threads-list" style="flex:1; overflow-y:auto; padding:4px;">
                        <div style="text-align:center; padding:30px 10px; color:#888; font-size:12px;">載入提問名單中...</div>
                    </div>
                </div>

                <!-- 右側：選定使用者的對話歷程與回覆區 -->
                <div style="flex:1; display:flex; flex-direction:column; background:#FFFFFF;">
                    <!-- 對象標題 -->
                    <div style="padding:8px 14px; background:#F8F9FA; border-bottom:1px solid #D0D0D0; display:flex; justify-content:space-between; align-items:center;">
                        <div id="cs-admin-cur-thread-title" style="font-weight:bold; color:#003366; font-size:13px;">
                            👈 請從左側選擇一位提問帳號
                        </div>
                        <div id="cs-admin-cur-thread-status"></div>
                    </div>

                    <!-- 對話內容區 -->
                    <div id="cs-admin-chat-box" style="flex:1; height:290px; overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:8px; background:#ECE9D8; border-bottom:1px solid #7F9DB9;">
                        <div style="text-align:center; padding:50px 10px; color:#888; font-size:12px;">
                            請先在左側提問帳號清單中點選欲查看及回覆的對象。
                        </div>
                    </div>

                    <!-- 回覆輸入區 -->
                    <div id="cs-admin-reply-panel" style="padding:10px 12px; background:#F9F9F9; display:flex; flex-direction:column; gap:6px;">
                        <div style="font-size:11px; color:#555; font-weight:bold;">
                            ✍️ 管理者回覆內容 (送出後該帳號之文字客服將即時收到您的回覆，狀態自動變更為「已回覆」)：
                        </div>
                        <div style="display:flex; gap:8px; align-items:flex-end;">
                            <textarea id="cs-admin-reply-input" rows="2" style="flex:1; height:50px; padding:6px; font-size:12px; font-family:inherit; border:1px solid #7F9DB9; border-radius:2px; resize:none;" placeholder="請輸入回覆內容... (Ctrl+Enter 送出)"></textarea>
                            <button type="button" id="cs-admin-btn-send-reply" style="min-width:105px; height:50px; background:#1E7E34; color:#FFFFFF; border:1px solid #145523; font-size:13px; font-weight:bold; cursor:pointer; border-radius:2px; display:flex; align-items:center; justify-content:center; gap:4px;">
                                <span>✉️</span> 送出回覆
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="erp-window-statusbar">
                <span class="status-cell">權限: 最高管理者</span>
                <span class="status-cell" id="cs-admin-status-bar">就緒</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 860, 580, (winEl) => {
            const listEl = winEl.querySelector('#cs-admin-threads-list');
            const countEl = winEl.querySelector('#cs-admin-threads-count');
            const chatBox = winEl.querySelector('#cs-admin-chat-box');
            const threadTitle = winEl.querySelector('#cs-admin-cur-thread-title');
            const threadStatus = winEl.querySelector('#cs-admin-cur-thread-status');
            const replyInput = winEl.querySelector('#cs-admin-reply-input');
            const btnSendReply = winEl.querySelector('#cs-admin-btn-send-reply');
            const btnRefreshAll = winEl.querySelector('#cs-admin-btn-refresh-all');
            const statusBar = winEl.querySelector('#cs-admin-status-bar');

            let selectedUser = null;
            let currentThreads = [];

            const escapeText = (str) => {
                if (!str) return '';
                const d = document.createElement('div');
                d.textContent = str;
                return d.innerHTML;
            };

            const loadThreads = async (silent = false) => {
                try {
                    const res = await ERP_API.get('get_admin_support_threads');
                    if (res.success && Array.isArray(res.data)) {
                        currentThreads = res.data;
                        if (countEl) countEl.textContent = `共 ${currentThreads.length} 位`;

                        if (currentThreads.length === 0) {
                            listEl.innerHTML = `<div style="text-align:center; padding:30px 10px; color:#888; font-size:12px;">目前尚無任何提問紀錄</div>`;
                            return;
                        }

                        let html = '';
                        currentThreads.forEach(th => {
                            const isSelected = selectedUser && selectedUser === th.username;
                            const isPending = parseInt(th.pending_count || 0) > 0;
                            const badgeHtml = isPending
                                ? `<span style="background:#D9534F; color:#FFFFFF; font-size:10px; padding:2px 6px; border-radius:10px; font-weight:bold;">處理中 (${th.pending_count})</span>`
                                : `<span style="background:#5CB85C; color:#FFFFFF; font-size:10px; padding:2px 6px; border-radius:10px; font-weight:bold;">✔ 已回覆</span>`;

                            const bgStyle = isSelected ? 'background:#D0E1F9; border:1px solid #337AB7;' : 'background:#FFFFFF; border:1px solid #D6D6D6;';

                            html += `
                                <div class="cs-admin-thread-item" data-user="${th.username}" style="${bgStyle} border-radius:4px; padding:8px 10px; margin-bottom:5px; cursor:pointer; transition:all 0.15s;">
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                        <b style="font-size:12px; color:#1F497D;">👤 ${escapeText(th.company || ('學生區' + th.username))} (${th.username})</b>
                                        ${badgeHtml}
                                    </div>
                                    <div style="font-size:11px; color:#444; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-bottom:3px;">
                                        ${escapeText(th.latest_message || '尚無訊息')}
                                    </div>
                                    <div style="font-size:10px; color:#888; text-align:right;">
                                        ${th.last_time || ''}
                                    </div>
                                </div>
                            `;
                        });

                        listEl.innerHTML = html;

                        // 點選切換對象
                        listEl.querySelectorAll('.cs-admin-thread-item').forEach(el => {
                            el.addEventListener('click', () => {
                                const uname = el.getAttribute('data-user');
                                selectThread(uname);
                            });
                        });

                        if (!silent && statusBar) statusBar.textContent = `清單已更新 (${currentThreads.length} 位)`;
                    }
                } catch (e) {
                    console.error('最高管理者讀取提問清單失敗:', e);
                }
            };

            const selectThread = (uname) => {
                selectedUser = uname;
                const th = currentThreads.find(t => t.username === uname);
                const compName = th ? (th.company || ('學生區' + th.username)) : uname;
                const isPending = th && parseInt(th.pending_count || 0) > 0;

                threadTitle.innerHTML = `對話對象: <b style="color:#1F497D;">${escapeText(compName)}</b> (帳號: ${uname})`;
                threadStatus.innerHTML = isPending
                    ? `<span style="background:#D9534F; color:#FFFFFF; font-size:11px; padding:3px 8px; border-radius:10px; font-weight:bold;">狀態: 待處理 (${th.pending_count})</span>`
                    : `<span style="background:#5CB85C; color:#FFFFFF; font-size:11px; padding:3px 8px; border-radius:10px; font-weight:bold;">狀態: 已回覆</span>`;

                // 更新左側選取狀態樣式
                listEl.querySelectorAll('.cs-admin-thread-item').forEach(el => {
                    const u = el.getAttribute('data-user');
                    if (u === uname) {
                        el.style.background = '#D0E1F9';
                        el.style.border = '1px solid #337AB7';
                    } else {
                        el.style.background = '#FFFFFF';
                        el.style.border = '1px solid #D6D6D6';
                    }
                });

                loadThreadMessages(uname);
                replyInput.focus();
            };

            const loadThreadMessages = async (uname, silent = false) => {
                if (!uname) return;
                try {
                    const res = await ERP_API.post('get_support_messages', { target_username: uname });
                    if (res.success && Array.isArray(res.data)) {
                        const messages = res.data;
                        if (messages.length === 0) {
                            chatBox.innerHTML = `<div style="text-align:center; padding:30px; color:#888;">此使用者尚無對話紀錄。</div>`;
                            return;
                        }

                        let html = '';
                        messages.forEach(m => {
                            const timeStr = m.created_at || '';
                            const safeMsg = escapeText(m.message);

                            if (m.sender_role === 'user') {
                                html += `
                                    <div style="align-self:flex-start; max-width:85%; margin-bottom:4px;">
                                        <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                                            <span style="font-size:11px; font-weight:bold; color:#1F497D;">👤 學生提問 (${m.username})</span>
                                            <span style="font-size:10px; color:#888;">${timeStr}</span>
                                        </div>
                                        <div style="background:#FFFFFF; color:#000; padding:8px 12px; border-radius:8px 8px 8px 0px; border:1px solid #CCD1D9; font-size:12px; line-height:1.5; word-break:break-word; white-space:pre-wrap; box-shadow:1px 1px 2px rgba(0,0,0,0.05);">
                                            ${safeMsg}
                                        </div>
                                    </div>
                                `;
                            } else if (m.sender_role === 'system') {
                                html += `
                                    <div style="align-self:center; max-width:90%; margin:4px 0;">
                                        <div style="background:#FFF9D7; color:#856404; padding:4px 10px; border-radius:12px; border:1px solid #FFEBAA; font-size:11px; text-align:center;">
                                            🤖 系統已自動答覆確認: <b>${safeMsg}</b> (${timeStr})
                                        </div>
                                    </div>
                                `;
                            } else if (m.sender_role === 'admin') {
                                html += `
                                    <div style="align-self:flex-end; max-width:85%; margin-bottom:4px;">
                                        <div style="display:flex; justify-content:flex-end; align-items:center; gap:6px; margin-bottom:2px;">
                                            <span style="font-size:10px; color:#888;">${timeStr}</span>
                                            <span style="font-size:11px; font-weight:bold; color:#1E7E34;">👔 我 (最高管理者回覆)</span>
                                            <span style="background:#28A745; color:#FFFFFF; font-size:9px; padding:1px 4px; border-radius:3px;">已答覆</span>
                                        </div>
                                        <div style="background:#E8F8F5; color:#0B5345; padding:8px 12px; border-radius:8px 8px 0px 8px; border:1px solid #A2D9CE; font-size:12px; line-height:1.5; word-break:break-word; white-space:pre-wrap; box-shadow:1px 1px 2px rgba(0,0,0,0.05); font-weight:500;">
                                            ${safeMsg}
                                        </div>
                                    </div>
                                `;
                            }
                        });

                        chatBox.innerHTML = html;
                        chatBox.scrollTop = chatBox.scrollHeight;
                        if (!silent && statusBar) statusBar.textContent = `已載入 ${uname} 的對話 (${messages.length} 則)`;
                    }
                } catch (e) {
                    console.error('最高管理者讀取對話失敗:', e);
                }
            };

            const doReply = async () => {
                if (!selectedUser) {
                    alert('請先從左側選擇一位欲回覆的提問使用者！');
                    return;
                }
                const text = replyInput.value.trim();
                if (!text) {
                    alert('請輸入回覆內容！');
                    replyInput.focus();
                    return;
                }

                btnSendReply.disabled = true;
                btnSendReply.textContent = '回覆中...';

                try {
                    const res = await ERP_API.post('admin_reply_support', {
                        target_username: selectedUser,
                        message: text,
                        admin_name: App.currentUser?.username || '最高管理者'
                    });

                    if (res.success) {
                        App.showToast(`已成功回覆給帳號 [${selectedUser}]！`, 'success');
                        replyInput.value = '';
                        await loadThreadMessages(selectedUser);
                        await loadThreads(true);
                    } else {
                        alert('回覆失敗: ' + (res.error || '不明錯誤'));
                    }
                } catch (e) {
                    alert('連線失敗: ' + e.message);
                } finally {
                    btnSendReply.disabled = false;
                    btnSendReply.innerHTML = `<span>✉️</span> 送出回覆`;
                }
            };

            btnSendReply.addEventListener('click', doReply);
            btnRefreshAll.addEventListener('click', () => {
                loadThreads();
                if (selectedUser) loadThreadMessages(selectedUser);
            });

            replyInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    doReply();
                }
            });

            // 初始載入與定時輪詢
            loadThreads();
            const pollTimer = setInterval(() => {
                const w = App.windows[winId];
                if (!w || w.element.style.display === 'none') return;
                loadThreads(true);
                if (selectedUser) loadThreadMessages(selectedUser, true);
            }, 5000);

            const winObj = App.windows[winId];
            if (winObj) {
                winObj.beforeClose = () => {
                    clearInterval(pollTimer);
                    return true;
                };
            }
        });
    }
});
