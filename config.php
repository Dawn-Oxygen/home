<?php
define('DB_HOST', 'sql204.infinityfree.com');
define('DB_USER', 'if0_39508827');
define('DB_PASS', 'AJtVwDBhoafv5');
define('DB_NAME', 'if0_39508827_home');

// 网站配置
define('SITE_NAME', '白糖突然想到的主站');
define('SITE_URL', 'https://maker.ct.ws/'); 
define('TIMEZONE', 'Asia/Shanghai');
define('ADMIN_EMAIL', '2395147421@qq.com');
date_default_timezone_set(TIMEZONE);

function getDB() {
    static $db = null;
    
    if ($db === null) {
        try {
            $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
            $db->set_charset("utf8mb4");
            
            if ($db->connect_error) {
                throw new Exception("数据库连接失败: " . $db->connect_error);
            }
        } catch (Exception $e) {
            error_log("数据库错误: " . $e->getMessage());
            return null;
        }
    }
    
    return $db;
}

// 安全过滤函数
function sanitize($input) {
    if (is_array($input)) {
        foreach ($input as $key => $value) {
            $input[$key] = sanitize($value);
        }
        return $input;
    }
    
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    return $input;
}

// 获取客户端IP
function getClientIP() {
    $ip = '';
    if (isset($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } elseif (isset($_SERVER['REMOTE_ADDR'])) {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '';
}

function generateAvatar($name, $email = '') {
    $seed = $email ?: $name;
    $hash = md5(strtolower(trim($seed)));
    $size = 100;

    $backgroundType = 'gradientLinear';
    $backgroundColor = [];

    $params = [
        'seed' => $hash,
        'size' => $size,
        'backgroundColor' => implode(',', $backgroundColor),
        'backgroundType' => $backgroundType,
    ];

    $query = http_build_query(array_filter($params, function($value) {
        return $value !== '' && $value !== [];
    }));
    
    return "https://api.dicebear.com/7.x/{$style}/png?{$query}";
}

// 防止SQL注入
function escapeString($str) {
    $db = getDB();
    if ($db) {
        return $db->real_escape_string($str);
    }
    return addslashes($str);
}
?>