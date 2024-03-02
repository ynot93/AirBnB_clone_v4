$(document).ready(function() {
    const amenities = {}; // Initialize an empty object for selected amenities

    // Listen for changes on all checkboxes within list items
    $("li input[type=checkbox]").on('change', function() {
        const amenityName = $(this).data('name'); // Get the Amenity name
        const amenityId = $(this).data('id'); // Get the Amenity ID

        // Update the amenities object based on checkbox state
        if (this.checked) {
            amenities[amenityName] = amenityId; // Add to selected amenities
        } else {
            delete amenities[amenityName]; // Remove from selected amenities
        }

        // Update displayed list of selected amenities
        $(".amenities h4").text(Object.keys(amenities).sort().join(", "));
    });

    // Send POST request to http://0.0.0.0:5001/api/v1/places_search/
    $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({}),
        success: function (places) {
            places.forEach(function (place) {
                const article = $('<article></article>');
                const titleBox = $('<div class="title_box"></div>');
                titleBox.append('<h2>' + place.name + '</h2>');
                titleBox.append('<div class="price_by_night">' + place.price_by_night + '</div>');
                article.append(titleBox);

                const information = $('<div class="information"></div>');
                information.append('<div class="max_guest">' + place.max_guest + ' Guest</div>');
                information.append('<div class="number_rooms">' + place.number_rooms + ' Bedrooms</div>');
                information.append('<div class="number_bathrooms">' + place.number_bathrooms + ' Bathrooms</div>');
                article.append(information);

                article.append('<div class="description">' + place.description + '</div>');

                $('section.places').append(article);
            });
        }
    });

    // Send GET request to http://0.0.0.0:5001/api/v1/status/
    const url = "http://0.0.0.0:5001/api/v1/status/";
    $.get(url, function(data) {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });
});
