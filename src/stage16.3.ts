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

// Buat function untuk Validasi data API menggunakan Type Guard
function isProduct(data: unknown): data is Product {
    // Validasi menggunakan Type Narrowing
    // Validasi tipe data (apakah object?)
    if (typeof data !== "object" || data === null) return false;

    // Validasi parameter/key yang ada di dalam object
    if (!("id" in data) || !("title" in data) || !("price" in data)) return false;

    // Kembalikan nilai
    return (
        typeof data.id === "number" && Number.isFinite(data.id) && data.id >= 0 &&
        typeof data.title === "string" && data.title.trim().length > 0 &&
        typeof data.price === "number" && Number.isFinite(data.price) && data.price >= 0
    );
}

// Validasi untuk respon pertama kali API menggunakan Type Guard
function isProductResponse(data: unknown): data is ProductResponse {

    // Validasi data adalah Object
    if (typeof data !== "object" || data === null) return false;
    // Pastikan semua properti response tersedia
    if (
        !("products" in data) ||
        !("total" in data) ||
        !("skip" in data) ||
        !("limit" in data)
    ) return false;

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
        typeof data.total === "number" && Number.isFinite(data.total) &&
        typeof data.skip === "number" && Number.isFinite(data.skip) &&
        typeof data.limit === "number" && Number.isFinite(data.limit)
    );
}

// API Service (Terpisah & Mudah di-Unit Test)
const API_URL = "https://dummyjson.com/products";

async function fetchProductsFromAPI(signal?: AbortSignal): Promise<ProductResponse> {
    const response = await fetch(API_URL, { signal: signal ?? null, });

    if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}(${response.statusText})`);
    }

    const data: unknown = await response.json();
    if (!isProductResponse(data)) {
        throw new Error("Format respons API tidak sesuai dengan skema ProductResponse");
    }

    return data;
}

// Format Utilities
const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

// Function untuk menampilkan data produk
function renderProducts(container: HTMLUListElement, products: Product[]): void {
    const fragment = document.createDocumentFragment();
    products.forEach((product) => {
        // Buat list baru
        const li = document.createElement("li");
        // Format text
        li.className = "product-item";
        const titleSpan = document.createElement("strong");
        titleSpan.textContent = product.title;
        const priceSpan = document.createElement("span");
        priceSpan.textContent = `-
        ${currencyFormatter.format(product.price)}
        `;
        li.append(titleSpan, priceSpan);
        fragment.appendChild(li);
    });
    // Bersihkan isi lama dan pasang sekaligus
    container.replaceChildren(fragment);
}

// Application Initialization & Event Handlers
function setupApp(): void {
    // DOM element selector
    const btnLoad = document.querySelector<HTMLButtonElement>("#buttonLoad");
    const btnClear = document.querySelector<HTMLButtonElement>("#buttonClear");
    const statusText = document.querySelector<HTMLParagraphElement>("#status");
    const listContainer = document.querySelector<HTMLUListElement>("#daftarProduk");

    // Validasi DOM element
    if (!btnLoad || !btnClear || !statusText || !listContainer) {
        console.error("Elemen DOM tidak ditemukan!");
        return;
    }

    let currentAbortController: AbortController | null = null;
    let requestId = 0;

    btnLoad.addEventListener("click", async () => {
        // Tandai request ini sebagai request terbaru
        const thisRequestId = ++requestId;

        // Batalkan request sebelumnya jika masih berjalan
        currentAbortController?.abort();
        const controller = new AbortController();
        currentAbortController = controller;

        btnLoad.disabled = true;
        statusText.textContent = "Mengambil data...";

        try {
            // Timeout otomatis setelah 10 detik
            const timeoutSignal = AbortSignal.any([
                controller.signal,
                AbortSignal.timeout(10000),
            ]);

            const data = await fetchProductsFromAPI(timeoutSignal);

            // Abaikan hasil jika ada request baru
            if (thisRequestId !== requestId) return;

            renderProducts(listContainer, data.products);
            statusText.textContent = `Menampilkan ${data.products.length} dari ${data.total} produk`;
        } catch (error) {
            // Request lama tidak boleh mengubah UI
            if (thisRequestId !== requestId) return;

            // Cek apakah error akibat abort
            if (error instanceof DOMException && error.name === "AbortError") {
                statusText.textContent = "Permintaan dibatalkan.";
                return;
            }

            if (error instanceof Error && error.name === "TimeoutError") {
                statusText.textContent = "Permintaan melebihi batas waktu";
                return;
            }

            const message = error instanceof Error ? error.message : "Terjadi kesalahan tak terduga";
            statusText.textContent = `Gagal mengambil data: ${message}`;
        } finally {
            if (thisRequestId === requestId) {
                btnLoad.disabled = false;
                currentAbortController = null;
            }
        }
    });

    btnClear.addEventListener("click", () => {
        // Membuat semua request sebelumnya menjadi tidak relevan
        requestId++;
        // Batalkan fetch jika sedang berjalan saat klik clear
        currentAbortController?.abort();
        currentAbortController = null;

        btnLoad.disabled = false;
        listContainer.replaceChildren();
        statusText.textContent = "Produk telah dihapus.";
    });
}

// Jalankan inisialisasi
setupApp();