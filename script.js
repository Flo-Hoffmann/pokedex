const typeColors = [
  { type: "Normal", color: "#A8A77A" },
  { type: "Fire", color: "#EE8130" },
  { type: "Water", color: "#6390F0" },
  { type: "Electric", color: "#F7D02C" },
  { type: "Grass", color: "#7AC74C" },
  { type: "Ice", color: "#96D9D6" },
  { type: "Fighting", color: "#C22E28" },
  { type: "Poison", color: "#A33EA1" },
  { type: "Ground", color: "#E2BF65" },
  { type: "Flying", color: "#A98FF3" },
  { type: "Psychic", color: "#F95587" },
  { type: "Bug", color: "#A6B91A" },
  { type: "Rock", color: "#B6A136" },
  { type: "Ghost", color: "#735797" },
  { type: "Dragon", color: "#6F35FC" },
  { type: "Dark", color: "#705746" },
  { type: "Steel", color: "#B7B7CE" },
  { type: "Fairy", color: "#D685AD" },
];

let currentPokemon = 1;
let currentPokemonData = [];
let numberOfPokemon = 151;
let allPokemonData = [];
let scrollPos = "";

async function init() {
  if (localStorage.getItem("pokemonData") && checkLocalStorageDate()) {
    allPokemonData = await loadFromLocalStorage("pokemonData");
  } else {
    document.getElementById("loading-icon").classList.remove("d-none");
    await loadNumberOfPokemons();
    document.getElementById("loading-icon").classList.add("d-none");
  }
  renderPreviewCard();
}

function checkLocalStorageDate() {
  let dataSetDate = JSON.parse(
    localStorage.getItem("pokemonData")
  ).timestamp.substring(0, 10);

  let today = formatDate(new Date());

  if (today == dataSetDate) return true;
}

async function loadNumberOfPokemons() {
  let apiUrl = `https://pokeapi.co/api/v2/pokemon/?limit=${numberOfPokemon}`;
  let apiResponse = await fetch(apiUrl);
  let apiResponseAsJson = await apiResponse.json();

  for (let i = 0; i < numberOfPokemon; i++) {
    let name = apiResponseAsJson["results"][i]["name"];
    await loadPokemonData(name);
  }

  await saveToLocalStorage("pokemonData", allPokemonData);
  console.log("Loaded to local Storage: ", allPokemonData);
}

async function loadPokemonData(name) {
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/" + name;
  let apiResponse = await fetch(apiUrl);
  let apiResponseAsJson = await apiResponse.json();

  allPokemonData.push({
    name: apiResponseAsJson["name"],
    id: apiResponseAsJson["id"],
    types: loadTypes(apiResponseAsJson["types"]),
    img: apiResponseAsJson["sprites"]["other"]["official-artwork"][
      "front_default"
    ],
    species: apiResponseAsJson["species"]["name"],
    height: apiResponseAsJson["height"],
    weight: apiResponseAsJson["weight"],
    abilities: loadAbilities(apiResponseAsJson["abilities"]),
    stats: apiResponseAsJson["stats"],
  });
}

function renderPreviewCard() {
  document.getElementById("board-container").innerHTML = "";

  for (let i = 0; i < allPokemonData.length; i++) {
    const element = allPokemonData[i];
    const pokemonName = upperCase(element["name"]);
    const pokemonId = String(element["id"]);
    const pokemonImg = element["img"];

    document.getElementById("board-container").innerHTML += `
      <div id="small-card${i}" class="small-card" onclick="showPokemonCard(${
      element["id"]
    })">
        <div class="d-flex space-between">
          <h3>${pokemonName}</h3>
          <span>#${pokemonId.padStart(3, "0")}</span>
        </div>
        <div id="small-card-type-container${i}" class="small-card-type-container"> </div>
        <img src="${pokemonImg}" />
       </div>
    
    `;
    renderTypes("small-card-type-container" + i, element);
    setBgColor("small-card" + i, element);
  }
}

function showPokemonCard(pokemonId) {
  scrollPos = window.scrollY;
  currentPokemon = pokemonId;
  let index = allPokemonData.findIndex((i) => i.id == currentPokemon);
  currentPokemonData = allPokemonData[index];

  renderCardHeader();
  switchToCardStats();
  disableButtons();

  document.getElementById("large-card-bg").classList.remove("d-none");
  document.getElementById("large-card-bg").style.top = window.scrollY + "px";
  document.body.style.overflow = "hidden";
}

function hidePokemonCard() {
  document.getElementById("large-card-bg").classList.add("d-none");
  window.scrollTo(0, scrollPos);
  document.body.style.overflow = "auto";
}

function renderCardHeader() {
  let pokemonName = upperCase(currentPokemonData["name"]);
  let pokemonId = String(currentPokemonData["id"]);
  let pokemonImg = currentPokemonData["img"];

  document.getElementById("pokemon-name").innerHTML = pokemonName;
  document.getElementById("pokemon-id").innerHTML =
    "Pokedex #" + pokemonId.padStart(3, "0");
  document.getElementById("pokemon-img").src = pokemonImg;
  setBgColor("large-card", currentPokemonData);
  renderColoredTypes("type-container", currentPokemonData);
}

function switchToCardAbout() {
  document.getElementById("card-data-stats").classList.add("d-none");
  document.getElementById("card-data-about").classList.remove("d-none");
  document.getElementById("menu-about").classList.add("active-menu");
  document.getElementById("menu-stats").classList.remove("active-menu");
  document
    .getElementById("menu-stats")
    .setAttribute("onclick", "switchToCardStats()");
  document.getElementById("menu-about").onclick = "";

  renderCardAbout();
}

function renderCardAbout() {
  let pokemonSpecies = upperCase(currentPokemonData["species"]);
  let pokemonHeight = (currentPokemonData["height"] * 0.1).toFixed(2) + " m";
  let pokemonWeight = (currentPokemonData["weight"] * 0.1).toFixed(2) + " kg";

  document.getElementById("pokemon-species").innerHTML = pokemonSpecies;
  document.getElementById("pokemon-height").innerHTML = pokemonHeight;
  document.getElementById("pokemon-weight").innerHTML = pokemonWeight;
  renderAbilities();
}

function switchToCardStats() {
  document.getElementById("card-data-about").classList.add("d-none");
  document.getElementById("card-data-stats").classList.remove("d-none");
  document.getElementById("menu-stats").classList.add("active-menu");
  document.getElementById("menu-about").classList.remove("active-menu");
  document
    .getElementById("menu-about")
    .setAttribute("onclick", "switchToCardAbout()");
  document.getElementById("menu-stats").onclick = "";

  renderCardStats();
}

function renderCardStats() {
  let hp = currentPokemonData["stats"][0]["base_stat"];
  let attack = currentPokemonData["stats"][1]["base_stat"];
  let defense = currentPokemonData["stats"][2]["base_stat"];
  let spAttack = currentPokemonData["stats"][3]["base_stat"];
  let spDefense = currentPokemonData["stats"][4]["base_stat"];
  let speed = currentPokemonData["stats"][5]["base_stat"];

  document.getElementById("pokemon-hp").innerHTML = hp;
  document.getElementById("pokemon-attack").innerHTML = attack;
  document.getElementById("pokemon-defense").innerHTML = defense;
  document.getElementById("pokemon-special-attack").innerHTML = spAttack;
  document.getElementById("pokemon-special-defense").innerHTML = spDefense;
  document.getElementById("pokemon-speed").innerHTML = speed;

  renderCardStatsBars(hp, attack, defense, spAttack, spDefense, speed);
}

function renderCardStatsBars(hp, attack, defense, spAttack, spDefense, speed) {
  document.getElementById("stat-svg-0").innerHTML = `
  <line stroke="lightgray" x1="0" y1="0" x2="240" y2="0" />
  <line stroke="#EE8130" x1="0" y1="0" x2="${hp * 2}" y2="0" />
  `;
  document.getElementById("stat-svg-1").innerHTML = `
  <line stroke="lightgray" x1="0" y1="0" x2="240" y2="0" />
  <line stroke="#EE8130" x1="0" y1="0" x2="${attack * 2}" y2="0" />
  `;
  document.getElementById("stat-svg-2").innerHTML = `
  <line stroke="lightgray" x1="0" y1="0" x2="240" y2="0" />
  <line stroke="#EE8130" x1="0" y1="0" x2="${defense * 2}" y2="0" />
  `;
  document.getElementById("stat-svg-3").innerHTML = `
  <line stroke="lightgray" x1="0" y1="0" x2="240" y2="0" />
  <line stroke="#EE8130" x1="0" y1="0" x2="${spAttack * 2}" y2="0" />
  `;

  document.getElementById("stat-svg-4").innerHTML = `
  <line stroke="lightgray" x1="0" y1="0" x2="240" y2="0" />
  <line stroke="#EE8130" x1="0" y1="0" x2="${spDefense * 2}" y2="0" />
  `;
  document.getElementById("stat-svg-5").innerHTML = `
  <line stroke="lightgray" x1="0" y1="0" x2="240" y2="0" />
  <line stroke="#EE8130" x1="0" y1="0" x2="${speed * 2}" y2="0" />
  `;

  for (let i = 0; i <= 5; i++) {
    let element = document.getElementById("stat-svg-" + i).lastElementChild;

    if (element.getAttribute("x2") >= 100) {
      element.setAttribute("stroke", "#7AC74C");
    }
  }
}

function setBgColor(targetContainer, sourceData) {
  let mainType = upperCase(sourceData["types"][0]);
  let index = typeColors.findIndex((i) => i.type == mainType);

  document.getElementById(targetContainer).style.backgroundColor =
    typeColors[index]["color"];
}

function loadTypes(totalTypes) {
  let types = [];

  for (let i = 0; i < totalTypes.length; i++) {
    types.push(totalTypes[i]["type"]["name"]);
  }

  return types;
}

function renderTypes(targetContainer, sourceData) {
  let types = sourceData["types"];
  document.getElementById(targetContainer).innerHTML = "";

  for (let i = 0; i < types.length; i++) {
    let type = upperCase(types[i]);

    document.getElementById(targetContainer).innerHTML += `
      <span id="${targetContainer}-type${i}" class="type">${type}</span>
    `;
  }
}

function renderColoredTypes(targetContainer, sourceData) {
  let types = sourceData["types"];
  document.getElementById(targetContainer).innerHTML = "";

  for (let i = 0; i < types.length; i++) {
    let type = upperCase(types[i]);
    let index = typeColors.findIndex((a) => a.type == type);

    document.getElementById(targetContainer).innerHTML += `
      <span id="${targetContainer}-type${i}" class="type">${type}</span>
    `;

    document.getElementById(
      `${targetContainer}-type${i}`
    ).style.backgroundColor = typeColors[index]["color"];
  }
}

function loadAbilities(totalAbilities) {
  let abilities = [];

  for (let i = 0; i < totalAbilities.length; i++) {
    abilities.push(totalAbilities[i]["ability"]["name"]);
  }

  return abilities;
}

function renderAbilities() {
  let abilities = currentPokemonData["abilities"];
  document.getElementById("pokemon-abilities").innerHTML = "";

  for (let i = 0; i < abilities.length; i++) {
    let ability = upperCase(abilities[i]);

    if (i != abilities.length - 1) {
      document.getElementById("pokemon-abilities").innerHTML += ability + ", ";
    } else {
      document.getElementById("pokemon-abilities").innerHTML += ability;
    }
  }
}

async function filterPokemon() {
  let filter = lowerCase(document.getElementById("search-field").value);

  for (let i = 0; i < allPokemonData.length; i++) {
    let card = document.getElementById("small-card" + i);
    let name = lowerCase(card.firstElementChild.firstElementChild.innerHTML);
    let id = card.firstElementChild.lastElementChild.innerHTML;

    if (name.indexOf(filter) > -1 || id.indexOf(filter) > -1) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  }
}

function showNextPokemon() {
  if (currentPokemon < numberOfPokemon) currentPokemon++;
  showPokemonCard(currentPokemon);
}

function showPreviousPokemon() {
  if (currentPokemon > 1) currentPokemon--;
  showPokemonCard(currentPokemon);
}

function disableButtons() {
  if (currentPokemon == 1) document.getElementById("back-btn").disabled = true;
  else document.getElementById("back-btn").disabled = false;

  if (currentPokemon == numberOfPokemon)
    document.getElementById("next-btn").disabled = true;
  else document.getElementById("next-btn").disabled = false;
}

function upperCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function lowerCase(word) {
  return word.charAt(0).toLowerCase() + word.slice(1);
}

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function saveToLocalStorage(key, array) {
  let object = { value: array, timestamp: new Date() };
  localStorage.setItem(key, JSON.stringify(object));
}

function loadFromLocalStorage(key) {
  let object = JSON.parse(localStorage.getItem(key));
  return object.value;
}
