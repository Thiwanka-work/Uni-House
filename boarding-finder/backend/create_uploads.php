<?php
// Create uploads folder if it doesn't exist
$upload_dir = __DIR__ . '/uploads';

if (!file_exists($upload_dir)) {
    if (mkdir($upload_dir, 0755, true)) {
        echo "Uploads folder created successfully!";
        
        // Create .htaccess for security
        $htaccess_content = "Order deny,allow\nDeny from all";
        file_put_contents($upload_dir . '/.htaccess', $htaccess_content);
        
        // Create index.html to prevent directory listing
        $index_content = "<!DOCTYPE html><html><head><title>403 Forbidden</title></head><body><h1>Directory access is forbidden</h1></body></html>";
        file_put_contents($upload_dir . '/index.html', $index_content);
        
    } else {
        echo "Failed to create uploads folder!";
    }
} else {
    echo "Uploads folder already exists!";
}

// Check permissions
echo "\nFolder permissions: " . substr(sprintf('%o', fileperms($upload_dir)), -4);
?>