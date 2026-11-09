<?php
// C:\xampp\htdocs\erp\seed_images_data.php
require_once __DIR__ . '/config.php';
header('Content-Type: text/plain; charset=utf-8');

try {
    echo "Creating and seeding tables according to user screenshots...\n";

    // 1. erp_doc_types (Image 1: 單別)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_doc_types` (
        `category` VARCHAR(50) NOT NULL,
        `code` VARCHAR(20) NOT NULL,
        `name` VARCHAR(100) NOT NULL,
        PRIMARY KEY (`category`, `code`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $docTypes = [
        // Image 1: 訂單單別
        ['order', 'A221', '國內訂單'],
        ['order', 'A222', '國外訂單'],
        ['order', 'B221', '國內訂單'],
        ['order', 'C220', '訂單開帳單'],
        ['order', 'C221', '配銷訂單內'],
        ['order', 'C222', '配銷訂單外'],
        // 報價單別
        ['quote', 'A211', '標準報價單'],
        ['quote', 'C211', '配銷報價內'],
        ['quote', 'C212', '配銷報價外'],
        // 銷貨單別 (1:1 參考用戶圖片 media_1793953130566_c13eb61c.png)
        ['delivery', 'A231', '銷貨單'],
        ['delivery', 'A232', '銷貨單(隨)'],
        ['delivery', 'A233', '月結銷貨單'],
        ['delivery', 'A234', '現銷單'],
        ['delivery', 'C231', '配銷銷貨單'],
        // 請購單別
        ['requisition', 'B311', '原料請購單'],
        ['requisition', 'B312', '事務請購單'],
        ['requisition', 'C311', '配銷請購單'],
        ['requisition_legacy', 'A311', '物料請購單'],
        // 採購單別 (1:1 參考用戶圖片 media_1793952822846_40503261.jpg / 擷取12 / 最新截圖)
        ['po', 'A321', '國內採購單'],
        ['po', 'A322', '國外採購單'],
        ['po', 'A331', '國內採購單'],
        ['po', 'A332', '國外採購單'],
        ['po', 'B331', '原料採購單'],
        ['po', 'B332', '事務採購單'],
        ['po', 'C330', '採購開帳單'],
        ['po', 'C331', '配銷採購內'],
        ['po', 'C332', '配銷採購外'],
        // 進貨單別
        ['receipt', 'A331', '國內進貨單'],
        ['receipt', 'A332', '國外進貨單'],
        ['receipt', 'C331', '配銷進貨單']
    ];

    $stmtDT = $pdo->prepare("INSERT INTO `erp_doc_types` (`category`, `code`, `name`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`)");
    foreach ($docTypes as $dt) {
        $stmtDT->execute($dt);
    }
    echo "Doc types seeded.\n";

    // 2. erp_item_categories (Image 2: 品號類別代號)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_item_categories` (
        `code` VARCHAR(20) PRIMARY KEY,
        `name` VARCHAR(100) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $categories = [
        ['01', '原料'],
        ['02', '物料'],
        ['03', '半成品'],
        ['04', '成品'],
        ['05', '商品']
    ];
    $stmtC = $pdo->prepare("INSERT INTO `erp_item_categories` (`code`, `name`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`)");
    foreach ($categories as $cat) {
        $stmtC->execute($cat);
    }
    echo "Item categories seeded.\n";

    // 3. erp_warehouses (Image 3: 庫別代號)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_warehouses` (
        `wh_no` VARCHAR(20) PRIMARY KEY,
        `wh_name` VARCHAR(100) NOT NULL,
        `plant` VARCHAR(20) NOT NULL,
        `wh_prop` VARCHAR(50) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $warehouses = [
        ['HUB', '在途倉', 'TP01', '1:存貨倉'],
        ['P001', '原料倉一', 'TP01', '1:存貨倉'],
        ['P002', '半成品倉一', 'TP01', '1:存貨倉'],
        ['P003', '成品倉一', 'TP01', '1:存貨倉'],
        ['P004', '不良品倉一', 'TP01', '1:存貨倉'],
        ['P005', '報廢倉一', 'TP01', '2:非存貨倉'],
        ['P006', '借出暫存倉', 'TP01', '1:存貨倉'],
        ['P007', '借入暫存倉', 'TP01', '1:存貨倉'],
        ['P009', '事務品倉一', 'TP01', '1:存貨倉'],
        ['Y001', '原料倉二', 'TY01', '1:存貨倉'],
        ['Y002', '半成品倉二', 'TY01', '1:存貨倉'],
        ['Y003', '成品倉二', 'TY01', '1:存貨倉'],
        ['Y004', '不良品倉二', 'TY01', '1:存貨倉'],
        ['Y005', '報廢倉二', 'TY01', '2:非存貨倉'],
        ['Y009', '事務品倉二', 'TY01', '1:存貨倉']
    ];
    $stmtW = $pdo->prepare("INSERT INTO `erp_warehouses` (`wh_no`, `wh_name`, `plant`, `wh_prop`) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE `wh_name`=VALUES(`wh_name`), `plant`=VALUES(`plant`), `wh_prop`=VALUES(`wh_prop`)");
    foreach ($warehouses as $w) {
        $stmtW->execute($w);
    }
    echo "Warehouses seeded.\n";

    // 4. erp_factories (Image 4: 廠別代號)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_factories` (
        `factory_no` VARCHAR(20) PRIMARY KEY,
        `factory_name` VARCHAR(100) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $factories = [
        ['TP01', '製造一廠'],
        ['TY01', '製造二廠']
    ];
    $stmtF = $pdo->prepare("INSERT INTO `erp_factories` (`factory_no`, `factory_name`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `factory_name`=VALUES(`factory_name`)");
    foreach ($factories as $f) {
        $stmtF->execute($f);
    }
    echo "Factories seeded.\n";

    // 5. erp_employees (Image 1: 員工代號 16筆)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `erp_employees` (
        `emp_no` VARCHAR(20) PRIMARY KEY,
        `emp_name` VARCHAR(100) NOT NULL,
        `dept_no` VARCHAR(20) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $employees = [
        ['1001', '張明達(業務)', '1000'],
        ['112', '翁湘琴', '0200'],
        ['138', '林子泉', '1000'],
        ['145', '黃聖凱', '1000'],
        ['213', '王小明', '6000'],
        ['238', '李玉郎', '1000'],
        ['3001', '王乾坤', '1000'],
        ['301', '林慶安', '1000'],
        ['310', '黃小玲', '1000'],
        ['322', '郭宏源', '1000'],
        ['334', '王效東', '1000'],
        ['389', '劉碧玲', '1000'],
        ['395', '洪郎雄', '1000'],
        ['401', '賈彩玲', '1000'],
        ['402', '曾美玲', '1000'],
        ['403', '蔡佳伶', '1000']
    ];
    $stmtE = $pdo->prepare("INSERT INTO `erp_employees` (`emp_no`, `emp_name`, `dept_no`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `emp_name`=VALUES(`emp_name`), `dept_no`=VALUES(`dept_no`)");
    foreach ($employees as $e) {
        $stmtE->execute($e);
    }
    echo "Employees seeded.\n";

    echo "All 5 screenshot master datasets successfully created and seeded!\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
