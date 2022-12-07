export { fetchImages };

const fetchImages = async imageName => {
  const response = await fetch(
    `https://pixabay.com/api/?key=31780969-fdde0daea91119d814167c909&q=${imageName}&image_type=photo$orientation=horizontal&safesearch=true?fields=webformatURL,largeImageURL,tags,likes,views,comments,downloads`
  ).catch(() => {
    console.log('Serwer error');
  });
  if (response.ok) {
    return response.json();
  }
};
