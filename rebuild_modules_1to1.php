<?php
// C:\xampp\htdocs\erp\rebuild_modules_1to1.php
$outPath = __DIR__ . '/assets/js/modules.js';

$fp = fopen($outPath, 'wb');
if (!$fp) die("Cannot open $outPath for writing.\n");

// Header and Lookup System
fwrite($fp, <<<'JS'
// ========================================================
// Conductor ERP Modules & 1:1 Windows System (Full Revision)
// Pixel-Perfect Replica of Real ERP UI Screenshots
// ========================================================

const Modules = {

    open(code) {
        switch (code) {
            case 'COPI01': this.openCOPI01(); break;
            case 'PURI01': this.openPURI01(); break;
            case 'INVI02': this.openINVI02(); break;
            case 'COPI05': this.openCOPI05(); break;
            case 'COPI06': this.openCOPI06(); break;
            case 'COPB10': this.openCOPB10(); break;
            case 'PURI05': this.openPURI05(); break;
            case 'PURI06': this.openPURI06(); break;
            case 'PURB01': this.openPURB01(); break;
            case 'PURI07': this.openPURI07(); break;
            case 'PURI09': this.openPURI09(); break;
            case 'COPI08': this.openCOPI08(); break;
            case 'QUEUE_CONSOLE': this.openQueueConsole(); break;
            case 'COPQ05': this.openCOPQ05(); break;
            case 'SEC_USER': this.openUserManagement(); break;
            case 'PRACTICE_GUIDE': this.openPracticeGuide(); break;
            default:
                alert('作業代碼 [' + code + '] 模擬視窗即將推出，請先操作配銷核心流程作業！');
                break;
        }
    },

    getTodayStr() {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}/${m}/${day}`;
    },

    // ========================================================
    // 1:1 UNIVERSAL LOOKUP DIALOG (開窗查詢挑選器)
    // ========================================================
    openLookup(type, onSelect, filterHint = '') {
        let title = '開窗查詢挑選';
        let columns = [];
        let loadDataPromise;

        switch (type) {
            case 'customer':
                title = '【開窗挑選】客戶代號 (COPI01)';
                columns = [
                    { key: 'customer_no', label: '客戶代號', width: '90px' },
                    { key: 'name_short', label: '客戶簡稱', width: '120px' },
                    { key: 'full_name', label: '客戶全名', width: '220px' },
                    { key: 'tax_id', label: '統一編號', width: '90px' },
                    { key: 'sales_person', label: '業務人員', width: '110px' }
                ];
                loadDataPromise = ERP_API.get('get_customers').then(r => r.data || []);
                break;

            case 'item':
                title = '【開窗挑選】品號資料 (INVI02)';
                columns = [
                    { key: 'item_no', label: '品號', width: '90px' },
                    { key: 'item_name', label: '品名', width: '190px' },
                    { key: 'item_spec', label: '規格', width: '160px' },
                    { key: 'unit', label: '單位', width: '50px' },
                    { key: 'std_price', label: '標準售價', width: '80px', align: 'right' },
                    { key: 'stock_qty', label: '現有庫存', width: '70px', align: 'right' },
                    { key: 'main_warehouse', label: '主要庫別', width: '100px' }
                ];
                loadDataPromise = ERP_API.get('get_items').then(r => r.data || []);
                break;

            case 'supplier':
                title = '【開窗挑選】供應商資料 (PURI01)';
                columns = [
                    { key: 'supplier_no', label: '供應商代號', width: '90px' },
                    { key: 'name_short', label: '供應商簡稱', width: '130px' },
                    { key: 'full_name', label: '供應商全名', width: '220px' },
                    { key: 'tax_id', label: '統一編號', width: '90px' },
                    { key: 'contact', label: '聯絡人', width: '90px' }
                ];
                loadDataPromise = ERP_API.get('get_suppliers').then(r => r.data || []);
                break;

            case 'order':
                title = '【查詢單據】客戶訂單清單 (COPI06)';
                columns = [
                    { key: 'order_no', label: '訂單單號', width: '135px' },
                    { key: 'order_date', label: '訂單日期', width: '85px' },
                    { key: 'customer_no', label: '客戶代號', width: '80px' },
                    { key: 'customer_name', label: '客戶名稱', width: '160px' },
                    { key: 'grand_total', label: '總金額', width: '85px', align: 'right' },
                    { key: 'status', label: '狀態', width: '65px' }
                ];
                loadDataPromise = ERP_API.get('get_orders').then(r => r.data || []);
                break;

            case 'requisition':
                title = '【查詢單據】請購單清單 (PURI05)';
                columns = [
                    { key: 'req_no', label: '請購單號', width: '135px' },
                    { key: 'req_date', label: '請購日期', width: '85px' },
                    { key: 'dept', label: '請購部門', width: '85px' },
                    { key: 'req_user', label: '請購人員', width: '85px' },
                    { key: 'source_order_no', label: '來源訂單', width: '130px' },
                    { key: 'status', label: '狀態', width: '65px' }
                ];
                loadDataPromise = ERP_API.get('get_requisitions').then(r => r.data || []);
                break;

            case 'purchase_order':
                title = '【查詢單據】採購單清單 (PURI07)';
                columns = [
                    { key: 'po_no', label: '採購單號', width: '135px' },
                    { key: 'po_date', label: '採購日期', width: '85px' },
                    { key: 'supplier_no', label: '供應商代號', width: '85px' },
                    { key: 'supplier_name', label: '供應商名稱', width: '160px' },
                    { key: 'grand_total', label: '總金額', width: '85px', align: 'right' },
                    { key: 'status', label: '狀態', width: '65px' }
                ];
                loadDataPromise = ERP_API.get('get_purchase_orders').then(r => r.data || []);
                break;

            case 'goods_receipt':
                title = '【查詢單據】進貨單清單 (PURI09)';
                columns = [
                    { key: 'receipt_no', label: '進貨單號', width: '135px' },
                    { key: 'receipt_date', label: '進貨日期', width: '85px' },
                    { key: 'supplier_no', label: '供應商代號', width: '85px' },
                    { key: 'supplier_name', label: '供應商名稱', width: '160px' },
                    { key: 'po_no', label: '採購單號', width: '130px' },
                    { key: 'status', label: '狀態', width: '65px' }
                ];
                loadDataPromise = ERP_API.get('get_goods_receipts').then(r => r.data || []);
                break;

            case 'delivery':
                title = '【查詢單據】銷貨單清單 (COPI08)';
                columns = [
                    { key: 'delivery_no', label: '銷貨單號', width: '135px' },
                    { key: 'delivery_date', label: '銷貨日期', width: '85px' },
                    { key: 'customer_no', label: '客戶代號', width: '80px' },
                    { key: 'customer_name', label: '客戶名稱', width: '160px' },
                    { key: 'order_no', label: '來源訂單', width: '130px' },
                    { key: 'status', label: '狀態', width: '65px' }
                ];
                loadDataPromise = ERP_API.get('get_deliveries').then(r => r.data || []);
                break;

            case 'quotation':
                title = '【查詢單據】報價單清單 (COPI05)';
                columns = [
                    { key: 'quote_no', label: '報價單號', width: '135px' },
                    { key: 'quote_date', label: '報價日期', width: '85px' },
                    { key: 'customer_no', label: '客戶代號', width: '80px' },
                    { key: 'customer_name', label: '客戶名稱', width: '160px' },
                    { key: 'grand_total', label: '總金額', width: '85px', align: 'right' },
                    { key: 'status', label: '狀態', width: '65px' }
                ];
                loadDataPromise = ERP_API.get('get_quotations').then(r => r.data || []);
                break;

            case 'warehouse':
                title = '【開窗挑選】庫別代號';
                columns = [
                    { key: 'code', label: '庫別代號', width: '100px' },
                    { key: 'name', label: '庫別名稱', width: '220px' }
                ];
                loadDataPromise = Promise.resolve([
                    { code: 'P003', name: '成品倉一 (存貨倉-製造一廠 TP01)' },
                    { code: 'Y003', name: '成品倉二 (存貨倉-製造二廠 TY01)' },
                    { code: 'W01', name: '台北總倉 / 主原料庫' },
                    { code: 'A01', name: '製成品庫' },
                    { code: 'A02', name: '零組件庫' }
                ]);
                break;

            case 'dept':
                title = '【開窗挑選】部門代號';
                columns = [
                    { key: 'code', label: '部門代號', width: '100px' },
                    { key: 'name', label: '部門名稱', width: '220px' }
                ];
                loadDataPromise = Promise.resolve([
                    { code: '1000', name: '業務部' },
                    { code: '0100', name: '業務一部' },
                    { code: '0200', name: '採購部' },
                    { code: '0300', name: '生產部' },
                    { code: '0400', name: '管理部' }
                ]);
                break;

            case 'salesperson':
                title = '【開窗挑選】人員代號';
                columns = [
                    { key: 'code', label: '人員代號', width: '100px' },
                    { key: 'name', label: '人員姓名', width: '140px' },
                    { key: 'dept', label: '所屬部門', width: '160px' }
                ];
                loadDataPromise = Promise.resolve([
                    { code: '1001', name: '張明達(業務)', dept: '1000 業務部' },
                    { code: '112', name: '翁湘琴(採購)', dept: '0200 採購部' },
                    { code: 'B18', name: '學生B18', dept: '1000 業務部' },
                    { code: 'B08', name: '學生B08', dept: '1000 業務部' }
                ]);
                break;

            case 'currency':
                title = '【開窗挑選】幣別代號';
                columns = [
                    { key: 'code', label: '幣別代號', width: '100px' },
                    { key: 'name', label: '幣別名稱', width: '150px' },
                    { key: 'rate', label: '參考匯率', width: '100px', align: 'right' }
                ];
                loadDataPromise = Promise.resolve([
                    { code: 'NTD', name: '新台幣', rate: 1.0 },
                    { code: 'USD', name: '美元', rate: 32.10 },
                    { code: 'EUR', name: '歐元', rate: 34.50 },
                    { code: 'JPY', name: '日圓', rate: 0.21 }
                ]);
                break;

            case 'doc_type_order':
                title = '【開窗挑選】訂單單別';
                columns = [{ key: 'code', label: '單別代號', width: '100px' }, { key: 'name', label: '單別名稱', width: '220px' }];
                loadDataPromise = Promise.resolve([
                    { code: 'A221', name: '一般國內訂單' },
                    { code: 'A222', name: '國外外銷訂單' },
                    { code: '2201', name: '標準銷售訂單' }
                ]);
                break;

            case 'doc_type_quote':
                title = '【開窗挑選】報價單別';
                columns = [{ key: 'code', label: '單別代號', width: '100px' }, { key: 'name', label: '單別名稱', width: '220px' }];
                loadDataPromise = Promise.resolve([
                    { code: 'C211', name: '配銷報價內 (國內報價)' },
                    { code: 'C212', name: '配銷報價外 (國外報價)' },
                    { code: 'A211', name: '標準報價單' }
                ]);
                break;

            case 'doc_type_deliv':
                title = '【開窗挑選】銷貨單別';
                columns = [{ key: 'code', label: '單別代號', width: '100px' }, { key: 'name', label: '單別名稱', width: '220px' }];
                loadDataPromise = Promise.resolve([
                    { code: 'A231', name: '銷貨單 (一般銷貨出庫)' },
                    { code: '2301', name: '標準銷貨單' }
                ]);
                break;

            default:
                alert('無此開窗類別: ' + type);
                return;
        }

        // Build Modal Overlay
        const overlay = document.createElement('div');
        overlay.className = 'erp-lookup-overlay';

        let thsHtml = columns.map(c => `<th style="width:${c.width};">${c.label}</th>`).join('');

        overlay.innerHTML = `
            <div class="erp-lookup-window">
                <div class="erp-lookup-titlebar">
                    <span>🔍 ${title}</span>
                    <button class="win-btn close" id="erp-lookup-close">✕</button>
                </div>
                <div class="erp-lookup-filter-bar">
                    <label>快速過濾:</label>
                    <input type="text" id="erp-lookup-search" placeholder="請輸入關鍵字快速搜尋..." value="${filterHint}" autocomplete="off">
                    <span style="color:#666; font-size:11px;">(按 Enter 或連按兩下選取，Esc 取消)</span>
                </div>
                <div class="erp-lookup-grid-container">
                    <table class="erp-lookup-table">
                        <thead><tr>${thsHtml}</tr></thead>
                        <tbody id="erp-lookup-tbody">
                            <tr><td colspan="${columns.length}" style="text-align:center; padding:18px; color:#888;">資料載入中...</td></tr>
                        </tbody>
                    </table>
                </div>
                <div class="erp-lookup-footer">
                    <span id="erp-lookup-count" style="margin-right:auto; font-size:11px; color:#555; align-self:center;">共 0 筆</span>
                    <button class="erp-lookup-btn primary" id="erp-lookup-confirm">✔ 確定選取</button>
                    <button class="erp-lookup-btn" id="erp-lookup-cancel">✖ 取消</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const searchInp = overlay.querySelector('#erp-lookup-search');
        const tbody = overlay.querySelector('#erp-lookup-tbody');
        const countSpan = overlay.querySelector('#erp-lookup-count');
        const closeBtn = overlay.querySelector('#erp-lookup-close');
        const cancelBtn = overlay.querySelector('#erp-lookup-cancel');
        const confirmBtn = overlay.querySelector('#erp-lookup-confirm');

        let rawData = [];
        let filteredData = [];
        let selectedIndex = 0;

        const renderTable = () => {
            if (filteredData.length === 0) {
                tbody.innerHTML = `<tr><td colspan="${columns.length}" style="text-align:center; padding:18px; color:#888;">查無符合條件之資料</td></tr>`;
                countSpan.textContent = `共 0 筆`;
                return;
            }
            countSpan.textContent = `共 ${filteredData.length} 筆資料`;
            let rowsHtml = '';
            filteredData.forEach((row, idx) => {
                const isSel = idx === selectedIndex;
                let tds = columns.map(c => {
                    const align = c.align ? `text-align:${c.align};` : '';
                    let val = row[c.key] !== undefined && row[c.key] !== null ? row[c.key] : '';
                    if (typeof val === 'number') val = val.toLocaleString();
                    return `<td style="${align}">${val}</td>`;
                }).join('');
                rowsHtml += `<tr class="${isSel ? 'selected' : ''}" data-idx="${idx}">${tds}</tr>`;
            });
            tbody.innerHTML = rowsHtml;

            const selEl = tbody.querySelector('tr.selected');
            if (selEl) selEl.scrollIntoView({ block: 'nearest' });
        };

        const filterData = () => {
            const kw = searchInp.value.trim().toLowerCase();
            if (!kw) {
                filteredData = [...rawData];
            } else {
                filteredData = rawData.filter(row => {
                    return Object.values(row).some(v => String(v || '').toLowerCase().includes(kw));
                });
            }
            selectedIndex = 0;
            renderTable();
        };

        const chooseCurrent = () => {
            if (filteredData.length > 0 && selectedIndex >= 0 && selectedIndex < filteredData.length) {
                const item = filteredData[selectedIndex];
                closeModal();
                if (typeof onSelect === 'function') onSelect(item);
            } else {
                alert('請先在清單中點選一筆資料！');
            }
        };

        const closeModal = () => {
            document.removeEventListener('keydown', handleKeydown);
            overlay.remove();
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                chooseCurrent();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (selectedIndex < filteredData.length - 1) {
                    selectedIndex++;
                    renderTable();
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (selectedIndex > 0) {
                    selectedIndex--;
                    renderTable();
                }
            }
        };

        loadDataPromise.then(data => {
            rawData = data;
            filterData();
            searchInp.focus();
        }).catch(err => {
            tbody.innerHTML = `<tr><td colspan="${columns.length}" style="text-align:center; padding:18px; color:red;">載入失敗: ${err.message}</td></tr>`;
        });

        searchInp.addEventListener('input', filterData);
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        confirmBtn.addEventListener('click', chooseCurrent);

        tbody.addEventListener('click', (e) => {
            const tr = e.target.closest('tr');
            if (tr && tr.hasAttribute('data-idx')) {
                selectedIndex = parseInt(tr.getAttribute('data-idx'), 10);
                renderTable();
            }
        });

        tbody.addEventListener('dblclick', (e) => {
            const tr = e.target.closest('tr');
            if (tr && tr.hasAttribute('data-idx')) {
                selectedIndex = parseInt(tr.getAttribute('data-idx'), 10);
                chooseCurrent();
            }
        });

        document.addEventListener('keydown', handleKeydown);
    },

    // 1:1 10-Row DataGrid Generator with Alternating Mint Green Rows and indicator
    buildGridRowsHtml(prefix, count = 10, includeWh = true) {
        let html = '';
        for (let i = 1; i <= count; i++) {
            const lineNo = String(i).padStart(4, '0');
            const ind = i === 1 ? '▶' : '';
            html += `
                <tr data-row="${i}" class="${i === 1 ? 'active-row' : ''}">
                    <td style="text-align:center; width:22px; color:#003366; font-size:10px;">${ind}</td>
                    <td style="text-align:center; background:#00CED1; font-weight:bold; width:38px;">${lineNo}</td>
                    <td style="width:75px;"><input type="text" id="${prefix}-biz-item-${i}" value=""></td>
                    <td style="display:flex; align-items:center; padding:0 1px; width:100px;">
                        <input type="text" id="${prefix}-item-no-${i}" class="erp-input-yellow" style="flex:1;" value="">
                        <button type="button" class="lookup-icon-btn" data-lookup-row="${i}" title="挑選品號">🔍</button>
                    </td>
                    <td style="width:170px;"><input type="text" id="${prefix}-item-name-${i}" value=""></td>
                    <td style="width:130px;"><input type="text" id="${prefix}-item-spec-${i}" value=""></td>
                    <td style="width:65px;"><input type="text" id="${prefix}-qty-${i}" class="grid-qty" style="text-align:right;" value=""></td>
                    <td style="width:40px;"><input type="text" id="${prefix}-unit-${i}" style="text-align:center;" value=""></td>
                    <td style="width:75px;"><input type="text" id="${prefix}-price-${i}" class="grid-price" style="text-align:right;" value=""></td>
                    <td style="width:85px;"><input type="text" id="${prefix}-amount-${i}" class="grid-amount erp-input-readonly" style="text-align:right;" value="" readonly></td>
                    <td style="width:85px;"><input type="text" id="${prefix}-date-${i}" style="text-align:center;" value=""></td>
                    ${includeWh ? `<td style="width:70px;"><input type="text" id="${prefix}-wh-${i}" style="text-align:center;" value=""></td>` : ''}
                </tr>
            `;
        }
        return html;
    },

    bindGridEvents(winEl, prefix, count = 10, onCalculateTotals = null) {
        for (let i = 1; i <= count; i++) {
            const itemInp = winEl.querySelector(`#${prefix}-item-no-${i}`);
            const nameInp = winEl.querySelector(`#${prefix}-item-name-${i}`);
            const specInp = winEl.querySelector(`#${prefix}-item-spec-${i}`);
            const qtyInp = winEl.querySelector(`#${prefix}-qty-${i}`);
            const unitInp = winEl.querySelector(`#${prefix}-unit-${i}`);
            const priceInp = winEl.querySelector(`#${prefix}-price-${i}`);
            const amtInp = winEl.querySelector(`#${prefix}-amount-${i}`);
            const dateInp = winEl.querySelector(`#${prefix}-date-${i}`);
            const whInp = winEl.querySelector(`#${prefix}-wh-${i}`);
            const btnLookup = winEl.querySelector(`button[data-lookup-row="${i}"]`);

            const calcRow = () => {
                const q = parseFloat(qtyInp.value) || 0;
                const p = parseFloat(priceInp.value) || 0;
                const amt = Math.round(q * p);
                amtInp.value = amt > 0 ? amt.toLocaleString() : '';
                if (typeof onCalculateTotals === 'function') onCalculateTotals();
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
                        if (whInp) whInp.value = item.main_warehouse || 'P003';
                        if (!priceInp.value) priceInp.value = item.std_price || item.retail_price || 0;
                        if (!qtyInp.value) qtyInp.value = '1';
                        if (!dateInp.value) dateInp.value = Modules.getTodayStr();
                        calcRow();
                    });
                });
            }
        }
    },

    setDocStamp(winEl, status) {
        const stampEl = winEl.querySelector('.erp-stamp-he');
        if (!stampEl) return;
        if (status === '已確認' || status === 'Y' || status === '已審核') {
            stampEl.style.display = 'flex';
        } else {
            stampEl.style.display = 'none';
        }
    },

JS);

echo "Base written. Appending modules...\n";
include __DIR__ . '/rebuild_modules_parts.php';

fwrite($fp, "\n};\n");
fclose($fp);
echo "rebuild complete!\n";
