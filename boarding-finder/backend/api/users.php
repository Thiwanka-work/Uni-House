<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/user.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    // Get all users (Admin only)
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    $role = isset($_GET['role']) ? $_GET['role'] : '';
    
    $stmt = $user->getAllUsers($search, $role);
    $users = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $user_item = array(
            "id" => $id,
            "name" => $name,
            "email" => $email,
            "role" => $role,
            "phone" => $phone,
            "created_at" => $created_at
        );
        array_push($users, $user_item);
    }

    http_response_code(200);
    echo json_encode($users);
}

else if ($method == 'DELETE') {
    // Delete user (Admin only)
    $user_id = isset($_GET['id']) ? $_GET['id'] : die();

    $query = "DELETE FROM users WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $user_id);

    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "User was deleted."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to delete user."));
    }
}

else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed"));
}
?>
