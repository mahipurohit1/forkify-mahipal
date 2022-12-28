import View from './view';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class bookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = ' no bookmarks yet, find a nice recipe and bookmarks!!!';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join();
  }
}

export default new bookmarkView();
