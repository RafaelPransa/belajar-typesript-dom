interface Produk {
    id: number;
    nama: string;
    harga: number
}

interface Kategori {
    id: number;
    nama: string
}

interface ProfilAdmin {
    nama: string;
    role: string
}

function ambilProduk(): Promise<Produk[]> {
    return Promise.resolve([
        {
            id: 1,
            nama: "Keyboard",
            harga: 250_000,
        },
        {
            id: 2,
            nama: "Mouse",
            harga: 100_000,
        }
    ]);
}

function ambilKategori(): Promise<Kategori[]> {
    return Promise.reject(new Error("Gagal memuat kategori"));
}

function ambilProfilAdmin(): Promise<ProfilAdmin> {
    return Promise.resolve({
        nama: "Rafael Pransa",
        role: "Super Admin"
    });
}

async function muatDashboard(): Promise<void> {
    const [hasilProduk, hasilKategori, hasilAdmin] = await Promise.allSettled([
        ambilProduk(),
        ambilKategori(),
        ambilProfilAdmin(),
    ]);

    // type narrowing
    if (hasilProduk.status === "fulfilled") {
        console.log(hasilProduk.value);
    } else {
        console.error("Produk gagal dimuat", hasilProduk.reason);
    }

    if (hasilKategori.status === "fulfilled") {
        console.log(hasilKategori.value);
    } else {
        console.error("Kategori gagal dimuat", hasilKategori.reason);
    }

    if (hasilAdmin.status === "fulfilled") {
        console.log(hasilAdmin.value);
    } else {
        console.error("Profil gagal dimuat", hasilAdmin.reason);
    }
}

void muatDashboard();