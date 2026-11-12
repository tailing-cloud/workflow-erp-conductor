<?php
// C:\xampp\htdocs\erp\config.php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$db_host = '127.0.0.1';
$db_user = 'root';
$db_pass = '';
$db_name = 'erp_db';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    // Return json error if API call
    if (strpos($_SERVER['REQUEST_URI'] ?? '', 'api.php') !== false) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()]);
        exit;
    }
    die('Database connection failed. Please ensure MySQL is running in XAMPP: ' . $e->getMessage());
}

function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function getCurrentUser() {
    return $_SESSION['erp_user'] ?? null;
}

function requireAuth() {
    if (!isset($_SESSION['erp_user'])) {
        jsonResponse(['success' => false, 'error' => '未登入或連線逾時，請重新登入'], 401);
    }
    return $_SESSION['erp_user'];
}

/**
 * 依「年4碼 + 月2碼 + 這個月第幾張單號3碼」規則產生單據流水號 (例如 202611001)
 * 依據不同帳號 (created_by) 獨立計算流水號
 */
function generateNextDocNo($pdo, $type, $date = null, $username = null) {
    if (!$date) $date = date('Y/m/d');
    $d = str_replace('-', '/', $date);
    $parts = explode('/', $d);
    if (count($parts) >= 2) {
        $yyyymm = sprintf('%04d%02d', (int)$parts[0], (int)$parts[1]);
    } else {
        $yyyymm = date('Ym');
    }

    if (!$username && isset($_SESSION['erp_user']['username'])) {
        $username = $_SESSION['erp_user']['username'];
    }

    $map = [
        'order'          => ['table' => 'erp_orders',          'col' => 'order_no'],
        'quotation'      => ['table' => 'erp_quotations',      'col' => 'quote_no'],
        'delivery'       => ['table' => 'erp_deliveries',      'col' => 'delivery_no'],
        'requisition'    => ['table' => 'erp_requisitions',    'col' => 'req_no'],
        'purchase_order' => ['table' => 'erp_purchase_orders', 'col' => 'po_no'],
        'goods_receipt'  => ['table' => 'erp_goods_receipts',  'col' => 'gr_no'],
    ];

    $cfg = $map[$type] ?? ['table' => 'erp_orders', 'col' => 'order_no'];
    $tbl = $cfg['table'];
    $col = $cfg['col'];

    if ($username) {
        $stmt = $pdo->prepare("SELECT `$col` FROM `$tbl` WHERE (`$col` LIKE ? OR `$col` LIKE ?) AND `created_by` = ?");
        $stmt->execute([$yyyymm . '%', '%' . $yyyymm . '%', $username]);
    } else {
        $stmt = $pdo->prepare("SELECT `$col` FROM `$tbl` WHERE (`$col` LIKE ? OR `$col` LIKE ?)");
        $stmt->execute([$yyyymm . '%', '%' . $yyyymm . '%']);
    }
    $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);

    $maxSeq = 0;
    foreach ($rows as $val) {
        $trimmed = trim($val);
        if (preg_match('/' . $yyyymm . '.*?(\d{3,4})$/', $trimmed, $m)) {
            $seq = (int)$m[1];
            if ($seq > $maxSeq) $maxSeq = $seq;
        } elseif (preg_match('/^' . $yyyymm . '(\d{3,4})$/', $trimmed, $m)) {
            $seq = (int)$m[1];
            if ($seq > $maxSeq) $maxSeq = $seq;
        }
    }

    $nextSeq = $maxSeq + 1;
    return $yyyymm . sprintf('%03d', $nextSeq);
}

/**
 * 固定預設種子資料（已寫死凍結為現有 6 筆客戶與 9 筆品號）：
 * 未來 B18 或其他帳號新增任何資料，都不會被複製或影響其他帳號。
 */
function ensureUserSeedData($pdo, $username) {
    if (empty($username) || $username === 'B18') return;

    try {
        $seedsFile = __DIR__ . '/default_seeds.json';
        if (!file_exists($seedsFile)) return;
        $seeds = json_decode(file_get_contents($seedsFile), true);
        if (!$seeds) return;

        // 1. 固定客戶預設資料（僅此 6 筆，若該帳號名下無客戶時匯入）
        $stmtC = $pdo->prepare("SELECT COUNT(*) FROM `erp_customers` WHERE `created_by` = ?");
        $stmtC->execute([$username]);
        if ((int)$stmtC->fetchColumn() === 0 && !empty($seeds['customers'])) {
            $custCols = [
                'customer_no', 'name_short', 'full_name', 'eng_name', 'version', 'approval_date', 'related_party_no',
                'boss', 'contact', 'tel1', 'tel2', 'fax', 'email', 'tax_id', 'capital', 'annual_sales', 'employee_count',
                'main_store_no', 'branch_count', 'currency', 'dept', 'sales_person', 'collector', 'open_date', 'close_date',
                'address', 'credit_limit'
            ];
            $colNames = implode(', ', array_map(function($c) { return "`$c`"; }, $custCols));
            $placeholders = implode(', ', array_fill(0, count($custCols) + 1, '?'));
            $sqlCust = "INSERT IGNORE INTO `erp_customers` ($colNames, `created_by`) VALUES ($placeholders)";
            $stmtInsertC = $pdo->prepare($sqlCust);
            foreach ($seeds['customers'] as $c) {
                $params = [];
                foreach ($custCols as $col) {
                    $params[] = $c[$col] ?? '';
                }
                $params[] = $username;
                $stmtInsertC->execute($params);
            }
        }

        // 2. 固定品號預設資料（僅此 9 筆，若該帳號缺少時補足）
        $stmtI = $pdo->prepare("SELECT COUNT(*) FROM `erp_items` WHERE `created_by` = ?");
        $stmtI->execute([$username]);
        if ((int)$stmtI->fetchColumn() === 0 && !empty($seeds['items'])) {
            $itemCols = [
                'item_no', 'item_name', 'item_spec', 'item_code', 'item_size', 'version', 'unit', 'small_unit', 'pack_unit',
                'stock_qty', 'stock_amount', 'unit_cost', 'std_price', 'retail_price', 'std_purchase_price', 'recent_purchase_price',
                'approval_date', 'main_warehouse', 'accounting_code', 'barcode', 'fixed_weight', 'pack_qty',
                'tax_std_pur', 'tax_std_sale', 'tax_recent_pur', 'recent_pur_ntd', 'tax_retail', 'tax_min_sale', 'min_sale_price',
                'customs_tax_rate', 'commodity_tax_rate', 'business_tax_rate',
                'tax_tier1', 'price_tier1', 'tax_tier2', 'price_tier2', 'tax_tier3', 'price_tier3', 'tax_tier4', 'price_tier4', 'tax_tier5', 'price_tier5', 'tax_tier6', 'price_tier6',
                'can_edit_spec', 'mat_code', 'sales_dept', 'prod_ctrl', 'issue_warehouse', 'prod_line', 'planner', 'pur_unit', 'sale_unit',
                'doc_code', 'tax_tariff', 'warranty_ratio', 'warranty_months', 'trace_code', 'einvoice_trace'
            ];
            $colNames = implode(', ', array_map(function($c) { return "`$c`"; }, $itemCols));
            $placeholders = implode(', ', array_fill(0, count($itemCols) + 1, '?'));
            $sqlItem = "INSERT IGNORE INTO `erp_items` ($colNames, `created_by`) VALUES ($placeholders)";
            $stmtInsertI = $pdo->prepare($sqlItem);
            foreach ($seeds['items'] as $it) {
                $params = [];
                foreach ($itemCols as $col) {
                    $params[] = $it[$col] ?? '';
                }
                $params[] = $username;
                $stmtInsertI->execute($params);
            }

            // 3. 固定品號庫別設定
            if (!empty($seeds['warehouses'])) {
                $whCols = ['item_no', 'wh_no', 'wh_name', 'wh_prop', 'plant', 'plant_name'];
                $whColNames = implode(', ', array_map(function($c) { return "`$c`"; }, $whCols));
                $whPlaceholders = implode(', ', array_fill(0, count($whCols) + 1, '?'));
                $sqlWh = "INSERT INTO `erp_item_warehouses` ($whColNames, `created_by`) VALUES ($whPlaceholders)";
                $stmtInsertWh = $pdo->prepare($sqlWh);
                foreach ($seeds['warehouses'] as $wh) {
                    $params = [];
                    foreach ($whCols as $col) {
                        $params[] = $wh[$col] ?? '';
                    }
                    $params[] = $username;
                    $stmtInsertWh->execute($params);
                }
            }
        }

        // 4. 固定供應廠商預設資料（B18 全域共用）
        $stmtS = $pdo->prepare("SELECT COUNT(*) FROM `erp_suppliers` WHERE `created_by` = ?");
        $stmtS->execute([$username]);
        if ((int)$stmtS->fetchColumn() === 0 && !empty($seeds['suppliers'])) {
            $suppCols = ['supplier_no', 'name_short', 'full_name', 'contact', 'tel', 'tax_id', 'currency'];
            $colNames = implode(', ', array_map(function($c) { return "`$c`"; }, $suppCols));
            $placeholders = implode(', ', array_fill(0, count($suppCols) + 1, '?'));
            $sqlSupp = "INSERT IGNORE INTO `erp_suppliers` ($colNames, `created_by`) VALUES ($placeholders)";
            $stmtInsertS = $pdo->prepare($sqlSupp);
            foreach ($seeds['suppliers'] as $s) {
                $params = [];
                foreach ($suppCols as $col) {
                    $params[] = $s[$col] ?? '';
                }
                $params[] = $username;
                $stmtInsertS->execute($params);
            }
        }

        // 確保進貨明細表欄位完整
        try {
            $pdo->exec("ALTER TABLE `erp_gr_details` ADD COLUMN `bill_qty` decimal(15,2) DEFAULT 0.00 AFTER `check_qty`");
        } catch (Exception $e) {}
        try {
            $pdo->exec("ALTER TABLE `erp_gr_details` ADD COLUMN `bill_unit` varchar(20) DEFAULT '' AFTER `unit`");
        } catch (Exception $e) {}
    } catch (Exception $e) {
        error_log("ensureUserSeedData error: " . $e->getMessage());
    }
}
