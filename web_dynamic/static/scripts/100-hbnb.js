// This script makes the filter section dynamic and check api status
$(document).ready(() => {
  const clicked_items = {
    states_id: [],
    states_name: [],
    cities_id: [],
    cities_name: [],
    amenities_id: [],
    amenities_name: []
  };

  $("li input[type=checkbox]").change(function() {
    const id = this.dataset.id;
    const name = this.dataset.name;
    const category = this.dataset.category;

    if (this.checked) {
      if (category === 'state') {
        clicked_items.states_id.push(id);
        clicked_items.states_name.push(name);
      } else if (category === 'city') {
        clicked_items.cities_id.push(id);
        clicked_items.cities_name.push(name);
      } else if (category === 'amenity') {
        clicked_items.amenities_id.push(id);
        clicked_items.amenities_name.push(name);
      }
    } else {
      if (category === 'state') {
        clicked_items.states_id = clicked_items.states_id.filter(item => item !== id);
        clicked_items.states_name = clicked_items.states_name.filter(item => item !== name);
      } else if (category === 'city') {
        clicked_items.cities_id = clicked_items.cities_id.filter(item => item !== id);
        clicked_items.cities_name = clicked_items.cities_name.filter(item => item !== name);
      } else if (category === 'amenity') {
        clicked_items.amenities_id = clicked_items.amenities_id.filter(item => item !== id);
        clicked_items.amenities_name = clicked_items.amenities_name.filter(item => item !== name);
      }
    }

    // Display the values in <h4> elements
    $('.locations h4').text([...clicked_items.states_name, ...clicked_items.cities_name].sort().join(", "));
    $('.amenities h4').text(clicked_items.amenities_name.sort().join(", "));
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

  // Create and populate Place objects having all checked ids
  $(".filters button").bind("click", () => {
    populate_places({"states": clicked_items.states_id,
      "cities": clicked_items.cities_id,
      "amenities": clicked_items.amenities_id});
  });
});

/**
 * This function creates and populates Place Objects with content
 * @param {Object} search_query: object, Keys can either be
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
