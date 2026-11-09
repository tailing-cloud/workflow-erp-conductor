<?php
// C:\xampp\htdocs\erp\seed_screenshot_data.php
require_once __DIR__ . '/config.php';

header('Content-Type: text/plain; charset=utf-8');

try {
    // 1. Customers from screenshots
    $customers = [
        ['1107', '大進文化', '大進文化圖書股份有限公司', 'Ta Chin Cultural Book Co., Ltd.', '0000', '2006/10/04', '呂育德', '呂育德', '02-23651234', '02-23655678', 'tachin@book.com.tw', '28226438', 25000000, 0, 0, 'NTD', '0100 業務部', '1001 張明達', '1001 張明達', '2006/10/04'],
        ['1002', '標竿公司', '標竿精密科技股份有限公司', 'Benchmark Precision Co., Ltd.', '0000', '2015/03/12', '黃董事長', '陳經理', '02-27891234', '02-27895678', 'info@benchmark.com.tw', '53829104', 50000000, 120000000, 150, 'NTD', '0100 業務部', '1001 張明達', '1001 張明達', '2015/03/12'],
        ['1109', '上奇科技', '上奇科技股份有限公司', 'GrandTech Cloud Services Inc.', '0001', '2026/11/05', '張雲飛', '陳志明', '02-87923001', '02-87923002', 'contact@grandtech.com.tw', '84149615', 15000000, 85000000, 250, 'NTD', '0100 業務部', '1001 張明達', '1001 張明達', '2005/03/15'],
        ['1001', '宏碁科技', '宏碁股份有限公司', 'Acer Inc.', '0001', '2026/10/01', '陳俊聖', '林小姐', '02-26961234', '02-26965678', 'service@acer.com', '04283908', 300000000, 2500000000, 7500, 'NTD', '0100 業務部', '1001 張明達', '1001 張明達', '1976/08/01'],
        ['1003', '微星科技', '微星科技股份有限公司', 'Micro-Star International Co., Ltd.', '0001', '2026/08/20', '徐祥', '吳課長', '02-32345599', '02-32345598', 'sales@msi.com', '22538772', 80000000, 1800000000, 2800, 'NTD', '0100 業務部', '1001 張明達', '1001 張明達', '1986/08/04']
    ];

    $stmtC = $pdo->prepare("INSERT INTO `erp_customers` 
        (`customer_no`, `name_short`, `full_name`, `eng_name`, `version`, `approval_date`, `boss`, `contact`, `tel1`, `fax`, `email`, `tax_id`, `capital`, `annual_sales`, `employee_count`, `currency`, `dept`, `sales_person`, `collector`, `open_date`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE `name_short`=VALUES(`name_short`), `full_name`=VALUES(`full_name`), `tax_id`=VALUES(`tax_id`), `boss`=VALUES(`boss`), `sales_person`=VALUES(`sales_person`), `collector`=VALUES(`collector`)");
    foreach ($customers as $c) {
        $stmtC->execute($c);
    }
    echo "Customers seeded.\n";

    // 2. Items from screenshots
    $items = [
        ['410001', '數位相機-SL系列', 'SL1001', 'SL1001', '0000', '台', '台', '箱', 200, 3600000, 18000, 22000, 25000, 18000, 18000, '2026/10/01', 'P003 成品倉一', '05'],
        ['410004', '數位相機-專業型', 'SL系列', 'SL-PRO', '0000', '台', '台', '箱', 150, 1800000, 12000, 15000, 17500, 12000, 12000, '2026/10/01', 'P003 成品倉一', '05'],
        ['900001', '三腳架', '輕量鋁合金可折疊', '390001', '0000', 'set', 'set', '箱', 300, 240000, 800, 1200, 1500, 800, 800, '2026/09/15', 'P003 成品倉一', '05'],
        ['900002', '充電器', '雙插槽智能快充座', '390002', '0000', 'ea', 'ea', '盒', 500, 325000, 650, 990, 1200, 650, 650, '2026/09/15', 'P003 成品倉一', '05'],
        ['900003', '拭鏡布-防靜電', '超細纖維抗靜電擦拭布', '900003', '0000', 'pcs', 'pcs', '包', 1000, 50000, 50, 100, 150, 50, 50, '2026/09/20', 'P003 成品倉一', '05'],
        ['900004', 'PowerShot G7 X Mark III', 'PowerShot G7 X Mark III', '900004', '0000', 'PC', 'PC', '箱', 80, 1600000, 20000, 24900, 26900, 20000, 20000, '2026/10/10', 'P003 成品倉一', '05'],
        ['900006', 'Insta360 Flow 2 Pro / Flow 2', '全功能 AI 三軸手機穩定器', 'IF2-PRO', '0001', '台', '台', '箱', 100, 420000, 4200, 5500, 5990, 4200, 4200, '2026/11/01', 'P003 成品倉一', '05']
    ];

    $stmtI = $pdo->prepare("INSERT INTO `erp_items`
        (`item_no`, `item_name`, `item_spec`, `item_code`, `version`, `unit`, `small_unit`, `pack_unit`, `stock_qty`, `stock_amount`, `unit_cost`, `std_price`, `retail_price`, `std_purchase_price`, `recent_purchase_price`, `approval_date`, `main_warehouse`, `accounting_code`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE `item_name`=VALUES(`item_name`), `item_spec`=VALUES(`item_spec`), `std_price`=VALUES(`std_price`), `main_warehouse`=VALUES(`main_warehouse`)");
    foreach ($items as $it) {
        $stmtI->execute($it);
    }
    echo "Items seeded.\n";

    // 3. Suppliers from screenshots
    $suppliers = [
        ['4002', '揚朋海運', '揚朋海運股份有限公司', '陳經理', '02-25113301', '12849501', 'NTD'],
        ['4003', '飛龍空運', '飛龍空運承攬有限公司', '林協理', '02-27128899', '23819405', 'NTD'],
        ['4004', '領先報關行', '領先國際報關行股份有限公司', '張主任', '02-25036677', '34918276', 'NTD'],
        ['4005', '為升國際貿易', '為升國際貿易股份有限公司', '尤山泉', '02-87915500', '84920183', 'NTD'],
        ['A001', '金皇國際', '金皇國際股份有限公司', '黃總監', '02-23456789', '91028374', 'NTD'],
        ['V001', '影石創新', '深圳影石創新科技股份有限公司台灣分公司', '劉經理', '0755-86655123', '9144030009', 'NTD']
    ];

    $stmtS = $pdo->prepare("INSERT INTO `erp_suppliers` (`supplier_no`, `name_short`, `full_name`, `contact`, `tel`, `tax_id`, `currency`) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `name_short`=VALUES(`name_short`), `full_name`=VALUES(`full_name`)");
    foreach ($suppliers as $s) {
        $stmtS->execute($s);
    }
    echo "Suppliers seeded.\n";

    echo "Screenshot master data seeded successfully.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
