/* Note: Modal CSS and JS inspired by
  - https://tympanus.net/Development/ModalWindowEffects/
  - https://alligator.io/react/modal-component/
  - https://assortment.io/posts/accessible-modal-component-react-portals-part-1
  - https://github.com/udacity/ud891/tree/gh-pages/lesson5-semantics-aria/21-dialog
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ShelfSelect from './ShelfSelect.js';
import BookModal from './BookModal.js';

class Book extends Component {
  state = {
    shelf: '',
    shouldShowModal: false,
    isShelfDropdownFocused: false
  }

  static propTypes = {
    book: PropTypes.object.isRequired,
    onMoveBookToNewShelf: PropTypes.func.isRequired,
    displayShelfIcon: PropTypes.bool.isRequired,
    page: PropTypes.string.isRequired
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.setState({ shelf: this.props.book.shelf });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // Toggle shelf dropdown focus state and thus focus styling
  toggleShelfDropdownFocus = () => {
    if (this.state.isShelfDropdownFocused === true) {
      if (this._isMounted === true) {
        this.setState({ isShelfDropdownFocused: false });
      }
    } else {
      if (this._isMounted === true) {
        this.setState({ isShelfDropdownFocused: true });
      }
    }
  }

  // Toggle the ability to scroll the background page content (for when the
  // modal is currently open)
  toggleScrollingAbility = () => {
    document.querySelector('html').classList.toggle('disable-scrolling');
  }

  // Reveal the modal and disable scrolling the background page content
  showModal = () => {
    if (this._isMounted === true) {
      this.setState({ shouldShowModal: true });
    }
    this.toggleScrollingAbility();
    // Hide background content from screen readers that don't support aria-modal
    document.querySelector('#root').setAttribute('aria-hidden', true);
  }

  // Hide the modal and enable scrolling the background
  hideModal = () => {
    if (this._isMounted === true) {
      this.setState({ shouldShowModal: false, shelf: this.props.book.shelf });
    }
    // Return focus back to where it was before opening the modal
    this.openModalButton.focus();
    this.toggleScrollingAbility();
    // Reveal background content to screen readers that don't support aria-modal
    document.querySelector('#root').removeAttribute('aria-hidden');
  }

  // Format the string displaying the names of the authors of the book
  // according to how many authors were found
  formatAuthors() {
    // Get the authors array
    let authorsArray = this.props.book.authors;
    // To store the final, desired string displaying all the author names
    let authorsString = '';

    if (authorsArray === undefined) {
      authorsString = 'Authors unknown'
    } else if (authorsArray.length === 1) {
      authorsString = authorsArray[0]
    } else if (authorsArray.length === 2) {
      authorsString = `${authorsArray[0]} and ${authorsArray[1]}`
    } else {
      for (let i=0; i<authorsArray.length-1; i++) {
        authorsString += `${authorsArray[i]}, `;
      }
      authorsString += `and ${authorsArray[authorsArray.length-1]}`
    }

    return authorsString;
  }

  // Determine the thumbnail URL. If the book doesn't have one, then
  // use a default missing cover thumbnail image.
  determineThumbnail() {
    if (this.props.book.imageLinks && this.props.book.imageLinks.smallThumbnail) {
      return `${this.props.book.imageLinks.smallThumbnail}`;
    } else {
      return `${process.env.PUBLIC_URL + '/images/missing-thumbnail.PNG'}`;
    }
  }

  render() {
    // Determine whether to display the modal
    let modal;
    if (this.state.shouldShowModal === true) {
      modal = <BookModal
        show={this.state.shouldShowModal}
        handleCloseModal={this.hideModal}
        book={this.props.book}
        thumbnail={this.determineThumbnail()}
        onMoveBookToNewShelf={this.props.onMoveBookToNewShelf}
        toggleShelfDropdownFocus={this.toggleShelfDropdownFocus}
        shelf={this.state.shelf}
      >
        <p>Modal</p>
        <p>Data</p>
      </BookModal>;
    } else {
      modal = '';
    }

    return (
      <li className="book">
        <div className="book-top">
          <button
            type="button"
            onClick={this.showModal}
            ref={node => this.openModalButton = node}
            aria-label={`Click for more information regarding the book ${this.props.book.title}`}
            className="book-cover"
            style={{
              width: 128,
              height: 192,
              backgroundImage: `url("${this.determineThumbnail()}")`
            }}>
          </button>
          <ShelfSelect
            isParentBook={true}
            book={this.props.book}
            onMoveBookToNewShelf={this.props.onMoveBookToNewShelf}
            redirectShelfDropdownFocus={true}
            toggleShelfDropdownFocus={this.toggleShelfDropdownFocus}
            isShelfDropdownFocused={this.state.isShelfDropdownFocused}
            displayShelfIcon={this.props.displayShelfIcon}
            page={this.props.page}
            shelf={this.state.shelf}
          />
        </div>
        <p className="book-title">{this.props.book.title}</p>
        <p className="book-authors">{this.formatAuthors()}</p>
        {modal}
      </li>
    );
  }
}

export default Book;
