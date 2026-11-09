<?php
// C:\xampp\htdocs\erp\build_modules_sales.php
$outPath = __DIR__ . '/assets/js/modules.js';
$fp = fopen($outPath, 'ab');
if (!$fp) die("Cannot open $outPath for appending.\n");

// ========================================================
// 1. 報價單建立作業 (COPI05) - 1:1
// ========================================================
fwrite($fp, <<<'JS'
    openCOPI05() {
        const u = App.currentUser?.company || '學生區';
        const title = `報價單建立作業(COPI05)[${u}]`;
        const winId = 'COPI05';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">資料(<u>D</u>)</span>
                <span class="erp-menu-item">功能(<u>F</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="新增" id="copi05-tb-new">📄</button>
                <button class="erp-tb-btn" title="查詢" id="copi05-tb-query">🔍</button>
                <button class="erp-tb-btn" title="修改" id="copi05-tb-edit">✏️</button>
                <button class="erp-tb-btn" title="刪除" id="copi05-tb-del">🗑️</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="首筆" id="copi05-tb-first">|◀</button>
                <button class="erp-tb-btn" title="上筆" id="copi05-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下筆" id="copi05-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="copi05-tb-last">▶|</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="儲存" id="copi05-tb-save" style="color:green;font-weight:bold;">💾</button>
                <button class="erp-tb-btn btn-confirm" title="確認" id="copi05-tb-confirm">✔ 確認</button>
                <button class="erp-tb-btn btn-unconfirm" title="取消確認" id="copi05-tb-unconfirm">✖ 取消確認</button>
                <button class="erp-tb-btn btn-transfer" title="轉客戶訂單 (COPI06)" onclick="Modules.open('COPI06')">📋 轉訂單</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('報價單報表預覽產生中...')">🖨️</button>
            </div>

            <!-- Top Tab Header (1:1 擷取畫面 - 詳細欄位 / 資料瀏覽) -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="copi05-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="copi05-tab-browse">資料瀏覽</button>
            </div>

            <!-- Detail View -->
            <div id="copi05-view-detail" style="display:flex; flex-direction:column; flex:1;">
                <!-- Header Panel (1:1 擷取1.PNG - 含紅色核准章) -->
                <div class="erp-header-panel">
                    <div class="erp-stamp-he" style="display:none;">核</div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>報價單別</label>
                            <input type="text" id="copi05-type" class="erp-input-cyan" style="width:70px;" value="C211">
                            <button class="lookup-icon-btn" id="copi05-lookup-type" title="挑選單別">🔍</button>
                            <span class="erp-field-desc" id="copi05-type-desc">配銷報價內</span>
                        </div>
                        <div class="erp-field">
                            <label>單據日期</label>
                            <input type="text" id="copi05-doc-date" class="erp-input-yellow" style="width:90px;" value="">
                            <input type="checkbox" id="copi05-chk-date">
                        </div>
                        <div class="erp-field">
                            <label>報價日期</label>
                            <input type="text" id="copi05-quote-date" style="width:90px;" value="">
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>報價單號</label>
                            <input type="text" id="copi05-no" class="erp-input-cyan" style="width:130px;" value="">
                        </div>
                        <div class="erp-field">
                            <label>版次</label>
                            <input type="text" id="copi05-version" style="width:45px;" value="0000">
                        </div>
                        <div class="erp-field" style="margin-left:8px;">
                            <button type="button" id="copi05-btn-custconfirm" class="erp-cust-confirm-btn" title="按一下確認，再按一下取消確認">
                                <input type="checkbox" id="copi05-chk-custconfirm" style="pointer-events:none;"> 客戶確認: <span id="copi05-custconfirm-status" style="font-weight:bold; color:#C00000;">未確認</span>
                            </button>
                        </div>
                        <div class="erp-field" style="margin-left:14px;">
                            <label>確認者</label>
                            <input type="text" id="copi05-confirm-user" class="erp-input-readonly" style="width:65px;" value="" readonly>
                            <span class="erp-field-desc" id="copi05-confirm-user-desc">學生B18</span>
                        </div>
                    </div>
                </div>

                <!-- Subtab Header (1:1 擷取1.PNG) -->
                <div class="erp-subtab-header">
                    <button class="erp-subtab-btn active">交易資料</button>
                    <button class="erp-subtab-btn">其他資料</button>
                    <button class="erp-subtab-btn">國外資料</button>
                </div>

                <!-- Subtab Content (1:1 擷取1.PNG) -->
                <div class="erp-tab-content">
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>客戶代號</label>
                            <input type="text" id="copi05-cust-no" class="erp-input-yellow" style="width:85px;" value="">
                            <button class="lookup-icon-btn" id="copi05-lookup-cust" title="挑選客戶">👥</button>
                            <span class="erp-field-desc" id="copi05-cust-desc" style="min-width:90px;"></span>
                        </div>
                        <div class="erp-field">
                            <label>稅別碼</label>
                            <input type="text" id="copi05-tax-code" style="width:45px;" value="S10">
                            <button class="lookup-icon-btn">🔍</button>
                            <span class="erp-field-desc">銷項三聯式收銀機發票-應稅外加</span>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>業務人員</label>
                            <input type="text" id="copi05-sales" style="width:75px;" value="1001">
                            <button class="lookup-icon-btn" id="copi05-lookup-sales">👤</button>
                            <span class="erp-field-desc" style="min-width:90px;">張明達(業務)</span>
                        </div>
                        <div class="erp-field">
                            <label>課稅別</label>
                            <select id="copi05-tax-type" style="width:110px;">
                                <option value="2">2:應稅外加</option>
                                <option value="1">1:應稅內含</option>
                                <option value="3">3:零稅率</option>
                                <option value="4">4:免稅</option>
                            </select>
                        </div>
                        <div class="erp-field">
                            <label>列印格式</label>
                            <select id="copi05-print-fmt" style="width:90px;">
                                <option value="1">1:中式</option>
                                <option value="2">2:英式</option>
                            </select>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>幣別</label>
                            <input type="text" id="copi05-currency" class="erp-input-yellow" style="width:65px;" value="NTD">
                            <button class="lookup-icon-btn" id="copi05-lookup-currency">💲</button>
                        </div>
                        <div class="erp-field">
                            <label>營業稅率</label>
                            <input type="text" id="copi05-tax-rate" style="width:65px; text-align:right;" value="5.000%">
                        </div>
                        <div class="erp-field">
                            <label>傳送次數</label>
                            <input type="text" style="width:40px; text-align:right;" value="0">
                        </div>
                        <div class="erp-field">
                            <label>列印</label>
                            <input type="text" style="width:40px; text-align:right;" value="0">
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>匯率</label>
                            <input type="text" id="copi05-rate" style="width:65px; text-align:right;" value="1">
                            <button class="lookup-icon-btn">💲</button>
                        </div>
                        <div class="erp-field">
                            <label>價格條件</label>
                            <input type="text" style="width:110px;" value="">
                            <button class="lookup-icon-btn">🔍</button>
                        </div>
                        <div class="erp-field">
                            <label>簽核狀態</label>
                            <input type="text" class="erp-input-readonly" style="width:120px;" value="N:不執行電子簽核" readonly>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label style="min-width:auto;"><input type="checkbox" id="copi05-chk-multitax"> 單身多稅率</label>
                        </div>
                        <div class="erp-field" style="margin-left:24px;">
                            <label>付款條件</label>
                            <input type="text" style="width:80px;" value="">
                            <button class="lookup-icon-btn">🔍</button>
                        </div>
                    </div>
                </div>

                <!-- Dynamic DataGrid (1:1 擷取1.PNG) -->
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
                                <th style="width:65px;">報價數量</th>
                                <th style="width:40px;">單位</th>
                                <th style="width:75px;">單價</th>
                                <th style="width:85px;">金額</th>
                                <th style="width:85px;">預計出貨日</th>
                            </tr>
                        </thead>
                        <tbody id="copi05-grid-tbody">
                            <!-- Rendered dynamically by initDynamicGrid -->
                        </tbody>
                    </table>
                </div>

                <!-- Bottom Totals Summary Panel (1:1 擷取1.PNG - 2列多欄) -->
                <div class="erp-totals-panel">
                    <div class="erp-totals-row">
                        <span>報價金額</span>
                        <input type="text" id="copi05-tot-amt" class="erp-totals-inp" value="0" readonly>
                        <span style="margin-left:20px;">稅額</span>
                        <input type="text" id="copi05-tot-tax" class="erp-totals-inp" value="0" readonly>
                        <span style="margin-left:20px;">合計</span>
                        <input type="text" id="copi05-tot-grand" class="erp-totals-inp" value="0" readonly>
                    </div>
                    <div class="erp-totals-row">
                        <span>總數量</span>
                        <input type="text" id="copi05-tot-qty" class="erp-totals-inp" value="0" readonly>
                        <span style="margin-left:20px;">總毛重(Kg)</span>
                        <input type="text" class="erp-totals-inp" value="0" readonly>
                        <span style="margin-left:20px;">總材積(Volume)</span>
                        <input type="text" class="erp-totals-inp" value="0" readonly>
                    </div>
                </div>
            </div>

            <!-- Browse View -->
            <div id="copi05-view-browse" style="display:none; flex-direction:column; flex:1; padding:4px;">
                <table class="erp-grid-table">
                    <thead>
                        <tr>
                            <th style="width:25px;"></th>
                            <th class="th-cyan" style="width:130px;">報價單號</th>
                            <th style="width:85px;">報價日期</th>
                            <th style="width:80px;">客戶代號</th>
                            <th style="width:160px;">客戶簡稱</th>
                            <th style="width:90px;">報價金額</th>
                            <th style="width:90px;">合計</th>
                            <th style="width:65px;">狀態</th>
                        </tr>
                    </thead>
                    <tbody id="copi05-browse-tbody">
                        <tr><td colspan="8" style="text-align:center; padding:20px;">載入報價單清單中...</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- 1:1 Window Statusbar (擷取1.PNG) -->
            <div class="erp-window-statusbar">
                <span class="status-cell">瀏覽</span>
                <span class="status-cell" id="copi05-status-msg">單身資料筆數: 0</span>
                <span class="status-cell" id="copi05-status-item">410001 數位相機-SL系列</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 940, 600, (winEl) => {
            const fType = winEl.querySelector('#copi05-type');
            const fDocDate = winEl.querySelector('#copi05-doc-date');
            const fQuoteDate = winEl.querySelector('#copi05-quote-date');
            const fNo = winEl.querySelector('#copi05-no');
            const fCustNo = winEl.querySelector('#copi05-cust-no');
            const fCustDesc = winEl.querySelector('#copi05-cust-desc');
            const fSales = winEl.querySelector('#copi05-sales');
            const fConfirmUser = winEl.querySelector('#copi05-confirm-user');
            const fTotAmt = winEl.querySelector('#copi05-tot-amt');
            const fTotTax = winEl.querySelector('#copi05-tot-tax');
            const fTotGrand = winEl.querySelector('#copi05-tot-grand');
            const fTotQty = winEl.querySelector('#copi05-tot-qty');
            const statusMsg = winEl.querySelector('#copi05-status-msg');

            const tabDetail = winEl.querySelector('#copi05-tab-detail');
            const tabBrowse = winEl.querySelector('#copi05-tab-browse');
            const viewDetail = winEl.querySelector('#copi05-view-detail');
            const viewBrowse = winEl.querySelector('#copi05-view-browse');

            let currentDocStatus = '未確認';
            let isCustomerConfirmed = false;
            let quoteList = [];

            const setCustConfirmUI = (confirmed) => {
                isCustomerConfirmed = !!confirmed;
                const chk = winEl.querySelector('#copi05-chk-custconfirm');
                const statusTxt = winEl.querySelector('#copi05-custconfirm-status');
                const btn = winEl.querySelector('#copi05-btn-custconfirm');
                if (isCustomerConfirmed) {
                    chk.checked = true;
                    statusTxt.textContent = '已確認';
                    statusTxt.style.color = '#008000';
                    btn.classList.add('confirmed');
                } else {
                    chk.checked = false;
                    statusTxt.textContent = '未確認';
                    statusTxt.style.color = '#C00000';
                    btn.classList.remove('confirmed');
                }
            };

            winEl.querySelector('#copi05-btn-custconfirm').addEventListener('click', async () => {
                const newStatus = !isCustomerConfirmed;
                setCustConfirmUI(newStatus);
                const quoteNo = fNo.value.trim();
                if (quoteNo) {
                    await ERP_API.post('toggle_cust_confirm', { quote_no: quoteNo, confirmed: newStatus ? 1 : 0 });
                }
                alert(newStatus ? '客戶確認：已確認！' : '客戶確認：已取消確認！');
            });

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
                const rows = winEl.querySelectorAll('#copi05-grid-tbody tr[data-row]');
                rows.forEach(r => {
                    const rowIdx = r.getAttribute('data-row');
                    const iNo = winEl.querySelector(`#copi05-item-no-${rowIdx}`)?.value.trim();
                    const q = parseFloat(winEl.querySelector(`#copi05-qty-${rowIdx}`)?.value) || 0;
                    const a = parseFloat((winEl.querySelector(`#copi05-amount-${rowIdx}`)?.value || '').replace(/,/g, '')) || 0;
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

            // Initialize Dynamic 1-Row Grid
            const grid = Modules.initDynamicGrid(winEl, 'copi05', false, calcTotals);

            const fillQuote = (header, details = []) => {
                fType.value = header.quote_type || 'C211';
                fDocDate.value = header.doc_date || '';
                fQuoteDate.value = header.quote_date || '';
                fNo.value = header.quote_no || '';
                fCustNo.value = header.customer_no || '';
                fCustDesc.textContent = header.customer_name || '';
                fSales.value = header.sales_person || '1001';
                fConfirmUser.value = header.confirm_user || '';
                currentDocStatus = header.status || '未確認';
                setCustConfirmUI(header.customer_confirmed !== 0);
                Modules.setDocStamp(winEl, currentDocStatus);
                grid.fillGrid(details);
            };

            const clearQuote = () => {
                fType.value = 'C211';
                const today = Modules.getTodayStr();
                fDocDate.value = today;
                fQuoteDate.value = today;
                fNo.value = 'C211-' + today.replace(/\//g, '') + String(Math.floor(Math.random() * 899 + 100)).padStart(3, '0');
                fCustNo.value = '';
                fCustDesc.textContent = '';
                fSales.value = '1001';
                fConfirmUser.value = '';
                currentDocStatus = '未確認';
                setCustConfirmUI(false);
                Modules.setDocStamp(winEl, '未確認');
                grid.clearGrid();
                fCustNo.focus();
            };

            const loadBrowseList = async () => {
                const tbody = winEl.querySelector('#copi05-browse-tbody');
                const res = await ERP_API.get('get_quotations');
                if (res.success) {
                    quoteList = res.data || [];
                    if (quoteList.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px; color:#888;">目前尚無報價單資料</td></tr>';
                        return;
                    }
                    let rows = '';
                    quoteList.forEach(q => {
                        rows += `
                            <tr data-no="${q.quote_no}" style="cursor:pointer;">
                                <td style="text-align:center;">▶</td>
                                <td style="font-weight:bold; color:#003366;">${q.quote_no}</td>
                                <td>${q.quote_date || ''}</td>
                                <td>${q.customer_no || ''}</td>
                                <td>${q.customer_name || ''}</td>
                                <td style="text-align:right;">${Math.round(q.quote_amount || 0).toLocaleString()}</td>
                                <td style="text-align:right; font-weight:bold;">${Math.round(q.grand_total || 0).toLocaleString()}</td>
                                <td style="text-align:center; font-weight:bold; color:${q.status === '已確認' ? 'green' : '#999'};">${q.status || '未確認'}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows;

                    tbody.querySelectorAll('tr[data-no]').forEach(tr => {
                        tr.addEventListener('click', async () => {
                            const no = tr.getAttribute('data-no');
                            const detailRes = await ERP_API.get('get_quotation', { quote_no: no });
                            if (detailRes.success && detailRes.quotation) {
                                fillQuote(detailRes.quotation, detailRes.details || []);
                                switchTab('detail');
                            }
                        });
                    });
                }
            };

            // Lookups
            winEl.querySelector('#copi05-lookup-type').addEventListener('click', () => {
                Modules.openLookup('doc_type_quote', (t) => {
                    fType.value = t.code;
                    winEl.querySelector('#copi05-type-desc').textContent = t.name;
                });
            });

            winEl.querySelector('#copi05-lookup-cust').addEventListener('click', () => {
                Modules.openLookup('customer', (c) => {
                    fCustNo.value = c.customer_no || '';
                    fCustDesc.textContent = c.name_short || c.full_name || '';
                });
            });

            winEl.querySelector('#copi05-lookup-sales').addEventListener('click', () => {
                Modules.openLookup('salesperson', (s) => { fSales.value = s.code; });
            });

            winEl.querySelector('#copi05-lookup-currency').addEventListener('click', () => {
                Modules.openLookup('currency', (cur) => { winEl.querySelector('#copi05-currency').value = cur.code; });
            });

            // Toolbar Actions
            winEl.querySelector('#copi05-tb-new').addEventListener('click', clearQuote);
            winEl.querySelector('#copi05-tb-query').addEventListener('click', () => {
                Modules.openLookup('quotation', async (q) => {
                    const res = await ERP_API.get('get_quotation', { quote_no: q.quote_no });
                    if (res.success && res.quotation) {
                        fillQuote(res.quotation, res.details || []);
                    }
                });
            });

            winEl.querySelector('#copi05-tb-save').addEventListener('click', async () => {
                const quoteNo = fNo.value.trim();
                const custNo = fCustNo.value.trim();
                if (!quoteNo || !custNo) {
                    alert('【必填檢查】請輸入或產生報價單號，並挑選客戶代號！');
                    return;
                }

                const details = grid.getRowsData();
                if (details.length === 0) {
                    alert('【明細檢查】請至少在表格中挑選品號並輸入報價數量！');
                    return;
                }

                const payload = {
                    header: {
                        quote_no: quoteNo,
                        quote_type: fType.value.trim() || 'C211',
                        doc_date: fDocDate.value.trim() || Modules.getTodayStr(),
                        quote_date: fQuoteDate.value.trim() || Modules.getTodayStr(),
                        customer_no: custNo,
                        customer_name: fCustDesc.textContent.trim(),
                        sales_person: fSales.value.trim(),
                        status: currentDocStatus,
                        customer_confirmed: isCustomerConfirmed ? 1 : 0
                    },
                    details
                };

                const res = await ERP_API.post('save_quotation', payload);
                if (res.success) {
                    alert(`報價單 [${quoteNo}] 儲存成功！`);
                } else {
                    alert('儲存失敗: ' + (res.error || '不明錯誤'));
                }
            });

            winEl.querySelector('#copi05-tb-confirm').addEventListener('click', async () => {
                const quoteNo = fNo.value.trim();
                if (!quoteNo) return;
                if (confirm(`確定要確認報價單 [${quoteNo}] 嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'quotation', doc_no: quoteNo, status: '已確認' });
                    if (res.success) {
                        currentDocStatus = '已確認';
                        fConfirmUser.value = App.currentUser?.username || 'B18';
                        Modules.setDocStamp(winEl, '已確認');
                        alert('報價單確認完成！');
                    }
                }
            });

            winEl.querySelector('#copi05-tb-unconfirm').addEventListener('click', async () => {
                const quoteNo = fNo.value.trim();
                if (!quoteNo) return;
                if (confirm(`確定要取消報價單 [${quoteNo}] 的確認狀態嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'quotation', doc_no: quoteNo, status: '未確認' });
                    if (res.success) {
                        currentDocStatus = '未確認';
                        fConfirmUser.value = '';
                        Modules.setDocStamp(winEl, '未確認');
                        alert('報價單已取消確認！');
                    }
                }
            });

            winEl.querySelector('#copi05-tb-del').addEventListener('click', async () => {
                const quoteNo = fNo.value.trim();
                if (!quoteNo) return;
                if (confirm(`確定要刪除報價單 [${quoteNo}] 嗎？`)) {
                    const res = await ERP_API.post('delete_quotation', { quote_no: quoteNo });
                    if (res.success) {
                        alert('報價單已刪除！');
                        clearQuote();
                    } else {
                        alert('刪除失敗: ' + (res.error || '不明錯誤'));
                    }
                }
            });
        });
    },

JS);

echo "COPI05 written.\n";
fclose($fp);
