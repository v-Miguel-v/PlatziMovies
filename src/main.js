"use strict";

const api = axios.create({
	baseURL: "https://api.themoviedb.org/3",
	headers: {
		"Content-Type": "application/json;charset=utf-8"
	},
	params: {
		api_key: "42ab15e6157c1171ff8cab144d9bb023"
	}
});

// Helpers.

function createMovies(movies, container) {
	movies.forEach(movie => {
		const movieContainer = document.createElement("div");
			movieContainer.classList.add("movie-container");
			movieContainer.addEventListener("click", () => {location.hash = `#movie=${movie.id}-${movie.title}`});
		
		const movieImg = document.createElement("img");
			movieImg.classList.add("movie-img");
			movieImg.setAttribute("alt", movie.title);
			movieImg.setAttribute("src", `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);
			
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


// Get Preview Trending Movies.
async function getPreviewTrendingMovies() {
	try {
		trendingMoviesPreviewList.innerHTML = "";
		const { data } = await api("trending/movie/day");
		const movies = data.results;
		createMovies(movies, trendingMoviesPreviewList);
		
		console.group("Respuestas del Servidor (GET Preview Trending Movies)");
			console.log(data);
		console.groupEnd();
		
	} catch (error) {
		console.group("Error (GET Preview Trending Movies)");
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
		console.group("Error (GET Preview Categories)");
			console.error(error);
		console.groupEnd();
		alert("Ocurrió un Error en el GET del Preview de las Categorías.");
	}
}

// Get Trending Movies.
async function getTrendingMovies() {
	try {
		genericSection.innerHTML = "";
		const { data } = await api("trending/movie/day");
		const movies = data.results;
		createMovies(movies, genericSection);
		
		console.group("Respuestas del Servidor (GET Trending Movies)");
			console.log(data);
		console.groupEnd();
		
	} catch (error) {
		console.group("Error (GET Trending Movies)");
			console.error(error);
		console.groupEnd();
		alert("Ocurrió un Error en el GET de las Películas en Tendencia.");
	}
}

// Get Movies By Category.
async function getMoviesByCategory(id) {
	try {
		genericSection.innerHTML = "";
		const { data } = await api(`discover/movie?with_genres=${id}`);
		const movies = data.results;
		createMovies(movies, genericSection);
		
		console.group("Respuestas del Servidor (GET Movies By Category)");
			console.log(data);
		console.groupEnd();
		
	} catch (error) {
		console.group("Error (GET Movies By Category)");
			console.error(error);
		console.groupEnd();
		alert("Ocurrió un Error en el GET de las Películas por Categoría.");
	}
}

// Get Movies By Search.
async function getMoviesBySearch(searchedTerm) {
	try {
		genericSection.innerHTML = "";
		const { data } = await api(`search/movie?query=${searchedTerm}`);
		const movies = data.results;
		createMovies(movies, genericSection);
		
		console.group("Respuestas del Servidor (GET Movies By Search)");
			console.log(data);
		console.groupEnd();
		
	} catch (error) {
		console.group("Error (GET Movies By Search)");
			console.error(error);
		console.groupEnd();
		alert("Ocurrió un Error en el GET de las Películas por Búsqueda.");
	}
}

// Get Movie By Id.
async function getMovieById(id) {
	try {
		const { data: movie } = await api(`movie/${id}`);
		
		headerSection.style.background = `
			linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
			url(https://image.tmdb.org/t/p/w500/${movie.poster_path})`;
		movieDetailTitle.textContent = movie.title;
		movieDetailDescription.textContent = movie.overview;
		movieDetailScore.textContent = movie.vote_average.toFixed(1);
		createCategories(movie.genres, movieDetailCategoriesList);
		getRelatedMoviesById(id);
		
		console.group("Respuesta del Servidor (GET Movie By Id)");
			console.log(movie);
		console.groupEnd();
		
	} catch (error) {
		console.group("Error (GET Movie By Id)");
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
		console.group("Error (GET Related Movies By Id)");
			console.error(error);
		console.groupEnd();
		alert("Ocurrió un Error en el GET de las Películas Relacionadas.");
	}
}