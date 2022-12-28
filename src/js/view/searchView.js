class SerchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const data = this._parentElement.querySelector('.search__field').value;

    this._clearInput();
    return data;
  }
  _clearInput() {
    this._parentElement.querySelector('.search__field').value = ' ';
  }
  addSearchHandler(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SerchView();
