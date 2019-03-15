import features from '../libs/features';

const sort = (method, stories) => {
	switch (method) {
		case 'time': {
			stories.sort((a, b) => a.id < b.id ? 1 : -1);
			break;
		}

		case 'score': {
			stories.sort((a, b) => a.score < b.score ? 1 : -1);
			break;
		}

		case 'default':
		default: {
			stories.sort((a, b) => a.defaultRank > b.defaultRank ? 1 : -1);
			break;
		}
	}

	const itemlistTable = document.querySelector('table.itemlist > tbody');
	const moreRow = itemlistTable.lastChild;
	const morespaceRow = moreRow.previousSibling;

	itemlistTable.innerHTML = '';

	for (const story of stories) {
		for (const el of story.elements) {
			itemlistTable.append(el);
		}
	}

	itemlistTable.append(morespaceRow);
	itemlistTable.append(moreRow);
};

const init = () => {
	const mainTbody = document.querySelector('table#hnmain > tbody');
	const sortContainer = document.createElement('div');
	const sortLabel = document.createElement('label');
	const sortSelect = document.createElement('select');

	sortContainer.classList.add('__rhn__hide-story-container');

	sortLabel.innerHTML = 'sort stories:&nbsp;';
	sortLabel.setAttribute('for', 'sort-stories-input');

	sortSelect.id = 'sort-stories-input';
	sortSelect.innerHTML = '';
	['default', 'time', 'score'].forEach(o => {
		sortSelect.innerHTML += `<option value=${o}>${o}</option>`;
	});

	sortContainer.append(sortLabel);
	sortContainer.append(sortSelect);

	const insertBeforeTr = mainTbody.querySelectorAll('tr')[3];
	mainTbody.insertBefore(sortContainer, insertBeforeTr);

	const rows = [...document.querySelectorAll('table.itemlist > tbody > tr')];
	while (!rows[0].matches('.athing')) {
		rows.shift();
	}

	const stories = [];

	for (let i = 0; i < rows.length - 2; i += 3) {
		const id = parseInt(rows[i].id, 10);
		const scoreSpan = rows[i + 1].querySelector('span.score');
		const score = scoreSpan ? parseInt(scoreSpan.innerText, 10) : null;
		const defaultRank = parseInt(rows[i].querySelector('span.rank').innerText, 10);
		const elements = [
			rows[i],
			rows[i + 1],
			rows[i + 2]
		];
		stories.push({
			id,
			score,
			elements,
			defaultRank
		});
	}

	sort('default', stories);

	sortSelect.addEventListener('change', () => {
		sort(sortSelect.value, stories);
	});
};

features.add({
	id: 'sort-stories',
	pages: {
		include: [
			'/',
			'/news',
			'/show',
			'/shownew',
			'/ask',
			'/active'
		],
		exclude: []
	},
	loginRequired: false,
	init
});

export default init;
