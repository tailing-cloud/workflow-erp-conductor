<?php
// C:\xampp\htdocs\erp\build_clean_modules.php
// Full System Rebuilder: Dynamic 1-Row Grids, Tab auto-add, Blank auto-remove,
// "確認" & "取消確認", Customer Confirmation Toggle, and 1:1 Pixel-Perfect Layouts.

$outPath = __DIR__ . '/assets/js/modules.js';
$fp = fopen($outPath, 'wb');
if (!$fp) die("Cannot open $outPath for writing.\n");

// 1. BASE MODULE DEFINITIONS & UNIVERSAL LOOKUPS
fwrite($fp, <<<'JS'
// ========================================================
// Conductor ERP Modules & 1:1 Windows System (Final 1:1 Edition)
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
                    { key: 'customer_no', label: '客戶代號', width: '75px' },
                    { key: 'customer_name', label: '客戶簡稱', width: '140px' },
                    { key: 'grand_total', label: '合計金額', width: '85px', align: 'right' },
                    { key: 'status', label: '狀態', width: '65px', align: 'center' }
                ];
                loadDataPromise = ERP_API.get('get_orders').then(r => r.data || []);
                break;

            case 'quotation':
                title = '【查詢單據】報價單清單 (COPI05)';
                columns = [
                    { key: 'quote_no', label: '報價單號', width: '135px' },
                    { key: 'quote_date', label: '報價日期', width: '85px' },
                    { key: 'customer_no', label: '客戶代號', width: '75px' },
                    { key: 'customer_name', label: '客戶簡稱', width: '140px' },
                    { key: 'grand_total', label: '合計金額', width: '85px', align: 'right' },
                    { key: 'status', label: '狀態', width: '65px', align: 'center' }
                ];
                loadDataPromise = ERP_API.get('get_quotations').then(r => r.data || []);
                break;

            case 'requisition':
                title = '【查詢單據】請購單清單 (PURI05)';
                columns = [
                    { key: 'req_no', label: '請購單號', width: '135px' },
                    { key: 'req_date', label: '請購日期', width: '85px' },
                    { key: 'req_user', label: '請購人員', width: '75px' },
                    { key: 'dept', label: '請購部門', width: '100px' },
                    { key: 'source_order_no', label: '來源訂單', width: '120px' },
                    { key: 'status', label: '狀態', width: '65px', align: 'center' }
                ];
                loadDataPromise = ERP_API.get('get_requisitions').then(r => r.data || []);
                break;

            case 'purchase_order':
                title = '【查詢單據】採購單清單 (PURI07)';
                columns = [
                    { key: 'po_no', label: '採購單號', width: '135px' },
                    { key: 'po_date', label: '採購日期', width: '85px' },
                    { key: 'supplier_no', label: '供應商', width: '75px' },
                    { key: 'supplier_name', label: '廠商簡稱', width: '130px' },
                    { key: 'total_amount', label: '採購金額', width: '85px', align: 'right' },
                    { key: 'status', label: '狀態', width: '65px', align: 'center' }
                ];
                loadDataPromise = ERP_API.get('get_purchase_orders').then(r => r.data || []);
                break;

            case 'goods_receipt':
                title = '【查詢單據】進貨單清單 (PURI09)';
                columns = [
                    { key: 'receipt_no', label: '進貨單號', width: '135px' },
                    { key: 'receipt_date', label: '進貨日期', width: '85px' },
                    { key: 'supplier_no', label: '供應商', width: '75px' },
                    { key: 'supplier_name', label: '廠商簡稱', width: '130px' },
                    { key: 'po_no', label: '來源採購單', width: '130px' },
                    { key: 'status', label: '狀態', width: '65px', align: 'center' }
                ];
                loadDataPromise = ERP_API.get('get_goods_receipts').then(r => r.data || []);
                break;

            case 'delivery':
                title = '【查詢單據】銷貨單清單 (COPI08)';
                columns = [
                    { key: 'delivery_no', label: '銷貨單號', width: '135px' },
                    { key: 'delivery_date', label: '銷貨日期', width: '85px' },
                    { key: 'customer_no', label: '客戶代號', width: '75px' },
                    { key: 'customer_name', label: '客戶簡稱', width: '130px' },
                    { key: 'grand_total', label: '合計金額', width: '85px', align: 'right' },
                    { key: 'status', label: '狀態', width: '65px', align: 'center' }
                ];
                loadDataPromise = ERP_API.get('get_deliveries').then(r => r.data || []);
                break;

            case 'salesperson':
                title = '【開窗挑選】業務/採購人員';
                columns = [
                    { key: 'code', label: '人員代號', width: '90px' },
                    { key: 'name', label: '人員姓名', width: '130px' },
                    { key: 'dept', label: '所屬部門', width: '150px' }
                ];
                loadDataPromise = Promise.resolve([
                    { code: '1001', name: '張明達', dept: '1000 業務部' },
                    { code: '1002', name: '陳美玲', dept: '1000 業務部' },
                    { code: '112', name: '翁湘琴', dept: '0200 採購部' },
                    { code: '113', name: '林立翔', dept: '0200 採購部' },
                    { code: 'B18', name: '學生B18', dept: '學生實習組' }
                ]);
                break;

            case 'warehouse':
                title = '【開窗挑選】庫別主檔';
                columns = [
                    { key: 'wh_no', label: '庫別代號', width: '80px' },
                    { key: 'wh_name', label: '庫別名稱', width: '140px' },
                    { key: 'wh_prop', label: '庫性', width: '100px' },
                    { key: 'plant', label: '廠別代號', width: '80px' },
                    { key: 'plant_name', label: '廠別名稱', width: '130px' }
                ];
                loadDataPromise = Promise.resolve([
                    { wh_no: 'P003', wh_name: '成品倉一', wh_prop: '1:存貨倉', plant: 'TP01', plant_name: '製造一廠' },
                    { wh_no: 'Y003', wh_name: '成品倉二', wh_prop: '1:存貨倉', plant: 'TY01', plant_name: '製造二廠' },
                    { wh_no: 'W01', wh_name: '總公司主倉', wh_prop: '1:存貨倉', plant: 'TP01', plant_name: '製造一廠' },
                    { wh_no: 'W02', wh_name: '電子材料倉', wh_prop: '1:存貨倉', plant: 'TP01', plant_name: '製造一廠' },
                    { wh_no: 'W03', wh_name: '進貨暫存倉', wh_prop: '2:非存貨倉', plant: 'TP01', plant_name: '製造一廠' }
                ]);
                break;

            case 'dept':
                title = '【開窗挑選】部門資料';
                columns = [
                    { key: 'code', label: '部門代號', width: '90px' },
                    { key: 'name', label: '部門名稱', width: '180px' }
                ];
                loadDataPromise = Promise.resolve([
                    { code: '1000', name: '業務部' },
                    { code: '0200', name: '採購部' },
                    { code: '0300', name: '生管部' },
                    { code: '0400', name: '研發部' },
                    { code: '0500', name: '財務部' }
                ]);
                break;

            case 'doc_type_quote':
                title = '【開窗挑選】單據單別 (報價單別)';
                columns = [{ key: 'code', label: '單別代號', width: '80px' }, { key: 'name', label: '單別名稱', width: '180px' }];
                loadDataPromise = Promise.resolve([
                    { code: 'C211', name: '配銷報價內' },
                    { code: 'C212', name: '配銷報價外' },
                    { code: 'A211', name: '標準報價單' }
                ]);
                break;

            case 'doc_type_order':
                title = '【開窗挑選】單據單別 (訂單單別)';
                columns = [{ key: 'code', label: '單別代號', width: '80px' }, { key: 'name', label: '單別名稱', width: '180px' }];
                loadDataPromise = Promise.resolve([
                    { code: 'A221', name: '國內訂單' },
                    { code: 'A222', name: '國外訂單' },
                    { code: 'C221', name: '配銷訂單內' }
                ]);
                break;

            case 'doc_type_deliv':
                title = '【開窗挑選】單據單別 (銷貨單別)';
                columns = [{ key: 'code', label: '單別代號', width: '80px' }, { key: 'name', label: '單別名稱', width: '180px' }];
                loadDataPromise = Promise.resolve([
                    { code: 'A231', name: '銷貨單' },
                    { code: 'A232', name: '分期付款銷貨單' },
                    { code: 'A233', name: '國外銷貨單' }
                ]);
                break;

            case 'doc_type_req':
                title = '【開窗挑選】單據單別 (請購單別)';
                columns = [{ key: 'code', label: '單別代號', width: '80px' }, { key: 'name', label: '單別名稱', width: '180px' }];
                loadDataPromise = Promise.resolve([
                    { code: 'A311', name: '國內物料請購單' },
                    { code: 'A312', name: '國外物料請購單' },
                    { code: 'C311', name: '配銷請購單' }
                ]);
                break;

            case 'doc_type_po':
                title = '【開窗挑選】單據單別 (採購單別)';
                columns = [{ key: 'code', label: '單別代號', width: '80px' }, { key: 'name', label: '單別名稱', width: '180px' }];
                loadDataPromise = Promise.resolve([
                    { code: 'A321', name: '國內採購單' },
                    { code: 'A322', name: '國外採購單' },
                    { code: 'C321', name: '配銷採購單' }
                ]);
                break;

            case 'doc_type_gr':
                title = '【開窗挑選】單據單別 (進貨單別)';
                columns = [{ key: 'code', label: '單別代號', width: '80px' }, { key: 'name', label: '單別名稱', width: '180px' }];
                loadDataPromise = Promise.resolve([
                    { code: 'A331', name: '進貨單' },
                    { code: 'A332', name: '國外進貨單' },
                    { code: 'C331', name: '配銷進貨單' }
                ]);
                break;

            case 'currency':
                title = '【開窗挑選】幣別代碼';
                columns = [{ key: 'code', label: '幣別', width: '80px' }, { key: 'name', label: '名稱', width: '120px' }, { key: 'rate', label: '預設匯率', width: '80px' }];
                loadDataPromise = Promise.resolve([
                    { code: 'NTD', name: '新台幣', rate: '1.0' },
                    { code: 'USD', name: '美元', rate: '32.15' },
                    { code: 'JPY', name: '日圓', rate: '0.215' },
                    { code: 'EUR', name: '歐元', rate: '34.80' },
                    { code: 'RMB', name: '人民幣', rate: '4.45' }
                ]);
                break;

            default:
                alert('未定義開窗類型: ' + type);
                return;
        }

        const modal = document.createElement('div');
        modal.className = 'erp-lookup-modal';

        const dialog = document.createElement('div');
        dialog.className = 'erp-lookup-dialog';

        let ths = columns.map(c => `<th style="width:${c.width};">${c.label}</th>`).join('');

        dialog.innerHTML = `
            <div class="erp-lookup-header">
                <span class="erp-lookup-title">🗔 ${title}</span>
                <button class="erp-lookup-close">✕</button>
            </div>
            <div class="erp-lookup-toolbar">
                <label>快速篩選:</label>
                <input type="text" class="erp-lookup-filter" placeholder="輸入關鍵字或代號 (支援 Enter 挑選)..." value="${filterHint}">
                <button class="erp-lookup-btn primary erp-lookup-confirm">✔ 確定 (Enter)</button>
                <button class="erp-lookup-btn erp-lookup-cancel">✕ 取消 (Esc)</button>
            </div>
            <div class="erp-lookup-grid-wrap">
                <table class="erp-lookup-table">
                    <thead><tr>${ths}</tr></thead>
                    <tbody class="erp-lookup-tbody">
                        <tr><td colspan="${columns.length}" style="text-align:center; padding:30px; color:#666;">載入資料庫預設主檔中...</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="erp-lookup-footer">
                <span class="record-count">資料載入中...</span>
                <span>💡 提示: 上下鍵導覽選取，Enter 或雙擊項目即可直接帶回單據！</span>
            </div>
        `;

        modal.appendChild(dialog);
        document.body.appendChild(modal);

        const filterInput = dialog.querySelector('.erp-lookup-filter');
        const tbody = dialog.querySelector('.erp-lookup-tbody');
        const recordCount = dialog.querySelector('.record-count');
        const btnConfirm = dialog.querySelector('.erp-lookup-confirm');
        const btnCancel = dialog.querySelector('.erp-lookup-cancel');
        const btnClose = dialog.querySelector('.erp-lookup-close');

        let allData = [];
        let filteredData = [];
        let selectedIndex = 0;

        const renderTable = () => {
            if (filteredData.length === 0) {
                tbody.innerHTML = `<tr><td colspan="${columns.length}" style="text-align:center; padding:30px; color:#888;">無符合篩選條件之主檔資料</td></tr>`;
                recordCount.textContent = `共 0 筆資料`;
                return;
            }

            if (selectedIndex >= filteredData.length) selectedIndex = filteredData.length - 1;
            if (selectedIndex < 0) selectedIndex = 0;

            let html = '';
            filteredData.forEach((item, idx) => {
                const isSel = idx === selectedIndex;
                let tds = columns.map(c => {
                    const align = c.align ? `style="text-align:${c.align};"` : '';
                    let val = item[c.key] !== undefined ? item[c.key] : '';
                    if (typeof val === 'number') val = val.toLocaleString();
                    return `<td ${align}>${val}</td>`;
                }).join('');
                html += `<tr data-idx="${idx}" class="${isSel ? 'selected' : ''}">${tds}</tr>`;
            });

            tbody.innerHTML = html;
            recordCount.textContent = `共 ${filteredData.length} 筆資料 (第 ${selectedIndex + 1} 筆選取中)`;

            const selTr = tbody.querySelector('tr.selected');
            if (selTr) selTr.scrollIntoView({ block: 'nearest' });
        };

        const applyFilter = () => {
            const kw = filterInput.value.trim().toLowerCase();
            if (!kw) {
                filteredData = [...allData];
            } else {
                filteredData = allData.filter(item => {
                    return Object.values(item).some(v => String(v).toLowerCase().includes(kw));
                });
            }
            selectedIndex = 0;
            renderTable();
        };

        loadDataPromise.then(data => {
            allData = data || [];
            applyFilter();
            filterInput.focus();
        }).catch(err => {
            tbody.innerHTML = `<tr><td colspan="${columns.length}" style="text-align:center; padding:20px; color:red;">載入失敗: ${err.message}</td></tr>`;
        });

        filterInput.addEventListener('input', applyFilter);

        const chooseCurrent = () => {
            if (filteredData[selectedIndex]) {
                const chosen = filteredData[selectedIndex];
                closeModal();
                if (typeof onSelect === 'function') onSelect(chosen);
            }
        };

        const closeModal = () => {
            document.removeEventListener('keydown', handleKeydown);
            modal.remove();
        };

        const handleKeydown = (e) => {
            if (e.key === 'ArrowDown') {
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
            } else if (e.key === 'Enter') {
                e.preventDefault();
                chooseCurrent();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeModal();
            }
        };

        btnConfirm.addEventListener('click', chooseCurrent);
        btnCancel.addEventListener('click', closeModal);
        btnClose.addEventListener('click', closeModal);

        tbody.addEventListener('dblclick', (e) => {
            const tr = e.target.closest('tr');
            if (tr && tr.hasAttribute('data-idx')) {
                selectedIndex = parseInt(tr.getAttribute('data-idx'), 10);
                chooseCurrent();
            }
        });

        tbody.addEventListener('click', (e) => {
            const tr = e.target.closest('tr');
            if (tr && tr.hasAttribute('data-idx')) {
                selectedIndex = parseInt(tr.getAttribute('data-idx'), 10);
                renderTable();
            }
        });

        document.addEventListener('keydown', handleKeydown);
    },

    // ========================================================
    // 1:1 DYNAMIC DATAGRID MANAGER (單列預設，Tab自動新增，空白點回自動消失)
    // ========================================================
    initDynamicGrid(winEl, prefix, includeWh = true, onCalculateTotals = null) {
        const tbody = winEl.querySelector(`#${prefix}-grid-tbody`);
        if (!tbody) return null;

        const updateRowNumbersAndIndicators = () => {
            const rows = tbody.querySelectorAll('tr[data-row]');
            rows.forEach((r, idx) => {
                const rowIdx = idx + 1;
                r.setAttribute('data-row', rowIdx);
                const lineNoEl = r.querySelector('.row-line-no');
                if (lineNoEl) lineNoEl.textContent = String(rowIdx).padStart(4, '0');
            });
        };

        const createRowElement = (rowIdx, initialData = null) => {
            const lineNo = String(rowIdx).padStart(4, '0');
            const tr = document.createElement('tr');
            tr.setAttribute('data-row', rowIdx);
            tr.className = rowIdx === 1 ? 'active-row' : '';
            tr.innerHTML = `
                <td style="text-align:center; width:22px; color:#003366; font-size:10px;" class="row-indicator">${rowIdx === 1 ? '▶' : ''}</td>
                <td style="text-align:center; background:#00CED1; font-weight:bold; width:38px;" class="row-line-no">${lineNo}</td>
                <td style="width:75px;"><input type="text" id="${prefix}-biz-item-${rowIdx}" value="${initialData?.biz_item || ''}"></td>
                <td style="display:flex; align-items:center; padding:0 1px; width:100px;">
                    <input type="text" id="${prefix}-item-no-${rowIdx}" class="erp-input-yellow" style="flex:1;" value="${initialData?.item_no || ''}">
                    <button type="button" class="lookup-icon-btn" data-lookup-row="${rowIdx}" title="挑選品號">🔍</button>
                </td>
                <td style="width:170px;"><input type="text" id="${prefix}-item-name-${rowIdx}" value="${initialData?.item_name || ''}"></td>
                <td style="width:130px;"><input type="text" id="${prefix}-item-spec-${rowIdx}" value="${initialData?.item_spec || ''}"></td>
                <td style="width:65px;"><input type="text" id="${prefix}-qty-${rowIdx}" class="grid-qty" style="text-align:right;" value="${initialData?.qty || ''}"></td>
                <td style="width:40px;"><input type="text" id="${prefix}-unit-${rowIdx}" style="text-align:center;" value="${initialData?.unit || '台'}"></td>
                <td style="width:75px;"><input type="text" id="${prefix}-price-${rowIdx}" class="grid-price" style="text-align:right;" value="${initialData?.price || ''}"></td>
                <td style="width:85px;"><input type="text" id="${prefix}-amount-${rowIdx}" class="grid-amount erp-input-readonly" style="text-align:right;" value="${initialData?.amount ? Math.round(initialData.amount).toLocaleString() : ''}" readonly></td>
                <td style="width:85px;"><input type="text" id="${prefix}-date-${rowIdx}" class="grid-date ${includeWh ? '' : 'grid-last-cell'}" style="text-align:center;" value="${initialData?.date || ''}"></td>
                ${includeWh ? `<td style="width:70px;"><input type="text" id="${prefix}-wh-${rowIdx}" class="grid-wh grid-last-cell" style="text-align:center;" value="${initialData?.wh || 'P003'}"></td>` : ''}
            `;

            // Row amount calculation
            const qtyInp = tr.querySelector(`#${prefix}-qty-${rowIdx}`);
            const priceInp = tr.querySelector(`#${prefix}-price-${rowIdx}`);
            const amtInp = tr.querySelector(`#${prefix}-amount-${rowIdx}`);
            const calcRow = () => {
                const q = parseFloat(qtyInp.value) || 0;
                const p = parseFloat(priceInp.value) || 0;
                const amt = Math.round(q * p);
                amtInp.value = amt > 0 ? amt.toLocaleString() : '';
                if (typeof onCalculateTotals === 'function') onCalculateTotals();
            };
            if (qtyInp) qtyInp.addEventListener('input', calcRow);
            if (priceInp) priceInp.addEventListener('input', calcRow);

            // Lookup item button
            const btnLookup = tr.querySelector(`button[data-lookup-row="${rowIdx}"]`);
            if (btnLookup) {
                btnLookup.addEventListener('click', () => {
                    Modules.openLookup('item', (item) => {
                        tr.querySelector(`#${prefix}-item-no-${rowIdx}`).value = item.item_no || '';
                        tr.querySelector(`#${prefix}-item-name-${rowIdx}`).value = item.item_name || '';
                        tr.querySelector(`#${prefix}-item-spec-${rowIdx}`).value = item.item_spec || '';
                        tr.querySelector(`#${prefix}-unit-${rowIdx}`).value = item.unit || '台';
                        const whInp = tr.querySelector(`#${prefix}-wh-${rowIdx}`);
                        if (whInp) whInp.value = item.main_warehouse || 'P003';
                        const pInp = tr.querySelector(`#${prefix}-price-${rowIdx}`);
                        if (!pInp.value) pInp.value = item.std_price || item.retail_price || 0;
                        const qInp = tr.querySelector(`#${prefix}-qty-${rowIdx}`);
                        if (!qInp.value) qInp.value = '1';
                        const dInp = tr.querySelector(`#${prefix}-date-${rowIdx}`);
                        if (!dInp.value) dInp.value = Modules.getTodayStr();
                        calcRow();
                    });
                });
            }

            // Tab on last cell -> generate next row
            const lastCell = tr.querySelector('.grid-last-cell');
            if (lastCell) {
                lastCell.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab' && !e.shiftKey) {
                        const allRows = tbody.querySelectorAll('tr[data-row]');
                        const isLastRow = (tr === allRows[allRows.length - 1]);
                        if (isLastRow) {
                            e.preventDefault();
                            const newRow = appendNewRow();
                            const nextInp = newRow.querySelector(`#${prefix}-item-no-${newRow.getAttribute('data-row')}`);
                            if (nextInp) nextInp.focus();
                        }
                    }
                });
            }

            // Indicator update on focus
            tr.addEventListener('focusin', () => {
                tbody.querySelectorAll('tr[data-row]').forEach(r => {
                    r.classList.remove('active-row');
                    const ind = r.querySelector('.row-indicator');
                    if (ind) ind.textContent = '';
                });
                tr.classList.add('active-row');
                const ind = tr.querySelector('.row-indicator');
                if (ind) ind.textContent = '▶';
            });

            return tr;
        };

        const appendNewRow = (initialData = null) => {
            const nextIdx = tbody.querySelectorAll('tr[data-row]').length + 1;
            const newTr = createRowElement(nextIdx, initialData);
            tbody.appendChild(newTr);
            if (typeof onCalculateTotals === 'function') onCalculateTotals();
            return newTr;
        };

        // Remove trailing empty row if user clicks or focuses outside it
        const removeTrailingIfBlank = (targetEl = null) => {
            const allRows = tbody.querySelectorAll('tr[data-row]');
            if (allRows.length <= 1) return;
            const lastTr = allRows[allRows.length - 1];
            if (targetEl && lastTr.contains(targetEl)) return;
            const lastIdx = lastTr.getAttribute('data-row');
            const iNo = winEl.querySelector(`#${prefix}-item-no-${lastIdx}`)?.value.trim() || '';
            const q = winEl.querySelector(`#${prefix}-qty-${lastIdx}`)?.value.trim() || '';
            const name = winEl.querySelector(`#${prefix}-item-name-${lastIdx}`)?.value.trim() || '';
            if (!iNo && (!q || q === '0') && !name) {
                lastTr.remove();
                updateRowNumbersAndIndicators();
                if (typeof onCalculateTotals === 'function') onCalculateTotals();
            }
        };

        tbody.addEventListener('focusin', (e) => removeTrailingIfBlank(e.target));
        winEl.addEventListener('click', (e) => removeTrailingIfBlank(e.target));

        // Start with 1 row
        tbody.innerHTML = '';
        appendNewRow();

        return {
            addRow: appendNewRow,
            clearGrid: () => {
                tbody.innerHTML = '';
                appendNewRow();
                if (typeof onCalculateTotals === 'function') onCalculateTotals();
            },
            fillGrid: (details) => {
                tbody.innerHTML = '';
                if (!details || details.length === 0) {
                    appendNewRow();
                } else {
                    details.forEach(d => {
                        appendNewRow({
                            biz_item: '',
                            item_no: d.item_no || '',
                            item_name: d.item_name || '',
                            item_spec: d.item_spec || '',
                            qty: d.qty || d.order_qty || d.quote_qty || d.req_qty || d.po_qty || d.receipt_qty || d.delivery_qty || '',
                            unit: d.unit || '台',
                            price: d.price || d.unit_price || d.est_price || '',
                            amount: d.amount || d.quote_amount || d.est_amount || '',
                            date: d.date || d.est_delivery_date || d.delivery_date || d.require_date || d.receipt_date || '',
                            wh: d.warehouse || d.wh || 'P003'
                        });
                    });
                }
                if (typeof onCalculateTotals === 'function') onCalculateTotals();
            },
            getRowsData: () => {
                const rows = tbody.querySelectorAll('tr[data-row]');
                const list = [];
                rows.forEach((r, idx) => {
                    const rowIdx = r.getAttribute('data-row');
                    const itemNo = winEl.querySelector(`#${prefix}-item-no-${rowIdx}`)?.value.trim() || '';
                    const qty = parseFloat(winEl.querySelector(`#${prefix}-qty-${rowIdx}`)?.value) || 0;
                    if (itemNo && qty > 0) {
                        list.push({
                            line_no: String(idx + 1).padStart(4, '0'),
                            item_no: itemNo,
                            item_name: winEl.querySelector(`#${prefix}-item-name-${rowIdx}`)?.value.trim() || '',
                            item_spec: winEl.querySelector(`#${prefix}-item-spec-${rowIdx}`)?.value.trim() || '',
                            qty: qty,
                            unit: winEl.querySelector(`#${prefix}-unit-${rowIdx}`)?.value.trim() || '台',
                            price: parseFloat(winEl.querySelector(`#${prefix}-price-${rowIdx}`)?.value) || 0,
                            amount: parseFloat((winEl.querySelector(`#${prefix}-amount-${rowIdx}`)?.value || '').replace(/,/g, '')) || 0,
                            date: winEl.querySelector(`#${prefix}-date-${rowIdx}`)?.value.trim() || Modules.getTodayStr(),
                            warehouse: winEl.querySelector(`#${prefix}-wh-${rowIdx}`)?.value.trim() || 'P003'
                        });
                    }
                });
                return list;
            }
        };
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

echo "Base written successfully.\n";

fclose($fp);
