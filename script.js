let cards = JSON.parse(localStorage.getItem("flashcards")) || [];
let quizIndex = 0;
let quizMode = false;
let score = 0;
let total = 0;

// Add new flashcard
function addCard() {
  let q = document.getElementById("question").value.trim();
  let a = document.getElementById("answer").value.trim();

  if (q && a) {
    let card = { q, a, flipped: false };
    cards.push(card);
    saveCards();
    renderCards();
    document.getElementById("question").value = "";
    document.getElementById("answer").value = "";
  }
}

// Flip card
function flipCard(i) {
  cards[i].flipped = !cards[i].flipped;
  renderCards();
}

// Delete card
function deleteCard(i) {
  cards.splice(i, 1);
  saveCards();
  renderCards();
}

// Save cards
function saveCards() {
  localStorage.setItem("flashcards", JSON.stringify(cards));
}

// Render all cards
function renderCards() {
  let container = document.getElementById("cards");
  container.innerHTML = "";
  cards.forEach((c, i) => {
    let div = document.createElement("div");
    div.className = "card";

    // Question or Answer text
    let text = document.createElement("span");
    text.innerText = c.flipped ? c.a : c.q;
    text.style.cursor = "pointer";
    text.onclick = () => flipCard(i);

    // Delete button
    let delBtn = document.createElement("button");
    delBtn.innerText = "❌";
    delBtn.className = "delete-btn";
    delBtn.onclick = (e) => {
      e.stopPropagation(); // prevent flip when deleting
      deleteCard(i);
    };

    div.appendChild(text);
    div.appendChild(delBtn);
    container.appendChild(div);
  });
}

// Show feedback messages
function showFeedback(message, type = "info") {
  let fb = document.getElementById("quizFeedback");
  fb.innerText = message;
  fb.className = "feedback " + type;
  fb.style.display = "block";
}

// Quiz functions
function startQuiz() {
  quizIndex = 0;
  score = 0;
  total = cards.length;

  if (cards.length > 0) {
    document.getElementById("quizBox").innerText = cards[quizIndex].q;
    showFeedback("Quiz started! " + total + " questions total.", "info");
    document.getElementById("quizAnswer").value = "";
  } else {
    document.getElementById("quizBox").innerText = "No flashcards available!";
  }
}

function checkAnswer() {
  let userAns = document.getElementById("quizAnswer").value.trim();
  if (!userAns) return;

  if (userAns.toLowerCase() === cards[quizIndex].a.toLowerCase()) {
    score++;
    showFeedback(`✅ Correct! Score: ${score}/${total}`, "success");
  } else {
    showFeedback(`❌ Wrong! Correct: ${cards[quizIndex].a} | Score: ${score}/${total}`, "error");
  }

  quizIndex++;
  if (quizIndex < cards.length) {
    setTimeout(() => {
      document.getElementById("quizBox").innerText = cards[quizIndex].q;
      document.getElementById("quizAnswer").value = "";
      document.getElementById("quizFeedback").style.display = "none"; // hide old feedback
    }, 1200);
  } else {
    setTimeout(() => {
      showFeedback(`🎉 Quiz finished! Final Score: ${score}/${total}`, "info");
      document.getElementById("quizBox").innerText = "All questions complete.";
      document.getElementById("quizAnswer").value = "";
    }, 1200);
  }
}

// Verify answer online (Wikipedia API)
async function verifyWithInternet(answer) {
  if (!answer) {
    showFeedback("⚠️ Please type an answer first.", "error");
    return;
  }

  let url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(answer)}`;
  try {
    let res = await fetch(url);
    if (!res.ok) throw new Error("Not found");
    let data = await res.json();

    if (data.extract) {
      showFeedback(`🌐 Verified: ${data.extract.substring(0, 150)}...`, "info");
    } else {
      showFeedback("❌ Could not verify online.", "error");
    }
  } catch (err) {
    showFeedback("⚠️ Error fetching from Wikipedia.", "error");
  }
}

// Toggle between modes
function toggleMode() {
  quizMode = !quizMode;
  if (quizMode) {
    document.getElementById("flashcardSection").style.display = "none";
    document.getElementById("quizSection").style.display = "block";
    document.getElementById("modeBtn").innerText = "Switch to Flashcard Mode";
    startQuiz();
  } else {
    document.getElementById("flashcardSection").style.display = "block";
    document.getElementById("quizSection").style.display = "none";
    document.getElementById("modeBtn").innerText = "Switch to Quiz Mode";
  }
}

// Initial render
renderCards();
