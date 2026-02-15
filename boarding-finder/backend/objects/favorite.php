<?php
class Favorite {
    private $conn;
    private $table_name = "favorites";

    public $user_id;
    public $boarding_id;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function add() {
        $query = "INSERT INTO " . $this->table_name . " (user_id, boarding_id, created_at) 
                 VALUES (:user_id, :boarding_id, :created_at)";
        $stmt = $this->conn->prepare($query);
        
        $this->created_at = date('Y-m-d H:i:s');
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":boarding_id", $this->boarding_id);
        $stmt->bindParam(":created_at", $this->created_at);
        
        return $stmt->execute();
    }

    public function remove() {
        $query = "DELETE FROM " . $this->table_name . " 
                 WHERE user_id = :user_id AND boarding_id = :boarding_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":boarding_id", $this->boarding_id);
        return $stmt->execute();
    }

    public function getUserFavorites() {
        $query = "SELECT b.*, f.created_at as favorited_at 
                 FROM boardings b
                 INNER JOIN favorites f ON b.id = f.boarding_id
                 WHERE f.user_id = :user_id
                 ORDER BY f.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->execute();
        return $stmt;
    }

    public function isFavorite($user_id, $boarding_id) {
        $query = "SELECT id FROM " . $this->table_name . " 
                 WHERE user_id = ? AND boarding_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $user_id);
        $stmt->bindParam(2, $boarding_id);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
}
?>