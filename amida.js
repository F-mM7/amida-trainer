let correctOrder = [];
let clickedOrder = [];
let currentStep = 0;

document.addEventListener("DOMContentLoaded", () => {
  // ページ読み込み時の初期ゲーム生成
  generateAmida();

  // 縦線とステップ数の変更時に即座にゲーム再生成
  document.getElementById("numLines").addEventListener("change", generateAmida);
  document.getElementById("numSteps").addEventListener("change", generateAmida);
});

function generateAmida() {
  const container = document.getElementById("amidaContainer");
  container.innerHTML = ""; // 初期化
  clickedOrder = [];
  currentStep = 0;

  const numLines = parseInt(document.getElementById("numLines").value);
  const steps = parseInt(document.getElementById("numSteps").value);
  const amidaHeight = 400;

  if (numLines < 2 || steps < 1) {
    alert("縦線は2以上、ステップ数は1以上にしてください。");
    return;
  }

  const verticalLines = [];
  const horizontalPositions = [];

  // 縦線と円の生成
  for (let i = 0; i < numLines; i++) {
    const line = document.createElement("div");
    line.className = "line";
    line.style.height = `${amidaHeight}px`;

    const startCircle = document.createElement("div");
    startCircle.className = "circle start";
    startCircle.dataset.index = i;

    const endCircle = document.createElement("button");
    endCircle.className = "circle end";
    endCircle.dataset.index = i;

    endCircle.onclick = () => handleButtonClick(i, numLines);

    line.appendChild(startCircle);
    line.appendChild(endCircle);

    container.appendChild(line);
    verticalLines.push(line);
  }

  // 横線の生成（条件付き2進数）
  for (let step = 0; step < steps; step++) {
    let randomValue;
    do {
      randomValue = Math.floor(Math.random() * Math.pow(2, numLines - 1));
    } while ((randomValue & (randomValue >> 1)) !== 0);

    horizontalPositions.push(randomValue);

    for (let bit = 0; bit < numLines - 1; bit++) {
      if ((randomValue & (1 << bit)) !== 0) {
        const horizontalLine = document.createElement("div");
        horizontalLine.className = "horizontal";
        horizontalLine.style.width = "40px";
        horizontalLine.style.top = `${
          ((step + 1) / (steps + 1)) * amidaHeight
        }px`;
        verticalLines[bit].appendChild(horizontalLine);
      }
    }
  }

  calculateResults(horizontalPositions, numLines, steps);
  highlightNextCircle();
}

function calculateResults(horizontalPositions, numLines, steps) {
  const results = Array.from({ length: numLines }, (_, i) => i);

  for (let step = 0; step < steps; step++) {
    const value = horizontalPositions[step];
    for (let bit = 0; bit < numLines - 1; bit++) {
      if ((value & (1 << bit)) !== 0) {
        const temp = results[bit];
        results[bit] = results[bit + 1];
        results[bit + 1] = temp;
      }
    }
  }

  correctOrder = results;
  console.log("Correct Order:", correctOrder.map((x) => x + 1).join(", "));
}

function handleButtonClick(index, numLines) {
  clickedOrder.push(index);
  currentStep++;
  highlightNextCircle();

  if (clickedOrder.length === numLines) {
    checkResults();
  }
}

function checkResults() {
  let isCorrect = true;

  for (let i = 0; i < correctOrder.length; i++) {
    if (clickedOrder[i] !== correctOrder[i]) {
      isCorrect = false;
      break;
    }
  }

  if (isCorrect) {
    console.log("正解！新しいあみだくじを生成します。");
    generateAmida();
  } else {
    console.log("不正解！選択をリセットします。");
    resetSelection();
  }
}

function resetSelection() {
  clickedOrder = [];
  currentStep = 0;
  highlightNextCircle();
}

function highlightNextCircle() {
  document.querySelectorAll(".circle.start").forEach((circle) => {
    circle.classList.remove("highlight");
  });

  if (currentStep < correctOrder.length) {
    document
      .querySelectorAll(".circle.start")
      [currentStep].classList.add("highlight");
  }
}
