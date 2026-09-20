const track = document.querySelector(".track");
const slides = document.querySelectorAll(".slide");

const visibles = 3;
let index = 0;

for (let i = 0; i < visibles; i++) {
    const clone = slides[i].cloneNode(true);
    track.appendChild(clone);
}

const totalSlides = document.querySelectorAll(".slide");

function mover() {
    index++;
    track.style.transition = "transform 0.8s ease";
    track.style.transform =
        `translateX(-${index * (100 / visibles)}%)`;
}

setInterval(mover, 3000);

track.addEventListener("transitionend", () => {
    if (index >= slides.length) {
        track.style.transition = "none";
        index = 0;
        track.style.transform = "translateX(0)";
    }
});