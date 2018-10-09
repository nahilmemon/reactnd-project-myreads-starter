import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Bookshelf from './Bookshelf.js';

class Library extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    onMoveBookToNewShelf: PropTypes.func.isRequired
  }

  render() {
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            <Bookshelf
              title="Currently Reading"
              shelf="currentlyReading"
              books={this.props.books.filter((book) => (
                book.shelf === "currentlyReading"
              ))}
              onMoveBookToNewShelf={this.props.onMoveBookToNewShelf}
            />
            <Bookshelf
              title="Want to Read"
              shelf="wantToRead"
              books={this.props.books.filter((book) => (
                book.shelf === "wantToRead"
              ))}
              onMoveBookToNewShelf={this.props.onMoveBookToNewShelf}
            />
            <Bookshelf
              title="Read"
              shelf="read"
              books={this.props.books.filter((book) => (
                book.shelf === "read"
              ))}
              onMoveBookToNewShelf={this.props.onMoveBookToNewShelf}
            />
          </div>
        </div>
        <div className="open-search">
          <Link
            to="/search"
          >Add a book</Link>
        </div>
      </div>
    );
  }
}

export default Library