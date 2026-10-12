function cekStok(): Promise<string> {
    return new Promise((resolve, reject) => {
        const stokTersedia = false;
        // TODO 1: Periksa stok
        if (stokTersedia) {
            reject("Pesanan ditolak, stok tidak tersedia");
        } else {
            resolve("Pesanan berhasil diproses!");
        }
    });
}

async function pesanProduk(): Promise<void> {
    try {
        const pesan = await cekStok();
        console.log(pesan);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        }
    }
}

void pesanProduk();