// Requirement 1 - Ambil data dari html menggunakan querySelector<T>
const btnLoad = document.querySelector<HTMLButtonElement>("#btnLoad");
const status = document.querySelector<HTMLParagraphElement>("#status");
const daftarProduk = document.querySelector<HTMLUListElement>("#daftarProduk");

if (btnLoad instanceof HTMLButtonElement && status instanceof HTMLParagraphElement && daftarProduk instanceof HTMLUListElement) {
    // Interface
    interface Product {
        id: number;
        title: string;
        price: number;
    }

    const daftarProdukData: Product[] = [];

    btnLoad.addEventListener("click", (event) => {
        event.preventDefault();

        async function ambilData(): Promise<void> {
            try {
                // Request API
                const response = await fetch("https://dummyjson.com/products");
                // Validasi Error
                if (!response.ok) {
                    throw new Error("Gagal mengambil data");
                }

                const data = await response.json();
                console.info(data);

                const product: Product = {
                    id: data.id,
                    title: data.title,
                    price: data.price
                }

                // Tampilkan data
                function renderData(produk: Product): void {
                    data.products.forEach((product: Product) => {
                        const newListItem = document.createElement("li");
                        newListItem.style.whiteSpace = "pre-line";
                        newListItem.textContent = `${product.id}. ${product.title}\nHarga: $${product.price}`;
                        daftarProduk?.appendChild(newListItem);
                    })
                }
                renderData(product);
            } catch (error) {
                throw new Error(`${Error}: Gagal mengambil data`)
            }
        }
        ambilData();
    });
} else {
    console.info("Ada DOM yang tidak lengkap");
}

