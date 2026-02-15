<?php
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/service.php';

$database = new Database();
$db = $database->getConnection();
$service = new Service($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            $service->id = $_GET['id'];
            $service_data = $service->readOne();
            
            if($service_data) {
                echo json_encode(array("success" => true, "data" => $service_data));
            } else {
                http_response_code(404);
                echo json_encode(array("success" => false, "message" => "Service not found."));
            }
        } else if(isset($_GET['provider_id'])) {
            $provider_id = $_GET['provider_id'];
            $stmt = $service->getByProvider($provider_id);
            $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(array("success" => true, "data" => $services));
        } else {
            $stmt = $service->read();
            $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(array("success" => true, "data" => $services));
        }
        break;
        
    case 'POST':
        session_start();
        if(!isset($_SESSION['user_id']) || $_SESSION['role'] != 'service') {
            http_response_code(401);
            echo json_encode(array("success" => false, "message" => "Unauthorized."));
            break;
        }
        
        $data = json_decode(file_get_contents("php://input"));
        
        $service->provider_id = $_SESSION['user_id'];
        $service->service_type = $data->service_type;
        $service->university = $data->university;
        $service->town = $data->town;
        $service->name = $data->name;
        $service->contact_number = $data->contact_number;
        $service->description = $data->description;
        $service->image = $data->image ?? '';
        $service->is_approved = 1;  // Auto approve
        $service->created_at = date('Y-m-d H:i:s');
        
        if($service->create()) {
            echo json_encode(array("success" => true, "message" => "Service created successfully.", "data" => array("id" => $service->id)));
        } else {
            http_response_code(503);
            echo json_encode(array("success" => false, "message" => "Unable to create service."));
        }
        break;
        
    case 'PUT':
        session_start();
        if(!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(array("success" => false, "message" => "Unauthorized."));
            break;
        }
        
        $data = json_decode(file_get_contents("php://input"));
        $service->id = $data->id;
        
        // Ownership check
        if($_SESSION['role'] != 'admin' && !$service->isProvider($_SESSION['user_id'])) {
            http_response_code(403);
            echo json_encode(array("success" => false, "message" => "Forbidden. You can only edit your own services."));
            break;
        }
        
        $service->service_type = $data->service_type;
        $service->university = $data->university;
        $service->town = $data->town;
        $service->name = $data->name;
        $service->contact_number = $data->contact_number;
        $service->description = $data->description;
        
        if($service->update()) {
            echo json_encode(array("success" => true, "message" => "Service updated."));
        } else {
            http_response_code(503);
            echo json_encode(array("success" => false, "message" => "Unable to update service."));
        }
        break;
        
    case 'DELETE':
        session_start();
        if(!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(array("success" => false, "message" => "Unauthorized."));
            break;
        }
        
        $service->id = $_GET['id'];
        
        if($_SESSION['role'] == 'admin' || $service->isProvider($_SESSION['user_id'])) {
            if($service->delete()) {
                echo json_encode(array("success" => true, "message" => "Service deleted."));
            } else {
                http_response_code(503);
                echo json_encode(array("success" => false, "message" => "Unable to delete service."));
            }
        } else {
            http_response_code(403);
            echo json_encode(array("success" => false, "message" => "Forbidden."));
        }
        break;
}
?>