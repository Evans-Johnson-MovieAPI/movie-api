//----------------------- LOADER ------------------------
const loader = document.querySelector('#loader-container')
const load = () => { loader.style.visibility = 'visible'; }
const timeout = () => { loader.style.visibility = 'hidden'; }

//----------------------- MY MOVIES ------------------------

// FETCH FUNCTION: Returns Array
// PROTOTYPE: fetchMyMovies();
const fetchMyMovies = async () => {
    try {
        load();
        const res = await fetch("https://grass-orchid-breath.glitch.me/movies");
        const data = await res.json();
        timeout();
        return data;
    } catch (e) {
        console.log("Error Occurred :(", e);
    }
};


// POST FUNCTION: Add a movie to My Movies DB, using imdbId
// RUNS: fetchMovieFromAPI(id) & fetchMyMovies()
// PROTOTYPE: postToMyMovies('tt0104431')
const addMyMovies = async (id) => {
    try {
        const movie = await fetchAPIMovie(id);
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
const editMyMovie = (movie) => {
    try {
        timeout();
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
const searchMyMovies = async (movies, keyword) => {
    // // const filteredMovies = [];
    //
    // const filteredMovies =  movies.reduce((accumulator, movie) => {
    //         movie.forEach(keyValue => {
    //             keyValue.toString().split(' ').forEach(word => {
    //                 if (word.toLowerCase().includes(keyword.toLowerCase())) {
    //                     return [...new Set([...accumulator, movie])]
    //                 }
    //             })
    //         })
    //     return accumulator;
    //     },[]
    // );
    for (let i = 0; i < movies.length; i++) {
        const values = Object.values(movies[i]);
        values.forEach(value => {
            value.toString().split(' ').forEach(word => {
                if (word.toLowerCase().includes(keyword.toLowerCase())) {
                    filteredMovies.push(movies[i]);
                }
            })
        })
    }
    return filteredMovies;
}

//----------------------- MOVIES  API ------------------------

// FETCH FUNCTION: Returns array, using keyword
// PROTOTYPE: fetchMoviesListFromAPI('keyword');
const fetchAPIList = async (keyword = "top") => {
    try {
        load();
        const res = await fetch(`https://www.omdbapi.com?s=${keyword.trim()}&apikey=thewdb`);
        const data = await res.json();
        const movies = data.Search;

        // Gather detailed descriptions
        let detailedMovies = [];
        for (let i = 0; i < movies.length; i++) {
            let movie = await fetchAPIMovie(movies[i].imdbID);
            detailedMovies.push(movie);
        }

        timeout();
        return detailedMovies;
    } catch (e) {
        console.log("Error Occurred :(", e);
    }
}

// FETCH FUNCTION: Returns a movie object using imdbId
// PROTOTYPE: fetchMovie('tt0104431');
const fetchAPIMovie = async (input) => {
    try {
        const res = await fetch(`https://www.omdbapi.com?i=${input}&apikey=thewdb`);
        const data = await res.json();
        return {Title, Year, Rated, Genre, Plot, Director, Poster, imdbID} = await data;
    } catch (e) {
        console.log("Error Occurred :(", e);
    }
}

//----------------------- REUSABLE FUNCTIONS ------------------------

// RENDER CARDS FUNCTION: Render html, using array (optional: list)
// PROTOTYPE: renderMovies(array) OR renderMovies(array, list)
const renderMovies = async (movies) => {
    const insertCards = document.querySelector('#cards');
    const insertH1 = document.querySelector('#banner');

    // Reset Page: h1 renamed & cards cleared
    insertH1.innerHTML = (isDiscover) ? "<h1>Discover Movies</h1>" : "<h1>My Movies</h1>";
    insertCards.innerHTML = "";

    // Render new cards to page
    movies.forEach(movie => {
        insertCards.innerHTML += `
        <div data-movie="${movie.imdbID}" class="card mb-3" style="width: 15rem;">
              <img src=${movie.Poster} class="card-img-top" alt="...">
              <div class="card-body">
                    <h5 class="card-title">${movie.Title}</h5>
                    <span style="font-size: 0.7em">${movie.Rated}</span>
                    <p class="card-text" style="font-size: 0.7em">Genre: ${movie.Genre}</span></p>
                    <!-- Button trigger modal -->
                    <button data-movie="${movie.imdbID}" type="button" class="btn btn-primary modalBtn" data-bs-toggle="modal" data-bs-target="#movieModal">
                      View Details
                    </button>
            </div>
        </div>
        `
    })
    addModalEffect();
}

const updateModal = async (movie) =>{
    // Destructure
    const {Title, Year, Rated, Genre, Plot, Director, Poster, imdbID} = movie;
    // if (!isDiscover) const {imdbID} = movie
    // Selectors
    // const addBtn = document.querySelector('.add-btn')
    // addBtn.setAttribute('id', `${imdbID}`)

    const modalTitle = document.querySelector('#ModalLabel');
    const modalBody = document.querySelector('.modal-body');
    const movieModal = document.querySelector('#movieModal');
    const modalFooter = document.querySelector('.modal-footer')

    // Update Modal Information
    movieModal.setAttribute('data-movie', imdbID);
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
    switch (isDiscover) {
        case true:
            modalFooter.innerHTML = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary save-movie " id=${imdbID}>Save Movie</button>
        `
            addSaveListener(`${imdbID}`)
            break;
        case false:
            modalFooter.innerHTML = `
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary update-movie" id=${imdbID}>Update Movie</button>
            `
            addEditListener(`${imdbID}`)
            break;
    }


};
    const addEditListener = (id) => {
        let updateBtn = document.querySelector('.update-movie')
        // let updateID = updateBtn.getAttribute('id')
        updateBtn.addEventListener('click', (e) => {

            console.log(id)
        })

    }
    const addSaveListener = async (id) => {

        let saveBtn = document.querySelector('.save-movie')
        // let saveID = saveBtn.getAttribute('id')
        saveBtn.addEventListener('click', (e) => {
            e.target
             addMyMovies(id)
            console.log(id)
        })
    }
//----------------------- VARIABLES ------------------------

let isDiscover = false;
const searchBar = document.querySelector("#searchKeyword");



//----------------------- RENDER MY MOVIES ONLOAD ------------------------
(async () => {
    isDiscover = false;
    await renderMovies(await fetchMyMovies());
})();


//----------------------- EVENT LISTENERS ------------------------

// NAVBAR: MY MOVIES
document.querySelector('#myMovies').addEventListener('click', async (e) => {
    e.preventDefault();
    isDiscover = false;
    await renderMovies(await fetchMyMovies());
})

// NAVBAR: DISCOVER MOVIES
document.querySelector('#discover').addEventListener('click', async (e) => {
    e.preventDefault();
    isDiscover = true;
    await renderMovies(await fetchAPIList());
})

// NAVBAR: SEARCH
document.querySelector("#searchBtn").addEventListener('click', async (e) => {
    try {
        e.preventDefault();
        const keyword = searchBar.value;
        const searchedMovies = (isDiscover) ?
            await fetchAPIList(keyword) :
            await searchMyMovies(await fetchMyMovies(), keyword);
        await renderMovies(searchedMovies);
    } catch (e) {
        console.log("Error Occurred :(", e);
    }
})

// MODAL: UPDATE MODAL INFORMATION
const addModalEffect = ()=>{
    document.querySelectorAll('.modalBtn').forEach(btn => {
        btn.addEventListener('click', async (e)=>{
            const movie = await fetchAPIMovie(btn.getAttribute('data-movie'));
            console.log(movie);
            await updateModal(movie)
        })
    })
}
