<?php
header('Content-Type: application/json');

// Koneksi ke database
include("connect.php");

// Cek metode request (POST untuk memasukkan data, GET untuk menampilkan data)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ambil data dari request body
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['nim'], $data['nama'], $data['tugas'], $data['quiz'], $data['uts'], $data['uas'], $data['nilai_akhir'], $data['grade'])) {
        // Escape input
        $nim = mysqli_real_escape_string($conn, $data['nim']);
        $nama = mysqli_real_escape_string($conn, $data['nama']);
        $tugas = mysqli_real_escape_string($conn, $data['tugas']);
        $quiz = mysqli_real_escape_string($conn, $data['quiz']);
        $uts = mysqli_real_escape_string($conn, $data['uts']);
        $uas = mysqli_real_escape_string($conn, $data['uas']);
        $nilai_akhir = mysqli_real_escape_string($conn, $data['nilai_akhir']);
        $grade = mysqli_real_escape_string($conn, $data['grade']);

        // Validasi nilai tugas, quiz, uts, dan uas (harus antara 0 dan 100)
        if (($tugas < 0 || $tugas > 100) || ($quiz < 0 || $quiz > 100) || 
            ($uts < 0 || $uts > 100) || ($uas < 0 || $uas > 100)) {
            // Jika ada nilai yang tidak valid, kirimkan response error
            echo json_encode(['status' => 'error', 'message' => 'Nilai tidak valid. Nilai harus antara 0 dan 100.']);
        } else {
            // Cek apakah NIM sudah ada di database
            $check_sql = "SELECT * FROM mahasiswa WHERE nim = '$nim'";
            $check_result = $conn->query($check_sql);

            if ($check_result->num_rows > 0) {
                // Jika NIM sudah ada, kirim response bahwa data sudah ada
                echo json_encode(['status' => 'exists', 'message' => 'NIM sudah ada, data tidak bisa ditambahkan']);
            } else {
                // Jika NIM belum ada, lakukan insert data baru
                $sql = "INSERT INTO mahasiswa (nim, nama, tugas, quiz, uts, uas, nilai_akhir, grade) 
                        VALUES ('$nim', '$nama', '$tugas', '$quiz', '$uts', '$uas', '$nilai_akhir', '$grade')";

                if ($conn->query($sql) === TRUE) {
                    echo json_encode(['status' => 'success', 'message' => 'Data berhasil disimpan']);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Error: ' . $conn->error]);
                }
            }
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Data tidak lengkap']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Ambil data dari database
    $sql = "SELECT * FROM mahasiswa";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $data_mahasiswa = [];
        while ($row = $result->fetch_assoc()) {
            $data_mahasiswa[] = $row;
        }
        echo json_encode($data_mahasiswa);
    } else {
        echo json_encode([]);
    }
}

$conn->close();
?>
