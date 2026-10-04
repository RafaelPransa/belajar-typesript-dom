// Requirement 1 - Ambil Element DOM
const btnLoad = document.querySelector<HTMLButtonElement>("#btnLoad");
const status = document.querySelector<HTMLParagraphElement>("#status");
const daftarProduk = document.querySelector<HTMLUListElement>("#daftarProduk");

// Validasi DOM
if (btnLoad instanceof HTMLButtonElement && status instanceof HTMLParagraphElement && daftarProduk instanceof HTMLUListElement) {
    // Interface
    interface Product {
        id: number;
        title: string;
        price: number;
    }
    interface ProductResponse {
        products: Product[];
        total: number;
        skip: number;
        limit: number;
    }

    // Render Data
    function renderData(products: Product[]): void {
        products.forEach((product) => {
            const newListItem = document.createElement("li");
            newListItem.style.whiteSpace = "pre-line";
            newListItem.textContent = `${product.id}. ${product.title}\nHarga: $${product.price}`;
            daftarProduk?.appendChild(newListItem);
        });
    }

    // Ambil Data API
    async function ambilData(): Promise<void> {
        try {
            // Request API
            const response = await fetch("https://dummyjson.com/products");
            // Validasi Error
            if (!response.ok) {
                throw new Error("Gagal mengambil data");
            }

            // Dapatkan data response berupa JSON
            const data: ProductResponse = await response.json();

            // Panggil function render data
            renderData(data.products);

            // Update status berhasil
            if (status) {
                status.textContent = `Berhasil mengambil data dari API ${data.products.length} Produk`;
            }
        } catch (error) {
            // Update status gagal
            if (status) {
                status.textContent = "Gagal mengambil data";
            }
            // Tampilkan error pada console
            console.error(`Terjadi error: ${error}`);
        }
    }

    // Event
    btnLoad.addEventListener("click", () => {
        ambilData();
    });
} else {
    console.info("Ada DOM yang tidak lengkap");
}

