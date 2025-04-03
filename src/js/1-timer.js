import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const datePicker = document.getElementById('datetime-picker');
  const startBtn = document.querySelector('[data-start]');
  const daysEl = document.querySelector('[data-days]');
  const hoursEl = document.querySelector('[data-hours]');
  const minutesEl = document.querySelector('[data-minutes]');
  const secondsEl = document.querySelector('[data-seconds]');

  let countdownInterval;
  let selectedDate = null;

  flatpickr(datePicker, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      selectedDate = selectedDates[0];
      if (selectedDate < new Date()) {
        iziToast.error({
          title: 'Error',
          message: 'Please choose a date in the future.',
          position: 'topRight',
        });
        startBtn.disabled = true;
      } else {
        startBtn.disabled = false;
      }
    },
  });

  startBtn.addEventListener('click', () => {
    clearInterval(countdownInterval);

    if (!selectedDate) {
      iziToast.warning({
        title: 'Warning',
        message: 'Please choose a date before starting!',
        position: 'topRight',
      });
      return;
    }

    startBtn.disabled = true;
    datePicker.disabled = true;

    countdownInterval = setInterval(() => {
      const now = new Date();
      const timeLeft = selectedDate - now;

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        iziToast.success({
          title: 'Time is up!',
          message: 'The countdown has ended!',
          position: 'topRight',
        });
        updateTimerDisplay(0, 0, 0, 0);
        datePicker.disabled = false;
        startBtn.disabled = true;
        return;
      }

      const { days, hours, minutes, seconds } = convertMs(timeLeft);
      updateTimerDisplay(days, hours, minutes, seconds);
    }, 1000);
  });

  function convertMs(ms) {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  }

  function updateTimerDisplay(days, hours, minutes, seconds) {
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }
});
