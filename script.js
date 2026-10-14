const yes = document.getElementById("yes");
const no = document.getElementById("no");
const title = document.getElementById("title");
const message = document.getElementById("message");
const question = document.getElementById("question");
const buttons = document.getElementById("buttons");

let yesSize = 18; // starting font size of the Yes button

// Make the No button jump to a random spot
function runAway() {
  no.style.position = "fixed";
  const maxX = window.innerWidth - no.offsetWidth - 10;
  const maxY = window.innerHeight - no.offsetHeight - 10;
  no.style.left = Math.max(10, Math.random() * maxX) + "px";
  no.style.top = Math.max(10, Math.random() * maxY) + "px";

  // Each time she tries, Yes gets a little bigger
  yesSize += 3;
  yes.style.fontSize = yesSize + "px";
}

no.addEventListener("mouseover", runAway);   // desktop
no.addEventListener("touchstart", (e) => {   // phone
  e.preventDefault();
  runAway();
});
no.addEventListener("click", runAway);

// When she clicks Yes
yes.addEventListener("click", () => {
  title.textContent = "Yay!! 🎉";
  message.textContent = "You just made me the happiest person today.";
  question.textContent = "";
  buttons.style.display = "none";
});