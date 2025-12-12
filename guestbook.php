<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$dataFile = __DIR__ . '/guestbook-data.json';

// Initialize file if it doesn't exist
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode(['messages' => []]));
}

// GET - Read messages
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = json_decode(file_get_contents($dataFile), true);
    echo json_encode($data);
    exit;
}

// POST - Save messages
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['messages']) && is_array($input['messages'])) {
        // Sanitize messages
        $messages = array_map(function($msg) {
            return [
                'name' => htmlspecialchars(substr($msg['name'] ?? 'Anonymous', 0, 50)),
                'text' => htmlspecialchars(substr($msg['text'] ?? '', 0, 500)),
                'date' => $msg['date'] ?? date('Y-m-d H:i:s')
            ];
        }, $input['messages']);

        // Keep only last 50 messages
        $messages = array_slice($messages, -50);

        file_put_contents($dataFile, json_encode(['messages' => $messages]));
        echo json_encode(['success' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
