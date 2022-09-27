"use strict";

/* Data. */

const api = axios.create({
	baseURL: "https://api.themoviedb.org/3",
	headers: {
		"Content-Type": "application/json;charset=utf-8"
	},
	params: {
		api_key: "42ab15e6157c1171ff8cab144d9bb023",
		language: "es-MX"
	}
});

function addOrRemoveLikedMovie(movie) {
	const movieTag = `movie-${movie.id}`;
	
	if (isInLikedMovies(movieTag)) { // Remove
		console.log(`Se ha eliminado la película "${movie.title}" de la Sección de Favoritos.`);
		localStorage.removeItem(movieTag);
		if (location.hash === "#liked") { loadLikedMovies(); }
		if (location.hash === "#home") {
			loadPreviewLikedMovies();
			updateBtnsStatus(movieTag);
		}
	} else { // Add
		console.log(`Se ha añadido la película "${movie.title}" a la Sección de Favoritos.`);
		localStorage.setItem(movieTag, JSON.stringify(movie));
		if (location.hash === "#home") { loadPreviewLikedMovies(); }
	}
}

/* Helpers. */

const lazyLoader = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			const url = entry.target.getAttribute("data-src");
			entry.target.setAttribute("src", url);
		}
	});
});

function updateBtnsStatus(movieTag) {
	const btn = document.querySelector(`.trendingPreview-movieList .${movieTag} .movie-btn--liked`);
	if (btn) btn.classList.toggle("movie-btn--liked");
}

function isInLikedMovies(movieTag) {
	return Boolean(localStorage.getItem(movieTag));
}

function createMovies(movies, container, isTheFirstLoad = true) {
	if (isTheFirstLoad) container.innerHTML = "";
	if (!isTheFirstLoad) container.removeChild(document.querySelector("div.loading-screen"));
	
	movies.forEach(movie => {
		const movieTag = `movie-${movie.id}`;
		const movieContainer = document.createElement("div");
			movieContainer.classList.add("movie-container");
			movieContainer.classList.add(movieTag);
		
		const movieImg = document.createElement("img");
			movieImg.classList.add("movie-img");
			movieImg.setAttribute("alt", movie.title);
			movieImg.setAttribute("data-src", `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);
			movieImg.addEventListener("click", () => {location.hash = `#movie=${movie.id}-${movie.title}`});
			movieImg.addEventListener("error", () => {
				movieImg.src = "./assets/noimage.png";
				const noImageTitle = document.createElement("span");
				noImageTitle.classList.add("no-image-title");
				noImageTitle.innerText = movie.title;
				movieContainer.appendChild(noImageTitle);
				
			});

		const movieBtn = document.createElement("button");
			movieBtn.classList.add("movie-btn");
			if (isInLikedMovies(movieTag)) movieBtn.classList.add("movie-btn--liked");
			movieBtn.addEventListener("click", () => {
				movieBtn.classList.toggle("movie-btn--liked");
				addOrRemoveLikedMovie(movie);
			});

		lazyLoader.observe(movieImg);
		movieContainer.appendChild(movieImg);
		movieContainer.appendChild(movieBtn);
		container.appendChild(movieContainer);
	});
}

function createCategories(categories, container) {
	container.innerHTML = "";
	categories.forEach(category => {
		const categoryContainer = document.createElement("div");
			categoryContainer.classList.add("category-container");
		
		const categoryTitle = document.createElement("h3");
			categoryTitle.classList.add("category-title");
			categoryTitle.setAttribute("id", `id${category.id}`);
			categoryTitle.addEventListener("click", () => {
				location.hash = `#category=${category.id}-${category.name}`;
			});
		
		const categoryTitleText = document.createTextNode(category.name);				
		categoryTitle.appendChild(categoryTitleText);
		categoryContainer.appendChild(categoryTitle);
		container.appendChild(categoryContainer);
	});
}

/* Loading Screens */

function showScrollMoviesLoadingScreen(container) {
	container.innerHTML = `
	    <div class="movie-container movie-container--loading"></div>
	    <div class="movie-container movie-container--loading"></div>
	    <div class="movie-container movie-container--loading"></div>
	`;
}

function showMoviesLoadingScreen(container) {
	container.innerHTML = `
	    <div class="movie-container movie-container--loading"></div>
	    <div class="movie-container movie-container--loading"></div>
	    <div class="movie-container movie-container--loading"></div>
	    <div class="movie-container movie-container--loading"></div>
	    <div class="movie-container movie-container--loading"></div>
	    <div class="movie-container movie-container--loading"></div>
	`;
}

function showInfiniteScrollingMoviesLoadingScreen(container) {
	container.insertAdjacentHTML(
		"beforeend",
		`<div class="loading-screen" style="width: 100%;">
			<img
				src="./assets/loading-circle-v2softwhite.gif"
				class="loading-screen"
				style="
					margin: 20px auto;
					display: block;
					height: 40px;
				"
			/>
		</div>`
	);
}

function showCategoriesLoadingScreen(container) {
	container.innerHTML = `
	  <div class="category-container category-container--loading"></div>
	  <div class="category-container category-container--loading"></div>
	  <div class="category-container category-container--loading"></div>
	  <div class="category-container category-container--loading"></div>
	`;
}

function showPosterLoadingScreen(container) {
	container.insertAdjacentHTML(
		"beforeend",
		`<img
			src="./assets/loading-circle-v2purple.gif"
			class="loading-screen"
			style="
				margin: 75px auto;
				display: block;
			"
		/>`
	);
}

/* Messages */

function showInfiniteScrollingEndMessage(container) {
	container.insertAdjacentHTML(
		"beforeend",
		`<div class="end-message"
			style="
				width: 100%;
				position: absolute;
				bottom: -30px;
				left: 0;
			"
		>
			<p style="text-align: center; color: var(--purple-medium-1);">Fin de los Resultados</p>
		</div>`
	);
}

function showNoResultsFoundMessage(container, searchedTerm) {
	container.insertAdjacentHTML(
		"beforeend",
		`<div class="no-results-found-message" style="width: 100%;">
			<p style="text-align: center; color: var(--purple-medium-1);">
				No se encontraron resultados de la búsqueda: "${decodeURI(searchedTerm)}".
			</p>
		</div>`
	);
}

function showEmptyLikedSectionMessage() {
	genericSection.insertAdjacentHTML(
		"beforeend",
		`<div class="empty-section-message" style="width: 100%;">
			<p style="text-align: center; color: var(--purple-medium-1);">
				No tienes películas en favoritos
				<br>
				Añade la primera con el botón "❤"
			</p>
		</div>`
	);
}

function showEmptyPreviewLikedSectionMessage() {
	if (!document.querySelector("#likedPreview .empty-section-message")) {
		likedPreviewSection.insertAdjacentHTML(
			"beforeend",
			`<div class="empty-section-message"
				style="
					width: 100%;
					position: absolute;
					bottom: 100px;
					left: 0;
					padding: 0px 25px;
				"
			>
				<p style="
					text-align: center;
					color: var(--purple-medium-1);
				">
					No tienes películas en favoritos
					<br>
					Añade la primera con el botón "❤"
				</p>
			</div>`
		);
	}
}

function removeEmptyPreviewLikedSectionMessage() {
	if (document.querySelector("#likedPreview .empty-section-message")) {
		likedPreviewSection.removeChild(document.querySelector("#likedPreview .empty-section-message"));
	}
}

/* API Requests */

// Get Preview Trending Movies.
async function getPreviewTrendingMovies() {
	try {
		const { data } = await api("trending/movie/day");
		const movies = data.results;
		createMovies(movies, trendingMoviesPreviewList);
		
		console.group("Respuestas del Servidor (GET Preview Trending Movies)");
			console.log(data);
		console.groupEnd();
		
	} catch (error) {
		console.group("%cError (GET Preview Trending Movies)", consoleErrorMessageStyle);
			console.error(error);
		console.groupEnd();
		alert("Ocurrió un Error en el GET del Preview de las Películas en Tendencia.");
	}
}

// Get Preview Categories.
async function getPreviewCategories() {
	try {
		const { data } = await api("genre/movie/list");
		const categories = data.genres;
		createCategories(categories, categoriesPreviewList);
		
		console.group("Respuestas del Servidor (GET Preview Categories)");
			console.log(data);
		console.groupEnd();
		
	} catch (error) {
		console.group("%cError (GET Preview Categories)", consoleErrorMessageStyle);
			console.error(error);
		console.groupEnd();
		alert("Ocurrió un Error en el GET del Preview de las Categorías.");
	}
}

// Get Trending Movies.
async function getTrendingMovies(page = 1) {
	try {
		thereAreSomeRequestsInProcess = true;
		const isTheFirstLoad = (page === 1);
		
		if (isTheFirstLoad) {
			genericSection.innerHTML = "";
			showMoviesLoadingScreen(genericSection);
			
			const { data } = await api(`trending/movie/day?page=${page}`);
			const movies = data.results;
			currentLimitPagination = 5;
			createMovies(movies, genericSection, isTheFirstLoad);

			console.group("Respuestas del Servidor (GET Trending Movies)");
				console.log(data);
			console.groupEnd();
		} else {
			if (page <= currentLimitPagination) {
				showInfiniteScrollingMoviesLoadingScreen(genericSection);
				
				currentPagination = page;
				const { data } = await api(`trending/movie/day?page=${page}`);
				const movies = data.results;
				currentLimitPagination = 5;
				createMovies(movies, genericSection, isTheFirstLoad);
				if (page === currentLimitPagination) showInfiniteScrollingEndMessage(genericSection);
				
				console.group("Respuestas del Servidor (GET Trending Movies by Scrolling)");
					console.log(data);
				console.groupEnd();
			}
		}
		
		thereAreSomeRequestsInProcess = false;
		
	} catch (error) {
		console.group("%cError (GET Trending Movies)", consoleErrorMessageStyle);
			console.error(error);
		console.groupEnd();
		alert("Ocurrió un Error en el GET de las Películas en Tendencia.");
	}
}

// Get Movies By Search.
async function getMoviesBySearch(searchedTerm, page = 1) {
	try {
		thereAreSomeRequestsInProcess = true;
		const isTheFirstLoad = (page === 1);
		
		if (isTheFirstLoad) {
			genericSection.innerHTML = "";
			showMoviesLoadingScreen(genericSection);
			
			const { data } = await api(`search/movie?query=${searchedTerm}&page=${page}`);
			const movies = data.results;
			currentLimitPagination = data.total_pages;	
			createMovies(movies, genericSection, isTheFirstLoad);
			if (page === currentLimitPagination) showInfiniteScrollingEndMessage(genericSection);
			if (data.total_results === 0) showNoResultsFoundMessage(genericSection, searchedTerm);

			console.group("Respuestas del Servidor (GET Movies By Search)");
				console.log(data);
			console.groupEnd();
		} else {
			if (page <= currentLimitPagination) {
				showInfiniteScrollingMoviesLoadingScreen(genericSection);
				
				currentPagination = page;
				const { data } = await api(`search/movie?query=${searchedTerm}&page=${page}`);
				const movies = data.results;
				currentLimitPagination = data.total_pages;
				createMovies(movies, genericSection, isTheFirstLoad);
				if (page === currentLimitPagination) showInfiniteScrollingEndMessage(genericSection);
				
				console.group("Respuestas del Servidor (GET Movies By Search by Scrolling)");
					console.log(data);
				console.groupEnd();
			}
		}
		
		thereAreSomeRequestsInProcess = false;
		
	} catch (error) {
		console.group("%cError (GET Movies By Search)", consoleErrorMessageStyle);
			console.error(error);
		console.groupEnd();
		alert("Ocurrió un Error en el GET de las Películas por Búsqueda.");
	}
}

// Get Movies By Category.
async function getMoviesByCategory(category, page = 1) {
	try {
		
		thereAreSomeRequestsInProcess = true;
		const isTheFirstLoad = (page === 1);
		
		if (isTheFirstLoad) {
			genericSection.innerHTML = "";
			showMoviesLoadingScreen(genericSection);
			
			const { data } = await api(`discover/movie?with_genres=${category}&page=${page}`);
			const movies = data.results;
			currentLimitPagination = data.total_pages;
			createMovies(movies, genericSection, isTheFirstLoad);
			if (page === currentLimitPagination) showInfiniteScrollingEndMessage(genericSection);

			console.group("Respuestas del Servidor (GET Movies By Category)");
				console.log(data);
			console.groupEnd();
		} else {
			if (page <= currentLimitPagination) {
				showInfiniteScrollingMoviesLoadingScreen(genericSection);
				
				currentPagination = page;
				const { data } = await api(`discover/movie?with_genres=${category}&page=${page}`);
				const movies = data.results;
				currentLimitPagination = data.total_pages;
				createMovies(movies, genericSection, isTheFirstLoad);
				if (page === currentLimitPagination) showInfiniteScrollingEndMessage(genericSection);
				
				console.group("Respuestas del Servidor (GET Movies By Category by Scrolling)");
					console.log(data);
				console.groupEnd();
			}
		}
		
		thereAreSomeRequestsInProcess = false;
		
	} catch (error) {
		console.group("%cError (GET Movies By Category)", consoleErrorMessageStyle);
			console.error(error);
		console.groupEnd();
		alert("Ocurrió un Error en el GET de las Películas por Categoría.");
	}
}

// Get Movie By Id.
async function getMovieById(id) {
	try {
		// Resets & Default Values
		relatedMoviesContainer.innerHTML = "";
		movieDetailCategoriesList.innerHTML = "";
		movieDetailScore.textContent = "Pts.";
		movieDetailTitle.textContent = "Título de la Película";
		movieDetailDescription.innerHTML = "Descripción de la Película";
		headerSection.style.background = `
			linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), #5c218a
		`;
		
		// Loading Screens
		showPosterLoadingScreen(headerSection);
		showScrollMoviesLoadingScreen(relatedMoviesContainer);
		showCategoriesLoadingScreen(movieDetailCategoriesList);
		
		// API Request
		const { data: movie } = await api(`movie/${id}`);
		
		headerSection.removeChild(document.querySelector("header img.loading-screen"));
		if (movie.poster_path === null) {
			headerSection.style.background = `
				linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
				url(./assets/noimage.png), #5c218a
			`;
		} else {
			headerSection.style.background = `
				linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
				url(https://image.tmdb.org/t/p/w500/${movie.poster_path}),
				#5c218a
			`;
		}
		movieDetailTitle.textContent = movie.title;
		movieDetailScore.textContent = movie.vote_average.toFixed(1);
		movieDetailDescription.textContent = movie.overview;
		createCategories(movie.genres, movieDetailCategoriesList);
		getRelatedMoviesById(id);
		
		console.group("Respuesta del Servidor (GET Movie By Id)");
			console.log(movie);
		console.groupEnd();

	} catch (error) {
		console.group("%cError (GET Movie By Id)", consoleErrorMessageStyle);
			console.error(error);
		console.groupEnd();
		alert("Ocurrió un Error en el GET de la Película Seleccionada.");
	}
}

// Get Related Movies By Id.
async function getRelatedMoviesById(id) {
	try {
		relatedMoviesContainer.innerHTML = "";
		
		const { data } = await api(`movie/${id}/similar`);
		const relatedMovies = data.results;
		createMovies(relatedMovies, relatedMoviesContainer);
		
		console.group("Respuesta del Servidor (GET Related Movies By Id)");
			console.log(relatedMovies);
		console.groupEnd();
		
	} catch (error) {
		console.group("%cError (GET Related Movies By Id)", consoleErrorMessageStyle);
			console.error(error);
		console.groupEnd();
		alert("Ocurrió un Error en el GET de las Películas Relacionadas.");
	}
}

/* Local Storage Requests */

// Load Preview Liked Movies
function loadPreviewLikedMovies() {
	try {
		const isEmpty = localStorage.length === 0;
		
		if (isEmpty) {
			likedMoviesPreviewList.innerHTML = "";
			showEmptyPreviewLikedSectionMessage();
			
			console.log("La Sección de Favoritos está Vacía.");
			console.groupCollapsed("Respuestas del LocalStorage (LOAD Preview Liked Movies)");
					console.log(localStorage);
			console.groupEnd();
		} else {
			const data = Object.values(localStorage);
			const results = data;
			const movies = results.map(movie => {return JSON.parse(movie)});
			removeEmptyPreviewLikedSectionMessage();
			createMovies(movies, likedMoviesPreviewList);
		
			console.groupCollapsed("Respuestas del LocalStorage (LOAD Preview Liked Movies)");
				console.log(localStorage);
			console.groupEnd();
		}
		
	} catch (error) {
		console.group("%cError (LOAD Preview Liked Movies from LocalStorage)", consoleErrorMessageStyle);
			console.error(error);
		console.groupEnd();
		alert("Ocurrió un Error en el LOAD del Preview de las Películas Favoritas desde el LocalStorage.");
	}
}

// Load Liked Movies.
async function loadLikedMovies(page = 1) {
	try {
		thereAreSomeRequestsInProcess = true;
		const isTheFirstLoad = (page === 1);
		
		if (isTheFirstLoad) {
			genericSection.innerHTML = "";
			const isEmpty = localStorage.length === 0;
			
			if (isEmpty) {
				showEmptyLikedSectionMessage();
				
				console.log("La Sección de Favoritos está Vacía.");
				console.groupCollapsed("Respuestas del LocalStorage (LOAD Liked Movies)");
					console.log(localStorage);
				console.groupEnd();
			} else {
				const data = Object.values(localStorage);
				const results = data;
				const movies = results.map(movie => {return JSON.parse(movie)});
				// currentLimitPagination = 5;
				createMovies(movies, genericSection, isTheFirstLoad);
				showInfiniteScrollingEndMessage(genericSection);
			
				console.groupCollapsed("Respuestas del LocalStorage (LOAD Liked Movies)");
					console.log(localStorage);
				console.groupEnd();
			}
			
		}/* else {
			if (page <= currentLimitPagination) {
				showInfiniteScrollingMoviesLoadingScreen(genericSection);
				
				currentPagination = page;
				const { data } = await api(`trending/movie/day?page=${page}`);
				const movies = data.results;
				currentLimitPagination = 5;
				createMovies(movies, genericSection, isTheFirstLoad);
				if (page === currentLimitPagination) showInfiniteScrollingEndMessage(genericSection);
				
				console.group("Respuestas del Servidor (GET Trending Movies by Scrolling)");
					console.log(data);
				console.groupEnd();
			}
		}
		
		thereAreSomeRequestsInProcess = false;*/
		
	} catch (error) {
		console.group("%cError (LOAD Liked Movies from LocalStorage)", consoleErrorMessageStyle);
			console.error(error);
		console.groupEnd();
		alert("Ocurrió un Error en el LOAD de las Películas en Favoritas desde el LocalStorage.");
	}
}