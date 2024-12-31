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
    include_once '../models/dosen.php';

    $database = new Database();
    $db = $database->getConnection();
    $dosen = new Dosen($db);

    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'POST' && isset($_POST['_method']) && $_POST['_method'] === 'PUT') {
        $method = 'PUT';
    }

    switch ($method) {
        case 'GET':
            // Check if specific kodedsn is requested
            if (isset($_GET['kodedsn'])) {
                $dosen->kodedsn = $_GET['kodedsn'];
                $result = $dosen->readOne(); // Anda perlu menambahkan method ini di class Dosen

                if ($result) {
                    echo json_encode($result);
                } else {
                    http_response_code(404);
                    echo json_encode([
                        'success' => false,
                        'message' => "Dosen tidak ditemukan."
                    ]);
                }
            } else {
                // Return all dosen data if no specific kodedsn
                $stmt = $dosen->read();
                $dosens = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    array_push($dosens, $row);
                }
                echo json_encode($dosens);
            }
            break;

        case 'POST':
            $dosen->kodedsn = $_POST['kodedsn'] ?? '';
            $dosen->nama = $_POST['nama'] ?? '';
            $dosen->email = $_POST['email'] ?? '';
            $dosen->alamat = $_POST['alamat'] ?? '';
            $dosen->prodi = $_POST['prodi'] ?? '';
            $dosen->jabatan = $_POST['jabatan'] ?? '';

            if ($dosen->create()) {
                echo json_encode([
                    'success' => true,
                    'message' => "Data dosen berhasil ditambahkan."
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => "Gagal menambahkan data dosen."
                ]);
            }
            break;

        case 'PUT':
            $dosen->kodedsn = $_POST['kodedsn'] ?? '';
            $dosen->nama = $_POST['nama'] ?? '';
            $dosen->email = $_POST['email'] ?? '';
            $dosen->alamat = $_POST['alamat'] ?? '';
            $dosen->prodi = $_POST['prodi'] ?? '';
            $dosen->jabatan = $_POST['jabatan'] ?? '';

            if ($dosen->update()) {
                echo json_encode([
                    'success' => true,
                    'message' => "Data dosen berhasil diperbarui."
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => "Gagal memperbarui data dosen."
                ]);
            }
            break;

        case 'DELETE':
            $data = json_decode(file_get_contents("php://input"));
            $dosen->kodedsn = $data->kodedsn;

            if ($dosen->delete()) {
                echo json_encode([
                    'success' => true,
                    'message' => "Data dosen berhasil dihapus."
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => "Gagal menghapus data dosen."
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
