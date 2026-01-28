<?php
$ipFile = 'visitor_ips.txt';
$countFile = 'visitor-count.txt';

$ip = $_SERVER['REMOTE_ADDR'];

$ips = file_exists($ipFile) ? file($ipFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];

if (!in_array($ip, $ips)) {
    $ips[] = $ip;
    file_put_contents($ipFile, implode(PHP_EOL, $ips) . PHP_EOL);

    $count = file_exists($countFile) ? intval(file_get_contents($countFile)) : 0;
    $count += 1;
    file_put_contents($countFile, $count);
}

echo file_exists($countFile) ? intval(file_get_contents($countFile)) : 0;
?>