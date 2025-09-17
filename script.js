let cards = JSON.parse(localStorage.getItem("flashcards")) || [];
let quizIndex = 0;
let quizMode = false;

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

function flipCard(i) {
  cards[i].flipped = !cards[i].flipped;
  renderCards();
}

function saveCards() {
  localStorage.setItem("flashcards", JSON.stringify(cards));
}

function renderCards() {
  let container = document.getElementById("cards");
  container.innerHTML = "";
  cards.forEach((c, i) => {
    let div = document.createElement("div");
    div.className = "card";

    // Show Q or A
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

function deleteCard(i) {
  cards.splice(i, 1); // remove that card
  saveCards();
  renderCards();
}


// Quiz functions
function startQuiz() {
  quizIndex = 0;
  if (cards.length > 0) {
    document.getElementById("quizBox").innerText = cards[quizIndex].q;
    document.getElementById("quizFeedback").innerText = "";
    document.getElementById("quizAnswer").value = "";
  } else {
    document.getElementById("quizBox").innerText = "No flashcards available!";
  }
}

function checkAnswer() {
  let userAns = document.getElementById("quizAnswer").value.trim();
  if (!userAns) return;

  if (userAns.toLowerCase() === cards[quizIndex].a.toLowerCase()) {
    document.getElementById("quizFeedback").innerText = "✅ Correct!";
  } else {
    document.getElementById("quizFeedback").innerText = "❌ Wrong! Correct: " + cards[quizIndex].a;
  }

  quizIndex++;
  if (quizIndex < cards.length) {
    setTimeout(() => {
      document.getElementById("quizBox").innerText = cards[quizIndex].q;
      document.getElementById("quizFeedback").innerText = "";
      document.getElementById("quizAnswer").value = "";
    }, 1200);
  } else {
    setTimeout(() => {
      document.getElementById("quizBox").innerText = "🎉 Quiz finished!";
      document.getElementById("quizAnswer").value = "";
    }, 1200);
  }
}

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

// initial render
renderCards();

