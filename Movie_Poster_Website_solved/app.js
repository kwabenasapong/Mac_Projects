const apiKey = "e9c950e0ccmshed64a0f5220776dp16f9fcjsn5f02210c9dfe";
const apiHost = "moviesdatabase.p.rapidapi.com";
const endpoint = "https://moviesdatabase.p.rapidapi.com/titles/x/upcoming";

const headers = {
  "X-RapidAPI-Key": apiKey,
  "X-RapidAPI-Host": apiHost
};

let currentPage = 1;
const moviesPerPage = 10;

const movieGrid = document.getElementById("movieGrid");
//const loadMoreBtn = document.getElementById("loadMoreBtn");

//loadMoreBtn.addEventListener("click", fetchMovies);
window.addEventListener('scroll', handleScroll);

// Function to fetch movies from the API
async function fetchMovies() {
  try {
    console.log(`Fetching movies from page ${currentPage}`);

    const response = await fetch(`${endpoint}?page=${currentPage}&limit=${moviesPerPage}`, { headers });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.results || !Array.isArray(data.results)) {
      console.error("Invalid or missing data in the API response:", data);
      return;
    }

    const movies = data.results;

    if (movies.length === 0) {
      console.warn("No movies found in the response.");
      return;
    }

    console.log("Movies fetched successfully:", movies);

    movies.forEach(movie => {
      // check if movie image is available if not then skip the movie
      if (!movie.primaryImage?.url) {
        console.warn("Skipping movie without image:", movie);
        return;
      }
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
      movieCard.innerHTML = `
        <img src="${movie.primaryImage?.url}" alt="${movie.originalTitleText?.text}" data-movie='${JSON.stringify(movie)}'>
        <h3>${movie.originalTitleText?.text}</h3>
      `;
      movieGrid.appendChild(movieCard);
    });

    // Add an event listener for the entire movie grid
    movieGrid.addEventListener('click', (event) => {
      const movieData = event.target.dataset.movie;
      if (movieData) {
        const movie = JSON.parse(movieData);
        showMovieDetails(movie);
        console.log(`Movie details: \n\tTitle: ${movie.originalTitleText.text} \n\tWeb link: ${movie.primaryImage.url} \n\tRelease Date: ${movie.releaseDate.day}/${movie.releaseDate.month}/${movie.releaseDate.year}`);
      }
    });

    currentPage++;
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

// Function to handle the scroll event
function handleScroll() {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY;
  const clientHeight = document.documentElement.clientHeight;

  // Check if the user has scrolled to the bottom (with a small buffer for accuracy)
  if (scrollHeight - scrollTop - clientHeight < 100) {
    fetchMovies(); // Load more movies when reaching the bottom
  }
}

// Initial load
fetchMovies();