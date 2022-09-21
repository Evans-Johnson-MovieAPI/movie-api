//----------------------- MY MOVIES ------------------------

// FETCH FUNCTION: Returns Array
// PROTOTYPE: fetchMyMovies();
const fetchMyMovies = async()=>{
    try {
        const res = await fetch("https://grass-orchid-breath.glitch.me/movies");
        const data = await res.json();
        return data;
    } catch (e) {
        console.log("Error Occurred :(", e);
    }
};


// POST FUNCTION: Add a movie to My Movies DB, using imdbId
// RUNS: fetchMovieFromAPI(id) & fetchMyMovies()
// PROTOTYPE: postToMyMovies('tt0104431')
const postToMyMovies = async (id)=>{
    try{
        const movie = await fetchMovieFromAPI(id);
        fetch("https://grass-orchid-breath.glitch.me/movies", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movie),
        }).then(fetchMyMovies);
    } catch (e) {
        console.log("Error Occurred :(", e);
    }
}

// PATCH FUNCTION: Update a movie, using movie object
// RUNS: fetchMyMovies()
// PROTOTYPE: matchMyMovie(movie);
const patchMyMovie = (movie) => {
    try{
        fetch(`https://grass-orchid-breath.glitch.me/movies/${movie.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movie),
        }).then(fetchMyMovies);
    } catch (e) {
        console.log(`Error Occurred: ${e}`)
    }
}

// DELETE FUNCTION: Deletes a movie, using movie id
// RUNS: fetchMyMovies()
// PROTOTYPE: deleteMyMovie(id);
const deleteMyMovie = (id) => {
    try{
        fetch(`https://grass-orchid-breath.glitch.me/movies/${id}`, {
            method: 'DELETE',
        }).then(fetchMyMovies);
    } catch (e) {
        console.log("Error Occurred :(", e);
    }
}

//----------------------- MOVIES  API ------------------------

// FETCH FUNCTION: Returns array, using keyword
// PROTOTYPE: fetchMoviesListFromAPI('keyword');
const fetchMoviesListFromAPI = async (keyword = "top")=>{
    try {
        const res = await fetch(`https://www.omdbapi.com?s=${keyword}&apikey=thewdb`);
        const data = await res.json();
        return data.Search;
    } catch (e) {
        console.log("Error Occurred :(", e);
    }
}

// FETCH FUNCTION: Returns a movie object using imdbId
// PROTOTYPE: fetchMovie('tt0104431');
const fetchMovieFromAPI = async (input)=>{
    try {
        const res = await fetch(`https://www.omdbapi.com?i=${input}&apikey=thewdb`);
        const data = await res.json();
        const {Title, Year, Rated, Genre, Plot, Director, Poster, imdbID} = await data
        return {Title, Year, Rated, Genre, Plot, Director, Poster, imdbID};
    } catch (e) {
        console.log("Error Occurred :(", e);
    }
}

//----------------------- REUSABLE FUNCTIONS ------------------------

// RENDER FUNCTION: Render html, using array (optional: list)
// PROTOTYPE: renderMovies(array) OR renderMovies(array, list)
const renderMovies = async (movies, list) => {
    const cards = document.querySelector('#cards');
    const titles = document.querySelector('#banner');
    titles.innerHTML = (list === "discover") ? "<h1>Discover Movies</h1>" : "<h1>My Movies</h1>"
    cards.innerHTML = ""
    movies.forEach(({Title, Year, Rated, Genre, Plot, Director, Poster, imdbID}) => {
        cards.innerHTML += `
        <div class="card" style="width: 15rem;">
          <img src=${Poster} class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${Title}</h5>
            <p class="card-text">Rated: ${Rated}</p>
            <p class="card-text">Genre: ${Genre}</p>
            <p class="card-text">Year: ${Year}</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>
        `
    })
}

// SEARCH FUNCTION: Returns a filtered array
// PROTOTYPE: searchMovies(array)
const searchMovies = (movies) =>{

}


//----------------------- EVENT LISTENERS ------------------------

// MY MOVIES IN NAVBAR
document.querySelector('#myMovies').addEventListener('click', async (e)=>{
    e.preventDefault();
    await renderMovies(await fetchMyMovies());
})

// DISCOVER MOVIES IN NAVBAR
document.querySelector('#discover').addEventListener('click', async (e)=>{
    e.preventDefault();
    await renderMovies(await fetchMoviesListFromAPI(), "discover");
})

