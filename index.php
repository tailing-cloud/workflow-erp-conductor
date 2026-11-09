<?php
require_once __DIR__ . '/config.php';
$currentUser = getCurrentUser();
?>
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Conductor</title>
    <link rel="stylesheet" href="assets/css/conductor.css?v=<?= filemtime(__DIR__ . '/assets/css/conductor.css') ?>">
    <link rel="stylesheet" href="assets/css/forms.css?v=<?= filemtime(__DIR__ . '/assets/css/forms.css') ?>">
    <link rel="stylesheet" href="assets/css/flowchart.css?v=<?= filemtime(__DIR__ . '/assets/css/flowchart.css') ?>">
    <link rel="stylesheet" href="assets/css/responsive.css?v=<?= filemtime(__DIR__ . '/assets/css/responsive.css') ?>">
</head>
<body>

<!-- ========================================================
     1. 1:1 LOGIN WINDOW (系統登入 - 擷取19.PNG)
     ======================================================== -->
<div id="login-modal" class="login-overlay" style="<?= $currentUser ? 'display:none;' : 'display:flex;' ?>">
    <div class="login-window">
        <!-- Titlebar -->
        <div class="win-titlebar">
            <div class="title-text">
                <span style="font-size:14px;">🗔</span>
                <span>系統登入 - ERP模擬練習系統</span>
            </div>
            <div class="win-controls">
                <button class="win-btn close" onclick="alert('系統已就緒，請完成登入')">✕</button>
            </div>
        </div>

        <!-- Body -->
        <div class="login-body">
            <!-- Theme Header Banner -->
            <div style="text-align:center; padding:10px 0 12px 0; border-bottom:1px solid #D0D7DE; margin-bottom:12px; background:linear-gradient(to bottom, #F8FAFD, #EEF3F8);">
                <div style="font-size:18px; font-weight:bold; color:#185286; letter-spacing:1px;">ERP模擬練習系統</div>
                <div style="font-size:11px; color:#5A6A7E; margin-top:3px;">配銷核心模組教學與模擬實務系統</div>
            </div>

            <div class="login-content-row">
                <!-- Input Form -->
                <form id="login-form" class="login-form-box">
                    <div class="login-field">
                        <label>語言別</label>
                        <select id="login-lang">
                            <option value="zh-TW" selected>中文(繁體)</option>
                            <option value="zh-CN">中文(簡體)</option>
                            <option value="en-US">English</option>
                        </select>
                    </div>

                    <div class="login-field">
                        <label>帳號</label>
                        <input type="text" id="login-username" value="" required placeholder="請輸入帳號" autocomplete="username">
                    </div>

                    <div class="login-field">
                        <label>密碼</label>
                        <input type="password" id="login-password" value="" placeholder="請輸入密碼" autocomplete="current-password">
                    </div>

                    <div class="login-field">
                        <label>公司</label>
                        <select id="login-company">
                            <option value="學生區" selected>學生區</option>
                            <option value="學生區A01">學生區A01</option>
                            <option value="學生區B18">學生區B18</option>
                            <option value="總公司">示範製造股份有限公司</option>
                        </select>
                    </div>

                    <!-- Action Buttons (1:1 擷取19.PNG) -->
                    <div class="login-buttons">
                        <button type="submit" class="btn-login confirm" id="btn-login-submit">
                            <span style="color:green; font-weight:bold; font-size:14px;">✔</span> 確定
                        </button>
                        <button type="button" class="btn-login" onclick="alert('已取消')">
                            <span style="color:red; font-weight:bold; font-size:14px;">✖</span> 取消
                        </button>
                    </div>
                </form>
            </div>

            <!-- Disclaimer Notice (1:1 擷取19.PNG) -->
            <div class="login-bottom-notice">
                <label class="checkbox-label">
                    <input type="checkbox" id="login-remember"> 下次啟動時忽略此訊息
                </label>
                <div class="login-disclaimer">
                    本系統包含重要之個人資訊或營業秘密，請依所屬權責存取，<br>
                    遵守相關規定謹慎操作使用並妥善保管，以確保權益避免觸法。<br>
                    若有違反公司所賦予權責之不當蒐集、處理、利用<br>
                    而造成公司或客戶之任何損害，依公司規定及相關法律辦理。
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ========================================================
     2. 1:1 CONDUCTOR MAIN APPLICATION (擷取20.PNG)
     ======================================================== -->
<div id="conductor-app" style="<?= $currentUser ? 'display:flex;' : 'display:none;' ?>">
    <!-- Top Conductor Titlebar -->
    <div class="conductor-topbar">
        <div class="left-logo">
            <button id="tablet-menu-toggle-btn" class="tablet-menu-btn" title="切換選單與作業清單">
                <span style="font-size:14px;">☰</span>
                <span>選單</span>
            </button>
            <span style="font-size:16px;">🗂️</span>
            <span id="conductor-title-text">Conductor</span>
        </div>
        <div class="right-user-info">
            <span id="top-user-display"><?= htmlspecialchars($currentUser['display_name'] ?? '學生B18') ?> [<?= htmlspecialchars($currentUser['company'] ?? '學生區B18') ?>]</span>
        </div>
    </div>

    <!-- Ribbon Tabs Bar -->
    <div class="ribbon-tabs">
        <button class="ribbon-tab active">常用</button>
        <button class="ribbon-tab">工具</button>
        <button class="ribbon-tab">後台處理</button>
        <button class="ribbon-tab">幫助</button>
    </div>

    <!-- Ribbon Toolbar Content (1:1 擷取20.PNG) -->
    <div class="ribbon-toolbar">
        <!-- 1. 公司別 -->
        <div class="ribbon-group">
            <div class="ribbon-group-content">
                <div class="ribbon-input-group">
                    <select id="ribbon-company-select" disabled style="width:105px; background:#ECE9D8; color:#000; cursor:not-allowed;" title="系統已鎖定為目前登入帳號之所屬公司">
                        <option value="學生區">學生區</option>
                    </select>
                </div>
            </div>
            <div class="ribbon-group-title">公司別</div>
        </div>

        <!-- 2. 系統工具 -->
        <div class="ribbon-group">
            <div class="ribbon-group-content">
                <button class="ribbon-btn-large" onclick="alert('工作管理員執行正常')">
                    <span style="font-size:22px; color:#2B579A;">⚙️</span>
                    <span>工作管理員</span>
                </button>
                <button class="ribbon-btn-large" onclick="Modules.open('QUEUE_CONSOLE')">
                    <span style="font-size:22px; color:#2B579A;">📑</span>
                    <span>佇列工作控制台</span>
                </button>
            </div>
            <div class="ribbon-group-title">系統工具</div>
        </div>

        <!-- 3. 顯示程式清單 -->
        <div class="ribbon-group">
            <div class="ribbon-group-content" style="gap:3px; flex-direction:column; justify-content:center;">
                <button class="ribbon-btn-small" onclick="alert('基本選項設定')">📑 基本選項</button>
                <button class="ribbon-btn-small" onclick="alert('進階選項設定')">🔍 進階選項</button>
                <button class="ribbon-btn-small" onclick="alert('使用者權限清單')">📋 使用者權限清單</button>
            </div>
            <div class="ribbon-group-title">顯示程式清單</div>
        </div>

        <!-- 4. 監控檢核通知 -->
        <div class="ribbon-group">
            <div class="ribbon-group-content">
                <div class="ribbon-input-group">
                    <div style="display:flex; align-items:center; gap:4px;">
                        <span>待辦未處理</span>
                        <input type="text" style="width:40px; text-align:center;" value="0" readonly>
                    </div>
                    <div style="display:flex; align-items:center; gap:4px;">
                        <span>警示未處理</span>
                        <input type="text" style="width:40px; text-align:center;" value="0" readonly>
                    </div>
                </div>
                <div class="ribbon-input-group" style="margin-left:6px;">
                    <label style="display:flex; align-items:center; gap:4px;">
                        <input type="checkbox" checked> 依第一次通知日排序
                    </label>
                    <div style="display:flex; align-items:center; gap:4px;">
                        <span>總資料筆數限制</span>
                        <select style="width:45px;"><option>20</option><option>50</option><option>100</option></select>
                    </div>
                </div>
            </div>
            <div class="ribbon-group-title">監控檢核通知</div>
        </div>

        <!-- 5. E-Service -->
        <div class="ribbon-group">
            <div class="ribbon-group-content">
                <button class="ribbon-btn-large" onclick="alert('知識庫/問答集查詢')">
                    <span style="font-size:24px;">💡</span>
                    <span>問答集</span>
                </button>
                <button class="ribbon-btn-large" onclick="Modules.openCustomerService()">
                    <span style="font-size:24px;">💬</span>
                    <span>文字客服</span>
                </button>
            </div>
            <div class="ribbon-group-title">E-Service</div>
        </div>

        <!-- 6. 登錄與帳號管理 -->
        <div class="ribbon-group">
            <div class="ribbon-group-content">
                <button class="ribbon-btn-large" id="btn-relogin">
                    <span style="font-size:22px; color:#2B579A;">🔄</span>
                    <span>重新登入</span>
                </button>
                <button class="ribbon-btn-large" id="btn-exit">
                    <span style="font-size:22px; color:#C00000;">🚪</span>
                    <span>離開</span>
                </button>
                <button class="ribbon-btn-large" id="ribbon-btn-sec-user" onclick="Modules.open('SEC_USER')" style="display:none; border-left:1px dashed #ADC2D9;">
                    <span style="font-size:22px; color:#D35400;">🔑</span>
                    <span>帳號管理</span>
                </button>
            </div>
            <div class="ribbon-group-title">登錄</div>
        </div>

        <!-- 7. 模擬練習指引精靈 -->
        <div class="ribbon-group" style="background:#FFFDE6; border-right:none;">
            <div class="ribbon-group-content">
                <button class="ribbon-btn-large" onclick="Modules.open('PRACTICE_GUIDE')" style="color:#A04000; font-weight:bold;">
                    <span style="font-size:24px;">🎯</span>
                    <span>練習指引精靈</span>
                </button>
            </div>
            <div class="ribbon-group-title" style="color:#A04000;">配銷模擬引導</div>
        </div>
    </div>

    <!-- Main Workspace (Sidebar + Canvas + Windows) -->
    <div class="conductor-main-area">
        <!-- Tablet Off-canvas Drawer Backdrop Overlay -->
        <div id="sidebar-backdrop" class="sidebar-backdrop" title="點擊關閉選單"></div>

        <!-- Left Navigation Sidebar (1:1 擷取20.PNG, 擷取7.PNG) -->
        <div class="nav-sidebar">
            <div class="sidebar-search-box">
                <label>程式搜尋</label>
                <input type="text" id="sidebar-prog-search" placeholder="請輸入品號/單號/名稱">
                <button class="sidebar-search-btn">🔍</button>
            </div>
            <div class="sidebar-view-mode">
                <span>檢視類別</span>
                <select id="sidebar-view-type">
                    <option selected>系統+作業別</option>
                    <option>使用者最愛</option>
                    <option>自訂選單</option>
                </select>
            </div>

            <!-- Full TreeView (1:1 對照最新截圖: media_1793930856853_cdf82691.png) -->
            <div class="treeview-container" id="sidebar-tree">
                <!-- 根節點: 系統+作業別 (預設展開) -->
                <div class="tree-node folder-node expanded" id="tree-root-systems">
                    <div class="tree-item-label" data-action="toggle-folder" style="font-weight:normal;">
                        <span class="tree-arrow">v</span>
                        <span class="tree-folder" style="font-size:13px;">🗂️</span>
                        <span style="font-weight:bold;">系統+作業別</span>
                    </div>
                    <div class="tree-children" style="display:block;">
                        <!-- 1. 主系統架構圖 (端點無箭頭) -->
                        <div class="tree-node leaf-node">
                            <div class="tree-item-label" onclick="Flowcharts.render('all'); if (typeof switchCanvasTab === 'function') switchCanvasTab('flow');" style="padding-left:16px;">
                                <span class="tree-folder">📁</span>
                                <span>主系統架構圖</span>
                            </div>
                        </div>

                        <!-- 2. 電子表單工作匣 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>電子表單工作匣</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('目前尚無待簽核電子表單')"><span class="tree-leaf-doc">📄</span><span>待辦表單</span></div></div>
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('已簽核表單查詢')"><span class="tree-leaf-doc">📄</span><span>已簽表單</span></div></div>
                            </div>
                        </div>

                        <!-- 3. 管理維護系統 -->
                        <div class="tree-node folder-node collapsed" id="tree-node-admin">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>管理維護系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.open('SEC_USER')"><span class="tree-leaf-doc">📄</span><span>使用者帳號管理 (SEC_USER)</span></div></div>
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.open('SEC_USER')"><span class="tree-leaf-doc">📄</span><span>公司與學生組別設定</span></div></div>
                            </div>
                        </div>

                        <!-- 4. 基本資料管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>基本資料管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.openLookup('currency', null)"><span class="tree-leaf-doc">📄</span><span>幣別匯率建立作業</span></div></div>
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.openLookup('department', null)"><span class="tree-leaf-doc">📄</span><span>部門資料建立作業</span></div></div>
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.openLookup('personnel', null)"><span class="tree-leaf-doc">📄</span><span>員工資料建立作業</span></div></div>
                            </div>
                        </div>

                        <!-- 5. 庫存管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <b>庫存管理系統</b>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <!-- 基本資料管理 -->
                                <div class="tree-node folder-node collapsed">
                                    <div class="tree-item-label" data-action="toggle-folder">
                                        <span class="tree-arrow">&gt;</span>
                                        <span class="tree-folder">📁</span>
                                        <span>基本資料管理</span>
                                    </div>
                                    <div class="tree-children" style="display:none;">
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('品號類別資料建立作業')"><span class="tree-leaf-icon I">I</span><span>品號類別資料建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('新品號申請建立作業')"><span class="tree-leaf-icon I">I</span><span>新品號申請建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.open('INVI02')"><span class="tree-leaf-icon I">I</span><span>品號資料建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.open('INVI02')"><span class="tree-leaf-icon I">I</span><span>品號(基本)資料建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('品號(倉管)資料建立作業')"><span class="tree-leaf-icon I">I</span><span>品號(倉管)資料建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('品號(採購)資料建立作業')"><span class="tree-leaf-icon I">I</span><span>品號(採購)資料建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('品號(業務)資料建立作業')"><span class="tree-leaf-icon I">I</span><span>品號(業務)資料建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('品號(會計)資料建立作業')"><span class="tree-leaf-icon I">I</span><span>品號(會計)資料建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('品號(SHIPPING)資料建立作業')"><span class="tree-leaf-icon I">I</span><span>品號(SHIPPING)資料建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('品號(生管)資料建立作業')"><span class="tree-leaf-icon I">I</span><span>品號(生管)資料建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('品號(品管)資料建立作業')"><span class="tree-leaf-icon I">I</span><span>品號(品管)資料建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('品號資料建立作業(流通業)')"><span class="tree-leaf-icon I">I</span><span>品號資料建立作業(流通業)</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.openLookup('doc_type_order')"><span class="tree-leaf-icon I">I</span><span>單據性質設定作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('商品條碼資料建立作業')"><span class="tree-leaf-icon I">I</span><span>商品條碼資料建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('屬性代碼設定作業')"><span class="tree-leaf-icon I">I</span><span>屬性代碼設定作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('屬性組定義建立作業')"><span class="tree-leaf-icon I">I</span><span>屬性組定義建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('品號資料屬性組合建立作業')"><span class="tree-leaf-icon I">I</span><span>品號資料屬性組合建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('別名群組建立作業')"><span class="tree-leaf-icon I">I</span><span>別名群組建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('品號允許交易對象建立作業')"><span class="tree-leaf-icon I">I</span><span>品號允許交易對象建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.openLookup('unit')"><span class="tree-leaf-icon I">I</span><span>庫存單位建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('品號交易對象稅別碼資料建立作業')"><span class="tree-leaf-icon I">I</span><span>品號交易對象稅別碼資料建立作業</span></div></div>
                                    </div>
                                </div>

                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>日常異動處理</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>異動單據憑證</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>清單與明細表</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>報表列印</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>批號資料管理</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>暫出/暫入管理</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>庫存盤點管理</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>批次作業</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>維護作業</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>品號變更管理</span></div></div>
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.openLookup('item', null)"><span class="tree-leaf-icon Q">Q</span><span>庫存狀況查詢作業</span></div></div>
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Flowcharts.render('inventory')"><span class="tree-leaf-icon">🗺️</span><span>庫存系統流程圖</span></div></div>
                            </div>
                        </div>

                        <!-- 6. 產品結構管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>產品結構管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>基本資料管理</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>日常異動處理</span></div></div>
                            </div>
                        </div>

                        <!-- 7. 訂單管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <b>訂單管理系統</b>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <!-- 基本資料管理 -->
                                <div class="tree-node folder-node collapsed">
                                    <div class="tree-item-label" data-action="toggle-folder">
                                        <span class="tree-arrow">&gt;</span>
                                        <span class="tree-folder">📁</span>
                                        <span>基本資料管理</span>
                                    </div>
                                    <div class="tree-children" style="display:none;">
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('新客戶申請建立作業')"><span class="tree-leaf-icon I">I</span><span>新客戶申請建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.open('COPI01')"><span class="tree-leaf-icon I">I</span><span>客戶資料建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('單據性質建立作業')"><span class="tree-leaf-icon I">I</span><span>單據性質建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('銷售預測建立作業(依品號)')"><span class="tree-leaf-icon I">I</span><span>銷售預測建立作業(依品號)</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('銷售預測建立作業(依類別)')"><span class="tree-leaf-icon I">I</span><span>銷售預測建立作業(依類別)</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('客戶品號資料建立作業')"><span class="tree-leaf-icon I">I</span><span>客戶品號資料建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('信用控制參數設定作業')"><span class="tree-leaf-icon I">I</span><span>信用控制參數設定作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('業務品號資料建立作業')"><span class="tree-leaf-icon I">I</span><span>業務品號資料建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('商品價格調整建立作業')"><span class="tree-leaf-icon I">I</span><span>商品價格調整建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('不良原因代號建立作業')"><span class="tree-leaf-icon I">I</span><span>不良原因代號建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('每月發票建立作業')"><span class="tree-leaf-icon I">I</span><span>每月發票建立作業</span></div></div>
                                    </div>
                                </div>

                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>商品價格管理</span></div></div>

                                <!-- 日常異動處理 -->
                                <div class="tree-node folder-node collapsed">
                                    <div class="tree-item-label" data-action="toggle-folder">
                                        <span class="tree-arrow">&gt;</span>
                                        <span class="tree-folder">📁</span>
                                        <span>日常異動處理</span>
                                    </div>
                                    <div class="tree-children" style="display:none;">
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.open('COPI05')"><span class="tree-leaf-icon I">I</span><span>報價單建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('報價變更單建立作業')"><span class="tree-leaf-icon I">I</span><span>報價變更單建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('合約訂單建立作業')"><span class="tree-leaf-icon I">I</span><span>合約訂單建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('合約訂單變更單建立作業')"><span class="tree-leaf-icon I">I</span><span>合約訂單變更單建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.open('COPI06')"><span class="tree-leaf-icon I">I</span><span>客戶訂單建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('訂單變更單建立作業')"><span class="tree-leaf-icon I">I</span><span>訂單變更單建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.open('COPI08')"><span class="tree-leaf-icon I">I</span><span>銷貨單建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('銷退單建立作業')"><span class="tree-leaf-icon I">I</span><span>銷退單建立作業</span></div></div>
                                    </div>
                                </div>

                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>異動單據憑證</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>清單與明細表</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>報表列印</span></div></div>

                                <!-- 批次作業 -->
                                <div class="tree-node folder-node collapsed">
                                    <div class="tree-item-label" data-action="toggle-folder">
                                        <span class="tree-arrow">&gt;</span>
                                        <span class="tree-folder">📁</span>
                                        <span>批次作業</span>
                                    </div>
                                    <div class="tree-children" style="display:none;">
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('訂單已交量重計作業執行中')"><span class="tree-leaf-icon B">B</span><span>訂單已交量重計作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('訂單指定結案作業')"><span class="tree-leaf-icon B">B</span><span>訂單指定結案作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.open('COPB10')"><span class="tree-leaf-icon B">B</span><span>訂單轉請購單複製作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.open('COPB10')"><span class="tree-leaf-icon B">B</span><span>訂單轉採購單複製作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('客戶商品特價產生作業')"><span class="tree-leaf-icon B">B</span><span>客戶商品特價產生作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('訂單單據清除作業')"><span class="tree-leaf-icon B">B</span><span>訂單單據清除作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('客戶付款條件整批賦予作業')"><span class="tree-leaf-icon B">B</span><span>客戶付款條件整批賦予作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('業務批次移轉作業')"><span class="tree-leaf-icon B">B</span><span>業務批次移轉作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.open('COPI08', 'PROMPT_ORDER')"><span class="tree-leaf-icon B">B</span><span>客戶訂單產生銷貨單作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('銷貨單銷退數量重計作業')"><span class="tree-leaf-icon B">B</span><span>銷貨單銷退數量重計作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('商品價格調整批次作業')"><span class="tree-leaf-icon B">B</span><span>商品價格調整批次作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('單據指定不控管信用額度作業')"><span class="tree-leaf-icon B">B</span><span>單據指定不控管信用額度作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('暫出單收入認列作業')"><span class="tree-leaf-icon B">B</span><span>暫出單收入認列作業</span></div></div>
                                    </div>
                                </div>

                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>派車管理作業</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>銷售資料管理作業</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>客戶資料變更管理</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>全球貨況追蹤管理</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>訂單排定交期管理</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>費用預估管理</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>遞延收入管理</span></div></div>

                                <!-- 查詢作業 -->
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.openLookup('customer', null)"><span class="tree-leaf-icon Q">Q</span><span>客戶資訊查詢作業</span></div></div>
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.openLookup('order', null)"><span class="tree-leaf-icon Q">Q</span><span>訂單資訊查詢作業</span></div></div>
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.open('COPQ05')"><span class="tree-leaf-icon Q">Q</span><span>訂單樹狀資訊查詢</span></div></div>
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.open('COPQ05')"><span class="tree-leaf-icon Q">Q</span><span>客戶商品交易記錄查詢作業</span></div></div>
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Flowcharts.render('order')"><span class="tree-leaf-icon">🗺️</span><span>訂單系統流程圖</span></div></div>
                            </div>
                        </div>

                        <!-- 8. 出口作業管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>出口作業管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('出口作業管理系統功能準備中')"><span class="tree-leaf-doc">📄</span><span>出口報關作業</span></div></div>
                            </div>
                        </div>

                        <!-- 9. 採購管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <b>採購管理系統</b>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <!-- 基本資料管理 -->
                                <div class="tree-node folder-node collapsed">
                                    <div class="tree-item-label" data-action="toggle-folder">
                                        <span class="tree-arrow">&gt;</span>
                                        <span class="tree-folder">📁</span>
                                        <span>基本資料管理</span>
                                    </div>
                                    <div class="tree-children" style="display:none;">
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.open('PURI01')"><span class="tree-leaf-icon I">I</span><span>供應廠商資料建立作業</span></div></div>
                                    </div>
                                </div>

                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>品號廠商管理</span></div></div>

                                <!-- 日常異動處理 -->
                                <div class="tree-node folder-node collapsed">
                                    <div class="tree-item-label" data-action="toggle-folder">
                                        <span class="tree-arrow">&gt;</span>
                                        <span class="tree-folder">📁</span>
                                        <span>日常異動處理</span>
                                    </div>
                                    <div class="tree-children" style="display:none;">
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('核價單建立作業')"><span class="tree-leaf-icon I">I</span><span>核價單建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.open('PURI07')"><span class="tree-leaf-icon I">I</span><span>採購單建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('採購變更單建立作業')"><span class="tree-leaf-icon I">I</span><span>採購變更單建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('合約採購單建立作業')"><span class="tree-leaf-icon I">I</span><span>合約採購單建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('合約採購變更單建立作業')"><span class="tree-leaf-icon I">I</span><span>合約採購變更單建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.open('PURI09')"><span class="tree-leaf-icon I">I</span><span>進貨單建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('驗退件退回作業')"><span class="tree-leaf-icon I">I</span><span>驗退件退回作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('退貨單建立作業')"><span class="tree-leaf-icon I">I</span><span>退貨單建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('進貨單驗收作業')"><span class="tree-leaf-icon I">I</span><span>進貨單驗收作業</span></div></div>
                                    </div>
                                </div>

                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>異動單據憑證</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>清單與明細表</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>報表列印</span></div></div>

                                <!-- 請購資料管理 -->
                                <div class="tree-node folder-node collapsed">
                                    <div class="tree-item-label" data-action="toggle-folder">
                                        <span class="tree-arrow">&gt;</span>
                                        <span class="tree-folder">📁</span>
                                        <span>請購資料管理</span>
                                    </div>
                                    <div class="tree-children" style="display:none;">
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.open('PURI05')"><span class="tree-leaf-icon I">I</span><span>請購單建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('請購變更建立作業')"><span class="tree-leaf-icon I">I</span><span>請購變更建立作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('請購單憑證列印')"><span class="tree-leaf-icon R">R</span><span>請購單憑證</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('請購變更單憑證列印')"><span class="tree-leaf-icon R">R</span><span>請購變更單憑證</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('請購單明細表查詢')"><span class="tree-leaf-icon R">R</span><span>請購單明細表</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('請購變更單明細表查詢')"><span class="tree-leaf-icon R">R</span><span>請購變更單明細表</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('請購狀況表查詢')"><span class="tree-leaf-icon R">R</span><span>請購狀況表</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('已請未購明細表查詢')"><span class="tree-leaf-icon R">R</span><span>已請未購明細表</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.open('PURI06')"><span class="tree-leaf-icon I">I</span><span>請購資料維護作業</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('請購(分批)資料維護作業')"><span class="tree-leaf-icon I">I</span><span>請購(分批)資料維護</span></div></div>
                                        <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.open('PURB01')"><span class="tree-leaf-icon B">B</span><span>請購資料更新作業</span></div></div>
                                    </div>
                                </div>

                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>批次作業</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>廠商資料變更管理</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>詢價資料管理</span></div></div>
                                <div class="tree-node folder-node collapsed"><div class="tree-item-label" data-action="toggle-folder"><span class="tree-arrow">&gt;</span><span class="tree-folder">📁</span><span>採購交期確認管理</span></div></div>

                                <!-- 查詢作業 -->
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Modules.openLookup('supplier', null)"><span class="tree-leaf-icon Q">Q</span><span>廠商資訊查詢作業</span></div></div>
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('廠商商品交易記錄查詢作業')"><span class="tree-leaf-icon Q">Q</span><span>廠商商品交易記錄查詢作業</span></div></div>
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('採購樹狀資訊查詢')"><span class="tree-leaf-icon Q">Q</span><span>採購樹狀資訊查詢</span></div></div>
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="Flowcharts.render('purchase')"><span class="tree-leaf-icon">🗺️</span><span>採購系統流程圖</span></div></div>
                            </div>
                        </div>

                        <!-- 10. 進口作業管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>進口作業管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('進口作業管理系統功能準備中')"><span class="tree-leaf-doc">📄</span><span>進口報關作業</span></div></div>
                            </div>
                        </div>

                        <!-- 11. 製令/託外管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>製令/託外管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('製令管理系統功能準備中')"><span class="tree-leaf-doc">📄</span><span>工單建立作業</span></div></div>
                            </div>
                        </div>

                        <!-- 12. 應收管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>應收管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('應收帳款管理系統功能準備中')"><span class="tree-leaf-doc">📄</span><span>應收帳款立帳作業</span></div></div>
                            </div>
                        </div>

                        <!-- 13. 應付管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>應付管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('應付帳款管理系統功能準備中')"><span class="tree-leaf-doc">📄</span><span>應付帳款立帳作業</span></div></div>
                            </div>
                        </div>

                        <!-- 14. 票據資金管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>票據資金管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('票據資金管理系統功能準備中')"><span class="tree-leaf-doc">📄</span><span>應收票據建立作業</span></div></div>
                            </div>
                        </div>

                        <!-- 15. 會計總帳管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>會計總帳管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('會計總帳管理系統功能準備中')"><span class="tree-leaf-doc">📄</span><span>會計傳票建立作業</span></div></div>
                            </div>
                        </div>

                        <!-- 16. 自動分錄系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>自動分錄系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('自動分錄拋轉作業準備中')"><span class="tree-leaf-doc">📄</span><span>分錄底稿產生作業</span></div></div>
                            </div>
                        </div>

                        <!-- 17. 批次需求計劃系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>批次需求計劃系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('批次需求計算作業準備中')"><span class="tree-leaf-doc">📄</span><span>LRP 批次需求計算</span></div></div>
                            </div>
                        </div>

                        <!-- 18. 主生產排程系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>主生產排程系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('主生產排程維護作業準備中')"><span class="tree-leaf-doc">📄</span><span>MPS 排程維護作業</span></div></div>
                            </div>
                        </div>

                        <!-- 19. 物料需求計劃系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>物料需求計劃系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('物料需求發放作業準備中')"><span class="tree-leaf-doc">📄</span><span>MRP 計算與發放作業</span></div></div>
                            </div>
                        </div>

                        <!-- 20. 成本計算管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>成本計算管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('成本計算作業準備中')"><span class="tree-leaf-doc">📄</span><span>月加權成本計算作業</span></div></div>
                            </div>
                        </div>

                        <!-- 21. 固定資產管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>固定資產管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('固定資產作業準備中')"><span class="tree-leaf-doc">📄</span><span>資產卡片建立作業</span></div></div>
                            </div>
                        </div>

                        <!-- 22. 營業稅申報系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>營業稅申報系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('營業稅申報作業準備中')"><span class="tree-leaf-doc">📄</span><span>媒體申報檔產生作業</span></div></div>
                            </div>
                        </div>

                        <!-- 23. 品質管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>品質管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('品管檢驗作業準備中')"><span class="tree-leaf-doc">📄</span><span>進貨檢驗作業</span></div></div>
                            </div>
                        </div>

                        <!-- 24. 保稅管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>保稅管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('保稅管理作業準備中')"><span class="tree-leaf-doc">📄</span><span>保稅帳冊管理</span></div></div>
                            </div>
                        </div>

                        <!-- 25. 多角貿易管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>多角貿易管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('多角貿易作業準備中')"><span class="tree-leaf-doc">📄</span><span>多角代送建立作業</span></div></div>
                            </div>
                        </div>

                        <!-- 26. Fax/Email處理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>Fax/Email處理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('傳真/郵件發送作業準備中')"><span class="tree-leaf-doc">📄</span><span>自動傳真郵件發送作業</span></div></div>
                            </div>
                        </div>

                        <!-- 27. 園區保稅管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>園區保稅管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('園區保稅作業準備中')"><span class="tree-leaf-doc">📄</span><span>園區保稅報單管理</span></div></div>
                            </div>
                        </div>

                        <!-- 28. 零用金管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>零用金管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('零用金管理作業準備中')"><span class="tree-leaf-doc">📄</span><span>零用金撥補與報銷作業</span></div></div>
                            </div>
                        </div>

                        <!-- 29. 模具管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>模具管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('模具管理作業準備中')"><span class="tree-leaf-doc">📄</span><span>模具卡片建立作業</span></div></div>
                            </div>
                        </div>

                        <!-- 30. 合併財報管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>合併財報管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('合併財報管理系統作業準備中')"><span class="tree-leaf-doc">📄</span><span>合併報表設定作業</span></div></div>
                            </div>
                        </div>

                        <!-- 31. 標準成本計算管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>標準成本計算管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('標準成本計算管理系統作業準備中')"><span class="tree-leaf-doc">📄</span><span>標準成本計算作業</span></div></div>
                            </div>
                        </div>

                        <!-- 32. 產品序號管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>產品序號管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('產品序號管理系統作業準備中')"><span class="tree-leaf-doc">📄</span><span>產品序號建立作業</span></div></div>
                            </div>
                        </div>

                        <!-- 33. e-B Online 連結系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>e-B Online 連結系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('e-B Online 連結系統作業準備中')"><span class="tree-leaf-doc">📄</span><span>電子商務交換作業</span></div></div>
                            </div>
                        </div>

                        <!-- 34. E-BOM試產管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>E-BOM試產管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('E-BOM試產管理系統作業準備中')"><span class="tree-leaf-doc">📄</span><span>研發工程BOM作業</span></div></div>
                            </div>
                        </div>

                        <!-- 35. SPC整合系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>SPC整合系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('SPC整合系統作業準備中')"><span class="tree-leaf-doc">📄</span><span>統計製程管制設定</span></div></div>
                            </div>
                        </div>

                        <!-- 36. 海關合同保稅管理系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>海關合同保稅管理系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('海關合同保稅管理系統作業準備中')"><span class="tree-leaf-doc">📄</span><span>海關手冊資料建立作業</span></div></div>
                            </div>
                        </div>

                        <!-- 37. 稅控接口系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>稅控接口系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('稅控接口系統作業準備中')"><span class="tree-leaf-doc">📄</span><span>防偽稅控接口資料作業</span></div></div>
                            </div>
                        </div>

                        <!-- 38. 廠區生產追蹤系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>廠區生產追蹤系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('廠區生產追蹤系統作業準備中')"><span class="tree-leaf-doc">📄</span><span>車間工單報工與追蹤作業</span></div></div>
                            </div>
                        </div>

                        <!-- 39. 生產排程規劃系統 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>生產排程規劃系統</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('生產排程規劃系統作業準備中')"><span class="tree-leaf-doc">📄</span><span>甘特圖排程規劃作業</span></div></div>
                            </div>
                        </div>

                        <!-- 40. 行動條碼解決方案 -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>行動條碼解決方案</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('行動條碼解決方案作業準備中')"><span class="tree-leaf-doc">📄</span><span>行動盤點與條碼刷讀作業</span></div></div>
                            </div>
                        </div>

                        <!-- 41. 人事薪資管理系統(越南版) -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>人事薪資管理系統(越南版)</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('人事薪資管理系統(越南版)作業準備中')"><span class="tree-leaf-doc">📄</span><span>越南人事基本資料作業</span></div></div>
                            </div>
                        </div>

                        <!-- 42. 刷卡管理系統(越南版) -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>刷卡管理系統(越南版)</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('刷卡管理系統(越南版)作業準備中')"><span class="tree-leaf-doc">📄</span><span>越南刷卡出勤記錄作業</span></div></div>
                            </div>
                        </div>

                        <!-- 43. 增值稅管理系統(越南版) -->
                        <div class="tree-node folder-node collapsed">
                            <div class="tree-item-label" data-action="toggle-folder">
                                <span class="tree-arrow">&gt;</span>
                                <span class="tree-folder">📁</span>
                                <span>增值稅管理系統(越南版)</span>
                            </div>
                            <div class="tree-children" style="display:none;">
                                <div class="tree-node leaf-node"><div class="tree-item-label" onclick="alert('增值稅管理系統(越南版)作業準備中')"><span class="tree-leaf-doc">📄</span><span>越南增值稅發票申報作業</span></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Collapsible Splitter Handle between Sidebar and Canvas -->
        <div class="sidebar-splitter" id="sidebar-splitter" title="拖曳可調整寬度，點擊箭頭可收合/展開選單">
            <button class="sidebar-toggle-btn" id="sidebar-toggle-btn" title="收合左側選單">◀</button>
        </div>

        <!-- Right Canvas (Tabs: 流程圖, 監控檢核通知) -->
        <div class="canvas-wrapper">
            <div class="canvas-tabs">
                <button class="canvas-tab active" id="canvas-tab-flow" onclick="switchCanvasTab('flow')">流程圖</button>
                <button class="canvas-tab" id="canvas-tab-notice" onclick="switchCanvasTab('notice')">監控檢核通知</button>
                <button class="canvas-tab-aux" id="btn-flowchart-zoom" onclick="Flowcharts.toggleFit()" title="切換流程圖縮放大小">🔍 縮放符合螢幕</button>
            </div>

            <div class="canvas-body" id="canvas-body">
                <!-- Flowchart view layer -->
                <div id="flowchart-canvas-view" style="width:100%; height:100%;">
                    <!-- Rendered by Flowcharts.render('order') -->
                </div>

                <!-- Notifications view layer -->
                <div id="notice-canvas-view" style="display:none; padding:16px;">
                    <h3>監控檢核通知事項 (0 筆待辦)</h3>
                    <p style="color:#666; margin-top:8px;">目前無未處理之異常或檢核通知。</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Bottom Conductor Taskbar -->
    <div class="conductor-taskbar">
        <div class="taskbar-windows-list" id="taskbar-windows-list">
            <!-- Window taskbar buttons added dynamically -->
        </div>
        <div class="taskbar-status">
            <span>連線伺服器: 127.0.0.1 (XAMPP Apache + MySQL)</span> |
            <span>狀態: 正常</span>
        </div>
    </div>
</div>

<script src="assets/js/api.js?v=<?= filemtime(__DIR__ . '/assets/js/api.js') ?>"></script>
<script src="assets/js/flowcharts.js?v=<?= filemtime(__DIR__ . '/assets/js/flowcharts.js') ?>"></script>
<script src="assets/js/modules/core.js?v=<?= filemtime(__DIR__ . '/assets/js/modules/core.js') ?>"></script>
<script src="assets/js/modules/basic_data.js?v=<?= filemtime(__DIR__ . '/assets/js/modules/basic_data.js') ?>"></script>
<script src="assets/js/modules/sales.js?v=<?= filemtime(__DIR__ . '/assets/js/modules/sales.js') ?>"></script>
<script src="assets/js/modules/purchase.js?v=<?= filemtime(__DIR__ . '/assets/js/modules/purchase.js') ?>"></script>
<script src="assets/js/modules/system.js?v=<?= filemtime(__DIR__ . '/assets/js/modules/system.js') ?>"></script>
<script src="assets/js/modules.js?v=<?= filemtime(__DIR__ . '/assets/js/modules.js') ?>"></script>
<script src="assets/js/app.js?v=<?= filemtime(__DIR__ . '/assets/js/app.js') ?>"></script>

<script>
function switchCanvasTab(tab) {
    const fTab = document.getElementById('canvas-tab-flow');
    const nTab = document.getElementById('canvas-tab-notice');
    const fView = document.getElementById('flowchart-canvas-view');
    const nView = document.getElementById('notice-canvas-view');
    const zoomBtn = document.getElementById('btn-flowchart-zoom');

    if (tab === 'flow') {
        fTab.classList.add('active');
        nTab.classList.remove('active');
        fView.style.display = 'block';
        nView.style.display = 'none';
        if (zoomBtn) zoomBtn.style.display = '';
        if (typeof Flowcharts !== 'undefined' && Flowcharts.updateScale) {
            setTimeout(() => Flowcharts.updateScale(), 30);
        }
    } else {
        nTab.classList.add('active');
        fTab.classList.remove('active');
        fView.style.display = 'none';
        nView.style.display = 'block';
        if (zoomBtn) zoomBtn.style.display = 'none';
    }
}
</script>

</body>
</html>
