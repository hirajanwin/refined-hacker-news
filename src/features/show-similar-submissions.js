import compareUrls from 'compare-urls';

import {monthNames} from '../libs/utils';

function getSimilarSubmissions(storyLink, itemId) {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async resolve => {
		const API_URL = 'https://hn.algolia.com/api/v1/search_by_date?tags=story&query=';
		const safeStoryLink = encodeURI(storyLink);

		const results = [];
		const rawResults = await fetch(API_URL + safeStoryLink).then(res => res.json()).then(obj => obj.hits);

		for (const result of rawResults) {
			if (result.objectID === itemId) {
				continue;
			}

			if (!compareUrls(result.url, storyLink)) {
				continue;
			}

			const date = new Date(result.created_at);
			const renderedDate = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

			results.push({
				link: `https://news.ycombinator.com/item?id=${result.objectID}`,
				title: result.title,
				date: renderedDate,
				comments: result.num_comments,
				points: result.points
			});
		}

		resolve(results);
	});
}

async function init(metadata) {
	if (metadata.item.type !== 'story') {
		return false;
	}

	const storyLink = document.querySelector('a.storylink').href;
	const results = await getSimilarSubmissions(storyLink, metadata.item.id);

	if (results.length === 0) {
		return false;
	}

	const discussionRow = document.createElement('tr');
	discussionRow.innerHTML = `
		<td class='__rhn__discussions-row'>
			<p>Discussions on similar submissions:</p>
			<ol></ol>
		</td>
	`;

	const dicussionRowList = discussionRow.querySelector(':scope > td ol');

	for (const result of results) {
		dicussionRowList.innerHTML += `
			<li><a href="${result.link}">${result.title}</a> (${result.date} &mdash; ${result.points} points, ${result.comments} comments)</li>
		`;
	}

	const rowContainingFooter = document.querySelector('tr#pagespace').nextSibling.nextSibling;
	rowContainingFooter.parentElement.insertBefore(discussionRow, rowContainingFooter);

	return true;
}

const details = {
	id: 'show-similar-submissions',
	pages: {
		include: ['/item'],
		exclude: []
	},
	loginRequired: false,
	init
};

export default details;
