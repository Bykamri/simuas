<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get counts
    $counts = [
        'mahasiswa' => $db->query("SELECT COUNT(*) as total FROM mahasiswa")->fetch(PDO::FETCH_ASSOC)['total'],
        'dosen' => $db->query("SELECT COUNT(*) as total FROM dosen")->fetch(PDO::FETCH_ASSOC)['total'],
        'matakuliah' => $db->query("SELECT COUNT(*) as total FROM matakuliah")->fetch(PDO::FETCH_ASSOC)['total'],
        'kelas' => $db->query("SELECT SUM(jumlah_kelas) as total FROM matakuliah")->fetch(PDO::FETCH_ASSOC)['total']
    ];

    // Get recent data
    $mahasiswaBaru = $db->query("SELECT nbi, nama, alamat, ipk, prodi FROM mahasiswa ORDER BY created_at DESC LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);
    $dosenBaru = $db->query("SELECT kodedsn, nama, alamat, prodi FROM dosen ORDER BY created_at DESC LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);
    $matakuliahBaru = $db->query("SELECT kodemk, nama_matkul, sks, jumlah_kelas FROM matakuliah ORDER BY created_at DESC LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);

    // Get all data from tables
    $allMahasiswa = $db->query("SELECT * FROM mahasiswa ORDER BY nbi")->fetchAll(PDO::FETCH_ASSOC);
    $allDosen = $db->query("SELECT * FROM dosen ORDER BY kodedsn")->fetchAll(PDO::FETCH_ASSOC);
    $allMatakuliah = $db->query("SELECT * FROM matakuliah ORDER BY kodemk")->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'counts' => $counts,
        'recent' => [
            'mahasiswa' => $mahasiswaBaru,
            'dosen' => $dosenBaru,
            'matakuliah' => $matakuliahBaru,
        ],
        'all_data' => [
            'mahasiswa' => $allMahasiswa,
            'dosen' => $allDosen,
            'matakuliah' => $allMatakuliah
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
