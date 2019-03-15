import features from '../libs/features';

const init = () => {
	const comments = document.querySelectorAll('tr.comtr');
	for (const comment of comments) {
		comment.dataset.rhnFormInjected = '0';

		const btns = [];
		['reply', 'edit', 'delete-confirm'].forEach(s => {
			const el = comment.querySelector(`a[href^="${s}"]`);
			if (el) {
				btns.push(el);
			}
		});

		const replyDiv = comment.querySelector('div.reply');

		for (const btn of btns) {
			btn.dataset.rhnBtnActive = '0';

			btn.addEventListener('click', async e => {
				e.preventDefault();
				if (comment.dataset.rhnFormInjected === '0') {
					const replyPageString = await fetch(btn.href).then(res => res.text());
					const tempEl = document.createElement('div');
					tempEl.innerHTML = replyPageString;

					const replyForm = tempEl.querySelector('form');
					replyForm.classList.add('__rhn__injected-form');

					comment.dataset.rhnFormInjected = '1';
					btn.innerText = 'hide ' + btn.innerText;
					btn.dataset.rhnBtnActive = '1';
					replyDiv.append(replyForm);

					const textarea = replyForm.querySelector('textarea');
					if (textarea) {
						textarea.focus();
					}
				} else if (btn.dataset.rhnBtnActive === '1') {
					comment.dataset.rhnFormInjected = '0';
					btn.dataset.rhnBtnActive = '0';
					btn.innerText = btn.innerText.split(' ')[1];
					replyDiv.removeChild(replyDiv.querySelector('form'));
				}
			});
		}
	}
};

features.add({
	id: 'reply-without-leaving-page',
	pages: {
		include: ['/item'],
		exclude: []
	},
	loginRequired: true,
	init
});

export default init;
