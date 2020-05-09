import { Book } from 'src/app/types/book';
import { Guid } from 'src/tools/Guid';
import { getBookWithTitle, getRandomBook, getRandomBookWithChapters } from 'test/library';
import { getStateWithBooks } from 'test/store';
import {
  selectBookIdToEdit, selectBooks, selectBooksOrderedByTitle, selectBookToEdit,
  selectNrOfBooks, selectSelectedBook, selectSelectedBookId, selectChaptersOfSelectedBook
} from './library.selectors';

describe('LibrarySelectors', () => {
  const book1 = getRandomBook();
  const book2 = getRandomBook();
  const appState = getStateWithBooks(book1, book2);

  it('selectBooks should return books.', () => {
    // Given
    const expected = appState.library.books;

    // When
    const actual = selectBooks.projector(appState.library);

    // Then
    expect(actual).toBe(expected);
  });

  it('Should select count of books', () => {
    // Given
    const expected = appState.library.books.length;

    // When
    const actual = selectNrOfBooks.projector(appState.library.books);

    // Then
    expect(actual).toBe(expected);
  });

  it('Should select book id to edit', () => {
    // Given
    const expected = book1.id;
    appState.library.bookIdToEdit = expected;

    // When
    const actual = selectBookIdToEdit.projector(appState.library);

    // Then
    expect(actual).toBe(expected);
  });

  it('Should select book to edit', () => {
    // Given
    const expected = book1;
    appState.library.bookIdToEdit = expected.id;

    // When
    const actual = selectBookToEdit.projector(appState.library.books, expected.id);

    // Then
    expect(actual).toBe(expected);
  });

  it('Should select selected book id.', () => {
    // Given
    const bookId = Guid.newGuid();
    appState.library.bookIdSelected = bookId;

    // When
    const actual = selectSelectedBookId.projector(appState.library);

    // Then
    expect(actual).toBe(bookId);
  });

  it('Should select selected book', () => {
    // Given
    const books = [book1, book2];

    // When
    const actual = selectSelectedBook.projector(books, book2.id);

    // Then
    expect(actual.id).toBe(book2.id);
  });

  it('Should return books ordered by title.', () => {
    // Given
    const bookZ = getBookWithTitle('z');
    const bookA = getBookWithTitle('a');
    const bookJ = getBookWithTitle('j');

    const books: Array<Book> = [
      bookZ,
      bookA,
      bookJ
    ];

    const expectedOrder: Array<Book> = [
      bookA,
      bookJ,
      bookZ
    ];

    // When
    const actualOrder = selectBooksOrderedByTitle.projector(books);

    // Then
    expect(actualOrder).toEqual(expectedOrder);
  });

  it('Should select chapters of selected book.', () => {
    // Given
    const nrOfChapters = 3;
    const book = getRandomBookWithChapters(nrOfChapters);
    const chapters = book.chapters;

    // When
    const actual = selectChaptersOfSelectedBook.projector(book);

    // Then
    expect(actual).toEqual(chapters);
  });
});
