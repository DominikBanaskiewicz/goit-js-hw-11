'use strict';
const userKey = '31780969-fdde0daea91119d814167c909';
import axios from 'axios';
import Notiflix from 'notiflix';
const loadMoreBtn = document.querySelector('.load-more');
const searchInput = document.querySelector('form input');
const searchBtn = document.querySelector('form button');

const gallery = document.querySelector('.gallery');
let talicaElementow = [];

let pageCounter = 1;
let isFirstSearch = true;
loadMoreBtn.style.display = 'none';

gallery.addEventListener('click', event => {
  event.preventDefault();
  console.log(event.target.parentElement);
});
searchBtn.addEventListener('click', event => {
  event.preventDefault();
  newSearch(searchInput.value);
});

const imagesData = async searchString => {
  await axios(
    `https://pixabay.com/api/?key=${userKey}&q=${searchString}&image_type=photo$orientation=horizontal&safesearch=true?fields=webformatURL,largeImageURL,tags,likes,views,comments,downloads&per_page=40&page=${pageCounter}`
  )
    .then(function (response) {
      console.log(response);

      if (response.data.hits.length != 0) {
        copyImagesProperties(response.data.hits);

        renderImages(response.data.hits);
        if (pageCounter === 1) {
          loadMoreBtn.style.display = 'block';
          Notiflix.Notify.info(
            `Hooray! We found ${response.data.total} images.`
          );
          if (response.data.hits.length < 40) {
            endReached();
          }
        }
      } else {
        return Notiflix.Notify.info(
          '"Sorry, there are no images matching your search query. Please try again."'
        );
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Server error');
      console.log('errorrr: ', error);
    });
};
const fetchImages = async searchString => {
  try {
    const response = await axios(
      `https://pixabay.com/api/?key=${userKey}&q=${searchString}&image_type=photo$orientation=horizontal&safesearch=true?fields=webformatURL,largeImageURL,tags,likes,views,comments,downloads&per_page=40&page=${pageCounter}`
    );
    if (response.data.hits.length != 0) {
      copyImagesProperties(response.data.hits); // dla simplelightbox

      renderImages(response.data.hits);
      if (pageCounter === 1) {
        loadMoreBtn.style.display = 'block';
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

const copyImagesProperties = data => {
  data.map(elem => {
    talicaElementow.push(elem);
  });
};

const renderImages = data => {
  isFirstSearch = false;
  console.log(data);
  const element = data
    .map(elem => {
      return `
      <div class="photo-card">
       <a href=${elem.largeImageURL}><img src="${elem.webformatURL}" width="300" height="200" alt="" loading="lazy" /></a>
      <div class="info">
     <p class="info-item">
        <b>Likes: ${elem.likes}</b>
      </p>
     <p class="info-item">
        <b>Views: ${elem.views}</b>
     </p>
     <p class="info-item">
       <b>Comments :${elem.comments}</b>
      </p>
      <p class="info-item">
         <b>Downloads :${elem.downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', element);
};
const endReached = () => {
  Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
  loadMoreBtn.style.display = 'none';
};
loadMoreBtn.addEventListener('click', () => {
  pageCounter += 1;
  fetchImages(searchInput.value);
});
