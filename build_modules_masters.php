<?php
// C:\xampp\htdocs\erp\build_modules_masters.php
$outPath = __DIR__ . '/assets/js/modules.js';
$fp = fopen($outPath, 'ab');
if (!$fp) die("Cannot open $outPath for appending.\n");

// ========================================================
// 4. 客戶資料建立作業 (COPI01) - 1:1 擷取3 (media_1793885786163_2162a672.png)
// ========================================================
fwrite($fp, <<<'JS'
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
                <button class="erp-tb-btn" title="列印" onclick="alert('客戶資料清單列印中...')">🖨️</button>
            </div>

            <!-- Top Tab Header -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="copi01-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="copi01-tab-browse">資料瀏覽</button>
            </div>

            <!-- Detail View -->
            <div id="copi01-view-detail" style="display:flex; flex-direction:column; flex:1;">
                <div class="erp-header-panel">
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>客戶代號</label>
                            <input type="text" id="copi01-no" class="erp-input-cyan" style="width:100px;" value="">
                            <button class="lookup-icon-btn" id="copi01-lookup-btn">👥</button>
                        </div>
                        <div class="erp-field">
                            <label>客戶簡稱</label>
                            <input type="text" id="copi01-short" style="width:240px;" value="">
                        </div>
                        <div class="erp-field">
                            <label>版次</label>
                            <input type="text" style="width:45px;" value="0000">
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>客戶全名</label>
                            <input type="text" id="copi01-full" style="width:360px;" value="">
                        </div>
                        <div class="erp-field" style="margin-left:20px;">
                            <label>客戶核准日</label>
                            <input type="text" style="width:80px;" value="/  /">
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>客戶英文全名</label>
                            <input type="text" style="width:360px;" value="">
                        </div>
                    </div>
                </div>

                <!-- Subtab Header -->
                <div class="erp-subtab-header">
                    <button class="erp-subtab-btn active">基本資料</button>
                    <button class="erp-subtab-btn">基本資料(二)</button>
                    <button class="erp-subtab-btn">地址資料</button>
                    <button class="erp-subtab-btn">交易資料(一)</button>
                    <button class="erp-subtab-btn">交易資料(二)</button>
                    <button class="erp-subtab-btn">信用額度</button>
                    <button class="erp-subtab-btn">國外資料</button>
                </div>

                <!-- 2-Column Balanced Form (1:1 擷取3.PNG) -->
                <div class="erp-tab-content" style="flex:1;">
                    <div class="erp-two-column-form">
                        <!-- Left Column -->
                        <div class="col-half">
                            <div class="erp-form-row">
                                <div class="erp-field">
                                    <label>負責人</label>
                                    <input type="text" id="copi01-boss" style="width:180px;" value="">
                                </div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field">
                                    <label>連絡人</label>
                                    <input type="text" id="copi01-contact" style="width:180px;" value="">
                                    <button class="lookup-icon-btn">👤</button>
                                </div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field"><label>TEL_NO(一)</label><input type="text" id="copi01-tel" style="width:180px;" value=""></div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field"><label>TEL_NO(二)</label><input type="text" style="width:180px;" value=""></div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field"><label>FAX NO</label><input type="text" style="width:180px;" value=""></div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field"><label>E-Mail</label><input type="text" style="width:260px;" value=""></div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field">
                                    <label>統一編號</label>
                                    <input type="text" id="copi01-taxid" style="width:180px;" value="">
                                </div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field">
                                    <label>資本額</label>
                                    <input type="text" id="copi01-capital" style="width:130px; text-align:right;" value="">
                                    <span class="erp-field-desc">萬</span>
                                </div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field">
                                    <label>年營業額</label>
                                    <input type="text" style="width:130px; text-align:right;" value="0">
                                    <span class="erp-field-desc">萬</span>
                                </div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field">
                                    <label>員工人數</label>
                                    <input type="text" style="width:70px; text-align:right;" value="0">
                                    <span class="erp-field-desc">人</span>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column -->
                        <div class="col-half">
                            <div class="erp-form-row">
                                <div class="erp-field">
                                    <label>總店號</label>
                                    <input type="text" style="width:120px;" value="">
                                    <button class="lookup-icon-btn">👥</button>
                                </div>
                            </div>
                            <div class="erp-form-row" style="margin-left:70px;">
                                <label style="min-width:auto;"><input type="checkbox"> 總公司請款</label>
                            </div>
                            <div class="erp-form-row" style="margin-left:70px;">
                                <label style="min-width:auto;"><input type="checkbox"> 發票號碼依總公司控管</label>
                            </div>
                            <div class="erp-form-row" style="margin-left:70px;">
                                <label style="min-width:auto;"><input type="checkbox"> 合約訂單是否歸屬總公司</label>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field">
                                    <label>分店數</label>
                                    <input type="text" style="width:70px; text-align:right;" value="0">
                                </div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field">
                                    <label>交易幣別</label>
                                    <input type="text" id="copi01-currency" class="erp-input-yellow" style="width:65px;" value="NTD">
                                    <button class="lookup-icon-btn">💲</button>
                                </div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field">
                                    <label>部門別</label>
                                    <input type="text" style="width:110px;" value="">
                                    <button class="lookup-icon-btn">🏢</button>
                                </div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field">
                                    <label>業務人員</label>
                                    <input type="text" id="copi01-sales" style="width:80px;" value="1001">
                                    <button class="lookup-icon-btn">👤</button>
                                    <span class="erp-field-desc">張明達(業</span>
                                </div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field">
                                    <label>收款業務員</label>
                                    <input type="text" style="width:80px;" value="1001">
                                    <button class="lookup-icon-btn">👤</button>
                                    <span class="erp-field-desc">張明達(業</span>
                                </div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field">
                                    <label>開業日期</label>
                                    <input type="text" style="width:90px;" value="2006/10/04">
                                    <input type="checkbox">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Browse View -->
            <div id="copi01-view-browse" style="display:none; flex-direction:column; flex:1; padding:4px;">
                <table class="erp-grid-table">
                    <thead>
                        <tr>
                            <th style="width:25px;"></th>
                            <th class="th-cyan" style="width:90px;">客戶代號</th>
                            <th style="width:130px;">客戶簡稱</th>
                            <th>客戶全名</th>
                            <th style="width:90px;">統一編號</th>
                            <th style="width:80px;">負責人</th>
                            <th style="width:80px;">業務人員</th>
                        </tr>
                    </thead>
                    <tbody id="copi01-browse-tbody">
                        <tr><td colspan="7" style="text-align:center; padding:20px;">載入客戶清單中...</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="erp-window-statusbar">
                <span class="status-cell">瀏覽</span>
                <span class="status-cell" id="copi01-status-msg">1107 大進文化</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 940, 580, (winEl) => {
            const fNo = winEl.querySelector('#copi01-no');
            const fShort = winEl.querySelector('#copi01-short');
            const fFull = winEl.querySelector('#copi01-full');
            const fBoss = winEl.querySelector('#copi01-boss');
            const fContact = winEl.querySelector('#copi01-contact');
            const fTel = winEl.querySelector('#copi01-tel');
            const fTaxId = winEl.querySelector('#copi01-taxid');
            const fCapital = winEl.querySelector('#copi01-capital');
            const fSales = winEl.querySelector('#copi01-sales');
            const statusMsg = winEl.querySelector('#copi01-status-msg');

            const tabDetail = winEl.querySelector('#copi01-tab-detail');
            const tabBrowse = winEl.querySelector('#copi01-tab-browse');
            const viewDetail = winEl.querySelector('#copi01-view-detail');
            const viewBrowse = winEl.querySelector('#copi01-view-browse');

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

            const fillForm = (c) => {
                fNo.value = c.customer_no || '';
                fShort.value = c.name_short || '';
                fFull.value = c.full_name || '';
                fBoss.value = c.contact || c.boss || '呂育德';
                fContact.value = c.contact || '呂育德';
                fTel.value = c.tel || '02-23456789';
                fTaxId.value = c.tax_id || '28226438';
                fCapital.value = c.capital ? Math.round(c.capital).toLocaleString() : '2,500,000';
                fSales.value = c.sales_person || '1001';
                statusMsg.textContent = `${c.customer_no} ${c.name_short}`;
            };

            const clearForm = () => {
                fNo.value = '';
                fShort.value = '';
                fFull.value = '';
                fBoss.value = '';
                fContact.value = '';
                fTel.value = '';
                fTaxId.value = '';
                fCapital.value = '';
                fSales.value = '1001';
                statusMsg.textContent = '新增模式';
                fNo.focus();
            };

            const loadBrowseList = async () => {
                const tbody = winEl.querySelector('#copi01-browse-tbody');
                const res = await ERP_API.get('get_customers');
                if (res.success) {
                    const list = res.data || [];
                    let rows = '';
                    list.forEach(c => {
                        rows += `
                            <tr data-no="${c.customer_no}" style="cursor:pointer;">
                                <td style="text-align:center;">▶</td>
                                <td style="font-weight:bold; color:#003366;">${c.customer_no}</td>
                                <td>${c.name_short || ''}</td>
                                <td>${c.full_name || ''}</td>
                                <td>${c.tax_id || ''}</td>
                                <td>${c.contact || ''}</td>
                                <td>${c.sales_person || ''}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows;

                    tbody.querySelectorAll('tr[data-no]').forEach(tr => {
                        tr.addEventListener('click', () => {
                            const no = tr.getAttribute('data-no');
                            const item = list.find(x => x.customer_no === no);
                            if (item) {
                                fillForm(item);
                                switchTab('detail');
                            }
                        });
                    });
                }
            };

            winEl.querySelector('#copi01-lookup-btn').addEventListener('click', () => {
                Modules.openLookup('customer', (c) => fillForm(c));
            });
            winEl.querySelector('#copi01-tb-query').addEventListener('click', () => {
                Modules.openLookup('customer', (c) => fillForm(c));
            });
            winEl.querySelector('#copi01-tb-new').addEventListener('click', clearForm);

            winEl.querySelector('#copi01-tb-save').addEventListener('click', async () => {
                const no = fNo.value.trim();
                const name = fShort.value.trim();
                if (!no || !name) {
                    alert('請輸入客戶代號與客戶簡稱！');
                    return;
                }
                const res = await ERP_API.post('save_customer', {
                    customer_no: no,
                    name_short: name,
                    full_name: fFull.value.trim() || name,
                    contact: fContact.value.trim(),
                    tel: fTel.value.trim(),
                    tax_id: fTaxId.value.trim(),
                    sales_person: fSales.value.trim()
                });
                if (res.success) {
                    alert(`客戶主檔 [${no} ${name}] 儲存成功！`);
                } else {
                    alert('儲存失敗: ' + (res.error || '不明錯誤'));
                }
            });

            winEl.querySelector('#copi01-tb-del').addEventListener('click', async () => {
                const no = fNo.value.trim();
                if (!no) return;
                if (confirm(`確定要刪除客戶 [${no}] 嗎？`)) {
                    const res = await ERP_API.post('delete_customer', { customer_no: no });
                    if (res.success) {
                        alert('客戶主檔已刪除！');
                        clearForm();
                    } else {
                        alert('刪除失敗: ' + (res.error || '不明錯誤'));
                    }
                }
            });
        });
    },

    // ========================================================
    // 5. 供應廠商資料建立作業 (PURI01) - 1:1 擷取4
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
                <button class="erp-tb-btn" title="列印" onclick="alert('供應商清單產生中...')">🖨️</button>
            </div>

            <!-- Top Tab Header -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn" id="puri01-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn active" id="puri01-tab-browse">資料瀏覽</button>
            </div>

            <!-- Top Browse Grid (1:1 擷取4.PNG) -->
            <div class="erp-datagrid-container" style="max-height:160px; border-bottom:2px solid #185286;">
                <table class="erp-grid-table">
                    <thead>
                        <tr>
                            <th class="th-cyan" style="width:85px;">廠商代號</th>
                            <th style="width:75px;">國外廠商</th>
                            <th style="width:130px;">簡稱</th>
                            <th>公司全名</th>
                        </tr>
                    </thead>
                    <tbody id="puri01-browse-tbody">
                        <tr class="active-row"><td style="font-weight:bold;">4002</td><td style="text-align:center;"><input type="checkbox"></td><td>揚朋海運</td><td>揚朋海運</td></tr>
                        <tr><td style="font-weight:bold;">4003</td><td style="text-align:center;"><input type="checkbox"></td><td>飛龍空運</td><td>飛龍空運</td></tr>
                        <tr><td style="font-weight:bold;">4004</td><td style="text-align:center;"><input type="checkbox"></td><td>領先報關行</td><td>領先報關行</td></tr>
                        <tr style="background:#FFF3B8;"><td style="font-weight:bold; color:#003366;">▶ 4005</td><td style="text-align:center;"><input type="checkbox"></td><td style="font-weight:bold;">為升國際貿易</td><td>為升國際貿易股份有限公司</td></tr>
                        <tr><td style="font-weight:bold;">A001</td><td style="text-align:center;"><input type="checkbox"></td><td>金皇國際</td><td>金皇國際股份有限公司</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Bottom Subtabs & Form (1:1 擷取4.PNG) -->
            <div class="erp-subtab-header" style="margin-top:2px;">
                <button class="erp-subtab-btn active">基本資料</button>
                <button class="erp-subtab-btn">基本資料(二)</button>
                <button class="erp-subtab-btn">基本資料(泰國)</button>
                <button class="erp-subtab-btn">交易資料</button>
                <button class="erp-subtab-btn">地址資料</button>
                <button class="erp-subtab-btn">APS</button>
            </div>

            <div class="erp-tab-content" style="flex:1;">
                <div class="erp-two-column-form">
                    <div class="col-half">
                        <div class="erp-form-row">
                            <div class="erp-field">
                                <label>核准狀況</label>
                                <select style="width:110px;"><option>1:已核准</option><option>2:未核准</option></select>
                            </div>
                        </div>
                        <div class="erp-form-row">
                            <div class="erp-field"><label>TEL(一)</label><input type="text" style="width:140px;" value=""></div>
                            <div class="erp-field"><label>TEL(二)</label><input type="text" style="width:140px;" value=""></div>
                        </div>
                        <div class="erp-form-row">
                            <div class="erp-field"><label>FAXNO</label><input type="text" style="width:140px;" value=""></div>
                        </div>
                        <div class="erp-form-row">
                            <div class="erp-field"><label>E_MAIL</label><input type="text" style="width:240px;" value=""></div>
                        </div>
                        <div class="erp-form-row">
                            <div class="erp-field"><label>負責人</label><input type="text" id="puri01-boss" style="width:160px;" value="尤山泉"></div>
                        </div>
                        <div class="erp-form-row">
                            <div class="erp-field"><label>採購人員</label><input type="text" id="puri01-purchaser" style="width:75px;" value="112"><button class="lookup-icon-btn">👤</button><span class="erp-field-desc">翁湘琴</span></div>
                        </div>
                    </div>
                    <div class="col-half">
                        <div class="erp-form-row">
                            <div class="erp-field"><label>開業日</label><input type="text" style="width:90px;" value="2010/05/19"><input type="checkbox"></div>
                        </div>
                        <div class="erp-form-row">
                            <div class="erp-field"><label>資本額</label><input type="text" style="width:110px; text-align:right;" value="15,000,000"><span class="erp-field-desc">萬</span></div>
                        </div>
                        <div class="erp-form-row">
                            <div class="erp-field"><label>交易幣別</label><input type="text" class="erp-input-yellow" style="width:65px;" value="NTD"><span class="erp-field-desc">台幣</span></div>
                        </div>
                        <div class="erp-form-row" style="margin-top:6px; border:1px solid #7F9DB9; padding:8px; background:#ECE9D8; width:280px;">
                            <label style="font-weight:bold; margin-bottom:4px; display:block;">稅額計算方式</label>
                            <label style="display:block; min-width:auto; margin-bottom:4px;"><input type="radio" name="tax_calc" value="1"> 整張資料計算</label>
                            <label style="display:block; min-width:auto;"><input type="radio" name="tax_calc" value="2" checked> 單身單筆資料計算</label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="erp-window-statusbar">
                <span class="status-cell">瀏覽</span>
                <span class="status-cell">4005 為升國際貿易</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 940, 580, (winEl) => {
            winEl.querySelector('#puri01-tb-query').addEventListener('click', () => {
                Modules.openLookup('supplier', (s) => {
                    alert(`已選取供應商: [${s.supplier_no}] ${s.name_short}`);
                });
            });
        });
    },

    // ========================================================
    // 6. 品號資料建立作業 (INVI02) - 1:1 擷取5 (media_1793885786171_9ba3f436.png)
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
                <button class="erp-tb-btn" title="列印" onclick="alert('品號資料清單產生中...')">🖨️</button>
            </div>

            <!-- Top Tab Header -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn" id="invi02-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn active" id="invi02-tab-browse">資料瀏覽</button>
            </div>

            <!-- Upper Browse Table (1:1 擷取5.PNG) -->
            <div class="erp-datagrid-container" style="max-height:140px; border-bottom:2px solid #185286;">
                <table class="erp-grid-table">
                    <thead>
                        <tr>
                            <th class="th-cyan" style="width:100px;">品號</th>
                            <th style="width:180px;">品名</th>
                            <th style="width:160px;">規格</th>
                            <th style="width:80px;">貨號</th>
                            <th style="width:50px;">版次</th>
                            <th style="width:50px;">單位</th>
                        </tr>
                    </thead>
                    <tbody id="invi02-browse-tbody">
                        <tr data-no="900001" style="cursor:pointer;"><td style="font-weight:bold; color:#003366;">900001</td><td>三腳架</td><td></td><td>390001</td><td></td><td style="text-align:center;">set</td></tr>
                        <tr data-no="900002" style="cursor:pointer;"><td style="font-weight:bold; color:#003366;">900002</td><td>充電器</td><td></td><td>390002</td><td></td><td style="text-align:center;">ea</td></tr>
                        <tr data-no="900003" style="cursor:pointer;"><td style="font-weight:bold; color:#003366;">900003</td><td>拭鏡布-防靜電</td><td></td><td>900003</td><td>0000</td><td style="text-align:center;">pcs</td></tr>
                        <tr data-no="900004" style="background:#FFF3B8; cursor:pointer;"><td style="font-weight:bold; color:#003366;">▶ 900004</td><td style="font-weight:bold;">PowerShot G7 X Mark III</td><td>PowerShot G7 X Mark III</td><td>900004</td><td>0000</td><td style="text-align:center;">PC</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Middle Subtabs (1:1 擷取5.PNG) -->
            <div class="erp-subtab-header" style="margin-top:2px;">
                <button class="erp-subtab-btn active">基本資料1</button>
                <button class="erp-subtab-btn">基本資料2</button>
                <button class="erp-subtab-btn">基本資料3</button>
                <button class="erp-subtab-btn">採購生管1</button>
                <button class="erp-subtab-btn">採購生管2</button>
                <button class="erp-subtab-btn">售價</button>
                <button class="erp-subtab-btn">成本</button>
            </div>

            <!-- Middle Form Panel (1:1 擷取5.PNG) -->
            <div class="erp-tab-content">
                <div class="erp-form-row">
                    <div class="erp-field">
                        <label>會計</label>
                        <input type="text" class="erp-input-yellow" style="width:50px;" value="05">
                        <button class="lookup-icon-btn">⛰</button>
                        <span class="erp-field-desc">商品</span>
                    </div>
                    <div class="erp-field" style="margin-left:40px;">
                        <label>採購單位</label>
                        <input type="text" style="width:55px;" value="PC">
                    </div>
                    <div class="erp-field">
                        <label>銷售單位</label>
                        <input type="text" style="width:55px;" value="PC">
                    </div>
                </div>
                <div class="erp-form-row">
                    <div class="erp-field">
                        <label>計劃人員</label>
                        <input type="text" style="width:65px;" value="112">
                        <button class="lookup-icon-btn">👤</button>
                        <span class="erp-field-desc">翁湘琴</span>
                    </div>
                    <div class="erp-field" style="margin-left:40px;">
                        <label>保固期數(月數)</label>
                        <input type="text" style="width:50px; text-align:right;" value="0">
                    </div>
                </div>
            </div>

            <!-- Lower Warehouse Table (1:1 擷取5.PNG) -->
            <div class="erp-datagrid-container" style="flex:1;">
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

            <div class="erp-window-statusbar">
                <span class="status-cell">瀏覽</span>
                <span class="status-cell">單身資料筆數: 2</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 940, 600, (winEl) => {
            winEl.querySelector('#invi02-tb-query').addEventListener('click', () => {
                Modules.openLookup('item', (item) => {
                    alert(`選取品號: [${item.item_no}] ${item.item_name}`);
                });
            });
        });
    },

JS);

echo "COPI01, PURI01, and INVI02 written.\n";
fclose($fp);
