//----------------------- MY MOVIES ------------------------

// FETCH FUNCTION: Returns Array
// PROTOTYPE: fetchMyMovies();
const fetchMyMovies = async () => {
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
const postToMyMovies = async (id) => {
    try {
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
    try {
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
    try {
        fetch(`https://grass-orchid-breath.glitch.me/movies/${id}`, {
            method: 'DELETE',
        }).then(fetchMyMovies);
    } catch (e) {
        console.log("Error Occurred :(", e);
    }
}

// SEARCH FUNCTION: Returns a filtered array
// PROTOTYPE: searchMovies(array, keyword)
const filterMyMovies = async (movies, keyword) => {
    const filteredMovies = [];
    for (let i = 0; i < movies.length; i++) {
        const values = Object.values(movies[i]);
        values.forEach(value => {
            value.toString().split(' ').forEach(word => {
                if (word.toLowerCase().includes(keyword.toLowerCase()))
                    filteredMovies.push(movies[i]);
            })
        })
    }
    return filteredMovies;
}

//----------------------- MOVIES  API ------------------------

// FETCH FUNCTION: Returns array, using keyword
// PROTOTYPE: fetchMoviesListFromAPI('keyword');
const fetchMoviesListFromAPI = async (keyword = "top") => {
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
const fetchMovieFromAPI = async (input) => {
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
        <div class="card" style="width: 15rem;" id="${imdbID}">
              <img src=${Poster} class="card-img-top" alt="...">
              <div class="card-body">
                    <h5 class="card-title">${Title}</h5>
                    <span style="font-size: 0.7em">${Rated}</span>
                    <p class="card-text" style="font-size: 0.7em">Genre: ${Genre}</span></p>
                    <!-- Button trigger modal -->
                    <button type="button" id="${imdbID}" class="btn btn-primary modalBtn" data-bs-toggle="modal" data-bs-target="#movieModal">
                      View Details
                    </button>
            </div>
        </div>
        `
    })
    addModalEffect();
}

const updateModal = async ({Title, Year, Rated, Genre, Plot, Director, Poster, imdbID}) =>{
    const modalTitle = document.querySelector('#ModalLabel');
    const modalBody = document.querySelector('.modal-body');
    modalTitle.textContent = `${Title}`;
    modalBody.innerHTML = '';
    modalBody.innerHTML = `
            <img src=${Poster} class="card-img-top" style="height: 7rem; width: auto; float: left; padding-right:3rem" alt="...">
            <h5>${Title}</h5>
            <span style="font-size: 0.7em">${Rated}</span>
            <p style="font-size: 0.7em">Genre: ${Genre}</span></p>
            <p style="clear: left; padding-top:1rem">${Plot}</p>
            <p>Director: ${Director}</p>
            <p>Released: ${Year}</p>
        </div>
    `
};


//----------------------- RENDER MY MOVIES ONLOAD ------------------------
(async () => {
    await renderMovies(await fetchMyMovies());
})();


//----------------------- EVENT LISTENERS ------------------------

// NAVBAR: MY MOVIES
document.querySelector('#myMovies').addEventListener('click', async (e) => {
    e.preventDefault();
    await renderMovies(await fetchMyMovies());
})

// NAVBAR: DISCOVER MOVIES
document.querySelector('#discover').addEventListener('click', async (e) => {
    e.preventDefault();
    await renderMovies(await fetchMoviesListFromAPI(), "discover");
})

// NAVBAR: SEARCH
document.querySelector("#searchBtn").addEventListener('click', async (e) => {
    try {
        e.preventDefault();
        const list = document.querySelector('h1').innerText.toLowerCase();
        const keyword = document.querySelector("#searchKeyword").value;
        (list.includes('discover') === true) ?
            await renderMovies(await fetchMoviesListFromAPI(keyword)) :
            await renderMovies(await filterMyMovies(await fetchMyMovies(), keyword));
    } catch (e) {
        console.log("Error Occurred :(", e);
    }
})

// MODAL: UPDATE
const addModalEffect = ()=>{
    document.querySelectorAll('.modalBtn').forEach(btn => {
        btn.addEventListener('click', async (e)=>{
            const movie = await fetchMovieFromAPI(btn.id);
            console.log(movie);
            await updateModal(movie)
        })
        // await updateModal(movie);
    })
}