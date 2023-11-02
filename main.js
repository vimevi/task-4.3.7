const container = document.querySelector('.container');

// Создание формы с инпутом
const form = document.createElement('form');
const input = document.createElement('input');

form.appendChild(input);

input.classList.add('search-repos__input');
input.placeholder = 'Введите запрос..';
input.setAttribute('type', 'text');
input.setAttribute('name', 'name');

container.appendChild(form);

// убирает обновление страницы при нажатии на enter
form.addEventListener('submit', (e) => {
	e.preventDefault();
});

// Создание autocomplete поля
const searchResults = document.createElement('div');

const ul = document.createElement('ul');

searchResults.classList.add('search-repos__results');
container.appendChild(searchResults);
searchResults.appendChild(ul);
let itemCount = 0;

// создание списка репозиториев
async function generateRepoInfo(repoData) {
	if (itemCount < 5) {
		const repoList = document.createElement('div');
		const delBtn = document.createElement('button');
		const repoInfo = document.createElement('ul');
		const repoName = document.createElement('li');
		const repoOwner = document.createElement('li');
		const repoStars = document.createElement('li');

		repoList.classList.add('search-repos__list');
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
			repoList.remove();
			itemCount--;
		});
		itemCount++;
	}
}

const debounce = (fn, debounceTime) => {
	let timeout;
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
		`https://api.github.com/search/repositories?q=${inputsValue.name}&per_page=5`
	);
	if (response.ok) {
		const data = await response.json();
		console.log(data);
		renderResults(data);
	} else {
		// очистка автозаполнения
		renderResults();
		console.log('repo is not found');
	}
}
function renderResults(repoData) {
	ul.innerHTML = '';

	const fragment = document.createDocumentFragment();

	for (const item of repoData.items) {
		const li = document.createElement('li');
		li.textContent = item.name;
		li.addEventListener('click', () => {
			generateRepoInfo(item);
			input.value = '';
			ul.innerHTML = '';
		});
		fragment.appendChild(li);
	}

	ul.appendChild(fragment);
}

input.addEventListener('keydown', debounce(onChange, 350)); // опытным путём выведено значение 350 мс
