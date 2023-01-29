let oneRecipe = {};
let allRecipe = [];

/**
 * Event on click on Add a row in form
 * @param {Form id} idForm
 */
function clickAddRowIngredient(idForm) {
  let newDivIng = document.createElement("div");
  let nbIngr;

  nbIngr = document.getElementById(idForm).querySelectorAll(".row").length;

  if (idForm == "Edit-listIngr") {
    modal = "modal_";
  } else {
    modal = "";
  }
  newDivIng.setAttribute("class", "row");
  newDivIng.setAttribute("id", `${modal}form_row_${nbIngr}`);

  newDivIng.innerHTML = `
              <div class="col col-3">
                <label for="${modal}form_ing_${nbIngr}" class="form-label">Nom</label>
                <input type="text" class="form-control" id="${modal}form_ing_${nbIngr}">
              </div>
              <div class="col col-2">
                <label for="${modal}form_qt_${nbIngr}" class="form-label">Quantité</label>
                <input type="number" class="form-control" id="${modal}form_qt_${nbIngr}" min=0>
              </div>
              <div class="col col-2">
                <label for="${modal}form_unit_${nbIngr}" class="form-label">Unité</label>
                <input type="text" class="form-control" id="${modal}form_unit_${nbIngr}">
              </div>
              <div class="col col-1">
                <button type="button" class="btn btn-success"><i id="form-add" class='fas fa-sm fa-plus' onclick="clickAddRowIngredient('${idForm}')"></i></button>
              </div>
              <div class="col col-1">
                <button type="button" class="btn btn-danger"><i id="form-remove" class='fas fa-sm fa-minus' onclick="clickDeleteFormIngredient('form_row_${nbIngr}', '${idForm}')"></i></button>
              </div>`;

  document.getElementById(idForm).appendChild(newDivIng);
}

/**
 * Event on click on delete a row in form
 * @param {Identifier in recipe} id
 * @param {Form id} idForm
 */
function clickDeleteFormIngredient(id, idForm) {
  let ingrElm = document.getElementById(idForm).querySelectorAll("#" + id);

  if (ingrElm) {
    for (const ingre of ingrElm) {
      document.getElementById(idForm).removeChild(ingre);
    }
  }
}

/**
 * Display Modal for one recipe
 * @param {One Recipe} recipe
 */
function showOneRecipe(recipe) {
  oneRecipe = recipe;

  resetModal();
  document.getElementById("modal-header").setAttribute("src", recipe.link);
  document.getElementById("modal-title").innerText = recipe.name;
  document.getElementById(
    "modal-subtitle"
  ).innerText = `Pour ${recipe.nb_part} personnes`;
  document.getElementById("modal-description").innerText = recipe.description;

  for (const ingredient of recipe.ingredients) {
    let newLi = document.createElement("li");

    newLi.setAttribute("class", "list-group-item");
    newLi.innerHTML = `${ingredient.name} : ${ingredient.quantity}${ingredient.unit}`;
    document
      .getElementById("modal-recipe")
      .querySelector("ul")
      .appendChild(newLi);
  }

  document
    .getElementById("modal-remove")
    .setAttribute("onclick", `clickRemoveRecipe(${recipe.id})`);
  document
    .getElementById("modal-edit")
    .setAttribute("onclick", `clickEditRecipe(${recipe.id})`);
}

/**
 * Display all recipes cards
 * @param {Array of recipes} recipes
 */
function showAllRecipes(recipes) {
  allRecipe = recipes;
  let nbRow;
  let nbCard;

  for (const recipe of recipes) {
    nbCard = document
      .getElementById("listRecipes")
      .querySelectorAll("div[class='card']").length;

    if (nbCard % 2 != 1) {
      // Create Row
      nbRow = document
        .getElementById("listRecipes")
        .querySelectorAll("div[class^='row']").length;
      let newRow = document.createElement("div");
      newRow.setAttribute("class", "row justify-content-evenly");
      newRow.setAttribute("id", "listRow_" + nbRow);
      document.getElementById("listRecipes").appendChild(newRow);
    }

    // Create Col + Card
    let newCol = document.createElement("div");
    newCol.setAttribute("class", "col d-flex justify-content-center");
    newCol.setAttribute("id", "listCol_" + nbCard);
    document.getElementById("listRow_" + nbRow).appendChild(newCol);

    newCol.innerHTML = `
      <div id="${recipe.id}" class="card" style="width: 18rem; margin: 1em" onclick="clickDetailRecipe('${recipe.id}')" data-toggle="modal" data-target="#modal-recipe">
        <img style="max-height:18rem; cursor: pointer;" src="${recipe.link}" class="card-img-top" alt="Recette de ${recipe.name}">
        <div class="card-body">
          <h3 class="card-title">${recipe.name}</h3>
          <p class="card-text">${recipe.description}</p>
        </div>
      </div>`;
  }
}

/**
 * Event on click for remove one recipe
 * @param {Identifiant of one recipe} id
 */
function clickRemoveRecipe(id) {
  if (window.confirm("Voulez-vous supprimer cette recette?")) {
    callServeur("http://localhost:3000/receipes/" + id, oneRecipe, "DELETE");
  }
}

/**
 * Event on click on edit one recipe
 * @param {Recipe identifiant} id
 */
function clickEditRecipe(id) {
  resetAll("Edit-listIngr");

  document
    .getElementById("modal-form-submit")
    .setAttribute("onclick", `clickChangeRecipe(event, '${id}')`);
  document.getElementById("modal_form_nom").value = oneRecipe.name;
  document.getElementById("modal_form_nb-part").value = oneRecipe.nb_part;
  document.getElementById("modal_form_description").value =
    oneRecipe.description;
  document.getElementById("modal_form_link").value = oneRecipe.link;

  for (const ingredient of oneRecipe.ingredients) {
    let nbIngr = document
      .getElementById("Edit-listIngr")
      .querySelectorAll(".row").length;

    clickAddRowIngredient("Edit-listIngr");

    document.querySelector(`input[id='modal_form_ing_${nbIngr}']`).value =
      ingredient.name;
    document.querySelector(`input[id='modal_form_unit_${nbIngr}']`).value =
      ingredient.unit;
    document.querySelector(`input[id='modal_form_qt_${nbIngr}']`).value =
      parseInt(ingredient.quantity);
  }
}

/**
 * Event on click submit form in Edit
 * @param {event} event
 * @param {Identifiant of one recipe} id
 */
function clickChangeRecipe(event, id) {
  const lstNodeIngredient = document
    .getElementById("Edit-listIngr")
    .querySelectorAll("div[id^='modal_form_row_']");
  event.preventDefault();

  let newRecipe = {
    id: id,
    name: document.getElementById("modal_form_nom").value,
    nb_part: parseInt(document.getElementById("modal_form_nb-part").value),
    description: document.getElementById("modal_form_description").value,
    link: document.getElementById("modal_form_link").value,
    ingredients: [],
  };

  for (const elm of lstNodeIngredient) {
    let ingr = {
      name: elm.querySelector("input[id^='modal_form_ing_']").value,
      quantity: parseInt(
        elm.querySelector("input[id^='modal_form_qt_']").value
      ),
      unit: elm.querySelector("input[id^='modal_form_unit_']").value,
    };

    newRecipe.ingredients.push(ingr);
  }

  callServeur("http://localhost:3000/receipes/" + id, newRecipe, "PUT");
}

/**
 * Event from click on button Ajouter in from "Ajouter une nouvelle recette"
 * @param {click event} event
 */
function clickAddNewRecipe(event) {
  event.preventDefault();

  let newRecipe = {
    id: Date.now(),
    name: document.getElementById("form_nom").value,
    nb_part: parseInt(document.getElementById("form_nb-part").value),
    description: document.getElementById("form_description").value,
    link: document.getElementById("form_link").value,
    ingredients: [],
  };

  let lstNodeIngredient = document
    .getElementById("listIngr")
    .querySelectorAll("div[id^='form_row_']");

  for (const elm of lstNodeIngredient) {
    let ingr = {
      name: elm.querySelector("input[id^='form_ing_']").value,
      quantity: parseInt(elm.querySelector("input[id^='form_qt_']").value),
      unit: elm.querySelector("input[id^='form_unit_']").value,
    };

    newRecipe.ingredients.push(ingr);
  }

  callServeur("http://localhost:3000/receipes/", newRecipe, "POST");
}

/**
 * Event from click on Card recipe
 * Call callSeveur method to get one recipe
 * @param {a Recipe id} id
 */
function clickDetailRecipe(id) {
  callServeur("http://localhost:3000/receipes/" + id, "receipes", "GET");
}

/**
 * Call when request success
 * Call methods to execute
 * @param {Json datas get from request} datas
 * @param {How request have been execute} method
 */
function redirection(datas, method) {
  switch (method) {
    case "GET":
      if (!Array.isArray(datas)) {
        showOneRecipe(datas);
      } else {
        showAllRecipes(datas);
      }
      break;
    case "POST":
      document.getElementById("form-add").reset();
      break;
    default:
      break;
  }
}

/**
 * Send requests method
 * @param {url to call} url
 * @param {object to send} objet
 * @param {how send object} method
 */
function callServeur(url, objet, method) {
  let requestOptions;
  if (method != "GET") {
    requestOptions = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objet),
    };
  }

  fetch(url, requestOptions)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      console.log("erreur");
      throw new Error("URL inaccessible");
    })
    .then((datas) => redirection(datas, method))
    .catch((e) => {
      console.log("erreur: " + e);
      document.getElementById("navbar-brand").innerText =
        "Impossible de récupérer les données: " + e;
      document.getElementById("navbar-error").innerText = ";(";
    });
}

/**
 * Call on load
 * Call callServeur() method with GET
 */
function init() {
  callServeur("http://localhost:3000/receipes/", "receipes", "GET");
}

/**
 * Call All resetMethod
 * @param {Identifiant du formulaire} idForm
 */
function resetAll(idForm) {
  resetForm(idForm);
  resetModal();

  document.getElementById("form-add").reset();
  document.getElementById("form-edit").reset();
}

/**
 * Reset all rows ingrediants from a form
 * @param {Identifiant du formulaire} idForm
 */
function resetForm(idForm) {
  let ingrElm = document.getElementById(idForm).querySelectorAll(".row");

  if (ingrElm) {
    for (const ingre of ingrElm) {
      document.getElementById(idForm).removeChild(ingre);
    }
  }
}

/**
 * Reset all rows ingrediants from a modal
 */
function resetModal() {
  let ulElmt = document.getElementById("modal-list");
  if (ulElmt) {
    let childElmt = ulElmt.querySelectorAll("li");

    for (const li of childElmt) {
      ulElmt.removeChild(li);
    }
  }
}
