// Custom Error
class HttpError extends Error {
    constructor(public readonly status: number, statusText?: string) {
        super(`HTTP error: ${status}${statusText ? ` ${statusText}` : ""}`);
        this.name = "HttpError";
    }
}

function getMessageError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

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
    // Pastikan data bukan object ataupun null
    if (typeof data !== "object" || data === null) {
        return false;
    }

    // Pastikan semua properti ada
    if (
        !("products" in data) ||
        !("total" in data) ||
        !("skip" in data) ||
        !("limit" in data)
    ) {
        return false;
    }

    // Pastikan properti products adalah array
    if (!Array.isArray(data.products)) {
        return false;
    }

    // Validasi setiap item dalam products
    if (!data.products.every(isProduct)) {
        return false;
    }

    // Pastikan total, skip dan limit bertipe number
    return (
        typeof data.total === "number" && Number.isFinite(data.total) && data.total >= 0 &&
        typeof data.skip === "number" && Number.isFinite(data.skip) && data.skip >= 0 &&
        typeof data.limit === "number" && Number.isFinite(data.limit) && data.limit >= 0
    );
}

async function ambilProduk(): Promise<Product[]> {
    const response = await fetch("https://dummyjson.com/products");

    if (!response.ok) {
        throw new HttpError(response.status, response.statusText);
    }

    const data: unknown = await response.json();

    // Periksa apakah data merupakan ProductResponse.
    // Jika tidak valid, lempar Error.
    if (!isProductResponse(data)) {
        throw new Error("Format data API tidak sesuai");
    }

    // jika valid, kembalikan array products
    return data.products;
}

async function main(): Promise<void> {
    try {
        const products = await ambilProduk();

        console.log("Jumlah produk:", products.length);
        console.log("Daftar produk:", products);
    } catch (error: unknown) {
        console.error(
            "Gagal mengambil produk:",
            getMessageError(error)
        );
    }
}

void main();