// ========================================================
// Conductor ERP Modules: Sales Management (報價、訂單、銷貨)
// ========================================================

window.Modules = window.Modules || {};

Object.assign(window.Modules, {
    openCOPI05() {
        const u = App.currentUser?.company || '學生區';
        const title = `報價單建立作業(COPI05)[${u}]`;
        const winId = 'COPI05';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">資料(<u>D</u>)</span>
                <span class="erp-menu-item" id="copi05-menu-func" title="功能選單">功能(<u>F</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="新增空白單據" id="copi05-tb-new">📄</button>
                <button class="erp-tb-btn" title="查詢" id="copi05-tb-query">🔍</button>
                <button class="erp-tb-btn" title="修改" id="copi05-tb-edit">✏️</button>
                <button class="erp-tb-btn" title="刪除" id="copi05-tb-del">🗑️</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('報價單報表預覽產生中...')">🖨️</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="首筆" id="copi05-tb-first">|◀</button>
                <button class="erp-tb-btn" title="上筆" id="copi05-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下筆" id="copi05-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="copi05-tb-last">▶|</button>
                <button class="erp-tb-btn tb-btn-crossquery" title="串查作業 (客戶資料/品號查詢)" id="copi05-tb-crossquery">
                    <img src="assets/icons/cross_query.png" alt="串查">
                    <span class="tb-dropdown-arrow">▼</span>
                </button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="儲存" id="copi05-tb-save" style="color:#008000; font-weight:bold; font-size:15px;">✔</button>
                <button class="erp-tb-btn tb-btn-cancel" title="取消 (清除放棄未儲存變更)" id="copi05-tb-cancel" style="color:#CC0000; font-weight:bold; font-size:15px;">✖</button>
                <button class="erp-tb-btn" title="確認" id="copi05-tb-confirm">
                    <img src="assets/icons/confirm_active.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
                <button class="erp-tb-btn" title="取消確認" id="copi05-tb-unconfirm">
                    <img src="assets/icons/unconfirm_disabled.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
                <button class="erp-tb-btn" title="客戶確認 (點擊按鈕自動變更下方打勾狀態)" id="copi05-tb-custconfirm">
                    <img src="assets/icons/cust_confirm.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
                <button class="erp-tb-btn" title="轉客戶訂單 (COPI06)" onclick="Modules.open('COPI06')">📋</button>
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
                            <input type="text" id="copi05-type" class="erp-input-cyan" style="width:70px;" value="">
                            <button class="lookup-icon-btn" id="copi05-lookup-type" title="挑選單別">🔍</button>
                            <span class="erp-field-desc" id="copi05-type-desc"></span>
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
                            <label style="display:inline-flex; align-items:center; gap:3px; font-size:12px; user-select:none; cursor:default;" title="由工具列『客戶確認』按鈕控制，無法直接點擊修改">
                                <input type="checkbox" id="copi05-chk-custconfirm" style="pointer-events:none;" tabindex="-1"> 客戶確認
                            </label>
                        </div>
                        <div class="erp-field" style="margin-left:14px;">
                            <label>確認者</label>
                            <input type="text" id="copi05-confirm-user" class="erp-input-readonly" style="width:65px;" value="" readonly>
                            <span class="erp-field-desc" id="copi05-confirm-user-desc"></span>
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
                            <input type="text" id="copi05-tax-code" style="width:45px;" value="">
                            <button class="lookup-icon-btn" id="copi05-lookup-tax">🔍</button>
                            <span class="erp-field-desc" id="copi05-tax-desc"></span>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>業務人員</label>
                            <input type="text" id="copi05-sales" style="width:75px;" value="">
                            <button class="lookup-icon-btn" id="copi05-lookup-sales">👤</button>
                            <span class="erp-field-desc" id="copi05-sales-desc" style="min-width:90px;"></span>
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
                            <input type="text" id="copi05-currency" class="erp-input-yellow" style="width:65px;" value="">
                            <button class="lookup-icon-btn" id="copi05-lookup-currency">💲</button>
                        </div>
                        <div class="erp-field">
                            <label>營業稅率</label>
                            <input type="text" id="copi05-tax-rate" style="width:65px; text-align:right;" value="">
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

                <!-- Dynamic DataGrid (1:1 擷取1.PNG, 參考圖3) -->
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
                                <th style="width:65px;">數量</th>
                                <th style="width:40px;">單位</th>
                                <th style="width:75px;">單價</th>
                                <th style="width:85px;">金額</th>
                                <th style="width:85px;">預計出貨日</th>
                                <th class="th-yellow" style="width:95px;">生效日</th>
                                <th style="width:95px;">失效日</th>
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
                            <th class="th-cyan" style="width:75px;">報價單別</th>
                            <th class="th-cyan" style="width:120px;">報價單號</th>
                            <th style="width:85px;">報價日期</th>
                            <th style="width:75px;">客戶代號</th>
                            <th style="width:140px;">客戶簡稱</th>
                            <th style="width:85px;">報價金額</th>
                            <th style="width:75px;">稅額</th>
                            <th style="width:85px;">合計</th>
                            <th style="width:85px;">生效日</th>
                            <th style="width:85px;">失效日</th>
                            <th style="width:65px;">狀態</th>
                        </tr>
                    </thead>
                    <tbody id="copi05-browse-tbody">
                        <tr><td colspan="12" style="text-align:center; padding:20px;">載入報價單清單中...</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- 1:1 Window Statusbar (擷取1.PNG) -->
            <div class="erp-window-statusbar">
                <span class="status-cell">瀏覽</span>
                <span class="status-cell" id="copi05-status-msg">單身資料筆數: 0</span>
                <span class="status-cell" id="copi05-status-item"></span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 944, 615, (winEl) => {
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
            const fTaxCode = winEl.querySelector('#copi05-tax-code');
            const fTaxDesc = winEl.querySelector('#copi05-tax-desc');
            const fTaxType = winEl.querySelector('#copi05-tax-type');
            const fTaxRate = winEl.querySelector('#copi05-tax-rate');
            const statusMsg = winEl.querySelector('#copi05-status-msg');

            const tabDetail = winEl.querySelector('#copi05-tab-detail');
            const tabBrowse = winEl.querySelector('#copi05-tab-browse');
            const viewDetail = winEl.querySelector('#copi05-view-detail');
            const viewBrowse = winEl.querySelector('#copi05-view-browse');

            let currentDocStatus = '未確認';
            let isCustomerConfirmed = false;
            let quoteList = [];
            let isDirty = false;

            // Double click on header dates to open calendar
            fDocDate?.addEventListener('dblclick', () => Modules.openCalendar(fDocDate));
            fQuoteDate?.addEventListener('dblclick', () => Modules.openCalendar(fQuoteDate));

            const markDirty = () => { isDirty = true; };
            winEl.addEventListener('input', (e) => {
                if (!e.target.classList.contains('erp-totals-inp')) isDirty = true;
            });
            winEl.addEventListener('change', () => { isDirty = true; });

            const setCustConfirmUI = (confirmed) => {
                isCustomerConfirmed = !!confirmed;
                const chk = winEl.querySelector('#copi05-chk-custconfirm');
                if (chk) chk.checked = isCustomerConfirmed;
            };

            const toggleCustConfirm = async () => {
                const newStatus = !isCustomerConfirmed;
                setCustConfirmUI(newStatus);
                const quoteNo = fNo.value.trim();
                if (quoteNo) {
                    await ERP_API.post('toggle_cust_confirm', { quote_no: quoteNo, confirmed: newStatus ? 1 : 0 });
                }
                Modules.toast(newStatus ? '客戶確認完成！' : '客戶確認已取消！', 'info');
            };

            const tbCustBtn = winEl.querySelector('#copi05-tb-custconfirm');
            if (tbCustBtn) tbCustBtn.addEventListener('click', toggleCustConfirm);

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

            const doSave = async () => {
                const quoteNo = fNo.value.trim();
                const custNo = fCustNo.value.trim();
                if (!quoteNo || !custNo) {
                    alert('【必填檢查】請輸入或產生報價單號，並挑選客戶代號！');
                    return false;
                }

                const details = grid.getRowsData();
                if (details.length === 0) {
                    alert('【明細檢查】請至少在表格中挑選品號並輸入報價數量！');
                    return false;
                }

                const quoteType = fType.value.trim();
                if (!quoteType) {
                    alert('【必填檢查】請輸入或挑選報價單別！');
                    fType.focus();
                    return false;
                }

                // Check dates in grid rows
                for (const r of details) {
                    if (r.effective_date && r.expiry_date && r.expiry_date < r.effective_date) {
                        alert('【日期檢查】失效日不可早於生效日！');
                        return false;
                    }
                }
                const firstRow = details[0] || {};
                const effDate = firstRow.effective_date || Modules.getTodayStr();
                const expDate = firstRow.expiry_date || '';

                const payload = {
                    header: {
                        quote_no: quoteNo,
                        quote_type: quoteType,
                        doc_date: fDocDate.value.trim() || Modules.getTodayStr(),
                        quote_date: fQuoteDate.value.trim() || Modules.getTodayStr(),
                        effective_date: effDate,
                        expiry_date: expDate,
                        customer_no: custNo,
                        customer_name: fCustDesc.textContent.trim(),
                        sales_person: fSales.value.trim(),
                        tax_code: fTaxCode ? fTaxCode.value.trim() : 'S01',
                        tax_type: fTaxType ? (fTaxType.value === '1' ? '1:應稅內含' : (fTaxType.value === '2' ? '2:應稅外加' : (fTaxType.value === '3' ? '3:零稅率' : '4:免稅'))) : '1:應稅內含',
                        tax_rate: fTaxRate ? parseFloat(fTaxRate.value) || 5.0 : 5.0,
                        status: currentDocStatus,
                        customer_confirmed: isCustomerConfirmed ? 1 : 0
                    },
                    details
                };

                const res = await ERP_API.post('save_quotation', payload);
                if (res.success) {
                    isDirty = false;
                    Modules.setFormMode(winEl, grid, 'browse', statusMsg, quoteNo);
                    Modules.toast(`報價單 [${quoteNo}] 儲存成功！`, 'success');
                    return true;
                } else {
                    Modules.toast('儲存失敗: ' + (res.error || '不明錯誤'), 'error');
                    return false;
                }
            };

            const checkDirtyBeforeAction = async (nextAction) => {
                if (isDirty) {
                    const answer = confirm("資料尚未儲存，是否要儲存目前的單據？\n\n點選【確定】：進行儲存\n點選【取消】：直接清除放棄變更");
                    if (answer) {
                        const saved = await doSave();
                        if (saved && typeof nextAction === 'function') {
                            await nextAction();
                        }
                    } else {
                        isDirty = false;
                        if (typeof nextAction === 'function') {
                            await nextAction();
                        }
                    }
                } else {
                    if (typeof nextAction === 'function') {
                        await nextAction();
                    }
                }
            };

            tabDetail.addEventListener('click', () => switchTab('detail'));
            tabBrowse.addEventListener('click', () => checkDirtyBeforeAction(() => switchTab('browse')));

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
                fType.value = header.quote_type || '';
                fDocDate.value = header.doc_date || '';
                fQuoteDate.value = header.quote_date || '';
                fNo.value = header.quote_no || '';
                fCustNo.value = header.customer_no || '';
                fCustDesc.textContent = header.customer_name || '';
                fSales.value = header.sales_person || '';
                const salesDesc = winEl.querySelector('#copi05-sales-desc');
                if (salesDesc) salesDesc.textContent = header.sales_name || (header.sales_person ? '業務員' : '');
                fConfirmUser.value = header.confirm_user || '';
                const confirmDesc = winEl.querySelector('#copi05-confirm-user-desc');
                if (confirmDesc) confirmDesc.textContent = header.confirm_user ? (App.currentUser?.company || ('學生區' + (App.currentUser?.username || ''))) : '';
                if (fTaxCode) fTaxCode.value = header.tax_code || 'S01';
                if (fTaxDesc) fTaxDesc.textContent = header.tax_desc || (header.tax_code === 'S05' ? '銷項三聯式發票-應稅外加' : '銷項二聯式發票-應稅內含');
                if (fTaxRate && header.tax_rate !== undefined) fTaxRate.value = parseFloat(header.tax_rate).toFixed(3);
                if (fTaxType && header.tax_type) {
                    fTaxType.value = header.tax_type.includes('2') ? '2' : (header.tax_type.includes('1') ? '1' : (header.tax_type.includes('3') ? '3' : '4'));
                }
                currentDocStatus = header.status || '未確認';
                Modules.setDocStamp(winEl, currentDocStatus);
                Modules.updateAuditButtons(winEl, currentDocStatus === '已確認', 'copi05');
                const isCust = (header.customer_confirmed == 1 || header.cust_confirm == 1);
                setCustConfirmUI(isCust);
                grid.fillGrid(details);
                Modules.setFormMode(winEl, grid, 'browse', statusMsg, header.quote_no);
                isDirty = false;
            };

            const clearQuote = async () => {
                fType.value = '';
                const typeDesc = winEl.querySelector('#copi05-type-desc');
                if (typeDesc) typeDesc.textContent = '';
                const today = Modules.getTodayStr();
                fDocDate.value = today;
                fQuoteDate.value = today;
                fNo.value = await Modules.generateNextDocNo('quotation', today);
                fCustNo.value = '';
                fCustDesc.textContent = '';
                fSales.value = '';
                const salesDesc = winEl.querySelector('#copi05-sales-desc');
                if (salesDesc) salesDesc.textContent = '';
                fConfirmUser.value = '';
                const confirmDesc = winEl.querySelector('#copi05-confirm-user-desc');
                if (confirmDesc) confirmDesc.textContent = '';
                if (fTaxCode) fTaxCode.value = 'S01';
                if (fTaxDesc) fTaxDesc.textContent = '銷項二聯式發票-應稅內含';
                if (fTaxRate) fTaxRate.value = '5.000';
                if (fTaxType) fTaxType.value = '1';
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '未確認');
                Modules.updateAuditButtons(winEl, false, 'copi05');
                setCustConfirmUI(false);
                grid.clearGrid(true);
                Modules.setFormMode(winEl, grid, 'add', statusMsg, fNo.value);
                fCustNo.focus();
                isDirty = false;
            };

            const resetQuoteBlank = () => {
                fType.value = '';
                const typeDesc = winEl.querySelector('#copi05-type-desc');
                if (typeDesc) typeDesc.textContent = '';
                fDocDate.value = '';
                fQuoteDate.value = '';
                fNo.value = '';
                fCustNo.value = '';
                fCustDesc.textContent = '';
                fSales.value = '';
                const salesDesc = winEl.querySelector('#copi05-sales-desc');
                if (salesDesc) salesDesc.textContent = '';
                fConfirmUser.value = '';
                const confirmDesc = winEl.querySelector('#copi05-confirm-user-desc');
                if (confirmDesc) confirmDesc.textContent = '';
                if (fTaxCode) fTaxCode.value = '';
                if (fTaxDesc) fTaxDesc.textContent = '';
                if (fTaxRate) fTaxRate.value = '';
                if (fTaxType) fTaxType.value = '1';
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '');
                Modules.updateAuditButtons(winEl, false, 'copi05');
                setCustConfirmUI(false);
                grid.clearGrid(false);
                fTotAmt.value = '0';
                fTotTax.value = '0';
                fTotGrand.value = '0';
                fTotQty.value = '0';
                Modules.setFormMode(winEl, grid, 'browse', statusMsg, '');
                isDirty = false;
            };

            const loadBrowseList = async () => {
                const tbody = winEl.querySelector('#copi05-browse-tbody');
                const res = await ERP_API.get('get_quotations');
                if (res.success) {
                    quoteList = res.data || [];
                    if (quoteList.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="12" style="text-align:center; padding:20px; color:#888;">目前尚無報價單資料</td></tr>';
                        return;
                    }
                    let rows = '';
                    quoteList.forEach(q => {
                        rows += `
                            <tr data-no="${q.quote_no}" style="cursor:pointer;">
                                <td style="text-align:center;">▶</td>
                                <td>${q.quote_type || 'C211'}</td>
                                <td style="font-weight:bold; color:#003366;">${q.quote_no}</td>
                                <td>${q.quote_date || ''}</td>
                                <td>${q.customer_no || ''}</td>
                                <td>${q.customer_name || ''}</td>
                                <td style="text-align:right;">${Math.round(q.quote_amount || 0).toLocaleString()}</td>
                                <td style="text-align:right;">${Math.round(q.tax_amount || 0).toLocaleString()}</td>
                                <td style="text-align:right; font-weight:bold;">${Math.round(q.grand_total || 0).toLocaleString()}</td>
                                <td style="text-align:center;">${q.effective_date || ''}</td>
                                <td style="text-align:center;">${q.expiry_date || ''}</td>
                                <td style="text-align:center; font-weight:bold; color:${q.status === '已確認' ? 'green' : '#999'};">${q.status || '未確認'}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows;

                    tbody.querySelectorAll('tr[data-no]').forEach(tr => {
                        tr.addEventListener('click', async () => {
                            const no = tr.getAttribute('data-no');
                            checkDirtyBeforeAction(async () => {
                                const detailRes = await ERP_API.get('get_quotation', { quote_no: no });
                                if (detailRes.success && detailRes.quotation) {
                                    fillQuote(detailRes.quotation, detailRes.details || []);
                                    switchTab('detail');
                                }
                            });
                        });
                    });
                }
            };

            // Lookups
            winEl.querySelector('#copi05-lookup-type').addEventListener('click', () => {
                Modules.openLookup('doc_type_quote', (t) => {
                    fType.value = t.code;
                    winEl.querySelector('#copi05-type-desc').textContent = t.name;
                    markDirty();
                });
            });

            winEl.querySelector('#copi05-lookup-cust').addEventListener('click', () => {
                Modules.openLookup('customer', (c) => {
                    fCustNo.value = c.customer_no || '';
                    fCustDesc.textContent = c.name_short || c.full_name || '';
                    if (c.tax_code && fTaxCode) {
                        fTaxCode.value = c.tax_code;
                        if (fTaxDesc) fTaxDesc.textContent = c.tax_name || '';
                    }
                    if (c.tax_rate !== undefined && fTaxRate) {
                        fTaxRate.value = parseFloat(c.tax_rate).toFixed(3);
                    }
                    if (c.tax_type && fTaxType) {
                        if (c.tax_type.includes('1:')) fTaxType.value = '1';
                        else if (c.tax_type.includes('2:')) fTaxType.value = '2';
                        else if (c.tax_type.includes('3:')) fTaxType.value = '3';
                        else if (c.tax_type.includes('4:')) fTaxType.value = '4';
                    }
                    markDirty();
                });
            });

            winEl.querySelector('#copi05-lookup-sales').addEventListener('click', () => {
                Modules.openLookup('personnel', (s) => {
                    fSales.value = s.emp_no || s.code;
                    const desc = winEl.querySelector('#copi05-sales-desc');
                    if (desc) desc.textContent = s.emp_name || s.name;
                    markDirty();
                });
            });

            winEl.querySelector('#copi05-lookup-currency').addEventListener('click', () => {
                Modules.openLookup('currency', (cur) => {
                    winEl.querySelector('#copi05-currency').value = cur.code;
                    markDirty();
                });
            });

            const taxBtn = winEl.querySelector('#copi05-lookup-tax');
            if (taxBtn) {
                taxBtn.addEventListener('click', () => {
                    Modules.openLookup('tax_order', (tc) => {
                        if (fTaxCode) fTaxCode.value = tc.code;
                        if (fTaxDesc) fTaxDesc.textContent = tc.name;
                        if (fTaxType && tc.tax_type) {
                            if (tc.tax_type.includes('1:')) fTaxType.value = '1';
                            else if (tc.tax_type.includes('2:')) fTaxType.value = '2';
                            else if (tc.tax_type.includes('3:')) fTaxType.value = '3';
                            else if (tc.tax_type.includes('4:')) fTaxType.value = '4';
                        }
                        if (fTaxRate && tc.rate !== undefined) {
                            fTaxRate.value = parseFloat(tc.rate).toFixed(3);
                        }
                        markDirty();
                    });
                });
            }
            fTaxCode?.addEventListener('dblclick', () => {
                taxBtn?.click();
            });

            // Copy Quote function (複製單據 / 複製前筆)
            const copyQuote = async () => {
                const curNo = fNo.value.trim();
                const curCust = fCustNo.value.trim();
                if (curNo && curCust) {
                    if (confirm(`是否以目前報價單【${curNo}】為範本複製產生新單據？`)) {
                        const today = Modules.getTodayStr();
                        const newDocNo = await Modules.generateNextDocNo('quotation', today);
                        fNo.value = newDocNo;
                        fDocDate.value = today;
                        fQuoteDate.value = today;
                        fConfirmUser.value = '';
                        currentDocStatus = '未確認';
                        setCustConfirmUI(false);
                        Modules.setDocStamp(winEl, '未確認');
                        Modules.updateAuditButtons(winEl, false, 'copi05');
                        markDirty();
                        alert(`已成功複製單據【${curNo}】之內容！\n已為您產生新單號：【${newDocNo}】\n客戶與單身品號資料皆已帶入，請確認後點擊「💾 儲存」。`);
                    }
                } else {
                    Modules.openLookup('quotation', async (q) => {
                        const res = await ERP_API.get('get_quotation', { quote_no: q.quote_no });
                        if (res.success && res.quotation) {
                            fillQuote(res.quotation, res.details || []);
                            const today = Modules.getTodayStr();
                            const newDocNo = await Modules.generateNextDocNo('quotation', today);
                            fNo.value = newDocNo;
                            fDocDate.value = today;
                            fQuoteDate.value = today;
                            fConfirmUser.value = '';
                            currentDocStatus = '未確認';
                            setCustConfirmUI(false);
                            Modules.setDocStamp(winEl, '未確認');
                            Modules.updateAuditButtons(winEl, false, 'copi05');
                            markDirty();
                            alert(`已成功複製單據【${q.quote_no}】！\n新單號為：【${newDocNo}】，請確認後儲存。`);
                        }
                    });
                }
            };

            // Navigation handler
            const navQuote = async (dir) => {
                const curNo = fNo.value.trim();
                const res = await ERP_API.get('nav_quotation', { dir, current: curNo });
                if (res.success && res.data) {
                    fillQuote(res.data, res.details || []);
                }
            };
            const bindNav = (btnId, dir) => {
                const btn = winEl.querySelector(btnId);
                if (btn) btn.addEventListener('click', () => checkDirtyBeforeAction(() => navQuote(dir)));
            };
            bindNav('#copi05-tb-first', 'first');
            bindNav('#copi05-tb-prev', 'prev');
            bindNav('#copi05-tb-next', 'next');
            bindNav('#copi05-tb-last', 'last');

            // Toolbar Actions
            winEl.querySelector('#copi05-tb-new').addEventListener('click', () => checkDirtyBeforeAction(() => {
                clearQuote();
                switchTab('detail');
            }));
            winEl.querySelector('#copi05-tb-edit').addEventListener('click', () => {
                const curNo = fNo.value.trim();
                if (!curNo) {
                    alert('請先查詢單據或點選「新增」！');
                    return;
                }
                switchTab('detail');
                Modules.setFormMode(winEl, grid, 'edit', statusMsg, curNo);
                Modules.toast(`報價單 [${curNo}] 進入修改模式`, 'info');
            });
            // 串查作業按鈕連動 (1:1 對照截圖 media_1794200000639_072ccb99.png)
            const copi05CrossQueryBtn = winEl.querySelector('#copi05-tb-crossquery');
            if (copi05CrossQueryBtn) {
                copi05CrossQueryBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const curType = fType ? fType.value.trim() : '';
                    const curNum = fNo ? fNo.value.trim() : '';
                    let fullQuoteNo = '';
                    if (curType && curNum) {
                        fullQuoteNo = curNum.includes('-') ? curNum : `${curType}-${curNum}`;
                    } else {
                        fullQuoteNo = curNum || '';
                    }

                    const curCustNo = fCustNo ? fCustNo.value.trim() : '';
                    const curCustName = fCustDesc ? fCustDesc.textContent.trim() : '';

                    let curItemNo = '';
                    let curItemName = '';
                    const itemInputs = winEl.querySelectorAll('#copi05-grid-tbody input[id^="copi05-item-no-"]');
                    for (const inp of itemInputs) {
                        if (inp.value.trim()) {
                            curItemNo = inp.value.trim();
                            const rIdx = inp.id.replace('copi05-item-no-', '');
                            const nameInp = winEl.querySelector(`#copi05-item-name-${rIdx}`);
                            curItemName = nameInp ? nameInp.value.trim() : '';
                            break;
                        }
                    }

                    Modules.showCrossQueryMenu(copi05CrossQueryBtn, {
                        quoteNo: fullQuoteNo,
                        customerNo: curCustNo,
                        customerName: curCustName,
                        itemNo: curItemNo,
                        itemName: curItemName,
                        currentModule: 'COPI05',
                        includeTreeQuery: false
                    });
                });
            }

            const copi05MenuFunc = winEl.querySelector('#copi05-menu-func');
            if (copi05MenuFunc) copi05MenuFunc.addEventListener('click', () => Modules.toast('報價單作業無前置單據', 'info'));
            winEl.querySelector('#copi05-tb-query').addEventListener('click', () => {
                checkDirtyBeforeAction(() => {
                    Modules.openLookup('quotation', async (q) => {
                        const targetNo = q.quote_no || q.no || '';
                        const res = await ERP_API.get('get_quotation', { quote_no: targetNo });
                        const doc = res.quotation || res.header;
                        if (res.success && doc) {
                            fillQuote(doc, res.details || []);
                            switchTab('detail');
                        } else {
                            alert(res.error || '查無此報價單資料');
                        }
                    });
                });
            });

            winEl.querySelector('#copi05-tb-save').addEventListener('click', doSave);

            winEl.querySelector('#copi05-tb-cancel').addEventListener('click', () => {
                if (isDirty) {
                    const answer = confirm("資料尚未儲存，是否要儲存目前的單據？\n\n點選【確定】：進行儲存\n點選【取消】：直接清除放棄變更");
                    if (answer) {
                        doSave();
                    } else {
                        resetQuoteBlank();
                        Modules.toast('已取消並清除未儲存變更。', 'info');
                    }
                } else {
                    resetQuoteBlank();
                    Modules.toast('已清除重置頁面資料。', 'info');
                }
            });

            winEl.querySelector('#copi05-tb-confirm').addEventListener('click', async () => {
                const btn = winEl.querySelector('#copi05-tb-confirm');
                if (btn && btn.disabled) return;
                const quoteNo = fNo.value.trim();
                currentDocStatus = '已確認';
                fConfirmUser.value = App.currentUser?.username || '';
                const confirmDesc = winEl.querySelector('#copi05-confirm-user-desc');
                if (confirmDesc) confirmDesc.textContent = App.currentUser?.company || ('學生區' + (App.currentUser?.username || ''));
                Modules.setDocStamp(winEl, '已確認');
                Modules.updateAuditButtons(winEl, true, 'copi05');
                if (quoteNo) {
                    await ERP_API.post('confirm_doc', { type: 'quotation', doc_no: quoteNo, status: '已確認', confirm_user: fConfirmUser.value });
                }
                Modules.toast('報價單確認完成！', 'success');
            });

            winEl.querySelector('#copi05-tb-unconfirm').addEventListener('click', async () => {
                const btn = winEl.querySelector('#copi05-tb-unconfirm');
                if (btn && btn.disabled) return;
                const quoteNo = fNo.value.trim();
                currentDocStatus = '未確認';
                fConfirmUser.value = '';
                const confirmDesc = winEl.querySelector('#copi05-confirm-user-desc');
                if (confirmDesc) confirmDesc.textContent = '';
                Modules.setDocStamp(winEl, '未確認');
                Modules.updateAuditButtons(winEl, false, 'copi05');
                if (quoteNo) {
                    await ERP_API.post('confirm_doc', { type: 'quotation', doc_no: quoteNo, status: '未確認', confirm_user: '' });
                }
                Modules.toast('報價單已取消確認！', 'info');
            });

            winEl.querySelector('#copi05-tb-del').addEventListener('click', async () => {
                const quoteNo = fNo.value.trim();
                if (!quoteNo) return;
                if (confirm(`確定要刪除報價單 [${quoteNo}] 嗎？`)) {
                    const res = await ERP_API.post('delete_quotation', { quote_no: quoteNo });
                    if (res.success) {
                        Modules.toast('報價單已成功刪除！', 'success');
                        clearQuote();
                    } else {
                        Modules.toast('刪除失敗: ' + (res.error || '不明錯誤'), 'error');
                    }
                }
            });

            // Window BeforeClose protection
            if (App.windows[winId]) {
                App.windows[winId].beforeClose = () => {
                    if (isDirty) {
                        return confirm("目前視窗有尚未儲存的資料，確定要直接關閉視窗嗎？\n（未儲存的變更將會遺失）");
                    }
                    return true;
                };
            }

            // Initial load: 100% 空白模式，按新增或查詢才出現
            resetQuoteBlank();
        });
    },

    // ========================================================
    // 客戶訂單 - 複製前置單據對話框 (1:1 參考截圖 media_1793952175673_32b03065.jpg)
    // ========================================================
    openCopyPreDocDialog(onConfirm) {
        const u = App.currentUser?.company || ('學生區' + (App.currentUser?.username || ''));
        const modal = document.createElement('div');
        modal.className = 'erp-lookup-overlay';
        modal.style.zIndex = '999999';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';

        const dialog = document.createElement('div');
        dialog.className = 'erp-lookup-window';
        dialog.style.width = '370px';
        dialog.style.height = 'auto';
        dialog.style.minHeight = '210px';
        dialog.style.boxShadow = '2px 2px 14px rgba(0,0,0,0.4)';
        dialog.style.border = '2px outset #ffffff';
        dialog.style.borderRadius = '3px';
        dialog.style.overflow = 'hidden';

        dialog.innerHTML = `
            <div class="erp-lookup-titlebar" style="background: linear-gradient(to bottom, #7292C2 0%, #4D74A9 100%); height:25px; display:flex; align-items:center; justify-content:space-between; padding:0 6px; user-select:none;">
                <div class="win-title" style="display:flex; align-items:center; gap:4px; font-size:12px; color:#ffffff;">
                    <span class="win-wf-badge">Wf</span>
                    <span>客戶訂單建立作業 (COPI06)[${u}]</span>
                </div>
                <div class="win-controls" style="display:flex; gap:2px;">
                    <button type="button" class="win-btn minimize" style="font-size:11px; cursor:pointer;" title="最小化">_</button>
                    <button type="button" class="win-btn maximize" style="font-size:11px; cursor:pointer;" title="最大化">▢</button>
                    <button type="button" class="win-btn close erp-predoc-close" style="font-size:11px; cursor:pointer;" title="關閉">✕</button>
                </div>
            </div>
            <div style="background:#ECE9D8; padding:18px 22px 16px 22px; font-size:12px; font-family:Tahoma, 'Microsoft JhengHei', sans-serif; display:flex; flex-direction:column; gap:12px;">
                <!-- 複製來源 -->
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:12px; color:#000; width:58px; white-space:nowrap;">複製來源</span>
                    <div style="display:inline-flex; align-items:center; gap:16px; border:1px solid #7F9DB9; padding:4px 14px; background:#ECE9D8; border-radius:2px;">
                        <label style="display:flex; align-items:center; gap:4px; margin:0; cursor:pointer; font-size:12px; color:#000;">
                            <input type="radio" name="copi06-predoc-src" id="copi06-src-quote" value="quotation" checked style="margin:0; cursor:pointer;">
                            <span>報價單</span>
                        </label>
                        <label style="display:flex; align-items:center; gap:4px; margin:0; cursor:pointer; font-size:12px; color:#000;">
                            <input type="radio" name="copi06-predoc-src" id="copi06-src-contract" value="contract" style="margin:0; cursor:pointer;">
                            <span>合約訂單</span>
                        </label>
                    </div>
                </div>

                <!-- 第 1 行：前置單別 (單號的開窗按鈕放在單別後面) -->
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:12px; color:#000; width:58px; white-space:nowrap;">前置單別</span>
                    <div style="display:flex; align-items:center; gap:4px;">
                        <input type="text" id="copi06-predoc-type" class="erp-input-yellow" style="width:105px; height:21px; font-size:12px; padding:1px 4px; background:#FFFFB0; border:1px solid #7F9DB9;" value="" placeholder="單號選擇後帶入">
                        <button type="button" class="lookup-icon-btn" id="copi06-predoc-btn-no" title="挑選前置單號" style="width:22px; height:21px; display:flex; align-items:center; justify-content:center; cursor:pointer;">🔍</button>
                    </div>
                </div>

                <!-- 第 2 行：前置單號 (純輸入框) -->
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:12px; color:#000; width:58px; white-space:nowrap;">前置單號</span>
                    <div style="display:flex; align-items:center; gap:4px;">
                        <input type="text" id="copi06-predoc-no" class="erp-input-yellow" style="width:131px; height:21px; font-size:12px; padding:1px 4px; background:#FFFFB0; border:1px solid #7F9DB9;" value="" placeholder="請挑選或輸入單號">
                    </div>
                </div>

                <!-- 確定 / 取消 按鈕列 -->
                <div style="display:flex; justify-content:center; align-items:center; gap:36px; margin-top:8px; padding-top:6px; border-top:1px solid #D4D0C8;">
                    <button type="button" id="copi06-predoc-btn-confirm" style="display:flex; align-items:center; justify-content:center; gap:6px; min-width:76px; height:25px; background:#ECE9D8; border:2px outset #ffffff; cursor:pointer; font-size:12px; font-family:inherit;">
                        <span style="color:#008000; font-weight:bold; font-size:14px; line-height:1;">✔</span> 確定
                    </button>
                    <button type="button" id="copi06-predoc-btn-cancel" style="display:flex; align-items:center; justify-content:center; gap:6px; min-width:76px; height:25px; background:#ECE9D8; border:2px outset #ffffff; cursor:pointer; font-size:12px; font-family:inherit;">
                        <span style="color:#CC0000; font-weight:bold; font-size:14px; line-height:1;">✖</span> 取消
                    </button>
                </div>
            </div>
        `;

        modal.appendChild(dialog);
        document.body.appendChild(modal);

        const closeDialog = () => {
            document.removeEventListener('keydown', handleKeydown);
            if (modal.parentNode) modal.parentNode.removeChild(modal);
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeDialog();
        };
        document.addEventListener('keydown', handleKeydown);

        dialog.querySelectorAll('.erp-predoc-close, #copi06-predoc-btn-cancel, .minimize').forEach(el => {
            el.addEventListener('click', closeDialog);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeDialog();
        });

        const rQuote = dialog.querySelector('#copi06-src-quote');
        const rContract = dialog.querySelector('#copi06-src-contract');
        const fNo = dialog.querySelector('#copi06-predoc-no');
        const fType = dialog.querySelector('#copi06-predoc-type');
        const btnNo = dialog.querySelector('#copi06-predoc-btn-no');
        const btnConfirm = dialog.querySelector('#copi06-predoc-btn-confirm');

        rQuote.addEventListener('change', () => {
            if (rQuote.checked) {
                fType.value = '';
                fNo.value = '';
            }
        });
        rContract.addEventListener('change', () => {
            if (rContract.checked) {
                fType.value = '';
                fNo.value = '';
            }
        });

        btnNo.addEventListener('click', () => {
            const isQuote = rQuote.checked;
            Modules.openLookup(isQuote ? 'quotation' : 'order', (item) => {
                if (isQuote) {
                    fNo.value = item.quote_no || '';
                    fType.value = item.quote_type || item.doc_type || 'A211';
                } else {
                    fNo.value = item.order_no || '';
                    fType.value = item.order_type || item.doc_type || 'A221';
                }
            });
        });

        const autoFetchTypeByNo = async () => {
            const docNo = fNo.value.trim();
            if (!docNo) {
                fType.value = '';
                return;
            }
            const isQuote = rQuote.checked;
            try {
                const res = await ERP_API.get(isQuote ? 'get_quotation' : 'get_order', isQuote ? { quote_no: docNo } : { order_no: docNo });
                if (res.success && (res.header || res.quotation || res.order)) {
                    const h = res.header || res.quotation || res.order;
                    fType.value = (isQuote ? h.quote_type : h.order_type) || (isQuote ? 'A211' : 'A221');
                }
            } catch (err) {
                // Ignore silent fetch
            }
        };

        fNo.addEventListener('change', autoFetchTypeByNo);
        fNo.addEventListener('blur', autoFetchTypeByNo);

        btnConfirm.addEventListener('click', async () => {
            const isQuote = rQuote.checked;
            const docNo = fNo.value.trim();
            let docType = fType.value.trim();

            if (!docNo) {
                alert('請輸入或挑選前置單號！');
                fNo.focus();
                return;
            }

            if (isQuote) {
                const res = await ERP_API.get('get_quotation', { quote_no: docNo });
                if (res.success && (res.header || res.quotation)) {
                    const header = res.quotation || res.header;
                    const details = res.details || [];
                    const finalDocType = docType || header.quote_type || 'A211';
                    closeDialog();
                    if (typeof onConfirm === 'function') {
                        onConfirm({
                            source: 'quotation',
                            preDocType: finalDocType,
                            preDocNo: docNo,
                            header,
                            details
                        });
                    }
                } else {
                    alert(`查無此報價單【${docNo}】！請確認單號是否正確。`);
                }
            } else {
                const res = await ERP_API.get('get_order', { order_no: docNo });
                if (res.success && (res.header || res.order)) {
                    const header = res.order || res.header;
                    const details = res.details || [];
                    const finalDocType = docType || header.order_type || 'A221';
                    closeDialog();
                    if (typeof onConfirm === 'function') {
                        onConfirm({
                            source: 'contract',
                            preDocType: finalDocType,
                            preDocNo: docNo,
                            header,
                            details
                        });
                    }
                } else {
                    alert(`查無此合約訂單【${docNo}】！請確認單號是否正確。`);
                }
            }
        });
    },

    openCOPI06() {
        const u = App.currentUser?.company || '學生區';
        const title = `客戶訂單建立作業(COPI06)[${u}]`;
        const winId = 'COPI06';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">資料(<u>D</u>)</span>
                <span class="erp-menu-item" id="copi06-menu-func" title="功能選單：複製前置單據">功能(<u>F</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="新增空白訂單" id="copi06-tb-new">📄</button>
                <button class="erp-tb-btn" title="查詢" id="copi06-tb-query">🔍</button>
                <button class="erp-tb-btn" title="修改" id="copi06-tb-edit">✏️</button>
                <button class="erp-tb-btn" title="刪除" id="copi06-tb-del">🗑️</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('客戶訂單報表產生中...')">🖨️</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="首筆" id="copi06-tb-first">|◀</button>
                <button class="erp-tb-btn" title="上筆" id="copi06-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下筆" id="copi06-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="copi06-tb-last">▶|</button>
                <button class="erp-tb-btn tb-btn-crossquery" title="串查作業 (客戶資料/品號查詢/訂單樹狀資訊查詢)" id="copi06-tb-crossquery">
                    <img src="assets/icons/cross_query.png" alt="串查">
                    <span class="tb-dropdown-arrow">▼</span>
                </button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="儲存" id="copi06-tb-save" style="color:#008000; font-weight:bold; font-size:15px;">✔</button>
                <button class="erp-tb-btn tb-btn-cancel" title="取消 (清除放棄未儲存變更)" id="copi06-tb-cancel" style="color:#CC0000; font-weight:bold; font-size:15px;">✖</button>
                <button class="erp-tb-btn" title="確認" id="copi06-tb-confirm">
                    <img src="assets/icons/confirm_active.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
                <button class="erp-tb-btn" title="取消確認" id="copi06-tb-unconfirm">
                    <img src="assets/icons/unconfirm_disabled.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
                <button class="erp-tb-btn btn-transfer" title="訂單轉請購單 (COPB10) - 庫存不足採購請購" id="copi06-tb-tobatch">📦</button>
                <button class="erp-tb-btn btn-transfer" title="訂單轉銷貨單 (COPI08) - 庫存足夠直接出貨" id="copi06-tb-todelivery" style="background:#EBF3FB; border-color:#003366; font-size:11px; font-weight:bold; color:#003366; padding:0 6px; display:inline-flex; align-items:center; gap:2px; height:24px;">🚚 轉銷貨單</button>
                <button class="erp-tb-btn" title="複製前置單據 (複製報價單或合約訂單產生訂單)" id="copi06-tb-copy">
                    <img src="assets/icons/tb_copy.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
            </div>

            <!-- Top Tab Header -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="copi06-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="copi06-tab-browse">資料瀏覽</button>
            </div>

            <!-- Detail View (1:1 參考圖3 - media_1793969883181_6e08444b.png / 擷取3.PNG) -->
            <div id="copi06-view-detail" style="display:flex; flex-direction:column; flex:1; min-height:0; overflow:hidden;">
                <div class="erp-header-panel" style="padding:4px 8px; background:#ECE9D8; border-bottom:1px solid #7F9DB9; flex-shrink:0;">
                    <div class="erp-stamp-he" style="display:none;">核</div>
                    <!-- Row 1 -->
                    <div class="erp-form-row" style="margin-bottom:2px;">
                        <div class="erp-field">
                            <label style="width:55px;">訂單單別</label>
                            <input type="text" id="copi06-type" class="erp-input-cyan" style="width:75px;" value="">
                            <button type="button" class="lookup-icon-btn" id="copi06-lookup-type" title="挑選單別">📄</button>
                            <span class="erp-field-desc" id="copi06-type-desc"></span>
                        </div>
                        <div class="erp-field" style="margin-left:20px;">
                            <label style="width:55px;">單據日期</label>
                            <input type="text" id="copi06-doc-date" class="erp-input-yellow" style="width:85px; text-align:center;" value="">
                            <input type="checkbox" id="copi06-chk-date" style="margin-left:3px;">
                        </div>
                        <div class="erp-field" style="margin-left:20px;">
                            <label style="width:55px;">拋轉狀態</label>
                            <input type="text" id="copi06-trans-status" class="erp-input-readonly" style="width:80px;" value="" readonly>
                        </div>
                    </div>
                    <!-- Row 2 -->
                    <div class="erp-form-row" style="margin-bottom:2px;">
                        <div class="erp-field">
                            <label style="width:55px;">訂單單號</label>
                            <input type="text" id="copi06-no" class="erp-input-cyan" style="width:125px;" value="">
                        </div>
                        <div class="erp-field" style="margin-left:20px;">
                            <label style="width:55px;">客戶代號</label>
                            <input type="text" id="copi06-cust-no" class="erp-input-yellow" style="width:80px;" value="">
                            <button type="button" class="lookup-icon-btn" id="copi06-lookup-cust" title="挑選客戶">🏢</button>
                            <span class="erp-field-desc" id="copi06-cust-desc" style="min-width:70px;"></span>
                        </div>
                        <div class="erp-field" style="margin-left:20px;">
                            <label style="width:55px;">訂單日期</label>
                            <input type="text" id="copi06-order-date" style="width:85px; text-align:center;" value="">
                        </div>
                    </div>
                    <!-- Row 3 -->
                    <div class="erp-form-row" style="margin-bottom:2px;">
                        <div class="erp-field">
                            <label style="width:55px;">流程代號</label>
                            <input type="text" id="copi06-flow-no" style="width:75px;" value="">
                            <button type="button" class="lookup-icon-btn" id="copi06-lookup-flow" title="挑選流程">📄</button>
                        </div>
                        <div class="erp-field" style="margin-left:20px;">
                            <label style="width:55px;">版次</label>
                            <input type="text" id="copi06-version" style="width:40px; text-align:center;" value="">
                            <label style="display:flex; align-items:center; gap:2px; margin-left:12px; cursor:pointer;">
                                <input type="checkbox" id="copi06-chk-credit"> 不控管信用額度
                            </label>
                        </div>
                        <div class="erp-field" style="margin-left:20px;">
                            <label style="width:55px;">確認者</label>
                            <input type="text" id="copi06-confirm-user" class="erp-input-readonly" style="width:80px;" value="" readonly>
                        </div>
                    </div>
                    <!-- Row 4 -->
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label style="width:75px;">收入遞延天數</label>
                            <input type="text" id="copi06-defer-days" style="width:45px; text-align:right;" value="0">
                        </div>
                        <div class="erp-field" style="margin-left:20px;">
                            <label style="width:75px;">EBO拋轉狀態</label>
                            <input type="text" id="copi06-ebo-status" class="erp-input-readonly" style="width:85px;" value="不需拋轉" readonly>
                        </div>
                    </div>
                </div>

                <!-- Subtab Header (1:1 參考圖3) -->
                <div class="erp-subtab-header" style="flex-shrink:0; overflow-x:auto; display:flex; align-items:center; background:#ECE9D8; border-bottom:1px solid #7F9DB9; padding:2px 4px 0 4px;">
                    <button type="button" class="erp-subtab-btn active" data-subtab="trade1">交易資料一</button>
                    <button type="button" class="erp-subtab-btn" data-subtab="trade2">交易資料二</button>
                    <button type="button" class="erp-subtab-btn" data-subtab="delivery">送貨資料</button>
                    <button type="button" class="erp-subtab-btn" data-subtab="overseas1">國外訂單一</button>
                    <button type="button" class="erp-subtab-btn" data-subtab="overseas2">國外訂單二</button>
                    <button type="button" class="erp-subtab-btn" data-subtab="overseas_memo">國外備註</button>
                    <button type="button" class="erp-subtab-btn" data-subtab="mark">嘜頭資料</button>
                    <button type="button" class="erp-subtab-btn" data-subtab="multi_trade">多角貿易資料</button>
                    <div style="margin-left:auto; display:flex; gap:2px;">
                        <button type="button" class="cal-nav-btn" style="width:16px; height:18px; padding:0; font-size:10px;">◀</button>
                        <button type="button" class="cal-nav-btn" style="width:16px; height:18px; padding:0; font-size:10px;">▶</button>
                    </div>
                </div>

                <!-- Subtab Content: 交易資料一 (1:1 參考圖3 - 3欄版面) -->
                <div id="copi06-subtab-trade1" class="erp-tab-content" style="flex-shrink:0; display:flex; gap:16px; padding:4px 10px; background:#ECE9D8; font-size:12px;">
                    <!-- Col 1 -->
                    <div style="display:flex; flex-direction:column; gap:3px; min-width:210px;">
                        <div class="erp-field">
                            <label style="width:55px;">部門代號</label>
                            <input type="text" id="copi06-dept" style="width:80px;" value="">
                            <button type="button" class="lookup-icon-btn" id="copi06-lookup-dept" title="挑選部門">👥</button>
                            <span class="erp-field-desc" id="copi06-dept-desc"></span>
                        </div>
                        <div class="erp-field">
                            <label style="width:55px;">業務人員</label>
                            <input type="text" id="copi06-sales" style="width:80px;" value="">
                            <button type="button" class="lookup-icon-btn" id="copi06-lookup-sales" title="挑選業務">👤</button>
                            <span class="erp-field-desc" id="copi06-sales-desc"></span>
                        </div>
                        <div class="erp-field">
                            <label style="width:55px;">出貨廠別</label>
                            <input type="text" id="copi06-factory" class="erp-input-yellow" style="width:65px;" value="">
                            <button type="button" class="lookup-icon-btn" id="copi06-lookup-factory" title="挑選廠別">🏭</button>
                        </div>
                        <div class="erp-field">
                            <label style="width:55px;">交易幣別</label>
                            <input type="text" id="copi06-currency" class="erp-input-yellow" style="width:65px;" value="NTD">
                            <button type="button" class="lookup-icon-btn" id="copi06-lookup-currency" title="挑選幣別">💲</button>
                        </div>
                        <div class="erp-field">
                            <label style="width:55px;">匯率</label>
                            <input type="text" id="copi06-rate" style="width:80px; text-align:right;" value="0">
                            <span style="font-size:12px; margin-left:4px;">💲</span>
                        </div>
                        <div class="erp-field">
                            <label style="width:55px;">客戶單號</label>
                            <input type="text" id="copi06-cust-po" style="width:130px;" value="">
                        </div>
                    </div>

                    <!-- Col 2 -->
                    <div style="display:flex; flex-direction:column; gap:4px; flex:1;">
                        <div class="erp-field">
                            <label style="width:55px;">稅別碼</label>
                            <input type="text" id="copi06-tax-code" class="erp-input-yellow" style="width:45px;" value="S05">
                            <button type="button" class="lookup-icon-btn" id="copi06-lookup-tax" title="挑選稅別">📄</button>
                            <span class="erp-field-desc" id="copi06-tax-desc">銷項三聯式發票-應稅外加</span>
                        </div>
                        <div class="erp-field">
                            <label style="width:55px;">課稅別</label>
                            <select id="copi06-tax-type" style="width:115px;">
                                <option value="2:應稅外加" selected>2:應稅外加</option>
                                <option value="1:應稅內含">1:應稅內含</option>
                                <option value="3:零稅率">3:零稅率</option>
                                <option value="4:免稅">4:免稅</option>
                                <option value="9:不計稅">9:不計稅</option>
                            </select>
                        </div>
                        <div class="erp-field">
                            <label style="width:55px;">營業稅率</label>
                            <input type="text" id="copi06-tax-rate" style="width:55px; text-align:right;" value="5.000">
                            <span style="margin-left:4px;">%</span>
                        </div>
                        <div class="erp-field">
                            <label style="width:auto; cursor:pointer;"><input type="checkbox" id="copi06-chk-deposit"> 訂金分批</label>
                        </div>
                        <div class="erp-field">
                            <label style="width:55px;">訂金比率</label>
                            <input type="text" id="copi06-deposit-rate" style="width:50px; text-align:right;" value="">
                            <span style="margin-left:4px;">%</span>
                        </div>
                        <div class="erp-field">
                            <label style="width:55px;">付款條件</label>
                            <input type="text" id="copi06-payment-term" style="width:75px;" value="">
                            <button type="button" class="lookup-icon-btn">📄</button>
                        </div>
                        <div class="erp-field">
                            <label style="width:55px;">價格條件</label>
                            <input type="text" id="copi06-price-term" style="width:200px;" value="">
                            <button type="button" class="lookup-icon-btn">📝</button>
                        </div>
                    </div>

                    <!-- Col 3 -->
                    <div style="display:flex; flex-direction:column; gap:4px; min-width:160px;">
                        <div class="erp-field">
                            <label style="width:auto; cursor:pointer;"><input type="checkbox" id="copi06-chk-multitax"> 單身多稅率</label>
                        </div>
                        <div class="erp-field">
                            <label style="width:55px;">傳送次數</label>
                            <input type="text" id="copi06-send-count" class="erp-input-readonly" style="width:50px; text-align:center;" value="0" readonly>
                        </div>
                        <div class="erp-field">
                            <label style="width:55px;">列印</label>
                            <input type="text" id="copi06-print-count" class="erp-input-readonly" style="width:50px; text-align:center;" value="0" readonly>
                        </div>
                        <div class="erp-field">
                            <label style="width:55px;">簽核狀態</label>
                            <input type="text" id="copi06-sign-status" class="erp-input-readonly" style="width:95px;" value="N:不執行電子簽核" readonly>
                        </div>
                    </div>
                </div>

                <!-- Dynamic DataGrid (1:1 參考圖3) -->
                <div class="erp-datagrid-container" style="flex:1; min-height:80px; overflow:auto;">
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
                            <th class="th-cyan" style="width:75px;">訂單單別</th>
                            <th class="th-cyan" style="width:120px;">訂單單號</th>
                            <th style="width:85px;">訂單日期</th>
                            <th style="width:75px;">客戶代號</th>
                            <th style="width:140px;">客戶簡稱</th>
                            <th style="width:85px;">訂單金額</th>
                            <th style="width:75px;">稅額</th>
                            <th style="width:85px;">合計</th>
                            <th style="width:65px;">狀態</th>
                        </tr>
                    </thead>
                    <tbody id="copi06-browse-tbody">
                        <tr><td colspan="10" style="text-align:center; padding:20px;">載入訂單清單中...</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Statusbar -->
            <div class="erp-window-statusbar" style="flex-shrink:0;">
                <span class="status-cell">瀏覽</span>
                <span class="status-cell" id="copi06-status-msg">單身資料筆數: 0</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 960, 675, (winEl) => {
            const fType = winEl.querySelector('#copi06-type');
            const fTypeDesc = winEl.querySelector('#copi06-type-desc');
            const fDocDate = winEl.querySelector('#copi06-doc-date');
            const fOrderDate = winEl.querySelector('#copi06-order-date');
            const fNo = winEl.querySelector('#copi06-no');
            const fCustNo = winEl.querySelector('#copi06-cust-no');
            const fCustDesc = winEl.querySelector('#copi06-cust-desc');
            const fTransStatus = winEl.querySelector('#copi06-trans-status');
            const fFlowNo = winEl.querySelector('#copi06-flow-no');
            const fVersion = winEl.querySelector('#copi06-version');
            const fChkCredit = winEl.querySelector('#copi06-chk-credit');
            const fConfirmUser = winEl.querySelector('#copi06-confirm-user');
            const fDeferDays = winEl.querySelector('#copi06-defer-days');
            const fEboStatus = winEl.querySelector('#copi06-ebo-status');

            const fDept = winEl.querySelector('#copi06-dept');
            const fDeptDesc = winEl.querySelector('#copi06-dept-desc');
            const fSales = winEl.querySelector('#copi06-sales');
            const fSalesDesc = winEl.querySelector('#copi06-sales-desc');
            const fFactory = winEl.querySelector('#copi06-factory');
            const fCurrency = winEl.querySelector('#copi06-currency');
            const fRate = winEl.querySelector('#copi06-rate');
            const fCustPo = winEl.querySelector('#copi06-cust-po');

            const fTaxCode = winEl.querySelector('#copi06-tax-code');
            const fTaxDesc = winEl.querySelector('#copi06-tax-desc');
            const fTaxType = winEl.querySelector('#copi06-tax-type');
            const fTaxRate = winEl.querySelector('#copi06-tax-rate');
            const fChkDeposit = winEl.querySelector('#copi06-chk-deposit');
            const fDepositRate = winEl.querySelector('#copi06-deposit-rate');
            const fPaymentTerm = winEl.querySelector('#copi06-payment-term');
            const fPriceTerm = winEl.querySelector('#copi06-price-term');

            const fChkMultitax = winEl.querySelector('#copi06-chk-multitax');
            const fSendCount = winEl.querySelector('#copi06-send-count');
            const fPrintCount = winEl.querySelector('#copi06-print-count');
            const fSignStatus = winEl.querySelector('#copi06-sign-status');

            const fTotAmt = winEl.querySelector('#copi06-tot-amt');
            const fTotTax = winEl.querySelector('#copi06-tot-tax');
            const fTotGrand = winEl.querySelector('#copi06-tot-grand');
            const fTotQty = winEl.querySelector('#copi06-tot-qty');
            const fTotWeight = winEl.querySelector('#copi06-tot-weight');
            const fTotCuft = winEl.querySelector('#copi06-tot-cuft');
            const statusMsg = winEl.querySelector('#copi06-status-msg');

            const tabDetail = winEl.querySelector('#copi06-tab-detail');
            const tabBrowse = winEl.querySelector('#copi06-tab-browse');
            const viewDetail = winEl.querySelector('#copi06-view-detail');
            const viewBrowse = winEl.querySelector('#copi06-view-browse');

            let currentDocStatus = '未確認';
            let orderList = [];
            let isDirty = false;

            const markDirty = () => { isDirty = true; };
            winEl.addEventListener('input', (e) => {
                if (!e.target.classList.contains('erp-totals-inp')) isDirty = true;
            });
            winEl.addEventListener('change', () => { isDirty = true; });

            // Double click on date inputs to open calendar
            fDocDate?.addEventListener('dblclick', () => Modules.openCalendar(fDocDate));
            fOrderDate?.addEventListener('dblclick', () => Modules.openCalendar(fOrderDate));

            // Lookup bindings
            const pickType = () => {
                Modules.openLookup('doc_type_order', (d) => {
                    fType.value = d.code;
                    if (fTypeDesc) fTypeDesc.textContent = d.name;
                    markDirty();
                });
            };
            winEl.querySelector('#copi06-lookup-type')?.addEventListener('click', pickType);
            fType?.addEventListener('dblclick', pickType);

            const pickCust = () => {
                Modules.openLookup('customer', (c) => {
                    fCustNo.value = c.customer_no || c.cust_no || '';
                    if (fCustDesc) fCustDesc.textContent = c.name_short || c.customer_name || c.cust_name || c.short_name || '';
                    if (c.tax_code && fTaxCode) {
                        fTaxCode.value = c.tax_code;
                        if (fTaxDesc) fTaxDesc.textContent = c.tax_name || '';
                    }
                    if (c.tax_rate !== undefined && fTaxRate) {
                        fTaxRate.value = parseFloat(c.tax_rate).toFixed(3);
                    }
                    if (c.tax_type && fTaxType) {
                        fTaxType.value = c.tax_type;
                    }
                    if (c.payment_term && fPaymentTerm) {
                        fPaymentTerm.value = c.payment_term;
                    }
                    markDirty();
                });
            };
            winEl.querySelector('#copi06-lookup-cust')?.addEventListener('click', pickCust);
            fCustNo?.addEventListener('dblclick', pickCust);

            winEl.querySelector('#copi06-lookup-flow')?.addEventListener('click', () => {
                Modules.openLookup('doc_type_order', (d) => {
                    if (fFlowNo) fFlowNo.value = d.code;
                    markDirty();
                });
            });
            winEl.querySelector('#copi06-lookup-dept')?.addEventListener('click', () => {
                Modules.openLookup('department', (d) => {
                    fDept.value = d.dept_no;
                    if (fDeptDesc) fDeptDesc.textContent = d.dept_name || '';
                    markDirty();
                });
            });

            const pickSales = () => {
                Modules.openLookup('personnel', (p) => {
                    fSales.value = p.emp_no || p.code || '';
                    if (fSalesDesc) fSalesDesc.textContent = p.emp_name || p.name || '';
                    markDirty();
                });
            };
            winEl.querySelector('#copi06-lookup-sales')?.addEventListener('click', pickSales);
            fSales?.addEventListener('dblclick', pickSales);

            const pickFactory = () => {
                Modules.openLookup('factory', (f) => {
                    if (fFactory) fFactory.value = f.factory_no || f.code || '';
                    markDirty();
                });
            };
            winEl.querySelector('#copi06-lookup-factory')?.addEventListener('click', pickFactory);
            fFactory?.addEventListener('dblclick', pickFactory);

            winEl.querySelector('#copi06-lookup-currency')?.addEventListener('click', () => {
                Modules.openLookup('currency', (c) => {
                    fCurrency.value = c.currency_no || c.code || '';
                    markDirty();
                });
            });

            winEl.querySelector('#copi06-lookup-tax')?.addEventListener('click', () => {
                Modules.openLookup('tax_order', (t) => {
                    if (fTaxCode) fTaxCode.value = t.code;
                    if (fTaxDesc) fTaxDesc.textContent = t.name;
                    if (fTaxType && t.tax_type) fTaxType.value = t.tax_type;
                    if (fTaxRate && t.rate !== undefined) fTaxRate.value = parseFloat(t.rate).toFixed(3);
                    markDirty();
                });
            });
            fTaxCode?.addEventListener('dblclick', () => {
                winEl.querySelector('#copi06-lookup-tax')?.click();
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

            const doSave = async () => {
                const orderNo = fNo.value.trim();
                const custNo = fCustNo.value.trim();
                if (!orderNo || !custNo) {
                    alert('【必填檢查】請輸入訂單單號並挑選客戶代號！');
                    return false;
                }

                const details = grid.getRowsData().map(d => ({
                    ...d,
                    order_qty: d.qty,
                    unit_price: d.price
                }));
                if (details.length === 0) {
                    alert('【明細檢查】請至少在表格中挑選品號並輸入數量！');
                    return false;
                }

                const orderType = fType.value.trim();
                if (!orderType) {
                    alert('【必填檢查】請輸入或挑選訂單單別！');
                    fType.focus();
                    return false;
                }

                const payload = {
                    header: {
                        order_no: orderNo,
                        order_type: orderType,
                        doc_date: fDocDate.value.trim() || Modules.getTodayStr(),
                        order_date: fOrderDate.value.trim() || Modules.getTodayStr(),
                        customer_no: custNo,
                        customer_name: fCustDesc.textContent.trim(),
                        version: fVersion ? fVersion.value.trim() : '1',
                        flow_code: fFlowNo ? fFlowNo.value.trim() : '',
                        defer_days: fDeferDays ? (parseInt(fDeferDays.value, 10) || 0) : 0,
                        credit_control: fChkCredit && fChkCredit.checked ? 1 : 0,
                        transfer_status: fTransStatus ? fTransStatus.value.trim() : '',
                        confirm_user: fConfirmUser ? fConfirmUser.value.trim() : '',
                        ebo_status: fEboStatus ? fEboStatus.value.trim() : '不需拋轉',
                        dept: fDept ? fDept.value.trim() : '',
                        sales_person: fSales ? fSales.value.trim() : '',
                        factory: fFactory ? fFactory.value.trim() : '01',
                        currency: fCurrency ? (fCurrency.value.trim() || 'NTD') : 'NTD',
                        exchange_rate: fRate ? (parseFloat(fRate.value) || 0) : 0,
                        cust_po: fCustPo ? fCustPo.value.trim() : '',
                        tax_code: fTaxCode ? fTaxCode.value.trim() : 'S05',
                        tax_type: fTaxType ? fTaxType.value : '2:應稅外加',
                        tax_rate: fTaxRate ? (parseFloat(fTaxRate.value) || 5.0) : 5.0,
                        deposit_batch: fChkDeposit && fChkDeposit.checked ? 1 : 0,
                        deposit_rate: fDepositRate ? (parseFloat(fDepositRate.value) || 0) : 0,
                        payment_term: fPaymentTerm ? fPaymentTerm.value.trim() : '',
                        price_term: fPriceTerm ? fPriceTerm.value.trim() : '',
                        multi_tax: fChkMultitax && fChkMultitax.checked ? 1 : 0,
                        send_count: fSendCount ? (parseInt(fSendCount.value, 10) || 0) : 0,
                        print_count: fPrintCount ? (parseInt(fPrintCount.value, 10) || 0) : 0,
                        sign_status: fSignStatus ? fSignStatus.value.trim() : 'N:不執行電子簽核',
                        order_amount: parseFloat((fTotAmt.value || '').replace(/,/g, '')) || 0,
                        order_tax: parseFloat((fTotTax.value || '').replace(/,/g, '')) || 0,
                        grand_total: parseFloat((fTotGrand.value || '').replace(/,/g, '')) || 0,
                        total_qty: parseFloat((fTotQty.value || '').replace(/,/g, '')) || 0,
                        status: currentDocStatus
                    },
                    details
                };

                const res = await ERP_API.post('save_order', payload);
                if (res.success) {
                    isDirty = false;
                    Modules.setFormMode(winEl, grid, 'browse', statusMsg, orderNo);
                    Modules.toast(`客戶訂單 [${orderNo}] 儲存成功！`, 'success');
                    return true;
                } else {
                    Modules.toast('儲存失敗: ' + (res.error || '不明錯誤'), 'error');
                    return false;
                }
            };

            const checkDirtyBeforeAction = async (nextAction) => {
                if (isDirty) {
                    const answer = confirm("資料尚未儲存，是否要儲存目前的單據？\n\n點選【確定】：進行儲存\n點選【取消】：直接清除放棄變更");
                    if (answer) {
                        const saved = await doSave();
                        if (saved && typeof nextAction === 'function') {
                            await nextAction();
                        }
                    } else {
                        isDirty = false;
                        if (typeof nextAction === 'function') {
                            await nextAction();
                        }
                    }
                } else {
                    if (typeof nextAction === 'function') {
                        await nextAction();
                    }
                }
            };

            tabDetail.addEventListener('click', () => switchTab('detail'));
            tabBrowse.addEventListener('click', () => checkDirtyBeforeAction(() => switchTab('browse')));

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
                if (fTotWeight) fTotWeight.value = '0';
                if (fTotCuft) fTotCuft.value = '0';
                statusMsg.textContent = `單身資料筆數: ${rowCount}`;
            };

            const grid = Modules.initDynamicGrid(winEl, 'copi06', true, calcTotals);

            const fillOrder = (header, details = []) => {
                fType.value = header.order_type || '';
                fDocDate.value = header.doc_date || '';
                fOrderDate.value = header.order_date || '';
                fNo.value = header.order_no || '';
                fCustNo.value = header.customer_no || '';
                fCustDesc.textContent = header.customer_name || '';
                if (fTransStatus) fTransStatus.value = header.transfer_status || '';
                if (fFlowNo) fFlowNo.value = header.flow_code || '';
                if (fVersion) fVersion.value = header.version || '';
                if (fChkCredit) fChkCredit.checked = (header.credit_control == 1);
                if (fDeferDays) fDeferDays.value = header.defer_days !== undefined ? header.defer_days : '0';
                if (fEboStatus) fEboStatus.value = header.ebo_status || '不需拋轉';
                if (fDept) fDept.value = header.dept || '';
                if (fDeptDesc) fDeptDesc.textContent = header.dept ? '業務部' : '';
                if (fSales) fSales.value = header.sales_person || '';
                if (fSalesDesc) fSalesDesc.textContent = header.sales_person ? '業務員' : '';
                if (fFactory) fFactory.value = header.factory || '';
                if (fCurrency) fCurrency.value = header.currency || 'NTD';
                if (fRate) fRate.value = header.exchange_rate !== undefined ? header.exchange_rate : '0';
                if (fCustPo) fCustPo.value = header.cust_po || '';
                if (fTaxCode) fTaxCode.value = header.tax_code || 'S05';
                if (fTaxDesc) fTaxDesc.textContent = header.tax_desc || (header.tax_code === 'S01' ? '銷項二聯式發票-應稅內含' : '銷項三聯式發票-應稅外加');
                if (fTaxType) fTaxType.value = header.tax_type || '2:應稅外加';
                if (fTaxRate) fTaxRate.value = header.tax_rate !== undefined ? header.tax_rate : '5.000';
                if (fChkDeposit) fChkDeposit.checked = (header.deposit_batch == 1);
                if (fDepositRate) fDepositRate.value = header.deposit_rate || '';
                if (fPaymentTerm) fPaymentTerm.value = header.payment_term || '';
                if (fPriceTerm) fPriceTerm.value = header.price_term || '';
                if (fChkMultitax) fChkMultitax.checked = (header.multi_tax == 1);
                if (fSendCount) fSendCount.value = header.send_count || '0';
                if (fPrintCount) fPrintCount.value = header.print_count || '0';
                if (fSignStatus) fSignStatus.value = header.sign_status || 'N:不執行電子簽核';
                if (fConfirmUser) fConfirmUser.value = header.confirm_user || '';
                const confirmDesc = winEl.querySelector('#copi06-confirm-user-desc');
                if (confirmDesc) confirmDesc.textContent = header.confirm_user ? (App.currentUser?.company || ('學生區' + (App.currentUser?.username || ''))) : '';
                currentDocStatus = header.status || '未確認';
                const isConfirmed = (currentDocStatus === '已確認' || currentDocStatus === 'Y' || !!header.confirm_user);
                Modules.updateAuditButtons(winEl, isConfirmed, 'copi06');
                grid.fillGrid(details);
                Modules.setFormMode(winEl, grid, 'browse', statusMsg, header.order_no);
                isDirty = false;
            };

            const clearOrder = async () => {
                fType.value = '';
                if (fTypeDesc) fTypeDesc.textContent = '';
                const today = Modules.getTodayStr();
                fDocDate.value = today;
                fOrderDate.value = today;
                fNo.value = await Modules.generateNextDocNo('order', today);
                fCustNo.value = '';
                fCustDesc.textContent = '';
                if (fTransStatus) fTransStatus.value = '';
                if (fFlowNo) fFlowNo.value = '';
                if (fVersion) fVersion.value = '';
                if (fChkCredit) fChkCredit.checked = false;
                if (fDeferDays) fDeferDays.value = '0';
                if (fEboStatus) fEboStatus.value = '不需拋轉';
                if (fDept) fDept.value = '';
                if (fDeptDesc) fDeptDesc.textContent = '';
                if (fSales) fSales.value = '';
                if (fSalesDesc) fSalesDesc.textContent = '';
                if (fFactory) fFactory.value = '';
                if (fCurrency) fCurrency.value = 'NTD';
                if (fRate) fRate.value = '0';
                if (fCustPo) fCustPo.value = '';
                if (fTaxCode) fTaxCode.value = 'S05';
                if (fTaxDesc) fTaxDesc.textContent = '銷項三聯式發票-應稅外加';
                if (fTaxType) fTaxType.value = '2:應稅外加';
                if (fTaxRate) fTaxRate.value = '5.000';
                if (fChkDeposit) fChkDeposit.checked = false;
                if (fDepositRate) fDepositRate.value = '';
                if (fPaymentTerm) fPaymentTerm.value = '';
                if (fPriceTerm) fPriceTerm.value = '';
                if (fChkMultitax) fChkMultitax.checked = false;
                if (fSendCount) fSendCount.value = '0';
                if (fPrintCount) fPrintCount.value = '0';
                if (fSignStatus) fSignStatus.value = 'N:不執行電子簽核';
                if (fConfirmUser) fConfirmUser.value = '';
                const confirmDesc = winEl.querySelector('#copi06-confirm-user-desc');
                if (confirmDesc) confirmDesc.textContent = '';
                currentDocStatus = '未確認';
                Modules.updateAuditButtons(winEl, false, 'copi06');
                grid.clearGrid(true);
                Modules.setFormMode(winEl, grid, 'add', statusMsg, fNo.value);
                fCustNo.focus();
                isDirty = false;
            };

            const resetBlank = () => {
                fType.value = '';
                if (fTypeDesc) fTypeDesc.textContent = '';
                fDocDate.value = '';
                fOrderDate.value = '';
                fNo.value = '';
                fCustNo.value = '';
                fCustDesc.textContent = '';
                if (fTransStatus) fTransStatus.value = '';
                if (fFlowNo) fFlowNo.value = '';
                if (fVersion) fVersion.value = '';
                if (fChkCredit) fChkCredit.checked = false;
                if (fDeferDays) fDeferDays.value = '0';
                if (fEboStatus) fEboStatus.value = '不需拋轉';
                if (fDept) fDept.value = '';
                if (fDeptDesc) fDeptDesc.textContent = '';
                if (fSales) fSales.value = '';
                if (fSalesDesc) fSalesDesc.textContent = '';
                if (fFactory) fFactory.value = '';
                if (fCurrency) fCurrency.value = '';
                if (fRate) fRate.value = '0';
                if (fCustPo) fCustPo.value = '';
                if (fTaxCode) fTaxCode.value = 'S05';
                if (fTaxDesc) fTaxDesc.textContent = '銷項三聯式發票-應稅外加';
                if (fTaxType) fTaxType.value = '2:應稅外加';
                if (fTaxRate) fTaxRate.value = '5.000';
                if (fChkDeposit) fChkDeposit.checked = false;
                if (fDepositRate) fDepositRate.value = '';
                if (fPaymentTerm) fPaymentTerm.value = '';
                if (fPriceTerm) fPriceTerm.value = '';
                if (fChkMultitax) fChkMultitax.checked = false;
                if (fSendCount) fSendCount.value = '0';
                if (fPrintCount) fPrintCount.value = '0';
                if (fSignStatus) fSignStatus.value = 'N:不執行電子簽核';
                if (fConfirmUser) fConfirmUser.value = '';
                const confirmDesc = winEl.querySelector('#copi06-confirm-user-desc');
                if (confirmDesc) confirmDesc.textContent = '';
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '');
                Modules.updateAuditButtons(winEl, false, 'copi06');
                grid.clearGrid(false);
                fTotAmt.value = '0';
                fTotTax.value = '0';
                fTotGrand.value = '0';
                fTotQty.value = '0';
                if (fTotWeight) fTotWeight.value = '0';
                if (fTotCuft) fTotCuft.value = '0';
                Modules.setFormMode(winEl, grid, 'browse', statusMsg, '');
                isDirty = false;
            };

            const loadBrowseList = async () => {
                const tbody = winEl.querySelector('#copi06-browse-tbody');
                const res = await ERP_API.get('get_orders');
                if (res.success) {
                    orderList = res.data || [];
                    if (orderList.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding:20px; color:#888;">目前尚無客戶訂單</td></tr>';
                        return;
                    }
                    let rows = '';
                    orderList.forEach(o => {
                        rows += `
                            <tr data-no="${o.order_no}" style="cursor:pointer;">
                                <td style="text-align:center;">▶</td>
                                <td>${o.order_type || ''}</td>
                                <td style="font-weight:bold; color:#003366;">${o.order_no}</td>
                                <td>${o.order_date || ''}</td>
                                <td>${o.customer_no || ''}</td>
                                <td>${o.customer_name || ''}</td>
                                <td style="text-align:right;">${Math.round(o.order_amount || 0).toLocaleString()}</td>
                                <td style="text-align:right;">${Math.round(o.order_tax || 0).toLocaleString()}</td>
                                <td style="text-align:right; font-weight:bold;">${Math.round(o.grand_total || 0).toLocaleString()}</td>
                                <td style="text-align:center; font-weight:bold; color:${o.status === '已確認' ? 'green' : '#999'};">${o.status || '未確認'}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows;

                    tbody.querySelectorAll('tr[data-no]').forEach(tr => {
                        tr.addEventListener('click', async () => {
                            const no = tr.getAttribute('data-no');
                            checkDirtyBeforeAction(async () => {
                                const detailRes = await ERP_API.get('get_order', { order_no: no });
                                if (detailRes.success && detailRes.order) {
                                    fillOrder(detailRes.order, detailRes.details || []);
                                    switchTab('detail');
                                }
                            });
                        });
                    });
                }
            };

            // Copy Pre-Doc (複製前置單據 - 1:1 參考截圖 media_1793952175673_32b03065.jpg)
            const copyPreDoc = () => {
                Modules.openCopyPreDocDialog(async (doc) => {
                    const h = doc.header;
                    const details = doc.details || [];

                    // Customer
                    fCustNo.value = h.customer_no || '';
                    fCustDesc.textContent = h.customer_name || '';

                    // Sales person & Dept
                    fSales.value = h.sales_person || '';
                    const salesDesc = winEl.querySelector('#copi06-sales-desc');
                    if (salesDesc) salesDesc.textContent = h.sales_name || (h.sales_person ? '業務員' : '');
                    fDept.value = h.dept || '1000';
                    const deptDesc = winEl.querySelector('#copi06-dept-desc');
                    if (deptDesc) deptDesc.textContent = '業務部';

                    // Currency
                    if (fCurrency) fCurrency.value = h.currency || 'NTD';

                    // Generate new order number and dates
                    const today = Modules.getTodayStr();
                    fDocDate.value = today;
                    fOrderDate.value = today;
                    const nextNo = await Modules.generateNextDocNo('order', today);
                    fNo.value = nextNo;
                    const orderType = (doc.source === 'contract' ? (doc.header.order_type || 'A221') : (doc.header.quote_type === 'C211' ? 'C221' : (doc.header.quote_type === 'C212' ? 'C222' : 'A221')));
                    fType.value = orderType;
                    if (fTypeDesc) {
                        const typeNames = { 'A221': '國內訂單', 'A222': '國外訂單', 'C221': '配銷訂單內', 'C222': '配銷訂單外' };
                        fTypeDesc.textContent = typeNames[orderType] || '國內訂單';
                    }

                    // Reset Audit and Status to 未確認
                    currentDocStatus = '未確認';
                    fConfirmUser.value = '';
                    const confirmDesc = winEl.querySelector('#copi06-confirm-user-desc');
                    if (confirmDesc) confirmDesc.textContent = '';
                    Modules.setDocStamp(winEl, '未確認');
                    Modules.updateAuditButtons(winEl, false, 'copi06');

                    // Populate details
                    const orderDetails = details.map((d, idx) => ({
                        line_no: String(idx + 1).padStart(4, '0'),
                        biz_item_no: d.biz_item_no || '',
                        item_no: d.item_no || '',
                        item_name: d.item_name || '',
                        item_spec: d.item_spec || '',
                        order_qty: Number(d.qty != null ? d.qty : (d.order_qty || 0)),
                        unit: d.unit || 'PC',
                        unit_price: Number(d.unit_price || 0),
                        amount: Number(d.amount || ((d.qty != null ? d.qty : (d.order_qty || 0)) * (d.unit_price || 0))),
                        est_delivery_date: d.delivery_date || d.est_delivery_date || today,
                        warehouse: d.warehouse || 'P003'
                    }));

                    if (orderDetails.length === 0) {
                        grid.clearGrid(true);
                    } else {
                        grid.fillGrid(orderDetails);
                    }

                    Modules.setFormMode(winEl, grid, 'add', statusMsg, nextNo);
                    markDirty();
                    Modules.toast(`已成功由前置單據【${doc.preDocNo}】複製帶入訂單！新單號為【${nextNo}】。`, 'success');
                });
            };

            // Navigation handler
            const navOrder = async (dir) => {
                const curNo = fNo.value.trim();
                const res = await ERP_API.get('nav_order', { dir, current: curNo });
                if (res.success && res.data) {
                    fillOrder(res.data, res.data.details || []);
                }
            };
            const bindNav = (btnId, dir) => {
                const btn = winEl.querySelector(btnId);
                if (btn) btn.addEventListener('click', () => checkDirtyBeforeAction(() => navOrder(dir)));
            };
            bindNav('#copi06-tb-first', 'first');
            bindNav('#copi06-tb-prev', 'prev');
            bindNav('#copi06-tb-next', 'next');
            bindNav('#copi06-tb-last', 'last');

            // Toolbar Actions
            winEl.querySelector('#copi06-tb-new').addEventListener('click', () => checkDirtyBeforeAction(() => {
                clearOrder();
                switchTab('detail');
            }));
            winEl.querySelector('#copi06-tb-edit').addEventListener('click', () => {
                const curNo = fNo.value.trim();
                if (!curNo) {
                    alert('請先查詢單據或點選「新增」！');
                    return;
                }
                switchTab('detail');
                Modules.setFormMode(winEl, grid, 'edit', statusMsg, curNo);
                Modules.toast(`客戶訂單 [${curNo}] 進入修改模式`, 'info');
            });
            // 串查作業按鈕連動 (1:1 擷取666.PNG + 查詢品號 + 訂單樹狀資訊查詢)
            const copi06CrossQueryBtn = winEl.querySelector('#copi06-tb-crossquery');
            if (copi06CrossQueryBtn) {
                copi06CrossQueryBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const curType = fType ? fType.value.trim() : '';
                    const curNum = fNo ? fNo.value.trim() : '';
                    let fullOrderNo = '';
                    if (curType && curNum) {
                        fullOrderNo = curNum.includes('-') ? curNum : `${curType}-${curNum}`;
                    } else {
                        fullOrderNo = curNum || '';
                    }

                    const curCustNo = fCustNo ? fCustNo.value.trim() : '';
                    const curCustName = fCustDesc ? fCustDesc.textContent.trim() : '';

                    // 尋找當前選中或首筆品號
                    let curItemNo = '';
                    let curItemName = '';
                    const itemInputs = winEl.querySelectorAll('#copi06-grid-tbody input[id^="copi06-item-no-"]');
                    for (const inp of itemInputs) {
                        if (inp.value.trim()) {
                            curItemNo = inp.value.trim();
                            const rIdx = inp.id.replace('copi06-item-no-', '');
                            const nameInp = winEl.querySelector(`#copi06-item-name-${rIdx}`);
                            curItemName = nameInp ? nameInp.value.trim() : '';
                            break;
                        }
                    }

                    Modules.showCrossQueryMenu(copi06CrossQueryBtn, {
                        orderNo: fullOrderNo,
                        customerNo: curCustNo,
                        customerName: curCustName,
                        itemNo: curItemNo,
                        itemName: curItemName,
                        currentModule: 'COPI06',
                        includeTreeQuery: true
                    });
                });
            }

            const copi06CopyBtn = winEl.querySelector('#copi06-tb-copy');
            if (copi06CopyBtn) copi06CopyBtn.addEventListener('click', () => checkDirtyBeforeAction(copyPreDoc));
            const copi06MenuFunc = winEl.querySelector('#copi06-menu-func');
            if (copi06MenuFunc) copi06MenuFunc.addEventListener('click', () => checkDirtyBeforeAction(copyPreDoc));
            winEl.querySelector('#copi06-tb-query').addEventListener('click', () => {
                checkDirtyBeforeAction(() => {
                    Modules.openLookup('order', async (o) => {
                        const targetNo = o.order_no || o.no || '';
                        const res = await ERP_API.get('get_order', { order_no: targetNo });
                        const doc = res.order || res.header;
                        if (res.success && doc) {
                            fillOrder(doc, res.details || []);
                            switchTab('detail');
                        } else {
                            alert(res.error || '查無此訂單資料');
                        }
                    });
                });
            });

            winEl.querySelector('#copi06-tb-save').addEventListener('click', doSave);

            winEl.querySelector('#copi06-tb-cancel').addEventListener('click', () => {
                if (isDirty) {
                    const answer = confirm("資料尚未儲存，是否要儲存目前的單據？\n\n點選【確定】：進行儲存\n點選【取消】：直接清除放棄變更");
                    if (answer) {
                        doSave();
                    } else {
                        resetBlank();
                        Modules.toast('已取消並清除未儲存變更。', 'info');
                    }
                } else {
                    resetBlank();
                    Modules.toast('已清除重置頁面資料。', 'info');
                }
            });

            winEl.querySelector('#copi06-tb-confirm').addEventListener('click', async () => {
                const btn = winEl.querySelector('#copi06-tb-confirm');
                if (btn && btn.disabled) return;
                const orderNo = fNo.value.trim();
                if (!orderNo) return;
                const res = await ERP_API.post('confirm_doc', { type: 'order', doc_no: orderNo, status: '已確認' });
                if (res.success) {
                    currentDocStatus = '已確認';
                    fConfirmUser.value = App.currentUser?.username || '';
                    const confirmDesc = winEl.querySelector('#copi06-confirm-user-desc');
                    if (confirmDesc) confirmDesc.textContent = App.currentUser?.company || ('學生區' + (App.currentUser?.username || ''));
                    Modules.updateAuditButtons(winEl, true, 'copi06');
                    Modules.toast('訂單確認完成！', 'success');
                }
            });

            winEl.querySelector('#copi06-tb-unconfirm').addEventListener('click', async () => {
                const btn = winEl.querySelector('#copi06-tb-unconfirm');
                if (btn && btn.disabled) return;
                const orderNo = fNo.value.trim();
                if (!orderNo) return;
                const res = await ERP_API.post('confirm_doc', { type: 'order', doc_no: orderNo, status: '未確認' });
                if (res.success) {
                    currentDocStatus = '未確認';
                    fConfirmUser.value = '';
                    const confirmDesc = winEl.querySelector('#copi06-confirm-user-desc');
                    if (confirmDesc) confirmDesc.textContent = '';
                    Modules.updateAuditButtons(winEl, false, 'copi06');
                    Modules.toast('訂單已取消確認！', 'info');
                }
            });

            winEl.querySelector('#copi06-tb-del').addEventListener('click', async () => {
                const orderNo = fNo.value.trim();
                if (!orderNo) return;
                if (confirm(`確定要刪除訂單 [${orderNo}] 嗎？`)) {
                    const res = await ERP_API.post('delete_order', { order_no: orderNo });
                    if (res.success) {
                        Modules.toast('訂單已成功刪除！', 'success');
                        clearOrder();
                    } else {
                        Modules.toast('刪除失敗: ' + (res.error || '不明錯誤'), 'error');
                    }
                }
            });

            winEl.querySelector('#copi06-tb-tobatch').addEventListener('click', () => {
                Modules.openCOPB10(fNo.value.trim());
            });

            winEl.querySelector('#copi06-tb-todelivery')?.addEventListener('click', async () => {
                const curOrderNo = fNo.value.trim();
                if (!curOrderNo) {
                    alert('請先挑選或查詢客戶訂單！');
                    return;
                }
                if (isDirty) {
                    const saved = await doSave();
                    if (!saved) return;
                }
                Modules.open('COPI08', curOrderNo);
            });

            if (App.windows[winId]) {
                App.windows[winId].beforeClose = () => {
                    if (isDirty) {
                        return confirm("目前視窗有尚未儲存的資料，確定要直接關閉視窗嗎？\n（未儲存的變更將會遺失）");
                    }
                    return true;
                };
            }

            // Initial load: 100% 空白模式，按新增或查詢才出現
            resetBlank();
        });
    },

    // ========================================================
    // 3. 銷貨單建立作業 (COPI08) - 1:1 擷取2 (media_1793885786161_97ad1ed4.png)
    // ========================================================
    openCOPI08(fromOrderNo = null) {
        const u = App.currentUser?.company || '學生區';
        const title = `銷貨單建立作業(COPI08)[${u}]`;
        const winId = 'COPI08';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">資料(<u>D</u>)</span>
                <span class="erp-menu-item" id="copi08-menu-func" title="功能選單：複製單據">功能(<u>F</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="新增空白銷貨單" id="copi08-tb-new">📄</button>
                <button class="erp-tb-btn" title="查詢" id="copi08-tb-query">🔍</button>
                <button class="erp-tb-btn" title="修改" id="copi08-tb-edit">✏️</button>
                <button class="erp-tb-btn" title="刪除" id="copi08-tb-del">🗑️</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('銷貨單列印中...')">🖨️</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="首筆" id="copi08-tb-first">|◀</button>
                <button class="erp-tb-btn" title="上筆" id="copi08-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下筆" id="copi08-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="copi08-tb-last">▶|</button>
                <button class="erp-tb-btn tb-btn-crossquery" title="串查作業 (客戶資料/品號查詢/訂單樹狀資訊查詢)" id="copi08-tb-crossquery">
                    <img src="assets/icons/cross_query.png" alt="串查">
                    <span class="tb-dropdown-arrow">▼</span>
                </button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="儲存" id="copi08-tb-save" style="color:#008000; font-weight:bold; font-size:15px;">✔</button>
                <button class="erp-tb-btn tb-btn-cancel" title="取消 (清除放棄未儲存變更)" id="copi08-tb-cancel" style="color:#CC0000; font-weight:bold; font-size:15px;">✖</button>
                <button class="erp-tb-btn" title="確認" id="copi08-tb-confirm">
                    <img src="assets/icons/confirm_active.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
                <button class="erp-tb-btn" title="取消確認" id="copi08-tb-unconfirm">
                    <img src="assets/icons/unconfirm_disabled.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
                <button class="erp-tb-btn btn-transfer" title="拋轉/產生作業" id="copi08-tb-transfer">📦</button>
                <button class="erp-tb-btn" title="複製單據 (複製目前或前筆銷貨單產生新單)" id="copi08-tb-copy">
                    <img src="assets/icons/tb_copy.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
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
                            <input type="text" id="copi08-type" class="erp-input-cyan" style="width:70px;" value="">
                            <button class="lookup-icon-btn" id="copi08-lookup-type" title="挑選單別">🔍</button>
                            <span class="erp-field-desc" id="copi08-type-desc"></span>
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
                            <label style="min-width:auto; cursor:pointer;"><input type="checkbox"> 產生分錄-收入</label>
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
                            <button class="lookup-icon-btn" id="copi08-lookup-cust" title="挑選客戶">🏢</button>
                            <span class="erp-field-desc" id="copi08-cust-desc" style="min-width:90px;"></span>
                        </div>
                        <div class="erp-field" style="margin-left:14px;">
                            <label style="min-width:auto; cursor:pointer;"><input type="checkbox"> 產生分錄-成本</label>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>流程代號</label>
                            <input type="text" id="copi08-flow-code" style="width:70px;" value="">
                            <button class="lookup-icon-btn" title="挑選流程">🔍</button>
                        </div>
                        <div class="erp-field" style="margin-left:6px;">
                            <label style="min-width:auto; cursor:pointer;"><input type="checkbox"> 不控管信用額度</label>
                        </div>
                        <div class="erp-field">
                            <label>拋轉狀態</label>
                            <input type="text" class="erp-input-readonly" style="width:90px;" value="N:未拋轉" readonly>
                        </div>
                        <div class="erp-field">
                            <label style="min-width:auto; cursor:pointer;"><input type="checkbox"> 現銷</label>
                        </div>
                        <div class="erp-field">
                            <label>EBO拋轉狀態</label>
                            <input type="text" class="erp-input-readonly" style="width:85px;" value="不需拋轉" readonly>
                        </div>
                    </div>
                </div>

                <!-- Subtab Header (Image 3: 6 subtabs) -->
                <div class="erp-subtab-header">
                    <button class="erp-subtab-btn active">交易資料</button>
                    <button class="erp-subtab-btn">送貨資料</button>
                    <button class="erp-subtab-btn">發票資料(一)</button>
                    <button class="erp-subtab-btn">發票資料(二)</button>
                    <button class="erp-subtab-btn">其他資料</button>
                    <button class="erp-subtab-btn">訂金/派車資料</button>
                </div>

                <!-- Subtab Content (Image 3) -->
                <div class="erp-tab-content">
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>部門代號</label>
                            <input type="text" id="copi08-dept" style="width:75px;" value="">
                            <button class="lookup-icon-btn" id="copi08-lookup-dept" title="挑選部門">🏢</button>
                            <span class="erp-field-desc" id="copi08-dept-desc"></span>
                        </div>
                        <div class="erp-field">
                            <label>幣別</label>
                            <input type="text" id="copi08-currency" class="erp-input-yellow" style="width:65px;" value="">
                            <button class="lookup-icon-btn" id="copi08-lookup-currency">💲</button>
                            <span class="erp-field-desc" id="copi08-currency-desc"></span>
                        </div>
                        <div class="erp-field">
                            <label>簽核狀態</label>
                            <input type="text" class="erp-input-readonly" style="width:130px;" value="N:不執行電子簽核" readonly>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>業務人員</label>
                            <input type="text" id="copi08-sales" style="width:75px;" value="">
                            <button class="lookup-icon-btn" id="copi08-lookup-sales" title="挑選業務人員">👤</button>
                            <span class="erp-field-desc" id="copi08-sales-desc"></span>
                        </div>
                        <div class="erp-field">
                            <label>匯率</label>
                            <input type="text" id="copi08-rate" style="width:65px; text-align:right;" value="">
                            <button class="lookup-icon-btn">💲</button>
                        </div>
                        <div class="erp-field">
                            <label>確認者</label>
                            <input type="text" id="copi08-confirm-user" class="erp-input-readonly" style="width:65px;" value="" readonly>
                            <span class="erp-field-desc" id="copi08-confirm-user-desc"></span>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>出貨廠別</label>
                            <input type="text" id="copi08-plant" class="erp-input-yellow" style="width:65px;" value="">
                            <button class="lookup-icon-btn" id="copi08-lookup-plant" title="挑選廠別">🏭</button>
                            <span class="erp-field-desc" id="copi08-plant-desc"></span>
                        </div>
                        <div class="erp-field">
                            <label>保稅碼</label>
                            <select id="copi08-bonded-code" style="width:110px;">
                                <option value="0">0.依品號預設</option>
                                <option value="1">1.保稅</option>
                                <option value="2">2.非保稅</option>
                            </select>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>付款條件</label>
                            <input type="text" id="copi08-pay-term" style="width:65px;" value="">
                            <button class="lookup-icon-btn" id="copi08-lookup-pay" title="挑選付款條件">🔍</button>
                            <span class="erp-field-desc" id="copi08-pay-desc"></span>
                        </div>
                        <div class="erp-field">
                            <label>備註</label>
                            <input type="text" id="copi08-remark" style="width:140px;" value="">
                            <button class="lookup-icon-btn" title="常用備註">🔍</button>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>交易條件</label>
                            <input type="text" id="copi08-trade-cond" style="width:45px;" value="">
                            <button class="lookup-icon-btn" id="copi08-lookup-trade">🔍</button>
                            <span class="erp-field-desc" id="copi08-trade-desc"></span>
                        </div>
                        <div class="erp-field">
                            <label>件數</label>
                            <input type="text" style="width:50px; text-align:right;" value="0">
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>列印</label>
                            <input type="text" style="width:40px; text-align:right;" value="0" readonly>
                        </div>
                        <div class="erp-field">
                            <label>發票列印</label>
                            <input type="text" style="width:40px; text-align:right;" value="0" readonly>
                        </div>
                        <div class="erp-field">
                            <label>傳送次數</label>
                            <input type="text" style="width:40px; text-align:right;" value="0" readonly>
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
                            <th class="th-cyan" style="width:75px;">銷貨單別</th>
                            <th class="th-cyan" style="width:120px;">銷貨單號</th>
                            <th style="width:85px;">銷貨日期</th>
                            <th style="width:75px;">客戶代號</th>
                            <th style="width:140px;">客戶簡稱</th>
                            <th style="width:85px;">銷貨金額</th>
                            <th style="width:75px;">稅額</th>
                            <th style="width:85px;">合計</th>
                            <th style="width:65px;">狀態</th>
                        </tr>
                    </thead>
                    <tbody id="copi08-browse-tbody">
                        <tr><td colspan="10" style="text-align:center; padding:20px;">載入銷貨單清單中...</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Statusbar -->
            <div class="erp-window-statusbar">
                <span class="status-cell">瀏覽</span>
                <span class="status-cell" id="copi08-status-msg">單身資料筆數: 0</span>
                <span class="status-cell"></span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 944, 615, (winEl) => {
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
            let currentDelivery = null;
            let delivList = [];
            let isDirty = false;

            winEl.addEventListener('input', (e) => {
                if (!e.target.classList.contains('erp-input-readonly')) {
                    isDirty = true;
                }
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
                if (rowCount > 0) isDirty = true;
            };

            const grid = Modules.initDynamicGrid(winEl, 'copi08', false, calcTotals);

            const fillDelivery = (header, details = []) => {
                currentDelivery = header;
                fType.value = header.delivery_type || '';
                fDocDate.value = header.doc_date || '';
                fDelivDate.value = header.delivery_date || '';
                fNo.value = header.delivery_no || '';
                fCustNo.value = header.customer_no || '';
                fCustDesc.textContent = header.customer_name || '';
                const dept = winEl.querySelector('#copi08-dept');
                if (dept) dept.value = header.dept_no || '';
                const deptDesc = winEl.querySelector('#copi08-dept-desc');
                if (deptDesc) deptDesc.textContent = header.dept_name || '';
                const sales = winEl.querySelector('#copi08-sales');
                if (sales) sales.value = header.sales_no || '';
                const salesDesc = winEl.querySelector('#copi08-sales-desc');
                if (salesDesc) salesDesc.textContent = header.sales_name || '';
                const plant = winEl.querySelector('#copi08-plant');
                if (plant) plant.value = header.factory_no || '';
                const plantDesc = winEl.querySelector('#copi08-plant-desc');
                if (plantDesc) plantDesc.textContent = header.factory_name || '';
                fConfirmUser.value = header.confirm_user || '';
                const confirmDesc = winEl.querySelector('#copi08-confirm-user-desc');
                if (confirmDesc) confirmDesc.textContent = header.confirm_user ? (App.currentUser?.company || ('學生區' + (App.currentUser?.username || ''))) : '';
                currentDocStatus = header.status || '未確認';
                const isConfirmed = (currentDocStatus === '已確認' || currentDocStatus === 'Y' || !!header.confirm_user);
                Modules.updateAuditButtons(winEl, isConfirmed, 'copi08');
                grid.fillGrid(details);
                Modules.setFormMode(winEl, grid, 'browse', statusMsg, header.delivery_no);
                isDirty = false;
            };

            const clearDelivery = async () => {
                currentDelivery = null;
                fType.value = '';
                const typeDesc = winEl.querySelector('#copi08-type-desc');
                if (typeDesc) typeDesc.textContent = '';
                const today = Modules.getTodayStr();
                fDocDate.value = today;
                fDelivDate.value = today;
                fNo.value = await Modules.generateNextDocNo('delivery', today);
                fCustNo.value = '';
                fCustDesc.textContent = '';
                const dept = winEl.querySelector('#copi08-dept');
                if (dept) dept.value = '';
                const deptDesc = winEl.querySelector('#copi08-dept-desc');
                if (deptDesc) deptDesc.textContent = '';
                const plant = winEl.querySelector('#copi08-plant');
                if (plant) plant.value = '';
                const plantDesc = winEl.querySelector('#copi08-plant-desc');
                if (plantDesc) plantDesc.textContent = '';
                const sales = winEl.querySelector('#copi08-sales');
                if (sales) sales.value = '';
                const salesDesc = winEl.querySelector('#copi08-sales-desc');
                if (salesDesc) salesDesc.textContent = '';
                fConfirmUser.value = '';
                const confirmDesc = winEl.querySelector('#copi08-confirm-user-desc');
                if (confirmDesc) confirmDesc.textContent = '';
                currentDocStatus = '未確認';
                Modules.updateAuditButtons(winEl, false, 'copi08');
                grid.clearGrid(true);
                Modules.setFormMode(winEl, grid, 'add', statusMsg, fNo.value);
                isDirty = false;
                fCustNo.focus();
            };

            const resetDeliveryBlank = () => {
                fType.value = '';
                const typeDesc = winEl.querySelector('#copi08-type-desc');
                if (typeDesc) typeDesc.textContent = '';
                fDocDate.value = '';
                fDelivDate.value = '';
                fNo.value = '';
                fCustNo.value = '';
                fCustDesc.textContent = '';
                const dept = winEl.querySelector('#copi08-dept');
                if (dept) dept.value = '';
                const deptDesc = winEl.querySelector('#copi08-dept-desc');
                if (deptDesc) deptDesc.textContent = '';
                const plant = winEl.querySelector('#copi08-plant');
                if (plant) plant.value = '';
                const plantDesc = winEl.querySelector('#copi08-plant-desc');
                if (plantDesc) plantDesc.textContent = '';
                const sales = winEl.querySelector('#copi08-sales');
                if (sales) sales.value = '';
                const salesDesc = winEl.querySelector('#copi08-sales-desc');
                if (salesDesc) salesDesc.textContent = '';
                fConfirmUser.value = '';
                const confirmDesc = winEl.querySelector('#copi08-confirm-user-desc');
                if (confirmDesc) confirmDesc.textContent = '';
                const curDesc = winEl.querySelector('#copi08-currency-desc');
                if (curDesc) curDesc.textContent = '';
                const curInp = winEl.querySelector('#copi08-currency');
                if (curInp) curInp.value = '';
                const rateInp = winEl.querySelector('#copi08-rate');
                if (rateInp) rateInp.value = '';
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '');
                Modules.updateAuditButtons(winEl, false, 'copi08');
                grid.clearGrid(false);
                fTotAmt.value = '0';
                fTotTax.value = '0';
                fTotGrand.value = '0';
                fTotQty.value = '0';
                Modules.setFormMode(winEl, grid, 'browse', statusMsg, '');
                isDirty = false;
            };

            const checkDirtyBeforeAction = (callback) => {
                if (isDirty) {
                    const answer = confirm("資料尚未儲存，是否要儲存目前的單據？\n\n點選【確定】：進行儲存\n點選【取消】：直接清除放棄變更");
                    if (answer) {
                        doSave().then(saved => {
                            if (saved) callback();
                        });
                    } else {
                        isDirty = false;
                        callback();
                    }
                } else {
                    callback();
                }
            };

            const loadBrowseList = async () => {
                const tbody = winEl.querySelector('#copi08-browse-tbody');
                const res = await ERP_API.get('get_deliveries');
                if (res.success) {
                    delivList = res.data || [];
                    if (delivList.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding:20px; color:#888;">目前尚無銷貨單資料</td></tr>';
                        return;
                    }
                    let rows = '';
                    delivList.forEach(d => {
                        const tax = Math.round(d.tax_amount || (d.delivery_amount * 0.05) || 0);
                        rows += `
                            <tr data-no="${d.delivery_no}" style="cursor:pointer;">
                                <td style="text-align:center;">▶</td>
                                <td>${d.delivery_type || ''}</td>
                                <td style="font-weight:bold; color:#003366;">${d.delivery_no}</td>
                                <td>${d.delivery_date || ''}</td>
                                <td>${d.customer_no || ''}</td>
                                <td>${d.customer_name || ''}</td>
                                <td style="text-align:right;">${Math.round(d.delivery_amount || 0).toLocaleString()}</td>
                                <td style="text-align:right;">${tax.toLocaleString()}</td>
                                <td style="text-align:right; font-weight:bold;">${Math.round(d.grand_total || 0).toLocaleString()}</td>
                                <td style="text-align:center; font-weight:bold; color:${d.status === '已確認' ? 'green' : '#999'};">${d.status || '未確認'}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows;

                    tbody.querySelectorAll('tr[data-no]').forEach(tr => {
                        tr.addEventListener('click', () => {
                            checkDirtyBeforeAction(async () => {
                                const no = tr.getAttribute('data-no');
                                const detailRes = await ERP_API.get('get_delivery', { delivery_no: no });
                                const doc = detailRes.delivery || detailRes.header || detailRes.deliv || detailRes.order;
                                if (detailRes.success && doc) {
                                    fillDelivery(doc, detailRes.details || []);
                                    switchTab('detail');
                                }
                            });
                        });
                    });
                }
            };

            // Navigation
            const navDelivery = async (pos) => {
                checkDirtyBeforeAction(async () => {
                    const cur = fNo.value.trim();
                    const res = await ERP_API.get('nav_delivery', { dir: pos, pos, current: cur });
                    const doc = res.delivery || res.header || res.deliv || res.data;
                    if (res.success && doc) {
                        fillDelivery(doc, res.details || []);
                        isDirty = false;
                    } else {
                        alert('已無' + (pos === 'first' ? '第一筆' : pos === 'last' ? '最後一筆' : pos === 'prev' ? '上一筆' : '下一筆') + '銷貨單資料');
                    }
                });
            };

            const bindNav = (btnId, pos) => {
                const btn = winEl.querySelector('#' + btnId);
                if (btn) btn.addEventListener('click', () => navDelivery(pos));
            };
            bindNav('copi08-tb-first', 'first');
            bindNav('copi08-tb-prev', 'prev');
            bindNav('copi08-tb-next', 'next');
            bindNav('copi08-tb-last', 'last');

            // Lookups
            winEl.querySelector('#copi08-lookup-type').addEventListener('click', () => {
                Modules.openLookup('doc_type_deliv', (t) => {
                    fType.value = t.code;
                    const typeDesc = winEl.querySelector('#copi08-type-desc');
                    if (typeDesc) typeDesc.textContent = t.name;
                    isDirty = true;
                });
            });

            winEl.querySelector('#copi08-lookup-cust').addEventListener('click', () => {
                Modules.openLookup('customer', (c) => {
                    fCustNo.value = c.customer_no || '';
                    fCustDesc.textContent = c.name_short || c.full_name || '';
                    isDirty = true;
                });
            });

            const copi08PlantBtn = winEl.querySelector('#copi08-lookup-plant');
            if (copi08PlantBtn) {
                copi08PlantBtn.addEventListener('click', () => {
                    Modules.openLookup('factory', (f) => {
                        winEl.querySelector('#copi08-plant').value = f.factory_no;
                        winEl.querySelector('#copi08-plant-desc').textContent = f.factory_name;
                        isDirty = true;
                    });
                });
            }

            const copi08SalesBtn = winEl.querySelector('#copi08-lookup-sales');
            if (copi08SalesBtn) {
                copi08SalesBtn.addEventListener('click', () => {
                    Modules.openLookup('personnel', (s) => {
                        winEl.querySelector('#copi08-sales').value = s.emp_no || s.code;
                        winEl.querySelector('#copi08-sales-desc').textContent = s.emp_name || s.name;
                        isDirty = true;
                    });
                });
            }

            const copi08DeptBtn = winEl.querySelector('#copi08-lookup-dept');
            if (copi08DeptBtn) {
                copi08DeptBtn.addEventListener('click', () => {
                    Modules.openLookup('department', (d) => {
                        winEl.querySelector('#copi08-dept').value = d.dept_no;
                        winEl.querySelector('#copi08-dept-desc').textContent = d.dept_name;
                        isDirty = true;
                    });
                });
            }

            const copi08CurrBtn = winEl.querySelector('#copi08-lookup-currency');
            if (copi08CurrBtn) {
                copi08CurrBtn.addEventListener('click', () => {
                    Modules.openLookup('currency', (c) => {
                        winEl.querySelector('#copi08-currency').value = c.code;
                        isDirty = true;
                    });
                });
            }

            const copi08PayBtn = winEl.querySelector('#copi08-lookup-pay');
            if (copi08PayBtn) {
                copi08PayBtn.addEventListener('click', () => {
                    Modules.openLookup('payment_term', (p) => {
                        winEl.querySelector('#copi08-pay-term').value = p.term_no;
                        winEl.querySelector('#copi08-pay-desc').textContent = p.term_name;
                        isDirty = true;
                    });
                });
            }

            const copi08TradeBtn = winEl.querySelector('#copi08-lookup-trade');
            if (copi08TradeBtn) {
                copi08TradeBtn.addEventListener('click', () => {
                    Modules.openLookup('trade_term', (t) => {
                        winEl.querySelector('#copi08-trade-cond').value = t.term_no;
                        winEl.querySelector('#copi08-trade-desc').textContent = t.term_name;
                        isDirty = true;
                    });
                });
            }

            // 複製前置單據核心：從客戶訂單複製
            const loadOrderToDelivery = async (orderNo) => {
                const res = await ERP_API.get('get_order', { order_no: orderNo });
                if (!res.success || !res.order) {
                    alert(`查無客戶訂單【${orderNo}】之資料！`);
                    return false;
                }
                const order = res.order;
                const details = res.details || [];

                const today = Modules.getTodayStr();
                const newDocNo = await Modules.generateNextDocNo('delivery', today);

                fType.value = 'A231';
                const typeDesc = winEl.querySelector('#copi08-type-desc');
                if (typeDesc) typeDesc.textContent = '國內銷貨單';
                fNo.value = newDocNo;
                fDocDate.value = today;
                fDelivDate.value = today;
                fCustNo.value = order.customer_no || '';
                fCustDesc.textContent = order.customer_name || '';

                winEl.dataset.sourceOrderNo = orderNo;
                if (!currentDelivery) currentDelivery = {};
                currentDelivery.order_no = orderNo;

                const deptVal = order.dept || order.dept_no || '';
                if (deptVal && winEl.querySelector('#copi08-dept')) {
                    winEl.querySelector('#copi08-dept').value = deptVal;
                }
                const salesVal = order.sales_person || order.sales_no || '';
                if (salesVal && winEl.querySelector('#copi08-sales')) {
                    winEl.querySelector('#copi08-sales').value = salesVal;
                }
                const plantVal = order.factory || order.factory_no || 'TP01';
                if (plantVal && winEl.querySelector('#copi08-plant')) {
                    winEl.querySelector('#copi08-plant').value = plantVal;
                }
                if (order.currency && winEl.querySelector('#copi08-currency')) {
                    winEl.querySelector('#copi08-currency').value = order.currency;
                }
                if (order.exchange_rate && winEl.querySelector('#copi08-rate')) {
                    winEl.querySelector('#copi08-rate').value = order.exchange_rate;
                }

                fConfirmUser.value = '';
                const confirmDesc = winEl.querySelector('#copi08-confirm-user-desc');
                if (confirmDesc) confirmDesc.textContent = '';
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '未確認');
                Modules.updateAuditButtons(winEl, false, 'copi08');

                const mappedDetails = details.map(d => {
                    const rowQty = (parseFloat(d.order_qty) || parseFloat(d.qty) || 0);
                    const rowPrice = (parseFloat(d.unit_price) || parseFloat(d.price) || 0);
                    const rowAmt = (parseFloat(d.amount) || (rowQty * rowPrice));
                    return {
                        biz_item: d.biz_item || d.biz_item_no || '',
                        item_no: d.item_no || '',
                        item_name: d.item_name || '',
                        item_spec: d.item_spec || '',
                        qty: rowQty,
                        unit: d.unit || '台',
                        price: rowPrice,
                        amount: rowAmt,
                        wh: d.warehouse || d.wh || 'W01'
                    };
                });

                switchTab('detail');
                Modules.setFormMode(winEl, grid, 'add', statusMsg, newDocNo);
                grid.fillGrid(mappedDetails);
                calcTotals();
                isDirty = true;
                Modules.toast(`已成功從前置訂單【${orderNo}】複製產生銷貨單【${newDocNo}】！`, 'success');
                return true;
            };

            // 複製前置單據核心：從報價單複製
            const loadQuotationToDelivery = async (qNo) => {
                const res = await ERP_API.get('get_quotation', { quotation_no: qNo, doc_no: qNo });
                if (!res.success || !res.quotation) {
                    alert(`查無報價單【${qNo}】之資料！`);
                    return false;
                }
                const q = res.quotation;
                const details = res.details || [];

                const today = Modules.getTodayStr();
                const newDocNo = await Modules.generateNextDocNo('delivery', today);

                fType.value = 'A231';
                const typeDesc = winEl.querySelector('#copi08-type-desc');
                if (typeDesc) typeDesc.textContent = '國內銷貨單';
                fNo.value = newDocNo;
                fDocDate.value = today;
                fDelivDate.value = today;
                fCustNo.value = q.customer_no || '';
                fCustDesc.textContent = q.customer_name || '';

                fConfirmUser.value = '';
                const confirmDesc = winEl.querySelector('#copi08-confirm-user-desc');
                if (confirmDesc) confirmDesc.textContent = '';
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '未確認');
                Modules.updateAuditButtons(winEl, false, 'copi08');

                const mappedDetails = details.map(d => ({
                    biz_item: d.biz_item || '',
                    item_no: d.item_no || '',
                    item_name: d.item_name || '',
                    item_spec: d.item_spec || '',
                    qty: (parseFloat(d.qty) || parseFloat(d.quotation_qty) || 0),
                    unit: d.unit || '台',
                    price: (parseFloat(d.unit_price) || parseFloat(d.price) || 0),
                    amount: (parseFloat(d.amount) || (((parseFloat(d.qty) || parseFloat(d.quotation_qty) || 0)) * ((parseFloat(d.unit_price) || parseFloat(d.price) || 0)))),
                    wh: d.warehouse || d.wh || 'W01'
                }));

                switchTab('detail');
                Modules.setFormMode(winEl, grid, 'add', statusMsg, newDocNo);
                grid.fillGrid(mappedDetails);
                calcTotals();
                isDirty = true;
                Modules.toast(`已成功從前置報價單【${qNo}】複製產生銷貨單【${newDocNo}】！`, 'success');
                return true;
            };

            // 1:1 複製前置單據彈窗 (1:1 參考圖片第一張範本 COPI06, 緊湊排版無空白)
            const openCOPI08CopyModal = () => {
                const uCompany = App.currentUser?.company || ('學生區' + (App.currentUser?.username || 'B01'));

                const modal = document.createElement('div');
                modal.className = 'erp-lookup-overlay';
                modal.style.zIndex = '999999';
                modal.style.display = 'flex';
                modal.style.justifyContent = 'center';
                modal.style.alignItems = 'center';

                const dialog = document.createElement('div');
                dialog.className = 'erp-lookup-window';
                dialog.style.width = '395px';
                dialog.style.height = 'auto';
                dialog.style.boxShadow = '2px 2px 14px rgba(0,0,0,0.4)';
                dialog.style.border = '2px outset #ffffff';
                dialog.style.borderRadius = '3px';
                dialog.style.overflow = 'hidden';

                dialog.innerHTML = `
                    <div class="erp-lookup-titlebar" style="background: linear-gradient(to bottom, #7292C2 0%, #4D74A9 100%); height:25px; display:flex; align-items:center; justify-content:space-between; padding:0 6px; user-select:none;">
                        <div class="win-title" style="display:flex; align-items:center; gap:4px; font-size:12px; color:#ffffff;">
                            <span class="win-wf-badge">Wf</span>
                            <span>銷貨單建立作業 (COPI08)[${uCompany}]</span>
                        </div>
                        <div class="win-controls" style="display:flex; gap:2px;">
                            <button type="button" class="win-btn minimize" style="font-size:11px; cursor:pointer;" title="最小化">_</button>
                            <button type="button" class="win-btn maximize" style="font-size:11px; cursor:pointer;" title="最大化">▢</button>
                            <button type="button" class="win-btn close copi08-modal-close" style="font-size:11px; cursor:pointer;" title="關閉">✕</button>
                        </div>
                    </div>
                    <div style="background:#ECE9D8; padding:16px 20px 14px 20px; font-size:12px; font-family:Tahoma, 'Microsoft JhengHei', sans-serif; display:flex; flex-direction:column; gap:10px;">
                        <!-- 複製來源 -->
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:12px; color:#000; width:58px; white-space:nowrap;">複製來源</span>
                            <div style="display:inline-flex; align-items:center; gap:12px; border:1px solid #7F9DB9; padding:4px 10px; background:#ECE9D8; border-radius:2px;">
                                <label style="display:flex; align-items:center; gap:4px; margin:0; cursor:pointer; font-size:12px; color:#000;">
                                    <input type="radio" name="copi08_modal_src" id="copi08-src-order" value="order" checked style="margin:0; cursor:pointer;">
                                    <span>訂單</span>
                                </label>
                                <label style="display:flex; align-items:center; gap:4px; margin:0; cursor:pointer; font-size:12px; color:#000;">
                                    <input type="radio" name="copi08_modal_src" id="copi08-src-temp-out" value="temp_out" style="margin:0; cursor:pointer;">
                                    <span>暫出單</span>
                                </label>
                                <label style="display:flex; align-items:center; gap:4px; margin:0; cursor:pointer; font-size:12px; color:#000;">
                                    <input type="radio" name="copi08_modal_src" id="copi08-src-quote" value="quotation" style="margin:0; cursor:pointer;">
                                    <span>報價單</span>
                                </label>
                            </div>
                        </div>

                        <!-- 來源單別 -->
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:12px; color:#000; width:58px; white-space:nowrap;">來源單別</span>
                            <div style="display:flex; align-items:center; gap:4px;">
                                <input type="text" id="copi08-m-type" class="erp-input-yellow" style="width:105px; height:21px; font-size:12px; padding:1px 4px; background:#FFFFB0; border:1px solid #7F9DB9;" value="" placeholder="單號選擇後帶入">
                                <button type="button" class="lookup-icon-btn" id="copi08-m-lookup-type" title="挑選來源單號" style="width:22px; height:21px; display:flex; align-items:center; justify-content:center; cursor:pointer; background:#ECE9D8; border:1px solid #7F9DB9;">🔍</button>
                            </div>
                        </div>

                        <!-- 來源單號 -->
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:12px; color:#000; width:58px; white-space:nowrap;">來源單號</span>
                            <div style="display:flex; align-items:center; gap:4px;">
                                <input type="text" id="copi08-m-no" class="erp-input-yellow" style="width:105px; height:21px; font-size:12px; padding:1px 4px; background:#FFFFB0; border:1px solid #7F9DB9;" value="" placeholder="請挑選或輸入單號">
                                <button type="button" class="lookup-icon-btn" id="copi08-m-lookup-no" title="挑選來源單號" style="width:22px; height:21px; display:flex; align-items:center; justify-content:center; cursor:pointer; background:#ECE9D8; border:1px solid #7F9DB9;">🔍</button>
                            </div>
                        </div>

                        <!-- 選擇銷貨單價來源 -->
                        <div style="background:#A6B2BE; padding:4px 8px; display:flex; align-items:center; gap:8px; border:1px solid #7F9DB9; border-radius:1px;">
                            <label style="color:#000; font-size:12px; margin:0; white-space:nowrap;">選擇銷貨單價來源</label>
                            <select id="copi08-m-price-src" style="flex:1; height:21px; font-size:12px; background:#FFF; border:1px solid #7F9DB9; padding:0 2px;">
                                <option value="1">1:前置單據單價</option>
                                <option value="2">2:客戶計價</option>
                                <option value="3">3:標準售價</option>
                            </select>
                        </div>

                        <!-- 確定 / 取消 按鈕列 -->
                        <div style="display:flex; justify-content:center; align-items:center; gap:36px; margin-top:6px; padding-top:6px; border-top:1px solid #D4D0C8;">
                            <button type="button" id="copi08-m-btn-confirm" style="display:flex; align-items:center; justify-content:center; gap:6px; min-width:76px; height:25px; background:#ECE9D8; border:2px outset #ffffff; cursor:pointer; font-size:12px; font-family:inherit;">
                                <span style="color:#008000; font-weight:bold; font-size:14px; line-height:1;">✔</span> 確定
                            </button>
                            <button type="button" id="copi08-m-btn-cancel" style="display:flex; align-items:center; justify-content:center; gap:6px; min-width:76px; height:25px; background:#ECE9D8; border:2px outset #ffffff; cursor:pointer; font-size:12px; font-family:inherit;">
                                <span style="color:#CC0000; font-weight:bold; font-size:14px; line-height:1;">✖</span> 取消
                            </button>
                        </div>
                    </div>
                `;

                modal.appendChild(dialog);
                document.body.appendChild(modal);

                const closeDialog = () => {
                    document.removeEventListener('keydown', handleKeydown);
                    if (modal.parentNode) modal.parentNode.removeChild(modal);
                };

                const handleKeydown = (e) => {
                    if (e.key === 'Escape') closeDialog();
                };
                document.addEventListener('keydown', handleKeydown);

                modal.addEventListener('click', (e) => {
                    if (e.target === modal) closeDialog();
                });

                dialog.querySelectorAll('.copi08-modal-close, #copi08-m-btn-cancel, .minimize').forEach(el => {
                    el.addEventListener('click', closeDialog);
                });

                const typeInp = dialog.querySelector('#copi08-m-type');
                const noInp = dialog.querySelector('#copi08-m-no');
                const radios = dialog.querySelectorAll('input[name="copi08_modal_src"]');

                radios.forEach(r => {
                    r.addEventListener('change', () => {
                        typeInp.value = '';
                        noInp.value = '';
                    });
                });

                const openSourceLookup = () => {
                    const curSrc = Array.from(radios).find(r => r.checked)?.value;
                    if (curSrc === 'quotation') {
                        Modules.openLookup('quotation', (q) => {
                            const fullNo = q.quote_no || q.quotation_no || q.doc_no || '';
                            typeInp.value = q.doc_type || (fullNo.includes('-') ? fullNo.split('-')[0] : '2201');
                            noInp.value = fullNo;
                            noInp.dataset.selectedDocNo = fullNo;
                        });
                    } else {
                        Modules.openLookup('order', (o) => {
                            const fullNo = o.order_no || '';
                            typeInp.value = o.order_type || (fullNo.includes('-') ? fullNo.split('-')[0] : 'C221');
                            noInp.value = fullNo;
                            noInp.dataset.selectedDocNo = fullNo;
                        });
                    }
                };

                dialog.querySelector('#copi08-m-lookup-type')?.addEventListener('click', openSourceLookup);
                dialog.querySelector('#copi08-m-lookup-no')?.addEventListener('click', openSourceLookup);

                dialog.querySelector('#copi08-m-btn-confirm')?.addEventListener('click', async () => {
                    const curSrc = Array.from(radios).find(r => r.checked)?.value;
                    const mType = typeInp.value.trim();
                    let mNo = noInp.value.trim();

                    if (!mNo) {
                        openSourceLookup();
                        return;
                    }

                    // 優先使用所選真實單號，若失敗再嘗試加單別前綴
                    const targetDocNo = noInp.dataset.selectedDocNo || mNo;
                    if (curSrc === 'quotation') {
                        let ok = await loadQuotationToDelivery(targetDocNo);
                        if (!ok && mType && !targetDocNo.includes('-')) {
                            ok = await loadQuotationToDelivery(`${mType}-${targetDocNo}`);
                        }
                        if (ok) closeDialog();
                    } else {
                        let ok = await loadOrderToDelivery(targetDocNo);
                        if (!ok && mType && !targetDocNo.includes('-')) {
                            ok = await loadOrderToDelivery(`${mType}-${targetDocNo}`);
                        }
                        if (ok) closeDialog();
                    }
                });
            };

            const doSave = async () => {
                const delivNo = fNo.value.trim();
                const custNo = fCustNo.value.trim();
                if (!delivNo || !custNo) {
                    alert('【必填檢查】請輸入銷貨單號並挑選客戶代號！');
                    return false;
                }

                const details = grid.getRowsData().map(d => ({
                    ...d,
                    delivery_qty: d.qty,
                    unit_price: d.price
                }));
                if (details.length === 0) {
                    alert('【明細檢查】請至少在表格中挑選品號並輸入出貨數量！');
                    return false;
                }

                const delType = fType.value.trim() || 'A231';
                fType.value = delType;

                const payload = {
                    header: {
                        delivery_no: delivNo,
                        delivery_type: delType,
                        order_no: currentDelivery?.order_no || winEl.dataset.sourceOrderNo || '',
                        doc_date: fDocDate.value.trim() || Modules.getTodayStr(),
                        delivery_date: fDelivDate.value.trim() || Modules.getTodayStr(),
                        customer_no: custNo,
                        customer_name: fCustDesc.textContent.trim(),
                        dept_no: winEl.querySelector('#copi08-dept')?.value.trim() || '',
                        sales_no: winEl.querySelector('#copi08-sales')?.value.trim() || '',
                        factory_no: winEl.querySelector('#copi08-plant')?.value.trim() || '',
                        currency: winEl.querySelector('#copi08-currency')?.value.trim() || 'NTD',
                        exchange_rate: parseFloat(winEl.querySelector('#copi08-rate')?.value) || 1,
                        tax_amount: parseFloat((fTotTax.value || '0').replace(/,/g, '')) || 0,
                        delivery_amount: parseFloat((fTotAmt.value || '0').replace(/,/g, '')) || 0,
                        grand_total: parseFloat((fTotGrand.value || '0').replace(/,/g, '')) || 0,
                        status: currentDocStatus,
                        confirm_user: fConfirmUser.value.trim()
                    },
                    details
                };

                const res = await ERP_API.post('save_delivery', payload);
                if (res.success) {
                    isDirty = false;
                    Modules.setFormMode(winEl, grid, 'browse', statusMsg, delivNo);
                    Modules.toast(`銷貨單 [${delivNo}] 儲存成功！庫存已同步出庫。`, 'success');
                    return true;
                } else {
                    Modules.toast('儲存失敗: ' + (res.error || '不明錯誤'), 'error');
                    return false;
                }
            };

            // Toolbar Actions
            winEl.querySelector('#copi08-tb-new').addEventListener('click', () => {
                checkDirtyBeforeAction(() => {
                    clearDelivery();
                    switchTab('detail');
                });
            });
            winEl.querySelector('#copi08-tb-edit').addEventListener('click', () => {
                const curNo = fNo.value.trim();
                if (!curNo) {
                    alert('請先查詢單據或點選「新增」！');
                    return;
                }
                switchTab('detail');
                Modules.setFormMode(winEl, grid, 'edit', statusMsg, curNo);
                Modules.toast(`銷貨單 [${curNo}] 進入修改模式`, 'info');
            });
            // 串查作業按鈕連動 (1:1 擷取666.PNG + 查詢品號 + 訂單樹狀資訊查詢)
            const copi08CrossQueryBtn = winEl.querySelector('#copi08-tb-crossquery');
            if (copi08CrossQueryBtn) {
                copi08CrossQueryBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const curType = fType ? fType.value.trim() : '';
                    const curNum = fNo ? fNo.value.trim() : '';
                    let fullDelivNo = '';
                    if (curType && curNum) {
                        fullDelivNo = curNum.includes('-') ? curNum : `${curType}-${curNum}`;
                    } else {
                        fullDelivNo = curNum || '';
                    }

                    const curCustNo = fCustNo ? fCustNo.value.trim() : '';
                    const curCustName = fCustDesc ? fCustDesc.textContent.trim() : '';

                    let curItemNo = '';
                    let curItemName = '';
                    const itemInputs = winEl.querySelectorAll('#copi08-grid-tbody input[id^="copi08-item-no-"]');
                    for (const inp of itemInputs) {
                        if (inp.value.trim()) {
                            curItemNo = inp.value.trim();
                            const rIdx = inp.id.replace('copi08-item-no-', '');
                            const nameInp = winEl.querySelector(`#copi08-item-name-${rIdx}`);
                            curItemName = nameInp ? nameInp.value.trim() : '';
                            break;
                        }
                    }

                    Modules.showCrossQueryMenu(copi08CrossQueryBtn, {
                        orderNo: currentDelivery ? (currentDelivery.order_no || '') : '',
                        customerNo: curCustNo,
                        customerName: curCustName,
                        itemNo: curItemNo,
                        itemName: curItemName,
                        deliveryNo: fullDelivNo,
                        currentModule: 'COPI08',
                        includeTreeQuery: true
                    });
                });
            }

            const copi08CopyBtn = winEl.querySelector('#copi08-tb-copy');
            if (copi08CopyBtn) copi08CopyBtn.addEventListener('click', openCOPI08CopyModal);
            const copi08TransferBtn = winEl.querySelector('#copi08-tb-transfer');
            if (copi08TransferBtn) {
                copi08TransferBtn.addEventListener('click', () => {
                    const no = fNo.value.trim();
                    if (!no) {
                        Modules.toast('請先挑選或儲存銷貨單據！', 'info');
                        return;
                    }
                    Modules.toast(`銷貨單【${no}】已連動出庫作業與應收帳款立帳！`, 'success', 2200);
                });
            }
            const copi08MenuFunc = winEl.querySelector('#copi08-menu-func');
            if (copi08MenuFunc) copi08MenuFunc.addEventListener('click', openCOPI08CopyModal);
            winEl.querySelector('#copi08-tb-query').addEventListener('click', () => {
                checkDirtyBeforeAction(() => {
                    Modules.openLookup('delivery', async (d) => {
                        const targetNo = d.delivery_no || d.no || '';
                        const res = await ERP_API.get('get_delivery', { delivery_no: targetNo });
                        const doc = res.delivery || res.header || res.deliv || res.order;
                        if (res.success && doc) {
                            fillDelivery(doc, res.details || []);
                            switchTab('detail');
                        } else {
                            alert(res.error || '查無此銷貨單資料');
                        }
                    });
                });
            });

            winEl.querySelector('#copi08-tb-save').addEventListener('click', doSave);

            winEl.querySelector('#copi08-tb-cancel').addEventListener('click', () => {
                if (isDirty) {
                    const answer = confirm("資料尚未儲存，是否要儲存目前的單據？\n\n點選【確定】：進行儲存\n點選【取消】：直接清除放棄變更");
                    if (answer) {
                        doSave();
                    } else {
                        resetDeliveryBlank();
                        Modules.toast('已取消並清除未儲存變更。', 'info');
                    }
                } else {
                    resetDeliveryBlank();
                    Modules.toast('已清除重置頁面資料。', 'info');
                }
            });

            winEl.querySelector('#copi08-tb-confirm').addEventListener('click', async () => {
                const btn = winEl.querySelector('#copi08-tb-confirm');
                if (btn && btn.disabled) return;
                const delivNo = fNo.value.trim();
                if (!delivNo) return;
                const res = await ERP_API.post('confirm_doc', { type: 'delivery', doc_no: delivNo, status: '已確認' });
                if (res.success) {
                    currentDocStatus = '已確認';
                    fConfirmUser.value = App.currentUser?.username || '';
                    const confirmDesc = winEl.querySelector('#copi08-confirm-user-desc');
                    if (confirmDesc) confirmDesc.textContent = App.currentUser?.company || ('學生區' + (App.currentUser?.username || ''));
                    Modules.updateAuditButtons(winEl, true, 'copi08');
                    Modules.toast('銷貨單確認完成！', 'success');
                }
            });

            winEl.querySelector('#copi08-tb-unconfirm').addEventListener('click', async () => {
                const btn = winEl.querySelector('#copi08-tb-unconfirm');
                if (btn && btn.disabled) return;
                const delivNo = fNo.value.trim();
                if (!delivNo) return;
                const res = await ERP_API.post('confirm_doc', { type: 'delivery', doc_no: delivNo, status: '未確認' });
                if (res.success) {
                    currentDocStatus = '未確認';
                    fConfirmUser.value = '';
                    const confirmDesc = winEl.querySelector('#copi08-confirm-user-desc');
                    if (confirmDesc) confirmDesc.textContent = '';
                    Modules.updateAuditButtons(winEl, false, 'copi08');
                    Modules.toast('銷貨單已取消確認！', 'info');
                }
            });

            winEl.querySelector('#copi08-tb-del').addEventListener('click', async () => {
                const delivNo = fNo.value.trim();
                if (!delivNo) return;
                if (confirm(`確定要刪除銷貨單 [${delivNo}] 嗎？`)) {
                    const res = await ERP_API.post('delete_delivery', { delivery_no: delivNo });
                    if (res.success) {
                        Modules.toast('銷貨單已成功刪除！', 'success');
                        clearDelivery();
                    } else {
                        Modules.toast('刪除失敗: ' + (res.error || '不明錯誤'), 'error');
                    }
                }
            });

            if (App.windows[winId]) {
                App.windows[winId].beforeClose = () => {
                    if (isDirty) {
                        return confirm("目前視窗有尚未儲存的資料，確定要直接關閉視窗嗎？\n（未儲存的變更將會遺失）");
                    }
                    return true;
                };
            }

            // Initial load: 支援從訂單直接轉入，或按新增或查詢才出現
            if (fromOrderNo) {
                if (fromOrderNo === 'PROMPT_ORDER') {
                    resetDeliveryBlank();
                    setTimeout(() => openCOPI08CopyModal(), 200);
                } else {
                    loadOrderToDelivery(fromOrderNo);
                }
            } else {
                resetDeliveryBlank();
            }
        });
    }
});
