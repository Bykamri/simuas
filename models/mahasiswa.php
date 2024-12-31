<?php
class Mahasiswa
{
    private $conn;
    private $table_name = "mahasiswa";

    public $id;
    public $nbi;
    public $nama;
    public $alamat;
    public $ipk;
    public $spp;
    public $prodi;
    public $pdf_file;
    public $photo;
    public $status; // New status field
    public $created_at;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    private function isNBIExists($exclude_nbi = null)
    {
        $query = "SELECT nbi FROM " . $this->table_name . " WHERE nbi = :nbi";
        if ($exclude_nbi) {
            $query .= " AND nbi != :exclude_nbi";
        }

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":nbi", $this->nbi);

        if ($exclude_nbi) {
            $stmt->bindParam(":exclude_nbi", $exclude_nbi);
        }

        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function create()
    {
        if ($this->isNBIExists()) {
            throw new Exception("NBI already exists in the database.");
        }

        $query = "INSERT INTO " . $this->table_name .
            " (nbi, nama, alamat, ipk, spp, prodi, pdf_file, photo, status) VALUES" .
            " (:nbi, :nama, :alamat, :ipk, :spp, :prodi, :pdf_file, :photo, :status)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":nbi", $this->nbi);
        $stmt->bindParam(":nama", $this->nama);
        $stmt->bindParam(":alamat", $this->alamat);
        $stmt->bindParam(":ipk", $this->ipk);
        $stmt->bindParam(":spp", $this->spp);
        $stmt->bindParam(":prodi", $this->prodi);
        $stmt->bindParam(":pdf_file", $this->pdf_file);
        $stmt->bindParam(":photo", $this->photo);
        $stmt->bindParam(":status", $this->status);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update()
    {
        $current_data_query = "SELECT nbi, photo, pdf_file FROM " . $this->table_name . " WHERE nbi = :nbi";
        $stmt = $this->conn->prepare($current_data_query);
        $stmt->bindParam(":nbi", $this->nbi);
        $stmt->execute();
        $current_data = $stmt->fetch(PDO::FETCH_ASSOC);

        $query = "UPDATE " . $this->table_name . " SET 
                  nama = :nama, 
                  alamat = :alamat,
                  ipk = :ipk,
                  spp = :spp,
                  prodi = :prodi,
                  status = :status";

        // Handle photo update
        if ($this->photo) {
            $query .= ", photo = :photo";
            if (!empty($current_data['photo'])) {
                $old_photo_path = "../public/uploads/photos/" . $current_data['photo'];
                if (file_exists($old_photo_path)) {
                    unlink($old_photo_path);
                }
            }
        }

        // Handle PDF update
        if ($this->pdf_file) {
            $query .= ", pdf_file = :pdf_file";
            if (!empty($current_data['pdf_file'])) {
                $old_pdf_path = "../public/uploads/pdfs/" . $current_data['pdf_file'];
                if (file_exists($old_pdf_path)) {
                    unlink($old_pdf_path);
                }
            }
        }

        $query .= " WHERE nbi = :nbi";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":nbi", $this->nbi);
        $stmt->bindParam(":nama", $this->nama);
        $stmt->bindParam(":alamat", $this->alamat);
        $stmt->bindParam(":ipk", $this->ipk);
        $stmt->bindParam(":spp", $this->spp);
        $stmt->bindParam(":prodi", $this->prodi);
        $stmt->bindParam(":status", $this->status);

        if ($this->photo) {
            $stmt->bindParam(":photo", $this->photo);
        }
        if ($this->pdf_file) {
            $stmt->bindParam(":pdf_file", $this->pdf_file);
        }

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function read()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readOne()
    {
        $query = "SELECT nbi, nama, alamat, ipk, spp, prodi, email, photo, pdf_file, status, created_at 
                 FROM " . $this->table_name . " WHERE nbi = :nbi";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":nbi", $this->nbi);
        $stmt->execute();
        return $stmt;
    }

    public function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE nbi = :nbi";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":nbi", $this->nbi);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Keep the uploadFile method as is
    public function uploadFile($file, $type = 'photo')
    {
        // Existing implementation remains the same
        $target_dir = "../public/uploads/";
        if ($type === 'pdf') {
            $target_dir .= "pdfs/";
        } else {
            $target_dir .= "photos/";
        }

        if (!file_exists($target_dir)) {
            mkdir($target_dir, 0777, true);
        }

        $file_extension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
        $new_filename = uniqid() . '.' . $file_extension;
        $target_file = $target_dir . $new_filename;

        $allowed_types = ($type === 'pdf')
            ? array('pdf')
            : array('jpg', 'jpeg', 'png', 'gif');

        if (!in_array($file_extension, $allowed_types)) {
            return array(
                "success" => false,
                "message" => $type === 'pdf'
                    ? "Sorry, only PDF files are allowed."
                    : "Sorry, only JPG, JPEG, PNG & GIF files are allowed."
            );
        }

        $max_size = ($type === 'pdf') ? 10000000 : 5000000;
        if ($file["size"] > $max_size) {
            return array(
                "success" => false,
                "message" => "Sorry, your file is too large. Maximum size is " .
                    ($type === 'pdf' ? "10MB." : "5MB.")
            );
        }

        if (move_uploaded_file($file["tmp_name"], $target_file)) {
            return array(
                "success" => true,
                "filename" => $new_filename
            );
        } else {
            return array(
                "success" => false,
                "message" => "Sorry, there was an error uploading your file."
            );
        }
    }
}
