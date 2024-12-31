<?php
class Dosen
{
    private $conn;
    private $table_name = "dosen";

    public $id;
    public $kodedsn;
    public $nama;
    public $email;
    public $alamat;
    public $prodi;
    public $jabatan;
    public $created_at;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    private function isKodeDsnExists($exclude_kodedsn = null)
    {
        $query = "SELECT kodedsn FROM " . $this->table_name . " WHERE kodedsn = :kodedsn";
        if ($exclude_kodedsn) {
            $query .= " AND kodedsn != :exclude_kodedsn";
        }

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":kodedsn", $this->kodedsn);

        if ($exclude_kodedsn) {
            $stmt->bindParam(":exclude_kodedsn", $exclude_kodedsn);
        }

        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function create()
    {
        if ($this->isKodeDsnExists()) {
            throw new Exception("Kode dosen already exists in the database.");
        }

        $query = "INSERT INTO " . $this->table_name .
            " (kodedsn, nama, email, alamat, prodi, jabatan) VALUES" .
            " (:kodedsn, :nama, :email, :alamat, :prodi, :jabatan)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":kodedsn", $this->kodedsn);
        $stmt->bindParam(":nama", $this->nama);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":alamat", $this->alamat);
        $stmt->bindParam(":prodi", $this->prodi);
        $stmt->bindParam(":jabatan", $this->jabatan);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function readOne()
    {
        $query = "SELECT * FROM dosen WHERE kodedsn = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->kodedsn);

        if ($stmt->execute()) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row) {
                return $row;
            }
        }

        return null;
    }

    public function update()
    {
        $query = "UPDATE " . $this->table_name . " SET 
                  nama = :nama, 
                  email = :email,
                  alamat = :alamat,
                  prodi = :prodi,
                  jabatan = :jabatan
                  WHERE kodedsn = :kodedsn";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":kodedsn", $this->kodedsn);
        $stmt->bindParam(":nama", $this->nama);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":alamat", $this->alamat);
        $stmt->bindParam(":prodi", $this->prodi);
        $stmt->bindParam(":jabatan", $this->jabatan);

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

    public function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE kodedsn = :kodedsn";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":kodedsn", $this->kodedsn);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
