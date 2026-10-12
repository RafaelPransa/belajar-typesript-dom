function hitungTotal(): Promise<number> {
    return Promise.resolve(150_000);
}

hitungTotal()
    .then((harga) => {
        console.log(`Harga awal: ${harga}`);
        return harga * 0.8;
    })
    .then((hargaDiskon) => {
        console.log(`Harga setelah diskon: ${hargaDiskon}`);
        return hargaDiskon + 10_000;
    })
    .then((totalBayar) => {
        console.log(`Total yang harus dibayar: ${totalBayar}`);
    })
    .catch((error: unknown) => {
        if (error instanceof Error) {
            console.error(`Terjadi kesalahan ${error.message}`);
        } else {
            console.error(`Terjadi kesalahan ${error}`)
        }
    });