'use strict';
const userKey = '31780969-fdde0daea91119d814167c909';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const loadMoreBtn = document.querySelector('.load-more');
const searchInput = document.querySelector('form input');
const searchBtn = document.querySelector('form button');
const loadMoreDiv = document.querySelector('.load-more-footer');

const gallery = document.querySelector('.gallery');
let pageCounter = 1;
let simpleGallery = new SimpleLightbox('.gallery a');
let isFirstSearch = true;
loadMoreBtn.style.display = 'none';
loadMoreDiv.style.display = 'none';

searchBtn.addEventListener('click', event => {
  event.preventDefault();
  newSearch(searchInput.value);
});

const fetchImages = async searchString => {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${userKey}&q=${searchString}&image_type=photo$orientation=horizontal&safesearch=true?fields=webformatURL,largeImageURL,tags,likes,views,comments,downloads&per_page=40&page=${pageCounter}`
    );

    if (response.data.hits.length != 0) {
      renderImages(response.data.hits);
      if (pageCounter === 1) {
        simpleGallery.refresh();
        loadMoreBtn.style.display = 'block';
        loadMoreDiv.style.display = 'flex';
        Notiflix.Notify.info(`Hooray! We found ${response.data.total} images.`);
        if (response.data.hits.length < 40) {
          endReached();
        }
      }
    } else {
      return Notiflix.Notify.info(
        '"Sorry, there are no images matching your search query. Please try again."'
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const newSearch = searchString => {
  if (!isFirstSearch) {
    gallery.innerHTML = '';
    pageCounter = 1;
  }
  fetchImages(searchString);
};

const renderImages = data => {
  isFirstSearch = false;
  // console.log(data);
  const element = data
    .map(elem => {
      return `
      <div class="photo-card">
       <a href=${elem.largeImageURL}><img src="${elem.webformatURL}" width="300" height="200" alt="" loading="lazy" /></a>
      <div class="info">
     <p class="info-item">
        <b><span>Likes:</span></b> <span> ${elem.likes}</span>
      </p>
     <p class="info-item">
        <b><span>Views:</span></b><span>${elem.views}</span>
     </p>
     <p class="info-item">
       <b><span>Comments:</span></b>${elem.comments}</span>
      </p>
      <p class="info-item">
         <b><span>Downloads:</span></b><span>${elem.downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', element);
  simpleGallery.refresh();
};
const endReached = () => {
  Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
  loadMoreBtn.style.display = 'none';
  loadMoreDiv.style.display = 'none';
};
loadMoreBtn.addEventListener('click', () => {
  pageCounter += 1;

  fetchImages(searchInput.value);
});
