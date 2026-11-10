// ========================================================
// Conductor ERP Modules: Core Utilities & Components
// ========================================================

window.Modules = window.Modules || {};

Object.assign(window.Modules, {
    toast(message, type = 'success', duration = 1800) {
        if (typeof App !== 'undefined' && App.showToast) {
            App.showToast(message, type, duration);
        }
    },

    open(code, ...args) {
        switch (code) {
            case 'COPI01': this.openCOPI01(...args); break;
            case 'PURI01': this.openPURI01(...args); break;
            case 'INVI02': this.openINVI02(...args); break;
            case 'COPI05': this.openCOPI05(...args); break;
            case 'COPI06': this.openCOPI06(...args); break;
            case 'COPB10': this.openCOPB10(...args); break;
            case 'PURI05': this.openPURI05(...args); break;
            case 'PURI06': this.openPURI06(...args); break;
            case 'PURB01': this.openPURB01(...args); break;
            case 'PURI07': this.openPURI07(...args); break;
            case 'PURI09': this.openPURI09(...args); break;
            case 'COPI08': this.openCOPI08(...args); break;
            case 'QUEUE_CONSOLE': this.openQueueConsole(...args); break;
            case 'COPQ05': this.openCOPQ05(...args); break;
            case 'SEC_USER': this.openUserManagement(...args); break;
            case 'PRACTICE_GUIDE': this.openPracticeGuide(...args); break;
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

    async generateNextDocNo(type, dateStr = null) {
        const today = dateStr || this.getTodayStr();
        try {
            const res = await ERP_API.get('get_next_doc_no', { type, date: today });
            if (res.success && res.doc_no) {
                return res.doc_no;
            }
        } catch (e) {
            console.error('get_next_doc_no error', e);
        }
        // Fallback: 年4碼 + 月2碼 + 這個月第幾張單號3碼 (例如 202611001)
        const parts = today.split('/');
        const yyyymm = parts.length >= 2 ? (parts[0] + parts[1].padStart(2, '0')) : '202611';
        return yyyymm + '001';
    },

    // ========================================================
    // 串查查詢輔助方法 (價格計算器、歷史售價、歷史報價、計價、目前狀況、信用餘額)
    // ========================================================
    openPriceCalculator(data = {}) {
        const item = data.itemNo ? `品號: [${data.itemNo}] ${data.itemName || ''}\n` : '';
        const costInput = prompt(`【價格計算器】\n${item}請輸入商品預估進貨成本 (NTD):`, '2500');
        if (costInput === null) return;
        const marginInput = prompt('請輸入預期銷售毛利率 (%):', '25');
        if (marginInput === null) return;
        const c = parseFloat(costInput) || 0;
        const m = parseFloat(marginInput) || 0;
        const price = m < 100 ? Math.round(c / (1 - m / 100)) : c;
        const profit = price - c;
        alert(`【價格計算器 - 計算建議】\n------------------------------\n進貨成本: NTD ${c.toLocaleString()}\n預期毛利率: ${m}%\n------------------------------\n建議標準報價/售價: NTD ${price.toLocaleString()}\n預期毛利額: NTD ${profit.toLocaleString()}`);
    },

    showHistoryPrice(itemNo, customerNo) {
        const item = itemNo || '900006';
        const cust = customerNo || '1109';
        alert(`【歷史售價查詢】\n品號: ${item}\n客戶代號: ${cust}\n----------------------------------\n最近銷貨單價: NTD 3,990 (2026/10/15)\n次近銷貨單價: NTD 4,100 (2026/09/02)\n最高歷史售價: NTD 5,500\n最低歷史售價: NTD 3,800\n標準售價: NTD 3,990`);
    },

    showHistoryQuote(itemNo, customerNo) {
        const item = itemNo || '900006';
        const cust = customerNo || '1109';
        alert(`【歷史報價查詢】\n品號: ${item}\n客戶代號: ${cust}\n----------------------------------\n最新報價單號: 20261001001 (單價: NTD 4,200)\n歷史最高報價: NTD 5,800\n歷史最低報價: NTD 3,990\n歷次報價成交率: 88.5%`);
    },

    showCustomerPricing(customerNo, customerName) {
        const cNo = customerNo || '1109';
        const cName = customerName || '上奇科技股份有限公司';
        alert(`【客戶計價查詢】\n客戶: [${cNo}] ${cName}\n----------------------------------\n計價等級: A級經銷商特惠價\n價格條件: 定價一 (標準批發 85 折)\n稅別碼: 1:應稅內含 (5%)\n幣別代號: NTD 新台幣`);
    },

    showCustomerStatus(customerNo, customerName) {
        const cNo = customerNo || '1109';
        const cName = customerName || '上奇科技股份有限公司';
        alert(`【客戶目前狀況查詢】\n客戶: [${cNo}] ${cName}\n----------------------------------\n有效報價單: 1 筆\n未結訂單: 1 筆 (訂單金額: NTD 110,000)\n待出貨數量: 20 台\n未結應收帳款餘額: NTD 0\n交易狀態: 正常往來客戶`);
    },

    showCreditBalance(customerNo, customerName) {
        const cNo = customerNo || '1109';
        const cName = customerName || '上奇科技股份有限公司';
        alert(`【客戶信用餘額查詢】\n客戶代號: ${cNo} - ${cName}\n----------------------------------\n信用管制參數: 嚴格控管信用額度\n核准信用額度: NTD 10,000,000\n已用信用額度: NTD 110,000\n可用信用餘額: NTD 9,890,000\n信用狀態評等: 正常往來、信用評等優良`);
    },

    // ========================================================
    // 1:1 串查作業彈出式功能選單 (依照3個系統最新實機截圖客製化還原)
    // ========================================================
    showCrossQueryMenu(btnEl, options = {}) {
        // 若當前已有選單開啟，再次點擊按鈕則切換關閉
        const oldMenu = document.getElementById('erp-crossquery-popup-menu');
        if (oldMenu) {
            const sameBtn = oldMenu._triggerBtn === btnEl;
            oldMenu.remove();
            if (sameBtn) return;
        }

        const {
            orderNo = '',
            quoteNo = '',
            customerNo = '',
            customerName = '',
            itemNo = '',
            itemName = '',
            deliveryNo = '',
            currentModule = 'COPI06',
            includeTreeQuery = true
        } = options;

        const menuEl = document.createElement('div');
        menuEl.id = 'erp-crossquery-popup-menu';
        menuEl._triggerBtn = btnEl;

        let items = [];

        if (currentModule === 'COPI05') {
            // =========================================================================
            // 1. 報價單建立作業 (COPI05) - 1:1 對照截圖 media_1794200000639_072ccb99.png
            // =========================================================================
            items = [
                {
                    label: '客戶資料建立作業',
                    action: () => Modules.open('COPI01', customerNo)
                },
                {
                    label: '標準售價查詢',
                    action: () => {
                        if (itemNo) Modules.openLookup('item', () => {}, itemNo);
                        else Modules.openLookup('item');
                    }
                },
                {
                    label: '品號資料建立作業',
                    action: () => {
                        if (itemNo) {
                            Modules.open('INVI02', itemNo);
                        } else {
                            Modules.openLookup('item', (it) => {
                                if (it && it.item_no) Modules.open('INVI02', it.item_no);
                            });
                        }
                    }
                },
                {
                    label: '價格計算器',
                    action: () => Modules.openPriceCalculator({ itemNo, itemName, customerNo })
                },
                { isDivider: true },
                {
                    label: '歷史售價查詢',
                    action: () => Modules.showHistoryPrice(itemNo, customerNo)
                },
                {
                    label: '歷史報價查詢',
                    action: () => Modules.showHistoryQuote(itemNo, customerNo)
                },
                {
                    label: '客戶計價查詢',
                    action: () => Modules.showCustomerPricing(customerNo, customerName)
                },
                {
                    label: '客戶目前狀況查詢',
                    action: () => Modules.showCustomerStatus(customerNo, customerName)
                },
                {
                    label: '費用預估建立作業',
                    action: () => alert(`【費用預估建立作業】\n客戶: [${customerNo || '1109'}] ${customerName || '上奇科技'}\n報價單號: [${quoteNo || '最新'}]\n目前無預估衍生運費或手續費。`)
                }
            ];
        } else if (currentModule === 'COPI06') {
            // =========================================================================
            // 2. 客戶訂單建立作業 (COPI06) - 1:1 對照截圖 media_1794200000661_2901d794.png
            // =========================================================================
            items = [
                {
                    label: '客戶資料建立作業',
                    action: () => Modules.open('COPI01', customerNo)
                },
                {
                    label: '標準售價查詢',
                    action: () => {
                        if (itemNo) Modules.openLookup('item', () => {}, itemNo);
                        else Modules.openLookup('item');
                    }
                },
                {
                    label: '報價單建立作業',
                    action: () => Modules.open('COPI05')
                },
                {
                    label: '訂單排定交期維護作業',
                    action: () => alert(`【訂單排定交期維護作業】\n訂單單號: [${orderNo || '最新'}]\n預計交期已依據生產排程與庫存檢核確認。`)
                },
                {
                    label: '品號資料建立作業',
                    action: () => {
                        if (itemNo) {
                            Modules.open('INVI02', itemNo);
                        } else {
                            Modules.openLookup('item', (it) => {
                                if (it && it.item_no) Modules.open('INVI02', it.item_no);
                            });
                        }
                    }
                },
                { isDivider: true },
                {
                    label: '訂單樹狀資訊查詢',
                    action: () => Modules.open('COPQ05', orderNo)
                },
                {
                    label: '客戶信用餘額查詢',
                    action: () => Modules.showCreditBalance(customerNo, customerName)
                },
                {
                    label: '歷史售價查詢',
                    action: () => Modules.showHistoryPrice(itemNo, customerNo)
                },
                {
                    label: '客戶計價查詢',
                    action: () => Modules.showCustomerPricing(customerNo, customerName)
                },
                {
                    label: '正嘜資料查詢',
                    action: () => alert(`【正嘜資料查詢】\n訂單單號: [${orderNo || '最新'}]\n正嘜標記: C/NO: 1-UP\nMADE IN TAIWAN\n外箱正嘜規格符合客戶規範。`)
                },
                {
                    label: '側嘜資料查詢',
                    action: () => alert(`【側嘜資料查詢】\n訂單單號: [${orderNo || '最新'}]\n側嘜標記: ITEM / QTY / N.W. / G.W.\n外箱側嘜規格標記正常。`)
                },
                {
                    label: '客戶目前狀況查詢',
                    action: () => Modules.showCustomerStatus(customerNo, customerName)
                },
                {
                    label: '歷史變更資料查詢',
                    action: () => alert(`【歷史變更資料查詢】\n訂單單號: [${orderNo || '最新'}]\n目前為初版單據 (版次 0000)，尚無變更單紀錄。`)
                },
                {
                    label: '傳送資訊目前狀態查詢',
                    action: () => Modules.open('QUEUE_CONSOLE')
                },
                {
                    label: '費用預估建立作業',
                    action: () => alert(`【費用預估建立作業】\n訂單單號: [${orderNo || '最新'}]\n預估費用總額: NTD 0。`)
                },
                {
                    label: '暫出貨查詢',
                    action: () => alert(`【暫出貨查詢】\n客戶: [${customerNo || '1109'}] ${customerName || '上奇科技'}\n目前該客戶無暫出借樣或借貨未歸還記錄。`)
                }
            ];
        } else if (currentModule === 'COPI08') {
            // =========================================================================
            // 3. 銷貨單建立作業 (COPI08) - 1:1 對照截圖 media_1794200000746_83a234e2.jpg
            // =========================================================================
            items = [
                {
                    label: '客戶資料建立作業',
                    action: () => Modules.open('COPI01', customerNo)
                },
                {
                    label: '標準售價查詢',
                    action: () => {
                        if (itemNo) Modules.openLookup('item', () => {}, itemNo);
                        else Modules.openLookup('item');
                    }
                },
                {
                    label: '客戶訂單建立作業',
                    action: () => Modules.open('COPI06', orderNo)
                },
                {
                    label: '結帳單建立作業',
                    action: () => alert(`【結帳單建立作業】\n銷貨單號: [${deliveryNo || '最新'}]\n客戶: [${customerNo || '1109'}] ${customerName || '上奇科技'}\n該筆銷貨單尚未執行應收帳款立帳結帳作業。`)
                },
                {
                    label: '預收待抵',
                    action: () => alert(`【預收待抵查詢】\n客戶: [${customerNo || '1109'}] ${customerName || '上奇科技'}\n目前無預收訂金待抵款項。`)
                },
                {
                    label: '品號資料建立作業',
                    action: () => {
                        if (itemNo) {
                            Modules.open('INVI02', itemNo);
                        } else {
                            Modules.openLookup('item', (it) => {
                                if (it && it.item_no) Modules.open('INVI02', it.item_no);
                            });
                        }
                    }
                },
                { isDivider: true },
                {
                    label: '信用餘額查詢',
                    action: () => Modules.showCreditBalance(customerNo, customerName)
                },
                {
                    label: '歷史售價查詢',
                    action: () => Modules.showHistoryPrice(itemNo, customerNo)
                },
                {
                    label: '客戶計價查詢',
                    action: () => Modules.showCustomerPricing(customerNo, customerName)
                },
                {
                    label: '銷貨傳票查詢',
                    action: () => alert(`【銷貨傳票查詢】\n銷貨單號: [${deliveryNo || '最新'}]\n會計傳票狀態: 產生分錄-收入(尚未拋轉)。`)
                },
                {
                    label: '銷貨成本傳票查詢',
                    action: () => alert(`【銷貨成本傳票查詢】\n銷貨單號: [${deliveryNo || '最新'}]\n會計傳票狀態: 產生分錄-成本(月結統一拋轉)。`)
                },
                {
                    label: '客戶目前狀況查詢',
                    action: () => Modules.showCustomerStatus(customerNo, customerName)
                },
                {
                    label: '傳送資訊目前狀態查詢',
                    action: () => Modules.open('QUEUE_CONSOLE')
                },
                {
                    label: '發票列印',
                    action: () => alert(`【發票列印】\n銷貨單號: [${deliveryNo || '最新'}]\n統一發票二聯式/三聯式格式報表預覽產生中...`)
                }
            ];
        } else {
            // 通用預設 (採購系統 PURI07 或其它單據作業)
            items = [
                {
                    label: '供應廠商資料建立作業',
                    action: () => Modules.open('PURI01', customerNo)
                },
                {
                    label: '品號資料建立作業',
                    action: () => {
                        if (itemNo) Modules.open('INVI02', itemNo);
                        else Modules.openLookup('item', (it) => { if (it && it.item_no) Modules.open('INVI02', it.item_no); });
                    }
                },
                { isDivider: true },
                {
                    label: '採購樹狀資訊查詢',
                    action: () => alert(`【採購樹狀資訊查詢】\n單號: [${orderNo || '最新'}]`)
                },
                {
                    label: '廠商商品交易記錄查詢',
                    action: () => alert(`【廠商商品交易記錄查詢】\n品號: [${itemNo || '最新'}]`)
                }
            ];
        }

        // 渲染選單 HTML (1:1 還原微軟 WorkFlow ERP 選單樣式：無多餘圖示與括號，純淨文字左對齊)
        menuEl.innerHTML = items.map((it, idx) => {
            if (it.isDivider) {
                return `<div class="erp-crossquery-divider"></div>`;
            }
            return `
                <div class="erp-crossquery-menu-item" data-idx="${idx}">
                    <span>${it.label}</span>
                </div>
            `;
        }).join('');

        // 事件綁定
        menuEl.querySelectorAll('.erp-crossquery-menu-item').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(el.getAttribute('data-idx'), 10);
                menuEl.remove();
                if (items[idx] && typeof items[idx].action === 'function') {
                    items[idx].action();
                }
            });
        });

        document.body.appendChild(menuEl);

        // 定位彈出選單於按鈕下方
        const rect = btnEl.getBoundingClientRect();
        let top = rect.bottom + window.scrollY + 1;
        let left = rect.left + window.scrollX;

        const menuH = menuEl.offsetHeight || 320;
        const menuW = menuEl.offsetWidth || 195;
        if (top + menuH > window.innerHeight + window.scrollY) {
            top = rect.top + window.scrollY - menuH - 1;
        }
        if (left + menuW > window.innerWidth + window.scrollX) {
            left = rect.right + window.scrollX - menuW;
        }
        menuEl.style.top = `${top}px`;
        menuEl.style.left = `${left}px`;

        // 點擊外部自動關閉
        const outsideClickListener = (e) => {
            if (!menuEl.contains(e.target) && !btnEl.contains(e.target)) {
                menuEl.remove();
                document.removeEventListener('click', outsideClickListener);
                document.removeEventListener('keydown', escListener);
            }
        };
        const escListener = (e) => {
            if (e.key === 'Escape') {
                menuEl.remove();
                document.removeEventListener('click', outsideClickListener);
                document.removeEventListener('keydown', escListener);
            }
        };
        setTimeout(() => {
            document.addEventListener('click', outsideClickListener);
            document.addEventListener('keydown', escListener);
        }, 30);
    },

    // ========================================================
    // 1:1 UNIVERSAL LOOKUP DIALOG (開窗查詢 - 1:1 截圖還原)
    // ========================================================
    openLookup(type, onSelect, filterHint = '') {
        let title = '開窗查詢';
        let columns = [];
        let loadDataPromise;
        let defaultFilter = filterHint;

        switch (type) {
            // Image 1: 單別 (訂單單別)
            case 'doc_type_order':
                columns = [
                    { key: 'code', label: '單別', width: '130px' },
                    { key: 'name', label: '單據名稱', width: '230px' }
                ];
                loadDataPromise = ERP_API.get('get_doc_types', { category: 'order' }).then(r => r.data || [
                    { code: 'A221', name: '國內訂單' },
                    { code: 'A222', name: '國外訂單' },
                    { code: 'B221', name: '國內訂單' },
                    { code: 'C220', name: '訂單開帳單' },
                    { code: 'C221', name: '配銷訂單內' },
                    { code: 'C222', name: '配銷訂單外' }
                ]);
                break;

            // Image 2: 品號類別代號
            case 'item_category':
                columns = [
                    { key: 'code', label: '品號類別代號', width: '140px' },
                    { key: 'name', label: '品號類別名稱', width: '220px' }
                ];
                if (!defaultFilter) defaultFilter = '01';
                loadDataPromise = ERP_API.get('get_item_categories').then(r => r.data || [
                    { code: '01', name: '原料' },
                    { code: '02', name: '物料' },
                    { code: '03', name: '半成品' },
                    { code: '04', name: '成品' },
                    { code: '05', name: '商品' }
                ]);
                break;

            // Image 3: 庫別代號 (15筆)
            case 'warehouse':
                columns = [
                    { key: 'wh_no', label: '庫別代號', width: '90px' },
                    { key: 'wh_name', label: '庫別名稱', width: '120px' },
                    { key: 'plant', label: '廠別代號', width: '90px' },
                    { key: 'wh_prop', label: '庫存性質', width: '110px' }
                ];
                loadDataPromise = ERP_API.get('get_warehouses').then(r => r.data || [
                    { wh_no: 'HUB', wh_name: '在途倉', plant: 'TP01', wh_prop: '1:存貨倉' },
                    { wh_no: 'P001', wh_name: '原料倉一', plant: 'TP01', wh_prop: '1:存貨倉' },
                    { wh_no: 'P002', wh_name: '半成品倉一', plant: 'TP01', wh_prop: '1:存貨倉' },
                    { wh_no: 'P003', wh_name: '成品倉一', plant: 'TP01', wh_prop: '1:存貨倉' },
                    { wh_no: 'P004', wh_name: '不良品倉一', plant: 'TP01', wh_prop: '1:存貨倉' },
                    { wh_no: 'P005', wh_name: '報廢倉一', plant: 'TP01', wh_prop: '2:非存貨倉' },
                    { wh_no: 'P006', wh_name: '借出暫存倉', plant: 'TP01', wh_prop: '1:存貨倉' },
                    { wh_no: 'P007', wh_name: '借入暫存倉', plant: 'TP01', wh_prop: '1:存貨倉' },
                    { wh_no: 'P009', wh_name: '事務品倉一', plant: 'TP01', wh_prop: '1:存貨倉' },
                    { wh_no: 'Y001', wh_name: '原料倉二', plant: 'TY01', wh_prop: '1:存貨倉' },
                    { wh_no: 'Y002', wh_name: '半成品倉二', plant: 'TY01', wh_prop: '1:存貨倉' },
                    { wh_no: 'Y003', wh_name: '成品倉二', plant: 'TY01', wh_prop: '1:存貨倉' },
                    { wh_no: 'Y004', wh_name: '不良品倉二', plant: 'TY01', wh_prop: '1:存貨倉' },
                    { wh_no: 'Y005', wh_name: '報廢倉二', plant: 'TY01', wh_prop: '2:非存貨倉' },
                    { wh_no: 'Y009', wh_name: '事務品倉二', plant: 'TY01', wh_prop: '1:存貨倉' }
                ]);
                break;

            // Image 4: 廠別代號 (2筆)
            case 'factory':
                columns = [
                    { key: 'factory_no', label: '廠別代號', width: '130px' },
                    { key: 'factory_name', label: '廠別名稱', width: '230px' }
                ];
                loadDataPromise = ERP_API.get('get_factories').then(r => r.data || [
                    { factory_no: 'TP01', factory_name: '製造一廠' },
                    { factory_no: 'TY01', factory_name: '製造二廠' }
                ]);
                break;

            // Image 1: 員工代號 (16筆)
            case 'personnel':
            case 'salesperson':
            case 'employee':
                columns = [
                    { key: 'emp_no', label: '員工代號', width: '130px' },
                    { key: 'emp_name', label: '員工姓名', width: '230px' }
                ];
                loadDataPromise = ERP_API.get('get_employees').then(r => (r.data || [
                    { emp_no: '1001', emp_name: '張明達(業務)', dept_no: '1000' },
                    { emp_no: '112', emp_name: '翁湘琴', dept_no: '0200' },
                    { emp_no: '138', emp_name: '林子泉', dept_no: '1000' },
                    { emp_no: '145', emp_name: '黃聖凱', dept_no: '1000' },
                    { emp_no: '213', emp_name: '王小明', dept_no: '6000' },
                    { emp_no: '238', emp_name: '李玉郎', dept_no: '1000' },
                    { emp_no: '3001', emp_name: '王乾坤', dept_no: '1000' },
                    { emp_no: '301', emp_name: '林慶安', dept_no: '1000' },
                    { emp_no: '310', emp_name: '黃小玲', dept_no: '1000' },
                    { emp_no: '322', emp_name: '郭宏源', dept_no: '1000' },
                    { emp_no: '334', emp_name: '王效東', dept_no: '1000' },
                    { emp_no: '389', emp_name: '劉碧玲', dept_no: '1000' },
                    { emp_no: '395', emp_name: '洪郎雄', dept_no: '1000' },
                    { emp_no: '401', emp_name: '賈彩玲', dept_no: '1000' },
                    { emp_no: '402', emp_name: '曾美玲', dept_no: '1000' },
                    { emp_no: '403', emp_name: '蔡佳伶', dept_no: '1000' }
                ]).map(x => ({ ...x, code: x.emp_no, name: x.emp_name })));
                break;

            case 'customer':
                columns = [
                    { key: 'customer_no', label: '客戶代號', width: '90px' },
                    { key: 'name_short', label: '客戶簡稱', width: '120px' },
                    { key: 'full_name', label: '客戶全名', width: '220px' },
                    { key: 'tax_id', label: '統一編號', width: '90px' },
                    { key: 'sales_person', label: '業務人員', width: '145px' }
                ];
                loadDataPromise = ERP_API.get('get_customers').then(r => (r.data || []).map(x => ({ ...x, code: x.customer_no, name: x.name_short || x.full_name })));
                break;

            case 'item':
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
                columns = [
                    { key: 'req_no', label: '請購單號', width: '135px' },
                    { key: 'req_date', label: '請購日期', width: '85px' },
                    { key: 'req_user', label: '請購人員', width: '105px' },
                    { key: 'dept', label: '請購部門', width: '100px' },
                    { key: 'source_order_no', label: '來源訂單', width: '120px' },
                    { key: 'status', label: '狀態', width: '65px', align: 'center' }
                ];
                loadDataPromise = ERP_API.get('get_requisitions').then(r => r.data || []);
                break;

            case 'purchase_order':
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

            case 'doc_type_quote':
                columns = [{ key: 'code', label: '單別', width: '130px' }, { key: 'name', label: '單據名稱', width: '230px' }];
                loadDataPromise = ERP_API.get('get_doc_types', { category: 'quote' }).then(r => r.data || [
                    { code: 'C211', name: '配銷報價內' },
                    { code: 'C212', name: '配銷報價外' },
                    { code: 'A211', name: '標準報價單' }
                ]);
                break;

            case 'doc_type_deliv':
                columns = [{ key: 'code', label: '單別', width: '130px' }, { key: 'name', label: '單據名稱', width: '230px' }];
                loadDataPromise = ERP_API.get('get_doc_types', { category: 'delivery' }).then(r => (r.data && r.data.length > 0) ? r.data : [
                    { code: 'A231', name: '銷貨單' },
                    { code: 'A232', name: '銷貨單(隨)' },
                    { code: 'A233', name: '月結銷貨單' },
                    { code: 'A234', name: '現銷單' },
                    { code: 'C231', name: '配銷銷貨單' }
                ]);
                break;

            case 'doc_type_req':
                columns = [{ key: 'code', label: '單別', width: '130px' }, { key: 'name', label: '單據名稱', width: '230px' }];
                loadDataPromise = Promise.resolve([
                    { code: 'B311', name: '原料請購單' },
                    { code: 'B312', name: '事務請購單' },
                    { code: 'C311', name: '配銷請購單' }
                ]);
                break;

            case 'doc_type_po':
                columns = [{ key: 'code', label: '單別', width: '130px' }, { key: 'name', label: '單據名稱', width: '230px' }];
                loadDataPromise = ERP_API.get('get_doc_types', { category: 'po' }).then(r => (r.data && r.data.length > 0) ? r.data : [
                    { code: 'A331', name: '國內採購單' },
                    { code: 'A332', name: '國外採購單' },
                    { code: 'B331', name: '原料採購單' },
                    { code: 'B332', name: '事務採購單' },
                    { code: 'C330', name: '採購開帳單' },
                    { code: 'C331', name: '配銷採購內' },
                    { code: 'C332', name: '配銷採購外' }
                ]);
                break;

            case 'doc_type_gr':
                columns = [{ key: 'code', label: '單別', width: '130px' }, { key: 'name', label: '單據名稱', width: '230px' }];
                loadDataPromise = ERP_API.get('get_doc_types', { category: 'receipt' }).then(r => r.data || [
                    { code: 'A331', name: '進貨單' },
                    { code: 'A332', name: '國外進貨單' },
                    { code: 'C331', name: '配銷進貨單' }
                ]);
                break;

            case 'currency':
                columns = [{ key: 'code', label: '幣別', width: '80px' }, { key: 'name', label: '名稱', width: '120px' }, { key: 'rate', label: '預設匯率', width: '80px' }];
                loadDataPromise = Promise.resolve([
                    { code: 'NTD', name: '新台幣', rate: '1.0' },
                    { code: 'USD', name: '美元', rate: '32.15' },
                    { code: 'JPY', name: '日圓', rate: '0.215' },
                    { code: 'EUR', name: '歐元', rate: '34.80' },
                    { code: 'RMB', name: '人民幣', rate: '4.45' }
                ]);
                break;

            case 'department':
                columns = [{ key: 'dept_no', label: '部門代號', width: '120px' }, { key: 'dept_name', label: '部門名稱', width: '240px' }];
                loadDataPromise = Promise.resolve([
                    { dept_no: '1000', dept_name: '業務部' },
                    { dept_no: '2000', dept_name: '生產部' },
                    { dept_no: '3000', dept_name: '管理部' },
                    { dept_no: '4000', dept_name: '財務部' }
                ]);
                break;

            case 'payment_term':
                columns = [{ key: 'term_no', label: '付款條件代號', width: '120px' }, { key: 'term_name', label: '付款條件名稱', width: '240px' }];
                loadDataPromise = Promise.resolve([
                    { term_no: '202', term_name: '次月20日收款' },
                    { term_no: '001', term_name: '即期支票' },
                    { term_no: '002', term_name: '月結30天' },
                    { term_no: '003', term_name: '月結60天' }
                ]);
                break;

            case 'trade_term':
            case 'price_term':
                columns = [{ key: 'term_no', label: '條件代號', width: '120px' }, { key: 'term_name', label: '條件說明', width: '240px' }];
                loadDataPromise = Promise.resolve([
                    { term_no: '1', term_name: '一般交易' },
                    { term_no: '2', term_name: '分期交易' },
                    { term_no: 'FOB', term_name: 'FOB 船上交貨條件' },
                    { term_no: 'CIF', term_name: 'CIF 包含運費與保險' },
                    { term_no: 'EXW', term_name: 'EXW 工廠交貨' }
                ]).then(list => list.map(x => ({ ...x, code: x.term_no, name: x.term_name })));
                break;

            // 訂單管理系統專用 (全部 S 開頭: S01 ~ S22) - 1:1 對照截圖 media_1794200883131_3fd5383d.jpg
            case 'tax_order':
            case 'tax_sale':
            case 'tax_sales':
                columns = [
                    { key: 'code', label: '稅別碼', width: '70px' },
                    { key: 'name', label: '稅別名稱', width: '250px' },
                    { key: 'tax_rate_str', label: '營業稅率', width: '75px', align: 'right' },
                    { key: 'invoice_copies', label: '發票聯數', width: '70px' },
                    { key: 'copies_name', label: '聯數名稱', width: '130px' },
                    { key: 'tax_type', label: '課稅別', width: '90px' },
                    { key: 'remark', label: '備註', width: '60px' }
                ];
                loadDataPromise = Promise.resolve([
                    { code: 'S01', name: '銷項二聯式發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '1', copies_name: '二聯式', tax_type: '1:應稅內含', remark: '' },
                    { code: 'S02', name: '銷項二聯式發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '1', copies_name: '二聯式', tax_type: '2:應稅外加', remark: '' },
                    { code: 'S03', name: '銷項二聯式發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '1', copies_name: '二聯式', tax_type: '3:零稅率', remark: '' },
                    { code: 'S04', name: '銷項三聯式發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '2', copies_name: '三聯式', tax_type: '1:應稅內含', remark: '' },
                    { code: 'S05', name: '銷項三聯式發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '2', copies_name: '三聯式', tax_type: '2:應稅外加', remark: '' },
                    { code: 'S06', name: '銷項三聯式發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '2', copies_name: '三聯式', tax_type: '3:零稅率', remark: '' },
                    { code: 'S07', name: '銷項二聯式收銀機發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '3', copies_name: '二聯式收銀機發票', tax_type: '1:應稅內含', remark: '' },
                    { code: 'S08', name: '銷項二聯式收銀機發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '3', copies_name: '二聯式收銀機發票', tax_type: '3:零稅率', remark: '' },
                    { code: 'S09', name: '銷項三聯式收銀機發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '4', copies_name: '三聯式收銀機發票', tax_type: '1:應稅內含', remark: '' },
                    { code: 'S10', name: '銷項三聯式收銀機發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '4', copies_name: '三聯式收銀機發票', tax_type: '2:應稅外加', remark: '' },
                    { code: 'S11', name: '銷項三聯式收銀機發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '4', copies_name: '三聯式收銀機發票', tax_type: '3:零稅率', remark: '' },
                    { code: 'S12', name: '銷項電子計算機發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '5', copies_name: '電子計算機發票', tax_type: '1:應稅內含', remark: '' },
                    { code: 'S13', name: '銷項電子計算機發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '5', copies_name: '電子計算機發票', tax_type: '2:應稅外加', remark: '' },
                    { code: 'S14', name: '銷項電子計算機發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '5', copies_name: '電子計算機發票', tax_type: '3:零稅率', remark: '' },
                    { code: 'S15', name: '銷項免用發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '6', copies_name: '免用統一發票', tax_type: '3:零稅率', remark: '' },
                    { code: 'S16', name: '銷項免用發票-免稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '6', copies_name: '免用統一發票', tax_type: '4:免稅', remark: '' },
                    { code: 'S17', name: '銷項免用發票-不計稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '6', copies_name: '免用統一發票', tax_type: '9:不計稅', remark: '' },
                    { code: 'S18', name: '銷項三聯式發票-免稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '2', copies_name: '三聯式', tax_type: '4:免稅', remark: '' },
                    { code: 'S19', name: '銷項三聯式收銀機發票-免稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '4', copies_name: '三聯式收銀機發票', tax_type: '4:免稅', remark: '' },
                    { code: 'S20', name: '銷項電子發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '7', copies_name: '電子發票', tax_type: '1:應稅內含', remark: '' },
                    { code: 'S21', name: '銷項電子發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '7', copies_name: '電子發票', tax_type: '2:應稅外加', remark: '' },
                    { code: 'S22', name: '銷項電子發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '7', copies_name: '電子發票', tax_type: '3:零稅率', remark: '' }
                ]).then(list => list.map(x => ({ ...x, tax_code: x.code, tax_name: x.name })));
                break;

            // 採購管理系統專用 (全部 P 開頭: P01 ~ P22) - 1:1 對照截圖 media_1794200883065_3ae2faf7.jpg
            case 'tax':
            case 'tax_purchase':
            case 'tax_pur':
                columns = [
                    { key: 'code', label: '稅別碼', width: '70px' },
                    { key: 'name', label: '稅別名稱', width: '250px' },
                    { key: 'tax_rate_str', label: '營業稅率', width: '75px', align: 'right' },
                    { key: 'invoice_copies', label: '發票聯數', width: '70px' },
                    { key: 'copies_name', label: '聯數名稱', width: '130px' },
                    { key: 'tax_type', label: '課稅別', width: '90px' },
                    { key: 'remark', label: '備註', width: '60px' }
                ];
                loadDataPromise = Promise.resolve([
                    { code: 'P01', name: '進項二聯式發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '1', copies_name: '二聯式', tax_type: '1:應稅內含', remark: '' },
                    { code: 'P02', name: '進項二聯式發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '1', copies_name: '二聯式', tax_type: '2:應稅外加', remark: '' },
                    { code: 'P03', name: '進項二聯式發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '1', copies_name: '二聯式', tax_type: '3:零稅率', remark: '' },
                    { code: 'P04', name: '進項三聯式發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '2', copies_name: '三聯式', tax_type: '1:應稅內含', remark: '' },
                    { code: 'P05', name: '進項三聯式發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '2', copies_name: '三聯式', tax_type: '2:應稅外加', remark: '' },
                    { code: 'P06', name: '進項三聯式發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '2', copies_name: '三聯式', tax_type: '3:零稅率', remark: '' },
                    { code: 'P07', name: '進項二聯式收銀機發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '3', copies_name: '二聯式收銀機發票', tax_type: '1:應稅內含', remark: '' },
                    { code: 'P08', name: '進項二聯式收銀機發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '3', copies_name: '二聯式收銀機發票', tax_type: '3:零稅率', remark: '' },
                    { code: 'P09', name: '進項三聯式收銀機發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '4', copies_name: '三聯式收銀機發票', tax_type: '1:應稅內含', remark: '' },
                    { code: 'P10', name: '進項三聯式收銀機發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '4', copies_name: '三聯式收銀機發票', tax_type: '2:應稅外加', remark: '' },
                    { code: 'P11', name: '進項三聯式收銀機發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '4', copies_name: '三聯式收銀機發票', tax_type: '3:零稅率', remark: '' },
                    { code: 'P12', name: '進項電子計算機發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '5', copies_name: '電子計算機發票', tax_type: '1:應稅內含', remark: '' },
                    { code: 'P13', name: '進項電子計算機發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '5', copies_name: '電子計算機發票', tax_type: '2:應稅外加', remark: '' },
                    { code: 'P14', name: '進項電子計算機發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '5', copies_name: '電子計算機發票', tax_type: '3:零稅率', remark: '' },
                    { code: 'P15', name: '進項免用發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '6', copies_name: '免用統一發票', tax_type: '3:零稅率', remark: '' },
                    { code: 'P16', name: '進項免用發票-免稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '6', copies_name: '免用統一發票', tax_type: '4:免稅', remark: '' },
                    { code: 'P17', name: '進項免用發票-不計稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '6', copies_name: '免用統一發票', tax_type: '9:不計稅', remark: '' },
                    { code: 'P18', name: '進項三聯式發票-免稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '2', copies_name: '三聯式', tax_type: '4:免稅', remark: '' },
                    { code: 'P19', name: '進項三聯式收銀機發票-免稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '4', copies_name: '三聯式收銀機發票', tax_type: '4:免稅', remark: '' },
                    { code: 'P20', name: '進項電子發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '7', copies_name: '電子發票', tax_type: '1:應稅內含', remark: '' },
                    { code: 'P21', name: '進項電子發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '7', copies_name: '電子發票', tax_type: '2:應稅外加', remark: '' },
                    { code: 'P22', name: '進項電子發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '7', copies_name: '電子發票', tax_type: '3:零稅率', remark: '' }
                ]).then(list => list.map(x => ({ ...x, tax_code: x.code, tax_name: x.name })));
                break;

            case 'tax_code':
                columns = [
                    { key: 'code', label: '稅別碼', width: '70px' },
                    { key: 'name', label: '稅別名稱', width: '250px' },
                    { key: 'tax_rate_str', label: '營業稅率', width: '75px', align: 'right' },
                    { key: 'invoice_copies', label: '發票聯數', width: '70px' },
                    { key: 'copies_name', label: '聯數名稱', width: '130px' },
                    { key: 'tax_type', label: '課稅別', width: '90px' },
                    { key: 'remark', label: '備註', width: '60px' }
                ];
                if (filterHint && filterHint.toUpperCase().startsWith('P')) {
                    loadDataPromise = Promise.resolve([
                        { code: 'P01', name: '進項二聯式發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '1', copies_name: '二聯式', tax_type: '1:應稅內含', remark: '' },
                        { code: 'P02', name: '進項二聯式發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '1', copies_name: '二聯式', tax_type: '2:應稅外加', remark: '' },
                        { code: 'P03', name: '進項二聯式發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '1', copies_name: '二聯式', tax_type: '3:零稅率', remark: '' },
                        { code: 'P04', name: '進項三聯式發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '2', copies_name: '三聯式', tax_type: '1:應稅內含', remark: '' },
                        { code: 'P05', name: '進項三聯式發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '2', copies_name: '三聯式', tax_type: '2:應稅外加', remark: '' },
                        { code: 'P06', name: '進項三聯式發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '2', copies_name: '三聯式', tax_type: '3:零稅率', remark: '' },
                        { code: 'P07', name: '進項二聯式收銀機發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '3', copies_name: '二聯式收銀機發票', tax_type: '1:應稅內含', remark: '' },
                        { code: 'P08', name: '進項二聯式收銀機發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '3', copies_name: '二聯式收銀機發票', tax_type: '3:零稅率', remark: '' },
                        { code: 'P09', name: '進項三聯式收銀機發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '4', copies_name: '三聯式收銀機發票', tax_type: '1:應稅內含', remark: '' },
                        { code: 'P10', name: '進項三聯式收銀機發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '4', copies_name: '三聯式收銀機發票', tax_type: '2:應稅外加', remark: '' },
                        { code: 'P11', name: '進項三聯式收銀機發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '4', copies_name: '三聯式收銀機發票', tax_type: '3:零稅率', remark: '' },
                        { code: 'P12', name: '進項電子計算機發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '5', copies_name: '電子計算機發票', tax_type: '1:應稅內含', remark: '' },
                        { code: 'P13', name: '進項電子計算機發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '5', copies_name: '電子計算機發票', tax_type: '2:應稅外加', remark: '' },
                        { code: 'P14', name: '進項電子計算機發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '5', copies_name: '電子計算機發票', tax_type: '3:零稅率', remark: '' },
                        { code: 'P15', name: '進項免用發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '6', copies_name: '免用統一發票', tax_type: '3:零稅率', remark: '' },
                        { code: 'P16', name: '進項免用發票-免稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '6', copies_name: '免用統一發票', tax_type: '4:免稅', remark: '' },
                        { code: 'P17', name: '進項免用發票-不計稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '6', copies_name: '免用統一發票', tax_type: '9:不計稅', remark: '' },
                        { code: 'P18', name: '進項三聯式發票-免稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '2', copies_name: '三聯式', tax_type: '4:免稅', remark: '' },
                        { code: 'P19', name: '進項三聯式收銀機發票-免稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '4', copies_name: '三聯式收銀機發票', tax_type: '4:免稅', remark: '' },
                        { code: 'P20', name: '進項電子發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '7', copies_name: '電子發票', tax_type: '1:應稅內含', remark: '' },
                        { code: 'P21', name: '進項電子發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '7', copies_name: '電子發票', tax_type: '2:應稅外加', remark: '' },
                        { code: 'P22', name: '進項電子發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '7', copies_name: '電子發票', tax_type: '3:零稅率', remark: '' }
                    ]).then(list => list.map(x => ({ ...x, tax_code: x.code, tax_name: x.name })));
                } else {
                    loadDataPromise = Promise.resolve([
                        { code: 'S01', name: '銷項二聯式發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '1', copies_name: '二聯式', tax_type: '1:應稅內含', remark: '' },
                        { code: 'S02', name: '銷項二聯式發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '1', copies_name: '二聯式', tax_type: '2:應稅外加', remark: '' },
                        { code: 'S03', name: '銷項二聯式發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '1', copies_name: '二聯式', tax_type: '3:零稅率', remark: '' },
                        { code: 'S04', name: '銷項三聯式發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '2', copies_name: '三聯式', tax_type: '1:應稅內含', remark: '' },
                        { code: 'S05', name: '銷項三聯式發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '2', copies_name: '三聯式', tax_type: '2:應稅外加', remark: '' },
                        { code: 'S06', name: '銷項三聯式發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '2', copies_name: '三聯式', tax_type: '3:零稅率', remark: '' },
                        { code: 'S07', name: '銷項二聯式收銀機發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '3', copies_name: '二聯式收銀機發票', tax_type: '1:應稅內含', remark: '' },
                        { code: 'S08', name: '銷項二聯式收銀機發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '3', copies_name: '二聯式收銀機發票', tax_type: '3:零稅率', remark: '' },
                        { code: 'S09', name: '銷項三聯式收銀機發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '4', copies_name: '三聯式收銀機發票', tax_type: '1:應稅內含', remark: '' },
                        { code: 'S10', name: '銷項三聯式收銀機發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '4', copies_name: '三聯式收銀機發票', tax_type: '2:應稅外加', remark: '' },
                        { code: 'S11', name: '銷項三聯式收銀機發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '4', copies_name: '三聯式收銀機發票', tax_type: '3:零稅率', remark: '' },
                        { code: 'S12', name: '銷項電子計算機發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '5', copies_name: '電子計算機發票', tax_type: '1:應稅內含', remark: '' },
                        { code: 'S13', name: '銷項電子計算機發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '5', copies_name: '電子計算機發票', tax_type: '2:應稅外加', remark: '' },
                        { code: 'S14', name: '銷項電子計算機發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '5', copies_name: '電子計算機發票', tax_type: '3:零稅率', remark: '' },
                        { code: 'S15', name: '銷項免用發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '6', copies_name: '免用統一發票', tax_type: '3:零稅率', remark: '' },
                        { code: 'S16', name: '銷項免用發票-免稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '6', copies_name: '免用統一發票', tax_type: '4:免稅', remark: '' },
                        { code: 'S17', name: '銷項免用發票-不計稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '6', copies_name: '免用統一發票', tax_type: '9:不計稅', remark: '' },
                        { code: 'S18', name: '銷項三聯式發票-免稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '2', copies_name: '三聯式', tax_type: '4:免稅', remark: '' },
                        { code: 'S19', name: '銷項三聯式收銀機發票-免稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '4', copies_name: '三聯式收銀機發票', tax_type: '4:免稅', remark: '' },
                        { code: 'S20', name: '銷項電子發票-應稅內含', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '7', copies_name: '電子發票', tax_type: '1:應稅內含', remark: '' },
                        { code: 'S21', name: '銷項電子發票-應稅外加', tax_rate_str: '5.00%', rate: 5.0, invoice_copies: '7', copies_name: '電子發票', tax_type: '2:應稅外加', remark: '' },
                        { code: 'S22', name: '銷項電子發票-零稅', tax_rate_str: '0.00%', rate: 0.0, invoice_copies: '7', copies_name: '電子發票', tax_type: '3:零稅率', remark: '' }
                    ]).then(list => list.map(x => ({ ...x, tax_code: x.code, tax_name: x.name })));
                }
                break;

            case 'unit':
                columns = [
                    { key: 'unit_no', label: '單位代號', width: '90px' },
                    { key: 'unit_name', label: '單位名稱', width: '160px' },
                    { key: 'unit_en', label: '英文名稱', width: '110px' }
                ];
                loadDataPromise = Promise.resolve([
                    { unit_no: 'PC', unit_name: '件/個', unit_en: 'PIECE' },
                    { unit_no: 'PCS', unit_name: '個', unit_en: 'PIECES' },
                    { unit_no: '台', unit_name: '台', unit_en: 'UNIT' },
                    { unit_no: '組', unit_name: '組', unit_en: 'SET' },
                    { unit_no: '套', unit_name: '套', unit_en: 'SET' },
                    { unit_no: '包', unit_name: '包', unit_en: 'PACK' },
                    { unit_no: '箱', unit_name: '箱', unit_en: 'BOX' },
                    { unit_no: '盒', unit_name: '盒', unit_en: 'BOX' },
                    { unit_no: '條', unit_name: '條', unit_en: 'STRIP' },
                    { unit_no: '張', unit_name: '張', unit_en: 'SHEET' },
                    { unit_no: '本', unit_name: '本', unit_en: 'BOOK' },
                    { unit_no: '支', unit_name: '支', unit_en: 'PIECE' },
                    { unit_no: '捲', unit_name: '捲', unit_en: 'ROLL' },
                    { unit_no: '袋', unit_name: '袋', unit_en: 'BAG' },
                    { unit_no: '瓶', unit_name: '瓶', unit_en: 'BOTTLE' },
                    { unit_no: '罐', unit_name: '罐', unit_en: 'CAN' },
                    { unit_no: 'KG', unit_name: '公斤', unit_en: 'KILOGRAM' },
                    { unit_no: 'G', unit_name: '公克', unit_en: 'GRAM' },
                    { unit_no: 'M', unit_name: '公尺(米)', unit_en: 'METER' },
                    { unit_no: 'CM', unit_name: '公分', unit_en: 'CENTIMETER' },
                    { unit_no: 'MM', unit_name: '公釐', unit_en: 'MILLIMETER' },
                    { unit_no: 'L', unit_name: '公升', unit_en: 'LITER' },
                    { unit_no: 'ML', unit_name: '毫升', unit_en: 'MILLILITER' }
                ]).then(list => list.map(x => ({ ...x, code: x.unit_no, name: x.unit_name })));
                break;

            default:
                alert('未定義開窗類型: ' + type);
                return;
        }

        const modal = document.createElement('div');
        modal.className = 'erp-lookup-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'erp-lookup-window';

        let ths = '<th style="width:22px; background:#5B7DB1; text-align:center;"></th>' + columns.map(c => `<th style="width:${c.width};">${c.label}</th>`).join('');
        let colOpts = columns.map(c => `<option value="${c.key}">${c.label}</option>`).join('');

        dialog.innerHTML = `
            <div class="erp-lookup-titlebar">
                <div class="win-title">
                    <span class="win-wf-badge">Wf</span>
                    <span>開窗查詢</span>
                </div>
                <div class="win-controls">
                    <button class="win-btn close erp-lookup-close">✕</button>
                </div>
            </div>
            <div class="erp-lookup-topbar">
                <button type="button" class="erp-lookup-nav-btn" id="lookup-btn-first" title="首筆">|◀</button>
                <button type="button" class="erp-lookup-nav-btn" id="lookup-btn-prev" title="上筆">◀</button>
                <button type="button" class="erp-lookup-nav-btn" id="lookup-btn-next" title="下筆">▶</button>
                <button type="button" class="erp-lookup-nav-btn" id="lookup-btn-last" title="末筆">▶|</button>
                <button type="button" class="erp-lookup-nav-btn" id="lookup-btn-requery" style="padding:0 5px;" title="重新查詢">重查</button>
                <select id="lookup-select-col" style="margin-left:2px;">${colOpts}</select>
                <select id="lookup-select-op">
                    <option value=">=">&gt;=</option>
                    <option value="=">=</option>
                    <option value="<=">&lt;=</option>
                    <option value="contains">包含</option>
                </select>
                <input type="text" id="lookup-inp-val" value="${defaultFilter || ''}">
            </div>
            <div class="erp-lookup-grid-container">
                <table class="erp-lookup-table">
                    <thead><tr>${ths}</tr></thead>
                    <tbody class="erp-lookup-tbody">
                        <tr><td colspan="${columns.length + 1}" style="text-align:center; padding:30px; color:#666;">載入資料庫預設主檔中...</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="erp-lookup-statusbar">
                <span>資料筆數</span>
                <span class="lookup-stat-box" id="lookup-stat-count">0</span>
                <span>欄位數</span>
                <span class="lookup-stat-box" id="lookup-stat-cols">${columns.length}</span>
            </div>
            <div class="erp-lookup-btnbar">
                <button type="button" class="lookup-act-btn primary erp-lookup-confirm">
                    <span style="color:#008000; font-weight:bold;">✔</span> 確定
                </button>
                <button type="button" class="lookup-act-btn erp-lookup-cancel">
                    <span style="color:#C00000; font-weight:bold;">✖</span> 取消
                </button>
            </div>
        `;

        modal.appendChild(dialog);
        document.body.appendChild(modal);

        const btnFirst = dialog.querySelector('#lookup-btn-first');
        const btnPrev = dialog.querySelector('#lookup-btn-prev');
        const btnNext = dialog.querySelector('#lookup-btn-next');
        const btnLast = dialog.querySelector('#lookup-btn-last');
        const btnRequery = dialog.querySelector('#lookup-btn-requery');
        const selectCol = dialog.querySelector('#lookup-select-col');
        const selectOp = dialog.querySelector('#lookup-select-op');
        const inpVal = dialog.querySelector('#lookup-inp-val');
        const tbody = dialog.querySelector('.erp-lookup-tbody');
        const statCount = dialog.querySelector('#lookup-stat-count');
        const btnConfirm = dialog.querySelector('.erp-lookup-confirm');
        const btnCancel = dialog.querySelector('.erp-lookup-cancel');
        const btnClose = dialog.querySelector('.erp-lookup-close');

        let allData = [];
        let filteredData = [];
        let selectedIndex = 0;

        const renderTable = () => {
            statCount.textContent = filteredData.length;
            if (filteredData.length === 0) {
                tbody.innerHTML = `<tr><td colspan="${columns.length + 1}" style="text-align:center; padding:30px; color:#888;">無符合篩選條件之主檔資料</td></tr>`;
                return;
            }

            if (selectedIndex >= filteredData.length) selectedIndex = filteredData.length - 1;
            if (selectedIndex < 0) selectedIndex = 0;

            let html = '';
            filteredData.forEach((item, idx) => {
                const isSel = idx === selectedIndex;
                const rowClass = (idx % 2 === 1) ? 'even-row' : 'odd-row';
                let tds = `<td style="width:22px; text-align:center; color:#003366; font-size:10px;" class="lookup-row-ind">${isSel ? '▶' : ''}</td>`;
                tds += columns.map(c => {
                    const align = c.align ? `style="text-align:${c.align};"` : '';
                    let val = item[c.key] !== undefined ? item[c.key] : '';
                    if (typeof val === 'number') val = val.toLocaleString();
                    return `<td ${align}>${val}</td>`;
                }).join('');
                html += `<tr data-idx="${idx}" class="${rowClass} ${isSel ? 'selected' : ''}">${tds}</tr>`;
            });

            tbody.innerHTML = html;
            const selTr = tbody.querySelector('tr.selected');
            if (selTr) selTr.scrollIntoView({ block: 'nearest' });
        };

        const applyFilter = () => {
            const colKey = selectCol.value;
            const op = selectOp.value;
            const val = inpVal.value.trim().toLowerCase();

            if (!val) {
                filteredData = [...allData];
            } else {
                filteredData = allData.filter(item => {
                    const itemVal = String(item[colKey] !== undefined ? item[colKey] : '').toLowerCase();
                    if (op === '>=') return itemVal >= val;
                    if (op === '<=') return itemVal <= val;
                    if (op === '=') return itemVal === val;
                    return itemVal.includes(val);
                });
            }
            selectedIndex = 0;
            renderTable();
        };

        loadDataPromise.then(data => {
            allData = data || [];
            applyFilter();
            inpVal.focus();
        }).catch(err => {
            tbody.innerHTML = `<tr><td colspan="${columns.length + 1}" style="text-align:center; padding:20px; color:red;">載入失敗: ${err.message}</td></tr>`;
        });

        btnFirst.addEventListener('click', () => { selectedIndex = 0; renderTable(); });
        btnPrev.addEventListener('click', () => { if (selectedIndex > 0) { selectedIndex--; renderTable(); } });
        btnNext.addEventListener('click', () => { if (selectedIndex < filteredData.length - 1) { selectedIndex++; renderTable(); } });
        btnLast.addEventListener('click', () => { selectedIndex = Math.max(0, filteredData.length - 1); renderTable(); });
        btnRequery.addEventListener('click', applyFilter);
        inpVal.addEventListener('input', applyFilter);
        inpVal.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); chooseCurrent(); } });
        selectCol.addEventListener('change', applyFilter);
        selectOp.addEventListener('change', applyFilter);

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

        const whMap = {
            'HUB': '在途倉',
            'P001': '原料倉一',
            'P002': '半成品倉一',
            'P003': '成品倉一',
            'P004': '不良品倉一',
            'P005': '報廢倉一',
            'P006': '借出暫存倉',
            'P007': '借入暫存倉',
            'P009': '事務品倉一',
            'W01': '主倉庫',
            'Y001': '原料倉二',
            'Y002': '半成品倉二',
            'Y003': '成品倉二',
            'Y004': '不良品倉二',
            'Y005': '報廢倉二',
            'Y009': '事務品倉二'
        };

        let isGridEditable = false;
        const gridContainer = tbody.closest('.erp-datagrid-container') || tbody.parentElement;

        const setEditable = (editable) => {
            isGridEditable = !!editable;
            if (gridContainer) {
                if (isGridEditable) {
                    gridContainer.classList.remove('grid-readonly');
                } else {
                    gridContainer.classList.add('grid-readonly');
                }
            }
            tbody.querySelectorAll('tr[data-row]').forEach(r => {
                r.querySelectorAll('input:not(.grid-amount):not(.erp-input-readonly)').forEach(inp => {
                    inp.readOnly = !isGridEditable;
                });
                r.querySelectorAll('button').forEach(btn => {
                    btn.disabled = !isGridEditable;
                });
            });
        };

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
            const isPuri09 = (prefix === 'puri09');
            const isPuri05 = (prefix === 'puri05');
            const isCopi05 = (prefix === 'copi05');
            const isCopi08 = (prefix === 'copi08');

            if (isPuri05) {
                // 1:1 請購單建立作業 (PURI05 - 擷取9.PNG)
                tr.innerHTML = `
                    <td style="text-align:center; width:22px; color:#003366; font-size:10px;" class="row-indicator">${rowIdx === 1 ? '▶' : ''}</td>
                    <td style="text-align:center; background:#00CED1; font-weight:bold; width:38px;" class="row-line-no">${lineNo}</td>
                    <td style="display:flex; align-items:center; padding:0 1px; width:100px;">
                        <input type="text" id="${prefix}-item-no-${rowIdx}" class="erp-input-yellow" style="flex:1;" value="${initialData?.item_no || ''}">
                        <button type="button" class="lookup-icon-btn" data-lookup-row="${rowIdx}" title="挑選品號">🔍</button>
                    </td>
                    <td style="width:170px;"><input type="text" id="${prefix}-item-name-${rowIdx}" value="${initialData?.item_name || ''}"></td>
                    <td style="width:130px;"><input type="text" id="${prefix}-item-spec-${rowIdx}" value="${initialData?.item_spec || ''}"></td>
                    <td style="display:flex; align-items:center; padding:0 1px; width:75px;">
                        <input type="text" id="${prefix}-wh-${rowIdx}" class="grid-wh erp-input-yellow" style="flex:1; text-align:center;" value="${initialData?.wh || 'P003'}">
                        <button type="button" class="lookup-icon-btn" data-lookup-wh="${rowIdx}" title="挑選庫別">☖</button>
                    </td>
                    <td style="width:65px;"><input type="text" id="${prefix}-qty-${rowIdx}" class="grid-qty" style="text-align:right;" value="${initialData?.qty || ''}"></td>
                    <td style="width:40px;"><input type="text" id="${prefix}-unit-${rowIdx}" style="text-align:center;" value="${initialData?.unit || '台'}"></td>
                    <td style="width:75px;"><input type="text" id="${prefix}-price-${rowIdx}" class="grid-price" style="text-align:right;" value="${initialData?.price || ''}"></td>
                    <td style="width:85px;"><input type="text" id="${prefix}-amount-${rowIdx}" class="grid-amount erp-input-readonly" style="text-align:right;" value="${initialData?.amount ? Math.round(initialData.amount).toLocaleString() : ''}" readonly></td>
                    <td style="width:85px;"><input type="text" id="${prefix}-date-${rowIdx}" class="grid-date grid-last-cell" style="text-align:center;" value="${initialData?.date || ''}"></td>
                `;
            } else if (isPuri09) {
                // 1:1 進貨單建立作業 (PURI09 - 圖片13 / 擷取13.PNG)
                const grQtyVal = initialData?.gr_qty !== undefined ? initialData.gr_qty : (initialData?.qty !== undefined ? initialData.qty : '');
                const chkQtyVal = (initialData?.check_qty !== undefined && initialData?.check_qty !== null && initialData?.check_qty !== '') ? initialData.check_qty : '';
                const billQtyVal = initialData?.bill_qty !== undefined ? initialData.bill_qty : grQtyVal;
                const unitVal = initialData?.unit || '';
                const billUnitVal = initialData?.bill_unit || unitVal;

                tr.innerHTML = `
                    <td style="text-align:center; width:24px; color:#003366; font-size:10px;" class="row-indicator">${rowIdx === 1 ? '▶' : ''}</td>
                    <td style="text-align:center; background:#00E5FF; font-weight:bold; width:40px;" class="row-line-no">${lineNo}</td>
                    <td style="display:flex; align-items:center; padding:0 1px; width:125px;">
                        <input type="text" id="${prefix}-item-no-${rowIdx}" class="erp-input-yellow" style="flex:1; background:#FFFFB0;" value="${initialData?.item_no || ''}">
                        <button type="button" class="lookup-icon-btn" data-lookup-row="${rowIdx}" title="挑選品號">🔍</button>
                    </td>
                    <td style="width:170px;"><input type="text" id="${prefix}-item-name-${rowIdx}" value="${initialData?.item_name || ''}"></td>
                    <td style="width:140px;"><input type="text" id="${prefix}-item-spec-${rowIdx}" value="${initialData?.item_spec || ''}"></td>
                    <td style="width:85px;"><input type="text" id="${prefix}-qty-${rowIdx}" class="grid-qty" style="text-align:right;" value="${grQtyVal}"></td>
                    <td style="width:55px;"><input type="text" id="${prefix}-unit-${rowIdx}" class="erp-input-yellow" style="text-align:center; background:#FFFFB0;" value="${unitVal}"></td>
                    <td style="width:85px;"><input type="text" id="${prefix}-check-qty-${rowIdx}" class="grid-check-qty" style="text-align:right;" value="${chkQtyVal}"></td>
                    <td style="width:85px;"><input type="text" id="${prefix}-bill-qty-${rowIdx}" class="grid-bill-qty" style="text-align:right;" value="${billQtyVal}"></td>
                    <td style="width:65px;"><input type="text" id="${prefix}-bill-unit-${rowIdx}" class="erp-input-yellow" style="text-align:center; background:#FFFFB0;" value="${billUnitVal}"></td>
                    <td style="width:80px;"><input type="text" id="${prefix}-price-${rowIdx}" class="grid-price" style="text-align:right;" value="${initialData?.price || initialData?.unit_price || ''}"></td>
                    <td style="width:90px;"><input type="text" id="${prefix}-amount-${rowIdx}" class="grid-amount erp-input-readonly" style="text-align:right;" value="${initialData?.amount ? Math.round(initialData.amount).toLocaleString() : ''}" readonly></td>
                    <td style="display:flex; align-items:center; padding:0 1px; width:80px;">
                        <input type="text" id="${prefix}-wh-${rowIdx}" class="grid-wh grid-last-cell" style="flex:1; text-align:center;" value="${initialData?.wh || initialData?.warehouse || ''}">
                        <button type="button" class="lookup-icon-btn" data-lookup-wh="${rowIdx}" title="挑選庫別">☖</button>
                    </td>
                `;
            } else if (isCopi08) {
                // 1:1 銷貨單建立作業 (COPI08 - 擷取4.PNG)
                // 標頭欄位: 📋 | 序號 | 業務品號 | 品號 | 品名 | 規格 | 庫別 | 庫別名稱 | 出貨數量 | 單位 | 單價 | 金額
                const whVal = initialData?.warehouse || initialData?.wh || 'W01';
                const whNameVal = initialData?.wh_name || initialData?.warehouse_name || whMap[whVal] || (whVal === 'W01' ? '主倉庫' : (whVal === 'P003' ? '成品倉一' : ''));
                const qtyVal = (initialData?.delivery_qty !== undefined && initialData?.delivery_qty !== null && initialData?.delivery_qty !== '')
                    ? initialData.delivery_qty
                    : ((initialData?.qty !== undefined && initialData?.qty !== null && initialData?.qty !== '') ? initialData.qty : '');
                const unitVal = initialData?.unit || '台';
                const priceVal = (initialData?.unit_price !== undefined && initialData?.unit_price !== null && initialData?.unit_price !== '')
                    ? initialData.unit_price
                    : ((initialData?.price !== undefined && initialData?.price !== null && initialData?.price !== '') ? initialData.price : '');
                const amtVal = initialData?.amount
                    ? Math.round(initialData.amount).toLocaleString()
                    : ((qtyVal !== '' && priceVal !== '') ? Math.round(parseFloat(qtyVal) * parseFloat(priceVal)).toLocaleString() : '');

                tr.innerHTML = `
                    <td style="text-align:center; width:22px; color:#003366; font-size:10px;" class="row-indicator">${rowIdx === 1 ? '▶' : ''}</td>
                    <td style="text-align:center; background:#00CED1; font-weight:bold; width:38px;" class="row-line-no">${lineNo}</td>
                    <td style="width:75px;"><input type="text" id="${prefix}-biz-item-${rowIdx}" value="${initialData?.biz_item || initialData?.biz_item_no || ''}"></td>
                    <td style="display:flex; align-items:center; padding:0 1px; width:100px;">
                        <input type="text" id="${prefix}-item-no-${rowIdx}" class="erp-input-yellow" style="flex:1;" value="${initialData?.item_no || ''}">
                        <button type="button" class="lookup-icon-btn" data-lookup-row="${rowIdx}" title="挑選品號">🔍</button>
                    </td>
                    <td style="width:160px;"><input type="text" id="${prefix}-item-name-${rowIdx}" value="${initialData?.item_name || ''}"></td>
                    <td style="width:120px;"><input type="text" id="${prefix}-item-spec-${rowIdx}" value="${initialData?.item_spec || ''}"></td>
                    <td style="display:flex; align-items:center; padding:0 1px; width:70px;">
                        <input type="text" id="${prefix}-wh-${rowIdx}" class="grid-wh erp-input-yellow" style="flex:1; text-align:center;" value="${whVal}">
                        <button type="button" class="lookup-icon-btn" data-lookup-wh="${rowIdx}" title="挑選庫別">☖</button>
                    </td>
                    <td style="width:100px;"><input type="text" id="${prefix}-wh-name-${rowIdx}" class="erp-input-readonly" style="width:100%; text-align:center;" value="${whNameVal}" readonly></td>
                    <td style="width:65px;"><input type="text" id="${prefix}-qty-${rowIdx}" class="grid-qty" style="text-align:right;" value="${qtyVal}"></td>
                    <td style="width:40px;"><input type="text" id="${prefix}-unit-${rowIdx}" style="text-align:center;" value="${unitVal}"></td>
                    <td style="width:75px;"><input type="text" id="${prefix}-price-${rowIdx}" class="grid-price" style="text-align:right;" value="${priceVal}"></td>
                    <td style="width:85px;"><input type="text" id="${prefix}-amount-${rowIdx}" class="grid-amount grid-last-cell erp-input-readonly" style="text-align:right;" value="${amtVal}" readonly></td>
                `;
            } else {
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
                    ${isPuri09 ? `<td style="width:65px;"><input type="text" id="${prefix}-check-qty-${rowIdx}" class="grid-check-qty" style="text-align:right;" value="${chkQtyVal}"></td>` : ''}
                    <td style="width:40px;"><input type="text" id="${prefix}-unit-${rowIdx}" style="text-align:center;" value="${initialData?.unit || '台'}"></td>
                    <td style="width:75px;"><input type="text" id="${prefix}-price-${rowIdx}" class="grid-price" style="text-align:right;" value="${initialData?.price || ''}"></td>
                    <td style="width:85px;"><input type="text" id="${prefix}-amount-${rowIdx}" class="grid-amount erp-input-readonly" style="text-align:right;" value="${initialData?.amount ? Math.round(initialData.amount).toLocaleString() : ''}" readonly></td>
                    <td style="width:85px;"><input type="text" id="${prefix}-date-${rowIdx}" class="grid-date ${includeWh || isCopi05 ? '' : 'grid-last-cell'}" style="text-align:center;" value="${initialData?.date || ''}"></td>
                    ${isCopi05 ? `
                    <td style="width:95px; padding:0 2px;">
                        <div style="display:flex; align-items:center; width:100%; height:100%;">
                            <input type="text" id="${prefix}-eff-date-${rowIdx}" class="grid-eff-date" style="flex:1; width:0; text-align:center; padding:1px; border:none; background:transparent; font-size:11px;" value="${initialData?.effective_date || ''}" placeholder=" /  / ">
                            <button type="button" class="grid-date-btn" data-target="${prefix}-eff-date-${rowIdx}" style="width:16px; height:18px; padding:0; font-size:10px; cursor:pointer; border:1px solid #7F9DB9; background:#ECE9D8; flex-shrink:0;" title="點選生效日">...</button>
                        </div>
                    </td>
                    <td style="width:95px; padding:0 2px;">
                        <div style="display:flex; align-items:center; width:100%; height:100%;">
                            <input type="text" id="${prefix}-exp-date-${rowIdx}" class="grid-exp-date grid-last-cell" style="flex:1; width:0; text-align:center; padding:1px; border:none; background:transparent; font-size:11px;" value="${initialData?.expiry_date || ''}" placeholder=" /  / ">
                            <button type="button" class="grid-date-btn" data-target="${prefix}-exp-date-${rowIdx}" style="width:16px; height:18px; padding:0; font-size:10px; cursor:pointer; border:1px solid #7F9DB9; background:#ECE9D8; flex-shrink:0;" title="點選失效日">...</button>
                        </div>
                    </td>
                    ` : ''}
                    ${includeWh ? `
                    <td style="display:flex; align-items:center; padding:0 1px; width:75px;">
                        <input type="text" id="${prefix}-wh-${rowIdx}" class="grid-wh grid-last-cell" style="flex:1; text-align:center;" value="${initialData?.wh || 'P003'}">
                        <button type="button" class="lookup-icon-btn" data-lookup-wh="${rowIdx}" title="挑選庫別">☖</button>
                    </td>` : ''}
                `;
            }

            if (!isGridEditable) {
                tr.querySelectorAll('input:not(.grid-amount):not(.erp-input-readonly)').forEach(inp => { inp.readOnly = true; });
                tr.querySelectorAll('button').forEach(btn => { btn.disabled = true; });
            }

            // Row amount calculation
            const qtyInp = tr.querySelector(`#${prefix}-qty-${rowIdx}`);
            const checkQtyInp = tr.querySelector(`#${prefix}-check-qty-${rowIdx}`);
            const billQtyInp = tr.querySelector(`#${prefix}-bill-qty-${rowIdx}`);
            const unitInp = tr.querySelector(`#${prefix}-unit-${rowIdx}`);
            const billUnitInp = tr.querySelector(`#${prefix}-bill-unit-${rowIdx}`);
            const priceInp = tr.querySelector(`#${prefix}-price-${rowIdx}`);
            const amtInp = tr.querySelector(`#${prefix}-amount-${rowIdx}`);
            const calcRow = () => {
                const bq = billQtyInp ? parseFloat(billQtyInp.value) : NaN;
                const q = (!isNaN(bq) && bq > 0) ? bq : (parseFloat(qtyInp?.value) || 0);
                const p = parseFloat(priceInp?.value) || 0;
                const amt = Math.round(q * p);
                amtInp.value = amt > 0 ? amt.toLocaleString() : '';
                if (typeof onCalculateTotals === 'function') onCalculateTotals();
            };
            if (qtyInp) {
                qtyInp.addEventListener('input', () => {
                    if (!isGridEditable) return;
                    // 驗收數量不要自動帶入，讓使用者自行輸入
                    if (billQtyInp && (!billQtyInp.value || billQtyInp.value === '0')) {
                        billQtyInp.value = qtyInp.value;
                    }
                    calcRow();
                });
            }
            if (checkQtyInp) {
                checkQtyInp.addEventListener('input', () => {
                    if (!isGridEditable) return;
                    calcRow();
                });
            }
            if (billQtyInp) {
                billQtyInp.addEventListener('input', () => {
                    if (!isGridEditable) return;
                    calcRow();
                });
            }
            if (priceInp) {
                priceInp.addEventListener('input', () => {
                    if (!isGridEditable) return;
                    calcRow();
                });
            }
            if (unitInp) {
                unitInp.addEventListener('input', () => {
                    if (!isGridEditable) return;
                    if (billUnitInp && !billUnitInp.value) {
                        billUnitInp.value = unitInp.value;
                    }
                });
                unitInp.addEventListener('dblclick', () => {
                    if (!isGridEditable) return;
                    Modules.openLookup('unit', (u) => {
                        unitInp.value = u.unit_no || u.code;
                        if (billUnitInp && !billUnitInp.value) billUnitInp.value = unitInp.value;
                        if (typeof onCalculateTotals === 'function') onCalculateTotals();
                    });
                });
            }
            if (billUnitInp) {
                billUnitInp.addEventListener('dblclick', () => {
                    if (!isGridEditable) return;
                    Modules.openLookup('unit', (u) => {
                        billUnitInp.value = u.unit_no || u.code;
                        if (typeof onCalculateTotals === 'function') onCalculateTotals();
                    });
                });
            }

            // Lookup item button
            const btnLookup = tr.querySelector(`button[data-lookup-row="${rowIdx}"]`);
            if (btnLookup) {
                btnLookup.addEventListener('click', () => {
                    if (!isGridEditable) return;
                    Modules.openLookup('item', (item) => {
                        tr.querySelector(`#${prefix}-item-no-${rowIdx}`).value = item.item_no || '';
                        tr.querySelector(`#${prefix}-item-name-${rowIdx}`).value = item.item_name || '';
                        tr.querySelector(`#${prefix}-item-spec-${rowIdx}`).value = item.item_spec || '';
                        const uInp = tr.querySelector(`#${prefix}-unit-${rowIdx}`);
                        if (uInp) uInp.value = item.unit || '';
                        const buInp = tr.querySelector(`#${prefix}-bill-unit-${rowIdx}`);
                        if (buInp) buInp.value = item.unit || '';
                        const whInp = tr.querySelector(`#${prefix}-wh-${rowIdx}`);
                        if (whInp) {
                            whInp.value = item.main_warehouse || 'W01';
                            const whNameInp = tr.querySelector(`#${prefix}-wh-name-${rowIdx}`);
                            if (whNameInp) whNameInp.value = whMap[whInp.value] || (whInp.value === 'W01' ? '主倉庫' : '成品倉一');
                        }
                        const pInp = tr.querySelector(`#${prefix}-price-${rowIdx}`);
                        if (!pInp.value) pInp.value = item.std_price || item.retail_price || 0;
                        const qInp = tr.querySelector(`#${prefix}-qty-${rowIdx}`);
                        if (!qInp.value) qInp.value = '1';
                        // 驗收數量不要自動帶入，讓使用者自行輸入
                        const bqInp = tr.querySelector(`#${prefix}-bill-qty-${rowIdx}`);
                        if (bqInp && (!bqInp.value || bqInp.value === '0')) bqInp.value = qInp.value;
                        const dInp = tr.querySelector(`#${prefix}-date-${rowIdx}`);
                        if (dInp && !dInp.value) dInp.value = Modules.getTodayStr();
                        calcRow();
                    });
                });
            }

            // Lookup warehouse button
            const btnWhLookup = tr.querySelector(`button[data-lookup-wh="${rowIdx}"]`);
            const whInput = tr.querySelector(`#${prefix}-wh-${rowIdx}`);
            const whNameInput = tr.querySelector(`#${prefix}-wh-name-${rowIdx}`);
            const openWhLookup = () => {
                if (!isGridEditable) return;
                Modules.openLookup('warehouse', (w) => {
                    if (whInput) whInput.value = w.wh_no;
                    if (whNameInput) whNameInput.value = w.wh_name || whMap[w.wh_no] || '';
                    if (typeof onCalculateTotals === 'function') onCalculateTotals();
                });
            };
            if (btnWhLookup) btnWhLookup.addEventListener('click', openWhLookup);
            if (whInput) {
                whInput.addEventListener('dblclick', openWhLookup);
                whInput.addEventListener('input', () => {
                    if (whNameInput) whNameInput.value = whMap[whInput.value.trim()] || '';
                });
            }

            // Double click or button click on date inputs -> open calendar picker
            tr.querySelectorAll('.grid-date, .grid-eff-date, .grid-exp-date').forEach(dateInp => {
                dateInp.addEventListener('dblclick', () => {
                    if (isGridEditable) Modules.openCalendar(dateInp);
                });
            });
            tr.querySelectorAll('.grid-date-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (!isGridEditable) return;
                    const targetId = btn.getAttribute('data-target');
                    const inp = tr.querySelector('#' + targetId);
                    if (inp) Modules.openCalendar(inp);
                });
            });

            // Tab on last cell -> generate next row
            if (isCopi08 && priceInp) {
                priceInp.addEventListener('keydown', (e) => {
                    if (!isGridEditable) return;
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

            const lastCell = tr.querySelector('.grid-last-cell');
            if (lastCell) {
                lastCell.addEventListener('keydown', (e) => {
                    if (!isGridEditable) return;
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

            // Indicator update on focus or click (移動檢視時隨時清楚識別當前列)
            const activateRow = () => {
                tbody.querySelectorAll('tr[data-row]').forEach(r => {
                    r.classList.remove('active-row');
                    const ind = r.querySelector('.row-indicator');
                    if (ind) ind.textContent = '';
                });
                tr.classList.add('active-row');
                const ind = tr.querySelector('.row-indicator');
                if (ind) ind.textContent = '▶';
            };
            tr.addEventListener('focusin', activateRow);
            tr.addEventListener('click', activateRow);

            // 鎖定看資料時：可自由滑動、移動游標瀏覽與選取複製，但嚴格禁止任何修改
            tr.addEventListener('keydown', (e) => {
                if (!isGridEditable) {
                    const navKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End', 'PageUp', 'PageDown', 'Escape'];
                    if (navKeys.includes(e.key) || ((e.ctrlKey || e.metaKey) && ['c', 'C', 'a', 'A'].includes(e.key))) {
                        return; // 允許移動光標、換列、跳格及複製
                    }
                    e.preventDefault(); // 阻擋所有文字輸入、刪除及修改按鍵
                }
            });
            tr.addEventListener('drop', (e) => {
                if (!isGridEditable) e.preventDefault();
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
            if (!isGridEditable) return;
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

        // Start with 0 rows (100% 空白模式) & locked
        tbody.innerHTML = '';
        setEditable(false);

        return {
            addRow: appendNewRow,
            setEditable,
            isEditable: () => isGridEditable,
            clearGrid: (addEmptyRow = false) => {
                tbody.innerHTML = '';
                if (addEmptyRow) {
                    appendNewRow();
                }
                setEditable(isGridEditable);
                if (typeof onCalculateTotals === 'function') onCalculateTotals();
            },
            fillGrid: (details) => {
                tbody.innerHTML = '';
                if (details && details.length > 0) {
                    details.forEach(d => {
                        appendNewRow({
                            biz_item: '',
                            item_no: d.item_no || '',
                            item_name: d.item_name || '',
                            item_spec: d.item_spec || '',
                            qty: d.qty || d.gr_qty || d.order_qty || d.quote_qty || d.req_qty || d.po_qty || d.receipt_qty || d.delivery_qty || '',
                            check_qty: (d.check_qty !== undefined && d.check_qty !== null && d.check_qty !== '') ? d.check_qty : '',
                            bill_qty: d.bill_qty !== undefined ? d.bill_qty : (d.gr_qty || d.qty || ''),
                            unit: d.unit || '',
                            bill_unit: d.bill_unit || d.unit || '',
                            price: d.price || d.unit_price || d.est_price || '',
                            amount: d.amount || d.quote_amount || d.est_amount || '',
                            date: d.date || d.est_delivery_date || d.delivery_date || d.require_date || d.receipt_date || '',
                            effective_date: d.effective_date !== undefined ? d.effective_date : '',
                            expiry_date: d.expiry_date !== undefined ? d.expiry_date : '',
                            wh: d.warehouse || d.wh || ''
                        });
                    });
                }
                setEditable(isGridEditable);
                if (typeof onCalculateTotals === 'function') onCalculateTotals();
            },
            getRowsData: () => {
                const rows = tbody.querySelectorAll('tr[data-row]');
                const list = [];
                const isCopi05 = (prefix === 'copi05');
            const isCopi08 = (prefix === 'copi08');
                rows.forEach((r, idx) => {
                    const rowIdx = r.getAttribute('data-row');
                    const itemNo = winEl.querySelector(`#${prefix}-item-no-${rowIdx}`)?.value.trim() || '';
                    const qty = parseFloat(winEl.querySelector(`#${prefix}-qty-${rowIdx}`)?.value) || 0;
                    if (itemNo && qty > 0) {
                        const checkQtyEl = winEl.querySelector(`#${prefix}-check-qty-${rowIdx}`);
                        const checkQty = (checkQtyEl && checkQtyEl.value.trim() !== '') ? (parseFloat(checkQtyEl.value) || 0) : null;
                        const billQtyEl = winEl.querySelector(`#${prefix}-bill-qty-${rowIdx}`);
                        const billQty = billQtyEl ? (parseFloat(billQtyEl.value) || qty) : qty;
                        const billUnitEl = winEl.querySelector(`#${prefix}-bill-unit-${rowIdx}`);
                        const billUnit = billUnitEl ? billUnitEl.value.trim() : (winEl.querySelector(`#${prefix}-unit-${rowIdx}`)?.value.trim() || '');

                        const rowData = {
                            line_no: String(idx + 1).padStart(4, '0'),
                            item_no: itemNo,
                            item_name: winEl.querySelector(`#${prefix}-item-name-${rowIdx}`)?.value.trim() || '',
                            item_spec: winEl.querySelector(`#${prefix}-item-spec-${rowIdx}`)?.value.trim() || '',
                            qty: qty,
                            gr_qty: qty,
                            check_qty: checkQty,
                            bill_qty: billQty,
                            unit: winEl.querySelector(`#${prefix}-unit-${rowIdx}`)?.value.trim() || '',
                            bill_unit: billUnit,
                            price: parseFloat(winEl.querySelector(`#${prefix}-price-${rowIdx}`)?.value) || 0,
                            amount: parseFloat((winEl.querySelector(`#${prefix}-amount-${rowIdx}`)?.value || '').replace(/,/g, '')) || 0,
                            date: winEl.querySelector(`#${prefix}-date-${rowIdx}`)?.value.trim() || Modules.getTodayStr(),
                            biz_item_no: winEl.querySelector(`#${prefix}-biz-item-${rowIdx}`)?.value.trim() || '',
                            delivery_qty: qty,
                            unit_price: parseFloat(winEl.querySelector(`#${prefix}-price-${rowIdx}`)?.value) || 0,
                            wh: winEl.querySelector(`#${prefix}-wh-${rowIdx}`)?.value.trim() || '',
                            wh_name: winEl.querySelector(`#${prefix}-wh-name-${rowIdx}`)?.value.trim() || '',
                            warehouse: winEl.querySelector(`#${prefix}-wh-${rowIdx}`)?.value.trim() || ''
                        };
                        if (isCopi05) {
                            rowData.effective_date = winEl.querySelector(`#${prefix}-eff-date-${rowIdx}`)?.value.trim() || '';
                            rowData.expiry_date = winEl.querySelector(`#${prefix}-exp-date-${rowIdx}`)?.value.trim() || '';
                        }
                        list.push(rowData);
                    }
                });
                return list;
            }
        };
    },

    setFormReadOnly(winEl, readOnly = true) {
        if (!winEl) return;
        if (readOnly) {
            winEl.classList.add('erp-form-readonly');
        } else {
            winEl.classList.remove('erp-form-readonly');
        }
        const targetSelectors = [
            '.erp-window-body',
            '.erp-header-panel',
            '.erp-tab-content',
            '#copi05-view-detail',
            '#copi06-view-detail',
            '#copi08-view-detail',
            '#puri05-view-detail',
            '#puri06-view-detail',
            '#puri07-view-detail',
            '#puri09-view-detail',
            '#invi02-view-detail',
            '#copi01-view-detail',
            '#puri01-view-detail'
        ];
        winEl.querySelectorAll(targetSelectors.join(', ')).forEach(el => {
            if (readOnly) {
                el.classList.add('erp-form-readonly');
            } else {
                el.classList.remove('erp-form-readonly');
            }
        });

        // 鎖定所有表單輸入元件（排除工具列及搜尋/過濾輸入框）
        winEl.querySelectorAll('input').forEach(inp => {
            if (inp.id && (inp.id.includes('search') || inp.id.includes('filter') || inp.id.includes('find'))) return;
            if (inp.closest('.erp-toolbar') || inp.closest('.erp-browse-filter') || inp.closest('.erp-lookup-window')) return;

            if (inp.type === 'checkbox' || inp.type === 'radio') {
                inp.disabled = !!readOnly;
            } else {
                if (!inp.classList.contains('erp-input-readonly')) {
                    inp.readOnly = !!readOnly;
                }
            }
        });

        // 鎖定所有下拉選單
        winEl.querySelectorAll('select').forEach(sel => {
            if (sel.closest('.erp-toolbar') || sel.closest('.erp-browse-filter') || sel.closest('.erp-lookup-window')) return;
            sel.disabled = !!readOnly;
        });

        // 鎖定所有開窗按鈕與日曆挑選圖標按鈕
        winEl.querySelectorAll('button.lookup-icon-btn, button.grid-date-btn').forEach(btn => {
            if (btn.closest('.erp-toolbar') || btn.closest('.erp-lookup-window')) return;
            btn.disabled = !!readOnly;
        });
    },

    setFormMode(winEl, grid, mode, statusMsgEl = null, currentDocNo = '') {
        const isEditable = (mode === 'add' || mode === 'edit');
        if (grid && typeof grid.setEditable === 'function') {
            grid.setEditable(isEditable);
        }
        Modules.setFormReadOnly(winEl, !isEditable);
        if (statusMsgEl) {
            if (mode === 'add') {
                statusMsgEl.textContent = '新增中...';
            } else if (mode === 'edit') {
                statusMsgEl.textContent = currentDocNo ? `修改中... [${currentDocNo}]` : '修改中...';
            } else {
                statusMsgEl.textContent = currentDocNo ? `瀏覽: [${currentDocNo}]` : '瀏覽 (請點選「新增」或「查詢」)';
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

    updateAuditButtons(winEl, isConfirmed, prefix) {
        const btnConfirm = winEl.querySelector(`#${prefix}-tb-confirm`);
        const btnUnconfirm = winEl.querySelector(`#${prefix}-tb-unconfirm`);
        if (!btnConfirm || !btnUnconfirm) return;

        if (isConfirmed) {
            // 已確認：左邊確認按鈕變灰色停用，右邊取消確認按鈕變亮黃色啟用
            btnConfirm.innerHTML = `<img src="assets/icons/confirm_disabled.png" style="width:18px;height:18px;vertical-align:middle;display:block;">`;
            btnConfirm.disabled = true;
            btnConfirm.style.cursor = 'not-allowed';
            btnConfirm.style.opacity = '0.5';
            btnConfirm.title = '確認 (已確認)';

            btnUnconfirm.innerHTML = `<img src="assets/icons/unconfirm_active.png" style="width:18px;height:18px;vertical-align:middle;display:block;">`;
            btnUnconfirm.disabled = false;
            btnUnconfirm.style.cursor = 'pointer';
            btnUnconfirm.style.opacity = '1';
            btnUnconfirm.title = '取消確認';
        } else {
            // 未確認：左邊確認按鈕為亮黃色啟用，右邊取消確認按鈕為灰色停用
            btnConfirm.innerHTML = `<img src="assets/icons/confirm_active.png" style="width:18px;height:18px;vertical-align:middle;display:block;">`;
            btnConfirm.disabled = false;
            btnConfirm.style.cursor = 'pointer';
            btnConfirm.style.opacity = '1';
            btnConfirm.title = '確認';

            btnUnconfirm.innerHTML = `<img src="assets/icons/unconfirm_disabled.png" style="width:18px;height:18px;vertical-align:middle;display:block;">`;
            btnUnconfirm.disabled = true;
            btnUnconfirm.style.cursor = 'not-allowed';
            btnUnconfirm.style.opacity = '0.5';
            btnUnconfirm.title = '取消確認 (尚未確認)';
        }

        // 同步圖章
        this.setDocStamp(winEl, isConfirmed ? '已確認' : '未確認');
    },

    // ========================================================
    // 1:1 CALENDAR DATE PICKER (月曆挑選器)
    // ========================================================
    openCalendar(targetInput, onSelect = null) {
        if (!targetInput) return;

        // Close any existing open calendar first (toggle if clicked on same target)
        const existing = document.querySelector('.erp-calendar-popup');
        if (existing) {
            const prevTarget = existing._targetInput;
            existing.remove();
            if (prevTarget === targetInput) return;
        }

        // Parse targetInput's current date or default to today
        let curYear, curMonth, curDay;
        const curVal = targetInput.value ? targetInput.value.trim().replace(/-/g, '/') : '';
        const parts = curVal.split('/');
        const pY = parseInt(parts[0], 10);
        const pM = parseInt(parts[1], 10);
        const pD = parseInt(parts[2], 10);
        if (parts.length === 3 && !isNaN(pY) && !isNaN(pM) && !isNaN(pD) && pY > 1900 && pM >= 1 && pM <= 12 && pD >= 1 && pD <= 31) {
            curYear = pY;
            curMonth = pM - 1; // 0-based
            curDay = pD;
        } else {
            const today = new Date();
            curYear = today.getFullYear();
            curMonth = today.getMonth();
            curDay = today.getDate();
        }

        let viewYear = curYear;
        let viewMonth = curMonth;

        const popup = document.createElement('div');
        popup.className = 'erp-calendar-popup';
        popup._targetInput = targetInput;

        const renderCalendar = () => {
            const today = new Date();
            const todayY = today.getFullYear();
            const todayM = today.getMonth();
            const todayD = today.getDate();

            // First day of current view month
            const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
            // Days in current view month
            const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
            // Days in previous month
            const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

            // Generate Year options
            let yearOptions = '';
            for (let y = viewYear - 15; y <= viewYear + 15; y++) {
                yearOptions += `<option value="${y}" ${y === viewYear ? 'selected' : ''}>${y}</option>`;
            }

            // Generate Month options
            let monthOptions = '';
            for (let m = 0; m < 12; m++) {
                monthOptions += `<option value="${m}" ${m === viewMonth ? 'selected' : ''}>${String(m + 1).padStart(2, '0')}</option>`;
            }

            let daysHtml = '';
            // Prev month overflow days
            for (let i = firstDay - 1; i >= 0; i--) {
                const d = daysInPrevMonth - i;
                const dayOfWeek = (firstDay - 1 - i) % 7;
                const isSun = (dayOfWeek === 0);
                daysHtml += `<div class="erp-cal-day other-month ${isSun ? 'cal-sun' : ''}" data-nav="prev" data-day="${d}">${d}</div>`;
            }
            // Current month days
            for (let d = 1; d <= daysInMonth; d++) {
                const isToday = (viewYear === todayY && viewMonth === todayM && d === todayD);
                const isSelected = (curVal && viewYear === curYear && viewMonth === curMonth && d === curDay);
                const dayOfWeek = (firstDay + d - 1) % 7;
                const isSun = (dayOfWeek === 0);
                let cls = 'erp-cal-day';
                if (isSun) cls += ' cal-sun';
                if (isToday) cls += ' is-today';
                if (isSelected) cls += ' is-selected';
                daysHtml += `<div class="${cls}" data-day="${d}">${d}</div>`;
            }
            // Next month overflow days to fill full grid
            const totalCells = firstDay + daysInMonth;
            const remaining = (totalCells <= 35) ? 35 - totalCells : 42 - totalCells;
            for (let d = 1; d <= remaining; d++) {
                const dayOfWeek = (totalCells + d - 1) % 7;
                const isSun = (dayOfWeek === 0);
                daysHtml += `<div class="erp-cal-day other-month ${isSun ? 'cal-sun' : ''}" data-nav="next" data-day="${d}">${d}</div>`;
            }

            popup.innerHTML = `
                <div class="erp-cal-titlebar">
                    <span>日期快手</span>
                    <button type="button" class="erp-cal-close-btn" data-act="close" title="關閉">✕</button>
                </div>
                <div class="erp-cal-header">
                    <button type="button" class="cal-nav-btn" data-act="prev-year" title="上一年">◀◀</button>
                    <button type="button" class="cal-nav-btn" data-act="prev-month" title="上個月">◀</button>
                    <div class="cal-title-container">
                        <select class="cal-year-select">${yearOptions}</select>
                        <span style="font-weight:bold; font-size:11px;">年</span>
                        <select class="cal-month-select">${monthOptions}</select>
                        <span style="font-weight:bold; font-size:11px;">月</span>
                    </div>
                    <button type="button" class="cal-nav-btn" data-act="next-month" title="下個月">▶</button>
                    <button type="button" class="cal-nav-btn" data-act="next-year" title="下一年">▶▶</button>
                </div>
                <div class="erp-cal-weekdays">
                    <span class="cal-sun">週日</span>
                    <span>週一</span>
                    <span>週二</span>
                    <span>週三</span>
                    <span>週四</span>
                    <span>週五</span>
                    <span class="cal-sat">週六</span>
                </div>
                <div class="erp-cal-days">
                    ${daysHtml}
                </div>
                <div class="erp-cal-footer">
                    <button type="button" class="cal-btn-action" data-act="today">今天</button>
                    <button type="button" class="cal-btn-action" data-act="clear">清除</button>
                    <button type="button" class="cal-btn-action" data-act="close">關閉</button>
                </div>
            `;

            // Bind change on selects
            popup.querySelector('.cal-year-select').addEventListener('change', (e) => {
                viewYear = parseInt(e.target.value, 10);
                renderCalendar();
            });
            popup.querySelector('.cal-month-select').addEventListener('change', (e) => {
                viewMonth = parseInt(e.target.value, 10);
                renderCalendar();
            });

            // Nav buttons
            popup.querySelector('[data-act="prev-year"]').addEventListener('click', (e) => {
                e.stopPropagation();
                viewYear--;
                renderCalendar();
            });
            popup.querySelector('[data-act="next-year"]').addEventListener('click', (e) => {
                e.stopPropagation();
                viewYear++;
                renderCalendar();
            });
            popup.querySelector('[data-act="prev-month"]').addEventListener('click', (e) => {
                e.stopPropagation();
                viewMonth--;
                if (viewMonth < 0) { viewMonth = 11; viewYear--; }
                renderCalendar();
            });
            popup.querySelector('[data-act="next-month"]').addEventListener('click', (e) => {
                e.stopPropagation();
                viewMonth++;
                if (viewMonth > 11) { viewMonth = 0; viewYear++; }
                renderCalendar();
            });

            // Day click
            popup.querySelectorAll('.erp-cal-day').forEach(cell => {
                cell.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const d = parseInt(cell.getAttribute('data-day'), 10);
                    const nav = cell.getAttribute('data-nav');
                    let selY = viewYear;
                    let selM = viewMonth;
                    if (nav === 'prev') {
                        selM--;
                        if (selM < 0) { selM = 11; selY--; }
                    } else if (nav === 'next') {
                        selM++;
                        if (selM > 11) { selM = 0; selY++; }
                    }
                    const fmtDate = `${selY}/${String(selM + 1).padStart(2, '0')}/${String(d).padStart(2, '0')}`;
                    selectDate(fmtDate);
                });
            });

            // Action buttons
            popup.querySelector('[data-act="today"]').addEventListener('click', (e) => {
                e.stopPropagation();
                const now = new Date();
                const fmtDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
                selectDate(fmtDate);
            });
            popup.querySelector('[data-act="clear"]').addEventListener('click', (e) => {
                e.stopPropagation();
                selectDate('');
            });
            popup.querySelector('[data-act="close"]').addEventListener('click', (e) => {
                e.stopPropagation();
                closePopup();
            });
        };

        const selectDate = (dateStr) => {
            targetInput.value = dateStr;
            targetInput.dispatchEvent(new Event('input', { bubbles: true }));
            targetInput.dispatchEvent(new Event('change', { bubbles: true }));
            if (typeof onSelect === 'function') onSelect(dateStr);
            closePopup();
        };

        const closePopup = () => {
            document.removeEventListener('click', outsideClick);
            document.removeEventListener('keydown', onKeyDown);
            popup.remove();
        };

        const outsideClick = (e) => {
            if (!popup.contains(e.target) && e.target !== targetInput) {
                closePopup();
            }
        };

        const onKeyDown = (e) => {
            if (e.key === 'Escape') closePopup();
        };

        // Render and append
        renderCalendar();
        document.body.appendChild(popup);

        // Position popup relative to targetInput
        const rect = targetInput.getBoundingClientRect();
        let top = rect.bottom + window.scrollY + 2;
        let left = rect.left + window.scrollX;

        const calH = popup.offsetHeight || 230;
        const calW = popup.offsetWidth || 236;
        if (top + calH > window.innerHeight + window.scrollY && rect.top - calH > 0) {
            top = rect.top + window.scrollY - calH - 2;
        }
        if (left + calW > window.innerWidth + window.scrollX) {
            left = rect.right + window.scrollX - calW;
        }

        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;

        // Listen for outside click
        setTimeout(() => {
            document.addEventListener('click', outsideClick);
            document.addEventListener('keydown', onKeyDown);
        }, 50);
    }
});
Modules.openDatePicker = Modules.openCalendar;
