import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';
import searchView from './view/searchView.js';
import receipeView from './view/receipeView.js';
import resultView from './view/resultView.js';
import paginationView from './view/paginationView.js';
import { async } from 'regenerator-runtime';
import bookmarkView from './view/bookmarkView.js';
import addRecipeView from './view/addRecipeView.js';

// if (module.hot) {
//   module.hot.accept();
// }
const controllRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    receipeView.renderSpinner();
    resultView.update(model.getSearchResultsPage());
    bookmarkView.update(model.state.bookmark);
    //1 loading receipe
    await model.loadRecipe(id);
    // const { recipe } = model.state;
    //2 render Recipe
    receipeView.render(model.state.recipe);
  } catch (err) {
    receipeView.renderError();
    console.log(err);
  }
};

const controllSearchResults = async function () {
  try {
    resultView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) throw Error('Enter valid input');

    await model.loadSearchQuery(query);

    resultView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    receipeView.renderError();
  }
};

const controlpagination = function (goToPage) {
  resultView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServing) {
  model.updateServings(newServing);
  // receipeView.render(model.state.recipe);
  receipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmark) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  receipeView.update(model.state.recipe);

  bookmarkView.render(model.state.bookmark);
};
const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmark);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    receipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarkView.render(model.state.bookmark);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
      location.reload();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  receipeView.addHandlerRender(controllRecipe);
  receipeView.addHandlerUpdateServings(controlServings);
  receipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addSearchHandler(controllSearchResults);
  paginationView.addHandlerClick(controlpagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
