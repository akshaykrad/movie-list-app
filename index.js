const cardBox    = document.querySelector('.card-container');
const pageBox    = document.querySelector('.pages-box');
const searchBtn  = document.querySelector('.search-button');
const searchBox  = document.querySelector('.search-box');

let pageNo = 1;
let clickedBtnId = 1;

let movies = [];

if(JSON.parse(localStorage.getItem('movies'))){
	movies = JSON.parse(localStorage.getItem('movies'));
}

function save(e){
	let rating = document.getElementById('rating');
	let comment = document.getElementById('comment-box');
	let element = {imdb:e.target.name,ratings:rating.value,comments:comment.value};
	movies.push(element);

	localStorage.setItem('movies',JSON.stringify(movies));
}

function cardSchema(imgUrl,title,imdbId){
	let output = 
	`
		<div class="card" id=${imdbId} onclick=expand(event)>
			<div id="pos-${imdbId}" class="poster" style="background-image: url(${imgUrl});"></div>
			<div id="tit-${imdbId}" class="title">${title}</div>
		</div>

	`;
	return output;
}
function closePopUp(){
	let cont = document.querySelector('.container');
	cont.classList.remove('hide');
	let pop = document.querySelector('.pop-up-box');
	pop.style.display = 'none';
}

function expand(e){
	let cont = document.querySelector('.container');
	cont.classList.add('hide');
	let pop = document.querySelector('.pop-up-box');
	pop.style.display = 'flex';

	let imdb = e.target.id.slice(4);
	fetch(`https://www.omdbapi.com/?apikey=894065f3&i=${imdb}`) 
	.then((response) => { 
		if (!response.ok){
			throw new Error('Network response was not OK'); 
		} 
		return response.json(); 
	}) 
	.then((data) => { 
		document.getElementById('pb-poster').src = `${data.Poster}`;
		document.getElementById('pb-title').innerHTML = `${data.Title}`;
		document.getElementById('save-reviews').name = `${data.imdbID}`;
		document.getElementById('pb-name').innerHTML= `${data.Title}`;

		// for(let i=0;i<movies.length;i++){
		// 	if(movies[imdb] == data.imdbID){
		// 		document.getElementById('rating').value = movies[ratings];
		// 		document.getElementById('comment-box').value = movies[comments];
		// 	}
		// }
		
		let type      = document.getElementById('pb-type');
		let plot      = document.getElementById('pb-plot');
		let genre     = document.getElementById('pb-genre');
		let release   = document.getElementById('pb-release');
		let imdb      = document.getElementById('pb-imdb');

		type.innerHTML    = `<span>Type:</span>${data.Type}`;
		plot.innerHTML    = `<span>Plot:</span>${data.Plot}`;
		genre.innerHTML   = `<span>Genre:</span>${data.Genre}`;
		release.innerHTML = `<span>Released:</span>${data.Released}`;
		imdb.innerHTML    = `<span>IMDb Rating:</span>${data.imdbRating}`;
	}) 
	.catch(error => { 
		console.log('Error:', error.message); 
	})
}

function show(movieArray){
	cardBox.style.display = 'flex';
	cardBox.innerHTML = "";
	movieArray.forEach(e=>{
		cardBox.innerHTML += cardSchema(e.Poster,e.Title,e.imdbID);
	});
}

function pages(totalResults){
	let noOfPages = Math.floor(totalResults/10);
	if(noOfPages>1){
		pageBox.style.display = 'flex';
		pageBox.innerHTML = 
		`<span>Pages</span>
		<button id="page-1" class="pages-box-btn" onclick="selectPage(event)">1</button>
		`;

		for(let i=1;i<noOfPages;i++){
			pageBox.innerHTML += 
			`
			<button id="page-${i+1}" class="pages-box-btn" onclick="selectPage(event)">${i+1}</button>
			`;
		}
		document.getElementById(`page-${clickedBtnId}`).classList.add('btn-clicked');
	}
}

function selectPage(e){
	document.getElementById(`page-${clickedBtnId}`).classList.remove('btn-clicked');
	e.target.classList.add('btn-clicked');
	clickedBtnId = e.target.id.slice(5);
	getDataFromApi(searchBox.value,clickedBtnId);
}

function formatString(inputString) {
	// Use a regular expression to replace multiple spaces with a single "+"
	const result = inputString.replace(/\s+/g, '+');
	return result.toLowerCase();
}

function getDataFromApi(searchQuery,page){
	fetch(`https://www.omdbapi.com/?apikey=894065f3&s=${formatString(searchQuery)}&page=${page}`) 
	.then((response) => { 
		if (!response.ok){
			throw new Error('Network response was not OK'); 
		} 
		return response.json(); 
	}) 
	.then((data) => { 
		show([... data.Search]);
		pages(data.totalResults);
		console.log(data);
	}) 
	.catch(error => { 
		console.log('Error:', error.message); 
	})
}

searchBtn.addEventListener('click',event=>{
	event.preventDefault();
	let searchText = searchBox.value;
	getDataFromApi(searchText,pageNo);
});

