const c_p_name = document.querySelector('#Clothing .product_name');
const a_p_name = document.querySelector('#Accessories  .product_name');
const t_p_name = document.querySelector('#Textiles .product_name');
var categories = document.querySelectorAll('.category');
const no_name = " No Items Found ";
const no_price = " NA ";
const no_description = " No Description Available, Item not found. ";
var i = 0;
var product_iteration = 0
var products = document.querySelectorAll('.product');
var current_active = document.querySelector('.product.active');
var active_products = document.querySelector('.product.active');
var description = document.querySelector('.description_wrapper');
var this_product = undefined;
var hovered = undefined;
var category_hovered = undefined;
var current_category = undefined;
var category_products = undefined;
var this_category = undefined;
var category_length = undefined;
const timer = ms => new Promise(res => setTimeout(res, ms));
var current_i = 2;
var cartJson = {};
const csrftoken = getCookie('csrftoken');

function clearAnimation(){
	description.classList.remove('active');
	description.style.animation = 'none';
	void description.offsetHeight;
	description.style.animation = null; 
}

function clear_active() {
	if (typeof(active_products) != 'undefined' && active_products != null) {
		active_products.classList.remove('active');
		clearAnimation();
	}
	this_product.classList.add('active');
	description.classList.add('active');
	current_active = this_product;
	if ( hovered === undefined) {
		hovered = 1;
	}
}

function display_category () {
	product_iteration = 0;
	for (var p=0; p < 3; p++) {
		product_iteration++;
		if (category_products[p] != 'undefined' && category_products[p] != null){
				var image_style = document.querySelectorAll(`#${current_category}  .product_photo`)[p].getAttribute("id");
				document.querySelector(`#p${product_iteration} .title`).innerHTML = document.querySelectorAll(`#${current_category} .product_name`)[p].getAttribute('id').replace(/_/g, " ");
				document.querySelector(`#p${product_iteration} .price`).innerHTML = ['$', document.querySelectorAll(`#${current_category} .product_price`)[p].getAttribute('id')].join('');
				document.querySelector(`#p${product_iteration} .description_product`).innerHTML = document.querySelectorAll(`#${current_category} .product_description`)[p].getAttribute('id');
				document.querySelector(`#p${product_iteration} .product_image`).style.background = ['url(', image_style, ') no-repeat'].join('');
				document.querySelector(`#p${product_iteration} .product_image`).style.backgroundSize = 'cover'
		} else {
			document.querySelector(`#p${product_iteration} .title`).innerHTML = no_name;
			document.querySelector(`#p${product_iteration} .price`).innerHTML = no_price;
			document.querySelector(`#p${product_iteration} .description_product`).innerHTML = no_description;
			document.querySelector(`#p${product_iteration} .product_image`).style.background = `url(/static/product/${current_category}.jpg) no-repeat`;
			document.querySelector(`#p${product_iteration} .product_image`).style.backgroundSize = 'cover';
		} 
	}
	if ( category_hovered === undefined) {
		category_hovered = 1;
	}
}

function display_arrows () {
	if( -1 < current_i - 3){
		if (category_products[current_i - 3] != 'undefined' && category_products[current_i - 3] != null){
			document.querySelector('.Arrow_Left').style.display = 'block';
		} else {
			document.querySelector('.Arrow_Left').style.display = 'none';
		}
	} else {
		document.querySelector('.Arrow_Left').style.display = 'none';
	}		
	if (category_products[current_i + 1] != 'undefined' && category_products[current_i + 1] != null){
		document.querySelector('.Arrow_Right').style.display = 'block';
	} else {
		document.querySelector('.Arrow_Right').style.display = 'none';
	}
}

function display_products () {
	product_iteration = 0;
	for (var p=0; p < 3; p++) {
		product_iteration++;
		if (category_products[p] != 'undefined' && category_products[p] != null){
				var image_style = document.querySelectorAll(`#${current_category}  .product_photo`)[p].getAttribute("id");
				document.querySelector(`#p${product_iteration} .title`).innerHTML = document.querySelectorAll(`#${current_category} .product_name`)[p].getAttribute('id').replace(/_/g, " ");
				document.querySelector(`#p${product_iteration} .price`).innerHTML = ['$', document.querySelectorAll(`#${current_category} .product_price`)[p].getAttribute('id')].join('');
				document.querySelector(`#p${product_iteration} .description_product`).innerHTML = document.querySelectorAll(`#${current_category} .product_description`)[p].getAttribute('id');
				document.querySelector(`#p${product_iteration} .product_image`).style.background = ['url(', image_style, ') no-repeat'].join('');
				document.querySelector(`#p${product_iteration} .product_image`).style.backgroundSize = 'cover'
		} else {
			document.querySelector(`#p${product_iteration} .title`).innerHTML = no_name;
			document.querySelector(`#p${product_iteration} .price`).innerHTML = no_price;
			document.querySelector(`#p${product_iteration} .description_product`).innerHTML = no_description;
			document.querySelector(`#p${product_iteration} .product_image`).style.background = `url(/static/product/${current_category}.jpg) no-repeat`;
			document.querySelector(`#p${product_iteration} .product_image`).style.backgroundSize = 'cover'
		} 
	}
	if ( category_hovered === undefined) {
		category_hovered = 1;
	}
}

function cart_count () {
	let Cart_Count = 0;
	let keys = Object.keys(localStorage);
	let tempJson = {};
	for(let key of keys) {
		if ( key == '__paypal_storage__' ) {
			continue;
		}
		Cart_Count += parseInt(`${localStorage.getItem(key)}`);
		tempJson[key] = localStorage.getItem(key);
	}
	cartJson = tempJson;
	document.querySelector('#cart_content').innerHTML = `#cart_icon:after {content: '${Cart_Count}';}`;
	return Cart_Count;
}

function cart_count_active () {
	let Product = current_active.querySelector('.title').innerHTML
	if ( Product != ' No Items Found ') {
		if ( localStorage.getItem(Product) != null ) {
			localStorage.setItem(Product, parseInt(localStorage.getItem(Product)) + 1);
		} else {
			localStorage.setItem(Product, 1);
		}
		cart_count ();
	}
}

function load_cart () {
	while (document.querySelector('#cart_wrapper').firstChild) {
		document.querySelector('#cart_wrapper').removeChild(document.querySelector('#cart_wrapper').lastChild);
	}
	while (document.querySelector('#paypal-button-container').firstChild) {
		document.querySelector('#paypal-button-container').removeChild(document.querySelector('#paypal-button-container').lastChild);
	}
	let totalC = 0;
	let keys = Object.keys(localStorage);
	for(let key of keys) {
		if ( key == '__paypal_storage__' ) {
			continue;
		}
		console.log(key)
		console.log(`#${key.replace(/ /g, "_")}`)
		let cP_Name = document.querySelector(`#${key.replace(/ /g, "_")}`);
		let cartP = document.createElement("DIV");
		let cartTR = document.createElement("DIV");
		let cartPI = document.createElement("DIV");
		let cartPD = document.createElement("P");
		let cartA = document.createElement("SPAN");
		let cartTO = document.createElement("P");
		let cartR = document.createElement("SPAN");
		let cartC = document.createElement("P");
		let image_style = cP_Name.childNodes[5].getAttribute("id");
		let cartPrice = parseFloat( parseFloat(`${localStorage.getItem(key)}`) * parseFloat(cP_Name.childNodes[1].getAttribute("id")) ).toFixed(2);
		cartP.className = 'cart_product_wrapper';
		cartP.id = `${key.replace(/ /g, "_")}`;
		cartPI.className = 'cart_product_image';
		cartTR.className = 'cart_trash';
		cartPD.className = 'cart_product_description';
		cartPD.innerHTML = `${key}`;
		cartA.className = 'cart_add';
		cartTO.className = 'cart_total';
		cartTO.innerHTML = `${localStorage.getItem(key)}`;
		cartR.className = 'cart_rmv';
		cartC.className = 'cart_cost';
		cartC.innerHTML = ['$', cartPrice].join('');
		cartP.appendChild(cartTR);
		cartP.appendChild(cartPI);
		cartP.appendChild(cartPD);
		cartP.appendChild(cartA);
		cartP.appendChild(cartTO);
		cartP.appendChild(cartR);
		cartP.appendChild(cartC);
		document.querySelector('#cart_wrapper').appendChild(cartP);
		document.querySelector(`#${key.replace(/ /g, "_")} .cart_product_image`).style.backgroundImage = ['url(', image_style, ')'].join('');
		document.querySelector(`#${key.replace(/ /g, "_")} .cart_product_image`).style.backgroundSize = 'cover';
		totalC = parseFloat( parseFloat(totalC) + parseFloat(cartPrice) ).toFixed(2)
	}
	document.querySelector('#overlay_wrapper').style.display = 'block'
	document.querySelector('#total_cost').innerHTML = `Total: $${parseFloat(totalC).toFixed(2)}`
	let pwLength = document.querySelectorAll('.cart_product_wrapper').length;
	for ( let l = 0; l < pwLength; l++) {
		document.querySelectorAll('.cart_trash')[l].addEventListener('click', function() {
			this.parentElement.remove();
			localStorage.removeItem(this.parentElement.getAttribute('id').replace(/_/g, " "))
			let totalC = parseFloat( parseFloat(document.querySelector('#total_cost').innerHTML.replace(/[^.\d]/g, '')).toFixed(2) - parseFloat(this.parentElement.childNodes[6].innerHTML.replace(/[^.\d]/g, '')).toFixed(2) ).toFixed(2);
			document.querySelector('#total_cost').innerHTML = `Total: $${totalC}`;
			if ( cart_count () < 1 ) {
				document.querySelector('#overlay_wrapper').style.display = 'none'
			}
		});
	}
	for ( let l = 0; l < pwLength; l++) {
		document.querySelectorAll('.cart_add')[l].addEventListener('click', function() {
			let key = this.parentElement.getAttribute('id').replace(/_/g, " ");
			let cP_Name = document.querySelector(`#${key.replace(/ /g, "_")}`);
			let newPrice = parseFloat( parseFloat(this.parentElement.childNodes[6].innerHTML.replace(/[^.\d]/g, '')) + parseFloat(cP_Name.childNodes[1].getAttribute("id")) ).toFixed(2);
			let newCost = parseFloat( parseFloat(document.querySelector('#total_cost').innerHTML.replace(/[^.\d]/g, '')) + parseFloat(cP_Name.childNodes[1].getAttribute("id")) ).toFixed(2);
			let newCount = parseInt(localStorage.getItem(key)) + 1;
			this.parentElement.childNodes[6].innerHTML = `$${newPrice}`;
			document.querySelector('#total_cost').innerHTML = `Total: $${newCost}`;
			this.parentElement.childNodes[4].innerHTML = newCount
			localStorage.setItem(key, newCount);
			cart_count ()
		});
	}
	for ( let l = 0; l < pwLength; l++) {
		document.querySelectorAll('.cart_rmv')[l].addEventListener('click', function() {
			let key = this.parentElement.getAttribute('id').replace(/_/g, " ");
			let cP_Name = document.querySelector(`#${key.replace(/ /g, "_")}`);
			let newPrice = parseFloat( parseFloat(this.parentElement.childNodes[6].innerHTML.replace(/[^.\d]/g, '')) - parseFloat(cP_Name.childNodes[1].getAttribute("id")) ).toFixed(2);
			let newCost = parseFloat( parseFloat(document.querySelector('#total_cost').innerHTML.replace(/[^.\d]/g, '')).toFixed(2) - parseFloat(cP_Name.childNodes[1].getAttribute("id")).toFixed(2) ).toFixed(2);
			let newCount = parseInt(localStorage.getItem(key)) - 1;
			if ( 1 < newCount ) {
				localStorage.setItem(key, newCount);
				this.parentElement.childNodes[4].innerHTML = newCount
			} else {
				localStorage.setItem(key, 1);
				this.parentElement.childNodes[4].innerHTML = 1
			}
			if ( newCount != 0 ) {
				this.parentElement.childNodes[6].innerHTML = `$${newPrice}`;
				document.querySelector('#total_cost').innerHTML = `Total: $${newCost}`;				
			}
			cart_count ()
		});
	}
	paypal.Buttons({
		createOrder: function(data, actions) {
			return fetch('/create/', {
				method: 'post',
				headers: {"X-CSRFToken": csrftoken},
				body: JSON.stringify(cartJson)
			}).then(function(res) {
				return res.json();
			}).then(function(orderData) {
				return orderData.id;
			});
		},

		onApprove: function(data, actions) {
			return fetch('/capture/', {
				method: 'post',
				headers: {"X-CSRFToken": csrftoken},
				body: JSON.stringify({id: data.orderID})
			}).then(function(res) {
				return res.json();
			}).then(function(orderData) {
				var errorDetail = Array.isArray(orderData.details) && orderData.details[0];

				if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
					// Recoverable state, see: "Handle Funding Failures"
					// https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
					return actions.restart();
				}

				if (errorDetail) {
					var msg = 'Sorry, your transaction could not be processed.';
					if (errorDetail.description) msg += '\n\n' + errorDetail.description;
					if (orderData.debug_id) msg += ' (' + orderData.debug_id + ')';
					// Show a failure message
					return alert(msg);
				}

				// Show a success message to the buyer
				document.querySelector('#completed_wrapper').style.display = 'block'
			});
		}


	}).render('#paypal-button-container');
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


if (typeof(c_p_name) != 'undefined' && c_p_name != null) {
	document.querySelector('#p1 .title').innerHTML = c_p_name.getAttribute('id').replace(/_/g, " ");
	document.querySelector('#p1 .price').innerHTML = ['$', document.querySelector('#Clothing .product_price').getAttribute('id')].join('');
	document.querySelector('#p1 .description_product').innerHTML = document.querySelector('#Clothing .product_description').getAttribute('id');
	document.querySelector('#p1 .product_image').style.background = `url(${document.querySelector('#Clothing  .product_photo').getAttribute('id')} no-repeat`;
} else {
	document.querySelector('#p1 .title').innerHTML = no_name;
	document.querySelector('#p1 .price').innerHTML = no_price;
	document.querySelector('#p1 .description_product').innerHTML = no_description;
}

if (typeof(a_p_name) != 'undefined' && a_p_name != null) {
	document.querySelector('#p2 .title').innerHTML = a_p_name.getAttribute('id').replace(/_/g, " ");
	document.querySelector('#p2 .price').innerHTML = ['$', document.querySelector('#Accessories .product_price').getAttribute('id')].join('');
	document.querySelector('#p2 .description_product').innerHTML = document.querySelector('#Accessories .product_description').getAttribute('id');
	document.querySelector('#p2 .product_image').style.background = `url(${document.querySelector('#Accessories .product_photo').getAttribute('id')} no-repeat`;
} else {
	document.querySelector('#p2 .title').innerHTML = no_name;
	document.querySelector('#p2 .price').innerHTML = no_price;
	document.querySelector('#p2 .description_product').innerHTML = no_description;
	document.querySelector('#p2 .product_image').style.background = 'url(/static/product/Accesories.jpg) no-repeat cover';
}

if (typeof(t_p_name) != 'undefined' && t_p_name != null) {
	document.querySelector('#p3 .title').innerHTML = t_p_name.getAttribute('id').replace(/_/g, " ");
	document.querySelector('#p3 .price').innerHTML = ['$', document.querySelector('#Textiles  .product_price').getAttribute('id')].join('');
	document.querySelector('#p3 .description_product').innerHTML = document.querySelector('#Textiles .product_description').getAttribute('id');
	document.querySelector('#p3 .product_image').style.background = `url(${document.querySelector('#Textiles  .product_photo').getAttribute('id')} no-repeat`;
} else {
	document.querySelector('#p3 .title').innerHTML = no_name;
	document.querySelector('#p3 .price').innerHTML = no_price;
	document.querySelector('#p3 .description_product').innerHTML = no_description;
	document.querySelector('#p3 .product_image').style.background = 'url(/static/product/Textiles.jpg) no-repeat cover';
}

for ( i = 0; i < 3; i++) {
	products[i].addEventListener('mouseover', function() {
		active_products = document.querySelector('.product.active');
		description = document.querySelector('.description_wrapper');
		current_active = document.querySelector('.product.active');
		this_product = this;
		if ( hovered == undefined || current_active != this ) {
			clear_active();
			document.querySelector('.description_wrapper h4').innerHTML = current_active.querySelector('.title').innerHTML.replace(/_/g, " ");
			document.querySelector('.description_wrapper p').innerHTML = current_active.querySelector('.description_product').innerHTML;
		}
	});
}

for ( i = 0; i < 3; i++) {
	categories[i].addEventListener('mouseover', function() {
		active_h4 = this
		current_category = this.innerHTML;
		category_products = document.querySelectorAll(`#${current_category} .product_name`);
		category_length = category_products.length;
		if ( category_hovered == undefined || this_category != this) {
			if (typeof(document.querySelector('.category.active')) != 'undefined' && document.querySelector('.category.active') != null) {
				document.querySelector('.category.active').style.textDecoration = "none";
				document.querySelector('.category.active').classList.remove('active');
			}	
			this.classList.add('active');
			this.style.textDecoration = "underline";
			active_h4 = this
			display_category ()
			current_i = 2;
		}
		this_category = this;
		display_arrows ();
		document.querySelector('.description_wrapper h4').innerHTML = current_active.querySelector('.title').innerHTML.replace(/_/g, " ");
		document.querySelector('.description_wrapper p').innerHTML = current_active.querySelector('.description_product').innerHTML;
	});
}

for ( let e = 0; e < 2; e++) {
	document.querySelectorAll('#exit')[e].addEventListener('click', function() {
		document.querySelector('#overlay_wrapper').style.display = 'none'
		document.querySelector('#completed_wrapper').style.display = 'none'
	});
}
document.querySelector('.Arrow_Left').addEventListener('click', function() {
	current_i--;
	display_arrows ();
	var current_p = 0;
	var product_iteration = 4;
	for (var p=0; p < 3; p++) {
		current_p++;
		product_iteration--
		var true_i = current_i + 1;
		current_den = true_i - current_p
		var image_style = document.querySelectorAll(`#${current_category}  .product_photo`)[current_den].getAttribute("id");
		document.querySelector(`#p${product_iteration} .title`).innerHTML = document.querySelectorAll(`#${current_category} .product_name`)[current_den].getAttribute('id').replace(/_/g, " ");
		document.querySelector(`#p${product_iteration} .price`).innerHTML = ['$', document.querySelectorAll(`#${current_category} .product_price`)[current_den].getAttribute('id')].join('');
		document.querySelector(`#p${product_iteration} .description_product`).innerHTML = document.querySelectorAll(`#${current_category} .product_description`)[current_den].getAttribute('id');
		document.querySelector(`#p${product_iteration} .product_image`).style.background = ['url(', image_style, ') no-repeat'].join('');
		document.querySelector(`#p${product_iteration} .product_image`).style.backgroundSize = 'cover'
	}
	current_active = document.querySelector('.product.active');
	document.querySelector('.description_wrapper h4').innerHTML = current_active.querySelector('.title').innerHTML.replace(/_/g, " ");
	document.querySelector('.description_wrapper p').innerHTML = current_active.querySelector('.description_product').innerHTML;
});

document.querySelector('.Arrow_Right').addEventListener('click', function() {
	current_i++;
	display_arrows ();
	var current_p = 0;
	var product_iteration = 4;
	for (var p=0; p < 3; p++) {
		current_p++;
		product_iteration--
		var true_i = current_i + 1;
		current_den = true_i - current_p;
		var image_style = document.querySelectorAll(`#${current_category}  .product_photo`)[current_den].getAttribute("id");
		document.querySelector(`#p${product_iteration} .title`).innerHTML = document.querySelectorAll(`#${current_category} .product_name`)[current_den].getAttribute('id').replace(/_/g, " ");
		document.querySelector(`#p${product_iteration} .price`).innerHTML = ['$', document.querySelectorAll(`#${current_category} .product_price`)[current_den].getAttribute('id')].join('');
		document.querySelector(`#p${product_iteration} .description_product`).innerHTML = document.querySelectorAll(`#${current_category} .product_description`)[current_den].getAttribute('id');
		document.querySelector(`#p${product_iteration} .product_image`).style.background = ['url(', image_style, ') no-repeat'].join('');
		document.querySelector(`#p${product_iteration} .product_image`).style.backgroundSize = 'cover'
	}
	current_active = document.querySelector('.product.active');
	document.querySelector('.description_wrapper h4').innerHTML = current_active.querySelector('.title').innerHTML.replace(/_/g, " ");
	document.querySelector('.description_wrapper p').innerHTML = current_active.querySelector('.description_product').innerHTML;
});

document.querySelector('#cartbtn').addEventListener('click', function() {
	cart_count_active ();
});

document.querySelector('#buybtn').addEventListener('click', function() {
	cart_count_active ();
	let Product = current_active.childNodes[13].innerHTML
	if ( Product != ' No Items Found ') {
		load_cart()
	}
});



document.querySelector('#cart_icon').addEventListener('click', function() {
	if ( 0 < cart_count ()  ) {
		load_cart()
	}
});


		
async function wait_hover () {
	while ( hovered === undefined ) {
		for ( i = 0; i < 3; i++) {
			if (hovered != undefined) { break; }
			active_products = document.querySelector('.product.active');
			active_products.classList.remove('active');
			clearAnimation();
			products = document.querySelectorAll('.product');
			products[i].classList.add('active')
			description.classList.add('active');
			document.querySelector('.description_wrapper h4').innerHTML = current_active.querySelector('.title').innerHTML.replace(/_/g, " ");
			document.querySelector('.description_wrapper p').innerHTML = current_active.querySelector('.description_product').innerHTML;
			await timer(2000);
		}
		
	}
}

cart_count ();

wait_hover ();
