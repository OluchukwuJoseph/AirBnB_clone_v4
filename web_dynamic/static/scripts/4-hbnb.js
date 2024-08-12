// // This script makes the filter section dynamic and check api status

$(document).ready(function () {
	const amenities = {};
	$("li input[type=checkbox]").change(function () {
		if (this.checked) {
			amenities[this.dataset.id] = this.dataset.name;
		} else {
			delete amenities[this.dataset.id];
		}
		$(".amenities h4").text(Object.values(amenities).sort().join(", "));
	});

  $.get('http://localhost:5001/api/v1/status/', (data, textStatus) => {
    if (data['status'] === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

	// Create and populate Place Objects
	populate_places({});

	// Create and populate Place objects having all Amenity ids checked
	$('section.filters button').bind("click", () => {
		populate_places({'amenities': Object.keys(amenities)});
	});
});


/**
 * This function creates and populates Place Objects with content
 * @param {String} search_query: Optional dictionary, Keys can either be
 * states, cities, amenities. Values are list of keys ID's.
 */
function populate_places(search_query) {
	$.post({
		url: 'http://localhost:5001/api/v1/places_search',
		data: JSON.stringify(search_query),
		headers: {"Content-Type": "application/json"},
		success: (data) => {
			data.forEach((place) => {
				const item = $(`<article>
					<div class="title_box">
						<h2>${place.name}</h2>
						<div class="price_by_night">$${place.price_by_night}</div>
					</div>
					<div class="information">
						<div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? "s" : ""}</div>
						<div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? "s" : ""}</div>
						<div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? "s" : ""}</div>
					</div>
				</article>`);
				// Get user information and append to place
				$.get(`http://localhost:5001/api/v1/users/${place.user_id}`, (data, textStatus) => {
					item.append(`<div class="user">
						<b>Owner:</b> ${data.first_name} ${data.last_name}
					</div>
						<div class="description">${place.description}</div>`
						);
					});
				$("section.places").append(item);
			});
		},
		dataType: "json"
	});
}