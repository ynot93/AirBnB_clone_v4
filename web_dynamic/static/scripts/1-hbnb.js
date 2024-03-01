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
});
