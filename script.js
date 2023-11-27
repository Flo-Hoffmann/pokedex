let currentPokemon = "";

async function loadPokemon() {
  let url = "https://pokeapi.co/api/v2/pokemon/1";
  let response = await fetch(url);
  currentPokemon = await response.json();
  renderPokemon();
}

function renderPokemon() {
  let name = capitalize(currentPokemon["name"]);
  let id = currentPokemon["id"];
  let img =
    currentPokemon["sprites"]["other"]["official-artwork"]["front_default"];
  let species = currentPokemon["species"]["name"];
  let height = currentPokemon["height"];
  let weight = currentPokemon["weight"];
  let abilities = currentPokemon["abilities"];

  document.getElementById("pokemon-name").innerHTML = name;
  document.getElementById("pokemon-img").src = img;
  document.getElementById("pokemon-id").innerHTML = "#" + id;
  renderTypes();
}

function loadTypes() {
  let totalTypes = currentPokemon["types"];
  let types = [];

  for (let i = 0; i < totalTypes.length; i++) {
    const type = totalTypes[i];
    types.push(currentPokemon["types"][i]["type"]["name"]);
  }

  return types;
}

function renderTypes() {
  let types = loadTypes();

  for (let i = 0; i < types.length; i++) {
    let type = capitalize(types[i]);
    document.getElementById("type-container").innerHTML += `
      <span class="type">${type}</span>
    `;
  }
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
