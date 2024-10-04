document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("holidayForm");
  const employmentType = document.getElementById("employmentType");
  const hoursWorked = document.getElementById("hoursWorked");
  const result = document.getElementById("result");
  const hoursAccrued = document.getElementById("hoursAccrued");
  const daysAccrued = document.getElementById("daysAccrued");

  const ACCRUAL_RATE = 0.1207; // 12.07% for part-time workers
  const HOURS_PER_DAY = 7.5; // Standard working day

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const hours = parseFloat(hoursWorked.value);
    const accruedHours = (hours * ACCRUAL_RATE).toFixed(2);
    const accruedDays = (accruedHours / HOURS_PER_DAY).toFixed(2);

    hoursAccrued.textContent = accruedHours;
    daysAccrued.textContent = accruedDays;
    result.style.display = "block";
  });
});
