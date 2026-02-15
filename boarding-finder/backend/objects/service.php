<?php
class Service {
    private $conn;
    private $table_name = "services";

    public $id;
    public $provider_id;
    public $service_type;
    public $university;
    public $town;
    public $name;
    public $contact_number;
    public $description;
    public $image;
    public $is_approved;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET provider_id=:provider_id, service_type=:service_type,
                university=:university, town=:town, name=:name, 
                contact_number=:contact_number, description=:description,
                image=:image, is_approved=:is_approved, created_at=:created_at";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":provider_id", $this->provider_id);
        $stmt->bindParam(":service_type", $this->service_type);
        $stmt->bindParam(":university", $this->university);
        $stmt->bindParam(":town", $this->town);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":contact_number", $this->contact_number);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":image", $this->image);
        $stmt->bindParam(":is_approved", $this->is_approved);
        $stmt->bindParam(":created_at", $this->created_at);

        return $stmt->execute();
    }

    public function read() {
        $query = "SELECT s.*, u.name as provider_name 
                 FROM " . $this->table_name . " s
                 LEFT JOIN users u ON s.provider_id = u.id
                 WHERE s.is_approved = 1
                 ORDER BY s.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readOne() {
        $query = "SELECT s.*, u.name as provider_name 
                 FROM " . $this->table_name . " s
                 LEFT JOIN users u ON s.provider_id = u.id
                 WHERE s.id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . "
                SET service_type=:service_type, university=:university,
                town=:town, name=:name, contact_number=:contact_number,
                description=:description
                WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":service_type", $this->service_type);
        $stmt->bindParam(":university", $this->university);
        $stmt->bindParam(":town", $this->town);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":contact_number", $this->contact_number);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        return $stmt->execute();
    }

    public function isProvider($user_id) {
        $query = "SELECT provider_id FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['provider_id'] == $user_id;
    }

    public function getByProvider($provider_id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE provider_id = ? ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $provider_id);
        $stmt->execute();
        return $stmt;
    }

    public function setImage($image_name) {
        $query = "UPDATE " . $this->table_name . " SET image = :image WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":image", $image_name);
        $stmt->bindParam(":id", $this->id);
        return $stmt->execute();
    }
}
?>