const canvas = document.querySelector(".box");
const game_over = document.querySelector(".game-over");
const score_txt = document.getElementById("current_score");
const high_score_txt = document.getElementById("high_score");
const start_btn = document.querySelector(".start-btn")
const container = document.querySelector(".container");
const ctx = canvas.getContext("2d");
const box = 20;
const w = canvas.width / box;
const h = canvas.height / box;
let dx, dy, running, snake, score, high_score;

let startX, startY, endX, endY;

if (localStorage.getItem("high_score") === null) {
  localStorage.setItem("high_score", 0);
}

high_score = localStorage.getItem("high_score")
high_score_txt.innerText = `High Score: ${high_score}`;

let food = {};

do {
  food.x = Math.floor(Math.random() * box),
    food.y = Math.floor(Math.random() * box)
} while (food.x === 10 || food.y === 10);

function game() {
  canvas.style.display = "block";
  snake = [{ x: 200, y: 200 }];
  dx = 0; //no horizontal motion
  dy = 0; //no vertical motion
  running = true;
  score = 0;
  spawnFood();
  draw();

}
function draw() {
  if (!running) {
    canvas.style.display = "none";
    game_over.style.display = "flex"
    game_over.classList.add("class");

  } else {
    game_over.style.display = "none"
    game_over.classList.remove("class")
    //CLEARS THE COLOR
    ctx.fillStyle = "aliceblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //FOOD
    ctx.fillStyle = "#FF7518";
    ctx.fillRect(food.x * box, food.y * box, box, box);
    //Draw Snake
    ctx.fillStyle = "lime";
    for (let segment of snake) {
      ctx.fillRect(segment.x, segment.y, box, box);
    }

    //Move snake
    const head = {
      x: snake[0].x + dx * box,
      y: snake[0].y + dy * box
    }

    ctx.fillStyle = "#212121";
    ctx.fillRect(head.x, head.y, box, box);

    snake.unshift(head);

    if (head.x === food.x * box && head.y === food.y * box) {

      spawnFood();
      score += 1;
      score_txt.innerText = `Score: ${score}`;
      if (high_score < score) {
        high_score_txt.innerText = `High Score: ${score}`
      }
    } else {

      snake.pop();

    }

    const outOfCanvas = head.x < 0 || head.x > w * (box - 1) || head.y < 0 || head.y > h * (box - 1);
    const selfCollision = snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y);

    if (outOfCanvas || selfCollision) {
      running = false;
      if (high_score < score) {
        localStorage.setItem("high_score", score)
      }
    }

    setTimeout(draw, 150);
  }
}

function spawnFood() {

  do {
    food.x = Math.floor(Math.random() * (box-1));
    food.y = Math.floor(Math.random() * (box - 1))
  } while (snake.some((seg) => seg.x === food.x * box && seg.y === food.y * box))


}

document.addEventListener('keydown', async (e) => {
  if (e.defaultPrevented) return;
  let key = e.key;

  if ((key === "ArrowUp" || key.toLowerCase() === "w") && dy !== 1) {
    dy = -1;
    dx = 0;
  }
  if ((key === "ArrowDown" || key.toLowerCase() === "s") && dy !== -1) {
    dy = 1;
    dx = 0;
  }
  if ((key === "ArrowRight" || key.toLowerCase() === "d") && dx !== -1) {
    dy = 0;
    dx = 1;
  }
  if ((key === "ArrowLeft" || key.toLowerCase() === "a") && dx !== 1) {
    dy = 0;
    dx = -1;
  }
})


container.addEventListener('touchstart', (e) => {
  if (e.target.closest('.start-btn')) return;
  e.preventDefault();
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
},{passive: false});

container.addEventListener("touchend", (e) => {
  if (e.target.closest('.start-btn')) return;
  e.preventDefault();
  endX = e.changedTouches[0].clientX;
  endY = e.changedTouches[0].clientY;
  handleSwipe();
}, {passive: false})


function handleSwipe() {

  const diffX = endX - startX;
  const diffY = endY - startY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 30 && dx !== -1) {
      dx = 1;
      dy = 0
    } if (diffX < -30 && dx !== 1) {
      dx = -1;
      dy = 0;
    }
  } else {
    if (diffY > 30 && dy !== -1) {
      dx = 0;
      dy = 1;
    } if (diffY < -30 && dy !== 1) {
      dx = 0;
      dy = -1;
    }
  }
}

start_btn.addEventListener("click", () => {

  game();
})