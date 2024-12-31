<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    include_once '../config/database.php';
    include_once '../models/matakuliah.php';

    $database = new Database();
    $db = $database->getConnection();
    $matakuliah = new Matakuliah($db);

    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'POST' && isset($_POST['_method']) && $_POST['_method'] === 'PUT') {
        $method = 'PUT';
    }

    switch ($method) {
        case 'GET':
            if (isset($_GET['kodemk'])) {
                $matakuliah->kodemk = $_GET['kodemk'];
                $stmt = $matakuliah->readOne();
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($row);
            } else {
                $stmt = $matakuliah->read();
                $matakuliahs = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    array_push($matakuliahs, $row);
                }
                echo json_encode($matakuliahs);
            }
            break;

        case 'POST':
            $matakuliah->kodemk = $_POST['kodemk'] ?? '';
            $matakuliah->nama_matkul = $_POST['nama_matkul'] ?? '';
            $matakuliah->sks = $_POST['sks'] ?? null;
            $matakuliah->jumlah_kelas = $_POST['jumlah_kelas'] ?? null;

            if ($matakuliah->create()) {
                echo json_encode([
                    'success' => true,
                    'message' => "Data mata kuliah berhasil ditambahkan."
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => "Gagal menambahkan data mata kuliah."
                ]);
            }
            break;

        case 'PUT':
            $matakuliah->kodemk = $_POST['kodemk'] ?? '';
            $matakuliah->nama_matkul = $_POST['nama_matkul'] ?? '';
            $matakuliah->sks = $_POST['sks'] ?? null;
            $matakuliah->jumlah_kelas = $_POST['jumlah_kelas'] ?? null;

            if ($matakuliah->update()) {
                echo json_encode([
                    'success' => true,
                    'message' => "Data mata kuliah berhasil diperbarui."
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => "Gagal memperbarui data mata kuliah."
                ]);
            }
            break;

        case 'DELETE':
            $data = json_decode(file_get_contents("php://input"));
            $matakuliah->kodemk = $data->kodemk;

            if ($matakuliah->delete()) {
                echo json_encode([
                    'success' => true,
                    'message' => "Data mata kuliah berhasil dihapus."
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => "Gagal menghapus data mata kuliah."
                ]);
            }
            break;
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => "Terjadi kesalahan pada server."
    ]);
}
