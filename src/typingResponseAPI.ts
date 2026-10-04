// Definisi Tipe Data (Types / Interfaces) untuk Response API
interface Product {
    id: number;
    title: string;
    price: number;
}

// Interface untuk response, disesuaikan dengan bentuk JSON nya
interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

// Query elemen DOM
const btnLoad = document.querySelector<HTMLButtonElement>("#btnLoad");
const btnClear = document.querySelector<HTMLButtonElement>("#btnClear");
const statusText = document.querySelector<HTMLParagraphElement>("#status");
const productList = document.querySelector<HTMLUListElement>("#daftarProduk");


// Guard Clause: Pastikan semua elemen ada sebelum aplikasi dijalankan
if (!btnLoad || !btnClear || !statusText || !productList) {
    throw new Error("Elemen DOM yang dibutuhkan tidak ditemukan di HTML.");
}

// Function untuk menampilkan data
function renderProducts(container: HTMLUListElement, products: Product[]): void {
    const fragment = document.createDocumentFragment();
    products.forEach((product) => {
        // Buat element list
        const li = document.createElement("li");
        // Format text
        li.style.whiteSpace = "pre-line";
        // Tampilkan data
        li.textContent = `${product.id}. ${product.title}\n$${product.price}`;

        // Tambahkan list ke UL
        fragment.appendChild(li);
    });
    // Bersihkan isi lama dan pasang sekaligus
    container.replaceChildren(fragment);
}

// Ambil data produk dari API
async function fetchProducts(status: HTMLParagraphElement, list: HTMLUListElement, button: HTMLButtonElement): Promise<void> {
    try {
        // Update UX State: Disable tombol agar tidak dispam klik
        button.disabled = true;
        status.textContent = "Mengambil Data..."

        // Request ke API
        const response = await fetch("https://dummyjson.com/products");

        // Validasi Request
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        // Ubah response menjadi bentuk JSON
        const data: ProductResponse = await response.json();

        // Tampilkan data
        renderProducts(list, data.products);

        status.textContent = `Menampilkan ${data.products.length} produk dari total ${data.total} produk`;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan tak terduga";
        status.textContent = "Gagal mengambil data produk";
        console.error("Fetch error:", message);
    } finally {
        // Kembalikan kondisi tombol
        button.disabled = false;
    }
}

// Event pemicu untuk menampilkan data ke user
btnLoad.addEventListener("click", () => {
    // Panggil function ambil data
    void fetchProducts(statusText, productList, btnLoad);
});

// Event pemicu untuk mengosongkan produk
btnClear.addEventListener("click", () => {
    productList.replaceChildren();
    statusText.textContent = "Produk telah dibersihkan.";
});

