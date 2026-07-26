<?php
/**
 * Messages API — Chat between students and boarding owners
 * GET    /api/messages.php?boarding_id=X&other_user_id=Y  → fetch conversation
 * POST   /api/messages.php                                 → send message
 * PUT    /api/messages.php?boarding_id=X                  → mark messages as read
 */
session_start();
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if($db === null) {
    http_response_code(503);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

if(!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized. Please login."]);
    exit();
}

$me = (int)$_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {

    // ── GET: Fetch conversation messages ────────────────────────────────────
    case 'GET':
        if(isset($_GET['inbox']) && $_GET['inbox'] === 'true') {
            // Owner inbox: list all unique student conversations
            $query = "
                SELECT
                    m.boarding_id,
                    b.title AS boarding_title,
                    u.id AS student_id,
                    u.name AS student_name,
                    MAX(m.created_at) AS last_message_at,
                    SUM(CASE WHEN m.is_read = 0 AND m.receiver_id = :me THEN 1 ELSE 0 END) AS unread_count,
                    (SELECT message FROM messages
                     WHERE boarding_id = m.boarding_id
                       AND (sender_id = u.id OR receiver_id = u.id)
                     ORDER BY created_at DESC LIMIT 1) AS last_message
                FROM messages m
                JOIN boardings b ON m.boarding_id = b.id
                JOIN users u ON (
                    CASE WHEN m.sender_id = :me2 THEN u.id = m.receiver_id
                         ELSE u.id = m.sender_id END
                )
                WHERE m.sender_id = :me3 OR m.receiver_id = :me4
                GROUP BY m.boarding_id, u.id
                ORDER BY last_message_at DESC
            ";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':me',  $me);
            $stmt->bindParam(':me2', $me);
            $stmt->bindParam(':me3', $me);
            $stmt->bindParam(':me4', $me);
            $stmt->execute();
            $conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["success" => true, "data" => $conversations]);
            break;
        }

        // Fetch unread count only
        if(isset($_GET['unread_count']) && $_GET['unread_count'] === 'true') {
            $q = "SELECT COUNT(*) as cnt FROM messages WHERE receiver_id = ? AND is_read = 0";
            $stmt = $db->prepare($q);
            $stmt->bindParam(1, $me);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode(["success" => true, "count" => (int)$row['cnt']]);
            break;
        }

        // Fetch messages between two users for a boarding
        $boarding_id    = isset($_GET['boarding_id'])   ? (int)$_GET['boarding_id']   : 0;
        $other_user_id  = isset($_GET['other_user_id']) ? (int)$_GET['other_user_id'] : 0;
        if(!$boarding_id || !$other_user_id) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "boarding_id and other_user_id required."]);
            break;
        }

        $query = "
            SELECT m.id, m.sender_id, m.receiver_id, m.message, m.is_read, m.created_at,
                   u.name AS sender_name
            FROM messages m
            JOIN users u ON u.id = m.sender_id
            WHERE m.boarding_id = :bid
              AND (
                  (m.sender_id = :me  AND m.receiver_id = :other)
               OR (m.sender_id = :other2 AND m.receiver_id = :me2)
              )
            ORDER BY m.created_at ASC
        ";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':bid',    $boarding_id);
        $stmt->bindParam(':me',     $me);
        $stmt->bindParam(':other',  $other_user_id);
        $stmt->bindParam(':other2', $other_user_id);
        $stmt->bindParam(':me2',    $me);
        $stmt->execute();
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "data" => $messages]);
        break;

    // ── POST: Send a message ────────────────────────────────────────────────
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if(!isset($data->boarding_id, $data->receiver_id, $data->message)
            || empty(trim($data->message))) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "boarding_id, receiver_id, and message are required."]);
            break;
        }

        $boarding_id   = (int)$data->boarding_id;
        $receiver_id   = (int)$data->receiver_id;
        $message       = htmlspecialchars(strip_tags(trim($data->message)));
        $created_at    = date('Y-m-d H:i:s');

        $query = "INSERT INTO messages (boarding_id, sender_id, receiver_id, message, created_at)
                  VALUES (:bid, :sid, :rid, :msg, :cat)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':bid', $boarding_id);
        $stmt->bindParam(':sid', $me);
        $stmt->bindParam(':rid', $receiver_id);
        $stmt->bindParam(':msg', $message);
        $stmt->bindParam(':cat', $created_at);

        if($stmt->execute()) {
            $new_id = $db->lastInsertId();
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Message sent.",
                "data"    => [
                    "id"          => (int)$new_id,
                    "sender_id"   => $me,
                    "receiver_id" => $receiver_id,
                    "message"     => $message,
                    "created_at"  => $created_at
                ]
            ]);
        } else {
            http_response_code(503);
            echo json_encode(["success" => false, "message" => "Failed to send message."]);
        }
        break;

    // ── PUT: Mark messages as read ──────────────────────────────────────────
    case 'PUT':
        $boarding_id   = isset($_GET['boarding_id'])   ? (int)$_GET['boarding_id']   : 0;
        $other_user_id = isset($_GET['other_user_id']) ? (int)$_GET['other_user_id'] : 0;
        if(!$boarding_id) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "boarding_id required."]);
            break;
        }

        $query = "UPDATE messages SET is_read = 1
                  WHERE boarding_id = :bid AND receiver_id = :me AND is_read = 0";
        if($other_user_id) {
            $query .= " AND sender_id = :sid";
        }
        $stmt = $db->prepare($query);
        $stmt->bindParam(':bid', $boarding_id);
        $stmt->bindParam(':me',  $me);
        if($other_user_id) { $stmt->bindParam(':sid', $other_user_id); }
        $stmt->execute();
        echo json_encode(["success" => true, "message" => "Marked as read."]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed."]);
}
?>
