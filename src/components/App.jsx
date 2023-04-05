import React, { useState, useEffect } from 'react';
import Notiflix from 'notiflix';
import { Searchbar } from './Searchbar/Searchbar';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { fetchImages } from 'api/imageRequest';

import css from './App.module.css';

export const App = () => {
  const [searchWord, setSearchWord] = useState('');
  const [images, setImages] = useState([]);
  const [totalImages, setTotalImages] = useState(0);
  const [page, setPage] = useState(1);
  const [largeImageURL, setlargeImageURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = keyWord => {
    if (keyWord === searchWord) {
      return;
    }
    setSearchWord(keyWord);
    setPage(1);
    setImages([]);
  };

  useEffect(() => {
    if (searchWord.trim() === '') {
      return;
    }
    setLoading(true);

    fetchImages(searchWord, page)
      .then(images => {
        const normalizedImages = images.hits.map(
          ({ id, tags, largeImageURL, webformatURL }) => ({
            id,
            tags,
            largeImageURL,
            webformatURL,
          })
        );

        if (images.hits.length === 0) {
          Notiflix.Notify.info(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          return;
        }

        setTotalImages(images.totalHits);
        setImages(images => [...images, ...normalizedImages]);
      })
      .catch(onError)
      .finally(() => setLoading(false));
  }, [searchWord, page]);

  const onLoadMore = () => {
    setPage(page => page + 1);
  };

  const toggleModal = (largeImageURL = '') => {
    setShowModal(showModal => !showModal);
    setlargeImageURL(largeImageURL);
  };

  const onError = error => {
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  };

  return (
    <div className={css.app}>
      <Searchbar onSubmit={handleSubmit} />
      {images.length > 0 && (
        <>
          <ImageGallery toggleModal={toggleModal} images={images} />
          {loading && <Loader />}
          {totalImages !== images.length && !loading && (
            <Button onLoadMore={onLoadMore} text="Load more" />
          )}
          {showModal && (
            <Modal largeImageURL={largeImageURL} onClose={toggleModal} />
          )}
        </>
      )}
    </div>
  );
};
