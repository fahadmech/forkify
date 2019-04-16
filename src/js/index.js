import Search from "./models/Search";

import Recipe from "./models/Recipe";

import * as searchView from "./views/searchView";

import { elements, renderLoader, clearLoader } from "./views/base";

/** Global Stateof the app
 * -search object
 * -shopping list
 * -shopping list object
 * liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  // 1) get query from view
  const query = searchView.getInput(); //todo

  if (query) {
    // 2) new search object and add to state
    state.search = new Search(query);

    // 3) prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4) search for recipes
      await state.search.getResults();

      // 5) Render Results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (err) {
      alert("someting wrong with the search...");
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "");
  console.log(id);

  if (id) {
    // Prepare UI for chamges
    // craete new recipe object
    state.recipe = new Recipe(id);
    try {
      // get recipe data
      await state.recipe.getRecipe();

      // calcualte servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // render recipe
      console.log(state.recipe);
    } catch (err) {
      alert("Error Processing Recipe!");
    }
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);

["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlRecipe)
);
