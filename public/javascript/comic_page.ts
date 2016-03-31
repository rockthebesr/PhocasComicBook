///<reference path='../../types/DefinitelyTyped/jquery/jquery.d.ts'/>
    jQuery(document).on('click', '#btnNext', function(){
        nextComicSet();
    });

    jQuery(document).on('click', '#btnPrev', function(){
        prevComicSet();
    });

    var nextComicSet = function(){
        if (nextSetTitle.length > 0) {
            window.location = '/comic_page/' + nextSetTitle;
        } else {
            alert("there is no next set!")
        }
    };

    var prevComicSet = function(){
        if (prevSetTitle.length > 0) {
            window.location = '/comic_page/' + prevSetTitle;
        } else {
            alert("there is no previous set!")
        }
    };


    jQuery(document).on('click', '#editComicBottom', function() {
        if (currentUser != uploadedBy || allowOthersToEdit == "false") {
            window.alert("You cannot edit this comic!")
        } else {
            $.ajax({
                url: '/edit_comic/' + title,
                type: 'GET',
                contentType: 'application/json',
                data: {},
                success: function () {
                }
            })
        }

    });


