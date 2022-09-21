"use strict";

trendingBtn.addEventListener("click", () => {location.hash = "#trends"});
arrowBtn.addEventListener("click", goBack);
searchFormBtn.addEventListener("click", () => {
	if (searchFormInput.value.trim() === "") {
		alert ("Por favor ingrese algún término en la barra de búsqueda");
	} else {
		location.hash = `#search=${searchFormInput.value.trim()}`;
	}
});

window.addEventListener("DOMContentLoaded", pageNavigation, false);
window.addEventListener("hashchange", pageNavigation, false);
let navigationHistory = [];

function pageNavigation() {	
	if (location.hash === "#trends") {
		navigateToTrendingPage();
	} else if (location.hash.startsWith("#search=")) {
		searchFormInput.value = decodeURI(location.hash.split("=")[1]);
		navigateToSearchPage();
	} else if (location.hash.startsWith("#movie=")) {
		navigateToMovieDetailsPage();
	} else if (location.hash.startsWith("#category=")) {
		navigateToCategoriesPage();
	} else if (location.hash === "") {
		location.hash = "#home";
	} else if (location.hash === "#home") {
		navigateToHomePage();
		searchFormInput.value = "";
	} else {
		navigateTo404Page();
	}
	
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
	saveNavigationHistory();
	resetCurrentPagination();
}

const consoleMessageStyle = "background-color: #2a0646; color: #fbfafb; font-weight: 800;";
const consoleErrorMessageStyle = "background-color: red; color: white; font-weight: 800;";

function navigateToHomePage() {
	console.log("%cSe cargó la vista del Home.", consoleMessageStyle);
	
	headerSection.classList.remove("header-container--long");
	headerSection.style.background = "";
	arrowBtn.classList.add("inactive");
	arrowBtn.classList.remove("header-arrow--white");
	headerTitle.classList.remove("inactive");
	headerCategoryTitle.classList.add("inactive");
	searchForm.classList.remove("inactive");

	trendingPreviewSection.classList.remove("inactive");
	categoriesPreviewSection.classList.remove("inactive");
	genericSection.classList.add("inactive");
	movieDetailSection.classList.add("inactive");
	
	getPreviewTrendingMovies();
	getPreviewCategories();
}

function navigateToCategoriesPage() {
	console.log("%cSe cargó la vista de Categoría.", consoleMessageStyle);
	
	headerSection.classList.remove("header-container--long");
	headerSection.style.background = "";
	arrowBtn.classList.remove("inactive");
	arrowBtn.classList.remove("header-arrow--white");
	headerTitle.classList.add("inactive");
	headerCategoryTitle.classList.remove("inactive");
	searchForm.classList.add("inactive");

	trendingPreviewSection.classList.add("inactive");
	categoriesPreviewSection.classList.add("inactive");
	genericSection.classList.remove("inactive");
	movieDetailSection.classList.add("inactive");
	
	const selectedCategory = location.hash.split("=")[1];
	const [categoryId, categoryName] = selectedCategory.split("-");
	headerCategoryTitle.innerText = decodeURI(categoryName);
	getMoviesByCategory(categoryId);
}

function navigateToMovieDetailsPage() {
	console.log("%cSe cargó la vista de Detalles de una Película.", consoleMessageStyle);
	
	headerSection.classList.add("header-container--long");
	// headerSection.style.background = "";
	arrowBtn.classList.remove("inactive");
	arrowBtn.classList.add("header-arrow--white");
	headerTitle.classList.add("inactive");
	headerCategoryTitle.classList.add("inactive");
	searchForm.classList.add("inactive");

	trendingPreviewSection.classList.add("inactive");
	categoriesPreviewSection.classList.add("inactive");
	genericSection.classList.add("inactive");
	movieDetailSection.classList.remove("inactive");
	
	const selectedMovie = location.hash.split("=")[1];
	const [movieId, movieName] = selectedMovie.split("-");
	getMovieById(movieId);
}

function navigateToSearchPage() {
	console.log("%cSe cargó la vista para Búsqueda.", consoleMessageStyle);
		
	headerSection.classList.remove("header-container--long");
	headerSection.style.background = "";
	arrowBtn.classList.remove("inactive");
	arrowBtn.classList.remove("header-arrow--white");
	headerTitle.classList.add("inactive");
	headerCategoryTitle.classList.remove("inactive");
	searchForm.classList.remove("inactive");

	trendingPreviewSection.classList.add("inactive");
	categoriesPreviewSection.classList.add("inactive");
	genericSection.classList.remove("inactive");
	movieDetailSection.classList.add("inactive");

	const searchedTerm = location.hash.split("=")[1].trim();		
	headerCategoryTitle.textContent = "Búsqueda";		
	getMoviesBySearch(searchedTerm);
}

function navigateToTrendingPage() {
	console.log("%cSe cargó la vista de Tendencias.", consoleMessageStyle);
	
	headerSection.classList.remove("header-container--long");
	headerSection.style.background = "";
	arrowBtn.classList.remove("inactive");
	arrowBtn.classList.remove("header-arrow--white");
	headerTitle.classList.add("inactive");
	headerCategoryTitle.classList.remove("inactive");
	searchForm.classList.add("inactive");

	trendingPreviewSection.classList.add("inactive");
	categoriesPreviewSection.classList.add("inactive");
	genericSection.classList.remove("inactive");
	movieDetailSection.classList.add("inactive");
	
	headerCategoryTitle.textContent = "Tendencias";
	getTrendingMovies();
}

function navigateTo404Page() {
	console.log("%cSe cargó la vista de Página no Encontrada.", consoleMessageStyle);
	
	headerSection.classList.remove("header-container--long");
	headerSection.style.background = "";
	arrowBtn.classList.remove("inactive");
	arrowBtn.classList.remove("header-arrow--white");
	headerTitle.classList.add("inactive");
	headerCategoryTitle.classList.remove("inactive");
	searchForm.classList.add("inactive");

	trendingPreviewSection.classList.add("inactive");
	categoriesPreviewSection.classList.add("inactive");
	genericSection.classList.add("inactive");
	movieDetailSection.classList.add("inactive");
	
	headerCategoryTitle.innerText = "Página no encontrada.";
}

// Navigation History

function saveNavigationHistory() {
	navigationHistory.push(location.hash);
	const lastPage = navigationHistory.length - 1;
	if (navigationHistory[lastPage] === "#home") navigationHistory = ["#home"];
}

function goBack() {
	navigationHistory.pop();
	
	if (navigationHistory.length === 0) {
		location.hash = "#home";
	} else {
		const lastPage = navigationHistory.length - 1;
		location.hash = navigationHistory[lastPage];
		navigationHistory.pop();
	}
}

// Infinite Scrolling

let currentPagination = 1;
let currentLimitPagination = null;
let thereAreSomeRequestsInProcess = false;
document.addEventListener("scroll", loadMoreMoviesByInfiniteScrolling);
function loadMoreMoviesByInfiniteScrolling() {
	const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
	const endOfScrollReached = (scrollTop+clientHeight) >= (scrollHeight-30);
	if (endOfScrollReached && !thereAreSomeRequestsInProcess)  {
		thereAreSomeRequestsInProcess = true;
		
		if (location.hash === "#trends") {
			console.log(`Se llegó al final del scroll de la página ${currentPagination} en las tendencias.`);
			getTrendingMovies(currentPagination+1);
		}
		
		if (location.hash.startsWith("#search=")) {
			console.log(`Se llegó al final del scroll de la página ${currentPagination} en la búsqueda.`);
			const searchedTerm = location.hash.split("=")[1].trim();		
			getMoviesBySearch(searchedTerm, currentPagination+1);
		}
		
		if (location.hash.startsWith("#category=")) {
			console.log(`Se llegó al final del scroll de la página ${currentPagination} en la categoría.`);
			const categoryId = location.hash.split("=")[1].split("-")[0];
			getMoviesByCategory(categoryId, currentPagination+1);
		}
	}
}

function resetCurrentPagination() {currentPagination = 1};