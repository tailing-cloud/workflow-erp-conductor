<?php
// C:\xampp\htdocs\erp\build_modules_orders_delivery.php
$outPath = __DIR__ . '/assets/js/modules.js';
$fp = fopen($outPath, 'ab');
if (!$fp) die("Cannot open $outPath for appending.\n");

// ========================================================
// 2. 客戶訂單建立作業 (COPI06) - 1:1
// ========================================================
fwrite($fp, <<<'JS'
    openCOPI06() {
        const u = App.currentUser?.company || '學生區';
        const title = `客戶訂單建立作業(COPI06)[${u}]`;
        const winId = 'COPI06';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">資料(<u>D</u>)</span>
                <span class="erp-menu-item">功能(<u>F</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="新增" id="copi06-tb-new">📄</button>
                <button class="erp-tb-btn" title="查詢" id="copi06-tb-query">🔍</button>
                <button class="erp-tb-btn" title="修改" id="copi06-tb-edit">✏️</button>
                <button class="erp-tb-btn" title="刪除" id="copi06-tb-del">🗑️</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="首筆" id="copi06-tb-first">|◀</button>
                <button class="erp-tb-btn" title="上筆" id="copi06-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下筆" id="copi06-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="copi06-tb-last">▶|</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="儲存" id="copi06-tb-save" style="color:green;font-weight:bold;">💾</button>
                <button class="erp-tb-btn btn-confirm" title="確認" id="copi06-tb-confirm">✔ 確認</button>
                <button class="erp-tb-btn btn-unconfirm" title="取消確認" id="copi06-tb-unconfirm">✖ 取消確認</button>
                <button class="erp-tb-btn btn-transfer" title="訂單轉請購單 (COPB10)" id="copi06-tb-tobatch">📦 轉請購</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('客戶訂單報表產生中...')">🖨️</button>
            </div>

            <!-- Top Tab Header -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="copi06-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="copi06-tab-browse">資料瀏覽</button>
            </div>

            <!-- Detail View -->
            <div id="copi06-view-detail" style="display:flex; flex-direction:column; flex:1;">
                <div class="erp-header-panel">
                    <div class="erp-stamp-he" style="display:none;">核</div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>訂單單別</label>
                            <input type="text" id="copi06-type" class="erp-input-cyan" style="width:70px;" value="A221">
                            <button class="lookup-icon-btn" id="copi06-lookup-type" title="挑選單別">🔍</button>
                            <span class="erp-field-desc" id="copi06-type-desc">國內訂單</span>
                        </div>
                        <div class="erp-field">
                            <label>單據日期</label>
                            <input type="text" id="copi06-doc-date" class="erp-input-yellow" style="width:90px;" value="">
                            <input type="checkbox" id="copi06-chk-date">
                        </div>
                        <div class="erp-field">
                            <label>訂單日期</label>
                            <input type="text" id="copi06-order-date" style="width:90px;" value="">
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>訂單單號</label>
                            <input type="text" id="copi06-no" class="erp-input-cyan" style="width:130px;" value="">
                        </div>
                        <div class="erp-field">
                            <label>客戶代號</label>
                            <input type="text" id="copi06-cust-no" class="erp-input-yellow" style="width:85px;" value="">
                            <button class="lookup-icon-btn" id="copi06-lookup-cust" title="挑選客戶">👥</button>
                            <span class="erp-field-desc" id="copi06-cust-desc" style="min-width:90px;"></span>
                        </div>
                        <div class="erp-field">
                            <label>確認者</label>
                            <input type="text" id="copi06-confirm-user" class="erp-input-readonly" style="width:65px;" value="" readonly>
                            <span class="erp-field-desc" id="copi06-confirm-user-desc">學生B18</span>
                        </div>
                    </div>
                </div>

                <!-- Subtab Header -->
                <div class="erp-subtab-header">
                    <button class="erp-subtab-btn active">交易資料</button>
                    <button class="erp-subtab-btn">其他資料</button>
                    <button class="erp-subtab-btn">國外資料</button>
                </div>

                <!-- Subtab Content -->
                <div class="erp-tab-content">
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>部門代號</label>
                            <input type="text" id="copi06-dept" style="width:75px;" value="1000">
                            <button class="lookup-icon-btn" id="copi06-lookup-dept">🏢</button>
                            <span class="erp-field-desc">業務部</span>
                        </div>
                        <div class="erp-field">
                            <label>業務人員</label>
                            <input type="text" id="copi06-sales" style="width:75px;" value="1001">
                            <button class="lookup-icon-btn" id="copi06-lookup-sales">👤</button>
                            <span class="erp-field-desc">張明達(業務)</span>
                        </div>
                        <div class="erp-field">
                            <label>幣別</label>
                            <input type="text" id="copi06-currency" class="erp-input-yellow" style="width:65px;" value="NTD">
                        </div>
                    </div>
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
                                <th style="width:65px;">訂單數量</th>
                                <th style="width:40px;">單位</th>
                                <th style="width:75px;">單價</th>
                                <th style="width:85px;">金額</th>
                                <th style="width:85px;">預交日</th>
                                <th class="th-yellow" style="width:70px;">庫別</th>
                            </tr>
                        </thead>
                        <tbody id="copi06-grid-tbody">
                            <!-- Dynamic 1-row grid -->
                        </tbody>
                    </table>
                </div>

                <!-- Totals Panel (1:1 參考圖3 - 左右平均2欄統計) -->
                <div class="erp-totals-panel erp-totals-panel-split" style="flex-shrink:0; display:flex !important; flex-direction:row !important; justify-content:space-between; background:#ECE9D8; border-top:1px solid #7F9DB9; padding:4px 16px; font-size:12px; gap:28px;">
                    <!-- Left Column: 訂單金額 / 訂單稅額 / 合計 -->
                    <div class="totals-col" style="flex:1; display:flex; flex-direction:column; gap:3px; min-width:0;">
                        <div class="erp-field" style="display:flex; align-items:center;">
                            <label style="width:95px; min-width:95px; text-align:right; margin-right:6px; flex-shrink:0;">訂單金額</label>
                            <input type="text" id="copi06-tot-amt" class="erp-totals-inp" style="flex:1; max-width:260px; min-width:120px; text-align:right;" value="0" readonly>
                        </div>
                        <div class="erp-field" style="display:flex; align-items:center;">
                            <label style="width:95px; min-width:95px; text-align:right; margin-right:6px; flex-shrink:0;">訂單稅額</label>
                            <input type="text" id="copi06-tot-tax" class="erp-totals-inp" style="flex:1; max-width:260px; min-width:120px; text-align:right;" value="0" readonly>
                        </div>
                        <div class="erp-field" style="display:flex; align-items:center;">
                            <label style="width:95px; min-width:95px; text-align:right; margin-right:6px; flex-shrink:0; font-weight:bold;">合計</label>
                            <input type="text" id="copi06-tot-grand" class="erp-totals-inp" style="flex:1; max-width:260px; min-width:120px; text-align:right; font-weight:bold;" value="0" readonly>
                        </div>
                    </div>

                    <!-- Right Column: 總數量 / 總毛重(Kg) / 總材積(CUFT) -->
                    <div class="totals-col" style="flex:1; display:flex; flex-direction:column; gap:3px; min-width:0;">
                        <div class="erp-field" style="display:flex; align-items:center;">
                            <label style="width:95px; min-width:95px; text-align:right; margin-right:6px; flex-shrink:0;">總數量</label>
                            <input type="text" id="copi06-tot-qty" class="erp-totals-inp" style="flex:1; max-width:260px; min-width:120px; text-align:right;" value="0" readonly>
                        </div>
                        <div class="erp-field" style="display:flex; align-items:center;">
                            <label style="width:95px; min-width:95px; text-align:right; margin-right:6px; flex-shrink:0;">總毛重(Kg)</label>
                            <input type="text" id="copi06-tot-weight" class="erp-totals-inp" style="flex:1; max-width:260px; min-width:120px; text-align:right;" value="0" readonly>
                        </div>
                        <div class="erp-field" style="display:flex; align-items:center;">
                            <label style="width:95px; min-width:95px; text-align:right; margin-right:6px; flex-shrink:0;">總材積(CUFT)</label>
                            <input type="text" id="copi06-tot-cuft" class="erp-totals-inp" style="flex:1; max-width:260px; min-width:120px; text-align:right;" value="0" readonly>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Browse View -->
            <div id="copi06-view-browse" style="display:none; flex-direction:column; flex:1; padding:4px;">
                <table class="erp-grid-table">
                    <thead>
                        <tr>
                            <th style="width:25px;"></th>
                            <th class="th-cyan" style="width:130px;">訂單單號</th>
                            <th style="width:85px;">訂單日期</th>
                            <th style="width:80px;">客戶代號</th>
                            <th style="width:160px;">客戶名稱</th>
                            <th style="width:90px;">總金額</th>
                            <th style="width:65px;">狀態</th>
                        </tr>
                    </thead>
                    <tbody id="copi06-browse-tbody">
                        <tr><td colspan="7" style="text-align:center; padding:20px;">載入訂單清單中...</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Statusbar -->
            <div class="erp-window-statusbar">
                <span class="status-cell">瀏覽</span>
                <span class="status-cell" id="copi06-status-msg">單身資料筆數: 0</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 940, 600, (winEl) => {
            const fType = winEl.querySelector('#copi06-type');
            const fDocDate = winEl.querySelector('#copi06-doc-date');
            const fOrderDate = winEl.querySelector('#copi06-order-date');
            const fNo = winEl.querySelector('#copi06-no');
            const fCustNo = winEl.querySelector('#copi06-cust-no');
            const fCustDesc = winEl.querySelector('#copi06-cust-desc');
            const fSales = winEl.querySelector('#copi06-sales');
            const fDept = winEl.querySelector('#copi06-dept');
            const fConfirmUser = winEl.querySelector('#copi06-confirm-user');
            const fTotAmt = winEl.querySelector('#copi06-tot-amt');
            const fTotTax = winEl.querySelector('#copi06-tot-tax');
            const fTotGrand = winEl.querySelector('#copi06-tot-grand');
            const fTotQty = winEl.querySelector('#copi06-tot-qty');
            const statusMsg = winEl.querySelector('#copi06-status-msg');

            const tabDetail = winEl.querySelector('#copi06-tab-detail');
            const tabBrowse = winEl.querySelector('#copi06-tab-browse');
            const viewDetail = winEl.querySelector('#copi06-view-detail');
            const viewBrowse = winEl.querySelector('#copi06-view-browse');

            let currentDocStatus = '未確認';
            let orderList = [];

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
                const rows = winEl.querySelectorAll('#copi06-grid-tbody tr[data-row]');
                rows.forEach(r => {
                    const rowIdx = r.getAttribute('data-row');
                    const iNo = winEl.querySelector(`#copi06-item-no-${rowIdx}`)?.value.trim();
                    const q = parseFloat(winEl.querySelector(`#copi06-qty-${rowIdx}`)?.value) || 0;
                    const a = parseFloat((winEl.querySelector(`#copi06-amount-${rowIdx}`)?.value || '').replace(/,/g, '')) || 0;
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

            const grid = Modules.initDynamicGrid(winEl, 'copi06', true, calcTotals);

            const fillOrder = (header, details = []) => {
                fType.value = header.order_type || 'A221';
                fDocDate.value = header.doc_date || '';
                fOrderDate.value = header.order_date || '';
                fNo.value = header.order_no || '';
                fCustNo.value = header.customer_no || '';
                fCustDesc.textContent = header.customer_name || '';
                fSales.value = header.sales_person || '1001';
                fDept.value = header.dept || '1000';
                fConfirmUser.value = header.confirm_user || '';
                currentDocStatus = header.status || '未確認';
                Modules.setDocStamp(winEl, currentDocStatus);
                grid.fillGrid(details);
            };

            const clearOrder = () => {
                fType.value = 'A221';
                const today = Modules.getTodayStr();
                fDocDate.value = today;
                fOrderDate.value = today;
                fNo.value = 'A221-' + today.replace(/\//g, '') + String(Math.floor(Math.random() * 899 + 100)).padStart(3, '0');
                fCustNo.value = '';
                fCustDesc.textContent = '';
                fSales.value = '1001';
                fDept.value = '1000';
                fConfirmUser.value = '';
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '未確認');
                grid.clearGrid();
                fCustNo.focus();
            };

            const loadBrowseList = async () => {
                const tbody = winEl.querySelector('#copi06-browse-tbody');
                const res = await ERP_API.get('get_orders');
                if (res.success) {
                    orderList = res.data || [];
                    if (orderList.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px; color:#888;">目前尚無客戶訂單</td></tr>';
                        return;
                    }
                    let rows = '';
                    orderList.forEach(o => {
                        rows += `
                            <tr data-no="${o.order_no}" style="cursor:pointer;">
                                <td style="text-align:center;">▶</td>
                                <td style="font-weight:bold; color:#003366;">${o.order_no}</td>
                                <td>${o.order_date || ''}</td>
                                <td>${o.customer_no || ''}</td>
                                <td>${o.customer_name || ''}</td>
                                <td style="text-align:right; font-weight:bold;">${Math.round(o.grand_total || 0).toLocaleString()}</td>
                                <td style="text-align:center; font-weight:bold; color:${o.status === '已確認' ? 'green' : '#999'};">${o.status || '未確認'}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows;

                    tbody.querySelectorAll('tr[data-no]').forEach(tr => {
                        tr.addEventListener('click', async () => {
                            const no = tr.getAttribute('data-no');
                            const detailRes = await ERP_API.get('get_order', { order_no: no });
                            if (detailRes.success && detailRes.order) {
                                fillOrder(detailRes.order, detailRes.details || []);
                                switchTab('detail');
                            }
                        });
                    });
                }
            };

            // Lookups
            winEl.querySelector('#copi06-lookup-type').addEventListener('click', () => {
                Modules.openLookup('doc_type_order', (t) => { fType.value = t.code; });
            });
            winEl.querySelector('#copi06-lookup-cust').addEventListener('click', () => {
                Modules.openLookup('customer', (c) => {
                    fCustNo.value = c.customer_no || '';
                    fCustDesc.textContent = c.name_short || c.full_name || '';
                });
            });
            winEl.querySelector('#copi06-lookup-sales').addEventListener('click', () => {
                Modules.openLookup('salesperson', (s) => { fSales.value = s.code; });
            });

            // Toolbar Actions
            winEl.querySelector('#copi06-tb-new').addEventListener('click', clearOrder);
            winEl.querySelector('#copi06-tb-query').addEventListener('click', () => {
                Modules.openLookup('order', async (o) => {
                    const res = await ERP_API.get('get_order', { order_no: o.order_no });
                    if (res.success && res.order) {
                        fillOrder(res.order, res.details || []);
                    }
                });
            });

            winEl.querySelector('#copi06-tb-save').addEventListener('click', async () => {
                const orderNo = fNo.value.trim();
                const custNo = fCustNo.value.trim();
                if (!orderNo || !custNo) {
                    alert('【必填檢查】請輸入訂單單號並挑選客戶代號！');
                    return;
                }

                const details = grid.getRowsData();
                if (details.length === 0) {
                    alert('【明細檢查】請至少在表格中挑選品號並輸入數量！');
                    return;
                }

                const payload = {
                    header: {
                        order_no: orderNo,
                        order_type: fType.value.trim() || 'A221',
                        doc_date: fDocDate.value.trim() || Modules.getTodayStr(),
                        order_date: fOrderDate.value.trim() || Modules.getTodayStr(),
                        customer_no: custNo,
                        customer_name: fCustDesc.textContent.trim(),
                        sales_person: fSales.value.trim(),
                        dept: fDept.value.trim(),
                        status: currentDocStatus
                    },
                    details
                };

                const res = await ERP_API.post('save_order', payload);
                if (res.success) {
                    alert(`客戶訂單 [${orderNo}] 儲存成功！`);
                } else {
                    alert('儲存失敗: ' + (res.error || '不明錯誤'));
                }
            });

            winEl.querySelector('#copi06-tb-confirm').addEventListener('click', async () => {
                const orderNo = fNo.value.trim();
                if (!orderNo) return;
                if (confirm(`確定要確認訂單 [${orderNo}] 嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'order', doc_no: orderNo, status: '已確認' });
                    if (res.success) {
                        currentDocStatus = '已確認';
                        fConfirmUser.value = App.currentUser?.username || 'B18';
                        Modules.setDocStamp(winEl, '已確認');
                        alert('訂單確認完成！');
                    }
                }
            });

            winEl.querySelector('#copi06-tb-unconfirm').addEventListener('click', async () => {
                const orderNo = fNo.value.trim();
                if (!orderNo) return;
                if (confirm(`確定要取消訂單 [${orderNo}] 的確認狀態嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'order', doc_no: orderNo, status: '未確認' });
                    if (res.success) {
                        currentDocStatus = '未確認';
                        fConfirmUser.value = '';
                        Modules.setDocStamp(winEl, '未確認');
                        alert('訂單已取消確認！');
                    }
                }
            });

            winEl.querySelector('#copi06-tb-del').addEventListener('click', async () => {
                const orderNo = fNo.value.trim();
                if (!orderNo) return;
                if (confirm(`確定要刪除訂單 [${orderNo}] 嗎？`)) {
                    const res = await ERP_API.post('delete_order', { order_no: orderNo });
                    if (res.success) {
                        alert('訂單已刪除！');
                        clearOrder();
                    } else {
                        alert('刪除失敗: ' + (res.error || '不明錯誤'));
                    }
                }
            });

            winEl.querySelector('#copi06-tb-tobatch').addEventListener('click', () => {
                Modules.openCOPB10(fNo.value.trim());
            });
        });
    },

    // ========================================================
    // 3. 銷貨單建立作業 (COPI08) - 1:1 擷取2 (media_1793885786161_97ad1ed4.png)
    // ========================================================
    openCOPI08() {
        const u = App.currentUser?.company || '學生區';
        const title = `銷貨單建立作業(COPI08)[${u}]`;
        const winId = 'COPI08';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">資料(<u>D</u>)</span>
                <span class="erp-menu-item">功能(<u>F</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="新增" id="copi08-tb-new">📄</button>
                <button class="erp-tb-btn" title="查詢" id="copi08-tb-query">🔍</button>
                <button class="erp-tb-btn" title="修改" id="copi08-tb-edit">✏️</button>
                <button class="erp-tb-btn" title="刪除" id="copi08-tb-del">🗑️</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="首筆" id="copi08-tb-first">|◀</button>
                <button class="erp-tb-btn" title="上筆" id="copi08-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下筆" id="copi08-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="copi08-tb-last">▶|</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="儲存" id="copi08-tb-save" style="color:green;font-weight:bold;">💾</button>
                <button class="erp-tb-btn btn-confirm" title="確認" id="copi08-tb-confirm">✔ 確認</button>
                <button class="erp-tb-btn btn-unconfirm" title="取消確認" id="copi08-tb-unconfirm">✖ 取消確認</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('銷貨單列印中...')">🖨️</button>
            </div>

            <!-- Top Tab Header -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="copi08-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="copi08-tab-browse">資料瀏覽</button>
            </div>

            <!-- Detail View -->
            <div id="copi08-view-detail" style="display:flex; flex-direction:column; flex:1;">
                <div class="erp-header-panel">
                    <div class="erp-stamp-he" style="display:none;">核</div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>銷貨單別</label>
                            <input type="text" id="copi08-type" class="erp-input-cyan" style="width:70px;" value="A231">
                            <button class="lookup-icon-btn" id="copi08-lookup-type" title="挑選單別">🔍</button>
                            <span class="erp-field-desc" id="copi08-type-desc">銷貨單</span>
                        </div>
                        <div class="erp-field">
                            <label>單據日期</label>
                            <input type="text" id="copi08-doc-date" class="erp-input-yellow" style="width:90px;" value="">
                            <input type="checkbox" id="copi08-chk-date">
                        </div>
                        <div class="erp-field">
                            <label>銷貨日期</label>
                            <input type="text" id="copi08-deliv-date" style="width:90px;" value="">
                        </div>
                        <div class="erp-field" style="margin-left:14px;">
                            <label style="min-width:auto;"><input type="checkbox" checked> 產生分錄-收入</label>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>銷貨單號</label>
                            <input type="text" id="copi08-no" class="erp-input-cyan" style="width:130px;" value="">
                        </div>
                        <div class="erp-field">
                            <label>客戶代號</label>
                            <input type="text" id="copi08-cust-no" class="erp-input-yellow" style="width:85px;" value="">
                            <button class="lookup-icon-btn" id="copi08-lookup-cust" title="挑選客戶">👥</button>
                            <span class="erp-field-desc" id="copi08-cust-desc" style="min-width:90px;">標竿公司</span>
                        </div>
                        <div class="erp-field" style="margin-left:14px;">
                            <label style="min-width:auto;"><input type="checkbox" checked> 產生分錄-成本</label>
                        </div>
                    </div>
                </div>

                <!-- Subtab Header -->
                <div class="erp-subtab-header">
                    <button class="erp-subtab-btn active">交易資料</button>
                    <button class="erp-subtab-btn">送貨資料</button>
                    <button class="erp-subtab-btn">發票資料(一)</button>
                    <button class="erp-subtab-btn">發票資料(二)</button>
                    <button class="erp-subtab-btn">其他資料</button>
                </div>

                <!-- Subtab Content -->
                <div class="erp-tab-content">
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>部門代號</label>
                            <input type="text" id="copi08-dept" style="width:75px;" value="1000">
                            <button class="lookup-icon-btn">🏢</button>
                            <span class="erp-field-desc">業務部</span>
                        </div>
                        <div class="erp-field">
                            <label>幣別</label>
                            <input type="text" id="copi08-currency" class="erp-input-yellow" style="width:65px;" value="NTD">
                            <span class="erp-field-desc">台幣</span>
                        </div>
                        <div class="erp-field">
                            <label>簽核狀態</label>
                            <input type="text" class="erp-input-readonly" style="width:130px;" value="N:不執行電子簽核" readonly>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>業務人員</label>
                            <input type="text" id="copi08-sales" style="width:75px;" value="1001">
                            <button class="lookup-icon-btn">👤</button>
                            <span class="erp-field-desc">張明達(業</span>
                        </div>
                        <div class="erp-field">
                            <label>匯率</label>
                            <input type="text" style="width:65px; text-align:right;" value="1">
                        </div>
                        <div class="erp-field">
                            <label>確認者</label>
                            <input type="text" id="copi08-confirm-user" class="erp-input-readonly" style="width:65px;" value="" readonly>
                            <span class="erp-field-desc" id="copi08-confirm-user-desc">學生B18</span>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>出貨廠別</label>
                            <input type="text" class="erp-input-yellow" style="width:65px;" value="TP01">
                            <span class="erp-field-desc">製造一廠</span>
                        </div>
                        <div class="erp-field">
                            <label>付款條件</label>
                            <input type="text" style="width:65px;" value="202">
                            <span class="erp-field-desc">次月20日收票</span>
                        </div>
                    </div>
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
                                <th style="width:160px;">品名</th>
                                <th style="width:120px;">規格</th>
                                <th class="th-yellow" style="width:70px;">庫別</th>
                                <th style="width:100px;">庫別名稱</th>
                                <th style="width:65px;">出貨數量</th>
                                <th style="width:40px;">單位</th>
                                <th style="width:75px;">單價</th>
                                <th style="width:85px;">金額</th>
                            </tr>
                        </thead>
                        <tbody id="copi08-grid-tbody">
                            <!-- Dynamic 1-row grid -->
                        </tbody>
                    </table>
                </div>

                <!-- 3-Row Multi-totals Panel (1:1 擷取2.PNG) -->
                <div class="erp-totals-panel">
                    <div class="erp-totals-row">
                        <span>原幣銷貨金額</span>
                        <input type="text" id="copi08-tot-amt" class="erp-totals-inp" value="0" readonly>
                        <span style="margin-left:20px;">原幣銷貨稅額</span>
                        <input type="text" id="copi08-tot-tax" class="erp-totals-inp" value="0" readonly>
                        <span style="margin-left:20px;">原幣合計</span>
                        <input type="text" id="copi08-tot-grand" class="erp-totals-inp" value="0" readonly>
                    </div>
                    <div class="erp-totals-row">
                        <span>本幣銷貨金額</span>
                        <input type="text" id="copi08-tot-amt-local" class="erp-totals-inp" value="0" readonly>
                        <span style="margin-left:20px;">本幣銷貨稅額</span>
                        <input type="text" id="copi08-tot-tax-local" class="erp-totals-inp" value="0" readonly>
                        <span style="margin-left:20px;">本幣合計</span>
                        <input type="text" id="copi08-tot-grand-local" class="erp-totals-inp" value="0" readonly>
                    </div>
                    <div class="erp-totals-row">
                        <span>總數量</span>
                        <input type="text" id="copi08-tot-qty" class="erp-totals-inp" value="0" readonly>
                    </div>
                </div>
            </div>

            <!-- Browse View -->
            <div id="copi08-view-browse" style="display:none; flex-direction:column; flex:1; padding:4px;">
                <table class="erp-grid-table">
                    <thead>
                        <tr>
                            <th style="width:25px;"></th>
                            <th class="th-cyan" style="width:130px;">銷貨單號</th>
                            <th style="width:85px;">銷貨日期</th>
                            <th style="width:80px;">客戶代號</th>
                            <th style="width:160px;">客戶簡稱</th>
                            <th style="width:90px;">銷貨金額</th>
                            <th style="width:90px;">合計</th>
                            <th style="width:65px;">狀態</th>
                        </tr>
                    </thead>
                    <tbody id="copi08-browse-tbody">
                        <tr><td colspan="8" style="text-align:center; padding:20px;">載入銷貨單清單中...</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Statusbar -->
            <div class="erp-window-statusbar">
                <span class="status-cell">瀏覽</span>
                <span class="status-cell" id="copi08-status-msg">單身資料筆數: 0</span>
                <span class="status-cell">410004 數位相機-專業型</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 940, 600, (winEl) => {
            const fType = winEl.querySelector('#copi08-type');
            const fDocDate = winEl.querySelector('#copi08-doc-date');
            const fDelivDate = winEl.querySelector('#copi08-deliv-date');
            const fNo = winEl.querySelector('#copi08-no');
            const fCustNo = winEl.querySelector('#copi08-cust-no');
            const fCustDesc = winEl.querySelector('#copi08-cust-desc');
            const fConfirmUser = winEl.querySelector('#copi08-confirm-user');
            const fTotAmt = winEl.querySelector('#copi08-tot-amt');
            const fTotTax = winEl.querySelector('#copi08-tot-tax');
            const fTotGrand = winEl.querySelector('#copi08-tot-grand');
            const fTotAmtLocal = winEl.querySelector('#copi08-tot-amt-local');
            const fTotTaxLocal = winEl.querySelector('#copi08-tot-tax-local');
            const fTotGrandLocal = winEl.querySelector('#copi08-tot-grand-local');
            const fTotQty = winEl.querySelector('#copi08-tot-qty');
            const statusMsg = winEl.querySelector('#copi08-status-msg');

            const tabDetail = winEl.querySelector('#copi08-tab-detail');
            const tabBrowse = winEl.querySelector('#copi08-tab-browse');
            const viewDetail = winEl.querySelector('#copi08-view-detail');
            const viewBrowse = winEl.querySelector('#copi08-view-browse');

            let currentDocStatus = '未確認';
            let delivList = [];

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
                const rows = winEl.querySelectorAll('#copi08-grid-tbody tr[data-row]');
                rows.forEach(r => {
                    const rowIdx = r.getAttribute('data-row');
                    const iNo = winEl.querySelector(`#copi08-item-no-${rowIdx}`)?.value.trim();
                    const q = parseFloat(winEl.querySelector(`#copi08-qty-${rowIdx}`)?.value) || 0;
                    const a = parseFloat((winEl.querySelector(`#copi08-amount-${rowIdx}`)?.value || '').replace(/,/g, '')) || 0;
                    if (iNo) rowCount++;
                    sumQty += q;
                    sumAmt += a;
                });
                const tax = Math.round(sumAmt * 0.05);
                const grand = sumAmt + tax;
                fTotAmt.value = sumAmt.toLocaleString();
                fTotTax.value = tax.toLocaleString();
                fTotGrand.value = grand.toLocaleString();
                fTotAmtLocal.value = sumAmt.toLocaleString();
                fTotTaxLocal.value = tax.toLocaleString();
                fTotGrandLocal.value = grand.toLocaleString();
                fTotQty.value = sumQty.toLocaleString();
                statusMsg.textContent = `單身資料筆數: ${rowCount}`;
            };

            const grid = Modules.initDynamicGrid(winEl, 'copi08', false, calcTotals);

            const fillDelivery = (header, details = []) => {
                fType.value = header.delivery_type || 'A231';
                fDocDate.value = header.doc_date || '';
                fDelivDate.value = header.delivery_date || '';
                fNo.value = header.delivery_no || '';
                fCustNo.value = header.customer_no || '';
                fCustDesc.textContent = header.customer_name || '';
                fConfirmUser.value = header.confirm_user || '';
                currentDocStatus = header.status || '未確認';
                Modules.setDocStamp(winEl, currentDocStatus);
                grid.fillGrid(details);
            };

            const clearDelivery = () => {
                fType.value = 'A231';
                const today = Modules.getTodayStr();
                fDocDate.value = today;
                fDelivDate.value = today;
                fNo.value = 'A231-' + today.replace(/\//g, '') + String(Math.floor(Math.random() * 899 + 100)).padStart(3, '0');
                fCustNo.value = '';
                fCustDesc.textContent = '';
                fConfirmUser.value = '';
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '未確認');
                grid.clearGrid();
                fCustNo.focus();
            };

            const loadBrowseList = async () => {
                const tbody = winEl.querySelector('#copi08-browse-tbody');
                const res = await ERP_API.get('get_deliveries');
                if (res.success) {
                    delivList = res.data || [];
                    if (delivList.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px; color:#888;">目前尚無銷貨單資料</td></tr>';
                        return;
                    }
                    let rows = '';
                    delivList.forEach(d => {
                        rows += `
                            <tr data-no="${d.delivery_no}" style="cursor:pointer;">
                                <td style="text-align:center;">▶</td>
                                <td style="font-weight:bold; color:#003366;">${d.delivery_no}</td>
                                <td>${d.delivery_date || ''}</td>
                                <td>${d.customer_no || ''}</td>
                                <td>${d.customer_name || ''}</td>
                                <td style="text-align:right;">${Math.round(d.delivery_amount || 0).toLocaleString()}</td>
                                <td style="text-align:right; font-weight:bold;">${Math.round(d.grand_total || 0).toLocaleString()}</td>
                                <td style="text-align:center; font-weight:bold; color:${d.status === '已確認' ? 'green' : '#999'};">${d.status || '未確認'}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows;

                    tbody.querySelectorAll('tr[data-no]').forEach(tr => {
                        tr.addEventListener('click', async () => {
                            const no = tr.getAttribute('data-no');
                            const detailRes = await ERP_API.get('get_delivery', { delivery_no: no });
                            if (detailRes.success && detailRes.delivery) {
                                fillDelivery(detailRes.delivery, detailRes.details || []);
                                switchTab('detail');
                            }
                        });
                    });
                }
            };

            // Lookups
            winEl.querySelector('#copi08-lookup-type').addEventListener('click', () => {
                Modules.openLookup('doc_type_deliv', (t) => { fType.value = t.code; });
            });

            winEl.querySelector('#copi08-lookup-cust').addEventListener('click', () => {
                Modules.openLookup('customer', (c) => {
                    fCustNo.value = c.customer_no || '';
                    fCustDesc.textContent = c.name_short || c.full_name || '';
                });
            });

            // Toolbar Actions
            winEl.querySelector('#copi08-tb-new').addEventListener('click', clearDelivery);
            winEl.querySelector('#copi08-tb-query').addEventListener('click', () => {
                Modules.openLookup('delivery', async (d) => {
                    const res = await ERP_API.get('get_delivery', { delivery_no: d.delivery_no });
                    if (res.success && res.delivery) {
                        fillDelivery(res.delivery, res.details || []);
                    }
                });
            });

            winEl.querySelector('#copi08-tb-save').addEventListener('click', async () => {
                const delivNo = fNo.value.trim();
                const custNo = fCustNo.value.trim();
                if (!delivNo || !custNo) {
                    alert('【必填檢查】請輸入銷貨單號並挑選客戶代號！');
                    return;
                }

                const details = grid.getRowsData();
                if (details.length === 0) {
                    alert('【明細檢查】請至少在表格中挑選品號並輸入出貨數量！');
                    return;
                }

                const payload = {
                    header: {
                        delivery_no: delivNo,
                        delivery_type: fType.value.trim() || 'A231',
                        doc_date: fDocDate.value.trim() || Modules.getTodayStr(),
                        delivery_date: fDelivDate.value.trim() || Modules.getTodayStr(),
                        customer_no: custNo,
                        customer_name: fCustDesc.textContent.trim(),
                        status: currentDocStatus
                    },
                    details
                };

                const res = await ERP_API.post('save_delivery', payload);
                if (res.success) {
                    alert(`銷貨單 [${delivNo}] 儲存成功！庫存已同步出庫。`);
                } else {
                    alert('儲存失敗: ' + (res.error || '不明錯誤'));
                }
            });

            winEl.querySelector('#copi08-tb-confirm').addEventListener('click', async () => {
                const delivNo = fNo.value.trim();
                if (!delivNo) return;
                if (confirm(`確定要確認銷貨單 [${delivNo}] 嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'delivery', doc_no: delivNo, status: '已確認' });
                    if (res.success) {
                        currentDocStatus = '已確認';
                        fConfirmUser.value = App.currentUser?.username || 'B18';
                        Modules.setDocStamp(winEl, '已確認');
                        alert('銷貨單確認完成！');
                    }
                }
            });

            winEl.querySelector('#copi08-tb-unconfirm').addEventListener('click', async () => {
                const delivNo = fNo.value.trim();
                if (!delivNo) return;
                if (confirm(`確定要取消銷貨單 [${delivNo}] 的確認狀態嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'delivery', doc_no: delivNo, status: '未確認' });
                    if (res.success) {
                        currentDocStatus = '未確認';
                        fConfirmUser.value = '';
                        Modules.setDocStamp(winEl, '未確認');
                        alert('銷貨單已取消確認！');
                    }
                }
            });

            winEl.querySelector('#copi08-tb-del').addEventListener('click', async () => {
                const delivNo = fNo.value.trim();
                if (!delivNo) return;
                if (confirm(`確定要刪除銷貨單 [${delivNo}] 嗎？`)) {
                    const res = await ERP_API.post('delete_delivery', { delivery_no: delivNo });
                    if (res.success) {
                        alert('銷貨單已刪除！');
                        clearDelivery();
                    } else {
                        alert('刪除失敗: ' + (res.error || '不明錯誤'));
                    }
                }
            });
        });
    },

JS);

echo "COPI06 and COPI08 written.\n";
fclose($fp);
