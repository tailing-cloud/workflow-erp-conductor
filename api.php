<?php
// C:\xampp\htdocs\erp\api.php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

/**
 * 依「年4碼 + 月2碼 + 這個月第幾張單號3碼」規則產生單據流水號 (例如 202611001)
 */
if (!function_exists('generateNextDocNo')) {
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
}

try {
    switch ($action) {

        // ==========================================
        // 1. AUTH & SESSION
        // ==========================================
        case 'login':
            $username = trim($input['username'] ?? '');
            $password = trim($input['password'] ?? '');
            $company = trim($input['company'] ?? '學生區B18');

            if (empty($username)) {
                jsonResponse(['success' => false, 'error' => '請輸入帳號']);
            }

            // Sync company: 只要帳號輸入，公司自動轉換學生區+帳號名
            if (empty($company) || $company === '學生區B18' || strpos($company, '學生區') === 0) {
                $company = '學生區' . $username;
            }

            // Ensure company exists in erp_companies
            if (!empty($company)) {
                $pdo->prepare("INSERT IGNORE INTO `erp_companies` (`code`, `name`) VALUES (?, ?)")
                    ->execute([$company, $company . ' - 練習公司']);
            }

            $stmt = $pdo->prepare("SELECT * FROM `erp_users` WHERE `username` = ? AND `is_active` = 1");
            $stmt->execute([$username]);
            $user = $stmt->fetch();

            if (!$user) {
                // Auto create new account if never seen before
                $displayName = '學生' . $username;
                $stmtIns = $pdo->prepare("INSERT INTO `erp_users` (`username`, `password`, `display_name`, `company`, `role`) VALUES (?, ?, ?, ?, 'student')");
                $stmtIns->execute([$username, $password ?: $username, $displayName, $company]);
                $stmt->execute([$username]);
                $user = $stmt->fetch();
            } else {
                // If user exists, check password if set
                if (!empty($user['password']) && !empty($password) && $user['password'] !== $password && !password_verify($password, $user['password'])) {
                    jsonResponse(['success' => false, 'error' => '密碼錯誤']);
                }
            }

            // Update user's active company
            if (!empty($company)) {
                $pdo->prepare("UPDATE `erp_users` SET `company` = ? WHERE `id` = ?")->execute([$company, $user['id']]);
                $user['company'] = $company;
            }

            // Ensure user has their own master data (customers, suppliers, items) initialized
            ensureUserSeedData($pdo, $username);

            unset($user['password']);
            $_SESSION['erp_user'] = $user;
            jsonResponse(['success' => true, 'user' => $user]);
            break;

        case 'logout':
            unset($_SESSION['erp_user']);
            session_destroy();
            jsonResponse(['success' => true]);
            break;

        case 'current_user':
            $u = getCurrentUser();
            jsonResponse(['success' => true, 'user' => $u]);
            break;

        // ==========================================
        // 2. USER & COMPANY MANAGEMENT (Admin Only)
        // ==========================================
        case 'get_users':
            $cur = requireAuth();
            if ($cur['role'] !== 'admin' && $cur['username'] !== 'admin') {
                jsonResponse(['success' => false, 'error' => '權限不足：只有系統管理員(admin)可操作帳號管理！'], 403);
            }
            $stmt = $pdo->query("SELECT `id`, `username`, `display_name`, `company`, `role`, `is_active`, `created_at` FROM `erp_users` ORDER BY `id` ASC");
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'save_user':
            $cur = requireAuth();
            if ($cur['role'] !== 'admin' && $cur['username'] !== 'admin') {
                jsonResponse(['success' => false, 'error' => '權限不足：只有系統管理員(admin)可操作帳號管理！'], 403);
            }
            $id = $input['id'] ?? null;
            $username = trim($input['username'] ?? '');
            $password = trim($input['password'] ?? '');
            $displayName = trim($input['display_name'] ?? '');
            $company = trim($input['company'] ?? '學生區B18');
            $role = trim($input['role'] ?? 'student');
            $isActive = isset($input['is_active']) ? (int)$input['is_active'] : 1;

            if (empty($username) || empty($displayName)) {
                jsonResponse(['success' => false, 'error' => '帳號與姓名不可空白']);
            }

            if ($id) {
                if (!empty($password)) {
                    $stmt = $pdo->prepare("UPDATE `erp_users` SET `username`=?, `password`=?, `display_name`=?, `company`=?, `role`=?, `is_active`=? WHERE `id`=?");
                    $stmt->execute([$username, $password, $displayName, $company, $role, $isActive, $id]);
                } else {
                    $stmt = $pdo->prepare("UPDATE `erp_users` SET `username`=?, `display_name`=?, `company`=?, `role`=?, `is_active`=? WHERE `id`=?");
                    $stmt->execute([$username, $displayName, $company, $role, $isActive, $id]);
                }
            } else {
                if (empty($password)) $password = $username;
                $stmt = $pdo->prepare("INSERT INTO `erp_users` (`username`, `password`, `display_name`, `company`, `role`, `is_active`) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([$username, $password, $displayName, $company, $role, $isActive]);
            }
            jsonResponse(['success' => true]);
            break;

        case 'delete_user':
            $cur = requireAuth();
            if ($cur['role'] !== 'admin' && $cur['username'] !== 'admin') {
                jsonResponse(['success' => false, 'error' => '權限不足：只有系統管理員(admin)可操作帳號管理！'], 403);
            }
            $id = (int)($input['id'] ?? 0);
            if ($id <= 0) jsonResponse(['success' => false, 'error' => '無效的用戶ID']);
            $pdo->prepare("DELETE FROM `erp_users` WHERE `id`=?")->execute([$id]);
            jsonResponse(['success' => true]);
            break;

        case 'get_suppliers':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            ensureUserSeedData($pdo, $uname);
            // B18 供應廠商全部共用
            $stmt = $pdo->prepare("SELECT * FROM `erp_suppliers` WHERE `created_by` = ? OR `created_by` = 'B18' GROUP BY `supplier_no` ORDER BY `supplier_no` ASC");
            $stmt->execute([$uname]);
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'get_supplier':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $sNo = $_GET['supplier_no'] ?? '';
            $stmt = $pdo->prepare("SELECT * FROM `erp_suppliers` WHERE `supplier_no` = ? AND (`created_by` = ? OR `created_by` = 'B18') ORDER BY (`created_by` = ?) DESC LIMIT 1");
            $stmt->execute([$sNo, $uname, $uname]);
            $sRow = $stmt->fetch();
            if (!$sRow) {
                $stmtAny = $pdo->prepare("SELECT * FROM `erp_suppliers` WHERE `supplier_no` = ? LIMIT 1");
                $stmtAny->execute([$sNo]);
                $sRow = $stmtAny->fetch();
            }
            jsonResponse(['success' => true, 'supplier' => $sRow]);
            break;

        case 'save_supplier':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $sNo = trim($input['supplier_no'] ?? '');
            $sShort = trim($input['name_short'] ?? '');
            $sFull = trim($input['full_name'] ?? '');
            $contact = trim($input['contact'] ?? '');
            $tel = trim($input['tel'] ?? '');
            $taxId = trim($input['tax_id'] ?? '');
            $currency = trim($input['currency'] ?? 'NTD');

            if (empty($sNo)) {
                jsonResponse(['success' => false, 'error' => '請輸入廠商代號']);
            }

            $stmt = $pdo->prepare("INSERT INTO `erp_suppliers` 
                (`supplier_no`, `name_short`, `full_name`, `contact`, `tel`, `tax_id`, `currency`, `created_by`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                `name_short`=VALUES(`name_short`), `full_name`=VALUES(`full_name`), `contact`=VALUES(`contact`),
                `tel`=VALUES(`tel`), `tax_id`=VALUES(`tax_id`), `currency`=VALUES(`currency`)");
            $stmt->execute([$sNo, $sShort, $sFull, $contact, $tel, $taxId, $currency, $uname]);

            // 同步維護 B18 基礎資料庫
            if ($uname !== 'B18') {
                $stmtB18 = $pdo->prepare("INSERT INTO `erp_suppliers` 
                    (`supplier_no`, `name_short`, `full_name`, `contact`, `tel`, `tax_id`, `currency`, `created_by`)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'B18')
                    ON DUPLICATE KEY UPDATE 
                    `name_short`=VALUES(`name_short`), `full_name`=VALUES(`full_name`), `contact`=VALUES(`contact`),
                    `tel`=VALUES(`tel`), `tax_id`=VALUES(`tax_id`), `currency`=VALUES(`currency`)");
                $stmtB18->execute([$sNo, $sShort, $sFull, $contact, $tel, $taxId, $currency]);
            }

            jsonResponse(['success' => true]);
            break;

        case 'delete_supplier':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $sNo = trim($input['supplier_no'] ?? '');
            if (!empty($sNo)) {
                $pdo->prepare("DELETE FROM `erp_suppliers` WHERE `supplier_no` = ? AND `created_by` = ?")->execute([$sNo, $uname]);
                if ($uname === 'admin' || $uname === 'B18') {
                    $pdo->prepare("DELETE FROM `erp_suppliers` WHERE `supplier_no` = ?")->execute([$sNo]);
                }
            }
            jsonResponse(['success' => true]);
            break;

        case 'nav_supplier':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $dir = $_GET['dir'] ?? 'first';
            $cur = $_GET['current'] ?? '';
            $row = null;
            $sub = "SELECT * FROM `erp_suppliers` WHERE `created_by` = ? OR `created_by` = 'B18' GROUP BY `supplier_no`";
            if ($dir === 'first') {
                $stmt = $pdo->prepare("SELECT * FROM ($sub) t ORDER BY `supplier_no` ASC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($dir === 'last') {
                $stmt = $pdo->prepare("SELECT * FROM ($sub) t ORDER BY `supplier_no` DESC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($dir === 'prev') {
                $stmt = $pdo->prepare("SELECT * FROM ($sub) t WHERE `supplier_no` < ? ORDER BY `supplier_no` DESC LIMIT 1");
                $stmt->execute([$uname, $cur]);
                $row = $stmt->fetch();
            } elseif ($dir === 'next') {
                $stmt = $pdo->prepare("SELECT * FROM ($sub) t WHERE `supplier_no` > ? ORDER BY `supplier_no` ASC LIMIT 1");
                $stmt->execute([$uname, $cur]);
                $row = $stmt->fetch();
            }
            if (!$row && $cur) {
                $stmt = $pdo->prepare("SELECT * FROM ($sub) t WHERE `supplier_no` = ? LIMIT 1");
                $stmt->execute([$uname, $cur]);
                $row = $stmt->fetch();
            }
            jsonResponse(['success' => true, 'data' => $row]);
            break;

        case 'confirm_doc':
            $cur = requireAuth();
            $uname = $cur['username'];
            $type = $input['type'] ?? '';
            $docNo = $input['doc_no'] ?? '';
            $status = $input['status'] ?? '已確認';
            $confirmUser = ($status === '已確認') ? $cur['username'] : '';

            if ($type === 'order') {
                $pdo->prepare("UPDATE `erp_orders` SET `status`=?, `confirm_user`=? WHERE `order_no`=? AND `created_by`=?")->execute([$status, $confirmUser, $docNo, $uname]);
            } elseif ($type === 'requisition') {
                $isLocked = ($status === '已確認') ? 1 : 0;
                $pdo->prepare("UPDATE `erp_requisitions` SET `status`=?, `is_locked`=?, `confirm_user`=? WHERE `req_no`=? AND `created_by`=?")->execute([$status, $isLocked, $confirmUser, $docNo, $uname]);
            } elseif ($type === 'purchase_order') {
                $pdo->prepare("UPDATE `erp_purchase_orders` SET `status`=?, `confirm_user`=? WHERE `po_no`=? AND `created_by`=?")->execute([$status, $confirmUser, $docNo, $uname]);
            } elseif ($type === 'delivery') {
                $pdo->prepare("UPDATE `erp_deliveries` SET `status`=?, `confirm_user`=? WHERE `delivery_no`=? AND `created_by`=?")->execute([$status, $confirmUser, $docNo, $uname]);
            } elseif ($type === 'goods_receipt') {
                $pdo->prepare("UPDATE `erp_goods_receipts` SET `status`=?, `confirm_user`=? WHERE `gr_no`=? AND `created_by`=?")->execute([$status, $confirmUser, $docNo, $uname]);
            } elseif ($type === 'quotation') {
                $pdo->prepare("UPDATE `erp_quotations` SET `status`=?, `confirm_user`=? WHERE `quote_no`=? AND `created_by`=?")->execute([$status, $confirmUser, $docNo, $uname]);
            }
            jsonResponse(['success' => true, 'status' => $status, 'message' => ($status === '已確認' ? '單據已完成確認！' : '單據已取消確認狀態！')]);
            break;

        case 'toggle_cust_confirm':
            $cur = requireAuth();
            $uname = $cur['username'];
            $quoteNo = $input['quote_no'] ?? '';
            $confirmed = !empty($input['confirmed']) ? 1 : 0;
            if ($quoteNo) {
                $pdo->prepare("UPDATE `erp_quotations` SET `customer_confirmed`=? WHERE `quote_no`=? AND `created_by`=?")->execute([$confirmed, $quoteNo, $uname]);
            }
            jsonResponse(['success' => true, 'customer_confirmed' => $confirmed, 'message' => ($confirmed ? '客戶確認狀態已變更為【已確認】' : '客戶確認狀態已【取消確認】')]);
            break;

        case 'get_companies':
            $stmt = $pdo->query("SELECT * FROM `erp_companies` ORDER BY `code` ASC");
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        // ==========================================
        // SCREENSHOT MASTER LOOKUP DATA & SERIAL GENERATION
        // ==========================================
        case 'get_next_doc_no':
            $u = getCurrentUser();
            $uname = $u['username'] ?? null;
            $type = trim($_GET['type'] ?? 'order');
            $date = trim($_GET['date'] ?? date('Y/m/d'));
            $nextNo = generateNextDocNo($pdo, $type, $date, $uname);
            jsonResponse(['success' => true, 'doc_no' => $nextNo, 'type' => $type, 'date' => $date]);
            break;

        case 'get_doc_types':
            $category = trim($_GET['category'] ?? '');
            if ($category !== '') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_doc_types` WHERE `category` = ? ORDER BY `code` ASC");
                $stmt->execute([$category]);
            } else {
                $stmt = $pdo->query("SELECT * FROM `erp_doc_types` ORDER BY `code` ASC");
            }
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'get_item_categories':
            $stmt = $pdo->query("SELECT * FROM `erp_item_categories` ORDER BY `code` ASC");
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'get_warehouses':
            $stmt = $pdo->query("SELECT * FROM `erp_warehouses` ORDER BY `wh_no` ASC");
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'get_factories':
            $stmt = $pdo->query("SELECT * FROM `erp_factories` ORDER BY `factory_no` ASC");
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'get_employees':
            $stmt = $pdo->query("SELECT * FROM `erp_employees` ORDER BY `emp_no` ASC");
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'get_employee':
            $empNo = trim($_GET['emp_no'] ?? '');
            $stmt = $pdo->prepare("SELECT * FROM `erp_employees` WHERE `emp_no` = ? LIMIT 1");
            $stmt->execute([$empNo]);
            $emp = $stmt->fetch();
            jsonResponse(['success' => true, 'employee' => $emp]);
            break;

        case 'reset_demo_data':
            requireAuth();
            // Re-run init_db.php logic
            include __DIR__ . '/init_db.php';
            jsonResponse(['success' => true, 'message' => '示範資料已成功重置為預設狀態']);
            break;

        // ==========================================
        // 3. CUSTOMER MASTER (COPI01)
        // ==========================================
        case 'get_next_customer_no':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $stmt = $pdo->prepare("SELECT MAX(CAST(customer_no AS UNSIGNED)) as max_no FROM `erp_customers` WHERE `customer_no` REGEXP '^[0-9]+$' AND `created_by` = ?");
            $stmt->execute([$uname]);
            $row = $stmt->fetch();
            $nextNo = ($row && $row['max_no']) ? ((int)$row['max_no'] + 1) : 1001;
            jsonResponse(['success' => true, 'next_no' => sprintf('%04d', $nextNo)]);
            break;

        case 'get_next_item_no':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            ensureUserSeedData($pdo, $uname);
            $stmt = $pdo->prepare("SELECT MAX(CAST(item_no AS UNSIGNED)) as max_no FROM `erp_items` WHERE `item_no` REGEXP '^9[0-9]{5}$' AND `created_by` = ?");
            $stmt->execute([$uname]);
            $row = $stmt->fetch();
            $nextNo = ($row && $row['max_no']) ? ((int)$row['max_no'] + 1) : 900001;
            jsonResponse(['success' => true, 'next_no' => sprintf('%06d', $nextNo)]);
            break;

        case 'get_customers':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            ensureUserSeedData($pdo, $uname);
            $q = trim($_GET['q'] ?? '');
            if ($q !== '') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_customers` WHERE (`customer_no` LIKE ? OR `name_short` LIKE ? OR `full_name` LIKE ?) AND `created_by` = ? ORDER BY `customer_no` ASC");
                $stmt->execute(["%$q%", "%$q%", "%$q%", $uname]);
            } else {
                $stmt = $pdo->prepare("SELECT * FROM `erp_customers` WHERE `created_by` = ? ORDER BY `customer_no` ASC");
                $stmt->execute([$uname]);
            }
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'get_customer':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            ensureUserSeedData($pdo, $uname);
            $custNo = trim($_GET['customer_no'] ?? '');
            $stmt = $pdo->prepare("SELECT * FROM `erp_customers` WHERE `customer_no` = ? AND `created_by` = ?");
            $stmt->execute([$custNo, $uname]);
            $row = $stmt->fetch();
            if (!$row) jsonResponse(['success' => false, 'error' => '查無此客戶資料']);
            jsonResponse(['success' => true, 'data' => $row]);
            break;

        case 'save_customer':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $custNo = trim($input['customer_no'] ?? '');
            if (empty($custNo)) {
                $stmt = $pdo->prepare("SELECT MAX(CAST(customer_no AS UNSIGNED)) as max_no FROM `erp_customers` WHERE `customer_no` REGEXP '^[0-9]+$' AND `created_by` = ?");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
                $nextNo = ($row && $row['max_no']) ? ((int)$row['max_no'] + 1) : 1001;
                $custNo = sprintf('%04d', $nextNo);
            }

            $taxCode = trim($input['tax_code'] ?? 'S05');
            if (empty($taxCode)) {
                jsonResponse(['success' => false, 'error' => '稅別碼為必填欄位！'], 400);
            }

            $fields = [
                'name_short' => $input['name_short'] ?? '',
                'full_name' => $input['full_name'] ?? '',
                'eng_name' => $input['eng_name'] ?? '',
                'version' => $input['version'] ?? '1',
                'approval_date' => $input['approval_date'] ?? date('Y/m/d'),
                'related_party_no' => $input['related_party_no'] ?? '',
                'boss' => $input['boss'] ?? '',
                'contact' => $input['contact'] ?? '',
                'tel1' => $input['tel1'] ?? '',
                'tel2' => $input['tel2'] ?? '',
                'fax' => $input['fax'] ?? '',
                'email' => $input['email'] ?? '',
                'tax_id' => $input['tax_id'] ?? '',
                'capital' => (float)($input['capital'] ?? 0),
                'annual_sales' => (float)($input['annual_sales'] ?? 0),
                'employee_count' => (int)($input['employee_count'] ?? 0),
                'main_store_no' => $input['main_store_no'] ?? '',
                'branch_count' => (int)($input['branch_count'] ?? 0),
                'currency' => $input['currency'] ?? 'NTD',
                'dept' => $input['dept'] ?? '0100 業務部',
                'sales_person' => trim($input['sales_person'] ?? ''),
                'collector' => trim($input['collector'] ?? ''),
                'open_date' => $input['open_date'] ?? '',
                'close_date' => $input['close_date'] ?? '',
                'address' => $input['reg_addr'] ?? ($input['address'] ?? ''),
                'reg_zip' => $input['reg_zip'] ?? '',
                'reg_addr' => $input['reg_addr'] ?? ($input['address'] ?? ''),
                'reg_addr2' => $input['reg_addr2'] ?? '',
                'inv_zip' => $input['inv_zip'] ?? '',
                'inv_addr' => $input['inv_addr'] ?? '',
                'inv_addr2' => $input['inv_addr2'] ?? '',
                'deliv_zip' => $input['deliv_zip'] ?? '',
                'deliv_addr' => $input['deliv_addr'] ?? '',
                'deliv_addr2' => $input['deliv_addr2'] ?? '',
                'bill_zip' => $input['bill_zip'] ?? '',
                'bill_recipient' => $input['bill_recipient'] ?? '',
                'bill_addr' => $input['bill_addr'] ?? '',
                'bill_addr2' => $input['bill_addr2'] ?? '',
                'credit_limit' => (float)($input['credit_limit'] ?? 5000000),
                'tax_calc_type' => $input['tax_calc_type'] ?? '1',
                'invoice_with_goods' => !empty($input['invoice_with_goods']) ? 1 : 0,
                'sales_rating' => $input['sales_rating'] ?? '',
                'credit_rating' => $input['credit_rating'] ?? '',
                'deposit_rate' => isset($input['deposit_rate']) && $input['deposit_rate'] !== '' ? (float)$input['deposit_rate'] : null,
                'price_term' => $input['price_term'] ?? '',
                'payment_term' => $input['payment_term'] ?? '',
                'send_ebc' => !empty($input['send_ebc']) ? 1 : 0,
                'ebc_app_no' => $input['ebc_app_no'] ?? '',
                'customs_type' => $input['customs_type'] ?? '1',
                'doc_send_method' => $input['doc_send_method'] ?? '',
                'bill_delivery' => $input['bill_delivery'] ?? '',
                'pay_method' => $input['pay_method'] ?? '',
                'tax_code' => $taxCode,
                'invoice_copies' => $input['invoice_copies'] ?? '',
                'tax_type' => $input['tax_type'] ?? '',
                'income_defer_days' => (int)($input['income_defer_days'] ?? 0),
                'created_by' => $uname
            ];

            // Check existence
            $stmt = $pdo->prepare("SELECT `customer_no` FROM `erp_customers` WHERE `customer_no` = ? AND `created_by` = ?");
            $stmt->execute([$custNo, $uname]);
            if ($stmt->fetch()) {
                // Update
                $sql = "UPDATE `erp_customers` SET ";
                $params = [];
                foreach ($fields as $k => $v) {
                    $sql .= "`$k` = ?, ";
                    $params[] = $v;
                }
                $sql = rtrim($sql, ', ') . " WHERE `customer_no` = ? AND `created_by` = ?";
                $params[] = $custNo;
                $params[] = $uname;
                $pdo->prepare($sql)->execute($params);
            } else {
                // Insert
                $cols = array_merge(['customer_no'], array_keys($fields));
                $vals = array_merge([$custNo], array_values($fields));
                $placeholders = implode(',', array_fill(0, count($cols), '?'));
                $colStr = '`' . implode('`,`', $cols) . '`';
                $sql = "INSERT INTO `erp_customers` ($colStr) VALUES ($placeholders)";
                $pdo->prepare($sql)->execute($vals);
            }
            jsonResponse(['success' => true, 'customer_no' => $custNo]);
            break;

        case 'delete_customer':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $custNo = trim($input['customer_no'] ?? '');
            $pdo->prepare("DELETE FROM `erp_customers` WHERE `customer_no` = ? AND `created_by` = ?")->execute([$custNo, $uname]);
            jsonResponse(['success' => true]);
            break;

        case 'nav_customer':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            ensureUserSeedData($pdo, $uname);
            $dir = $_GET['dir'] ?? 'first';
            $cur = $_GET['current'] ?? '';
            $row = null;
            if ($dir === 'first') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_customers` WHERE `created_by` = ? ORDER BY `customer_no` ASC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($dir === 'last') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_customers` WHERE `created_by` = ? ORDER BY `customer_no` DESC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($dir === 'prev') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_customers` WHERE `customer_no` < ? AND `created_by` = ? ORDER BY `customer_no` DESC LIMIT 1");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            } elseif ($dir === 'next') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_customers` WHERE `customer_no` > ? AND `created_by` = ? ORDER BY `customer_no` ASC LIMIT 1");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            }
            if (!$row && $cur) {
                // fallback to current
                $stmt = $pdo->prepare("SELECT * FROM `erp_customers` WHERE `customer_no` = ? AND `created_by` = ?");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            }
            jsonResponse(['success' => true, 'data' => $row]);
            break;

        // ==========================================
        // 4. ITEM MASTER (INVI02)
        // ==========================================
        case 'get_items':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            ensureUserSeedData($pdo, $uname);
            $q = trim($_GET['q'] ?? '');
            if ($q !== '') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_items` WHERE (`item_no` LIKE ? OR `item_name` LIKE ? OR `item_spec` LIKE ?) AND `created_by` = ? ORDER BY `item_no` ASC");
                $stmt->execute(["%$q%", "%$q%", "%$q%", $uname]);
            } else {
                $stmt = $pdo->prepare("SELECT * FROM `erp_items` WHERE `created_by` = ? ORDER BY `item_no` ASC");
                $stmt->execute([$uname]);
            }
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'get_item':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            ensureUserSeedData($pdo, $uname);
            $itemNo = trim($_GET['item_no'] ?? '');
            $stmt = $pdo->prepare("SELECT * FROM `erp_items` WHERE `item_no` = ? AND `created_by` = ?");
            $stmt->execute([$itemNo, $uname]);
            $row = $stmt->fetch();
            if (!$row) jsonResponse(['success' => false, 'error' => '查無此品號資料']);
            $stmtWh = $pdo->prepare("SELECT * FROM `erp_item_warehouses` WHERE `item_no` = ? AND `created_by` = ? ORDER BY `id` ASC");
            $stmtWh->execute([$itemNo, $uname]);
            $row['warehouses'] = $stmtWh->fetchAll();
            jsonResponse(['success' => true, 'data' => $row]);
            break;

        case 'save_item':
            requireAuth();
            $itemNo = trim($input['item_no'] ?? '');
            if (empty($itemNo)) jsonResponse(['success' => false, 'error' => '請輸入品號']);

            $fields = [
                'item_name' => $input['item_name'] ?? '',
                'item_spec' => $input['item_spec'] ?? '',
                'item_code' => $input['item_code'] ?? '',
                'item_size' => $input['item_size'] ?? '',
                'barcode' => $input['barcode'] ?? '',
                'version' => $input['version'] ?? '',
                'unit' => $input['unit'] ?? '',
                'small_unit' => $input['small_unit'] ?? '',
                'pack_unit' => $input['pack_unit'] ?? '',
                'fixed_weight' => !empty($input['fixed_weight']) ? 1 : 0,
                'pack_qty' => (float)($input['pack_qty'] ?? 0),
                'stock_qty' => (float)($input['stock_qty'] ?? 0),
                'stock_amount' => (float)($input['stock_amount'] ?? 0),
                'unit_cost' => (float)($input['unit_cost'] ?? 0),

                // 價格標籤 (售價頁籤) 欄位
                'tax_std_pur' => !empty($input['tax_std_pur']) ? 1 : 0,
                'std_purchase_price' => (float)($input['std_purchase_price'] ?? 0),
                'tax_std_sale' => !empty($input['tax_std_sale']) ? 1 : 0,
                'std_price' => (float)($input['std_price'] ?? 0),
                'tax_recent_pur' => !empty($input['tax_recent_pur']) ? 1 : 0,
                'recent_purchase_price' => (float)($input['recent_purchase_price'] ?? 0),
                'recent_pur_ntd' => (float)($input['recent_pur_ntd'] ?? 0),
                'tax_retail' => !empty($input['tax_retail']) ? 1 : 0,
                'retail_price' => (float)($input['retail_price'] ?? 0),
                'tax_min_sale' => !empty($input['tax_min_sale']) ? 1 : 0,
                'min_sale_price' => (float)($input['min_sale_price'] ?? 0),

                'customs_tax_rate' => (float)($input['customs_tax_rate'] ?? 0),
                'commodity_tax_rate' => (float)($input['commodity_tax_rate'] ?? 0),
                'business_tax_rate' => isset($input['business_tax_rate']) && $input['business_tax_rate'] !== '' ? (float)$input['business_tax_rate'] : 5.00,

                'tax_tier1' => !empty($input['tax_tier1']) ? 1 : 0,
                'price_tier1' => (float)($input['price_tier1'] ?? 0),
                'tax_tier2' => !empty($input['tax_tier2']) ? 1 : 0,
                'price_tier2' => (float)($input['price_tier2'] ?? 0),
                'tax_tier3' => !empty($input['tax_tier3']) ? 1 : 0,
                'price_tier3' => (float)($input['price_tier3'] ?? 0),
                'tax_tier4' => !empty($input['tax_tier4']) ? 1 : 0,
                'price_tier4' => (float)($input['price_tier4'] ?? 0),
                'tax_tier5' => !empty($input['tax_tier5']) ? 1 : 0,
                'price_tier5' => (float)($input['price_tier5'] ?? 0),
                'tax_tier6' => !empty($input['tax_tier6']) ? 1 : 0,
                'price_tier6' => (float)($input['price_tier6'] ?? 0),

                'approval_date' => $input['approval_date'] ?? '',
                'main_warehouse' => $input['main_warehouse'] ?? '',
                'accounting_code' => !empty($input['accounting_code']) ? $input['accounting_code'] : '01',

                // 基本資料1 擴充欄位 (1:1 擷取5)
                'can_edit_spec' => !empty($input['can_edit_spec']) ? 1 : 0,
                'mat_code' => $input['mat_code'] ?? '',
                'sales_dept' => $input['sales_dept'] ?? '',
                'prod_ctrl' => $input['prod_ctrl'] ?? '',
                'issue_warehouse' => $input['issue_warehouse'] ?? '',
                'prod_line' => $input['prod_line'] ?? '',
                'planner' => $input['planner'] ?? '',
                'pur_unit' => $input['pur_unit'] ?? '',
                'sale_unit' => $input['sale_unit'] ?? '',
                'doc_code' => $input['doc_code'] ?? '',
                'tax_tariff' => $input['tax_tariff'] ?? '',
                'warranty_ratio' => (float)($input['warranty_ratio'] ?? 0),
                'warranty_months' => (int)($input['warranty_months'] ?? 0),
                'trace_code' => $input['trace_code'] ?? '',
                'einvoice_trace' => !empty($input['einvoice_trace']) ? 1 : 0
            ];

            $curUser = requireAuth();
            $uname = $curUser['username'];
            $fields['created_by'] = $uname;

            $stmt = $pdo->prepare("SELECT `item_no` FROM `erp_items` WHERE `item_no` = ? AND `created_by` = ?");
            $stmt->execute([$itemNo, $uname]);
            if ($stmt->fetch()) {
                $sql = "UPDATE `erp_items` SET ";
                $params = [];
                foreach ($fields as $k => $v) {
                    $sql .= "`$k` = ?, ";
                    $params[] = $v;
                }
                $sql = rtrim($sql, ', ') . " WHERE `item_no` = ? AND `created_by` = ?";
                $params[] = $itemNo;
                $params[] = $uname;
                $pdo->prepare($sql)->execute($params);
            } else {
                $cols = array_merge(['item_no'], array_keys($fields));
                $vals = array_merge([$itemNo], array_values($fields));
                $placeholders = implode(',', array_fill(0, count($cols), '?'));
                $colStr = '`' . implode('`,`', $cols) . '`';
                $sql = "INSERT INTO `erp_items` ($colStr) VALUES ($placeholders)";
                $pdo->prepare($sql)->execute($vals);
            }

            // Save warehouses if provided
            if (isset($input['warehouses']) && is_array($input['warehouses'])) {
                $pdo->prepare("DELETE FROM `erp_item_warehouses` WHERE `item_no` = ? AND `created_by` = ?")->execute([$itemNo, $uname]);
                $insWh = $pdo->prepare("INSERT INTO `erp_item_warehouses` (`item_no`, `wh_no`, `wh_name`, `wh_prop`, `plant`, `plant_name`, `created_by`) VALUES (?, ?, ?, ?, ?, ?, ?)");
                foreach ($input['warehouses'] as $w) {
                    if (!empty($w['wh_no'])) {
                        $insWh->execute([
                            $itemNo,
                            $w['wh_no'],
                            $w['wh_name'] ?? '',
                            $w['wh_prop'] ?? '1:存貨倉',
                            $w['plant'] ?? 'TP01',
                            $w['plant_name'] ?? '製造一廠',
                            $uname
                        ]);
                    }
                }
            }
            jsonResponse(['success' => true, 'item_no' => $itemNo]);
            break;

        case 'delete_item':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $itemNo = trim($input['item_no'] ?? '');
            $pdo->prepare("DELETE FROM `erp_items` WHERE `item_no` = ? AND `created_by` = ?")->execute([$itemNo, $uname]);
            $pdo->prepare("DELETE FROM `erp_item_warehouses` WHERE `item_no` = ? AND `created_by` = ?")->execute([$itemNo, $uname]);
            jsonResponse(['success' => true]);
            break;

        case 'nav_item':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            ensureUserSeedData($pdo, $uname);
            $dir = $_GET['dir'] ?? 'first';
            $cur = $_GET['current'] ?? '';
            $row = null;
            if ($dir === 'first') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_items` WHERE `created_by` = ? ORDER BY `item_no` ASC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($dir === 'last') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_items` WHERE `created_by` = ? ORDER BY `item_no` DESC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($dir === 'prev') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_items` WHERE `item_no` < ? AND `created_by` = ? ORDER BY `item_no` DESC LIMIT 1");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            } elseif ($dir === 'next') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_items` WHERE `item_no` > ? AND `created_by` = ? ORDER BY `item_no` ASC LIMIT 1");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            }
            if (!$row && $cur) {
                $stmt = $pdo->prepare("SELECT * FROM `erp_items` WHERE `item_no` = ? AND `created_by` = ?");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            }
            if ($row) {
                $stmtWh = $pdo->prepare("SELECT * FROM `erp_item_warehouses` WHERE `item_no` = ? AND `created_by` = ? ORDER BY `id` ASC");
                $stmtWh->execute([$row['item_no'], $uname]);
                $row['warehouses'] = $stmtWh->fetchAll();
            }
            jsonResponse(['success' => true, 'data' => $row]);
            break;

        // ==========================================
        // 5. QUOTATION (COPI05)
        // ==========================================
        case 'get_quotations':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $stmt = $pdo->prepare("SELECT * FROM `erp_quotations` WHERE `created_by` = ? ORDER BY `quote_no` DESC");
            $stmt->execute([$uname]);
            $quotes = $stmt->fetchAll();

            // 若有合計金額為0但單身明細有金額之歷史資料，自動補算並同步回寫資料表
            foreach ($quotes as &$q) {
                if ((float)($q['grand_total'] ?? 0) == 0) {
                    $stmtD = $pdo->prepare("SELECT SUM(amount) as tot_amt, SUM(qty) as tot_qty FROM `erp_quotation_details` WHERE `quote_no` = ? AND `created_by` = ?");
                    $stmtD->execute([$q['quote_no'], $uname]);
                    $rowD = $stmtD->fetch();
                    if ($rowD && (float)$rowD['tot_amt'] > 0) {
                        $amt = (float)$rowD['tot_amt'];
                        $taxType = $q['tax_type'] ?? '1';
                        $rate = (float)($q['tax_rate'] ?? 5.0);
                        if (strpos($taxType, '2') !== false || strpos($taxType, '外加') !== false) {
                            $tax = round($amt * ($rate / 100), 2);
                            $grand = $amt + $tax;
                            $quoteAmt = $amt;
                        } else {
                            $tax = round($amt - ($amt / (1 + $rate / 100)), 2);
                            $grand = $amt;
                            $quoteAmt = $amt;
                        }
                        $q['quote_amount'] = number_format($quoteAmt, 2, '.', '');
                        $q['tax_amount'] = number_format($tax, 2, '.', '');
                        $q['grand_total'] = number_format($grand, 2, '.', '');
                        $q['total_qty'] = number_format((float)$rowD['tot_qty'], 2, '.', '');
                        $pdo->prepare("UPDATE `erp_quotations` SET `quote_amount`=?, `tax_amount`=?, `grand_total`=?, `total_qty`=? WHERE `quote_no`=? AND `created_by`=?")
                            ->execute([$quoteAmt, $tax, $grand, (float)$rowD['tot_qty'], $q['quote_no'], $uname]);
                    }
                }
            }
            unset($q);

            jsonResponse(['success' => true, 'data' => $quotes]);
            break;

        case 'get_quotation':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $quoteNo = trim($_GET['quote_no'] ?? $_GET['quotation_no'] ?? $_GET['doc_no'] ?? '');

            // 1. Exact match with user
            $stmt = $pdo->prepare("SELECT * FROM `erp_quotations` WHERE `quote_no` = ? AND `created_by` = ?");
            $stmt->execute([$quoteNo, $uname]);
            $header = $stmt->fetch();

            // 2. Strip prefix if contains hyphen
            if (!$header && strpos($quoteNo, '-') !== false) {
                $strippedNo = substr($quoteNo, strpos($quoteNo, '-') + 1);
                $stmt = $pdo->prepare("SELECT * FROM `erp_quotations` WHERE `quote_no` = ? AND `created_by` = ?");
                $stmt->execute([$strippedNo, $uname]);
                $header = $stmt->fetch();
                if ($header) $quoteNo = $strippedNo;
            }

            // 3. Match with prefix wildcard
            if (!$header) {
                $stmt = $pdo->prepare("SELECT * FROM `erp_quotations` WHERE `quote_no` LIKE ? AND `created_by` = ? LIMIT 1");
                $stmt->execute(['%-' . $quoteNo, $uname]);
                $header = $stmt->fetch();
                if ($header) $quoteNo = $header['quote_no'];
            }

            // 4. Global fallback without created_by check
            if (!$header) {
                $stmt = $pdo->prepare("SELECT * FROM `erp_quotations` WHERE `quote_no` = ? OR `quote_no` LIKE ? LIMIT 1");
                $stmt->execute([$quoteNo, '%-' . $quoteNo]);
                $header = $stmt->fetch();
                if ($header) $quoteNo = $header['quote_no'];
            }

            if (!$header) jsonResponse(['success' => false, 'error' => "查無此報價單【{$quoteNo}】資料"]);

            $targetUser = $header['created_by'] ?? $uname;
            $stmtD = $pdo->prepare("SELECT * FROM `erp_quotation_details` WHERE `quote_no` = ? AND `created_by` = ? ORDER BY `line_no` ASC");
            $stmtD->execute([$quoteNo, $targetUser]);
            $details = $stmtD->fetchAll();
            if (empty($details)) {
                $stmtD = $pdo->prepare("SELECT * FROM `erp_quotation_details` WHERE `quote_no` = ? ORDER BY `line_no` ASC");
                $stmtD->execute([$quoteNo]);
                $details = $stmtD->fetchAll();
            }

            jsonResponse(['success' => true, 'header' => $header, 'quotation' => $header, 'requisition' => $header, 'details' => $details]);
            break;

        case 'save_quotation':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $header = $input['header'] ?? [];
            $details = $input['details'] ?? [];
            $quoteNo = trim($header['quote_no'] ?? '');
            if (empty($quoteNo)) {
                $quoteNo = generateNextDocNo($pdo, 'quotation', $header['doc_date'] ?? date('Y/m/d'), $uname);
            }

            // Insert/Update header
            $stmtH = $pdo->prepare("INSERT INTO `erp_quotations` 
                (`quote_no`, `quote_type`, `doc_date`, `quote_date`, `effective_date`, `expiry_date`, `version`, `customer_confirmed`, `confirm_user`, `customer_no`, `customer_name`, `tax_type`, `tax_code`, `currency`, `exchange_rate`, `sales_person`, `tax_rate`, `quote_amount`, `tax_amount`, `grand_total`, `total_qty`, `status`, `created_by`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                `doc_date`=VALUES(`doc_date`), `quote_date`=VALUES(`quote_date`), `effective_date`=VALUES(`effective_date`), `expiry_date`=VALUES(`expiry_date`), `customer_confirmed`=VALUES(`customer_confirmed`), `customer_no`=VALUES(`customer_no`), `customer_name`=VALUES(`customer_name`), `tax_type`=VALUES(`tax_type`), `tax_code`=VALUES(`tax_code`), `tax_rate`=VALUES(`tax_rate`), `sales_person`=VALUES(`sales_person`), `currency`=VALUES(`currency`), `exchange_rate`=VALUES(`exchange_rate`), `quote_amount`=VALUES(`quote_amount`), `tax_amount`=VALUES(`tax_amount`), `grand_total`=VALUES(`grand_total`), `total_qty`=VALUES(`total_qty`), `status`=VALUES(`status`), `created_by`=VALUES(`created_by`)");
            
            // Calculate totals if missing or 0
            $quoteAmount = isset($header['quote_amount']) ? (float)$header['quote_amount'] : 0;
            $taxAmount = isset($header['tax_amount']) ? (float)$header['tax_amount'] : 0;
            $grandTotal = isset($header['grand_total']) ? (float)$header['grand_total'] : 0;
            $totalQty = isset($header['total_qty']) ? (float)$header['total_qty'] : 0;

            if ($grandTotal == 0 && !empty($details)) {
                $calcAmt = 0;
                $calcQty = 0;
                foreach ($details as $d) {
                    $q = (float)($d['qty'] ?? 0);
                    $p = (float)($d['unit_price'] ?? $d['price'] ?? 0);
                    $lineAmt = isset($d['amount']) && (float)$d['amount'] > 0 ? (float)$d['amount'] : ($q * $p);
                    $calcAmt += $lineAmt;
                    $calcQty += $q;
                }
                $taxRate = isset($header['tax_rate']) ? (float)$header['tax_rate'] : 5.0;
                $taxTypeStr = $header['tax_type'] ?? '1';
                $isInclusive = (strpos($taxTypeStr, '1') !== false || strpos($taxTypeStr, '內含') !== false);
                $isExclusive = (strpos($taxTypeStr, '2') !== false || strpos($taxTypeStr, '外加') !== false);
                if ($isInclusive) {
                    $taxAmount = round($calcAmt - ($calcAmt / (1 + $taxRate / 100)), 2);
                    $quoteAmount = $calcAmt;
                    $grandTotal = $calcAmt;
                } elseif ($isExclusive) {
                    $taxAmount = round($calcAmt * ($taxRate / 100), 2);
                    $quoteAmount = $calcAmt;
                    $grandTotal = $calcAmt + $taxAmount;
                } else {
                    $taxAmount = 0;
                    $quoteAmount = $calcAmt;
                    $grandTotal = $calcAmt;
                }
                if ($totalQty == 0) $totalQty = $calcQty;
            }

            $stmtH->execute([
                $quoteNo,
                $header['quote_type'] ?? 'A211',
                $header['doc_date'] ?? date('Y/m/d'),
                $header['quote_date'] ?? date('Y/m/d'),
                $header['effective_date'] ?? ($header['doc_date'] ?? date('Y/m/d')),
                $header['expiry_date'] ?? '',
                $header['version'] ?? '1',
                isset($header['customer_confirmed']) ? (int)$header['customer_confirmed'] : 1,
                $header['confirm_user'] ?? $uname,
                $header['customer_no'] ?? '',
                $header['customer_name'] ?? '',
                $header['tax_type'] ?? '1:應稅內含',
                $header['tax_code'] ?? 'S01',
                $header['currency'] ?? 'NTD',
                $header['exchange_rate'] ?? 1.0,
                $header['sales_person'] ?? $uname,
                $header['tax_rate'] ?? 5.0,
                $quoteAmount,
                $taxAmount,
                $grandTotal,
                $totalQty,
                $header['status'] ?? '已確認',
                $uname
            ]);

            // Save details
            $pdo->prepare("DELETE FROM `erp_quotation_details` WHERE `quote_no` = ? AND `created_by` = ?")->execute([$quoteNo, $uname]);
            $stmtD = $pdo->prepare("INSERT INTO `erp_quotation_details` (`quote_no`, `line_no`, `biz_item_no`, `item_no`, `item_name`, `item_spec`, `qty`, `unit`, `unit_price`, `amount`, `delivery_date`, `effective_date`, `expiry_date`, `created_by`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $lineIdx = 1;
            foreach ($details as $d) {
                $lineNo = sprintf('%04d', $lineIdx++);
                $stmtD->execute([
                    $quoteNo,
                    $lineNo,
                    $d['biz_item_no'] ?? '',
                    $d['item_no'] ?? '',
                    $d['item_name'] ?? '',
                    $d['item_spec'] ?? '',
                    (float)($d['qty'] ?? 0),
                    $d['unit'] ?? '台',
                    (float)($d['unit_price'] ?? $d['price'] ?? 0),
                    (float)($d['amount'] ?? 0),
                    $d['delivery_date'] ?? date('Y/m/d'),
                    $d['effective_date'] ?? ($header['effective_date'] ?? date('Y/m/d')),
                    $d['expiry_date'] ?? ($header['expiry_date'] ?? ''),
                    $uname
                ]);
            }

            jsonResponse(['success' => true, 'quote_no' => $quoteNo]);
            break;

        case 'delete_quotation':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $quoteNo = trim($input['quote_no'] ?? '');
            $pdo->prepare("DELETE FROM `erp_quotations` WHERE `quote_no` = ? AND `created_by` = ?")->execute([$quoteNo, $uname]);
            $pdo->prepare("DELETE FROM `erp_quotation_details` WHERE `quote_no` = ? AND `created_by` = ?")->execute([$quoteNo, $uname]);
            jsonResponse(['success' => true]);
            break;

        case 'nav_quotation':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $dir = $_GET['dir'] ?? 'first';
            $cur = $_GET['current'] ?? '';
            $row = null;
            if ($dir === 'first') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_quotations` WHERE `created_by` = ? ORDER BY `quote_no` ASC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($dir === 'last') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_quotations` WHERE `created_by` = ? ORDER BY `quote_no` DESC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($dir === 'prev') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_quotations` WHERE `quote_no` < ? AND `created_by` = ? ORDER BY `quote_no` DESC LIMIT 1");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            } elseif ($dir === 'next') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_quotations` WHERE `quote_no` > ? AND `created_by` = ? ORDER BY `quote_no` ASC LIMIT 1");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            }
            if (!$row && $cur) {
                $stmt = $pdo->prepare("SELECT * FROM `erp_quotations` WHERE `quote_no` = ? AND `created_by` = ?");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            }
            $details = [];
            if ($row) {
                $stmtD = $pdo->prepare("SELECT * FROM `erp_quotation_details` WHERE `quote_no` = ? AND `created_by` = ? ORDER BY `line_no` ASC");
                $stmtD->execute([$row['quote_no'], $uname]);
                $details = $stmtD->fetchAll();
            }
            jsonResponse(['success' => true, 'data' => $row, 'details' => $details]);
            break;

        // ==========================================
        // 6. CUSTOMER ORDERS (COPI06)
        // ==========================================
        case 'get_orders':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $stmt = $pdo->prepare("SELECT * FROM `erp_orders` WHERE `created_by` = ? ORDER BY `order_no` DESC");
            $stmt->execute([$uname]);
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'get_order':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $orderNo = trim($_GET['order_no'] ?? '');

            // 1. Exact match with user
            $stmt = $pdo->prepare("SELECT * FROM `erp_orders` WHERE `order_no` = ? AND `created_by` = ?");
            $stmt->execute([$orderNo, $uname]);
            $header = $stmt->fetch();

            // 2. Strip prefix if contains hyphen (e.g. user selected C221-202611002, but order_no is 202611002)
            if (!$header && strpos($orderNo, '-') !== false) {
                $strippedNo = substr($orderNo, strpos($orderNo, '-') + 1);
                $stmt = $pdo->prepare("SELECT * FROM `erp_orders` WHERE `order_no` = ? AND `created_by` = ?");
                $stmt->execute([$strippedNo, $uname]);
                $header = $stmt->fetch();
                if ($header) $orderNo = $strippedNo;
            }

            // 3. Match with prefix wildcard (e.g. orderNo is 202611001, but DB has A221-202611001)
            if (!$header) {
                $stmt = $pdo->prepare("SELECT * FROM `erp_orders` WHERE `order_no` LIKE ? AND `created_by` = ? LIMIT 1");
                $stmt->execute(['%-' . $orderNo, $uname]);
                $header = $stmt->fetch();
                if ($header) $orderNo = $header['order_no'];
            }

            // 4. Global fallback without created_by check
            if (!$header) {
                $stmt = $pdo->prepare("SELECT * FROM `erp_orders` WHERE `order_no` = ? LIMIT 1");
                $stmt->execute([$orderNo]);
                $header = $stmt->fetch();
            }
            if (!$header && strpos($orderNo, '-') !== false) {
                $strippedNo = substr($orderNo, strpos($orderNo, '-') + 1);
                $stmt = $pdo->prepare("SELECT * FROM `erp_orders` WHERE `order_no` = ? LIMIT 1");
                $stmt->execute([$strippedNo]);
                $header = $stmt->fetch();
                if ($header) $orderNo = $strippedNo;
            }
            if (!$header) {
                $stmt = $pdo->prepare("SELECT * FROM `erp_orders` WHERE `order_no` LIKE ? LIMIT 1");
                $stmt->execute(['%-' . $orderNo]);
                $header = $stmt->fetch();
                if ($header) $orderNo = $header['order_no'];
            }

            if (!$header) jsonResponse(['success' => false, 'error' => "查無客戶訂單【{$orderNo}】之資料"]);

            $targetUser = $header['created_by'] ?? $uname;
            $stmtD = $pdo->prepare("SELECT * FROM `erp_order_details` WHERE `order_no` = ? AND `created_by` = ? ORDER BY `line_no` ASC");
            $stmtD->execute([$orderNo, $targetUser]);
            $details = $stmtD->fetchAll();
            if (empty($details)) {
                $stmtD = $pdo->prepare("SELECT * FROM `erp_order_details` WHERE `order_no` = ? ORDER BY `line_no` ASC");
                $stmtD->execute([$orderNo]);
                $details = $stmtD->fetchAll();
            }

            jsonResponse(['success' => true, 'header' => $header, 'order' => $header, 'details' => $details]);
            break;

        case 'save_order':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $header = $input['header'] ?? [];
            $details = $input['details'] ?? [];
            $orderNo = trim($header['order_no'] ?? '');
            $orderType = trim($header['order_type'] ?? 'A221');

            if (empty($orderNo)) {
                $orderNo = generateNextDocNo($pdo, 'order', $header['doc_date'] ?? date('Y/m/d'), $uname);
            }

            // Customer name auto-fill if empty
            if (empty($header['customer_name']) && !empty($header['customer_no'])) {
                $cStmt = $pdo->prepare("SELECT `full_name` FROM `erp_customers` WHERE `customer_no`=? AND `created_by`=?");
                $cStmt->execute([$header['customer_no'], $uname]);
                $cRow = $cStmt->fetch();
                if ($cRow) $header['customer_name'] = $cRow['full_name'];
            }

            $stmtH = $pdo->prepare("INSERT INTO `erp_orders` 
                (`order_no`, `order_type`, `doc_date`, `order_date`, `customer_no`, `customer_name`, `version`, `flow_code`, `defer_days`, `credit_control`, `transfer_status`, `confirm_user`, `ebo_status`, `dept`, `sales_person`, `factory`, `currency`, `exchange_rate`, `tax_code`, `tax_type`, `tax_rate`, `order_amount`, `order_tax`, `grand_total`, `total_qty`, `total_weight`, `total_volume`, `status`, `cust_po`, `deposit_batch`, `deposit_rate`, `payment_term`, `price_term`, `multi_tax`, `send_count`, `print_count`, `sign_status`, `created_by`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                `doc_date`=VALUES(`doc_date`), `order_date`=VALUES(`order_date`), `customer_no`=VALUES(`customer_no`), `customer_name`=VALUES(`customer_name`), `version`=VALUES(`version`), `flow_code`=VALUES(`flow_code`), `defer_days`=VALUES(`defer_days`), `credit_control`=VALUES(`credit_control`), `transfer_status`=VALUES(`transfer_status`), `confirm_user`=VALUES(`confirm_user`), `ebo_status`=VALUES(`ebo_status`), `dept`=VALUES(`dept`), `sales_person`=VALUES(`sales_person`), `factory`=VALUES(`factory`), `currency`=VALUES(`currency`), `exchange_rate`=VALUES(`exchange_rate`), `tax_code`=VALUES(`tax_code`), `tax_type`=VALUES(`tax_type`), `tax_rate`=VALUES(`tax_rate`), `order_amount`=VALUES(`order_amount`), `order_tax`=VALUES(`order_tax`), `grand_total`=VALUES(`grand_total`), `total_qty`=VALUES(`total_qty`), `total_weight`=VALUES(`total_weight`), `total_volume`=VALUES(`total_volume`), `status`=VALUES(`status`), `cust_po`=VALUES(`cust_po`), `deposit_batch`=VALUES(`deposit_batch`), `deposit_rate`=VALUES(`deposit_rate`), `payment_term`=VALUES(`payment_term`), `price_term`=VALUES(`price_term`), `multi_tax`=VALUES(`multi_tax`), `send_count`=VALUES(`send_count`), `print_count`=VALUES(`print_count`), `sign_status`=VALUES(`sign_status`), `created_by`=VALUES(`created_by`)");

            $stmtH->execute([
                $orderNo,
                $orderType,
                $header['doc_date'] ?? date('Y/m/d'),
                $header['order_date'] ?? date('Y/m/d'),
                $header['customer_no'] ?? '',
                $header['customer_name'] ?? '',
                $header['version'] ?? '1',
                $header['flow_code'] ?? '',
                (int)($header['defer_days'] ?? 0),
                isset($header['credit_control']) ? (int)$header['credit_control'] : 0,
                $header['transfer_status'] ?? '',
                $header['confirm_user'] ?? $uname,
                $header['ebo_status'] ?? '不需拋轉',
                $header['dept'] ?? '0100',
                $header['sales_person'] ?? $uname,
                $header['factory'] ?? '01',
                $header['currency'] ?? 'NTD',
                $header['exchange_rate'] ?? 1.0,
                $header['tax_code'] ?? 'S05',
                $header['tax_type'] ?? '2:應稅外加',
                $header['tax_rate'] ?? 5.0,
                $header['order_amount'] ?? 0,
                $header['order_tax'] ?? 0,
                $header['grand_total'] ?? 0,
                $header['total_qty'] ?? 0,
                $header['total_weight'] ?? 0,
                $header['total_volume'] ?? 0,
                $header['status'] ?? '已確認',
                $header['cust_po'] ?? '',
                isset($header['deposit_batch']) ? (int)$header['deposit_batch'] : 0,
                (float)($header['deposit_rate'] ?? 0),
                $header['payment_term'] ?? '',
                $header['price_term'] ?? '',
                isset($header['multi_tax']) ? (int)$header['multi_tax'] : 0,
                (int)($header['send_count'] ?? 0),
                (int)($header['print_count'] ?? 0),
                $header['sign_status'] ?? 'N:不執行電子簽核',
                $uname
            ]);

            // Save details
            $pdo->prepare("DELETE FROM `erp_order_details` WHERE `order_no` = ? AND `created_by` = ?")->execute([$orderNo, $uname]);
            $stmtD = $pdo->prepare("INSERT INTO `erp_order_details` (`order_no`, `line_no`, `biz_item_no`, `item_no`, `item_name`, `item_spec`, `order_qty`, `unit`, `unit_price`, `amount`, `est_delivery_date`, `warehouse`, `delivered_qty`, `created_by`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $lineIdx = 1;
            foreach ($details as $d) {
                $lineNo = sprintf('%04d', $lineIdx++);
                $orderQty = (float)($d['order_qty'] ?? $d['qty'] ?? 0);
                $unitPrice = (float)($d['unit_price'] ?? $d['price'] ?? 0);
                $stmtD->execute([
                    $orderNo,
                    $lineNo,
                    $d['biz_item_no'] ?? '',
                    $d['item_no'] ?? '',
                    $d['item_name'] ?? '',
                    $d['item_spec'] ?? '',
                    $orderQty,
                    $d['unit'] ?? '台',
                    $unitPrice,
                    (float)($d['amount'] ?? ($orderQty * $unitPrice)),
                    $d['est_delivery_date'] ?? $d['date'] ?? date('Y/m/d'),
                    $d['warehouse'] ?? $d['wh'] ?? 'W01',
                    (float)($d['delivered_qty'] ?? 0),
                    $uname
                ]);
            }

            jsonResponse(['success' => true, 'order_no' => $orderNo]);
            break;

        case 'delete_order':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $orderNo = trim($input['order_no'] ?? '');
            $pdo->prepare("DELETE FROM `erp_orders` WHERE `order_no` = ? AND `created_by` = ?")->execute([$orderNo, $uname]);
            $pdo->prepare("DELETE FROM `erp_order_details` WHERE `order_no` = ? AND `created_by` = ?")->execute([$orderNo, $uname]);
            jsonResponse(['success' => true]);
            break;

        case 'nav_order':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $dir = $_GET['dir'] ?? 'first';
            $cur = $_GET['current'] ?? '';
            $row = null;
            if ($dir === 'first') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_orders` WHERE `created_by` = ? ORDER BY `order_no` ASC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($dir === 'last') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_orders` WHERE `created_by` = ? ORDER BY `order_no` DESC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($dir === 'prev') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_orders` WHERE `order_no` < ? AND `created_by` = ? ORDER BY `order_no` DESC LIMIT 1");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            } elseif ($dir === 'next') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_orders` WHERE `order_no` > ? AND `created_by` = ? ORDER BY `order_no` ASC LIMIT 1");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            }
            if (!$row && $cur) {
                $stmt = $pdo->prepare("SELECT * FROM `erp_orders` WHERE `order_no` = ? AND `created_by` = ?");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            }
            if ($row) {
                $stmtD = $pdo->prepare("SELECT * FROM `erp_order_details` WHERE `order_no` = ? AND `created_by` = ? ORDER BY `line_no` ASC");
                $stmtD->execute([$row['order_no'], $uname]);
                $row['details'] = $stmtD->fetchAll();
            }
            jsonResponse(['success' => true, 'data' => $row]);
            break;

        // ==========================================
        // 7. BATCH ORDER TO REQUISITION (COPB10 - 擷取8.PNG)
        // ==========================================
        case 'batch_order_to_req':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $factory = trim($input['factory'] ?? '');
            $orderNo = trim($input['order_no'] ?? '');
            $reqType = trim($input['req_type'] ?? 'C311');
            $reqDate = trim($input['req_date'] ?? date('Y/m/d'));
            $reqUser = trim($input['req_user'] ?? '');
            $supplierMode = trim($input['supplier_mode'] ?? '品號之主供應商');
            $calcMode = trim($input['calc_mode'] ?? '依訂單預交日減');
            $leadDays = (int)($input['lead_days'] ?? 1);

            if (empty($factory)) {
                jsonResponse(['success' => false, 'error' => '請選擇廠別（如 TP01、TY01）']);
            }
            if (empty($reqUser)) {
                jsonResponse(['success' => false, 'error' => '請挑選或輸入請購人員']);
            }

            if (empty($orderNo)) {
                // If not specific order, pick the latest confirmed order for this user
                $stmt = $pdo->prepare("SELECT `order_no` FROM `erp_orders` WHERE `status` = '已確認' AND `created_by` = ? ORDER BY `order_no` DESC LIMIT 1");
                $stmt->execute([$uname]);
                $r = $stmt->fetch();
                if ($r) $orderNo = $r['order_no'];
                else jsonResponse(['success' => false, 'error' => '請選擇或輸入欲轉單的訂單單號']);
            }

            // Fetch order and details
            $stmt = $pdo->prepare("SELECT * FROM `erp_orders` WHERE `order_no` = ? AND `created_by` = ?");
            $stmt->execute([$orderNo, $uname]);
            $order = $stmt->fetch();
            if (!$order) jsonResponse(['success' => false, 'error' => '查無指定訂單']);

            $stmtD = $pdo->prepare("SELECT * FROM `erp_order_details` WHERE `order_no` = ? AND `created_by` = ?");
            $stmtD->execute([$orderNo, $uname]);
            $orderItems = $stmtD->fetchAll();

            // Generate new Requisition No: e.g. C311-202611002
            $cleanNo = preg_replace('/^[A-Z0-9]+-/', '', $orderNo);
            $reqNo = $reqType . '-' . $cleanNo;

            // Calculate totals
            $totalQty = 0;
            $totalAmount = 0;
            foreach ($orderItems as $it) {
                $totalQty += (float)$it['order_qty'];
                // purchase price from item master
                $itemStmt = $pdo->prepare("SELECT `std_purchase_price` FROM `erp_items` WHERE `item_no` = ? AND `created_by` = ?");
                $itemStmt->execute([$it['item_no'], $uname]);
                $iMaster = $itemStmt->fetch();
                $purPrice = $iMaster ? (float)$iMaster['std_purchase_price'] : (float)$it['unit_price'] * 0.8;
                $totalAmount += $purPrice * (float)$it['order_qty'];
            }

            // Insert Requisition (狀態為未確認，等待在 PURI05 審核確認)
            $stmtR = $pdo->prepare("INSERT INTO `erp_requisitions`
                (`req_no`, `req_type`, `doc_date`, `req_date`, `factory`, `dept`, `req_user`, `source_type`, `source_no`, `confirm_user`, `sign_status`, `is_locked`, `status`, `total_qty`, `total_amount`, `remark`, `created_by`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '', '核准', 0, '未確認', ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `total_qty`=VALUES(`total_qty`), `total_amount`=VALUES(`total_amount`), `status`='未確認', `is_locked`=0, `confirm_user`='', `created_by`=VALUES(`created_by`)");
            $stmtR->execute([
                $reqNo, $reqType, $reqDate, $reqDate, $factory, '0100 業務部', $reqUser, '訂單轉請購', $orderNo, $totalQty, $totalAmount, '由作業COPB10批次產生', $uname
            ]);

            // Insert Requisition Details
            $pdo->prepare("DELETE FROM `erp_requisition_details` WHERE `req_no` = ? AND `created_by` = ?")->execute([$reqNo, $uname]);
            $stmtRD = $pdo->prepare("INSERT INTO `erp_requisition_details`
                (`req_no`, `line_no`, `item_no`, `item_name`, `item_spec`, `req_qty`, `unit`, `warehouse`, `unit_price`, `amount`, `po_qty`, `pur_qty`, `pur_unit`, `pur_price`, `pur_amount`, `pricing_qty`, `pricing_unit`, `req_user`, `created_by`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?)");
            
            foreach ($orderItems as $idx => $it) {
                $itemStmt = $pdo->prepare("SELECT `std_purchase_price` FROM `erp_items` WHERE `item_no` = ? AND `created_by` = ?");
                $itemStmt->execute([$it['item_no'], $uname]);
                $iMaster = $itemStmt->fetch();
                $purPrice = $iMaster ? (float)$iMaster['std_purchase_price'] : 4200;
                $lineAmt = $purPrice * (float)$it['order_qty'];

                $stmtRD->execute([
                    $reqNo,
                    $it['line_no'] ?: sprintf('%04d', $idx + 1),
                    $it['item_no'],
                    $it['item_name'],
                    $it['item_spec'],
                    $it['order_qty'],
                    $it['unit'],
                    $it['warehouse'] ?: 'W01',
                    $purPrice,
                    $lineAmt,
                    $it['order_qty'],
                    $it['unit'] ?: '台',
                    $purPrice,
                    $lineAmt,
                    $it['order_qty'],
                    $it['unit'] ?: '台',
                    $reqUser,
                    $uname
                ]);
            }

            // Update order transfer status
            $pdo->prepare("UPDATE `erp_orders` SET `transfer_status` = '已轉出' WHERE `order_no` = ? AND `created_by` = ?")->execute([$orderNo, $uname]);

            // Add Job to erp_batch_queue (擷取18.PNG)
            $jobId = date('Ymd') . sprintf('%06d', rand(1, 99999));
            $nowTime = date('Y/n/j 下午 h:i:s');
            $filterParams = "選擇廠別: $factory\n選擇訂單單號: $orderNo\n輸入請購單別: $reqType\n輸入請購日期: $reqDate\n選擇廠商: $supplierMode\n輸入請購人員: $reqUser\n需求日計算: $calcMode $leadDays 天";
            $resultLog = "後端程式版號:4.0.17.1;$reqNo; Commits: 1 Records, RollBacks: 0 Records;";

            $stmtQ = $pdo->prepare("INSERT INTO `erp_batch_queue`
                (`job_id`, `job_name`, `process_mode`, `est_time`, `status`, `operator`, `start_time`, `end_time`, `filter_params`, `result_log`, `created_by`)
                VALUES (?, '訂單轉請購單複製作業', '依佇列順序', ?, '已完成', 'WIN-S7UJO0KFN', ?, ?, ?, ?, ?)");
            $stmtQ->execute([$jobId, $nowTime, $nowTime, $nowTime, $filterParams, $resultLog, $uname]);

            jsonResponse([
                'success' => true,
                'message' => '訂單已成功複製產生請購單！',
                'req_no' => $reqNo,
                'job_id' => $jobId,
                'result_log' => $resultLog
            ]);
            break;

        // ==========================================
        // 8. REQUISITIONS (PURI05 / PURI06)
        // ==========================================
        case 'get_requisitions':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $stmt = $pdo->prepare("SELECT * FROM `erp_requisitions` WHERE `created_by` = ? ORDER BY `req_no` DESC");
            $stmt->execute([$uname]);
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'get_requisition':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $reqNo = trim($_GET['req_no'] ?? '');
            $stmt = $pdo->prepare("SELECT * FROM `erp_requisitions` WHERE `req_no` = ? AND `created_by` = ?");
            $stmt->execute([$reqNo, $uname]);
            $header = $stmt->fetch();
            if (!$header) jsonResponse(['success' => false, 'error' => '查無此請購單']);

            $stmtD = $pdo->prepare("SELECT * FROM `erp_requisition_details` WHERE `req_no` = ? AND `created_by` = ? ORDER BY `line_no` ASC");
            $stmtD->execute([$reqNo, $uname]);
            $details = $stmtD->fetchAll();

            jsonResponse(['success' => true, 'header' => $header, 'quotation' => $header, 'requisition' => $header, 'details' => $details]);
            break;

        case 'save_requisition':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $header = $input['header'] ?? [];
            $details = $input['details'] ?? [];
            $reqNo = trim($header['req_no'] ?? '');
            $reqType = trim($header['req_type'] ?? 'C311');

            if (empty($reqNo)) {
                $reqNo = generateNextDocNo($pdo, 'requisition', $header['doc_date'] ?? date('Y/m/d'), $uname);
            }

            $stmtH = $pdo->prepare("INSERT INTO `erp_requisitions`
                (`req_no`, `req_type`, `doc_date`, `req_date`, `factory`, `dept`, `req_user`, `source_type`, `source_no`, `confirm_user`, `sign_status`, `is_locked`, `status`, `total_qty`, `total_amount`, `remark`, `version`, `print_count`, `send_count`, `ebc_no`, `ebc_ver`, `created_by`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                `doc_date`=VALUES(`doc_date`), `req_date`=VALUES(`req_date`), `factory`=VALUES(`factory`), `dept`=VALUES(`dept`), `req_user`=VALUES(`req_user`), `source_type`=VALUES(`source_type`), `source_no`=VALUES(`source_no`), `sign_status`=VALUES(`sign_status`), `is_locked`=VALUES(`is_locked`), `status`=VALUES(`status`), `total_qty`=VALUES(`total_qty`), `total_amount`=VALUES(`total_amount`), `remark`=VALUES(`remark`), `version`=VALUES(`version`), `print_count`=VALUES(`print_count`), `send_count`=VALUES(`send_count`), `ebc_no`=VALUES(`ebc_no`), `ebc_ver`=VALUES(`ebc_ver`), `created_by`=VALUES(`created_by`)");

            $stmtH->execute([
                $reqNo,
                $reqType,
                $header['doc_date'] ?? date('Y/m/d'),
                $header['req_date'] ?? date('Y/m/d'),
                $header['factory'] ?? '01',
                $header['dept'] ?? '0100 業務部',
                $header['req_user'] ?? $uname,
                $header['source_type'] ?? '手動建立',
                $header['source_no'] ?? '',
                $header['confirm_user'] ?? $uname,
                $header['sign_status'] ?? 'N:不執行電子簽核',
                isset($header['is_locked']) ? (int)$header['is_locked'] : 1,
                $header['status'] ?? '已確認',
                (float)($header['total_qty'] ?? 0),
                (float)($header['total_amount'] ?? 0),
                $header['remark'] ?? '',
                $header['version'] ?? '1',
                (int)($header['print_count'] ?? 0),
                (int)($header['send_count'] ?? 0),
                $header['ebc_no'] ?? '',
                $header['ebc_ver'] ?? '',
                $uname
            ]);

            $pdo->prepare("DELETE FROM `erp_requisition_details` WHERE `req_no` = ? AND `created_by` = ?")->execute([$reqNo, $uname]);
            $stmtD = $pdo->prepare("INSERT INTO `erp_requisition_details` (`req_no`, `line_no`, `item_no`, `item_name`, `item_spec`, `req_qty`, `unit`, `warehouse`, `unit_price`, `amount`, `require_date`, `po_qty`, `created_by`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $lineIdx = 1;
            foreach ($details as $d) {
                $lineNo = sprintf('%04d', $lineIdx++);
                $stmtD->execute([
                    $reqNo,
                    $lineNo,
                    $d['item_no'] ?? '',
                    $d['item_name'] ?? '',
                    $d['item_spec'] ?? '',
                    (float)($d['req_qty'] ?? ($d['qty'] ?? 0)),
                    $d['unit'] ?? '台',
                    $d['warehouse'] ?? ($d['wh'] ?? 'P003'),
                    (float)($d['unit_price'] ?? ($d['price'] ?? 0)),
                    (float)($d['amount'] ?? 0),
                    $d['require_date'] ?? ($d['date'] ?? date('Y/m/d')),
                    (float)($d['po_qty'] ?? 0),
                    $uname
                ]);
            }

            jsonResponse(['success' => true, 'req_no' => $reqNo]);
            break;

        case 'delete_requisition':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $reqNo = trim($input['req_no'] ?? '');
            $pdo->prepare("DELETE FROM `erp_requisitions` WHERE `req_no` = ? AND `created_by` = ?")->execute([$reqNo, $uname]);
            $pdo->prepare("DELETE FROM `erp_requisition_details` WHERE `req_no` = ? AND `created_by` = ?")->execute([$reqNo, $uname]);
            jsonResponse(['success' => true]);
            break;

        case 'nav_requisition':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $pos = $_GET['pos'] ?? 'first';
            $cur = $_GET['current'] ?? '';
            $row = null;
            if ($pos === 'first') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_requisitions` WHERE `created_by` = ? ORDER BY `req_no` ASC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($pos === 'last') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_requisitions` WHERE `created_by` = ? ORDER BY `req_no` DESC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($pos === 'prev') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_requisitions` WHERE `req_no` < ? AND `created_by` = ? ORDER BY `req_no` DESC LIMIT 1");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            } elseif ($pos === 'next') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_requisitions` WHERE `req_no` > ? AND `created_by` = ? ORDER BY `req_no` ASC LIMIT 1");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            }
            if (!$row && $cur) {
                $stmt = $pdo->prepare("SELECT * FROM `erp_requisitions` WHERE `req_no` = ? AND `created_by` = ?");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            }
            if ($row) {
                $sDetails = $pdo->prepare("SELECT * FROM `erp_requisition_details` WHERE `req_no` = ? AND `created_by` = ? ORDER BY `line_no` ASC");
                $sDetails->execute([$row['req_no'], $uname]);
                jsonResponse(['success' => true, 'requisition' => $row, 'details' => $sDetails->fetchAll()]);
            } else {
                jsonResponse(['success' => false, 'error' => '查無請購單']);
            }
            break;

        case 'get_puri06_list':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $stmt = $pdo->prepare("SELECT d.*, r.doc_date, r.req_date, r.req_type, r.factory, r.dept, r.status as req_status, r.is_locked as req_is_locked, r.req_user as header_req_user 
                FROM `erp_requisition_details` d 
                JOIN `erp_requisitions` r ON d.req_no = r.req_no AND r.created_by = d.created_by
                WHERE d.created_by = ? AND r.status = '已確認'
                ORDER BY d.req_no DESC, d.line_no ASC");
            $stmt->execute([$uname]);
            $rows = $stmt->fetchAll();
            foreach ($rows as &$r) {
                if (empty($r['req_user']) && !empty($r['header_req_user'])) {
                    $r['req_user'] = $r['header_req_user'];
                }
                if (!empty($r['req_user'])) {
                    $eStmt = $pdo->prepare("SELECT `emp_name` FROM `erp_employees` WHERE `emp_no` = ? LIMIT 1");
                    $eStmt->execute([$r['req_user']]);
                    $eRow = $eStmt->fetch();
                    $r['req_user_name'] = $eRow ? $eRow['emp_name'] : $r['req_user'];
                }
            }
            jsonResponse(['success' => true, 'data' => $rows]);
            break;

        case 'get_puri06_detail':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $reqNo = trim($_GET['req_no'] ?? '');
            $lineNo = trim($_GET['line_no'] ?? '0001');
            $id = (int)($_GET['id'] ?? 0);
            if ($id > 0) {
                $stmt = $pdo->prepare("SELECT d.*, r.doc_date, r.req_date, r.req_type, r.factory, r.dept, r.status as req_status, r.is_locked as req_is_locked, r.req_user as header_req_user 
                    FROM `erp_requisition_details` d 
                    JOIN `erp_requisitions` r ON d.req_no = r.req_no AND r.created_by = d.created_by
                    WHERE d.id = ? AND d.created_by = ?");
                $stmt->execute([$id, $uname]);
            } else {
                $stmt = $pdo->prepare("SELECT d.*, r.doc_date, r.req_date, r.req_type, r.factory, r.dept, r.status as req_status, r.is_locked as req_is_locked, r.req_user as header_req_user 
                    FROM `erp_requisition_details` d 
                    JOIN `erp_requisitions` r ON d.req_no = r.req_no AND r.created_by = d.created_by
                    WHERE d.req_no = ? AND d.line_no = ? AND d.created_by = ?");
                $stmt->execute([$reqNo, $lineNo, $uname]);
            }
            $row = $stmt->fetch();
            if (!$row) jsonResponse(['success' => false, 'error' => '查無請購明細資料']);
            if (empty($row['req_user']) && !empty($row['header_req_user'])) {
                $row['req_user'] = $row['header_req_user'];
            }
            if (!empty($row['req_user'])) {
                $eStmt = $pdo->prepare("SELECT `emp_name` FROM `erp_employees` WHERE `emp_no` = ? LIMIT 1");
                $eStmt->execute([$row['req_user']]);
                $eRow = $eStmt->fetch();
                $row['req_user_name'] = $eRow ? $eRow['emp_name'] : $row['req_user'];
            }
            if (!empty($row['supplier_no'])) {
                $sStmt = $pdo->prepare("SELECT `name_short`, `full_name` FROM `erp_suppliers` WHERE `supplier_no` = ? AND (`created_by` = ? OR `created_by` = 'B18') ORDER BY (`created_by` = ?) DESC LIMIT 1");
                $sStmt->execute([$row['supplier_no'], $uname, $uname]);
                $sRow = $sStmt->fetch();
                $row['supplier_name'] = $sRow ? ($sRow['name_short'] ?: $sRow['full_name']) : '';
            }
            if (!empty($row['buyer'])) {
                $eStmt = $pdo->prepare("SELECT `emp_name` FROM `erp_employees` WHERE `emp_no` = ? LIMIT 1");
                $eStmt->execute([$row['buyer']]);
                $eRow = $eStmt->fetch();
                $row['buyer_name'] = $eRow ? $eRow['emp_name'] : $row['buyer'];
            }
            jsonResponse(['success' => true, 'data' => $row]);
            break;

        case 'save_puri06_detail':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $reqType = trim($input['req_type'] ?? 'A311');
            $docDate = trim($input['doc_date'] ?? date('Y/m/d'));
            $reqNo = trim($input['req_no'] ?? '');
            $lineNo = trim($input['line_no'] ?? '0001');
            $detailId = (int)($input['id'] ?? 0);

            if (empty($reqNo)) {
                $cleanNo = generateNextDocNo($pdo, 'requisition', $docDate, $uname);
                $reqNo = $reqType . '-' . $cleanNo;
            }

            // Check if detail already exists
            $existing = null;
            if ($detailId > 0) {
                $chk = $pdo->prepare("SELECT * FROM `erp_requisition_details` WHERE `id` = ? AND `created_by` = ?");
                $chk->execute([$detailId, $uname]);
                $existing = $chk->fetch();
            }
            if (!$existing) {
                $chk = $pdo->prepare("SELECT * FROM `erp_requisition_details` WHERE `req_no` = ? AND `line_no` = ? AND `created_by` = ?");
                $chk->execute([$reqNo, $lineNo, $uname]);
                $existing = $chk->fetch();
            }

            $reqQty = (float)($input['req_qty'] ?? 0);
            $purPrice = (float)($input['pur_price'] ?? 0);
            if ($purPrice <= 0 && !empty($input['unit_price'])) {
                $purPrice = (float)$input['unit_price'];
            }
            if ($purPrice <= 0 && $existing) {
                if ((float)$existing['pur_price'] > 0) {
                    $purPrice = (float)$existing['pur_price'];
                } elseif ((float)$existing['unit_price'] > 0) {
                    $purPrice = (float)$existing['unit_price'];
                }
            }

            $purAmt = (float)($input['pur_amount'] ?? 0);
            if ($purAmt <= 0 && $purPrice > 0 && $reqQty > 0) {
                $purAmt = $purPrice * $reqQty;
            }
            if ($purAmt <= 0 && $existing) {
                if ((float)$existing['pur_amount'] > 0) {
                    $purAmt = (float)$existing['pur_amount'];
                } elseif ((float)$existing['amount'] > 0) {
                    $purAmt = (float)$existing['amount'];
                }
            }

            $purQty = (float)($input['pur_qty'] ?? $reqQty);
            $pricingQty = (float)($input['pricing_qty'] ?? $reqQty);
            $supplierNo = trim($input['supplier_no'] ?? '');
            if (empty($supplierNo) && $existing && !empty($existing['supplier_no'])) {
                $supplierNo = $existing['supplier_no'];
            }
            $buyer = trim($input['buyer'] ?? '');
            if (empty($buyer) && $existing && !empty($existing['buyer'])) {
                $buyer = $existing['buyer'];
            }
            if (empty($buyer)) $buyer = $uname;

            $reqUser = trim($input['req_user'] ?? '');
            if (!empty($reqUser)) {
                $empCheck = $pdo->prepare("SELECT `emp_no`, `emp_name` FROM `erp_employees` WHERE `emp_no` = ? OR `emp_name` = ? LIMIT 1");
                $empCheck->execute([$reqUser, $reqUser]);
                $emp = $empCheck->fetch();
                if ($emp) {
                    $reqUser = $emp['emp_no'];
                }
            }
            if (empty($reqUser) && $existing && !empty($existing['req_user'])) {
                $reqUser = $existing['req_user'];
            }
            if (empty($reqUser)) {
                $reqUser = $uname;
            }

            if ($existing) {
                // Update existing record
                $stmtUpd = $pdo->prepare("UPDATE `erp_requisition_details` SET
                    `item_no` = ?,
                    `item_name` = ?,
                    `item_spec` = ?,
                    `req_qty` = ?,
                    `unit` = ?,
                    `warehouse` = ?,
                    `unit_price` = ?,
                    `amount` = ?,
                    `po_qty` = ?,
                    `buyer` = ?,
                    `supplier_no` = ?,
                    `delivery_wh` = ?,
                    `multi_tax` = ?,
                    `pur_qty` = ?,
                    `pack_pur_qty` = ?,
                    `pur_unit` = ?,
                    `pack_pur_unit` = ?,
                    `pur_small_unit` = ?,
                    `trading_terms` = ?,
                    `tax_code` = ?,
                    `tax_type` = ?,
                    `tax_rate` = ?,
                    `currency` = ?,
                    `pricing_qty` = ?,
                    `pur_price` = ?,
                    `pricing_unit` = ?,
                    `pur_amount` = ?,
                    `inquiry_code` = ?,
                    `delivery_date` = ?,
                    `is_urgent` = ?,
                    `pur_remark` = ?,
                    `is_locked` = ?,
                    `is_purchased` = ?,
                    `close_code` = ?,
                    `req_dept` = ?,
                    `po_no` = ?,
                    `manufacturer` = ?,
                    `approved_model` = ?,
                    `req_unit` = ?,
                    `pack_req_qty` = ?,
                    `req_small_unit` = ?,
                    `pack_req_unit` = ?,
                    `require_date` = ?,
                    `req_remark` = ?,
                    `min_replenish` = ?,
                    `project_no` = ?,
                    `req_user` = ?
                    WHERE `id` = ? AND `created_by` = ?");
                $stmtUpd->execute([
                    $input['item_no'] ?? $existing['item_no'] ?? '',
                    $input['item_name'] ?? $existing['item_name'] ?? '',
                    $input['item_spec'] ?? $existing['item_spec'] ?? '',
                    $reqQty,
                    $input['req_unit'] ?? $input['unit'] ?? $existing['unit'] ?? 'PC',
                    $input['delivery_wh'] ?? $input['warehouse'] ?? $existing['warehouse'] ?? 'P003',
                    $purPrice,
                    $purAmt,
                    (float)($input['po_qty'] ?? $existing['po_qty'] ?? 0),
                    $buyer,
                    $supplierNo,
                    $input['delivery_wh'] ?? $existing['delivery_wh'] ?? 'P003',
                    !empty($input['multi_tax']) ? 1 : 0,
                    $purQty,
                    (float)($input['pack_pur_qty'] ?? $existing['pack_pur_qty'] ?? 0),
                    $input['pur_unit'] ?? $existing['pur_unit'] ?? 'PC',
                    $input['pack_pur_unit'] ?? $existing['pack_pur_unit'] ?? '',
                    $input['pur_small_unit'] ?? $existing['pur_small_unit'] ?? '',
                    $input['trading_terms'] ?? $existing['trading_terms'] ?? '',
                    $input['tax_code'] ?? $existing['tax_code'] ?? 'P05',
                    $input['tax_type'] ?? $existing['tax_type'] ?? '2:應稅外加',
                    (float)($input['tax_rate'] ?? $existing['tax_rate'] ?? 5.00),
                    $input['currency'] ?? $existing['currency'] ?? 'NTD',
                    $pricingQty,
                    $purPrice,
                    $input['pricing_unit'] ?? $existing['pricing_unit'] ?? 'PC',
                    $purAmt,
                    $input['inquiry_code'] ?? $existing['inquiry_code'] ?? 'N',
                    $input['delivery_date'] ?? $existing['delivery_date'] ?? date('Y/m/d'),
                    !empty($input['is_urgent']) ? 1 : 0,
                    $input['pur_remark'] ?? $existing['pur_remark'] ?? '',
                    !empty($input['is_locked']) ? 1 : ($existing['is_locked'] ?? 0),
                    !empty($input['is_purchased']) ? 1 : ($existing['is_purchased'] ?? 0),
                    $input['close_code'] ?? $existing['close_code'] ?? 'N',
                    $input['req_dept'] ?? $existing['req_dept'] ?? '',
                    $input['po_no'] ?? $existing['po_no'] ?? '',
                    $input['manufacturer'] ?? $existing['manufacturer'] ?? '',
                    $input['approved_model'] ?? $existing['approved_model'] ?? '',
                    $input['req_unit'] ?? $existing['req_unit'] ?? 'PC',
                    (float)($input['pack_req_qty'] ?? $existing['pack_req_qty'] ?? 0),
                    $input['req_small_unit'] ?? $existing['req_small_unit'] ?? '',
                    $input['pack_req_unit'] ?? $existing['pack_req_unit'] ?? '',
                    $input['require_date'] ?? $existing['require_date'] ?? date('Y/m/d'),
                    $input['req_remark'] ?? $existing['req_remark'] ?? '',
                    (float)($input['min_replenish'] ?? $existing['min_replenish'] ?? 0),
                    $input['project_no'] ?? $existing['project_no'] ?? '',
                    $reqUser,
                    $existing['id'],
                    $uname
                ]);
            } else {
                // Insert new detail
                $stmtD = $pdo->prepare("INSERT INTO `erp_requisition_details`
                    (`req_no`, `line_no`, `item_no`, `item_name`, `item_spec`, `req_qty`, `unit`, `warehouse`, `unit_price`, `amount`, `po_qty`,
                     `buyer`, `supplier_no`, `delivery_wh`, `multi_tax`, `pur_qty`, `pack_pur_qty`, `pur_unit`, `pack_pur_unit`, `pur_small_unit`,
                     `trading_terms`, `tax_code`, `tax_type`, `tax_rate`, `currency`, `pricing_qty`, `pur_price`, `pricing_unit`, `pur_amount`,
                     `inquiry_code`, `delivery_date`, `is_urgent`, `pur_remark`, `is_locked`, `is_purchased`, `close_code`, `req_dept`, `po_no`,
                     `manufacturer`, `approved_model`, `req_unit`, `pack_req_qty`, `req_small_unit`, `pack_req_unit`, `require_date`, `req_remark`,
                     `min_replenish`, `project_no`, `req_user`, `created_by`)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmtD->execute([
                    $reqNo, $lineNo,
                    $input['item_no'] ?? '',
                    $input['item_name'] ?? '',
                    $input['item_spec'] ?? '',
                    $reqQty,
                    $input['req_unit'] ?? $input['unit'] ?? 'PC',
                    $input['delivery_wh'] ?? $input['warehouse'] ?? 'P003',
                    $purPrice,
                    $purAmt,
                    (float)($input['po_qty'] ?? 0),
                    $buyer,
                    $supplierNo,
                    $input['delivery_wh'] ?? 'P003',
                    !empty($input['multi_tax']) ? 1 : 0,
                    $purQty,
                    (float)($input['pack_pur_qty'] ?? 0),
                    $input['pur_unit'] ?? 'PC',
                    $input['pack_pur_unit'] ?? '',
                    $input['pur_small_unit'] ?? '',
                    $input['trading_terms'] ?? '',
                    $input['tax_code'] ?? 'P05',
                    $input['tax_type'] ?? '2:應稅外加',
                    (float)($input['tax_rate'] ?? 5.00),
                    $input['currency'] ?? 'NTD',
                    $pricingQty,
                    $purPrice,
                    $input['pricing_unit'] ?? 'PC',
                    $purAmt,
                    $input['inquiry_code'] ?? 'N',
                    $input['delivery_date'] ?? date('Y/m/d'),
                    !empty($input['is_urgent']) ? 1 : 0,
                    $input['pur_remark'] ?? '',
                    !empty($input['is_locked']) ? 1 : 0,
                    !empty($input['is_purchased']) ? 1 : 0,
                    $input['close_code'] ?? 'N',
                    $input['req_dept'] ?? '',
                    $input['po_no'] ?? '',
                    $input['manufacturer'] ?? '',
                    $input['approved_model'] ?? '',
                    $input['req_unit'] ?? 'PC',
                    (float)($input['pack_req_qty'] ?? 0),
                    $input['req_small_unit'] ?? '',
                    $input['pack_req_unit'] ?? '',
                    $input['require_date'] ?? date('Y/m/d'),
                    $input['req_remark'] ?? '',
                    (float)($input['min_replenish'] ?? 0),
                    $input['project_no'] ?? '',
                    $reqUser,
                    $uname
                ]);
            }

            // Ensure parent requisition header exists and is updated
            $stmtH = $pdo->prepare("INSERT INTO `erp_requisitions`
                (`req_no`, `req_type`, `doc_date`, `req_date`, `factory`, `dept`, `req_user`, `status`, `is_locked`, `total_qty`, `total_amount`, `created_by`)
                VALUES (?, ?, ?, ?, '01', ?, ?, '已確認', 1, ?, ?, ?)
                ON DUPLICATE KEY UPDATE `doc_date`=VALUES(`doc_date`), `req_date`=VALUES(`req_date`), `dept`=VALUES(`dept`), `req_user`=VALUES(`req_user`), `total_qty`=VALUES(`total_qty`), `total_amount`=VALUES(`total_amount`)");
            $stmtH->execute([
                $reqNo,
                $reqType,
                $docDate,
                $input['req_date'] ?? $docDate,
                $input['req_dept'] ?? '0100 業務部',
                $reqUser,
                $reqQty,
                $purAmt,
                $uname
            ]);

            // Sync total_qty, total_amount, and req_user
            $pdo->prepare("UPDATE `erp_requisitions` SET
                `req_user` = ?,
                `total_qty` = (SELECT IFNULL(SUM(req_qty), 0) FROM `erp_requisition_details` WHERE `req_no` = ? AND `created_by` = ?),
                `total_amount` = (SELECT IFNULL(SUM(amount), 0) FROM `erp_requisition_details` WHERE `req_no` = ? AND `created_by` = ?)
                WHERE `req_no` = ? AND `created_by` = ?")->execute([$reqUser, $reqNo, $uname, $reqNo, $uname, $reqNo, $uname]);

            // Sync all sibling details of this requisition to have the same req_user
            $pdo->prepare("UPDATE `erp_requisition_details` SET `req_user` = ? WHERE `req_no` = ? AND `created_by` = ?")->execute([$reqUser, $reqNo, $uname]);

            jsonResponse(['success' => true, 'req_no' => $reqNo, 'line_no' => $lineNo]);
            break;

        case 'nav_puri06_detail':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $dir = $_GET['dir'] ?? 'first';
            $curId = (int)($_GET['current_id'] ?? 0);
            $curReq = trim($_GET['current_req'] ?? '');
            $curLine = trim($_GET['current_line'] ?? '');

            $row = null;
            if ($dir === 'first') {
                $stmt = $pdo->prepare("SELECT d.*, r.doc_date, r.req_date, r.req_type, r.factory, r.dept, r.status as req_status, r.is_locked as req_is_locked, r.req_user as header_req_user 
                    FROM `erp_requisition_details` d 
                    JOIN `erp_requisitions` r ON d.req_no = r.req_no AND r.created_by = d.created_by
                    WHERE d.created_by = ? AND r.status = '已確認'
                    ORDER BY d.id ASC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($dir === 'last') {
                $stmt = $pdo->prepare("SELECT d.*, r.doc_date, r.req_date, r.req_type, r.factory, r.dept, r.status as req_status, r.is_locked as req_is_locked, r.req_user as header_req_user 
                    FROM `erp_requisition_details` d 
                    JOIN `erp_requisitions` r ON d.req_no = r.req_no AND r.created_by = d.created_by
                    WHERE d.created_by = ? AND r.status = '已確認'
                    ORDER BY d.id DESC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($dir === 'prev') {
                if ($curId > 0) {
                    $stmt = $pdo->prepare("SELECT d.*, r.doc_date, r.req_date, r.req_type, r.factory, r.dept, r.status as req_status, r.is_locked as req_is_locked 
                        FROM `erp_requisition_details` d 
                        JOIN `erp_requisitions` r ON d.req_no = r.req_no AND r.created_by = d.created_by
                        WHERE d.created_by = ? AND r.status = '已確認' AND d.id < ? ORDER BY d.id DESC LIMIT 1");
                    $stmt->execute([$uname, $curId]);
                    $row = $stmt->fetch();
                }
            } elseif ($dir === 'next') {
                if ($curId > 0) {
                    $stmt = $pdo->prepare("SELECT d.*, r.doc_date, r.req_date, r.req_type, r.factory, r.dept, r.status as req_status, r.is_locked as req_is_locked 
                        FROM `erp_requisition_details` d 
                        JOIN `erp_requisitions` r ON d.req_no = r.req_no AND r.created_by = d.created_by
                        WHERE d.created_by = ? AND r.status = '已確認' AND d.id > ? ORDER BY d.id ASC LIMIT 1");
                    $stmt->execute([$uname, $curId]);
                    $row = $stmt->fetch();
                }
            }
            if (!$row && $curId > 0) {
                $stmt = $pdo->prepare("SELECT d.*, r.doc_date, r.req_date, r.req_type, r.factory, r.dept, r.status as req_status, r.is_locked as req_is_locked, r.req_user as header_req_user 
                    FROM `erp_requisition_details` d 
                    JOIN `erp_requisitions` r ON d.req_no = r.req_no AND r.created_by = d.created_by
                    WHERE d.created_by = ? AND r.status = '已確認' AND d.id = ?");
                $stmt->execute([$uname, $curId]);
                $row = $stmt->fetch();
            }
            if ($row) {
                if (!empty($row['supplier_no'])) {
                    $sStmt = $pdo->prepare("SELECT `name_short`, `full_name` FROM `erp_suppliers` WHERE `supplier_no` = ? AND (`created_by` = ? OR `created_by` = 'B18') ORDER BY (`created_by` = ?) DESC LIMIT 1");
                    $sStmt->execute([$row['supplier_no'], $uname, $uname]);
                    $sRow = $sStmt->fetch();
                    $row['supplier_name'] = $sRow ? ($sRow['name_short'] ?: $sRow['full_name']) : '';
                }
                if (empty($row['req_user']) && !empty($row['header_req_user'])) {
                    $row['req_user'] = $row['header_req_user'];
                }
                if (!empty($row['req_user'])) {
                    $eStmt = $pdo->prepare("SELECT `emp_name` FROM `erp_employees` WHERE `emp_no` = ? LIMIT 1");
                    $eStmt->execute([$row['req_user']]);
                    $eRow = $eStmt->fetch();
                    $row['req_user_name'] = $eRow ? $eRow['emp_name'] : $row['req_user'];
                }
                if (!empty($row['buyer'])) {
                    $eStmt = $pdo->prepare("SELECT `emp_name` FROM `erp_employees` WHERE `emp_no` = ? LIMIT 1");
                    $eStmt->execute([$row['buyer']]);
                    $eRow = $eStmt->fetch();
                    $row['buyer_name'] = $eRow ? $eRow['emp_name'] : $row['buyer'];
                }
                jsonResponse(['success' => true, 'data' => $row]);
            } else {
                jsonResponse(['success' => false, 'error' => '已無已確認請購資料']);
            }
            break;

        // ==========================================
        // 9. BATCH REQUISITION UPDATE (PURB01 - 擷取11.PNG)
        // ==========================================
        case 'batch_update_req':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $reqNoStart = trim($input['req_no_start'] ?? '');
            $reqNoEnd = trim($input['req_no_end'] ?? '');
            $lockOption = trim($input['lock_option'] ?? '1'); // 1 = 已鎖定
            $buyer = trim($input['buyer'] ?? '');
            if (empty($buyer)) $buyer = $uname;
            $factory = trim($input['factory'] ?? '');
            $currency = trim($input['currency'] ?? 'NTD');
            $poType = trim($input['po_type'] ?? 'A331');
            $poDate = trim($input['po_date'] ?? date('Y/m/d'));

            if (empty($factory)) {
                jsonResponse(['success' => false, 'error' => '請選擇廠別（如 TP01、TY01）']);
            }

            if (empty($reqNoStart)) {
                $stmt = $pdo->prepare("SELECT `req_no` FROM `erp_requisitions` WHERE `created_by` = ? ORDER BY `req_no` DESC LIMIT 1");
                $stmt->execute([$uname]);
                $r = $stmt->fetch();
                if ($r) $reqNoStart = $r['req_no'];
                else jsonResponse(['success' => false, 'error' => '查無可更新的請購單']);
            }
            if (empty($reqNoEnd)) $reqNoEnd = $reqNoStart;

            // Fetch matching requisitions
            $stmt = $pdo->prepare("SELECT * FROM `erp_requisitions` WHERE `req_no` >= ? AND `req_no` <= ? AND `created_by` = ?");
            $stmt->execute([$reqNoStart, $reqNoEnd, $uname]);
            $reqs = $stmt->fetchAll();

            $genPoNos = [];
            foreach ($reqs as $req) {
                // Update requisition lock status
                $pdo->prepare("UPDATE `erp_requisitions` SET `is_locked` = 1, `status` = '已確認' WHERE `req_no` = ? AND `created_by` = ?")->execute([$req['req_no'], $uname]);

                // Generate Purchase Order number
                $cleanNo = preg_replace('/^[A-Z0-9]+-/', '', $req['req_no']);
                $poNo = $poType . '-' . $cleanNo;

                // Fetch details
                $dStmt = $pdo->prepare("SELECT * FROM `erp_requisition_details` WHERE `req_no` = ? AND `created_by` = ? ORDER BY `line_no` ASC, `id` ASC");
                $dStmt->execute([$req['req_no'], $uname]);
                $rawItems = $dStmt->fetchAll();

                // Deduplicate items by line_no
                $reqItems = [];
                foreach ($rawItems as $rit) {
                    $lNo = $rit['line_no'] ?: '0001';
                    if (!isset($reqItems[$lNo])) {
                        $reqItems[$lNo] = $rit;
                    } else {
                        // Merge fields if duplicate exists
                        if (empty($reqItems[$lNo]['supplier_no']) && !empty($rit['supplier_no'])) {
                            $reqItems[$lNo]['supplier_no'] = $rit['supplier_no'];
                        }
                        if ((float)$reqItems[$lNo]['unit_price'] <= 0 && (float)$rit['unit_price'] > 0) {
                            $reqItems[$lNo]['unit_price'] = $rit['unit_price'];
                            $reqItems[$lNo]['amount'] = $rit['amount'];
                        }
                        if (empty($reqItems[$lNo]['buyer']) && !empty($rit['buyer'])) {
                            $reqItems[$lNo]['buyer'] = $rit['buyer'];
                        }
                    }
                }

                $totalQty = 0;
                $poAmount = 0;
                $suppNo = '';
                $poBuyer = $buyer;

                foreach ($reqItems as $rit) {
                    $totalQty += (float)$rit['req_qty'];
                    $poAmount += (float)$rit['amount'];
                    if (empty($suppNo) && !empty(trim($rit['supplier_no'] ?? ''))) {
                        $suppNo = trim($rit['supplier_no']);
                    }
                    if (!empty(trim($rit['buyer'] ?? ''))) {
                        $poBuyer = trim($rit['buyer']);
                    }
                }

                if (empty($suppNo)) {
                    $suppNo = 'V001';
                }

                $suppName = '';
                $sStmt = $pdo->prepare("SELECT `name_short`, `full_name` FROM `erp_suppliers` WHERE `supplier_no` = ? AND (`created_by` = ? OR `created_by` = 'B18') ORDER BY (`created_by` = ?) DESC LIMIT 1");
                $sStmt->execute([$suppNo, $uname, $uname]);
                $sRow = $sStmt->fetch();
                if (!$sRow) {
                    $sStmtAny = $pdo->prepare("SELECT `name_short`, `full_name` FROM `erp_suppliers` WHERE `supplier_no` = ? LIMIT 1");
                    $sStmtAny->execute([$suppNo]);
                    $sRow = $sStmtAny->fetch();
                }
                if ($sRow) {
                    $suppName = $sRow['name_short'] ?: $sRow['full_name'];
                }
                if (empty($suppName)) {
                    $suppName = ($suppNo === 'V001') ? '影石創新' : $suppNo;
                }

                $taxRate = 5.0;
                $taxAmount = round($poAmount * ($taxRate / 100.0));
                $grandTotal = $poAmount + $taxAmount;

                // Insert / Update Purchase Order
                $stmtPo = $pdo->prepare("INSERT INTO `erp_purchase_orders`
                    (`po_no`, `po_type`, `doc_date`, `po_date`, `supplier_no`, `supplier_name`, `factory`, `buyer`, `currency`, `exchange_rate`, `tax_code`, `tax_type`, `tax_rate`, `confirm_user`, `source_req_no`, `po_amount`, `tax_amount`, `grand_total`, `total_qty`, `status`, `created_by`)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1.0, 'P05', '2:應稅外加', 5.0, ?, ?, ?, ?, ?, ?, '已確認', ?)
                    ON DUPLICATE KEY UPDATE 
                    `supplier_no`=VALUES(`supplier_no`),
                    `supplier_name`=VALUES(`supplier_name`),
                    `factory`=VALUES(`factory`),
                    `buyer`=VALUES(`buyer`),
                    `po_amount`=VALUES(`po_amount`),
                    `tax_amount`=VALUES(`tax_amount`),
                    `grand_total`=VALUES(`grand_total`),
                    `total_qty`=VALUES(`total_qty`),
                    `status`='已確認',
                    `created_by`=VALUES(`created_by`)");
                $stmtPo->execute([
                    $poNo, $poType, $poDate, $poDate, $suppNo, $suppName, $factory, $poBuyer, $currency, $poBuyer, $req['req_no'], $poAmount, $taxAmount, $grandTotal, $totalQty, $uname
                ]);

                // Insert PO details (deduplicated)
                $pdo->prepare("DELETE FROM `erp_po_details` WHERE `po_no` = ? AND `created_by` = ?")->execute([$poNo, $uname]);
                $stmtPoD = $pdo->prepare("INSERT INTO `erp_po_details`
                    (`po_no`, `line_no`, `item_no`, `item_name`, `item_spec`, `po_qty`, `received_qty`, `unit`, `unit_price`, `amount`, `est_date`, `created_by`)
                    VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)");
                
                $lIdx = 1;
                foreach ($reqItems as $rit) {
                    $stmtPoD->execute([
                        $poNo,
                        sprintf('%04d', $lIdx++),
                        $rit['item_no'],
                        $rit['item_name'],
                        $rit['item_spec'],
                        $rit['req_qty'],
                        $rit['unit'],
                        $rit['unit_price'],
                        $rit['amount'],
                        date('Y/m/d', strtotime('+1 day')),
                        $uname
                    ]);
                }

                // Mark requisition details as purchased
                $pdo->prepare("UPDATE `erp_requisition_details` SET `is_purchased` = 1, `is_locked` = 1, `po_no` = ?, `po_qty` = `req_qty` WHERE `req_no` = ? AND `created_by` = ?")->execute([$poNo, $req['req_no'], $uname]);

                $genPoNos[] = $poNo;
            }

            // Log to erp_batch_queue (擷取18.PNG)
            $jobId = date('Ymd') . sprintf('%06d', rand(1, 99999));
            $nowTime = date('Y/n/j 下午 h:i:s');
            $filterParams = "選擇請購單號: $reqNoStart ~ $reqNoEnd\n鎖定選項: 1 | 已鎖定\n選擇廠別: $factory\n選擇幣別: $currency\n輸入採購單別: $poType\n相同交貨日彙總產生: N\n相同品號不同品名規格彙總產生: N\n抽驗備註: Y";
            $poRange = count($genPoNos) > 1 ? ($genPoNos[0] . '~' . end($genPoNos)) : ($genPoNos[0] ?? $poType . '-202611001');
            $commits = count($genPoNos) > 0 ? 1 : 0;
            $rollbacks = count($genPoNos) > 0 ? 0 : 1;
            $resultLog = "後端程式版號:4.0.17.1;$poRange; Commits: $commits Records, RollBacks: $rollbacks Records;";

            $stmtQ = $pdo->prepare("INSERT INTO `erp_batch_queue`
                (`job_id`, `job_name`, `process_mode`, `est_time`, `status`, `operator`, `start_time`, `end_time`, `filter_params`, `result_log`, `created_by`)
                VALUES (?, '請購資料更新作業', '依佇列順序', ?, '已完成', 'WIN-S7UJO0KFN', ?, ?, ?, ?, ?)");
            $stmtQ->execute([$jobId, $nowTime, $nowTime, $nowTime, $filterParams, $resultLog, $uname]);

            jsonResponse([
                'success' => true,
                'message' => '請購資料更新完成，已成功產生採購單！',
                'po_nos' => $genPoNos,
                'job_id' => $jobId,
                'result_log' => $resultLog
            ]);
            break;

        // ==========================================
        // 10. PURCHASE ORDERS (PURI07)
        // ==========================================
        case 'get_purchase_orders':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $stmt = $pdo->prepare("SELECT * FROM `erp_purchase_orders` WHERE `created_by` = ? ORDER BY `po_no` DESC");
            $stmt->execute([$uname]);
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'get_purchase_order':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $poNo = trim($_GET['po_no'] ?? $_GET['no'] ?? '');
            $stmt = $pdo->prepare("SELECT * FROM `erp_purchase_orders` WHERE `po_no` = ? AND `created_by` = ?");
            $stmt->execute([$poNo, $uname]);
            $header = $stmt->fetch();
            if (!$header) jsonResponse(['success' => false, 'error' => '查無此採購單']);

            $stmtD = $pdo->prepare("SELECT * FROM `erp_po_details` WHERE `po_no` = ? AND `created_by` = ? ORDER BY `line_no` ASC");
            $stmtD->execute([$poNo, $uname]);
            $details = $stmtD->fetchAll();

            jsonResponse(['success' => true, 'header' => $header, 'purchase_order' => $header, 'po' => $header, 'order' => $header, 'details' => $details]);
            break;

        case 'save_purchase_order':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $header = $input['header'] ?? [];
            $details = $input['details'] ?? [];
            $poNo = trim($header['po_no'] ?? '');
            $poType = trim($header['po_type'] ?? 'C331');

            if (empty($poNo)) {
                $poNo = generateNextDocNo($pdo, 'purchase_order', $header['doc_date'] ?? date('Y/m/d'), $uname);
            }

            $stmtH = $pdo->prepare("INSERT INTO `erp_purchase_orders`
                (`po_no`, `po_type`, `doc_date`, `po_date`, `supplier_no`, `supplier_name`, `factory`, `buyer`, `currency`, `exchange_rate`, `tax_code`, `tax_type`, `tax_rate`, `confirm_user`, `source_req_no`, `po_amount`, `tax_amount`, `grand_total`, `total_qty`, `status`, `created_by`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                `doc_date`=VALUES(`doc_date`), `po_date`=VALUES(`po_date`), `supplier_no`=VALUES(`supplier_no`), `supplier_name`=VALUES(`supplier_name`), `buyer`=VALUES(`buyer`), `factory`=VALUES(`factory`), `currency`=VALUES(`currency`), `exchange_rate`=VALUES(`exchange_rate`), `tax_code`=VALUES(`tax_code`), `tax_type`=VALUES(`tax_type`), `tax_rate`=VALUES(`tax_rate`), `po_amount`=VALUES(`po_amount`), `tax_amount`=VALUES(`tax_amount`), `grand_total`=VALUES(`grand_total`), `total_qty`=VALUES(`total_qty`), `status`=VALUES(`status`), `created_by`=VALUES(`created_by`)");

            $stmtH->execute([
                $poNo,
                $poType,
                $header['doc_date'] ?? date('Y/m/d'),
                $header['po_date'] ?? date('Y/m/d'),
                $header['supplier_no'] ?? '',
                $header['supplier_name'] ?? '',
                $header['factory'] ?? '01',
                $header['buyer'] ?? $uname,
                $header['currency'] ?? 'NTD',
                $header['exchange_rate'] ?? 1.0,
                $header['tax_code'] ?? 'P05',
                $header['tax_type'] ?? '2:應稅外加',
                $header['tax_rate'] ?? 5.0,
                $header['confirm_user'] ?? '',
                $header['source_req_no'] ?? '',
                $header['po_amount'] ?? 0,
                $header['tax_amount'] ?? 0,
                $header['grand_total'] ?? 0,
                $header['total_qty'] ?? 0,
                $header['status'] ?? '未確認',
                $uname
            ]);

            $pdo->prepare("DELETE FROM `erp_po_details` WHERE `po_no` = ? AND `created_by` = ?")->execute([$poNo, $uname]);
            $stmtD = $pdo->prepare("INSERT INTO `erp_po_details` (`po_no`, `line_no`, `item_no`, `item_name`, `item_spec`, `po_qty`, `received_qty`, `unit`, `unit_price`, `amount`, `est_date`, `created_by`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $lineIdx = 1;
            foreach ($details as $d) {
                $lineNo = sprintf('%04d', $lineIdx++);
                $poQty = (float)($d['po_qty'] ?? $d['qty'] ?? 0);
                $unitPrice = (float)($d['unit_price'] ?? $d['price'] ?? 0);
                $stmtD->execute([
                    $poNo,
                    $lineNo,
                    $d['item_no'] ?? '',
                    $d['item_name'] ?? '',
                    $d['item_spec'] ?? '',
                    $poQty,
                    (float)($d['received_qty'] ?? 0),
                    $d['unit'] ?? '台',
                    $unitPrice,
                    (float)($d['amount'] ?? ($poQty * $unitPrice)),
                    $d['est_date'] ?? $d['date'] ?? date('Y/m/d'),
                    $uname
                ]);
            }

            jsonResponse(['success' => true, 'po_no' => $poNo]);
            break;

        case 'delete_purchase_order':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $poNo = trim($input['po_no'] ?? '');
            $pdo->prepare("DELETE FROM `erp_purchase_orders` WHERE `po_no` = ? AND `created_by` = ?")->execute([$poNo, $uname]);
            $pdo->prepare("DELETE FROM `erp_po_details` WHERE `po_no` = ? AND `created_by` = ?")->execute([$poNo, $uname]);
            jsonResponse(['success' => true]);
            break;

        case 'nav_purchase_order':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $pos = $_GET['pos'] ?? 'first';
            $cur = $_GET['current'] ?? '';
            $row = null;
            if ($pos === 'first') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_purchase_orders` WHERE `created_by` = ? ORDER BY `po_no` ASC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($pos === 'last') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_purchase_orders` WHERE `created_by` = ? ORDER BY `po_no` DESC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($pos === 'prev') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_purchase_orders` WHERE `po_no` < ? AND `created_by` = ? ORDER BY `po_no` DESC LIMIT 1");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            } elseif ($pos === 'next') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_purchase_orders` WHERE `po_no` > ? AND `created_by` = ? ORDER BY `po_no` ASC LIMIT 1");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            }
            if (!$row && $cur) {
                $stmt = $pdo->prepare("SELECT * FROM `erp_purchase_orders` WHERE `po_no` = ? AND `created_by` = ?");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            }
            if ($row) {
                $sDetails = $pdo->prepare("SELECT * FROM `erp_po_details` WHERE `po_no` = ? AND `created_by` = ? ORDER BY `line_no` ASC");
                $sDetails->execute([$row['po_no'], $uname]);
                jsonResponse(['success' => true, 'header' => $row, 'purchase_order' => $row, 'po' => $row, 'details' => $sDetails->fetchAll()]);
            } else {
                jsonResponse(['success' => false, 'error' => '查無採購單']);
            }
            break;

        // ==========================================
        // 11. GOODS RECEIPTS (PURI09)
        // ==========================================
        case 'get_goods_receipts':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $stmt = $pdo->prepare("SELECT * FROM `erp_goods_receipts` WHERE `created_by` = ? ORDER BY `gr_no` DESC");
            $stmt->execute([$uname]);
            $rows = $stmt->fetchAll();
            foreach ($rows as &$r) {
                if (empty($r['gr_type'])) $r['gr_type'] = 'C341';
                $r['receipt_no'] = $r['gr_no'];
                $r['receipt_date'] = $r['gr_date'] ?: $r['doc_date'];
            }
            jsonResponse(['success' => true, 'data' => $rows]);
            break;

        case 'get_goods_receipt':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $grNo = trim($_GET['gr_no'] ?? $_GET['receipt_no'] ?? $_GET['no'] ?? '');
            $stmt = $pdo->prepare("SELECT * FROM `erp_goods_receipts` WHERE `gr_no` = ? AND `created_by` = ?");
            $stmt->execute([$grNo, $uname]);
            $header = $stmt->fetch();
            if (!$header) jsonResponse(['success' => false, 'error' => '查無此進貨單']);
            if (empty($header['gr_type'])) $header['gr_type'] = 'C341';
            $header['receipt_no'] = $header['gr_no'];
            $header['receipt_date'] = $header['gr_date'] ?: $header['doc_date'];

            $stmtD = $pdo->prepare("SELECT * FROM `erp_gr_details` WHERE `gr_no` = ? AND `created_by` = ? ORDER BY `line_no` ASC");
            $stmtD->execute([$grNo, $uname]);
            $details = $stmtD->fetchAll();

            jsonResponse(['success' => true, 'header' => $header, 'goods_receipt' => $header, 'receipt' => $header, 'order' => $header, 'details' => $details]);
            break;

        case 'save_goods_receipt':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $header = $input['header'] ?? [];
            $details = $input['details'] ?? [];
            $grNo = trim($header['gr_no'] ?? '');
            $grType = !empty(trim($header['gr_type'] ?? '')) ? trim($header['gr_type']) : 'C341';

            if (empty($grNo)) {
                $grNo = generateNextDocNo($pdo, 'goods_receipt', $header['receipt_date'] ?? date('Y/m/d'), $uname);
            }

            $calcTotalQty = 0;
            $calcTotalAmt = 0;
            foreach ($details as $d) {
                $q = (float)($d['gr_qty'] ?? $d['qty'] ?? 0);
                $p = (float)($d['unit_price'] ?? $d['price'] ?? 0);
                $a = (float)($d['amount'] ?? ($q * $p));
                $calcTotalQty += $q;
                $calcTotalAmt += $a;
            }
            $totQty = (!empty($header['total_qty']) && (float)$header['total_qty'] > 0) ? (float)$header['total_qty'] : $calcTotalQty;
            $totAmt = (!empty($header['grand_total']) && (float)$header['grand_total'] > 0) ? (float)$header['grand_total'] : $calcTotalAmt;
            $grAmt = (!empty($header['gr_amount']) && (float)$header['gr_amount'] > 0) ? (float)$header['gr_amount'] : $calcTotalAmt;
            $taxAmt = (!empty($header['tax_amount']) && (float)$header['tax_amount'] > 0) ? (float)$header['tax_amount'] : round($totAmt * 0.05 / 1.05, 2);

            $stmtH = $pdo->prepare("INSERT INTO `erp_goods_receipts`
                (`gr_no`, `gr_type`, `doc_date`, `gr_date`, `supplier_no`, `supplier_name`, `factory`, `currency`, `exchange_rate`, `po_no`, `total_qty`, `gr_amount`, `tax_amount`, `grand_total`, `status`, `created_by`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                `gr_type`=VALUES(`gr_type`), `doc_date`=VALUES(`doc_date`), `gr_date`=VALUES(`gr_date`), `total_qty`=VALUES(`total_qty`), `gr_amount`=VALUES(`gr_amount`), `tax_amount`=VALUES(`tax_amount`), `grand_total`=VALUES(`grand_total`), `status`=VALUES(`status`), `confirm_user`=VALUES(`confirm_user`), `created_by`=VALUES(`created_by`)");

            $stmtH->execute([
                $grNo,
                $grType,
                $header['doc_date'] ?? date('Y/m/d'),
                $header['gr_date'] ?? date('Y/m/d'),
                $header['supplier_no'] ?? '',
                $header['supplier_name'] ?? '',
                $header['factory'] ?? '01',
                $header['currency'] ?? 'NTD',
                $header['exchange_rate'] ?? 1.0,
                $header['po_no'] ?? '',
                $totQty,
                $grAmt,
                $taxAmt,
                $totAmt,
                $header['status'] ?? '未確認',
                $uname
            ]);

            $pdo->prepare("DELETE FROM `erp_gr_details` WHERE `gr_no` = ? AND `created_by` = ?")->execute([$grNo, $uname]);
            $stmtD = $pdo->prepare("INSERT INTO `erp_gr_details` (`gr_no`, `line_no`, `item_no`, `item_name`, `item_spec`, `gr_qty`, `check_qty`, `bill_qty`, `unit`, `bill_unit`, `unit_price`, `amount`, `warehouse`, `created_by`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $lineIdx = 1;
            foreach ($details as $d) {
                $lineNo = sprintf('%04d', $lineIdx++);
                $qty = (float)($d['gr_qty'] ?? $d['qty'] ?? 0);
                $checkQty = (isset($d['check_qty']) && $d['check_qty'] !== '' && $d['check_qty'] !== null) ? (float)$d['check_qty'] : null;
                $billQty = isset($d['bill_qty']) ? (float)$d['bill_qty'] : $qty;
                $unit = $d['unit'] ?? '台';
                $billUnit = !empty($d['bill_unit']) ? $d['bill_unit'] : $unit;
                $stmtD->execute([
                    $grNo,
                    $lineNo,
                    $d['item_no'] ?? '',
                    $d['item_name'] ?? '',
                    $d['item_spec'] ?? '',
                    $qty,
                    $checkQty,
                    $billQty,
                    $unit,
                    $billUnit,
                    (float)($d['unit_price'] ?? $d['price'] ?? 0),
                    (float)($d['amount'] ?? 0),
                    $d['warehouse'] ?? '',
                    $uname
                ]);

                // 入庫增加品號現有庫存
                if (!empty($d['item_no']) && $qty > 0) {
                    $pdo->prepare("UPDATE `erp_items` SET `stock_qty` = `stock_qty` + ? WHERE `item_no` = ? AND `created_by` = ?")
                        ->execute([$qty, $d['item_no'], $uname]);
                }
            }

            // 精確更新採購單已交量 (依進貨明細重算，避免多次儲存重複累加)
            if (!empty($header['po_no'])) {
                foreach ($details as $d) {
                    if (empty($d['item_no'])) continue;
                    $sumStmt = $pdo->prepare("SELECT COALESCE(SUM(gd.gr_qty), 0) FROM `erp_gr_details` gd 
                        JOIN `erp_goods_receipts` g ON gd.`gr_no` = g.`gr_no` AND gd.`created_by` = g.`created_by` 
                        WHERE g.`po_no` = ? AND gd.`item_no` = ? AND gd.`created_by` = ?");
                    $sumStmt->execute([$header['po_no'], $d['item_no'], $uname]);
                    $totReceived = (float)$sumStmt->fetchColumn();
                    $pdo->prepare("UPDATE `erp_po_details` SET `received_qty` = ? WHERE `po_no` = ? AND `item_no` = ? AND `created_by` = ?")
                        ->execute([$totReceived, $header['po_no'], $d['item_no'], $uname]);
                }
            }

            jsonResponse(['success' => true, 'gr_no' => $grNo]);
            break;

        case 'delete_goods_receipt':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $grNo = trim($input['gr_no'] ?? '');
            $pdo->prepare("DELETE FROM `erp_goods_receipts` WHERE `gr_no` = ? AND `created_by` = ?")->execute([$grNo, $uname]);
            $pdo->prepare("DELETE FROM `erp_gr_details` WHERE `gr_no` = ? AND `created_by` = ?")->execute([$grNo, $uname]);
            jsonResponse(['success' => true]);
            break;

        case 'nav_goods_receipt':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $pos = $_GET['pos'] ?? 'first';
            $cur = $_GET['current'] ?? '';
            $row = null;
            if ($pos === 'first') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_goods_receipts` WHERE `created_by` = ? ORDER BY `gr_no` ASC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($pos === 'last') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_goods_receipts` WHERE `created_by` = ? ORDER BY `gr_no` DESC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($pos === 'prev') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_goods_receipts` WHERE `gr_no` < ? AND `created_by` = ? ORDER BY `gr_no` DESC LIMIT 1");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            } elseif ($pos === 'next') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_goods_receipts` WHERE `gr_no` > ? AND `created_by` = ? ORDER BY `gr_no` ASC LIMIT 1");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            }
            if (!$row && $cur) {
                $stmt = $pdo->prepare("SELECT * FROM `erp_goods_receipts` WHERE `gr_no` = ? AND `created_by` = ?");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            }
            if ($row) {
                $sDetails = $pdo->prepare("SELECT * FROM `erp_gr_details` WHERE `gr_no` = ? AND `created_by` = ? ORDER BY `line_no` ASC");
                $sDetails->execute([$row['gr_no'], $uname]);
                jsonResponse(['success' => true, 'header' => $row, 'purchase_order' => $row, 'po' => $row, 'details' => $sDetails->fetchAll()]);
            } else {
                jsonResponse(['success' => false, 'error' => '查無進貨單']);
            }
            break;

        // ==========================================
        // 12. DELIVERIES / SALES INVOICE (COPI08)
        // ==========================================
        case 'get_deliveries':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $stmt = $pdo->prepare("SELECT * FROM `erp_deliveries` WHERE `created_by` = ? ORDER BY `delivery_no` DESC");
            $stmt->execute([$uname]);
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'get_delivery':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $delivNo = trim($_GET['delivery_no'] ?? $_GET['deliv_no'] ?? $_GET['no'] ?? '');
            $stmt = $pdo->prepare("SELECT * FROM `erp_deliveries` WHERE `delivery_no` = ? AND `created_by` = ?");
            $stmt->execute([$delivNo, $uname]);
            $header = $stmt->fetch();
            if (!$header) jsonResponse(['success' => false, 'error' => '查無此銷貨單']);

            $stmtD = $pdo->prepare("SELECT * FROM `erp_delivery_details` WHERE `delivery_no` = ? AND `created_by` = ? ORDER BY `line_no` ASC");
            $stmtD->execute([$delivNo, $uname]);
            $details = $stmtD->fetchAll();

            jsonResponse(['success' => true, 'header' => $header, 'delivery' => $header, 'deliv' => $header, 'order' => $header, 'details' => $details]);
            break;

        case 'save_delivery':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $header = $input['header'] ?? [];
            $details = $input['details'] ?? [];
            $delivNo = trim($header['delivery_no'] ?? '');
            $delivType = trim($header['delivery_type'] ?? 'A231');

            if (empty($delivNo)) {
                $delivNo = generateNextDocNo($pdo, 'delivery', $header['delivery_date'] ?? date('Y/m/d'), $uname);
            }

            $stmtH = $pdo->prepare("INSERT INTO `erp_deliveries`
                (`delivery_no`, `delivery_type`, `doc_date`, `delivery_date`, `customer_no`, `customer_name`, `order_no`, `factory`, `currency`, `exchange_rate`, `gen_income_entry`, `gen_cost_entry`, `confirm_user`, `total_qty`, `delivery_amount`, `tax_amount`, `grand_total`, `status`, `created_by`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                `doc_date`=VALUES(`doc_date`), `delivery_date`=VALUES(`delivery_date`), `customer_no`=VALUES(`customer_no`), `customer_name`=VALUES(`customer_name`), `total_qty`=VALUES(`total_qty`), `grand_total`=VALUES(`grand_total`), `status`=VALUES(`status`), `created_by`=VALUES(`created_by`)");

            $calcTotalQty = 0;
            $calcTotalAmt = 0;
            foreach ($details as $d) {
                $calcTotalQty += (float)($d['delivery_qty'] ?? $d['qty'] ?? 0);
                $calcTotalAmt += (float)($d['amount'] ?? 0);
            }
            $totQty = (!empty($header['total_qty']) && (float)$header['total_qty'] > 0) ? (float)$header['total_qty'] : $calcTotalQty;
            $totAmt = (!empty($header['grand_total']) && (float)$header['grand_total'] > 0) ? (float)$header['grand_total'] : $calcTotalAmt;
            $delivAmt = (!empty($header['delivery_amount']) && (float)$header['delivery_amount'] > 0) ? (float)$header['delivery_amount'] : $calcTotalAmt;
            $taxAmt = (!empty($header['tax_amount']) && (float)$header['tax_amount'] > 0) ? (float)$header['tax_amount'] : round($totAmt * 0.05, 2);

            $stmtH->execute([
                $delivNo,
                $delivType,
                $header['doc_date'] ?? date('Y/m/d'),
                $header['delivery_date'] ?? date('Y/m/d'),
                $header['customer_no'] ?? '',
                $header['customer_name'] ?? '',
                $header['order_no'] ?? '',
                $header['factory'] ?? '01',
                $header['currency'] ?? 'NTD',
                $header['exchange_rate'] ?? 1.0,
                isset($header['gen_income_entry']) ? (int)$header['gen_income_entry'] : 1,
                isset($header['gen_cost_entry']) ? (int)$header['gen_cost_entry'] : 1,
                $header['confirm_user'] ?? $uname,
                $totQty,
                $delivAmt,
                $taxAmt,
                $totAmt,
                $header['status'] ?? '已確認',
                $uname
            ]);

            $pdo->prepare("DELETE FROM `erp_delivery_details` WHERE `delivery_no` = ? AND `created_by` = ?")->execute([$delivNo, $uname]);
            $stmtD = $pdo->prepare("INSERT INTO `erp_delivery_details` (`delivery_no`, `line_no`, `biz_item_no`, `item_no`, `item_name`, `item_spec`, `delivery_qty`, `gift_qty`, `unit`, `unit_price`, `amount`, `warehouse`, `created_by`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $lineIdx = 1;
            foreach ($details as $d) {
                $lineNo = sprintf('%04d', $lineIdx++);
                $qty = (float)($d['delivery_qty'] ?? $d['qty'] ?? 0);
                $price = (float)($d['unit_price'] ?? $d['price'] ?? 0);
                $amt = (float)($d['amount'] ?? ($qty * $price));
                $wh = $d['warehouse'] ?? $d['wh'] ?? 'W01';
                $stmtD->execute([
                    $delivNo,
                    $lineNo,
                    $d['biz_item_no'] ?? '',
                    $d['item_no'] ?? '',
                    $d['item_name'] ?? '',
                    $d['item_spec'] ?? '',
                    $qty,
                    (float)($d['gift_qty'] ?? 0),
                    $d['unit'] ?? '台',
                    $price,
                    $amt,
                    $wh,
                    $uname
                ]);

                // Update order delivered_qty and order transfer_status if order exists
                if (!empty($header['order_no'])) {
                    $pdo->prepare("UPDATE `erp_order_details` SET `delivered_qty` = `delivered_qty` + ? WHERE `order_no` = ? AND `item_no` = ? AND `created_by` = ?")
                        ->execute([$qty, $header['order_no'], $d['item_no'], $uname]);
                    $pdo->prepare("UPDATE `erp_orders` SET `transfer_status` = '已轉銷貨' WHERE `order_no` = ? AND `created_by` = ?")
                        ->execute([$header['order_no'], $uname]);
                }

                // 出庫扣減品號現有庫存
                if (!empty($d['item_no']) && $qty > 0) {
                    $pdo->prepare("UPDATE `erp_items` SET `stock_qty` = `stock_qty` - ? WHERE `item_no` = ? AND `created_by` = ?")
                        ->execute([$qty, $d['item_no'], $uname]);
                }
            }

            jsonResponse(['success' => true, 'delivery_no' => $delivNo]);
            break;

        case 'delete_delivery':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $delivNo = trim($input['delivery_no'] ?? '');
            $pdo->prepare("DELETE FROM `erp_deliveries` WHERE `delivery_no` = ? AND `created_by` = ?")->execute([$delivNo, $uname]);
            $pdo->prepare("DELETE FROM `erp_delivery_details` WHERE `delivery_no` = ? AND `created_by` = ?")->execute([$delivNo, $uname]);
            jsonResponse(['success' => true]);
            break;

        case 'nav_delivery':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $dir = $_GET['dir'] ?? $_GET['pos'] ?? 'first';
            $cur = $_GET['current'] ?? '';
            $row = null;
            if ($dir === 'first') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_deliveries` WHERE `created_by` = ? ORDER BY `delivery_no` ASC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($dir === 'last') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_deliveries` WHERE `created_by` = ? ORDER BY `delivery_no` DESC LIMIT 1");
                $stmt->execute([$uname]);
                $row = $stmt->fetch();
            } elseif ($dir === 'prev') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_deliveries` WHERE `delivery_no` < ? AND `created_by` = ? ORDER BY `delivery_no` DESC LIMIT 1");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            } elseif ($dir === 'next') {
                $stmt = $pdo->prepare("SELECT * FROM `erp_deliveries` WHERE `delivery_no` > ? AND `created_by` = ? ORDER BY `delivery_no` ASC LIMIT 1");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            }
            if (!$row && $cur) {
                $stmt = $pdo->prepare("SELECT * FROM `erp_deliveries` WHERE `delivery_no` = ? AND `created_by` = ?");
                $stmt->execute([$cur, $uname]);
                $row = $stmt->fetch();
            }
            $details = [];
            if ($row) {
                $stmtD = $pdo->prepare("SELECT * FROM `erp_delivery_details` WHERE `delivery_no` = ? AND `created_by` = ? ORDER BY `line_no` ASC");
                $stmtD->execute([$row['delivery_no'], $uname]);
                $details = $stmtD->fetchAll();
            }
            jsonResponse(['success' => true, 'header' => $row, 'delivery' => $row, 'data' => $row, 'details' => $details]);
            break;

        // ==========================================
        // 13. BATCH QUEUE CONSOLE (佇列工作控制台 - 擷取18.PNG)
        // ==========================================
        case 'get_batch_jobs':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $stmt = $pdo->prepare("SELECT * FROM `erp_batch_queue` WHERE `created_by` = ? ORDER BY `created_at` DESC");
            $stmt->execute([$uname]);
            jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'get_batch_job':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $jobId = trim($_GET['job_id'] ?? '');
            $stmt = $pdo->prepare("SELECT * FROM `erp_batch_queue` WHERE `job_id` = ? AND `created_by` = ?");
            $stmt->execute([$jobId, $uname]);
            $row = $stmt->fetch();
            if (!$row) jsonResponse(['success' => false, 'error' => '查無此佇列工作']);
            jsonResponse(['success' => true, 'data' => $row]);
            break;

        case 'delete_batch_job':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $jobId = trim($input['job_id'] ?? $_GET['job_id'] ?? '');
            if (!$jobId) jsonResponse(['success' => false, 'error' => '缺少工作代號']);
            $pdo->prepare("DELETE FROM `erp_batch_queue` WHERE `job_id` = ? AND `created_by` = ?")->execute([$jobId, $uname]);
            jsonResponse(['success' => true, 'message' => '佇列工作已刪除']);
            break;

        case 'run_batch_job':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $jobId = trim($input['job_id'] ?? $_GET['job_id'] ?? '');
            if (!$jobId) jsonResponse(['success' => false, 'error' => '缺少工作代號']);
            $stmt = $pdo->prepare("SELECT * FROM `erp_batch_queue` WHERE `job_id` = ? AND `created_by` = ?");
            $stmt->execute([$jobId, $uname]);
            $job = $stmt->fetch();
            if (!$job) jsonResponse(['success' => false, 'error' => '查無此佇列工作']);

            // Parse parameters
            $poType = 'C331';
            $poDate = date('Y/m/d');
            $factory = 'TP01';
            $currency = 'NTD';
            $reqNoStart = '';
            $reqNoEnd = '';
            $lines = explode("\n", $job['filter_params'] ?? '');
            foreach ($lines as $ln) {
                if (strpos($ln, '選擇請購單號:') !== false) {
                    $parts = explode(':', $ln, 2);
                    $subParts = explode('~', $parts[1] ?? '');
                    $reqNoStart = trim($subParts[0] ?? '');
                    $reqNoEnd = trim($subParts[1] ?? $reqNoStart);
                } elseif (strpos($ln, '輸入採購單別:') !== false) {
                    $parts = explode(':', $ln, 2);
                    $poType = trim($parts[1] ?? 'C331');
                } elseif (strpos($ln, '選擇廠別:') !== false) {
                    $parts = explode(':', $ln, 2);
                    $factory = trim($parts[1] ?? 'TP01');
                } elseif (strpos($ln, '選擇幣別:') !== false) {
                    $parts = explode(':', $ln, 2);
                    $currency = trim($parts[1] ?? 'NTD');
                } elseif (strpos($ln, '輸入採購日期:') !== false) {
                    $parts = explode(':', $ln, 2);
                    $poDate = trim($parts[1] ?? date('Y/m/d'));
                }
            }

            if (empty($reqNoStart)) {
                $sR = $pdo->prepare("SELECT `req_no` FROM `erp_requisitions` WHERE `created_by` = ? AND `status` = '已確認' ORDER BY `req_no` DESC LIMIT 1");
                $sR->execute([$uname]);
                $rRow = $sR->fetch();
                if ($rRow) $reqNoStart = $rRow['req_no'];
                else $reqNoStart = 'C311-' . date('Ymd') . '001';
            }
            if (empty($reqNoEnd)) $reqNoEnd = $reqNoStart;

            // Fetch matching requisitions
            $stmtR = $pdo->prepare("SELECT * FROM `erp_requisitions` WHERE `req_no` >= ? AND `req_no` <= ? AND `created_by` = ?");
            $stmtR->execute([$reqNoStart, $reqNoEnd, $uname]);
            $reqs = $stmtR->fetchAll();

            $genPoNos = [];
            foreach ($reqs as $req) {
                $cleanNo = preg_replace('/^[A-Z0-9]+-/', '', $req['req_no']);
                $poNo = $poType . '-' . $cleanNo;

                $dStmt = $pdo->prepare("SELECT * FROM `erp_requisition_details` WHERE `req_no` = ? AND `created_by` = ?");
                $dStmt->execute([$req['req_no'], $uname]);
                $reqItems = $dStmt->fetchAll();

                $totalQty = 0;
                $totalAmt = 0;
                foreach ($reqItems as $rit) {
                    $totalQty += (float)$rit['req_qty'];
                    $totalAmt += (float)$rit['amount'];
                }
                $poTax = round($totalAmt * 5 / 105);
                $netAmt = $totalAmt - $poTax;

                $firstRit = reset($reqItems);
                $suppNo = !empty($firstRit['supplier_no']) ? $firstRit['supplier_no'] : 'V001';
                $suppName = '深圳影石創新科技股份有限公司';
                $sStmt = $pdo->prepare("SELECT `name_short`, `full_name` FROM `erp_suppliers` WHERE `supplier_no` = ? LIMIT 1");
                $sStmt->execute([$suppNo]);
                $sRow = $sStmt->fetch();
                if ($sRow) {
                    $suppName = $sRow['name_short'] ?: $sRow['full_name'];
                }
                $poBuyer = !empty($firstRit['buyer']) ? $firstRit['buyer'] : $uname;

                $stmtPo = $pdo->prepare("INSERT INTO `erp_purchase_orders`
                    (`po_no`, `po_type`, `doc_date`, `po_date`, `supplier_no`, `supplier_name`, `factory`, `buyer`, `currency`, `exchange_rate`, `tax_code`, `tax_type`, `tax_rate`, `confirm_user`, `source_req_no`, `po_amount`, `tax_amount`, `grand_total`, `total_qty`, `status`, `created_by`)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1.0, 'P05', '2:應稅外加', 5.0, ?, ?, ?, ?, ?, ?, '已確認', ?)
                    ON DUPLICATE KEY UPDATE `grand_total`=VALUES(`grand_total`), `created_by`=VALUES(`created_by`)");
                $stmtPo->execute([
                    $poNo, $poType, $poDate, $poDate, $suppNo, $suppName, $factory, $poBuyer, $currency, $poBuyer, $req['req_no'], $netAmt, $poTax, $totalAmt, $totalQty, $uname
                ]);

                $pdo->prepare("DELETE FROM `erp_po_details` WHERE `po_no` = ? AND `created_by` = ?")->execute([$poNo, $uname]);
                $stmtPoD = $pdo->prepare("INSERT INTO `erp_po_details`
                    (`po_no`, `line_no`, `item_no`, `item_name`, `item_spec`, `po_qty`, `received_qty`, `unit`, `unit_price`, `amount`, `est_date`, `created_by`)
                    VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)");
                foreach ($reqItems as $idx => $rit) {
                    $stmtPoD->execute([
                        $poNo,
                        $rit['line_no'] ?: sprintf('%04d', $idx + 1),
                        $rit['item_no'],
                        $rit['item_name'],
                        $rit['item_spec'],
                        $rit['req_qty'],
                        $rit['unit'],
                        $rit['unit_price'],
                        $rit['amount'],
                        date('Y/m/d', strtotime('+1 day')),
                        $uname
                    ]);
                }
                $pdo->prepare("UPDATE `erp_requisition_details` SET `is_purchased` = 1, `is_locked` = 1, `po_no` = ?, `po_qty` = `req_qty` WHERE `req_no` = ? AND `created_by` = ?")->execute([$poNo, $req['req_no'], $uname]);
                $genPoNos[] = $poNo;
            }

            if (empty($genPoNos)) {
                $genPoNos[] = $poType . '-' . date('Ymd') . '001';
            }

            $nowTime = date('Y/n/j 下午 h:i:s');
            $poRange = count($genPoNos) > 1 ? ($genPoNos[0] . '~' . end($genPoNos)) : $genPoNos[0];
            $resultLog = "後端程式版號:4.0.17.1;$poRange; Commits: 1 Records, RollBacks: 0 Records;";

            $pdo->prepare("UPDATE `erp_batch_queue` SET `status` = '已完成', `end_time` = ?, `result_log` = ? WHERE `job_id` = ? AND `created_by` = ?")
                ->execute([$nowTime, $resultLog, $jobId, $uname]);

            jsonResponse([
                'success' => true,
                'message' => '佇列工作執行完成，已成功轉成採購單！',
                'po_no' => $genPoNos[0],
                'po_nos' => $genPoNos,
                'result_log' => $resultLog
            ]);
            break;

        // ==========================================
        // 14. ORDER TREE QUERY (COPQ05 - 1105擷取.PNG)
        // ==========================================
        case 'order_tree_query':
            $curUser = requireAuth();
            $uname = $curUser['username'];
            $orderNo = trim($_GET['order_no'] ?? '');
            $customerNo = trim($_GET['customer_no'] ?? '');

            // 1. 查詢符合條件之訂單及單身列表 (供查詢結果清單使用)
            $sql = "SELECT o.`order_no`, o.`order_type`, o.`doc_date`, o.`order_date`, o.`customer_no`, o.`customer_name`,
                           d.`line_no`, d.`item_no`, d.`item_name`, d.`item_spec`, d.`order_qty`, d.`unit`, d.`unit_price`, d.`est_delivery_date`
                    FROM `erp_orders` o
                    LEFT JOIN `erp_order_details` d ON o.`order_no` = d.`order_no` AND d.`created_by` = o.`created_by`
                    WHERE o.`created_by` = ? ";
            $params = [$uname];
            $cleanOrderNo = '';
            if (!empty($orderNo)) {
                $cleanOrderNo = preg_replace('/^[A-Za-z0-9]+-/', '', $orderNo);
                $sql .= " AND (o.`order_no` LIKE ? OR o.`order_no` LIKE ?) ";
                $params[] = "%$orderNo%";
                $params[] = "%$cleanOrderNo%";
            }
            if (!empty($customerNo)) {
                $sql .= " AND o.`customer_no` LIKE ? ";
                $params[] = "%$customerNo%";
            }
            $sql .= " ORDER BY o.`order_no` DESC, d.`line_no` ASC";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();

            // 鎖定當前欲展開樹狀圖之主訂單 (若未指定則預設取第一筆)
            $targetOrderNo = '';
            if (!empty($orderNo)) {
                $cleanOrderNo = preg_replace('/^[A-Za-z0-9]+-/', '', $orderNo);
                foreach ($rows as $r) {
                    if ($r['order_no'] === $orderNo || $r['order_no'] === $cleanOrderNo) {
                        $targetOrderNo = $r['order_no'];
                        break;
                    }
                }
                if (empty($targetOrderNo) && !empty($rows)) {
                    $targetOrderNo = $rows[0]['order_no'];
                }
            } else if (!empty($rows)) {
                $targetOrderNo = $rows[0]['order_no'];
            }

            $orderHeader = null;
            $orderDetails = [];
            $deliveries = [];
            $requisitions = [];
            $pos = [];
            $receipts = [];

            if (!empty($targetOrderNo)) {
                $cleanTargetNo = preg_replace('/^[A-Za-z0-9]+-/', '', $targetOrderNo);

                // 訂單主檔表頭
                $orderStmt = $pdo->prepare("SELECT * FROM `erp_orders` WHERE (`order_no` = ? OR `order_no` = ?) AND `created_by` = ? LIMIT 1");
                $orderStmt->execute([$targetOrderNo, $cleanTargetNo, $uname]);
                $orderHeader = $orderStmt->fetch() ?: null;

                // 訂單單身明細
                $detStmt = $pdo->prepare("SELECT * FROM `erp_order_details` WHERE (`order_no` = ? OR `order_no` = ?) AND `created_by` = ? ORDER BY `line_no` ASC");
                $detStmt->execute([$targetOrderNo, $cleanTargetNo, $uname]);
                $orderDetails = $detStmt->fetchAll();

                // 關聯銷貨出庫單 (A231)
                $delivStmt = $pdo->prepare("SELECT del.*, dd.`line_no` AS `detail_line_no`, dd.`item_no`, dd.`item_name`, dd.`delivery_qty`, dd.`gift_qty`, dd.`unit`
                    FROM `erp_deliveries` del
                    LEFT JOIN `erp_delivery_details` dd ON del.`delivery_no` = dd.`delivery_no` AND dd.`created_by` = del.`created_by`
                    WHERE (del.`order_no` = ? OR del.`order_no` = ? OR del.`order_no` LIKE ?) AND del.`created_by` = ?");
                $delivStmt->execute([$targetOrderNo, $cleanTargetNo, "%$cleanTargetNo%", $uname]);
                $deliveries = $delivStmt->fetchAll();

                // 關聯請購單 (C311)
                $reqStmt = $pdo->prepare("SELECT req.*, rd.`line_no` AS `detail_line_no`, rd.`item_no`, rd.`item_name`, rd.`req_qty`, rd.`po_qty`, rd.`unit`
                    FROM `erp_requisitions` req
                    LEFT JOIN `erp_requisition_details` rd ON req.`req_no` = rd.`req_no` AND rd.`created_by` = req.`created_by`
                    WHERE (req.`source_no` = ? OR req.`source_no` = ? OR req.`source_no` LIKE ? OR req.`req_no` LIKE ?) AND req.`created_by` = ?");
                $reqStmt->execute([$targetOrderNo, $cleanTargetNo, "%$cleanTargetNo%", "%$cleanTargetNo%", $uname]);
                $requisitions = $reqStmt->fetchAll();

                // 關聯採購單 (C331)
                $reqNos = array_unique(array_filter(array_column($requisitions, 'req_no')));
                if (!empty($reqNos)) {
                    $inPlaceholders = implode(',', array_fill(0, count($reqNos), '?'));
                    $poStmt = $pdo->prepare("SELECT po.*, pd.`line_no` AS `detail_line_no`, pd.`item_no`, pd.`item_name`, pd.`po_qty`, pd.`received_qty`, pd.`unit`, pd.`est_date`
                        FROM `erp_purchase_orders` po
                        LEFT JOIN `erp_po_details` pd ON po.`po_no` = pd.`po_no` AND pd.`created_by` = po.`created_by`
                        WHERE (po.`source_req_no` IN ($inPlaceholders) OR po.`po_no` LIKE ?) AND po.`created_by` = ?");
                    $poStmt->execute(array_merge($reqNos, ["%$cleanTargetNo%", $uname]));
                    $pos = $poStmt->fetchAll();
                }

                // 關聯進貨入庫單 (C341 / A331)
                $poNos = array_unique(array_filter(array_column($pos, 'po_no')));
                if (!empty($poNos)) {
                    $inPlaceholders = implode(',', array_fill(0, count($poNos), '?'));
                    $grStmt = $pdo->prepare("SELECT gr.*, gd.`line_no` AS `detail_line_no`, gd.`item_no`, gd.`item_name`, gd.`gr_qty`, gd.`check_qty`, gd.`unit`, gd.`warehouse`
                        FROM `erp_goods_receipts` gr
                        LEFT JOIN `erp_gr_details` gd ON gr.`gr_no` = gd.`gr_no` AND gd.`created_by` = gr.`created_by`
                        WHERE (gr.`po_no` IN ($inPlaceholders) OR gr.`po_no` LIKE ?) AND gr.`created_by` = ?");
                    $grStmt->execute(array_merge($poNos, ["%$cleanTargetNo%", $uname]));
                    $receipts = $grStmt->fetchAll();
                }
            }

            // 同時滿足清單列表與全鏈路結構之格式回傳
            jsonResponse([
                'success' => true,
                'data' => [
                    'list' => $rows,
                    'order' => $orderHeader,
                    'details' => $orderDetails,
                    'requisitions' => $requisitions,
                    'purchase_orders' => $pos,
                    'pos' => $pos,
                    'receipts' => $receipts,
                    'deliveries' => $deliveries
                ]
            ]);
            break;

        // ==========================================
        // 13. 文字客服 (E-Service Support)
        // ==========================================
        case 'send_support_message':
            $cur = getCurrentUser();
            $uname = trim($input['username'] ?? ($cur['username'] ?? ''));
            if (empty($uname)) {
                $uname = 'guest';
            }
            $comp = trim($input['company'] ?? ($cur['company'] ?? ('學生區' . $uname)));
            $senderName = trim($input['display_name'] ?? ($cur['display_name'] ?? ('學生' . $uname)));
            $msg = trim($input['message'] ?? '');
            if (empty($msg)) {
                jsonResponse(['success' => false, 'error' => '請輸入問題內容！']);
            }

            // 寫入使用者問題
            $stmt = $pdo->prepare("INSERT INTO `erp_support_messages` (`username`, `company`, `sender_role`, `sender_name`, `message`, `status`) VALUES (?, ?, 'user', ?, ?, '處理中')");
            $stmt->execute([$uname, $comp, $senderName, $msg]);
            $msgId = $pdo->lastInsertId();

            // 自動寫入一筆系統即時確認訊息
            $systemReply = "已收到問題，處理好會再通知，謝謝您";
            $sysStmt = $pdo->prepare("INSERT INTO `erp_support_messages` (`username`, `company`, `sender_role`, `sender_name`, `message`, `reply_to_id`, `status`) VALUES (?, ?, 'system', '系統客服', ?, ?, '處理中')");
            $sysStmt->execute([$uname, $comp, $systemReply, $msgId]);

            jsonResponse([
                'success' => true,
                'prompt' => '已收到問題，處理好會再通知，謝謝您',
                'message_id' => $msgId
            ]);
            break;

        case 'get_support_messages':
            $cur = getCurrentUser();
            $targetUser = trim($input['target_username'] ?? '');
            $curUser = $cur['username'] ?? trim($input['username'] ?? '');
            $curRole = $cur['role'] ?? '';
            if (strtolower($curUser) === 'admin') {
                $curRole = 'admin';
            }

            if ($curRole === 'admin' && !empty($targetUser)) {
                $queryUser = $targetUser;
            } else {
                $queryUser = !empty($targetUser) ? $targetUser : (!empty($curUser) ? $curUser : 'guest');
            }

            $stmt = $pdo->prepare("SELECT * FROM `erp_support_messages` WHERE `username` = ? ORDER BY `id` ASC");
            $stmt->execute([$queryUser]);
            $messages = $stmt->fetchAll();

            jsonResponse(['success' => true, 'data' => $messages]);
            break;

        case 'get_admin_support_threads':
            // 最高管理者取得所有回報問題的使用者清單
            $stmt = $pdo->query("
                SELECT 
                    `username`,
                    `company`,
                    MAX(`created_at`) as `last_time`,
                    COUNT(CASE WHEN `sender_role` = 'user' AND `status` = '處理中' THEN 1 END) as `pending_count`,
                    COUNT(*) as `total_messages`
                FROM `erp_support_messages`
                GROUP BY `username`, `company`
                ORDER BY `last_time` DESC
            ");
            $threads = $stmt->fetchAll();

            // 附上每個 user 最新提問的 message (優先取學生的提問問題)
            foreach ($threads as &$th) {
                $lastMsgStmt = $pdo->prepare("SELECT `message`, `sender_role`, `created_at` FROM `erp_support_messages` WHERE `username` = ? AND `sender_role` = 'user' ORDER BY `id` DESC LIMIT 1");
                $lastMsgStmt->execute([$th['username']]);
                $lastMsg = $lastMsgStmt->fetch();
                if (!$lastMsg) {
                    $lastMsgStmt = $pdo->prepare("SELECT `message`, `sender_role`, `created_at` FROM `erp_support_messages` WHERE `username` = ? ORDER BY `id` DESC LIMIT 1");
                    $lastMsgStmt->execute([$th['username']]);
                    $lastMsg = $lastMsgStmt->fetch();
                }
                $th['latest_message'] = $lastMsg ? $lastMsg['message'] : '';
                $th['latest_role'] = $lastMsg ? $lastMsg['sender_role'] : '';
            }
            unset($th);

            jsonResponse(['success' => true, 'data' => $threads]);
            break;

        case 'admin_reply_support':
            $cur = getCurrentUser();
            $adminName = trim($input['admin_name'] ?? ($cur['username'] ?? '最高管理者'));
            $targetUser = trim($input['target_username'] ?? '');
            $replyMsg = trim($input['message'] ?? '');
            if (empty($targetUser) || empty($replyMsg)) {
                jsonResponse(['success' => false, 'error' => '請選擇回覆對象並輸入回覆內容！']);
            }

            // 查詢該使用者的 company
            $compStmt = $pdo->prepare("SELECT `company` FROM `erp_support_messages` WHERE `username` = ? ORDER BY `id` DESC LIMIT 1");
            $compStmt->execute([$targetUser]);
            $compRow = $compStmt->fetch();
            $comp = $compRow ? $compRow['company'] : ('學生區' . $targetUser);

            // 寫入管理者回覆訊息
            $stmt = $pdo->prepare("INSERT INTO `erp_support_messages` (`username`, `company`, `sender_role`, `sender_name`, `message`, `status`) VALUES (?, ?, 'admin', ?, ?, '已回覆')");
            $stmt->execute([$targetUser, $comp, $adminName, $replyMsg]);

            // 更新該使用者之前「處理中」的狀態為「已回覆」
            $updStmt = $pdo->prepare("UPDATE `erp_support_messages` SET `status` = '已回覆' WHERE `username` = ? AND `status` = '處理中'");
            $updStmt->execute([$targetUser]);

            jsonResponse(['success' => true, 'message' => '回覆成功！']);
            break;

        default:
            jsonResponse(['success' => false, 'error' => '未知或未支援的 API 請求: ' . htmlspecialchars($action)]);
            break;
    }
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()]);
}
