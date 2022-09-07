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


// Load Preview Trending Movies.
const PREVIEW_TRENDING_MOVIES = document.querySelector("#trendingPreview .trendingPreview-movieList");
async function loadPreviewTrendingMovies() {
	try {
		const { data } = await api("trending/movie/day");
		const movies = data.results;
		movies.forEach(movie => {
			const movieContainer = document.createElement("div");
				movieContainer.classList.add("movie-container");
			
			const movieImg = document.createElement("img");
				movieImg.classList.add("movie-img");
				movieImg.setAttribute("alt", movie.title);
				movieImg.setAttribute("src", `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);
				
			movieContainer.appendChild(movieImg);
			PREVIEW_TRENDING_MOVIES.appendChild(movieContainer);
		});
		
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
loadPreviewTrendingMovies();

// Load Preview Categories.
const PREVIEW_CATEGORIES = document.querySelector("#categoriesPreview .categoriesPreview-list");
async function loadPreviewCategories() {
	try {
		const { data } = await api("genre/movie/list");
		const categories = data.genres;
		categories.forEach(category => {
			const categoryContainer = document.createElement("div");
				categoryContainer.classList.add("category-container");
			
			const categoryTitle = document.createElement("h3");
				categoryTitle.classList.add("category-title");
				categoryTitle.setAttribute("id", `id${category.id}`);
			
			const categoryTitleText = document.createTextNode(category.name);				
				
			categoryTitle.appendChild(categoryTitleText);
			categoryContainer.appendChild(categoryTitle);
			PREVIEW_CATEGORIES.appendChild(categoryContainer);
		});
		
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
loadPreviewCategories();