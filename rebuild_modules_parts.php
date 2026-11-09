<?php
// C:\xampp\htdocs\erp\rebuild_modules_parts.php

// --------------------------------------------------------
// 1. 報價單建立作業 (COPI05) - 1:1 擷取1 (media_1793885786140_685eef55.png)
// --------------------------------------------------------
fwrite($fp, <<<'JS'
    // ========================================================
    // 1. 報價單建立作業 (COPI05) - 1:1 擷取1
    // ========================================================
    openCOPI05() {
        const u = App.currentUser?.company || '學生區';
        const title = `報價單建立作業(COPI05)[${u}]`;
        const winId = 'COPI05';

        const gridRowsHtml = this.buildGridRowsHtml('copi05', 10, false);

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
                <button class="erp-tb-btn" title="確認/審核" id="copi05-tb-confirm" style="color:#C00000;font-weight:bold;">✔審核</button>
                <button class="erp-tb-btn" title="取消確認" id="copi05-tb-unconfirm" style="color:#666;">✖反審</button>
                <button class="erp-tb-btn" title="轉客戶訂單 (COPI06)" onclick="Modules.open('COPI06')" style="color:#003399;font-weight:bold;">📋轉訂單</button>
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
                            <label style="min-width:auto;"><input type="checkbox" id="copi05-chk-custconfirm" checked> 客戶確認</label>
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
                                <option>2:應稅外加</option>
                                <option>1:應稅內含</option>
                                <option>3:零稅率</option>
                            </select>
                        </div>
                        <div class="erp-field">
                            <label>列印格式</label>
                            <select style="width:90px;"><option>1:中式</option><option>2:英式</option></select>
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
                            <input type="text" id="copi05-tax-rate" style="width:60px;text-align:right;" value="5.000%">
                        </div>
                        <div class="erp-field">
                            <label>傳送次數</label>
                            <input type="text" style="width:35px;text-align:center;" value="0" readonly>
                        </div>
                        <div class="erp-field">
                            <label>列印</label>
                            <input type="text" style="width:35px;text-align:center;" value="0" readonly>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>匯率</label>
                            <input type="text" id="copi05-rate" style="width:65px;text-align:right;" value="1">
                            <span class="erp-field-desc">$</span>
                        </div>
                        <div class="erp-field">
                            <label>價格條件</label>
                            <input type="text" style="width:110px;" value="">
                            <button class="lookup-icon-btn">🔍</button>
                        </div>
                        <div class="erp-field">
                            <label>簽核狀態</label>
                            <input type="text" class="erp-input-readonly" style="width:130px;" value="N:不執行電子簽核" readonly>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label style="min-width:auto;"><input type="checkbox"> 單身多稅率</label>
                        </div>
                        <div class="erp-field" style="margin-left:14px;">
                            <label>付款條件</label>
                            <input type="text" style="width:110px;" value="">
                            <button class="lookup-icon-btn">🔍</button>
                        </div>
                    </div>
                </div>

                <!-- 1:1 10-Row DataGrid Table (擷取1.PNG - 交替薄荷綠底色) -->
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
                            ${gridRowsHtml}
                        </tbody>
                    </table>
                </div>

                <!-- Totals Panel (1:1 擷取1.PNG - 雙列清晰合計) -->
                <div class="erp-totals-panel">
                    <div class="erp-totals-row">
                        <div>報價金額: <input type="text" id="copi05-tot-amt" class="erp-input-readonly" style="width:95px;text-align:right;" value="0" readonly></div>
                        <div>稅額: <input type="text" id="copi05-tot-tax" class="erp-input-readonly" style="width:85px;text-align:right;" value="0" readonly></div>
                        <div>合計: <input type="text" id="copi05-tot-grand" class="erp-input-readonly" style="width:105px;text-align:right;" value="0" readonly></div>
                    </div>
                    <div class="erp-totals-row">
                        <div>總數量: <input type="text" id="copi05-tot-qty" class="erp-input-readonly" style="width:65px;text-align:right;" value="0" readonly></div>
                        <div>總毛重(Kg): <input type="text" class="erp-input-readonly" style="width:55px;text-align:right;" value="0" readonly></div>
                        <div>總材積(Volume): <input type="text" class="erp-input-readonly" style="width:55px;text-align:right;" value="0" readonly></div>
                    </div>
                </div>
            </div>

            <!-- Browse View (1:1 資料瀏覽清單) -->
            <div id="copi05-view-browse" class="erp-browse-view" style="display:none;">
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

            <!-- Statusbar (1:1 擷取1.PNG) -->
            <div class="erp-window-statusbar">
                <span class="status-cell" id="copi05-status-msg">瀏覽 | 單身資料筆數: 0</span>
                <span class="status-cell">127.0.0.1 - 211</span>
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
            const browseTbody = winEl.querySelector('#copi05-browse-tbody');

            let currentDocStatus = '未確認';

            const calcTotals = () => {
                let sumAmt = 0, sumQty = 0, lineCount = 0;
                for (let i = 1; i <= 10; i++) {
                    const q = parseFloat(winEl.querySelector(`#copi05-qty-${i}`).value) || 0;
                    const aStr = winEl.querySelector(`#copi05-amount-${i}`).value.replace(/,/g, '');
                    const a = parseFloat(aStr) || 0;
                    if (q > 0) {
                        sumQty += q; sumAmt += a; lineCount++;
                    }
                }
                const tax = Math.round(sumAmt * 0.05);
                const grand = sumAmt + tax;
                fTotAmt.value = sumAmt.toLocaleString();
                fTotTax.value = tax.toLocaleString();
                fTotGrand.value = grand.toLocaleString();
                fTotQty.value = sumQty.toLocaleString();
                statusMsg.textContent = `瀏覽 | 單身資料筆數: ${lineCount} | ${winEl.querySelector('#copi05-item-no-1').value} ${winEl.querySelector('#copi05-item-name-1').value}`;
            };

            Modules.bindGridEvents(winEl, 'copi05', 10, calcTotals);

            // Tab Switching (詳細欄位 vs 資料瀏覽)
            tabDetail.addEventListener('click', () => {
                tabDetail.classList.add('active');
                tabBrowse.classList.remove('active');
                viewDetail.style.display = 'flex';
                viewBrowse.style.display = 'none';
            });

            tabBrowse.addEventListener('click', async () => {
                tabBrowse.classList.add('active');
                tabDetail.classList.remove('active');
                viewDetail.style.display = 'none';
                viewBrowse.style.display = 'block';
                const res = await ERP_API.get('get_quotations');
                if (res.success) {
                    const quotes = res.data || [];
                    if (quotes.length === 0) {
                        browseTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px;">尚無報價單資料</td></tr>`;
                        return;
                    }
                    let rows = '';
                    quotes.forEach((q, idx) => {
                        rows += `
                            <tr data-no="${q.quote_no}" style="cursor:pointer;">
                                <td style="text-align:center;">${idx === 0 ? '▶' : ''}</td>
                                <td style="font-weight:bold; color:#003366;">${q.quote_no}</td>
                                <td style="text-align:center;">${q.quote_date}</td>
                                <td>${q.customer_no}</td>
                                <td>${q.customer_name}</td>
                                <td style="text-align:right;">${parseInt(q.quote_amount || 0).toLocaleString()}</td>
                                <td style="text-align:right; font-weight:bold;">${parseInt(q.grand_total || 0).toLocaleString()}</td>
                                <td style="text-align:center;">${q.status}</td>
                            </tr>
                        `;
                    });
                    browseTbody.innerHTML = rows;

                    browseTbody.querySelectorAll('tr').forEach(tr => {
                        tr.addEventListener('click', async () => {
                            const qNo = tr.getAttribute('data-no');
                            if (!qNo) return;
                            const dRes = await ERP_API.get('get_quotation', { quote_no: qNo });
                            if (dRes.success && dRes.quotation) {
                                fillQuote(dRes.quotation, dRes.details || []);
                                tabDetail.click();
                            }
                        });
                    });
                }
            });

            const fillQuote = (header, details = []) => {
                fType.value = header.quote_type || 'C211';
                fDocDate.value = header.doc_date || header.quote_date || '';
                fQuoteDate.value = header.quote_date || '';
                fNo.value = header.quote_no || '';
                fCustNo.value = header.customer_no || '';
                fCustDesc.textContent = header.customer_name || '';
                fSales.value = header.sales_person || '1001';
                fConfirmUser.value = header.confirm_user || '';
                currentDocStatus = header.status || '未確認';
                Modules.setDocStamp(winEl, currentDocStatus);

                for (let i = 1; i <= 10; i++) {
                    const d = details[i - 1];
                    winEl.querySelector(`#copi05-biz-item-${i}`).value = d ? (d.biz_item_no || '') : '';
                    winEl.querySelector(`#copi05-item-no-${i}`).value = d ? (d.item_no || '') : '';
                    winEl.querySelector(`#copi05-item-name-${i}`).value = d ? (d.item_name || '') : '';
                    winEl.querySelector(`#copi05-item-spec-${i}`).value = d ? (d.item_spec || '') : '';
                    winEl.querySelector(`#copi05-qty-${i}`).value = d ? (d.quote_qty || '') : '';
                    winEl.querySelector(`#copi05-unit-${i}`).value = d ? (d.unit || '台') : '';
                    winEl.querySelector(`#copi05-price-${i}`).value = d ? (d.unit_price || '') : '';
                    winEl.querySelector(`#copi05-amount-${i}`).value = d ? (parseInt(d.amount || 0).toLocaleString()) : '';
                    winEl.querySelector(`#copi05-date-${i}`).value = d ? (d.est_delivery_date || '') : '';
                }
                calcTotals();
            };

            const clearQuote = () => {
                fType.value = 'C211';
                const today = Modules.getTodayStr();
                fDocDate.value = today;
                fQuoteDate.value = today;
                fNo.value = today.replace(/\//g, '') + '004';
                fCustNo.value = '';
                fCustDesc.textContent = '';
                fSales.value = '1001';
                fConfirmUser.value = '';
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '未確認');

                for (let i = 1; i <= 10; i++) {
                    winEl.querySelector(`#copi05-biz-item-${i}`).value = '';
                    winEl.querySelector(`#copi05-item-no-${i}`).value = '';
                    winEl.querySelector(`#copi05-item-name-${i}`).value = '';
                    winEl.querySelector(`#copi05-item-spec-${i}`).value = '';
                    winEl.querySelector(`#copi05-qty-${i}`).value = '';
                    winEl.querySelector(`#copi05-unit-${i}`).value = '';
                    winEl.querySelector(`#copi05-price-${i}`).value = '';
                    winEl.querySelector(`#copi05-amount-${i}`).value = '';
                    winEl.querySelector(`#copi05-date-${i}`).value = '';
                }
                calcTotals();
                fCustNo.focus();
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
                    fCustNo.value = c.customer_no;
                    fCustDesc.textContent = c.name_short || c.full_name;
                });
            });

            winEl.querySelector('#copi05-lookup-sales').addEventListener('click', () => {
                Modules.openLookup('salesperson', (s) => { fSales.value = s.code; });
            });

            winEl.querySelector('#copi05-lookup-currency').addEventListener('click', () => {
                Modules.openLookup('currency', (cur) => { winEl.querySelector('#copi05-currency').value = cur.code; });
            });

            // Toolbar
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
                const qNo = fNo.value.trim();
                const cNo = fCustNo.value.trim();
                if (!qNo || !cNo) {
                    alert('【必填檢查】請輸入報價單號及客戶代號！');
                    return;
                }
                const details = [];
                for (let i = 1; i <= 10; i++) {
                    const iNo = winEl.querySelector(`#copi05-item-no-${i}`).value.trim();
                    const q = parseFloat(winEl.querySelector(`#copi05-qty-${i}`).value) || 0;
                    if (iNo && q > 0) {
                        details.push({
                            biz_item_no: winEl.querySelector(`#copi05-biz-item-${i}`).value.trim(),
                            item_no: iNo,
                            item_name: winEl.querySelector(`#copi05-item-name-${i}`).value.trim(),
                            item_spec: winEl.querySelector(`#copi05-item-spec-${i}`).value.trim(),
                            quote_qty: q,
                            unit: winEl.querySelector(`#copi05-unit-${i}`).value.trim() || '台',
                            unit_price: parseFloat(winEl.querySelector(`#copi05-price-${i}`).value) || 0,
                            amount: parseFloat(winEl.querySelector(`#copi05-amount-${i}`).value.replace(/,/g, '')) || 0,
                            est_delivery_date: winEl.querySelector(`#copi05-date-${i}`).value.trim() || Modules.getTodayStr()
                        });
                    }
                }
                if (details.length === 0) {
                    alert('【明細檢查】請至少在表格第一列挑選品號並輸入報價數量！');
                    return;
                }

                const payload = {
                    header: {
                        quote_no: qNo,
                        quote_type: fType.value.trim() || 'C211',
                        quote_date: fQuoteDate.value.trim() || Modules.getTodayStr(),
                        customer_no: cNo,
                        customer_name: fCustDesc.textContent.trim(),
                        sales_person: fSales.value.trim(),
                        status: currentDocStatus
                    },
                    details
                };

                const res = await ERP_API.post('save_quotation', payload);
                if (res.success) {
                    alert(`報價單 [${qNo}] 儲存成功！`);
                } else {
                    alert('儲存失敗: ' + (res.error || '不明錯誤'));
                }
            });

            winEl.querySelector('#copi05-tb-confirm').addEventListener('click', async () => {
                const qNo = fNo.value.trim();
                if (!qNo) return;
                if (confirm(`確定要審核確認報價單 [${qNo}] 嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'quotation', doc_no: qNo, status: '已確認' });
                    if (res.success) {
                        currentDocStatus = '已確認';
                        fConfirmUser.value = App.currentUser?.username || 'B18';
                        Modules.setDocStamp(winEl, '已確認');
                        alert('報價單審核完成！');
                    }
                }
            });

            winEl.querySelector('#copi05-tb-unconfirm').addEventListener('click', async () => {
                const qNo = fNo.value.trim();
                if (!qNo) return;
                if (confirm(`確定要取消報價單 [${qNo}] 的審核狀態嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'quotation', doc_no: qNo, status: '未確認' });
                    if (res.success) {
                        currentDocStatus = '未確認';
                        fConfirmUser.value = '';
                        Modules.setDocStamp(winEl, '未確認');
                        alert('報價單審核已取消！');
                    }
                }
            });

            winEl.querySelector('#copi05-tb-del').addEventListener('click', async () => {
                const qNo = fNo.value.trim();
                if (!qNo) return;
                if (confirm(`確定要刪除報價單 [${qNo}] 嗎？`)) {
                    const res = await ERP_API.post('delete_quotation', { quote_no: qNo });
                    if (res.success) {
                        alert('報價單已成功刪除！');
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

// --------------------------------------------------------
// 2. 銷貨單建立作業 (COPI08) - 1:1 擷取2 (media_1793885786161_97ad1ed4.png)
// --------------------------------------------------------
fwrite($fp, <<<'JS'
    // ========================================================
    // 2. 銷貨單建立作業 (COPI08) - 1:1 擷取2
    // ========================================================
    openCOPI08() {
        const u = App.currentUser?.company || '學生區';
        const title = `銷貨單建立作業(COPI08)[${u}]`;
        const winId = 'COPI08';

        let gridRowsHtml = '';
        for (let i = 1; i <= 10; i++) {
            const lineNo = String(i).padStart(4, '0');
            const ind = i === 1 ? '▶' : '';
            gridRowsHtml += `
                <tr data-row="${i}" class="${i === 1 ? 'active-row' : ''}">
                    <td style="text-align:center; width:22px; color:#003366; font-size:10px;">${ind}</td>
                    <td style="text-align:center; background:#00CED1; font-weight:bold; width:38px;">${lineNo}</td>
                    <td style="width:75px;"><input type="text" id="copi08-biz-item-${i}" value=""></td>
                    <td style="display:flex; align-items:center; padding:0 1px; width:100px;">
                        <input type="text" id="copi08-item-no-${i}" class="erp-input-yellow" style="flex:1;" value="">
                        <button type="button" class="lookup-icon-btn" data-lookup-row="${i}" title="挑選品號">🔍</button>
                    </td>
                    <td style="width:160px;"><input type="text" id="copi08-item-name-${i}" value=""></td>
                    <td style="width:120px;"><input type="text" id="copi08-item-spec-${i}" value=""></td>
                    <td style="width:70px;"><input type="text" id="copi08-wh-${i}" class="erp-input-yellow" style="text-align:center;" value=""></td>
                    <td style="width:100px;"><input type="text" id="copi08-wh-name-${i}" value="" readonly></td>
                    <td style="width:65px;"><input type="text" id="copi08-qty-${i}" class="grid-qty" style="text-align:right;" value=""></td>
                    <td style="width:40px;"><input type="text" id="copi08-unit-${i}" style="text-align:center;" value=""></td>
                    <td style="width:75px;"><input type="text" id="copi08-price-${i}" class="grid-price" style="text-align:right;" value=""></td>
                    <td style="width:85px;"><input type="text" id="copi08-amount-${i}" class="grid-amount erp-input-readonly" style="text-align:right;" value="" readonly></td>
                </tr>
            `;
        }

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
                <button class="erp-tb-btn" title="確認/審核" id="copi08-tb-confirm" style="color:#C00000;font-weight:bold;">✔審核</button>
                <button class="erp-tb-btn" title="取消確認" id="copi08-tb-unconfirm" style="color:#666;">✖反審</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('出貨裝箱單列印中...')">🖨️</button>
            </div>

            <!-- Top Tab Header -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="copi08-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="copi08-tab-browse">資料瀏覽</button>
            </div>

            <!-- Detail View -->
            <div id="copi08-view-detail" style="display:flex; flex-direction:column; flex:1;">
                <!-- Header Panel (1:1 擷取2.PNG - 含紅色核准章) -->
                <div class="erp-header-panel">
                    <div class="erp-stamp-he" style="display:none;">核</div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>銷貨單別</label>
                            <input type="text" id="copi08-type" class="erp-input-cyan" style="width:65px;" value="A231">
                            <button class="lookup-icon-btn" id="copi08-lookup-type">🔍</button>
                            <span class="erp-field-desc">銷貨單</span>
                        </div>
                        <div class="erp-field">
                            <label>單據日期</label>
                            <input type="text" id="copi08-doc-date" class="erp-input-yellow" style="width:85px;" value="">
                            <input type="checkbox">
                        </div>
                        <div class="erp-field">
                            <label>銷貨日期</label>
                            <input type="text" id="copi08-deliv-date" style="width:85px;" value="">
                        </div>
                        <div class="erp-field" style="margin-left:8px;">
                            <label style="min-width:auto;"><input type="checkbox"> 產生分錄-收入</label>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>銷貨單號</label>
                            <input type="text" id="copi08-no" class="erp-input-cyan" style="width:130px;" value="">
                        </div>
                        <div class="erp-field">
                            <label>客戶代號</label>
                            <input type="text" id="copi08-cust-no" class="erp-input-yellow" style="width:80px;" value="">
                            <button class="lookup-icon-btn" id="copi08-lookup-cust">👥</button>
                            <span class="erp-field-desc" id="copi08-cust-desc" style="min-width:70px;">標竿公司</span>
                        </div>
                        <div class="erp-field" style="margin-left:14px;">
                            <label style="min-width:auto;"><input type="checkbox"> 產生分錄-成本</label>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>流程代號</label>
                            <input type="text" style="width:65px;" value="">
                            <button class="lookup-icon-btn">🔍</button>
                        </div>
                        <div class="erp-field" style="margin-left:8px;">
                            <label style="min-width:auto;"><input type="checkbox"> 不控管信用額度</label>
                        </div>
                        <div class="erp-field" style="margin-left:14px;">
                            <label>拋轉狀態</label>
                            <input type="text" class="erp-input-readonly" style="width:90px;" value="N:未拋轉" readonly>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label style="min-width:auto;"><input type="checkbox"> 現銷</label>
                        </div>
                        <div class="erp-field" style="margin-left:20px;">
                            <label>EBO拋轉狀態</label>
                            <input type="text" class="erp-input-readonly" style="width:90px;" value="不需拋轉" readonly>
                        </div>
                    </div>
                </div>

                <!-- Subtab Header (1:1 擷取2.PNG) -->
                <div class="erp-subtab-header">
                    <button class="erp-subtab-btn active">交易資料</button>
                    <button class="erp-subtab-btn">送貨資料</button>
                    <button class="erp-subtab-btn">發票資料(一)</button>
                    <button class="erp-subtab-btn">發票資料(二)</button>
                    <button class="erp-subtab-btn">其他資料</button>
                    <button class="erp-subtab-btn">訂金/派車資料</button>
                </div>

                <!-- Subtab Content (1:1 擷取2.PNG) -->
                <div class="erp-tab-content">
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>部門代號</label>
                            <input type="text" id="copi08-dept" style="width:70px;" value="1000">
                            <button class="lookup-icon-btn">🏢</button>
                            <span class="erp-field-desc" style="min-width:65px;">業務部</span>
                        </div>
                        <div class="erp-field">
                            <label>幣別</label>
                            <input type="text" id="copi08-currency" class="erp-input-yellow" style="width:55px;" value="NTD">
                            <span class="erp-field-desc">$ 台幣</span>
                        </div>
                        <div class="erp-field">
                            <label>簽核狀態</label>
                            <input type="text" class="erp-input-readonly" style="width:130px;" value="N:不執行電子簽核" readonly>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>業務人員</label>
                            <input type="text" id="copi08-sales" style="width:70px;" value="1001">
                            <button class="lookup-icon-btn">👤</button>
                            <span class="erp-field-desc" style="min-width:65px;">張明達(業</span>
                        </div>
                        <div class="erp-field">
                            <label>匯率</label>
                            <input type="text" style="width:55px;text-align:right;" value="1">
                            <span class="erp-field-desc">$</span>
                        </div>
                        <div class="erp-field">
                            <label>確認者</label>
                            <input type="text" id="copi08-confirm-user" class="erp-input-readonly" style="width:65px;" value="" readonly>
                            <span class="erp-field-desc">學生B18</span>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>出貨廠別</label>
                            <input type="text" id="copi08-factory" class="erp-input-yellow" style="width:70px;" value="TP01">
                            <button class="lookup-icon-btn">🏬</button>
                            <span class="erp-field-desc" style="min-width:65px;">製造一廠</span>
                        </div>
                        <div class="erp-field">
                            <label>保稅碼</label>
                            <select style="width:110px;"><option>0.依品號預設</option></select>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>付款條件</label>
                            <input type="text" style="width:70px;" value="202">
                            <button class="lookup-icon-btn">🔍</button>
                            <span class="erp-field-desc">次月20日收票</span>
                        </div>
                        <div class="erp-field">
                            <label>備註</label>
                            <input type="text" style="width:130px;" value="">
                            <button class="lookup-icon-btn">📝</button>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>交易條件</label>
                            <input type="text" style="width:40px;" value="1">
                            <button class="lookup-icon-btn">🔍</button>
                            <span class="erp-field-desc">一般交易</span>
                        </div>
                        <div class="erp-field">
                            <label>件數</label>
                            <input type="text" style="width:40px;text-align:center;" value="0">
                        </div>
                        <div class="erp-field">
                            <label>列印</label>
                            <input type="text" style="width:30px;text-align:center;" value="0" readonly>
                        </div>
                        <div class="erp-field">
                            <label>發票列印</label>
                            <input type="text" style="width:30px;text-align:center;" value="0" readonly>
                        </div>
                        <div class="erp-field">
                            <label>傳送次數</label>
                            <input type="text" style="width:30px;text-align:center;" value="0" readonly>
                        </div>
                    </div>
                </div>

                <!-- 1:1 10-Row DataGrid (擷取2.PNG) -->
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
                            ${gridRowsHtml}
                        </tbody>
                    </table>
                </div>

                <!-- 1:1 Totals Panel (擷取2.PNG - 3列清晰合計) -->
                <div class="erp-totals-panel">
                    <div class="erp-totals-row">
                        <div>原幣銷貨金額: <input type="text" id="copi08-tot-amt" class="erp-input-readonly" style="width:90px;text-align:right;" value="0" readonly></div>
                        <div>原幣銷貨稅額: <input type="text" id="copi08-tot-tax" class="erp-input-readonly" style="width:75px;text-align:right;" value="0" readonly></div>
                        <div>原幣合計: <input type="text" id="copi08-tot-grand" class="erp-input-readonly" style="width:95px;text-align:right;" value="0" readonly></div>
                    </div>
                    <div class="erp-totals-row">
                        <div>本幣銷貨金額: <input type="text" id="copi08-local-amt" class="erp-input-readonly" style="width:90px;text-align:right;" value="0" readonly></div>
                        <div>本幣銷貨稅額: <input type="text" id="copi08-local-tax" class="erp-input-readonly" style="width:75px;text-align:right;" value="0" readonly></div>
                        <div>本幣合計: <input type="text" id="copi08-local-grand" class="erp-input-readonly" style="width:95px;text-align:right;" value="0" readonly></div>
                    </div>
                    <div class="erp-totals-row">
                        <div>總數量: <input type="text" id="copi08-tot-qty" class="erp-input-readonly" style="width:65px;text-align:right;" value="0" readonly></div>
                    </div>
                </div>
            </div>

            <!-- Browse View -->
            <div id="copi08-view-browse" class="erp-browse-view" style="display:none;">
                <table class="erp-grid-table">
                    <thead>
                        <tr>
                            <th style="width:25px;"></th>
                            <th class="th-cyan" style="width:130px;">銷貨單號</th>
                            <th style="width:85px;">銷貨日期</th>
                            <th style="width:80px;">客戶代號</th>
                            <th style="width:160px;">客戶名稱</th>
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

            <!-- Statusbar (1:1 擷取2.PNG) -->
            <div class="erp-window-statusbar">
                <span class="status-cell" id="copi08-status-msg">瀏覽 | 單身資料筆數: 0</span>
                <span class="status-cell">127.0.0.1 - 211</span>
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
            const fLocalAmt = winEl.querySelector('#copi08-local-amt');
            const fLocalTax = winEl.querySelector('#copi08-local-tax');
            const fLocalGrand = winEl.querySelector('#copi08-local-grand');
            const fTotQty = winEl.querySelector('#copi08-tot-qty');
            const statusMsg = winEl.querySelector('#copi08-status-msg');

            const tabDetail = winEl.querySelector('#copi08-tab-detail');
            const tabBrowse = winEl.querySelector('#copi08-tab-browse');
            const viewDetail = winEl.querySelector('#copi08-view-detail');
            const viewBrowse = winEl.querySelector('#copi08-view-browse');
            const browseTbody = winEl.querySelector('#copi08-browse-tbody');

            let currentDocStatus = '未確認';

            const calcTotals = () => {
                let sumAmt = 0, sumQty = 0, lineCount = 0;
                for (let i = 1; i <= 10; i++) {
                    const q = parseFloat(winEl.querySelector(`#copi08-qty-${i}`).value) || 0;
                    const aStr = winEl.querySelector(`#copi08-amount-${i}`).value.replace(/,/g, '');
                    const a = parseFloat(aStr) || 0;
                    if (q > 0) {
                        sumQty += q; sumAmt += a; lineCount++;
                    }
                }
                const tax = Math.round(sumAmt * 0.05);
                const grand = sumAmt + tax;
                fTotAmt.value = sumAmt.toLocaleString();
                fTotTax.value = tax.toLocaleString();
                fTotGrand.value = grand.toLocaleString();
                fLocalAmt.value = sumAmt.toLocaleString();
                fLocalTax.value = tax.toLocaleString();
                fLocalGrand.value = grand.toLocaleString();
                fTotQty.value = sumQty.toLocaleString();
                statusMsg.textContent = `瀏覽 | 單身資料筆數: ${lineCount} | ${winEl.querySelector('#copi08-item-no-1').value} ${winEl.querySelector('#copi08-item-name-1').value}`;
            };

            for (let i = 1; i <= 10; i++) {
                const itemInp = winEl.querySelector(`#copi08-item-no-${i}`);
                const nameInp = winEl.querySelector(`#copi08-item-name-${i}`);
                const specInp = winEl.querySelector(`#copi08-item-spec-${i}`);
                const whInp = winEl.querySelector(`#copi08-wh-${i}`);
                const whNameInp = winEl.querySelector(`#copi08-wh-name-${i}`);
                const qtyInp = winEl.querySelector(`#copi08-qty-${i}`);
                const unitInp = winEl.querySelector(`#copi08-unit-${i}`);
                const priceInp = winEl.querySelector(`#copi08-price-${i}`);
                const amtInp = winEl.querySelector(`#copi08-amount-${i}`);
                const btnLookup = winEl.querySelector(`button[data-lookup-row="${i}"]`);

                const calcRow = () => {
                    const q = parseFloat(qtyInp.value) || 0;
                    const p = parseFloat(priceInp.value) || 0;
                    const amt = Math.round(q * p);
                    amtInp.value = amt > 0 ? amt.toLocaleString() : '';
                    calcTotals();
                };

                if (qtyInp) qtyInp.addEventListener('input', calcRow);
                if (priceInp) priceInp.addEventListener('input', calcRow);

                if (btnLookup) {
                    btnLookup.addEventListener('click', () => {
                        Modules.openLookup('item', (item) => {
                            itemInp.value = item.item_no || '';
                            nameInp.value = item.item_name || '';
                            specInp.value = item.item_spec || '';
                            unitInp.value = item.unit || '台';
                            whInp.value = 'P003';
                            whNameInp.value = '成品倉一';
                            if (!priceInp.value) priceInp.value = item.std_price || item.retail_price || 15000;
                            if (!qtyInp.value) qtyInp.value = '50';
                            calcRow();
                        });
                    });
                }
            }

            // Tab Switch
            tabDetail.addEventListener('click', () => {
                tabDetail.classList.add('active');
                tabBrowse.classList.remove('active');
                viewDetail.style.display = 'flex';
                viewBrowse.style.display = 'none';
            });

            tabBrowse.addEventListener('click', async () => {
                tabBrowse.classList.add('active');
                tabDetail.classList.remove('active');
                viewDetail.style.display = 'none';
                viewBrowse.style.display = 'block';
                const res = await ERP_API.get('get_deliveries');
                if (res.success) {
                    const delivs = res.data || [];
                    if (delivs.length === 0) {
                        browseTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px;">尚無銷貨單資料</td></tr>`;
                        return;
                    }
                    let rows = '';
                    delivs.forEach((d, idx) => {
                        rows += `
                            <tr data-no="${d.delivery_no}" style="cursor:pointer;">
                                <td style="text-align:center;">${idx === 0 ? '▶' : ''}</td>
                                <td style="font-weight:bold; color:#003366;">${d.delivery_no}</td>
                                <td style="text-align:center;">${d.delivery_date}</td>
                                <td>${d.customer_no}</td>
                                <td>${d.customer_name}</td>
                                <td style="text-align:right;">${parseInt(d.delivery_amount || 0).toLocaleString()}</td>
                                <td style="text-align:right; font-weight:bold;">${parseInt(d.grand_total || 0).toLocaleString()}</td>
                                <td style="text-align:center;">${d.status}</td>
                            </tr>
                        `;
                    });
                    browseTbody.innerHTML = rows;

                    browseTbody.querySelectorAll('tr').forEach(tr => {
                        tr.addEventListener('click', async () => {
                            const dNo = tr.getAttribute('data-no');
                            if (!dNo) return;
                            const dRes = await ERP_API.get('get_delivery', { delivery_no: dNo });
                            if (dRes.success && dRes.delivery) {
                                fillDeliv(dRes.delivery, dRes.details || []);
                                tabDetail.click();
                            }
                        });
                    });
                }
            });

            const fillDeliv = (header, details = []) => {
                fType.value = header.delivery_type || 'A231';
                fDocDate.value = header.delivery_date || '';
                fDelivDate.value = header.delivery_date || '';
                fNo.value = header.delivery_no || '';
                fCustNo.value = header.customer_no || '';
                fCustDesc.textContent = header.customer_name || '';
                fConfirmUser.value = header.confirm_user || '';
                currentDocStatus = header.status || '未確認';
                Modules.setDocStamp(winEl, currentDocStatus);

                for (let i = 1; i <= 10; i++) {
                    const d = details[i - 1];
                    winEl.querySelector(`#copi08-biz-item-${i}`).value = d ? (d.biz_item_no || '') : '';
                    winEl.querySelector(`#copi08-item-no-${i}`).value = d ? (d.item_no || '') : '';
                    winEl.querySelector(`#copi08-item-name-${i}`).value = d ? (d.item_name || '') : '';
                    winEl.querySelector(`#copi08-item-spec-${i}`).value = d ? (d.item_spec || '') : '';
                    winEl.querySelector(`#copi08-wh-${i}`).value = d ? (d.warehouse || 'P003') : '';
                    winEl.querySelector(`#copi08-wh-name-${i}`).value = d ? (d.warehouse === 'P003' ? '成品倉一' : '成品倉二') : '';
                    winEl.querySelector(`#copi08-qty-${i}`).value = d ? (d.delivery_qty || '') : '';
                    winEl.querySelector(`#copi08-unit-${i}`).value = d ? (d.unit || '台') : '';
                    winEl.querySelector(`#copi08-price-${i}`).value = d ? (d.unit_price || '') : '';
                    winEl.querySelector(`#copi08-amount-${i}`).value = d ? (parseInt(d.amount || 0).toLocaleString()) : '';
                }
                calcTotals();
            };

            const clearDeliv = () => {
                fType.value = 'A231';
                const today = Modules.getTodayStr();
                fDocDate.value = today;
                fDelivDate.value = today;
                fNo.value = today.replace(/\//g, '') + '007';
                fCustNo.value = '';
                fCustDesc.textContent = '';
                fConfirmUser.value = '';
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '未確認');

                for (let i = 1; i <= 10; i++) {
                    winEl.querySelector(`#copi08-biz-item-${i}`).value = '';
                    winEl.querySelector(`#copi08-item-no-${i}`).value = '';
                    winEl.querySelector(`#copi08-item-name-${i}`).value = '';
                    winEl.querySelector(`#copi08-item-spec-${i}`).value = '';
                    winEl.querySelector(`#copi08-wh-${i}`).value = '';
                    winEl.querySelector(`#copi08-wh-name-${i}`).value = '';
                    winEl.querySelector(`#copi08-qty-${i}`).value = '';
                    winEl.querySelector(`#copi08-unit-${i}`).value = '';
                    winEl.querySelector(`#copi08-price-${i}`).value = '';
                    winEl.querySelector(`#copi08-amount-${i}`).value = '';
                }
                calcTotals();
                fCustNo.focus();
            };

            // Lookups
            winEl.querySelector('#copi08-lookup-type').addEventListener('click', () => {
                Modules.openLookup('doc_type_deliv', (t) => { fType.value = t.code; });
            });

            winEl.querySelector('#copi08-lookup-cust').addEventListener('click', () => {
                Modules.openLookup('customer', (c) => {
                    fCustNo.value = c.customer_no;
                    fCustDesc.textContent = c.name_short || c.full_name;
                });
            });

            // Toolbar
            winEl.querySelector('#copi08-tb-new').addEventListener('click', clearDeliv);
            winEl.querySelector('#copi08-tb-query').addEventListener('click', () => {
                Modules.openLookup('delivery', async (d) => {
                    const res = await ERP_API.get('get_delivery', { delivery_no: d.delivery_no });
                    if (res.success && res.delivery) {
                        fillDeliv(res.delivery, res.details || []);
                    }
                });
            });

            winEl.querySelector('#copi08-tb-save').addEventListener('click', async () => {
                const dNo = fNo.value.trim();
                const cNo = fCustNo.value.trim();
                if (!dNo || !cNo) {
                    alert('【必填檢查】請輸入銷貨單號及客戶代號！');
                    return;
                }
                const details = [];
                for (let i = 1; i <= 10; i++) {
                    const iNo = winEl.querySelector(`#copi08-item-no-${i}`).value.trim();
                    const q = parseFloat(winEl.querySelector(`#copi08-qty-${i}`).value) || 0;
                    if (iNo && q > 0) {
                        details.push({
                            biz_item_no: winEl.querySelector(`#copi08-biz-item-${i}`).value.trim(),
                            item_no: iNo,
                            item_name: winEl.querySelector(`#copi08-item-name-${i}`).value.trim(),
                            item_spec: winEl.querySelector(`#copi08-item-spec-${i}`).value.trim(),
                            delivery_qty: q,
                            unit: winEl.querySelector(`#copi08-unit-${i}`).value.trim() || '台',
                            unit_price: parseFloat(winEl.querySelector(`#copi08-price-${i}`).value) || 0,
                            amount: parseFloat(winEl.querySelector(`#copi08-amount-${i}`).value.replace(/,/g, '')) || 0,
                            warehouse: winEl.querySelector(`#copi08-wh-${i}`).value.trim() || 'P003'
                        });
                    }
                }
                if (details.length === 0) {
                    alert('【明細檢查】請至少在表格第一列輸入銷貨品號及出貨數量！');
                    return;
                }

                const payload = {
                    header: {
                        delivery_no: dNo,
                        delivery_type: fType.value.trim() || 'A231',
                        delivery_date: fDelivDate.value.trim() || Modules.getTodayStr(),
                        customer_no: cNo,
                        customer_name: fCustDesc.textContent.trim(),
                        status: currentDocStatus
                    },
                    details
                };

                const res = await ERP_API.post('save_delivery', payload);
                if (res.success) {
                    alert(`銷貨單 [${dNo}] 儲存成功！`);
                } else {
                    alert('儲存失敗: ' + (res.error || '不明錯誤'));
                }
            });

            winEl.querySelector('#copi08-tb-confirm').addEventListener('click', async () => {
                const dNo = fNo.value.trim();
                if (!dNo) return;
                if (confirm(`確定要審核確認銷貨單 [${dNo}] 嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'delivery', doc_no: dNo, status: '已確認' });
                    if (res.success) {
                        currentDocStatus = '已確認';
                        fConfirmUser.value = App.currentUser?.username || 'B18';
                        Modules.setDocStamp(winEl, '已確認');
                        alert('銷貨單審核完成！');
                    }
                }
            });

            winEl.querySelector('#copi08-tb-unconfirm').addEventListener('click', async () => {
                const dNo = fNo.value.trim();
                if (!dNo) return;
                if (confirm(`確定要取消銷貨單 [${dNo}] 的審核狀態嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'delivery', doc_no: dNo, status: '未確認' });
                    if (res.success) {
                        currentDocStatus = '未確認';
                        fConfirmUser.value = '';
                        Modules.setDocStamp(winEl, '未確認');
                        alert('銷貨單審核已取消！');
                    }
                }
            });

            winEl.querySelector('#copi08-tb-del').addEventListener('click', async () => {
                const dNo = fNo.value.trim();
                if (!dNo) return;
                if (confirm(`確定要刪除銷貨單 [${dNo}] 嗎？`)) {
                    const res = await ERP_API.post('delete_delivery', { delivery_no: dNo });
                    if (res.success) {
                        alert('銷貨單已成功刪除！');
                        clearDeliv();
                    } else {
                        alert('刪除失敗: ' + (res.error || '不明錯誤'));
                    }
                }
            });
        });
    },

JS);

echo "COPI08 written.\n";

// --------------------------------------------------------
// 3. 客戶資料建立作業 (COPI01) - 1:1 擷取3 (media_1793885786163_2162a672.png)
// --------------------------------------------------------
fwrite($fp, <<<'JS'
    // ========================================================
    // 3. 客戶資料建立作業 (COPI01) - 1:1 擷取3
    // ========================================================
    openCOPI01() {
        const u = App.currentUser?.company || '學生區';
        const title = `客戶資料建立作業(COPI01)[${u}]`;
        const winId = 'COPI01';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">資料(<u>D</u>)</span>
                <span class="erp-menu-item">功能(<u>F</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="新增" id="copi01-tb-new">📄</button>
                <button class="erp-tb-btn" title="查詢" id="copi01-tb-query">🔍</button>
                <button class="erp-tb-btn" title="修改" id="copi01-tb-edit">✏️</button>
                <button class="erp-tb-btn" title="刪除" id="copi01-tb-del">🗑️</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="首筆" id="copi01-tb-first">|◀</button>
                <button class="erp-tb-btn" title="上筆" id="copi01-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下筆" id="copi01-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="copi01-tb-last">▶|</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="儲存" id="copi01-tb-save" style="color:green;font-weight:bold;">💾</button>
                <button class="erp-tb-btn" title="取消" id="copi01-tb-cancel" style="color:red;font-weight:bold;">✖</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('客戶資料列印中...')">🖨️</button>
            </div>

            <!-- Top Tab Header -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="copi01-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="copi01-tab-browse">資料瀏覽</button>
            </div>

            <!-- Detail View -->
            <div id="copi01-view-detail" style="display:flex; flex-direction:column; flex:1;">
                <!-- Header Panel (1:1 擷取3.PNG) -->
                <div class="erp-header-panel">
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>客戶代號</label>
                            <input type="text" id="copi01-cust-no" class="erp-input-cyan" style="width:110px;" value="1107">
                            <button class="lookup-icon-btn" id="copi01-lookup-cust">👥</button>
                        </div>
                        <div class="erp-field">
                            <label>客戶簡稱</label>
                            <input type="text" id="copi01-name-short" style="width:230px;" value="大進文化">
                        </div>
                        <div class="erp-field">
                            <label>版次</label>
                            <input type="text" id="copi01-version" style="width:50px;" value="0000">
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>客戶全名</label>
                            <input type="text" id="copi01-full-name" style="width:340px;" value="大進文化圖書股份有限公司">
                            <button class="lookup-icon-btn">📝</button>
                        </div>
                        <div class="erp-field">
                            <label>客戶核准日</label>
                            <input type="text" id="copi01-approval-date" style="width:90px;" value="2006/10/04">
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>客戶英文全名</label>
                            <input type="text" id="copi01-eng-name" style="width:340px;" value="Ta Chin Cultural Book Co., Ltd.">
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>關係人代號</label>
                            <input type="text" style="width:180px;" value="">
                            <button class="lookup-icon-btn">🏢</button>
                        </div>
                    </div>
                </div>

                <!-- Subtab Header (1:1 擷取3.PNG) -->
                <div class="erp-subtab-header">
                    <button class="erp-subtab-btn active">基本資料</button>
                    <button class="erp-subtab-btn">基本資料(二)</button>
                    <button class="erp-subtab-btn">地址資料</button>
                    <button class="erp-subtab-btn">交易資料(一)</button>
                    <button class="erp-subtab-btn">交易資料(二)</button>
                    <button class="erp-subtab-btn">信用額度</button>
                    <button class="erp-subtab-btn">國外資料</button>
                </div>

                <!-- Subtab Content (1:1 擷取3.PNG - 乾淨左右對稱兩欄) -->
                <div class="erp-tab-content" style="flex:1;">
                    <div class="erp-two-column-form">
                        <!-- Left Column -->
                        <div class="col-half">
                            <div class="erp-field"><label>負責人</label><input type="text" id="copi01-boss" style="width:180px;" value="呂育德"></div>
                            <div class="erp-field"><label>連絡人</label><input type="text" id="copi01-contact" style="width:180px;" value="呂育德"><button class="lookup-icon-btn">👥</button></div>
                            <div class="erp-field"><label>TEL_NO(一)</label><input type="text" id="copi01-tel1" style="width:180px;" value="02-23651234"></div>
                            <div class="erp-field"><label>TEL_NO(二)</label><input type="text" style="width:180px;" value=""></div>
                            <div class="erp-field"><label>FAX NO</label><input type="text" id="copi01-fax" style="width:180px;" value="02-23655678"></div>
                            <div class="erp-field"><label>E-Mail</label><input type="text" id="copi01-email" style="width:230px;" value="tachin@book.com.tw"></div>
                            <div class="erp-field"><label>統一編號</label><input type="text" id="copi01-tax-id" style="width:130px;" value="28226438"></div>
                            <div class="erp-field"><label>資本額</label><input type="text" style="width:120px; text-align:right;" value="2,500,000"> 萬</div>
                            <div class="erp-field"><label>年營業額</label><input type="text" style="width:120px; text-align:right;" value="0"> 萬</div>
                            <div class="erp-field"><label>員工人數</label><input type="text" style="width:80px; text-align:right;" value="0"> 人</div>
                        </div>

                        <!-- Right Column -->
                        <div class="col-half">
                            <div class="erp-field"><label>總店號</label><input type="text" style="width:110px;" value=""><button class="lookup-icon-btn">👥</button></div>
                            <div class="erp-field" style="margin-left:70px;"><label style="min-width:auto;"><input type="checkbox"> 總公司請款</label></div>
                            <div class="erp-field" style="margin-left:70px;"><label style="min-width:auto;"><input type="checkbox"> 發票號碼依總公司控管</label></div>
                            <div class="erp-field" style="margin-left:70px;"><label style="min-width:auto;"><input type="checkbox"> 合約訂單是否歸屬總公司</label></div>
                            <div class="erp-field"><label>分店數</label><input type="text" style="width:60px; text-align:center;" value="0"></div>
                            <div class="erp-field"><label>交易幣別</label><input type="text" id="copi01-currency" class="erp-input-yellow" style="width:60px;" value="NTD"><span class="erp-field-desc">$</span></div>
                            <div class="erp-field"><label>部門別</label><input type="text" id="copi01-dept" style="width:100px;" value="0100"><button class="lookup-icon-btn">🏢</button></div>
                            <div class="erp-field"><label>業務人員</label><input type="text" id="copi01-sales" style="width:75px;" value="1001"><button class="lookup-icon-btn">👤</button><span class="erp-field-desc">張明達(業務)</span></div>
                            <div class="erp-field"><label>收款業務員</label><input type="text" style="width:75px;" value="1001"><button class="lookup-icon-btn">👤</button><span class="erp-field-desc">張明達(業務)</span></div>
                            <div class="erp-field"><label>開業日期</label><input type="text" style="width:85px;" value="2006/10/04"><input type="checkbox"></div>
                            <div class="erp-field"><label>歇業日期</label><input type="text" style="width:85px;" value=""><input type="checkbox"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Browse View (1:1 擷取畫面 - 客戶清單瀏覽) -->
            <div id="copi01-view-browse" class="erp-browse-view" style="display:none;">
                <table class="erp-grid-table">
                    <thead>
                        <tr>
                            <th style="width:25px;"></th>
                            <th class="th-cyan" style="width:90px;">客戶代號</th>
                            <th style="width:120px;">客戶簡稱</th>
                            <th style="width:220px;">客戶全名</th>
                            <th style="width:90px;">統一編號</th>
                            <th style="width:100px;">負責人</th>
                            <th style="width:100px;">業務人員</th>
                        </tr>
                    </thead>
                    <tbody id="copi01-browse-tbody">
                        <tr><td colspan="7" style="text-align:center; padding:20px;">載入客戶清單中...</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Statusbar -->
            <div class="erp-window-statusbar">
                <span class="status-cell" id="copi01-status-msg">瀏覽</span>
                <span class="status-cell">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 940, 580, (winEl) => {
            const fCustNo = winEl.querySelector('#copi01-cust-no');
            const fNameShort = winEl.querySelector('#copi01-name-short');
            const fFullName = winEl.querySelector('#copi01-full-name');
            const fEngName = winEl.querySelector('#copi01-eng-name');
            const fVersion = winEl.querySelector('#copi01-version');
            const fApprovalDate = winEl.querySelector('#copi01-approval-date');
            const fTaxId = winEl.querySelector('#copi01-tax-id');
            const fBoss = winEl.querySelector('#copi01-boss');
            const fContact = winEl.querySelector('#copi01-contact');
            const fTel1 = winEl.querySelector('#copi01-tel1');
            const fFax = winEl.querySelector('#copi01-fax');
            const fEmail = winEl.querySelector('#copi01-email');
            const fCurrency = winEl.querySelector('#copi01-currency');
            const fSales = winEl.querySelector('#copi01-sales');
            const fDept = winEl.querySelector('#copi01-dept');
            const statusMsg = winEl.querySelector('#copi01-status-msg');

            const tabDetail = winEl.querySelector('#copi01-tab-detail');
            const tabBrowse = winEl.querySelector('#copi01-tab-browse');
            const viewDetail = winEl.querySelector('#copi01-view-detail');
            const viewBrowse = winEl.querySelector('#copi01-view-browse');
            const browseTbody = winEl.querySelector('#copi01-browse-tbody');

            const fillForm = (d) => {
                if (!d) return;
                fCustNo.value = d.customer_no || '';
                fNameShort.value = d.name_short || '';
                fFullName.value = d.full_name || '';
                fEngName.value = d.eng_name || '';
                fVersion.value = d.version || '0000';
                fApprovalDate.value = d.approval_date || '';
                fTaxId.value = d.tax_id || '';
                fBoss.value = d.boss || '';
                fContact.value = d.contact || '';
                fTel1.value = d.tel1 || '';
                fFax.value = d.fax || '';
                fEmail.value = d.email || '';
                fCurrency.value = d.currency || 'NTD';
                fSales.value = d.sales_person ? d.sales_person.split(' ')[0] : '1001';
                fDept.value = d.dept ? d.dept.split(' ')[0] : '0100';
                statusMsg.textContent = `瀏覽 | 客戶: [${d.customer_no}] ${d.name_short}`;
            };

            const clearForm = () => {
                fCustNo.value = '';
                fNameShort.value = '';
                fFullName.value = '';
                fEngName.value = '';
                fVersion.value = '0000';
                fApprovalDate.value = Modules.getTodayStr();
                fTaxId.value = '';
                fBoss.value = '';
                fContact.value = '';
                fTel1.value = '';
                fFax.value = '';
                fEmail.value = '';
                fCurrency.value = 'NTD';
                fSales.value = '1001';
                fDept.value = '0100';
                statusMsg.textContent = '新增模式';
                fCustNo.focus();
            };

            tabDetail.addEventListener('click', () => {
                tabDetail.classList.add('active');
                tabBrowse.classList.remove('active');
                viewDetail.style.display = 'flex';
                viewBrowse.style.display = 'none';
            });

            tabBrowse.addEventListener('click', async () => {
                tabBrowse.classList.add('active');
                tabDetail.classList.remove('active');
                viewDetail.style.display = 'none';
                viewBrowse.style.display = 'block';

                const res = await ERP_API.get('get_customers');
                if (res.success) {
                    const custs = res.data || [];
                    let rows = '';
                    custs.forEach((c, idx) => {
                        rows += `
                            <tr data-no="${c.customer_no}" style="cursor:pointer;">
                                <td style="text-align:center;">${idx === 0 ? '▶' : ''}</td>
                                <td style="font-weight:bold; color:#003366;">${c.customer_no}</td>
                                <td>${c.name_short}</td>
                                <td>${c.full_name}</td>
                                <td>${c.tax_id || ''}</td>
                                <td>${c.boss || ''}</td>
                                <td>${c.sales_person || ''}</td>
                            </tr>
                        `;
                    });
                    browseTbody.innerHTML = rows;

                    browseTbody.querySelectorAll('tr').forEach(tr => {
                        tr.addEventListener('click', async () => {
                            const cNo = tr.getAttribute('data-no');
                            if (!cNo) return;
                            const c = custs.find(x => x.customer_no === cNo);
                            if (c) {
                                fillForm(c);
                                tabDetail.click();
                            }
                        });
                    });
                }
            });

            winEl.querySelector('#copi01-lookup-cust').addEventListener('click', () => {
                Modules.openLookup('customer', (c) => fillForm(c));
            });
            winEl.querySelector('#copi01-tb-new').addEventListener('click', clearForm);
            winEl.querySelector('#copi01-tb-query').addEventListener('click', () => {
                Modules.openLookup('customer', (c) => fillForm(c));
            });
            winEl.querySelector('#copi01-tb-save').addEventListener('click', async () => {
                const cNo = fCustNo.value.trim();
                if (!cNo) {
                    alert('【必填檢查】請輸入客戶代號！');
                    fCustNo.focus();
                    return;
                }
                const payload = {
                    customer_no: cNo,
                    name_short: fNameShort.value.trim(),
                    full_name: fFullName.value.trim() || fNameShort.value.trim(),
                    eng_name: fEngName.value.trim(),
                    version: fVersion.value.trim() || '0000',
                    approval_date: fApprovalDate.value.trim() || Modules.getTodayStr(),
                    tax_id: fTaxId.value.trim(),
                    boss: fBoss.value.trim(),
                    contact: fContact.value.trim(),
                    tel1: fTel1.value.trim(),
                    fax: fFax.value.trim(),
                    email: fEmail.value.trim(),
                    currency: fCurrency.value.trim() || 'NTD',
                    sales_person: fSales.value.trim(),
                    dept: fDept.value.trim()
                };
                const res = await ERP_API.post('save_customer', payload);
                if (res.success) {
                    alert('客戶資料已成功儲存！');
                } else {
                    alert('儲存失敗: ' + (res.error || '不明錯誤'));
                }
            });

            winEl.querySelector('#copi01-tb-del').addEventListener('click', async () => {
                const cNo = fCustNo.value.trim();
                if (!cNo) return;
                if (confirm(`確定要刪除客戶 [${cNo}] 嗎？`)) {
                    const res = await ERP_API.post('delete_customer', { customer_no: cNo });
                    if (res.success) {
                        alert('客戶已刪除！');
                        clearForm();
                    } else {
                        alert('刪除失敗: ' + (res.error || '不明錯誤'));
                    }
                }
            });

            // Nav
            const nav = async (dir) => {
                const res = await ERP_API.get('nav_customer', { dir, current_no: fCustNo.value.trim() });
                if (res.success && res.data) fillForm(res.data);
            };
            winEl.querySelector('#copi01-tb-first').addEventListener('click', () => nav('first'));
            winEl.querySelector('#copi01-tb-prev').addEventListener('click', () => nav('prev'));
            winEl.querySelector('#copi01-tb-next').addEventListener('click', () => nav('next'));
            winEl.querySelector('#copi01-tb-last').addEventListener('click', () => nav('last'));
        });
    },

JS);

// --------------------------------------------------------
// 4. 供應廠商資料建立作業 (PURI01) - 1:1 擷取4 (media_1793885786166_f5448be5.png)
// --------------------------------------------------------
fwrite($fp, <<<'JS'
    // ========================================================
    // 4. 供應廠商資料建立作業 (PURI01) - 1:1 擷取4
    // ========================================================
    openPURI01() {
        const u = App.currentUser?.company || '學生區';
        const title = `供應廠商資料建立作業(PURI01)[${u}]`;
        const winId = 'PURI01';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">資料(<u>D</u>)</span>
                <span class="erp-menu-item">功能(<u>F</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="新增" id="puri01-tb-new">📄</button>
                <button class="erp-tb-btn" title="查詢" id="puri01-tb-query">🔍</button>
                <button class="erp-tb-btn" title="修改" id="puri01-tb-edit">✏️</button>
                <button class="erp-tb-btn" title="刪除" id="puri01-tb-del">🗑️</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="首筆" id="puri01-tb-first">|◀</button>
                <button class="erp-tb-btn" title="上筆" id="puri01-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下筆" id="puri01-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="puri01-tb-last">▶|</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="儲存" id="puri01-tb-save" style="color:green;font-weight:bold;">💾</button>
                <button class="erp-tb-btn" title="取消" id="puri01-tb-cancel" style="color:red;font-weight:bold;">✖</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('供應商清單產生中...')">🖨️</button>
            </div>

            <!-- Top Tab Header (1:1 擷取4.PNG) -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn" id="puri01-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn active" id="puri01-tab-browse">資料瀏覽</button>
            </div>

            <!-- Top Master Browsable Grid (1:1 擷取4.PNG - 綠白相間清單) -->
            <div class="erp-datagrid-container" id="puri01-top-grid" style="height:150px; min-height:130px; flex:none;">
                <table class="erp-grid-table">
                    <thead>
                        <tr>
                            <th style="width:22px;"></th>
                            <th class="th-cyan" style="width:90px;">廠商代號</th>
                            <th style="width:70px;">國外廠商</th>
                            <th style="width:140px;">簡稱</th>
                            <th style="width:240px;">公司全名</th>
                        </tr>
                    </thead>
                    <tbody id="puri01-browse-tbody">
                        <tr data-no="4002" style="cursor:pointer;"><td style="text-align:center;"></td><td style="font-weight:bold; color:#003366;">4002</td><td style="text-align:center;"><input type="checkbox"></td><td>揚朋海運</td><td>揚朋海運股份有限公司</td></tr>
                        <tr data-no="4003" style="cursor:pointer;"><td style="text-align:center;"></td><td style="font-weight:bold; color:#003366;">4003</td><td style="text-align:center;"><input type="checkbox"></td><td>飛龍空運</td><td>飛龍空運承攬有限公司</td></tr>
                        <tr data-no="4004" style="cursor:pointer;"><td style="text-align:center;"></td><td style="font-weight:bold; color:#003366;">4004</td><td style="text-align:center;"><input type="checkbox"></td><td>領先報關行</td><td>領先國際報關行股份有限公司</td></tr>
                        <tr data-no="4005" class="selected active-row" style="cursor:pointer;"><td style="text-align:center;">▶</td><td style="font-weight:bold;">4005</td><td style="text-align:center;"><input type="checkbox"></td><td>為升國際貿易</td><td>為升國際貿易股份有限公司</td></tr>
                        <tr data-no="A001" style="cursor:pointer;"><td style="text-align:center;"></td><td style="font-weight:bold; color:#003366;">A001</td><td style="text-align:center;"><input type="checkbox"></td><td>金皇國際</td><td>金皇國際股份有限公司</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Subtab Header (1:1 擷取4.PNG) -->
            <div class="erp-subtab-header">
                <button class="erp-subtab-btn active">基本資料</button>
                <button class="erp-subtab-btn">基本資料(二)</button>
                <button class="erp-subtab-btn">基本資料(泰國)</button>
                <button class="erp-subtab-btn">交易資料</button>
                <button class="erp-subtab-btn">地址資料</button>
                <button class="erp-subtab-btn">APS</button>
                <button class="erp-subtab-btn">資料瀏覽</button>
            </div>

            <!-- Subtab Body (1:1 擷取4.PNG - 乾淨左右兩欄) -->
            <div class="erp-tab-content" style="flex:1; overflow-y:auto;">
                <div class="erp-two-column-form">
                    <!-- Left -->
                    <div class="col-half">
                        <div class="erp-field"><label>核准狀況</label><select style="width:110px;"><option>1:已核准</option><option>0:未核准</option></select></div>
                        <div class="erp-field"><label>TEL(一)</label><input type="text" id="puri01-tel1" style="width:110px;" value="02-87915500"><span style="margin:0 4px;">TEL(二)</span><input type="text" style="width:110px;" value=""></div>
                        <div class="erp-field"><label>FAXNO</label><input type="text" style="width:160px;" value=""></div>
                        <div class="erp-field"><label>E_MAIL</label><input type="text" style="width:220px;" value=""></div>
                        <div class="erp-field"><label>負責人</label><input type="text" id="puri01-boss" style="width:160px;" value="尤山泉"></div>
                        <div class="erp-field"><label>聯絡人(一)</label><input type="text" style="width:160px;" value=""><button class="lookup-icon-btn">👥</button></div>
                        <div class="erp-field"><label>聯絡人(二)</label><input type="text" style="width:160px;" value=""></div>
                        <div class="erp-field"><label>聯絡人(三)</label><input type="text" style="width:160px;" value=""></div>
                        <div class="erp-field"><label>採購人員</label><input type="text" id="puri01-buyer" style="width:65px;" value="112"><button class="lookup-icon-btn">👤</button><span class="erp-field-desc">翁湘琴</span></div>
                        <div class="erp-field"><label>FAX NO(會計)</label><input type="text" style="width:160px;" value=""></div>
                        <div class="erp-field"><label>交易項目</label><input type="text" style="width:160px;" value=""><button class="lookup-icon-btn">🔍</button></div>
                        <div class="erp-field"><label>備註</label><input type="text" style="width:240px;" value=""><button class="lookup-icon-btn">📝</button></div>
                    </div>

                    <!-- Right -->
                    <div class="col-half">
                        <div class="erp-field" style="margin-left:70px;"><label style="min-width:auto;"><input type="checkbox"> 總公司收款</label></div>
                        <div class="erp-field"><label>總公司</label><input type="text" style="width:100px;" value=""><button class="lookup-icon-btn">👥</button></div>
                        <div class="erp-field"><label>地區別</label><input type="text" style="width:100px;" value=""><button class="lookup-icon-btn">🔍</button></div>
                        <div class="erp-field"><label>國家別</label><input type="text" style="width:100px;" value=""><button class="lookup-icon-btn">🔍</button></div>
                        <div class="erp-field"><label>廠商分類</label><input type="text" style="width:100px;" value=""><button class="lookup-icon-btn">🔍</button></div>
                        <div class="erp-field"><label>開業日</label><input type="text" style="width:90px;" value="2010/05/19"><input type="checkbox"></div>
                        <div class="erp-field"><label>資本額</label><input type="text" style="width:130px; text-align:right;" value="15,000,000"> 萬</div>
                        <div class="erp-field"><label>員工人數</label><input type="text" style="width:65px; text-align:center;" value="0"></div>
                        <div class="erp-field"><label>交易幣別</label><input type="text" class="erp-input-yellow" style="width:60px;" value="NTD"><span class="erp-field-desc">$ 台幣</span></div>
                        <fieldset style="border:1px solid #7F9DB9; padding:6px 12px; margin-top:6px;">
                            <legend style="padding:0 4px; font-size:11px;">稅額計算方式</legend>
                            <label style="display:block; margin:2px 0;"><input type="radio" name="puri01-tax-calc" value="1"> 整張資料計算</label>
                            <label style="display:block; margin:2px 0;"><input type="radio" name="puri01-tax-calc" value="2" checked> 單身單筆資料計算</label>
                        </fieldset>
                    </div>
                </div>
            </div>

            <!-- Statusbar -->
            <div class="erp-window-statusbar">
                <span class="status-cell">瀏覽</span>
                <span class="status-cell">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 940, 580, (winEl) => {
            const tbody = winEl.querySelector('#puri01-browse-tbody');
            tbody.querySelectorAll('tr').forEach(tr => {
                tr.addEventListener('click', () => {
                    tbody.querySelectorAll('tr').forEach(r => {
                        r.classList.remove('selected', 'active-row');
                        r.querySelector('td:first-child').textContent = '';
                    });
                    tr.classList.add('selected', 'active-row');
                    tr.querySelector('td:first-child').textContent = '▶';
                });
            });
        });
    },

JS);

echo "COPI01 and PURI01 written.\n";

// --------------------------------------------------------
// 5. 品號資料建立作業 (INVI02) - 1:1 擷取5 (media_1793885786171_9ba3f436.png)
// --------------------------------------------------------
fwrite($fp, <<<'JS'
    // ========================================================
    // 5. 品號資料建立作業 (INVI02) - 1:1 擷取5
    // ========================================================
    openINVI02() {
        const u = App.currentUser?.company || '學生區';
        const title = `品號資料建立作業(INVI02)[${u}]`;
        const winId = 'INVI02';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">資料(<u>D</u>)</span>
                <span class="erp-menu-item">功能(<u>F</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="新增" id="invi02-tb-new">📄</button>
                <button class="erp-tb-btn" title="查詢" id="invi02-tb-query">🔍</button>
                <button class="erp-tb-btn" title="修改" id="invi02-tb-edit">✏️</button>
                <button class="erp-tb-btn" title="刪除" id="invi02-tb-del">🗑️</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="首筆" id="invi02-tb-first">|◀</button>
                <button class="erp-tb-btn" title="上筆" id="invi02-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下筆" id="invi02-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="invi02-tb-last">▶|</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="儲存" id="invi02-tb-save" style="color:green;font-weight:bold;">💾</button>
                <button class="erp-tb-btn" title="取消" id="invi02-tb-cancel" style="color:red;font-weight:bold;">✖</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('品號標籤列印中...')">🖨️</button>
            </div>

            <!-- Top Tab Header -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn" id="invi02-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn active" id="invi02-tab-browse">資料瀏覽</button>
            </div>

            <!-- Top Master Browsable Grid (1:1 擷取5.PNG - 薄荷綠與白相間) -->
            <div class="erp-datagrid-container" id="invi02-top-grid" style="height:140px; min-height:120px; flex:none;">
                <table class="erp-grid-table">
                    <thead>
                        <tr>
                            <th style="width:22px;"></th>
                            <th class="th-cyan" style="width:110px;">品號</th>
                            <th style="width:180px;">品名</th>
                            <th style="width:150px;">規格</th>
                            <th style="width:90px;">貨號</th>
                            <th style="width:55px;">版次</th>
                            <th style="width:55px;">SIZE</th>
                            <th style="width:50px;">單位</th>
                        </tr>
                    </thead>
                    <tbody id="invi02-browse-tbody">
                        <tr data-no="900001" style="cursor:pointer;"><td style="text-align:center;"></td><td style="font-weight:bold; color:#003366;">900001</td><td>三腳架</td><td></td><td>390001</td><td></td><td></td><td style="text-align:center;">set</td></tr>
                        <tr data-no="900002" style="cursor:pointer;"><td style="text-align:center;"></td><td style="font-weight:bold; color:#003366;">900002</td><td>充電器</td><td></td><td>390002</td><td></td><td></td><td style="text-align:center;">ea</td></tr>
                        <tr data-no="900003" style="cursor:pointer;"><td style="text-align:center;"></td><td style="font-weight:bold; color:#003366;">900003</td><td>拭鏡布-防靜電</td><td></td><td>900003</td><td>0000</td><td></td><td style="text-align:center;">pcs</td></tr>
                        <tr data-no="900004" class="selected active-row" style="cursor:pointer;"><td style="text-align:center;">▶</td><td style="font-weight:bold;">900004</td><td>PowerShot G7 X Mark III</td><td>PowerShot G7 X Mark III</td><td>900004</td><td>0000</td><td></td><td style="text-align:center;">PC</td></tr>
                        <tr data-no="410001" style="cursor:pointer;"><td style="text-align:center;"></td><td style="font-weight:bold; color:#003366;">410001</td><td>數位相機-SL系列</td><td>SL1001</td><td>SL1001</td><td>0000</td><td></td><td style="text-align:center;">台</td></tr>
                        <tr data-no="410004" style="cursor:pointer;"><td style="text-align:center;"></td><td style="font-weight:bold; color:#003366;">410004</td><td>數位相機-專業型</td><td>SL系列</td><td>SL-PRO</td><td>0000</td><td></td><td style="text-align:center;">台</td></tr>
                        <tr data-no="900006" style="cursor:pointer;"><td style="text-align:center;"></td><td style="font-weight:bold; color:#003366;">900006</td><td>Insta360 Flow 2 Pro / Flow 2</td><td>全功能 AI 三軸手機穩定器</td><td>IF2-PRO</td><td>0000</td><td></td><td style="text-align:center;">台</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Middle Subtabs Header (1:1 擷取5.PNG) -->
            <div class="erp-subtab-header">
                <button class="erp-subtab-btn active">基本資料1</button>
                <button class="erp-subtab-btn">基本資料2</button>
                <button class="erp-subtab-btn">基本資料3</button>
                <button class="erp-subtab-btn">採購生管1</button>
                <button class="erp-subtab-btn">採購生管2</button>
                <button class="erp-subtab-btn">售價</button>
                <button class="erp-subtab-btn">成本</button>
            </div>

            <!-- Middle Subtab Content (1:1 擷取5.PNG) -->
            <div class="erp-tab-content" style="padding:6px 12px;">
                <div class="erp-two-column-form">
                    <!-- Left -->
                    <div class="col-half">
                        <div class="erp-field"><label style="min-width:auto;"><input type="checkbox"> 修改品名規格</label></div>
                        <div class="erp-field"><label>會計</label><input type="text" class="erp-input-yellow" style="width:50px;" value="05"><button class="lookup-icon-btn">⛰️</button><span class="erp-field-desc">商品</span></div>
                        <div class="erp-field"><label>資材</label><input type="text" style="width:70px;" value=""><button class="lookup-icon-btn">🔍</button></div>
                        <div class="erp-field"><label>業務</label><input type="text" style="width:70px;" value=""><button class="lookup-icon-btn">🔍</button></div>
                        <div class="erp-field"><label>生管</label><input type="text" style="width:70px;" value=""><button class="lookup-icon-btn">🔍</button></div>
                        <div class="erp-field"><label>主要庫別</label><input type="text" id="invi02-wh" style="width:70px;" value="P003"><button class="lookup-icon-btn" id="invi02-lookup-wh">🏬</button></div>
                        <div class="erp-field"><label>主要領料庫別</label><input type="text" style="width:70px;" value=""><button class="lookup-icon-btn">🏬</button></div>
                        <div class="erp-field"><label>生產線別</label><input type="text" style="width:70px;" value=""><button class="lookup-icon-btn">🔍</button></div>
                        <div class="erp-field"><label>計劃人員</label><input type="text" style="width:50px;" value="112"><button class="lookup-icon-btn">👤</button><span class="erp-field-desc">翁湘琴</span></div>
                    </div>

                    <!-- Right -->
                    <div class="col-half">
                        <div class="erp-field"><label>採購單位</label><input type="text" id="invi02-pur-unit" style="width:60px;" value="PC"><span class="erp-field-desc">@</span></div>
                        <div class="erp-field"><label>銷售單位</label><input type="text" id="invi02-sale-unit" style="width:60px;" value="PC"><span class="erp-field-desc">@</span></div>
                        <div class="erp-field"><label>文管代號</label><input type="text" style="width:110px;" value=""><button class="lookup-icon-btn">📝</button></div>
                        <div class="erp-field"><label>稅則</label><input type="text" style="width:150px;" value=""><button class="lookup-icon-btn">🔍</button></div>
                        <div class="erp-field"><label>保固佔售價比率</label><input type="text" style="width:70px; text-align:right;" value="0.00%"></div>
                        <div class="erp-field"><label>保固期數(月數)</label><input type="text" style="width:50px; text-align:center;" value="0"></div>
                    </div>
                </div>
                <div class="erp-form-row" style="margin-top:6px; border-top:1px dashed #CCC; padding-top:4px;">
                    <label style="min-width:auto;"><input type="checkbox"> 電子發票須上傳產品追溯串接碼</label>
                    <div class="erp-field" style="margin-left:14px;">
                        <label>產品追溯系統串接碼</label>
                        <input type="text" style="width:260px;" value="">
                    </div>
                </div>
            </div>

            <!-- Lower Warehouse Grid (1:1 擷取5.PNG - 庫別明細表) -->
            <div class="erp-datagrid-container" style="height:110px; min-height:90px; flex:none;">
                <table class="erp-grid-table">
                    <thead>
                        <tr>
                            <th style="width:22px;">📋</th>
                            <th class="th-cyan" style="width:80px;">庫別</th>
                            <th style="width:150px;">庫別名稱</th>
                            <th style="width:110px;">庫性</th>
                            <th style="width:90px;">廠別代號</th>
                            <th style="width:150px;">廠別名稱</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="active-row"><td style="text-align:center;">▶</td><td style="font-weight:bold;">P003</td><td>成品倉一</td><td>1:存貨倉</td><td>TP01</td><td>製造一廠</td></tr>
                        <tr><td style="text-align:center;"></td><td style="font-weight:bold;">Y003</td><td>成品倉二</td><td>1:存貨倉</td><td>TY01</td><td>製造二廠</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Statusbar -->
            <div class="erp-window-statusbar">
                <span class="status-cell">瀏覽 | 單身資料筆數: 2</span>
                <span class="status-cell">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 940, 600, (winEl) => {
            const tbody = winEl.querySelector('#invi02-browse-tbody');
            tbody.querySelectorAll('tr').forEach(tr => {
                tr.addEventListener('click', () => {
                    tbody.querySelectorAll('tr').forEach(r => {
                        r.classList.remove('selected', 'active-row');
                        r.querySelector('td:first-child').textContent = '';
                    });
                    tr.classList.add('selected', 'active-row');
                    tr.querySelector('td:first-child').textContent = '▶';
                });
            });

            winEl.querySelector('#invi02-lookup-wh').addEventListener('click', () => {
                Modules.openLookup('warehouse', (wh) => {
                    winEl.querySelector('#invi02-wh').value = wh.code;
                });
            });
            winEl.querySelector('#invi02-tb-query').addEventListener('click', () => {
                Modules.openLookup('item', (item) => {
                    alert(`已選取品號 [${item.item_no}] ${item.item_name}`);
                });
            });
        });
    },

JS);

// --------------------------------------------------------
// 6. 客戶訂單建立作業 (COPI06) - 1:1 擷取畫面強化
// --------------------------------------------------------
fwrite($fp, <<<'JS'
    // ========================================================
    // 6. 客戶訂單建立作業 (COPI06)
    // ========================================================
    openCOPI06() {
        const u = App.currentUser?.company || '學生區';
        const title = `客戶訂單建立作業(COPI06)[${u}]`;
        const winId = 'COPI06';

        const gridRowsHtml = this.buildGridRowsHtml('copi06', 10, true);

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
                <button class="erp-tb-btn" title="確認/審核" id="copi06-tb-confirm" style="color:#C00000;font-weight:bold;">✔審核</button>
                <button class="erp-tb-btn" title="取消確認" id="copi06-tb-unconfirm" style="color:#666;">✖反審</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="轉請購單 (COPB10)" id="copi06-tb-tobatch" style="color:#003399;font-weight:bold;">📦轉請購</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('訂單報表產生中...')">🖨️</button>
            </div>

            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="copi06-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="copi06-tab-browse">資料瀏覽</button>
            </div>

            <div id="copi06-view-detail" style="display:flex; flex-direction:column; flex:1;">
                <!-- Header Panel (含紅色核准章) -->
                <div class="erp-header-panel">
                    <div class="erp-stamp-he" style="display:none;">核</div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>訂單單別</label>
                            <input type="text" id="copi06-type" class="erp-input-cyan" style="width:65px;" value="A221">
                            <button class="lookup-icon-btn" id="copi06-lookup-type">🔍</button>
                            <span class="erp-field-desc">訂單</span>
                        </div>
                        <div class="erp-field">
                            <label>單據日期</label>
                            <input type="text" id="copi06-doc-date" class="erp-input-yellow" style="width:85px;" value="">
                            <input type="checkbox">
                        </div>
                        <div class="erp-field">
                            <label>訂單日期</label>
                            <input type="text" id="copi06-order-date" style="width:85px;" value="">
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>訂單單號</label>
                            <input type="text" id="copi06-no" class="erp-input-cyan" style="width:130px;" value="">
                        </div>
                        <div class="erp-field">
                            <label>客戶代號</label>
                            <input type="text" id="copi06-cust-no" class="erp-input-yellow" style="width:80px;" value="">
                            <button class="lookup-icon-btn" id="copi06-lookup-cust">👥</button>
                            <span class="erp-field-desc" id="copi06-cust-desc" style="min-width:70px;">大進文化</span>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>流程代號</label>
                            <input type="text" style="width:65px;" value="">
                            <button class="lookup-icon-btn">🔍</button>
                        </div>
                        <div class="erp-field">
                            <label>版次</label>
                            <input type="text" style="width:45px;" value="0000">
                        </div>
                        <div class="erp-field" style="margin-left:8px;">
                            <label style="min-width:auto;"><input type="checkbox"> 不控管信用額度</label>
                        </div>
                        <div class="erp-field" style="margin-left:14px;">
                            <label>確認者</label>
                            <input type="text" id="copi06-confirm-user" class="erp-input-readonly" style="width:65px;" value="" readonly>
                            <span class="erp-field-desc">學生B18</span>
                        </div>
                    </div>
                </div>

                <!-- Subtabs -->
                <div class="erp-subtab-header">
                    <button class="erp-subtab-btn active">交易資料</button>
                    <button class="erp-subtab-btn">送貨資料</button>
                    <button class="erp-subtab-btn">國外訂單一</button>
                </div>

                <div class="erp-tab-content">
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>部門代號</label>
                            <input type="text" id="copi06-dept" style="width:70px;" value="1000">
                            <button class="lookup-icon-btn">🏢</button>
                            <span class="erp-field-desc">業務部</span>
                        </div>
                        <div class="erp-field">
                            <label>業務人員</label>
                            <input type="text" id="copi06-sales" style="width:70px;" value="1001">
                            <button class="lookup-icon-btn">👤</button>
                            <span class="erp-field-desc">張明達(業務)</span>
                        </div>
                        <div class="erp-field">
                            <label>出貨廠別</label>
                            <input type="text" class="erp-input-yellow" style="width:65px;" value="TP01">
                            <button class="lookup-icon-btn">🏬</button>
                            <span class="erp-field-desc">製造一廠</span>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>交易幣別</label>
                            <input type="text" class="erp-input-yellow" style="width:60px;" value="NTD">
                            <span class="erp-field-desc">$ 匯率 1.0</span>
                        </div>
                        <div class="erp-field">
                            <label>稅別碼</label>
                            <input type="text" style="width:40px;" value="S10">
                            <button class="lookup-icon-btn">🔍</button>
                        </div>
                        <div class="erp-field">
                            <label>課稅別</label>
                            <select style="width:110px;"><option>2:應稅內含</option><option>1:應稅外加</option></select>
                        </div>
                    </div>
                </div>

                <!-- DataGrid (交替薄荷綠) -->
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
                            ${gridRowsHtml}
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
            <div id="copi06-view-browse" class="erp-browse-view" style="display:none;">
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
                <span class="status-cell" id="copi06-status-msg">瀏覽 | 單身資料筆數: 0</span>
                <span class="status-cell">127.0.0.1 - 211</span>
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
            const browseTbody = winEl.querySelector('#copi06-browse-tbody');

            let currentDocStatus = '未確認';

            const calcTotals = () => {
                let sumAmt = 0, sumQty = 0, lineCount = 0;
                for (let i = 1; i <= 10; i++) {
                    const q = parseFloat(winEl.querySelector(`#copi06-qty-${i}`).value) || 0;
                    const aStr = winEl.querySelector(`#copi06-amount-${i}`).value.replace(/,/g, '');
                    const a = parseFloat(aStr) || 0;
                    if (q > 0) {
                        sumQty += q; sumAmt += a; lineCount++;
                    }
                }
                const tax = Math.round(sumAmt * 0.05);
                const grand = sumAmt + tax;
                fTotAmt.value = sumAmt.toLocaleString();
                fTotTax.value = tax.toLocaleString();
                fTotGrand.value = grand.toLocaleString();
                fTotQty.value = sumQty.toLocaleString();
                statusMsg.textContent = `瀏覽 | 單身資料筆數: ${lineCount} | ${winEl.querySelector('#copi06-item-no-1').value} ${winEl.querySelector('#copi06-item-name-1').value}`;
            };

            Modules.bindGridEvents(winEl, 'copi06', 10, calcTotals);

            // Tab switch
            tabDetail.addEventListener('click', () => {
                tabDetail.classList.add('active');
                tabBrowse.classList.remove('active');
                viewDetail.style.display = 'flex';
                viewBrowse.style.display = 'none';
            });

            tabBrowse.addEventListener('click', async () => {
                tabBrowse.classList.add('active');
                tabDetail.classList.remove('active');
                viewDetail.style.display = 'none';
                viewBrowse.style.display = 'block';

                const res = await ERP_API.get('get_orders');
                if (res.success) {
                    const orders = res.data || [];
                    if (orders.length === 0) {
                        browseTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px;">尚無訂單資料</td></tr>`;
                        return;
                    }
                    let rows = '';
                    orders.forEach((o, idx) => {
                        rows += `
                            <tr data-no="${o.order_no}" style="cursor:pointer;">
                                <td style="text-align:center;">${idx === 0 ? '▶' : ''}</td>
                                <td style="font-weight:bold; color:#003366;">${o.order_no}</td>
                                <td style="text-align:center;">${o.order_date}</td>
                                <td>${o.customer_no}</td>
                                <td>${o.customer_name}</td>
                                <td style="text-align:right; font-weight:bold;">${parseInt(o.grand_total || 0).toLocaleString()}</td>
                                <td style="text-align:center;">${o.status}</td>
                            </tr>
                        `;
                    });
                    browseTbody.innerHTML = rows;

                    browseTbody.querySelectorAll('tr').forEach(tr => {
                        tr.addEventListener('click', async () => {
                            const oNo = tr.getAttribute('data-no');
                            if (!oNo) return;
                            const dRes = await ERP_API.get('get_order', { order_no: oNo });
                            if (dRes.success && dRes.order) {
                                fillOrder(dRes.order, dRes.details || []);
                                tabDetail.click();
                            }
                        });
                    });
                }
            });

            const fillOrder = (header, details = []) => {
                fType.value = header.order_type || 'A221';
                fDocDate.value = header.doc_date || '';
                fNo.value = header.order_no || '';
                fCustNo.value = header.customer_no || '';
                fCustDesc.textContent = header.customer_name || '';
                fOrderDate.value = header.order_date || '';
                fSales.value = header.sales_person || '1001';
                fDept.value = header.dept || '1000';
                fConfirmUser.value = header.confirm_user || '';
                currentDocStatus = header.status || '未確認';
                Modules.setDocStamp(winEl, currentDocStatus);

                for (let i = 1; i <= 10; i++) {
                    const d = details[i - 1];
                    winEl.querySelector(`#copi06-biz-item-${i}`).value = d ? (d.biz_item_no || '') : '';
                    winEl.querySelector(`#copi06-item-no-${i}`).value = d ? (d.item_no || '') : '';
                    winEl.querySelector(`#copi06-item-name-${i}`).value = d ? (d.item_name || '') : '';
                    winEl.querySelector(`#copi06-item-spec-${i}`).value = d ? (d.item_spec || '') : '';
                    winEl.querySelector(`#copi06-qty-${i}`).value = d ? (d.order_qty || '') : '';
                    winEl.querySelector(`#copi06-unit-${i}`).value = d ? (d.unit || '台') : '';
                    winEl.querySelector(`#copi06-price-${i}`).value = d ? (d.unit_price || '') : '';
                    winEl.querySelector(`#copi06-amount-${i}`).value = d ? (parseInt(d.amount || 0).toLocaleString()) : '';
                    winEl.querySelector(`#copi06-date-${i}`).value = d ? (d.est_delivery_date || '') : '';
                    winEl.querySelector(`#copi06-wh-${i}`).value = d ? (d.warehouse || 'P003') : '';
                }
                calcTotals();
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

                for (let i = 1; i <= 10; i++) {
                    winEl.querySelector(`#copi06-biz-item-${i}`).value = '';
                    winEl.querySelector(`#copi06-item-no-${i}`).value = '';
                    winEl.querySelector(`#copi06-item-name-${i}`).value = '';
                    winEl.querySelector(`#copi06-item-spec-${i}`).value = '';
                    winEl.querySelector(`#copi06-qty-${i}`).value = '';
                    winEl.querySelector(`#copi06-unit-${i}`).value = '';
                    winEl.querySelector(`#copi06-price-${i}`).value = '';
                    winEl.querySelector(`#copi06-amount-${i}`).value = '';
                    winEl.querySelector(`#copi06-date-${i}`).value = '';
                    winEl.querySelector(`#copi06-wh-${i}`).value = '';
                }
                calcTotals();
                fCustNo.focus();
            };

            winEl.querySelector('#copi06-lookup-type').addEventListener('click', () => {
                Modules.openLookup('doc_type_order', (t) => { fType.value = t.code; });
            });
            winEl.querySelector('#copi06-lookup-cust').addEventListener('click', () => {
                Modules.openLookup('customer', (c) => {
                    fCustNo.value = c.customer_no;
                    fCustDesc.textContent = c.name_short || c.full_name;
                });
            });

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
                    alert('【必填檢查】請輸入訂單單號及客戶代號！');
                    return;
                }
                const details = [];
                for (let i = 1; i <= 10; i++) {
                    const iNo = winEl.querySelector(`#copi06-item-no-${i}`).value.trim();
                    const q = parseFloat(winEl.querySelector(`#copi06-qty-${i}`).value) || 0;
                    if (iNo && q > 0) {
                        details.push({
                            biz_item_no: winEl.querySelector(`#copi06-biz-item-${i}`).value.trim(),
                            item_no: iNo,
                            item_name: winEl.querySelector(`#copi06-item-name-${i}`).value.trim(),
                            item_spec: winEl.querySelector(`#copi06-item-spec-${i}`).value.trim(),
                            order_qty: q,
                            unit: winEl.querySelector(`#copi06-unit-${i}`).value.trim() || '台',
                            unit_price: parseFloat(winEl.querySelector(`#copi06-price-${i}`).value) || 0,
                            amount: parseFloat(winEl.querySelector(`#copi06-amount-${i}`).value.replace(/,/g, '')) || 0,
                            est_delivery_date: winEl.querySelector(`#copi06-date-${i}`).value.trim() || Modules.getTodayStr(),
                            warehouse: winEl.querySelector(`#copi06-wh-${i}`).value.trim() || 'P003'
                        });
                    }
                }
                if (details.length === 0) {
                    alert('【明細檢查】請至少在表格第一列挑選品號並輸入訂單數量！');
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
                if (confirm(`確定要確認審核訂單 [${orderNo}] 嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'order', doc_no: orderNo, status: '已確認' });
                    if (res.success) {
                        currentDocStatus = '已確認';
                        fConfirmUser.value = App.currentUser?.username || 'B18';
                        Modules.setDocStamp(winEl, '已確認');
                        alert('訂單審核完成！');
                    }
                }
            });

            winEl.querySelector('#copi06-tb-unconfirm').addEventListener('click', async () => {
                const orderNo = fNo.value.trim();
                if (!orderNo) return;
                if (confirm(`確定要取消訂單 [${orderNo}] 的審核狀態嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'order', doc_no: orderNo, status: '未確認' });
                    if (res.success) {
                        currentDocStatus = '未確認';
                        fConfirmUser.value = '';
                        Modules.setDocStamp(winEl, '未確認');
                        alert('訂單審核已取消！');
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

JS);

echo "INVI02 and COPI06 written.\n";

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

            <!-- Parameters Panel (1:1 擷取4.PNG) -->
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
    // 8. 請購單建立作業 (PURI05) - 1:1 擷取5.PNG
    // ========================================================
    openPURI05() {
        const u = App.currentUser?.company || '學生區';
        const title = `請購單建立作業(PURI05)[${u}]`;
        const winId = 'PURI05';

        const gridRowsHtml = this.buildGridRowsHtml('puri05', 10, true);

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
                <button class="erp-tb-btn" title="確認/審核" id="puri05-tb-confirm" style="color:#C00000;font-weight:bold;">✔審核</button>
                <button class="erp-tb-btn" title="取消確認" id="puri05-tb-unconfirm" style="color:#666;">✖反審</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="轉採購單 (PURI07)" onclick="Modules.open('PURI07')" style="color:#003399;font-weight:bold;">🛒轉採購</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('請購單報表產生中...')">🖨️</button>
            </div>

            <!-- Top Tab Header -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="puri05-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="puri05-tab-browse">資料瀏覽</button>
            </div>

            <!-- Detail View -->
            <div id="puri05-view-detail" style="display:flex; flex-direction:column; flex:1;">
                <!-- Header Panel (1:1 擷取5.PNG) -->
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

                <!-- 10-Row DataGrid -->
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
                            ${gridRowsHtml}
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
                for (let i = 1; i <= 10; i++) {
                    const iNo = winEl.querySelector(`#puri05-item-no-${i}`).value.trim();
                    const q = parseFloat(winEl.querySelector(`#puri05-qty-${i}`).value) || 0;
                    const a = parseFloat(winEl.querySelector(`#puri05-amount-${i}`).value.replace(/,/g, '')) || 0;
                    if (iNo) rowCount++;
                    sumQty += q;
                    sumAmt += a;
                }
                const tax = Math.round(sumAmt * 0.05);
                const grand = sumAmt + tax;
                fTotAmt.value = sumAmt.toLocaleString();
                fTotTax.value = tax.toLocaleString();
                fTotGrand.value = grand.toLocaleString();
                fTotQty.value = sumQty.toLocaleString();
                statusMsg.textContent = `單身資料筆數: ${rowCount}`;
            };

            Modules.bindGridEvents(winEl, 'puri05', 10, calcTotals);

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

                for (let i = 1; i <= 10; i++) {
                    const d = details[i - 1];
                    winEl.querySelector(`#puri05-biz-item-${i}`).value = '';
                    winEl.querySelector(`#puri05-item-no-${i}`).value = d ? (d.item_no || '') : '';
                    winEl.querySelector(`#puri05-item-name-${i}`).value = d ? (d.item_name || '') : '';
                    winEl.querySelector(`#puri05-item-spec-${i}`).value = d ? (d.item_spec || '') : '';
                    winEl.querySelector(`#puri05-qty-${i}`).value = d ? (d.req_qty || '') : '';
                    winEl.querySelector(`#puri05-unit-${i}`).value = d ? (d.unit || '台') : '';
                    winEl.querySelector(`#puri05-price-${i}`).value = d ? (d.est_price || '') : '';
                    winEl.querySelector(`#puri05-amount-${i}`).value = d ? (d.est_amount ? Math.round(d.est_amount).toLocaleString() : '') : '';
                    winEl.querySelector(`#puri05-date-${i}`).value = d ? (d.require_date || '') : '';
                    winEl.querySelector(`#puri05-wh-${i}`).value = d ? (d.warehouse || 'P003') : '';
                }
                calcTotals();
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

                for (let i = 1; i <= 10; i++) {
                    winEl.querySelector(`#puri05-biz-item-${i}`).value = '';
                    winEl.querySelector(`#puri05-item-no-${i}`).value = '';
                    winEl.querySelector(`#puri05-item-name-${i}`).value = '';
                    winEl.querySelector(`#puri05-item-spec-${i}`).value = '';
                    winEl.querySelector(`#puri05-qty-${i}`).value = '';
                    winEl.querySelector(`#puri05-unit-${i}`).value = '';
                    winEl.querySelector(`#puri05-price-${i}`).value = '';
                    winEl.querySelector(`#puri05-amount-${i}`).value = '';
                    winEl.querySelector(`#puri05-date-${i}`).value = '';
                    winEl.querySelector(`#puri05-wh-${i}`).value = '';
                }
                calcTotals();
                winEl.querySelector('#puri05-item-no-1').focus();
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
                const details = [];
                for (let i = 1; i <= 10; i++) {
                    const iNo = winEl.querySelector(`#puri05-item-no-${i}`).value.trim();
                    const q = parseFloat(winEl.querySelector(`#puri05-qty-${i}`).value) || 0;
                    if (iNo && q > 0) {
                        details.push({
                            item_no: iNo,
                            item_name: winEl.querySelector(`#puri05-item-name-${i}`).value.trim(),
                            item_spec: winEl.querySelector(`#puri05-item-spec-${i}`).value.trim(),
                            req_qty: q,
                            unit: winEl.querySelector(`#puri05-unit-${i}`).value.trim() || '台',
                            est_price: parseFloat(winEl.querySelector(`#puri05-price-${i}`).value) || 0,
                            est_amount: parseFloat(winEl.querySelector(`#puri05-amount-${i}`).value.replace(/,/g, '')) || 0,
                            require_date: winEl.querySelector(`#puri05-date-${i}`).value.trim() || Modules.getTodayStr(),
                            warehouse: winEl.querySelector(`#puri05-wh-${i}`).value.trim() || 'P003'
                        });
                    }
                }
                if (details.length === 0) {
                    alert('【明細檢查】請至少在表格第一列輸入品號及請購數量！');
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
                if (confirm(`確定要審核確認請購單 [${reqNo}] 嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'requisition', doc_no: reqNo, status: '已確認' });
                    if (res.success) {
                        currentDocStatus = '已確認';
                        fConfirmUser.value = App.currentUser?.username || 'B18';
                        Modules.setDocStamp(winEl, '已確認');
                        alert('請購單審核完成！');
                    }
                }
            });

            winEl.querySelector('#puri05-tb-unconfirm').addEventListener('click', async () => {
                const reqNo = fNo.value.trim();
                if (!reqNo) return;
                if (confirm(`確定要取消請購單 [${reqNo}] 的審核狀態嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'requisition', doc_no: reqNo, status: '未確認' });
                    if (res.success) {
                        currentDocStatus = '未確認';
                        fConfirmUser.value = '';
                        Modules.setDocStamp(winEl, '未確認');
                        alert('請購單審核已取消！');
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
    // 9. 請購資料維護作業 (PURI06) - 1:1
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
    // 10. 請購資料更新作業 (PURB01) - 1:1
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
    // 11. 採購單建立作業 (PURI07) - 1:1 擷取9.PNG
    // ========================================================
    openPURI07() {
        const u = App.currentUser?.company || '學生區';
        const title = `採購單建立作業(PURI07)[${u}]`;
        const winId = 'PURI07';

        const gridRowsHtml = this.buildGridRowsHtml('puri07', 10, true);

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
                <button class="erp-tb-btn" title="確認/審核" id="puri07-tb-confirm" style="color:#C00000;font-weight:bold;">✔審核</button>
                <button class="erp-tb-btn" title="取消確認" id="puri07-tb-unconfirm" style="color:#666;">✖反審</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="產生進貨單 (PURI09)" onclick="Modules.open('PURI09')" style="color:#003399;font-weight:bold;">📥轉進貨</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('採購單格式產生中...')">🖨️</button>
            </div>

            <!-- Top Tab Header -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="puri07-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="puri07-tab-browse">資料瀏覽</button>
            </div>

            <!-- Detail View -->
            <div id="puri07-view-detail" style="display:flex; flex-direction:column; flex:1;">
                <!-- Header Section (1:1 擷取9.PNG) -->
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

                <!-- 10-Row DataGrid -->
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
                            ${gridRowsHtml}
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
                for (let i = 1; i <= 10; i++) {
                    const iNo = winEl.querySelector(`#puri07-item-no-${i}`).value.trim();
                    const q = parseFloat(winEl.querySelector(`#puri07-qty-${i}`).value) || 0;
                    const a = parseFloat(winEl.querySelector(`#puri07-amount-${i}`).value.replace(/,/g, '')) || 0;
                    if (iNo) rowCount++;
                    sumQty += q;
                    sumAmt += a;
                }
                const tax = Math.round(sumAmt * 0.05);
                const grand = sumAmt + tax;
                fTotAmt.value = sumAmt.toLocaleString();
                fTotTax.value = tax.toLocaleString();
                fTotGrand.value = grand.toLocaleString();
                fTotQty.value = sumQty.toLocaleString();
                statusMsg.textContent = `單身資料筆數: ${rowCount}`;
            };

            Modules.bindGridEvents(winEl, 'puri07', 10, calcTotals);

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

                for (let i = 1; i <= 10; i++) {
                    const d = details[i - 1];
                    winEl.querySelector(`#puri07-biz-item-${i}`).value = '';
                    winEl.querySelector(`#puri07-item-no-${i}`).value = d ? (d.item_no || '') : '';
                    winEl.querySelector(`#puri07-item-name-${i}`).value = d ? (d.item_name || '') : '';
                    winEl.querySelector(`#puri07-item-spec-${i}`).value = d ? (d.item_spec || '') : '';
                    winEl.querySelector(`#puri07-qty-${i}`).value = d ? (d.po_qty || '') : '';
                    winEl.querySelector(`#puri07-unit-${i}`).value = d ? (d.unit || '台') : '';
                    winEl.querySelector(`#puri07-price-${i}`).value = d ? (d.unit_price || '') : '';
                    winEl.querySelector(`#puri07-amount-${i}`).value = d ? (d.amount ? Math.round(d.amount).toLocaleString() : '') : '';
                    winEl.querySelector(`#puri07-date-${i}`).value = d ? (d.est_delivery_date || '') : '';
                    winEl.querySelector(`#puri07-wh-${i}`).value = d ? (d.warehouse || 'P003') : '';
                }
                calcTotals();
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

                for (let i = 1; i <= 10; i++) {
                    winEl.querySelector(`#puri07-biz-item-${i}`).value = '';
                    winEl.querySelector(`#puri07-item-no-${i}`).value = '';
                    winEl.querySelector(`#puri07-item-name-${i}`).value = '';
                    winEl.querySelector(`#puri07-item-spec-${i}`).value = '';
                    winEl.querySelector(`#puri07-qty-${i}`).value = '';
                    winEl.querySelector(`#puri07-unit-${i}`).value = '';
                    winEl.querySelector(`#puri07-price-${i}`).value = '';
                    winEl.querySelector(`#puri07-amount-${i}`).value = '';
                    winEl.querySelector(`#puri07-date-${i}`).value = '';
                    winEl.querySelector(`#puri07-wh-${i}`).value = '';
                }
                calcTotals();
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
                const details = [];
                for (let i = 1; i <= 10; i++) {
                    const iNo = winEl.querySelector(`#puri07-item-no-${i}`).value.trim();
                    const q = parseFloat(winEl.querySelector(`#puri07-qty-${i}`).value) || 0;
                    if (iNo && q > 0) {
                        details.push({
                            item_no: iNo,
                            item_name: winEl.querySelector(`#puri07-item-name-${i}`).value.trim(),
                            item_spec: winEl.querySelector(`#puri07-item-spec-${i}`).value.trim(),
                            po_qty: q,
                            unit: winEl.querySelector(`#puri07-unit-${i}`).value.trim() || '台',
                            unit_price: parseFloat(winEl.querySelector(`#puri07-price-${i}`).value) || 0,
                            amount: parseFloat(winEl.querySelector(`#puri07-amount-${i}`).value.replace(/,/g, '')) || 0,
                            est_delivery_date: winEl.querySelector(`#puri07-date-${i}`).value.trim() || Modules.getTodayStr(),
                            warehouse: winEl.querySelector(`#puri07-wh-${i}`).value.trim() || 'P003'
                        });
                    }
                }
                if (details.length === 0) {
                    alert('【明細檢查】請至少在表格第一列挑選品號並輸入採購數量！');
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
                if (confirm(`確定要審核確認採購單 [${poNo}] 嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'purchase_order', doc_no: poNo, status: '已確認' });
                    if (res.success) {
                        currentDocStatus = '已確認';
                        fConfirmUser.value = App.currentUser?.username || 'B18';
                        Modules.setDocStamp(winEl, '已確認');
                        alert('採購單審核完成！');
                    }
                }
            });

            winEl.querySelector('#puri07-tb-unconfirm').addEventListener('click', async () => {
                const poNo = fNo.value.trim();
                if (!poNo) return;
                if (confirm(`確定要取消採購單 [${poNo}] 的審核狀態嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'purchase_order', doc_no: poNo, status: '未確認' });
                    if (res.success) {
                        currentDocStatus = '未確認';
                        fConfirmUser.value = '';
                        Modules.setDocStamp(winEl, '未確認');
                        alert('採購單審核已取消！');
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
    // 12. 進貨單建立作業 (PURI09) - 1:1 擷取10.PNG
    // ========================================================
    openPURI09() {
        const u = App.currentUser?.company || '學生區';
        const title = `進貨單建立作業(PURI09)[${u}]`;
        const winId = 'PURI09';

        const gridRowsHtml = this.buildGridRowsHtml('puri09', 10, true);

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
                <button class="erp-tb-btn" title="確認/審核入庫" id="puri09-tb-confirm" style="color:#C00000;font-weight:bold;">✔審核入庫</button>
                <button class="erp-tb-btn" title="取消確認" id="puri09-tb-unconfirm" style="color:#666;">✖反審</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('進貨檢驗單列印中...')">🖨️</button>
            </div>

            <!-- Top Tab Header -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="puri09-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="puri09-tab-browse">資料瀏覽</button>
            </div>

            <!-- Detail View -->
            <div id="puri09-view-detail" style="display:flex; flex-direction:column; flex:1;">
                <!-- Header Panel (1:1 擷取10.PNG) -->
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

                <!-- 10-Row DataGrid -->
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
                            ${gridRowsHtml}
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
                for (let i = 1; i <= 10; i++) {
                    const iNo = winEl.querySelector(`#puri09-item-no-${i}`).value.trim();
                    const q = parseFloat(winEl.querySelector(`#puri09-qty-${i}`).value) || 0;
                    const a = parseFloat(winEl.querySelector(`#puri09-amount-${i}`).value.replace(/,/g, '')) || 0;
                    if (iNo) rowCount++;
                    sumQty += q;
                    sumAmt += a;
                }
                const tax = Math.round(sumAmt * 0.05);
                const grand = sumAmt + tax;
                fTotAmt.value = sumAmt.toLocaleString();
                fTotTax.value = tax.toLocaleString();
                fTotGrand.value = grand.toLocaleString();
                fTotQty.value = sumQty.toLocaleString();
                statusMsg.textContent = `單身資料筆數: ${rowCount}`;
            };

            Modules.bindGridEvents(winEl, 'puri09', 10, calcTotals);

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

                for (let i = 1; i <= 10; i++) {
                    const d = details[i - 1];
                    winEl.querySelector(`#puri09-biz-item-${i}`).value = '';
                    winEl.querySelector(`#puri09-item-no-${i}`).value = d ? (d.item_no || '') : '';
                    winEl.querySelector(`#puri09-item-name-${i}`).value = d ? (d.item_name || '') : '';
                    winEl.querySelector(`#puri09-item-spec-${i}`).value = d ? (d.item_spec || '') : '';
                    winEl.querySelector(`#puri09-qty-${i}`).value = d ? (d.receipt_qty || '') : '';
                    winEl.querySelector(`#puri09-unit-${i}`).value = d ? (d.unit || '台') : '';
                    winEl.querySelector(`#puri09-price-${i}`).value = d ? (d.unit_price || '') : '';
                    winEl.querySelector(`#puri09-amount-${i}`).value = d ? (d.amount ? Math.round(d.amount).toLocaleString() : '') : '';
                    winEl.querySelector(`#puri09-date-${i}`).value = d ? (d.receipt_date || '') : '';
                    winEl.querySelector(`#puri09-wh-${i}`).value = d ? (d.warehouse || 'P003') : '';
                }
                calcTotals();
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

                for (let i = 1; i <= 10; i++) {
                    winEl.querySelector(`#puri09-biz-item-${i}`).value = '';
                    winEl.querySelector(`#puri09-item-no-${i}`).value = '';
                    winEl.querySelector(`#puri09-item-name-${i}`).value = '';
                    winEl.querySelector(`#puri09-item-spec-${i}`).value = '';
                    winEl.querySelector(`#puri09-qty-${i}`).value = '';
                    winEl.querySelector(`#puri09-unit-${i}`).value = '';
                    winEl.querySelector(`#puri09-price-${i}`).value = '';
                    winEl.querySelector(`#puri09-amount-${i}`).value = '';
                    winEl.querySelector(`#puri09-date-${i}`).value = '';
                    winEl.querySelector(`#puri09-wh-${i}`).value = '';
                }
                calcTotals();
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
                        res.details.forEach((d, idx) => {
                            if (idx < 10) {
                                const row = idx + 1;
                                winEl.querySelector(`#puri09-item-no-${row}`).value = d.item_no;
                                winEl.querySelector(`#puri09-item-name-${row}`).value = d.item_name;
                                winEl.querySelector(`#puri09-item-spec-${row}`).value = d.item_spec;
                                winEl.querySelector(`#puri09-qty-${row}`).value = d.po_qty;
                                winEl.querySelector(`#puri09-unit-${row}`).value = d.unit;
                                winEl.querySelector(`#puri09-price-${row}`).value = d.unit_price;
                                winEl.querySelector(`#puri09-amount-${row}`).value = d.amount ? Math.round(d.amount).toLocaleString() : '';
                                winEl.querySelector(`#puri09-date-${row}`).value = Modules.getTodayStr();
                                winEl.querySelector(`#puri09-wh-${row}`).value = d.warehouse || 'P003';
                            }
                        });
                        calcTotals();
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
                const details = [];
                for (let i = 1; i <= 10; i++) {
                    const iNo = winEl.querySelector(`#puri09-item-no-${i}`).value.trim();
                    const q = parseFloat(winEl.querySelector(`#puri09-qty-${i}`).value) || 0;
                    if (iNo && q > 0) {
                        details.push({
                            item_no: iNo,
                            item_name: winEl.querySelector(`#puri09-item-name-${i}`).value.trim(),
                            item_spec: winEl.querySelector(`#puri09-item-spec-${i}`).value.trim(),
                            receipt_qty: q,
                            unit: winEl.querySelector(`#puri09-unit-${i}`).value.trim() || '台',
                            unit_price: parseFloat(winEl.querySelector(`#puri09-price-${i}`).value) || 0,
                            amount: parseFloat(winEl.querySelector(`#puri09-amount-${i}`).value.replace(/,/g, '')) || 0,
                            warehouse: winEl.querySelector(`#puri09-wh-${i}`).value.trim() || 'P003'
                        });
                    }
                }
                if (details.length === 0) {
                    alert('【明細檢查】請至少在表格第一列輸入進貨品號及實收數量！');
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
                if (confirm(`確定要審核確認進貨單 [${rNo}] 嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'goods_receipt', doc_no: rNo, status: '已確認' });
                    if (res.success) {
                        currentDocStatus = '已確認';
                        fConfirmUser.value = App.currentUser?.username || 'B18';
                        Modules.setDocStamp(winEl, '已確認');
                        alert('進貨驗收入庫單審核完成！');
                    }
                }
            });

            winEl.querySelector('#puri09-tb-unconfirm').addEventListener('click', async () => {
                const rNo = fNo.value.trim();
                if (!rNo) return;
                if (confirm(`確定要取消進貨單 [${rNo}] 的審核狀態嗎？`)) {
                    const res = await ERP_API.post('confirm_doc', { type: 'goods_receipt', doc_no: rNo, status: '未確認' });
                    if (res.success) {
                        currentDocStatus = '未確認';
                        fConfirmUser.value = '';
                        Modules.setDocStamp(winEl, '未確認');
                        alert('進貨單審核已取消！');
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
    // 13. 訂單樹狀資訊查詢 (COPQ05) - 1:1 擷取12.PNG
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

            <!-- Main Content Area: Left Tree + Right Details (1:1 擷取12.PNG) -->
            <div style="flex:1; display:flex; padding:4px; gap:4px; overflow:hidden;">
                <!-- Left Hierarchy Tree -->
                <div class="order-tree-left" style="width:360px; border:1px solid #7F9DB9; background:#FFFFFF; overflow-y:auto;">
                    <div style="padding:6px; background:#2B5F8F; color:#FFFFFF; font-weight:bold;">
                        🌲 配銷單據樹狀關聯結構
                    </div>
                    <div id="copq05-tree-container" style="padding:8px;">
                        <p style="color:#888; text-align:center; padding:40px 10px;">請輸入或挑選訂單單號，點擊「展開樹狀查詢」</p>
                    </div>
                </div>

                <!-- Right Detail Panel -->
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

                // Requisitions
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

                // Purchase Orders
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

                // Goods Receipts
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

                // Deliveries
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
    // 14. 佇列工作控制台 (QUEUE_CONSOLE) - 1:1
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
                    本系統已完全 1:1 還原 ERP 配銷模組標準作業。視窗開啟預設為乾淨空白狀態，操作時請運用<b>「新增」</b>按鈕建立單據，或點選各欄位之<b>「🔍」開窗按鈕</b>直接挑選資料庫預設主檔！
                </div>

                <h3 style="color:#2B5F8F; margin:16px 0 8px 0;">【核心作業操作步驟】</h3>
                <ol style="margin-left:24px;">
                    <li style="margin-bottom:10px;">
                        <b>客戶與品號準備：</b><br>
                        開啟 <b>COPI01 客戶資料</b> 或 <b>INVI02 品號資料</b>，點擊「查詢」可開窗檢視現有客戶 (1107 大進文化、1002 標竿公司、1109 上奇科技等) 與商品主檔 (410001 數位相機-SL系列、410004 數位相機-專業型、900004 PowerShot G7 X Mark III 等)。
                    </li>
                    <li style="margin-bottom:10px;">
                        <b>步驟一：建立報價單 (COPI05) 與 客戶訂單 (COPI06)</b><br>
                        開啟「報價單建立作業」或「客戶訂單建立作業」，點選「新增」自動產生單號，點選客戶 🔍 開窗挑選客戶 (如 1107 大進文化)，在下方 10 列明細表格第 1 列點選品號 🔍 挑選品號 (如 410001) 並輸入數量與單價。<br>
                        完成後點選<b>「💾 儲存」</b>，再點選<b>「✔ 審核」</b>將單據轉為【已確認】狀態，視窗右上角將浮現<b>「核」</b>紅色核准印章！
                    </li>
                    <li style="margin-bottom:10px;">
                        <b>步驟二：訂單轉請購單 (COPB10)</b><br>
                        點選工具列的「📋 轉請購」，系統會自動帶入訂單單號，點擊「▶ 執行」產生請購單 (A311)。
                    </li>
                    <li style="margin-bottom:10px;">
                        <b>步驟三：審核請購單 (PURI05)</b><br>
                        開啟「請購單建立作業」，點選「查詢」載入剛產生的請購單，點選「✔ 審核」加蓋紅色印章。
                    </li>
                    <li style="margin-bottom:10px;">
                        <b>步驟四：建立採購單 (PURI07)</b><br>
                        開啟「採購單建立作業」，點選「新增」，挑選供應商 (如 4005 為升國際貿易、V001 影石創新)，加入品號並儲存審核。
                    </li>
                    <li style="margin-bottom:10px;">
                        <b>步驟五：進貨入庫 (PURI09) 與 銷貨出庫 (COPI08)</b><br>
                        採購到貨後開啟「進貨單建立作業」驗收入庫；訂單備貨完畢後開啟「銷貨單建立作業」點選來源訂單產生銷貨單並審核出庫！
                    </li>
                    <li style="margin-bottom:10px;">
                        <b>步驟六：訂單樹狀追蹤 (COPQ05)</b><br>
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

echo "All remaining modules written successfully.\n";
