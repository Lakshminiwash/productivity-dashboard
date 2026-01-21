function main(params) {
  let allelem = document.querySelectorAll("#allelem div");
  let allElems = document.querySelector("#allelem");
  let fullelem = document.querySelectorAll(".fullelem");

  allelem.forEach((data) => {
    let id = data.id;
    data.addEventListener("click", () => {
      fullelem[id].style.display = "block";
      // allElems.style.display = "none";

      window.scrollTo({
        top: 0,
        behavior: "instant", // or "smooth"
      });
    });
  });

  fullelem.forEach((elem) => {
    let id2 = elem.id;
    let btn = elem.children[0].children[1];
    btn.addEventListener("click", () => {
      fullelem[id2].style.display = "none";
      // allElems.style.display = "block";
    });
  });
}
main();

function todolist(params) {
  let submitBtn = document.querySelector(".fullelem .task form button");
  let tasktodo = document.querySelector(".fullelem .task .tasksToDo");
  let inp = document.querySelector(".task .writeTask form input");
  let textarea = document.querySelector(".task .writeTask form textarea");
  let checkbox = document.querySelector(".task .writeTask form .check input");

  var fields = JSON.parse(localStorage.getItem("task")) || [];

  function saveToLocal(params) {
    localStorage.setItem("task", JSON.stringify(fields));
  }

  let sum = "";
  function render() {
    sum = "";
    fields.forEach((elem, idx) => {
      sum += `<div class="tasks" id="${idx}">
              <h1>${elem.input} ${
                elem.imp ? "<span class='imp'>imp</span>" : ""
              }</h1>
              <button>Mark as Completed</button>
            </div>`;
    });
    tasktodo.innerHTML = sum;
  }
  render();

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (inp.value.trim() === "") {
      return;
    }

    let obj = {
      input: inp.value,
      description: textarea.value,
      imp: checkbox.checked,
    };

    fields.push(obj);
    saveToLocal();
    render();

    inp.value = "";
    textarea.value = "";
    checkbox.checked = false;
  });

  tasktodo.addEventListener("click", (e) => {
    // console.log(e.target.parentElement.id);
    if (e.target.localName === "button") {
      let id = e.target.parentElement.id;

      fields.splice(id, 1);
      saveToLocal();
      render();
    }
  });
}
todolist();

function dailyplanner(params) {
  let plan = document.querySelector(".dailyPlan .plan");
  let inp = document.querySelector(".dailyPlan .plan .input");

  var hours = Array.from(
    { length: 18 },
    (_, idx) => `${6 + idx}:00 - ${7 + idx}:00`,
  );

  let val = JSON.parse(localStorage.getItem("value")) || {};

  var hourSum = "";
  hours.forEach((_, id) => {
    var savedData = val[id] || "";

    hourSum += `<div class="input">
  <h3>${6 + id}:00-${7 + id}:00</h3>
  <input id="${id}" type="text" value="${savedData}" placeholder="...">
  </div>`;
  });
  plan.innerHTML = hourSum;

  let inputs = document.querySelectorAll(".plan .input input");

  inputs.forEach((dets) => {
    dets.addEventListener("blur", (elem) => {
      val[elem.target.id] = elem.target.value;

      localStorage.setItem("value", JSON.stringify(val));
    });
  });
}
dailyplanner();

function motivationalQuotes(params) {
  let qoutePara = document.querySelector(".quoteSection .quotes .quot p");
  let qouteAuthor = document.querySelector(".quotes .quot .btn2 button");
  async function getQuotes(params) {
    try {
      const res = await fetch("https://api.quotable.io/random");

      if (!res.ok) {
        throw new Error("Failed to fetch quote");
      }
      let data = await res.json();
      qoutePara.textContent = `${data.content}`;
      qouteAuthor.textContent = `${data.author}`;
    } catch (error) {
      console.log(error);
    }
  }

  getQuotes();
}
motivationalQuotes();

function pomodoroTimer(params) {
  let clock = 25 * 60;
  let timer = document.querySelector(".pomodoro .center h1");
  let startbtn = document.querySelector(
    ".pomodoro .center button:nth-child(1)",
  );
  let pausebtn = document.querySelector(
    ".pomodoro .center button:nth-child(2)",
  );
  let restartbtn = document.querySelector(
    ".pomodoro .center button:nth-child(3)",
  );
  let timeInterval = null;

  function updateTimer(params) {
    let totalMinutes = Math.floor(clock / 60);
    let totalSeconds = clock % 60;

    timer.innerHTML = `${String(totalMinutes).padStart("2", "0")} : ${String(
      totalSeconds,
    ).padStart("2", "0")}`;
  }

  function start(params) {
    clearInterval(timeInterval);
    timeInterval = setInterval(() => {
      if (clock > 0) {
        clock--;
        updateTimer();
      } else {
        clearInterval(timeInterval);
        timer.innerHTML = "25 : 00";
        clock = 25 * 60;
      }
    }, 1000);
  }
  function pause(params) {
    clearInterval(timeInterval);
  }
  function restart(params) {
    clearInterval(timeInterval);
    timer.innerHTML = "25 : 00";
    clock = 25 * 60;
  }
  startbtn.addEventListener("click", start);
  pausebtn.addEventListener("click", pause);
  restartbtn.addEventListener("click", restart);
}
pomodoroTimer();

function weatherUpdate(params) {
  let city = document.querySelector(".weather .day h3");
  let temperature = document.querySelector(".weather .temp h1");
  let mausam = document.querySelector(".weather .temp h2");
  let tempH3 = document.querySelectorAll(".weather .temp h3");

  let heatIndex = tempH3[0];
  let humidity = tempH3[1];
  let windSpeed = tempH3[2];

  async function weatherCondition(city) {
    let apikey = `7c9e714bba4784032383fa614ac47dc2`;
    try {
      let rawData = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`,
      );
      if (!rawData.ok) {
        throw new Error("something went wrong");
      }
      var data = await rawData.json();
      return data;
    } catch (error) {
      console.log(error.massage);
    }
  }

  weatherCondition();

  window.addEventListener("load", async () => {
    let defaultCity = "bhopal";
    let result = await weatherCondition(defaultCity);
    updateUi(result);
    // console.log(result);
  });

  function updateUi(weatherData) {
    city.innerHTML = `${weatherData.name} (MP)`;
    temperature.innerHTML = `${Math.floor(weatherData.main.temp)}°C`;
    mausam.innerHTML = `${weatherData.weather[0].main}`;
    heatIndex.innerHTML = `Heat Index : ${weatherData.main.feels_like}`;
    humidity.innerHTML = `Humidity : ${weatherData.main.humidity}`;
    windSpeed.innerHTML = `Wind-Speed : ${weatherData.wind.speed}km/h`;
  }

  let date = document.querySelector(".weather .day h2");
  let currentDay = document.querySelector(".weather .day h1");

  function updateTime() {
    let current = new Date();
    let today = current.getDate();
    let day = current.toLocaleString("en-US", { weekday: "short" });
    let month = current.toLocaleString("en-US", { month: "short" });
    let year = current.getFullYear();
    let hour = current.getHours();
    let minutes = current.getMinutes();
    let seconds = current.getSeconds();
    let amPm = current
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      })
      .slice(-2);

    date.innerHTML = `${today} ${month} ${year}`;
    currentDay.innerHTML = `${day}, ${String(hour).padStart("2", "0")}:${String(minutes).padStart("2", "0")}:${String(seconds).padStart("2", "0")} ${amPm}`;
  }

  setInterval(() => {
    updateTime();
  }, 1000);
}
weatherUpdate();

function DailyGoals(params) {
  let goalInput = document.getElementById("goalInput");
  let addGoal = document.getElementById("addGoal");
  let goalList = document.getElementById("goalList");
  let progressText = document.getElementById("progressText");
  let fill = document.querySelector(".fill");

  let goals = [];

  addGoal.addEventListener("click", () => {
    if (goalInput.value.trim() === "") return;

    goals.push({ text: goalInput.value, done: false });
    goalInput.value = "";
    renderGoals();
  });

  function renderGoals() {
    goalList.innerHTML = "";

    goals.forEach((goal, index) => {
      let div = document.createElement("div");
      div.className = "goal";

      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = goal.done;

      let span = document.createElement("span");
      span.innerText = goal.text;
      if (goal.done) span.classList.add("done");

      checkbox.addEventListener("change", () => {
        goals[index].done = checkbox.checked;
        renderGoals();
      });

      div.appendChild(checkbox);
      div.appendChild(span);
      goalList.appendChild(div);
    });

    updateProgress();
  }

  function updateProgress() {
    let completed = goals.filter((g) => g.done).length;
    let total = goals.length;

    progressText.innerText = `${completed} / ${total} completed`;

    let percent = total === 0 ? 0 : (completed / total) * 100;
    fill.style.width = percent + "%";
  }
}
DailyGoals();
