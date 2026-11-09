<?php
// config.example.php - 資料庫設定範本檔
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
    if (strpos($_SERVER['REQUEST_URI'] ?? '', 'api.php') !== false) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()]);
        exit;
    }
    die('Database connection failed. Please ensure MySQL is running in XAMPP: ' . $e->getMessage());
}
