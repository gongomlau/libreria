export class Book {
    constructor(id, title, author, cover, subjects = [], ageRange = null) {
        this.id = id; // "/works/OLxxxxW"
        this.title = title;
        this.author = author;
        this.cover = cover; // URL portada o null
        this.subjects = subjects; // Array de texto
        this.ageRange = ageRange; // "6-8", "8-12", etc
    }
}
