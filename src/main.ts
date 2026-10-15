// ==========================================
// 1. Error Definitions & Helpers
// ==========================================

class HttpError extends Error {
    constructor(public readonly status: number, statusText?: string) {
        super(`HTTP error: ${status}${statusText ? ` ${statusText}` : ""}`);
        this.name = "HttpError";
    }
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

// ==========================================
// 2. Data Types & Runtime Type Guards
// ==========================================

interface Product {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
}

interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

function isProduct(data: unknown): data is Product {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    if (
        !("id" in data) ||
        !("title" in data) ||
        !("price" in data) ||
        !("thumbnail" in data)
    ) {
        return false;
    }

    return (
        typeof data.id === "number" && Number.isFinite(data.id) && data.id >= 0 &&
        typeof data.title === "string" && data.title.trim().length > 0 &&
        typeof data.price === "number" && Number.isFinite(data.price) && data.price >= 0 &&
        typeof data.thumbnail === "string" && data.thumbnail.trim().length > 0
    );
}

function isProductResponse(data: unknown): data is ProductResponse {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    if (
        !("products" in data) ||
        !("total" in data) ||
        !("skip" in data) ||
        !("limit" in data)
    ) {
        return false;
    }

    if (!Array.isArray(data.products)) {
        return false;
    }

    if (!data.products.every(isProduct)) {
        return false;
    }

    return (
        typeof data.total === "number" && Number.isFinite(data.total) && data.total >= 0 &&
        typeof data.skip === "number" && Number.isFinite(data.skip) && data.skip >= 0 &&
        typeof data.limit === "number" && Number.isFinite(data.limit) && data.limit >= 0
    );
}

// ==========================================
// 3. API Services
// ==========================================

const PRODUCTS_API_URL = "https://dummyjson.com/products";

async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
    const response = await fetch(
        PRODUCTS_API_URL,
        signal ? { signal } : {}
    );

    if (!response.ok) {
        throw new HttpError(response.status, response.statusText);
    }

    const data: unknown = await response.json();

    if (!isProductResponse(data)) {
        throw new Error("Format data API tidak sesuai skema ProductResponse");
    }

    return data.products;
}

// ==========================================
// 4. UI Components & DOM Rendering
// ==========================================

const idrCurrencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
});

function renderProductCard(product: Product): HTMLDivElement {
    const card = document.createElement("div");
    card.className = "product-card";

    const thumbnail = document.createElement("img");
    thumbnail.src = product.thumbnail;
    thumbnail.alt = product.title;
    thumbnail.loading = "lazy";

    const title = document.createElement("h2");
    title.textContent = product.title;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = idrCurrencyFormatter.format(product.price);

    card.append(thumbnail, title, price);
    return card;
}

function renderProductList(container: HTMLElement, products: Product[]): void {
    const cards = products.map(renderProductCard);
    container.replaceChildren(...cards);
}

// ==========================================
// 5. State Management & Event Orchestration
// ==========================================

function getRequiredElement<T extends Element>(selector: string): T {
    const element = document.querySelector<T>(selector);
    if (!element) {
        throw new Error(`Elemen DOM "${selector}" tidak ditemukan`);
    }
    return element;
}

const productListElement = getRequiredElement<HTMLElement>("#daftarProduk");
const statusElement = getRequiredElement<HTMLParagraphElement>("#status");
const loadButton = getRequiredElement<HTMLButtonElement>("#buttonLoad");

let activeAbortController: AbortController | null = null;
let currentRequestId = 0;

async function muatProduk(): Promise<void> {
    const thisRequestId = ++currentRequestId;

    // Batalkan permintaan jaringan sebelumnya yang belum selesai
    activeAbortController?.abort();
    const abortController = new AbortController();
    activeAbortController = abortController;

    loadButton.disabled = true;
    statusElement.textContent = "Memuat produk...";
    productListElement.replaceChildren();

    try {
        const products = await fetchProducts(abortController.signal);

        // Abaikan hasil jika user sudah memicu request baru (mencegah race condition)
        if (thisRequestId !== currentRequestId) return;

        renderProductList(productListElement, products);
        statusElement.textContent = `Berhasil memuat ${products.length} produk.`;
    } catch (error: unknown) {
        // Abaikan error dari request usang
        if (thisRequestId !== currentRequestId) return;

        if (error instanceof DOMException && error.name === "AbortError") {
            statusElement.textContent = "Permintaan dibatalkan.";
            return;
        }

        statusElement.textContent = `Gagal memuat produk: ${getErrorMessage(error)}`;
    } finally {
        if (thisRequestId === currentRequestId) {
            loadButton.disabled = false;
            activeAbortController = null;
        }
    }
}

// Event Listeners
loadButton.addEventListener("click", () => {
    void muatProduk();
});

// Muat data awal saat aplikasi pertama kali dibuka
void muatProduk();
