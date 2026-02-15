<?php
class Boarding {
    private $conn;
    private $table_name = "boardings";
    private $images_table = "boarding_images";

    public $id;
    public $owner_id;
    public $title;
    public $description;
    public $type;
    public $university;
    public $town;
    public $price;
    public $bedrooms;
    public $bathrooms;
    public $facilities;
    public $contact_phone;
    public $is_approved;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

public function create() {
    $query = "INSERT INTO " . $this->table_name . "
            SET owner_id=:owner_id, title=:title, description=:description,
            type=:type, university=:university, town=:town, price=:price,
            bedrooms=:bedrooms, bathrooms=:bathrooms, facilities=:facilities,
            contact_phone=:contact_phone, is_approved=:is_approved, created_at=:created_at";

    $stmt = $this->conn->prepare($query);

    $stmt->bindParam(":owner_id", $this->owner_id);
    $stmt->bindParam(":title", $this->title);
    $stmt->bindParam(":description", $this->description);
    $stmt->bindParam(":type", $this->type);
    $stmt->bindParam(":university", $this->university);
    $stmt->bindParam(":town", $this->town);
    $stmt->bindParam(":price", $this->price);
    $stmt->bindParam(":bedrooms", $this->bedrooms);
    $stmt->bindParam(":bathrooms", $this->bathrooms);
    $stmt->bindParam(":facilities", $this->facilities);
    $stmt->bindParam(":contact_phone", $this->contact_phone);
    $stmt->bindParam(":is_approved", $this->is_approved);
    $stmt->bindParam(":created_at", $this->created_at);

    if($stmt->execute()) {
        $this->id = $this->conn->lastInsertId();
        return true;
    }
    return false;
}
 public function search($filters) {
    $query = "SELECT * FROM " . $this->table_name . " WHERE 1=1";
    
    // If show_all is true (admin view), skip all filters
    if(isset($filters['show_all']) && $filters['show_all'] === true) {
        $query .= " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
    
    // Apply filters for regular search
    if(!empty($filters['university'])) {
        $query .= " AND university LIKE :university";
    }
    if(!empty($filters['town'])) {
        $query .= " AND town LIKE :town";
    }
    if(!empty($filters['type'])) {
        $query .= " AND type = :type";
    }
    $query .= " AND price BETWEEN :min_price AND :max_price";
    
    if(!empty($filters['facilities'])) {
        $facilities = explode(',', $filters['facilities']);
        foreach($facilities as $facility) {
            $query .= " AND facilities LIKE :facility_" . $facility;
        }
    }
    
    switch($filters['sort']) {
        case 'price_low':
            $query .= " ORDER BY price ASC";
            break;
        case 'price_high':
            $query .= " ORDER BY price DESC";
            break;
        default:
            $query .= " ORDER BY created_at DESC";
    }
    
    $stmt = $this->conn->prepare($query);
    
    if(!empty($filters['university'])) {
        $stmt->bindValue(':university', '%' . $filters['university'] . '%');
    }
    if(!empty($filters['town'])) {
        $stmt->bindValue(':town', '%' . $filters['town'] . '%');
    }
    if(!empty($filters['type'])) {
        $stmt->bindValue(':type', $filters['type']);
    }
    $stmt->bindValue(':min_price', $filters['min_price']);
    $stmt->bindValue(':max_price', $filters['max_price']);
    
    if(!empty($filters['facilities'])) {
        $facilities = explode(',', $filters['facilities']);
        foreach($facilities as $facility) {
            $stmt->bindValue(':facility_' . $facility, '%"' . $facility . '"%');
        }
    }
    
    $stmt->execute();
    return $stmt;
}

    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        return false;
    }

    public function getImages() {
        $query = "SELECT image_name FROM " . $this->images_table . " WHERE boarding_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
    }

    public function getImagesForBoarding($boarding_id) {
        $query = "SELECT image_name FROM " . $this->images_table . " WHERE boarding_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $boarding_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
    }

    public function addImage($boarding_id, $image_name) {
        $query = "INSERT INTO " . $this->images_table . " (boarding_id, image_name) VALUES (?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $boarding_id);
        $stmt->bindParam(2, $image_name);
        return $stmt->execute();
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . "
                SET title=:title, description=:description, type=:type,
                university=:university, town=:town, price=:price,
                bedrooms=:bedrooms, bathrooms=:bathrooms, facilities=:facilities,
                contact_phone=:contact_phone
                WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":type", $this->type);
        $stmt->bindParam(":university", $this->university);
        $stmt->bindParam(":town", $this->town);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":bedrooms", $this->bedrooms);
        $stmt->bindParam(":bathrooms", $this->bathrooms);
        $stmt->bindParam(":facilities", $this->facilities);
        $stmt->bindParam(":contact_phone", $this->contact_phone);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        return $stmt->execute();
    }

    public function isOwner($user_id) {
        $query = "SELECT owner_id FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['owner_id'] == $user_id;
    }

    public function getByOwner($owner_id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE owner_id = ? ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $owner_id);
        $stmt->execute();
        return $stmt;
    }

    public function getOwnerStats($owner_id) {
        // Get total boardings count
        $query = "SELECT COUNT(*) as total_boardings FROM " . $this->table_name . " WHERE owner_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $owner_id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $total_boardings = $row['total_boardings'];

        // Get total rooms (bedrooms)
        $query = "SELECT SUM(bedrooms) as total_rooms FROM " . $this->table_name . " WHERE owner_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $owner_id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $total_rooms = $row['total_rooms'] ?? 0;

        // Get potential monthly income (sum of all prices)
        $query = "SELECT SUM(price) as total_income FROM " . $this->table_name . " WHERE owner_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $owner_id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $total_income = $row['total_income'] ?? 0;

        // Get total bathrooms
        $query = "SELECT SUM(bathrooms) as total_bathrooms FROM " . $this->table_name . " WHERE owner_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $owner_id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $total_bathrooms = $row['total_bathrooms'] ?? 0;

        return array(
            'total_boardings' => (int)$total_boardings,
            'total_rooms' => (int)$total_rooms,
            'total_income' => (int)$total_income,
            'total_bathrooms' => (int)$total_bathrooms
        );
    }
}
?>