<?php
include_once '../config/core.php';

session_start();
session_destroy();

echo json_encode(array("message" => "Logged out successfully."));
?>