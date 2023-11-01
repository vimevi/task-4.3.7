// const body = document.querySelector('body');
// const main = document.querySelector('.search-repos');
const container = document.querySelector('.container');

// Создание формы с инпутом
const form = document.createElement('form');
const input = document.createElement('input');

form.appendChild(input);
container.appendChild(form);
input.classList.add('search-repos__input');
input.placeholder = 'Введите запрос..';
input.setAttribute('type', 'text');
input.setAttribute('name', 'name');

// Создание autocomplete поля
const searchResults = document.createElement('div');

const ul = document.createElement('ul');
// let items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

// for (const item of items) {
// 	const li = document.createElement('li');
// 	li.textContent = item; // Set the text content of the li element
// 	ul.appendChild(li); // Append the li element to the ul
// }

searchResults.classList.add('search-repos__results');
container.appendChild(searchResults);
searchResults.appendChild(ul);

// создание списка репозиториев
function generateRepoInfo() {
	const repoList = document.createElement('div');
	const delBtn = document.createElement('button');
	const repoInfo = document.createElement('ul');
	const repoName = document.createElement('li');
	const repoOwner = document.createElement('li');
	const repoStars = document.createElement('li');

	repoList.classList.add('search-repos__list');

	// repoName.textContent = 'Author: Maxim';
	// repoOwner.textContent = 'Repo name: My-repo';
	// repoStars.textContent = 'Stars: 16';
	repoName.textContent = `Name: ${repoData.name}`;
	repoOwner.textContent = `Owner: ${repoData.owner.login}`;
	repoStars.textContent = `Stars: ${repoData.stargazers_count}`;

	container.appendChild(repoList);
	repoList.appendChild(repoInfo);
	repoInfo.appendChild(repoName);
	repoInfo.appendChild(repoOwner);
	repoInfo.appendChild(repoStars);

	repoInfo.appendChild(delBtn);
	delBtn.classList.add('search-repos__del-btn');

	// слушатель события удаления
	delBtn.addEventListener('click', (e) => {
		e.preventDefault();
		repoInfo.remove();
	});
}
generateRepoInfo();

const debounce = (fn, debounceTime) => {
	let timeout;
	// Функция враппер
	return function () {
		const fnCall = () => {
			fn.apply(this, arguments);
		};
		// отмена setTimeout если не прошло debounceTime
		clearTimeout(timeout);

		timeout = setTimeout(fnCall, debounceTime);
	};
};

async function onChange(e) {
	e.preventDefault();

	const inputsValue = Object.fromEntries(new FormData(e.target.form));

	const response = await fetch(
		`https://api.github.com/search/repositories?q=${inputsValue.name}`
	);
	if (response.ok) {
		const data = await response.json();
		console.log(data); // Check the data in the console
		renderResults(data);
	} else {
		// alert('Repo is not found');
		console.log('repo is not found');
	}
}

function renderResults(repoData) {
	// Clear the existing li elements in the ul
	// if (!inputsValue.name) {
	// 	ul.innerHTML = '';
	// }
	ul.innerHTML = '';
	// ul.insertAdjacentHTML = '';

	// Limit the number of items to display to 5 or the length of repoData.items, whichever is smaller
	const numResults = Math.min(5, repoData.items.length);

	for (let i = 0; i < numResults; i++) {
		const item = repoData.items[i];
		const li = document.createElement('li');
		li.textContent = item.name; // Set the text content of the li element
		ul.appendChild(li); // Append the li element to the ul
	}
	generateRepoInfo(item);
	// Append the ul to the searchResults element
	searchResults.appendChild(ul);
}

function createDeleteBtnEl() {}

input.addEventListener('keyup', debounce(onChange, 350)); // опытным путём выведено значение 350 мс
