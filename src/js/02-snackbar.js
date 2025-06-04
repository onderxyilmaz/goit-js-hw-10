import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Form elementini seç
const form = document.querySelector(".form");

// Form gönderildiğinde çalışacak fonksiyon
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Form verilerini al
  const delay = parseInt(form.elements.delay.value);
  const state = form.elements.state.value;

  // Promise oluştur
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === "fulfilled") {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  // Promise'i işle
  promise
    .then((delay) => {
      // Başarılı durumda
      iziToast.success({
        title: "Success",
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: "topRight",
        timeout: 5000,
        closeOnClick: true,
        backgroundColor: "#4CAF50",
        theme: "dark",
      });
    })
    .catch((delay) => {
      // Başarısız durumda
      iziToast.error({
        title: "Error",
        message: `❌ Rejected promise in ${delay}ms`,
        position: "topRight",
        timeout: 5000,
        closeOnClick: true,
        backgroundColor: "#FF5252",
        theme: "dark",
      });
    });

  // Formu sıfırla
  form.reset();
});
