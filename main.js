const books = document.querySelector(".books");
const addBook = document.querySelector(".add-btn");
const modal = document.querySelector("#modal");
const span = document.querySelector(".close")

addBook.addEventListener("click", () => {
    modal.style.display = "block";
    document.querySelector('.form-title').textContent = "Add Book";
});

window.addEventListener("click", (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
});
  
span.addEventListener("click", () => {
    modal.style.display = "none";
});

let myLibrary = [];

// function Book(title, author, pages, read) {
//     this.title = title;
//     this.author = author;
//     this.pages = pages;
//     this.read = read;
//     this.id = Math.floor(Math.random() * 1000000);
// }

class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
        this.id = Math.floor(Math.random() * 1000000);
    }
}

function addBookToLibrary(title, author, pages, read) {
    myLibrary.push(new Book(title, author, pages, read));
    saveAndRenderBooks();
}

function addLocalStorage() {
    myLibrary = JSON.parse(localStorage.getItem("library")) || [];
    saveAndRenderBooks();
}

function createBookElement(el, content, className) {
    const element = document.createElement(el);
    element.textContent = content;
    element.setAttribute("class", className);
    return element;
}

function createReadElement(bookItem, book) {
    let read = document.createElement("div");
    read.setAttribute("class", "status");
    read.appendChild(createBookElement("h1", "Read:"));
    let label = document.createElement("label");
    label.setAttribute("class", "switch");
    read.appendChild(label);
    let input = document.createElement("input");
    input.type = "checkbox";
    label.appendChild(input);
    input.addEventListener("click", (e) => {
      if (e.target.checked) {
        bookItem.setAttribute("class", "card book read-checked");
        book.read = true;
        saveAndRenderBooks();
    } else {
        bookItem.setAttribute("class", "card book read-unchecked");
        book.read = false;
        saveAndRenderBooks();
    }
    });
    if (book.read) {
      input.checked = true;
      bookItem.setAttribute("class", "card book read-checked");
    }
    let span = document.createElement("span");
    span.setAttribute("class", "slider round");
    label.appendChild(span);
    return read;
}

function createEditIcon(book) {
    const editIcon = document.createElement("img");
    editIcon.src = "images/pencil.svg";
    editIcon.setAttribute("class", "edit-icon");
    editIcon.addEventListener("click", () => {
      fillOutEditForm(book);
    });
    return editIcon;
}

function fillOutEditForm(book) {
    modal.style.display = "block";
    document.querySelector(".form-title").textContent = "Edit Book";
    document.querySelector(".form-add-button").textContent = "Edit";
    document.querySelector(".add-book-form").setAttribute("id", book.id);
    document.querySelector("#book-title").value = book.title || "";
    document.querySelector("#book-author").value = book.author || "";
    document.querySelector("#book-pages").value = book.pages || "";
    document.querySelector("#book-read").checked = book.read;
}

function createBookItem(book, index) {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("id", index);
    bookItem.setAttribute("key", index);
    bookItem.setAttribute("class", "card book");
    let bookHeading = document.createElement("div");
    bookHeading.setAttribute("class", "book-heading");
    bookItem.appendChild(bookHeading);
    bookHeading.appendChild(
      createBookElement("h1", `Title: ${book.title}`, "book-title")
    );
    bookHeading.appendChild(createEditIcon(book));
    bookHeading.appendChild(createBookElement("button", "X", "delete"));
    bookItem.appendChild(
      createBookElement("h1", `Author: ${book.author}`, "book-author")
    );
    bookItem.appendChild(
      createBookElement("h1", `Pages: ${book.pages}`, "book-pages")
    );
    bookItem.appendChild(createReadElement(bookItem, book));

    bookItem.querySelector(".delete").addEventListener("click", () => {
        deleteBook(index);
    });
  
    books.insertAdjacentElement("afterbegin", bookItem);
}

const addBookForm = document.querySelector(".add-book-form");
addBookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    let newBook = {};
    for (let [name, value] of data) {
        if (name === "book-read") {
            newBook["book-read"] = true;
        } else {
            newBook[name] = value || "";
        }
    }

    if (!newBook["book-read"]) {
        newBook["book-read"] = false;
    }

    if (newBook["book-title"] === "" || newBook["book-title"] == null) {
        document.querySelector("#book-title").classList.add("error");
        document.querySelector(".error-message.book-title").classList.add("active");
        return;
    }

    if (newBook["book-author"] === "" || newBook["book-author"] == null) {
        document.querySelector("#book-author").classList.add("error");
        document.querySelector(".error-message.book-author").classList.add("active");
        return;
    }

    if (newBook["book-pages"] === "" || newBook["book-pages"] == null) {
        document.querySelector("#book-pages").classList.add("error");
        document.querySelector(".error-message.book-pages").classList.add("active");
        return;
    }

    if (document.querySelector(".form-title").textContent === "Edit Book") {
        let id = e.target.id;
        let editBook = myLibrary.filter((book) => book.id == id)[0];
        editBook.title = newBook["book-title"];
        editBook.author = newBook["book-author"];
        editBook.pages = newBook["book-pages"];
        editBook.read = newBook["book-read"];
        saveAndRenderBooks();
    } else {
        addBookToLibrary(
            newBook["book-title"],
            newBook["book-author"],
            newBook["book-pages"],
            newBook["book-read"]
        );
    }

    addBookForm.reset();
    modal.style.display = "none";
});

function deleteBook(index) {
    myLibrary.splice(index, 1);
    saveAndRenderBooks();
}

function renderBooks() {
    books.textContent = "";
    myLibrary.map((book, index) => {
        createBookItem(book, index);
    });
}

function saveAndRenderBooks() {
    localStorage.setItem("library", JSON.stringify(myLibrary));
    renderBooks();
}

function validateInputs() {
    if (newBook["book-title"] === "" || newBook["book-title"] == null) {
        document.querySelector("#book-title").classList.add("error");
        document.querySelector(".error-message.book-title").classList.add("active");
        return;
    }

    if (newBook["book-author"] === "" || newBook["book-author"] == null) {
        document.querySelector("#book-author").classList.add("error");
        document.querySelector(".error-message.book-author").classList.add("active");
        return;
    }

    if (newBook["book-pages"] === "" || newBook["book-pages"] == null) {
        document.querySelector("#book-pages").classList.add("error");
        document.querySelector(".error-message.book-pages").classList.add("active");
        return;
    }
}

addLocalStorage();

