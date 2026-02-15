<?php
// Test if uploads folder is working
$upload_dir = __DIR__ . '/uploads';
$test_file = $upload_dir . '/test.txt';

// Check if folder exists
if (!file_exists($upload_dir)) {
    die("ERROR: Uploads folder doesn't exist!");
}

// Check if folder is writable
if (!is_writable($upload_dir)) {
    die("ERROR: Uploads folder is not writable!");
}

// Try to create a test file
if (file_put_contents($test_file, "Test content") !== false) {
    echo "SUCCESS: Uploads folder is working properly!\n";
    
    // Clean up
    unlink($test_file);
} else {
    die("ERROR: Cannot write to uploads folder!");
}

echo "Permissions: " . substr(sprintf('%o', fileperms($upload_dir)), -4);
?>