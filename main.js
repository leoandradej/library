function Book(title, author, numberOfPages, isRead) {
    this.title = title;
    this.author = author;
    this.numberOfPages = numberOfPages;
    this.isRead = isRead;
    this.info = function() {
        return this.title + ' by ' + this.author + ', ' + this.numberOfPages + ' pages, ' + this.isRead;
    };
}

let theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 295, "not read yet");
let aSingleMan = new Book("A Single Man", "Christopher Isherwood", 186, "read");

