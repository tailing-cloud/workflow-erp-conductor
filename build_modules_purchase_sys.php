<?php
// C:\xampp\htdocs\erp\build_modules_purchase_sys.php
$outPath = __DIR__ . '/assets/js/modules.js';
$fp = fopen($outPath, 'ab');
if (!$fp) die("Cannot open $outPath for appending.\n");

// ========================================================
// 7. 訂單轉請購單複製作業 (COPB10) - 1:1
// ========================================================
fwrite($fp, <<<'JS'
    openCOPB10(defaultOrderNo = '') {
        const u = App.currentUser?.company || '學生區';
        const title = `訂單轉請購單複製作業(COPB10)[${u}]`;
        const winId = 'COPB10';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">作業(<u>O</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="執行產生" id="copb10-tb-run" style="color:green;font-weight:bold;">▶ 執行</button>
                <button class="erp-tb-btn" title="查看佇列" onclick="Modules.open('QUEUE_CONSOLE')">📑 佇列控制台</button>
            </div>

            <!-- Parameters Panel -->
            <div class="erp-header-panel" style="padding:16px; margin:8px; border:1px solid #7F9DB9; background:#ECE9D8;">
                <h4 style="margin-bottom:14px; color:#003366; border-bottom:1px solid #A0A0A0; padding-bottom:4px;">【批次轉換條件設定】</h4>
                <div class="erp-form-row">
                    <div class="erp-field">
                        <label>客戶訂單單號</label>
                        <input type="text" id="copb10-order-no" class="erp-input-cyan" style="width:160px;" value="${defaultOrderNo}">
                        <button class="lookup-icon-btn" id="copb10-lookup-order" title="挑選已確認訂單">🔍</button>
                    </div>
                </div>
                <div class="erp-form-row">
                    <div class="erp-field">
                        <label>請購單單別</label>
                        <input type="text" id="copb10-req-type" class="erp-input-yellow" style="width:80px;" value="A311">
                        <button class="lookup-icon-btn" id="copb10-lookup-reqtype" title="挑選請購單別">🔍</button>
                        <span class="erp-field-desc">(A311 國內物料請購單)</span>
                    </div>
                </div>
                <div class="erp-form-row">
                    <div class="erp-field">
                        <label>請購部門</label>
                        <input type="text" id="copb10-dept" style="width:120px;" value="0200 採購部">
                    </div>
                    <div class="erp-field">
                        <label>請購人員</label>
                        <input type="text" id="copb10-user" style="width:90px;" value="${App.currentUser?.username || 'B18'}">
                    </div>
                </div>
                <div class="erp-form-row" style="margin-top:10px;">
                    <label style="min-width:auto;"><input type="checkbox" id="copb10-chk-stock" checked> 自動扣抵目前倉庫庫存量 (若足夠則不轉請購)</label>
                </div>
            </div>

            <div class="erp-window-statusbar">
                <span class="status-cell" id="copb10-status-msg">請輸入或開窗挑選訂單，點擊「執行」拋轉請購單</span>
                <span class="status-cell">作業: COPB10</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 700, 440, (winEl) => {
            const fOrderNo = winEl.querySelector('#copb10-order-no');
            const fReqType = winEl.querySelector('#copb10-req-type');
            const fDept = winEl.querySelector('#copb10-dept');
            const fUser = winEl.querySelector('#copb10-user');
            const statusMsg = winEl.querySelector('#copb10-status-msg');

            winEl.querySelector('#copb10-lookup-order').addEventListener('click', () => {
                Modules.openLookup('order', (o) => {
                    fOrderNo.value = o.order_no;
                });
            });

            winEl.querySelector('#copb10-lookup-reqtype').addEventListener('click', () => {
                Modules.openLookup('doc_type_req', (t) => { fReqType.value = t.code; });
            });

            winEl.querySelector('#copb10-tb-run').addEventListener('click', async () => {
                const oNo = fOrderNo.value.trim();
                if (!oNo) {
                    alert('請挑選或輸入訂單單號！');
                    fOrderNo.focus();
                    return;
                }
                statusMsg.textContent = '批次處理中，正在建立請購單與佇列工作...';
                const res = await ERP_API.post('batch_order_to_req', {
                    order_no: oNo,
                    req_type: fReqType.value.trim() || 'A311',
                    dept: fDept.value.trim(),
                    req_user: fUser.value.trim()
                });
                if (res.success) {
                    alert(`訂單轉請購單複製作業執行成功！\n\n已產生請購單單號：${res.req_no}\n已提交後台佇列工作：[${res.job_no}]`);
                    statusMsg.textContent = `已成功產生請購單: ${res.req_no}`;
                    if (confirm('是否立即開啟「請購單建立作業 (PURI05)」檢視該筆單據？')) {
                        Modules.open('PURI05');
                    }
                } else {
                    alert('執行失敗: ' + (res.error || '不明錯誤'));
                    statusMsg.textContent = '執行失敗: ' + (res.error || '');
                }
            });
        });
    },

    // ========================================================
    // 8. 請購單建立作業 (PURI05) - 1:1
    // ========================================================
    openPURI05() {
        const u = App.currentUser?.company || '學生區';
        const title = `請購單建立作業(PURI05)[${u}]`;
        const winId = 'PURI05';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">資料(<u>D</u>)</span>
                <span class="erp-menu-item">功能(<u>F</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="新增" id="puri05-tb-new">📄</button>
                <button class="erp-tb-btn" title="查詢" id="puri05-tb-query">🔍</button>
                <button class="erp-tb-btn" title="修改" id="puri05-tb-edit">✏️</button>
                <button class="erp-tb-btn" title="刪除" id="puri05-tb-del">🗑️</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="首筆" id="puri05-tb-first">|◀</button>
                <button class="erp-tb-btn" title="上筆" id="puri05-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下筆" id="puri05-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="puri05-tb-last">▶|</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="儲存" id="puri05-tb-save" style="color:green;font-weight:bold;">💾</button>
                <button class="erp-tb-btn btn-confirm" title="確認" id="puri05-tb-confirm">✔ 確認</button>
                <button class="erp-tb-btn btn-unconfirm" title="取消確認" id="puri05-tb-unconfirm">✖ 取消確認</button>
                <button class="erp-tb-btn btn-transfer" title="轉採購單 (PURI07)" onclick="Modules.open('PURI07')">🛒 轉採購</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('請購單報表產生中...')">🖨️</button>
            </div>

            <!-- Top Tab Header -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="puri05-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="puri05-tab-browse">資料瀏覽</button>
            </div>

            <!-- Detail View -->
            <div id="puri05-view-detail" style="display:flex; flex-direction:column; flex:1;">
                <div class="erp-header-panel">
                    <div class="erp-stamp-he" style="display:none;">核</div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>請購單別</label>
                            <input type="text" id="puri05-type" class="erp-input-cyan" style="width:70px;" value="A311">
                            <button class="lookup-icon-btn" id="puri05-lookup-type" title="挑選單別">🔍</button>
                            <span class="erp-field-desc" id="puri05-type-desc">物料請購單</span>
                        </div>
                        <div class="erp-field">
                            <label>單據日期</label>
                            <input type="text" id="puri05-doc-date" class="erp-input-yellow" style="width:90px;" value="">
                            <input type="checkbox" id="puri05-chk-date">
                        </div>
                        <div class="erp-field">
                            <label>請購日期</label>
                            <input type="text" id="puri05-req-date" style="width:90px;" value="">
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>請購單號</label>
                            <input type="text" id="puri05-no" class="erp-input-cyan" style="width:130px;" value="">
                        </div>
                        <div class="erp-field">
                            <label>請購人員</label>
                            <input type="text" id="puri05-user" class="erp-input-yellow" style="width:70px;" value="">
                            <button class="lookup-icon-btn" id="puri05-lookup-user" title="挑選人員">🔍</button>
                            <span class="erp-field-desc" id="puri05-user-desc">翁湘琴</span>
                        </div>
                        <div class="erp-field">
                            <label>請購部門</label>
                            <input type="text" id="puri05-dept" style="width:100px;" value="0200 採購部">
                            <button class="lookup-icon-btn" id="puri05-lookup-dept" title="挑選部門">🔍</button>
                        </div>
                        <div class="erp-field">
                            <label>來源訂單</label>
                            <input type="text" id="puri05-source-order" style="width:130px;" value="">
                            <button class="lookup-icon-btn" id="puri05-lookup-order" title="挑選訂單">🔍</button>
                        </div>
                        <div class="erp-field">
                            <label>確認者</label>
                            <input type="text" id="puri05-confirm-user" class="erp-input-readonly" style="width:65px;" value="" readonly>
                        </div>
                    </div>
                </div>

                <!-- Subtab Header -->
                <div class="erp-subtab-header">
                    <button class="erp-subtab-btn active">交易資料</button>
                    <button class="erp-subtab-btn">其他資料</button>
                </div>

                <!-- Dynamic DataGrid -->
                <div class="erp-datagrid-container">
                    <table class="erp-grid-table">
                        <thead>
                            <tr>
                                <th style="width:22px;">📋</th>
                                <th class="th-cyan" style="width:38px;">序號</th>
                                <th style="width:75px;">業務品號</th>
                                <th class="th-yellow" style="width:100px;">品號</th>
                                <th style="width:170px;">品名</th>
                                <th style="width:130px;">規格</th>
                                <th style="width:65px;">請購數量</th>
                                <th style="width:40px;">單位</th>
                                <th style="width:75px;">預估單價</th>
                                <th style="width:85px;">金額</th>
                                <th style="width:85px;">需求日</th>
                                <th class="th-yellow" style="width:70px;">庫別</th>
                            </tr>
                        </thead>
                        <tbody id="puri05-grid-tbody">
                            <!-- Dynamic 1-row grid -->
                        </tbody>
                    </table>
                </div>

                <!-- Totals Panel -->
                <div class="erp-totals-panel">
                    <div class="erp-totals-row">
                        <span>請購金額</span>
                        <input type="text" id="puri05-tot-amt" class="erp-totals-inp" value="0" readonly>
                        <span style="margin-left:20px;">稅額</span>
                        <input type="text" id="puri05-tot-tax" class="erp-totals-inp" value="0" readonly>
                        <span style="margin-left:20px;">合計</span>
                        <input type="text" id="puri05-tot-grand" class="erp-totals-inp" value="0" readonly>
                    </div>
                    <div class="erp-totals-row">
                        <span>總數量</span>
                        <input type="text" id="puri05-tot-qty" class="erp-totals-inp" value="0" readonly>
                    </div>
                </div>
            </div>

            <!-- Browse View -->
            <div id="puri05-view-browse" style="display:none; flex-direction:column; flex:1; padding:4px;">
                <table class="erp-grid-table">
                    <thead>
                        <tr>
                            <th style="width:25px;"></th>
                            <th class="th-cyan" style="width:130px;">請購單號</th>
                            <th style="width:85px;">請購日期</th>
                            <th style="width:80px;">請購人員</th>
                            <th style="width:110px;">請購部門</th>
                            <th style="width:130px;">來源訂單</th>
                            <th style="width:90px;">請購金額</th>
                            <th style="width:65px;">狀態</th>
                        </tr>
                    </thead>
                    <tbody id="puri05-browse-tbody">
                        <tr><td colspan="8" style="text-align:center; padding:20px;">載入請購單清單中...</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Statusbar -->
            <div class="erp-window-statusbar">
                <span class="status-cell">瀏覽</span>
                <span class="status-cell" id="puri05-status-msg">單身資料筆數: 0</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 940, 600, (winEl) => {
            const fType = winEl.querySelector('#puri05-type');
            const fTypeDesc = winEl.querySelector('#puri05-type-desc');
            const fDocDate = winEl.querySelector('#puri05-doc-date');
            const fReqDate = winEl.querySelector('#puri05-req-date');
            const fNo = winEl.querySelector('#puri05-no');
            const fUser = winEl.querySelector('#puri05-user');
            const fUserDesc = winEl.querySelector('#puri05-user-desc');
            const fDept = winEl.querySelector('#puri05-dept');
            const fSourceOrder = winEl.querySelector('#puri05-source-order');
            const fConfirmUser = winEl.querySelector('#puri05-confirm-user');
            const fTotAmt = winEl.querySelector('#puri05-tot-amt');
            const fTotTax = winEl.querySelector('#puri05-tot-tax');
            const fTotGrand = winEl.querySelector('#puri05-tot-grand');
            const fTotQty = winEl.querySelector('#puri05-tot-qty');
            const statusMsg = winEl.querySelector('#puri05-status-msg');

            const tabDetail = winEl.querySelector('#puri05-tab-detail');
            const tabBrowse = winEl.querySelector('#puri05-tab-browse');
            const viewDetail = winEl.querySelector('#puri05-view-detail');
            const viewBrowse = winEl.querySelector('#puri05-view-browse');

            let currentDocStatus = '未確認';
            let requisitionList = [];

            const switchTab = (mode) => {
                if (mode === 'browse') {
                    tabBrowse.classList.add('active');
                    tabDetail.classList.remove('active');
                    viewBrowse.style.display = 'flex';
                    viewDetail.style.display = 'none';
                    loadBrowseList();
                } else {
                    tabDetail.classList.add('active');
                    tabBrowse.classList.remove('active');
                    viewDetail.style.display = 'flex';
                    viewBrowse.style.display = 'none';
                }
            };

            tabDetail.addEventListener('click', () => switchTab('detail'));
            tabBrowse.addEventListener('click', () => switchTab('browse'));

            const calcTotals = () => {
                let sumAmt = 0;
                let sumQty = 0;
                let rowCount = 0;
                const rows = winEl.querySelectorAll('#puri05-grid-tbody tr[data-row]');
                rows.forEach(r => {
                    const rowIdx = r.getAttribute('data-row');
                    const iNo = winEl.querySelector(`#puri05-item-no-${rowIdx}`)?.value.trim();
                    const q = parseFloat(winEl.querySelector(`#puri05-qty-${rowIdx}`)?.value) || 0;
                    const a = parseFloat((winEl.querySelector(`#puri05-amount-${rowIdx}`)?.value || '').replace(/,/g, '')) || 0;
                    if (iNo) rowCount++;
                    sumQty += q;
                    sumAmt += a;
                });
                const tax = Math.round(sumAmt * 0.05);
                const grand = sumAmt + tax;
                fTotAmt.value = sumAmt.toLocaleString();
                fTotTax.value = tax.toLocaleString();
                fTotGrand.value = grand.toLocaleString();
                fTotQty.value = sumQty.toLocaleString();
                statusMsg.textContent = `單身資料筆數: ${rowCount}`;
            };

            const grid = Modules.initDynamicGrid(winEl, 'puri05', true, calcTotals);

            const fillReq = (header, details = []) => {
                fType.value = header.req_type || 'A311';
                fTypeDesc.textContent = header.req_type === 'A311' ? '物料請購單' : '';
                fDocDate.value = header.req_date || '';
                fReqDate.value = header.req_date || '';
                fNo.value = header.req_no || '';
                fUser.value = header.req_user || '';
                fDept.value = header.dept || '0200 採購部';
                fSourceOrder.value = header.source_order_no || '';
                fConfirmUser.value = header.confirm_user || '';
                currentDocStatus = header.status || '未確認';
                Modules.setDocStamp(winEl, currentDocStatus);
                grid.fillGrid(details);
            };

            const clearReq = () => {
                fType.value = 'A311';
                fTypeDesc.textContent = '物料請購單';
                const today = Modules.getTodayStr();
                fDocDate.value = today;
                fReqDate.value = today;
                fNo.value = 'A311-' + today.replace(/\//g, '') + String(Math.floor(Math.random() * 899 + 100)).padStart(3, '0');
                fUser.value = App.currentUser?.username || 'B18';
                fDept.value = '0200 採購部';
                fSourceOrder.value = '';
                fConfirmUser.value = '';
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '未確認');
                grid.clearGrid();
                fUser.focus();
            };

            const loadBrowseList = async () => {
                const tbody = winEl.querySelector('#puri05-browse-tbody');
                const res = await ERP_API.get('get_requisitions');
                if (res.success) {
                    requisitionList = res.data || [];
                    if (requisitionList.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px; color:#888;">目前尚無請購單據</td></tr>';
                        return;
                    }
                    let rows = '';
                    requisitionList.forEach(r => {
                        rows += `
                            <tr data-no="${r.req_no}" style="cursor:pointer;">
                                <td style="text-align:center;">▶</td>
                                <td style="font-weight:bold; color:#003366;">${r.req_no}</td>
                                <td>${r.req_date || ''}</td>
                                <td>${r.req_user || ''}</td>
                                <td>${r.dept || ''}</td>
                                <td>${r.source_order_no || ''}</td>
                                <td style="text-align:right;">${Math.round(r.total_amount || 0).toLocaleString()}</td>
                                <td style="text-align:center; font-weight:bold; color:${r.status === '已確認' ? 'green' : '#999'};">${r.status || '未確認'}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows;

                    tbody.querySelectorAll('tr[data-no]').forEach(tr => {
                        tr.addEventListener('click', async () => {
                            const no = tr.getAttribute('data-no');
                            const detailRes = await ERP_API.get('get_requisition', { req_no: no });
                            if (detailRes.success && detailRes.requisition) {
                                fillReq(detailRes.requisition, detailRes.details || []);
                                switchTab('detail');
                            }
                        });
                    });
                }
            };

            // Lookups
            winEl.querySelector('#puri05-lookup-type').addEventListener('click', () => {
                Modules.openLookup('doc_type_req', (t) => { fType.value = t.code; fTypeDesc.textContent = t.name; });
            });
            winEl.querySelector('#puri05-lookup-user').addEventListener('click', () => {
                Modules.openLookup('salesperson', (s) => { fUser.value = s.code; fUserDesc.textContent = s.name; });
            });
            winEl.querySelector('#puri05-lookup-dept').addEventListener('click', () => {
                Modules.openLookup('dept', (d) => { fDept.value = d.code + ' ' + d.name; });
            });
            winEl.querySelector('#puri05-lookup-order').addEventListener('click', () => {
                Modules.openLookup('order', (o) => { fSourceOrder.value = o.order_no; });
            });

            // Toolbar
            winEl.querySelector('#puri05-tb-new').addEventListener('click', clearReq);
            winEl.querySelector('#puri05-tb-query').addEventListener('click', () => {
                Modules.openLookup('requisition', async (r) => {
                    const res = await ERP_API.get('get_requisition', { req_no: r.req_no });
                    if (res.success && res.requisition) {
                        fillReq(res.requisition, res.details || []);
                    }
                });
            });

            winEl.querySelector('#puri05-tb-save').addEventListener('click', async () => {
                const reqNo = fNo.value.trim();
                if (!reqNo) {
                    alert('【必填檢查】請輸入請購單號！');
                    return;
                }
                const details = grid.getRowsData();
                if (details.length === 0) {
                    alert('【明細檢查】請至少在表格中挑選品號並輸入請購數量！');
                    return;
                }

                const payload = {
                    header: {
                        req_no: reqNo,
                        req_type: fType.value.trim() || 'A311',
                        req_date: fDocDate.value.trim() || Modules.getTodayStr(),
                        req_user: fUser.value.trim() || 'B18',
                        dept: fDept.value.trim(),
                        source_order_no: fSourceOrder.value.trim(),
                        status: currentDocStatus
                    },
                    details
                };

                const res = await ERP_API.post('save_requisition', payload);
                if (res.success) {
                    alert(`請購單 [${reqNo}] 儲存成功！`);
                } else {
                    alert('儲存失敗: ' + (res.error || '不明錯誤'));
                }
            });

            winEl.querySelector('#puri05-tb-confirm').addEventListener('click', async () => {
                const reqNo = fNo.value.trim();
                if (!reqNo) return;
                if (confirm(`確定要確認請購單 [${reqNo}] 嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'requisition', doc_no: reqNo, status: '已確認' });
                    if (res.success) {
                        currentDocStatus = '已確認';
                        fConfirmUser.value = App.currentUser?.username || 'B18';
                        Modules.setDocStamp(winEl, '已確認');
                        alert('請購單確認完成！');
                    }
                }
            });

            winEl.querySelector('#puri05-tb-unconfirm').addEventListener('click', async () => {
                const reqNo = fNo.value.trim();
                if (!reqNo) return;
                if (confirm(`確定要取消請購單 [${reqNo}] 的確認狀態嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'requisition', doc_no: reqNo, status: '未確認' });
                    if (res.success) {
                        currentDocStatus = '未確認';
                        fConfirmUser.value = '';
                        Modules.setDocStamp(winEl, '未確認');
                        alert('請購單已取消確認！');
                    }
                }
            });

            winEl.querySelector('#puri05-tb-del').addEventListener('click', async () => {
                const reqNo = fNo.value.trim();
                if (!reqNo) return;
                if (confirm(`確定要刪除請購單 [${reqNo}] 嗎？`)) {
                    const res = await ERP_API.post('delete_requisition', { req_no: reqNo });
                    if (res.success) {
                        alert('請購單已成功刪除！');
                        clearReq();
                    } else {
                        alert('刪除失敗: ' + (res.error || '不明錯誤'));
                    }
                }
            });
        });
    },

    // ========================================================
    // 9. 請購資料維護作業 (PURI06)
    // ========================================================
    openPURI06() {
        const u = App.currentUser?.company || '學生區';
        const title = `請購資料維護作業(PURI06)[${u}]`;
        const winId = 'PURI06';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">維護(<u>M</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="查詢請購單" id="puri06-tb-query">🔍 挑選請購單</button>
                <button class="erp-tb-btn" title="鎖定/解除" id="puri06-tb-lock">🔒 鎖定</button>
                <button class="erp-tb-btn" title="儲存" id="puri06-tb-save" style="color:green;font-weight:bold;">💾 儲存更新</button>
            </div>

            <div class="erp-header-panel">
                <div class="erp-form-row">
                    <div class="erp-field">
                        <label>請購單號</label>
                        <input type="text" id="puri06-req-no" class="erp-input-cyan" style="width:150px;" value="">
                        <button class="lookup-icon-btn" id="puri06-lookup-req" title="挑選請購單">🔍</button>
                    </div>
                    <div class="erp-field">
                        <label>請購人員</label>
                        <input type="text" id="puri06-user" style="width:90px;" value="" readonly>
                    </div>
                    <div class="erp-field">
                        <label>鎖定狀態</label>
                        <input type="text" id="puri06-locked" class="erp-input-readonly" style="width:70px;" value="未鎖定" readonly>
                    </div>
                </div>
            </div>

            <div class="erp-datagrid-container" style="flex:1;">
                <table class="erp-grid-table">
                    <thead>
                        <tr>
                            <th class="th-cyan" style="width:38px;">序號</th>
                            <th class="th-yellow" style="width:110px;">品號</th>
                            <th style="width:180px;">品名</th>
                            <th style="width:140px;">規格</th>
                            <th style="width:70px;">請購數量</th>
                            <th style="width:45px;">單位</th>
                            <th style="width:80px;">預計單價</th>
                            <th style="width:75px;">已轉採購量</th>
                            <th style="width:85px;">需求日</th>
                        </tr>
                    </thead>
                    <tbody id="puri06-grid-tbody">
                        <tr><td colspan="9" style="text-align:center; padding:20px; color:#888;">請點選「挑選請購單」載入資料</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="erp-window-statusbar">
                <span class="status-cell" id="puri06-status-msg">請先點選「挑選請購單」</span>
                <span class="status-cell">作業: PURI06</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 900, 520, (winEl) => {
            const fReqNo = winEl.querySelector('#puri06-req-no');
            const fUser = winEl.querySelector('#puri06-user');
            const fLocked = winEl.querySelector('#puri06-locked');
            const tbody = winEl.querySelector('#puri06-grid-tbody');
            const statusMsg = winEl.querySelector('#puri06-status-msg');

            const loadReq = async (reqNo) => {
                const res = await ERP_API.get('get_requisition', { req_no: reqNo });
                if (res.success && res.requisition) {
                    const req = res.requisition;
                    fReqNo.value = req.req_no;
                    fUser.value = req.req_user;
                    fLocked.value = req.is_locked ? '已鎖定' : '未鎖定';
                    statusMsg.textContent = `已載入請購單 [${req.req_no}]`;

                    let rows = '';
                    (res.details || []).forEach(d => {
                        rows += `
                            <tr>
                                <td style="text-align:center; background:#00CED1;">${d.line_no}</td>
                                <td>${d.item_no}</td>
                                <td>${d.item_name}</td>
                                <td>${d.item_spec}</td>
                                <td style="text-align:right;"><input type="text" value="${d.req_qty}" style="text-align:right; width:60px;"></td>
                                <td style="text-align:center;">${d.unit}</td>
                                <td style="text-align:right;">${Math.round(d.est_price || 0).toLocaleString()}</td>
                                <td style="text-align:right;">${d.po_qty || 0}</td>
                                <td style="text-align:center;">${d.require_date}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows || '<tr><td colspan="9" style="text-align:center; padding:20px;">此請購單無明細資料</td></tr>';
                }
            };

            winEl.querySelector('#puri06-tb-query').addEventListener('click', () => {
                Modules.openLookup('requisition', (r) => loadReq(r.req_no));
            });
            winEl.querySelector('#puri06-lookup-req').addEventListener('click', () => {
                Modules.openLookup('requisition', (r) => loadReq(r.req_no));
            });
            winEl.querySelector('#puri06-tb-lock').addEventListener('click', () => {
                if (!fReqNo.value) return;
                const isL = fLocked.value === '已鎖定';
                fLocked.value = isL ? '未鎖定' : '已鎖定';
                alert(`請購單已變更為【${fLocked.value}】！`);
            });
            winEl.querySelector('#puri06-tb-save').addEventListener('click', () => {
                if (!fReqNo.value) return;
                alert('請購資料維護更新成功！');
            });
        });
    },

    // ========================================================
    // 10. 請購資料更新作業 (PURB01)
    // ========================================================
    openPURB01() {
        const u = App.currentUser?.company || '學生區';
        const title = `請購資料更新作業(PURB01)[${u}]`;
        const winId = 'PURB01';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">作業(<u>O</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="執行更新" id="purb01-tb-run" style="color:green;font-weight:bold;">▶ 執行更新</button>
            </div>

            <div class="erp-header-panel" style="padding:16px; margin:8px; border:1px solid #7F9DB9; background:#ECE9D8;">
                <h4 style="margin-bottom:14px; color:#003366; border-bottom:1px solid #A0A0A0; padding-bottom:4px;">【請購資料批次更新條件】</h4>
                <div class="erp-form-row">
                    <div class="erp-field">
                        <label>請購單號起</label>
                        <input type="text" id="purb01-req-start" class="erp-input-cyan" style="width:140px;" value="A311-202611001">
                        <button class="lookup-icon-btn" id="purb01-lookup-start" title="挑選請購單">🔍</button>
                    </div>
                    <div class="erp-field">
                        <label>請購單號迄</label>
                        <input type="text" id="purb01-req-end" class="erp-input-cyan" style="width:140px;" value="A311-202611999">
                    </div>
                </div>
                <div class="erp-form-row">
                    <div class="erp-field">
                        <label>更新項目</label>
                        <select id="purb01-opt" style="width:180px;">
                            <option>1 重新計算請購金額</option>
                            <option>2 結算請購已轉採購量</option>
                            <option>3 請購結案狀態檢查</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="erp-window-statusbar">
                <span class="status-cell" id="purb01-status-msg">請設定批次更新範圍後，點選「執行更新」</span>
                <span class="status-cell">作業: PURB01</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 640, 360, (winEl) => {
            winEl.querySelector('#purb01-lookup-start').addEventListener('click', () => {
                Modules.openLookup('requisition', (r) => {
                    winEl.querySelector('#purb01-req-start').value = r.req_no;
                });
            });

            winEl.querySelector('#purb01-tb-run').addEventListener('click', async () => {
                const s = winEl.querySelector('#purb01-req-start').value.trim();
                const e = winEl.querySelector('#purb01-req-end').value.trim();
                const res = await ERP_API.post('batch_update_req', { req_start: s, req_end: e });
                if (res.success) {
                    alert(`請購資料更新作業完成！\n\n已更新處理 ${res.updated_count || 1} 筆請購資料。`);
                } else {
                    alert('更新失敗: ' + (res.error || '不明錯誤'));
                }
            });
        });
    },

    // ========================================================
    // 11. 採購單建立作業 (PURI07) - 1:1
    // ========================================================
    openPURI07() {
        const u = App.currentUser?.company || '學生區';
        const title = `採購單建立作業(PURI07)[${u}]`;
        const winId = 'PURI07';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">資料(<u>D</u>)</span>
                <span class="erp-menu-item">功能(<u>F</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="新增" id="puri07-tb-new">📄</button>
                <button class="erp-tb-btn" title="查詢" id="puri07-tb-query">🔍</button>
                <button class="erp-tb-btn" title="修改" id="puri07-tb-edit">✏️</button>
                <button class="erp-tb-btn" title="刪除" id="puri07-tb-del">🗑️</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="首筆" id="puri07-tb-first">|◀</button>
                <button class="erp-tb-btn" title="上筆" id="puri07-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下筆" id="puri07-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="puri07-tb-last">▶|</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="儲存" id="puri07-tb-save" style="color:green;font-weight:bold;">💾</button>
                <button class="erp-tb-btn btn-confirm" title="確認" id="puri07-tb-confirm">✔ 確認</button>
                <button class="erp-tb-btn btn-unconfirm" title="取消確認" id="puri07-tb-unconfirm">✖ 取消確認</button>
                <button class="erp-tb-btn btn-transfer" title="產生進貨單 (PURI09)" onclick="Modules.open('PURI09')">📥 轉進貨</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('採購單格式產生中...')">🖨️</button>
            </div>

            <!-- Top Tab Header -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="puri07-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="puri07-tab-browse">資料瀏覽</button>
            </div>

            <!-- Detail View -->
            <div id="puri07-view-detail" style="display:flex; flex-direction:column; flex:1;">
                <div class="erp-header-panel">
                    <div class="erp-stamp-he" style="display:none;">核</div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>採購單別</label>
                            <input type="text" id="puri07-type" class="erp-input-cyan" style="width:70px;" value="A321">
                            <button class="lookup-icon-btn" id="puri07-lookup-type" title="挑選單別">🔍</button>
                            <span class="erp-field-desc" id="puri07-type-desc">國內採購單</span>
                        </div>
                        <div class="erp-field">
                            <label>單據日期</label>
                            <input type="text" id="puri07-doc-date" class="erp-input-yellow" style="width:90px;" value="">
                            <input type="checkbox" id="puri07-chk-date">
                        </div>
                        <div class="erp-field">
                            <label>採購日期</label>
                            <input type="text" id="puri07-po-date" style="width:90px;" value="">
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>採購單號</label>
                            <input type="text" id="puri07-no" class="erp-input-cyan" style="width:130px;" value="">
                        </div>
                        <div class="erp-field">
                            <label>供應商代號</label>
                            <input type="text" id="puri07-sup-no" class="erp-input-yellow" style="width:70px;" value="">
                            <button class="lookup-icon-btn" id="puri07-lookup-sup" title="挑選供應商">🔍</button>
                            <span class="erp-field-desc" id="puri07-sup-name">為升國際貿易</span>
                        </div>
                        <div class="erp-field">
                            <label>採購人員</label>
                            <input type="text" id="puri07-user" style="width:70px;" value="">
                            <button class="lookup-icon-btn" id="puri07-lookup-user" title="挑選人員">🔍</button>
                            <span class="erp-field-desc" id="puri07-user-desc">翁湘琴</span>
                        </div>
                        <div class="erp-field">
                            <label>幣別</label>
                            <input type="text" id="puri07-currency" style="width:60px;" value="NTD">
                        </div>
                        <div class="erp-field">
                            <label>確認者</label>
                            <input type="text" id="puri07-confirm-user" class="erp-input-readonly" style="width:65px;" value="" readonly>
                        </div>
                    </div>
                </div>

                <!-- Subtab Header -->
                <div class="erp-subtab-header">
                    <button class="erp-subtab-btn active">交易資料</button>
                    <button class="erp-subtab-btn">送貨資料</button>
                    <button class="erp-subtab-btn">發票資料</button>
                    <button class="erp-subtab-btn">其他資料</button>
                </div>

                <!-- Dynamic DataGrid -->
                <div class="erp-datagrid-container">
                    <table class="erp-grid-table">
                        <thead>
                            <tr>
                                <th style="width:22px;">📋</th>
                                <th class="th-cyan" style="width:38px;">序號</th>
                                <th style="width:75px;">業務品號</th>
                                <th class="th-yellow" style="width:100px;">品號</th>
                                <th style="width:170px;">品名</th>
                                <th style="width:130px;">規格</th>
                                <th style="width:65px;">採購數量</th>
                                <th style="width:40px;">單位</th>
                                <th style="width:75px;">單價</th>
                                <th style="width:85px;">金額</th>
                                <th style="width:85px;">預交日</th>
                                <th class="th-yellow" style="width:70px;">庫別</th>
                            </tr>
                        </thead>
                        <tbody id="puri07-grid-tbody">
                            <!-- Dynamic 1-row grid -->
                        </tbody>
                    </table>
                </div>

                <!-- Bottom Totals Summary -->
                <div class="erp-totals-panel">
                    <div class="erp-totals-row">
                        <span>採購金額</span>
                        <input type="text" id="puri07-tot-amt" class="erp-totals-inp" value="0" readonly>
                        <span style="margin-left:20px;">採購稅額</span>
                        <input type="text" id="puri07-tot-tax" class="erp-totals-inp" value="0" readonly>
                        <span style="margin-left:20px;">合計</span>
                        <input type="text" id="puri07-tot-grand" class="erp-totals-inp" value="0" readonly>
                    </div>
                    <div class="erp-totals-row">
                        <span>總數量</span>
                        <input type="text" id="puri07-tot-qty" class="erp-totals-inp" value="0" readonly>
                    </div>
                </div>
            </div>

            <!-- Browse View -->
            <div id="puri07-view-browse" style="display:none; flex-direction:column; flex:1; padding:4px;">
                <table class="erp-grid-table">
                    <thead>
                        <tr>
                            <th style="width:25px;"></th>
                            <th class="th-cyan" style="width:130px;">採購單號</th>
                            <th style="width:85px;">採購日期</th>
                            <th style="width:80px;">供應商代號</th>
                            <th style="width:160px;">供應商簡稱</th>
                            <th style="width:90px;">採購金額</th>
                            <th style="width:65px;">狀態</th>
                        </tr>
                    </thead>
                    <tbody id="puri07-browse-tbody">
                        <tr><td colspan="7" style="text-align:center; padding:20px;">載入採購單清單中...</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Statusbar -->
            <div class="erp-window-statusbar">
                <span class="status-cell">瀏覽</span>
                <span class="status-cell" id="puri07-status-msg">單身資料筆數: 0</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 940, 600, (winEl) => {
            const fType = winEl.querySelector('#puri07-type');
            const fTypeDesc = winEl.querySelector('#puri07-type-desc');
            const fDocDate = winEl.querySelector('#puri07-doc-date');
            const fPoDate = winEl.querySelector('#puri07-po-date');
            const fNo = winEl.querySelector('#puri07-no');
            const fSupNo = winEl.querySelector('#puri07-sup-no');
            const fSupName = winEl.querySelector('#puri07-sup-name');
            const fUser = winEl.querySelector('#puri07-user');
            const fUserDesc = winEl.querySelector('#puri07-user-desc');
            const fConfirmUser = winEl.querySelector('#puri07-confirm-user');
            const fTotAmt = winEl.querySelector('#puri07-tot-amt');
            const fTotTax = winEl.querySelector('#puri07-tot-tax');
            const fTotGrand = winEl.querySelector('#puri07-tot-grand');
            const fTotQty = winEl.querySelector('#puri07-tot-qty');
            const statusMsg = winEl.querySelector('#puri07-status-msg');

            const tabDetail = winEl.querySelector('#puri07-tab-detail');
            const tabBrowse = winEl.querySelector('#puri07-tab-browse');
            const viewDetail = winEl.querySelector('#puri07-view-detail');
            const viewBrowse = winEl.querySelector('#puri07-view-browse');

            let currentDocStatus = '未確認';
            let poList = [];

            const switchTab = (mode) => {
                if (mode === 'browse') {
                    tabBrowse.classList.add('active');
                    tabDetail.classList.remove('active');
                    viewBrowse.style.display = 'flex';
                    viewDetail.style.display = 'none';
                    loadBrowseList();
                } else {
                    tabDetail.classList.add('active');
                    tabBrowse.classList.remove('active');
                    viewDetail.style.display = 'flex';
                    viewBrowse.style.display = 'none';
                }
            };

            tabDetail.addEventListener('click', () => switchTab('detail'));
            tabBrowse.addEventListener('click', () => switchTab('browse'));

            const calcTotals = () => {
                let sumAmt = 0;
                let sumQty = 0;
                let rowCount = 0;
                const rows = winEl.querySelectorAll('#puri07-grid-tbody tr[data-row]');
                rows.forEach(r => {
                    const rowIdx = r.getAttribute('data-row');
                    const iNo = winEl.querySelector(`#puri07-item-no-${rowIdx}`)?.value.trim();
                    const q = parseFloat(winEl.querySelector(`#puri07-qty-${rowIdx}`)?.value) || 0;
                    const a = parseFloat((winEl.querySelector(`#puri07-amount-${rowIdx}`)?.value || '').replace(/,/g, '')) || 0;
                    if (iNo) rowCount++;
                    sumQty += q;
                    sumAmt += a;
                });
                const tax = Math.round(sumAmt * 0.05);
                const grand = sumAmt + tax;
                fTotAmt.value = sumAmt.toLocaleString();
                fTotTax.value = tax.toLocaleString();
                fTotGrand.value = grand.toLocaleString();
                fTotQty.value = sumQty.toLocaleString();
                statusMsg.textContent = `單身資料筆數: ${rowCount}`;
            };

            const grid = Modules.initDynamicGrid(winEl, 'puri07', true, calcTotals);

            const fillPO = (header, details = []) => {
                fType.value = header.po_type || 'A321';
                fTypeDesc.textContent = header.po_type === 'A321' ? '國內採購單' : '';
                fDocDate.value = header.po_date || '';
                fPoDate.value = header.po_date || '';
                fNo.value = header.po_no || '';
                fSupNo.value = header.supplier_no || '';
                fSupName.textContent = header.supplier_name || '';
                fUser.value = header.purchaser || '';
                fConfirmUser.value = header.confirm_user || '';
                currentDocStatus = header.status || '未確認';
                Modules.setDocStamp(winEl, currentDocStatus);
                grid.fillGrid(details);
            };

            const clearPO = () => {
                fType.value = 'A321';
                fTypeDesc.textContent = '國內採購單';
                const today = Modules.getTodayStr();
                fDocDate.value = today;
                fPoDate.value = today;
                fNo.value = 'A321-' + today.replace(/\//g, '') + String(Math.floor(Math.random() * 899 + 100)).padStart(3, '0');
                fSupNo.value = '';
                fSupName.textContent = '';
                fUser.value = App.currentUser?.username || 'B18';
                fConfirmUser.value = '';
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '未確認');
                grid.clearGrid();
                fSupNo.focus();
            };

            const loadBrowseList = async () => {
                const tbody = winEl.querySelector('#puri07-browse-tbody');
                const res = await ERP_API.get('get_purchase_orders');
                if (res.success) {
                    poList = res.data || [];
                    if (poList.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px; color:#888;">目前尚無採購單據</td></tr>';
                        return;
                    }
                    let rows = '';
                    poList.forEach(p => {
                        rows += `
                            <tr data-no="${p.po_no}" style="cursor:pointer;">
                                <td style="text-align:center;">▶</td>
                                <td style="font-weight:bold; color:#003366;">${p.po_no}</td>
                                <td>${p.po_date || ''}</td>
                                <td>${p.supplier_no || ''}</td>
                                <td>${p.supplier_name || ''}</td>
                                <td style="text-align:right;">${Math.round(p.total_amount || 0).toLocaleString()}</td>
                                <td style="text-align:center; font-weight:bold; color:${p.status === '已確認' ? 'green' : '#999'};">${p.status || '未確認'}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows;

                    tbody.querySelectorAll('tr[data-no]').forEach(tr => {
                        tr.addEventListener('click', async () => {
                            const no = tr.getAttribute('data-no');
                            const detailRes = await ERP_API.get('get_purchase_order', { po_no: no });
                            if (detailRes.success && detailRes.purchase_order) {
                                fillPO(detailRes.purchase_order, detailRes.details || []);
                                switchTab('detail');
                            }
                        });
                    });
                }
            };

            // Lookups
            winEl.querySelector('#puri07-lookup-type').addEventListener('click', () => {
                Modules.openLookup('doc_type_po', (t) => { fType.value = t.code; fTypeDesc.textContent = t.name; });
            });
            winEl.querySelector('#puri07-lookup-sup').addEventListener('click', () => {
                Modules.openLookup('supplier', (s) => {
                    fSupNo.value = s.supplier_no || '';
                    fSupName.textContent = s.name_short || s.full_name || '';
                });
            });
            winEl.querySelector('#puri07-lookup-user').addEventListener('click', () => {
                Modules.openLookup('salesperson', (s) => { fUser.value = s.code; fUserDesc.textContent = s.name; });
            });

            // Toolbar
            winEl.querySelector('#puri07-tb-new').addEventListener('click', clearPO);
            winEl.querySelector('#puri07-tb-query').addEventListener('click', () => {
                Modules.openLookup('purchase_order', async (p) => {
                    const res = await ERP_API.get('get_purchase_order', { po_no: p.po_no });
                    if (res.success && res.purchase_order) {
                        fillPO(res.purchase_order, res.details || []);
                    }
                });
            });

            winEl.querySelector('#puri07-tb-save').addEventListener('click', async () => {
                const poNo = fNo.value.trim();
                const supNo = fSupNo.value.trim();
                if (!poNo || !supNo) {
                    alert('【必填檢查】請輸入採購單號及挑選供應商代號！');
                    return;
                }
                const details = grid.getRowsData();
                if (details.length === 0) {
                    alert('【明細檢查】請至少在表格中挑選品號並輸入採購數量！');
                    return;
                }

                const payload = {
                    header: {
                        po_no: poNo,
                        po_type: fType.value.trim() || 'A321',
                        po_date: fDocDate.value.trim() || Modules.getTodayStr(),
                        supplier_no: supNo,
                        supplier_name: fSupName.textContent.trim(),
                        purchaser: fUser.value.trim() || 'B18',
                        status: currentDocStatus
                    },
                    details
                };

                const res = await ERP_API.post('save_purchase_order', payload);
                if (res.success) {
                    alert(`採購單 [${poNo}] 儲存成功！`);
                } else {
                    alert('儲存失敗: ' + (res.error || '不明錯誤'));
                }
            });

            winEl.querySelector('#puri07-tb-confirm').addEventListener('click', async () => {
                const poNo = fNo.value.trim();
                if (!poNo) return;
                if (confirm(`確定要確認採購單 [${poNo}] 嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'purchase_order', doc_no: poNo, status: '已確認' });
                    if (res.success) {
                        currentDocStatus = '已確認';
                        fConfirmUser.value = App.currentUser?.username || 'B18';
                        Modules.setDocStamp(winEl, '已確認');
                        alert('採購單確認完成！');
                    }
                }
            });

            winEl.querySelector('#puri07-tb-unconfirm').addEventListener('click', async () => {
                const poNo = fNo.value.trim();
                if (!poNo) return;
                if (confirm(`確定要取消採購單 [${poNo}] 的確認狀態嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'purchase_order', doc_no: poNo, status: '未確認' });
                    if (res.success) {
                        currentDocStatus = '未確認';
                        fConfirmUser.value = '';
                        Modules.setDocStamp(winEl, '未確認');
                        alert('採購單已取消確認！');
                    }
                }
            });

            winEl.querySelector('#puri07-tb-del').addEventListener('click', async () => {
                const poNo = fNo.value.trim();
                if (!poNo) return;
                if (confirm(`確定要刪除採購單 [${poNo}] 嗎？`)) {
                    const res = await ERP_API.post('delete_purchase_order', { po_no: poNo });
                    if (res.success) {
                        alert('採購單已成功刪除！');
                        clearPO();
                    } else {
                        alert('刪除失敗: ' + (res.error || '不明錯誤'));
                    }
                }
            });
        });
    },

    // ========================================================
    // 12. 進貨單建立作業 (PURI09) - 1:1
    // ========================================================
    openPURI09() {
        const u = App.currentUser?.company || '學生區';
        const title = `進貨單建立作業(PURI09)[${u}]`;
        const winId = 'PURI09';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">資料(<u>D</u>)</span>
                <span class="erp-menu-item">功能(<u>F</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="新增" id="puri09-tb-new">📄</button>
                <button class="erp-tb-btn" title="查詢" id="puri09-tb-query">🔍</button>
                <button class="erp-tb-btn" title="修改" id="puri09-tb-edit">✏️</button>
                <button class="erp-tb-btn" title="刪除" id="puri09-tb-del">🗑️</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="首筆" id="puri09-tb-first">|◀</button>
                <button class="erp-tb-btn" title="上筆" id="puri09-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下筆" id="puri09-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="puri09-tb-last">▶|</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="儲存" id="puri09-tb-save" style="color:green;font-weight:bold;">💾</button>
                <button class="erp-tb-btn btn-confirm" title="確認" id="puri09-tb-confirm">✔ 確認</button>
                <button class="erp-tb-btn btn-unconfirm" title="取消確認" id="puri09-tb-unconfirm">✖ 取消確認</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('進貨檢驗單列印中...')">🖨️</button>
            </div>

            <!-- Top Tab Header -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="puri09-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="puri09-tab-browse">資料瀏覽</button>
            </div>

            <!-- Detail View -->
            <div id="puri09-view-detail" style="display:flex; flex-direction:column; flex:1;">
                <div class="erp-header-panel">
                    <div class="erp-stamp-he" style="display:none;">核</div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>進貨單別</label>
                            <input type="text" id="puri09-type" class="erp-input-cyan" style="width:70px;" value="A331">
                            <button class="lookup-icon-btn" id="puri09-lookup-type" title="挑選單別">🔍</button>
                            <span class="erp-field-desc" id="puri09-type-desc">進貨單</span>
                        </div>
                        <div class="erp-field">
                            <label>單據日期</label>
                            <input type="text" id="puri09-doc-date" class="erp-input-yellow" style="width:90px;" value="">
                            <input type="checkbox" id="puri09-chk-date">
                        </div>
                        <div class="erp-field">
                            <label>進貨日期</label>
                            <input type="text" id="puri09-rcv-date" style="width:90px;" value="">
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>進貨單號</label>
                            <input type="text" id="puri09-no" class="erp-input-cyan" style="width:130px;" value="">
                        </div>
                        <div class="erp-field">
                            <label>供應商代號</label>
                            <input type="text" id="puri09-sup-no" class="erp-input-yellow" style="width:70px;" value="">
                            <button class="lookup-icon-btn" id="puri09-lookup-sup" title="挑選供應商">🔍</button>
                            <span class="erp-field-desc" id="puri09-sup-name">為升國際貿易</span>
                        </div>
                        <div class="erp-field">
                            <label>來源採購單</label>
                            <input type="text" id="puri09-po-no" style="width:130px;" value="">
                            <button class="lookup-icon-btn" id="puri09-lookup-po" title="挑選採購單">🔍</button>
                        </div>
                        <div class="erp-field">
                            <label>驗收入庫人</label>
                            <input type="text" id="puri09-confirm-user" class="erp-input-readonly" style="width:65px;" value="" readonly>
                        </div>
                    </div>
                </div>

                <!-- Subtab Header -->
                <div class="erp-subtab-header">
                    <button class="erp-subtab-btn active">交易資料</button>
                    <button class="erp-subtab-btn">送貨資料</button>
                    <button class="erp-subtab-btn">發票資料</button>
                    <button class="erp-subtab-btn">其他資料</button>
                </div>

                <!-- Dynamic DataGrid -->
                <div class="erp-datagrid-container">
                    <table class="erp-grid-table">
                        <thead>
                            <tr>
                                <th style="width:22px;">📋</th>
                                <th class="th-cyan" style="width:38px;">序號</th>
                                <th style="width:75px;">業務品號</th>
                                <th class="th-yellow" style="width:100px;">品號</th>
                                <th style="width:170px;">品名</th>
                                <th style="width:130px;">規格</th>
                                <th style="width:65px;">實收數量</th>
                                <th style="width:40px;">單位</th>
                                <th style="width:75px;">進貨單價</th>
                                <th style="width:85px;">進貨金額</th>
                                <th style="width:85px;">驗收日</th>
                                <th class="th-yellow" style="width:70px;">入庫庫別</th>
                            </tr>
                        </thead>
                        <tbody id="puri09-grid-tbody">
                            <!-- Dynamic 1-row grid -->
                        </tbody>
                    </table>
                </div>

                <!-- Totals Panel -->
                <div class="erp-totals-panel">
                    <div class="erp-totals-row">
                        <span>進貨金額</span>
                        <input type="text" id="puri09-tot-amt" class="erp-totals-inp" value="0" readonly>
                        <span style="margin-left:20px;">進貨稅額</span>
                        <input type="text" id="puri09-tot-tax" class="erp-totals-inp" value="0" readonly>
                        <span style="margin-left:20px;">合計</span>
                        <input type="text" id="puri09-tot-grand" class="erp-totals-inp" value="0" readonly>
                    </div>
                    <div class="erp-totals-row">
                        <span>總進貨數量</span>
                        <input type="text" id="puri09-tot-qty" class="erp-totals-inp" value="0" readonly>
                    </div>
                </div>
            </div>

            <!-- Browse View -->
            <div id="puri09-view-browse" style="display:none; flex-direction:column; flex:1; padding:4px;">
                <table class="erp-grid-table">
                    <thead>
                        <tr>
                            <th style="width:25px;"></th>
                            <th class="th-cyan" style="width:130px;">進貨單號</th>
                            <th style="width:85px;">進貨日期</th>
                            <th style="width:80px;">供應商代號</th>
                            <th style="width:160px;">供應商簡稱</th>
                            <th style="width:130px;">來源採購單</th>
                            <th style="width:90px;">進貨金額</th>
                            <th style="width:65px;">狀態</th>
                        </tr>
                    </thead>
                    <tbody id="puri09-browse-tbody">
                        <tr><td colspan="8" style="text-align:center; padding:20px;">載入進貨單清單中...</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Statusbar -->
            <div class="erp-window-statusbar">
                <span class="status-cell">瀏覽</span>
                <span class="status-cell" id="puri09-status-msg">單身資料筆數: 0</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 940, 600, (winEl) => {
            const fType = winEl.querySelector('#puri09-type');
            const fTypeDesc = winEl.querySelector('#puri09-type-desc');
            const fDocDate = winEl.querySelector('#puri09-doc-date');
            const fRcvDate = winEl.querySelector('#puri09-rcv-date');
            const fNo = winEl.querySelector('#puri09-no');
            const fSupNo = winEl.querySelector('#puri09-sup-no');
            const fSupName = winEl.querySelector('#puri09-sup-name');
            const fPoNo = winEl.querySelector('#puri09-po-no');
            const fConfirmUser = winEl.querySelector('#puri09-confirm-user');
            const fTotAmt = winEl.querySelector('#puri09-tot-amt');
            const fTotTax = winEl.querySelector('#puri09-tot-tax');
            const fTotGrand = winEl.querySelector('#puri09-tot-grand');
            const fTotQty = winEl.querySelector('#puri09-tot-qty');
            const statusMsg = winEl.querySelector('#puri09-status-msg');

            const tabDetail = winEl.querySelector('#puri09-tab-detail');
            const tabBrowse = winEl.querySelector('#puri09-tab-browse');
            const viewDetail = winEl.querySelector('#puri09-view-detail');
            const viewBrowse = winEl.querySelector('#puri09-view-browse');

            let currentDocStatus = '未確認';
            let receiptList = [];

            const switchTab = (mode) => {
                if (mode === 'browse') {
                    tabBrowse.classList.add('active');
                    tabDetail.classList.remove('active');
                    viewBrowse.style.display = 'flex';
                    viewDetail.style.display = 'none';
                    loadBrowseList();
                } else {
                    tabDetail.classList.add('active');
                    tabBrowse.classList.remove('active');
                    viewDetail.style.display = 'flex';
                    viewBrowse.style.display = 'none';
                }
            };

            tabDetail.addEventListener('click', () => switchTab('detail'));
            tabBrowse.addEventListener('click', () => switchTab('browse'));

            const calcTotals = () => {
                let sumAmt = 0;
                let sumQty = 0;
                let rowCount = 0;
                const rows = winEl.querySelectorAll('#puri09-grid-tbody tr[data-row]');
                rows.forEach(r => {
                    const rowIdx = r.getAttribute('data-row');
                    const iNo = winEl.querySelector(`#puri09-item-no-${rowIdx}`)?.value.trim();
                    const q = parseFloat(winEl.querySelector(`#puri09-qty-${rowIdx}`)?.value) || 0;
                    const a = parseFloat((winEl.querySelector(`#puri09-amount-${rowIdx}`)?.value || '').replace(/,/g, '')) || 0;
                    if (iNo) rowCount++;
                    sumQty += q;
                    sumAmt += a;
                });
                const tax = Math.round(sumAmt * 0.05);
                const grand = sumAmt + tax;
                fTotAmt.value = sumAmt.toLocaleString();
                fTotTax.value = tax.toLocaleString();
                fTotGrand.value = grand.toLocaleString();
                fTotQty.value = sumQty.toLocaleString();
                statusMsg.textContent = `單身資料筆數: ${rowCount}`;
            };

            const grid = Modules.initDynamicGrid(winEl, 'puri09', true, calcTotals);

            const fillReceipt = (header, details = []) => {
                fType.value = header.receipt_type || 'A331';
                fTypeDesc.textContent = header.receipt_type === 'A331' ? '進貨單' : '';
                fDocDate.value = header.receipt_date || '';
                fRcvDate.value = header.receipt_date || '';
                fNo.value = header.receipt_no || '';
                fSupNo.value = header.supplier_no || '';
                fSupName.textContent = header.supplier_name || '';
                fPoNo.value = header.po_no || '';
                fConfirmUser.value = header.confirm_user || '';
                currentDocStatus = header.status || '未確認';
                Modules.setDocStamp(winEl, currentDocStatus);
                grid.fillGrid(details);
            };

            const clearReceipt = () => {
                fType.value = 'A331';
                fTypeDesc.textContent = '進貨單';
                const today = Modules.getTodayStr();
                fDocDate.value = today;
                fRcvDate.value = today;
                fNo.value = 'A331-' + today.replace(/\//g, '') + String(Math.floor(Math.random() * 899 + 100)).padStart(3, '0');
                fSupNo.value = '';
                fSupName.textContent = '';
                fPoNo.value = '';
                fConfirmUser.value = '';
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '未確認');
                grid.clearGrid();
                fSupNo.focus();
            };

            const loadBrowseList = async () => {
                const tbody = winEl.querySelector('#puri09-browse-tbody');
                const res = await ERP_API.get('get_goods_receipts');
                if (res.success) {
                    receiptList = res.data || [];
                    if (receiptList.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px; color:#888;">目前尚無進貨單據</td></tr>';
                        return;
                    }
                    let rows = '';
                    receiptList.forEach(r => {
                        rows += `
                            <tr data-no="${r.receipt_no}" style="cursor:pointer;">
                                <td style="text-align:center;">▶</td>
                                <td style="font-weight:bold; color:#003366;">${r.receipt_no}</td>
                                <td>${r.receipt_date || ''}</td>
                                <td>${r.supplier_no || ''}</td>
                                <td>${r.supplier_name || ''}</td>
                                <td>${r.po_no || ''}</td>
                                <td style="text-align:right;">${Math.round(r.total_amount || 0).toLocaleString()}</td>
                                <td style="text-align:center; font-weight:bold; color:${r.status === '已確認' ? 'green' : '#999'};">${r.status || '未確認'}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows;

                    tbody.querySelectorAll('tr[data-no]').forEach(tr => {
                        tr.addEventListener('click', async () => {
                            const no = tr.getAttribute('data-no');
                            const detailRes = await ERP_API.get('get_goods_receipt', { receipt_no: no });
                            if (detailRes.success && detailRes.receipt) {
                                fillReceipt(detailRes.receipt, detailRes.details || []);
                                switchTab('detail');
                            }
                        });
                    });
                }
            };

            // Lookups
            winEl.querySelector('#puri09-lookup-type').addEventListener('click', () => {
                Modules.openLookup('doc_type_gr', (t) => { fType.value = t.code; fTypeDesc.textContent = t.name; });
            });
            winEl.querySelector('#puri09-lookup-sup').addEventListener('click', () => {
                Modules.openLookup('supplier', (s) => {
                    fSupNo.value = s.supplier_no || '';
                    fSupName.textContent = s.name_short || s.full_name || '';
                });
            });
            winEl.querySelector('#puri09-lookup-po').addEventListener('click', () => {
                Modules.openLookup('purchase_order', async (po) => {
                    fPoNo.value = po.po_no;
                    fSupNo.value = po.supplier_no || '';
                    fSupName.textContent = po.supplier_name || '';
                    const res = await ERP_API.get('get_purchase_order', { po_no: po.po_no });
                    if (res.success && res.details) {
                        grid.fillGrid(res.details);
                    }
                });
            });

            // Toolbar
            winEl.querySelector('#puri09-tb-new').addEventListener('click', clearReceipt);
            winEl.querySelector('#puri09-tb-query').addEventListener('click', () => {
                Modules.openLookup('goods_receipt', async (g) => {
                    const res = await ERP_API.get('get_goods_receipt', { receipt_no: g.receipt_no });
                    if (res.success && res.receipt) {
                        fillReceipt(res.receipt, res.details || []);
                    }
                });
            });

            winEl.querySelector('#puri09-tb-save').addEventListener('click', async () => {
                const rNo = fNo.value.trim();
                const sNo = fSupNo.value.trim();
                if (!rNo || !sNo) {
                    alert('【必填檢查】請輸入進貨單號及挑選供應商代號！');
                    return;
                }
                const details = grid.getRowsData();
                if (details.length === 0) {
                    alert('【明細檢查】請至少在表格中輸入進貨品號及實收數量！');
                    return;
                }

                const payload = {
                    header: {
                        receipt_no: rNo,
                        receipt_type: fType.value.trim() || 'A331',
                        receipt_date: fDocDate.value.trim() || Modules.getTodayStr(),
                        supplier_no: sNo,
                        supplier_name: fSupName.textContent.trim(),
                        po_no: fPoNo.value.trim(),
                        status: currentDocStatus
                    },
                    details
                };

                const res = await ERP_API.post('save_goods_receipt', payload);
                if (res.success) {
                    alert(`進貨驗收入庫單 [${rNo}] 儲存成功！庫存已同步入庫更新。`);
                } else {
                    alert('儲存失敗: ' + (res.error || '不明錯誤'));
                }
            });

            winEl.querySelector('#puri09-tb-confirm').addEventListener('click', async () => {
                const rNo = fNo.value.trim();
                if (!rNo) return;
                if (confirm(`確定要確認進貨單 [${rNo}] 嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'goods_receipt', doc_no: rNo, status: '已確認' });
                    if (res.success) {
                        currentDocStatus = '已確認';
                        fConfirmUser.value = App.currentUser?.username || 'B18';
                        Modules.setDocStamp(winEl, '已確認');
                        alert('進貨單確認完成！');
                    }
                }
            });

            winEl.querySelector('#puri09-tb-unconfirm').addEventListener('click', async () => {
                const rNo = fNo.value.trim();
                if (!rNo) return;
                if (confirm(`確定要取消進貨單 [${rNo}] 的確認狀態嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'goods_receipt', doc_no: rNo, status: '未確認' });
                    if (res.success) {
                        currentDocStatus = '未確認';
                        fConfirmUser.value = '';
                        Modules.setDocStamp(winEl, '未確認');
                        alert('進貨單已取消確認！');
                    }
                }
            });

            winEl.querySelector('#puri09-tb-del').addEventListener('click', async () => {
                const rNo = fNo.value.trim();
                if (!rNo) return;
                if (confirm(`確定要刪除進貨單 [${rNo}] 嗎？`)) {
                    const res = await ERP_API.post('delete_goods_receipt', { receipt_no: rNo });
                    if (res.success) {
                        alert('進貨單已刪除！');
                        clearReceipt();
                    } else {
                        alert('刪除失敗: ' + (res.error || '不明錯誤'));
                    }
                }
            });
        });
    },

    // ========================================================
    // 13. 訂單樹狀資訊查詢 (COPQ05)
    // ========================================================
    openCOPQ05(defaultOrderNo = '') {
        const u = App.currentUser?.company || '學生區';
        const title = `訂單樹狀資訊查詢(COPQ05)[${u}]`;
        const winId = 'COPQ05';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">查詢(<u>Q</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <div style="display:flex; align-items:center; gap:6px;">
                    <label style="font-weight:bold; color:#003366;">訂單單號:</label>
                    <input type="text" id="copq05-order-no" class="erp-input-cyan" style="width:160px;" value="${defaultOrderNo}">
                    <button class="lookup-icon-btn" id="copq05-lookup-order" title="挑選訂單">🔍</button>
                    <button class="erp-tb-btn" id="copq05-btn-query" style="width:auto; padding:0 12px; font-weight:bold; color:#003366;">🔍 展開樹狀查詢</button>
                </div>
            </div>

            <div style="flex:1; display:flex; padding:4px; gap:4px; overflow:hidden;">
                <div class="order-tree-left" style="width:360px; border:1px solid #7F9DB9; background:#FFFFFF; overflow-y:auto;">
                    <div style="padding:6px; background:#2B5F8F; color:#FFFFFF; font-weight:bold;">
                        🌲 配銷單據樹狀關聯結構
                    </div>
                    <div id="copq05-tree-container" style="padding:8px;">
                        <p style="color:#888; text-align:center; padding:40px 10px;">請輸入或挑選訂單單號，點擊「展開樹狀查詢」</p>
                    </div>
                </div>

                <div class="order-tree-right" id="copq05-detail-container" style="flex:1; border:1px solid #7F9DB9; background:#FFFFFF; padding:12px; overflow-y:auto;">
                    <div style="color:#888; text-align:center; padding:60px 10px;">
                        點選左側樹狀節點，即時檢視該單據之詳細欄位與拋轉進度。
                    </div>
                </div>
            </div>

            <div class="erp-window-statusbar">
                <span class="status-cell" id="copq05-status-msg">就緒</span>
                <span class="status-cell">作業: COPQ05</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 940, 600, (winEl) => {
            const fOrderNo = winEl.querySelector('#copq05-order-no');
            const treeBox = winEl.querySelector('#copq05-tree-container');
            const detailBox = winEl.querySelector('#copq05-detail-container');
            const statusMsg = winEl.querySelector('#copq05-status-msg');

            winEl.querySelector('#copq05-lookup-order').addEventListener('click', () => {
                Modules.openLookup('order', (o) => {
                    fOrderNo.value = o.order_no;
                    runQuery();
                });
            });

            const runQuery = async () => {
                const orderNo = fOrderNo.value.trim();
                if (!orderNo) {
                    alert('請輸入或挑選訂單單號！');
                    fOrderNo.focus();
                    return;
                }
                statusMsg.textContent = `正在檢索訂單 [${orderNo}] 之配銷歷程樹狀關聯...`;
                const res = await ERP_API.get('order_tree_query', { order_no: orderNo });
                if (res.success) {
                    renderTree(res.data);
                    statusMsg.textContent = `查詢完成，訂單 [${orderNo}] 關聯單據結構如下`;
                } else {
                    alert('查詢失敗: ' + (res.error || '不明錯誤'));
                }
            };

            winEl.querySelector('#copq05-btn-query').addEventListener('click', runQuery);

            const renderTree = (data) => {
                const { order, requisitions, purchase_orders, receipts, deliveries } = data;
                let html = `
                    <div class="order-tree-node">
                        <div class="order-tree-row selected" data-type="order" style="padding:4px; cursor:pointer; background:#EBF6EF; font-weight:bold;">
                            <span>📂</span> <b>客戶訂單: ${order.order_no}</b> [${order.status || '未確認'}]
                        </div>
                        <div style="margin-left:22px; margin-top:4px;">
                `;

                if (requisitions && requisitions.length > 0) {
                    requisitions.forEach(r => {
                        html += `
                            <div class="order-tree-row" data-type="req" data-no="${r.req_no}" style="padding:3px; cursor:pointer;">
                                <span>📄</span> 物料請購單: ${r.req_no} [${r.status}]
                            </div>
                        `;
                    });
                } else {
                    html += `<div style="color:#888; font-size:11px; margin-left:16px;">(尚無關聯之請購單)</div>`;
                }

                if (purchase_orders && purchase_orders.length > 0) {
                    purchase_orders.forEach(p => {
                        html += `
                            <div class="order-tree-row" data-type="po" data-no="${p.po_no}" style="padding:3px; cursor:pointer;">
                                <span>🛒</span> 採購單: ${p.po_no} [${p.status}] (${p.supplier_name || p.supplier_no})
                            </div>
                        `;
                    });
                } else {
                    html += `<div style="color:#888; font-size:11px; margin-left:16px;">(尚無關聯之採購單)</div>`;
                }

                if (receipts && receipts.length > 0) {
                    receipts.forEach(g => {
                        html += `
                            <div class="order-tree-row" data-type="gr" data-no="${g.receipt_no}" style="padding:3px; cursor:pointer;">
                                <span>📥</span> 進貨入庫單: ${g.receipt_no} [${g.status}]
                            </div>
                        `;
                    });
                } else {
                    html += `<div style="color:#888; font-size:11px; margin-left:16px;">(尚無關聯之進貨單)</div>`;
                }

                if (deliveries && deliveries.length > 0) {
                    deliveries.forEach(d => {
                        html += `
                            <div class="order-tree-row" data-type="delivery" data-no="${d.delivery_no}" style="padding:3px; cursor:pointer;">
                                <span>🚚</span> 銷貨出庫單: ${d.delivery_no} [${d.status}]
                            </div>
                        `;
                    });
                } else {
                    html += `<div style="color:#888; font-size:11px; margin-left:16px;">(尚無關聯之銷貨單)</div>`;
                }

                html += `</div></div>`;
                treeBox.innerHTML = html;

                showOrderDetails(order, data.details || []);

                treeBox.querySelectorAll('.order-tree-row').forEach(row => {
                    row.addEventListener('click', (e) => {
                        treeBox.querySelectorAll('.order-tree-row').forEach(r => {
                            r.classList.remove('selected');
                            r.style.background = 'transparent';
                        });
                        const target = e.currentTarget;
                        target.classList.add('selected');
                        target.style.background = '#EBF6EF';

                        const type = target.getAttribute('data-type');
                        const no = target.getAttribute('data-no');
                        if (type === 'order') {
                            showOrderDetails(order, data.details || []);
                        } else {
                            detailBox.innerHTML = `
                                <div style="border-bottom:2px solid #2B5F8F; padding-bottom:8px; margin-bottom:12px;">
                                    <h3 style="color:#003366;">單據類別: ${type.toUpperCase()} - 單號: ${no}</h3>
                                    <p style="margin-top:8px;">該單據與目前訂單關聯正常，已建立在資料庫中。</p>
                                </div>
                            `;
                        }
                    });
                });
            };

            const showOrderDetails = (order, details) => {
                let html = `
                    <div style="border-bottom:2px solid #2B5F8F; padding-bottom:10px; margin-bottom:12px;">
                        <h3 style="color:#003366;">客戶訂單資料: ${order.order_no}</h3>
                        <p style="margin:4px 0;">客戶: [${order.customer_no}] <b>${order.customer_name}</b> | 訂單日期: ${order.order_date} | 狀態: <b style="color:${order.status === '已確認' ? 'green' : '#C00000'};">${order.status}</b></p>
                        <p style="margin:4px 0;">總金額: <b>NTD ${parseInt(order.grand_total || 0).toLocaleString()}</b> | 總數量: <b>${order.total_qty || 0}</b> | 業務員: ${order.sales_person}</p>
                    </div>
                    <h4 style="margin-bottom:8px; color:#2B5F8F;">訂單明細清單:</h4>
                    <table class="erp-grid-table">
                        <thead>
                            <tr>
                                <th style="width:38px;">序號</th>
                                <th style="width:100px;">品號</th>
                                <th>品名</th>
                                <th style="width:70px;">數量</th>
                                <th style="width:80px;">單價</th>
                                <th style="width:90px;">金額</th>
                                <th style="width:70px;">庫別</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                details.forEach(d => {
                    html += `
                        <tr>
                            <td style="text-align:center; background:#00CED1;">${d.line_no}</td>
                            <td style="font-weight:bold;">${d.item_no}</td>
                            <td>${d.item_name}</td>
                            <td style="text-align:right;">${d.order_qty}</td>
                            <td style="text-align:right;">${parseInt(d.unit_price || 0).toLocaleString()}</td>
                            <td style="text-align:right;">${parseInt(d.amount || 0).toLocaleString()}</td>
                            <td style="text-align:center;">${d.warehouse}</td>
                        </tr>
                    `;
                });
                html += `</tbody></table>`;
                detailBox.innerHTML = html;
            };

            if (defaultOrderNo) runQuery();
        });
    },

    // ========================================================
    // 14. 佇列工作控制台 (QUEUE_CONSOLE)
    // ========================================================
    openQueueConsole() {
        const u = App.currentUser?.company || '學生區';
        const title = `佇列工作控制台[${u}]`;
        const winId = 'QUEUE_CONSOLE';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">控制(<u>C</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="重新整理" id="queue-tb-refresh">🔄 重新整理</button>
                <button class="erp-tb-btn" title="終止工作" onclick="alert('已選取工作已終止')">⏹️ 終止工作</button>
            </div>

            <div class="erp-datagrid-container" style="flex:1;">
                <table class="erp-grid-table">
                    <thead>
                        <tr>
                            <th style="width:120px;">工作編號</th>
                            <th style="width:150px;">工作名稱</th>
                            <th style="width:80px;">狀態</th>
                            <th style="width:140px;">提交時間</th>
                            <th style="width:90px;">執行人員</th>
                            <th style="width:140px;">關聯單號</th>
                            <th>執行結果紀錄</th>
                        </tr>
                    </thead>
                    <tbody id="queue-tbody">
                        <tr><td colspan="7" style="text-align:center; padding:20px; color:#888;">佇列工作資料載入中...</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="erp-window-statusbar">
                <span class="status-cell" id="queue-status-msg">後台佇列服務連線正常</span>
                <span class="status-cell">作業: QUEUE_CONSOLE</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 940, 520, (winEl) => {
            const tbody = winEl.querySelector('#queue-tbody');

            const loadJobs = async () => {
                const res = await ERP_API.get('get_batch_jobs');
                if (res.success) {
                    const jobs = res.data || [];
                    if (jobs.length === 0) {
                        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#888;">目前無等待或執行中之背景佇列工作</td></tr>`;
                        return;
                    }
                    let rows = '';
                    jobs.forEach(j => {
                        const statusColor = j.status === '已完成' ? 'green' : (j.status === '失敗' ? 'red' : 'orange');
                        rows += `
                            <tr>
                                <td style="text-align:center; font-weight:bold;">${j.job_no}</td>
                                <td>${j.job_name}</td>
                                <td style="text-align:center; color:${statusColor}; font-weight:bold;">${j.status}</td>
                                <td style="text-align:center;">${j.created_at}</td>
                                <td style="text-align:center;">${j.username}</td>
                                <td style="text-align:center;">${j.doc_no || '-'}</td>
                                <td>${j.message || '-'}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows;
                }
            };

            winEl.querySelector('#queue-tb-refresh').addEventListener('click', loadJobs);
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
                <button class="erp-tb-btn" title="新增帳號" id="sec-tb-new">➕ 新增帳號</button>
                <button class="erp-tb-btn" title="重新整理" id="sec-tb-refresh">🔄 重新整理</button>
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
                    <button class="erp-lookup-btn primary" id="sec-btn-save" style="width:100%; margin-bottom:6px;">💾 儲存帳號設定</button>
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
        const title = `ERP 配銷模組操作指引精靈`;
        const winId = 'PRACTICE_GUIDE';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div style="flex:1; padding:18px; background:#FFFFFF; overflow-y:auto; line-height:1.7;">
                <h2 style="color:#003366; border-bottom:2px solid #2B5F8F; padding-bottom:8px; margin-bottom:14px;">
                    🎯 ERP 配銷模組 1:1 標準流程演練精靈
                </h2>
                <div style="margin-bottom:16px; background:#FFFDE6; border:1px solid #E6D28C; padding:12px; border-radius:4px;">
                    <b>💡 學習指引提示：</b><br>
                    本系統已完全 1:1 還原 ERP 配銷模組標準作業。單身表格<b>預設只有 1 列</b>，輸入資料後按 <b>Tab 鍵</b> 跳至最後一格將自動產生下一列；若點回上一列且新增列為空白，空白列會<b>自動消失</b>！單據審核操作統一為<b>「✔ 確認」</b>與<b>「✖ 取消確認」</b>。
                </div>

                <h3 style="color:#2B5F8F; margin:16px 0 8px 0;">【核心作業操作步驟】</h3>
                <ol style="margin-left:24px;">
                    <li style="margin-bottom:10px;">
                        <b>步驟一：建立報價單 (COPI05) 與 客戶確認</b><br>
                        開啟「報價單建立作業」，點選「新增」生成單號，點選客戶 🔍 開窗挑選客戶 (如 1107 大進文化)，在第 1 列點選品號 🔍 挑選品號 (如 410001) 並輸入數量與單價。按 <b>Tab 鍵</b>可自動新增下一列。<br>
                        點選<b>「客戶確認」</b>按鈕可切換客戶確認狀態 (按一下確認，再按一下取消確認)。<br>
                        完成後點選<b>「💾 儲存」</b>，再點選工具列<b>「✔ 確認」</b>加蓋紅色核准章！
                    </li>
                    <li style="margin-bottom:10px;">
                        <b>步驟二：建立客戶訂單 (COPI06)</b><br>
                        開啟「客戶訂單建立作業」，點選「新增」取號，填寫明細並點選「💾 儲存」及「✔ 確認」。
                    </li>
                    <li style="margin-bottom:10px;">
                        <b>步驟三：訂單轉請購單 (COPB10)</b><br>
                        點選工具列的「📋 轉請購」，系統會自動帶入訂單單號，點擊「▶ 執行」產生請購單 (A311)。
                    </li>
                    <li style="margin-bottom:10px;">
                        <b>步驟四：確認請購單 (PURI05)</b><br>
                        開啟「請購單建立作業」，點選「查詢」載入剛產生的請購單，點選「✔ 確認」加蓋紅色核准章。
                    </li>
                    <li style="margin-bottom:10px;">
                        <b>步驟五：建立採購單 (PURI07)</b><br>
                        開啟「採購單建立作業」，點選「新增」，挑選供應商 (如 4005 為升國際貿易、V001 影石創新)，加入品號並「💾 儲存」及「✔ 確認」。
                    </li>
                    <li style="margin-bottom:10px;">
                        <b>步驟六：進貨入庫 (PURI09) 與 銷貨出庫 (COPI08)</b><br>
                        採購到貨後開啟「進貨單建立作業」驗收入庫並「✔ 確認」；訂單備貨完畢後開啟「銷貨單建立作業」產生銷貨單並「✔ 確認」出庫！
                    </li>
                    <li style="margin-bottom:10px;">
                        <b>步驟七：訂單樹狀追蹤 (COPQ05)</b><br>
                        開啟「訂單樹狀資訊查詢」，開窗挑選訂單，即可一覽該訂單之請購、採購、進貨與銷貨全生命週期樹狀圖！
                    </li>
                </ol>
            </div>
            <div class="erp-window-statusbar">
                <span class="status-cell">指引精靈運作正常</span>
                <span class="status-cell">作業: PRACTICE_GUIDE</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 780, 560);
    }

JS);

fwrite($fp, "\n};\n");
fclose($fp);
echo "Purchase and System modules written successfully.\n";
