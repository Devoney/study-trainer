<template>
  <div>
    <div class="row">
      <div class="col has-error">
        <edit-book v-if="store.state.bookEdited !== undefined"/>
        <add-book
          v-else 
          ref="addBook"
          @title-changed="titleChanged"
          :err-message="titleIsNotValidMessage"
          @add="add"
        />        
      </div>
    </div>
    <div class="row book-table">
      <div class="col">
        <book-table :books="books"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component';
import _ from 'lodash';
import $ from 'jquery';
import { Component, Prop, Vue } from 'vue-property-decorator';
import 'bootstrap';
import uuid from 'uuid/v1';
import IState from '@/state/IState';
import { Store } from 'vuex';
import MutationTypes from '@/state/MutationTypes';

import Book from '@/models/Book';

import AddBook from '@/components/books/AddBook.vue';
import EditBook from '@/components/books/EditBook.vue';
import BookTable from '@/components/books/BookTable.vue';
import StoreMixin from '@/mixins/StoreMixin';

@Component({
  components: {
    AddBook,
    EditBook,
    BookTable,
  },
})
export default class BookManager extends mixins(StoreMixin) {
  private titleIsNotValidMessage: string = '';

  get books(): Book[] {
    return this.store.state.books;
  }

  private add(title: string): void {
    if (_.isEmpty(_.trim(title))) { return; }
    if (this.titleAlreadyInCollection(title)) { return; }

    const books = this.books;
    const id = uuid();
    const book = new Book(id, title);
    this.store.commit(MutationTypes.Book.addBook, book);
  }

  private titleChanged(title: { new: string, old: string }): void {
    if (title.new === undefined || title.new === '') {
      this.titleIsNotValidMessage = '';
      return;
    }

    const titleLowerCase = title.new.toLowerCase();
    const titleExists = _.findIndex(this.books, (b) => {
      return b.title.toLowerCase() === titleLowerCase;
    }) !== -1;

    this.titleIsNotValidMessage = titleExists ? 'Title already exists.' : '';
  }

  private titleAlreadyInCollection(title: string): boolean {
    const lowerCaseTitle = title.toLowerCase();
    return _.findIndex(this.books, (b: Book) => {
      return b.title.toLowerCase() === lowerCaseTitle;
    }) !== -1;
  }
}
</script>

<style scoped>
.book-table {
  margin-top: 20px;
}
</style>