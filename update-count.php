<?php
$ipFile = 'visitor_ips.txt'; // 存储访问过的 IP
$countFile = 'visitor-count.txt'; // 存储总访问人数

// 获取当前 IP
$ip = $_SERVER['REMOTE_ADDR'];

// 获取已有 IP 列表
$ips = file_exists($ipFile) ? file($ipFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];

// 如果 IP 不在列表中，则添加
if (!in_array($ip, $ips)) {
    $ips[] = $ip;
    file_put_contents($ipFile, implode(PHP_EOL, $ips) . PHP_EOL);

    // 更新总访问人数
    $count = file_exists($countFile) ? intval(file_get_contents($countFile)) : 0;
    $count += 1;
    file_put_contents($countFile, $count);
}

// 返回总访问人数
echo file_exists($countFile) ? intval(file_get_contents($countFile)) : 0;
?>