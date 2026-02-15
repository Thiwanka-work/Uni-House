<?php
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/favorite.php';
include_once '../objects/boarding.php';

$database = new Database();
$db = $database->getConnection();
$favorite = new Favorite($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        session_start();
        if(!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(array("message" => "Unauthorized."));
            break;
        }
        
        $favorite->user_id = $_SESSION['user_id'];
        $stmt = $favorite->getUserFavorites();
        $favorites = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $boarding = new Boarding($db);
        foreach($favorites as &$fav) {
            $fav['images'] = $boarding->getImagesForBoarding($fav['id']);
        }
        
        echo json_encode($favorites);
        break;
        
    case 'POST':
        session_start();
        if(!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(array("message" => "Unauthorized."));
            break;
        }
        
        $data = json_decode(file_get_contents("php://input"));
        
        $favorite->user_id = $_SESSION['user_id'];
        $favorite->boarding_id = $data->boarding_id;
        
        if($favorite->add()) {
            echo json_encode(array("message" => "Added to favorites."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to add to favorites."));
        }
        break;
        
    case 'DELETE':
        session_start();
        if(!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(array("message" => "Unauthorized."));
            break;
        }
        
        $favorite->user_id = $_SESSION['user_id'];
        $favorite->boarding_id = $_GET['boarding_id'];
        
        if($favorite->remove()) {
            echo json_encode(array("message" => "Removed from favorites."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to remove from favorites."));
        }
        break;
}
?>