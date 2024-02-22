function showMovieDetails(movie) {
  const modal = document.getElementById('movieDetailsModal');
  const titleElement = document.getElementById('movieDetailsTitle');
  const imageElement = document.getElementById('movieDetailsImage');
  const releaseDateElement = document.getElementById('movieDetailsReleaseDate');

  titleElement.textContent = movie.originalTitleText.text;
  imageElement.src = movie.primaryImage.url;
  releaseDateElement.textContent = `Release Date: ${movie.releaseDate.day}/${movie.releaseDate.month}/${movie.releaseDate.year}`;

  // Show the modal
  modal.style.display = 'block';
}

function closeMovieDetailsModal() {
  const modal = document.getElementById('movieDetailsModal');
  // Hide the modal
  modal.style.display = 'none';
}