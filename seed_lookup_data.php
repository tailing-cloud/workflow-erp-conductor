<?php
// C:\xampp\htdocs\erp\seed_lookup_data.php
require_once __DIR__ . '/config.php';

header('Content-Type: text/plain; charset=utf-8');

try {
    // 1. More Customers
    $customers = [
        ['1109', '上奇科技', '上奇科技股份有限公司', 'GrandTech Cloud Services Inc.', '1', '2026/11/05', '張雲飛', '陳志明', '02-87923001', '02-87923002', 'contact@grandtech.com.tw', '84149615', 15000, 85000, 250, 'NTD', '0100 業務部', 'B18 學生B18', 'B18 學生B18', '2005/03/15'],
        ['1001', '宏碁科技', '宏碁股份有限公司', 'Acer Inc.', '1', '2026/10/01', '陳俊聖', '林小姐', '02-26961234', '02-26965678', 'service@acer.com', '04283908', 300000, 2500000, 7500, 'NTD', '0100 業務部', 'B18 學生B18', 'B18 學生B18', '1976/08/01'],
        ['1002', '華碩電腦', '華碩電腦股份有限公司', 'ASUSTeK Computer Inc.', '1', '2026/09/15', '施崇棠', '黃經理', '02-28943447', '02-28943448', 'info@asus.com', '23863864', 250000, 4800000, 14000, 'NTD', '0100 業務部', 'B18 學生B18', 'B18 學生B18', '1989/04/02'],
        ['1003', '微星科技', '微星科技股份有限公司', 'Micro-Star International Co., Ltd.', '1', '2026/08/20', '徐祥', '吳課長', '02-32345599', '02-32345598', 'sales@msi.com', '22538772', 80000, 1800000, 2800, 'NTD', '0100 業務部', 'B18 學生B18', 'B18 學生B18', '1986/08/04'],
        ['1004', '聯強國際', '聯強國際股份有限公司', 'Synnex Technology International Corp.', '1', '2026/07/10', '杜書伍', '王專員', '02-25063320', '02-25063321', 'synnex@synnex.com.tw', '22754898', 160000, 3900000, 4200, 'NTD', '0100 業務部', 'B18 學生B18', 'B18 學生B18', '1988/09/14']
    ];

    $stmtC = $pdo->prepare("INSERT INTO `erp_customers` 
        (`customer_no`, `name_short`, `full_name`, `eng_name`, `version`, `approval_date`, `boss`, `contact`, `tel1`, `fax`, `email`, `tax_id`, `capital`, `annual_sales`, `employee_count`, `currency`, `dept`, `sales_person`, `collector`, `open_date`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE `full_name`=VALUES(`full_name`), `name_short`=VALUES(`name_short`)");
    foreach ($customers as $c) {
        $stmtC->execute($c);
    }
    echo "Customers seeded.\n";

    // 2. More Items
    $items = [
        ['900006', 'Insta360 Flow 2 Pro / Flow 2', '全功能 AI 三軸手機穩定器', 'IF2-PRO', '1', '台', '台', '箱', 100, 420000, 4200, 5500, 5990, 4200, 4200, '2026/11/01', 'W01 主原料庫', '1201'],
        ['900001', 'Insta360 X4 運動全景相機', '8K 360度防水運動相機', 'X4-8K', '1', '台', '台', '箱', 50, 750000, 15000, 18990, 19990, 15000, 15000, '2026/10/15', 'W01 主原料庫', '1201'],
        ['900002', 'Insta360 Ace Pro 2', '徠卡光學旗艦運動相機', 'ACE2-PRO', '1', '台', '台', '箱', 80, 880000, 11000, 14500, 15990, 11000, 11000, '2026/10/20', 'W01 主原料庫', '1201'],
        ['900003', 'Insta360 GO 3S', '迷你拇指防抖拇指相機', 'GO3S-4K', '1', '台', '台', '箱', 120, 1020000, 8500, 11500, 12299, 8500, 8500, '2026/10/25', 'W01 主原料庫', '1201'],
        ['800001', 'AI 智能磁吸補光燈', '雙色溫高顯色補光配件', 'ACC-LIGHT', '1', '個', '個', '盒', 200, 130000, 650, 990, 1190, 650, 650, '2026/11/01', 'W01 主原料庫', '1201'],
        ['800002', '多功能手持延長自拍桿', '內建三腳架 1/4螺孔', 'ACC-STICK', '1', '支', '支', '盒', 150, 67500, 450, 750, 890, 450, 450, '2026/11/01', 'W01 主原料庫', '1201']
    ];

    $stmtI = $pdo->prepare("INSERT INTO `erp_items`
        (`item_no`, `item_name`, `item_spec`, `item_code`, `version`, `unit`, `small_unit`, `pack_unit`, `stock_qty`, `stock_amount`, `unit_cost`, `std_price`, `retail_price`, `std_purchase_price`, `recent_purchase_price`, `approval_date`, `main_warehouse`, `accounting_code`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE `item_name`=VALUES(`item_name`), `item_spec`=VALUES(`item_spec`)");
    foreach ($items as $it) {
        $stmtI->execute($it);
    }
    echo "Items seeded.\n";

    // 3. More Suppliers
    $suppliers = [
        ['V001', '影石創新', '深圳影石創新科技股份有限公司台灣分公司', '劉經理', '0755-86655123', '9144030009', 'NTD'],
        ['V002', '大疆科技', '大疆創新科技有限公司台灣辦事處', '張協理', '02-23456789', '83726194', 'NTD'],
        ['V003', '聯強物流', '聯強國際倉儲物流股份有限公司', '李課長', '02-25063388', '22754899', 'NTD']
    ];
    $stmtS = $pdo->prepare("INSERT INTO `erp_suppliers` (`supplier_no`, `name_short`, `full_name`, `contact`, `tel`, `tax_id`, `currency`) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `full_name`=VALUES(`full_name`)");
    foreach ($suppliers as $s) {
        $stmtS->execute($s);
    }
    echo "Suppliers seeded.\n";

    echo "All lookup master data seeded successfully.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
