//get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

let count = 0;
const maxCount = 50; 

//handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); 

  //get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  //increment count
  count++; 
  console.log("Total Check-Ins: " + count);

  //update progress bar
  const percentage = Math.round ((count / maxCount) * 100) + "%";
  console.log(`Progress: $${percentage}`);

  //update team counter

  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;
  
  const message = `Welcome, 🎉${name}🎉! You have checked in with the ${teamName} team.`;
  alert(message);
  
  //reset form
  form.reset();
});