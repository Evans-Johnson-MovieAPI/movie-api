//----------------------- LOADER ------------------------
const loader = document.querySelector('#loader-container')
const load = () => { loader.style.visibility = 'visible'; }
const timeout = () => { loader.style.visibility = 'hidden'; }

//----------------------- MY MOVIES ------------------------

// FETCH FUNCTION: Returns Array
// PROTOTYPE: fetchMyMovies();
const fetchMyMovies = async (id) => {
    try {
        load();
        const res = (id) ? await fetch(`https://grass-orchid-breath.glitch.me/movies/${id}`):
                           await fetch('https://grass-orchid-breath.glitch.me/movies/');
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
        }).then( async ()=>{
            isDiscover = false;
            await renderMovies(await movies());
        });
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
        }).then( async ()=>{
            await renderMovies(await movies())
        });
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
        }).then( async ()=>{
            await renderMovies(await movies())
        });
    } catch (e) {
        console.log("Error Occurred :(", e);
    }
}

// SEARCH FUNCTION: Returns a filtered array
// PROTOTYPE: searchMovies(array, keyword)
const searchMyMovies = async (movies, keyword) => {
    const filteredMovies = [];
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
    return [...new Set([...filteredMovies])];
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
        let id = (isDiscover) ? movie.imdbID : movie.id;
        insertCards.innerHTML += `
        <div data-movie="${id}" class="card mb-3" style="width: 15rem;">
              <img src=${movie.Poster} class="card-img-top" alt="...">
              <div class="card-body">
                    <h5 class="card-title">${movie.Title}</h5>
                    <span style="font-size: 0.7em">${movie.Rated}</span>
                    <p class="card-text" style="font-size: 0.7em">Genre: ${movie.Genre}</span></p>
                    <!-- Button trigger modal -->
                    <button data-movie="${id}" type="button" class="btn btn-primary modalBtn" data-bs-toggle="modal" data-bs-target="#movieModal">
                      View Details
                    </button>
            </div>
        </div>
        `
    })
    addModalEffect();
}

// Modal Selectors
const modalTitle = document.querySelector('#ModalLabel');
const modalBody = document.querySelector('.modal-body');
const modalFooter = document.querySelector('.modal-footer');
const movieModal = document.querySelector('#movieModal');

const updateModal = async (movie) =>{
    // Destructure
    const {Title, Year, Rated, Genre, Plot, Director, Poster, imdbID} = movie;
    let id = (isDiscover) ? null : movie.id;
    // Update Modal Information
    movieModal.setAttribute('data-movie', imdbID);
    modalTitle.textContent = `${Title}`;
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
    // Customize Modal Footer based on isDiscover
    switch (isDiscover) {
        case true:
            modalFooter.innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary save-movie" data-bs-dismiss="modal" id=${imdbID}>Add to My Movies</button>`
            addSaveListener(imdbID);
            break;
        case false:
            modalFooter.innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary update-movie" id=${id}>Edit</button>`
            addEditListener(id);
            break;
    }
};

// FUNCTION: Update Modal to Edit Mode, using movie
// PROTOTYPE: updateModal(movie);
const editModal = async (movie)=> {
    // Destructure
    const {Title, Year, Rated, Genre, Plot, Director, Poster, id} = movie;
    movieModal.setAttribute('data-movie', id);
    modalTitle.textContent = `Edit Movie`;
    modalBody.innerHTML = `
            <div class="text-center">
                <img src=${Poster} class="card-img-top" style="height: 17rem; width: auto;" alt="...">
            </div>
            <form id="editMovieForm">
              <div class="mb-3">
                <label for="Title" class="form-label">Title: </label>
                <input class="form-control" id="Title" placeholder="${Title}">
              </div>
              <div class="mb-3">
                <label for="Year" class="form-label">Year: </label>
                <input class="form-control" id="Year" placeholder="${Year}">
              </div>
              <div class="mb-3">
                <label for="Rated" class="form-label">Rated: </label>
                <input class="form-control" id="Rated" placeholder="${Rated}">
              </div>
              <div class="mb-3">
                <label for="Genre" class="form-label">Genre: </label>
                <input class="form-control" id="Genre" placeholder="${Genre}">
              </div>
              <div class="mb-3">
                <label for="Plot" class="form-label">Plot: </label>
                <input class="form-control" id="Plot" placeholder="${Plot}">
              </div>
              <div class="mb-3">
                <label for="Director" class="form-label">Director: </label>
                <input class="form-control" id="Director" placeholder="${Director}">
              </div>
        </div> `
    modalFooter.innerHTML = `
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
    <button type="button" id="delete-movie" class="btn btn-danger" data-bs-dismiss="modal">Delete Movie</button>
    <button type="button" id="edit-movie" class="btn btn-success" data-bs-dismiss="modal" disabled>Save Changes</button>`;
    // input fields => for each listener
    addInputChanges();
    addDeleteListener(id);
    addSaveChangesListener(id);
}

//----------------------- VARIABLES ------------------------

let isDiscover = false;
const searchBar = document.querySelector("#searchKeyword");
const movies = async(keyword)=>{ return (isDiscover) ? await fetchAPIList(keyword): await fetchMyMovies(keyword) };



//----------------------- RENDER MY MOVIES ONLOAD ------------------------
(async () => {
    isDiscover = false;
    await renderMovies(await movies());
})();


//----------------------- EVENT LISTENERS ------------------------

// NAVBAR: MY MOVIES
document.querySelector('#myMovies').addEventListener('click', async (e) => {
    e.preventDefault();
    isDiscover = false;
    await renderMovies(await movies());
})

// NAVBAR: DISCOVER MOVIES
document.querySelector('#discover').addEventListener('click', async (e) => {
    e.preventDefault();
    isDiscover = true;
    await renderMovies(await movies());
})

// NAVBAR: SEARCH
document.querySelector("#searchBtn").addEventListener('click', async (e) => {
    try {
        e.preventDefault();
        const keyword = searchBar.value;
        searchBar.value = "";
        const searchedMovies = (isDiscover) ?
            await movies(keyword) :
            await searchMyMovies(await movies(), keyword);
        await renderMovies(searchedMovies);
    } catch (e) {
        console.log("Error Occurred :(", e);
    }
})

// MODAL: UPDATE MODAL INFORMATION
const addModalEffect = ()=>{
    document.querySelectorAll('.modalBtn').forEach(btn => {
        btn.addEventListener('click', async (e)=>{
            const id = btn.getAttribute('data-movie');
            const movie = (isDiscover) ? await fetchAPIMovie(id) : await movies(id);
            await updateModal(movie);
        })
    })
}

// MODAL: EDIT BUTTON
const addEditListener =  (id) => {
    let updateBtn = document.querySelector('.update-movie')
    updateBtn.addEventListener('click', async (e) => {
        await editModal(await movies(id));
    })
}

// MODAL: SAVE TO MY MOVIES BUTTON
const addSaveListener = async (id) => {
    let saveBtn = document.querySelector('.save-movie')
    saveBtn.addEventListener('click', (e) => {
        e.target;
        let userConfirm = confirm(`Add this movie?`);
        addMyMovies(id);
    })
}

const addInputChanges = (id) => {
    let inputs = document.querySelectorAll('.form-control')
    let saveEdit = document.querySelector('#edit-movie')
    inputs.forEach((input) =>{
        input.addEventListener('input', (e) =>{
            e.target
            saveEdit.removeAttribute('disabled')
        })
    })
}

const addDeleteListener = (id) => {
    let deleteBtn = document.querySelector('#delete-movie');
    deleteBtn.addEventListener('click', async (e)=>{
        let userConfirm = confirm(`Are you sure you want to delete this movie?`);
        if (userConfirm) await deleteMyMovie(id);
    })
}

const addSaveChangesListener = (id) => {
    const saveBtn = document.querySelector('#edit-movie');
    saveBtn.addEventListener('click', async (e)=>{
        let newObj = await grabInputs(id);
        editMyMovie(newObj);
    })
}

const grabInputs = async (id) => {
    const inputs = document.querySelectorAll('.form-control');
    let newMovieEdits = {};
    newMovieEdits['id'] = id;
    inputs.forEach(input =>{
        if (!!input.value) {
            newMovieEdits[`${input.id}`] = `${input.value}`;
        }
    })
    return newMovieEdits;
}


const isDarkMode = () => {
    document.querySelectorAll("html *, .card-body").forEach(element=> element.classList.toggle('bg-primary'));
    document.querySelectorAll("h1, p, h2, h5, span, a, #movieModal").forEach(element => element.classList.toggle('text-white'));
    document.querySelectorAll('button, input').forEach(btn => btn.classList.toggle('btn-outline-light'));
    document.querySelector('#searchBtn').classList.toggle('bg-light');
    document.querySelectorAll('.card, .modal-content, .dropdown-menu, hr').forEach(card => card.classList.toggle('border-light'));
}

const darkModeToggle = document.querySelector('.slider');
darkModeToggle.addEventListener('click', isDarkMode);