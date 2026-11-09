// Interactive ERP Workflow Flowchart Renderer (1:1 with 擷取16.PNG, 擷取17.PNG, 擷取15.PNG)
const Flowcharts = {
    currentModule: 'order',
    isFitMode: true,

    toggleFit() {
        this.isFitMode = !this.isFitMode;
        const btn = document.getElementById('btn-flowchart-zoom');
        if (btn) {
            btn.textContent = this.isFitMode ? '🔍 縮放符合螢幕' : '🔍 100% 原始大小';
        }
        this.updateScale();
    },

    updateScale() {
        const diagram = document.getElementById('fc-diagram-inner');
        const container = document.querySelector('.flowchart-container');
        if (!diagram || !container) return;

        if (!this.isFitMode) {
            diagram.style.transform = 'none';
            diagram.style.margin = '0 auto';
            return;
        }

        const containerW = container.clientWidth - 32;
        if (containerW > 0 && containerW < 960) {
            const scale = Math.max(0.62, Math.min(1, containerW / 960));
            diagram.style.transform = `scale(${scale})`;
            diagram.style.transformOrigin = 'top left';
            diagram.style.margin = '0';
        } else {
            diagram.style.transform = 'none';
            diagram.style.margin = '0 auto';
        }
    },

    render(moduleName = 'order') {
        this.currentModule = moduleName;
        const container = document.getElementById('flowchart-canvas-view');
        if (!container) return;

        let titleText = '▶▶ 訂單管理系統';
        if (moduleName === 'purchase') titleText = '▶▶ 採購管理系統';
        if (moduleName === 'inventory') titleText = '▶▶ 庫存管理系統';

        let html = `
            <div class="flowchart-container">
                <div class="flowchart-header">
                    <div class="flowchart-title">${titleText}</div>
                </div>
                <div class="flowchart-diagram" id="fc-diagram-inner">
        `;

        if (moduleName === 'order') {
            html += this.getOrderDiagram();
        } else if (moduleName === 'purchase') {
            html += this.getPurchaseDiagram();
        } else if (moduleName === 'inventory') {
            html += this.getInventoryDiagram();
        }

        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;
        setTimeout(() => this.updateScale(), 30);
    },

    getOrderDiagram() {
        return `
            <svg class="flowchart-lines-svg">
                <!-- Center vertical arrow flow -->
                <defs>
                    <marker id="arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L6,3 z" fill="#888888" />
                    </marker>
                    <marker id="arrow-blue" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L6,3 z" fill="#4D76A8" />
                    </marker>
                </defs>
                <!-- Line Customer -> Quote -->
                <line x1="305" y1="95" x2="305" y2="135" stroke="#777" stroke-width="1.5" marker-end="url(#arrow)" />
                <!-- Line Quote -> Contract -->
                <line x1="305" y1="165" x2="305" y2="195" stroke="#777" stroke-width="1.5" marker-end="url(#arrow)" />
                <!-- Line Contract -> Forecast -->
                <line x1="305" y1="225" x2="305" y2="255" stroke="#777" stroke-width="1.5" marker-end="url(#arrow)" />
                <!-- Line Forecast -> Sales Order -->
                <line x1="305" y1="285" x2="305" y2="315" stroke="#777" stroke-width="1.5" marker-end="url(#arrow)" />
                <!-- Line Sales Order -> Delivery -->
                <line x1="305" y1="345" x2="305" y2="395" stroke="#777" stroke-width="1.5" marker-end="url(#arrow)" />
                <!-- Line Delivery -> Return -->
                <line x1="305" y1="425" x2="305" y2="470" stroke="#777" stroke-width="1.5" marker-end="url(#arrow)" />

                <!-- Left connections to Pink Systems -->
                <line x1="230" y1="410" x2="190" y2="365" stroke="#777" stroke-width="1.2" marker-end="url(#arrow)" />
                <line x1="230" y1="410" x2="190" y2="415" stroke="#777" stroke-width="1.2" marker-end="url(#arrow)" />
                <line x1="230" y1="410" x2="190" y2="465" stroke="#777" stroke-width="1.2" marker-end="url(#arrow)" />

                <!-- Right connections to green reports -->
                <line x1="380" y1="330" x2="460" y2="250" stroke="#777" stroke-width="1.2" marker-end="url(#arrow)" />
                <line x1="380" y1="410" x2="460" y2="450" stroke="#777" stroke-width="1.2" marker-end="url(#arrow)" />
            </svg>

            <!-- Left Group -->
            <div class="fc-block fc-blue" style="left:30px; top:65px;" onclick="Modules.open('CR_PARAM')">信用控制參數設定</div>
            <div class="fc-block fc-blue" style="left:30px; top:125px;" onclick="Modules.open('CUST_PRICE')">客戶商品計價建立作業</div>
            <div class="fc-block fc-blue" style="left:30px; top:170px;" onclick="Modules.open('DOC_TYPE')">單據性質設定作業</div>
            <div class="fc-block fc-blue" style="left:30px; top:215px;" onclick="Modules.open('CUST_ITEM')">客戶品號資料建立作業</div>
            <div class="fc-block fc-blue" style="left:30px; top:270px;" onclick="Modules.open('CONTRACT_CHG')">合約訂單變更單建立作業</div>

            <!-- Pink External Systems -->
            <div class="fc-block fc-pink" style="left:30px; top:350px;" onclick="Flowcharts.render('inventory')">庫存管理系統</div>
            <div class="fc-block fc-pink" style="left:30px; top:400px;" onclick="alert('開啟應收管理系統')">應收管理系統</div>
            <div class="fc-block fc-pink" style="left:30px; top:450px;" onclick="alert('開啟銷售分析系統')">銷售分析系統</div>
            <div class="fc-block fc-purple" style="left:35px; top:515px;" onclick="alert('開啟銷貨退回作業')">銷貨退回</div>

            <!-- Center Core Flow -->
            <div class="fc-block fc-blue" style="left:230px; top:65px;" onclick="Modules.open('COPI01')">
                客戶資料建立作業
                <span class="fc-badge">COPI01</span>
            </div>
            <div class="fc-block fc-blue" style="left:230px; top:135px;" onclick="Modules.open('COPI05')">
                報價單建立作業
                <span class="fc-badge">COPI05</span>
            </div>
            <div class="fc-block fc-blue" style="left:230px; top:195px;" onclick="Modules.open('CONTRACT')">合約訂單建立作業</div>
            <div class="fc-block fc-blue" style="left:230px; top:255px;" onclick="Modules.open('FORECAST')">銷售預測建立作業</div>
            <div class="fc-block fc-blue" style="left:230px; top:315px;" onclick="Modules.open('COPI06')">
                客戶訂單建立作業
                <span class="fc-badge">COPI06</span>
            </div>
            <div class="fc-block fc-blue" style="left:230px; top:395px;" onclick="Modules.open('COPI08')">
                銷貨單建立作業
                <span class="fc-badge">COPI08</span>
            </div>
            <div class="fc-block fc-blue" style="left:230px; top:470px;" onclick="Modules.open('RETURN_ORDER')">銷退單建立作業</div>

            <!-- Right Group -->
            <div class="fc-block fc-purple" style="left:470px; top:75px;" onclick="alert('客戶訂單變更通知')">客戶訂單變更通知</div>
            <div class="fc-block fc-blue" style="left:470px; top:135px;" onclick="Modules.open('ORDER_CHANGE')">訂單變更單建立作業</div>

            <!-- Right Green Reports -->
            <div class="fc-block fc-green" style="left:470px; top:185px;" onclick="Modules.open('RPT_EXP_SHIP')">訂單預計出貨明細表</div>
            <div class="fc-block fc-green" style="left:470px; top:220px;" onclick="Modules.open('RPT_ITEM_SHIP')">商品預計出貨明細表</div>
            <div class="fc-block fc-green" style="left:470px; top:255px;" onclick="Modules.open('RPT_CUST_SHIP')">客戶預計出貨明細表</div>
            <div class="fc-block fc-green" style="left:470px; top:290px;" onclick="Modules.open('RPT_SALES_SHIP')">業務員預計出貨明細表</div>
            <div class="fc-block fc-green" style="left:470px; top:325px;" onclick="Modules.open('RPT_ORDER_STAT')">客戶接單統計表</div>

            <div class="fc-block fc-green" style="left:470px; top:420px;" onclick="Modules.open('RPT_CUST_SALE')">客戶銷貨明細表</div>
            <div class="fc-block fc-green" style="left:470px; top:455px;" onclick="Modules.open('RPT_SALE_SUM')">客戶銷貨彙總表</div>
            <div class="fc-block fc-green" style="left:470px; top:490px;" onclick="Modules.open('RPT_TX_HIST')">歷史交易記錄表</div>
            <div class="fc-block fc-green" style="left:470px; top:525px;" onclick="Modules.open('RPT_ITEM_PER')">商品銷貨期報表</div>
        `;
    },

    getPurchaseDiagram() {
        return `
            <svg class="flowchart-lines-svg">
                <defs>
                    <marker id="arrow2" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L6,3 z" fill="#888888" />
                    </marker>
                </defs>
                <line x1="305" y1="95" x2="305" y2="135" stroke="#777" stroke-width="1.5" marker-end="url(#arrow2)" />
                <line x1="305" y1="165" x2="305" y2="195" stroke="#777" stroke-width="1.5" marker-end="url(#arrow2)" />
                <line x1="305" y1="225" x2="305" y2="255" stroke="#777" stroke-width="1.5" marker-end="url(#arrow2)" />
                <line x1="305" y1="285" x2="305" y2="330" stroke="#777" stroke-width="1.5" marker-end="url(#arrow2)" />
                <line x1="305" y1="365" x2="305" y2="395" stroke="#777" stroke-width="1.5" marker-end="url(#arrow2)" />

                <!-- Requisition Flow Lines on Right -->
                <line x1="560" y1="135" x2="560" y2="165" stroke="#777" stroke-width="1.5" marker-end="url(#arrow2)" />
                <line x1="560" y1="195" x2="560" y2="225" stroke="#777" stroke-width="1.5" marker-end="url(#arrow2)" />
                <line x1="480" y1="240" x2="380" y2="270" stroke="#4D76A8" stroke-dasharray="3,3" stroke-width="1.5" marker-end="url(#arrow2)" />
            </svg>

            <!-- Top Supplier Master -->
            <div class="fc-block fc-blue" style="left:230px; top:65px;" onclick="Modules.open('SUPPLIER')">供應商資料建立作業</div>

            <!-- Left Group -->
            <div class="fc-block fc-blue" style="left:30px; top:125px;" onclick="Modules.open('ITEM_SUPP')">品號廠商建立作業</div>
            <div class="fc-block fc-blue" style="left:30px; top:170px;" onclick="Modules.open('DOC_TYPE')">單據性質設定作業</div>
            <div class="fc-block fc-blue" style="left:30px; top:215px;" onclick="Modules.open('QC_TYPE')">廠商商品檢驗方式建立</div>
            <div class="fc-block fc-blue" style="left:30px; top:260px;" onclick="Modules.open('PO_CHG_CON')">合約採購變更單建立作業</div>
            <div class="fc-block fc-blue" style="left:30px; top:305px;" onclick="Modules.open('PO_CHG')">採購變更單建立作業</div>

            <!-- Pink External Systems -->
            <div class="fc-block fc-pink" style="left:30px; top:365px;" onclick="Flowcharts.render('inventory')">庫存管理系統</div>
            <div class="fc-block fc-pink" style="left:30px; top:410px;" onclick="alert('開啟應付管理系統')">應付管理系統</div>
            <div class="fc-block fc-blue" style="left:30px; top:470px;" onclick="Modules.open('PUR_RETURN')">退貨單建立作業</div>

            <!-- Center Core Flow -->
            <div class="fc-block fc-blue" style="left:230px; top:135px;" onclick="Modules.open('PRICE_VERIFY')">核價單建立作業</div>
            <div class="fc-block fc-blue" style="left:230px; top:195px;" onclick="Modules.open('CONTRACT_PO')">合約採購單建立作業</div>
            <div class="fc-block fc-blue" style="left:230px; top:255px;" onclick="Modules.open('PURI07')">
                採購單建立作業
                <span class="fc-badge">PURI07</span>
            </div>
            <div class="fc-block fc-blue" style="left:230px; top:330px;" onclick="Modules.open('PURI09')">
                進貨單建立作業
                <span class="fc-badge">PURI09</span>
            </div>
            <div class="fc-block fc-orange-diamond" style="left:270px; top:395px;" onclick="alert('檢驗作業')">檢驗</div>
            <div class="fc-block fc-blue" style="left:230px; top:470px;" onclick="Modules.open('PURI09')">進貨單建立作業 / 進貨驗收</div>

            <!-- Requisition Flow on Right -->
            <div class="fc-block fc-pink" style="left:480px; top:65px;" onclick="alert('生產計劃系統')">生產計劃系統</div>
            <div class="fc-block fc-blue" style="left:480px; top:115px;" onclick="Modules.open('PURI05')">
                請購單建立作業
                <span class="fc-badge">PURI05</span>
            </div>
            <div class="fc-block fc-blue" style="left:480px; top:165px;" onclick="Modules.open('PURI06')">
                請購資料維護作業
                <span class="fc-badge">PURI06</span>
            </div>
            <div class="fc-block fc-blue" style="left:480px; top:215px;" onclick="Modules.open('PURB01')">
                請購資料更新作業
                <span class="fc-badge">PURB01</span>
            </div>

            <!-- Green Reports on Right -->
            <div class="fc-block fc-green" style="left:480px; top:280px;" onclick="Modules.open('RPT_EXP_PUR')">廠商預計進貨表</div>
            <div class="fc-block fc-green" style="left:480px; top:315px;" onclick="Modules.open('RPT_ITEM_PUR')">品號預計進貨表</div>
            <div class="fc-block fc-green" style="left:480px; top:350px;" onclick="Modules.open('RPT_SUPP_PUR')">廠商進貨明細表</div>
            <div class="fc-block fc-green" style="left:480px; top:385px;" onclick="Modules.open('RPT_PUR_SUM')">品號歷史進貨記錄表</div>
        `;
    },

    getInventoryDiagram() {
        return `
            <svg class="flowchart-lines-svg">
                <defs>
                    <marker id="arrow3" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L6,3 z" fill="#888888" />
                    </marker>
                </defs>
                <line x1="305" y1="95" x2="305" y2="135" stroke="#777" stroke-width="1.5" marker-end="url(#arrow3)" />
                <line x1="305" y1="165" x2="305" y2="200" stroke="#777" stroke-width="1.5" marker-end="url(#arrow3)" />
                <line x1="305" y1="230" x2="305" y2="265" stroke="#777" stroke-width="1.5" marker-end="url(#arrow3)" />
            </svg>

            <!-- Center Core Flow -->
            <div class="fc-block fc-blue" style="left:230px; top:65px;" onclick="Modules.open('ITEM_CAT')">品號類別資料建立作業</div>
            <div class="fc-block fc-blue" style="left:230px; top:135px;" onclick="Modules.open('INVI02')">
                品號資料建立作業
                <span class="fc-badge">INVI02</span>
            </div>
            <div class="fc-block fc-blue" style="left:230px; top:200px;" onclick="Modules.open('DOC_TYPE')">單據性質設定作業</div>
            <div class="fc-block fc-blue" style="left:230px; top:265px;" onclick="Modules.open('INV_TX')">庫存異動單據建立作業</div>
            <div class="fc-block fc-blue" style="left:230px; top:320px;" onclick="Modules.open('INV_TRANSFER')">轉撥單據建立作業</div>
            <div class="fc-block fc-blue" style="left:230px; top:375px;" onclick="Modules.open('INV_ADJUST')">成本開帳/調整單建立作業</div>

            <!-- Left Setup & Stocktake -->
            <div class="fc-block fc-blue" style="left:30px; top:75px;" onclick="Modules.open('ATTR_CODE')">屬性代碼設定作業</div>
            <div class="fc-block fc-blue" style="left:30px; top:135px;" onclick="Modules.open('ATTR_DEF')">屬性組定義建立作業</div>
            <div class="fc-block fc-blue" style="left:30px; top:245px;" onclick="Modules.open('STOCK_SAMPLE')">抽盤品號產生作業</div>
            <div class="fc-block fc-green" style="left:30px; top:295px;" onclick="Modules.open('STOCK_CARD')">庫存盤點卡</div>
            <div class="fc-block fc-purple" style="left:35px; top:375px;" onclick="alert('實地盤點')">實地盤點</div>
            <div class="fc-block fc-blue" style="left:30px; top:435px;" onclick="Modules.open('STOCK_DATA')">盤點資料建立作業</div>

            <!-- Right External Systems & Reports -->
            <div class="fc-block fc-blue" style="left:480px; top:135px;" onclick="Modules.open('BORROW_RETURN')">暫出/入歸還建立作業</div>
            <div class="fc-block fc-blue" style="left:480px; top:190px;" onclick="Modules.open('BORROW_INOUT')">暫出/入單建立作業</div>
            <div class="fc-block fc-pink" style="left:480px; top:265px;" onclick="Flowcharts.render('order')">訂單管理系統</div>
            <div class="fc-block fc-pink" style="left:480px; top:315px;" onclick="Flowcharts.render('purchase')">採購管理系統</div>
            <div class="fc-block fc-green" style="left:480px; top:420px;" onclick="Modules.open('RPT_INV_DETAIL')">庫存明細帳</div>
            <div class="fc-block fc-green" style="left:480px; top:465px;" onclick="Modules.open('RPT_INV_ABC')">庫存ABC分析表</div>
        `;
    }
};
