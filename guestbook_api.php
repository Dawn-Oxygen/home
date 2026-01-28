<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

$db = getDB();
if (!$db) {
    http_response_code(500);
    echo json_encode(['error' => '数据库连接失败']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// 处理请求
switch ($method) {
    case 'GET':
        handleGet($action);
        break;
    case 'POST':
        handlePost($action);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => '不支持的请求方法']);
        break;
}

// 获取留言列表
function handleGet($action) {
    global $db;
    
    switch ($action) {
        case 'messages':
            $page = max(1, intval($_GET['page'] ?? 1));
            $limit = min(50, intval($_GET['limit'] ?? 10));
            $offset = ($page - 1) * $limit;
            
            // 获取总数量
            $countQuery = "SELECT COUNT(*) as total FROM guestbook WHERE is_approved = 1";
            $countResult = $db->query($countQuery);
            $total = $countResult ? $countResult->fetch_assoc()['total'] : 0;
            
            // 获取留言列表
            $query = "SELECT id, name, email, message, avatar, created_at 
                     FROM guestbook 
                     WHERE is_approved = 1 
                     ORDER BY created_at DESC 
                     LIMIT ? OFFSET ?";
            
            $stmt = $db->prepare($query);
            $stmt->bind_param('ii', $limit, $offset);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $messages = [];
            while ($row = $result->fetch_assoc()) {
                $row['created_at'] = date('Y-m-d H:i', strtotime($row['created_at']));
                $row['time_ago'] = timeAgo($row['created_at']);
                $messages[] = $row;
            }
            
            echo json_encode([
                'success' => true,
                'messages' => $messages,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                    'pages' => ceil($total / $limit)
                ]
            ]);
            break;
            
        case 'count':
            $query = "SELECT COUNT(*) as total FROM guestbook WHERE is_approved = 1";
            $result = $db->query($query);
            $count = $result ? $result->fetch_assoc()['total'] : 0;
            
            echo json_encode([
                'success' => true,
                'count' => $count
            ]);
            break;
            
        default:
            echo json_encode(['error' => '未知的GET请求']);
            break;
    }
}

// 提交留言
function handlePost($action) {
    global $db;
    
    switch ($action) {
        case 'submit':
            $name = sanitize($_POST['name'] ?? '');
            $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
            $message = sanitize($_POST['message'] ?? '');

            if (empty($name) || strlen($name) < 2 || strlen($name) > 100) {
                echo json_encode(['error' => '姓名长度应在2-100个字符之间']);
                return;
            }
            
            if (empty($message) || strlen($message) < 5 || strlen($message) > 1000) {
                echo json_encode(['error' => '留言内容应在5-1000个字符之间']);
                return;
            }
            
            if ($email === false && !empty($_POST['email'])) {
                echo json_encode(['error' => '邮箱格式不正确']);
                return;
            }
            
            // 防止频繁提交
            session_start();
            $ip = getClientIP();
            $lastSubmit = $_SESSION['last_submit'] ?? 0;
            
            if (time() - $lastSubmit < 5) {
                echo json_encode(['error' => '提交过于频繁，请稍后再试']);
                return;
            }
            
            // 生成头像
            $avatar = generateAvatar($name, $email);
            
            // 插入数据库
            $query = "INSERT INTO guestbook (name, email, message, avatar, ip_address) 
                     VALUES (?, ?, ?, ?, ?)";
            
            $stmt = $db->prepare($query);
            $stmt->bind_param('sssss', $name, $email, $message, $avatar, $ip);
            
            if ($stmt->execute()) {
                $_SESSION['last_submit'] = time();

                $newId = $stmt->insert_id;
                $selectQuery = "SELECT id, name, email, message, avatar, created_at 
                               FROM guestbook WHERE id = ?";
                
                $selectStmt = $db->prepare($selectQuery);
                $selectStmt->bind_param('i', $newId);
                $selectStmt->execute();
                $result = $selectStmt->get_result();
                $newMessage = $result->fetch_assoc();
                
                if ($newMessage) {
                    $newMessage['created_at'] = date('Y-m-d H:i', strtotime($newMessage['created_at']));
                    $newMessage['time_ago'] = '刚刚';
                }
                
                echo json_encode([
                    'success' => true,
                    'message' => '留言提交成功！',
                    'data' => $newMessage
                ]);
            } else {
                echo json_encode(['error' => '提交失败，请稍后再试']);
            }
            break;
            
        default:
            echo json_encode(['error' => '未知的POST请求']);
            break;
    }
}

// 时间格式化函数
function timeAgo($datetime) {
    $time = strtotime($datetime);
    $diff = time() - $time;
    
    if ($diff < 60) {
        return '刚刚';
    } elseif ($diff < 3600) {
        return floor($diff / 60) . '分钟前';
    } elseif ($diff < 86400) {
        return floor($diff / 3600) . '小时前';
    } elseif ($diff < 2592000) {
        return floor($diff / 86400) . '天前';
    } else {
        return date('Y-m-d', $time);
    }
}
?>