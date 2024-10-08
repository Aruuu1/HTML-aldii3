<?php
// Koneksi untuk memghubungkan ke mysql
$nameserver = "localhost";
$username = "root";
$password = "";
$dbname = "nilai_mahasiswa";

// Menghubungkan php ke mysql
$conn = new mysqli($nameserver, $username, $password, $dbname);

// Check koneksi
if ($conn->connect_error) {
    die("coba lagi" . $conn->connect_error);
}
?>