`use strict`;

// elements
const testButton = document.querySelector(`.btn--test`);
const inputA = document.querySelector(`.input--A`);
const inputB = document.querySelector(`.input--B`);
const outputA = document.querySelector(`.output--A`);
const outputB = document.querySelector(`.output--B`);

const data = document.querySelector(".data");

const sound = new Audio("sounds/mythic_old.ogg");

//JSONs
logData();

const findMatch = function() {
    console.log(document.querySelector(`.data--helmet`).value)
    console.log(inputA.value)
    return JSON.stringify(JSON.parse(document.querySelector(`.data--helmet`).value)[inputA.value])
}

const setOutput = function () {
  outputB.textContent = findMatch();
};



testButton.addEventListener("click", function () {
  sound.play();
});

// document.addEventListener() can be used to catch inputs on a global level
// window.addEventListener() can be used to catch when the page fully loads, or wants to unload

window.addEventListener("load", function () {

  inputA.addEventListener("input", function () {
    // if it's 
    setOutput();
  });
});

async function logData() {
  const item_types = [
    "helmet",
    "chestplate",
    "leggings",
    "boots",
    "ring",
    "bracelet",
    "necklace",
    "relik",
    "spear",
    "wand",
    "bow",
    "dagger",
  ];

  for (let i = 0; i < item_types.length; i++) {
    const data = document.querySelector(".data--" + item_types[i]);
    data.value = JSON.stringify(await fetchData(item_types[i]));
  }
}

async function fetchData(file) {
  try {
    const response = await fetch(`database/${file}.json`);

    if (!response.ok) {
      throw new Error("Could not fetch resource: " + `database/${file}.json`);
    }

    //outputB.textContent = JSON.stringify(await response.json());
    return response.json();
  } catch (error) {
    console.error(error);
  }
}
