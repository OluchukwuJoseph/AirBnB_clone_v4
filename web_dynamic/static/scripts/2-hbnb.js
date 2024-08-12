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

  $.get('http:///0.0.0.0:5001/api/v1/status/', (data, textStatus) => {
    if (data['status'] === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
});
