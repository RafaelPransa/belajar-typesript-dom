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

    // Bonus 2 - Challenge
    const daftarProdukData: Product[] = [];

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
        if (!Number.isFinite(validasiHarga) || validasiHarga < 1) {
            error.textContent = "Harga harus lebih dari 0";
            return;
        }
        // Requirement 5 - Validasi Stok
        const validasiStok = Number(stok.value);
        if (!Number.isFinite(validasiStok) || validasiStok < 1) {
            error.textContent = "Stok harus lebih dari 0";
            return;
        }
        // Requirement 6 - Validasi Kategori
        if (kategori.value === "") {
            error.textContent = "Kategori wajib dipilih";
            return;
        }

        const product: Product = {
            nama: validasiNama,
            harga: validasiHarga,
            stok: validasiStok,
            kategori: kategori.value,
        }

        daftarProdukData.push(product);
        renderProduct(product);
        console.info(daftarProdukData);
        console.info(`Produk dibawah harga 100 : ${daftarProdukData.filter(product => product.harga < 100).map(product => product.nama + "Rp." + product.harga).join(", ")}`);
        console.info(daftarProdukData.length);


        error.textContent = "DataProduk Berhasil ditambahkan!";

        // const itemProduk = document.createElement("li");
        // itemProduk.style.whiteSpace = "pre-line";
        // itemProduk.textContent = `${product.nama}\nHarga: Rp.${product.harga}\nStok: ${product.stok}\nKategori: ${product.kategori}`;
        // // Bonus 1 - Menambahkan node baru menggunakan append
        // daftarProduk.append(itemProduk);

        // Cara penulisan menggunakan function
        function renderProduct(produk: Product): void {
            const itemProduk = document.createElement("li");
            itemProduk.style.whiteSpace = "pre-line";
            itemProduk.textContent = `${produk.nama}\nHarga: Rp. ${produk.harga}\nStok: ${produk.stok}\nKategori: ${produk.kategori}`;

            daftarProduk?.appendChild(itemProduk)
        }


        // Requirement 9 - Reset Form
        productForm.reset();
    });
} else {
    console.info("Terdapat element yang kurang di DOM")
}