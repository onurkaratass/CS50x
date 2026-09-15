let timerInterval = null;
let timeLeft = 25 * 60;
let isRunning = false;
let blockedSites = [];

const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const siteInput = document.getElementById("siteInput");
const addBtn = document.getElementById("addBtn");
const siteList = document.getElementById("siteList");

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["blockedSites", "timeLeft", "isRunning", "lastUpdated"], (result) => {
        if (result.blockedSites) {
            blockedSites = result.blockedSites;
        } else {
            blockedSites = ["youtube.com", "twitter.com", "instagram.com"];
            chrome.storage.local.set({ blockedSites });
        }
        renderSites();

        if (result.isRunning && result.lastUpdated) {
            const elapsed = Math.floor((Date.now() - result.lastUpdated) / 1000);
            timeLeft = Math.max(0, result.timeLeft - elapsed);
            if (timeLeft > 0) {
                startTimer(false);
            } else {
                completeTimer();
            }
        } else if (result.timeLeft !== undefined) {
            timeLeft = result.timeLeft;
        }
        updateDisplay();
    });
});

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer(updateStorageState = true) {
    isRunning = true;
    startBtn.textContent = "Pause";
    startBtn.style.backgroundColor = "#eab308";

    if (updateStorageState) {
        chrome.storage.local.set({ isRunning: true, timeLeft, lastUpdated: Date.now() });
        notifyBackground(true);
    }

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
            chrome.storage.local.set({ timeLeft, lastUpdated: Date.now() });
        } else {
            completeTimer();
        }
    }, 1000);
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    startBtn.textContent = "Resume";
    startBtn.style.backgroundColor = "#22c55e";
    chrome.storage.local.set({ isRunning: false, timeLeft });
    notifyBackground(false);
}

function completeTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 25 * 60;
    startBtn.textContent = "Start";
    startBtn.style.backgroundColor = "#22c55e";
    chrome.storage.local.set({ isRunning: false, timeLeft });
    notifyBackground(false);
    updateDisplay();
    alert("Focus session complete! Take a break.");
}

startBtn.addEventListener("click", () => {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 25 * 60;
    startBtn.textContent = "Start";
    startBtn.style.backgroundColor = "#22c55e";
    chrome.storage.local.set({ isRunning: false, timeLeft });
    notifyBackground(false);
    updateDisplay();
});

addBtn.addEventListener("click", addSite);
siteInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addSite();
});

function addSite() {
    let site = siteInput.value.trim().toLowerCase();
    site = site.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/.*$/, "");

    if (site && !blockedSites.includes(site)) {
        blockedSites.push(site);
        chrome.storage.local.set({ blockedSites });
        renderSites();
        if (isRunning) notifyBackground(true);
        siteInput.value = "";
    }
}

function renderSites() {
    siteList.innerHTML = "";
    blockedSites.forEach((site) => {
        const li = document.createElement("li");
        li.textContent = site;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "×";
        removeBtn.className = "remove-btn";
        removeBtn.addEventListener("click", () => {
            blockedSites = blockedSites.filter(s => s !== site);
            chrome.storage.local.set({ blockedSites });
            renderSites();
            if (isRunning) notifyBackground(true);
        });

        li.appendChild(removeBtn);
        siteList.appendChild(li);
    });
}

function notifyBackground(enableBlocking) {
    chrome.runtime.sendMessage({
        action: "updateRules",
        blockedSites: blockedSites,
        isEnabled: enableBlocking
    });
}
