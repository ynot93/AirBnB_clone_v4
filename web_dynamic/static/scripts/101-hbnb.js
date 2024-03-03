$(document).ready(function() {
    const amenities = {}; // Initialize an empty object for selected amenities
    const states = {};
    const cities = {};

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

    // Listen for changes on all checkboxes within list items for states and cities
    $("li input[type=checkbox][data-name]").on('change', function () {
        const name = $(this).data('name');
        const id = $(this).data('id');

        // Determine if it's a state or city
        if ($(this).parent().children("ul").length) {
            if (this.checked) {
                states[name] = id;
            } else {
                delete states[name];
            }
        } else {
            if (this.checked) {
                cities[name] = id;
            } else {
                delete cities[name];
            }
        }

        // Update displayed list of selected states and cities
        $(".locations h4").text(Object.keys(states).sort().join(", ") + ", " + Object.keys(cities).sort().join(", "));
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

    // Function to fetch and display reviews
    function fetchReviews() {
        $.get('http://0.0.0.0:5001/api/v1/places_search/', function(reviews) {
            const reviewsContainer = $('#reviewsContainer');
            reviewsContainer.empty();

            if (reviews.length === 0) {
                reviewsContainer.append('<p>No reviews available.</p>');
            } else {
                const list = $('<ul></ul>');
                reviews.forEach(function(review) {
                    const listItem = $('<li></li>');
                    listItem.append('<h3>From ' + review.user + ' on ' + review.date + '</h3>');
                    listItem.append('<p>' + review.text + '</p>');
                    list.append(listItem);
                });
                reviewsContainer.append(list);
            }
        });
    }

    $('.reviews').hide();

    // Toggle reviews when span is clicked
    $('#toggleReviews').click(function() {
        const span = $(this);
        const reviewsContainer = $('#reviewsContainer');

        if (span.hasClass('show')) {
            span.removeClass('show').addClass('hide').text('hide');
            reviewsContainer.show();
            fetchReviews();
        } else {
            span.removeClass('hide').addClass('show').text('show');
            reviewsContainer.empty().hide();
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

    // Search places when button is clicked
    $(".filters button").bind("click", searchPlace);
    searchPlace();
    
    function searchPlace() {
        $.post({
            url: `${HOST}/api/v1/places_search`,
            data: JSON.stringify(amenities),
            headers: {
                "Content-Type": "application/json",
            },
            success: function (data) {
                $('section.places').empty();
                data.forEach(function (place) {
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
            },
            dataType: "json",
        });
    }


});
