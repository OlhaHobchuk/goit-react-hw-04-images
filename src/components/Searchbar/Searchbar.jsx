import { useState } from 'react';
import Notiflix from 'notiflix';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import css from './Searchbar.module.css';
import 'react-toastify/dist/ReactToastify.css';
import { FcSearch } from 'react-icons/fc';

export const Searchbar = ({ onSubmit }) => {
  const [keyWord, setKeyWord] = useState('');

  const handleSearchChange = event => {
    setKeyWord(event.currentTarget.value.toLowerCase());
  };

  const handleFormSubmit = event => {
    event.preventDefault();
    const query = keyWord.trim().toLocaleLowerCase();
    if (query === '') {
      Notiflix.Notify.info('Please enter something');
      return;
    }
    onSubmit(query);

    event.currentTarget.reset();
  };

  return (
    <header className={css.searchbar}>
      <form className={css.form} onSubmit={handleFormSubmit}>
        <button type="submit" className={css.searchFormButton}>
          <span className={css.buttonLabel}>
            <FcSearch />
          </span>
        </button>

        <input
          name="searchWord"
          className={css.input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={handleSearchChange}
        />
      </form>
    </header>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
