<?php
class Matakuliah
{
    private $conn;
    private $table_name = "matakuliah";

    public $kodemk;
    public $nama_matkul;
    public $sks;
    public $jumlah_kelas;
    public $created_at;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    private function isKodeMKExists($exclude_kodemk = null)
    {
        $query = "SELECT kodemk FROM " . $this->table_name . " WHERE kodemk = :kodemk";
        if ($exclude_kodemk) {
            $query .= " AND kodemk != :exclude_kodemk";
        }

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":kodemk", $this->kodemk);

        if ($exclude_kodemk) {
            $stmt->bindParam(":exclude_kodemk", $exclude_kodemk);
        }

        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function create()
    {
        if ($this->isKodeMKExists()) {
            throw new Exception("Kode Mata Kuliah already exists in the database.");
        }

        $query = "INSERT INTO " . $this->table_name .
            " (kodemk, nama_matkul, sks, jumlah_kelas) VALUES" .
            " (:kodemk, :nama_matkul, :sks, :jumlah_kelas)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":kodemk", $this->kodemk);
        $stmt->bindParam(":nama_matkul", $this->nama_matkul);
        $stmt->bindParam(":sks", $this->sks);
        $stmt->bindParam(":jumlah_kelas", $this->jumlah_kelas);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update()
    {
        $query = "UPDATE " . $this->table_name . " SET 
                  nama_matkul = :nama_matkul,
                  sks = :sks,
                  jumlah_kelas = :jumlah_kelas
                  WHERE kodemk = :kodemk";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":kodemk", $this->kodemk);
        $stmt->bindParam(":nama_matkul", $this->nama_matkul);
        $stmt->bindParam(":sks", $this->sks);
        $stmt->bindParam(":jumlah_kelas", $this->jumlah_kelas);

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
        $query = "SELECT kodemk, nama_matkul, sks, jumlah_kelas, created_at 
                 FROM " . $this->table_name . " WHERE kodemk = :kodemk";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":kodemk", $this->kodemk);
        $stmt->execute();
        return $stmt;
    }

    public function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE kodemk = :kodemk";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":kodemk", $this->kodemk);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
