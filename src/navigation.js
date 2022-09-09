"use strict";

searchFormBtn.addEventListener("click", () => {location.hash = `#search=${searchFormInput.value}`});
trendingBtn.addEventListener("click", () => {location.hash = "#trends"});
arrowBtn.addEventListener("click", goBack);

window.addEventListener("DOMContentLoaded", pageNavigation, false);
window.addEventListener("hashchange", pageNavigation, false);
let navigationHistory = [];

function pageNavigation() {	
	if (location.hash === "#trends") {
		navigateToTrendingPage();
	} else if (location.hash.startsWith("#search=")) {
		searchFormInput.value = location.hash.split("=")[1];
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
}

function navigateToHomePage() {
	console.log("Se cargó la vista del Home.");
	
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
	console.log("Se cargó la vista de Categoría.");
	
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
	
	headerCategoryTitle.innerText = categoryName;
	getMoviesByCategory(categoryId);
}

function navigateToMovieDetailsPage() {
	console.log("Se cargó la vista de Detalles de una Película");
	
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
}

function navigateToSearchPage() {
	console.log("Se cargó la vista para Búsqueda.");
	
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
	
	headerCategoryTitle.textContent = "Búsqueda";
	const searchedTerm = location.hash.split("=")[1];
	getMoviesBySearch(searchedTerm);
}

function navigateToTrendingPage() {
	console.log("Se cargó la vista de Tendencias.");
	
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
}

function navigateTo404Page() {
	
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


