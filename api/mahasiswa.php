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
    include_once '../models/mahasiswa.php';

    $database = new Database();
    $db = $database->getConnection();
    $mahasiswa = new Mahasiswa($db);

    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'POST' && isset($_POST['_method']) && $_POST['_method'] === 'PUT') {
        $method = 'PUT';
    }

    switch ($method) {
        case 'GET':
            if (isset($_GET['nbi'])) {
                $mahasiswa->nbi = $_GET['nbi'];
                $stmt = $mahasiswa->readOne();
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($row);
            } else {
                $stmt = $mahasiswa->read();
                $mahasiswas = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    array_push($mahasiswas, $row);
                }
                echo json_encode($mahasiswas);
            }
            break;

        case 'POST':
            $photo_filename = null;
            if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
                $upload_result = $mahasiswa->uploadFile($_FILES['photo'], 'photo');
                if (!$upload_result['success']) {
                    echo json_encode([
                        'success' => false,
                        'message' => $upload_result['message']
                    ]);
                    exit();
                }
                $photo_filename = $upload_result['filename'];
            }

            $pdf_filename = null;
            if (isset($_FILES['pdf_file']) && $_FILES['pdf_file']['error'] === UPLOAD_ERR_OK) {
                $upload_result = $mahasiswa->uploadFile($_FILES['pdf_file'], 'pdf');
                if (!$upload_result['success']) {
                    echo json_encode([
                        'success' => false,
                        'message' => $upload_result['message']
                    ]);
                    exit();
                }
                $pdf_filename = $upload_result['filename'];
            }

            $mahasiswa->nbi = $_POST['nbi'] ?? '';
            $mahasiswa->nama = $_POST['nama'] ?? '';
            $mahasiswa->alamat = $_POST['alamat'] ?? '';
            $mahasiswa->ipk = $_POST['ipk'] ?? null;
            $mahasiswa->spp = $_POST['spp'] ?? null;
            $mahasiswa->prodi = $_POST['prodi'] ?? '';
            $mahasiswa->status = $_POST['status'] ?? 'aktif'; // Default to 'aktif'
            $mahasiswa->photo = $photo_filename;
            $mahasiswa->pdf_file = $pdf_filename;

            if ($mahasiswa->create()) {
                echo json_encode([
                    'success' => true,
                    'message' => "Data mahasiswa berhasil ditambahkan."
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => "Gagal menambahkan data mahasiswa."
                ]);
            }
            break;

        case 'PUT':
            $mahasiswa->nbi = $_POST['nbi'] ?? '';
            $mahasiswa->nama = $_POST['nama'] ?? '';
            $mahasiswa->alamat = $_POST['alamat'] ?? '';
            $mahasiswa->ipk = $_POST['ipk'] ?? null;
            $mahasiswa->spp = $_POST['spp'] ?? null;
            $mahasiswa->prodi = $_POST['prodi'] ?? '';
            $mahasiswa->status = $_POST['status'] ?? 'aktif';

            if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
                $upload_result = $mahasiswa->uploadFile($_FILES['photo'], 'photo');
                if (!$upload_result['success']) {
                    echo json_encode([
                        'success' => false,
                        'message' => $upload_result['message']
                    ]);
                    exit();
                }
                $mahasiswa->photo = $upload_result['filename'];
            }

            if (isset($_FILES['pdf_file']) && $_FILES['pdf_file']['error'] === UPLOAD_ERR_OK) {
                $upload_result = $mahasiswa->uploadFile($_FILES['pdf_file'], 'pdf');
                if (!$upload_result['success']) {
                    echo json_encode([
                        'success' => false,
                        'message' => $upload_result['message']
                    ]);
                    exit();
                }
                $mahasiswa->pdf_file = $upload_result['filename'];
            }

            if ($mahasiswa->update()) {
                echo json_encode([
                    'success' => true,
                    'message' => "Data mahasiswa berhasil diperbarui."
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => "Gagal memperbarui data mahasiswa."
                ]);
            }
            break;

        case 'DELETE':
            $data = json_decode(file_get_contents("php://input"));
            $mahasiswa->nbi = $data->nbi;

            if ($mahasiswa->delete()) {
                echo json_encode([
                    'success' => true,
                    'message' => "Data mahasiswa berhasil dihapus."
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => "Gagal menghapus data mahasiswa."
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
