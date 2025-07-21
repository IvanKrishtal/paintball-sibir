<?php
header('Content-Type: application/json');
// Заголовки для отключения кеширования
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Недопустимый метод запроса']);
    exit;
}

$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

if (empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Пожалуйста, укажите ваше имя']);
    exit;
}

if (empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Пожалуйста, укажите ваш телефон']);
    exit;
}

if (empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Пожалуйста, напишите ваше сообщение']);
    exit;
}

$host = 'localhost';
$dbname = 'paintball_club';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("INSERT INTO feedback (name, phone, message) VALUES (:name, :phone, :message)");
    $stmt->execute([
        ':name' => htmlspecialchars($name),
        ':phone' => htmlspecialchars($phone),
        ':message' => htmlspecialchars($message)
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Сообщение успешно сохранено']);
} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
?>