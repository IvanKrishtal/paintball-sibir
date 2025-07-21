<?php
header('Content-Type: application/json');
// Заголовки для отключения кеширования
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = 'localhost';
$dbname = 'paintball_club';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->query("SELECT name, phone, message, created_at FROM feedback ORDER BY created_at DESC LIMIT 3");
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['success' => true, 'messages' => $messages]);
} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
?>