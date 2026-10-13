function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}

function tunggu(
    ms: number,
    signal: AbortSignal
): Promise<void> {
    return new Promise((resolve, reject) => {
        if (signal.aborted) {
            reject(new Error("Request dibatalkan"));
            return;
        }

        const timerId = setTimeout(() => {
            signal.removeEventListener("abort", batalkan);
            resolve();
        }, ms);

        function batalkan(): void {
            clearTimeout(timerId);
            reject(new Error("Request dibatalkan"));
        }
        signal.addEventListener("abort", batalkan, { once: true });
    })
}

async function ambilProdukDenganRetry(
    signal: AbortSignal
): Promise<void> {
    const maksimalPercobaan = 3;
    const timeoutMs = 3000;
    const jedaAwalMs = 500;

    for (
        let percobaan = 1;
        percobaan <= maksimalPercobaan;
        percobaan++
    ) {
        if (signal.aborted) {
            throw new Error("Request dibatalkan");
        };

        const controller = new AbortController();
        let timeoutTerjadi = false;

        const batalkan = (): void => controller.abort();

        signal.addEventListener("abort", batalkan, { once: true });

        // 1. Buat timeout untuk percobaan ini.
        const timerId = setTimeout(() => {
            timeoutTerjadi = true;
            controller.abort();
        }, timeoutMs);
        try {
            // 2. Ambil data menggunakan fetch().
            const response = await fetch("https://dummyjson.com/products/1",
                { signal: controller.signal }
            );
            // 3. Periksa response.ok.
            if (!response.ok) throw new Error(`HTTP error!: ${response.status}`);
            // 4. Tampilkan data jika berhasil.
            const data: unknown = await response.json();
            console.log("Produk berhasil diambil:", data);
            return;
        } catch (error: unknown) {
            // 5. Jika signal dibatalkan, jangan retry.
            if (signal.aborted) throw new Error("Request dibatalkan!");

            const errorAkhir = timeoutTerjadi ? new Error("Request timeout") : error;

            // 6. Jika percobaan terakhir, tampilkan error.
            if (percobaan === maksimalPercobaan) throw error;
            // 7. Selain itu, tunggu dengan exponential backoff.
            const jeda = jedaAwalMs * 2 ** (percobaan - 1);

            console.warn(`Percobaan ${percobaan} gagal. Retry dalam ${jeda} ms`);

            await tunggu(jeda, signal);
        } finally {
            // 8. Bersihkan timer timeout.
            clearTimeout(timerId);
            signal.removeEventListener("abort", batalkan);
        }
    }
}

const controller = new AbortController();
ambilProdukDenganRetry(controller.signal).catch(
    (error: unknown) => {
        console.error(getErrorMessage(error));
    }
);

// untuk membatalkan request gunakan
// controller.abort();