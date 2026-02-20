//get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCountSpan = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const progressContainer = document.querySelector(".progress-container");
const teamKeys = ["water", "zero", "power"];

const teamConfig = {
  water: {
    segment: document.getElementById("waterSegment"),
    countSpan: document.getElementById("waterCount"),
    attendeesList: document.getElementById("waterAttendees"),
  },
  zero: {
    segment: document.getElementById("zeroSegment"),
    countSpan: document.getElementById("zeroCount"),
    attendeesList: document.getElementById("zeroAttendees"),
  },
  power: {
    segment: document.getElementById("powerSegment"),
    countSpan: document.getElementById("powerCount"),
    attendeesList: document.getElementById("powerAttendees"),
  },
};

let count = 0;
const maxCount = 50;
let isGoalCelebrated = false;
const storageKey = "checkInAttendanceData";
const teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};
const teamAttendees = {
  water: [],
  zero: [],
  power: [],
};

function getTeamDisplayName(teamKey) {
  if (teamKey === "water") {
    return "Team Water Wise";
  }

  if (teamKey === "zero") {
    return "Team Net Zero";
  }

  return "Team Renewables";
}

function getWinningTeams() {
  let highestCount = 0;

  teamKeys.forEach(function (team) {
    if (teamCounts[team] > highestCount) {
      highestCount = teamCounts[team];
    }
  });

  return teamKeys.filter(function (team) {
    return teamCounts[team] === highestCount;
  });
}

function renderTeamAttendees(listElement, attendees) {
  listElement.innerHTML = "";

  if (attendees.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No attendees yet";
    listElement.appendChild(emptyItem);
    return;
  }

  attendees.forEach(function (attendeeName) {
    const attendeeItem = document.createElement("li");
    attendeeItem.textContent = attendeeName;
    listElement.appendChild(attendeeItem);
  });
}

function updateAttendanceUI() {
  attendeeCountSpan.textContent = count;

  teamKeys.forEach(function (team) {
    teamConfig[team].countSpan.textContent = teamCounts[team];
    renderTeamAttendees(teamConfig[team].attendeesList, teamAttendees[team]);
  });

  const progressPercent = Math.min(Math.round((count / maxCount) * 100), 100);
  const percentage = `${progressPercent}%`;
  progressBar.style.width = percentage;

  teamKeys.forEach(function (team) {
    if (count === 0) {
      teamConfig[team].segment.style.width = "0%";
      return;
    }

    teamConfig[team].segment.style.width =
      `${(teamCounts[team] / count) * 100}%`;
  });

  console.log(`Progress: ${percentage}`);
}

function saveAttendanceData() {
  const attendanceData = {
    count: count,
    teamCounts: teamCounts,
    teamAttendees: teamAttendees,
  };

  localStorage.setItem(storageKey, JSON.stringify(attendanceData));
}

function loadAttendanceData() {
  const savedData = localStorage.getItem(storageKey);

  if (!savedData) {
    return;
  }

  const parsedData = JSON.parse(savedData);

  if (typeof parsedData.count === "number") {
    count = parsedData.count;
  }

  if (parsedData.teamCounts && typeof parsedData.teamCounts === "object") {
    teamKeys.forEach(function (team) {
      if (typeof parsedData.teamCounts[team] === "number") {
        teamCounts[team] = parsedData.teamCounts[team];
      }
    });
  }

  if (
    parsedData.teamAttendees &&
    typeof parsedData.teamAttendees === "object"
  ) {
    teamKeys.forEach(function (team) {
      if (Array.isArray(parsedData.teamAttendees[team])) {
        teamAttendees[team] = parsedData.teamAttendees[team];
      }
    });
  }
}

function celebrateGoalReached() {
  if (isGoalCelebrated) {
    return;
  }

  isGoalCelebrated = true;
  document.body.classList.add("celebrate");
  progressContainer.classList.add("celebrate");

  const winningTeams = getWinningTeams();
  const winningTeamNames = winningTeams.map(function (team) {
    return getTeamDisplayName(team);
  });
  const winnerMessage =
    winningTeamNames.length === 1
      ? `Winning team: ${winningTeamNames[0]}`
      : `Winning teams: ${winningTeamNames.join(" and ")}`;

  greeting.textContent = `🎉 Goal reached! 50 attendees checked in! ${winnerMessage}! 🎉`;
  greeting.classList.add("celebration-message");
  greeting.style.display = "block";

  setTimeout(function () {
    document.body.classList.remove("celebrate");
    progressContainer.classList.remove("celebrate");
  }, 2500);
}

loadAttendanceData();
updateAttendanceUI();

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
  teamAttendees[team].push(name);
  console.log("Total Check-Ins: " + count);

  //update counts and progress on page
  updateAttendanceUI();
  saveAttendanceData();

  if (count === maxCount) {
    celebrateGoalReached();
  }

  const message = `Welcome, 🎉${name}🎉! You have checked in with the ${teamName} team.`;
  alert(message);

  //reset form
  form.reset();
});
