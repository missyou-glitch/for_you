
// ===== SETTINGS =====
const SALT = "missyou2011";
const EXPECTED_HASH = "f79526b7cc4c17da73be5455baf1f6605b3bf17d931bcbfcc8d4ea543fc72102"; // you'll generate this in step 4
// ====================

const yes = document.getElementById("yes");
const no = document.getElementById("no");
const title = document.getElementById("title");
const message = document.getElementById("message");
const question = document.getElementById("question");
const buttons = document.getElementById("buttons");

// Clean up input so small differences don't matter
function clean(name, dob, phone) {
  const n = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/đ/g, "d").replace(/\s+/g, " ").trim();
  let p = phone.replace(/\D/g, "");
  if (p.startsWith("84")) p = "0" + p.slice(2);
  return `${n}|${dob}|${p}|${SALT}`;
}

async function makeHash(name, dob, phone) {
  const data = new TextEncoder().encode(clean(name, dob, phone));
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
window.makeHash = makeHash; // lets you generate the hash from the console

// Verification
document.getElementById("verify").addEventListener("click", async () => {
  const name = document.getElementById("f-name").value;
  const dob = document.getElementById("f-dob").value;   // format yyyy-mm-dd
  const phone = document.getElementById("f-phone").value;
  const error = document.getElementById("error");

  if (!name || !dob || !phone) {
    error.textContent = "Please fill in all three fields.";
    return;
  }
  const hash = await makeHash(name, dob, phone);
  if (hash === EXPECTED_HASH) {
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

// Yes
yes.addEventListener("click", () => {
  document.getElementById("photo").hidden = true;    // hide the GIF
  document.getElementById("heart").hidden = false;   // show the beating heart
  title.textContent = "Yay!! 🎉";
  message.textContent = "You just made me the happiest person today.";
  question.textContent = "";
  buttons.style.display = "none";
});