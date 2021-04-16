class BooksList {
  constructor() {
    this.select = {
      templateOf: {
        templateBook: "#template-book",
      },
    };
    this.templates = {
      templateBook: Handlebars.compile(
        document.querySelector(this.select.templateOf.templateBook).innerHTML
      ),
    };
    this.booksList = document.querySelector(".books-list");
    this.allFilters = document.querySelector(".filters");
    this.favoriteBooks = [];
    this.filters = [];

    this.initData();
    this.render();
    this.initActions();
  }

  initData() {
    this.data = dataSource.books;
  }

  render() {
    for (let singleBook of this.data) {
      singleBook.ratingBgc = this.determineRatingBgc(singleBook.rating);
      singleBook.ratingWidth = singleBook.rating * 10;
      const generatedHTML = this.templates.templateBook(singleBook);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      this.booksList.appendChild(generatedDOM);
    }
  }

  initActions() {
    const thisBooksList = this;
    this.booksList.addEventListener("dblclick", function (event) {
      event.preventDefault();
      const bookImage = event.target.offsetParent;
      if (!bookImage.classList.contains("book__image")) {
        return;
      }
      let bookId = bookImage.getAttribute("data-id");
      if (
        thisBooksList.favoriteBooks.indexOf(bookId) >= 0 &&
        bookImage.classList.contains("favorite")
      ) {
        bookImage.classList.remove("favorite");
        thisBooksList.favoriteBooks = thisBooksList.favoriteBooks.filter(
          function (id) {
            return id != bookId;
          }
        );
      } else {
        bookImage.classList.add("favorite");
        thisBooksList.favoriteBooks.push(bookId);
      }
    });

    this.allFilters.addEventListener("click", function (event) {
      event.preventDefault;
      const filter = event.target;
      if (filter.checked) {
        thisBooksList.filters.push(filter.value);
      } else {
        thisBooksList.filters = thisBooksList.filters.filter(function (
          filterid
        ) {
          return filterid != filter.value;
        });
      }
      thisBooksList.filterBooks();
    });
  }

  filterBooks() {
    for (let book of this.data) {
      let shouldBeHidden = false;
      for (const filter of this.filters) {
        if (!book.details[filter]) {
          //* czy powinno byc not ? bo na gifie było na odwrót fukncjonowanie przedstawione :D *//
          shouldBeHidden = true;
          break;
        }
      }
      const bookElement = this.booksList.querySelector(
        ".book__image[data-id='" + book.id + "']"
      );
      const hasHiddenClass = bookElement.classList.contains("hidden");
      if (shouldBeHidden && !hasHiddenClass) {
        bookElement.classList.add("hidden");
      } else if (!shouldBeHidden && hasHiddenClass) {
        bookElement.classList.remove("hidden");
      }
    }
  }

  determineRatingBgc(rating) {
    if (rating < 6) {
      return "linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)";
    } else if (rating > 6 && rating <= 8) {
      return "linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)";
    } else if (rating > 8 && rating <= 9) {
      return "linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)";
    } else if (rating > 9) {
      return "linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)";
    }
  }
}

const app = new BooksList();
