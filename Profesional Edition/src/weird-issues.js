// Error de la aparición del "?" en las búsquedas.

searchForm.addEventListener("submit", (event) => {event.preventDefault()});

searchFormInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        location.hash = `#search=${searchFormInput.value.trim()}`;
    }
});
