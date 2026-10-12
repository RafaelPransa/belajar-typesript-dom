function cekStok(): Promise<string> {
    return new Promise((resolve, reject) => {
        const stokTersedia = false;
        // TODO 1: Periksa stok
        if (stokTersedia) {
            resolve("Stok tersedia");
        } else {
            reject(new Error("Stok habis"));
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