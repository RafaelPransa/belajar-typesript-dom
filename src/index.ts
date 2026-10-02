// Soal #1 Get Element
const judul = document.querySelector<HTMLHeadingElement>("#judul");
const input = document.querySelector<HTMLInputElement>("#nama");
const btn = document.querySelector<HTMLButtonElement>("#btn");
const paragraph = document.querySelector<HTMLParagraphElement>("#hasil");
const reset = document.querySelector<HTMLButtonElement>("#reset");

// Soal #2 Button Event

if (btn instanceof HTMLButtonElement && paragraph instanceof HTMLParagraphElement && input instanceof HTMLInputElement && judul instanceof HTMLHeadingElement) {
    btn.addEventListener("click", (event) => {

        // Soal #5 Event Type
        console.info("X:", event.clientX);
        console.info("Y:", event.clientY);

        // Soal #3 Empty Input
        const nama = input.value.trim();

        if (nama !== "") {
            paragraph.textContent = `Halo ${nama}`;

            // Soal #4 Manipulasi judul
            judul.textContent = `Halo ${nama}!`;
        } else {
            paragraph.textContent = `Input Tidak Boleh Kosong`;
        }
    });

    // Soal Bonus
    if (reset) {
        reset.addEventListener("click", () => {
            input.value = "";
            paragraph.textContent = "";
            judul.textContent = "Belajar TypeScript DOM";

        });
    }
};