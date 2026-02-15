<?php
class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $name;
    public $email;
    public $password;
    public $role;
    public $phone;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET name=:name, email=:email, password=:password, 
                role=:role, phone=:phone, created_at=:created_at";

        $stmt = $this->conn->prepare($query);

        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->email=htmlspecialchars(strip_tags($this->email));
        $this->password=htmlspecialchars(strip_tags($this->password));
        $this->role=htmlspecialchars(strip_tags($this->role));
        $this->phone=htmlspecialchars(strip_tags($this->phone));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":role", $this->role);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":created_at", $this->created_at);

        try {
            if($stmt->execute()) {
                return true;
            }
        } catch(PDOException $e) {
            return false;
        }
        return false;
    }

    public function emailExists() {
        $query = "SELECT id, name, password, role, phone
                FROM " . $this->table_name . "
                WHERE email = ?
                LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->password = $row['password'];
            $this->role = $row['role'];
            $this->phone = $row['phone'];
            return true;
        }
        return false;
    }

    public function getAllUsers($search = '', $role = '') {
        $query = "SELECT id, name, email, role, phone, created_at 
                 FROM " . $this->table_name . " 
                 WHERE 1=1";
        
        $params = array();

        if (!empty($search)) {
            $query .= " AND (name LIKE :search OR email LIKE :search)";
            $params[':search'] = "%$search%";
        }

        if (!empty($role)) {
            $query .= " AND role = :role";
            $params[':role'] = $role;
        }

        $query .= " ORDER BY created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        
        foreach ($params as $key => &$val) {
            $stmt->bindParam($key, $val);
        }

        $stmt->execute();
        return $stmt;
    }
}
?>