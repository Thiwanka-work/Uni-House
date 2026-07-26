<?php
/**
 * Availability API — Toggle boarding availability status
 * PATCH /api/availability.php?id={boarding_id}
 * Requires: owner session
 */
session_start();
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include_once '../config/database.php';
include_once '../objects/boarding.php';

$database = new Database();
$db = $database->getConnection();

if($db === null) {
    http_response_code(503);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

if($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

if(!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'owner') {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized. Only owners can toggle availability."]);
    exit();
}

$boarding_id = isset($_GET['id']) ? filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT) : null;
if(!$boarding_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Boarding ID required."]);
    exit();
}

$boarding = new Boarding($db);
$result = $boarding->toggleAvailability($boarding_id, $_SESSION['user_id']);

if($result !== false) {
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => $result['is_available'] ? "Boarding marked as Available." : "Boarding marked as Full.",
        "data"    => $result
    ]);
} else {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Failed. You can only update your own boardings."]);
}
?>
