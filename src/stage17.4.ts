interface Keranjang {
    jumlahProduk: number;
    totalHarga: number;
}

interface Alamat {
    kota: string;
    kodePos: string;
}

function ambilKeranjang(): Promise<Keranjang> {
    return Promise.resolve({
        jumlahProduk: 3,
        totalHarga: 350_000,
    });
}

function ambilAlamat(): Promise<Alamat> {
    return Promise.resolve({
        kota: "Tasikmalaya",
        kodePos: "46115"
    }
    );
}

async function prosesCheckout(): Promise<void> {
    try {
        const [hasilKeranjang, hasilAlamat] = await Promise.all([
            ambilKeranjang(),
            ambilAlamat(),
        ]);

        console.log(`
            Jumlah Produk: ${hasilKeranjang.jumlahProduk}
            Total Harga: ${hasilKeranjang.totalHarga}
            Kota: ${hasilAlamat.kota}
            `)
    } catch (error) {
        // Jika salah satu promise gagal (seperti ambilAlamat), langsung masuk ke sini
        if (error instanceof Error) {
            console.error(`Checkout gagal: ${error.message}`);
        } else {
            console.error(`Terjadi kesalahan yang tidak diketahui ${error}`);
        }
    }
}

void prosesCheckout();