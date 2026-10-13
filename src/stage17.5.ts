async function denganRetry<T>(
    operasi: () => Promise<T>,
    maksimalPercobaan: number
): Promise<T> {
    for (let percobaan = 1; percobaan <= maksimalPercobaan; percobaan++) {
        try {
            return await operasi();
        } catch (error: unknown) {
            const pesan = error instanceof Error ? error.message : String(error);
            console.error(`Percobaan ke ${percobaan} gagal: ${pesan}`);

            if (percobaan === maksimalPercobaan) {
                throw error;
            }
        }
    }
    throw new Error("Operasi gagal");
}

async function ambilProduk(): Promise<string> {
    console.log("Mengambil data produk...");
    throw new Error("Server sedang bermasalah");
}

async function ambilData(): Promise<void> {
    try {
        const produk = await denganRetry(ambilProduk, 3);
        console.log(produk)
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Gagal mengambil produk:", error.message)
        }
    }
}

void ambilData();