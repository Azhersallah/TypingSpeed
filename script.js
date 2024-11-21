document.addEventListener("DOMContentLoaded", () => {
  const textToType = document.getElementById("text-to-type");
  const startButton = document.getElementById("start-button");
  const timeSelect = document.getElementById("time-select");
  const timerElement = document.getElementById("timer");
  const result = document.getElementById("result");

  let timeLeft = 0;
  let timer = null;
  let startTime = null;
  let typedText = "";
  let originalText = textToType.textContent.trim();

  // Update text with spans
  function setupText() {
    textToType.innerHTML = originalText
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");
  }

  // Start the typing test
  startButton.addEventListener("click", () => {
    setupText();
    timeLeft = parseInt(timeSelect.value, 10);
    startTime = null;
    typedText = "";
    result.classList.add("d-none");
    textToType.querySelectorAll("span").forEach((span) => {
      span.classList.remove("correct", "wrong");
    });

    // Start Timer
    timerElement.textContent = `Time: ${timeLeft}s`;
    timer = setInterval(() => {
      if (!startTime) startTime = Date.now();
      const elapsed = Math.floor((Date.now() - startTime) / 1000);

      if (elapsed >= timeLeft) {
        clearInterval(timer);
        finishTest();
      } else {
        timerElement.textContent = `Time: ${timeLeft - elapsed}s`;
      }
    }, 1000);

    // Listen to keyboard input
    document.addEventListener("keydown", handleTyping);
  });

  // Handle typing input
  function handleTyping(event) {
    if (event.key.length === 1 || event.key === "Backspace") {
      const chars = originalText.split("");
      if (event.key === "Backspace") {
        typedText = typedText.slice(0, -1);
      } else {
        typedText += event.key;
      }

      // Update text display
      chars.forEach((char, index) => {
        const span = textToType.querySelectorAll("span")[index];
        if (typedText[index] === char) {
          span.classList.add("correct");
          span.classList.remove("wrong");
        } else if (typedText[index] && typedText[index] !== char) {
          span.textContent = typedText[index]; // Show the wrong letter
          span.classList.add("wrong");
          span.classList.remove("correct");
        } else {
          span.textContent = char; // Reset the text for unmatched characters
          span.classList.remove("correct", "wrong");
        }
      });
    }
  }

  // End the test and calculate WPM
  function finishTest() {
    textToType.classList.remove("active");
    document.removeEventListener("keydown", handleTyping);

    const wordsTyped = typedText.trim().split(/\s+/).length;
    const minutes = timeLeft / 60;
    const wpm = Math.round(wordsTyped / minutes);

    result.textContent = `Your WPM is ${wpm}. Great job! 🎉`;
    result.classList.remove("d-none");
  }
});
