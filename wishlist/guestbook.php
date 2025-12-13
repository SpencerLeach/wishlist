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
    file_put_contents($dataFile, json_encode(['grid' => []]));
}

// GET - Read grid
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = json_decode(file_get_contents($dataFile), true);
    echo json_encode($data);
    exit;
}

// POST - Save grid
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['grid']) && is_array($input['grid'])) {
        file_put_contents($dataFile, json_encode(['grid' => $input['grid']]));
        echo json_encode(['success' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
