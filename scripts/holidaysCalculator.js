const form = document.getElementById('holidayForm');
const employmentType = document.getElementById('employmentType');
const hoursInputContainer = document.getElementById('hoursInputContainer');
const hoursWorked = document.getElementById('hoursWorked');
const result = document.getElementById('result');

function resetResult() {
  result.innerHTML = '';
  result.style.display = 'none';
}

employmentType.addEventListener('change', function () {
  const isPartTime = this.value === 'partTime';
  hoursInputContainer.style.display = isPartTime ? 'block' : 'none';
  hoursWorked.required = isPartTime;
  resetResult(); // Reset the result when employment type changes
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  console.log('Form submitted. Employment type:', employmentType.value);
  let holidayHours;
  let holidayDays;

  if (employmentType.value === 'fullTime') {
    console.log('Calculating for full-time');
    holidayHours = (28 / 12) * 7.5;
    holidayDays = 28 / 12;
  } else {
    console.log('Calculating for part-time');
    const monthlyHours = parseFloat(hoursWorked.value);
    if (isNaN(monthlyHours) || monthlyHours <= 0) {
      alert("Please enter a valid number of hours worked (greater than 0).");
      return;
    }
    holidayHours = (28 / 52) * (monthlyHours / 4.33);
    holidayDays = holidayHours / 7.5;
  }

  console.log('Calculation complete. Hours:', holidayHours, 'Days:', holidayDays);

  result.innerHTML = `
    <p>Holiday accrued this month:</p>
    <p>Hours: ${holidayHours.toFixed(2)}</p>
    <p>Days: ${holidayDays.toFixed(2)}</p>
  `;
  result.style.display = 'block';
  console.log('Result displayed');
});

// Update dark mode toggle functionality
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', function () {
  document.documentElement.classList.toggle('dark-mode');
  this.textContent = document.documentElement.classList.contains('dark-mode') ? '☀️' : '🌓';
});

// Set initial dark mode state
document.addEventListener('DOMContentLoaded', function() {
  resetResult();
  darkModeToggle.textContent = '☀️';
  hoursWorked.required = false; // Initially set to false for full-time
});
