// ===== SETTINGS =====
const SALT = "missyou2011";   // don't change this after generating the hashes
const EXPECTED_HASHES = [
  "0332ef2bdbe1caaf7b774dc1d1d8ccf15cb1d6d3c24498f835c4fe9cbc9e850b",
  // "PASTE_HASH_2_HERE",     // optional: another accepted spelling of the school
];
// ====================

const yes = document.getElementById("yes");
const no = document.getElementById("no");
const title = document.getElementById("title");
const message = document.getElementById("message");
const question = document.getElementById("question");
const buttons = document.getElementById("buttons");

// Turn anything typed into one simple form:
// lowercase, no accents, no spaces or punctuation
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
window.makeHash = makeHash; // lets you generate the hash from the console

// Verification
document.getElementById("verify").addEventListener("click", async () => {
  const name = document.getElementById("f-name").value;
  const dob = document.getElementById("f-dob").value;   // format yyyy-mm-dd
  const school = document.getElementById("f-school").value;
  const error = document.getElementById("error");

  if (!name || !dob || !school) {
    error.textContent = "Please fill in all three fields.";
    return;
  }

  const hash = await makeHash(name, dob, school);
  if (EXPECTED_HASHES.includes(hash)) {
    document.getElementById("gate").hidden = true;
    document.getElementById("ask").hidden = false;
  } else {
    error.textContent = "Sorry, these details don't match. Please try again.";
  }
});

// Runaway No button
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

// When she clicks Yes
yes.addEventListener("click", () => {
  document.getElementById("photo").hidden = true;    // hide the GIF
  document.getElementById("heart").hidden = false;   // show the beating heart
  title.textContent = "Yay!! 🎉";
  message.textContent = "You just made me the happiest person today.";
  question.textContent = "";
  buttons.style.display = "none";
});