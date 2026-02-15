<?php
/**
 * Boarding Management API
 * Handles CRUD operations for boarding listings
 * 
 * @author Boarding Finder Team
 * @version 2.0 - Production Ready
 */

// Start session at the top for all authentication-required operations
session_start();

// Include required files
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/boarding.php';

// Set JSON response headers
header("Content-Type: application/json; charset=UTF-8");

// Database connection
$database = new Database();
$db = $database->getConnection();

// Check database connection
if($db === null) {
    http_response_code(503);
    echo json_encode(array(
        "success" => false,
        "message" => "Database connection failed"
    ));
    exit();
}

$boarding = new Boarding($db);
$method = $_SERVER['REQUEST_METHOD'];

/**
 * Helper function to send JSON response
 */
function sendResponse($statusCode, $success, $message, $data = null) {
    http_response_code($statusCode);
    $response = array(
        "success" => $success,
        "message" => $message
    );
    if($data !== null) {
        $response['data'] = $data;
    }
    echo json_encode($response);
    exit();
}

/**
 * Helper function to validate required fields
 */
function validateFields($data, $requiredFields) {
    $missing = array();
    foreach($requiredFields as $field) {
        if(!isset($data->$field) || empty($data->$field)) {
            $missing[] = $field;
        }
    }
    return $missing;
}

switch($method) {
    case 'GET':
        try {
            // Priority 1: Check for specific boarding by ID
            if(isset($_GET['id']) && !empty($_GET['id'])) {
                $boarding->id = filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT);
                $boarding_data = $boarding->readOne();
                
                if($boarding_data) {
                    $images = $boarding->getImages();
                    $boarding_data['images'] = $images;
                    sendResponse(200, true, "Boarding retrieved successfully", $boarding_data);
                } else {
                    sendResponse(404, false, "Boarding not found");
                }
            }
            
            // Priority 2: Check for owner statistics (must come before owner_id alone)
            else if(isset($_GET['stats']) && $_GET['stats'] === 'true' && isset($_GET['owner_id'])) {
                $owner_id = filter_var($_GET['owner_id'], FILTER_SANITIZE_NUMBER_INT);
                $stats = $boarding->getOwnerStats($owner_id);
                sendResponse(200, true, "Statistics retrieved successfully", $stats);
            }
            
            // Priority 3: Check for owner-specific boardings
            else if(isset($_GET['owner_id']) && !empty($_GET['owner_id'])) {
                $owner_id = filter_var($_GET['owner_id'], FILTER_SANITIZE_NUMBER_INT);
                $stmt = $boarding->getByOwner($owner_id);
                $boardings = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                // Load images for each boarding
                foreach($boardings as &$b) {
                    $images = $boarding->getImagesForBoarding($b['id']);
                    $b['images'] = $images;
                }
                
                sendResponse(200, true, "Owner boardings retrieved successfully", $boardings);
            }
            
            // Priority 4: General search with filters or get all boardings
            else {
                // Check if admin wants all boardings
                $showAll = isset($_GET['all']) && $_GET['all'] === 'true';
                
                // Build filters array with sanitized inputs
                $filters = array(
                    'university' => isset($_GET['university']) ? htmlspecialchars(strip_tags($_GET['university'])) : '',
                    'town' => isset($_GET['town']) ? htmlspecialchars(strip_tags($_GET['town'])) : '',
                    'min_price' => isset($_GET['min_price']) ? filter_var($_GET['min_price'], FILTER_SANITIZE_NUMBER_INT) : 0,
                    'max_price' => isset($_GET['max_price']) ? filter_var($_GET['max_price'], FILTER_SANITIZE_NUMBER_INT) : 999999,
                    'type' => isset($_GET['type']) ? htmlspecialchars(strip_tags($_GET['type'])) : '',
                    'facilities' => isset($_GET['facilities']) ? htmlspecialchars(strip_tags($_GET['facilities'])) : '',
                    'sort' => isset($_GET['sort']) ? htmlspecialchars(strip_tags($_GET['sort'])) : 'newest',
                    'show_all' => $showAll
                );
                
                $stmt = $boarding->search($filters);
                $boardings = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                // Load images for each boarding
                foreach($boardings as &$b) {
                    $images = $boarding->getImagesForBoarding($b['id']);
                    $b['images'] = $images;
                }
                
                sendResponse(200, true, "Boardings retrieved successfully", $boardings);
            }
        } catch(Exception $e) {
            error_log("GET Error: " . $e->getMessage());
            sendResponse(500, false, "An error occurred while retrieving data");
        }
        break;
        
    case 'POST':
        try {
            // Authentication check
            if(!isset($_SESSION['user_id']) || $_SESSION['role'] != 'owner') {
                sendResponse(401, false, "Unauthorized. Only boarding owners can create listings");
            }
            
            // Parse JSON input
            $data = json_decode(file_get_contents("php://input"));
            
            // Validate JSON parsing
            if(json_last_error() !== JSON_ERROR_NONE) {
                sendResponse(400, false, "Invalid JSON format");
            }
            
            // Validate required fields
            $requiredFields = array('title', 'description', 'type', 'university', 'town', 
                                   'price', 'bedrooms', 'bathrooms', 'contact_phone');
            $missingFields = validateFields($data, $requiredFields);
            
            if(!empty($missingFields)) {
                sendResponse(400, false, "Missing required fields: " . implode(', ', $missingFields));
            }
            
            // Validate data types and ranges
            if(!is_numeric($data->price) || $data->price < 0) {
                sendResponse(400, false, "Invalid price value");
            }
            if(!is_numeric($data->bedrooms) || $data->bedrooms < 0) {
                sendResponse(400, false, "Invalid bedrooms value");
            }
            if(!is_numeric($data->bathrooms) || $data->bathrooms < 0) {
                sendResponse(400, false, "Invalid bathrooms value");
            }
            
            // Validate phone number format (basic validation)
            if(strlen($data->contact_phone) < 10) {
                sendResponse(400, false, "Invalid phone number");
            }
            
            // Set boarding properties with sanitization
            $boarding->owner_id = $_SESSION['user_id'];
            $boarding->title = htmlspecialchars(strip_tags($data->title));
            $boarding->description = htmlspecialchars(strip_tags($data->description));
            $boarding->type = htmlspecialchars(strip_tags($data->type));
            $boarding->university = htmlspecialchars(strip_tags($data->university));
            $boarding->town = htmlspecialchars(strip_tags($data->town));
            $boarding->price = filter_var($data->price, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
            $boarding->bedrooms = filter_var($data->bedrooms, FILTER_SANITIZE_NUMBER_INT);
            $boarding->bathrooms = filter_var($data->bathrooms, FILTER_SANITIZE_NUMBER_INT);
            $boarding->facilities = json_encode($data->facilities ?? array());
            $boarding->contact_phone = htmlspecialchars(strip_tags($data->contact_phone));
            $boarding->is_approved = 1; // Auto approve (can be changed based on business logic)
            $boarding->created_at = date('Y-m-d H:i:s');
            
            // Create boarding
            if($boarding->create()) {
                sendResponse(201, true, "Boarding created successfully", array("id" => $boarding->id));
            } else {
                sendResponse(503, false, "Unable to create boarding. Please try again");
            }
        } catch(Exception $e) {
            error_log("POST Error: " . $e->getMessage());
            sendResponse(500, false, "An error occurred while creating the boarding");
        }
        break;
        
    case 'PUT':
        try {
            // Authentication check
            if(!isset($_SESSION['user_id'])) {
                sendResponse(401, false, "Unauthorized. Please login to continue");
            }
            
            // Parse JSON input
            $data = json_decode(file_get_contents("php://input"));
            
            // Validate JSON parsing
            if(json_last_error() !== JSON_ERROR_NONE) {
                sendResponse(400, false, "Invalid JSON format");
            }
            
            // Validate ID exists
            if(!isset($data->id) || empty($data->id)) {
                sendResponse(400, false, "Boarding ID is required");
            }
            
            $boarding->id = filter_var($data->id, FILTER_SANITIZE_NUMBER_INT);
            
            // Check if boarding exists
            $existingBoarding = $boarding->readOne();
            if(!$existingBoarding) {
                sendResponse(404, false, "Boarding not found");
            }
            
            // Validate ownership (admin can edit any, owner can only edit their own)
            if($_SESSION['role'] != 'admin' && !$boarding->isOwner($_SESSION['user_id'])) {
                sendResponse(403, false, "Forbidden. You can only edit your own boardings");
            }
            
            // Validate required fields
            $requiredFields = array('title', 'description', 'type', 'university', 'town', 
                                   'price', 'bedrooms', 'bathrooms', 'contact_phone');
            $missingFields = validateFields($data, $requiredFields);
            
            if(!empty($missingFields)) {
                sendResponse(400, false, "Missing required fields: " . implode(', ', $missingFields));
            }
            
            // Validate data types and ranges
            if(!is_numeric($data->price) || $data->price < 0) {
                sendResponse(400, false, "Invalid price value");
            }
            if(!is_numeric($data->bedrooms) || $data->bedrooms < 0) {
                sendResponse(400, false, "Invalid bedrooms value");
            }
            if(!is_numeric($data->bathrooms) || $data->bathrooms < 0) {
                sendResponse(400, false, "Invalid bathrooms value");
            }
            
            // Update boarding properties with sanitization
            $boarding->title = htmlspecialchars(strip_tags($data->title));
            $boarding->description = htmlspecialchars(strip_tags($data->description));
            $boarding->type = htmlspecialchars(strip_tags($data->type));
            $boarding->university = htmlspecialchars(strip_tags($data->university));
            $boarding->town = htmlspecialchars(strip_tags($data->town));
            $boarding->price = filter_var($data->price, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
            $boarding->bedrooms = filter_var($data->bedrooms, FILTER_SANITIZE_NUMBER_INT);
            $boarding->bathrooms = filter_var($data->bathrooms, FILTER_SANITIZE_NUMBER_INT);
            $boarding->facilities = json_encode($data->facilities ?? array());
            $boarding->contact_phone = htmlspecialchars(strip_tags($data->contact_phone));
            
            // Update boarding
            if($boarding->update()) {
                sendResponse(200, true, "Boarding updated successfully");
            } else {
                sendResponse(503, false, "Unable to update boarding. Please try again");
            }
        } catch(Exception $e) {
            error_log("PUT Error: " . $e->getMessage());
            sendResponse(500, false, "An error occurred while updating the boarding");
        }
        break;
        
    case 'DELETE':
        try {
            // Authentication check
            if(!isset($_SESSION['user_id'])) {
                sendResponse(401, false, "Unauthorized. Please login to continue");
            }
            
            // Validate ID exists
            if(!isset($_GET['id']) || empty($_GET['id'])) {
                sendResponse(400, false, "Boarding ID is required");
            }
            
            $boarding->id = filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT);
            
            // Check if boarding exists
            $existingBoarding = $boarding->readOne();
            if(!$existingBoarding) {
                sendResponse(404, false, "Boarding not found");
            }
            
            // Validate ownership (admin can delete any, owner can only delete their own)
            if($_SESSION['role'] != 'admin' && !$boarding->isOwner($_SESSION['user_id'])) {
                sendResponse(403, false, "Forbidden. You can only delete your own boardings");
            }
            
            // Delete boarding
            if($boarding->delete()) {
                sendResponse(200, true, "Boarding deleted successfully");
            } else {
                sendResponse(503, false, "Unable to delete boarding. Please try again");
            }
        } catch(Exception $e) {
            error_log("DELETE Error: " . $e->getMessage());
            sendResponse(500, false, "An error occurred while deleting the boarding");
        }
        break;
        
    default:
        sendResponse(405, false, "Method not allowed");
        break;
}
?>