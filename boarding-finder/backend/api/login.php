<?php
session_start();

include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/user.php';

header("Content-Type: application/json; charset=UTF-8");

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)) {
    $user->email = $data->email;
    $email_exists = $user->emailExists();
    
    if($email_exists) {
        // Verify password
        if(password_verify($data->password, $user->password)) {
            // Set session variables
            $_SESSION['user_id'] = $user->id;
            $_SESSION['role'] = $user->role;
            $_SESSION['name'] = $user->name;
            
            http_response_code(200);
            echo json_encode(array(
                "message" => "Login successful.",
                "user" => array(
                    "id" => $user->id,
                    "name" => $user->name,
                    "email" => $user->email,
                    "role" => $user->role,
                    "phone" => $user->phone
                )
            ));
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "Invalid password."));
        }
    } else {
        http_response_code(401);
        echo json_encode(array("message" => "Email not found."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Email and password are required."));
}
?>