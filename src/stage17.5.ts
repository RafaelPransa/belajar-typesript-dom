function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}

function tunggu(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function denganRetry<T>(
    operasi: () => Promise<T>,
    maksimalPercobaan: number,
    jedaAwalMs: number = 500
): Promise<T> {
    if (maksimalPercobaan < 1) {
        throw new Error("Jumlah percobaan harus lebih dari 0");
    }

    for (let percobaan = 1; percobaan <= maksimalPercobaan; percobaan++) {
        try {
            return await operasi();
        } catch (error: unknown) {
            if (percobaan === maksimalPercobaan) {
                throw error;
            }
            const jeda = jedaAwalMs * 2 ** (percobaan - 1);
            console.error(`Percobaan ke ${percobaan} gagal. Coba lagi dalam ${jeda}ms`);
            await tunggu(jeda);
        }
    }
    throw new Error("Operasi gagal");
}

let jumlahPercobaan = 0;

async function ambilProduk(): Promise<string> {
    jumlahPercobaan++;
    console.log(`Mengambil produk, percobaan ke-${jumlahPercobaan}`);
    if (jumlahPercobaan < 2) throw new Error("Server sedang sibuk");
    return "Produk berhasil diambil";
}

async function ambilData(): Promise<void> {
    try {
        const produk = await denganRetry(ambilProduk, 3);
        console.log(produk)
    } catch (error: unknown) {
        console.error(getErrorMessage(error));
    }
}

void ambilData();