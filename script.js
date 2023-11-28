const bgColors = [
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
];

let currentPokemon = "bulbasaur";
let currentPokemonData = [];
let allPokemonData = [];

async function init() {
  if (localStorage.getItem("pokemonData")) {
    allPokemonData = await loadFromLocalStorage("pokemonData");
  } else await loadNumberOfPokemons(151);

  renderPokemonCard();
}

async function loadNumberOfPokemons(number) {
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=" + number;
  let apiResponse = await fetch(apiUrl);
  let apiResponseAsJson = await apiResponse.json();

  for (let i = 0; i < number; i++) {
    let name = apiResponseAsJson["results"][i]["name"];
    await loadPokemonData(name);
  }

  await saveToLocalStorage("pokemonData", allPokemonData);
  console.log(allPokemonData);
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

function renderPokemonCard() {
  let index = allPokemonData.findIndex((i) => i.name == currentPokemon);
  currentPokemonData = allPokemonData[index];

  renderCardHeader();
  renderCardAbout();
  renderCardStats();
}

function renderCardHeader() {
  let pokemonName = capitalize(currentPokemonData["name"]);
  let pokemonId = "#" + currentPokemonData["id"];
  let pokemonImg = currentPokemonData["img"];

  document.getElementById("pokemon-name").innerHTML = pokemonName;
  document.getElementById("pokemon-id").innerHTML = pokemonId;
  document.getElementById("pokemon-img").src = pokemonImg;

  setBgColor();
  renderTypes();
}

function renderCardAbout() {
  let pokemonSpecies = capitalize(currentPokemonData["species"]);
  let pokemonHeight = (currentPokemonData["height"] * 0.1).toFixed(2) + " m";
  let pokemonWeight = (currentPokemonData["weight"] * 0.1).toFixed(2) + " kg";

  document.getElementById("pokemon-species").innerHTML = pokemonSpecies;
  document.getElementById("pokemon-height").innerHTML = pokemonHeight;
  document.getElementById("pokemon-weight").innerHTML = pokemonWeight;

  renderAbilities();
}

function renderCardStats() {
  let pokemonHp = currentPokemonData["stats"][0]["base_stat"];
  let pokemonAttack = currentPokemonData["stats"][1]["base_stat"];
  let pokemonDefense = currentPokemonData["stats"][2]["base_stat"];
  let pokemonSpecialAttack = currentPokemonData["stats"][3]["base_stat"];
  let pokemonSpecialDefense = currentPokemonData["stats"][4]["base_stat"];
  let pokemonSpeed = currentPokemonData["stats"][5]["base_stat"];

  document.getElementById("pokemon-hp").innerHTML = pokemonHp;
  document.getElementById("pokemon-attack").innerHTML = pokemonAttack;
  document.getElementById("pokemon-defense").innerHTML = pokemonDefense;
  document.getElementById("pokemon-special-attack").innerHTML =
    pokemonSpecialAttack;
  document.getElementById("pokemon-special-defense").innerHTML =
    pokemonSpecialDefense;
  document.getElementById("pokemon-speed").innerHTML = pokemonSpeed;
}

function setBgColor() {
  let mainType = capitalize(currentPokemonData["types"][0]);
  let index = bgColors.findIndex((i) => i.type == mainType);

  document.getElementById("large-card").style.backgroundColor =
    bgColors[index]["color"];
}

function loadTypes(totalTypes) {
  let types = [];

  for (let i = 0; i < totalTypes.length; i++) {
    types.push(totalTypes[i]["type"]["name"]);
  }

  return types;
}

function renderTypes() {
  let types = currentPokemonData["types"];

  for (let i = 0; i < types.length; i++) {
    let type = types[i];

    document.getElementById("type-container").innerHTML += `
      <span class="type">${type}</span>
    `;
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
  for (let i = 0; i < abilities.length; i++) {
    let ability = capitalize(abilities[i]);

    if (i != abilities.length - 1) {
      document.getElementById("pokemon-abilities").innerHTML += ability + ", ";
    } else {
      document.getElementById("pokemon-abilities").innerHTML += ability;
    }
  }
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function saveToLocalStorage(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}

function loadFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
