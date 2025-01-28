document.addEventListener('DOMContentLoaded', () => {
    /*const movieCategories = {
                "must-see-movies": [
                    { title: "Donnie Darko", year: 2001, duration: 113, rating: 8.0, imgSrc: "image1.jpg" },
                    { title: "Donnie Darko", year: 2001, duration: 113, rating: 8.0, imgSrc: "image1.jpg" },
                    { title: "Donnie Darko", year: 2001, duration: 113, rating: 8.0, imgSrc: "image1.jpg" },
                    { title: "Donnie Darko", year: 2001, duration: 113, rating: 8.0, imgSrc: "image1.jpg" },
                    { title: "Donnie Darko", year: 2001, duration: 113, rating: 8.0, imgSrc: "image1.jpg" },
                    { title: "Donnie Darko", year: 2001, duration: 113, rating: 8.0, imgSrc: "image1.jpg" },
                    { title: "Donnie Darko", year: 2001, duration: 113, rating: 8.0, imgSrc: "image1.jpg" },
                    { title: "Donnie Darko", year: 2001, duration: 113, rating: 8.0, imgSrc: "image1.jpg" }
                ],
                "romantic-comedies": [
                    { title: "The Accidental Husband", year: 2008, duration: 90, rating: 5.6, imgSrc: "image1.jpg" },
                    { title: "The Accidental Husband", year: 2008, duration: 90, rating: 5.6, imgSrc: "image1.jpg" },
                    { title: "The Accidental Husband", year: 2008, duration: 90, rating: 5.6, imgSrc: "image1.jpg" }
                ],
                "highly-rated-documentaries": [
                    { title: "Song for SPAMA", year: 2017, duration: 129, rating: 6.7, imgSrc: "image1.jpg" },
                    { title: "Song to Song", year: 2017, duration: 129, rating: 6.7, imgSrc: "image1.jpg" },
                    { title: "Song to Song", year: 2017, duration: 129, rating: 6.7, imgSrc: "image1.jpg" }
                ]
            }; //TAR7O3OF01

    

            //Object.keys(movieCategories).forEach(category => {
            for (const category in movieCategories) {
                const categoryElement = document.getElementById(category).querySelector('.movies');
                movieCategories[category].forEach(movie => {
                    const movieElement = document.createElement('div');
                    movieElement.classList.add('movie');
                    movieElement.innerHTML = `
                        <img src="${movie.imgSrc}" alt="${movie.title}">
                        <div class="info">
                            <h3>${movie.title}</h3>
                            <p>Release Year: ${movie.year}</p>
                            <p>Duration: ${movie.duration} min</p>
                            <p>Rating: ${movie.rating}</p>
                        </div>
                    `;
                    categoryElement.appendChild(movieElement);

                });
            }
            //});*/

    const apiKey = '7c6c829043c9d09c77aa63d946a2038e';
    const baseUrl = 'https://api.themoviedb.org/3';

    const fetchGenres = async() => {
        const response = await fetch(`${baseUrl}/genre/movie/list?api_key=${apiKey}`);
        const data = await response.json();
        return data.genres;
    };

    const fetchMovies = async(genreId) => {
        const response = await fetch(`${baseUrl}/discover/movie?with_genres=${genreId}&api_key=${apiKey}`);
        const data = await response.json();
        return data.results;
    };
    const searchMovies = async(query) => {
        const response = await fetch(`${baseUrl}/search/movie?query=${query}&api_key=${apiKey}`);
        const data = await response.json();
        return data.results;
    };

    const renderMovies = (movies, categoryElement) => {
        categoryElement.innerHTML = '';
        movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');
            movieElement.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
                <div class="info">
                    <h3>${movie.title}</h3>
                    <p>Release Year: ${new Date(movie.release_date).getFullYear()}</p>
                    <p>Rating: ${movie.vote_average}</p>
                </div>
            `;
            movieElement.addEventListener('click', () => showMovieDetails(movie));
            categoryElement.appendChild(movieElement);
        });
    };


    const showMovieDetails = (movie) => {
        const modal = document.getElementById('movie-modal');
        document.getElementById('modal-title').textContent = movie.title;
        document.getElementById('modal-poster').src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
        document.getElementById('modal-overview').textContent = movie.overview;
        document.getElementById('modal-release-date').textContent = movie.release_date;
        document.getElementById('modal-rating').textContent = movie.vote_average;

        const playButton = document.getElementById('play-movie');
        playButton.onclick = () => {
            window.open(`https://www.themoviedb.org/movie/${movie.id}`, '_blank');
        };

        modal.classList.add('visible');
    };


    const closeModal = () => {
        document.getElementById('movie-modal').classList.remove('visible');
    };

    document.getElementById('close-modal').addEventListener('click', closeModal);


    const init = async() => {
        const genres = await fetchGenres();

        genres.forEach(async(genre) => {
            const categoryElement = document.createElement('div');
            categoryElement.id = genre.name.toLowerCase().replace(/ /g, '-');
            categoryElement.innerHTML = `
                <h2>${genre.name}</h2>
                <div class="movies"></div>
            `;
            document.body.appendChild(categoryElement);

            const movies = await fetchMovies(genre.id);
            renderMovies(movies, categoryElement.querySelector('.movies'));
        });
    };
    document.getElementById('search-button').addEventListener('click', async() => {
        const query = document.getElementById('search-bar').value;
        if (query) {
            const searchResultsContainer = document.getElementById('search-results');
            const movies = await searchMovies(query);
            renderMovies(movies, searchResultsContainer);
        }
    });
    init();

});