// ========================================================
// Conductor ERP Modules: Purchase & Procurement (請購、採購、進貨、追蹤)
// ========================================================

window.Modules = window.Modules || {};

Object.assign(window.Modules, {
    // ========================================================
    // 7. 訂單轉請購單複製作業 (COPB10) - 1:1 參考截圖8 (media_1793938483801_83444ba3.png)
    // ========================================================
    openCOPB10(defaultOrderNo = '') {
        const u = App.currentUser?.company || ('學生區' + (App.currentUser?.username || ''));
        const title = `訂單轉請購單複製作業(COPB10)[${u}]`;
        const winId = 'COPB10';
        const todayDate = '2026/11/05';

        const html = `
            <!-- Tabs (基本選項 / 進階選項 / 系統選項) -->
            <div class="erp-tab-header" style="height:26px; border-bottom:1px solid #7F9DB9; display:flex; align-items:flex-end;">
                <button class="erp-tab-btn active" style="font-weight:bold; background:#185286; color:#FFF; padding:3px 14px; border:none; border-radius:3px 3px 0 0; cursor:pointer;">基本選項</button>
                <button class="erp-tab-btn" style="background:#ECE9D8; color:#000; padding:3px 14px; border:none; border-radius:3px 3px 0 0; cursor:pointer; margin-left:2px;">進階選項</button>
                <button class="erp-tab-btn" style="background:#ECE9D8; color:#000; padding:3px 14px; border:none; border-radius:3px 3px 0 0; cursor:pointer; margin-left:2px;">系統選項</button>
            </div>

            <div style="display:flex; flex:1; background:#ECE9D8; padding:10px 14px; gap:16px; font-size:12px; font-family:Tahoma, 'Microsoft JhengHei', sans-serif;">
                <!-- Left Panel -->
                <div style="display:flex; flex-direction:column; gap:8px; width:220px;">
                    <!-- 選擇廠別 -->
                    <div style="display:flex; align-items:center;">
                        <label style="margin-right:6px; color:#000; white-space:nowrap;">選擇廠別</label>
                        <input type="text" id="copb10-factory" class="erp-input-yellow" style="width:105px; height:20px; font-size:12px;" value="">
                        <button type="button" class="lookup-icon-btn" id="copb10-lookup-factory" style="margin-left:4px; width:22px; height:20px; font-size:11px;" title="挑選廠別">🗄️</button>
                    </div>

                    <!-- GroupBox: 選擇訂單單號 -->
                    <fieldset style="border:1px solid #7F9DB9; padding:6px; border-radius:2px; margin:0;">
                        <legend style="padding:0 4px; color:#000;">選擇訂單單號</legend>
                        <div style="display:flex; gap:6px;">
                            <div style="flex:1; background:#FFF; border:1px solid #7F9DB9; height:85px; padding:2px; font-size:11px; overflow-y:auto;" id="copb10-order-box">
                            </div>
                            <div style="display:flex; flex-direction:column; gap:3px;">
                                <button type="button" class="lookup-icon-btn" id="copb10-add-order" title="新增/挑選訂單單號" style="width:20px; height:20px;">📑</button>
                                <button type="button" class="lookup-icon-btn" id="copb10-cut-order" title="剪下" style="width:20px; height:20px;">✂</button>
                                <button type="button" class="lookup-icon-btn" id="copb10-del-order" title="刪除選取訂單" style="width:20px; height:20px;">🗑</button>
                            </div>
                        </div>
                    </fieldset>

                    <!-- GroupBox: 選擇客戶代號 -->
                    <fieldset style="border:1px solid #7F9DB9; padding:6px; border-radius:2px; margin:0;">
                        <legend style="padding:0 4px; color:#000;">選擇客戶代號</legend>
                        <div style="display:flex; align-items:center; margin-bottom:5px;">
                            <label style="display:inline-flex; align-items:center; gap:4px; cursor:pointer;">
                                <input type="checkbox" id="copb10-chk-cust" checked> 區間選擇
                            </label>
                        </div>
                        <div style="display:flex; align-items:center; margin-bottom:4px;">
                            <label style="width:20px; margin-right:4px;">起</label>
                            <input type="text" id="copb10-cust-start" style="width:130px; height:20px; background:#FFF; border:1px solid #7F9DB9;" value="">
                            <button type="button" class="lookup-icon-btn" id="copb10-lookup-cust-start" style="margin-left:4px; width:22px; height:20px;" title="挑選客戶">🎁</button>
                        </div>
                        <div style="display:flex; align-items:center;">
                            <label style="width:20px; margin-right:4px;">迄</label>
                            <input type="text" id="copb10-cust-end" style="width:130px; height:20px; background:#FFF; border:1px solid #7F9DB9;" value="">
                            <button type="button" class="lookup-icon-btn" id="copb10-lookup-cust-end" style="margin-left:4px; width:22px; height:20px;" title="挑選客戶">🎁</button>
                        </div>
                    </fieldset>

                    <!-- GroupBox: 選擇訂單日期 -->
                    <fieldset style="border:1px solid #7F9DB9; padding:6px; border-radius:2px; margin:0;">
                        <legend style="padding:0 4px; color:#000;">選擇訂單日期</legend>
                        <div style="display:flex; align-items:center; margin-bottom:4px;">
                            <label style="width:20px; margin-right:4px;">起</label>
                            <input type="text" id="copb10-date-start" style="width:130px; height:20px; background:#FFF; border:1px solid #7F9DB9;" value="">
                            <button type="button" class="lookup-icon-btn" id="copb10-cal-date-start" style="margin-left:4px; width:22px; height:20px; font-weight:bold; font-size:10px;" title="選擇日期">31</button>
                        </div>
                        <div style="display:flex; align-items:center;">
                            <label style="width:20px; margin-right:4px;">迄</label>
                            <input type="text" id="copb10-date-end" style="width:130px; height:20px; background:#FFF; border:1px solid #7F9DB9;" value="">
                            <button type="button" class="lookup-icon-btn" id="copb10-cal-date-end" style="margin-left:4px; width:22px; height:20px; font-weight:bold; font-size:10px;" title="選擇日期">31</button>
                        </div>
                    </fieldset>
                </div>

                <!-- Middle Panel -->
                <div style="display:flex; flex-direction:column; gap:8px; width:235px;">
                    <!-- 輸入請購單別 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:85px; color:#000; white-space:nowrap;">輸入請購單別</label>
                        <input type="text" id="copb10-req-type" class="erp-input-yellow" style="width:65px; height:20px;" value="">
                        <button type="button" class="lookup-icon-btn" id="copb10-lookup-reqtype" style="margin-left:4px; width:22px; height:20px;" title="挑選請購單別">📑</button>
                    </div>

                    <!-- 輸入請購日期 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:85px; color:#000; white-space:nowrap;">輸入請購日期</label>
                        <input type="text" id="copb10-req-date" class="erp-input-yellow" style="width:105px; height:20px;" value="">
                        <button type="button" class="lookup-icon-btn" id="copb10-cal-req-date" style="margin-left:4px; width:22px; height:20px; font-weight:bold; font-size:10px;" title="選擇日期">31</button>
                    </div>

                    <!-- 廠商選擇框 (fieldset) -->
                    <fieldset style="border:1px solid #7F9DB9; padding:6px 8px; border-radius:2px; margin:0;">
                        <div style="display:flex; align-items:center; margin-bottom:6px;">
                            <label style="width:75px; color:#000; white-space:nowrap;">選擇廠商</label>
                            <select id="copb10-vendor-mode" style="width:135px; height:22px; font-size:12px;">
                                <option value="品號之主供應商" selected>品號之主供應商</option>
                                <option value="指定廠商">指定廠商</option>
                                <option value="來源訂單指定">來源訂單指定</option>
                            </select>
                        </div>
                        <div style="display:flex; align-items:center;">
                            <label style="width:75px; color:#000; white-space:nowrap;">輸入廠商代號</label>
                            <input type="text" id="copb10-vendor-code" style="width:110px; height:20px; background:#FFF; border:1px solid #7F9DB9;">
                            <button type="button" class="lookup-icon-btn" id="copb10-lookup-vendor" style="margin-left:4px; width:22px; height:20px;" title="挑選供應廠商">👤</button>
                        </div>
                    </fieldset>

                    <!-- GroupBox: 選擇需求日計算方式 -->
                    <fieldset style="border:1px solid #7F9DB9; padding:6px 8px; border-radius:2px; margin:0;">
                        <legend style="padding:0 4px; color:#000;">選擇需求日計算方式</legend>
                        <div style="display:flex; align-items:center; margin-bottom:6px;">
                            <label style="display:inline-flex; align-items:center; gap:4px; cursor:pointer;">
                                <input type="radio" name="copb10-calc-mode" id="copb10-calc-sub" value="sub" checked> 依訂單預交日減
                            </label>
                            <input type="text" id="copb10-sub-days" style="width:32px; height:18px; margin:0 4px; text-align:center; background:#FFF; border:1px solid #7F9DB9;" value="1"> 天
                        </div>
                        <div style="display:flex; align-items:center;">
                            <label style="display:inline-flex; align-items:center; gap:4px; cursor:pointer;">
                                <input type="radio" name="copb10-calc-mode" id="copb10-calc-lead" value="lead"> 依前置天數推算
                            </label>
                        </div>
                    </fieldset>

                    <!-- 輸入請購人員 (不預設，讓使用者選擇) -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:85px; color:#000; white-space:nowrap;">輸入請購人員</label>
                        <input type="text" id="copb10-req-user" class="erp-input-yellow" style="width:115px; height:20px;" value="">
                        <button type="button" class="lookup-icon-btn" id="copb10-lookup-user" style="margin-left:4px; width:22px; height:20px; font-size:12px;" title="挑選請購人員">👤</button>
                    </div>
                </div>

                <!-- Right Side (Dialog Buttons - 1:1 參考截圖8) -->
                <div style="display:flex; flex-direction:column; gap:8px; width:100px; margin-left:auto;">
                    <button type="button" id="copb10-btn-confirm" style="height:26px; display:flex; align-items:center; justify-content:center; gap:6px; background:#ECE9D8; border:1px solid #7F9DB9; border-radius:2px; cursor:pointer; font-size:12px; font-weight:bold;">
                        <span style="color:#008000; font-size:14px;">✔</span> 確認
                    </button>
                    <button type="button" id="copb10-btn-cancel" onclick="App.closeWindow('${winId}')" style="height:26px; display:flex; align-items:center; justify-content:center; gap:6px; background:#ECE9D8; border:1px solid #7F9DB9; border-radius:2px; cursor:pointer; font-size:12px; font-weight:bold;">
                        <span style="color:#CC0000; font-size:14px;">✖</span> 取消
                    </button>
                    <button type="button" id="copb10-btn-period" onclick="Modules.toast('已設定為週期性自動排程作業', 'info')" style="height:26px; display:flex; align-items:center; justify-content:center; gap:6px; background:#ECE9D8; border:1px solid #7F9DB9; border-radius:2px; cursor:pointer; font-size:12px;">
                        <span style="color:#000099; font-size:14px;">🔄</span> 週期性
                    </button>
                    <button type="button" id="copb10-btn-custom" onclick="Modules.toast('開啟自訂篩選條件', 'info')" style="height:26px; display:flex; align-items:center; justify-content:center; gap:6px; background:#ECE9D8; border:1px solid #7F9DB9; border-radius:2px; cursor:pointer; font-size:12px;">
                        <span style="color:#000099; font-size:12px;">▶</span> 自訂
                    </button>
                </div>
            </div>
        `;

        App.openWindow(winId, title, html, 640, 410, (winEl) => {
            const fFactory = winEl.querySelector('#copb10-factory');
            const fReqType = winEl.querySelector('#copb10-req-type');
            const fReqDate = winEl.querySelector('#copb10-req-date');
            const fVendorMode = winEl.querySelector('#copb10-vendor-mode');
            const fVendorCode = winEl.querySelector('#copb10-vendor-code');
            const fSubDays = winEl.querySelector('#copb10-sub-days');
            const fReqUser = winEl.querySelector('#copb10-req-user');
            const fCustStart = winEl.querySelector('#copb10-cust-start');
            const fCustEnd = winEl.querySelector('#copb10-cust-end');
            const fDateStart = winEl.querySelector('#copb10-date-start');
            const fDateEnd = winEl.querySelector('#copb10-date-end');

            let orderList = [];
            let selectedOrderIdx = -1;

            if (defaultOrderNo) {
                orderList.push(defaultOrderNo);
                selectedOrderIdx = 0;
            }

            const renderOrderBox = () => {
                const box = winEl.querySelector('#copb10-order-box');
                if (orderList.length === 0) {
                    box.innerHTML = '<div style="color:#888; padding:4px;">(尚未挑選訂單，可按 📑 新增或直接按確認自動選取)</div>';
                    return;
                }
                box.innerHTML = orderList.map((no, idx) => `
                    <div class="copb10-order-item" data-idx="${idx}" style="padding:2px 4px; cursor:pointer; ${idx === selectedOrderIdx ? 'background:#0A246A; color:#FFF;' : ''}">
                        ${no}
                    </div>
                `).join('');

                box.querySelectorAll('.copb10-order-item').forEach(el => {
                    el.addEventListener('click', () => {
                        selectedOrderIdx = parseInt(el.getAttribute('data-idx'));
                        renderOrderBox();
                    });
                });
            };

            renderOrderBox();

            // Lookups & Actions
            winEl.querySelector('#copb10-lookup-factory').addEventListener('click', () => {
                Modules.openLookup('factory', (f) => {
                    fFactory.value = f.factory_no || f.code;
                });
            });

            winEl.querySelector('#copb10-add-order').addEventListener('click', () => {
                Modules.openLookup('order', (o) => {
                    if (o && o.order_no && !orderList.includes(o.order_no)) {
                        orderList.push(o.order_no);
                        selectedOrderIdx = orderList.length - 1;
                        renderOrderBox();
                    }
                });
            });

            const delSelectedOrder = () => {
                if (selectedOrderIdx >= 0 && selectedOrderIdx < orderList.length) {
                    orderList.splice(selectedOrderIdx, 1);
                    selectedOrderIdx = Math.max(0, orderList.length - 1);
                    renderOrderBox();
                }
            };
            winEl.querySelector('#copb10-cut-order').addEventListener('click', delSelectedOrder);
            winEl.querySelector('#copb10-del-order').addEventListener('click', delSelectedOrder);

            winEl.querySelector('#copb10-lookup-cust-start').addEventListener('click', () => {
                Modules.openLookup('customer', (c) => { fCustStart.value = c.code; });
            });
            winEl.querySelector('#copb10-lookup-cust-end').addEventListener('click', () => {
                Modules.openLookup('customer', (c) => { fCustEnd.value = c.code; });
            });

            winEl.querySelector('#copb10-cal-date-start').addEventListener('click', () => {
                fDateStart.value = todayDate;
            });
            winEl.querySelector('#copb10-cal-date-end').addEventListener('click', () => {
                fDateEnd.value = todayDate;
            });
            winEl.querySelector('#copb10-cal-req-date').addEventListener('click', () => {
                fReqDate.value = todayDate;
            });

            winEl.querySelector('#copb10-lookup-reqtype').addEventListener('click', () => {
                Modules.openLookup('doc_type_req', (t) => { fReqType.value = t.code; });
            });

            winEl.querySelector('#copb10-lookup-vendor').addEventListener('click', () => {
                Modules.openLookup('supplier', (s) => { fVendorCode.value = s.code; });
            });

            winEl.querySelector('#copb10-lookup-user').addEventListener('click', () => {
                Modules.openLookup('personnel', (u) => { fReqUser.value = u.emp_no || u.code || ''; });
            });

            // Confirm Action (透過佇列工作台建立請購單並跳轉 PURI05)
            winEl.querySelector('#copb10-btn-confirm').addEventListener('click', async () => {
                let targetOrderNo = '';
                if (orderList.length > 0) {
                    targetOrderNo = orderList[selectedOrderIdx >= 0 ? selectedOrderIdx : 0];
                }

                const factory = fFactory.value.trim();
                if (!factory) {
                    alert('【必填檢查】請選擇廠別 (例如 TP01 或 TY01)！');
                    fFactory.focus();
                    return;
                }
                const reqType = fReqType.value.trim();
                if (!reqType) {
                    alert('【必填檢查】請輸入或挑選請購單別！');
                    fReqType.focus();
                    return;
                }
                const reqDate = fReqDate.value.trim() || todayDate;
                const reqUser = fReqUser.value.trim();
                if (!reqUser) {
                    alert('【必填檢查】請挑選或輸入請購人員！');
                    fReqUser.focus();
                    return;
                }
                const supplierMode = fVendorMode.value;
                const isSub = winEl.querySelector('#copb10-calc-sub').checked;
                const calcMode = isSub ? '依訂單預交日減' : '依前置天數推算';
                const leadDays = parseInt(fSubDays.value) || 1;

                const res = await ERP_API.post('batch_order_to_req', {
                    factory,
                    order_no: targetOrderNo,
                    req_type: reqType,
                    req_date: reqDate,
                    req_user: reqUser,
                    supplier_mode: supplierMode,
                    calc_mode: calcMode,
                    lead_days: leadDays
                });

                if (res.success) {
                    Modules.toast(`批次作業已送交佇列工作台處理完成！已產生請購單【${res.req_no}】`, 'success', 2200);
                    App.closeWindow(winId);
                    // 自動開啟請購單建立作業 (PURI05) 並自動帶入該單據，供使用者審核確認
                    Modules.open('PURI05', res.req_no);
                } else {
                    Modules.toast('執行失敗: ' + (res.error || '不明錯誤'), 'error');
                }
            });
        });
    },

    // ========================================================
    // 8. 請購單建立作業 (PURI05) - 1:1
    // ========================================================
    openPURI05(targetReqNo = '') {
        const u = App.currentUser?.company || '學生區';
        const title = `請購單建立作業(PURI05)[${u}]`;
        const winId = 'PURI05';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">資料(<u>D</u>)</span>
                <span class="erp-menu-item" id="puri05-menu-func" title="功能選單：複製單據">功能(<u>F</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="新增空白請購單" id="puri05-tb-new">📄</button>
                <button class="erp-tb-btn" title="查詢" id="puri05-tb-query">🔍</button>
                <button class="erp-tb-btn" title="修改" id="puri05-tb-edit">✏️</button>
                <button class="erp-tb-btn" title="刪除" id="puri05-tb-del">🗑️</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('請購單報表產生中...')">🖨️</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="首筆" id="puri05-tb-first">|◀</button>
                <button class="erp-tb-btn" title="上筆" id="puri05-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下筆" id="puri05-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="puri05-tb-last">▶|</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="儲存" id="puri05-tb-save" style="color:#008000; font-weight:bold; font-size:15px;">✔</button>
                <button class="erp-tb-btn tb-btn-cancel" title="取消 (清除放棄未儲存變更)" id="puri05-tb-cancel" style="color:#CC0000; font-weight:bold; font-size:15px;">✖</button>
                <button class="erp-tb-btn" title="確認" id="puri05-tb-confirm">
                    <img src="assets/icons/confirm_active.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
                <button class="erp-tb-btn" title="取消確認" id="puri05-tb-unconfirm">
                    <img src="assets/icons/unconfirm_disabled.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
                <button class="erp-tb-btn btn-transfer" title="轉採購單 (PURI07)" onclick="Modules.open('PURI07')">🛒</button>
            </div>

            <!-- Top Tab Header -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="puri05-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="puri05-tab-browse">資料瀏覽</button>
            </div>

            <!-- Detail View -->
            <!-- Detail View (1:1 參考圖9 - media_1793970585663_8da9bfad.png / 擷取9.PNG) -->
            <div id="puri05-view-detail" style="display:flex; flex-direction:column; flex:1;">
                <div class="erp-header-panel" style="padding:6px 12px; background:#ECE9D8; border-bottom:1px solid #7F9DB9;">
                    <div class="erp-stamp-he" style="display:none;">核</div>
                    <!-- Row 1 -->
                    <div class="erp-form-row" style="margin-bottom:3px; display:flex; justify-content:space-between; max-width:700px;">
                        <div class="erp-field">
                            <label style="width:60px;">請購單別</label>
                            <input type="text" id="puri05-type" class="erp-input-cyan" style="width:75px;" value="">
                            <button type="button" class="lookup-icon-btn" id="puri05-lookup-type" title="挑選單別">📄</button>
                            <span class="erp-field-desc" id="puri05-type-desc"></span>
                        </div>
                        <div class="erp-field">
                            <label style="width:60px;">請購部門</label>
                            <input type="text" id="puri05-dept" style="width:90px;" value="0100">
                            <button type="button" class="lookup-icon-btn" id="puri05-lookup-dept" title="挑選部門">🏢</button>
                            <span class="erp-field-desc" id="puri05-dept-desc"></span>
                        </div>
                    </div>
                    <!-- Row 2 -->
                    <div class="erp-form-row" style="margin-bottom:3px; display:flex; justify-content:space-between; max-width:700px;">
                        <div class="erp-field">
                            <label style="width:60px;">請購單號</label>
                            <input type="text" id="puri05-no" class="erp-input-cyan" style="width:125px;" value="">
                            <label style="margin-left:10px; width:30px;">版次</label>
                            <input type="text" id="puri05-version" style="width:40px; text-align:center;" value="1">
                        </div>
                        <div class="erp-field">
                            <label style="width:60px;">來源別</label>
                            <select id="puri05-source-type" style="width:115px;">
                                <option value=" " selected> </option>
                                <option value="1:手動輸入">1:手動輸入</option>
                                <option value="2:MRP">2:MRP</option>
                                <option value="3:LRP">3:LRP</option>
                                <option value="4:訂單">4:訂單</option>
                            </select>
                            <label style="margin-left:10px; width:30px;">列印</label>
                            <input type="text" id="puri05-print-count" style="width:40px; text-align:center;" value="0" readonly>
                        </div>
                    </div>
                    <!-- Row 3 -->
                    <div class="erp-form-row" style="margin-bottom:3px; display:flex; justify-content:space-between; max-width:700px;">
                        <div class="erp-field">
                            <label style="width:60px;">單據日期</label>
                            <input type="text" id="puri05-doc-date" class="erp-input-yellow" style="width:85px; text-align:center;" value="">
                            <input type="checkbox" id="puri05-chk-date" style="margin-left:3px;">
                        </div>
                        <div class="erp-field">
                            <label style="width:60px;">來源單號</label>
                            <input type="text" id="puri05-source-order" style="width:160px;" value="">
                        </div>
                    </div>
                    <!-- Row 4 -->
                    <div class="erp-form-row" style="margin-bottom:3px; display:flex; justify-content:space-between; max-width:700px;">
                        <div class="erp-field">
                            <label style="width:60px;">廠別</label>
                            <input type="text" id="puri05-factory" class="erp-input-yellow" style="width:80px;" value="">
                            <button type="button" class="lookup-icon-btn" id="puri05-lookup-factory" title="挑選廠別">🏭</button>
                        </div>
                        <div class="erp-field">
                            <label style="width:60px;">請購日期</label>
                            <input type="text" id="puri05-req-date" style="width:85px; text-align:center;" value="">
                            <label style="margin-left:10px; width:55px;">傳送次數</label>
                            <input type="text" id="puri05-send-count" style="width:40px; text-align:center;" value="" readonly>
                        </div>
                    </div>
                    <!-- Row 5 -->
                    <div class="erp-form-row" style="margin-bottom:3px; display:flex; justify-content:space-between; max-width:700px;">
                        <div class="erp-field">
                            <label style="width:60px;">備註</label>
                            <input type="text" id="puri05-remark" style="width:235px;" value="">
                            <button type="button" class="lookup-icon-btn" title="輸入備註">📝</button>
                        </div>
                        <div class="erp-field">
                            <label style="width:60px;">確認者</label>
                            <input type="text" id="puri05-confirm-user" class="erp-input-readonly" style="width:80px;" value="" readonly>
                        </div>
                    </div>
                    <!-- Row 6 -->
                    <div class="erp-form-row" style="margin-bottom:3px; display:flex; justify-content:space-between; max-width:700px;">
                        <div class="erp-field">
                            <label style="width:60px;">請購人員</label>
                            <input type="text" id="puri05-user" style="width:80px;" value="">
                            <button type="button" class="lookup-icon-btn" id="puri05-lookup-user" title="挑選人員">👤</button>
                            <span class="erp-field-desc" id="puri05-user-desc"></span>
                        </div>
                        <div class="erp-field">
                            <label style="width:60px;">簽核狀態</label>
                            <select id="puri05-sign-status" style="width:115px;">
                                <option value=" " selected> </option>
                                <option value="N:不執行電子簽核">N:不執行電子簽核</option>
                                <option value="0:待處理">0:待處理</option>
                                <option value="1:簽核中">1:簽核中</option>
                                <option value="2:已核准">2:已核准</option>
                                <option value="X:不簽核">X:不簽核</option>
                            </select>
                        </div>
                    </div>
                    <!-- Row 7 -->
                    <div class="erp-form-row" style="display:flex; justify-content:space-between; max-width:700px;">
                        <div class="erp-field">
                            <label style="width:75px;">EBC請購單號</label>
                            <input type="text" id="puri05-ebc-no" style="width:145px;" value="">
                        </div>
                        <div class="erp-field">
                            <label style="width:75px;">EBC請購版次</label>
                            <input type="text" id="puri05-ebc-ver" style="width:50px; text-align:center;" value="">
                        </div>
                    </div>
                </div>

                <!-- Dynamic DataGrid (1:1 參考圖9 - 無業務品號, 庫別在規格後) -->
                <div class="erp-datagrid-container">
                    <table class="erp-grid-table">
                        <thead>
                            <tr>
                                <th style="width:22px;">📝</th>
                                <th class="th-cyan" style="width:38px;">序號</th>
                                <th class="th-yellow" style="width:100px;">品號</th>
                                <th style="width:170px;">品名</th>
                                <th style="width:130px;">規格</th>
                                <th class="th-yellow" style="width:75px;">庫別</th>
                                <th style="width:65px;">請購數量</th>
                                <th style="width:40px;">單位</th>
                                <th style="width:75px;">預估單價</th>
                                <th style="width:85px;">金額</th>
                                <th style="width:85px;">需求日</th>
                            </tr>
                        </thead>
                        <tbody id="puri05-grid-tbody">
                            <!-- Dynamic 1-row grid -->
                        </tbody>
                    </table>
                </div>

                <!-- Totals Panel (1:1 參考圖9 - 數量合計 與 本幣金額合計) -->
                <div class="erp-totals-panel" style="display:flex; justify-content:space-between; background:#ECE9D8; border-top:1px solid #7F9DB9; padding:4px 14px; font-size:12px;">
                    <div class="erp-field">
                        <label style="width:65px;">數量合計</label>
                        <input type="text" id="puri05-tot-qty" class="erp-totals-inp" style="width:140px; text-align:right;" value="0" readonly>
                    </div>
                    <div class="erp-field">
                        <label style="width:85px;">本幣金額合計</label>
                        <input type="text" id="puri05-tot-grand" class="erp-totals-inp" style="width:140px; text-align:right; font-weight:bold;" value="0" readonly>
                    </div>
                </div>
            </div>

            <!-- Browse View -->
            <div id="puri05-view-browse" style="display:none; flex-direction:column; flex:1; padding:4px;">
                <table class="erp-grid-table">
                    <thead>
                        <tr>
                            <th style="width:25px;"></th>
                            <th style="width:75px;">請購單別</th>
                            <th class="th-cyan" style="width:110px;">請購單號</th>
                            <th style="width:85px;">請購日期</th>
                            <th style="width:105px;">請購人員</th>
                            <th style="width:100px;">請購部門</th>
                            <th style="width:110px;">來源訂單</th>
                            <th style="width:85px;">請購金額</th>
                            <th style="width:75px;">稅額</th>
                            <th style="width:85px;">合計</th>
                            <th style="width:65px;">狀態</th>
                        </tr>
                    </thead>
                    <tbody id="puri05-browse-tbody">
                        <tr><td colspan="11" style="text-align:center; padding:20px;">載入請購單清單中...</td></tr>
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

        App.openWindow(winId, title, html, 944, 615, (winEl) => {
            const fType = winEl.querySelector('#puri05-type');
            const fTypeDesc = winEl.querySelector('#puri05-type-desc');
            const fDept = winEl.querySelector('#puri05-dept');
            const fDeptDesc = winEl.querySelector('#puri05-dept-desc');
            const fNo = winEl.querySelector('#puri05-no');
            const fVersion = winEl.querySelector('#puri05-version');
            const fSourceType = winEl.querySelector('#puri05-source-type');
            const fPrintCount = winEl.querySelector('#puri05-print-count');
            const fDocDate = winEl.querySelector('#puri05-doc-date');
            const fSourceOrder = winEl.querySelector('#puri05-source-order');
            const fFactory = winEl.querySelector('#puri05-factory');
            const fReqDate = winEl.querySelector('#puri05-req-date');
            const fSendCount = winEl.querySelector('#puri05-send-count');
            const fRemark = winEl.querySelector('#puri05-remark');
            const fConfirmUser = winEl.querySelector('#puri05-confirm-user');
            const fUser = winEl.querySelector('#puri05-user');
            const fUserDesc = winEl.querySelector('#puri05-user-desc');
            const fSignStatus = winEl.querySelector('#puri05-sign-status');
            const fEbcNo = winEl.querySelector('#puri05-ebc-no');
            const fEbcVer = winEl.querySelector('#puri05-ebc-ver');
            const fTotGrand = winEl.querySelector('#puri05-tot-grand');
            const fTotQty = winEl.querySelector('#puri05-tot-qty');
            const statusMsg = winEl.querySelector('#puri05-status-msg');

            const tabDetail = winEl.querySelector('#puri05-tab-detail');
            const tabBrowse = winEl.querySelector('#puri05-tab-browse');
            const viewDetail = winEl.querySelector('#puri05-view-detail');
            const viewBrowse = winEl.querySelector('#puri05-view-browse');

            let currentDocStatus = '未確認';
            let requisitionList = [];
            let isDirty = false;

            winEl.addEventListener('input', (e) => {
                if (!e.target.classList.contains('erp-input-readonly')) {
                    isDirty = true;
                }
            });

            // Double click on date inputs to open calendar
            fDocDate?.addEventListener('dblclick', () => Modules.openCalendar(fDocDate));
            fReqDate?.addEventListener('dblclick', () => Modules.openCalendar(fReqDate));

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
                fTotGrand.value = Math.round(sumAmt).toLocaleString();
                fTotQty.value = sumQty.toLocaleString();
                statusMsg.textContent = `單身資料筆數: ${rowCount}`;
                if (rowCount > 0) isDirty = true;
            };

            const grid = Modules.initDynamicGrid(winEl, 'puri05', true, calcTotals);

            const fillReq = (header, details = []) => {
                fType.value = header.req_type || '';
                if (fTypeDesc) fTypeDesc.textContent = header.req_type === 'B311' ? '原料請購單' : (header.req_type === 'B312' ? '事務請購單' : (header.req_type === 'C311' ? '配銷請購單' : ''));
                fDocDate.value = header.doc_date || header.req_date || '';
                fReqDate.value = header.req_date || '';
                fNo.value = header.req_no || '';
                if (fVersion) fVersion.value = header.version || '1';
                if (fSourceType) fSourceType.value = header.source_type || ' ';
                if (fPrintCount) fPrintCount.value = header.print_count !== undefined ? header.print_count : '0';
                fSourceOrder.value = header.source_no || header.source_order_no || '';
                if (fFactory) fFactory.value = header.factory || '01';
                if (fSendCount) fSendCount.value = header.send_count !== undefined ? header.send_count : '';
                if (fRemark) fRemark.value = header.remark || '';
                fUser.value = header.req_user || '';
                if (fUserDesc) fUserDesc.textContent = header.req_user_name || '';
                fDept.value = header.dept || '';
                if (fDeptDesc) fDeptDesc.textContent = header.dept ? '業務部' : '';
                if (fSignStatus) fSignStatus.value = header.sign_status || 'N:不執行電子簽核';
                if (fEbcNo) fEbcNo.value = header.ebc_no || '';
                if (fEbcVer) fEbcVer.value = header.ebc_ver || '';
                fConfirmUser.value = header.confirm_user || '';
                currentDocStatus = header.status || '未確認';
                Modules.setDocStamp(winEl, currentDocStatus);
                Modules.updateAuditButtons(winEl, currentDocStatus === '已確認', 'puri05');
                grid.fillGrid(details);
                Modules.setFormMode(winEl, grid, 'browse', statusMsg, header.req_no);
                isDirty = false;
            };

            const clearReq = async () => {
                fType.value = '';
                if (fTypeDesc) fTypeDesc.textContent = '';
                const today = Modules.getTodayStr();
                fDocDate.value = today;
                fReqDate.value = today;
                fNo.value = await Modules.generateNextDocNo('requisition', today);
                if (fVersion) fVersion.value = '1';
                if (fSourceType) fSourceType.value = ' ';
                if (fPrintCount) fPrintCount.value = '0';
                fSourceOrder.value = '';
                if (fFactory) fFactory.value = '';
                if (fSendCount) fSendCount.value = '';
                if (fRemark) fRemark.value = '';
                fUser.value = '';
                if (fUserDesc) fUserDesc.textContent = '';
                fDept.value = '0100';
                if (fDeptDesc) fDeptDesc.textContent = '業務部';
                if (fSignStatus) fSignStatus.value = 'N:不執行電子簽核';
                if (fEbcNo) fEbcNo.value = '';
                if (fEbcVer) fEbcVer.value = '';
                fConfirmUser.value = '';
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '未確認');
                Modules.updateAuditButtons(winEl, false, 'puri05');
                grid.clearGrid(true);
                Modules.setFormMode(winEl, grid, 'add', statusMsg, fNo.value);
                isDirty = false;
                fUser.focus();
            };

            const resetReqBlank = () => {
                fType.value = '';
                if (fTypeDesc) fTypeDesc.textContent = '';
                fDocDate.value = '';
                fReqDate.value = '';
                fNo.value = '';
                if (fVersion) fVersion.value = '1';
                if (fSourceType) fSourceType.value = ' ';
                if (fPrintCount) fPrintCount.value = '0';
                fSourceOrder.value = '';
                if (fFactory) fFactory.value = '';
                if (fSendCount) fSendCount.value = '';
                if (fRemark) fRemark.value = '';
                fUser.value = '';
                if (fUserDesc) fUserDesc.textContent = '';
                fDept.value = '';
                if (fDeptDesc) fDeptDesc.textContent = '';
                if (fSignStatus) fSignStatus.value = 'N:不執行電子簽核';
                if (fEbcNo) fEbcNo.value = '';
                if (fEbcVer) fEbcVer.value = '';
                fConfirmUser.value = '';
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '');
                Modules.updateAuditButtons(winEl, false, 'puri05');
                grid.clearGrid(false);
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
                const tbody = winEl.querySelector('#puri05-browse-tbody');
                const res = await ERP_API.get('get_requisitions');
                if (res.success) {
                    requisitionList = res.data || [];
                    if (requisitionList.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="11" style="text-align:center; padding:20px; color:#888;">目前尚無請購單據</td></tr>';
                        return;
                    }
                    let rows = '';
                    requisitionList.forEach(r => {
                        const amt = Math.round(r.total_amount || 0);
                        const tax = Math.round(amt * 0.05);
                        const grand = amt + tax;
                        rows += `
                            <tr data-no="${r.req_no}" style="cursor:pointer;">
                                <td style="text-align:center;">▶</td>
                                <td>${r.req_type || 'C311'}</td>
                                <td style="font-weight:bold; color:#003366;">${r.req_no}</td>
                                <td>${r.req_date || ''}</td>
                                <td>${r.req_user || ''}</td>
                                <td>${r.dept || ''}</td>
                                <td>${r.source_order_no || ''}</td>
                                <td style="text-align:right;">${amt.toLocaleString()}</td>
                                <td style="text-align:right;">${tax.toLocaleString()}</td>
                                <td style="text-align:right; font-weight:bold;">${grand.toLocaleString()}</td>
                                <td style="text-align:center; font-weight:bold; color:${r.status === '已確認' ? 'green' : '#999'};">${r.status || '未確認'}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows;

                    tbody.querySelectorAll('tr[data-no]').forEach(tr => {
                        tr.addEventListener('click', () => {
                            checkDirtyBeforeAction(async () => {
                                const no = tr.getAttribute('data-no');
                                const detailRes = await ERP_API.get('get_requisition', { req_no: no });
                                const doc = detailRes.requisition || detailRes.header;
                                if (detailRes.success && doc) {
                                    fillReq(doc, detailRes.details || []);
                                    switchTab('detail');
                                }
                            });
                        });
                    });
                }
            };

            const navReq = async (pos) => {
                checkDirtyBeforeAction(async () => {
                    const cur = fNo.value.trim();
                    const res = await ERP_API.get('nav_requisition', { pos, current: cur });
                    if (res.success && res.requisition) {
                        fillReq(res.requisition, res.details || []);
                        isDirty = false;
                    } else {
                        alert('已無' + (pos === 'first' ? '第一筆' : pos === 'last' ? '最後一筆' : pos === 'prev' ? '上一筆' : '下一筆') + '請購單資料');
                    }
                });
            };

            const bindNav = (btnId, pos) => {
                const btn = winEl.querySelector('#' + btnId);
                if (btn) btn.addEventListener('click', () => navReq(pos));
            };
            bindNav('puri05-tb-first', 'first');
            bindNav('puri05-tb-prev', 'prev');
            bindNav('puri05-tb-next', 'next');
            bindNav('puri05-tb-last', 'last');

            // Lookups
            winEl.querySelector('#puri05-lookup-type')?.addEventListener('click', () => {
                Modules.openLookup('doc_type_req', (t) => {
                    fType.value = t.code;
                    if (fTypeDesc) fTypeDesc.textContent = t.name;
                    isDirty = true;
                });
            });
            winEl.querySelector('#puri05-lookup-factory')?.addEventListener('click', () => {
                Modules.openLookup('factory', (f) => {
                    if (fFactory) fFactory.value = f.factory_no || f.code;
                    isDirty = true;
                });
            });
            fFactory?.addEventListener('dblclick', () => {
                Modules.openLookup('factory', (f) => {
                    if (fFactory) fFactory.value = f.factory_no || f.code;
                    isDirty = true;
                });
            });
            winEl.querySelector('#puri05-lookup-user')?.addEventListener('click', () => {
                Modules.openLookup('salesperson', (s) => {
                    fUser.value = s.code;
                    if (fUserDesc) fUserDesc.textContent = s.name;
                    isDirty = true;
                });
            });
            winEl.querySelector('#puri05-lookup-dept')?.addEventListener('click', () => {
                Modules.openLookup('dept', (d) => {
                    fDept.value = d.code + ' ' + d.name;
                    isDirty = true;
                });
            });
            winEl.querySelector('#puri05-lookup-order')?.addEventListener('click', () => {
                Modules.openLookup('order', (o) => {
                    fSourceOrder.value = o.order_no;
                    isDirty = true;
                });
            });

            const doSave = async () => {
                const reqNo = fNo.value.trim();
                if (!reqNo) {
                    alert('【必填檢查】請輸入請購單號！');
                    fNo.focus();
                    return false;
                }
                const details = grid.getRowsData();
                if (details.length === 0) {
                    alert('【明細檢查】請至少在表格中挑選品號並輸入請購數量！');
                    return false;
                }

                const reqType = fType.value.trim();
                if (!reqType) {
                    alert('【必填檢查】請輸入或挑選請購單別！');
                    fType.focus();
                    return false;
                }

                const payload = {
                    header: {
                        req_no: reqNo,
                        req_type: reqType,
                        doc_date: fDocDate.value.trim() || Modules.getTodayStr(),
                        req_date: fReqDate.value.trim() || Modules.getTodayStr(),
                        factory: fFactory ? fFactory.value.trim() : '01',
                        dept: fDept.value.trim(),
                        req_user: fUser.value.trim(),
                        source_type: fSourceType ? fSourceType.value.trim() : '',
                        source_no: fSourceOrder ? fSourceOrder.value.trim() : '',
                        source_order_no: fSourceOrder ? fSourceOrder.value.trim() : '',
                        confirm_user: fConfirmUser ? fConfirmUser.value.trim() : '',
                        sign_status: fSignStatus ? fSignStatus.value.trim() : 'N:不執行電子簽核',
                        version: fVersion ? fVersion.value.trim() : '1',
                        print_count: fPrintCount ? (parseInt(fPrintCount.value, 10) || 0) : 0,
                        send_count: fSendCount ? (parseInt(fSendCount.value, 10) || 0) : 0,
                        remark: fRemark ? fRemark.value.trim() : '',
                        ebc_no: fEbcNo ? fEbcNo.value.trim() : '',
                        ebc_ver: fEbcVer ? fEbcVer.value.trim() : '',
                        total_qty: parseFloat((fTotQty.value || '').replace(/,/g, '')) || 0,
                        total_amount: parseFloat((fTotGrand.value || '').replace(/,/g, '')) || 0,
                        status: currentDocStatus
                    },
                    details
                };

                const res = await ERP_API.post('save_requisition', payload);
                if (res.success) {
                    isDirty = false;
                    Modules.setFormMode(winEl, grid, 'browse', statusMsg, reqNo);
                    Modules.toast(`請購單 [${reqNo}] 儲存成功！`, 'success');
                    return true;
                } else {
                    Modules.toast('儲存失敗: ' + (res.error || '不明錯誤'), 'error');
                    return false;
                }
            };

            // Toolbar
            winEl.querySelector('#puri05-tb-new').addEventListener('click', () => checkDirtyBeforeAction(() => {
                clearReq();
                switchTab('detail');
            }));
            winEl.querySelector('#puri05-tb-edit').addEventListener('click', () => {
                const curNo = fNo.value.trim();
                if (!curNo) {
                    alert('請先查詢單據或點選「新增」！');
                    return;
                }
                switchTab('detail');
                Modules.setFormMode(winEl, grid, 'edit', statusMsg, curNo);
                Modules.toast(`請購單 [${curNo}] 進入修改模式`, 'info');
            });
            winEl.querySelector('#puri05-tb-query').addEventListener('click', () => {
                checkDirtyBeforeAction(() => {
                    Modules.openLookup('requisition', async (r) => {
                        const targetNo = r.req_no || r.no || '';
                        const res = await ERP_API.get('get_requisition', { req_no: targetNo });
                        const doc = res.requisition || res.header;
                        if (res.success && doc) {
                            fillReq(doc, res.details || []);
                            switchTab('detail');
                        } else {
                            alert(res.error || '查無此請購單資料');
                        }
                    });
                });
            });

            winEl.querySelector('#puri05-tb-save').addEventListener('click', doSave);

            winEl.querySelector('#puri05-tb-cancel').addEventListener('click', () => {
                if (isDirty) {
                    const answer = confirm("資料尚未儲存，是否要儲存目前的單據？\n\n點選【確定】：進行儲存\n點選【取消】：直接清除放棄變更");
                    if (answer) {
                        doSave();
                    } else {
                        resetReqBlank();
                        Modules.toast('已取消並清除未儲存變更。', 'info');
                    }
                } else {
                    resetReqBlank();
                    Modules.toast('已清除重置頁面資料。', 'info');
                }
            });

            winEl.querySelector('#puri05-tb-confirm').addEventListener('click', async () => {
                const btn = winEl.querySelector('#puri05-tb-confirm');
                if (btn && btn.disabled) return;
                const reqNo = fNo.value.trim();
                if (!reqNo) return;
                const res = await ERP_API.post('confirm_doc', { type: 'requisition', doc_no: reqNo, status: '已確認' });
                if (res.success) {
                    currentDocStatus = '已確認';
                    fConfirmUser.value = App.currentUser?.username || '';
                    Modules.updateAuditButtons(winEl, true, 'puri05');
                    Modules.toast('請購單確認完成！', 'success');
                }
            });

            winEl.querySelector('#puri05-tb-unconfirm').addEventListener('click', async () => {
                const btn = winEl.querySelector('#puri05-tb-unconfirm');
                if (btn && btn.disabled) return;
                const reqNo = fNo.value.trim();
                if (!reqNo) return;
                const res = await ERP_API.post('confirm_doc', { type: 'requisition', doc_no: reqNo, status: '未確認' });
                if (res.success) {
                    currentDocStatus = '未確認';
                    fConfirmUser.value = '';
                    Modules.updateAuditButtons(winEl, false, 'puri05');
                    Modules.toast('請購單已取消確認！', 'info');
                }
            });

            winEl.querySelector('#puri05-tb-del').addEventListener('click', async () => {
                const reqNo = fNo.value.trim();
                if (!reqNo) return;
                if (confirm(`確定要刪除請購單 [${reqNo}] 嗎？`)) {
                    const res = await ERP_API.post('delete_requisition', { req_no: reqNo });
                    if (res.success) {
                        Modules.toast('請購單已成功刪除！', 'success');
                        clearReq();
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

            winEl.querySelectorAll('.erp-subtab-header .erp-subtab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    winEl.querySelectorAll('.erp-subtab-header .erp-subtab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });

            // Initial load: 100% 空白模式，按新增或查詢才出現
            if (targetReqNo) {
                ERP_API.get('get_requisition', { req_no: targetReqNo }).then(res => {
                    const doc = res.requisition || res.header;
                    if (res.success && doc) {
                        fillReq(doc, res.details || []);
                        Modules.toast(`已載入請購單【${targetReqNo}】，請進行審核確認。`, 'info', 2200);
                    } else {
                        resetReqBlank();
                    }
                });
            } else {
                resetReqBlank();
            }
        });
    },

    // ========================================================
    // 9. 請購資料維護作業 (PURI06) - 1:1 參考圖10 (media_1793937583648_2096ab6a.png)
    // ========================================================
    openPURI06() {
        const u = App.currentUser?.company || '學生區';
        const title = `請購資料維護作業(PURI06)[${u}]`;
        const winId = 'PURI06';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">資料(<u>D</u>)</span>
                <span class="erp-menu-item">功能(<u>F</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="新增空白明細" id="puri06-tb-new">📄</button>
                <button class="erp-tb-btn" title="查詢請購單" id="puri06-tb-query">🔍</button>
                <button class="erp-tb-btn" title="修改" id="puri06-tb-edit">✏️</button>
                <button class="erp-tb-btn" title="刪除明細" id="puri06-tb-del">🗑️</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('請購資料清單產生中...')">🖨️</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="首筆" id="puri06-tb-first">|◀</button>
                <button class="erp-tb-btn" title="上筆" id="puri06-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下筆" id="puri06-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="puri06-tb-last">▶|</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="儲存" id="puri06-tb-save" style="color:#008000; font-weight:bold; font-size:15px;">✔</button>
                <button class="erp-tb-btn tb-btn-cancel" title="取消 (清除放棄未儲存變更)" id="puri06-tb-cancel" style="color:#CC0000; font-weight:bold; font-size:15px;">✖</button>
                <button class="erp-tb-btn" title="確認" id="puri06-tb-confirm">
                    <img src="assets/icons/confirm_active.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
                <button class="erp-tb-btn" title="取消確認" id="puri06-tb-unconfirm">
                    <img src="assets/icons/unconfirm_disabled.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
            </div>

            <!-- Tabs -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="puri06-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="puri06-tab-browse">資料瀏覽</button>
            </div>

            <!-- Detailed View (1:1 參考圖10) -->
            <div id="puri06-view-detail" style="display:flex; flex:1; background:#ECE9D8; overflow:auto; padding:8px 12px; gap:20px; font-size:12px;">
                <!-- Left Column (請購資料維護 - 左欄) -->
                <div style="display:flex; flex-direction:column; gap:4px; width:360px;">
                    <!-- 請購單號 3段 Cyan -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:80px; text-align:right; margin-right:4px;">請購單號</label>
                        <input type="text" id="puri06-type" class="erp-input-cyan" style="width:48px; text-align:center;" value="">
                        <span style="margin:0 2px;">-</span>
                        <input type="text" id="puri06-doc-no" class="erp-input-cyan" style="width:115px;" value="">
                        <input type="text" id="puri06-line-no" class="erp-input-cyan" style="width:50px; text-align:center; margin-left:4px;" value="">
                    </div>

                    <!-- 類型 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:80px; text-align:right; margin-right:4px;">類型</label>
                        <select id="puri06-req-type-sel" style="width:170px;">
                            <option value=""></option>
                            <option value="1">1:廠內請購</option>
                            <option value="2">2:外協請購</option>
                            <option value="3">3:委外請購</option>
                        </select>
                    </div>

                    <!-- 品號 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:80px; text-align:right; margin-right:4px;">品號</label>
                        <input type="text" id="puri06-item-no" style="width:170px;" value="">
                        <button type="button" class="lookup-icon-btn" id="puri06-lookup-item" style="margin-left:2px;">⛰</button>
                    </div>

                    <!-- 品名 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:80px; text-align:right; margin-right:4px;">品名</label>
                        <input type="text" id="puri06-item-name" style="width:230px;" value="">
                    </div>

                    <!-- 規格 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:80px; text-align:right; margin-right:4px;">規格</label>
                        <input type="text" id="puri06-item-spec" style="width:230px;" value="">
                    </div>

                    <!-- 單據日期 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:80px; text-align:right; margin-right:4px;">單據日期</label>
                        <input type="text" id="puri06-doc-date" style="width:110px;" value="" placeholder="YYYY/MM/DD">
                    </div>

                    <!-- 請購日期 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:80px; text-align:right; margin-right:4px;">請購日期</label>
                        <input type="text" id="puri06-req-date" style="width:110px;" value="" placeholder="YYYY/MM/DD">
                    </div>

                    <!-- 請購數量 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:80px; text-align:right; margin-right:4px;">請購數量</label>
                        <input type="text" id="puri06-req-qty" style="width:90px; text-align:right;" value="">
                    </div>

                    <!-- 請購單位 / 請購包裝數量 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:80px; text-align:right; margin-right:4px;">請購單位</label>
                        <input type="text" id="puri06-req-unit" style="width:50px;" value="">
                        <label style="width:90px; text-align:right; margin-right:4px;">請購包裝數量</label>
                        <input type="text" id="puri06-pack-req-qty" style="width:70px; text-align:right;" value="">
                    </div>

                    <!-- 小單位 / 請購包裝單位 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:80px; text-align:right; margin-right:4px;">小單位</label>
                        <input type="text" id="puri06-req-small-unit" style="width:50px;" value="">
                        <label style="width:90px; text-align:right; margin-right:4px;">請購包裝單位</label>
                        <input type="text" id="puri06-pack-req-unit" style="width:50px;" value="">
                    </div>

                    <!-- 需求日期 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:80px; text-align:right; margin-right:4px;">需求日期</label>
                        <input type="text" id="puri06-require-date" style="width:110px;" value="" placeholder="YYYY/MM/DD">
                    </div>

                    <!-- 請購備註 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:80px; text-align:right; margin-right:4px;">請購備註</label>
                        <input type="text" id="puri06-req-remark" style="width:230px;" value="">
                    </div>

                    <!-- 最低補量 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:80px; text-align:right; margin-right:4px;">最低補量</label>
                        <input type="text" id="puri06-min-replenish" style="width:90px; text-align:right;" value="">
                    </div>

                    <!-- 專案代號 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:80px; text-align:right; margin-right:4px;">專案代號</label>
                        <input type="text" id="puri06-project-no" style="width:140px;" value="">
                    </div>

                    <!-- 請購人員 -->
                    <div style="display:flex; align-items:center; margin-top:10px;">
                        <label style="width:80px; text-align:right; margin-right:4px;">請購人員</label>
                        <input type="text" id="puri06-req-user" style="width:90px;" value="">
                        <span id="puri06-req-user-desc" style="margin-left:4px;"></span>
                    </div>
                </div>

                <!-- Right Column (請購資料維護 - 右欄) -->
                <div style="display:flex; flex-direction:column; gap:4px; flex:1; min-width:440px;">
                    <!-- 採購人員 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:90px; text-align:right; margin-right:4px;">採購人員</label>
                        <input type="text" id="puri06-buyer" style="width:90px;" value="">
                        <button type="button" class="lookup-icon-btn" id="puri06-lookup-buyer" style="margin-left:2px;">👤</button>
                        <span id="puri06-buyer-desc" style="margin-left:4px;"></span>
                    </div>

                    <!-- 供應廠商 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:90px; text-align:right; margin-right:4px;">供應廠商</label>
                        <input type="text" id="puri06-sup-no" style="width:90px;" value="">
                        <button type="button" class="lookup-icon-btn" id="puri06-lookup-sup" style="margin-left:2px;">👤</button>
                        <span id="puri06-sup-name" style="margin-left:4px;"></span>
                    </div>

                    <!-- 交貨庫別 / 單身多稅率 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:90px; text-align:right; margin-right:4px;">交貨庫別</label>
                        <input type="text" id="puri06-delivery-wh" style="width:90px;" value="">
                        <button type="button" class="lookup-icon-btn" id="puri06-lookup-wh" style="margin-left:2px;">☖</button>
                        <label style="margin-left:80px; display:inline-flex; align-items:center; gap:3px; cursor:pointer;">
                            <input type="checkbox" id="puri06-multi-tax"> 單身多稅率
                        </label>
                    </div>

                    <!-- 採購數量 / 採購包裝數量 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:90px; text-align:right; margin-right:4px;">採購數量</label>
                        <input type="text" id="puri06-pur-qty" style="width:90px; text-align:right;" value="">
                        <label style="width:95px; text-align:right; margin-right:4px;">採購包裝數量</label>
                        <input type="text" id="puri06-pack-pur-qty" style="width:75px; text-align:right;" value="">
                    </div>

                    <!-- 採購單位 / 採購包裝單位 / 小單位 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:90px; text-align:right; margin-right:4px;">採購單位</label>
                        <input type="text" id="puri06-pur-unit" style="width:50px;" value="">
                        <span style="color:#888; font-size:10px; margin:0 3px;">@</span>
                        <label style="width:90px; text-align:right; margin-right:4px;">採購包裝單位</label>
                        <input type="text" id="puri06-pack-pur-unit" style="width:50px;" value="">
                        <label style="width:55px; text-align:right; margin-right:4px;">小單位</label>
                        <input type="text" id="puri06-pur-small-unit" style="width:50px;" value="">
                    </div>

                    <!-- 交易條件 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:90px; text-align:right; margin-right:4px;">交易條件</label>
                        <input type="text" id="puri06-trading-terms" style="width:80px;" value="">
                    </div>

                    <!-- 稅別碼 / 課稅別 / 營業稅率 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:90px; text-align:right; margin-right:4px;">稅別碼</label>
                        <input type="text" id="puri06-tax-code" class="erp-input-yellow" style="width:45px;" value="P05">
                        <button type="button" class="lookup-icon-btn" id="puri06-lookup-tax" title="挑選稅別">🔍</button>
                        <label style="width:60px; text-align:right; margin-right:4px;">課稅別</label>
                        <select id="puri06-tax-type" style="width:110px;">
                            <option value=""></option>
                            <option selected>2 應稅外加</option>
                            <option>1 應稅內含</option>
                            <option>3 零稅率</option>
                            <option>4 免稅</option>
                        </select>
                        <label style="width:70px; text-align:right; margin-right:4px;">營業稅率</label>
                        <input type="text" id="puri06-tax-rate" style="width:45px; text-align:right;" value="5.00">
                        <span style="margin-left:2px;">%</span>
                    </div>

                    <!-- 採購幣別 / 計價數量 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:90px; text-align:right; margin-right:4px;">採購幣別</label>
                        <input type="text" id="puri06-currency" style="width:50px;" value="">
                        <span style="margin:0 2px;">$</span>
                        <label style="width:145px; text-align:right; margin-right:4px;">計價數量</label>
                        <input type="text" id="puri06-pricing-qty" style="width:80px; text-align:right;" value="">
                    </div>

                    <!-- 採購單價 / 計價單位 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:90px; text-align:right; margin-right:4px;">採購單價</label>
                        <input type="text" id="puri06-pur-price" style="width:80px; text-align:right;" value="">
                        <span style="margin:0 2px;">$</span>
                        <label style="width:115px; text-align:right; margin-right:4px;">計價單位</label>
                        <input type="text" id="puri06-pricing-unit" style="width:50px;" value="">
                        <span style="color:#888; font-size:10px; margin:0 3px;">@</span>
                    </div>

                    <!-- 採購金額 / 詢價碼 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:90px; text-align:right; margin-right:4px;">採購金額</label>
                        <input type="text" id="puri06-pur-amount" style="width:90px; text-align:right;" value="">
                        <label style="width:105px; text-align:right; margin-right:4px;">詢價碼</label>
                        <select id="puri06-inquiry-code" style="width:90px;">
                            <option value=""></option>
                            <option value="N">N:不詢價</option>
                            <option value="1">1:詢價</option>
                            <option value="2">2:已報價</option>
                        </select>
                    </div>

                    <!-- 交貨日 / 急料 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:90px; text-align:right; margin-right:4px;">交貨日</label>
                        <input type="text" id="puri06-delivery-date" class="erp-input-yellow" style="width:95px;" value="" placeholder="YYYY/MM/DD">
                        <input type="checkbox" id="puri06-chk-delivery" style="margin-left:2px;">
                        <label style="margin-left:55px; display:inline-flex; align-items:center; gap:3px; cursor:pointer;">
                            <input type="checkbox" id="puri06-is-urgent"> 急料
                        </label>
                    </div>

                    <!-- 採購備註 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:90px; text-align:right; margin-right:4px;">採購備註</label>
                        <input type="text" id="puri06-pur-remark" style="width:310px;" value="">
                    </div>

                    <!-- 鎖定碼 / 採購碼 / 結案碼 -->
                    <div style="display:flex; align-items:center; margin-top:2px;">
                        <label style="display:inline-flex; align-items:center; gap:3px; margin-left:94px; cursor:pointer;">
                            <input type="checkbox" id="puri06-is-locked"> 鎖定碼
                        </label>
                        <label style="display:inline-flex; align-items:center; gap:3px; margin-left:25px; cursor:pointer;">
                            <input type="checkbox" id="puri06-is-purchased"> 採購碼
                        </label>
                        <label style="margin-left:45px; margin-right:4px;">結案碼</label>
                        <select id="puri06-close-code" style="width:85px;">
                            <option value=""></option>
                            <option value="N">N:未結案</option>
                            <option value="Y">Y:已結案</option>
                            <option value="9">9:指定結案</option>
                        </select>
                    </div>

                    <!-- 請購部門 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:90px; text-align:right; margin-right:4px;">請購部門</label>
                        <input type="text" id="puri06-req-dept" style="width:140px;" value="">
                    </div>

                    <!-- 採購單號 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:90px; text-align:right; margin-right:4px;">採購單號</label>
                        <input type="text" id="puri06-po-no" style="width:140px;" value="">
                    </div>

                    <!-- 製造商 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:90px; text-align:right; margin-right:4px;">製造商</label>
                        <input type="text" id="puri06-manufacturer" style="width:140px;" value="">
                        <button type="button" class="lookup-icon-btn" id="puri06-lookup-mfr" style="margin-left:2px;">👤</button>
                    </div>

                    <!-- 承認型號 -->
                    <div style="display:flex; align-items:center;">
                        <label style="width:90px; text-align:right; margin-right:4px;">承認型號</label>
                        <input type="text" id="puri06-approved-model" style="width:180px;" value="">
                    </div>
                </div>
            </div>

            <!-- Browse View -->
            <div id="puri06-view-browse" style="display:none; flex-direction:column; flex:1; padding:4px; background:#ECE9D8; overflow:hidden;">
                <div class="erp-datagrid-container" style="flex:1; overflow:auto; background:#FFF; border:1px solid #7F9DB9;">
                    <table class="erp-grid-table" style="width:100%; border-collapse:collapse; font-size:12px;">
                        <thead>
                            <tr style="height:22px; background:linear-gradient(to bottom, #F9F9F9, #E4E4E4);">
                                <th style="width:24px; text-align:center;">📋</th>
                                <th class="th-cyan" style="width:120px; text-align:left; padding:2px 6px;">請購單號</th>
                                <th style="width:50px; text-align:center; padding:2px 6px;">序號</th>
                                <th style="width:90px; text-align:left; padding:2px 6px;">品號</th>
                                <th style="width:160px; text-align:left; padding:2px 6px;">品名</th>
                                <th style="width:130px; text-align:left; padding:2px 6px;">規格</th>
                                <th style="width:70px; text-align:right; padding:2px 6px;">請購數量</th>
                                <th style="width:45px; text-align:center; padding:2px 6px;">單位</th>
                                <th style="width:80px; text-align:right; padding:2px 6px;">採購單價</th>
                                <th style="width:85px; text-align:right; padding:2px 6px;">採購金額</th>
                                <th style="width:95px; text-align:left; padding:2px 6px;">供應廠商</th>
                                <th style="width:105px; text-align:left; padding:2px 6px;">採購人員</th>
                                <th style="width:60px; text-align:center; padding:2px 6px;">狀態</th>
                            </tr>
                        </thead>
                        <tbody id="puri06-browse-tbody">
                            <!-- Populated dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Status Bar -->
            <div class="erp-window-statusbar" style="height:20px; background:#ECE9D8; border-top:1px solid #D4D0C8; display:flex; align-items:center; padding:0 6px; font-size:11px;">
                <span class="status-cell">瀏覽</span>
                <span class="status-cell" id="puri06-status-count">單身資料筆數: 0</span>
                <span class="status-cell" id="puri06-status-msg" style="margin-left:16px;">就緒 (請點選「新增」或「查詢」)</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 940, 620, (winEl) => {
            // Elements
            const fType = winEl.querySelector('#puri06-type');
            const fDocNo = winEl.querySelector('#puri06-doc-no');
            const fLineNo = winEl.querySelector('#puri06-line-no');
            const fReqTypeSel = winEl.querySelector('#puri06-req-type-sel');
            const fItemNo = winEl.querySelector('#puri06-item-no');
            const fItemName = winEl.querySelector('#puri06-item-name');
            const fItemSpec = winEl.querySelector('#puri06-item-spec');
            const fDocDate = winEl.querySelector('#puri06-doc-date');
            const fReqDate = winEl.querySelector('#puri06-req-date');
            const fReqQty = winEl.querySelector('#puri06-req-qty');
            const fReqUnit = winEl.querySelector('#puri06-req-unit');
            const fPackReqQty = winEl.querySelector('#puri06-pack-req-qty');
            const fReqSmallUnit = winEl.querySelector('#puri06-req-small-unit');
            const fPackReqUnit = winEl.querySelector('#puri06-pack-req-unit');
            const fRequireDate = winEl.querySelector('#puri06-require-date');
            const fReqRemark = winEl.querySelector('#puri06-req-remark');
            const fMinReplenish = winEl.querySelector('#puri06-min-replenish');
            const fProjectNo = winEl.querySelector('#puri06-project-no');
            const fReqUser = winEl.querySelector('#puri06-req-user');
            const fReqUserDesc = winEl.querySelector('#puri06-req-user-desc');

            const fBuyer = winEl.querySelector('#puri06-buyer');
            const fBuyerDesc = winEl.querySelector('#puri06-buyer-desc');
            const fSupNo = winEl.querySelector('#puri06-sup-no');
            const fSupName = winEl.querySelector('#puri06-sup-name');
            const fDeliveryWh = winEl.querySelector('#puri06-delivery-wh');
            const fMultiTax = winEl.querySelector('#puri06-multi-tax');
            const fPurQty = winEl.querySelector('#puri06-pur-qty');
            const fPackPurQty = winEl.querySelector('#puri06-pack-pur-qty');
            const fPurUnit = winEl.querySelector('#puri06-pur-unit');
            const fPackPurUnit = winEl.querySelector('#puri06-pack-pur-unit');
            const fPurSmallUnit = winEl.querySelector('#puri06-pur-small-unit');
            const fTradingTerms = winEl.querySelector('#puri06-trading-terms');
            const fTaxCode = winEl.querySelector('#puri06-tax-code');
            const fTaxType = winEl.querySelector('#puri06-tax-type');
            const fTaxRate = winEl.querySelector('#puri06-tax-rate');
            const fCurrency = winEl.querySelector('#puri06-currency');
            const fPricingQty = winEl.querySelector('#puri06-pricing-qty');
            const fPurPrice = winEl.querySelector('#puri06-pur-price');
            const fPricingUnit = winEl.querySelector('#puri06-pricing-unit');
            const fPurAmount = winEl.querySelector('#puri06-pur-amount');
            const fInquiryCode = winEl.querySelector('#puri06-inquiry-code');
            const fDeliveryDate = winEl.querySelector('#puri06-delivery-date');
            const fChkDelivery = winEl.querySelector('#puri06-chk-delivery');
            const fIsUrgent = winEl.querySelector('#puri06-is-urgent');
            const fPurRemark = winEl.querySelector('#puri06-pur-remark');
            const fIsLocked = winEl.querySelector('#puri06-is-locked');
            const fIsPurchased = winEl.querySelector('#puri06-is-purchased');
            const fCloseCode = winEl.querySelector('#puri06-close-code');
            const fReqDept = winEl.querySelector('#puri06-req-dept');
            const fPoNo = winEl.querySelector('#puri06-po-no');
            const fManufacturer = winEl.querySelector('#puri06-manufacturer');
            const fApprovedModel = winEl.querySelector('#puri06-approved-model');

            const tabDetail = winEl.querySelector('#puri06-tab-detail');
            const tabBrowse = winEl.querySelector('#puri06-tab-browse');
            const viewDetail = winEl.querySelector('#puri06-view-detail');
            const viewBrowse = winEl.querySelector('#puri06-view-browse');
            const statusMsg = winEl.querySelector('#puri06-status-msg');
            const statusCount = winEl.querySelector('#puri06-status-count');

            let currentRecordId = 0;
            let isDirty = false;
            let currentStatus = '已確認';

            winEl.addEventListener('input', () => { isDirty = true; });

            const calcAmounts = () => {
                const q = parseFloat(fPurQty.value) || parseFloat(fReqQty.value) || 0;
                const p = parseFloat(fPurPrice.value) || 0;
                const amt = Math.round(q * p);
                fPurAmount.value = amt.toLocaleString();
            };
            fReqQty.addEventListener('input', () => {
                fPurQty.value = fReqQty.value;
                fPricingQty.value = fReqQty.value;
                calcAmounts();
            });
            fPurQty.addEventListener('input', () => {
                fPricingQty.value = fPurQty.value;
                calcAmounts();
            });
            fPurPrice.addEventListener('input', calcAmounts);

            // Tab switcher
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

            const fillDetail = (d) => {
                currentRecordId = d.id || 0;
                const fullReq = d.req_no || '';
                const parts = fullReq.split('-');
                if (parts.length >= 2) {
                    fType.value = parts[0];
                    fDocNo.value = parts[1];
                } else {
                    fType.value = d.req_type || 'A311';
                    fDocNo.value = fullReq;
                }
                fLineNo.value = d.line_no || '0001';
                fReqTypeSel.value = d.req_type_sel || '1';
                fItemNo.value = d.item_no || '';
                fItemName.value = d.item_name || '';
                fItemSpec.value = d.item_spec || '';
                fDocDate.value = d.doc_date || Modules.getTodayStr();
                fReqDate.value = d.req_date || d.doc_date || Modules.getTodayStr();
                fReqQty.value = Math.round(d.req_qty || 0);
                fReqUnit.value = d.req_unit || d.unit || 'PC';
                fPackReqQty.value = Math.round(d.pack_req_qty || 0);
                fReqSmallUnit.value = d.req_small_unit || '';
                fPackReqUnit.value = d.pack_req_unit || '';
                fRequireDate.value = d.require_date || Modules.getTodayStr();
                fReqRemark.value = d.req_remark || '';
                fMinReplenish.value = Math.round(d.min_replenish || 0);
                fProjectNo.value = d.project_no || '';
                fReqUser.value = d.req_user || '';
                fReqUserDesc.textContent = d.req_user_name || '';

                fBuyer.value = d.buyer || '';
                if (fBuyerDesc) fBuyerDesc.textContent = d.buyer_name || '';
                fSupNo.value = d.supplier_no || '';
                if (fSupName) fSupName.textContent = d.supplier_name || '';
                fDeliveryWh.value = d.delivery_wh || d.warehouse || 'P003';
                fMultiTax.checked = !!d.multi_tax;
                const reqQty = parseFloat(d.req_qty) || 0;
                const purQty = (parseFloat(d.pur_qty) > 0) ? parseFloat(d.pur_qty) : reqQty;
                fPurQty.value = Math.round(purQty);
                fPackPurQty.value = Math.round(d.pack_pur_qty || 0);
                fPurUnit.value = d.pur_unit || d.unit || 'PC';
                fPackPurUnit.value = d.pack_pur_unit || '';
                fPurSmallUnit.value = d.pur_small_unit || '';
                fTradingTerms.value = d.trading_terms || '';
                fTaxCode.value = d.tax_code || 'P05';
                fTaxType.value = d.tax_type || '2 應稅外加';
                fTaxRate.value = (d.tax_rate !== undefined && d.tax_rate !== null) ? d.tax_rate : '5.00';
                fCurrency.value = d.currency || 'NTD';
                const pricingQty = (parseFloat(d.pricing_qty) > 0) ? parseFloat(d.pricing_qty) : purQty;
                fPricingQty.value = Math.round(pricingQty);
                const purPrice = (parseFloat(d.pur_price) > 0) ? parseFloat(d.pur_price) : (parseFloat(d.unit_price) || 0);
                fPurPrice.value = Math.round(purPrice);
                fPricingUnit.value = d.pricing_unit || d.unit || 'PC';
                const purAmt = (parseFloat(d.pur_amount) > 0) ? parseFloat(d.pur_amount) : (parseFloat(d.amount) || Math.round(purQty * purPrice));
                fPurAmount.value = Math.round(purAmt).toLocaleString();
                fInquiryCode.value = d.inquiry_code || 'N';
                fDeliveryDate.value = d.delivery_date || Modules.getTodayStr();
                fIsUrgent.checked = !!d.is_urgent;
                fPurRemark.value = d.pur_remark || '';
                fIsLocked.checked = !!(d.is_locked || d.req_is_locked);
                fIsPurchased.checked = !!d.is_purchased;
                fCloseCode.value = d.close_code || 'N';
                fReqDept.value = d.req_dept || d.dept || '0100 業務部';
                fPoNo.value = d.po_no || '';
                fManufacturer.value = d.manufacturer || '';
                fApprovedModel.value = d.approved_model || '';

                currentStatus = d.req_status || '已確認';
                Modules.updateAuditButtons(winEl, currentStatus === '已確認', 'puri06');
                Modules.setFormMode(winEl, null, 'browse', statusMsg, fullReq);
                isDirty = false;
            };

            const clearDetail = async (autoNo = false) => {
                currentRecordId = 0;
                fType.value = '';
                const today = Modules.getTodayStr();
                fDocDate.value = today;
                fReqDate.value = today;
                fRequireDate.value = today;
                fDeliveryDate.value = today;
                fLineNo.value = '0001';

                if (autoNo) {
                    const cleanDocNo = await Modules.generateNextDocNo('requisition', today);
                    fDocNo.value = cleanDocNo;
                } else {
                    fDocNo.value = '';
                }

                fItemNo.value = '';
                fItemName.value = '';
                fItemSpec.value = '';
                fReqQty.value = '0';
                fReqUnit.value = 'PC';
                fPackReqQty.value = '0';
                fReqSmallUnit.value = '';
                fPackReqUnit.value = '';
                fReqRemark.value = '';
                fMinReplenish.value = '0';
                fProjectNo.value = '';
                fReqUser.value = '';

                fBuyer.value = '';
                fSupNo.value = '';
                fSupName.textContent = '';
                fDeliveryWh.value = 'P003';
                fMultiTax.checked = false;
                fPurQty.value = '0';
                fPackPurQty.value = '0';
                fPurUnit.value = 'PC';
                fPackPurUnit.value = '';
                fPurSmallUnit.value = '';
                fTradingTerms.value = '';
                fTaxCode.value = 'P05';
                fTaxType.value = '2 應稅外加';
                fTaxRate.value = '5.00';
                fCurrency.value = 'NTD';
                fPricingQty.value = '0';
                fPurPrice.value = '0';
                fPricingUnit.value = 'PC';
                fPurAmount.value = '0';
                fInquiryCode.value = 'N';
                fIsUrgent.checked = false;
                fPurRemark.value = '';
                fIsLocked.checked = false;
                fIsPurchased.checked = false;
                fCloseCode.value = 'N';
                fReqDept.value = '0100 業務部';
                fPoNo.value = '';
                fManufacturer.value = '';
                fApprovedModel.value = '';

                currentStatus = '未確認';
                Modules.updateAuditButtons(winEl, false, 'puri06');
                Modules.setFormMode(winEl, null, 'add', statusMsg, fDocNo.value);
                isDirty = false;
            };

            const resetPuri06Blank = () => {
                currentRecordId = 0;
                fType.value = '';
                fDocNo.value = '';
                fLineNo.value = '';
                fReqTypeSel.value = '';
                fDocDate.value = '';
                fReqDate.value = '';
                fRequireDate.value = '';
                fDeliveryDate.value = '';
                fChkDelivery.checked = false;

                fItemNo.value = '';
                fItemName.value = '';
                fItemSpec.value = '';
                fReqQty.value = '';
                fReqUnit.value = '';
                fPackReqQty.value = '';
                fReqSmallUnit.value = '';
                fPackReqUnit.value = '';
                fReqRemark.value = '';
                fMinReplenish.value = '';
                fProjectNo.value = '';
                fReqUser.value = '';
                fReqUserDesc.textContent = '';

                fBuyer.value = '';
                fBuyerDesc.textContent = '';
                fSupNo.value = '';
                fSupName.textContent = '';
                fDeliveryWh.value = '';
                fMultiTax.checked = false;
                fPurQty.value = '';
                fPackPurQty.value = '';
                fPurUnit.value = '';
                fPackPurUnit.value = '';
                fPurSmallUnit.value = '';
                fTradingTerms.value = '';
                fTaxCode.value = '';
                fTaxType.value = '';
                fTaxRate.value = '';
                fCurrency.value = '';
                fPricingQty.value = '';
                fPurPrice.value = '';
                fPricingUnit.value = '';
                fPurAmount.value = '';
                fInquiryCode.value = '';
                fIsUrgent.checked = false;
                fPurRemark.value = '';
                fIsLocked.checked = false;
                fIsPurchased.checked = false;
                fCloseCode.value = '';
                fReqDept.value = '';
                fPoNo.value = '';
                fManufacturer.value = '';
                fApprovedModel.value = '';

                currentStatus = '未確認';
                Modules.updateAuditButtons(winEl, false, 'puri06');
                if (statusCount) statusCount.textContent = '單身資料筆數: 0';
                Modules.setFormMode(winEl, null, 'browse', statusMsg, '');
                isDirty = false;
            };

            const doSave = async () => {
                const t = fType.value.trim();
                if (!t) {
                    alert('【必填檢查】請輸入或挑選請購單別！');
                    fType.focus();
                    return false;
                }
                const dNo = fDocNo.value.trim();
                if (!dNo) {
                    alert('【必填檢查】請輸入請購單號！');
                    fDocNo.focus();
                    return false;
                }
                const fullReqNo = dNo.includes('-') ? dNo : `${t}-${dNo}`;
                const payload = {
                    id: currentRecordId || 0,
                    req_no: fullReqNo,
                    line_no: fLineNo.value.trim() || '0001',
                    req_type: t,
                    req_type_sel: fReqTypeSel.value,
                    item_no: fItemNo.value.trim(),
                    item_name: fItemName.value.trim(),
                    item_spec: fItemSpec.value.trim(),
                    doc_date: fDocDate.value.trim() || Modules.getTodayStr(),
                    req_date: fReqDate.value.trim() || Modules.getTodayStr(),
                    req_qty: parseFloat(fReqQty.value) || 0,
                    req_unit: fReqUnit.value.trim() || 'PC',
                    pack_req_qty: parseFloat(fPackReqQty.value) || 0,
                    req_small_unit: fReqSmallUnit.value.trim(),
                    pack_req_unit: fPackReqUnit.value.trim(),
                    require_date: fRequireDate.value.trim() || Modules.getTodayStr(),
                    req_remark: fReqRemark.value.trim(),
                    min_replenish: parseFloat(fMinReplenish.value) || 0,
                    project_no: fProjectNo.value.trim(),
                    req_user: fReqUser.value.trim() || (App.currentUser?.username || ''),

                    buyer: fBuyer.value.trim() || (App.currentUser?.username || ''),
                    supplier_no: fSupNo.value.trim(),
                    delivery_wh: fDeliveryWh.value.trim() || 'P003',
                    multi_tax: fMultiTax.checked ? 1 : 0,
                    pur_qty: parseFloat(fPurQty.value) || 0,
                    pack_pur_qty: parseFloat(fPackPurQty.value) || 0,
                    pur_unit: fPurUnit.value.trim() || 'PC',
                    pack_pur_unit: fPackPurUnit.value.trim(),
                    pur_small_unit: fPurSmallUnit.value.trim(),
                    trading_terms: fTradingTerms.value.trim(),
                    tax_code: fTaxCode.value.trim() || 'P05',
                    tax_type: fTaxType.value || '2 應稅外加',
                    tax_rate: parseFloat(fTaxRate.value) || 5.00,
                    currency: fCurrency.value.trim() || 'NTD',
                    pricing_qty: parseFloat(fPricingQty.value) || 0,
                    pur_price: parseFloat(fPurPrice.value) || 0,
                    pricing_unit: fPricingUnit.value.trim() || 'PC',
                    pur_amount: parseFloat((fPurAmount.value || '').replace(/,/g, '')) || 0,
                    inquiry_code: fInquiryCode.value,
                    delivery_date: fDeliveryDate.value.trim() || Modules.getTodayStr(),
                    is_urgent: fIsUrgent.checked ? 1 : 0,
                    pur_remark: fPurRemark.value.trim(),
                    is_locked: fIsLocked.checked ? 1 : 0,
                    is_purchased: fIsPurchased.checked ? 1 : 0,
                    close_code: fCloseCode.value,
                    req_dept: fReqDept.value.trim() || '0100 業務部',
                    po_no: fPoNo.value.trim(),
                    manufacturer: fManufacturer.value.trim(),
                    approved_model: fApprovedModel.value.trim()
                };

                const res = await ERP_API.post('save_puri06_detail', payload);
                if (res.success) {
                    isDirty = false;
                    Modules.setFormMode(winEl, null, 'browse', statusMsg, fullReqNo);
                    Modules.toast(`請購明細 [${fullReqNo} - ${payload.line_no}] 儲存成功！`, 'success');
                    return true;
                } else {
                    Modules.toast('儲存失敗: ' + (res.error || '不明錯誤'), 'error');
                    return false;
                }
            };

            const loadBrowseList = async () => {
                const tbody = winEl.querySelector('#puri06-browse-tbody');
                const res = await ERP_API.get('get_puri06_list');
                if (res.success) {
                    const list = res.data || [];
                    statusCount.textContent = `單身資料筆數: ${list.length}`;
                    if (list.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="13" style="text-align:center; padding:20px; color:#888;">目前尚無請購資料</td></tr>';
                        return;
                    }
                    let rows = '';
                    list.forEach(r => {
                        const amt = Math.round(r.pur_amount || r.amount || 0);
                        const price = Math.round(r.pur_price || r.unit_price || 0);
                        rows += `
                            <tr data-id="${r.id}" style="cursor:pointer; height:20px;">
                                <td style="text-align:center;">▶</td>
                                <td style="font-weight:bold; color:#003366;">${r.req_no}</td>
                                <td style="text-align:center;">${r.line_no || '0001'}</td>
                                <td>${r.item_no || ''}</td>
                                <td>${r.item_name || ''}</td>
                                <td>${r.item_spec || ''}</td>
                                <td style="text-align:right;">${Math.round(r.req_qty || 0)}</td>
                                <td style="text-align:center;">${r.unit || 'PC'}</td>
                                <td style="text-align:right;">${price.toLocaleString()}</td>
                                <td style="text-align:right; font-weight:bold;">${amt.toLocaleString()}</td>
                                <td>${r.supplier_no || ''}</td>
                                <td>${r.buyer || ''}</td>
                                <td style="text-align:center; color:${r.req_status === '已確認' ? 'green' : '#888'}; font-weight:bold;">${r.req_status || '未確認'}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows;

                    tbody.querySelectorAll('tr[data-id]').forEach(tr => {
                        tr.addEventListener('click', () => {
                            checkDirtyBeforeAction(() => {
                                const id = tr.getAttribute('data-id');
                                const found = list.find(x => String(x.id) === String(id));
                                if (found) {
                                    fillDetail(found);
                                    switchTab('detail');
                                }
                            });
                        });
                    });
                }
            };

            const navDetail = async (dir) => {
                const res = await ERP_API.get('nav_puri06_detail', { dir, current_id: currentRecordId });
                if (res.success && res.data) {
                    fillDetail(res.data);
                } else {
                    alert('已無' + (dir === 'first' ? '第一筆' : dir === 'last' ? '最後一筆' : dir === 'prev' ? '上一筆' : '下一筆') + '資料');
                }
            };

            const checkDirtyBeforeAction = (callback) => {
                if (isDirty) {
                    const answer = confirm("資料尚未儲存，是否要儲存目前的請購資料？\n\n點選【確定】：進行儲存\n點選【取消】：直接清除放棄變更");
                    if (answer) {
                        doSave().then(saved => { if (saved) callback(); });
                    } else {
                        isDirty = false;
                        callback();
                    }
                } else {
                    callback();
                }
            };

            // Bind Navigation
            winEl.querySelector('#puri06-tb-first').addEventListener('click', () => checkDirtyBeforeAction(() => navDetail('first')));
            winEl.querySelector('#puri06-tb-prev').addEventListener('click', () => checkDirtyBeforeAction(() => navDetail('prev')));
            winEl.querySelector('#puri06-tb-next').addEventListener('click', () => checkDirtyBeforeAction(() => navDetail('next')));
            winEl.querySelector('#puri06-tb-last').addEventListener('click', () => checkDirtyBeforeAction(() => navDetail('last')));

            // Bind Lookups
            winEl.querySelector('#puri06-lookup-item').addEventListener('click', () => {
                Modules.openLookup('item', (it) => {
                    fItemNo.value = it.item_no;
                    fItemName.value = it.item_name;
                    fItemSpec.value = it.item_spec || '';
                    fReqUnit.value = it.unit || 'PC';
                    fPurUnit.value = it.unit || 'PC';
                    fPricingUnit.value = it.unit || 'PC';
                    fPurPrice.value = it.std_purchase_price || it.recent_purchase_price || 0;
                    if (!fReqQty.value || fReqQty.value === '0') fReqQty.value = '1';
                    fPurQty.value = fReqQty.value;
                    fPricingQty.value = fReqQty.value;
                    fDeliveryWh.value = it.main_warehouse || 'P003';
                    calcAmounts();
                    isDirty = true;
                });
            });

            winEl.querySelector('#puri06-lookup-buyer').addEventListener('click', () => {
                Modules.openLookup('personnel', (p) => {
                    fBuyer.value = p.emp_no || p.code;
                    fBuyerDesc.textContent = p.emp_name || p.name;
                    isDirty = true;
                });
            });

            winEl.querySelector('#puri06-lookup-sup').addEventListener('click', () => {
                Modules.openLookup('supplier', (s) => {
                    fSupNo.value = s.supplier_no;
                    fSupName.textContent = s.name_short || s.full_name || '';
                    isDirty = true;
                });
            });

            winEl.querySelector('#puri06-lookup-mfr').addEventListener('click', () => {
                Modules.openLookup('supplier', (s) => {
                    fManufacturer.value = s.name_short || s.full_name || '';
                    isDirty = true;
                });
            });

            winEl.querySelector('#puri06-lookup-wh').addEventListener('click', () => {
                Modules.openLookup('warehouse', (w) => {
                    fDeliveryWh.value = w.wh_no;
                    isDirty = true;
                });
            });

            fSupNo.addEventListener('blur', async () => {
                const sNo = fSupNo.value.trim();
                if (sNo) {
                    const res = await ERP_API.get('get_supplier', { supplier_no: sNo });
                    if (res.success && res.supplier) {
                        fSupName.textContent = res.supplier.name_short || res.supplier.full_name || '';
                    } else {
                        fSupName.textContent = '';
                    }
                } else {
                    fSupName.textContent = '';
                }
            });

            fBuyer.addEventListener('blur', async () => {
                const bNo = fBuyer.value.trim();
                if (bNo) {
                    const res = await ERP_API.get('get_employee', { emp_no: bNo });
                    if (res.success && res.employee) {
                        fBuyerDesc.textContent = res.employee.emp_name || '';
                    } else {
                        fBuyerDesc.textContent = '';
                    }
                } else {
                    fBuyerDesc.textContent = '';
                }
            });

            winEl.querySelector('#puri06-lookup-tax')?.addEventListener('click', () => {
                Modules.openLookup('tax_purchase', (tx) => {
                    if (fTaxCode) fTaxCode.value = tx.code || 'P05';
                    if (fTaxRate && tx.rate !== undefined) fTaxRate.value = parseFloat(tx.rate).toFixed(2);
                    if (fTaxType && tx.tax_type) {
                        fTaxType.value = tx.tax_type.includes('1:') ? '1 應稅內含' : (tx.tax_type.includes('2:') ? '2 應稅外加' : (tx.tax_type.includes('3:') ? '3 零稅率' : '4 免稅'));
                    }
                    isDirty = true;
                });
            });
            fTaxCode?.addEventListener('dblclick', () => {
                winEl.querySelector('#puri06-lookup-tax')?.click();
            });

            // Toolbar buttons
            winEl.querySelector('#puri06-tb-new').addEventListener('click', () => checkDirtyBeforeAction(() => {
                clearDetail(true);
                switchTab('detail');
            }));
            winEl.querySelector('#puri06-tb-edit').addEventListener('click', () => {
                const curNo = fDocNo.value.trim();
                if (!curNo) {
                    alert('請先查詢請購資料或點選「新增」！');
                    return;
                }
                switchTab('detail');
                const fullNo = curNo.includes('-') ? curNo : `${fType.value.trim() || 'A311'}-${curNo}`;
                Modules.setFormMode(winEl, null, 'edit', statusMsg, fullNo);
                Modules.toast(`請購明細 [${fullNo}] 進入修改模式`, 'info');
            });
            winEl.querySelector('#puri06-tb-save').addEventListener('click', doSave);
            winEl.querySelector('#puri06-tb-query').addEventListener('click', () => {
                checkDirtyBeforeAction(() => {
                    Modules.openLookup('requisition', async (r) => {
                        const res = await ERP_API.get('get_puri06_detail', { req_no: r.req_no });
                        if (res.success && res.data) {
                            fillDetail(res.data);
                            switchTab('detail');
                        } else {
                            const rRes = await ERP_API.get('get_requisition', { req_no: r.req_no });
                            if (rRes.success && rRes.details && rRes.details.length > 0) {
                                const d = rRes.details[0];
                                const merged = { ...rRes.header, ...d, req_status: rRes.header.status };
                                fillDetail(merged);
                                switchTab('detail');
                            } else {
                                alert(res.error || '查無請購明細資料');
                            }
                        }
                    });
                });
            });

            winEl.querySelector('#puri06-tb-confirm').addEventListener('click', async () => {
                const dNo = fDocNo.value.trim();
                if (!dNo) return;
                const fullReqNo = dNo.includes('-') ? dNo : `${fType.value.trim() || 'A311'}-${dNo}`;
                const res = await ERP_API.post('confirm_doc', { type: 'requisition', doc_no: fullReqNo, status: '已確認' });
                if (res.success) {
                    currentStatus = '已確認';
                    fIsLocked.checked = true;
                    Modules.updateAuditButtons(winEl, true, 'puri06');
                    Modules.toast('請購資料確認完成！', 'success');
                }
            });

            winEl.querySelector('#puri06-tb-unconfirm').addEventListener('click', async () => {
                const dNo = fDocNo.value.trim();
                if (!dNo) return;
                const fullReqNo = dNo.includes('-') ? dNo : `${fType.value.trim() || 'A311'}-${dNo}`;
                const res = await ERP_API.post('confirm_doc', { type: 'requisition', doc_no: fullReqNo, status: '未確認' });
                if (res.success) {
                    currentStatus = '未確認';
                    fIsLocked.checked = false;
                    Modules.updateAuditButtons(winEl, false, 'puri06');
                    Modules.toast('請購資料已取消確認！', 'info');
                }
            });

            winEl.querySelector('#puri06-tb-cancel').addEventListener('click', () => {
                if (isDirty) {
                    const answer = confirm("資料尚未儲存，是否要儲存目前的請購資料？\n\n點選【確定】：進行儲存\n點選【取消】：直接清除放棄變更");
                    if (answer) {
                        doSave();
                    } else {
                        resetPuri06Blank();
                        Modules.toast('已取消並清除未儲存變更。', 'info');
                    }
                } else {
                    resetPuri06Blank();
                    Modules.toast('已清除重置頁面資料。', 'info');
                }
            });

            winEl.querySelector('#puri06-tb-del').addEventListener('click', async () => {
                const dNo = fDocNo.value.trim();
                if (!dNo) return;
                const fullReqNo = dNo.includes('-') ? dNo : `${fType.value.trim() || 'A311'}-${dNo}`;
                if (confirm(`確定要刪除請購單 [${fullReqNo}] 嗎？`)) {
                    const res = await ERP_API.post('delete_requisition', { req_no: fullReqNo });
                    if (res.success) {
                        Modules.toast('請購資料已成功刪除！', 'success');
                        clearDetail(true);
                    } else {
                        Modules.toast('刪除失敗: ' + (res.error || '不明錯誤'), 'error');
                    }
                }
            });

            // Initial load: 100% 空白模式，按新增或查詢才出現
            resetPuri06Blank();
        });
    },

    // ========================================================
    // ========================================================
    // 10. 請購資料更新作業 (PURB01) - 1:1 參考圖11與進階選項 (media_1793952737133_6e6160d1.jpg)
    // ========================================================
    openPURB01() {
        const u = App.currentUser?.company || '學生區';
        const title = `請購資料更新作業(PURB01)[${u}]`;
        const winId = 'PURB01';

        const html = `
            <!-- Tabs (基本選項 / 進階選項 / 系統選項) -->
            <div class="erp-tab-header" style="height:26px; border-bottom:1px solid #7F9DB9; display:flex; align-items:flex-end; background:#ECE9D8; padding-left:2px;">
                <button type="button" class="erp-tab-btn active" id="purb01-tab-basic">基本選項</button>
                <button type="button" class="erp-tab-btn" id="purb01-tab-adv">進階選項</button>
                <button type="button" class="erp-tab-btn" id="purb01-tab-sys">系統選項</button>
            </div>

            <div style="display:flex; flex:1; background:#ECE9D8; padding:10px 14px; gap:16px; font-size:12px; font-family:Tahoma, 'Microsoft JhengHei', sans-serif;">
                <!-- Tab 1: 基本選項 View (1:1 參考圖11) -->
                <div id="purb01-view-basic" style="display:flex; flex:1; gap:16px;">
                    <!-- Left Panel -->
                    <div style="display:flex; flex-direction:column; gap:10px; width:220px;">
                        <!-- GroupBox: 選擇請購單號 -->
                        <fieldset style="border:1px solid #999; padding:6px 10px; border-radius:2px; margin:0;">
                            <legend style="padding:0 4px; color:#000;">選擇請購單號</legend>
                            <div style="display:flex; align-items:center; margin-bottom:6px;">
                                <label style="display:inline-flex; align-items:center; gap:4px; cursor:pointer;">
                                    <input type="checkbox" id="purb01-chk-range" checked> 區間選擇
                                </label>
                            </div>
                            <div style="display:flex; align-items:center; margin-bottom:4px;">
                                <label style="width:20px; margin-right:4px;">起</label>
                                <input type="text" id="purb01-req-start" class="erp-input-cyan" style="width:130px; font-weight:bold;" value="">
                                <button type="button" class="lookup-icon-btn" id="purb01-lookup-start" style="margin-left:3px;" title="挑選請購單號">📖</button>
                            </div>
                            <div style="display:flex; align-items:center;">
                                <label style="width:20px; margin-right:4px;">迄</label>
                                <input type="text" id="purb01-req-end" style="width:130px;" value="">
                                <button type="button" class="lookup-icon-btn" id="purb01-lookup-end" style="margin-left:3px;" title="挑選請購單號">📖</button>
                            </div>
                        </fieldset>

                        <!-- 鎖定選項 -->
                        <div style="display:flex; align-items:center;">
                            <label style="margin-right:6px;">鎖定選項</label>
                            <select id="purb01-lock-opt" style="flex:1;">
                                <option value="1" selected>未鎖定</option>
                                <option value="0">已鎖定</option>
                                <option value="all">全部</option>
                            </select>
                        </div>

                        <!-- 選擇廠別 (參考圖片TP01/TY01，不預設) -->
                        <div style="display:flex; align-items:center;">
                            <label style="margin-right:6px;">選擇廠別</label>
                            <input type="text" id="purb01-factory" style="width:90px;" value="">
                            <button type="button" class="lookup-icon-btn" id="purb01-lookup-plant" style="margin-left:4px;" title="挑選廠別">🏭</button>
                        </div>

                        <!-- GroupBox: 選擇庫別 -->
                        <fieldset style="border:1px solid #999; padding:6px; border-radius:2px; margin:0; flex:1; display:flex; flex-direction:column;">
                            <legend style="padding:0 4px; color:#000;">選擇庫別</legend>
                            <div style="display:flex; flex:1; gap:6px;">
                                <div style="flex:1; background:#FFF; border:1px solid #7F9DB9; min-height:85px; padding:2px; font-size:11px;" id="purb01-wh-box">
                                </div>
                                <div style="display:flex; flex-direction:column; gap:3px;">
                                    <button type="button" class="lookup-icon-btn" title="新增庫別" id="purb01-add-wh" style="width:20px; height:20px;">☖</button>
                                    <button type="button" class="lookup-icon-btn" title="剪下" style="width:20px; height:20px;">✂</button>
                                    <button type="button" class="lookup-icon-btn" title="刪除庫別" id="purb01-del-wh" style="width:20px; height:20px;">🗑</button>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <!-- Middle Panel -->
                    <div style="display:flex; flex-direction:column; gap:10px; width:220px;">
                        <!-- 選擇幣別 -->
                        <div style="display:flex; align-items:center;">
                            <label style="margin-right:6px;">選擇幣別</label>
                            <input type="text" id="purb01-currency" style="width:80px;" value="">
                            <button type="button" class="lookup-icon-btn" style="margin-left:4px; font-size:11px;">$</button>
                        </div>

                        <!-- GroupBox: 選擇採購人員 (不預設，讓使用者選擇) -->
                        <fieldset style="border:1px solid #999; padding:6px; border-radius:2px; margin:0; flex:1; display:flex; flex-direction:column;">
                            <legend style="padding:0 4px; color:#000;">選擇採購人員</legend>
                            <div style="display:flex; flex:1; gap:6px;">
                                <div style="flex:1; background:#FFF; border:1px solid #7F9DB9; min-height:165px; padding:2px; font-size:11px;" id="purb01-buyer-box">
                                </div>
                                <div style="display:flex; flex-direction:column; gap:3px;">
                                    <button type="button" class="lookup-icon-btn" title="新增採購人員" id="purb01-add-buyer" style="width:20px; height:20px;">👤</button>
                                    <button type="button" class="lookup-icon-btn" title="剪下" style="width:20px; height:20px;">✂</button>
                                    <button type="button" class="lookup-icon-btn" title="刪除採購人員" id="purb01-del-buyer" style="width:20px; height:20px;">🗑</button>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>

                <!-- Tab 2: 進階選項 View (1:1 參考用戶圖片 media_1793952737133_6e6160d1.jpg) -->
                <div id="purb01-view-adv" style="display:none; flex:1; flex-direction:column; gap:12px; padding:10px 14px;">
                    <!-- 輸入採購日期 -->
                    <div style="display:flex; align-items:center; gap:8px;">
                        <label style="width:90px; color:#000; text-align:right;">輸入採購日期</label>
                        <input type="text" id="purb01-po-date" class="erp-input-yellow" style="width:115px; height:20px; font-size:12px; background:#FFFFB0;" value="2026/11/05">
                        <button type="button" class="lookup-icon-btn" id="purb01-cal-po-date" style="width:22px; height:20px;" title="挑選日期">📅</button>
                    </div>

                    <!-- 輸入採購單別 -->
                    <div style="display:flex; align-items:center; gap:8px;">
                        <label style="width:90px; color:#000; text-align:right;">輸入採購單別</label>
                        <input type="text" id="purb01-po-type" class="erp-input-yellow" style="width:115px; height:20px; font-size:12px; background:#FFFFB0;" value="">
                        <button type="button" class="lookup-icon-btn" id="purb01-lookup-potype" style="width:22px; height:20px;" title="挑選採購單別">📑</button>
                    </div>

                    <!-- 輸入流程代號 -->
                    <div style="display:flex; align-items:center; gap:8px;">
                        <label style="width:90px; color:#000; text-align:right;">輸入流程代號</label>
                        <input type="text" id="purb01-flow-code" style="width:115px; height:20px; font-size:12px; background:#FFF; border:1px solid #7F9DB9;" value="">
                        <button type="button" class="lookup-icon-btn" id="purb01-lookup-flow" style="width:22px; height:20px;" title="挑選流程">🔍</button>
                    </div>

                    <!-- Checkboxes -->
                    <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px; padding-left:22px;">
                        <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                            <input type="checkbox" id="purb01-chk-same-date">
                            <span>相同交貨日彙總產生</span>
                        </label>
                        <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                            <input type="checkbox" id="purb01-chk-same-item">
                            <span>相同品號不同品名規格彙總產生</span>
                        </label>
                        <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                            <input type="checkbox" id="purb01-chk-transfer-memo" checked>
                            <span>拋轉備註</span>
                        </label>
                    </div>
                </div>

                <!-- Tab 3: 系統選項 View -->
                <div id="purb01-view-sys" style="display:none; flex:1; flex-direction:column; gap:10px; padding:12px 16px;">
                    <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                        <input type="checkbox" checked>
                        <span>佇列工作台背景自動執行</span>
                    </label>
                    <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                        <input type="checkbox" checked>
                        <span>作業完成自動提醒與彈窗</span>
                    </label>
                </div>

                <!-- Right Side (Dialog Buttons - 1:1 參考圖11) -->
                <div style="display:flex; flex-direction:column; gap:8px; width:100px; margin-left:auto;">
                    <button type="button" id="purb01-btn-confirm" style="height:26px; display:flex; align-items:center; justify-content:center; gap:6px; background:#ECE9D8; border:1px solid #7F9DB9; border-radius:2px; cursor:pointer; font-size:12px; font-weight:bold;">
                        <span style="color:#008000; font-size:14px;">✔</span> 確認
                    </button>
                    <button type="button" id="purb01-btn-cancel" onclick="App.closeWindow('${winId}')" style="height:26px; display:flex; align-items:center; justify-content:center; gap:6px; background:#ECE9D8; border:1px solid #7F9DB9; border-radius:2px; cursor:pointer; font-size:12px; font-weight:bold;">
                        <span style="color:#CC0000; font-size:14px;">✖</span> 取消
                    </button>
                    <button type="button" id="purb01-btn-period" onclick="alert('已設定為週期性自動排程更新')" style="height:26px; display:flex; align-items:center; justify-content:center; gap:6px; background:#ECE9D8; border:1px solid #7F9DB9; border-radius:2px; cursor:pointer; font-size:12px;">
                        <span style="color:#000099; font-size:14px;">🔄</span> 週期性
                    </button>
                    <button type="button" id="purb01-btn-custom" onclick="alert('開啟自訂篩選條件精靈')" style="height:26px; display:flex; align-items:center; justify-content:center; gap:6px; background:#ECE9D8; border:1px solid #7F9DB9; border-radius:2px; cursor:pointer; font-size:12px;">
                        <span style="color:#000099; font-size:12px;">▶</span> 自訂
                    </button>
                </div>
            </div>
        `;

        App.openWindow(winId, title, html, 630, 360, (winEl) => {
            const tabBasic = winEl.querySelector('#purb01-tab-basic');
            const tabAdv = winEl.querySelector('#purb01-tab-adv');
            const tabSys = winEl.querySelector('#purb01-tab-sys');
            const viewBasic = winEl.querySelector('#purb01-view-basic');
            const viewAdv = winEl.querySelector('#purb01-view-adv');
            const viewSys = winEl.querySelector('#purb01-view-sys');

            const setTab = (activeTab) => {
                [tabBasic, tabAdv, tabSys].forEach(t => {
                    t.classList.remove('active');
                    t.style.background = '';
                    t.style.color = '';
                    t.style.fontWeight = '';
                });
                activeTab.classList.add('active');

                viewBasic.style.display = (activeTab === tabBasic) ? 'flex' : 'none';
                viewAdv.style.display = (activeTab === tabAdv) ? 'flex' : 'none';
                viewSys.style.display = (activeTab === tabSys) ? 'flex' : 'none';
            };

            tabBasic.addEventListener('click', () => setTab(tabBasic));
            tabAdv.addEventListener('click', () => setTab(tabAdv));
            tabSys.addEventListener('click', () => setTab(tabSys));

            const reqStartInp = winEl.querySelector('#purb01-req-start');
            const reqEndInp = winEl.querySelector('#purb01-req-end');

            winEl.querySelector('#purb01-lookup-start').addEventListener('click', () => {
                Modules.openLookup('requisition', (r) => {
                    reqStartInp.value = r.req_no;
                });
            });

            winEl.querySelector('#purb01-lookup-end').addEventListener('click', () => {
                Modules.openLookup('requisition', (r) => {
                    reqEndInp.value = r.req_no;
                });
            });

            winEl.querySelector('#purb01-lookup-plant').addEventListener('click', () => {
                Modules.openLookup('factory', (f) => {
                    winEl.querySelector('#purb01-factory').value = f.factory_no || f.code;
                });
            });

            // 挑選採購單別 (開窗查詢 1:1 參考圖片 media_1793952822846_40503261.jpg)
            const poTypeInp = winEl.querySelector('#purb01-po-type');
            winEl.querySelector('#purb01-lookup-potype').addEventListener('click', () => {
                Modules.openLookup('doc_type_po', (t) => {
                    poTypeInp.value = t.code;
                });
            });

            // 挑選採購日期
            const poDateInp = winEl.querySelector('#purb01-po-date');
            winEl.querySelector('#purb01-cal-po-date').addEventListener('click', () => {
                poDateInp.value = Modules.getTodayStr();
            });

            // 流程代號
            winEl.querySelector('#purb01-lookup-flow').addEventListener('click', () => {
                Modules.toast('已選擇標準採購流程 [001]', 'info');
                winEl.querySelector('#purb01-flow-code').value = '001';
            });

            // 採購人員清單盒控制
            let purb01Buyers = [];
            let purb01BuyerIdx = -1;
            const renderBuyerBox = () => {
                const box = winEl.querySelector('#purb01-buyer-box');
                if (purb01Buyers.length === 0) {
                    box.innerHTML = '<div style="color:#888; padding:4px;">(尚未選擇採購人員，點 👤 新增)</div>';
                    return;
                }
                box.innerHTML = purb01Buyers.map((b, idx) => `
                    <div class="purb01-buyer-item" data-idx="${idx}" style="padding:2px 4px; cursor:pointer; ${idx === purb01BuyerIdx ? 'background:#0A246A; color:#FFF;' : ''}">
                        ${b.emp_no} ${b.emp_name}
                    </div>
                `).join('');
                box.querySelectorAll('.purb01-buyer-item').forEach(el => {
                    el.addEventListener('click', () => {
                        purb01BuyerIdx = parseInt(el.getAttribute('data-idx'));
                        renderBuyerBox();
                    });
                });
            };
            renderBuyerBox();

            winEl.querySelector('#purb01-add-buyer').addEventListener('click', () => {
                Modules.openLookup('personnel', (p) => {
                    const empNo = p.emp_no || p.code;
                    const empName = p.emp_name || p.name || '';
                    if (empNo && !purb01Buyers.find(x => x.emp_no === empNo)) {
                        purb01Buyers.push({ emp_no: empNo, emp_name: empName });
                        purb01BuyerIdx = purb01Buyers.length - 1;
                        renderBuyerBox();
                    }
                });
            });
            winEl.querySelector('#purb01-del-buyer').addEventListener('click', () => {
                if (purb01BuyerIdx >= 0 && purb01BuyerIdx < purb01Buyers.length) {
                    purb01Buyers.splice(purb01BuyerIdx, 1);
                    purb01BuyerIdx = Math.max(0, purb01Buyers.length - 1);
                } else {
                    purb01Buyers.pop();
                }
                renderBuyerBox();
            });

            // Confirm Action: calls batch_update_req, registers in QUEUE_CONSOLE, generates PO!
            winEl.querySelector('#purb01-btn-confirm').addEventListener('click', async () => {
                const s = reqStartInp.value.trim();
                const e = reqEndInp.value.trim();
                const factory = winEl.querySelector('#purb01-factory').value.trim();
                if (!factory) {
                    alert('【必填檢查】請選擇廠別 (例如 TP01 或 TY01)！');
                    setTab(tabBasic);
                    winEl.querySelector('#purb01-factory').focus();
                    return;
                }
                const currency = winEl.querySelector('#purb01-currency').value.trim() || 'NTD';
                const lockOpt = winEl.querySelector('#purb01-lock-opt').value;
                const poType = poTypeInp ? poTypeInp.value.trim() : '';
                if (!poType) {
                    alert('【必填檢查】請輸入或挑選採購單別！');
                    setTab(tabAdv);
                    if (poTypeInp) poTypeInp.focus();
                    return;
                }
                const poDate = poDateInp ? (poDateInp.value.trim() || Modules.getTodayStr()) : Modules.getTodayStr();

                const res = await ERP_API.post('batch_update_req', {
                    req_no_start: s,
                    req_no_end: e,
                    factory: factory,
                    currency: currency,
                    lock_option: lockOpt,
                    po_type: poType,
                    po_date: poDate
                });

                if (res.success) {
                    const poList = (res.po_nos && res.po_nos.length > 0) ? res.po_nos.join(', ') : `${poType}-202611001`;
                    Modules.toast(`請購資料更新作業已成功送出至佇列工作控制台！`, 'success');
                    
                    setTimeout(() => {
                        alert(`請購資料更新作業已成功送出！\n\n已登錄佇列工作控制台 (工作代號: ${res.job_id || '20261106'})\n即將自動開啟【佇列工作控制台】，點選立即處理 ⚙️ 即可轉成【採購單建立作業 (PURI07)】。`);
                        Modules.open('QUEUE_CONSOLE');
                    }, 300);
                } else {
                    Modules.toast('更新失敗: ' + (res.error || '不明錯誤'), 'error');
                }
            });
        });
    },

    // ========================================================
    // 11. 採購單建立作業 (PURI07) - 1:1
    // ========================================================
    openPURI07() {
        const u = App.currentUser?.company || '學生區';
        const title = `採購單建立作業 (PURI07)[${u}]`;
        const winId = 'PURI07';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">資料(<u>D</u>)</span>
                <span class="erp-menu-item">功能(<u>F</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="新增空白採購單" id="puri07-tb-new">📄</button>
                <button class="erp-tb-btn" title="查詢" id="puri07-tb-query">🔍</button>
                <button class="erp-tb-btn" title="修改" id="puri07-tb-edit">✏️</button>
                <button class="erp-tb-btn" title="刪除" id="puri07-tb-del">🗑️</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('採購單格式產生中...')">🖨️</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="首筆" id="puri07-tb-first">|◀</button>
                <button class="erp-tb-btn" title="上筆" id="puri07-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下筆" id="puri07-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="puri07-tb-last">▶|</button>
                <button class="erp-tb-btn tb-btn-crossquery" title="串查作業 (供應商/品號查詢)" id="puri07-tb-crossquery">
                    <img src="assets/icons/cross_query.png" alt="串查">
                    <span class="tb-dropdown-arrow">▼</span>
                </button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="複製前置單據 (請購單/前筆採購)" id="puri07-tb-copy">📋</button>
                <button class="erp-tb-btn" title="儲存" id="puri07-tb-save" style="color:#008000; font-weight:bold; font-size:15px;">✔</button>
                <button class="erp-tb-btn tb-btn-cancel" title="取消 (清除放棄未儲存變更)" id="puri07-tb-cancel" style="color:#CC0000; font-weight:bold; font-size:15px;">✖</button>
                <button class="erp-tb-btn" title="確認" id="puri07-tb-confirm">
                    <img src="assets/icons/confirm_active.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
                <button class="erp-tb-btn" title="取消確認" id="puri07-tb-unconfirm">
                    <img src="assets/icons/unconfirm_disabled.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
                <button class="erp-tb-btn btn-transfer" title="產生進貨單 (PURI09)" onclick="Modules.open('PURI09')">📥</button>
            </div>

            <!-- Top Tab Header (1:1 擷取12.PNG) -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="puri07-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="puri07-tab-browse">資料瀏覽</button>
            </div>

            <!-- Detail View -->
            <div id="puri07-view-detail" style="display:flex; flex-direction:column; flex:1;">
                <!-- Header Panel (1:1 擷取12.PNG - 4列對齊排版) -->
                <div class="erp-header-panel" style="background:#ECE9D8; padding:6px 14px; border-bottom:1px solid #7F9DB9; flex-shrink:0;">
                    <div class="erp-stamp-he" style="display:none;">核</div>
                    <!-- Row 1 -->
                    <div class="erp-form-row" style="margin-bottom:2px; display:flex; align-items:center;">
                        <div class="erp-field" style="width:230px;">
                            <label style="width:60px;">採購單別</label>
                            <input type="text" id="puri07-type" class="erp-input-cyan" style="width:65px;" value="">
                            <button type="button" class="lookup-icon-btn" id="puri07-lookup-type" title="挑選單別">🗎</button>
                            <span class="erp-field-desc" id="puri07-type-desc"></span>
                        </div>
                        <div class="erp-field" style="width:270px; margin-left:20px;">
                            <label style="width:60px;">單據日期</label>
                            <input type="text" id="puri07-doc-date" class="erp-input-yellow" style="width:85px; text-align:center;" value="" placeholder=" /  / ">
                            <input type="checkbox" id="puri07-chk-date" style="margin-left:4px;">
                        </div>
                        <div class="erp-field" style="margin-left:20px;">
                            <label style="width:65px;">拋轉狀態</label>
                            <input type="text" id="puri07-trans-status" class="erp-input-readonly" style="width:115px;" value="" readonly>
                        </div>
                    </div>
                    <!-- Row 2 -->
                    <div class="erp-form-row" style="margin-bottom:2px; display:flex; align-items:center;">
                        <div class="erp-field" style="width:230px;">
                            <label style="width:60px;">採購單號</label>
                            <input type="text" id="puri07-no" class="erp-input-cyan" style="width:130px;" value="">
                        </div>
                        <div class="erp-field" style="width:270px; margin-left:20px;">
                            <label style="width:60px;">供應廠商</label>
                            <input type="text" id="puri07-sup-no" class="erp-input-yellow" style="width:80px;" value="">
                            <button type="button" class="lookup-icon-btn" id="puri07-lookup-sup" title="挑選供應商">👤</button>
                            <span class="erp-field-desc" id="puri07-sup-name" style="min-width:60px;"></span>
                        </div>
                        <div class="erp-field" style="margin-left:20px;">
                            <label style="width:65px;">採購日期</label>
                            <input type="text" id="puri07-po-date" style="width:85px; text-align:center;" value="" placeholder=" /  / ">
                        </div>
                    </div>
                    <!-- Row 3 -->
                    <div class="erp-form-row" style="margin-bottom:2px; display:flex; align-items:center;">
                        <div class="erp-field" style="width:230px;">
                            <label style="width:60px;">流程代號</label>
                            <input type="text" id="puri07-flow-no" style="width:50px;" value="">
                            <button type="button" class="lookup-icon-btn" id="puri07-lookup-flow" title="挑選流程">🗎</button>
                        </div>
                        <div style="width:270px; margin-left:20px;"></div>
                        <div class="erp-field" style="margin-left:20px;">
                            <label style="width:65px;">確認者</label>
                            <input type="text" id="puri07-confirm-user" class="erp-input-readonly" style="width:85px;" value="" readonly>
                        </div>
                    </div>
                    <!-- Row 4 -->
                    <div class="erp-form-row" style="display:flex; align-items:center;">
                        <div style="width:230px;"></div>
                        <div class="erp-field" style="width:270px; margin-left:20px;">
                            <label style="width:60px;">版次</label>
                            <input type="text" id="puri07-version" style="width:40px; text-align:center;" value="">
                        </div>
                        <div class="erp-field" style="margin-left:20px;">
                            <label style="width:80px;">EBO拋轉狀態</label>
                            <input type="text" id="puri07-ebo-status" class="erp-input-readonly" style="width:95px;" value="不需拋轉" readonly>
                        </div>
                    </div>
                </div>

                <!-- Subtab Header (1:1 擷取12.PNG) -->
                <div class="erp-subtab-header" style="flex-shrink:0; display:flex; align-items:center; background:#ECE9D8; border-bottom:1px solid #7F9DB9; padding:2px 4px 0 4px;">
                    <button type="button" class="erp-subtab-btn active" data-subtab="trade1">交易資料一</button>
                    <button type="button" class="erp-subtab-btn" data-subtab="trade2">交易資料二</button>
                    <button type="button" class="erp-subtab-btn" data-subtab="multi_trade">多角貿易</button>
                    <button type="button" class="erp-subtab-btn" data-subtab="data_browse">資料瀏覽</button>
                    <div style="margin-left:auto; display:flex; gap:2px;">
                        <button type="button" class="cal-nav-btn" style="width:16px; height:18px; padding:0; font-size:10px;">◀</button>
                        <button type="button" class="cal-nav-btn" style="width:16px; height:18px; padding:0; font-size:10px;">▶</button>
                    </div>
                </div>

                <!-- Subtab Content: 交易資料一 (1:1 擷取12.PNG - 3欄6列排版) -->
                <div id="puri07-subtab-trade1" class="erp-tab-content" style="flex-shrink:0; display:flex; gap:16px; padding:4px 12px; background:#ECE9D8; font-size:12px;">
                    <!-- Col 1 -->
                    <div style="display:flex; flex-direction:column; gap:3px; min-width:270px;">
                        <div class="erp-field">
                            <label style="width:65px;">廠別代號</label>
                            <input type="text" id="puri07-factory" class="erp-input-yellow" style="width:75px;" value="TP01">
                            <button type="button" class="lookup-icon-btn" id="puri07-lookup-factory" title="挑選廠別">🏭</button>
                        </div>
                        <div class="erp-field">
                            <label style="width:65px;">採購人員</label>
                            <input type="text" id="puri07-user" style="width:75px;" value="">
                            <button type="button" class="lookup-icon-btn" id="puri07-lookup-user" title="挑選採購人員">👤</button>
                            <span class="erp-field-desc" id="puri07-user-desc"></span>
                        </div>
                        <div class="erp-field">
                            <label style="width:65px;">交易幣別</label>
                            <input type="text" id="puri07-currency" class="erp-input-yellow" style="width:55px;" value="NTD">
                            <button type="button" class="lookup-icon-btn" id="puri07-lookup-currency" title="挑選幣別" style="color:#008000; font-weight:bold; font-family:monospace; font-size:13px;">$</button>
                            <label style="width:35px; margin-left:8px;">匯率</label>
                            <input type="text" id="puri07-rate" style="width:65px; text-align:right;" value="0">
                            <button type="button" class="lookup-icon-btn" title="匯率" style="margin-left:4px; color:#008000; font-weight:bold; font-family:monospace; font-size:13px;">$</button>
                        </div>
                        <div class="erp-field">
                            <label style="width:65px;">稅別碼</label>
                            <input type="text" id="puri07-tax-code" class="erp-input-yellow" style="width:45px;" value="P05">
                            <button type="button" class="lookup-icon-btn" id="puri07-lookup-tax" title="挑選稅別">🗎</button>
                            <span class="erp-field-desc" id="puri07-tax-desc">進項三聯式發票-應稅外加</span>
                        </div>
                        <div class="erp-field">
                            <label style="width:65px;">備註</label>
                            <input type="text" id="puri07-remark" style="width:230px;" value="">
                            <button type="button" class="lookup-icon-btn" title="輸入備註">📝</button>
                        </div>
                        <div class="erp-field">
                            <label style="width:auto; cursor:pointer;"><input type="checkbox" id="puri07-chk-ebc-confirm"> EBC確認碼</label>
                            <label style="width:75px; margin-left:12px;">EBC採購單號</label>
                            <input type="text" id="puri07-ebc-po-no" style="width:95px;" value="">
                        </div>
                    </div>

                    <!-- Col 2 -->
                    <div style="display:flex; flex-direction:column; gap:3px; min-width:210px;">
                        <div class="erp-field">
                            <label style="width:55px;">列印格式</label>
                            <select id="puri07-print-format" style="width:90px;">
                                <option value="1:標準格式" selected>1:標準格式</option>
                                <option value="2:簡短格式">2:簡短格式</option>
                            </select>
                        </div>
                        <div class="erp-field">
                            <label style="width:55px;">運輸方式</label>
                            <input type="text" id="puri07-ship-via" style="width:55px;" value="">
                            <button type="button" class="lookup-icon-btn">🗎</button>
                        </div>
                        <div class="erp-field">
                            <label style="width:auto; cursor:pointer;"><input type="checkbox" id="puri07-chk-deposit"> 訂金分批</label>
                        </div>
                        <div class="erp-field">
                            <label style="width:55px;">課稅別</label>
                            <select id="puri07-tax-type" style="width:115px;">
                                <option value="2:應稅外加" selected>2:應稅外加</option>
                                <option value="1:應稅內含">1:應稅內含</option>
                                <option value="3:零稅率">3:零稅率</option>
                                <option value="4:免稅">4:免稅</option>
                                <option value="9:不計稅">9:不計稅</option>
                            </select>
                        </div>
                        <div class="erp-field">
                            <label style="width:35px;">列印</label>
                            <input type="text" id="puri07-print-count" class="erp-input-readonly" style="width:40px; text-align:center;" value="0" readonly>
                            <label style="width:55px; margin-left:8px;">傳送次數</label>
                            <input type="text" id="puri07-send-count" class="erp-input-readonly" style="width:40px; text-align:center;" value="0" readonly>
                        </div>
                        <div class="erp-field">
                            <label style="width:75px;">EBC採購版次</label>
                            <input type="text" id="puri07-ebc-version" style="width:45px; text-align:center;" value="">
                        </div>
                    </div>

                    <!-- Col 3 -->
                    <div style="display:flex; flex-direction:column; gap:3px; min-width:170px;">
                        <div class="erp-field">
                            <label style="width:55px;">簽核狀態</label>
                            <input type="text" id="puri07-sign-status" class="erp-input-readonly" style="width:105px;" value="N:不執行電子簽核" readonly>
                        </div>
                        <div style="height:22px;"></div>
                        <div class="erp-field">
                            <label style="width:55px;">訂金比率</label>
                            <input type="text" id="puri07-deposit-rate" style="width:50px; text-align:right;" value="">
                            <span style="margin-left:4px;">%</span>
                        </div>
                        <div class="erp-field">
                            <label style="width:55px;">營業稅率</label>
                            <input type="text" id="puri07-tax-rate" style="width:50px; text-align:right;" value="5.000">
                            <span style="margin-left:4px;">%</span>
                        </div>
                        <div class="erp-field">
                            <label style="width:auto; cursor:pointer;"><input type="checkbox" id="puri07-chk-multitax"> 單身多稅率</label>
                        </div>
                        <div class="erp-field">
                            <label style="width:auto; cursor:pointer;"><input type="checkbox" id="puri07-chk-ebc-export"> 匯至EBC</label>
                        </div>
                    </div>
                </div>

                <!-- Dynamic DataGrid (1:1 擷取12.PNG) -->
                <div class="erp-datagrid-container" style="flex:1; min-height:80px; overflow:auto;">
                    <table class="erp-grid-table">
                        <thead>
                            <tr>
                                <th style="width:22px;">📄</th>
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

                <!-- Bottom Totals Summary (1:1 擷取12.PNG) -->
                <div class="erp-totals-panel" style="flex-shrink:0; background:#ECE9D8; border-top:1px solid #7F9DB9; padding:4px 14px; font-size:12px; display:flex; flex-direction:column; gap:3px;">
                    <div style="display:flex; align-items:center; gap:20px;">
                        <div class="erp-field" style="display:flex; align-items:center;">
                            <label style="width:65px; text-align:right; margin-right:4px;">採購金額</label>
                            <input type="text" id="puri07-tot-amt" class="erp-totals-inp" style="width:160px; text-align:right;" value="0" readonly>
                        </div>
                        <div class="erp-field" style="display:flex; align-items:center;">
                            <label style="width:55px; text-align:right; margin-right:4px;">稅額</label>
                            <input type="text" id="puri07-tot-tax" class="erp-totals-inp" style="width:160px; text-align:right;" value="0" readonly>
                        </div>
                        <div class="erp-field" style="display:flex; align-items:center;">
                            <label style="width:65px; text-align:right; margin-right:4px; font-weight:bold;">金額合計</label>
                            <input type="text" id="puri07-tot-grand" class="erp-totals-inp" style="width:160px; text-align:right; font-weight:bold;" value="0" readonly>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:20px;">
                        <div class="erp-field" style="display:flex; align-items:center;">
                            <label style="width:65px; text-align:right; margin-right:4px;">數量合計</label>
                            <input type="text" id="puri07-tot-qty" class="erp-totals-inp" style="width:160px; text-align:right;" value="0" readonly>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Browse View -->
            <div id="puri07-view-browse" style="display:none; flex-direction:column; flex:1; padding:4px;">
                <table class="erp-grid-table">
                    <thead>
                        <tr>
                            <th style="width:25px;"></th>
                            <th style="width:75px;">採購單別</th>
                            <th class="th-cyan" style="width:110px;">採購單號</th>
                            <th style="width:85px;">採購日期</th>
                            <th style="width:80px;">供應商代號</th>
                            <th style="width:140px;">供應商簡稱</th>
                            <th style="width:85px;">採購金額</th>
                            <th style="width:75px;">稅額</th>
                            <th style="width:85px;">合計</th>
                            <th style="width:65px;">狀態</th>
                        </tr>
                    </thead>
                    <tbody id="puri07-browse-tbody">
                        <tr><td colspan="10" style="text-align:center; padding:20px;">載入採購單清單中...</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Statusbar (1:1 擷取12.PNG) -->
            <div class="erp-window-statusbar">
                <span class="status-cell">瀏覽</span>
                <span class="status-cell" id="puri07-status-msg">單身資料筆數: 0</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 960, 675, (winEl) => {
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
            const fTransStatus = winEl.querySelector('#puri07-trans-status');
            const fFlowNo = winEl.querySelector('#puri07-flow-no');
            const fVersion = winEl.querySelector('#puri07-version');
            const fEboStatus = winEl.querySelector('#puri07-ebo-status');

            const fFactory = winEl.querySelector('#puri07-factory');
            const fCurrency = winEl.querySelector('#puri07-currency');
            const fRate = winEl.querySelector('#puri07-rate');
            const fTaxCode = winEl.querySelector('#puri07-tax-code');
            const fTaxDesc = winEl.querySelector('#puri07-tax-desc');
            const fTaxType = winEl.querySelector('#puri07-tax-type');
            const fTaxRate = winEl.querySelector('#puri07-tax-rate');
            const fRemark = winEl.querySelector('#puri07-remark');
            const fPrintFormat = winEl.querySelector('#puri07-print-format');
            const fShipVia = winEl.querySelector('#puri07-ship-via');
            const fChkDeposit = winEl.querySelector('#puri07-chk-deposit');
            const fDepositRate = winEl.querySelector('#puri07-deposit-rate');
            const fPrintCount = winEl.querySelector('#puri07-print-count');
            const fSendCount = winEl.querySelector('#puri07-send-count');
            const fSignStatus = winEl.querySelector('#puri07-sign-status');
            const fChkMultitax = winEl.querySelector('#puri07-chk-multitax');
            const fChkEbcConfirm = winEl.querySelector('#puri07-chk-ebc-confirm');
            const fEbcPoNo = winEl.querySelector('#puri07-ebc-po-no');
            const fEbcVersion = winEl.querySelector('#puri07-ebc-version');
            const fChkEbcExport = winEl.querySelector('#puri07-chk-ebc-export');

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
            let isDirty = false;

            winEl.addEventListener('input', (e) => {
                if (!e.target.classList.contains('erp-input-readonly') && !e.target.classList.contains('erp-totals-inp')) {
                    isDirty = true;
                }
            });

            // Double click on date inputs to open calendar
            fDocDate?.addEventListener('dblclick', () => Modules.openCalendar(fDocDate));
            fPoDate?.addEventListener('dblclick', () => Modules.openCalendar(fPoDate));

            // Subtab navigation
            const subtabBtns = winEl.querySelectorAll('.erp-subtab-btn');
            subtabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    subtabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
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
                if (rowCount > 0) isDirty = true;
            };

            const grid = Modules.initDynamicGrid(winEl, 'puri07', true, calcTotals);

            const fillPO = (header, details = []) => {
                const poTypeMap = {
                    'A321': '國內採購單',
                    'A322': '國外採購單',
                    'B331': '原料採購單',
                    'B332': '事務採購單',
                    'C330': '採購開帳單',
                    'C331': '配銷採購內',
                    'C332': '配銷採購外'
                };
                fType.value = header.po_type || '';
                if (fTypeDesc) fTypeDesc.textContent = poTypeMap[header.po_type] || header.po_type || '';
                fDocDate.value = header.doc_date || header.po_date || '';
                fPoDate.value = header.po_date || '';
                fNo.value = header.po_no || '';
                fSupNo.value = header.supplier_no || '';
                if (fSupName) fSupName.textContent = header.supplier_name || '';
                fUser.value = header.buyer || '';
                if (fUserDesc) fUserDesc.textContent = header.buyer_name || '';
                fConfirmUser.value = header.confirm_user || '';
                if (fFactory) fFactory.value = header.factory || 'TP01';
                if (fCurrency) fCurrency.value = header.currency || 'NTD';
                if (fRate) fRate.value = header.exchange_rate || '1';
                if (fTaxCode) fTaxCode.value = header.tax_code || 'P05';
                if (fTaxDesc) fTaxDesc.textContent = header.tax_desc || '進項三聯式發票-應稅外加';
                if (fTaxType && header.tax_type) fTaxType.value = header.tax_type;
                if (fTaxRate && header.tax_rate) fTaxRate.value = header.tax_rate;
                if (fRemark) fRemark.value = header.remark || '';
                currentDocStatus = header.status || '未確認';
                Modules.setDocStamp(winEl, currentDocStatus);
                Modules.updateAuditButtons(winEl, currentDocStatus === '已確認', 'puri07');
                grid.fillGrid(details);
                Modules.setFormMode(winEl, grid, 'browse', statusMsg, header.po_no);
                isDirty = false;
            };

            const clearPO = async () => {
                fType.value = '';
                if (fTypeDesc) fTypeDesc.textContent = '';
                const today = Modules.getTodayStr();
                fDocDate.value = today;
                fPoDate.value = today;
                fNo.value = await Modules.generateNextDocNo('purchase_order', today);
                fSupNo.value = '';
                if (fSupName) fSupName.textContent = '';
                fUser.value = '';
                if (fUserDesc) fUserDesc.textContent = '';
                fConfirmUser.value = '';
                if (fFactory) fFactory.value = 'TP01';
                if (fCurrency) fCurrency.value = 'NTD';
                if (fRate) fRate.value = '1';
                if (fRemark) fRemark.value = '';
                if (fTaxCode) fTaxCode.value = 'P05';
                if (fTaxDesc) fTaxDesc.textContent = '進項三聯式發票-應稅外加';
                if (fTaxType) fTaxType.value = '2:應稅外加';
                if (fTaxRate) fTaxRate.value = '5.000';
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '未確認');
                Modules.updateAuditButtons(winEl, false, 'puri07');
                grid.clearGrid(true);
                Modules.setFormMode(winEl, grid, 'add', statusMsg, fNo.value);
                isDirty = false;
                fSupNo.focus();
            };

            const resetPOBlank = () => {
                fType.value = '';
                if (fTypeDesc) fTypeDesc.textContent = '';
                fDocDate.value = '';
                fPoDate.value = '';
                fNo.value = '';
                fSupNo.value = '';
                if (fSupName) fSupName.textContent = '';
                fUser.value = '';
                if (fUserDesc) fUserDesc.textContent = '';
                fConfirmUser.value = '';
                if (fFactory) fFactory.value = 'TP01';
                if (fCurrency) fCurrency.value = 'NTD';
                if (fRate) fRate.value = '0';
                if (fRemark) fRemark.value = '';
                if (fTaxCode) fTaxCode.value = 'P05';
                if (fTaxDesc) fTaxDesc.textContent = '進項三聯式發票-應稅外加';
                if (fTaxType) fTaxType.value = '2:應稅外加';
                if (fTaxRate) fTaxRate.value = '5.000';
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '');
                Modules.updateAuditButtons(winEl, false, 'puri07');
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
                const tbody = winEl.querySelector('#puri07-browse-tbody');
                const res = await ERP_API.get('get_purchase_orders');
                if (res.success) {
                    poList = res.data || [];
                    if (poList.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding:20px; color:#888;">目前尚無採購單據</td></tr>';
                        return;
                    }
                    let rows = '';
                    poList.forEach(p => {
                        const amt = Math.round(p.po_amount || p.total_amount || 0);
                        const tax = Math.round(p.tax_amount || (amt * 0.05) || 0);
                        const grand = Math.round(p.grand_total || (amt + tax) || 0);
                        rows += `
                            <tr data-no="${p.po_no}" style="cursor:pointer;">
                                <td style="text-align:center;">▶</td>
                                <td>${p.po_type || 'A321'}</td>
                                <td style="font-weight:bold; color:#003366;">${p.po_no}</td>
                                <td>${p.po_date || ''}</td>
                                <td>${p.supplier_no || ''}</td>
                                <td>${p.supplier_name || ''}</td>
                                <td style="text-align:right;">${amt.toLocaleString()}</td>
                                <td style="text-align:right;">${tax.toLocaleString()}</td>
                                <td style="text-align:right; font-weight:bold;">${grand.toLocaleString()}</td>
                                <td style="text-align:center; font-weight:bold; color:${p.status === '已確認' ? 'green' : '#999'};">${p.status || '未確認'}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows;

                    tbody.querySelectorAll('tr[data-no]').forEach(tr => {
                        tr.addEventListener('click', () => {
                            checkDirtyBeforeAction(async () => {
                                const no = tr.getAttribute('data-no');
                                const detailRes = await ERP_API.get('get_purchase_order', { po_no: no });
                                const doc = detailRes.purchase_order || detailRes.header || detailRes.po || detailRes.order;
                                if (detailRes.success && doc) {
                                    fillPO(doc, detailRes.details || []);
                                    switchTab('detail');
                                }
                            });
                        });
                    });
                }
            };

            const navPO = async (pos) => {
                checkDirtyBeforeAction(async () => {
                    const cur = fNo.value.trim();
                    const res = await ERP_API.get('nav_purchase_order', { pos, current: cur });
                    const doc = res.purchase_order || res.header || res.po;
                    if (res.success && doc) {
                        fillPO(doc, res.details || []);
                        isDirty = false;
                    } else {
                        alert('已無' + (pos === 'first' ? '第一筆' : pos === 'last' ? '最後一筆' : pos === 'prev' ? '上一筆' : '下一筆') + '採購單資料');
                    }
                });
            };

            const bindNav = (btnId, pos) => {
                const btn = winEl.querySelector('#' + btnId);
                if (btn) btn.addEventListener('click', () => navPO(pos));
            };
            bindNav('puri07-tb-first', 'first');
            bindNav('puri07-tb-prev', 'prev');
            bindNav('puri07-tb-next', 'next');
            bindNav('puri07-tb-last', 'last');

            // 串查作業按鈕連動 (1:1 擷取666.PNG + 查詢品號)
            const puri07CrossQueryBtn = winEl.querySelector('#puri07-tb-crossquery');
            if (puri07CrossQueryBtn) {
                puri07CrossQueryBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const curSuppNo = fSupNo ? fSupNo.value.trim() : '';
                    const curSuppName = fSupName ? fSupName.value.trim() : '';
                    const curPoNo = (fType?.value.trim() && fNo?.value.trim()) ? `${fType.value.trim()}-${fNo.value.trim()}` : (fNo?.value.trim() || '');

                    let curItemNo = '';
                    let curItemName = '';
                    const itemInputs = winEl.querySelectorAll('#puri07-grid-tbody input[id^="puri07-item-no-"]');
                    for (const inp of itemInputs) {
                        if (inp.value.trim()) {
                            curItemNo = inp.value.trim();
                            const rIdx = inp.id.replace('puri07-item-no-', '');
                            const nameInp = winEl.querySelector(`#puri07-item-name-${rIdx}`);
                            curItemName = nameInp ? nameInp.value.trim() : '';
                            break;
                        }
                    }

                    Modules.showCrossQueryMenu(puri07CrossQueryBtn, {
                        orderNo: curPoNo,
                        customerNo: curSuppNo,
                        customerName: curSuppName,
                        itemNo: curItemNo,
                        itemName: curItemName,
                        currentModule: 'PURI07',
                        includeTreeQuery: false
                    });
                });
            }

            // Lookups
            const poTypeMap = {
                'A321': '國內採購單',
                'A322': '國外採購單',
                'B331': '原料採購單',
                'B332': '事務採購單',
                'C330': '採購開帳單',
                'C331': '配銷採購內',
                'C332': '配銷採購外'
            };
            const openPoTypeLookup = () => {
                Modules.openLookup('doc_type_po', (t) => {
                    fType.value = t.code;
                    if (fTypeDesc) fTypeDesc.textContent = t.name;
                    isDirty = true;
                });
            };
            winEl.querySelector('#puri07-lookup-type')?.addEventListener('click', openPoTypeLookup);
            fType?.addEventListener('dblclick', openPoTypeLookup);
            fType?.addEventListener('input', () => {
                const code = fType.value.trim().toUpperCase();
                if (fTypeDesc) fTypeDesc.textContent = poTypeMap[code] || '';
            });
            winEl.querySelector('#puri07-lookup-sup')?.addEventListener('click', () => {
                Modules.openLookup('supplier', (s) => {
                    fSupNo.value = s.supplier_no || '';
                    if (fSupName) fSupName.textContent = s.name_short || s.full_name || '';
                    isDirty = true;
                });
            });
            winEl.querySelector('#puri07-lookup-user')?.addEventListener('click', () => {
                Modules.openLookup('salesperson', (s) => {
                    fUser.value = s.code;
                    if (fUserDesc) fUserDesc.textContent = s.name;
                    isDirty = true;
                });
            });
            winEl.querySelector('#puri07-lookup-flow')?.addEventListener('click', () => {
                if (fFlowNo) { fFlowNo.value = '001'; isDirty = true; }
            });
            winEl.querySelector('#puri07-lookup-factory')?.addEventListener('click', () => {
                Modules.openLookup('factory', (fact) => {
                    if (fFactory) fFactory.value = fact.code || 'TP01';
                    isDirty = true;
                });
            });
            winEl.querySelector('#puri07-lookup-currency')?.addEventListener('click', () => {
                Modules.openLookup('currency', (c) => {
                    if (fCurrency) fCurrency.value = c.code || 'NTD';
                    if (fRate) fRate.value = c.rate || '1';
                    isDirty = true;
                });
            });
            winEl.querySelector('#puri07-lookup-tax')?.addEventListener('click', () => {
                Modules.openLookup('tax_purchase', (tx) => {
                    if (fTaxCode) fTaxCode.value = tx.code || 'P05';
                    if (fTaxDesc) fTaxDesc.textContent = tx.name || '進項三聯式發票-應稅外加';
                    if (fTaxRate && tx.rate !== undefined) fTaxRate.value = parseFloat(tx.rate).toFixed(3);
                    if (fTaxType && tx.tax_type) fTaxType.value = tx.tax_type;
                    isDirty = true;
                });
            });
            fTaxCode?.addEventListener('dblclick', () => {
                winEl.querySelector('#puri07-lookup-tax')?.click();
            });

            // Copy Purchase Order (複製採購單 / 複製前筆)
            const copyPO = async () => {
                const curNo = fNo.value.trim();
                const curSup = fSupNo.value.trim();
                if (curNo && curSup) {
                    if (confirm(`是否以目前採購單【${curNo}】為範本複製產生新單據？`)) {
                        const today = Modules.getTodayStr();
                        const newDocNo = await Modules.generateNextDocNo('purchase_order', today);
                        fNo.value = newDocNo;
                        fDocDate.value = today;
                        fPoDate.value = today;
                        fConfirmUser.value = '';
                        currentDocStatus = '未確認';
                        Modules.setDocStamp(winEl, '未確認');
                        isDirty = true;
                        alert(`已成功複製採購單【${curNo}】！\n新單號為：【${newDocNo}】\n供應商與明細已保留，確認後請點擊「💾 儲存」。`);
                    }
                } else {
                    Modules.openLookup('purchase_order', async (p) => {
                        const res = await ERP_API.get('get_purchase_order', { po_no: p.po_no });
                        if (res.success && res.purchase_order) {
                            fillPO(res.purchase_order, res.details || []);
                            const today = Modules.getTodayStr();
                            const newDocNo = await Modules.generateNextDocNo('purchase_order', today);
                            fNo.value = newDocNo;
                            fDocDate.value = today;
                            fPoDate.value = today;
                            fConfirmUser.value = '';
                            currentDocStatus = '未確認';
                            Modules.setDocStamp(winEl, '未確認');
                            isDirty = true;
                            alert(`已成功複製採購單【${p.po_no}】！\n新單號為：【${newDocNo}】。`);
                        }
                    });
                }
            };

            const doSave = async () => {
                const poNo = fNo.value.trim();
                const supNo = fSupNo.value.trim();
                if (!poNo || !supNo) {
                    alert('【必填檢查】請輸入採購單號及挑選供應商代號！');
                    return false;
                }
                const details = grid.getRowsData();
                if (details.length === 0) {
                    alert('【明細檢查】請至少在表格中挑選品號並輸入採購數量！');
                    return false;
                }

                const poType = fType.value.trim();
                if (!poType) {
                    alert('【必填檢查】請輸入或挑選採購單別！');
                    fType.focus();
                    return false;
                }

                const payload = {
                    header: {
                        po_no: poNo,
                        po_type: poType,
                        doc_date: fDocDate.value.trim() || Modules.getTodayStr(),
                        po_date: fPoDate.value.trim() || Modules.getTodayStr(),
                        supplier_no: supNo,
                        supplier_name: fSupName ? fSupName.textContent.trim() : '',
                        buyer: fUser.value.trim(),
                        factory: fFactory ? fFactory.value.trim() : 'TP01',
                        currency: fCurrency ? fCurrency.value.trim() : 'NTD',
                        exchange_rate: fRate ? fRate.value.trim() : '1',
                        tax_code: fTaxCode ? fTaxCode.value.trim() : 'P05',
                        tax_type: fTaxType ? fTaxType.value : '2:應稅外加',
                        tax_rate: fTaxRate ? fTaxRate.value : '5.000',
                        remark: fRemark ? fRemark.value.trim() : '',
                        po_amount: parseFloat((fTotAmt.value || '0').replace(/,/g, '')) || 0,
                        tax_amount: parseFloat((fTotTax.value || '0').replace(/,/g, '')) || 0,
                        grand_total: parseFloat((fTotGrand.value || '0').replace(/,/g, '')) || 0,
                        total_qty: parseFloat((fTotQty.value || '0').replace(/,/g, '')) || 0,
                        status: currentDocStatus
                    },
                    details
                };

                const res = await ERP_API.post('save_purchase_order', payload);
                if (res.success) {
                    isDirty = false;
                    Modules.setFormMode(winEl, grid, 'browse', statusMsg, poNo);
                    Modules.toast(`採購單 [${poNo}] 儲存成功！`, 'success');
                    return true;
                } else {
                    Modules.toast('儲存失敗: ' + (res.error || '不明錯誤'), 'error');
                    return false;
                }
            };

            // Toolbar
            winEl.querySelector('#puri07-tb-new').addEventListener('click', () => checkDirtyBeforeAction(() => {
                clearPO();
                switchTab('detail');
            }));
            winEl.querySelector('#puri07-tb-edit').addEventListener('click', () => {
                const curNo = fNo.value.trim();
                if (!curNo) {
                    alert('請先查詢單據或點選「新增」！');
                    return;
                }
                switchTab('detail');
                Modules.setFormMode(winEl, grid, 'edit', statusMsg, curNo);
                Modules.toast(`採購單 [${curNo}] 進入修改模式`, 'info');
            });
            const puri07CopyBtn = winEl.querySelector('#puri07-tb-copy');
            if (puri07CopyBtn) puri07CopyBtn.addEventListener('click', copyPO);
            const puri07MenuFunc = winEl.querySelector('#puri07-menu-func');
            if (puri07MenuFunc) puri07MenuFunc.addEventListener('click', copyPO);
            winEl.querySelector('#puri07-tb-query').addEventListener('click', () => {
                checkDirtyBeforeAction(() => {
                    Modules.openLookup('purchase_order', async (p) => {
                        const targetNo = p.po_no || p.no || '';
                        const res = await ERP_API.get('get_purchase_order', { po_no: targetNo });
                        const doc = res.purchase_order || res.header || res.po || res.order;
                        if (res.success && doc) {
                            fillPO(doc, res.details || []);
                            switchTab('detail');
                        } else {
                            alert(res.error || '查無此採購單資料');
                        }
                    });
                });
            });

            winEl.querySelector('#puri07-tb-save').addEventListener('click', doSave);

            winEl.querySelector('#puri07-tb-cancel').addEventListener('click', () => {
                if (isDirty) {
                    const answer = confirm("資料尚未儲存，是否要儲存目前的單據？\n\n點選【確定】：進行儲存\n點選【取消】：直接清除放棄變更");
                    if (answer) {
                        doSave();
                    } else {
                        resetPOBlank();
                        Modules.toast('已取消並清除未儲存變更。', 'info');
                    }
                } else {
                    resetPOBlank();
                    Modules.toast('已清除重置頁面資料。', 'info');
                }
            });

            winEl.querySelector('#puri07-tb-confirm').addEventListener('click', async () => {
                const btn = winEl.querySelector('#puri07-tb-confirm');
                if (btn && btn.disabled) return;
                const poNo = fNo.value.trim();
                if (!poNo) return;
                const res = await ERP_API.post('confirm_doc', { type: 'purchase_order', doc_no: poNo, status: '已確認' });
                if (res.success) {
                    currentDocStatus = '已確認';
                    fConfirmUser.value = App.currentUser?.username || '';
                    Modules.updateAuditButtons(winEl, true, 'puri07');
                    Modules.toast('採購單確認完成！', 'success');
                }
            });

            winEl.querySelector('#puri07-tb-unconfirm').addEventListener('click', async () => {
                const btn = winEl.querySelector('#puri07-tb-unconfirm');
                if (btn && btn.disabled) return;
                const poNo = fNo.value.trim();
                if (!poNo) return;
                const res = await ERP_API.post('confirm_doc', { type: 'purchase_order', doc_no: poNo, status: '未確認' });
                if (res.success) {
                    currentDocStatus = '未確認';
                    fConfirmUser.value = '';
                    Modules.updateAuditButtons(winEl, false, 'puri07');
                    Modules.toast('採購單已取消確認！', 'info');
                }
            });

            winEl.querySelector('#puri07-tb-del').addEventListener('click', async () => {
                const poNo = fNo.value.trim();
                if (!poNo) return;
                if (confirm(`確定要刪除採購單 [${poNo}] 嗎？`)) {
                    const res = await ERP_API.post('delete_purchase_order', { po_no: poNo });
                    if (res.success) {
                        Modules.toast('採購單已成功刪除！', 'success');
                        clearPO();
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

            winEl.querySelectorAll('.erp-subtab-header .erp-subtab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    winEl.querySelectorAll('.erp-subtab-header .erp-subtab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });

            // Initial load: 100% 空白模式，按新增或查詢才出現
            resetPOBlank();
        });
    },

    // ========================================================
    // 12. 進貨單建立作業 (PURI09) - 1:1 參考圖片13 (擷取13.PNG)
    // ========================================================
    openPURI09() {
        const u = App.currentUser?.company || '學生區';
        const title = `進貨單建立作業 (PURI09)[${u}]`;
        const winId = 'PURI09';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item">資料(<u>D</u>)</span>
                <span class="erp-menu-item" id="puri09-menu-func" title="功能選單：複製單據">功能(<u>F</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>
            <div class="erp-toolbar">
                <button class="erp-tb-btn" title="新增空白進貨單" id="puri09-tb-new">📄</button>
                <button class="erp-tb-btn" title="查詢" id="puri09-tb-query">🔍</button>
                <button class="erp-tb-btn" title="修改" id="puri09-tb-edit">✏️</button>
                <button class="erp-tb-btn" title="刪除" id="puri09-tb-del">🗑️</button>
                <button class="erp-tb-btn" title="列印" onclick="alert('進貨檢驗單列印中...')">🖨️</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="首筆" id="puri09-tb-first">|◀</button>
                <button class="erp-tb-btn" title="上筆" id="puri09-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下筆" id="puri09-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="puri09-tb-last">▶|</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="儲存" id="puri09-tb-save" style="color:#008000; font-weight:bold; font-size:15px;">✔</button>
                <button class="erp-tb-btn tb-btn-cancel" title="取消 (清除放棄未儲存變更)" id="puri09-tb-cancel" style="color:#CC0000; font-weight:bold; font-size:15px;">✖</button>
                <button class="erp-tb-btn" title="確認" id="puri09-tb-confirm">
                    <img src="assets/icons/confirm_active.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
                <button class="erp-tb-btn" title="取消確認" id="puri09-tb-unconfirm">
                    <img src="assets/icons/unconfirm_disabled.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
                <button class="erp-tb-btn" title="複製單據 (1:1 參考圖片1)" id="puri09-tb-copy">
                    <img src="assets/icons/tb_copy.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
            </div>

            <!-- Top Tab Header -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="puri09-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="puri09-tab-browse">資料瀏覽</button>
            </div>

            <!-- Detail View -->
            <div id="puri09-view-detail" style="display:flex; flex-direction:column; flex:1; overflow:hidden;">
                <!-- Header Panel (1:1 參考圖片13 單頭 4 列) -->
                <div class="erp-header-panel" style="background:#ECE9D8; padding:5px 10px; border-bottom:1px solid #7F9DB9;">
                    <div class="erp-stamp-he" style="display:none;">核</div>
                    <!-- Row 1: 進貨單別 | 保稅碼 -->
                    <div class="erp-form-row" style="margin-bottom:3px; display:flex; align-items:center;">
                        <div class="erp-field" style="display:flex; align-items:center; width:280px;">
                            <label style="width:70px; text-align:right; margin-right:5px; color:#000;">進貨單別</label>
                            <input type="text" id="puri09-type" class="erp-input-cyan" style="width:70px; background:#00E5FF; font-weight:bold;" value="">
                            <button type="button" class="lookup-icon-btn" id="puri09-lookup-type" style="margin-left:2px;" title="挑選單別">🗎</button>
                            <span class="erp-field-desc" id="puri09-type-desc" style="margin-left:4px;"></span>
                        </div>
                        <div class="erp-field" style="display:flex; align-items:center; margin-left:auto; width:260px;">
                            <label style="width:70px; text-align:right; margin-right:5px; color:#000;">保稅碼</label>
                            <select id="puri09-bonded-code" style="width:140px; height:21px; background:#FFF; border:1px solid #7F9DB9;">
                                <option value=""></option>
                                <option value="1">1:非保稅品</option>
                                <option value="2">2:保稅品</option>
                            </select>
                        </div>
                    </div>

                    <!-- Row 2: 進貨單號 | 單據日期 -->
                    <div class="erp-form-row" style="margin-bottom:3px; display:flex; align-items:center;">
                        <div class="erp-field" style="display:flex; align-items:center; width:280px;">
                            <label style="width:70px; text-align:right; margin-right:5px; color:#000;">進貨單號</label>
                            <input type="text" id="puri09-no" class="erp-input-cyan" style="width:130px; background:#00E5FF; font-weight:bold;" value="">
                        </div>
                        <div class="erp-field" style="display:flex; align-items:center; margin-left:auto; width:260px;">
                            <label style="width:70px; text-align:right; margin-right:5px; color:#000;">單據日期</label>
                            <input type="text" id="puri09-doc-date" class="erp-input-yellow" style="width:90px; background:#FFFFB0; text-align:center;" value="    /  /  ">
                            <input type="checkbox" id="puri09-chk-date" style="margin-left:4px;">
                        </div>
                    </div>

                    <!-- Row 3: 供應廠商 | 進貨日期 -->
                    <div class="erp-form-row" style="margin-bottom:3px; display:flex; align-items:center;">
                        <div class="erp-field" style="display:flex; align-items:center; width:280px;">
                            <label style="width:70px; text-align:right; margin-right:5px; color:#000;">供應廠商</label>
                            <input type="text" id="puri09-sup-no" class="erp-input-yellow" style="width:90px; background:#FFFFB0;" value="">
                            <button type="button" class="lookup-icon-btn" id="puri09-lookup-sup" style="margin-left:2px;" title="挑選供應商">👤</button>
                            <span class="erp-field-desc" id="puri09-sup-name" style="margin-left:4px;"></span>
                        </div>
                        <div class="erp-field" style="display:flex; align-items:center; margin-left:auto; width:260px;">
                            <label style="width:70px; text-align:right; margin-right:5px; color:#000;">進貨日期</label>
                            <input type="text" id="puri09-rcv-date" style="width:100px; height:20px; border:1px solid #7F9DB9; padding:1px 3px;" value="">
                        </div>
                    </div>

                    <!-- Row 4: 通知碼 -->
                    <div class="erp-form-row" style="margin-bottom:2px; display:flex; align-items:center;">
                        <div class="erp-field" style="display:flex; align-items:center; width:280px;">
                            <label style="width:70px; text-align:right; margin-right:5px; color:#000;">通知碼</label>
                            <input type="text" id="puri09-notice-code" style="width:160px; height:20px; border:1px solid #7F9DB9; padding:1px 3px;" value="">
                        </div>
                        <input type="hidden" id="puri09-po-no" value="">
                        <input type="hidden" id="puri09-confirm-user" value="">
                    </div>
                </div>

                <!-- Subtab Header (1:1 參考圖片13: 交易資料 / 發票資料 / 訂金/EBC資料 / 資料瀏覽) -->
                <div class="erp-subtab-header">
                    <button type="button" class="erp-subtab-btn active" id="puri09-subtab-trade">交易資料</button>
                    <button type="button" class="erp-subtab-btn" id="puri09-subtab-inv">發票資料</button>
                    <button type="button" class="erp-subtab-btn" id="puri09-subtab-ebc">訂金/EBC資料</button>
                    <button type="button" class="erp-subtab-btn" id="puri09-subtab-brw">資料瀏覽</button>
                </div>

                <!-- Subtab View: 交易資料 (1:1 參考圖片13: 6 列) -->
                <div id="puri09-subview-trade" style="background:#ECE9D8; padding:6px 10px; border-bottom:1px solid #7F9DB9; font-size:12px;">
                    <!-- Row 1: 廠別 | 件數 -->
                    <div style="display:flex; align-items:center; margin-bottom:3px;">
                        <div style="display:flex; align-items:center; width:300px;">
                            <label style="width:70px; text-align:right; margin-right:5px; color:#000;">廠別</label>
                            <input type="text" id="puri09-factory" class="erp-input-yellow" style="width:80px; height:20px; background:#FFFFB0; border:1px solid #7F9DB9; padding:1px 3px;" value="">
                            <button type="button" class="lookup-icon-btn" id="puri09-lookup-factory" style="margin-left:2px;" title="挑選廠別">🏭</button>
                        </div>
                        <div style="display:flex; align-items:center; margin-left:auto; width:220px;">
                            <label style="width:60px; text-align:right; margin-right:5px; color:#000;">件數</label>
                            <input type="text" id="puri09-packages" style="width:60px; height:20px; text-align:right; border:1px solid #7F9DB9; padding:1px 3px;" value="0">
                        </div>
                    </div>

                    <!-- Row 2: 廠商單號 | 列印 / 傳送次數 -->
                    <div style="display:flex; align-items:center; margin-bottom:3px;">
                        <div style="display:flex; align-items:center; width:300px;">
                            <label style="width:70px; text-align:right; margin-right:5px; color:#000;">廠商單號</label>
                            <input type="text" id="puri09-supplier-doc" style="width:190px; height:20px; border:1px solid #7F9DB9; padding:1px 3px;" value="">
                        </div>
                        <div style="display:flex; align-items:center; margin-left:auto; width:220px;">
                            <label style="width:40px; text-align:right; margin-right:4px; color:#000;">列印</label>
                            <input type="text" id="puri09-print-count" style="width:30px; height:20px; text-align:right; border:1px solid #7F9DB9;" value="0" readonly>
                            <label style="width:60px; text-align:right; margin-right:4px; margin-left:8px; color:#000;">傳送次數</label>
                            <input type="text" id="puri09-send-count" style="width:30px; height:20px; text-align:right; border:1px solid #7F9DB9;" value="0" readonly>
                        </div>
                    </div>

                    <!-- Row 3: 幣別 匯率 | 簽核狀態 -->
                    <div style="display:flex; align-items:center; margin-bottom:3px;">
                        <div style="display:flex; align-items:center; width:340px;">
                            <label style="width:70px; text-align:right; margin-right:5px; color:#000;">幣別</label>
                            <input type="text" id="puri09-currency" class="erp-input-yellow" style="width:45px; height:20px; background:#FFFFB0; border:1px solid #7F9DB9; padding:1px 3px;" value="NTD">
                            <button type="button" class="lookup-icon-btn" id="puri09-lookup-currency" style="margin-left:2px; color:#008000; font-weight:bold; font-family:monospace; font-size:13px;" title="挑選幣別">$</button>
                            <label style="width:40px; text-align:right; margin-left:10px; margin-right:4px; color:#000;">匯率</label>
                            <input type="text" id="puri09-rate" style="width:85px; height:20px; text-align:right; border:1px solid #7F9DB9; padding:1px 3px;" value="0">
                            <button type="button" class="lookup-icon-btn" style="margin-left:2px; color:#008000; font-weight:bold; font-family:monospace; font-size:13px;" title="匯率">$</button>
                        </div>
                        <div style="display:flex; align-items:center; margin-left:auto; width:220px;">
                            <label style="width:60px; text-align:right; margin-right:5px; color:#000;">簽核狀態</label>
                            <input type="text" id="puri09-audit-status" style="width:140px; height:20px; border:1px solid #7F9DB9; padding:1px 3px;" value="">
                        </div>
                    </div>

                    <!-- Row 4: 付款條件 | 備註 -->
                    <div style="display:flex; align-items:center; margin-bottom:3px;">
                        <div style="display:flex; align-items:center; width:300px;">
                            <label style="width:70px; text-align:right; margin-right:5px; color:#000;">付款條件</label>
                            <input type="text" id="puri09-pay-term" style="width:110px; height:20px; border:1px solid #7F9DB9; padding:1px 3px;" value="">
                            <button type="button" class="lookup-icon-btn" id="puri09-lookup-pay" style="margin-left:2px;" title="挑選付款條件">🗎</button>
                        </div>
                        <div style="display:flex; align-items:center; margin-left:auto; width:280px;">
                            <label style="width:40px; text-align:right; margin-right:4px; color:#000;">備註</label>
                            <input type="text" id="puri09-remark" style="flex:1; height:20px; border:1px solid #7F9DB9; padding:1px 3px;" value="">
                            <button type="button" class="lookup-icon-btn" id="puri09-memo-btn" style="margin-left:2px;" title="備註編輯">📝</button>
                        </div>
                    </div>

                    <!-- Row 5: 交易條件 -->
                    <div style="display:flex; align-items:center; margin-bottom:3px;">
                        <div style="display:flex; align-items:center; width:300px;">
                            <label style="width:70px; text-align:right; margin-right:5px; color:#000;">交易條件</label>
                            <input type="text" id="puri09-trade-term" style="width:35px; height:20px; border:1px solid #7F9DB9; padding:1px 3px;" value="">
                            <button type="button" class="lookup-icon-btn" id="puri09-lookup-trade" style="margin-left:2px;" title="挑選交易條件">🗎</button>
                        </div>
                    </div>

                    <!-- Row 6: 聯絡人 -->
                    <div style="display:flex; align-items:center;">
                        <div style="display:flex; align-items:center; width:300px;">
                            <label style="width:70px; text-align:right; margin-right:5px; color:#000;">聯絡人</label>
                            <input type="text" id="puri09-contact" style="width:140px; height:20px; border:1px solid #7F9DB9; padding:1px 3px;" value="">
                            <button type="button" class="lookup-icon-btn" id="puri09-lookup-contact" style="margin-left:2px;" title="挑選聯絡人">👤</button>
                        </div>
                    </div>
                </div>

                <!-- DataGrid (1:1 參考圖片13) -->
                <div class="erp-datagrid-container" style="flex:1; overflow:auto; background:#FFF; border:1px solid #7F9DB9;">
                    <table class="erp-grid-table" style="width:100%; border-collapse:collapse; font-size:12px;">
                        <thead>
                            <tr style="background:linear-gradient(to bottom, #F9F9F9, #E4E4E4); height:22px; position:sticky; top:0; z-index:2;">
                                <th style="width:24px; text-align:center; border:1px solid #B0B0B0;">📊</th>
                                <th class="th-cyan" style="width:40px; text-align:center; background:#00E5FF; color:#000; border:1px solid #B0B0B0;">序號</th>
                                <th class="th-yellow" style="width:125px; text-align:left; background:#FFFFB0; color:#000; border:1px solid #B0B0B0; padding-left:4px;">品號</th>
                                <th style="width:170px; text-align:left; border:1px solid #B0B0B0; padding-left:4px;">品名</th>
                                <th style="width:140px; text-align:left; border:1px solid #B0B0B0; padding-left:4px;">規格</th>
                                <th style="width:85px; text-align:right; border:1px solid #B0B0B0; padding-right:4px;">進貨數量</th>
                                <th class="th-yellow" style="width:55px; text-align:center; background:#FFFFB0; color:#000; border:1px solid #B0B0B0;">單位</th>
                                <th style="width:85px; text-align:right; border:1px solid #B0B0B0; padding-right:4px;">驗收數量</th>
                                <th style="width:85px; text-align:right; border:1px solid #B0B0B0; padding-right:4px;">計價數量</th>
                                <th class="th-yellow" style="width:65px; text-align:center; background:#FFFFB0; color:#000; border:1px solid #B0B0B0;">計價單位</th>
                                <th style="width:80px; text-align:right; border:1px solid #B0B0B0; padding-right:4px;">單價</th>
                                <th style="width:90px; text-align:right; border:1px solid #B0B0B0; padding-right:4px;">金額</th>
                                <th style="width:80px; text-align:center; border:1px solid #B0B0B0;">庫別</th>
                            </tr>
                        </thead>
                        <tbody id="puri09-grid-tbody">
                            <!-- Rendered by initDynamicGrid -->
                        </tbody>
                    </table>
                </div>

                <!-- Totals Panel (1:1 參考截圖131: 原幣 / 本幣 / 數量合計 橫向三欄並列) -->
                <div class="erp-totals-panel-puri09" style="flex-shrink:0 !important; background:#ECE9D8; border-top:1px solid #7F9DB9; padding:4px 8px; font-size:12px; display:flex !important; flex-direction:row !important; flex-wrap:nowrap !important; gap:20px; align-items:flex-start; box-sizing:border-box;">
                    <!-- Column 1: 原幣 (6 lines) -->
                    <div style="display:flex; flex-direction:column; gap:2px; flex-shrink:0;">
                        <div style="display:flex; align-items:center; height:21px;">
                            <span style="width:36px; color:#000;">原幣</span>
                            <label style="width:55px; text-align:right; margin-right:4px;">進貨金額</label>
                            <input type="text" id="puri09-orig-gr-amt" class="erp-input-readonly" style="width:110px; height:19px; text-align:right; border:1px solid #7F9DB9; background:#FFF; font-size:12px; padding:1px 3px;" value="0" readonly>
                        </div>
                        <div style="display:flex; align-items:center; height:21px;">
                            <span style="width:36px;"></span>
                            <label style="width:55px; text-align:right; margin-right:4px;">扣款金額</label>
                            <input type="text" id="puri09-orig-ded-amt" class="erp-input-readonly" style="width:110px; height:19px; text-align:right; border:1px solid #7F9DB9; background:#FFF; font-size:12px; padding:1px 3px;" value="0" readonly>
                        </div>
                        <div style="display:flex; align-items:center; height:21px;">
                            <span style="width:36px;"></span>
                            <label style="width:55px; text-align:right; margin-right:4px;">貨款金額</label>
                            <input type="text" id="puri09-orig-goods-amt" class="erp-input-readonly" style="width:110px; height:19px; text-align:right; border:1px solid #7F9DB9; background:#FFF; font-size:12px; padding:1px 3px;" value="0" readonly>
                        </div>
                        <div style="display:flex; align-items:center; height:21px;">
                            <span style="width:36px;"></span>
                            <label style="width:55px; text-align:right; margin-right:4px;">稅額</label>
                            <input type="text" id="puri09-orig-tax" class="erp-input-readonly" style="width:110px; height:19px; text-align:right; border:1px solid #7F9DB9; background:#FFF; font-size:12px; padding:1px 3px;" value="0" readonly>
                        </div>
                        <div style="display:flex; align-items:center; height:21px;">
                            <span style="width:36px;"></span>
                            <label style="width:55px; text-align:right; margin-right:4px;">金額合計</label>
                            <input type="text" id="puri09-orig-total" class="erp-input-readonly" style="width:110px; height:19px; text-align:right; border:1px solid #7F9DB9; background:#FFF; font-size:12px; padding:1px 3px;" value="0" readonly>
                        </div>
                        <div style="display:flex; align-items:center; height:21px;">
                            <span style="width:36px;"></span>
                            <label style="width:55px; text-align:right; margin-right:4px;">沖自籌額</label>
                            <input type="text" id="puri09-orig-offset" class="erp-input-readonly" style="width:110px; height:19px; text-align:right; border:1px solid #7F9DB9; background:#FFF; font-size:12px; padding:1px 3px;" value="0" readonly>
                        </div>
                    </div>

                    <!-- Column 2: 本幣 (5 lines) -->
                    <div style="display:flex; flex-direction:column; gap:2px; flex-shrink:0;">
                        <div style="display:flex; align-items:center; height:21px;">
                            <span style="width:36px; color:#000;">本幣</span>
                            <label style="width:55px; text-align:right; margin-right:4px;">進貨費用</label>
                            <input type="text" id="puri09-local-fee" class="erp-input-readonly" style="width:110px; height:19px; text-align:right; border:1px solid #7F9DB9; background:#FFF; font-size:12px; padding:1px 3px;" value="0" readonly>
                        </div>
                        <div style="display:flex; align-items:center; height:21px;">
                            <span style="width:36px;"></span>
                            <label style="width:55px; text-align:right; margin-right:4px;">貨款金額</label>
                            <input type="text" id="puri09-local-goods-amt" class="erp-input-readonly" style="width:110px; height:19px; text-align:right; border:1px solid #7F9DB9; background:#FFF; font-size:12px; padding:1px 3px;" value="0" readonly>
                        </div>
                        <div style="display:flex; align-items:center; height:21px;">
                            <span style="width:36px;"></span>
                            <label style="width:55px; text-align:right; margin-right:4px;">稅額</label>
                            <input type="text" id="puri09-local-tax" class="erp-input-readonly" style="width:110px; height:19px; text-align:right; border:1px solid #7F9DB9; background:#FFF; font-size:12px; padding:1px 3px;" value="0" readonly>
                        </div>
                        <div style="display:flex; align-items:center; height:21px;">
                            <span style="width:36px;"></span>
                            <label style="width:55px; text-align:right; margin-right:4px;">金額合計</label>
                            <input type="text" id="puri09-local-total" class="erp-input-readonly" style="width:110px; height:19px; text-align:right; border:1px solid #7F9DB9; background:#FFF; font-size:12px; padding:1px 3px;" value="0" readonly>
                        </div>
                        <div style="display:flex; align-items:center; height:21px;">
                            <span style="width:36px;"></span>
                            <label style="width:55px; text-align:right; margin-right:4px;">沖自籌額</label>
                            <input type="text" id="puri09-local-offset" class="erp-input-readonly" style="width:110px; height:19px; text-align:right; border:1px solid #7F9DB9; background:#FFF; font-size:12px; padding:1px 3px;" value="0" readonly>
                        </div>
                    </div>

                    <!-- Column 3: 數量合計 (1 line on row 1) -->
                    <div style="display:flex; flex-direction:column; gap:2px; flex-shrink:0;">
                        <div style="display:flex; align-items:center; height:21px;">
                            <label style="width:60px; text-align:right; margin-right:4px;">數量合計</label>
                            <input type="text" id="puri09-total-qty" class="erp-input-readonly" style="width:95px; height:19px; text-align:right; border:1px solid #7F9DB9; background:#FFF; font-size:12px; padding:1px 3px;" value="0" readonly>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Browse View -->
            <div id="puri09-view-browse" style="display:none; flex-direction:column; flex:1; padding:4px;">
                <table class="erp-grid-table">
                    <thead>
                        <tr>
                            <th style="width:25px;"></th>
                            <th style="width:75px;">進貨單別</th>
                            <th class="th-cyan" style="width:110px;">進貨單號</th>
                            <th style="width:85px;">進貨日期</th>
                            <th style="width:80px;">供應商代號</th>
                            <th style="width:140px;">供應商簡稱</th>
                            <th style="width:110px;">來源採購單</th>
                            <th style="width:85px;">進貨金額</th>
                            <th style="width:75px;">稅額</th>
                            <th style="width:85px;">合計</th>
                            <th style="width:65px;">狀態</th>
                        </tr>
                    </thead>
                    <tbody id="puri09-browse-tbody">
                        <tr><td colspan="11" style="text-align:center; padding:20px;">載入進貨單清單中...</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Statusbar (1:1 參考截圖131: 瀏覽 單身資料筆數: 0 | 127.0.0.1 - 211) -->
            <div class="erp-window-statusbar" style="height:22px; background:#ECE9D8; border-top:1px solid #D4D0C8; display:flex; align-items:center; padding:0 6px; font-size:11px;">
                <span class="status-cell">瀏覽</span>
                <span class="status-cell" id="puri09-status-msg" style="margin-left:8px;">單身資料筆數: 0</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 960, 690, (winEl) => {
            const fType = winEl.querySelector('#puri09-type');
            const fTypeDesc = winEl.querySelector('#puri09-type-desc');
            const fDocDate = winEl.querySelector('#puri09-doc-date');
            const fRcvDate = winEl.querySelector('#puri09-rcv-date');
            const fNo = winEl.querySelector('#puri09-no');
            const fSupNo = winEl.querySelector('#puri09-sup-no');
            const fSupName = winEl.querySelector('#puri09-sup-name');
            const fPoNo = winEl.querySelector('#puri09-po-no');
            const fConfirmUser = winEl.querySelector('#puri09-confirm-user');
            const fNoticeCode = winEl.querySelector('#puri09-notice-code');
            const fBondedCode = winEl.querySelector('#puri09-bonded-code');
            const fFactory = winEl.querySelector('#puri09-factory');
            const fPackages = winEl.querySelector('#puri09-packages');
            const fSupplierDoc = winEl.querySelector('#puri09-supplier-doc');
            const fCurrency = winEl.querySelector('#puri09-currency');
            const fRate = winEl.querySelector('#puri09-rate');
            const fAuditStatus = winEl.querySelector('#puri09-audit-status');
            const fPayTerm = winEl.querySelector('#puri09-pay-term');
            const fTradeTerm = winEl.querySelector('#puri09-trade-term');
            const fRemark = winEl.querySelector('#puri09-remark');
            const fContact = winEl.querySelector('#puri09-contact');

            // Totals inputs
            const fOrigGrAmt = winEl.querySelector('#puri09-orig-gr-amt');
            const fOrigDedAmt = winEl.querySelector('#puri09-orig-ded-amt');
            const fOrigGoodsAmt = winEl.querySelector('#puri09-orig-goods-amt');
            const fOrigTax = winEl.querySelector('#puri09-orig-tax');
            const fOrigTotal = winEl.querySelector('#puri09-orig-total');
            const fOrigOffset = winEl.querySelector('#puri09-orig-offset');

            const fLocalFee = winEl.querySelector('#puri09-local-fee');
            const fLocalGoodsAmt = winEl.querySelector('#puri09-local-goods-amt');
            const fLocalTax = winEl.querySelector('#puri09-local-tax');
            const fLocalTotal = winEl.querySelector('#puri09-local-total');
            const fLocalOffset = winEl.querySelector('#puri09-local-offset');

            const fTotalQty = winEl.querySelector('#puri09-total-qty');
            const statusMsg = winEl.querySelector('#puri09-status-msg');

            const tabDetail = winEl.querySelector('#puri09-tab-detail');
            const tabBrowse = winEl.querySelector('#puri09-tab-browse');
            const viewDetail = winEl.querySelector('#puri09-view-detail');
            const viewBrowse = winEl.querySelector('#puri09-view-browse');

            let currentDocStatus = '未確認';
            let receiptList = [];
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
                const rate = parseFloat(fRate.value) || 1;

                if (fOrigGrAmt) fOrigGrAmt.value = sumAmt.toLocaleString();
                if (fOrigGoodsAmt) fOrigGoodsAmt.value = sumAmt.toLocaleString();
                if (fOrigTax) fOrigTax.value = tax.toLocaleString();
                if (fOrigTotal) fOrigTotal.value = grand.toLocaleString();

                const localGoods = Math.round(sumAmt * rate);
                const localTax = Math.round(tax * rate);
                const localTotal = localGoods + localTax;

                if (fLocalGoodsAmt) fLocalGoodsAmt.value = localGoods.toLocaleString();
                if (fLocalTax) fLocalTax.value = localTax.toLocaleString();
                if (fLocalTotal) fLocalTotal.value = localTotal.toLocaleString();
                if (fTotalQty) fTotalQty.value = sumQty.toLocaleString();

                statusMsg.textContent = `單身資料筆數: ${rowCount}`;
                if (rowCount > 0) isDirty = true;
            };

            const grid = Modules.initDynamicGrid(winEl, 'puri09', true, calcTotals);

            const fillReceipt = (header, details = []) => {
                fType.value = header.gr_type || header.receipt_type || '';
                fTypeDesc.textContent = (header.gr_type || header.receipt_type) === 'C341' ? '進貨單' : '';
                fDocDate.value = header.doc_date || header.receipt_date || header.gr_date || Modules.getTodayStr();
                fRcvDate.value = header.receipt_date || header.gr_date || Modules.getTodayStr();
                fNo.value = header.gr_no || header.receipt_no || '';
                fSupNo.value = header.supplier_no || '';
                fSupName.textContent = header.supplier_name || '';
                fPoNo.value = header.po_no || '';
                fConfirmUser.value = header.confirm_user || '';
                if (fFactory) fFactory.value = header.factory || 'TP01';
                if (fCurrency) fCurrency.value = header.currency || 'NTD';
                if (fRate) fRate.value = header.exchange_rate || 1;
                currentDocStatus = header.status || '未確認';
                Modules.setDocStamp(winEl, currentDocStatus);
                Modules.updateAuditButtons(winEl, currentDocStatus === '已確認', 'puri09');
                grid.fillGrid(details);
                calcTotals();
                Modules.setFormMode(winEl, grid, 'browse', statusMsg, header.gr_no || header.receipt_no);
                isDirty = false;
            };

            const clearReceipt = async () => {
                fType.value = '';
                fTypeDesc.textContent = '';
                const today = Modules.getTodayStr();
                fDocDate.value = today;
                fRcvDate.value = today;
                fNo.value = await Modules.generateNextDocNo('goods_receipt', today);
                fSupNo.value = '';
                fSupName.textContent = '';
                fPoNo.value = '';
                fConfirmUser.value = '';
                if (fFactory) fFactory.value = 'TP01';
                if (fCurrency) fCurrency.value = 'NTD';
                if (fRate) fRate.value = 1;
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '未確認');
                Modules.updateAuditButtons(winEl, false, 'puri09');
                grid.clearGrid(true);
                calcTotals();
                Modules.setFormMode(winEl, grid, 'add', statusMsg, fNo.value);
                isDirty = false;
                fSupNo.focus();
            };

            const resetReceiptBlank = () => {
                fType.value = '';
                fTypeDesc.textContent = '';
                fDocDate.value = '    /  /  ';
                fRcvDate.value = '';
                fNo.value = '';
                fSupNo.value = '';
                fSupName.textContent = '';
                fPoNo.value = '';
                fConfirmUser.value = '';
                if (fFactory) fFactory.value = '';
                if (fCurrency) fCurrency.value = 'NTD';
                if (fRate) fRate.value = 0;
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '');
                Modules.updateAuditButtons(winEl, false, 'puri09');
                grid.clearGrid(false);
                calcTotals();
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
                const tbody = winEl.querySelector('#puri09-browse-tbody');
                const res = await ERP_API.get('get_goods_receipts');
                if (res.success) {
                    receiptList = res.data || [];
                    if (receiptList.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="11" style="text-align:center; padding:20px; color:#888;">目前尚無進貨單據</td></tr>';
                        return;
                    }
                    let rows = '';
                    receiptList.forEach(r => {
                        const no = r.gr_no || r.receipt_no || '';
                        const amt = Math.round(r.gr_amount || r.total_amount || 0);
                        const tax = Math.round(r.tax_amount || (amt * 0.05) || 0);
                        const grand = Math.round(r.grand_total || (amt + tax) || 0);
                        rows += `
                            <tr data-no="${no}" style="cursor:pointer;">
                                <td style="text-align:center;">▶</td>
                                <td>${r.gr_type || r.receipt_type || 'C341'}</td>
                                <td style="font-weight:bold; color:#003366;">${no}</td>
                                <td>${r.gr_date || r.receipt_date || ''}</td>
                                <td>${r.supplier_no || ''}</td>
                                <td>${r.supplier_name || ''}</td>
                                <td>${r.po_no || ''}</td>
                                <td style="text-align:right;">${amt.toLocaleString()}</td>
                                <td style="text-align:right;">${tax.toLocaleString()}</td>
                                <td style="text-align:right; font-weight:bold;">${grand.toLocaleString()}</td>
                                <td style="text-align:center; font-weight:bold; color:${r.status === '已確認' ? 'green' : '#999'};">${r.status || '未確認'}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows;

                    tbody.querySelectorAll('tr[data-no]').forEach(tr => {
                        tr.addEventListener('click', () => {
                            checkDirtyBeforeAction(async () => {
                                const no = tr.getAttribute('data-no');
                                const detailRes = await ERP_API.get('get_goods_receipt', { gr_no: no, receipt_no: no });
                                if (detailRes.success && (detailRes.header || detailRes.receipt)) {
                                    fillReceipt(detailRes.header || detailRes.receipt, detailRes.details || []);
                                    switchTab('detail');
                                }
                            });
                        });
                    });
                }
            };

            const navGR = async (pos) => {
                checkDirtyBeforeAction(async () => {
                    const cur = fNo.value.trim();
                    const res = await ERP_API.get('nav_goods_receipt', { pos, current: cur });
                    if (res.success && res.header) {
                        fillReceipt(res.header, res.details || []);
                        isDirty = false;
                    } else {
                        alert('已無' + (pos === 'first' ? '第一筆' : pos === 'last' ? '最後一筆' : pos === 'prev' ? '上一筆' : '下一筆') + '進貨單資料');
                    }
                });
            };

            const bindNav = (btnId, pos) => {
                const btn = winEl.querySelector('#' + btnId);
                if (btn) btn.addEventListener('click', () => navGR(pos));
            };
            bindNav('puri09-tb-first', 'first');
            bindNav('puri09-tb-prev', 'prev');
            bindNav('puri09-tb-next', 'next');
            bindNav('puri09-tb-last', 'last');

            // Lookups
            const grTypeMap = {
                'A331': '進貨單',
                'A332': '國外進貨單',
                'C331': '配銷進貨單',
                'C341': '進貨單'
            };
            const openGrTypeLookup = () => {
                Modules.openLookup('doc_type_gr', (t) => {
                    fType.value = t.code;
                    fTypeDesc.textContent = t.name;
                    isDirty = true;
                });
            };
            winEl.querySelector('#puri09-lookup-type').addEventListener('click', openGrTypeLookup);
            fType?.addEventListener('dblclick', openGrTypeLookup);
            fType?.addEventListener('input', () => {
                const code = fType.value.trim().toUpperCase();
                fTypeDesc.textContent = grTypeMap[code] || '';
            });
            winEl.querySelector('#puri09-lookup-sup').addEventListener('click', () => {
                Modules.openLookup('supplier', (s) => {
                    fSupNo.value = s.supplier_no || '';
                    fSupName.textContent = s.name_short || s.full_name || '';
                    isDirty = true;
                });
            });
            winEl.querySelector('#puri09-lookup-factory')?.addEventListener('click', () => {
                Modules.openLookup('factory', (f) => {
                    if (fFactory) fFactory.value = f.factory_no;
                    isDirty = true;
                });
            });
            winEl.querySelector('#puri09-lookup-currency')?.addEventListener('click', () => {
                Modules.openLookup('currency', (c) => {
                    if (fCurrency) fCurrency.value = c.code;
                    if (fRate) fRate.value = c.exchange_rate || 1;
                    calcTotals();
                    isDirty = true;
                });
            });

            // 複製前置單據至進貨單核心方法
            const loadPoDataToGr = async (fullPoNo, copyRate) => {
                const res = await ERP_API.get('get_purchase_order', { po_no: fullPoNo });
                if (!res.success || (!res.header && !res.order && !res.purchase_order)) {
                    alert(`查無採購單【${fullPoNo}】之資料！`);
                    return false;
                }
                const po = res.header || res.order || res.purchase_order;
                const details = res.details || [];

                const today = Modules.getTodayStr();
                const newDocNo = await Modules.generateNextDocNo('goods_receipt', today);

                fType.value = '';
                fTypeDesc.textContent = '';
                fNo.value = newDocNo;
                fDocDate.value = today;
                fRcvDate.value = today;
                fSupNo.value = po.supplier_no || '';
                fSupName.textContent = po.supplier_name || '';
                fPoNo.value = fullPoNo;
                if (fFactory) fFactory.value = po.factory || 'TP01';
                if (fCurrency) fCurrency.value = po.currency || 'NTD';
                if (fRate) fRate.value = copyRate ? (po.exchange_rate || 1) : 1;
                fConfirmUser.value = '';
                currentDocStatus = '未確認';
                Modules.setDocStamp(winEl, '未確認');
                Modules.updateAuditButtons(winEl, false, 'puri09');

                const mappedDetails = details.map(d => {
                    const q = d.po_qty || d.qty || 0;
                    return {
                        item_no: d.item_no || '',
                        item_name: d.item_name || '',
                        item_spec: d.item_spec || '',
                        qty: q,
                        check_qty: '',
                        bill_qty: q,
                        unit: d.unit || '',
                        bill_unit: d.bill_unit || d.unit || '',
                        price: d.unit_price || d.price || 0,
                        amount: d.amount || (q * (d.unit_price || d.price || 0)),
                        wh: d.wh || d.warehouse || ''
                    };
                });

                grid.fillGrid(mappedDetails);
                calcTotals();
                Modules.setFormMode(winEl, grid, 'add', statusMsg, newDocNo);
                isDirty = true;
                Modules.toast(`已成功從前置採購單【${fullPoNo}】複製產生進貨單【${newDocNo}】！`, 'success');
                return true;
            };

            // 1:1 複製前置單據彈窗 (1:1 參考圖片第一張範本 COPI06, 緊湊排版無空白)
            const openCopyModal = () => {
                const uCompany = App.currentUser?.company || ('學生區' + (App.currentUser?.username || 'B01'));
                const curPo = fPoNo.value.trim();
                const curPoType = curPo.includes('-') ? curPo.split('-')[0] : '';
                const curPoNo = curPo.includes('-') ? curPo.split('-')[1] : curPo;

                const modal = document.createElement('div');
                modal.className = 'erp-lookup-overlay';
                modal.style.zIndex = '999999';
                modal.style.display = 'flex';
                modal.style.justifyContent = 'center';
                modal.style.alignItems = 'center';

                const dialog = document.createElement('div');
                dialog.className = 'erp-lookup-window';
                dialog.style.width = '375px';
                dialog.style.height = 'auto';
                dialog.style.boxShadow = '2px 2px 14px rgba(0,0,0,0.4)';
                dialog.style.border = '2px outset #ffffff';
                dialog.style.borderRadius = '3px';
                dialog.style.overflow = 'hidden';

                dialog.innerHTML = `
                    <div class="erp-lookup-titlebar" style="background: linear-gradient(to bottom, #7292C2 0%, #4D74A9 100%); height:25px; display:flex; align-items:center; justify-content:space-between; padding:0 6px; user-select:none;">
                        <div class="win-title" style="display:flex; align-items:center; gap:4px; font-size:12px; color:#ffffff;">
                            <span class="win-wf-badge">Wf</span>
                            <span>進貨單建立作業 (PURI09)[${uCompany}]</span>
                        </div>
                        <div class="win-controls" style="display:flex; gap:2px;">
                            <button type="button" class="win-btn minimize" style="font-size:11px; cursor:pointer;" title="最小化">_</button>
                            <button type="button" class="win-btn maximize" style="font-size:11px; cursor:pointer;" title="最大化">▢</button>
                            <button type="button" class="win-btn close puri09-modal-close" style="font-size:11px; cursor:pointer;" title="關閉">✕</button>
                        </div>
                    </div>
                    <div style="background:#ECE9D8; padding:16px 20px 14px 20px; font-size:12px; font-family:Tahoma, 'Microsoft JhengHei', sans-serif; display:flex; flex-direction:column; gap:10px;">
                        <!-- 複製來源 -->
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:12px; color:#000; width:58px; white-space:nowrap;">複製來源</span>
                            <div style="display:inline-flex; align-items:center; gap:16px; border:1px solid #7F9DB9; padding:4px 14px; background:#ECE9D8; border-radius:2px;">
                                <label style="display:flex; align-items:center; gap:4px; margin:0; cursor:pointer; font-size:12px; color:#000;">
                                    <input type="radio" name="puri09_modal_src" id="puri09-src-po" value="po" checked style="margin:0; cursor:pointer;">
                                    <span>採購單</span>
                                </label>
                                <label style="display:flex; align-items:center; gap:4px; margin:0; cursor:pointer; font-size:12px; color:#000;">
                                    <input type="radio" name="puri09_modal_src" id="puri09-src-temp-in" value="temp_in" style="margin:0; cursor:pointer;">
                                    <span>暫入單</span>
                                </label>
                            </div>
                        </div>

                        <!-- 前置單別 -->
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:12px; color:#000; width:58px; white-space:nowrap;">前置單別</span>
                            <div style="display:flex; align-items:center; gap:4px;">
                                <input type="text" id="puri09-m-type" class="erp-input-yellow" style="width:105px; height:21px; font-size:12px; padding:1px 4px; background:#FFFFB0; border:1px solid #7F9DB9;" value="${curPoType}" placeholder="單號選擇後帶入">
                                <button type="button" class="lookup-icon-btn" id="puri09-m-lookup-type" title="挑選前置單號" style="width:22px; height:21px; display:flex; align-items:center; justify-content:center; cursor:pointer; background:#ECE9D8; border:1px solid #7F9DB9;">🔍</button>
                            </div>
                        </div>

                        <!-- 前置單號 -->
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:12px; color:#000; width:58px; white-space:nowrap;">前置單號</span>
                            <div style="display:flex; align-items:center; gap:4px;">
                                <input type="text" id="puri09-m-no" class="erp-input-yellow" style="width:131px; height:21px; font-size:12px; padding:1px 4px; background:#FFFFB0; border:1px solid #7F9DB9;" value="${curPoNo}" placeholder="請挑選或輸入單號">
                            </div>
                        </div>

                        <!-- 複製前置匯率 -->
                        <div style="background:#A6B2BE; padding:4px 10px; display:flex; align-items:center; border:1px solid #7F9DB9; border-radius:1px;">
                            <label style="display:inline-flex; align-items:center; gap:6px; color:#000; cursor:pointer; font-size:12px; margin:0;">
                                <input type="checkbox" id="puri09-m-rate" checked style="margin:0; cursor:pointer;">
                                <span>複製前置匯率</span>
                            </label>
                        </div>

                        <!-- 確定 / 取消 按鈕列 -->
                        <div style="display:flex; justify-content:center; align-items:center; gap:36px; margin-top:6px; padding-top:6px; border-top:1px solid #D4D0C8;">
                            <button type="button" id="puri09-m-btn-confirm" style="display:flex; align-items:center; justify-content:center; gap:6px; min-width:76px; height:25px; background:#ECE9D8; border:2px outset #ffffff; cursor:pointer; font-size:12px; font-family:inherit;">
                                <span style="color:#008000; font-weight:bold; font-size:14px; line-height:1;">✔</span> 確定
                            </button>
                            <button type="button" id="puri09-m-btn-cancel" style="display:flex; align-items:center; justify-content:center; gap:6px; min-width:76px; height:25px; background:#ECE9D8; border:2px outset #ffffff; cursor:pointer; font-size:12px; font-family:inherit;">
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

                dialog.querySelectorAll('.puri09-modal-close, #puri09-m-btn-cancel, .minimize').forEach(el => {
                    el.addEventListener('click', closeDialog);
                });

                const typeInp = dialog.querySelector('#puri09-m-type');
                const noInp = dialog.querySelector('#puri09-m-no');
                const radios = dialog.querySelectorAll('input[name="puri09_modal_src"]');

                radios.forEach(r => {
                    r.addEventListener('change', () => {
                        typeInp.value = '';
                        noInp.value = '';
                    });
                });

                dialog.querySelector('#puri09-m-lookup-type')?.addEventListener('click', () => {
                    Modules.openLookup('purchase_order', (p) => {
                        const fullPoNo = p.po_no || '';
                        const type = p.po_type || (fullPoNo.includes('-') ? fullPoNo.split('-')[0] : '3301');
                        typeInp.value = type;
                        noInp.value = fullPoNo;
                    });
                });

                dialog.querySelector('#puri09-m-btn-confirm')?.addEventListener('click', async () => {
                    const mType = typeInp.value.trim();
                    let mNo = noInp.value.trim();
                    const copyRate = dialog.querySelector('#puri09-m-rate')?.checked ?? true;

                    if (!mNo) {
                        Modules.openLookup('purchase_order', async (p) => {
                            const fullPoNo = p.po_no;
                            const ok = await loadPoDataToGr(fullPoNo, copyRate);
                            if (ok) closeDialog();
                        });
                        return;
                    }

                    const fullPoNo = mNo.includes('-') ? mNo : `${mType ? mType + '-' : ''}${mNo}`;
                    const ok = await loadPoDataToGr(fullPoNo, copyRate);
                    if (ok) {
                        closeDialog();
                    }
                });
            };

            const doSave = async () => {
                const rNo = fNo.value.trim();
                const sNo = fSupNo.value.trim();
                if (!rNo || !sNo) {
                    alert('【必填檢查】請輸入進貨單號及挑選供應商代號！');
                    return false;
                }
                const details = grid.getRowsData();
                if (details.length === 0) {
                    alert('【明細檢查】請至少在表格中輸入進貨品號及實收數量！');
                    return false;
                }

                const grType = fType.value.trim();
                const payload = {
                    header: {
                        gr_no: rNo,
                        receipt_no: rNo,
                        gr_type: grType,
                        receipt_type: grType,
                        doc_date: fDocDate.value.trim() || Modules.getTodayStr(),
                        gr_date: fRcvDate.value.trim() || Modules.getTodayStr(),
                        receipt_date: fRcvDate.value.trim() || Modules.getTodayStr(),
                        supplier_no: sNo,
                        supplier_name: fSupName.textContent.trim(),
                        factory: fFactory ? fFactory.value.trim() : 'TP01',
                        currency: fCurrency ? fCurrency.value.trim() : 'NTD',
                        exchange_rate: fRate ? (parseFloat(fRate.value) || 1) : 1,
                        po_no: fPoNo.value.trim(),
                        status: currentDocStatus
                    },
                    details
                };

                const res = await ERP_API.post('save_goods_receipt', payload);
                if (res.success) {
                    isDirty = false;
                    Modules.setFormMode(winEl, grid, 'browse', statusMsg, rNo);
                    Modules.toast(`進貨單 [${rNo}] 儲存成功！庫存已同步入庫更新。`, 'success');
                    return true;
                } else {
                    Modules.toast('儲存失敗: ' + (res.error || '不明錯誤'), 'error');
                    return false;
                }
            };

            // Toolbar
            winEl.querySelector('#puri09-tb-new').addEventListener('click', () => checkDirtyBeforeAction(() => {
                clearReceipt();
                switchTab('detail');
            }));
            winEl.querySelector('#puri09-tb-edit').addEventListener('click', () => {
                const curNo = fNo.value.trim();
                if (!curNo) {
                    alert('請先查詢單據或點選「新增」！');
                    return;
                }
                switchTab('detail');
                Modules.setFormMode(winEl, grid, 'edit', statusMsg, curNo);
                Modules.toast(`進貨單 [${curNo}] 進入修改模式`, 'info');
            });
            const puri09CopyBtn = winEl.querySelector('#puri09-tb-copy');
            if (puri09CopyBtn) puri09CopyBtn.addEventListener('click', openCopyModal);
            const puri09MenuFunc = winEl.querySelector('#puri09-menu-func');
            if (puri09MenuFunc) puri09MenuFunc.addEventListener('click', openCopyModal);
            winEl.querySelector('#puri09-tb-query').addEventListener('click', () => {
                checkDirtyBeforeAction(() => {
                    Modules.openLookup('goods_receipt', async (g) => {
                        const targetNo = g.receipt_no || g.gr_no || g.no || '';
                        const res = await ERP_API.get('get_goods_receipt', { receipt_no: targetNo, gr_no: targetNo });
                        const doc = res.header || res.receipt || res.goods_receipt;
                        if (res.success && doc) {
                            fillReceipt(doc, res.details || []);
                            switchTab('detail');
                        } else {
                            alert(res.error || '查無此進貨單資料');
                        }
                    });
                });
            });

            winEl.querySelector('#puri09-tb-save').addEventListener('click', doSave);

            winEl.querySelector('#puri09-tb-cancel').addEventListener('click', () => {
                if (isDirty) {
                    const answer = confirm("資料尚未儲存，是否要儲存目前的單據？\n\n點選【確定】：進行儲存\n點選【取消】：直接清除放棄變更");
                    if (answer) {
                        doSave();
                    } else {
                        resetReceiptBlank();
                        Modules.toast('已取消並清除未儲存變更。', 'info');
                    }
                } else {
                    resetReceiptBlank();
                    Modules.toast('已清除重置頁面資料。', 'info');
                }
            });

            winEl.querySelector('#puri09-tb-confirm').addEventListener('click', async () => {
                const btn = winEl.querySelector('#puri09-tb-confirm');
                if (btn && btn.disabled) return;
                const rNo = fNo.value.trim();
                if (!rNo) return;
                const res = await ERP_API.post('confirm_doc', { type: 'goods_receipt', doc_no: rNo, status: '已確認' });
                if (res.success) {
                    currentDocStatus = '已確認';
                    fConfirmUser.value = App.currentUser?.username || '';
                    Modules.updateAuditButtons(winEl, true, 'puri09');
                    Modules.toast('進貨單確認完成！', 'success');
                }
            });

            winEl.querySelector('#puri09-tb-unconfirm').addEventListener('click', async () => {
                const btn = winEl.querySelector('#puri09-tb-unconfirm');
                if (btn && btn.disabled) return;
                const rNo = fNo.value.trim();
                if (!rNo) return;
                const res = await ERP_API.post('confirm_doc', { type: 'goods_receipt', doc_no: rNo, status: '未確認' });
                if (res.success) {
                    currentDocStatus = '未確認';
                    fConfirmUser.value = '';
                    Modules.updateAuditButtons(winEl, false, 'puri09');
                    Modules.toast('進貨單已取消確認！', 'info');
                }
            });

            winEl.querySelector('#puri09-tb-del').addEventListener('click', async () => {
                const rNo = fNo.value.trim();
                if (!rNo) return;
                if (confirm(`確定要刪除進貨單 [${rNo}] 嗎？`)) {
                    const res = await ERP_API.post('delete_goods_receipt', { receipt_no: rNo, gr_no: rNo });
                    if (res.success) {
                        Modules.toast('進貨單已成功刪除！', 'success');
                        clearReceipt();
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

            winEl.querySelectorAll('.erp-subtab-header .erp-subtab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    winEl.querySelectorAll('.erp-subtab-header .erp-subtab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });

            // Initial load: 100% 空白模式，按新增或查詢才出現
            resetReceiptBlank();
        });
    },

    // ========================================================
    // 13. 訂單樹狀資訊查詢 (COPQ05 - 1:1 對標 1105擷取.PNG)
    // ========================================================
    openCOPQ05(defaultOrderNo = '') {
        const u = App.currentUser?.company || '學生區';
        const title = `訂單樹狀資訊查詢(COPQ05)[${u}]`;
        const winId = 'COPQ05';

        const html = `
            <div class="erp-menubar">
                <span class="erp-menu-item" id="copq05-menu-query">查詢(<u>Q</u>)</span>
                <span class="erp-menu-item" id="copq05-menu-refresh">重新整理(<u>R</u>)</span>
                <span class="erp-menu-item" onclick="App.closeWindow('${winId}')">離開(<u>X</u>)</span>
            </div>

            <!-- Tab Headers (1:1 擷取 1105擷取.PNG) -->
            <div style="display:flex; gap:2px; padding:4px 6px 0 6px; background:#ECE9D8; border-bottom:1px solid #7F9DB9;">
                <button type="button" class="copq05-tab-btn" data-tab="tab-filter" style="padding:4px 14px; background:#D4D0C8; border:1px solid #7F9DB9; border-bottom:none; border-top-left-radius:3px; border-top-right-radius:3px; cursor:pointer; font-size:12px;">訂單查詢條件</button>
                <button type="button" class="copq05-tab-btn" data-tab="tab-contract" style="padding:4px 14px; background:#D4D0C8; border:1px solid #7F9DB9; border-bottom:none; border-top-left-radius:3px; border-top-right-radius:3px; cursor:pointer; font-size:12px;">合約訂單查詢條件</button>
                <button type="button" class="copq05-tab-btn active" data-tab="tab-result" style="padding:4px 16px; background:#FFFFFF; border:1px solid #7F9DB9; border-bottom:1px solid #FFFFFF; border-top-left-radius:3px; border-top-right-radius:3px; cursor:pointer; font-weight:bold; font-size:12px; margin-bottom:-1px;">查詢結果</button>
            </div>

            <!-- Tab 1: 訂單查詢條件 -->
            <div id="copq05-page-filter" class="copq05-tab-page" style="display:none; flex:1; padding:16px; background:#ECE9D8; overflow-y:auto;">
                <div style="background:#FFFFFF; border:1px solid #7F9DB9; padding:16px; max-width:650px; border-radius:3px;">
                    <h4 style="margin:0 0 12px 0; color:#003366; border-bottom:1px solid #CCC; padding-bottom:6px;">訂單篩選條件設定</h4>
                    <table style="width:100%; border-collapse:separate; border-spacing:6px 8px; font-size:12px;">
                        <tr>
                            <td style="width:90px; text-align:right; font-weight:bold;">訂單單號:</td>
                            <td>
                                <input type="text" id="copq05-cond-order-no" class="erp-input-cyan" style="width:180px;" value="${defaultOrderNo}">
                                <button type="button" class="lookup-icon-btn" id="copq05-lookup-cond-order" title="挑選訂單">🔍</button>
                                <span style="color:#666; font-size:11px; margin-left:6px;">(支援模糊搜尋)</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align:right; font-weight:bold;">客戶代號:</td>
                            <td>
                                <input type="text" id="copq05-cond-cust-no" class="erp-input" style="width:180px;">
                                <button type="button" class="lookup-icon-btn" id="copq05-lookup-cond-cust" title="挑選客戶">🔍</button>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align:right; font-weight:bold;">單據日期:</td>
                            <td>
                                <input type="text" id="copq05-cond-date-from" class="erp-input" style="width:110px;" placeholder="yyyy/mm/dd">
                                ~
                                <input type="text" id="copq05-cond-date-to" class="erp-input" style="width:110px;" placeholder="yyyy/mm/dd">
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td style="padding-top:10px;">
                                <button type="button" class="erp-tb-btn" id="copq05-btn-do-filter" style="width:auto; padding:4px 18px; font-weight:bold; color:#003366;">🔍 依條件執行查詢並顯示結果</button>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

            <!-- Tab 2: 合約訂單查詢條件 -->
            <div id="copq05-page-contract" class="copq05-tab-page" style="display:none; flex:1; padding:16px; background:#ECE9D8; overflow-y:auto;">
                <div style="background:#FFFFFF; border:1px solid #7F9DB9; padding:16px; max-width:650px; border-radius:3px;">
                    <h4 style="margin:0 0 12px 0; color:#003366; border-bottom:1px solid #CCC; padding-bottom:6px;">合約訂單篩選條件</h4>
                    <p style="color:#666; font-size:12px;">此作業支援長約/框架合約分批受訂樹狀溯源追蹤。</p>
                    <button type="button" class="erp-tb-btn" id="copq05-btn-contract-query" style="width:auto; padding:4px 18px; font-weight:bold; color:#003366;">🔍 檢索合約訂單</button>
                </div>
            </div>

            <!-- Tab 3: 查詢結果 (1:1 擷取 1105擷取.PNG) -->
            <div id="copq05-page-result" class="copq05-tab-page" style="flex:1; display:flex; flex-direction:column; overflow:hidden; background:#ECE9D8; padding:3px;">
                <div style="flex:1; display:flex; gap:4px; overflow:hidden;">
                    <!-- Left: 訂單單身明細清單網格 -->
                    <div style="width:410px; display:flex; flex-direction:column; border:1px solid #7F9DB9; background:#FFFFFF;">
                        <div style="flex:1; overflow:auto;">
                            <table class="erp-grid-table" id="copq05-order-grid" style="width:100%; min-width:400px;">
                                <thead>
                                    <tr>
                                        <th style="width:70px; text-align:left;">訂單單別</th>
                                        <th style="width:95px; text-align:left;">單號</th>
                                        <th style="width:45px; text-align:center;">序號</th>
                                        <th style="width:75px; text-align:left;">品號</th>
                                        <th style="text-align:left;">品名</th>
                                    </tr>
                                </thead>
                                <tbody id="copq05-order-tbody">
                                    <tr><td colspan="5" style="text-align:center; color:#888; padding:30px 10px;">檢索中...</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div style="display:flex; align-items:center; gap:6px; padding:4px 6px; background:#ECE9D8; border-top:1px solid #7F9DB9; font-size:12px;">
                            <span style="white-space:nowrap;">展開訂單資訊:<b id="copq05-sel-text" style="color:#003366; margin-left:4px;">-</b></span>
                            <button type="button" class="erp-tb-btn" id="copq05-btn-expand-sel" style="margin-left:auto; width:auto; padding:1px 10px;">展開</button>
                            <button type="button" class="erp-tb-btn" id="copq05-btn-export-excel" style="width:auto; padding:1px 10px;">轉EXCEL</button>
                        </div>
                    </div>

                    <!-- Right: 1:1 樹狀檢視結構 TreeView -->
                    <div style="flex:1; display:flex; flex-direction:column; border:1px solid #7F9DB9; background:#FFFFFF;">
                        <div id="copq05-tree-view" style="flex:1; overflow:auto; padding:10px 14px; font-family:'Segoe UI', Tahoma, 'Microsoft JhengHei', sans-serif; font-size:12px; line-height:1.6;">
                            <div style="color:#888; text-align:center; padding:60px 10px;">正在加載訂單樹狀關聯結構...</div>
                        </div>

                        <!-- Bottom Action Bar (1:1 擷取 1105擷取.PNG) -->
                        <div style="display:flex; align-items:center; gap:8px; padding:4px 8px; background:#ECE9D8; border-top:1px solid #7F9DB9; font-size:12px;">
                            <label style="font-weight:bold; color:#003366; white-space:nowrap;">開啟作業:</label>
                            <select id="copq05-module-select" class="erp-select" style="width:230px;">
                                <option value="COPI06" data-type="order">COPI06 客戶訂單建立作業</option>
                                <option value="COPI08" data-type="delivery">COPI08 銷貨單建立作業</option>
                                <option value="PURI05" data-type="req">PURI05 請購單建立作業</option>
                                <option value="PURI07" data-type="po">PURI07 採購單建立作業</option>
                                <option value="PURI09" data-type="gr">PURI09 進貨單建立作業</option>
                                <option value="COPB10">COPB10 訂單轉請購單</option>
                                <option value="PURB01">PURB01 請購資料更新作業</option>
                                <option value="QUEUE_CONSOLE">QUEUE 批次佇列控制台</option>
                            </select>
                            <button type="button" class="erp-tb-btn" id="copq05-btn-open-module" style="width:auto; padding:2px 14px; font-weight:bold; color:#003366;">開啟</button>
                            <span id="copq05-selected-doc-badge" style="margin-left:auto; color:#475569; font-size:11px;">目前選取單據: 無</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Status Bar -->
            <div class="erp-window-statusbar">
                <span class="status-cell" id="copq05-status-left">瀏覽</span>
                <span class="status-cell" id="copq05-status-center">作業: COPQ05</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 980, 630, (winEl) => {
            let activeOrderNo = defaultOrderNo;
            let currentData = null;
            let currentSelectedRow = null;
            let activeDocForOpen = { type: 'order', no: '' };

            const tabBtns = winEl.querySelectorAll('.copq05-tab-btn');
            const pageFilter = winEl.querySelector('#copq05-page-filter');
            const pageContract = winEl.querySelector('#copq05-page-contract');
            const pageResult = winEl.querySelector('#copq05-page-result');

            const orderTbody = winEl.querySelector('#copq05-order-tbody');
            const treeBox = winEl.querySelector('#copq05-tree-view');
            const selLabel = winEl.querySelector('#copq05-sel-text');
            const statusLeft = winEl.querySelector('#copq05-status-left');
            const moduleSelect = winEl.querySelector('#copq05-module-select');
            const docBadge = winEl.querySelector('#copq05-selected-doc-badge');

            // 頁籤切換控制
            const switchTab = (tabName) => {
                tabBtns.forEach(btn => {
                    const match = btn.getAttribute('data-tab') === tabName;
                    btn.classList.toggle('active', match);
                    btn.style.background = match ? '#FFFFFF' : '#D4D0C8';
                    btn.style.fontWeight = match ? 'bold' : 'normal';
                    btn.style.marginBottom = match ? '-1px' : '0';
                    btn.style.borderBottom = match ? '1px solid #FFFFFF' : 'none';
                });
                pageFilter.style.display = (tabName === 'tab-filter') ? 'block' : 'none';
                pageContract.style.display = (tabName === 'tab-contract') ? 'block' : 'none';
                pageResult.style.display = (tabName === 'tab-result') ? 'flex' : 'none';
            };

            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
            });

            // 挑選訂單 / 客戶
            winEl.querySelector('#copq05-lookup-cond-order').addEventListener('click', () => {
                Modules.openLookup('order', (o) => {
                    winEl.querySelector('#copq05-cond-order-no').value = o.order_no;
                });
            });
            winEl.querySelector('#copq05-lookup-cond-cust').addEventListener('click', () => {
                Modules.openLookup('customer', (c) => {
                    winEl.querySelector('#copq05-cond-cust-no').value = c.customer_no;
                });
            });

            // 執行篩選
            winEl.querySelector('#copq05-btn-do-filter').addEventListener('click', () => {
                const oNo = winEl.querySelector('#copq05-cond-order-no').value.trim();
                const cNo = winEl.querySelector('#copq05-cond-cust-no').value.trim();
                switchTab('tab-result');
                fetchOrderData(oNo, cNo);
            });

            winEl.querySelector('#copq05-btn-contract-query').addEventListener('click', () => {
                switchTab('tab-result');
                fetchOrderData();
            });

            winEl.querySelector('#copq05-menu-query').addEventListener('click', () => switchTab('tab-filter'));
            winEl.querySelector('#copq05-menu-refresh').addEventListener('click', () => fetchOrderData(activeOrderNo));

            // 開啟作業連動按鈕
            const openSelectedModule = () => {
                const targetModule = moduleSelect.value;
                if (!targetModule) return;
                Modules.open(targetModule, activeDocForOpen.no || activeOrderNo);
            };
            winEl.querySelector('#copq05-btn-open-module').addEventListener('click', openSelectedModule);

            // 資料查詢核心方法
            const fetchOrderData = async (orderNo = '', customerNo = '') => {
                statusLeft.textContent = '檢索配銷樹狀關聯中...';
                orderTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#888; padding:30px 10px;">檢索中...</td></tr>`;
                treeBox.innerHTML = `<div style="color:#888; text-align:center; padding:60px 10px;">正在加載訂單樹狀關聯結構...</div>`;

                try {
                    const res = await ERP_API.get('order_tree_query', { order_no: orderNo, customer_no: customerNo });
                    if (!res.success) {
                        alert('查詢失敗: ' + (res.error || '不明錯誤'));
                        statusLeft.textContent = '查詢失敗';
                        return;
                    }

                    currentData = res.data || {};
                    const list = currentData.list || [];
                    statusLeft.textContent = `共 ${list.length} 筆訂單明細資料`;

                    renderOrderGrid(list);

                    // 自動展開第一筆或指定單號
                    if (list.length > 0) {
                        const targetRow = list.find(r => r.order_no === orderNo) || list[0];
                        selectOrderRow(targetRow);
                    } else {
                        treeBox.innerHTML = `<div style="color:#888; text-align:center; padding:60px 10px;">無符合條件之客戶訂單資料。</div>`;
                        selLabel.textContent = '-';
                        activeDocForOpen = { type: 'order', no: '' };
                        docBadge.textContent = '目前選取單據: 無';
                    }
                } catch (e) {
                    console.error('COPQ05 query error', e);
                    alert('網路或伺服器錯誤: ' + e.message);
                    statusLeft.textContent = '查詢錯誤';
                }
            };

            // 渲染左側清單
            const renderOrderGrid = (list) => {
                if (!list || list.length === 0) {
                    orderTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#888; padding:30px 10px;">無符合條件資料</td></tr>`;
                    return;
                }

                orderTbody.innerHTML = list.map((item, idx) => {
                    const rawOrderNo = item.order_no || '';
                    const noParts = rawOrderNo.split('-');
                    const docType = item.order_type || noParts[0] || '';
                    const docNum = noParts[1] || rawOrderNo;

                    return `
                        <tr class="copq05-grid-row" data-idx="${idx}" style="cursor:pointer; user-select:none; color:#000000;">
                            <td style="border-right:1px solid #D0D0D0; padding:3px 6px; color:#000000;">${docType}</td>
                            <td style="border-right:1px solid #D0D0D0; padding:3px 6px; font-weight:bold; color:#003366;">${docNum}</td>
                            <td style="border-right:1px solid #D0D0D0; padding:3px 6px; text-align:center; color:#000000;">${item.line_no || '0001'}</td>
                            <td style="border-right:1px solid #D0D0D0; padding:3px 6px; color:#000000;">${item.item_no || ''}</td>
                            <td style="padding:3px 6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:140px; color:#000000;" title="${item.item_name || ''}">${item.item_name || ''}</td>
                        </tr>
                    `;
                }).join('');

                orderTbody.querySelectorAll('.copq05-grid-row').forEach(tr => {
                    tr.addEventListener('click', () => {
                        const idx = parseInt(tr.getAttribute('data-idx'), 10);
                        selectOrderRow(list[idx], tr);
                    });
                });
            };

            // 選取某筆訂單項目並展開樹狀圖
            const selectOrderRow = (rowItem, targetTr = null) => {
                if (!rowItem) return;
                activeOrderNo = rowItem.order_no;
                currentSelectedRow = rowItem;

                const labelStr = `${rowItem.order_no} -${rowItem.line_no || '0001'}`;
                selLabel.textContent = labelStr;
                activeDocForOpen = { type: 'order', no: rowItem.order_no };
                docBadge.textContent = `目前選取: 客戶訂單 [${rowItem.order_no}]`;
                moduleSelect.value = 'COPI06';

                // 高亮當前行 (全黑字清晰呈現，避免白字看不清)
                orderTbody.querySelectorAll('.copq05-grid-row').forEach(tr => {
                    tr.classList.remove('selected');
                    tr.querySelectorAll('td').forEach(td => {
                        td.style.backgroundColor = '';
                        td.style.color = '#000000';
                    });
                    const docNumEl = tr.querySelector('td:nth-child(2)');
                    if (docNumEl) docNumEl.style.color = '#003366';
                });
                if (!targetTr) {
                    targetTr = orderTbody.querySelector(`.copq05-grid-row[data-idx="${currentData.list.indexOf(rowItem)}"]`);
                }
                if (targetTr) {
                    targetTr.classList.add('selected');
                    targetTr.querySelectorAll('td').forEach(td => {
                        td.style.backgroundColor = '#CCE8FF';
                        td.style.color = '#000000';
                    });
                    const docNumEl = targetTr.querySelector('td:nth-child(2)');
                    if (docNumEl) docNumEl.style.color = '#003399';
                }

                renderTreeStructure(rowItem);
            };

            winEl.querySelector('#copq05-btn-expand-sel').addEventListener('click', () => {
                if (currentSelectedRow) selectOrderRow(currentSelectedRow);
            });

            // 轉 EXCEL
            winEl.querySelector('#copq05-btn-export-excel').addEventListener('click', () => {
                if (!currentData || !currentData.list || currentData.list.length === 0) {
                    alert('目前無資料可供匯出！');
                    return;
                }
                const csvHeader = "\uFEFF訂單單別,訂單單號,序號,品號,品名,規格,訂單數量,單位,單價,預計交期,客戶代號,客戶名稱\n";
                const csvRows = currentData.list.map(r => [
                    `"${r.order_type || ''}"`,
                    `"${r.order_no || ''}"`,
                    `"${r.line_no || ''}"`,
                    `"${r.item_no || ''}"`,
                    `"${(r.item_name || '').replace(/"/g, '""')}"`,
                    `"${(r.item_spec || '').replace(/"/g, '""')}"`,
                    `"${r.order_qty || '0'}"`,
                    `"${r.unit || ''}"`,
                    `"${r.unit_price || '0'}"`,
                    `"${r.est_delivery_date || ''}"`,
                    `"${r.customer_no || ''}"`,
                    `"${(r.customer_name || '').replace(/"/g, '""')}"`
                ].join(',')).join("\n");

                const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `訂單樹狀明細表_${activeOrderNo || 'ALL'}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                Modules.toast('已成功匯出 EXCEL / CSV 檔案！');
            });

            // 渲染右側 1:1 Windows ERP 經典樹狀結構 (完全遵循 1105擷取.PNG)
            const renderTreeStructure = (selectedRow) => {
                const order = currentData.order || {};
                const deliveries = currentData.deliveries || [];
                const requisitions = currentData.requisitions || [];
                const pos = currentData.pos || currentData.purchase_orders || [];
                const receipts = currentData.receipts || [];

                const oNo = selectedRow.order_no || order.order_no || '';
                const oDate = selectedRow.order_date || order.order_date || '';
                const cNo = selectedRow.customer_no || order.customer_no || '';
                const cName = selectedRow.customer_name || order.customer_name || '';
                const lineNo = selectedRow.line_no || '0001';
                const iNo = selectedRow.item_no || '';
                const iName = selectedRow.item_name || '';
                const oQty = parseInt(selectedRow.order_qty || 0);
                const unit = selectedRow.unit || '台';
                const estDate = selectedRow.est_delivery_date || '';

                let html = `
                    <div class="tree-classic" style="user-select:none; font-family:'Tahoma','Segoe UI',sans-serif; color:#000000;">
                        <!-- Root: 客戶訂單 -->
                        <div class="tree-branch" style="position:relative;">
                            <div class="tree-item-title active-tree-node" data-module="COPI06" data-type="order" data-no="${oNo}" style="display:flex; align-items:center; gap:4px; padding:3px 6px; cursor:pointer; background:#CCE8FF; font-weight:bold; color:#000000; border-radius:2px;">
                                <span class="tree-toggle" style="display:inline-block; width:11px; height:11px; line-height:9px; text-align:center; border:1px solid #333333; background:#FFFFFF; font-size:10px; font-weight:bold; margin-right:4px; color:#000000;">-</span>
                                <span style="color:#000000;">客戶訂單:<b style="color:#000000;">${oNo}</b> ${oDate} ${cName}(${cNo})</span>
                            </div>

                            <div class="tree-children" style="margin-left:20px; border-left:1px dotted #888888; padding-left:12px; margin-top:2px;">
                                <!-- Order Line Item Details -->
                                <div class="tree-node-row" data-module="COPI06" data-type="order" data-no="${oNo}" style="padding:2px 4px; cursor:pointer; color:#000000;">
                                    <span style="color:#000000;">└─</span> <b style="color:#000000;">${oNo} -${lineNo}</b> <span style="color:#000000;">${iNo}(${iName})</span> <b style="color:#000000;">${oQty}</b> <span style="color:#000000;">${unit} 預交日:${estDate}</span>
                                </div>

                                <!-- 訂單變更單 -->
                                <div class="tree-group" style="margin-top:3px;">
                                    <div class="tree-node-row" style="color:#000000; padding:2px 4px;">
                                        <span class="tree-toggle" style="display:inline-block; width:11px; height:11px; line-height:9px; text-align:center; border:1px solid #666666; background:#F8F8F8; font-size:10px; margin-right:4px; color:#000000;">+</span>
                                        <span style="color:#000000;">訂單變更單 (0)</span>
                                    </div>
                                </div>

                                <!-- 銷貨單 (A231) -->
                                <div class="tree-group" style="margin-top:3px;">
                                    <div class="tree-node-row" style="padding:2px 4px; font-weight:bold; color:#000000;">
                                        <span class="tree-toggle" style="display:inline-block; width:11px; height:11px; line-height:9px; text-align:center; border:1px solid #333333; background:#FFFFFF; font-size:10px; margin-right:4px; color:#000000;">-</span>
                                        <span style="color:#000000;">銷貨單 (${deliveries.length})</span>
                                    </div>
                                    <div style="margin-left:18px; border-left:1px dotted #888888; padding-left:12px;">
                                        ${deliveries.length > 0 ? deliveries.map(d => `
                                            <div class="tree-node-row" data-module="COPI08" data-type="delivery" data-no="${d.delivery_no}" style="padding:2px 4px; cursor:pointer; color:#000000;">
                                                <span class="tree-toggle" style="display:inline-block; width:11px; height:11px; line-height:9px; text-align:center; border:1px solid #333333; background:#FFFFFF; font-size:10px; margin-right:4px; color:#000000;">-</span>
                                                <b style="color:#003399;">${d.delivery_no} -${d.detail_line_no || '0001'}</b> <span style="color:#000000;">${d.delivery_date || ''} 銷:</span><b style="color:#000000;">${parseInt(d.delivery_qty || 0)}</b> <span style="color:#000000;">贈/備:</span><b style="color:#000000;">${parseInt(d.gift_qty || 0)}</b> <span style="color:#000000;">${d.unit || '台'}</span> <span style="color:#006600; font-weight:bold;">[${d.status || '已確認'}]</span>
                                                <div style="margin-left:18px; border-left:1px dotted #888888; padding-left:10px; color:#000000;">
                                                    <div style="color:#000000;">└─ 銷貨結帳單</div>
                                                    <div style="margin-left:16px; color:#000000;">└─ 銷貨收帳單</div>
                                                </div>
                                            </div>
                                        `).join('') : '<div style="color:#555555; font-size:11px; padding:2px 4px;">(尚無關聯銷貨出庫紀錄)</div>'}
                                    </div>
                                </div>

                                <!-- 銷退單 -->
                                <div class="tree-group" style="margin-top:3px;">
                                    <div class="tree-node-row" style="color:#000000; padding:2px 4px;">
                                        <span class="tree-toggle" style="display:inline-block; width:11px; height:11px; line-height:9px; text-align:center; border:1px solid #666666; background:#F8F8F8; font-size:10px; margin-right:4px; color:#000000;">+</span>
                                        <span style="color:#000000;">銷退單 (0)</span>
                                    </div>
                                </div>

                                <!-- 預收結帳單 -->
                                <div class="tree-group" style="margin-top:3px;">
                                    <div class="tree-node-row" style="color:#000000; padding:2px 4px;">
                                        <span class="tree-toggle" style="display:inline-block; width:11px; height:11px; line-height:9px; text-align:center; border:1px solid #666666; background:#F8F8F8; font-size:10px; margin-right:4px; color:#000000;">+</span>
                                        <span style="color:#000000;">預收結帳單 (0)</span>
                                    </div>
                                </div>

                                <!-- 請購單 (C311) -->
                                <div class="tree-group" style="margin-top:3px;">
                                    <div class="tree-node-row" style="padding:2px 4px; font-weight:bold; color:#000000;">
                                        <span class="tree-toggle" style="display:inline-block; width:11px; height:11px; line-height:9px; text-align:center; border:1px solid #333333; background:#FFFFFF; font-size:10px; margin-right:4px; color:#000000;">-</span>
                                        <span style="color:#000000;">請購單 (${requisitions.length})</span>
                                    </div>
                                    <div style="margin-left:18px; border-left:1px dotted #888888; padding-left:12px;">
                                        ${requisitions.length > 0 ? requisitions.map(r => `
                                            <div class="tree-node-row" data-module="PURI05" data-type="req" data-no="${r.req_no}" style="padding:2px 4px; cursor:pointer; color:#000000;">
                                                <span style="color:#000000;">└─</span> <b style="color:#003399;">${r.req_no} -${r.detail_line_no || '0001'}</b> <span style="color:#000000;">${r.req_date || ''}</span> <b style="color:#000000;">${parseInt(r.req_qty || 0)}</b> <span style="color:#000000;">${r.unit || '台'} 已採:</span><b style="color:#000000;">${parseInt(r.po_qty || 0)}</b> <span style="color:#000000;">${r.unit || '台'}</span> <span style="color:${r.status === '已確認' ? '#006600' : '#C00000'}; font-weight:bold;">[${r.status || '未確認'}]</span>
                                            </div>
                                        `).join('') : '<div style="color:#555555; font-size:11px; padding:2px 4px;">(尚未自此訂單轉出請購單)</div>'}
                                    </div>
                                </div>

                                <!-- 採購單 (C331) -->
                                <div class="tree-group" style="margin-top:3px;">
                                    <div class="tree-node-row" style="padding:2px 4px; font-weight:bold; color:#000000;">
                                        <span class="tree-toggle" style="display:inline-block; width:11px; height:11px; line-height:9px; text-align:center; border:1px solid #333333; background:#FFFFFF; font-size:10px; margin-right:4px; color:#000000;">-</span>
                                        <span style="color:#000000;">採購單 (${pos.length})</span>
                                    </div>
                                    <div style="margin-left:18px; border-left:1px dotted #888888; padding-left:12px;">
                                        ${pos.length > 0 ? pos.map(p => `
                                            <div class="tree-node-row" data-module="PURI07" data-type="po" data-no="${p.po_no}" style="padding:2px 4px; cursor:pointer; color:#000000;">
                                                <span style="color:#000000;">└─</span> <b style="color:#003399;">${p.po_no} -${p.detail_line_no || '0001'}</b> <span style="color:#000000;">${p.po_date || ''}</span> <b style="color:#000000;">${parseInt(p.po_qty || 0)}</b> <span style="color:#000000;">${p.unit || '台'} 已交:</span><b style="color:#000000;">${parseInt(p.received_qty || 0)}</b> <span style="color:#000000;">預交日:${p.est_date || ''}</span> <span style="color:#006600; font-weight:bold;">[${p.status || '已確認'}]</span>
                                            </div>
                                        `).join('') : '<div style="color:#555555; font-size:11px; padding:2px 4px;">(尚無關聯之採購單)</div>'}
                                    </div>
                                </div>

                                <!-- 進貨驗收入庫單 (C341 / A331) -->
                                <div class="tree-group" style="margin-top:3px;">
                                    <div class="tree-node-row" style="padding:2px 4px; font-weight:bold; color:#000000;">
                                        <span class="tree-toggle" style="display:inline-block; width:11px; height:11px; line-height:9px; text-align:center; border:1px solid #333333; background:#FFFFFF; font-size:10px; margin-right:4px; color:#000000;">-</span>
                                        <span style="color:#000000;">進貨驗收入庫單 (${receipts.length})</span>
                                    </div>
                                    <div style="margin-left:18px; border-left:1px dotted #888888; padding-left:12px;">
                                        ${receipts.length > 0 ? receipts.map(g => `
                                            <div class="tree-node-row" data-module="PURI09" data-type="gr" data-no="${g.gr_no}" style="padding:2px 4px; cursor:pointer; color:#000000;">
                                                <span style="color:#000000;">└─</span> <b style="color:#003399;">${g.gr_no} -${g.detail_line_no || '0001'}</b> <span style="color:#000000;">${g.gr_date || ''} 進:</span><b style="color:#000000;">${parseInt(g.gr_qty || 0)}</b> <span style="color:#000000;">檢:</span><b style="color:#000000;">${parseInt(g.check_qty || 0)}</b> <span style="color:#000000;">${g.unit || '台'} [${g.warehouse || 'W01'}]</span> <span style="color:#006600; font-weight:bold;">[${g.status || '已確認'}]</span>
                                            </div>
                                        `).join('') : '<div style="color:#555555; font-size:11px; padding:2px 4px;">(尚無進貨單入庫紀錄)</div>'}
                                    </div>
                                </div>

                                <!-- 製令單 -->
                                <div class="tree-group" style="margin-top:3px; color:#000000;">
                                    <div class="tree-node-row" style="padding:2px 4px; color:#000000;">
                                        <span class="tree-toggle" style="display:inline-block; width:11px; height:11px; line-height:9px; text-align:center; border:1px solid #666666; background:#F8F8F8; font-size:10px; margin-right:4px; color:#000000;">+</span>
                                        <span style="color:#000000;">製令單 (0)</span>
                                    </div>
                                </div>

                                <!-- 批次採購計畫 / 批次生產計劃 / 出貨通知單 / 暫出入單 -->
                                <div style="margin-top:3px; color:#000000; padding:2px 4px;">
                                    <div style="color:#000000;">└─ 批次採購計畫</div>
                                    <div style="color:#000000;">└─ 批次生產計劃</div>
                                    <div style="color:#000000;">└─ 出貨通知單</div>
                                    <div style="color:#000000;">└─ 暫出入單 ➔ 暫出入歸還單</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                treeBox.innerHTML = html;

                // 樹狀節點點選連動
                treeBox.querySelectorAll('.tree-node-row, .tree-item-title').forEach(el => {
                    const mod = el.getAttribute('data-module');
                    const no = el.getAttribute('data-no');
                    const type = el.getAttribute('data-type');
                    if (!mod) return;

                    el.addEventListener('click', (e) => {
                        e.stopPropagation();
                        treeBox.querySelectorAll('.tree-node-row, .tree-item-title').forEach(r => {
                            r.style.background = '';
                            r.style.color = '#000000';
                        });
                        el.style.background = '#CCE8FF';
                        el.style.color = '#000000';

                        activeDocForOpen = { type, no };
                        moduleSelect.value = mod;

                        let docName = '單據';
                        if (type === 'order') docName = '客戶訂單';
                        else if (type === 'delivery') docName = '銷貨出庫單';
                        else if (type === 'req') docName = '物料請購單';
                        else if (type === 'po') docName = '採購單';
                        else if (type === 'gr') docName = '進貨入庫單';

                        docBadge.textContent = `目前選取: ${docName} [${no}]`;
                    });

                    // 雙擊節點直接開啟對應作業
                    el.addEventListener('dblclick', (e) => {
                        e.stopPropagation();
                        Modules.open(mod, no);
                    });
                });
            };

            // 初次載入自動執行全單據清單查詢
            fetchOrderData(defaultOrderNo);
        });
    }
});
