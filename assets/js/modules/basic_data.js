// ========================================================
// Conductor ERP Modules: Basic Data (客戶、廠商、品號)
// ========================================================

window.Modules = window.Modules || {};

Object.assign(window.Modules, {
    openCOPI01(targetCustNo = '') {
        const u = App.currentUser?.company || '學生區';
        const title = `客戶資料建立作業 (COPI01)[${u}]`;
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
                <button class="erp-tb-btn" title="列印" onclick="alert('客戶資料清單列印中...')">🖨️</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="首筆" id="copi01-tb-first">|◀</button>
                <button class="erp-tb-btn" title="上筆" id="copi01-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下筆" id="copi01-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="copi01-tb-last">▶|</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="儲存" id="copi01-tb-save" style="color:#008000; font-weight:bold; font-size:15px;">✔</button>
                <button class="erp-tb-btn tb-btn-cancel" title="取消 (清除放棄未儲存變更)" id="copi01-tb-cancel" style="color:#CC0000; font-weight:bold; font-size:15px;">✖</button>
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
                            <input type="text" id="copi01-version" style="width:45px;" value="0000">
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>客戶全名</label>
                            <input type="text" id="copi01-full" style="width:360px;" value="">
                        </div>
                        <div class="erp-field" style="margin-left:20px;">
                            <label>客戶核准日</label>
                            <input type="text" id="copi01-approval-date" style="width:80px;" value="/  /">
                            <button type="button" class="lookup-icon-btn" id="copi01-cal-approval-date" title="選擇客戶核准日">📅</button>
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>客戶英文全名</label>
                            <input type="text" id="copi01-eng" style="width:360px;" value="">
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>關係人代號</label>
                            <input type="text" id="copi01-related-party" style="width:180px;" value="">
                            <button type="button" class="lookup-icon-btn" id="copi01-lookup-related" title="挑選關係人代號">👤</button>
                        </div>
                    </div>
                </div>

                <!-- Subtab Header -->
                <div class="erp-subtab-header">
                    <button type="button" class="erp-subtab-btn active" id="copi01-subtab-btn-basic1">基本資料</button>
                    <button type="button" class="erp-subtab-btn" id="copi01-subtab-btn-basic2">基本資料(二)</button>
                    <button type="button" class="erp-subtab-btn" id="copi01-subtab-btn-addr">地址資料</button>
                    <button type="button" class="erp-subtab-btn" id="copi01-subtab-btn-trade1">交易資料(一)</button>
                    <button type="button" class="erp-subtab-btn" id="copi01-subtab-btn-trade2">交易資料(二)</button>
                    <button type="button" class="erp-subtab-btn" id="copi01-subtab-btn-credit">信用額度</button>
                    <button type="button" class="erp-subtab-btn" id="copi01-subtab-btn-intl">國外資料</button>
                </div>

                <!-- Tab Content -->
                <div class="erp-tab-content" style="flex:1; overflow-y:auto;">
                    <!-- Pane 1: 基本資料 (1:1 擷取3.PNG) -->
                    <div id="copi01-subtab-pane-basic1" class="copi01-subtab-pane" style="display:block;">
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
                                        <button type="button" class="lookup-icon-btn" id="copi01-lookup-contact" title="挑選人員">👤</button>
                                    </div>
                                </div>
                                <div class="erp-form-row">
                                    <div class="erp-field"><label>TEL_NO(一)</label><input type="text" id="copi01-tel" style="width:180px;" value=""></div>
                                </div>
                                <div class="erp-form-row">
                                    <div class="erp-field"><label>TEL_NO(二)</label><input type="text" id="copi01-tel2" style="width:180px;" value=""></div>
                                </div>
                                <div class="erp-form-row">
                                    <div class="erp-field"><label>FAX NO</label><input type="text" id="copi01-fax" style="width:180px;" value=""></div>
                                </div>
                                <div class="erp-form-row">
                                    <div class="erp-field"><label>E-Mail</label><input type="text" id="copi01-email" style="width:260px;" value=""></div>
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
                                        <input type="text" id="copi01-annual-sales" style="width:130px; text-align:right;" value="0">
                                        <span class="erp-field-desc">萬</span>
                                    </div>
                                </div>
                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label>員工人數</label>
                                        <input type="text" id="copi01-employee-count" style="width:70px; text-align:right;" value="0">
                                        <span class="erp-field-desc">人</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Column -->
                            <div class="col-half">
                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label>總店號</label>
                                        <input type="text" id="copi01-main-store" style="width:120px;" value="">
                                        <button type="button" class="lookup-icon-btn" id="copi01-lookup-main-store" title="挑選總店號">👥</button>
                                    </div>
                                </div>
                                <div class="erp-form-row" style="margin-left:70px;">
                                    <label style="min-width:auto;"><input type="checkbox" id="copi01-main-billing"> 總公司請款</label>
                                </div>
                                <div class="erp-form-row" style="margin-left:70px;">
                                    <label style="min-width:auto;"><input type="checkbox" id="copi01-main-invoice"> 發票號碼依總公司控管</label>
                                </div>
                                <div class="erp-form-row" style="margin-left:70px;">
                                    <label style="min-width:auto;"><input type="checkbox" id="copi01-main-contract"> 合約訂單是否歸屬總公司</label>
                                </div>
                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label>分店數</label>
                                        <input type="text" id="copi01-branch-count" style="width:70px; text-align:right;" value="0">
                                    </div>
                                </div>
                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label>交易幣別</label>
                                        <input type="text" id="copi01-currency" class="erp-input-yellow" style="width:65px;" value="NTD">
                                        <button type="button" class="lookup-icon-btn" id="copi01-lookup-currency" title="挑選交易幣別" style="color:#008000; font-weight:bold; font-family:monospace; font-size:13px;">$</button>
                                    </div>
                                </div>
                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label>部門別</label>
                                        <input type="text" id="copi01-dept" style="width:110px;" value="">
                                        <button type="button" class="lookup-icon-btn" id="copi01-lookup-dept" title="挑選部門">🏢</button>
                                    </div>
                                </div>
                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label>業務人員</label>
                                        <input type="text" id="copi01-sales" style="width:130px;" value="">
                                        <button class="lookup-icon-btn" id="copi01-lookup-sales" title="挑選業務人員">👤</button>
                                        <span class="erp-field-desc" id="copi01-sales-desc"></span>
                                    </div>
                                </div>
                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label>收款業務員</label>
                                        <input type="text" id="copi01-collector" style="width:130px;" value="">
                                        <button class="lookup-icon-btn" id="copi01-lookup-collector" title="挑選收款業務員">👤</button>
                                        <span class="erp-field-desc" id="copi01-collector-desc"></span>
                                    </div>
                                </div>
                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label>開業日期</label>
                                        <input type="text" id="copi01-open-date" style="width:90px;" value="">
                                        <button type="button" class="lookup-icon-btn" id="copi01-cal-open-date" title="選擇開業日期">📅</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pane: 地址資料 (1:1 截圖 media_1794201115298_317c48b6.png) -->
                    <div id="copi01-subtab-pane-addr" class="copi01-subtab-pane" style="display:none; padding:12px 14px; background:#ECE9D8; font-size:12px;">
                        <!-- 1. 登記地址 -->
                        <div class="erp-form-row" style="margin-bottom:3px; align-items:center;">
                            <div class="erp-field">
                                <label style="width:72px; text-align:right; margin-right:6px;">郵遞區號</label>
                                <input type="text" id="copi01-reg-zip" style="width:100px;" value="">
                            </div>
                        </div>
                        <div class="erp-form-row" style="margin-bottom:3px; align-items:center;">
                            <div class="erp-field" style="flex:1; max-width:820px;">
                                <label style="width:72px; text-align:right; margin-right:6px;">登記地址</label>
                                <input type="text" id="copi01-reg-addr" style="width:640px; max-width:calc(100% - 110px);" value="">
                                <button type="button" class="lookup-icon-btn copi01-copy-house-btn" id="copi01-copy-reg-btn" title="帶入所有地址 (發票/送貨/帳單)" style="margin-left:4px; font-size:14px; padding:0 3px; cursor:pointer;">🏠</button>
                            </div>
                        </div>
                        <div class="erp-form-row" style="margin-bottom:12px; align-items:center;">
                            <div class="erp-field" style="flex:1; max-width:820px;">
                                <span style="display:inline-block; width:78px;"></span>
                                <input type="text" id="copi01-reg-addr2" style="width:640px; max-width:calc(100% - 110px);" value="">
                            </div>
                        </div>

                        <!-- 2. 發票地址 -->
                        <div class="erp-form-row" style="margin-bottom:3px; align-items:center;">
                            <div class="erp-field">
                                <label style="width:72px; text-align:right; margin-right:6px;">郵遞區號</label>
                                <input type="text" id="copi01-inv-zip" style="width:100px;" value="">
                            </div>
                        </div>
                        <div class="erp-form-row" style="margin-bottom:3px; align-items:center;">
                            <div class="erp-field" style="flex:1; max-width:820px;">
                                <label style="width:72px; text-align:right; margin-right:6px;">發票地址</label>
                                <input type="text" id="copi01-inv-addr" style="width:640px; max-width:calc(100% - 110px);" value="">
                                <button type="button" class="lookup-icon-btn copi01-copy-house-btn" id="copi01-copy-inv-btn" title="帶入登記地址" style="margin-left:4px; font-size:14px; padding:0 3px; cursor:pointer;">🏠</button>
                            </div>
                        </div>
                        <div class="erp-form-row" style="margin-bottom:12px; align-items:center;">
                            <div class="erp-field" style="flex:1; max-width:820px;">
                                <span style="display:inline-block; width:78px;"></span>
                                <input type="text" id="copi01-inv-addr2" style="width:640px; max-width:calc(100% - 110px);" value="">
                            </div>
                        </div>

                        <!-- 3. 送貨地址 -->
                        <div class="erp-form-row" style="margin-bottom:3px; align-items:center;">
                            <div class="erp-field">
                                <label style="width:72px; text-align:right; margin-right:6px;">郵遞區號</label>
                                <input type="text" id="copi01-deliv-zip" style="width:100px;" value="">
                            </div>
                        </div>
                        <div class="erp-form-row" style="margin-bottom:3px; align-items:center;">
                            <div class="erp-field" style="flex:1; max-width:820px;">
                                <label style="width:72px; text-align:right; margin-right:6px;">送貨地址</label>
                                <input type="text" id="copi01-deliv-addr" style="width:640px; max-width:calc(100% - 110px);" value="">
                                <button type="button" class="lookup-icon-btn copi01-copy-house-btn" id="copi01-copy-deliv-btn" title="帶入登記地址" style="margin-left:4px; font-size:14px; padding:0 3px; cursor:pointer;">🏠</button>
                            </div>
                        </div>
                        <div class="erp-form-row" style="margin-bottom:12px; align-items:center;">
                            <div class="erp-field" style="flex:1; max-width:820px;">
                                <span style="display:inline-block; width:78px;"></span>
                                <input type="text" id="copi01-deliv-addr2" style="width:640px; max-width:calc(100% - 110px);" value="">
                            </div>
                        </div>

                        <!-- 4. 帳單地址 -->
                        <div class="erp-form-row" style="margin-bottom:3px; align-items:center;">
                            <div class="erp-field">
                                <label style="width:72px; text-align:right; margin-right:6px;">郵遞區號</label>
                                <input type="text" id="copi01-bill-zip" style="width:100px;" value="">
                            </div>
                            <div class="erp-field" style="margin-left:24px;">
                                <label style="margin-right:6px;">帳單收件人</label>
                                <input type="text" id="copi01-bill-recipient" style="width:260px;" value="">
                            </div>
                        </div>
                        <div class="erp-form-row" style="margin-bottom:3px; align-items:center;">
                            <div class="erp-field" style="flex:1; max-width:820px;">
                                <label style="width:72px; text-align:right; margin-right:6px;">帳單地址</label>
                                <input type="text" id="copi01-bill-addr" style="width:640px; max-width:calc(100% - 110px);" value="">
                                <button type="button" class="lookup-icon-btn copi01-copy-house-btn" id="copi01-copy-bill-btn" title="帶入登記地址" style="margin-left:4px; font-size:14px; padding:0 3px; cursor:pointer;">🏠</button>
                            </div>
                        </div>
                        <div class="erp-form-row" style="margin-bottom:12px; align-items:center;">
                            <div class="erp-field" style="flex:1; max-width:820px;">
                                <span style="display:inline-block; width:78px;"></span>
                                <input type="text" id="copi01-bill-addr2" style="width:640px; max-width:calc(100% - 110px);" value="">
                            </div>
                        </div>
                    </div>

                    <!-- Pane 2: 交易資料(一) (1:1 截圖畫面) -->
                    <div id="copi01-subtab-pane-trade1" class="copi01-subtab-pane" style="display:none;">
                        <div class="erp-two-column-form">
                            <!-- Left Column -->
                            <div class="col-half">
                                <fieldset style="border:1px solid #7F9DB9; padding:8px 12px; margin:0 0 10px 0; border-radius:2px; background:#F8FAFC;">
                                    <legend style="font-size:12px; font-weight:bold; color:#1F497D; padding:0 6px;">稅額計算方式</legend>
                                    <div style="display:flex; gap:24px; font-size:12px; align-items:center;">
                                        <label style="display:inline-flex; align-items:center; gap:4px; font-weight:normal; cursor:pointer;">
                                            <input type="radio" name="copi01-tax-calc" id="copi01-tax-calc-1" value="1" checked> 整張資料計算
                                        </label>
                                        <label style="display:inline-flex; align-items:center; gap:4px; font-weight:normal; cursor:pointer;">
                                            <input type="radio" name="copi01-tax-calc" id="copi01-tax-calc-2" value="2"> 單身單筆資料計算
                                        </label>
                                    </div>
                                </fieldset>

                                <div class="erp-form-row" style="margin-left:18px; margin-bottom:8px;">
                                    <label style="display:inline-flex; align-items:center; gap:5px; font-weight:normal; cursor:pointer; min-width:auto;">
                                        <input type="checkbox" id="copi01-inv-with-goods"> 隨貨附發票
                                    </label>
                                </div>

                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label>銷售評等</label>
                                        <input type="text" id="copi01-sales-rating" style="width:40px;" maxlength="4" value="">
                                    </div>
                                </div>

                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label>信用評等</label>
                                        <input type="text" id="copi01-credit-rating" style="width:40px;" maxlength="4" value="">
                                    </div>
                                </div>

                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label>訂金比率</label>
                                        <input type="text" id="copi01-deposit-rate" style="width:90px; text-align:right;" value="">
                                        <span class="erp-field-desc">%</span>
                                    </div>
                                </div>

                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label>價格條件</label>
                                        <input type="text" id="copi01-price-term" style="width:200px;" value="">
                                        <button type="button" class="lookup-icon-btn" id="copi01-lookup-price-term" title="挑選價格條件">📄</button>
                                    </div>
                                </div>

                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label>付款條件</label>
                                        <input type="text" id="copi01-payment-term" style="width:80px;" value="">
                                        <button type="button" class="lookup-icon-btn" id="copi01-lookup-payment-term" title="挑選付款條件">📄</button>
                                    </div>
                                </div>

                                <div class="erp-form-row" style="margin-top:10px; align-items:center;">
                                    <label style="display:inline-flex; align-items:center; gap:5px; font-weight:normal; cursor:pointer; min-width:auto; margin-left:18px;">
                                        <input type="checkbox" id="copi01-send-ebc"> 匯至EBC
                                    </label>
                                    <div class="erp-field" style="margin-left:24px;">
                                        <label style="min-width:auto; margin-right:6px;">EBC申請代號</label>
                                        <input type="text" id="copi01-ebc-app-no" style="width:95px;" value="">
                                    </div>
                                </div>
                            </div>

                            <!-- Right Column -->
                            <div class="col-half">
                                <fieldset style="border:1px solid #7F9DB9; padding:8px 12px; margin:0 0 10px 0; border-radius:2px; background:#F8FAFC;">
                                    <legend style="font-size:12px; font-weight:bold; color:#1F497D; padding:0 6px;">通關方式</legend>
                                    <div style="display:flex; gap:24px; font-size:12px; align-items:center;">
                                        <label style="display:inline-flex; align-items:center; gap:4px; font-weight:normal; cursor:pointer;">
                                            <input type="radio" name="copi01-customs" id="copi01-customs-1" value="1" checked> 非經海關
                                        </label>
                                        <label style="display:inline-flex; align-items:center; gap:4px; font-weight:normal; cursor:pointer;">
                                            <input type="radio" name="copi01-customs" id="copi01-customs-2" value="2"> 經海關
                                        </label>
                                    </div>
                                </fieldset>

                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label>單據發送方式</label>
                                        <select id="copi01-doc-send-method" style="width:130px;">
                                            <option value=""></option>
                                            <option value="1">1:郵寄</option>
                                            <option value="2">2:傳真</option>
                                            <option value="3">3:E-Mail</option>
                                            <option value="4">4:專人送達</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label>票據寄領</label>
                                        <select id="copi01-bill-delivery" style="width:130px;">
                                            <option value=""></option>
                                            <option value="1">1:自領</option>
                                            <option value="2">2:郵寄</option>
                                            <option value="3">3:專人送達</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label>收款方式</label>
                                        <select id="copi01-pay-method" style="width:130px;">
                                            <option value=""></option>
                                            <option value="1">1:匯款</option>
                                            <option value="2">2:支票</option>
                                            <option value="3">3:現金</option>
                                            <option value="4">4:信用卡</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label><span style="color:#C00; font-weight:bold;">*</span> 稅別碼</label>
                                        <input type="text" id="copi01-tax-code" class="erp-input-yellow" style="width:45px;" value="P05" required>
                                        <button type="button" class="lookup-icon-btn" id="copi01-lookup-tax-code" title="挑選稅別碼">📄</button>
                                    </div>
                                </div>

                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label>發票聯數</label>
                                        <input type="text" id="copi01-invoice-copies" style="width:75px;" value="">
                                    </div>
                                </div>

                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label>課稅別</label>
                                        <select id="copi01-tax-type" style="width:180px;">
                                            <option value=""></option>
                                            <option value="1">1:應稅外加</option>
                                            <option value="2">2:應稅內含</option>
                                            <option value="3">3:零稅率</option>
                                            <option value="4">4:免稅</option>
                                            <option value="9">9:不計稅</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="erp-form-row">
                                    <div class="erp-field">
                                        <label>收入遞延天數</label>
                                        <input type="text" id="copi01-income-defer-days" style="width:80px; text-align:right;" value="0">
                                    </div>
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
                            <th style="width:95px;">負責人</th>
                            <th style="width:150px;">業務人員</th>
                        </tr>
                    </thead>
                    <tbody id="copi01-browse-tbody">
                        <tr><td colspan="7" style="text-align:center; padding:20px;">載入客戶清單中...</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="erp-window-statusbar">
                <span class="status-cell">瀏覽</span>
                <span class="status-cell" id="copi01-status-msg">新增模式 (資料空白)</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 940, 580, (winEl) => {
            const fNo = winEl.querySelector('#copi01-no');
            const fShort = winEl.querySelector('#copi01-short');
            const fFull = winEl.querySelector('#copi01-full');
            const fEng = winEl.querySelector('#copi01-eng');
            const fVersion = winEl.querySelector('#copi01-version');
            const fApprovalDate = winEl.querySelector('#copi01-approval-date');
            const fBoss = winEl.querySelector('#copi01-boss');
            const fContact = winEl.querySelector('#copi01-contact');
            const fTel = winEl.querySelector('#copi01-tel');
            const fTel2 = winEl.querySelector('#copi01-tel2');
            const fFax = winEl.querySelector('#copi01-fax');
            const fEmail = winEl.querySelector('#copi01-email');
            const fTaxId = winEl.querySelector('#copi01-taxid');
            const fCapital = winEl.querySelector('#copi01-capital');
            const fAnnualSales = winEl.querySelector('#copi01-annual-sales');
            const fEmployeeCount = winEl.querySelector('#copi01-employee-count');
            const fMainStore = winEl.querySelector('#copi01-main-store');
            const fBranchCount = winEl.querySelector('#copi01-branch-count');
            const fCurrency = winEl.querySelector('#copi01-currency');
            const fDept = winEl.querySelector('#copi01-dept');
            const fSales = winEl.querySelector('#copi01-sales');
            const fCollector = winEl.querySelector('#copi01-collector');
            const fOpenDate = winEl.querySelector('#copi01-open-date');
            const statusMsg = winEl.querySelector('#copi01-status-msg');

            const fRelatedParty = winEl.querySelector('#copi01-related-party');
            const fTaxCalc1 = winEl.querySelector('#copi01-tax-calc-1');
            const fTaxCalc2 = winEl.querySelector('#copi01-tax-calc-2');
            const fInvWithGoods = winEl.querySelector('#copi01-inv-with-goods');
            const fSalesRating = winEl.querySelector('#copi01-sales-rating');
            const fCreditRating = winEl.querySelector('#copi01-credit-rating');
            const fDepositRate = winEl.querySelector('#copi01-deposit-rate');
            const fPriceTerm = winEl.querySelector('#copi01-price-term');
            const fPaymentTerm = winEl.querySelector('#copi01-payment-term');
            const fSendEbc = winEl.querySelector('#copi01-send-ebc');
            const fEbcAppNo = winEl.querySelector('#copi01-ebc-app-no');
            const fCustoms1 = winEl.querySelector('#copi01-customs-1');
            const fCustoms2 = winEl.querySelector('#copi01-customs-2');
            const fDocSendMethod = winEl.querySelector('#copi01-doc-send-method');
            const fBillDelivery = winEl.querySelector('#copi01-bill-delivery');
            const fPayMethod = winEl.querySelector('#copi01-pay-method');
            const fTaxCode = winEl.querySelector('#copi01-tax-code');
            const fInvoiceCopies = winEl.querySelector('#copi01-invoice-copies');
            const fTaxType = winEl.querySelector('#copi01-tax-type');
            const fIncomeDeferDays = winEl.querySelector('#copi01-income-defer-days');

            // 地址資料 (1:1 截圖 media_1794201115298_317c48b6.png)
            const fRegZip = winEl.querySelector('#copi01-reg-zip');
            const fRegAddr = winEl.querySelector('#copi01-reg-addr');
            const fRegAddr2 = winEl.querySelector('#copi01-reg-addr2');
            const fInvZip = winEl.querySelector('#copi01-inv-zip');
            const fInvAddr = winEl.querySelector('#copi01-inv-addr');
            const fInvAddr2 = winEl.querySelector('#copi01-inv-addr2');
            const fDelivZip = winEl.querySelector('#copi01-deliv-zip');
            const fDelivAddr = winEl.querySelector('#copi01-deliv-addr');
            const fDelivAddr2 = winEl.querySelector('#copi01-deliv-addr2');
            const fBillZip = winEl.querySelector('#copi01-bill-zip');
            const fBillRecipient = winEl.querySelector('#copi01-bill-recipient');
            const fBillAddr = winEl.querySelector('#copi01-bill-addr');
            const fBillAddr2 = winEl.querySelector('#copi01-bill-addr2');

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

            const switchSubtab = (target) => {
                const subtabBtns = winEl.querySelectorAll('.erp-subtab-btn');
                const subtabPanes = winEl.querySelectorAll('.copi01-subtab-pane');
                subtabBtns.forEach(btn => btn.classList.remove('active'));
                subtabPanes.forEach(pane => pane.style.display = 'none');
                if (target === 'trade1') {
                    const btn = winEl.querySelector('#copi01-subtab-btn-trade1');
                    const pane = winEl.querySelector('#copi01-subtab-pane-trade1');
                    if (btn) btn.classList.add('active');
                    if (pane) pane.style.display = 'block';
                } else if (target === 'addr') {
                    const btn = winEl.querySelector('#copi01-subtab-btn-addr');
                    const pane = winEl.querySelector('#copi01-subtab-pane-addr');
                    if (btn) btn.classList.add('active');
                    if (pane) pane.style.display = 'block';
                } else {
                    const btn = winEl.querySelector('#copi01-subtab-btn-basic1');
                    const pane = winEl.querySelector('#copi01-subtab-pane-basic1');
                    if (btn) btn.classList.add('active');
                    if (pane) pane.style.display = 'block';
                }
            };
            const subtabBasic1Btn = winEl.querySelector('#copi01-subtab-btn-basic1');
            if (subtabBasic1Btn) subtabBasic1Btn.addEventListener('click', () => switchSubtab('basic1'));
            const subtabTrade1Btn = winEl.querySelector('#copi01-subtab-btn-trade1');
            if (subtabTrade1Btn) subtabTrade1Btn.addEventListener('click', () => switchSubtab('trade1'));
            const subtabAddrBtn = winEl.querySelector('#copi01-subtab-btn-addr');
            if (subtabAddrBtn) subtabAddrBtn.addEventListener('click', () => switchSubtab('addr'));

            ['copi01-subtab-btn-basic2', 'copi01-subtab-btn-trade2', 'copi01-subtab-btn-credit', 'copi01-subtab-btn-intl'].forEach(id => {
                const btn = winEl.querySelector('#' + id);
                if (btn) {
                    btn.addEventListener('click', () => {
                        Modules.toast('該頁籤尚未建立，已為您保留基本、地址與交易資料(一)設定！', 'info');
                    });
                }
            });

            // ========================================================
            // 地址資料同步功能：只要輸入一格，按Enter，全部帶入一樣的資料
            // ========================================================
            const zipInputs = [fRegZip, fInvZip, fDelivZip, fBillZip].filter(Boolean);
            zipInputs.forEach((inp, idx) => {
                inp.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = inp.value.trim();
                        zipInputs.forEach(target => { target.value = val; });
                        isDirty = true;
                        if (idx === 0 && fRegAddr) fRegAddr.focus();
                        else if (idx === 1 && fInvAddr) fInvAddr.focus();
                        else if (idx === 2 && fDelivAddr) fDelivAddr.focus();
                        else if (idx === 3 && fBillAddr) fBillAddr.focus();
                    }
                });
            });

            const addr1Inputs = [fRegAddr, fInvAddr, fDelivAddr, fBillAddr].filter(Boolean);
            addr1Inputs.forEach((inp, idx) => {
                inp.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = inp.value.trim();
                        addr1Inputs.forEach(target => { target.value = val; });
                        const curZip = (idx === 0 ? fRegZip : (idx === 1 ? fInvZip : (idx === 2 ? fDelivZip : fBillZip)))?.value.trim();
                        if (curZip) {
                            zipInputs.forEach(z => { if (!z.value.trim()) z.value = curZip; });
                        }
                        isDirty = true;
                        if (idx === 0 && fRegAddr2) fRegAddr2.focus();
                        else if (idx === 1 && fInvAddr2) fInvAddr2.focus();
                        else if (idx === 2 && fDelivAddr2) fDelivAddr2.focus();
                        else if (idx === 3 && fBillAddr2) fBillAddr2.focus();
                    }
                });
            });

            const addr2Inputs = [fRegAddr2, fInvAddr2, fDelivAddr2, fBillAddr2].filter(Boolean);
            addr2Inputs.forEach((inp) => {
                inp.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = inp.value.trim();
                        addr2Inputs.forEach(target => { target.value = val; });
                        isDirty = true;
                    }
                });
            });

            fBillRecipient?.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    if (!fBillRecipient.value.trim() && fContact.value.trim()) {
                        fBillRecipient.value = fContact.value.trim();
                        isDirty = true;
                    }
                }
            });

            // 🏠 按鈕快速複製登記地址至各地址
            winEl.querySelector('#copi01-copy-reg-btn')?.addEventListener('click', () => {
                const zip = fRegZip ? fRegZip.value.trim() : '';
                const a1 = fRegAddr ? fRegAddr.value.trim() : '';
                const a2 = fRegAddr2 ? fRegAddr2.value.trim() : '';
                if (fInvZip) fInvZip.value = zip;
                if (fInvAddr) fInvAddr.value = a1;
                if (fInvAddr2) fInvAddr2.value = a2;
                if (fDelivZip) fDelivZip.value = zip;
                if (fDelivAddr) fDelivAddr.value = a1;
                if (fDelivAddr2) fDelivAddr2.value = a2;
                if (fBillZip) fBillZip.value = zip;
                if (fBillAddr) fBillAddr.value = a1;
                if (fBillAddr2) fBillAddr2.value = a2;
                if (fBillRecipient && !fBillRecipient.value.trim() && fContact) fBillRecipient.value = fContact.value.trim();
                isDirty = true;
                Modules.toast('已由登記地址完整同步帶入發票、送貨及帳單地址！', 'success');
            });
            winEl.querySelector('#copi01-copy-inv-btn')?.addEventListener('click', () => {
                if (fInvZip && fRegZip) fInvZip.value = fRegZip.value;
                if (fInvAddr && fRegAddr) fInvAddr.value = fRegAddr.value;
                if (fInvAddr2 && fRegAddr2) fInvAddr2.value = fRegAddr2.value;
                isDirty = true;
                Modules.toast('已由登記地址帶入發票地址！', 'info');
            });
            winEl.querySelector('#copi01-copy-deliv-btn')?.addEventListener('click', () => {
                if (fDelivZip && fRegZip) fDelivZip.value = fRegZip.value;
                if (fDelivAddr && fRegAddr) fDelivAddr.value = fRegAddr.value;
                if (fDelivAddr2 && fRegAddr2) fDelivAddr2.value = fRegAddr2.value;
                isDirty = true;
                Modules.toast('已由登記地址帶入送貨地址！', 'info');
            });
            winEl.querySelector('#copi01-copy-bill-btn')?.addEventListener('click', () => {
                if (fBillZip && fRegZip) fBillZip.value = fRegZip.value;
                if (fBillAddr && fRegAddr) fBillAddr.value = fRegAddr.value;
                if (fBillAddr2 && fRegAddr2) fBillAddr2.value = fRegAddr2.value;
                if (fBillRecipient && !fBillRecipient.value.trim() && fContact) fBillRecipient.value = fContact.value.trim();
                isDirty = true;
                Modules.toast('已由登記地址帶入帳單地址！', 'info');
            });

            let isDirty = false;
            winEl.addEventListener('input', () => { isDirty = true; });
            winEl.addEventListener('change', () => { isDirty = true; });

            const fillForm = (c) => {
                fNo.value = c.customer_no || '';
                fShort.value = c.name_short || '';
                fFull.value = c.full_name || '';
                if (fEng) fEng.value = c.eng_name || '';
                if (fVersion) fVersion.value = c.version || '0000';
                if (fApprovalDate) fApprovalDate.value = c.approval_date || '/  /';
                if (fRelatedParty) fRelatedParty.value = c.related_party_no || '';
                fBoss.value = c.boss || c.contact || '';
                fContact.value = c.contact || '';
                fTel.value = c.tel || c.tel1 || '';
                if (fTel2) fTel2.value = c.tel2 || '';
                if (fFax) fFax.value = c.fax || '';
                if (fEmail) fEmail.value = c.email || '';
                fTaxId.value = c.tax_id || '';
                fCapital.value = c.capital ? Math.round(c.capital).toLocaleString() : '';
                if (fAnnualSales) fAnnualSales.value = c.annual_sales ? Math.round(c.annual_sales).toLocaleString() : '0';
                if (fEmployeeCount) fEmployeeCount.value = c.employee_count !== undefined ? c.employee_count : '0';
                if (fMainStore) fMainStore.value = c.main_store_no || '';
                if (fBranchCount) fBranchCount.value = c.branch_count !== undefined ? c.branch_count : '0';
                if (fCurrency) fCurrency.value = c.currency || 'NTD';
                if (fDept) fDept.value = c.dept || '';
                fSales.value = c.sales_person || '';
                const salesDesc = winEl.querySelector('#copi01-sales-desc');
                if (salesDesc) salesDesc.textContent = '';
                if (fCollector) fCollector.value = c.collector || '';
                const collectorDesc = winEl.querySelector('#copi01-collector-desc');
                if (collectorDesc) collectorDesc.textContent = '';
                if (fOpenDate) fOpenDate.value = c.open_date || '';

                // 地址資料 (1:1 截圖 media_1794201115298_317c48b6.png)
                if (fRegZip) fRegZip.value = c.reg_zip || '';
                if (fRegAddr) fRegAddr.value = c.reg_addr || c.address || '';
                if (fRegAddr2) fRegAddr2.value = c.reg_addr2 || '';
                if (fInvZip) fInvZip.value = c.inv_zip || c.reg_zip || '';
                if (fInvAddr) fInvAddr.value = c.inv_addr || c.reg_addr || c.address || '';
                if (fInvAddr2) fInvAddr2.value = c.inv_addr2 || c.reg_addr2 || '';
                if (fDelivZip) fDelivZip.value = c.deliv_zip || c.reg_zip || '';
                if (fDelivAddr) fDelivAddr.value = c.deliv_addr || c.reg_addr || c.address || '';
                if (fDelivAddr2) fDelivAddr2.value = c.deliv_addr2 || c.reg_addr2 || '';
                if (fBillZip) fBillZip.value = c.bill_zip || c.reg_zip || '';
                if (fBillRecipient) fBillRecipient.value = c.bill_recipient || c.contact || '';
                if (fBillAddr) fBillAddr.value = c.bill_addr || c.reg_addr || c.address || '';
                if (fBillAddr2) fBillAddr2.value = c.bill_addr2 || c.reg_addr2 || '';

                // 交易資料(一)
                const taxCalc = c.tax_calc_type || '1';
                if (fTaxCalc1 && fTaxCalc2) {
                    if (taxCalc === '2') fTaxCalc2.checked = true;
                    else fTaxCalc1.checked = true;
                }
                if (fInvWithGoods) fInvWithGoods.checked = (c.invoice_with_goods == 1);
                if (fSalesRating) fSalesRating.value = c.sales_rating || '';
                if (fCreditRating) fCreditRating.value = c.credit_rating || '';
                if (fDepositRate) fDepositRate.value = (c.deposit_rate !== null && c.deposit_rate !== undefined) ? c.deposit_rate : '';
                if (fPriceTerm) fPriceTerm.value = c.price_term || '';
                if (fPaymentTerm) fPaymentTerm.value = c.payment_term || '';
                if (fSendEbc) fSendEbc.checked = (c.send_ebc == 1);
                if (fEbcAppNo) fEbcAppNo.value = c.ebc_app_no || '';
                const customs = c.customs_type || '1';
                if (fCustoms1 && fCustoms2) {
                    if (customs === '2') fCustoms2.checked = true;
                    else fCustoms1.checked = true;
                }
                if (fDocSendMethod) fDocSendMethod.value = c.doc_send_method || '';
                if (fBillDelivery) fBillDelivery.value = c.bill_delivery || '';
                if (fPayMethod) fPayMethod.value = c.pay_method || '';
                if (fTaxCode) fTaxCode.value = c.tax_code || 'S05';
                if (fInvoiceCopies) fInvoiceCopies.value = c.invoice_copies || '';
                if (fTaxType) fTaxType.value = c.tax_type || '';
                if (fIncomeDeferDays) fIncomeDeferDays.value = (c.income_defer_days !== undefined && c.income_defer_days !== null) ? c.income_defer_days : '0';

                Modules.setFormMode(winEl, null, 'browse', statusMsg, c.customer_no);
                isDirty = false;
            };

            const clearForm = async () => {
                try {
                    const nextRes = await ERP_API.get('get_next_customer_no');
                    fNo.value = nextRes.next_no || '1001';
                } catch(e) {
                    fNo.value = '1001';
                }
                fShort.value = '';
                fFull.value = '';
                if (fEng) fEng.value = '';
                if (fVersion) fVersion.value = '0000';
                if (fApprovalDate) fApprovalDate.value = '/  /';
                if (fRelatedParty) fRelatedParty.value = '';
                fBoss.value = '';
                fContact.value = '';
                fTel.value = '';
                if (fTel2) fTel2.value = '';
                if (fFax) fFax.value = '';
                if (fEmail) fEmail.value = '';
                fTaxId.value = '';
                fCapital.value = '';
                if (fAnnualSales) fAnnualSales.value = '0';
                if (fEmployeeCount) fEmployeeCount.value = '0';
                if (fMainStore) fMainStore.value = '';
                if (fBranchCount) fBranchCount.value = '0';
                if (fCurrency) fCurrency.value = 'NTD';
                if (fDept) fDept.value = '';
                fSales.value = '';
                const salesDesc = winEl.querySelector('#copi01-sales-desc');
                if (salesDesc) salesDesc.textContent = '';
                if (fCollector) fCollector.value = '';
                const collectorDesc = winEl.querySelector('#copi01-collector-desc');
                if (collectorDesc) collectorDesc.textContent = '';
                if (fOpenDate) fOpenDate.value = '';

                // 地址資料重設
                if (fRegZip) fRegZip.value = '';
                if (fRegAddr) fRegAddr.value = '';
                if (fRegAddr2) fRegAddr2.value = '';
                if (fInvZip) fInvZip.value = '';
                if (fInvAddr) fInvAddr.value = '';
                if (fInvAddr2) fInvAddr2.value = '';
                if (fDelivZip) fDelivZip.value = '';
                if (fDelivAddr) fDelivAddr.value = '';
                if (fDelivAddr2) fDelivAddr2.value = '';
                if (fBillZip) fBillZip.value = '';
                if (fBillRecipient) fBillRecipient.value = '';
                if (fBillAddr) fBillAddr.value = '';
                if (fBillAddr2) fBillAddr2.value = '';

                // 交易資料(一) 重設
                if (fTaxCalc1) fTaxCalc1.checked = true;
                if (fTaxCalc2) fTaxCalc2.checked = false;
                if (fInvWithGoods) fInvWithGoods.checked = false;
                if (fSalesRating) fSalesRating.value = '';
                if (fCreditRating) fCreditRating.value = '';
                if (fDepositRate) fDepositRate.value = '';
                if (fPriceTerm) fPriceTerm.value = '';
                if (fPaymentTerm) fPaymentTerm.value = '';
                if (fSendEbc) fSendEbc.checked = false;
                if (fEbcAppNo) fEbcAppNo.value = '';
                if (fCustoms1) fCustoms1.checked = true;
                if (fCustoms2) fCustoms2.checked = false;
                if (fDocSendMethod) fDocSendMethod.value = '';
                if (fBillDelivery) fBillDelivery.value = '';
                if (fPayMethod) fPayMethod.value = '';
                if (fTaxCode) fTaxCode.value = 'S05';
                if (fInvoiceCopies) fInvoiceCopies.value = '2';
                if (fTaxType) fTaxType.value = '2:應稅外加';
                if (fIncomeDeferDays) fIncomeDeferDays.value = '0';

                switchSubtab('basic1');
                Modules.setFormMode(winEl, null, 'add', statusMsg, fNo.value);
                isDirty = false;
                fShort.focus();
            };

            const resetCustBlank = () => {
                fNo.value = '';
                fShort.value = '';
                fFull.value = '';
                if (fEng) fEng.value = '';
                if (fVersion) fVersion.value = '0000';
                if (fApprovalDate) fApprovalDate.value = '/  /';
                if (fRelatedParty) fRelatedParty.value = '';
                fBoss.value = '';
                fContact.value = '';
                fTel.value = '';
                if (fTel2) fTel2.value = '';
                if (fFax) fFax.value = '';
                if (fEmail) fEmail.value = '';
                fTaxId.value = '';
                fCapital.value = '';
                if (fAnnualSales) fAnnualSales.value = '0';
                if (fEmployeeCount) fEmployeeCount.value = '0';
                if (fMainStore) fMainStore.value = '';
                if (fBranchCount) fBranchCount.value = '0';
                if (fCurrency) fCurrency.value = 'NTD';
                if (fDept) fDept.value = '';
                fSales.value = '';
                const salesDesc = winEl.querySelector('#copi01-sales-desc');
                if (salesDesc) salesDesc.textContent = '';
                if (fCollector) fCollector.value = '';
                const collectorDesc = winEl.querySelector('#copi01-collector-desc');
                if (collectorDesc) collectorDesc.textContent = '';
                if (fOpenDate) fOpenDate.value = '';

                // 地址資料重設
                if (fRegZip) fRegZip.value = '';
                if (fRegAddr) fRegAddr.value = '';
                if (fRegAddr2) fRegAddr2.value = '';
                if (fInvZip) fInvZip.value = '';
                if (fInvAddr) fInvAddr.value = '';
                if (fInvAddr2) fInvAddr2.value = '';
                if (fDelivZip) fDelivZip.value = '';
                if (fDelivAddr) fDelivAddr.value = '';
                if (fDelivAddr2) fDelivAddr2.value = '';
                if (fBillZip) fBillZip.value = '';
                if (fBillRecipient) fBillRecipient.value = '';
                if (fBillAddr) fBillAddr.value = '';
                if (fBillAddr2) fBillAddr2.value = '';

                // 交易資料(一) 重設
                if (fTaxCalc1) fTaxCalc1.checked = true;
                if (fTaxCalc2) fTaxCalc2.checked = false;
                if (fInvWithGoods) fInvWithGoods.checked = false;
                if (fSalesRating) fSalesRating.value = '';
                if (fCreditRating) fCreditRating.value = '';
                if (fDepositRate) fDepositRate.value = '';
                if (fPriceTerm) fPriceTerm.value = '';
                if (fPaymentTerm) fPaymentTerm.value = '';
                if (fSendEbc) fSendEbc.checked = false;
                if (fEbcAppNo) fEbcAppNo.value = '';
                if (fCustoms1) fCustoms1.checked = true;
                if (fCustoms2) fCustoms2.checked = false;
                if (fDocSendMethod) fDocSendMethod.value = '';
                if (fBillDelivery) fBillDelivery.value = '';
                if (fPayMethod) fPayMethod.value = '';
                if (fTaxCode) fTaxCode.value = 'S05';
                if (fInvoiceCopies) fInvoiceCopies.value = '2';
                if (fTaxType) fTaxType.value = '2:應稅外加';
                if (fIncomeDeferDays) fIncomeDeferDays.value = '0';

                switchSubtab('basic1');
                Modules.setFormMode(winEl, null, 'browse', statusMsg, '');
                isDirty = false;
            };

            const doSave = async () => {
                const no = fNo.value.trim();
                const name = fShort.value.trim();
                if (!no || !name) {
                    alert('請輸入客戶代號與客戶簡稱！');
                    return false;
                }
                const taxCode = fTaxCode ? fTaxCode.value.trim() : '';
                if (!taxCode) {
                    switchSubtab('trade1');
                    fTaxCode?.focus();
                    alert('稅別碼為必填欄位，請選擇或輸入稅別碼（例如 S05 銷項三聯式發票-應稅外加）！');
                    return false;
                }

                const res = await ERP_API.post('save_customer', {
                    customer_no: no,
                    name_short: name,
                    full_name: fFull.value.trim() || name,
                    eng_name: fEng ? fEng.value.trim() : '',
                    version: fVersion ? fVersion.value.trim() : '0000',
                    approval_date: fApprovalDate ? fApprovalDate.value.trim() : '',
                    related_party_no: fRelatedParty ? fRelatedParty.value.trim() : '',
                    boss: fBoss.value.trim(),
                    contact: fContact.value.trim(),
                    tel1: fTel.value.trim(),
                    tel2: fTel2 ? fTel2.value.trim() : '',
                    fax: fFax ? fFax.value.trim() : '',
                    email: fEmail ? fEmail.value.trim() : '',
                    tax_id: fTaxId.value.trim(),
                    capital: fCapital.value.replace(/,/g, '').trim(),
                    annual_sales: fAnnualSales ? fAnnualSales.value.replace(/,/g, '').trim() : 0,
                    employee_count: fEmployeeCount ? fEmployeeCount.value.trim() : 0,
                    main_store_no: fMainStore ? fMainStore.value.trim() : '',
                    branch_count: fBranchCount ? fBranchCount.value.trim() : 0,
                    currency: fCurrency ? fCurrency.value.trim() : 'NTD',
                    dept: fDept ? fDept.value.trim() : '',
                    sales_person: fSales.value.trim(),
                    collector: fCollector ? fCollector.value.trim() : '',
                    open_date: fOpenDate ? fOpenDate.value.trim() : '',
                    // 地址資料 (1:1 截圖 media_1794201115298_317c48b6.png)
                    reg_zip: fRegZip ? fRegZip.value.trim() : '',
                    reg_addr: fRegAddr ? fRegAddr.value.trim() : '',
                    reg_addr2: fRegAddr2 ? fRegAddr2.value.trim() : '',
                    inv_zip: fInvZip ? fInvZip.value.trim() : '',
                    inv_addr: fInvAddr ? fInvAddr.value.trim() : '',
                    inv_addr2: fInvAddr2 ? fInvAddr2.value.trim() : '',
                    deliv_zip: fDelivZip ? fDelivZip.value.trim() : '',
                    deliv_addr: fDelivAddr ? fDelivAddr.value.trim() : '',
                    deliv_addr2: fDelivAddr2 ? fDelivAddr2.value.trim() : '',
                    bill_zip: fBillZip ? fBillZip.value.trim() : '',
                    bill_recipient: fBillRecipient ? fBillRecipient.value.trim() : '',
                    bill_addr: fBillAddr ? fBillAddr.value.trim() : '',
                    bill_addr2: fBillAddr2 ? fBillAddr2.value.trim() : '',
                    address: fRegAddr ? fRegAddr.value.trim() : '',
                    // 交易資料(一)
                    tax_calc_type: (fTaxCalc2 && fTaxCalc2.checked) ? '2' : '1',
                    invoice_with_goods: (fInvWithGoods && fInvWithGoods.checked) ? 1 : 0,
                    sales_rating: fSalesRating ? fSalesRating.value.trim() : '',
                    credit_rating: fCreditRating ? fCreditRating.value.trim() : '',
                    deposit_rate: (fDepositRate && fDepositRate.value.trim() !== '') ? fDepositRate.value.trim() : '',
                    price_term: fPriceTerm ? fPriceTerm.value.trim() : '',
                    payment_term: fPaymentTerm ? fPaymentTerm.value.trim() : '',
                    send_ebc: (fSendEbc && fSendEbc.checked) ? 1 : 0,
                    ebc_app_no: fEbcAppNo ? fEbcAppNo.value.trim() : '',
                    customs_type: (fCustoms2 && fCustoms2.checked) ? '2' : '1',
                    doc_send_method: fDocSendMethod ? fDocSendMethod.value : '',
                    bill_delivery: fBillDelivery ? fBillDelivery.value : '',
                    pay_method: fPayMethod ? fPayMethod.value : '',
                    tax_code: taxCode,
                    invoice_copies: fInvoiceCopies ? fInvoiceCopies.value.trim() : '',
                    tax_type: fTaxType ? fTaxType.value : '',
                    income_defer_days: fIncomeDeferDays ? parseInt(fIncomeDeferDays.value.trim() || '0', 10) : 0
                });
                if (res.success) {
                    isDirty = false;
                    Modules.setFormMode(winEl, null, 'browse', statusMsg, no);
                    Modules.toast(`客戶主檔 [${no} ${name}] 儲存成功！`, 'success');
                    return true;
                } else {
                    Modules.toast('儲存失敗: ' + (res.error || '不明錯誤'), 'error');
                    return false;
                }
            };

            const checkDirtyBeforeAction = async (nextAction) => {
                if (isDirty) {
                    const answer = confirm("資料尚未儲存，是否要儲存目前的客戶資料？\n\n點選【確定】：進行儲存\n點選【取消】：直接清除放棄變更");
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

            const loadBrowseList = async () => {
                const tbody = winEl.querySelector('#copi01-browse-tbody');
                const res = await ERP_API.get('get_customers');
                if (res.success) {
                    const list = res.data || [];
                    if (list.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px; color:#888;">目前尚無客戶資料</td></tr>';
                        return;
                    }
                    let rows = '';
                    list.forEach(c => {
                        rows += `
                            <tr data-no="${c.customer_no}" style="cursor:pointer;">
                                <td style="text-align:center;">▶</td>
                                <td style="font-weight:bold; color:#003366;">${c.customer_no}</td>
                                <td>${c.name_short || ''}</td>
                                <td>${c.full_name || ''}</td>
                                <td>${c.tax_id || ''}</td>
                                <td>${c.contact || c.boss || ''}</td>
                                <td>${c.sales_person || ''}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows;

                    tbody.querySelectorAll('tr[data-no]').forEach(tr => {
                        tr.addEventListener('click', () => {
                            const no = tr.getAttribute('data-no');
                            checkDirtyBeforeAction(() => {
                                const item = list.find(x => x.customer_no === no);
                                if (item) {
                                    fillForm(item);
                                    switchTab('detail');
                                }
                            });
                        });
                    });
                }
            };

            // Navigation
            const navCustomer = async (dir) => {
                const cur = fNo.value.trim();
                const res = await ERP_API.get('nav_customer', { dir, current: cur });
                if (res.success && res.data) {
                    fillForm(res.data);
                }
            };
            const bindNavCust = (btnId, dir) => {
                const btn = winEl.querySelector(btnId);
                if (btn) btn.addEventListener('click', () => checkDirtyBeforeAction(() => navCustomer(dir)));
            };
            bindNavCust('#copi01-tb-first', 'first');
            bindNavCust('#copi01-tb-prev', 'prev');
            bindNavCust('#copi01-tb-next', 'next');
            bindNavCust('#copi01-tb-last', 'last');

            winEl.querySelector('#copi01-lookup-btn').addEventListener('click', () => {
                checkDirtyBeforeAction(() => Modules.openLookup('customer', (c) => {
                    fillForm(c);
                    switchTab('detail');
                }));
            });
            winEl.querySelector('#copi01-tb-query').addEventListener('click', () => {
                checkDirtyBeforeAction(() => Modules.openLookup('customer', (c) => {
                    fillForm(c);
                    switchTab('detail');
                }));
            });
            const formatPersonnel = (s) => {
                if (!s) return '1001 張明達';
                const code = s.emp_no || s.code || '';
                let name = s.emp_name || s.name || '';
                name = name.replace(/\(業務\)/, '').trim();
                return code && name ? `${code} ${name}` : (code || name || '1001 張明達');
            };

            const copi01SalesBtn = winEl.querySelector('#copi01-lookup-sales');
            if (copi01SalesBtn) {
                copi01SalesBtn.addEventListener('click', () => {
                    Modules.openLookup('personnel', (s) => {
                        fSales.value = formatPersonnel(s);
                        isDirty = true;
                    });
                });
            }
            if (fSales) {
                fSales.addEventListener('dblclick', () => copi01SalesBtn?.click());
                fSales.addEventListener('blur', () => {
                    const v = fSales.value.trim();
                    if (v === '1001' || v === '1001張明達') {
                        fSales.value = '1001 張明達';
                    }
                });
            }

            const copi01CollectorBtn = winEl.querySelector('#copi01-lookup-collector');
            if (copi01CollectorBtn) {
                copi01CollectorBtn.addEventListener('click', () => {
                    Modules.openLookup('personnel', (s) => {
                        const col = winEl.querySelector('#copi01-collector');
                        if (col) col.value = formatPersonnel(s);
                        isDirty = true;
                    });
                });
            }
            if (fCollector) {
                fCollector.addEventListener('dblclick', () => copi01CollectorBtn?.click());
                fCollector.addEventListener('blur', () => {
                    const v = fCollector.value.trim();
                    if (v === '1001' || v === '1001張明達') {
                        fCollector.value = '1001 張明達';
                    }
                });
            }

            // 挑選幣別開窗 (點擊按鈕或雙擊欄位)
            const openCurrencyLookup = () => {
                Modules.openLookup('currency', (cur) => {
                    if (cur) {
                        fCurrency.value = cur.code || cur.currency || '';
                        isDirty = true;
                    }
                });
            };
            const copi01CurBtn = winEl.querySelector('#copi01-lookup-currency');
            if (copi01CurBtn) copi01CurBtn.addEventListener('click', openCurrencyLookup);
            if (fCurrency) fCurrency.addEventListener('dblclick', openCurrencyLookup);

            // 開業日期月曆挑選 (點擊按鈕或雙擊欄位)
            const openOpenDateCal = () => {
                Modules.openCalendar(fOpenDate, (dateStr) => {
                    fOpenDate.value = dateStr;
                    isDirty = true;
                });
            };
            const copi01OpenDateBtn = winEl.querySelector('#copi01-cal-open-date');
            if (copi01OpenDateBtn) copi01OpenDateBtn.addEventListener('click', openOpenDateCal);
            if (fOpenDate) fOpenDate.addEventListener('dblclick', openOpenDateCal);

            // 客戶核准日月曆挑選 (點擊按鈕或雙擊欄位)
            const openApprovalDateCal = () => {
                Modules.openCalendar(fApprovalDate, (dateStr) => {
                    fApprovalDate.value = dateStr;
                    isDirty = true;
                });
            };
            const copi01ApprovalDateBtn = winEl.querySelector('#copi01-cal-approval-date');
            if (copi01ApprovalDateBtn) copi01ApprovalDateBtn.addEventListener('click', openApprovalDateCal);
            if (fApprovalDate) fApprovalDate.addEventListener('dblclick', openApprovalDateCal);

            // 部門別開窗挑選 (點擊按鈕或雙擊欄位)
            const openDeptLookup = () => {
                Modules.openLookup('department', (d) => {
                    if (d) {
                        fDept.value = d.dept_no || d.code || '';
                        isDirty = true;
                    }
                });
            };
            const copi01DeptBtn = winEl.querySelector('#copi01-lookup-dept');
            if (copi01DeptBtn) copi01DeptBtn.addEventListener('click', openDeptLookup);
            if (fDept) fDept.addEventListener('dblclick', openDeptLookup);

            // 連絡人挑選開窗
            const copi01ContactBtn = winEl.querySelector('#copi01-lookup-contact');
            if (copi01ContactBtn) {
                copi01ContactBtn.addEventListener('click', () => {
                    Modules.openLookup('personnel', (p) => {
                        if (p) {
                            fContact.value = p.emp_name || p.name || '';
                            isDirty = true;
                        }
                    });
                });
            }

            // 總店號挑選開窗
            const copi01MainStoreBtn = winEl.querySelector('#copi01-lookup-main-store');
            if (copi01MainStoreBtn) {
                copi01MainStoreBtn.addEventListener('click', () => {
                    Modules.openLookup('customer', (c) => {
                        if (c) {
                            if (fMainStore) fMainStore.value = c.customer_no || c.code || '';
                            isDirty = true;
                        }
                    });
                });
            }

            // 關係人代號挑選開窗
            const openRelatedLookup = () => {
                Modules.openLookup('customer', (c) => {
                    if (c) {
                        if (fRelatedParty) fRelatedParty.value = c.customer_no || c.code || '';
                        isDirty = true;
                    }
                });
            };
            const copi01RelatedBtn = winEl.querySelector('#copi01-lookup-related');
            if (copi01RelatedBtn) copi01RelatedBtn.addEventListener('click', openRelatedLookup);
            if (fRelatedParty) fRelatedParty.addEventListener('dblclick', openRelatedLookup);

            // 價格條件挑選開窗
            const openPriceTermLookup = () => {
                Modules.openLookup('price_term', (pt) => {
                    if (pt) {
                        if (fPriceTerm) fPriceTerm.value = pt.code || pt.name || '';
                        isDirty = true;
                    }
                });
            };
            const copi01PriceTermBtn = winEl.querySelector('#copi01-lookup-price-term');
            if (copi01PriceTermBtn) copi01PriceTermBtn.addEventListener('click', openPriceTermLookup);
            if (fPriceTerm) fPriceTerm.addEventListener('dblclick', openPriceTermLookup);

            // 付款條件挑選開窗
            const openPaymentTermLookup = () => {
                Modules.openLookup('payment_term', (pt) => {
                    if (pt) {
                        if (fPaymentTerm) fPaymentTerm.value = pt.code || pt.condition_no || '';
                        isDirty = true;
                    }
                });
            };
            const copi01PaymentTermBtn = winEl.querySelector('#copi01-lookup-payment-term');
            if (copi01PaymentTermBtn) copi01PaymentTermBtn.addEventListener('click', openPaymentTermLookup);
            if (fPaymentTerm) fPaymentTerm.addEventListener('dblclick', openPaymentTermLookup);

            // 稅別碼挑選開窗 (訂單管理系統 - 全部 S 開頭: S01~S22)
            const openTaxCodeLookup = () => {
                Modules.openLookup('tax_order', (tc) => {
                    if (tc) {
                        if (fTaxCode) fTaxCode.value = tc.code || tc.tax_code || 'S05';
                        if (fInvoiceCopies && tc.invoice_copies) fInvoiceCopies.value = tc.invoice_copies;
                        if (fTaxType && tc.tax_type) fTaxType.value = tc.tax_type;
                        isDirty = true;
                    }
                });
            };
            const copi01TaxCodeBtn = winEl.querySelector('#copi01-lookup-tax-code');
            if (copi01TaxCodeBtn) copi01TaxCodeBtn.addEventListener('click', openTaxCodeLookup);
            if (fTaxCode) fTaxCode.addEventListener('dblclick', openTaxCodeLookup);
            winEl.querySelector('#copi01-tb-new').addEventListener('click', () => checkDirtyBeforeAction(() => {
                clearForm();
                switchTab('detail');
            }));
            winEl.querySelector('#copi01-tb-edit').addEventListener('click', () => {
                const curNo = fNo.value.trim();
                if (!curNo) {
                    alert('請先查詢客戶資料或點選「新增」！');
                    return;
                }
                switchTab('detail');
                Modules.setFormMode(winEl, null, 'edit', statusMsg, curNo);
                Modules.toast(`客戶 [${curNo}] 進入修改模式`, 'info');
            });
            winEl.querySelector('#copi01-tb-save').addEventListener('click', doSave);

            winEl.querySelector('#copi01-tb-cancel').addEventListener('click', () => {
                if (isDirty) {
                    const answer = confirm("資料尚未儲存，是否要儲存目前的客戶資料？\n\n點選【確定】：進行儲存\n點選【取消】：直接清除放棄變更");
                    if (answer) {
                        doSave();
                    } else {
                        resetCustBlank();
                        Modules.toast('已取消並清除未儲存變更。', 'info');
                    }
                } else {
                    resetCustBlank();
                    Modules.toast('已清除重置頁面資料。', 'info');
                }
            });

            winEl.querySelector('#copi01-tb-del').addEventListener('click', async () => {
                const no = fNo.value.trim();
                if (!no) return;
                if (confirm(`確定要刪除客戶 [${no}] 嗎？`)) {
                    const res = await ERP_API.post('delete_customer', { customer_no: no });
                    if (res.success) {
                        Modules.toast('客戶主檔已成功刪除！', 'success');
                        clearForm();
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

            // Initial load: 若有傳入指定客戶代號則立即載入，否則維持空白模式
            if (targetCustNo) {
                ERP_API.get('get_customers').then(res => {
                    if (res.success && res.data) {
                        custList = res.data;
                        const found = custList.find(c => c.customer_no === targetCustNo);
                        if (found) {
                            currentIndex = custList.indexOf(found);
                            fillForm(found);
                            return;
                        }
                    }
                    resetCustBlank();
                });
            } else {
                resetCustBlank();
            }
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
                <button class="erp-tb-btn" title="列印" onclick="alert('供應商清單產生中...')">🖨️</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="首筆" id="puri01-tb-first">|◀</button>
                <button class="erp-tb-btn" title="上筆" id="puri01-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下筆" id="puri01-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="puri01-tb-last">▶|</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="儲存" id="puri01-tb-save" style="color:#008000; font-weight:bold; font-size:15px;">✔</button>
                <button class="erp-tb-btn tb-btn-cancel" title="取消 (清除放棄未儲存變更)" id="puri01-tb-cancel" style="color:#CC0000; font-weight:bold; font-size:15px;">✖</button>
            </div>

            <!-- Top Tab Header -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="puri01-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="puri01-tab-browse">資料瀏覽</button>
            </div>

            <!-- Detail View -->
            <div id="puri01-view-detail" style="display:flex; flex-direction:column; flex:1;">
                <div class="erp-header-panel">
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>廠商代號</label>
                            <input type="text" id="puri01-no" class="erp-input-cyan" style="width:90px;" value="">
                            <button class="lookup-icon-btn" id="puri01-lookup-btn" title="開窗挑選廠商">🏢</button>
                        </div>
                        <div class="erp-field">
                            <label>廠商簡稱</label>
                            <input type="text" id="puri01-short" class="erp-input-yellow" style="width:140px;" value="">
                        </div>
                        <div class="erp-field">
                            <label>統一編號</label>
                            <input type="text" id="puri01-taxid" style="width:100px;" value="">
                        </div>
                    </div>
                    <div class="erp-form-row">
                        <div class="erp-field">
                            <label>公司全名</label>
                            <input type="text" id="puri01-fullname" style="width:360px;" value="">
                        </div>
                    </div>
                </div>

                <!-- Subtab Header -->
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
                                <div class="erp-field"><label>TEL(一)</label><input type="text" id="puri01-tel" style="width:140px;" value=""></div>
                                <div class="erp-field"><label>TEL(二)</label><input type="text" id="puri01-tel2" style="width:140px;" value=""></div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field"><label>FAXNO</label><input type="text" id="puri01-fax" style="width:140px;" value=""></div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field"><label>E_MAIL</label><input type="text" id="puri01-email" style="width:240px;" value=""></div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field"><label>負責人</label><input type="text" id="puri01-boss" style="width:160px;" value=""></div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field"><label>採購人員</label><input type="text" id="puri01-purchaser" style="width:75px;" value=""><button class="lookup-icon-btn" id="puri01-lookup-purchaser">👤</button><span class="erp-field-desc" id="puri01-purchaser-desc"></span></div>
                            </div>
                        </div>
                        <div class="col-half">
                            <div class="erp-form-row">
                                <div class="erp-field"><label>開業日</label><input type="text" id="puri01-open-date" style="width:90px;" value="" placeholder="YYYY/MM/DD"><button type="button" class="lookup-icon-btn" id="puri01-cal-open-date" title="選擇開業日">📅</button></div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field"><label>資本額</label><input type="text" id="puri01-capital" style="width:110px; text-align:right;" value=""><span class="erp-field-desc">萬</span></div>
                            </div>
                            <div class="erp-form-row">
                                <div class="erp-field"><label>交易幣別</label><input type="text" id="puri01-currency" class="erp-input-yellow" style="width:65px;" value="NTD"><button type="button" class="lookup-icon-btn" id="puri01-lookup-currency" title="挑選交易幣別" style="color:#008000; font-weight:bold; font-family:monospace; font-size:13px;">$</button><span class="erp-field-desc" id="puri01-currency-desc"></span></div>
                            </div>
                            <div class="erp-form-row" style="margin-top:6px; border:1px solid #7F9DB9; padding:8px; background:#ECE9D8; width:280px;">
                                <label style="font-weight:bold; margin-bottom:4px; display:block;">稅額計算方式</label>
                                <label style="display:block; min-width:auto; margin-bottom:4px;"><input type="radio" name="tax_calc" value="1"> 整張資料計算</label>
                                <label style="display:block; min-width:auto;"><input type="radio" name="tax_calc" value="2" checked> 單身單筆資料計算</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Browse View -->
            <div id="puri01-view-browse" style="display:none; flex-direction:column; flex:1; padding:4px;">
                <div class="erp-datagrid-container" style="flex:1;">
                    <table class="erp-grid-table">
                        <thead>
                            <tr>
                                <th style="width:25px;"></th>
                                <th class="th-cyan" style="width:95px;">廠商代號</th>
                                <th style="width:130px;">簡稱</th>
                                <th style="width:220px;">公司全名</th>
                                <th style="width:95px;">統一編號</th>
                                <th style="width:110px;">聯絡電話</th>
                                <th style="width:95px;">負責人</th>
                            </tr>
                        </thead>
                        <tbody id="puri01-browse-tbody">
                            <tr><td colspan="7" style="text-align:center; padding:20px; color:#888;">載入廠商資料中...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="erp-window-statusbar">
                <span class="status-cell">瀏覽</span>
                <span class="status-cell" id="puri01-status-msg">資料空白</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 940, 580, (winEl) => {
            const fNo = winEl.querySelector('#puri01-no');
            const fShort = winEl.querySelector('#puri01-short');
            const fTaxId = winEl.querySelector('#puri01-taxid');
            const fFullName = winEl.querySelector('#puri01-fullname');
            const fTel = winEl.querySelector('#puri01-tel');
            const fBoss = winEl.querySelector('#puri01-boss');
            const fPurchaser = winEl.querySelector('#puri01-purchaser');
            const fPurchaserDesc = winEl.querySelector('#puri01-purchaser-desc');
            const fCurrency = winEl.querySelector('#puri01-currency');
            const statusMsg = winEl.querySelector('#puri01-status-msg');

            const tabDetail = winEl.querySelector('#puri01-tab-detail');
            const tabBrowse = winEl.querySelector('#puri01-tab-browse');
            const viewDetail = winEl.querySelector('#puri01-view-detail');
            const viewBrowse = winEl.querySelector('#puri01-view-browse');

            let isDirty = false;
            let supplierList = [];

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

            const fillForm = (s) => {
                fNo.value = s.supplier_no || '';
                fShort.value = s.name_short || '';
                fTaxId.value = s.tax_id || '';
                fFullName.value = s.full_name || '';
                fTel.value = s.tel || '';
                fBoss.value = s.contact || '';
                fPurchaser.value = s.buyer || '';
                fPurchaserDesc.textContent = s.buyer ? (s.buyer_name || '') : '';
                fCurrency.value = s.currency || 'NTD';
                Modules.setFormMode(winEl, null, 'browse', statusMsg, s.supplier_no);
                isDirty = false;
            };

            const clearForm = (autoFocus = true) => {
                fNo.value = '';
                fShort.value = '';
                fTaxId.value = '';
                fFullName.value = '';
                fTel.value = '';
                const tel2 = winEl.querySelector('#puri01-tel2');
                if (tel2) tel2.value = '';
                const fax = winEl.querySelector('#puri01-fax');
                if (fax) fax.value = '';
                const email = winEl.querySelector('#puri01-email');
                if (email) email.value = '';
                fBoss.value = '';
                fPurchaser.value = '';
                fPurchaserDesc.textContent = '';
                const openDate = winEl.querySelector('#puri01-open-date');
                if (openDate) openDate.value = '';
                const capital = winEl.querySelector('#puri01-capital');
                if (capital) capital.value = '';
                fCurrency.value = '';
                Modules.setFormMode(winEl, null, autoFocus ? 'add' : 'browse', statusMsg, '');
                isDirty = false;
                if (autoFocus) fNo.focus();
            };

            const checkDirtyBeforeAction = (callback) => {
                if (isDirty) {
                    const answer = confirm("資料尚未儲存，是否要儲存目前的廠商資料？\n\n點選【確定】：進行儲存\n點選【取消】：直接清除放棄變更");
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
                const tbody = winEl.querySelector('#puri01-browse-tbody');
                const res = await ERP_API.get('get_suppliers');
                if (res.success) {
                    supplierList = res.data || [];
                    if (supplierList.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px; color:#888;">目前尚無廠商資料</td></tr>';
                        return;
                    }
                    let rows = '';
                    supplierList.forEach(s => {
                        rows += `
                            <tr data-no="${s.supplier_no}" style="cursor:pointer;">
                                <td style="text-align:center;">▶</td>
                                <td style="font-weight:bold; color:#003366;">${s.supplier_no}</td>
                                <td>${s.name_short || ''}</td>
                                <td>${s.full_name || ''}</td>
                                <td>${s.tax_id || ''}</td>
                                <td>${s.tel || ''}</td>
                                <td>${s.contact || ''}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows;

                    tbody.querySelectorAll('tr[data-no]').forEach(tr => {
                        tr.addEventListener('click', () => {
                            checkDirtyBeforeAction(() => {
                                const no = tr.getAttribute('data-no');
                                const item = supplierList.find(x => x.supplier_no === no);
                                if (item) {
                                    fillForm(item);
                                    switchTab('detail');
                                }
                            });
                        });
                    });
                }
            };

            const navSupplier = async (dir) => {
                const cur = fNo.value.trim();
                const res = await ERP_API.get('nav_supplier', { dir, current: cur });
                if (res.success && res.data) {
                    fillForm(res.data);
                } else {
                    alert('已無' + (dir === 'first' ? '第一筆' : dir === 'last' ? '最後一筆' : dir === 'prev' ? '上一筆' : '下一筆') + '廠商資料');
                }
            };

            const bindNav = (btnId, dir) => {
                const btn = winEl.querySelector(btnId);
                if (btn) btn.addEventListener('click', () => checkDirtyBeforeAction(() => navSupplier(dir)));
            };
            bindNav('#puri01-tb-first', 'first');
            bindNav('#puri01-tb-prev', 'prev');
            bindNav('#puri01-tb-next', 'next');
            bindNav('#puri01-tb-last', 'last');

            const doSave = async () => {
                const sNo = fNo.value.trim();
                if (!sNo) {
                    alert('【必填檢查】請輸入廠商代號！');
                    fNo.focus();
                    return false;
                }
                const payload = {
                    supplier_no: sNo,
                    name_short: fShort.value.trim(),
                    full_name: fFullName.value.trim(),
                    contact: fBoss.value.trim(),
                    tel: fTel.value.trim(),
                    tax_id: fTaxId.value.trim(),
                    currency: fCurrency.value.trim() || 'NTD'
                };
                const res = await ERP_API.post('save_supplier', payload);
                if (res.success) {
                    isDirty = false;
                    Modules.setFormMode(winEl, null, 'browse', statusMsg, sNo);
                    Modules.toast(`供應廠商 [${sNo}] 儲存成功！`, 'success');
                    return true;
                } else {
                    Modules.toast('儲存失敗: ' + (res.error || '不明錯誤'), 'error');
                    return false;
                }
            };

            winEl.querySelector('#puri01-lookup-btn').addEventListener('click', () => {
                checkDirtyBeforeAction(() => Modules.openLookup('supplier', (s) => {
                    fillForm(s);
                    switchTab('detail');
                }));
            });
            winEl.querySelector('#puri01-tb-query').addEventListener('click', () => {
                checkDirtyBeforeAction(() => Modules.openLookup('supplier', (s) => {
                    fillForm(s);
                    switchTab('detail');
                }));
            });

            const purBtn = winEl.querySelector('#puri01-lookup-purchaser');
            if (purBtn) {
                purBtn.addEventListener('click', () => {
                    Modules.openLookup('personnel', (p) => {
                        fPurchaser.value = p.emp_no || p.code;
                        fPurchaserDesc.textContent = p.emp_name || p.name;
                        isDirty = true;
                    });
                });
            }

            // PURI01 挑選幣別開窗 (點擊按鈕或雙擊欄位)
            const openCurrencyLookupPuri = () => {
                Modules.openLookup('currency', (cur) => {
                    if (cur) {
                        fCurrency.value = cur.code || cur.currency || '';
                        const desc = winEl.querySelector('#puri01-currency-desc');
                        if (desc) desc.textContent = cur.name || '';
                        isDirty = true;
                    }
                });
            };
            const puriCurBtn = winEl.querySelector('#puri01-lookup-currency');
            if (puriCurBtn) puriCurBtn.addEventListener('click', openCurrencyLookupPuri);
            if (fCurrency) fCurrency.addEventListener('dblclick', openCurrencyLookupPuri);

            // PURI01 開業日月曆挑選 (點擊按鈕或雙擊欄位)
            const fOpenDatePuri = winEl.querySelector('#puri01-open-date');
            const openOpenDateCalPuri = () => {
                Modules.openCalendar(fOpenDatePuri, (dateStr) => {
                    fOpenDatePuri.value = dateStr;
                    isDirty = true;
                });
            };
            const puriOpenDateBtn = winEl.querySelector('#puri01-cal-open-date');
            if (puriOpenDateBtn) puriOpenDateBtn.addEventListener('click', openOpenDateCalPuri);
            if (fOpenDatePuri) fOpenDatePuri.addEventListener('dblclick', openOpenDateCalPuri);

            winEl.querySelector('#puri01-tb-new').addEventListener('click', () => checkDirtyBeforeAction(() => {
                clearForm(true);
                switchTab('detail');
            }));
            winEl.querySelector('#puri01-tb-edit').addEventListener('click', () => {
                const curNo = fNo.value.trim();
                if (!curNo) {
                    alert('請先查詢廠商資料或點選「新增」！');
                    return;
                }
                switchTab('detail');
                Modules.setFormMode(winEl, null, 'edit', statusMsg, curNo);
                Modules.toast(`廠商 [${curNo}] 進入修改模式`, 'info');
            });
            winEl.querySelector('#puri01-tb-save').addEventListener('click', doSave);

            winEl.querySelector('#puri01-tb-cancel').addEventListener('click', () => {
                if (isDirty) {
                    const answer = confirm("資料尚未儲存，是否要儲存目前的廠商資料？\n\n點選【確定】：進行儲存\n點選【取消】：直接清除放棄變更");
                    if (answer) {
                        doSave();
                    } else {
                        clearForm(false);
                        Modules.toast('已取消並清除未儲存變更。', 'info');
                    }
                } else {
                    clearForm(false);
                    Modules.toast('已清除重置頁面資料。', 'info');
                }
            });

            winEl.querySelector('#puri01-tb-del').addEventListener('click', async () => {
                const sNo = fNo.value.trim();
                if (!sNo) return;
                if (confirm(`確定要刪除供應廠商 [${sNo}] 嗎？`)) {
                    const res = await ERP_API.post('delete_supplier', { supplier_no: sNo });
                    if (res.success) {
                        Modules.toast('廠商資料已成功刪除！', 'success');
                        clearForm();
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

            // Initial clear: 100% 空白模式，按新增或查詢才出現
            clearForm(false);
        });
    },

    // ========================================================
    // 6. 品號資料建立作業 (INVI02) - 1:1 擷取5 (media_1793885786171_9ba3f436.png)
    // ========================================================
    openINVI02(targetItemNo = '') {
        const u = App.currentUser?.company || '學生區';
        const title = `品號資料建立作業 (INVI02)[${u}]`;
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
                <button class="erp-tb-btn" title="列印" onclick="alert('品號資料清單產生中...')">🖨️</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="首筆" id="invi02-tb-first">|◀</button>
                <button class="erp-tb-btn" title="上筆" id="invi02-tb-prev">◀</button>
                <button class="erp-tb-btn" title="下筆" id="invi02-tb-next">▶</button>
                <button class="erp-tb-btn" title="末筆" id="invi02-tb-last">▶|</button>
                <div class="erp-tb-sep"></div>
                <button class="erp-tb-btn" title="儲存" id="invi02-tb-save" style="color:#008000; font-weight:bold; font-size:15px;">✔</button>
                <button class="erp-tb-btn tb-btn-cancel" title="取消 (清除放棄未儲存變更)" id="invi02-tb-cancel" style="color:#CC0000; font-weight:bold; font-size:15px;">✖</button>
                <button class="erp-tb-btn" title="確認" id="invi02-tb-confirm">
                    <img src="assets/icons/confirm_active.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
                <button class="erp-tb-btn" title="取消確認" id="invi02-tb-unconfirm">
                    <img src="assets/icons/unconfirm_disabled.png" style="width:18px;height:18px;vertical-align:middle;display:block;">
                </button>
            </div>

            <!-- Top Tab Header -->
            <div class="erp-tab-header">
                <button class="erp-tab-btn active" id="invi02-tab-detail">詳細欄位</button>
                <button class="erp-tab-btn" id="invi02-tab-browse">資料瀏覽</button>
            </div>

            <!-- Detail View -->
            <div id="invi02-view-detail" style="display:flex; flex-direction:column; flex:1; background:#ECE9D8; overflow:hidden;">
                <!-- Header Panel (1:1 參考圖片) -->
                <div class="erp-header-panel" style="padding:4px 8px; border-bottom:1px solid #7F9DB9;">
                    <!-- Row 1 -->
                    <div style="display:flex; align-items:center; margin-bottom:3px; font-size:12px;">
                        <label style="width:50px; text-align:right; margin-right:4px;">品號</label>
                        <input type="text" id="invi02-no" class="erp-input-cyan" style="width:160px;" value="">
                        <button class="lookup-icon-btn" id="invi02-lookup-item" title="開窗挑選品號" style="margin-left:2px; font-size:10px;">▲</button>
                        
                        <label style="width:55px; text-align:right; margin-right:4px;">版次</label>
                        <input type="text" id="invi02-version" style="width:40px;" value="">
                        
                        <label style="width:50px; text-align:right; margin-right:4px;">單位</label>
                        <input type="text" id="invi02-unit" class="erp-input-yellow" style="width:45px;" value="">
                        <button type="button" class="lookup-icon-btn" id="invi02-lookup-unit" style="margin-left:2px; font-size:10px; width:16px; height:18px; padding:0;" title="開窗挑選單位">@</button>
                        
                        <div style="margin-left:auto; display:flex; align-items:center;">
                            <label style="width:70px; text-align:right; margin-right:4px;">庫存數量</label>
                            <input type="text" id="invi02-stock-qty" class="erp-input-readonly" readonly style="width:110px; text-align:right;" value="">
                        </div>
                    </div>

                    <!-- Row 2 -->
                    <div style="display:flex; align-items:center; margin-bottom:3px; font-size:12px;">
                        <label style="width:50px; text-align:right; margin-right:4px;">品名</label>
                        <input type="text" id="invi02-name" style="width:230px;" value="">
                        
                        <label style="width:75px; text-align:right; margin-right:4px;">小單位</label>
                        <input type="text" id="invi02-small-unit" style="width:45px;" value="">
                        <button type="button" class="lookup-icon-btn" id="invi02-lookup-smallunit" style="margin-left:2px; font-size:10px; width:16px; height:18px; padding:0;" title="開窗挑選小單位">@</button>
                        
                        <div style="margin-left:auto; display:flex; align-items:center;">
                            <label style="width:70px; text-align:right; margin-right:4px;">庫存金額</label>
                            <input type="text" id="invi02-stock-amt" class="erp-input-readonly" readonly style="width:110px; text-align:right;" value="">
                        </div>
                    </div>

                    <!-- Row 3 -->
                    <div style="display:flex; align-items:center; margin-bottom:3px; font-size:12px;">
                        <label style="width:50px; text-align:right; margin-right:4px;">規格</label>
                        <input type="text" id="invi02-spec" style="width:230px;" value="">
                        
                        <label style="display:inline-flex; align-items:center; gap:2px; margin-left:70px; cursor:pointer;">
                            <input type="checkbox" id="invi02-fixed-weight"> 定重
                        </label>
                        
                        <div style="margin-left:auto; display:flex; align-items:center;">
                            <label style="width:70px; text-align:right; margin-right:4px;">單位成本</label>
                            <input type="text" id="invi02-unit-cost" class="erp-input-readonly" readonly style="width:110px; text-align:right;" value="">
                        </div>
                    </div>

                    <!-- Row 4 -->
                    <div style="display:flex; align-items:center; margin-bottom:3px; font-size:12px;">
                        <label style="width:50px; text-align:right; margin-right:4px;">貨號</label>
                        <input type="text" id="invi02-barcode" style="width:130px;" value="">
                        
                        <label style="width:40px; text-align:right; margin-right:4px;">SIZE</label>
                        <input type="text" id="invi02-size" style="width:45px;" value="">
                        
                        <label style="width:70px; text-align:right; margin-right:4px;">包裝單位</label>
                        <input type="text" id="invi02-pack-unit" style="width:45px;" value="">
                        <button type="button" class="lookup-icon-btn" id="invi02-lookup-packunit" style="margin-left:2px; font-size:10px; width:16px; height:18px; padding:0;" title="開窗挑選包裝單位">@</button>
                        
                        <div style="margin-left:auto; display:flex; align-items:center;">
                            <label style="width:70px; text-align:right; margin-right:4px;">包裝數量</label>
                            <input type="text" id="invi02-pack-qty" style="width:110px; text-align:right;" value="">
                        </div>
                    </div>

                    <!-- Row 5 -->
                    <div style="display:flex; align-items:center; font-size:12px;">
                        <div style="margin-left:auto; display:flex; align-items:center;">
                            <label style="margin-right:4px;">新品號核准日期</label>
                            <input type="text" id="invi02-approval-date" style="width:110px;" value="">
                        </div>
                    </div>
                </div>

                <!-- Middle Sub-tabs Bar (1:1 參考原版截圖: 底用空白處顏色，點到變深藍，其餘灰色) -->
                <div class="erp-subtab-header" style="margin-top:2px;">
                    <button class="erp-subtab-btn invi02-subtab-btn active" data-tab="basic1">基本資料1</button>
                    <button class="erp-subtab-btn invi02-subtab-btn" data-tab="basic2">基本資料2</button>
                    <button class="erp-subtab-btn invi02-subtab-btn" data-tab="basic3">基本資料3</button>
                    <button class="erp-subtab-btn invi02-subtab-btn" data-tab="pur1">採購生管1</button>
                    <button class="erp-subtab-btn invi02-subtab-btn" data-tab="pur2">採購生管2</button>
                    <button class="erp-subtab-btn invi02-subtab-btn" data-tab="price">售價</button>
                    <button class="erp-subtab-btn invi02-subtab-btn" data-tab="cost">成本</button>
                    <div style="margin-left:auto; display:flex; gap:1px; padding-right:4px;">
                        <button type="button" style="width:16px; height:18px; font-size:10px; padding:0; background:#D4D0C8; border:1px solid #808080; cursor:pointer;">◀</button>
                        <button type="button" style="width:16px; height:18px; font-size:10px; padding:0; background:#D4D0C8; border:1px solid #808080; cursor:pointer;">▶</button>
                    </div>
                </div>

                <!-- Middle Tab Content Area -->
                <div class="erp-tab-content" style="padding:0; background:#ECE9D8; border-bottom:1px solid #7F9DB9;">
                    <!-- 1. 基本資料1 頁籤 (1:1 參考圖片5) -->
                    <div id="invi02-subtab-basic1" style="display:block; padding:8px 14px; background:#ECE9D8; font-size:12px;">
                        <div style="display:flex; gap:20px;">
                            <!-- Left Column -->
                            <div style="display:flex; flex-direction:column; gap:4px; width:340px;">
                                <div style="display:flex; align-items:center; margin-bottom:2px;">
                                    <label style="display:inline-flex; align-items:center; gap:4px; cursor:pointer; margin-left:84px;">
                                        <input type="checkbox" id="invi02-chk-edit-spec"> 修改品名規格
                                    </label>
                                </div>
                                <div style="display:flex; align-items:center;">
                                    <label style="width:80px; text-align:right; margin-right:4px;">會計</label>
                                    <input type="text" id="invi02-cat-no" class="erp-input-yellow" style="width:65px;" value="01">
                                    <button type="button" class="lookup-icon-btn" id="invi02-lookup-cat" style="margin-left:2px; font-size:10px;" title="開窗挑選品號類別">▲</button>
                                    <span class="erp-field-desc" id="invi02-cat-desc" style="margin-left:4px;">原料</span>
                                </div>
                                <div style="display:flex; align-items:center;">
                                    <label style="width:80px; text-align:right; margin-right:4px;">資材</label>
                                    <input type="text" id="invi02-mat-no" style="width:65px;" value="">
                                    <button type="button" class="lookup-icon-btn" id="invi02-lookup-mat" style="margin-left:2px; font-size:10px;">▲</button>
                                </div>
                                <div style="display:flex; align-items:center;">
                                    <label style="width:80px; text-align:right; margin-right:4px;">業務</label>
                                    <input type="text" id="invi02-sales-dept" style="width:65px;" value="">
                                    <button type="button" class="lookup-icon-btn" id="invi02-lookup-sales" style="margin-left:2px; font-size:10px;">▲</button>
                                </div>
                                <div style="display:flex; align-items:center;">
                                    <label style="width:80px; text-align:right; margin-right:4px;">生管</label>
                                    <input type="text" id="invi02-prod-ctrl" style="width:65px;" value="">
                                    <button type="button" class="lookup-icon-btn" id="invi02-lookup-prodctrl" style="margin-left:2px; font-size:10px;">▲</button>
                                </div>
                                <div style="display:flex; align-items:center;">
                                    <label style="width:80px; text-align:right; margin-right:4px;">主要庫別</label>
                                    <input type="text" id="invi02-main-wh" style="width:65px;" value="">
                                    <button type="button" class="lookup-icon-btn" id="invi02-lookup-mainwh" style="margin-left:2px;">☖</button>
                                </div>
                                <div style="display:flex; align-items:center;">
                                    <label style="width:80px; text-align:right; margin-right:4px;">主要領料庫別</label>
                                    <input type="text" id="invi02-issue-wh" style="width:65px;" value="">
                                    <button type="button" class="lookup-icon-btn" id="invi02-lookup-issuewh" style="margin-left:2px;">☖</button>
                                </div>
                                <div style="display:flex; align-items:center;">
                                    <label style="width:80px; text-align:right; margin-right:4px;">生產線別</label>
                                    <input type="text" id="invi02-prod-line" style="width:65px;" value="">
                                    <button type="button" class="lookup-icon-btn" id="invi02-lookup-prodline" style="margin-left:2px;">🏭</button>
                                </div>
                                <div style="display:flex; align-items:center;">
                                    <label style="width:80px; text-align:right; margin-right:4px;">計劃人員</label>
                                    <input type="text" id="invi02-planner-no" style="width:65px;" value="">
                                    <button type="button" class="lookup-icon-btn" id="invi02-lookup-planner" style="margin-left:2px;">👤</button>
                                    <span class="erp-field-desc" id="invi02-planner-desc" style="margin-left:4px;"></span>
                                </div>
                                <div style="display:flex; align-items:center; margin-top:4px;">
                                    <label style="display:inline-flex; align-items:center; gap:4px; cursor:pointer; margin-left:80px; white-space:nowrap;">
                                        <input type="checkbox" id="invi02-chk-einvoice"> 電子發票須上傳產品追溯串接碼
                                    </label>
                                </div>
                            </div>

                            <!-- Right Column -->
                            <div style="display:flex; flex-direction:column; gap:4px; flex:1;">
                                <div style="display:flex; align-items:center;">
                                    <label style="width:120px; text-align:right; margin-right:4px;">採購單位</label>
                                    <input type="text" id="invi02-pur-unit" style="width:65px;" value="">
                                    <button type="button" class="lookup-icon-btn" id="invi02-lookup-purunit" style="margin-left:2px; font-size:10px; width:16px; height:18px; padding:0;" title="開窗挑選採購單位">@</button>
                                </div>
                                <div style="display:flex; align-items:center;">
                                    <label style="width:120px; text-align:right; margin-right:4px;">銷售單位</label>
                                    <input type="text" id="invi02-sale-unit" style="width:65px;" value="">
                                    <button type="button" class="lookup-icon-btn" id="invi02-lookup-saleunit" style="margin-left:2px; font-size:10px; width:16px; height:18px; padding:0;" title="開窗挑選銷售單位">@</button>
                                </div>
                                <div style="display:flex; align-items:center;">
                                    <label style="width:120px; text-align:right; margin-right:4px;">文管代號</label>
                                    <input type="text" id="invi02-doc-code" style="width:120px;" value="">
                                    <button type="button" class="lookup-icon-btn" id="invi02-lookup-doccode" style="margin-left:2px;">🗎</button>
                                </div>
                                <div style="display:flex; align-items:center;">
                                    <label style="width:120px; text-align:right; margin-right:4px;">稅則</label>
                                    <input type="text" id="invi02-tax-tariff" style="width:180px;" value="">
                                    <button type="button" class="lookup-icon-btn" id="invi02-lookup-taxtariff" style="margin-left:2px; font-size:10px;">▲</button>
                                </div>
                                <div style="display:flex; align-items:center;">
                                    <label style="width:120px; text-align:right; margin-right:4px;">保固佔售價比率</label>
                                    <input type="text" id="invi02-warranty-ratio" style="width:55px; text-align:right;" value="">
                                    <span style="margin-left:3px;">%</span>
                                </div>
                                <div style="display:flex; align-items:center;">
                                    <label style="width:120px; text-align:right; margin-right:4px;">保固期數(月數)</label>
                                    <input type="text" id="invi02-warranty-months" style="width:55px; text-align:right;" value="">
                                </div>
                                <div style="display:flex; align-items:center; margin-top:4px;">
                                    <label style="width:120px; text-align:right; margin-right:4px; white-space:nowrap;">產品追溯系統串接碼</label>
                                    <input type="text" id="invi02-trace-code" style="width:280px;" value="">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 2. 價格標籤 (售價頁籤，點選「售價」標籤切換顯示) - 1:1 參考圖片 -->
                    <div id="invi02-subtab-price" style="display:none; padding:6px 14px; gap:24px; background:#ECE9D8; font-size:12px; box-sizing:border-box;">
                        <!-- Column 1: 進價與底價 -->
                        <div style="display:flex; flex-direction:column; gap:4px; min-width:240px;">
                            <div style="display:flex; align-items:center;">
                                <label style="display:inline-flex; align-items:center; gap:2px; width:52px; margin:0; cursor:pointer;"><input type="checkbox" id="invi02-tax-std-pur">含稅</label>
                                <label style="width:75px; text-align:right; margin-right:4px;">標準進價</label>
                                <input type="text" id="invi02-std-pur-price" style="width:90px; text-align:right;" value="0">
                            </div>
                            <div style="display:flex; align-items:center;">
                                <label style="display:inline-flex; align-items:center; gap:2px; width:52px; margin:0; cursor:pointer;"><input type="checkbox" id="invi02-tax-std-sale">含稅</label>
                                <label style="width:75px; text-align:right; margin-right:4px;">標準售價</label>
                                <input type="text" id="invi02-std-sale-price" style="width:90px; text-align:right;" value="0">
                            </div>
                            <div style="display:flex; align-items:center;">
                                <label style="display:inline-flex; align-items:center; gap:2px; width:52px; margin:0; cursor:pointer;"><input type="checkbox" id="invi02-tax-recent-pur">含稅</label>
                                <label style="width:75px; text-align:right; margin-right:4px;">最近進價</label>
                                <button type="button" class="lookup-icon-btn" style="width:16px; height:18px; padding:0; margin-right:2px; font-size:10px;">$</button>
                                <input type="text" id="invi02-recent-pur-price" style="width:72px; text-align:right;" value="0">
                            </div>
                            <div style="display:flex; align-items:center; padding-left:14px; font-size:11px; color:#333;">
                                <span>(本國幣別: NTD</span>
                                <input type="text" id="invi02-recent-pur-ntd" style="width:72px; text-align:right; margin-left:4px; margin-right:2px;" value="0">
                                <span>)</span>
                            </div>
                            <div style="display:flex; align-items:center;">
                                <label style="display:inline-flex; align-items:center; gap:2px; width:52px; margin:0; cursor:pointer;"><input type="checkbox" id="invi02-tax-retail">含稅</label>
                                <label style="width:75px; text-align:right; margin-right:4px;">零售價</label>
                                <input type="text" id="invi02-retail-price" style="width:90px; text-align:right;" value="0">
                            </div>
                            <div style="display:flex; align-items:center;">
                                <label style="display:inline-flex; align-items:center; gap:2px; width:52px; margin:0; cursor:pointer;"><input type="checkbox" id="invi02-tax-min-sale">含稅</label>
                                <label style="width:75px; text-align:right; margin-right:4px;">業務底價</label>
                                <input type="text" id="invi02-min-sale-price" style="width:90px; text-align:right;" value="0">
                            </div>
                        </div>

                        <!-- Column 2: 稅率類 -->
                        <div style="display:flex; flex-direction:column; gap:4px; min-width:140px; padding-top:2px;">
                            <div style="display:flex; align-items:center;">
                                <label style="width:65px; text-align:right; margin-right:4px;">關稅率</label>
                                <input type="text" id="invi02-customs-tax-rate" style="width:45px; text-align:right;" value="0">
                                <span style="margin-left:3px;">%</span>
                            </div>
                            <div style="display:flex; align-items:center;">
                                <label style="width:65px; text-align:right; margin-right:4px;">貨物稅率</label>
                                <input type="text" id="invi02-commodity-tax-rate" style="width:45px; text-align:right;" value="0">
                                <span style="margin-left:3px;">%</span>
                            </div>
                            <div style="display:flex; align-items:center; margin-top:24px;">
                                <label style="width:65px; text-align:right; margin-right:4px;">營業稅率</label>
                                <input type="text" id="invi02-business-tax-rate" style="width:45px; text-align:right;" value="">
                                <span style="margin-left:3px;">%</span>
                            </div>
                        </div>

                        <!-- Column 3: 售價定價一至六 -->
                        <div style="display:flex; flex-direction:column; gap:4px; min-width:240px;">
                            <div style="display:flex; align-items:center;">
                                <label style="display:inline-flex; align-items:center; gap:2px; width:52px; margin:0; cursor:pointer;"><input type="checkbox" id="invi02-tax-tier1">含稅</label>
                                <label style="width:75px; text-align:right; margin-right:4px;">售價定價一</label>
                                <input type="text" id="invi02-price-tier1" style="width:90px; text-align:right;" value="0">
                            </div>
                            <div style="display:flex; align-items:center;">
                                <label style="display:inline-flex; align-items:center; gap:2px; width:52px; margin:0; cursor:pointer;"><input type="checkbox" id="invi02-tax-tier2">含稅</label>
                                <label style="width:75px; text-align:right; margin-right:4px;">售價定價二</label>
                                <input type="text" id="invi02-price-tier2" style="width:90px; text-align:right;" value="0">
                            </div>
                            <div style="display:flex; align-items:center;">
                                <label style="display:inline-flex; align-items:center; gap:2px; width:52px; margin:0; cursor:pointer;"><input type="checkbox" id="invi02-tax-tier3">含稅</label>
                                <label style="width:75px; text-align:right; margin-right:4px;">售價定價三</label>
                                <input type="text" id="invi02-price-tier3" style="width:90px; text-align:right;" value="0">
                            </div>
                            <div style="display:flex; align-items:center;">
                                <label style="display:inline-flex; align-items:center; gap:2px; width:52px; margin:0; cursor:pointer;"><input type="checkbox" id="invi02-tax-tier4">含稅</label>
                                <label style="width:75px; text-align:right; margin-right:4px;">售價定價四</label>
                                <input type="text" id="invi02-price-tier4" style="width:90px; text-align:right;" value="0">
                            </div>
                            <div style="display:flex; align-items:center;">
                                <label style="display:inline-flex; align-items:center; gap:2px; width:52px; margin:0; cursor:pointer;"><input type="checkbox" id="invi02-tax-tier5">含稅</label>
                                <label style="width:75px; text-align:right; margin-right:4px;">售價定價五</label>
                                <input type="text" id="invi02-price-tier5" style="width:90px; text-align:right;" value="0">
                            </div>
                            <div style="display:flex; align-items:center;">
                                <label style="display:inline-flex; align-items:center; gap:2px; width:52px; margin:0; cursor:pointer;"><input type="checkbox" id="invi02-tax-tier6">含稅</label>
                                <label style="width:75px; text-align:right; margin-right:4px;">售價定價六</label>
                                <input type="text" id="invi02-price-tier6" style="width:90px; text-align:right;" value="0">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Lower Warehouse Table (1:1 參考圖片) -->
                <div class="erp-datagrid-container" id="invi02-wh-container" style="flex:1; overflow:auto; background:#FFF; border-top:1px solid #7F9DB9;">
                    <table class="erp-grid-table" style="width:100%; border-collapse:collapse; font-size:12px;" id="invi02-wh-table">
                        <thead>
                            <tr style="height:22px; background:linear-gradient(to bottom, #F9F9F9, #E4E4E4);">
                                <th style="width:24px; text-align:center; padding:0; border:1px solid #B0B0B0;">📋</th>
                                <th class="th-cyan" style="width:120px; text-align:left; padding:2px 6px; border:1px solid #B0B0B0;">庫別</th>
                                <th style="width:180px; text-align:left; padding:2px 6px; border:1px solid #B0B0B0;">庫別名稱</th>
                                <th style="width:120px; text-align:left; padding:2px 6px; border:1px solid #B0B0B0;">庫性</th>
                                <th style="width:100px; text-align:left; padding:2px 6px; border:1px solid #B0B0B0;">廠別代號</th>
                                <th style="width:160px; text-align:left; padding:2px 6px; border:1px solid #B0B0B0;">廠別名稱</th>
                                <th style="width:40px; text-align:center; border:1px solid #B0B0B0;"></th>
                            </tr>
                        </thead>
                        <tbody id="invi02-wh-tbody">
                            <!-- Warehouse rows -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Browse View -->
            <div id="invi02-view-browse" style="display:none; flex-direction:column; flex:1; padding:4px; background:#ECE9D8; overflow:hidden;">
                <div class="erp-datagrid-container" style="flex:1; overflow:auto; background:#FFF; border:1px solid #7F9DB9;">
                    <table class="erp-grid-table" style="width:100%; border-collapse:collapse; font-size:12px;">
                        <thead>
                            <tr style="height:22px; background:linear-gradient(to bottom, #F9F9F9, #E4E4E4);">
                                <th style="width:24px; text-align:center;"></th>
                                <th class="th-cyan" style="width:110px; text-align:left; padding:2px 6px; border:1px solid #B0B0B0;">品號</th>
                                <th style="width:180px; text-align:left; padding:2px 6px; border:1px solid #B0B0B0;">品名</th>
                                <th style="width:160px; text-align:left; padding:2px 6px; border:1px solid #B0B0B0;">規格</th>
                                <th style="width:60px; text-align:center; padding:2px 6px; border:1px solid #B0B0B0;">單位</th>
                                <th style="width:90px; text-align:right; padding:2px 6px; border:1px solid #B0B0B0;">標準售價</th>
                                <th style="width:90px; text-align:right; padding:2px 6px; border:1px solid #B0B0B0;">標準進價</th>
                                <th style="width:90px; text-align:right; padding:2px 6px; border:1px solid #B0B0B0;">零售價</th>
                                <th style="width:90px; text-align:right; padding:2px 6px; border:1px solid #B0B0B0;">現有庫存</th>
                            </tr>
                        </thead>
                        <tbody id="invi02-browse-tbody">
                            <tr><td colspan="9" style="text-align:center; padding:20px; color:#888;">載入品號資料中...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="erp-window-statusbar" style="height:20px; background:#ECE9D8; border-top:1px solid #D4D0C8; display:flex; align-items:center; padding:0 6px; font-size:11px;">
                <span class="status-cell">瀏覽</span>
                <span class="status-cell" id="invi02-status-wh-count">單身資料筆數: 0</span>
                <span class="status-cell" id="invi02-status-msg" style="margin-left:16px;">資料空白</span>
                <span class="status-cell" style="margin-left:auto;">127.0.0.1 - 211</span>
            </div>
        `;

        App.openWindow(winId, title, html, 960, 620, (winEl) => {
            // Header elements
            const fNo = winEl.querySelector('#invi02-no');
            const fVersion = winEl.querySelector('#invi02-version');
            const fUnit = winEl.querySelector('#invi02-unit');
            const fStockQty = winEl.querySelector('#invi02-stock-qty');
            const fName = winEl.querySelector('#invi02-name');
            const fSmallUnit = winEl.querySelector('#invi02-small-unit');
            const fStockAmt = winEl.querySelector('#invi02-stock-amt');
            const fSpec = winEl.querySelector('#invi02-spec');
            const fFixedWeight = winEl.querySelector('#invi02-fixed-weight');
            const fUnitCost = winEl.querySelector('#invi02-unit-cost');
            const fBarcode = winEl.querySelector('#invi02-barcode');
            const fSize = winEl.querySelector('#invi02-size');
            const fPackUnit = winEl.querySelector('#invi02-pack-unit');
            const fPackQty = winEl.querySelector('#invi02-pack-qty');
            const fApprovalDate = winEl.querySelector('#invi02-approval-date');

            // 價格標籤 (售價頁籤) elements
            const fTaxStdPur = winEl.querySelector('#invi02-tax-std-pur');
            const fStdPurPrice = winEl.querySelector('#invi02-std-pur-price');
            const fTaxStdSale = winEl.querySelector('#invi02-tax-std-sale');
            const fStdSalePrice = winEl.querySelector('#invi02-std-sale-price');
            const fTaxRecentPur = winEl.querySelector('#invi02-tax-recent-pur');
            const fRecentPurPrice = winEl.querySelector('#invi02-recent-pur-price');
            const fRecentPurNtd = winEl.querySelector('#invi02-recent-pur-ntd');
            const fTaxRetail = winEl.querySelector('#invi02-tax-retail');
            const fRetailPrice = winEl.querySelector('#invi02-retail-price');
            const fTaxMinSale = winEl.querySelector('#invi02-tax-min-sale');
            const fMinSalePrice = winEl.querySelector('#invi02-min-sale-price');

            const fCustomsTaxRate = winEl.querySelector('#invi02-customs-tax-rate');
            const fCommodityTaxRate = winEl.querySelector('#invi02-commodity-tax-rate');
            const fBusinessTaxRate = winEl.querySelector('#invi02-business-tax-rate');

            const fTaxTier1 = winEl.querySelector('#invi02-tax-tier1');
            const fPriceTier1 = winEl.querySelector('#invi02-price-tier1');
            const fTaxTier2 = winEl.querySelector('#invi02-tax-tier2');
            const fPriceTier2 = winEl.querySelector('#invi02-price-tier2');
            const fTaxTier3 = winEl.querySelector('#invi02-tax-tier3');
            const fPriceTier3 = winEl.querySelector('#invi02-price-tier3');
            const fTaxTier4 = winEl.querySelector('#invi02-tax-tier4');
            const fPriceTier4 = winEl.querySelector('#invi02-price-tier4');
            const fTaxTier5 = winEl.querySelector('#invi02-tax-tier5');
            const fPriceTier5 = winEl.querySelector('#invi02-price-tier5');
            const fTaxTier6 = winEl.querySelector('#invi02-tax-tier6');
            const fPriceTier6 = winEl.querySelector('#invi02-price-tier6');

            // 基本資料1 elements (1:1 參考圖片5)
            const fEditSpec = winEl.querySelector('#invi02-chk-edit-spec');
            const fCatNo = winEl.querySelector('#invi02-cat-no');
            const fCatDesc = winEl.querySelector('#invi02-cat-desc');
            const fMatNo = winEl.querySelector('#invi02-mat-no');
            const fSalesDept = winEl.querySelector('#invi02-sales-dept');
            const fProdCtrl = winEl.querySelector('#invi02-prod-ctrl');
            const fMainWh = winEl.querySelector('#invi02-main-wh');
            const fIssueWh = winEl.querySelector('#invi02-issue-wh');
            const fProdLine = winEl.querySelector('#invi02-prod-line');
            const fPlannerNo = winEl.querySelector('#invi02-planner-no');
            const fPlannerDesc = winEl.querySelector('#invi02-planner-desc');
            const fEinvoice = winEl.querySelector('#invi02-chk-einvoice');

            const fPurUnit = winEl.querySelector('#invi02-pur-unit');
            const fSaleUnit = winEl.querySelector('#invi02-sale-unit');
            const fDocCode = winEl.querySelector('#invi02-doc-code');
            const fTaxTariff = winEl.querySelector('#invi02-tax-tariff');
            const fWarrantyRatio = winEl.querySelector('#invi02-warranty-ratio');
            const fWarrantyMonths = winEl.querySelector('#invi02-warranty-months');
            const fTraceCode = winEl.querySelector('#invi02-trace-code');

            // Warehouse & status
            const whTbody = winEl.querySelector('#invi02-wh-tbody');
            const statusMsg = winEl.querySelector('#invi02-status-msg');
            const statusWhCount = winEl.querySelector('#invi02-status-wh-count');

            const tabDetail = winEl.querySelector('#invi02-tab-detail');
            const tabBrowse = winEl.querySelector('#invi02-tab-browse');
            const viewDetail = winEl.querySelector('#invi02-view-detail');
            const viewBrowse = winEl.querySelector('#invi02-view-browse');

            let isDirty = false;
            let itemList = [];
            let isConfirmed = false;

            winEl.addEventListener('input', (e) => {
                if (!e.target.classList.contains('erp-input-readonly')) {
                    isDirty = true;
                }
            });

            // Sub-tabs switcher (基本資料與價格/售價切換，底用空白處顏色，點到變深藍，其餘灰色)
            const selectSubtab = (tabKey) => {
                winEl.querySelectorAll('.invi02-subtab-btn').forEach(b => {
                    b.classList.remove('active');
                    b.style.background = '';
                    b.style.color = '';
                    b.style.fontWeight = '';
                });
                const targetBtn = winEl.querySelector(`.invi02-subtab-btn[data-tab="${tabKey}"]`);
                if (targetBtn) {
                    targetBtn.classList.add('active');
                }

                const pricePanel = winEl.querySelector('#invi02-subtab-price');
                const basic1Panel = winEl.querySelector('#invi02-subtab-basic1');
                if (tabKey === 'price') {
                    if (pricePanel) pricePanel.style.display = 'flex';
                    if (basic1Panel) basic1Panel.style.display = 'none';
                } else if (tabKey === 'basic1') {
                    if (pricePanel) pricePanel.style.display = 'none';
                    if (basic1Panel) basic1Panel.style.display = 'block';
                } else {
                    if (pricePanel) pricePanel.style.display = 'none';
                    if (basic1Panel) basic1Panel.style.display = 'block';
                    Modules.toast(`「${targetBtn ? targetBtn.textContent : tabKey}」頁籤目前保留基本資料檢視。`, 'info');
                }
            };

            winEl.querySelectorAll('.invi02-subtab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const tabKey = btn.getAttribute('data-tab');
                    selectSubtab(tabKey);
                });
            });

            const setInviMode = (mode, itemNo = '') => {
                const whContainer = winEl.querySelector('#invi02-wh-container');
                const isEditable = (mode === 'add' || mode === 'edit');
                Modules.setFormReadOnly(winEl, !isEditable);
                if (whContainer) {
                    if (isEditable) {
                        whContainer.classList.remove('grid-readonly');
                    } else {
                        whContainer.classList.add('grid-readonly');
                    }
                }
                if (statusMsg) {
                    if (mode === 'add') {
                        statusMsg.textContent = '新增中...';
                    } else if (mode === 'edit') {
                        statusMsg.textContent = itemNo ? `修改中... [${itemNo}]` : '修改中...';
                    } else {
                        statusMsg.textContent = itemNo ? `瀏覽: [${itemNo}]` : '就緒 (請點選「新增」或「查詢」)';
                    }
                }
            };

            // Switch between 詳細欄位 and 資料瀏覽
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

            // Warehouse rows manager
            const updateWhCount = () => {
                const rows = whTbody.querySelectorAll('tr[data-wh-row]');
                statusWhCount.textContent = `單身資料筆數: ${rows.length}`;
            };

            const addWhRow = (data = null) => {
                const tr = document.createElement('tr');
                tr.setAttribute('data-wh-row', '1');
                tr.style.height = '20px';
                tr.innerHTML = `
                    <td style="text-align:center; padding:0; border:1px solid #D0D0D0;">▶</td>
                    <td style="border:1px solid #D0D0D0; padding:1px 2px;">
                        <input type="text" class="invi-wh-no" style="width:80px; font-weight:bold;" value="${data?.wh_no || ''}">
                        <button type="button" class="lookup-icon-btn invi-wh-lookup" style="width:16px; height:18px; padding:0; font-size:10px;">🔍</button>
                    </td>
                    <td style="border:1px solid #D0D0D0; padding:1px 4px;"><input type="text" class="invi-wh-name" readonly style="width:100%; border:none; background:transparent;" value="${data?.wh_name || ''}"></td>
                    <td style="border:1px solid #D0D0D0; padding:1px 4px;"><input type="text" class="invi-wh-prop" readonly style="width:100%; border:none; background:transparent;" value="${data?.wh_prop || ''}"></td>
                    <td style="border:1px solid #D0D0D0; padding:1px 4px;"><input type="text" class="invi-wh-plant" readonly style="width:100%; border:none; background:transparent;" value="${data?.plant || ''}"></td>
                    <td style="border:1px solid #D0D0D0; padding:1px 4px;"><input type="text" class="invi-wh-plantname" readonly style="width:100%; border:none; background:transparent;" value="${data?.plant_name || ''}"></td>
                    <td style="border:1px solid #D0D0D0; text-align:center; padding:0;">
                        <button type="button" class="invi-wh-del" style="background:none; border:none; cursor:pointer; color:#888; font-size:11px;" title="刪除列">✕</button>
                    </td>
                `;

                const noInp = tr.querySelector('.invi-wh-no');
                const nameInp = tr.querySelector('.invi-wh-name');
                const propInp = tr.querySelector('.invi-wh-prop');
                const plantInp = tr.querySelector('.invi-wh-plant');
                const plantNameInp = tr.querySelector('.invi-wh-plantname');
                const btnLookup = tr.querySelector('.invi-wh-lookup');
                const btnDel = tr.querySelector('.invi-wh-del');

                const applyWh = (w) => {
                    noInp.value = w.wh_no;
                    nameInp.value = w.wh_name;
                    propInp.value = w.wh_prop || '1:存貨倉';
                    plantInp.value = w.plant || 'TP01';
                    plantNameInp.value = (w.plant === 'TP01' || !w.plant) ? '製造一廠' : '製造二廠';
                    isDirty = true;
                    updateWhCount();
                };

                btnLookup.addEventListener('click', () => {
                    Modules.openLookup('warehouse', applyWh);
                });
                noInp.addEventListener('dblclick', () => {
                    Modules.openLookup('warehouse', applyWh);
                });
                noInp.addEventListener('change', async () => {
                    const code = noInp.value.trim().toUpperCase();
                    noInp.value = code;
                    if (code) {
                        const res = await ERP_API.get('get_warehouses');
                        if (res.success && res.data) {
                            const found = res.data.find(x => x.wh_no.toUpperCase() === code);
                            if (found) {
                                applyWh(found);
                            } else {
                                applyWh({ wh_no: code, wh_name: '成品倉一', wh_prop: '1:存貨倉', plant: 'TP01' });
                            }
                        }
                    }
                });

                // Tab on last cell -> create next row
                noInp.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab' && !e.shiftKey) {
                        const allRows = whTbody.querySelectorAll('tr[data-wh-row]');
                        if (tr === allRows[allRows.length - 1] && noInp.value.trim()) {
                            setTimeout(() => {
                                const newR = addWhRow();
                                newR.querySelector('.invi-wh-no')?.focus();
                            }, 50);
                        }
                    }
                });

                btnDel.addEventListener('click', () => {
                    tr.remove();
                    isDirty = true;
                    updateWhCount();
                });

                whTbody.appendChild(tr);
                updateWhCount();
                return tr;
            };

            const getWarehouses = () => {
                const list = [];
                whTbody.querySelectorAll('tr[data-wh-row]').forEach(tr => {
                    const no = tr.querySelector('.invi-wh-no')?.value.trim();
                    if (no) {
                        list.push({
                            wh_no: no,
                            wh_name: tr.querySelector('.invi-wh-name')?.value.trim() || '',
                            wh_prop: tr.querySelector('.invi-wh-prop')?.value.trim() || '1:存貨倉',
                            plant: tr.querySelector('.invi-wh-plant')?.value.trim() || 'TP01',
                            plant_name: tr.querySelector('.invi-wh-plantname')?.value.trim() || '製造一廠'
                        });
                    }
                });
                return list;
            };

            const fillForm = (item) => {
                fNo.value = item.item_no || '';
                fVersion.value = item.version || '';
                fUnit.value = item.unit || '';
                fSmallUnit.value = item.small_unit || '';
                fName.value = item.item_name || '';
                fSpec.value = item.item_spec || '';
                fBarcode.value = item.barcode || '';
                fSize.value = item.item_size || '';
                fPackUnit.value = item.pack_unit || '';
                fFixedWeight.checked = !!item.fixed_weight;
                fPackQty.value = item.pack_qty || 0;
                fStockQty.value = Math.round(item.stock_qty || 0);
                fStockAmt.value = Math.round(item.stock_amount || 0);
                fUnitCost.value = Math.round(item.unit_cost || 0);
                fApprovalDate.value = item.approval_date || '';

                // 價格標籤 (售價頁籤)
                fTaxStdPur.checked = !!item.tax_std_pur;
                fStdPurPrice.value = Math.round(item.std_purchase_price || 0);
                fTaxStdSale.checked = !!item.tax_std_sale;
                fStdSalePrice.value = Math.round(item.std_price || 0);
                fTaxRecentPur.checked = !!item.tax_recent_pur;
                fRecentPurPrice.value = Math.round(item.recent_purchase_price || 0);
                fRecentPurNtd.value = Math.round(item.recent_pur_ntd || 0);
                fTaxRetail.checked = !!item.tax_retail;
                fRetailPrice.value = Math.round(item.retail_price || 0);
                fTaxMinSale.checked = !!item.tax_min_sale;
                fMinSalePrice.value = Math.round(item.min_sale_price || 0);

                fCustomsTaxRate.value = item.customs_tax_rate || 0;
                fCommodityTaxRate.value = item.commodity_tax_rate || 0;
                fBusinessTaxRate.value = (item.business_tax_rate !== undefined && item.business_tax_rate !== null) ? item.business_tax_rate : 5;

                fTaxTier1.checked = !!item.tax_tier1;
                fPriceTier1.value = Math.round(item.price_tier1 || 0);
                fTaxTier2.checked = !!item.tax_tier2;
                fPriceTier2.value = Math.round(item.price_tier2 || 0);
                fTaxTier3.checked = !!item.tax_tier3;
                fPriceTier3.value = Math.round(item.price_tier3 || 0);
                fTaxTier4.checked = !!item.tax_tier4;
                fPriceTier4.value = Math.round(item.price_tier4 || 0);
                fTaxTier5.checked = !!item.tax_tier5;
                fPriceTier5.value = Math.round(item.price_tier5 || 0);
                fTaxTier6.checked = !!item.tax_tier6;
                fPriceTier6.value = Math.round(item.price_tier6 || 0);

                // 基本資料 (1:1 參考圖片5)
                if (fEditSpec) fEditSpec.checked = !!item.can_edit_spec;
                const catNames = { '01': '原料', '02': '物料', '03': '半成品', '04': '成品', '05': '商品' };
                fCatNo.value = item.accounting_code || item.item_code || '01';
                fCatDesc.textContent = item.category_name || catNames[fCatNo.value] || '原料';
                if (fMatNo) fMatNo.value = item.mat_code || '';
                if (fSalesDept) fSalesDept.value = item.sales_dept || '';
                if (fProdCtrl) fProdCtrl.value = item.prod_ctrl || '';
                if (fMainWh) fMainWh.value = item.main_warehouse || '';
                if (fIssueWh) fIssueWh.value = item.issue_warehouse || '';
                if (fProdLine) fProdLine.value = item.prod_line || '';
                fPlannerNo.value = item.planner || '';
                fPlannerDesc.textContent = item.planner_name || '';
                if (fEinvoice) fEinvoice.checked = !!item.einvoice_trace;

                fPurUnit.value = item.pur_unit || item.unit || '';
                fSaleUnit.value = item.sale_unit || item.unit || '';
                if (fDocCode) fDocCode.value = item.doc_code || '';
                if (fTaxTariff) fTaxTariff.value = item.tax_tariff || '';
                if (fWarrantyRatio) fWarrantyRatio.value = item.warranty_ratio || 0;
                fWarrantyMonths.value = item.warranty_months || 0;
                if (fTraceCode) fTraceCode.value = item.trace_code || '';

                // 庫別表格
                whTbody.innerHTML = '';
                if (item.warehouses && item.warehouses.length > 0) {
                    item.warehouses.forEach(w => addWhRow(w));
                } else if (item.main_warehouse) {
                    addWhRow({
                        wh_no: item.main_warehouse,
                        wh_name: item.main_warehouse === 'P003' ? '成品倉一' : '原料倉一',
                        wh_prop: '1:存貨倉',
                        plant: 'TP01',
                        plant_name: '製造一廠'
                    });
                } else {
                    addWhRow();
                }

                isConfirmed = true;
                Modules.updateAuditButtons(winEl, true, 'invi02');
                setInviMode('browse', item.item_no);
                isDirty = false;
            };

            const clearForm = async (autoGen = false) => {
                fNo.value = '';
                fVersion.value = '';
                fUnit.value = '';
                fSmallUnit.value = '';
                fName.value = '';
                fSpec.value = '';
                fBarcode.value = '';
                fSize.value = '';
                fPackUnit.value = '';
                fFixedWeight.checked = false;
                fPackQty.value = 0;
                fStockQty.value = 0;
                fStockAmt.value = 0;
                fUnitCost.value = 0;
                fApprovalDate.value = '';

                // 價格標籤清空
                fTaxStdPur.checked = false;
                fStdPurPrice.value = 0;
                fTaxStdSale.checked = false;
                fStdSalePrice.value = 0;
                fTaxRecentPur.checked = false;
                fRecentPurPrice.value = 0;
                fRecentPurNtd.value = 0;
                fTaxRetail.checked = false;
                fRetailPrice.value = 0;
                fTaxMinSale.checked = false;
                fMinSalePrice.value = 0;

                fCustomsTaxRate.value = 0;
                fCommodityTaxRate.value = 0;
                fBusinessTaxRate.value = 5;

                fTaxTier1.checked = false;
                fPriceTier1.value = 0;
                fTaxTier2.checked = false;
                fPriceTier2.value = 0;
                fTaxTier3.checked = false;
                fPriceTier3.value = 0;
                fTaxTier4.checked = false;
                fPriceTier4.value = 0;
                fTaxTier5.checked = false;
                fPriceTier5.value = 0;
                fTaxTier6.checked = false;
                fPriceTier6.value = 0;

                // 基本資料清空 (1:1 參考圖片5)
                if (fEditSpec) fEditSpec.checked = false;
                fCatNo.value = '01';
                fCatDesc.textContent = '原料';
                if (fMatNo) fMatNo.value = '';
                if (fSalesDept) fSalesDept.value = '';
                if (fProdCtrl) fProdCtrl.value = '';
                if (fMainWh) fMainWh.value = '';
                if (fIssueWh) fIssueWh.value = '';
                if (fProdLine) fProdLine.value = '';
                fPlannerNo.value = '';
                fPlannerDesc.textContent = '';
                if (fEinvoice) fEinvoice.checked = false;

                fPurUnit.value = '';
                fSaleUnit.value = '';
                if (fDocCode) fDocCode.value = '';
                if (fTaxTariff) fTaxTariff.value = '';
                if (fWarrantyRatio) fWarrantyRatio.value = 0;
                fWarrantyMonths.value = 0;
                if (fTraceCode) fTraceCode.value = '';

                // 庫別重置：預設一列空白可直接輸入
                whTbody.innerHTML = '';
                addWhRow();

                isConfirmed = false;
                Modules.updateAuditButtons(winEl, false, 'invi02');
                selectSubtab('basic1');

                if (autoGen) {
                    const res = await ERP_API.get('get_next_item_no');
                    if (res.success && res.next_no) {
                        fNo.value = res.next_no;
                    }
                }
                setInviMode('add', fNo.value);
                isDirty = false;
                fNo.focus();
            };

            const resetItemBlank = () => {
                fNo.value = '';
                fVersion.value = '';
                fUnit.value = '';
                fSmallUnit.value = '';
                fName.value = '';
                fSpec.value = '';
                fBarcode.value = '';
                fSize.value = '';
                fPackUnit.value = '';
                fFixedWeight.checked = false;
                fPackQty.value = '';
                fStockQty.value = '';
                fStockAmt.value = '';
                fUnitCost.value = '';
                fApprovalDate.value = '';

                // 價格標籤清空
                fTaxStdPur.checked = false;
                fStdPurPrice.value = '';
                fTaxStdSale.checked = false;
                fStdSalePrice.value = '';
                fTaxRecentPur.checked = false;
                fRecentPurPrice.value = '';
                fRecentPurNtd.value = '';
                fTaxRetail.checked = false;
                fRetailPrice.value = '';
                fTaxMinSale.checked = false;
                fMinSalePrice.value = '';

                fCustomsTaxRate.value = '';
                fCommodityTaxRate.value = '';
                fBusinessTaxRate.value = '';

                fTaxTier1.checked = false; fPriceTier1.value = '';
                fTaxTier2.checked = false; fPriceTier2.value = '';
                fTaxTier3.checked = false; fPriceTier3.value = '';
                fTaxTier4.checked = false; fPriceTier4.value = '';
                fTaxTier5.checked = false; fPriceTier5.value = '';
                fTaxTier6.checked = false; fPriceTier6.value = '';

                // 基本資料清空
                if (fEditSpec) fEditSpec.checked = false;
                fCatNo.value = '';
                fCatDesc.textContent = '';
                if (fMatNo) fMatNo.value = '';
                if (fSalesDept) fSalesDept.value = '';
                if (fProdCtrl) fProdCtrl.value = '';
                if (fMainWh) fMainWh.value = '';
                if (fIssueWh) fIssueWh.value = '';
                if (fProdLine) fProdLine.value = '';
                fPlannerNo.value = '';
                fPlannerDesc.textContent = '';
                if (fEinvoice) fEinvoice.checked = false;

                fPurUnit.value = '';
                fSaleUnit.value = '';
                if (fDocCode) fDocCode.value = '';
                if (fTaxTariff) fTaxTariff.value = '';
                if (fWarrantyRatio) fWarrantyRatio.value = '';
                fWarrantyMonths.value = '';
                if (fTraceCode) fTraceCode.value = '';

                whTbody.innerHTML = '';
                updateWhCount();
                isConfirmed = false;
                Modules.updateAuditButtons(winEl, false, 'invi02');
                selectSubtab('basic1');
                setInviMode('browse', '');
                isDirty = false;
            };

            const checkDirtyBeforeAction = (callback) => {
                if (isDirty) {
                    const answer = confirm("資料尚未儲存，是否要儲存目前的品號資料？\n\n點選【確定】：進行儲存\n點選【取消】：直接清除放棄變更");
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
                const tbody = winEl.querySelector('#invi02-browse-tbody');
                const res = await ERP_API.get('get_items');
                if (res.success) {
                    itemList = res.data || [];
                    if (itemList.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:20px; color:#888;">目前尚無品號資料</td></tr>';
                        return;
                    }
                    let rows = '';
                    itemList.forEach(it => {
                        rows += `
                            <tr data-no="${it.item_no}" style="cursor:pointer; height:20px;">
                                <td style="text-align:center;">▶</td>
                                <td style="font-weight:bold; color:#003366;">${it.item_no}</td>
                                <td>${it.item_name || ''}</td>
                                <td>${it.item_spec || ''}</td>
                                <td style="text-align:center;">${it.unit || ''}</td>
                                <td style="text-align:right;">${Math.round(it.std_price || 0).toLocaleString()}</td>
                                <td style="text-align:right;">${Math.round(it.std_purchase_price || 0).toLocaleString()}</td>
                                <td style="text-align:right;">${Math.round(it.retail_price || 0).toLocaleString()}</td>
                                <td style="text-align:right; font-weight:bold;">${Math.round(it.stock_qty || 0).toLocaleString()}</td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = rows;

                    tbody.querySelectorAll('tr[data-no]').forEach(tr => {
                        tr.addEventListener('click', () => {
                            checkDirtyBeforeAction(() => {
                                const no = tr.getAttribute('data-no');
                                const item = itemList.find(x => x.item_no === no);
                                if (item) {
                                    fillForm(item);
                                    switchTab('detail');
                                }
                            });
                        });
                    });
                }
            };

            const navItem = async (dir) => {
                const cur = fNo.value.trim();
                const res = await ERP_API.get('nav_item', { dir, current: cur });
                if (res.success && res.data) {
                    fillForm(res.data);
                } else {
                    alert('已無' + (dir === 'first' ? '第一筆' : dir === 'last' ? '最後一筆' : dir === 'prev' ? '上一筆' : '下一筆') + '品號資料');
                }
            };

            const bindNav = (btnId, dir) => {
                const btn = winEl.querySelector(btnId);
                if (btn) btn.addEventListener('click', () => checkDirtyBeforeAction(() => navItem(dir)));
            };
            bindNav('#invi02-tb-first', 'first');
            bindNav('#invi02-tb-prev', 'prev');
            bindNav('#invi02-tb-next', 'next');
            bindNav('#invi02-tb-last', 'last');

            const doSave = async () => {
                const iNo = fNo.value.trim();
                if (!iNo) {
                    alert('【必填檢查】請輸入品號！');
                    fNo.focus();
                    return false;
                }
                const whs = getWarehouses();
                const payload = {
                    item_no: iNo,
                    item_name: fName.value.trim(),
                    item_spec: fSpec.value.trim(),
                    version: fVersion.value.trim(),
                    unit: fUnit.value.trim(),
                    small_unit: fSmallUnit.value.trim(),
                    pack_unit: fPackUnit.value.trim(),
                    barcode: fBarcode.value.trim(),
                    item_size: fSize.value.trim(),
                    fixed_weight: fFixedWeight.checked ? 1 : 0,
                    pack_qty: parseFloat(fPackQty.value) || 0,
                    approval_date: fApprovalDate.value.trim(),

                    // 價格標籤 (售價頁籤) 欄位
                    tax_std_pur: fTaxStdPur.checked ? 1 : 0,
                    std_purchase_price: parseFloat(fStdPurPrice.value) || 0,
                    tax_std_sale: fTaxStdSale.checked ? 1 : 0,
                    std_price: parseFloat(fStdSalePrice.value) || 0,
                    tax_recent_pur: fTaxRecentPur.checked ? 1 : 0,
                    recent_purchase_price: parseFloat(fRecentPurPrice.value) || 0,
                    recent_pur_ntd: parseFloat(fRecentPurNtd.value) || 0,
                    tax_retail: fTaxRetail.checked ? 1 : 0,
                    retail_price: parseFloat(fRetailPrice.value) || 0,
                    tax_min_sale: fTaxMinSale.checked ? 1 : 0,
                    min_sale_price: parseFloat(fMinSalePrice.value) || 0,

                    customs_tax_rate: parseFloat(fCustomsTaxRate.value) || 0,
                    commodity_tax_rate: parseFloat(fCommodityTaxRate.value) || 0,
                    business_tax_rate: parseFloat(fBusinessTaxRate.value) || 5,

                    tax_tier1: fTaxTier1.checked ? 1 : 0,
                    price_tier1: parseFloat(fPriceTier1.value) || 0,
                    tax_tier2: fTaxTier2.checked ? 1 : 0,
                    price_tier2: parseFloat(fPriceTier2.value) || 0,
                    tax_tier3: fTaxTier3.checked ? 1 : 0,
                    price_tier3: parseFloat(fPriceTier3.value) || 0,
                    tax_tier4: fTaxTier4.checked ? 1 : 0,
                    price_tier4: parseFloat(fPriceTier4.value) || 0,
                    tax_tier5: fTaxTier5.checked ? 1 : 0,
                    price_tier5: parseFloat(fPriceTier5.value) || 0,
                    tax_tier6: fTaxTier6.checked ? 1 : 0,
                    price_tier6: parseFloat(fPriceTier6.value) || 0,

                    // 基本資料 (1:1 參考圖片5)
                    can_edit_spec: fEditSpec?.checked ? 1 : 0,
                    item_code: fCatNo.value.trim() || '01',
                    accounting_code: fCatNo.value.trim() || '01',
                    mat_code: fMatNo?.value.trim() || '',
                    sales_dept: fSalesDept?.value.trim() || '',
                    prod_ctrl: fProdCtrl?.value.trim() || '',
                    main_warehouse: fMainWh?.value.trim() || whs[0]?.wh_no || '',
                    issue_warehouse: fIssueWh?.value.trim() || '',
                    prod_line: fProdLine?.value.trim() || '',
                    planner: fPlannerNo.value.trim(),
                    einvoice_trace: fEinvoice?.checked ? 1 : 0,

                    pur_unit: fPurUnit.value.trim() || '',
                    sale_unit: fSaleUnit.value.trim() || '',
                    doc_code: fDocCode?.value.trim() || '',
                    tax_tariff: fTaxTariff?.value.trim() || '',
                    warranty_ratio: parseFloat(fWarrantyRatio?.value) || 0,
                    warranty_months: parseInt(fWarrantyMonths.value) || 0,
                    trace_code: fTraceCode?.value.trim() || '',
                    warehouses: whs
                };

                const res = await ERP_API.post('save_item', payload);
                if (res.success) {
                    isDirty = false;
                    setInviMode('browse', iNo);
                    Modules.toast(`品號 [${iNo}] 價格與基本資料儲存成功！`, 'success');
                    return true;
                } else {
                    Modules.toast('儲存失敗: ' + (res.error || '不明錯誤'), 'error');
                    return false;
                }
            };

            winEl.querySelector('#invi02-lookup-item').addEventListener('click', () => {
                checkDirtyBeforeAction(() => Modules.openLookup('item', (it) => {
                    fillForm(it);
                    switchTab('detail');
                }));
            });
            winEl.querySelector('#invi02-tb-query').addEventListener('click', () => {
                checkDirtyBeforeAction(() => Modules.openLookup('item', (it) => {
                    fillForm(it);
                    switchTab('detail');
                }));
            });

            const catBtn = winEl.querySelector('#invi02-lookup-cat');
            if (catBtn) {
                catBtn.addEventListener('click', () => {
                    Modules.openLookup('item_category', (cat) => {
                        fCatNo.value = cat.code;
                        fCatDesc.textContent = cat.name;
                        isDirty = true;
                    });
                });
            }
            if (fCatNo) {
                fCatNo.addEventListener('dblclick', () => {
                    Modules.openLookup('item_category', (cat) => {
                        fCatNo.value = cat.code;
                        fCatDesc.textContent = cat.name;
                        isDirty = true;
                    });
                });
                fCatNo.addEventListener('input', () => {
                    const catMap = { '01': '原料', '02': '物料', '03': '半成品', '04': '成品', '05': '商品' };
                    fCatDesc.textContent = catMap[fCatNo.value.trim()] || '';
                });
            }

            const plannerBtn = winEl.querySelector('#invi02-lookup-planner');
            if (plannerBtn) {
                plannerBtn.addEventListener('click', () => {
                    Modules.openLookup('personnel', (p) => {
                        fPlannerNo.value = p.emp_no || p.code;
                        fPlannerDesc.textContent = p.emp_name || p.name;
                        isDirty = true;
                    });
                });
            }

            const bindLookup = (btnId, type, cb) => {
                const btn = winEl.querySelector(btnId);
                if (btn) btn.addEventListener('click', () => Modules.openLookup(type, cb));
            };
            bindLookup('#invi02-lookup-unit', 'unit', (u) => { if (fUnit) fUnit.value = u.unit_no || u.code; isDirty = true; });
            bindLookup('#invi02-lookup-smallunit', 'unit', (u) => { if (fSmallUnit) fSmallUnit.value = u.unit_no || u.code; isDirty = true; });
            bindLookup('#invi02-lookup-packunit', 'unit', (u) => { if (fPackUnit) fPackUnit.value = u.unit_no || u.code; isDirty = true; });
            bindLookup('#invi02-lookup-purunit', 'unit', (u) => { if (fPurUnit) fPurUnit.value = u.unit_no || u.code; isDirty = true; });
            bindLookup('#invi02-lookup-saleunit', 'unit', (u) => { if (fSaleUnit) fSaleUnit.value = u.unit_no || u.code; isDirty = true; });

            const bindUnitDblClick = (inp) => {
                if (inp) inp.addEventListener('dblclick', () => {
                    Modules.openLookup('unit', (u) => { inp.value = u.unit_no || u.code; isDirty = true; });
                });
            };
            bindUnitDblClick(fUnit);
            bindUnitDblClick(fSmallUnit);
            bindUnitDblClick(fPackUnit);
            bindUnitDblClick(fPurUnit);
            bindUnitDblClick(fSaleUnit);

            bindLookup('#invi02-lookup-mainwh', 'warehouse', (w) => { if (fMainWh) fMainWh.value = w.wh_no; isDirty = true; });
            bindLookup('#invi02-lookup-issuewh', 'warehouse', (w) => { if (fIssueWh) fIssueWh.value = w.wh_no; isDirty = true; });
            if (fMainWh) fMainWh.addEventListener('dblclick', () => Modules.openLookup('warehouse', (w) => { fMainWh.value = w.wh_no; isDirty = true; }));
            if (fIssueWh) fIssueWh.addEventListener('dblclick', () => Modules.openLookup('warehouse', (w) => { fIssueWh.value = w.wh_no; isDirty = true; }));

            bindLookup('#invi02-lookup-sales', 'department', (d) => { if (fSalesDept) fSalesDept.value = d.dept_no || d.code; isDirty = true; });
            bindLookup('#invi02-lookup-prodctrl', 'department', (d) => { if (fProdCtrl) fProdCtrl.value = d.dept_no || d.code; isDirty = true; });
            bindLookup('#invi02-lookup-prodline', 'department', (d) => { if (fProdLine) fProdLine.value = d.dept_no || d.code; isDirty = true; });
            bindLookup('#invi02-lookup-mat', 'item', (it) => { if (fMatNo) fMatNo.value = it.item_no; isDirty = true; });
            bindLookup('#invi02-lookup-doccode', 'item', (it) => { if (fDocCode) fDocCode.value = it.item_no; isDirty = true; });
            bindLookup('#invi02-lookup-taxtariff', 'item', (it) => { if (fTaxTariff) fTaxTariff.value = it.item_no; isDirty = true; });

            winEl.querySelector('#invi02-tb-new').addEventListener('click', () => checkDirtyBeforeAction(() => {
                clearForm(true);
                switchTab('detail');
            }));
            winEl.querySelector('#invi02-tb-edit').addEventListener('click', () => {
                const curNo = fNo.value.trim();
                if (!curNo) {
                    alert('請先查詢品號或點選「新增」！');
                    return;
                }
                switchTab('detail');
                setInviMode('edit', curNo);
                Modules.toast(`品號 [${curNo}] 進入修改模式`, 'info');
            });
            winEl.querySelector('#invi02-tb-save').addEventListener('click', doSave);

            winEl.querySelector('#invi02-tb-confirm').addEventListener('click', () => {
                const btn = winEl.querySelector('#invi02-tb-confirm');
                if (btn && btn.disabled) return;
                isConfirmed = true;
                Modules.updateAuditButtons(winEl, true, 'invi02');
                Modules.toast('品號資料確認完成！', 'success');
            });
            winEl.querySelector('#invi02-tb-unconfirm').addEventListener('click', () => {
                const btn = winEl.querySelector('#invi02-tb-unconfirm');
                if (btn && btn.disabled) return;
                isConfirmed = false;
                Modules.updateAuditButtons(winEl, false, 'invi02');
                Modules.toast('品號資料已取消確認！', 'info');
            });

            winEl.querySelector('#invi02-tb-cancel').addEventListener('click', () => {
                if (isDirty) {
                    const answer = confirm("資料尚未儲存，是否要儲存目前的品號資料？\n\n點選【確定】：進行儲存\n點選【取消】：直接清除放棄變更");
                    if (answer) {
                        doSave();
                    } else {
                        resetItemBlank();
                        Modules.toast('已取消並清除未儲存變更。', 'info');
                    }
                } else {
                    resetItemBlank();
                    Modules.toast('已清除重置頁面資料。', 'info');
                }
            });

            winEl.querySelector('#invi02-tb-del').addEventListener('click', async () => {
                const iNo = fNo.value.trim();
                if (!iNo) return;
                if (confirm(`確定要刪除品號 [${iNo}] 嗎？`)) {
                    const res = await ERP_API.post('delete_item', { item_no: iNo });
                    if (res.success) {
                        Modules.toast('品號資料已刪除！', 'success');
                        clearForm();
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

            // Initial load: 若有傳入指定品號則立即載入並檢視，否則維持空白模式
            if (targetItemNo) {
                ERP_API.get('get_items').then(res => {
                    if (res.success && res.data) {
                        itemList = res.data;
                        const found = itemList.find(it => it.item_no === targetItemNo);
                        if (found) {
                            currentIndex = itemList.indexOf(found);
                            fillForm(found);
                            setEditMode('view', found.item_no);
                            return;
                        }
                    }
                    resetItemBlank();
                });
            } else {
                resetItemBlank();
            }
        });
    }
});
