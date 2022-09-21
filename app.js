//----------------------- MOVIES ------------------------
const loader = document.querySelector('.loader-container')
const timeout = () => {
    loader.style.display = 'none';
}
window.addEventListener('load', () => {
    setTimeout(timeout, 3000)
})

// FUNCTION: Displays My Movies
// PROTOTYPE: getMyMovies();


const getMyMovies = async()=>{
    try {
        const res = await fetch("https://grass-orchid-breath.glitch.me/movies");
        const data = await res.json();
        return data;
    } catch (e) {
        console.log("Error Occurred :(", e);
    }
};
getMyMovies();

// FUNCTION: POST a movie to My Movies JSON (runs fetchMovieFromAPI() & getMyMovies())
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
        }).then(getMyMovies);
    } catch (e) {
        console.log("Error Occurred :(", e);
    }
}

// FUNCTION: FETCH a movie from MOVIE API
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
const editedMovie = {
    //USE BTN CLICK VALUE TO CHOOSE THE MOVIE THAT IS EDITED
    "Title": "Movie",
    "id" : "5"
};

//FUNCTION: UPDATES MOVIE BASED ON MOVIE ID
const updateMyMovies = (movie) => {
    try{
        fetch(`https://grass-orchid-breath.glitch.me/movies/${movie.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movie),
        }).then(getMyMovies);
    } catch (e) {
        console.log(`Error Occurred: ${e}`)
    }
}


//FUNCTION DELETES MOVIE BASED ON MOVIE ID
const deleteMyMovie = (id) => {
    try{
        fetch(`https://grass-orchid-breath.glitch.me/movies/${id}`, {
            method: 'DELETE',
        }).then(getMyMovies);
    } catch (e) {
        console.log("Error Occurred :(", e);
    }
}

const renderMyMovies = async () => {
const flick = await getMyMovies()
    console.log(flick)
    let cards = document.querySelector('#cards')
    cards.innerHTML = ""
    flick.forEach(({Title, Year, Rated, Genre, Plot, Director, Poster, imdbID}) => {
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
renderMyMovies()