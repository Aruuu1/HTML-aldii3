document.getElementById('nilaiForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Mencegah form dari reload halaman

    // Ambil nilai dari form
    const nim = document.getElementById('nim').value;
    const nama = document.getElementById('nama').value;
    const tugas = parseFloat(document.getElementById('tugas').value);
    const quiz = parseFloat(document.getElementById('quiz').value);
    const uts = parseFloat(document.getElementById('uts').value);
    const uas = parseFloat(document.getElementById('uas').value);

    // Validasi nilai tugas, quiz, uts, dan uas (harus antara 0 dan 100)
    if (isNaN(tugas) || tugas < 0 || tugas > 100 ||
        isNaN(quiz) || quiz < 0 || quiz > 100 ||
        isNaN(uts) || uts < 0 || uts > 100 ||
        isNaN(uas) || uas < 0 || uas > 100) {
        alert("Nilai tidak valid. Pastikan semua nilai antara 0 dan 100.");
        return; // Menghentikan proses jika ada nilai yang tidak valid
    }

    // Hitung nilai akhir
    const nilai_akhir = (tugas * 0.2) + (quiz * 0.2) + (uts * 0.3) + (uas * 0.3);
    const grade = hitungGrade(nilai_akhir);

    // Kirim data ke control.php menggunakan fetch
    fetch('control.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nim: nim,
            nama: nama,
            tugas: tugas,
            quiz: quiz,
            uts: uts,
            uas: uas,
            nilai_akhir: nilai_akhir,
            grade: grade
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);
                getMahasiswaData(); // Ambil data terbaru setelah submit berhasil
            } else if (data.status === 'exists') {  // Kondisi untuk NIM yang sudah ada
                alert('Error: Data sudah ada dengan NIM tersebut');
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
});

// Fungsi untuk menghitung grade
function hitungGrade(nilai_akhir) {
    if (nilai_akhir >= 85) return 'A';
    if (nilai_akhir >= 70) return 'B';
    if (nilai_akhir >= 55) return 'C';
    if (nilai_akhir >= 40) return 'D';
    return 'E';
}

// Fungsi untuk mengambil data mahasiswa dari control.php
function getMahasiswaData() {
    fetch('control.php')
        .then(response => response.json())
        .then(data => {
            if (data.length) {
                let table = `<table class="table table-bordered">
                                <tr>
                                    <th>NIM</th>
                                    <th>Nama</th>
                                    <th>Tugas</th>
                                    <th>Quiz</th>
                                    <th>UTS</th>
                                    <th>UAS</th>
                                    <th>Nilai Akhir</th>
                                    <th>Grade</th>
                                </tr>`;
                data.forEach(mahasiswa => {
                    table += `<tr>
                                <td>${mahasiswa.nim}</td>
                                <td>${mahasiswa.nama}</td>
                                <td>${mahasiswa.tugas}</td>
                                <td>${mahasiswa.quiz}</td>
                                <td>${mahasiswa.uts}</td>
                                <td>${mahasiswa.uas}</td>
                                <td>${mahasiswa.nilai_akhir}</td>
                                <td>${mahasiswa.grade}</td>
                              </tr>`;
                });
                table += `</table>`;
                document.getElementById('mahasiswaTable').innerHTML = table;
            } else {
                document.getElementById('mahasiswaTable').innerHTML = '<p>Tidak ada data mahasiswa.</p>';
            }
        })
        .catch(error => console.error('Error:', error));
}

// Panggil fungsi getMahasiswaData saat halaman dimuat
window.onload = getMahasiswaData;
