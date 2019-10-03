let page = document.getElementById('buttonDiv');

const kButtonColors = ['brexit', 'royals', 'suicide', 'random'];

function constructOptions(kButtonColors) {
	for (let item of kButtonColors) {
		let button = document.createElement('button');
		button.innerHTML = item;
		button.addEventListener('click', function() {
			chrome.storage.sync.set({ text: item }, function() {
				console.log('color is ' + item);
			});
		});
		page.appendChild(button);
	}
}
constructOptions(kButtonColors);
