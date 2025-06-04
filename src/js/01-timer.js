import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Seçiciler
const dateTimePicker = document.getElementById("datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysValue = document.querySelector("[data-days]");
const hoursValue = document.querySelector("[data-hours]");
const minutesValue = document.querySelector("[data-minutes]");
const secondsValue = document.querySelector("[data-seconds]");

// Başlangıçta Start düğmesini devre dışı bırak
startButton.disabled = true;

let userSelectedDate = null;
let countdownInterval = null;

// flatpickr seçenekleri
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      // Geçmiş tarih seçildiğinde uyarı göster
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topCenter",
        backgroundColor: "#FF5252",
        theme: "dark",
        closeOnClick: true,
        timeout: 5000, // 5 saniye sonra otomatik kapanacak
        progressBar: true, // İlerleme çubuğunu göster
        close: false, // Varsayılan kapatma düğmesini devre dışı bırak
        buttons: [
          ["<button>X</button>", function (instance, toast) {
            instance.hide({
              transitionOut: "fadeOutUp",
            }, toast, "buttonClicked");
          }, false, {
            backgroundColor: "#444",
            color: "#fff",
            borderRadius: "3px",
            padding: "5px 10px",
            fontSize: "14px",
            hover: {
              backgroundColor: "#333"
            }
          }]
        ]
      });
      startButton.disabled = true;
    } else {
      // Gelecek tarih seçildiğinde düğmeyi etkinleştir
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};

// flatpickr'ı başlat
flatpickr(dateTimePicker, options);

// Sayıyı iki basamaklı formata dönüştürme fonksiyonu
function addLeadingZero(value) {
  return value.toString().padStart(2, "0");
}

// Kalan süreyi hesaplama fonksiyonu
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Zamanlayıcıyı güncelleme fonksiyonu
function updateTimer() {
  const currentTime = new Date();
  const timeDifference = userSelectedDate - currentTime;

  if (timeDifference <= 0) {
    clearInterval(countdownInterval);
    daysValue.textContent = "00";
    hoursValue.textContent = "00";
    minutesValue.textContent = "00";
    secondsValue.textContent = "00";
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeDifference);

  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}

// Start düğmesine tıklandığında zamanlayıcıyı başlat
startButton.addEventListener("click", () => {
  if (!userSelectedDate) return;

  startButton.disabled = true;
  dateTimePicker.disabled = true;

  // Zamanlayıcıyı başlat
  updateTimer();
  countdownInterval = setInterval(updateTimer, 1000);
});
