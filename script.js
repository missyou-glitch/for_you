// ===== SETTINGS =====
const SALT = "missyou2011";   // don't change this after generating the hashes
const EXPECTED_HASHES = [
  "0332ef2bdbe1caaf7b774dc1d1d8ccf15cb1d6d3c24498f835c4fe9cbc9e850b",
  "b5483db77637c443979db7b65a267e4f7973998dbf562fe7fd3cb635ff6d2725",
];

const yes = document.getElementById("yes");
const no = document.getElementById("no");
const title = document.getElementById("title");
const message = document.getElementById("message");
const question = document.getElementById("question");
const buttons = document.getElementById("buttons");

// ----- Sound -----
const bgm = document.getElementById("bgm");              // Running Sky
const sorrySong = document.getElementById("sorrysong");  // Don't Forget
const soundBtn = document.getElementById("sound");
let soundOn = true;
bgm.volume = 0.5;
sorrySong.volume = 0.5;

soundBtn.addEventListener("click", () => {
  soundOn = !soundOn;
  bgm.muted = !soundOn;
  sorrySong.muted = !soundOn;
  soundBtn.textContent = soundOn ? "🔊" : "🔇";
});

// ----- Name / school cleanup and hash -----
function simplify(text) {
  return text
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]/g, "");
}

function clean(name, dob, school) {
  return `${simplify(name)}|${dob}|${simplify(school)}|${SALT}`;
}

async function makeHash(name, dob, school) {
  const data = new TextEncoder().encode(clean(name, dob, school));
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
window.makeHash = makeHash;

// ----- Page 1: confirmation -----
document.getElementById("verify").addEventListener("click", async () => {
  const name = document.getElementById("f-name").value;
  const dob = document.getElementById("f-dob").value;
  const school = document.getElementById("f-school").value;
  const error = document.getElementById("error");

  if (!name || !dob || !school) {
    error.textContent = "Please fill in all three fields.";
    return;
  }

  // Start the audio inside the click so phones allow it (silent for now)
  bgm.muted = true;
  bgm.play().catch(() => {});

  const hash = await makeHash(name, dob, school);
  if (EXPECTED_HASHES.includes(hash)) {
    bgm.muted = !soundOn;                         // music becomes audible
    soundBtn.hidden = false;                      // show the mute button
    document.getElementById("gate").hidden = true;
    document.getElementById("status").hidden = false;
  } else {
    bgm.pause();                                  // wrong answer: stop the audio
    bgm.currentTime = 0;
    error.textContent = "Sorry, you're not her. 💔";
  }
});

// ----- Page 2: boyfriend question -----
// YES: stop the main music, play the gentle song
document.getElementById("bf-yes").addEventListener("click", () => {
  document.getElementById("status").hidden = true;
  document.getElementById("sorry").hidden = false;

  bgm.pause();
  sorrySong.muted = !soundOn;
  sorrySong.currentTime = 0;
  sorrySong.play().catch(() => {});
});

// NO: go on to the ask page; the main music keeps playing untouched
document.getElementById("bf-no").addEventListener("click", () => {
  document.getElementById("status").hidden = true;
  document.getElementById("ask").hidden = false;
});

// ----- Page 3: runaway No button -----
let yesSize = 18;
function runAway() {
  no.style.position = "fixed";
  const maxX = window.innerWidth - no.offsetWidth - 10;
  const maxY = window.innerHeight - no.offsetHeight - 10;
  no.style.left = Math.max(10, Math.random() * maxX) + "px";
  no.style.top = Math.max(10, Math.random() * maxY) + "px";
  yesSize += 3;
  yes.style.fontSize = yesSize + "px";
}
no.addEventListener("mouseover", runAway);
no.addEventListener("touchstart", (e) => { e.preventDefault(); runAway(); });
no.addEventListener("click", runAway);

// ----- Page 3: she clicks Yes -----
yes.addEventListener("click", () => {
  document.getElementById("photo").hidden = true;
  document.getElementById("heart").hidden = false;
  title.textContent = "Yay!! 🎉";
  message.textContent = "You just made me the happiest person today.";
  question.textContent = "";
  buttons.style.display = "none";
  // the music keeps playing; nothing stops it
});