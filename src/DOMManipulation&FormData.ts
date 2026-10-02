// Requirement 1 — Ambil Elemen
const productForm = document.querySelector<HTMLFormElement>("#productForm");
const nama = document.querySelector<HTMLInputElement>("#nama");
const harga = document.querySelector<HTMLInputElement>("#harga");
const stok = document.querySelector<HTMLInputElement>("#stok");
const kategori = document.querySelector<HTMLSelectElement>("#kategori");
const error = document.querySelector<HTMLParagraphElement>("#error");
const daftarProduk = document.querySelector<HTMLUListElement>("#daftarProduk");

if (
    productForm instanceof HTMLFormElement &&
    nama instanceof HTMLInputElement &&
    harga instanceof HTMLInputElement &&
    stok instanceof HTMLInputElement &&
    kategori instanceof HTMLSelectElement &&
    error instanceof HTMLParagraphElement &&
    daftarProduk instanceof HTMLUListElement
) {
    // Requirement 2 - Form Subit
    productForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Requirement 3 — Validasi Nama
        const validasiNama = nama.value.trim();
        if (validasiNama === "") {
            error.textContent = "Nama wajib diisi!";
            return;
        }
        // Requirement 4 - Validasi harga
        const validasiHarga = Number(harga.value);
        if (validasiHarga < 1) {
            error.textContent = "Harga harus lebih dari 0";
            return;
        }
        // Requirement 5 - Validasi Stok
        const validasiStok = Number(stok.value);
        if (validasiStok < 1) {
            error.textContent = "Stok harus lebih dari 0";
            return;
        }
        // Requirement 6 - Validasi Kategori
        if (kategori.value === "") {
            error.textContent = "Kategori wajib dipilih";
            return;
        }
        kategori.addEventListener("change", () => {
            console.info(kategori.value);
        });
        // Requirement 7 — Buat Object
        interface Product {
            nama: string;
            harga: number;
            stok: number;
            kategori: string;
        }
        const product: Product = {
            nama: validasiNama,
            harga: validasiHarga,
            stok: validasiStok,
            kategori: kategori.value,
        }
        error.textContent = "Data Produk Berhasil ditambahkan!";
        // Requirement 8 - Tambah ke DOM
        const itemProduk = document.createElement("li");
        itemProduk.style.whiteSpace = "pre-line"; // Memberitahu browser agar merender \n sebagai baris baru
        itemProduk.textContent = `${product.nama}\nHarga: ${product.harga}\nStok: ${product.stok}\nKategori: ${product.kategori}\n`;
        daftarProduk.appendChild(itemProduk);
        // Requirement 9 - Reset Form
        productForm.reset();
    });
} else {
    console.info("Terdapat element yang kurang di DOM")
}