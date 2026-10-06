// Interface Tipe data
interface Product {
    id: number;
    title: string;
    price: number
}

interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

// DOM element selector
const btnLoad = document.querySelector<HTMLButtonElement>("#buttonLoad");
const btnClear = document.querySelector<HTMLButtonElement>("#buttonClear");
const statusText = document.querySelector<HTMLParagraphElement>("#status");
const listContainer = document.querySelector<HTMLUListElement>("#daftarProduk");

// Validasi DOM element
if (!btnLoad || !btnClear || !statusText || !listContainer) {
    console.error("elemen tidak ditemukan!")
    throw new Error("elemen tidak ditemukan!");
}

// Buat function untuk Validasi data API menggunakan Type Guard
function isProduct(data: unknown): data is Product {
    // Validasi menggunakan Type Narrowing
    // Validasi tipe data (apakah object?)
    if (typeof data !== "object" || data === null) {
        return false;
    }

    // Validasi parameter/key yang ada di dalam object
    if (!("id" in data) || !("title" in data) || !("price" in data)) {
        return false;
    }

    // Kembalikan nilai
    return (
        typeof data.id === "number" &&
        Number.isFinite(data.id) &&
        typeof data.title === "string" &&
        typeof data.price === "number" &&
        Number.isFinite(data.price)
    );
}

// Validasi untuk respon pertama kali API menggunakan Type Guard
function isProductResponse(data: unknown): data is ProductResponse {

    // Validasi data adalah Object
    if (typeof data !== "object" || data === null) {
        return false;
    }

    // Pastikan semua properti response tersedia
    if (
        !("products" in data) ||
        !("total" in data) ||
        !("skip" in data) ||
        !("limit" in data)
    ) {
        return false;
    }

    // Validasi apakah key produk adalah Array
    if (!Array.isArray(data.products)) {
        return false;
    }

    // Validasi apakah setiap item dalam products merupakan Product
    if (!data.products.every(isProduct)) {
        return false;
    }

    // Pastikan properti tambahan memiliki tipe yang benar
    return (
        typeof data.total === "number" &&
        Number.isFinite(data.total) &&
        typeof data.skip === "number" &&
        Number.isFinite(data.skip) &&
        typeof data.limit === "number" &&
        Number.isFinite(data.limit)
    )
}

// Function untuk menampilkan data produk
function renderProducts(listContainer: HTMLUListElement, products: Product[]): void {
    const fragment = document.createDocumentFragment();
    products.forEach((product) => {
        // Buat list baru
        const li = document.createElement("li");
        // Format text
        li.style.whiteSpace = "pre-line";
        // Tampilkan data
        li.textContent = `${product.id}. ${product.title}\n${product.price}`;
        // Tambahkan list ke UL
        fragment.appendChild(li);
    });
    // Bersihkan isi lama dan pasang sekaligus
    listContainer.replaceChildren(fragment);
}

// Funciton untuk mengambil data produk dari API
async function fetchProducts(btnLoad: HTMLButtonElement, statusText: HTMLParagraphElement, listContainer: HTMLUListElement): Promise<void> {
    try {
        // UX State: Disable tombol agar tidak dispam klik
        btnLoad.disabled = true;
        statusText.textContent = "Mengambil data...";


        // Request API
        const response = await fetch("https://dummyjson.com/products");

        // Validasi Request
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        // Compile response jadi JSON
        const data: unknown = await response.json();

        // Validasi data menggunakan type guard 
        if (!isProductResponse(data)) {
            throw new Error("Format response API tidak sesuai dengan ProductResponse");
        }

        statusText.textContent = `Menampilkan ${data.products.length} produk dari total ${data.total} produk`;

        // Render produk
        renderProducts(listContainer, data.products);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan tidak terduga";
        statusText.textContent = "Gagal mengambil data produk";
        console.error("Error:", message);
    } finally {
        // Kembalikan kondisi tombol
        btnLoad.disabled = false;
    }
}

btnLoad.addEventListener("click", () => {
    void fetchProducts(btnLoad, statusText, listContainer);
});

btnClear.addEventListener("click", () => {
    listContainer.replaceChildren();
    statusText.textContent = "Produk telah dihapus.";
});