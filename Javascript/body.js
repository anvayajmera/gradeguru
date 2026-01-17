function showSection(sectionId, title, subtitle) {
  // Hide all views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });

  // Show requested view
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.add('active');
  }

  // Header text
  const header = document.getElementById('header');
  if (header) {
    header.classList.add('active');
  }

  document.getElementById('headerTitle').textContent = title;
  document.getElementById('contentText').textContent = subtitle;

  // Scroll reset for mobile
  window.scrollTo(0, 0);
}

// Function to set the default section when the page loads

// Function to show the GPA calculator section
function showCalculator() {
  showSection('calculator-gpa', 'GPA Calculator', 'Effortlessly calculate your GPA. \n To get started, enter your class information, and click "Add Class" to add it to the table.');
}


window.addEventListener("DOMContentLoaded", () => {
    showSection(
        "calculator-gpa",
        "GPA Calculator",
        "Calculate your weighted and unweighted GPA."
    );
});







