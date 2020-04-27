import { Component, EventEmitter, OnInit, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { LoggerService } from 'src/app/services/logger.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-book-add',
  templateUrl: './book-add.component.html',
  styleUrls: ['./book-add.component.css']
})
export class BookAddComponent implements OnInit, OnChanges {

  @Input() errorMessage = '';
  @Input('invalid-title') set invalidTitle(value: boolean) {
    this.invalidTitle$.next(value);
  }
  @Output('title-changed') titleChanged = new EventEmitter<string>();
  @Output('add') addBook = new EventEmitter<string>();

  invalidTitle$ = new BehaviorSubject<boolean>(false);
  bookTitleIsEmpty$ = new BehaviorSubject<boolean>(true);
  bookTitleIsInvalidAndNotEmpty$ = combineLatest([
    this.invalidTitle$,
    this.bookTitleIsEmpty$,
  ]).pipe(
    map(([invalidTitle, bookTitleIsEmpty]) => {
        return invalidTitle && !bookTitleIsEmpty;
    })
  );

  buttonText = 'Add';
  addBookForm: FormGroup;

  get bookTitle(): string {
    return this.addBookForm.value.bookTitle;
  }

  set bookTitle(value: string) {
    this.addBookForm.setValue({ bookTitle: value });
  }

  constructor(
    private logger: LoggerService,
    private formBuilder: FormBuilder,
  ) {
    this.addBookForm = this.formBuilder.group({
      bookTitle: ''
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.logger.log('Changes: ');
    this.logger.log(changes);
  }

  ok(): void {
    const bookTitle = this.bookTitle;
    if (bookTitle && bookTitle.length > 0) {
      this.addBook.emit(bookTitle);
      this.clear();
    }
  }

  cancel(): void {
    this.clear();
  }

  clear(): void {
    this.addBookForm.reset();
  }

  onTitleChange(): void {
    const bookTitle = this.bookTitle;
    if (!bookTitle) {
      this.bookTitleIsEmpty$.next(true);
    } else {
      this.bookTitleIsEmpty$.next(false);
    }
    this.titleChanged.emit(this.bookTitle);
  }
}