function cekStok() {
    return new Promise((resolve, reject) => {
        const stokTersedia = false;
        // TODO 1: Periksa stok
        if (stokTersedia) {
            reject("Pesanan ditolak, stok tidak tersedia");
        }
        else {
            resolve("Pesanan berhasil diproses!");
        }
    });
}
async function pesanProduk() {
    try {
        const pesan = await cekStok();
        console.log(pesan);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
    }
}
void pesanProduk();
export {};
//# sourceMappingURL=stage17.test.js.map