export class Book {
  constructor({
    id,
    title,
    author,
    subjects = [],
    coverSmall,
    coverLarge,
    language = null,
    description = null,
    pages = null,
    ageRanges = [],
  }) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.subjects = subjects;
    this.coverSmall = coverSmall;
    this.coverLarge = coverLarge;
    this.language = language;
    this.description = description;
    this.pages = pages;
    this.ageRanges = ageRanges; 
  }
}