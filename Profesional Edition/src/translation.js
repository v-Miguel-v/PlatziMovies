"use strict";

const translation = axios.create({
	baseURL: "https://deep-translate1.p.rapidapi.com/language/translate/v2",
	method: "POST",
	headers: {
		"content-type": "application/json",
		"X-RapidAPI-Key": "ac12eb66e2msh3f0a8cd19b28c17p16d614jsna25bb004d07f",
		"X-RapidAPI-Host": "deep-translate1.p.rapidapi.com"
	}
});

function textToTranslate(string) {
	return {
		data: {
			q: string,
			source: "en",
			target: "es"
		}
	};
}

// await translation.request(textToTranslate(string));
// data.data.translations.translatedText