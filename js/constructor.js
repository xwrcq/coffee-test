import { addBasketIdenteficator } from "./func/basketIdenteficator.js";

const selectors = document.querySelectorAll('.selectors-constructor__selector');
const sliders = document.querySelectorAll('.selectors-constructor__slider');
const dropdown = document.querySelector('.selectors-constructor__dropdown');
const dropdownList = document.querySelector('.selectors-constructor__list');
const dropdownPlaceholder = document.querySelector('.selectors-constructor__placeholder');
const titles = document.querySelectorAll('.selectors-constructor__title');
const cupImage = document.querySelector('.constructor__image');
const priceDiv = document.querySelector('.constructor__price');
const buyBtn = document.querySelector('.constructor__btn');
let type = 'hot', cup = 'm-cup', caffeine = 60, sugar = 10, milk = 'milk-add', syrup = "no-syrup", cupRatio = 1.45, price;

addBasketIdenteficator();
priceCalculate();

titles.forEach(title => {
	title.addEventListener('click', () => {
		if (title.classList.contains('block')) {
			title.nextElementSibling.classList.toggle('open-block');
		} else {
			title.nextElementSibling.classList.toggle('open');
		}
	})
});

selectors.forEach(selector => selectHandler(selector));
sliders.forEach(slider => sliderHandler(slider));

dropdown.addEventListener('click', () => dropdown.classList.toggle('active'));
dropdownList.addEventListener('click', (e) => {
	if (!e.target) return;

	dropdownPlaceholder.value = e.target.textContent;
	syrup = e.target.id;
	priceCalculate();
});

buyBtn.addEventListener('click', (e) => {
	e.preventDefault();

	if (!localStorage.getItem('basketAmount')) {
		localStorage.setItem('basketAmount', 1);
	} else {
		let basketAmount = localStorage.getItem('basketAmount');
		localStorage.setItem('basketAmount', ++basketAmount);
	}

	let params = {
		type,
		cup,
		caffeine,
		sugar,
		milk,
		syrup,
		price
	}

	if (!localStorage.getItem('basketOrders')) {
		localStorage.setItem('basketOrders', JSON.stringify([params]));
	} else {
		let basketOrders = JSON.parse(localStorage.getItem('basketOrders'));
		basketOrders.push(params);
		localStorage.setItem('basketOrders', JSON.stringify(basketOrders));
	}

	addBasketIdenteficator();
});

function selectHandler(parent) {
	const elements = parent.children;

	parent.addEventListener('click', (e) => {
		const target = e.target;
		const param = target.id;
		if (!param) return;

		switch (target.dataset.select) {
			case 'type':
				type = param;
				cupImage.src = `./images/constructor/${type}-${cup}.png`;
				break;
			case 'cup':
				cup = param;
				cupRatio = target.dataset.ratio;
				cupImage.src = `./images/constructor/${type}-${cup}.png`;
				break;
			case 'milk':
				milk = param;
				break;
		}

		priceCalculate();
		Array.from(elements).forEach(elem => elem.classList.remove('active'));
		target.classList.add('active');
	});
}

function sliderHandler(slider) {
	switch (slider.id) {
		case 'caffeine':
			slider.nextElementSibling.innerHTML = `${slider.value} mg`;
			slider.oninput = () => {
				slider.nextElementSibling.innerHTML = `${slider.value} mg`;
				caffeine = +slider.value;
				priceCalculate();
			};
			break;

		case 'sugar':
			slider.nextElementSibling.innerHTML = `${slider.value} g`;
			slider.oninput = () => {
				slider.nextElementSibling.innerHTML = `${slider.value} g`;
				sugar = +slider.value;
			};
			break;
	}
}

function priceCalculate() {
	price = Math.round(cupRatio * ((caffeine / 2.5) + (syrup !== 'no-syrup' ? 15 : 0) + (milk === 'milk-add' ? 10 : 0)));
	priceDiv.textContent = price + ' UAH';
}