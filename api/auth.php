<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../models/administrator.php';

$database = new Database();
$db = $database->getConnection();
$user = new Administrator($db);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->action)) {
        switch ($data->action) {
            case 'login':
                if (isset($data->username) && isset($data->password)) {
                    $user->username = $data->username;
                    // Hash the password using SHA256
                    $user->password = hash('sha256', $data->password);

                    $result = $user->login();
                    if ($result) {
                        $_SESSION['user_id'] = $result['id'];
                        $_SESSION['username'] = $result['username'];

                        echo json_encode([
                            "success" => true,
                            "message" => "Login successful",
                            "user" => [
                                "id" => $result['id'],
                                "username" => $result['username']
                            ]
                        ]);
                    } else {
                        http_response_code(401);
                        echo json_encode([
                            "success" => false,
                            "message" => "Invalid credentials"
                        ]);
                    }
                }
                break;

            case 'logout':
                session_destroy();
                echo json_encode([
                    "success" => true,
                    "message" => "Logout successful"
                ]);
                break;

            case 'check_session':
                if (isset($_SESSION['user_id'])) {
                    echo json_encode([
                        "success" => true,
                        "user" => [
                            "id" => $_SESSION['user_id'],
                            "username" => $_SESSION['username']
                        ]
                    ]);
                } else {
                    http_response_code(401);
                    echo json_encode([
                        "success" => false,
                        "message" => "No active session"
                    ]);
                }
                break;
        }
    }
}
