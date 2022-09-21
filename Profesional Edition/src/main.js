"use strict";

const api = axios.create({
	baseURL: "https://api.themoviedb.org/3",
	headers: {
		"Content-Type": "application/json;charset=utf-8"
	},
	params: {
		api_key: "42ab15e6157c1171ff8cab144d9bb023",
		language: "es-VE"
	}
});

// Helpers.

const lazyLoader = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			const url = entry.target.getAttribute("data-src");
			entry.target.setAttribute("src", url);
		}
	});
});

function createMovies(movies, container, isTheFirstLoad = true) {
	if (isTheFirstLoad) container.innerHTML = "";
	
	movies.forEach(movie => {
		const movieContainer = document.createElement("div");
			movieContainer.classList.add("movie-container");
			movieContainer.addEventListener("click", () => {location.hash = `#movie=${movie.id}-${movie.title}`});
		
		const movieImg = document.createElement("img");
			movieImg.classList.add("movie-img");
			movieImg.setAttribute("alt", movie.title);
			movieImg.setAttribute("data-src", `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);
			movieImg.addEventListener("error", () => {
				movieImg.src = "./assets/noimage.png";
				const noImageTitle = document.createElement("span");
				noImageTitle.classList.add("no-image-title");
				noImageTitle.innerText = movie.title;
				movieContainer.appendChild(noImageTitle);
				
			});

		lazyLoader.observe(movieImg);
		movieContainer.appendChild(movieImg);
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

// Loading Screens

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
			createMovies(movies, genericSection, isTheFirstLoad);
			currentLimitPagination = 5;	

			console.group("Respuestas del Servidor (GET Trending Movies)");
				console.log(data);
			console.groupEnd();
		} else {
			if (page <= currentLimitPagination) {
				currentPagination = page;
				const { data } = await api(`trending/movie/day?page=${page}`);
				const movies = data.results;
				createMovies(movies, genericSection, isTheFirstLoad);
				currentLimitPagination = 5;
				
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
			createMovies(movies, genericSection, isTheFirstLoad);
			currentLimitPagination = data.total_pages;	

			console.group("Respuestas del Servidor (GET Movies By Search)");
				console.log(data);
			console.groupEnd();
		} else {
			if (page <= currentLimitPagination) {
				currentPagination = page;
				const { data } = await api(`search/movie?query=${searchedTerm}&page=${page}`);
				const movies = data.results;
				createMovies(movies, genericSection, isTheFirstLoad);
				currentLimitPagination = data.total_pages;
				
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
			createMovies(movies, genericSection, isTheFirstLoad);
			currentLimitPagination = data.total_pages;	

			console.group("Respuestas del Servidor (GET Movies By Category)");
				console.log(data);
			console.groupEnd();
		} else {
			if (page <= currentLimitPagination) {
				currentPagination = page;
				const { data } = await api(`discover/movie?with_genres=${category}&page=${page}`);
				const movies = data.results;
				createMovies(movies, genericSection, isTheFirstLoad);
				currentLimitPagination = data.total_pages;
				
				console.group("Respuestas del Servidor (GET Movies By Category by Scrolling)");
					console.log(data);
				console.groupEnd();
			}
		}
		
		thereAreSomeRequestsInProcess = false;
		
		/*
		genericSection.innerHTML = "";
		showMoviesLoadingScreen(genericSection);
		
		const { data } = await api(`discover/movie?with_genres=${category}&page=${page}`);
		const movies = data.results;
		createMovies(movies, genericSection);
		
		console.group("Respuestas del Servidor (GET Movies By Category)");
			console.log(data);
		console.groupEnd();
		*/
		
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
		/*showDescriptionLoadingScreen(movieDetailDescription);*/
		showCategoriesLoadingScreen(movieDetailCategoriesList);
		
		// API Requests
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