// ==========================================
// 1. Bagian Greeting & Reset
// ==========================================
const judul = document.querySelector("#judul");
const input = document.querySelector("#nama");
const btn = document.querySelector("#btn");
const paragraph = document.querySelector("#hasil");
const reset = document.querySelector("#reset");

// Event tombol Tampilkan
if (btn instanceof HTMLButtonElement && paragraph instanceof HTMLParagraphElement && input instanceof HTMLInputElement && judul instanceof HTMLHeadingElement) {
    btn.addEventListener("click", (event) => {
        console.info("X:", event.clientX, "Y:", event.clientY);

        const nama = input.value.trim();
        if (nama !== "") {
            paragraph.textContent = `Halo ${nama}`;
            judul.textContent = `Halo ${nama}!`;
        } else {
            paragraph.textContent = "Input Tidak Boleh Kosong";
        }
    });
}

// Event tombol Reset (Dipisah mandiri)
if (reset instanceof HTMLButtonElement && input instanceof HTMLInputElement && paragraph instanceof HTMLParagraphElement && judul instanceof HTMLHeadingElement) {
    reset.addEventListener("click", () => {
        input.value = "";
        paragraph.textContent = "";
        judul.textContent = "Belajar TypeScript DOM";
    });
}

// ==========================================
// 2. Bagian Form Login Akademik
// ==========================================
const loginForm = document.querySelector("#loginForm");
const inputEmail = document.querySelector("#email");
const inputPassword = document.querySelector("#password");
const errorOutput = document.querySelector("#error");
const successOutput = document.querySelector("#success");
const loginButton = document.querySelector("#loginButton");

if (
    loginForm instanceof HTMLFormElement &&
    inputEmail instanceof HTMLInputElement &&
    inputPassword instanceof HTMLInputElement &&
    errorOutput instanceof HTMLParagraphElement &&
    successOutput instanceof HTMLParagraphElement &&
    loginButton instanceof HTMLButtonElement
) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        errorOutput.textContent = "";
        successOutput.textContent = "";

        const email = inputEmail.value.trim();
        const password = inputPassword.value;

        // Validasi Email
        if (email === "") {
            errorOutput.textContent = "Email Wajib Diisi";
            return;
        }

        if (!inputEmail.checkValidity()) {
            errorOutput.textContent = "Format Email Tidak Valid";
            return;
        }

        // Validasi Password
        if (password.length === 0) {
            errorOutput.textContent = "Password Wajib Diisi!";
            return;
        }

        if (password.length < 8) {
            errorOutput.textContent = "Password Minimal 8 Karakter";
            return;
        }

        // Sukses
        successOutput.textContent = "Login Berhasil";
        loginButton.disabled = true;
    });
} else {
    console.error("Elemen form login tidak lengkap di DOM");
}

