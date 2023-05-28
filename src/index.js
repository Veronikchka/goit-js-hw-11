import { fetchImages } from './js/fetch-images';
import { getImageTemplate } from './js/image-markup';
import { smoothScroll } from './js/smooth-scroll';

import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix';

import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/index.scss';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  formInput: document.querySelector('[name="searchQuery"]'),
};

let page = 1;
const per_page = 40;
let searchQuery = null;
let images = [];
let totalPages = 0;

refs.formInput.setAttribute('required', true);
refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  cleanMarkup();
  searchQuery = e.currentTarget.searchQuery.value.trim();
  lockLoadMoreBtn();
  if (searchQuery === '') {
    cleanMarkup();
    lockLoadMoreBtn();
    Notify.warning('Please enter your query');
    return;
  }

  page = 1;

  const response = await fetchImages(searchQuery, page, per_page);
  const totalImages = response.data.totalHits;
  images = response.data.hits;
  totalPages = totalImages / per_page;

  if (images.length > 0) {
    Notify.success(`Hooray! We found ${totalImages} images.`);
    unlockLoadMoreBtn();
  } else {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    lockLoadMoreBtn();
  }
  cleanMarkup();
  render();
}

async function onLoadMore(e) {
  page += 1;
  const response = await fetchImages(searchQuery, page, per_page);
  images = response.data.hits;
  const totalImages = response.data.totalHits;
  totalPages = totalImages / per_page;

  if (totalPages <= page) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    lockLoadMoreBtn();
  }
  render();
  smoothScroll('.gallery');
}

function render() {
  const items = images;

  const galleryMarkup = items.map(getImageTemplate);

  refs.gallery.insertAdjacentHTML('beforeend', galleryMarkup.join(''));

  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}

function lockLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('hidden');
}

function unlockLoadMoreBtn() {
  refs.loadMoreBtn.classList.toggle('hidden', totalPages <= page);
}

function cleanMarkup() {
  refs.gallery.innerHTML = '';
}