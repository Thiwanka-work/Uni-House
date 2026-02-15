<?php
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/user.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->name) &&
    !empty($data->email) &&
    !empty($data->password) &&
    !empty($data->role)
) {
    $user->name = $data->name;
    $user->email = $data->email;
    $user->password = password_hash($data->password, PASSWORD_DEFAULT);
    $user->role = $data->role;
    $user->phone = $data->phone ?? '';
    $user->created_at = date('Y-m-d H:i:s');

    if($user->emailExists()){
        http_response_code(409);
        echo json_encode(array("message" => "Email already exists."));
    }
    else if($user->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "User was created."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create user."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create user. Data is incomplete."));
}
?>