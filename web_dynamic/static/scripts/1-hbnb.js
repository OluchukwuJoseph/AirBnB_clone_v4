// This script makes the filter section dynamic

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
});
