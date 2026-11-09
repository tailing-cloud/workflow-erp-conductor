<?php
// C:\xampp\htdocs\erp\init_db.php
header('Content-Type: text/plain; charset=utf-8');

$host = '127.0.0.1';
$user = 'root';
$pass = '';
$dbname = 'erp_db';

try {
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `$dbname`");
    echo "Connected to database $dbname successfully.\n";

    // 1. Users Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `username` VARCHAR(50) UNIQUE NOT NULL,
        `password` VARCHAR(255) NOT NULL,
        `display_name` VARCHAR(100) NOT NULL,
        `company` VARCHAR(50) DEFAULT '學生區B18',
        `role` VARCHAR(50) DEFAULT 'student',
        `is_active` TINYINT DEFAULT 1,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // 2. Companies Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_companies` (
        `code` VARCHAR(50) PRIMARY KEY,
        `name` VARCHAR(100) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // 3. Customers Table (COPI01)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_customers` (
        `customer_no` VARCHAR(50) PRIMARY KEY,
        `name_short` VARCHAR(50) NOT NULL,
        `full_name` VARCHAR(150) NOT NULL,
        `eng_name` VARCHAR(150) DEFAULT '',
        `version` VARCHAR(10) DEFAULT '1',
        `approval_date` VARCHAR(20) DEFAULT '2026/11/05',
        `related_party_no` VARCHAR(50) DEFAULT '',
        `boss` VARCHAR(50) DEFAULT '',
        `contact` VARCHAR(50) DEFAULT '',
        `tel1` VARCHAR(50) DEFAULT '',
        `tel2` VARCHAR(50) DEFAULT '',
        `fax` VARCHAR(50) DEFAULT '',
        `email` VARCHAR(100) DEFAULT '',
        `tax_id` VARCHAR(20) DEFAULT '',
        `capital` DECIMAL(15,2) DEFAULT 0,
        `annual_sales` DECIMAL(15,2) DEFAULT 0,
        `employee_count` INT DEFAULT 0,
        `main_store_no` VARCHAR(50) DEFAULT '',
        `branch_count` INT DEFAULT 0,
        `currency` VARCHAR(10) DEFAULT 'NTD',
        `dept` VARCHAR(50) DEFAULT '0100 業務部',
        `sales_person` VARCHAR(50) DEFAULT '',
        `collector` VARCHAR(50) DEFAULT '',
        `open_date` VARCHAR(20) DEFAULT '',
        `close_date` VARCHAR(20) DEFAULT '',
        `address` VARCHAR(255) DEFAULT '',
        `credit_limit` DECIMAL(15,2) DEFAULT 5000000,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // 4. Items Table (INVI02)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_items` (
        `item_no` VARCHAR(50) PRIMARY KEY,
        `item_name` VARCHAR(150) NOT NULL,
        `item_spec` VARCHAR(150) DEFAULT '',
        `item_code` VARCHAR(50) DEFAULT '',
        `item_size` VARCHAR(50) DEFAULT '',
        `version` VARCHAR(10) DEFAULT '1',
        `unit` VARCHAR(20) DEFAULT '台',
        `small_unit` VARCHAR(20) DEFAULT '台',
        `pack_unit` VARCHAR(20) DEFAULT '箱',
        `stock_qty` DECIMAL(15,2) DEFAULT 0,
        `stock_amount` DECIMAL(15,2) DEFAULT 0,
        `unit_cost` DECIMAL(15,2) DEFAULT 0,
        `std_price` DECIMAL(15,2) DEFAULT 0,
        `retail_price` DECIMAL(15,2) DEFAULT 0,
        `std_purchase_price` DECIMAL(15,2) DEFAULT 0,
        `recent_purchase_price` DECIMAL(15,2) DEFAULT 0,
        `approval_date` VARCHAR(20) DEFAULT '2026/11/01',
        `main_warehouse` VARCHAR(50) DEFAULT 'W01 主原料庫',
        `accounting_code` VARCHAR(50) DEFAULT '1201',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // 5. Suppliers Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_suppliers` (
        `supplier_no` VARCHAR(50) PRIMARY KEY,
        `name_short` VARCHAR(50) NOT NULL,
        `full_name` VARCHAR(150) NOT NULL,
        `contact` VARCHAR(50) DEFAULT '',
        `tel` VARCHAR(50) DEFAULT '',
        `tax_id` VARCHAR(20) DEFAULT '',
        `currency` VARCHAR(10) DEFAULT 'NTD',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // 6. Quotations Table (COPI05)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_quotations` (
        `quote_no` VARCHAR(50) PRIMARY KEY,
        `quote_type` VARCHAR(20) DEFAULT 'A211',
        `doc_date` VARCHAR(20) DEFAULT '',
        `quote_date` VARCHAR(20) DEFAULT '',
        `version` VARCHAR(10) DEFAULT '1',
        `customer_confirmed` TINYINT DEFAULT 1,
        `confirm_user` VARCHAR(50) DEFAULT 'B18',
        `customer_no` VARCHAR(50) NOT NULL,
        `customer_name` VARCHAR(150) DEFAULT '',
        `tax_type` VARCHAR(20) DEFAULT '2 應稅內含',
        `tax_code` VARCHAR(20) DEFAULT '1',
        `currency` VARCHAR(10) DEFAULT 'NTD',
        `exchange_rate` DECIMAL(10,4) DEFAULT 1.0,
        `sales_person` VARCHAR(50) DEFAULT 'B18',
        `tax_rate` DECIMAL(5,2) DEFAULT 5.0,
        `quote_amount` DECIMAL(15,2) DEFAULT 0,
        `tax_amount` DECIMAL(15,2) DEFAULT 0,
        `grand_total` DECIMAL(15,2) DEFAULT 0,
        `total_qty` DECIMAL(15,2) DEFAULT 0,
        `status` VARCHAR(20) DEFAULT '已確認',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Quotation Details
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_quotation_details` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `quote_no` VARCHAR(50) NOT NULL,
        `line_no` VARCHAR(10) DEFAULT '0001',
        `biz_item_no` VARCHAR(50) DEFAULT '',
        `item_no` VARCHAR(50) NOT NULL,
        `item_name` VARCHAR(150) DEFAULT '',
        `item_spec` VARCHAR(150) DEFAULT '',
        `qty` DECIMAL(15,2) DEFAULT 0,
        `unit` VARCHAR(20) DEFAULT '台',
        `unit_price` DECIMAL(15,2) DEFAULT 0,
        `amount` DECIMAL(15,2) DEFAULT 0,
        `delivery_date` VARCHAR(20) DEFAULT '',
        INDEX(`quote_no`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // 7. Orders Table (COPI06)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_orders` (
        `order_no` VARCHAR(50) PRIMARY KEY,
        `order_type` VARCHAR(20) DEFAULT 'A221',
        `doc_date` VARCHAR(20) DEFAULT '2026/11/05',
        `order_date` VARCHAR(20) DEFAULT '2026/11/05',
        `customer_no` VARCHAR(50) NOT NULL,
        `customer_name` VARCHAR(150) DEFAULT '',
        `version` VARCHAR(10) DEFAULT '1',
        `flow_code` VARCHAR(50) DEFAULT '',
        `defer_days` INT DEFAULT 0,
        `credit_control` TINYINT DEFAULT 0,
        `transfer_status` VARCHAR(50) DEFAULT '',
        `confirm_user` VARCHAR(50) DEFAULT 'B18',
        `ebo_status` VARCHAR(50) DEFAULT '不需拋轉',
        `dept` VARCHAR(50) DEFAULT '0100',
        `sales_person` VARCHAR(50) DEFAULT 'B18',
        `factory` VARCHAR(50) DEFAULT '01',
        `currency` VARCHAR(10) DEFAULT 'NTD',
        `exchange_rate` DECIMAL(10,4) DEFAULT 1.0,
        `tax_code` VARCHAR(20) DEFAULT '1',
        `tax_type` VARCHAR(50) DEFAULT '2 應稅內含',
        `tax_rate` DECIMAL(5,2) DEFAULT 5.0,
        `order_amount` DECIMAL(15,2) DEFAULT 0,
        `order_tax` DECIMAL(15,2) DEFAULT 0,
        `grand_total` DECIMAL(15,2) DEFAULT 0,
        `total_qty` DECIMAL(15,2) DEFAULT 0,
        `total_weight` DECIMAL(15,2) DEFAULT 0,
        `total_volume` DECIMAL(15,2) DEFAULT 0,
        `status` VARCHAR(20) DEFAULT '已確認',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Order Details
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_order_details` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `order_no` VARCHAR(50) NOT NULL,
        `line_no` VARCHAR(10) DEFAULT '0001',
        `biz_item_no` VARCHAR(50) DEFAULT '',
        `item_no` VARCHAR(50) NOT NULL,
        `item_name` VARCHAR(150) DEFAULT '',
        `item_spec` VARCHAR(150) DEFAULT '',
        `order_qty` DECIMAL(15,2) DEFAULT 0,
        `unit` VARCHAR(20) DEFAULT '台',
        `unit_price` DECIMAL(15,2) DEFAULT 0,
        `amount` DECIMAL(15,2) DEFAULT 0,
        `est_delivery_date` VARCHAR(20) DEFAULT '2026/11/05',
        `warehouse` VARCHAR(50) DEFAULT 'W01',
        `delivered_qty` DECIMAL(15,2) DEFAULT 0,
        INDEX(`order_no`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // 8. Requisitions Table (PURI05 / PURI06)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_requisitions` (
        `req_no` VARCHAR(50) PRIMARY KEY,
        `req_type` VARCHAR(20) DEFAULT 'C311',
        `doc_date` VARCHAR(20) DEFAULT '2026/11/05',
        `req_date` VARCHAR(20) DEFAULT '2026/11/05',
        `factory` VARCHAR(50) DEFAULT '01',
        `dept` VARCHAR(50) DEFAULT '0100 業務部',
        `req_user` VARCHAR(50) DEFAULT 'B18',
        `source_type` VARCHAR(50) DEFAULT '訂單轉請購',
        `source_no` VARCHAR(50) DEFAULT 'A221-202611001',
        `confirm_user` VARCHAR(50) DEFAULT 'B18',
        `sign_status` VARCHAR(50) DEFAULT '核准',
        `is_locked` TINYINT DEFAULT 1,
        `status` VARCHAR(50) DEFAULT '已確認',
        `total_qty` DECIMAL(15,2) DEFAULT 0,
        `total_amount` DECIMAL(15,2) DEFAULT 0,
        `remark` TEXT,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Requisition Details
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_requisition_details` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `req_no` VARCHAR(50) NOT NULL,
        `line_no` VARCHAR(10) DEFAULT '0001',
        `item_no` VARCHAR(50) NOT NULL,
        `item_name` VARCHAR(150) DEFAULT '',
        `item_spec` VARCHAR(150) DEFAULT '',
        `req_qty` DECIMAL(15,2) DEFAULT 0,
        `unit` VARCHAR(20) DEFAULT '台',
        `warehouse` VARCHAR(50) DEFAULT 'W01',
        `unit_price` DECIMAL(15,2) DEFAULT 0,
        `amount` DECIMAL(15,2) DEFAULT 0,
        `po_qty` DECIMAL(15,2) DEFAULT 0,
        INDEX(`req_no`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // 9. Purchase Orders Table (PURI07)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_purchase_orders` (
        `po_no` VARCHAR(50) PRIMARY KEY,
        `po_type` VARCHAR(20) DEFAULT 'C331',
        `doc_date` VARCHAR(20) DEFAULT '2026/11/05',
        `po_date` VARCHAR(20) DEFAULT '2026/11/05',
        `supplier_no` VARCHAR(50) NOT NULL,
        `supplier_name` VARCHAR(150) DEFAULT '',
        `factory` VARCHAR(50) DEFAULT '01',
        `buyer` VARCHAR(50) DEFAULT 'B18',
        `currency` VARCHAR(10) DEFAULT 'NTD',
        `exchange_rate` DECIMAL(10,4) DEFAULT 1.0,
        `tax_code` VARCHAR(20) DEFAULT '1',
        `tax_type` VARCHAR(50) DEFAULT '2 應稅內含',
        `tax_rate` DECIMAL(5,2) DEFAULT 5.0,
        `confirm_user` VARCHAR(50) DEFAULT 'B18',
        `source_req_no` VARCHAR(50) DEFAULT 'C311-202611001',
        `po_amount` DECIMAL(15,2) DEFAULT 0,
        `tax_amount` DECIMAL(15,2) DEFAULT 0,
        `grand_total` DECIMAL(15,2) DEFAULT 0,
        `total_qty` DECIMAL(15,2) DEFAULT 0,
        `status` VARCHAR(20) DEFAULT '已確認',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // PO Details
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_po_details` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `po_no` VARCHAR(50) NOT NULL,
        `line_no` VARCHAR(10) DEFAULT '0001',
        `item_no` VARCHAR(50) NOT NULL,
        `item_name` VARCHAR(150) DEFAULT '',
        `item_spec` VARCHAR(150) DEFAULT '',
        `po_qty` DECIMAL(15,2) DEFAULT 0,
        `received_qty` DECIMAL(15,2) DEFAULT 0,
        `unit` VARCHAR(20) DEFAULT '台',
        `unit_price` DECIMAL(15,2) DEFAULT 0,
        `amount` DECIMAL(15,2) DEFAULT 0,
        `est_date` VARCHAR(20) DEFAULT '2026/11/04',
        INDEX(`po_no`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // 10. Goods Receipts Table (PURI09)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_goods_receipts` (
        `gr_no` VARCHAR(50) PRIMARY KEY,
        `gr_type` VARCHAR(20) DEFAULT 'C341',
        `doc_date` VARCHAR(20) DEFAULT '2026/11/05',
        `gr_date` VARCHAR(20) DEFAULT '2026/11/05',
        `supplier_no` VARCHAR(50) NOT NULL,
        `supplier_name` VARCHAR(150) DEFAULT '',
        `factory` VARCHAR(50) DEFAULT '01',
        `currency` VARCHAR(10) DEFAULT 'NTD',
        `exchange_rate` DECIMAL(10,4) DEFAULT 1.0,
        `po_no` VARCHAR(50) DEFAULT 'C331-202611001',
        `total_qty` DECIMAL(15,2) DEFAULT 0,
        `gr_amount` DECIMAL(15,2) DEFAULT 0,
        `tax_amount` DECIMAL(15,2) DEFAULT 0,
        `grand_total` DECIMAL(15,2) DEFAULT 0,
        `status` VARCHAR(20) DEFAULT '已確認',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // GR Details
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_gr_details` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `gr_no` VARCHAR(50) NOT NULL,
        `line_no` VARCHAR(10) DEFAULT '0001',
        `item_no` VARCHAR(50) NOT NULL,
        `item_name` VARCHAR(150) DEFAULT '',
        `item_spec` VARCHAR(150) DEFAULT '',
        `gr_qty` DECIMAL(15,2) DEFAULT 0,
        `unit` VARCHAR(20) DEFAULT '台',
        `unit_price` DECIMAL(15,2) DEFAULT 0,
        `amount` DECIMAL(15,2) DEFAULT 0,
        `warehouse` VARCHAR(50) DEFAULT 'W01',
        INDEX(`gr_no`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // 11. Deliveries / Sales Invoices Table (COPI08)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_deliveries` (
        `delivery_no` VARCHAR(50) PRIMARY KEY,
        `delivery_type` VARCHAR(20) DEFAULT 'A231',
        `doc_date` VARCHAR(20) DEFAULT '2026/11/05',
        `delivery_date` VARCHAR(20) DEFAULT '2026/11/05',
        `customer_no` VARCHAR(50) NOT NULL,
        `customer_name` VARCHAR(150) DEFAULT '',
        `order_no` VARCHAR(50) DEFAULT 'A221-202611001',
        `factory` VARCHAR(50) DEFAULT '01',
        `currency` VARCHAR(10) DEFAULT 'NTD',
        `exchange_rate` DECIMAL(10,4) DEFAULT 1.0,
        `gen_income_entry` TINYINT DEFAULT 1,
        `gen_cost_entry` TINYINT DEFAULT 1,
        `confirm_user` VARCHAR(50) DEFAULT 'B18',
        `total_qty` DECIMAL(15,2) DEFAULT 0,
        `delivery_amount` DECIMAL(15,2) DEFAULT 0,
        `tax_amount` DECIMAL(15,2) DEFAULT 0,
        `grand_total` DECIMAL(15,2) DEFAULT 0,
        `status` VARCHAR(20) DEFAULT '已確認',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Delivery Details
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_delivery_details` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `delivery_no` VARCHAR(50) NOT NULL,
        `line_no` VARCHAR(10) DEFAULT '0001',
        `biz_item_no` VARCHAR(50) DEFAULT '',
        `item_no` VARCHAR(50) NOT NULL,
        `item_name` VARCHAR(150) DEFAULT '',
        `item_spec` VARCHAR(150) DEFAULT '',
        `delivery_qty` DECIMAL(15,2) DEFAULT 0,
        `gift_qty` DECIMAL(15,2) DEFAULT 0,
        `unit` VARCHAR(20) DEFAULT '台',
        `unit_price` DECIMAL(15,2) DEFAULT 0,
        `amount` DECIMAL(15,2) DEFAULT 0,
        `warehouse` VARCHAR(50) DEFAULT 'W01',
        INDEX(`delivery_no`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // 12. Batch Queue Jobs Table (佇列工作控制台 擷取18.PNG)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_batch_queue` (
        `job_id` VARCHAR(50) PRIMARY KEY,
        `job_name` VARCHAR(100) NOT NULL,
        `process_mode` VARCHAR(50) DEFAULT '依佇列順序',
        `est_time` VARCHAR(50) DEFAULT '',
        `status` VARCHAR(50) DEFAULT '已完成',
        `operator` VARCHAR(50) DEFAULT 'WIN-S7UJO0KFN',
        `start_time` VARCHAR(50) DEFAULT '',
        `end_time` VARCHAR(50) DEFAULT '',
        `filter_params` TEXT,
        `result_log` TEXT,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    echo "Tables created successfully.\n";

    // Insert Seed Data
    // Default Users
    $pdo->exec("INSERT INTO `erp_users` (`username`, `password`, `display_name`, `company`, `role`) VALUES
        ('B18', 'B18', '學生B18', '學生區B18', 'student'),
        ('admin', 'admin', '系統管理員', '學生區B18', 'admin'),
        ('student01', '1234', '學生01', '學生區B18', 'student')
        ON DUPLICATE KEY UPDATE `display_name`=VALUES(`display_name`), `company`=VALUES(`company`)");

    // Default Companies
    $pdo->exec("INSERT INTO `erp_companies` (`code`, `name`) VALUES
        ('學生區B18', '學生區B18 - 練習公司'),
        ('學生區A01', '學生區A01 - 測試公司'),
        ('總公司', '示範製造股份有限公司')
        ON DUPLICATE KEY UPDATE `name`=VALUES(`name`)");

    // Default Customers (COPI01)
    $pdo->exec("INSERT INTO `erp_customers` (
        `customer_no`, `name_short`, `full_name`, `eng_name`, `version`, `approval_date`,
        `boss`, `contact`, `tel1`, `fax`, `email`, `tax_id`, `capital`, `annual_sales`,
        `employee_count`, `currency`, `dept`, `sales_person`, `collector`, `open_date`
    ) VALUES (
        '1109', '上奇科技', '上奇科技股份有限公司', 'GrandTech Cloud Services Inc.', '1', '2026/11/05',
        '張雲飛', '陳志明', '02-87923001', '02-87923002', 'contact@grandtech.com.tw', '84149615',
        15000, 85000, 250, 'NTD', '0100 業務部', '1001 張明達', '1001 張明達', '2005/03/15'
    ), (
        '1001', '宏碁科技', '宏碁股份有限公司', 'Acer Inc.', '1', '2026/10/01',
        '陳俊聖', '林小姐', '02-26961234', '02-26965678', 'service@acer.com', '04283908',
        300000, 2500000, 7500, 'NTD', '0100 業務部', '1001 張明達', '1001 張明達', '1976/08/01'
    ) ON DUPLICATE KEY UPDATE `full_name`=VALUES(`full_name`)");

    // Default Items (INVI02)
    $pdo->exec("INSERT INTO `erp_items` (
        `item_no`, `item_name`, `item_spec`, `item_code`, `version`, `unit`, `small_unit`, `pack_unit`,
        `stock_qty`, `stock_amount`, `unit_cost`, `std_price`, `retail_price`, `std_purchase_price`,
        `recent_purchase_price`, `approval_date`, `main_warehouse`, `accounting_code`
    ) VALUES (
        '900006', 'Insta360 Flow 2 Pro / Flow 2', '全功能 AI 三軸手機穩定器', 'IF2-PRO', '1', '台', '台', '箱',
        100, 420000, 4200, 5500, 5990, 4200, 4200, '2026/11/01', 'W01 主原料庫', '1201'
    ), (
        '900001', 'Insta360 X4 運動全景相機', '8K 360度防水運動相機', 'X4-8K', '1', '台', '台', '箱',
        50, 750000, 15000, 18990, 19990, 15000, 15000, '2026/10/15', 'W01 主原料庫', '1201'
    ) ON DUPLICATE KEY UPDATE `item_name`=VALUES(`item_name`)");

    // Default Suppliers
    $pdo->exec("INSERT INTO `erp_suppliers` (
        `supplier_no`, `name_short`, `full_name`, `contact`, `tel`, `tax_id`, `currency`
    ) VALUES (
        'V001', '影石創新', '深圳影石創新科技股份有限公司', '劉經理', '0755-86655123', '9144030009', 'NTD'
    ) ON DUPLICATE KEY UPDATE `full_name`=VALUES(`full_name`)");

    // Default Order A221-202611001 (COPI06)
    $pdo->exec("INSERT INTO `erp_orders` (
        `order_no`, `order_type`, `doc_date`, `order_date`, `customer_no`, `customer_name`,
        `version`, `flow_code`, `defer_days`, `credit_control`, `transfer_status`,
        `confirm_user`, `ebo_status`, `dept`, `sales_person`, `factory`, `currency`,
        `exchange_rate`, `tax_code`, `tax_type`, `tax_rate`, `order_amount`, `order_tax`,
        `grand_total`, `total_qty`, `status`
    ) VALUES (
        'A221-202611001', 'A221', '2026/11/05', '2026/11/05', '1109', '上奇科技股份有限公司',
        '1', '', 0, 0, '已轉出', 'B18', '不需拋轉', '0100', 'B18', '01', 'NTD',
        1.0, '1', '2 應稅內含', 5.0, 104762, 5238, 110000, 20, '已確認'
    ) ON DUPLICATE KEY UPDATE `grand_total`=VALUES(`grand_total`)");

    $pdo->exec("DELETE FROM `erp_order_details` WHERE `order_no`='A221-202611001'");
    $pdo->exec("INSERT INTO `erp_order_details` (
        `order_no`, `line_no`, `item_no`, `item_name`, `item_spec`, `order_qty`,
        `unit`, `unit_price`, `amount`, `est_delivery_date`, `warehouse`, `delivered_qty`
    ) VALUES (
        'A221-202611001', '0001', '900006', 'Insta360 Flow 2 Pro / Flow 2', '全功能 AI 三軸手機穩定器',
        20, '台', 5500, 110000, '2026/11/05', 'W01', 20
    )");

    // Default Requisition C311-202611001 (PURI05)
    $pdo->exec("INSERT INTO `erp_requisitions` (
        `req_no`, `req_type`, `doc_date`, `req_date`, `factory`, `dept`, `req_user`,
        `source_type`, `source_no`, `confirm_user`, `sign_status`, `is_locked`,
        `status`, `total_qty`, `total_amount`
    ) VALUES (
        'C311-202611001', 'C311', '2026/11/05', '2026/11/05', '01', '0100 業務部', 'B18',
        '訂單轉請購', 'A221-202611001', 'B18', '核准', 1,
        '已確認', 20, 84000
    ) ON DUPLICATE KEY UPDATE `total_amount`=VALUES(`total_amount`)");

    $pdo->exec("DELETE FROM `erp_requisition_details` WHERE `req_no`='C311-202611001'");
    $pdo->exec("INSERT INTO `erp_requisition_details` (
        `req_no`, `line_no`, `item_no`, `item_name`, `item_spec`, `req_qty`,
        `unit`, `warehouse`, `unit_price`, `amount`, `po_qty`
    ) VALUES (
        'C311-202611001', '0001', '900006', 'Insta360 Flow 2 Pro / Flow 2', '全功能 AI 三軸手機穩定器',
        20, '台', 'W01', 4200, 84000, 20
    )");

    // Default Purchase Order C331-202611001 (PURI07)
    $pdo->exec("INSERT INTO `erp_purchase_orders` (
        `po_no`, `po_type`, `doc_date`, `po_date`, `supplier_no`, `supplier_name`,
        `factory`, `buyer`, `currency`, `exchange_rate`, `tax_code`, `tax_type`,
        `tax_rate`, `confirm_user`, `source_req_no`, `po_amount`, `tax_amount`,
        `grand_total`, `total_qty`, `status`
    ) VALUES (
        'C331-202611001', 'C331', '2026/11/05', '2026/11/05', 'V001', '深圳影石創新科技股份有限公司',
        '01', 'B18', 'NTD', 1.0, '1', '2 應稅內含',
        5.0, 'B18', 'C311-202611001', 80000, 4000,
        84000, 20, '已確認'
    ) ON DUPLICATE KEY UPDATE `grand_total`=VALUES(`grand_total`)");

    $pdo->exec("DELETE FROM `erp_po_details` WHERE `po_no`='C331-202611001'");
    $pdo->exec("INSERT INTO `erp_po_details` (
        `po_no`, `line_no`, `item_no`, `item_name`, `item_spec`, `po_qty`,
        `received_qty`, `unit`, `unit_price`, `amount`, `est_date`
    ) VALUES (
        'C331-202611001', '0001', '900006', 'Insta360 Flow 2 Pro / Flow 2', '全功能 AI 三軸手機穩定器',
        20, 20, '台', 4200, 84000, '2026/11/04'
    )");

    // Default Goods Receipt C341-202611001 (PURI09)
    $pdo->exec("INSERT INTO `erp_goods_receipts` (
        `gr_no`, `gr_type`, `doc_date`, `gr_date`, `supplier_no`, `supplier_name`,
        `factory`, `currency`, `exchange_rate`, `po_no`, `total_qty`,
        `gr_amount`, `tax_amount`, `grand_total`, `status`
    ) VALUES (
        'C341-202611001', 'C341', '2026/11/05', '2026/11/05', 'V001', '深圳影石創新科技股份有限公司',
        '01', 'NTD', 1.0, 'C331-202611001', 20,
        80000, 4000, 84000, '已確認'
    ) ON DUPLICATE KEY UPDATE `grand_total`=VALUES(`grand_total`)");

    $pdo->exec("DELETE FROM `erp_gr_details` WHERE `gr_no`='C341-202611001'");
    $pdo->exec("INSERT INTO `erp_gr_details` (
        `gr_no`, `line_no`, `item_no`, `item_name`, `item_spec`, `gr_qty`,
        `unit`, `unit_price`, `amount`, `warehouse`
    ) VALUES (
        'C341-202611001', '0001', '900006', 'Insta360 Flow 2 Pro / Flow 2', '全功能 AI 三軸手機穩定器',
        20, '台', 4200, 84000, 'W01'
    )");

    // Default Delivery A231-202611001 (COPI08)
    $pdo->exec("INSERT INTO `erp_deliveries` (
        `delivery_no`, `delivery_type`, `doc_date`, `delivery_date`, `customer_no`,
        `customer_name`, `order_no`, `factory`, `currency`, `exchange_rate`,
        `gen_income_entry`, `gen_cost_entry`, `confirm_user`, `total_qty`,
        `delivery_amount`, `tax_amount`, `grand_total`, `status`
    ) VALUES (
        'A231-202611001', 'A231', '2026/11/05', '2026/11/05', '1109',
        '上奇科技股份有限公司', 'A221-202611001', '01', 'NTD', 1.0,
        1, 1, 'B18', 20,
        104762, 5238, 110000, '已確認'
    ) ON DUPLICATE KEY UPDATE `grand_total`=VALUES(`grand_total`)");

    $pdo->exec("DELETE FROM `erp_delivery_details` WHERE `delivery_no`='A231-202611001'");
    $pdo->exec("INSERT INTO `erp_delivery_details` (
        `delivery_no`, `line_no`, `item_no`, `item_name`, `item_spec`, `delivery_qty`,
        `gift_qty`, `unit`, `unit_price`, `amount`, `warehouse`
    ) VALUES (
        'A231-202611001', '0001', '900006', 'Insta360 Flow 2 Pro / Flow 2', '全功能 AI 三軸手機穩定器',
        20, 0, '台', 5500, 110000, 'W01'
    )");

    // Batch Queue Records (擷取18.PNG)
    $pdo->exec("INSERT INTO `erp_batch_queue` (
        `job_id`, `job_name`, `process_mode`, `est_time`, `status`, `operator`,
        `start_time`, `end_time`, `filter_params`, `result_log`
    ) VALUES 
    (
        '20261105000049', '請購資料更新作業', '依佇列順序', '2026/11/5 下午 02:32:00', '已完成',
        'WIN-S7UJO0KFN', '2026/11/5 下午 02:32:00', '2026/11/5 下午 02:32:02',
        '選擇請購單號: C311202611001 ~ C311202611001\n鎖定選項: 1 | 已鎖定\n輸入採購日期: 20261105\n輸入採購單別: C331\n相同交貨日彙總產生: N\n相同品號不同品名規格彙總產生: N\n抽驗備註: Y',
        '後端程式版號:4.0.17.1; C331-202611001~C331-202611001; Commits: 1 Records, RollBacks: 0 Records;'
    ),
    (
        '20261105000005', '訂單轉請購單複製作業', '依佇列順序', '2026/11/5 下午 02:13:00', '已完成',
        'WIN-S7UJO0KFN', '2026/11/5 下午 02:14:00', '2026/11/5 下午 02:14:02',
        '選擇訂單單號: A221202611001\n輸入請購單別: C311\n輸入請購日期: 2026/11/05\n選擇廠商: 品號之主供應商\n輸入請購人員: B18',
        '後端程式版號:4.0.17.1; C311-202611001; Commits: 1 Records, RollBacks: 0 Records;'
    ),
    (
        '20261029000056', '請購資料更新作業', '依佇列順序', '2026/10/29 下午 03:22:00', '已完成',
        'WIN-S7UJO0KFN', '2026/10/29 下午 03:23:00', '2026/10/29 下午 03:23:02',
        '選擇請購單號: C311202610001 ~ C311202610001\n鎖定選項: 1 | 已鎖定',
        '後端程式版號:4.0.17.1; Commits: 1 Records, RollBacks: 0 Records;'
    )
    ON DUPLICATE KEY UPDATE `status`=VALUES(`status`)");

    echo "Initial seed data inserted successfully!\n";

} catch (PDOException $e) {
    echo "Database Error: " . $e->getMessage() . "\n";
    exit(1);
}
