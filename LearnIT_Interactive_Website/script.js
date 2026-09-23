const lessons = {
  html: {
    title: "HTML Basics",
    text: "HTML (HyperText Markup Language) is used to create the structure of a web page. Elements such as headings, paragraphs, images, and links are written using HTML tags.",
    example: "<h1>Hello World!</h1>"
  },
  css: {
    title: "CSS Basics",
    text: "CSS (Cascading Style Sheets) controls how a web page looks. You can use CSS to change colors, fonts, spacing, sizes, layouts, and more.",
    example: "h1 { color: blue; }"
  },
  js: {
    title: "JavaScript",
    text: "JavaScript adds behavior and interactivity to websites. It can respond to button clicks, change page content, validate forms, and perform calculations.",
    example: "alert('Hello!');"
  },
  python: {
    title: "Python Basics",
    text: "Python is a programming language known for its simple syntax. It is commonly used for software development, automation, data analysis, and AI.",
    example: "print('Hello World!')"
  }
};

const questions = [
  {
    question: "What does HTML stand for?",
    answers: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyperlink Text Management Language",
      "Home Tool Markup Language"
    ],
    correct: 0
  },
  {
    question: "Which language is mainly used to style a web page?",
    answers: ["HTML", "CSS", "Python", "SQL"],
    correct: 1
  },
  {
    question: "Which language adds interactivity to a web page?",
    answers: ["JavaScript", "HTML", "CSS", "XML"],
    correct: 0
  },
  {
    question: "Which symbol is commonly used to select a class in CSS?",
    answers: [".", "#", "@", "$"],
    correct: 0
  },
  {
    question: "Which language uses print() to display text?",
    answers: ["CSS", "HTML", "Python", "SQL"],
    correct: 2
  }
];

let completedLessons = JSON.parse(localStorage.getItem("completedLessons") || "[]");
let latestScore = Number(localStorage.getItem("latestScore") || 0);
let currentQuestion = 0;
let score = 0;
let answered = false;

const lessonBox = document.getElementById("lessonBox");
const lessonTitle = document.getElementById("lessonTitle");
const lessonText = document.getElementById("lessonText");
const lessonExample = document.getElementById("lessonExample");
const lessonDone = document.getElementById("lessonDone");

document.querySelectorAll(".lesson-card").forEach(card => {
  card.addEventListener("click", () => {
    const topic = card.dataset.topic;
    const lesson = lessons[topic];

    lessonTitle.textContent = lesson.title;
    lessonText.textContent = lesson.text;
    lessonExample.textContent = lesson.example;
    lessonBox.classList.remove("hidden");

    lessonDone.dataset.topic = topic;
    lessonBox.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

lessonDone.addEventListener("click", () => {
  const topic = lessonDone.dataset.topic;

  if (!completedLessons.includes(topic)) {
    completedLessons.push(topic);
    localStorage.setItem("completedLessons", JSON.stringify(completedLessons));
  }

  lessonDone.textContent = "✓ Completed";
  updateProgress();
});

function loadQuestion() {
  answered = false;
  const q = questions[currentQuestion];

  document.getElementById("questionNumber").textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;
  document.getElementById("scoreLabel").textContent = `Score: ${score}`;
  document.getElementById("question").textContent = q.question;

  const answers = document.getElementById("answers");
  answers.innerHTML = "";

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = answer;
    button.addEventListener("click", () => chooseAnswer(index, button));
    answers.appendChild(button);
  });

  document.getElementById("feedback").textContent = "";
  document.getElementById("nextBtn").classList.add("hidden");
  document.getElementById("restartBtn").classList.add("hidden");
}

function chooseAnswer(index, button) {
  if (answered) return;

  answered = true;
  const q = questions[currentQuestion];
  const allAnswers = document.querySelectorAll(".answer");

  if (index === q.correct) {
    button.classList.add("correct");
    document.getElementById("feedback").textContent = "✓ Correct!";
    document.getElementById("feedback").style.color = "var(--success)";
    score++;
  } else {
    button.classList.add("wrong");
    allAnswers[q.correct].classList.add("correct");
    document.getElementById("feedback").textContent =
      "✗ Not quite. The correct answer is highlighted.";
    document.getElementById("feedback").style.color = "var(--danger)";
  }

  document.getElementById("scoreLabel").textContent = `Score: ${score}`;

  if (currentQuestion < questions.length - 1) {
    document.getElementById("nextBtn").classList.remove("hidden");
  } else {
    finishQuiz();
  }
}

document.getElementById("nextBtn").addEventListener("click", () => {
  currentQuestion++;
  loadQuestion();
});

function finishQuiz() {
  latestScore = Math.round((score / questions.length) * 100);
  localStorage.setItem("latestScore", latestScore);

  document.getElementById("restartBtn").classList.remove("hidden");
  document.getElementById("feedback").textContent +=
    ` Final score: ${score}/${questions.length} (${latestScore}%).`;
  updateProgress();
}

document.getElementById("restartBtn").addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  loadQuestion();
});

document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  document.getElementById("themeBtn").textContent = dark ? "☀️" : "🌙";
  localStorage.setItem("darkMode", dark);
});

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  document.getElementById("themeBtn").textContent = "☀️";
}

function updateProgress() {
  const lessonPercent = Math.round((completedLessons.length / 4) * 100);
  const overall = Math.round((lessonPercent + latestScore) / 2);

  document.getElementById("lessonProgress").textContent =
    `${completedLessons.length} / 4`;
  document.getElementById("quizProgress").textContent = `${latestScore}%`;
  document.getElementById("overallText").textContent = `${overall}%`;
  document.getElementById("progressFill").style.width = `${overall}%`;
}

loadQuestion();
updateProgress();
