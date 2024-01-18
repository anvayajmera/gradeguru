//extremely important variables for later
var isLoggedIn; //used to check if a user is logged in or not; this way, the program knows if data should be stored.
var currentUserId; //used to give a current ID for the logged in user; used for personalization. 


//function to go between Log In and Create Account
function toggleSection() {
  const loginSection = document.getElementById("loginSection");
  const createAccountSection = document.getElementById("createAccountSection");
  const returnMessageSection = document.getElementById("returnMessageSection");

  loginSection.classList.toggle("hidden");
  createAccountSection.classList.toggle("hidden");

}

//function to create account and see if the password and username are as good as they need to be
function createAccount(event) {
  event.preventDefault();  // Prevents the default form submission behavior

  // Get values from input fields
  const newUsername = document.getElementById("newUsername").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const errorMessage = document.getElementById("errorMessage");

  // Check if passwords match
  if (newPassword !== confirmPassword) {
    errorMessage.textContent = "Passwords do not match!";  // Display error message
    return;  // Exit the function early
  }

  // Check if the username is already taken
  if (localStorage.getItem(newUsername)) {
    errorMessage.textContent = "Username has already been taken!";  // Display error message
    return;  // Exit the function early
  }

  // Check password length and absence of spaces
  if (newPassword.length < 8 || newPassword.includes(' ')) {
    errorMessage.textContent = "Password must be at least 8 characters long and should not contain spaces!";
    return;  // Exit the function early
  }

  // Check username for spaces
  if (newUsername.includes(' ')) {
    errorMessage.textContent = "Username should not contain spaces!";
    return;  // Exit the function early
  }

  // Clear previous error messages
  errorMessage.textContent = "";

  // Create user object
  const user = {
    username: newUsername,
    password: newPassword,
  };

  // Store user data in localStorage
  localStorage.setItem(newUsername, JSON.stringify(user));

  // Clear form fields
  document.getElementById("newUsername").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmPassword").value = "";

  // Show success message and return to login page
  showReturnMessage(errorMessage);
}

//function to return a message that a new account was made
function showReturnMessage(errorMessage) {
  let countdown = 3;

  function updateCountdown() {
    errorMessage.textContent = `Success! Returning to login page in ${countdown}...`;
    countdown--;

    if (countdown >= 0) {
      // Continue the countdown
      setTimeout(updateCountdown, 1000);
    } else {
      // Reset the error message for future use
      errorMessage.textContent = "";

      // Redirect to the login page after the countdown
      redirectToLoginPage(); // Use the correct function name here
    }
  }

  // Start the countdown
  updateCountdown();
}




















//function to go back to the login page after
function redirectToLoginPage() {
  console.log("Redirecting to the login page...");
  const loginSection = document.getElementById("loginSection");
  const createAccountSection = document.getElementById("createAccountSection");

  loginSection.classList.remove("hidden");
  createAccountSection.classList.add("hidden");
}


//function to process the entire log in feature (very important)
function login(event) {
  event.preventDefault();

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  console.log("An attempt to log in with username:", username, " has occurred.");

  // Retrieve user data from localStorage
  const userData = localStorage.getItem(username);

  if (userData) {
    const user = JSON.parse(userData);

    // Check if entered password matches stored password
    if (password === user.password) {
      console.log("Login successful.");
      alert("Login successful. Please click OK to see any saved data.");
      currentUserId = username;
  
      redirectToLoginPage(); // Redirect to the login page
      // Add your logic for successful login, e.g., update UI or redirect to another page
      document.querySelector('#loginSection').style.display = 'none';
      document.querySelector('#createAccountSection').style.display = 'none';
  
      const centerAfterLogin = document.querySelector('.centerAfterLogin');
      centerAfterLogin.style.display = 'block';
  
      // Shows a welcome sign in the HTML
      document.getElementById('loginWelcomeTitle').innerHTML = 'Welcome, ' + username + '!';
      document.getElementById('loginDisplayTitle').innerHTML = "You can find your saved data here.";
  
      // Add an event listener to the refresh button
      const refreshButton = document.getElementById('refreshButton');
      refreshButton.addEventListener('click', () => {
          // Retrieve all keys in local storage that match the user's pattern
          const userKeys = Object.keys(localStorage).filter(key => key.startsWith("user_" + currentUserId + "_data"));

          document.getElementById('logoutButton').addEventListener('click', logout);

          // Sort userKeys to display the data in order
          userKeys.sort().reverse();

          // Display all data for the user
          const infoForLoginParagraph = document.getElementById('infoForLogin');
          infoForLoginParagraph.innerHTML = ""; // Clear existing content

          userKeys.forEach((key, index) => {
              const data = JSON.parse(localStorage.getItem(key));

              // Check if savedDate is a valid date
              const savedDate = new Date(data.savedDate);
              const isValidDate = !isNaN(savedDate.getTime());

              if (!isValidDate) {
                  // Handle the case where the date is invalid
                  console.warn("Invalid date found in data:", data);
                  return;
              }

              const dataItem = document.createElement('div');
              dataItem.classList.add('data-item');

              // Format the information in a structured way
              dataItem.innerHTML = `
                  <h2>${savedDate.toLocaleDateString()}</h2>
                  <p class="data-point"><span>Marking Period Count:</span> ${data.semesterNum}</p>
                  <p class="data-point"><span>Unweighted GPA:</span> ${data.unweightedGPA}</p>
                  <p class="data-point"><span>Weighted GPA:</span> ${data.weightedGPA}</p>
              `;

              infoForLoginParagraph.appendChild(dataItem);
          });
      });
  
      const deleteDataButton = document.getElementById('deleteDataButton');
      deleteDataButton.addEventListener('click', () => {
          // Clear the existing content
          const infoForLoginParagraph = document.getElementById('infoForLogin');
          infoForLoginParagraph.innerHTML = " ";
  
          // Retrieve all keys in local storage that match the user's pattern
          const userKeys = Object.keys(localStorage).filter(key => key.startsWith("user_" + currentUserId + "_data"));
  
          // Delete each key from localStorage
          userKeys.forEach(key => {
              localStorage.removeItem(key);
          });
      });
  
      // Trigger the refresh initially
      refreshButton.click();
  
      isLoggedIn = true;
  }
  else {
      console.log("Incorrect username or password.");
      alert("Incorrect username or password.");

      isLoggedIn = false;

    }
  } else {
    console.log("Username not found. Please create a new account.");
    alert("Username not found. Please create a new account.");
    isLoggedIn = false;
  }
}



//simple function to log out and make a live countdown
function logout() {
  console.log("Logging out...");
  isLoggedIn = false;
  currentUserId = null;

  const logoutText = document.querySelector('#logoutText');

  // Countdown from 3 to 1
  for (let countdown = 3; countdown > 0; countdown--) {
    setTimeout(() => {
      logoutText.innerHTML = `Logging out in ${countdown}...`;
    }, (3 - countdown) * 1000);
  }

  // After the countdown, this code resets the logout text and redirect to the login page
  setTimeout(() => {
    logoutText.innerHTML = "";
    document.querySelector('#loginSection').style.display = 'block';
    document.querySelector('.centerAfterLogin').style.display = 'none';
  }, 3000);  // 3000 milliseconds = 3 seconds
}


























/**
 * GPA calculator code.
 * 
 * Allows user to input class info like name, grade, credits. 
 * Calculates GPA based on grade point values for different grades.
 * Displays classes entered and calculated GPA.
 * Handles weighted GPA for Honors and AP classes.
*/

// Initial variables to get references to HTML elements
const form = document.getElementById('gpa-form');
const tableBody = document.querySelector('#classes tbody');

const gpaOutput = document.getElementById('gpa');
const unweightedGPAOutput = document.getElementById('unweighted-gpa');

// Initialize GPA outputs
gpaOutput.textContent = '-';
unweightedGPAOutput.textContent = '-';


//Define grade values for different letter grades and course types
const gradeValues = {
  'A+': { 'AP': 5.33, 'Honors': 5.00, 'Regular': 4.33 },
  'A': { 'AP': 5.00, 'Honors': 4.67, 'Regular': 4.00 },
  'A-': { 'AP': 4.67, 'Honors': 4.33, 'Regular': 3.67 },
  'B+': { 'AP': 4.33, 'Honors': 4.00, 'Regular': 3.33 },
  'B': { 'AP': 4.00, 'Honors': 3.67, 'Regular': 3.00 },
  'B-': { 'AP': 3.67, 'Honors': 3.33, 'Regular': 2.67 },
  'C+': { 'AP': 3.33, 'Honors': 3.00, 'Regular': 2.33 },
  'C': { 'AP': 3.00, 'Honors': 2.67, 'Regular': 2.00 },
  'C-': { 'AP': 2.67, 'Honors': 2.33, 'Regular': 1.67 },
  'D+': { 'AP': 2.33, 'Honors': 2.00, 'Regular': 1.33 },
  'D': { 'AP': 2.00, 'Honors': 1.67, 'Regular': 1.00 },
  'D-': { 'AP': 1.67, 'Honors': 1.34, 'Regular': 0.67 },
  'U': { 'AP': 0.00, 'Honors': 0.00, 'Regular': 0.00 }
}


// Initialize variables to track total credits and points
let totalCredits = 0;
let totalPoints = 0;


// Add event listener to form for submitting class details
form.addEventListener('submit', e => {
  e.preventDefault();

  // Extract class details from form inputs
  const name = form.elements['class-name'].value;
  const letterGrade = form.elements['grade'].options[form.elements['grade'].selectedIndex].text;
  const grade = parseFloat(form.elements['grade'].value); // Parse grade as a float
  const credits = parseFloat(form.elements['credits'].value); // Parse credits as a float
  const type = form.elements['class-type'].value;

  // Add class to the table
  addClass(name, letterGrade, credits, type, grade);

  // Reset the form for the next entry
  //form.reset();
  //DECIDED TO COMMENT THIS OUT BECAUSE THE USER SHOULD BE IN MORE CONTROL OF WHAT DATA IS KEPT IN THE INPUT
});



// Function to add a class to the table
function addClass(name, letterGrade, credits, type, grade) {
  // Determine the table to add the class to
  let currentSemesterTable = document.querySelector('#newMPs table:last-of-type tbody');

  if (!currentSemesterTable) {
    // No semester table found, fall back to the original table
    currentSemesterTable = tableBody;
  }

  // Create table row and cells (will be useful)
  const row = document.createElement('tr');
  const nameCell = document.createElement('td');
  const letterCell = document.createElement('td');
  const creditsCell = document.createElement('td');
  const typeCell = document.createElement('td');
  const gradeCell = document.createElement('td');

  
  // Set cell content
  nameCell.textContent = name;
  letterCell.textContent = letterGrade;
  creditsCell.textContent = credits;
  typeCell.textContent = type;

    // Adjust grade for Honors and AP classes
  if (typeCell.textContent == 'Honors') {
    const newLetter = letterCell.textContent;
    grade = gradeValues[newLetter]['Honors'];
  }

  if (typeCell.textContent == 'AP') {
    const newLetter = letterCell.textContent;
    grade = gradeValues[newLetter]['AP'];
  }

  gradeCell.textContent = grade.toFixed(2);


  // Append cells to the row and row to the table
  row.appendChild(nameCell);
  row.appendChild(letterCell);
  row.appendChild(creditsCell);
  row.appendChild(typeCell);
  row.appendChild(gradeCell);

  currentSemesterTable.appendChild(row);


  // Update total credits and points, then recalculate GPAs
  const gradeValue = gradeValues[letterGrade][type];
  totalCredits += credits;
  totalPoints += gradeValue * credits;



  calculateGPA();
  calculateUnweightedGPA();
}


// Variables to store calculated GPAs
let calculatedGPA;  
let calculatedUnweightedGPA;



// Function to calculate weighted GPA
//How:
//
function calculateGPA() {
  const gpa = totalPoints / totalCredits;
  if (!isNaN(gpa)) {
    gpaOutput.textContent = gpa.toFixed(2);
  } else {
    gpaOutput.textContent = '-';
  }
}





// Function to calculate unweighted GPA
//How:
//
function calculateUnweightedGPA() {
  // Reset total credits and points for unweighted GPA calculation
  let totalCredits = 0;
  let totalPoints = 0;

  // Include the original semester
  const originalRows = document.querySelectorAll('#classes tbody tr');
  calculateGPAForSemester(originalRows);

  // Include additional semesters
  const semestersContainer = document.getElementById('newMPs');
  const semesterTables = semestersContainer.querySelectorAll('table');

  semesterTables.forEach(table => {
    const rows = table.querySelectorAll('tbody tr');
    calculateGPAForSemester(rows);
  });

   // Function to calculate GPA for a semester
  function calculateGPAForSemester(rows) {
    rows.forEach(row => {
      const credits = parseFloat(row.cells[2].textContent);
      totalCredits += credits;

      const letterGrade = row.cells[1].textContent;

      // Use Regular grade values for unweighted GPA
      const gradeValue = gradeValues[letterGrade]['Regular'];

      totalPoints += gradeValue * credits;
    });
  }

  // Calculate unweighted GPA and update output
  const unweightedGPA = totalPoints / totalCredits;
  if (!isNaN(unweightedGPA)) {
    document.getElementById('unweighted-gpa').textContent = unweightedGPA.toFixed(2);
  } else {
    document.getElementById('unweighted-gpa').textContent = '-';
  }
}





// Initialize semester count (it is 1 because the GPA calculator always starts with 1 semester)
let semesterCount = 1;

// Event listener for when the document is fully loaded
document.addEventListener('DOMContentLoaded', function () {

  // Event listener for adding a new semester
  document.getElementById('add-mp').addEventListener('click', function (e) {
    e.preventDefault();
    addSemester();
  });

   // Function to add a new semester
  function addSemester() {
    semesterCount++;

    // Create a new paragraph for the semester
    const newSemester = document.createElement('p');
    newSemester.classList.add('add-mp-text');
    newSemester.textContent = 'Marking Period ' + semesterCount;

    // Create a new table for the semester
    const newTable = document.createElement('table');
    newTable.id = 'nextClasses';
    newTable.innerHTML = `
        <thead>
            <tr>
                <th>Class Name</th>
                <th>Letter Grade</th>
                <th>Credits</th>
                <th>Course Type</th>
                <th>Grade GPA</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    // Create a delete semester button
    const deleteButton = document.createElement('button');
    deleteButton.id = 'delete-semester';
    deleteButton.textContent = 'Delete Marking Period';
    deleteButton.addEventListener('click', function () {
      deleteSemester(newSemester, deleteButton, newTable);
    });

    // Append the new paragraph, delete button, and table to the #newMPs container
    document.getElementById('newMPs').appendChild(newSemester);
    document.getElementById('newMPs').appendChild(deleteButton);
    document.getElementById('newMPs').appendChild(newTable);

    // Update numbering for other semesters
    updateSemesterNumbering();
  }




 // Function to delete a semester
  function deleteSemester(semesterParagraph, deleteButton, semesterTable) {
    // Get the rows of the semester that is being deleted
    const rows = semesterTable.querySelectorAll('tbody tr');
  
    // Remove the semester paragraph, delete button, and table
    semesterParagraph.remove();
    deleteButton.remove();
    semesterTable.remove();
  
    // Subtract the points and credits from the deleted semester
    rows.forEach(row => {
      const credits = parseFloat(row.cells[2].textContent);
      const letterGrade = row.cells[1].textContent;
      const gradeValue = gradeValues[letterGrade]['Regular'];
      totalCredits -= credits;
      totalPoints -= gradeValue * credits;
    });
  
    // Recalculate the GPA after updating points and credits
    calculateUnweightedGPA();
    updateSemesterNumbering();
    calculateGPA();
  }



  // Function to update semester numbering
  function updateSemesterNumbering() {
    const semesterParagraphs = document.querySelectorAll('.add-mp-text');
    semesterParagraphs.forEach((paragraph, index) => {
      paragraph.textContent = 'Marking Period ' + (index + 1);
    });
  }
});






// Initialize variable "mainDeleteButton"
const mainDeleteButton = document.getElementById('delete');

// Event listener for the main delete button
mainDeleteButton.addEventListener('click', () => {
  totalCredits = 0;
  totalPoints = 0;
  semesterCount = 1;

    // Clear the main table and reset GPA outputs
  tableBody.innerHTML = '';
  gpaOutput.textContent = '-';
  unweightedGPAOutput.textContent = '-';

  // Remove all added semesters and tables
  const semestersContainer = document.getElementById('newMPs');
  semestersContainer.innerHTML = '';

  // Recalculate the GPAs
  calculateUnweightedGPA();
  calculateGPA();

});









 


// Get reference to the save data button
const saveDataButton = document.getElementById('save-data');

// Event listener for the save data button
saveDataButton.addEventListener('click', () => {
  if (isLoggedIn) {
    // User is logged in, save data to the specific user's account
    saveDataForLoggedInUser();
  } else {
    // User is not logged in, show "plz log in" alert
    alert("Please log in to save your data. \nThere is a Log In tab in the top right corner of the page.");
  }
});


// Function to save data for a logged-in user
function saveDataForLoggedInUser() {
    console.log("Starting to save data.... (beginning)");

    // Get the current user's ID
    const userId = currentUserId;

     // Generate a unique data key for the user
    const userDataKey = getUniqueDataKey(userId);

    // Create a new set of data
    const newData = {
        semesterNum: document.querySelectorAll('.add-mp-text').length,
        weightedGPA: parseFloat(gpaOutput.textContent) || 0,
        unweightedGPA: parseFloat(unweightedGPAOutput.textContent) || 0,
        savedDate: new Date().toISOString(), // Set the current date in ISO format
    };

    // Save the new data to localStorage
    localStorage.setItem(userDataKey, JSON.stringify(newData));

    // Show success alert/message
    alert("Data saved successfully!");
    console.log("Saved data.... (end)");
}


// Function to generate a unique data key for a user
function getUniqueDataKey(userId) {
  let count = 1;
  let uniqueKey = `user_${userId}_data`;

  // Check if the key already exists, and increment count until a unique key is found
  while (localStorage.getItem(uniqueKey)) {
    count++;
    uniqueKey = `user_${userId}_data_${count}`;
  }

  return uniqueKey;
}





//Calculating the weighted and unweighted GPA notes and steps:


// Step 1: Initialize variables and references to HTML elements
// - Get references to form, table, and output elements
// - Initialize placeholders for GPA outputs

// Step 2: Define grade values for different letter grades and course types
// - Create a mapping of letter grades to corresponding GPA values for Regular, Honors, and AP courses

// Step 3: Add event listener to the form for submitting class details
// - Listen for form submissions to capture class details for calculation

// Step 4: Extract class details from form inputs
// - Retrieve class name, letter grade, credits, type, and grade from form inputs

// Step 5: Add class to the table
// - Create a new row in the table with class details
// - Adjust grade for Honors and AP classes based on the grade values

// Step 6: Update total credits and points, then recalculate GPAs
// - Update the cumulative credits and points based on the added class
// - Recalculate both weighted and unweighted GPAs

// Step 7: Calculate weighted GPA
// - Divide total points by total credits to get the weighted GPA
// - Update the weighted GPA output element

// Step 8: Calculate unweighted GPA
// - Iterate through semesters and classes to calculate total points and credits for unweighted GPA
// - Divide total points by total credits to get the unweighted GPA
// - Update the unweighted GPA output element

// Step 9: Handle adding and deleting semesters
// - Add functionality to add and delete semesters with associated classes
// - Update semester numbering and recalculate GPAs accordingly

// Step 10: Save data for logged-in users
// - Save the user's semester data, including GPAs and other information, to localStorage
// - Generate a unique data key for each user

// Step 11: Display alerts for user interaction
// - Show alerts for login prompts, successful data saving, and other user interactions

// Step 12: Main delete button functionality
// - Reset total credits, points, and semester count when deleting all data
// - Clear tables and update GPA outputs accordingly