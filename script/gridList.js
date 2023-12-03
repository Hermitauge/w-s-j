
$(".tab-button").click(function(e) { 
    e.preventDefault();
    $(".tab-button").removeClass("tab-button-active");

    // Check if the clicked button is the one with id 'grid-view'
    if (this.id === 'grid-view') {
        // Add 'grid-view' class to elements with class 'collection-list' and 'main-panel'
        $('.collection-list').addClass('grid-view');

        // Remove 'hide' class from element with class 'grid-panel'
        $('.grid-panel').removeClass('hide');
           $('.main-panel, .thead').addClass('hide');
    }

    // Check if the clicked button is the one with id 'list-view'
    if (this.id === 'list-view') {
        // Remove 'grid-view' class from elements with class 'collection-list' and 'main-panel'
        $('.collection-list').removeClass('grid-view');

        // Add 'hide' class to element with class 'grid-panel'
        $('.grid-panel').addClass('hide');
           $('.main-panel, .thead').removeClass('hide');
    }

    // Add 'tab-button-active' class to the clicked button
    $(this).addClass("tab-button-active");
});

