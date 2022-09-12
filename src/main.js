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
	container.innerHTML = "";
	
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

async function createCategories(categoriesInEnglish, container) {

	// Translation
	const wordsInEnglish = categoriesInEnglish.map(category => category.name).join(" - ");;
	const translationData = await translation.request(textToTranslate(wordsInEnglish));
	const wordsInSpanish = translationData.data.data.translations.translatedText.split(" - ");
	const categoriesInSpanish = categoriesInEnglish.map( (category, index) => {
		return { "id": category.id, "name": wordsInSpanish[index] }
	});

	container.innerHTML = "";
	categoriesInSpanish.forEach(category => {
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

function showLoadingScreen(container) {
	container.innerHTML = `
		<img
			src="./assets/loading-circle-v2softwhite.gif"
			class="loading-screen"
			style="
				margin: 20px auto;
				display: block;
			"
		/>
	`;
}

function showLoadingScreen__toLeft(container) {
	container.innerHTML = `
		<img
			src="./assets/loading-circle-v2softwhite.gif"
			class="loading-screen"
			style="
				margin: 20px auto;
				display: block;
				padding-right: 25px;
			"
		/>
	`;
}

function showBigLoadingScreen(container) {
	container.insertAdjacentHTML(
		"beforeend",
		`<img
			src="./assets/loading-circle-v2purple.gif"
			class="loading-screen"
			style="
				height: 150px;
				margin: 75px auto;
				display: block;
			"
		/>`
	);
}

function showTinyLoadingScreen(container) {
	container.innerHTML = `
		<img
			src="./assets/loading-circle-v2softwhite.gif"
			class="loading-screen"
			style="
				margin: 20px auto;
				display: block;
				height: 40px;
			"
		/>`
}

// Get Preview Trending Movies.
async function getPreviewTrendingMovies() {
	try {
		trendingMoviesPreviewList.innerHTML = "";
		showLoadingScreen__toLeft(trendingMoviesPreviewList);
		
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
		categoriesPreviewList.innerHTML = "";
		showLoadingScreen(categoriesPreviewList);
		
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
		showLoadingScreen(genericSection);
		
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
		showLoadingScreen(genericSection);
		
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
		showLoadingScreen(genericSection);
		
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
		headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), #5c218a`;
		showBigLoadingScreen(headerSection);
		showLoadingScreen(movieDetailDescription);
		showLoadingScreen__toLeft(relatedMoviesContainer);
		showTinyLoadingScreen(movieDetailCategoriesList);
		
		const { data: movie } = await api(`movie/${id}`);
		
		headerSection.removeChild(document.querySelector("header img.loading-screen"));
		headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(https://image.tmdb.org/t/p/w500/${movie.poster_path}), #5c218a`;
		movieDetailTitle.textContent = movie.title;
		movieDetailScore.textContent = movie.vote_average.toFixed(1);
		
		const translationData = await translation.request(textToTranslate(movie.overview));
		const overviewInSpanish = translationData.data.data.translations.translatedText;
		movieDetailDescription.innerHTML = "";
		movieDetailDescription.textContent = overviewInSpanish;
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