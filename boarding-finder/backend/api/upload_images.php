<?php
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/boarding.php';
include_once '../objects/service.php';

session_start();
if(!isset($_SESSION['user_id']) || ($_SESSION['role'] != 'owner' && $_SESSION['role'] != 'service')) {
    http_response_code(401);
    echo json_encode(array("success" => false, "message" => "Unauthorized."));
    exit;
}

$database = new Database();
$db = $database->getConnection();
$upload_dir = "../uploads/";
$uploaded_files = array();

// Handle Boarding Images
if(isset($_FILES['images']) && isset($_POST['boarding_id'])) {
    $boarding = new Boarding($db);
    $boarding_id = $_POST['boarding_id'];
    
    foreach($_FILES['images']['tmp_name'] as $key => $tmp_name) {
        $file_name = time() . '_' . basename($_FILES['images']['name'][$key]);
        $file_path = $upload_dir . $file_name;
        
        if(move_uploaded_file($tmp_name, $file_path)) {
            $boarding->addImage($boarding_id, $file_name);
            $uploaded_files[] = $file_name;
        }
    }
    echo json_encode(array("success" => true, "message" => "Boarding images uploaded.", "files" => $uploaded_files));
} 
// Handle Service Image (Single image for services based on schema)
else if(isset($_FILES['image']) && isset($_POST['service_id'])) {
    $service = new Service($db);
    $service->id = $_POST['service_id'];
    
    $file_name = time() . '_' . basename($_FILES['image']['name']);
    $file_path = $upload_dir . $file_name;
    
    if(move_uploaded_file($_FILES['image']['tmp_name'], $file_path)) {
        if($service->setImage($file_name)) {
            echo json_encode(array("success" => true, "message" => "Service image uploaded.", "file" => $file_name));
        } else {
            http_response_code(500);
            echo json_encode(array("success" => false, "message" => "Failed to update service image in database."));
        }
    } else {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => "Failed to move uploaded file."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "No images or ID provided."));
}
?>