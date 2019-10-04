let page = document.getElementById('buttonDiv');

const kButtonColors = ['Brexit', 'royals', 'suicide', 'random'];

function constructOptions(kButtonColors) {
	for (let item of kButtonColors) {
		let button = document.createElement('button');
		button.innerHTML = item;
		button.setAttribute('class', 'o-buttons o-buttons--big mg-16');
		button.addEventListener('click', function() {
			button.setAttribute(
				'class',
				'o-buttons o-buttons--primary o-buttons--big mg-16',
			);
			chrome.storage.sync.set({ text: item }, function() {
				console.log('text is ' + item);
			});
		});
		page.appendChild(button);
	}
}
constructOptions(kButtonColors);
