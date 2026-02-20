//get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCountSpan = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const waterSegment = document.getElementById("waterSegment");
const zeroSegment = document.getElementById("zeroSegment");
const powerSegment = document.getElementById("powerSegment");

let count = 0;
const maxCount = 50;
const teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};

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
  teamCounts[team] = teamCounts[team] + 1;
  console.log("Total Check-Ins: " + count);

  //update total count on page
  attendeeCountSpan.textContent = count;

  //update progress bar
  const progressPercent = Math.min(Math.round((count / maxCount) * 100), 100);
  const percentage = `${progressPercent}%`;
  progressBar.style.width = percentage;
  waterSegment.style.width = `${(teamCounts.water / count) * 100}%`;
  zeroSegment.style.width = `${(teamCounts.zero / count) * 100}%`;
  powerSegment.style.width = `${(teamCounts.power / count) * 100}%`;
  console.log(`Progress: ${percentage}`);

  //update team counter

  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = teamCounts[team];

  const message = `Welcome, 🎉${name}🎉! You have checked in with the ${teamName} team.`;
  alert(message);

  //reset form
  form.reset();
});
