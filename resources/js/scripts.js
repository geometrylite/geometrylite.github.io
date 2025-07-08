window.addEventListener("DOMContentLoaded", function () {
    search_json();//search_complete();
    //search_mobile();
    load_wishlist_cookies();
    $(".scrollTo").on('click', function (e) {
        e.preventDefault();
        var target = $(this).attr('data-target');
        let id_target = $('#' + target);
        console.log(id_target);
        $('html, body').animate({
            scrollTop: (id_target.offset().top)
        }, 500, 'swing');
    });

    let isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isMobile || isTouchDevice) {
        $("body").addClass("is_mobile");
    } else {
        $("body").removeClass("is_mobile");
    }
    var btn = $('#button-gotop');
    $(window).scroll(function () {
        if ($(window).scrollTop() > 300) {
            btn.addClass('show');
        } else {
            btn.removeClass('show');
        }
    });
    btn.on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, '300');
    });

    lazyLoad();
    //hide_show_content();
    //add_module();
    slider_js();
    show_hide_sidebar_mobile();
    menu_sidebar_active();
    open_dialog();
});

function lazyLoad() {
    $('.lazy').Lazy({
        effect: "fadeIn",
        effectTime: 300,
    });
}

function hide_show_content() {
    let height_content = $('.game-description').outerHeight();
    if (height_content <= 739) {
        $('.show_content').css({'display': 'none'})
        $('.game-description').attr('style', 'height:unset');
    } else {
        $('.game-description').attr('style', 'height:740px;overflow:hidden');
        $('.show_content').css({'display': 'flex'});
        $('.ShowMore_button').addClass('more');
        $('.content-inner').css({'padding-bottom': '50px'})
    }

    $('.ShowMore_button').click(function () {
        if ($('.ShowMore_button').hasClass('more')) {
            $('.ShowMore_button').removeClass('more')
            $('.game-description').animate({
                'height': height_content + 'px', 'overflow': 'hidden', 'animation': 'height 1000ms ease 0ms'
            }, {
                easing: 'swing', complete: function () {
                    $('.game-description').attr('style', 'height:auto');
                    $('.ShowMore_button').html('Show less <span class="svg-icon" aria-hidden="true"> <svg class="svg-icon__link"> <use xlink:href="#icon-keyboard_arrow_up"></use> </svg></span>');
                    $('.ShowMore_button').addClass('less')

                }
            })
        } else {
            $('.ShowMore_button').removeClass('less')
            $('.game-description').animate({
                'height': '740px', 'overflow': 'hidden', 'animation': 'height 1000ms ease 0ms'
            }, {
                easing: 'swing', complete: function () {
                    $('.game-description').attr('style', 'height:740px;overflow:hidden');
                    $('.ShowMore_button').html('Show more <span class="svg-icon" aria-hidden="true"> <svg class="svg-icon__link"> <use xlink:href="#icon-keyboard_arrow_down"></use> </svg></span>');
                    $('.ShowMore_button').addClass('more')
                }
            })

        }

    })


}

function copyToClipboard(element, e) {
    var $temp = $("<input>");
    $("body").append($temp);
    // $temp.val($(element).val()).select();
    $(element).select();
    document.execCommand("copy");
    $(e).html('COPIED!!');
    setTimeout(function () {
        $(e).html('Copy link');
    }, 3000);
    $temp.remove();
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function search(array, value) {
    value = value.toString().toLowerCase();
    return array.filter(function (o) {
        return Object.keys(o).some(function (k) {
            return o[k].toString().toLowerCase().indexOf(value) !== -1;
        });
    });
}

function search_json() {
    $('input#search_txt').each(function () {
        let empty = $(this).val().length == 0;
        if (empty) {
            $('#search_button').attr('disabled', 'disabled');
        }
    });
    $('input#search_txt').keyup(function (e) {

        var keyword = $("input#search_txt").val();

        if (keyword.length >= 3) {
            let empty = false;
            $('input#search_txt').each(function () {
                empty = $(this).val().length == 0;
            });
            if (empty) {
                $('#search_button').attr('disabled', 'disabled');
            } else {
                $('#search_button').attr('disabled', false);
                $('#searchModalLabel').html('Result for ' + keyword);
                readTextFile(game_config.domain_root + "games.json", function (text) {
                    var data = JSON.parse(text);
                    var games = search(data, keyword);
                    if ($(".search-results").find(".search__result_container").length > 0) {
                        $(".search-results").find(".search__result_container").remove();
                    }
                    let str_html = `<div class="search__result_container absolute z-50 left-0 right-0 mt-6 rounded-3xl shadow-2xl shadow-[#007b43]/10 dark:shadow-[#007b43]/5 max-h-[60vh] overflow-hidden dark:bg-gray-900/98 backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2"> <div class="overflow-y-auto max-h-[60vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#007b43]/5 dark:[&::-webkit-scrollbar-track]:bg-[#007b43]/10 [&::-webkit-scrollbar-thumb]:bg-[#007b43]/30 dark:[&::-webkit-scrollbar-thumb]:bg-[#007b43]/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"> <div class="divide-y divide-[#007b43]/10 dark:divide-[#007b43]/5">`;
                    if (games.length > 0) {
                        console.log('result lenght:' + games.length);

                        games.forEach(function (item, index) {
                            let url_game = "";
                            if (item.slug === game_config.home_page) {
                                url_game = "/";
                            } else {
                                url_game = "/" + item.slug;
                            }
                            str_html += `<a href="${url_game}" class="link_search_complete w-full flex items-center group transition-all duration-300 gap-4 p-2"> <div class="relative flex-shrink-0 rounded overflow-hidden ring-2 ring-[#007b43]/20 transition-all duration-300 w-8 h-8"> <img src="${item.image}" alt="${item.name}" class="object-cover w-full h-full flex-shrink-0 transition-transform duration-500 group-hover:scale-110" loading="lazy"></div> <div class="flex-1 min-w-0 text-left text_search_complete text_color">${item.name}</div> </a>`;
                        });
                    } else {
                        str_html += `<div class="p-4 "><h3 class="text-dark">No result for ${keyword}</h3></div>`

                    }
                    str_html += `</div></div></div>`;
                    $(".search-results").append(str_html);
                    let i = document.getElementById("search_txt");
                    i.addEventListener("focus", (function () {
                        document.getElementsByClassName("search__result_container")[0].style.display = "block"
                    })), i.addEventListener("focusout", (function () {
                        setTimeout((function () {
                            document.getElementsByClassName("search__result_container")[0].style.display = "none"
                        }), 500)
                    }))
                    $("#search_txt").keyup(delay(function (e) {
                        var keyword = $("#search_txt").val();
                        if (keyword.length < 3) {
                            $(".search__result_container").css('display', 'none');
                            $(".no-result-search").hide();
                        }
                    }, 300));
                });
            }
        }
    });
}


function slider_js() {
    var swiperHot = new Swiper('.games-hot-slide .swiper', {
        slidesPerView: 5.5,
        spaceBetween: 18,
        speed: 600,
        freeMode: true,
        navigation: {
            nextEl: '.games-hot-slide .next_btn',
            prevEl: '.games-hot-slide .prev_btn',
        },
        draggable: true,
        breakpoints: {
            1386: {
                slidesPerView: '6',
                freeMode: true,
            },
            1199: {
                slidesPerView: '5',
                freeMode: true,
            },
            991: {
                slidesPerView: '4',
                freeMode: true,
            },
            600: {
                freeMode: true,
                slidesPerView: '3',
            },
            500: {
                freeMode: true,
                slidesPerView: '2.3',
            },
            400: {
                freeMode: true,
                slidesPerView: '2',
            }
        }
    });
    swiperHot.on('slideChange', function () {
        lazyLoad();
    });
    var swiperCat = new Swiper('.sliderCategoryList .swiper', {
        slidesPerView: 'auto',
        spaceBetween: 12,
        speed: 600,
        freeMode: true,
        navigation: {
            nextEl: '.sliderCategoryList .next_btn',
            prevEl: '.sliderCategoryList .prev_btn',
        },
        draggable: true
    });
    var swiperTop = new Swiper('.games-top-week .swiper', {
        slidesPerView: 5.5,
        spaceBetween: 18,
        speed: 600,
        freeMode: true,
        navigation: {
            nextEl: '.games-top-week .next_btn',
            prevEl: '.games-top-week .prev_btn',
        },
        draggable: true,
        breakpoints: {
            1386: {
                slidesPerView: '6',
                freeMode: true,
            },
            1199: {
                slidesPerView: '5',
                freeMode: true,
            },
            991: {
                slidesPerView: '4',
                freeMode: true,
            },
            600: {
                freeMode: true,
                slidesPerView: '3',
            },
            500: {
                freeMode: true,
                slidesPerView: '2.3',
            },
            400: {
                freeMode: true,
                slidesPerView: '2',
            }
        }
    });
    swiperTop.on('slideChange', function () {
        lazyLoad();
    });
}

function open_fullscreen() {
    let game = document.getElementById("game-area");
    if (game == null) return;
    if (!document.fullscreenElement && !document.mozFullScreenElement &&
        !document.webkitFullscreenElement && !document.msFullscreenElement) {

        if (game.requestFullscreen) {
            game.requestFullscreen();
        } else if (game.msRequestFullscreen) {
            game.msRequestFullscreen();
        } else if (game.mozRequestFullScreen) {
            game.mozRequestFullScreen();
        } else if (game.webkitRequestFullscreen) {
            game.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

function delay(callback, ms) {
    var timer = 0;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.apply(context, args);
        }, ms || 0);
    };
}


function show_hide_sidebar_mobile() {
    $(".menu").on('click', function () {
        $(".sidebar-mobile").css("transform", "translateX(0)");
        $(".bg-overlay").css("display", "block")
    })

    $(".btn-close-sidebar").on('click', function () {
        $(".sidebar-mobile").css("transform", "translateX(-100%)");
        $(".bg-overlay").css("display", "none");
    })

    $(document).mouseup(function (e) {
        if ($(e.target).closest(".sidebar-mobile").length === 0) {
            $(".sidebar-mobile").css("transform", "translateX(-100%)");
            $(".bg-overlay").css("display", "none");
        }
    });
}

function menu_sidebar_active() {
    var current_url = window.location.pathname;
    $(".side-nav ul li a").each(function () {
        var menu_link = $(this).attr("href");
        if (menu_link == current_url) {
            $(this).addClass("active")
            $(this).removeClass("text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-[#007b43]/5 hover:to-[#4ade80]/5 dark:hover:from-[#007b43]/10 dark:hover:to-[#4ade80]/10");
            $(this).addClass("bg-gradient-to-r from-[#007b43] to-[#4ade80]");
            $(this).find("span").removeClass("text_color");
            $(this).find("span").css("color", "white");
        }
    })
}

/*=========dialog control========*/
function open_dialog() {
    $('.toggleModalBtn').on('click', function () {
        var modalId = $(this).data('target'); // e.g., "#modalOverlay1"
        $(this).toggleClass("open");
        var $modalOverlay = $(modalId);

        // Reverse the logic: if the button now has the "open" class, then open the dialog.
        if ($(this).hasClass("open")) {
            $('.toggleModalBtn').removeClass("open");
            $('.toggleModalBtn').removeClass("active");
            $(this).addClass("open");
            $(this).addClass("active");
            // Open the modal
            $('.blur_dialog').removeClass('active');
            $('.blur_dialog').find('.game_dialog_container').removeClass('slide-out');
            $modalOverlay.addClass('active');
            // Remove any previous slide-out and force reflow
        } else {
            // Close the modal
            close_dialog(modalId);
        }
    });

    // Close modal when a close button is clicked
    $('.closeModalBtn').on('click', function () {
        // Pass the closest modal overlay
        close_dialog($(this).closest('.blur_dialog'));

    });

}

function close_dialog(modal) {
    var $modalOverlay = $(modal).closest('.blur_dialog');
    $('.toggleModalBtn').removeClass("open");
    $('.toggleModalBtn').removeClass("active");
    $modalOverlay.removeClass('active');
}

$(document).on('click', function (e) {
    if (!$(e.target).closest('.blur_dialog').length && !$(e.target).closest('.toggleModalBtn').length) {
        $('.blur_dialog.active').each(function () {
            close_dialog(this);
        });
    }
});
/*=========dialog control========*/
/*=========Vote========*/
$(document).on('click', '.button_vote_game', function () {
    event_send_vote(this);
});

function add_module() {
    if (!game_config.url_game) {
        return;
    }
    let url = "/add-module.ajax";
    $.ajax({
        url: url,
        type: "POST",
        data: {
            url_game: game_config.url_game
        },
        success: function (response) {
            if (response) {
                let data = JSON.parse(response);
                if ($("#csrf-token").length) {
                    $("#csrf-token").remove();
                }
                if ($("#gmuid").length) {
                    $("#gmuid").remove();
                }
                $("body").append(data.gm_layout);
                game_vote_load();
            }
        }
    })
}

function event_send_vote(e) {
    let _game_id = $(e).data('game');
    let _vote = $(e).data('vote');
    let _url = $("#game_vote_panel").data('url');

    let voteUpBtn = $('#vote-up');
    let voteDownBtn = $('#vote-down');
    let upCountEl = $('#up-count');
    let downCountEl = $('#down-count');
    let child_up_last = voteUpBtn.find('.g-footer__button-title_last');
    let child_down_last = voteDownBtn.find('.g-footer__button-title_last');

    let interacted = $(e).hasClass('voted');
    $('.button_vote_game').removeClass('voted');
    $(".g-footer__button-title_last").text("");
    child_down_last.text("Dislike");
    child_up_last.text("Like");

    let local_storage_key = 'voted_game';
    let voted_data = readFromLocalStorage(local_storage_key);
    let pre_vote = '';
    if (voted_data && voted_data.length > 0) {
        $.each(voted_data, function (key, voted_game) {
            if (voted_game.id == _game_id) {
                pre_vote = voted_game.vote;
            }
        });
    }
    if (!interacted) {
        $(e).addClass('voted');
        $(e).find('.g-footer__button-title_last').text("Remove")
    }
    $(e).blur();
    let token = $("#csrf-token").val();
    let gmuid = $("#gmuid").val();
    if (e == null) return;
    $.ajax({
        url: '/game-vote.ajax',
        method: 'POST',
        data: {
            vote: _vote,
            id: _game_id,
            token: token,
            gmuid: gmuid,
            url: _url,
            pre_vote: pre_vote
        },
        success: function (voteData) {
            upCountEl.text(formatNumber(voteData.up_count) || 0);
            downCountEl.text(formatNumber(voteData.down_count) || 0);
            $("#csrf-token").val(voteData.t);
            game_vote_save(_game_id, _vote);
        },
        error: function (jqxhr, textStatus, error) {
            console.error("Error:", error);
        }
    });
}

function game_vote_save(_id, _vote) {
    if (!!readFromLocalStorage('voted_game') && _id !== '' && _vote !== '') {
        let voted_array = readFromLocalStorage('voted_game');
        let interacted = false;
        jQuery.each(voted_array, function (key, value) {
            if (value !== undefined && value.id === _id && key > -1) {
                if (value.vote === _vote) {
                    interacted = true;
                }
                voted_array.splice(key, 1);
            }
        });
        if (interacted) {
            saveToLocalStorage('voted_game', JSON.stringify(voted_array));
            return;
        }
        voted_array.push({
            "id": _id, "vote": _vote
        });
        saveToLocalStorage('voted_game', JSON.stringify(voted_array));
    } else {
        var voted_array = [];
        voted_array.push({
            "id": _id, "vote": _vote
        });
        saveToLocalStorage('voted_game', JSON.stringify(voted_array));
    }
}

function game_vote_load() {
    if ($("#game_vote_panel").length > 0) {
        let _game_id = $("#game_vote_panel").data('game');
        let _url = $("#game_vote_panel").data('url');
        var token = $("#csrf-token").val();
        let voteUpBtn = $('#vote-up');
        let voteDownBtn = $('#vote-down');
        let upCountEl = $('#up-count');
        let downCountEl = $('#down-count');
        let child_up_last = voteUpBtn.find('.g-footer__button-title_last');
        let child_down_last = voteDownBtn.find('.g-footer__button-title_last');
        $.getJSON('/game-vote.ajax', {id: _game_id, token: token, url: _url})
            .done(function (voteData) {
                upCountEl.text(formatNumber(voteData.up_count) || 0);
                downCountEl.text(formatNumber(voteData.down_count) || 0);
                $("#csrf-token").val(voteData.t);
                //load state vote
                let local_storage_key = 'voted_game';
                //  console.log(readFromLocalStorage(local_storage_key));
                if (!!readFromLocalStorage(local_storage_key)) {
                    var voted_game = readFromLocalStorage(local_storage_key);
                    let _voted = '';
                    if (voted_game.length > 0) {
                        $.each(voted_game, function (key, voted_game) {
                            if (voted_game.id == _game_id) {
                                _voted = voted_game.vote;

                                if (_voted === 'like') {
                                    voteUpBtn.addClass('voted');
                                    child_up_last.text("Remove");
                                    voteDownBtn.removeClass('voted');
                                } else if (_voted === 'dislike') {
                                    voteDownBtn.addClass('voted');
                                    child_down_last.text("Remove");
                                    voteUpBtn.removeClass('voted');
                                    console.log('dislike')
                                } else {

                                    voteUpBtn.removeClass('voted');
                                    voteDownBtn.removeClass('voted');
                                    child_down_last.text("Dislike");
                                    child_up_last.text("Like");
                                    console.log('not vote')
                                }
                            }
                        });
                    }
                }
                //load comemnt
                if (game_config.show_comment !== "yes") return;
                load_comment(1, 10, "newest", _url, "#list_comment", "f5", voteData.t);
            })
            .fail(function (jqxhr, textStatus, error) {
                console.log("Request Failed: " + textStatus + ", " + error);
            });
        //


    }
}

function formatNumber(num) {
    // For numbers less than 1000, return the number as-is.
    if (num < 1000) {
        return num.toString();
    }

    // Define suffixes for thousands, millions, billions, and trillions.
    var suffixes = ["k", "M", "B", "T"];
    var suffixIndex = -1;
    var formattedNum = num;

    // Divide the number by 1000 until it is less than 1000, increasing the suffix index each time.
    while (formattedNum >= 1000 && suffixIndex < suffixes.length - 1) {
        formattedNum /= 1000;
        suffixIndex++;
    }

    // Format the number with one decimal place if it's less than 10, otherwise use no decimals.
    var precision = formattedNum < 10 ? 1 : 0;
    return formattedNum.toFixed(precision) + suffixes[suffixIndex];
}

/*=========Vote========*/

/*=========LocalStorage========*/
function saveToLocalStorage(key, value) {
    // Convert value to JSON string if it's not already a string
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
}

function readFromLocalStorage(key) {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) {
        // Key not found
        return [];
    }

    // Try to parse the stored string as JSON.
    // If parsing fails, return it as a string.
    try {
        return JSON.parse(storedValue);
    } catch (err) {
        return storedValue;
    }
}

function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
}

/*=========LocalStorage========*/

/*=========Report Game========*/
function report_open(e) {
    $(e).toggleClass('active');
    let name_game = $(e).attr('data-game-name');
    $("#contact-popup").toggleClass('show');
    $("#game_report_name").val(name_game);
    $("#game_report_url").val(game_config.url_game);
}

function report_close() {
    $("#contact-popup").removeClass('show');
    $('.report_bug').removeClass('active');
}

$(document).on('click', function (e) {
    if (!$(e.target).closest('#contact-popup').length && !$(e.target).closest('.report_bug').length) {
        report_close();
    }
});

function submit_form_contact() {
    function isNotEmptyOrWhitespace(value) {
        return /\S/.test(value);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Basic email regex
    }

    // Real-time email validation on keyup
    $('input[name="email_contact"]').on('keyup', function () {
        var email = $(this).val().trim();
        var $errorMessage = $(this).next('.error-message-email');

        if (email === '') {
            $(this).removeClass('error-field');
            $errorMessage.hide();
            return;
        }

        if (!isValidEmail(email)) {
            $(this).addClass('error-field');
            $errorMessage.text('Please enter a valid email address.').show();
        } else {
            $(this).removeClass('error-field');
            $errorMessage.hide();
        }
    });

    $('#bugReportForm').on('submit', function (e) {
        e.preventDefault();
        var $form = $(this);
        var typeContactValue = $('select[name="type_contact"]').val();
        var contentValue = $('#content_contact').val().trim();
        var emailValue = $('input[name="email_contact"]').val().trim();
        var isValid = true;
        var errorMessage = '';

        // Validate select dropdown
        if (!typeContactValue) {
            isValid = false;
            errorMessage = 'Please select an issue type.';
        }
        // Validate description textarea
        else if (!contentValue) {
            isValid = false;
            errorMessage = 'Please describe the bug.';
        } else if (contentValue.length < 10) {
            isValid = false;
            errorMessage = 'Description must be at least 10 characters.';
        } else if (!isNotEmptyOrWhitespace(contentValue)) {
            isValid = false;
            errorMessage = 'Description cannot be empty.';
        }
        // Validate email (if provided)
        else if (emailValue !== '' && !isValidEmail(emailValue)) {
            isValid = false;
            errorMessage = 'Please enter a valid email.';
        }

        if (!isValid) {
            $(".error_form_contact").show().text(errorMessage);

            // Highlight problematic field
            if (errorMessage.includes('email')) {
                $('input[name="email_contact"]').addClass('error-field');
            }
            return;
        } else {
            $(".error_form_contact").hide().text('')
        }

        // If validation passes, proceed with form submission
        var formData = new FormData(this);
        var token = $('#csrf-token').val();
        var gmuid = $('#gmuid').val();
        formData.append('token', token);
        formData.append('gmuid', gmuid);

        // Send AJAX request
        $.ajax({
            url: '/feedback.ajax',
            type: 'POST',
            data: formData,
            processData: false, // Required for FormData with files
            contentType: false, // Required for FormData with files
            success: function (response) {
                var result = response;
                console.log(result);
                $('#csrf-token').val(result.t);
                report_close(); // Assuming this is defined elsewhere
                $form.trigger('reset'); // Reset form
                $('input[name="screenshot"]').hide(); // Hide file input
                notify("Thank you !", 2000, "rt");
            },
            error: function (xhr, status, error) {
                alert('Error submitting bug report: ' + error);
            }
        });
    });
}

function notify(message, time, direction = "bt") {
    let html = '';
    // Simplified version for "Thank you" notification without image or extra details
    html += '<div class="notify-toast" style="position: fixed; bottom: 20px; right: -300px; z-index: 1000;">';
    html += '<div class="toast-content">';
    html += '<div class="content-notify">';
    html += '<span>' + message + '</span>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    const $notification = $(html).appendTo('body');

    // Handle direction-specific animation
    if (direction === "rt") { // Right to left
        $notification
            .show()
            .animate({right: '20px'}, 500) // Slide in from right
            .delay(time) // Display duration
            .animate({right: '-300px'}, 500, function () { // Slide out
                $(this).remove();
            });
    } else { // Default behavior (bottom to top assumed for "bt")
        $notification
            .css({bottom: '-100px'}) // Start off-screen
            .show()
            .animate({bottom: '20px'}, 500)
            .delay(time)
            .animate({bottom: '-100px'}, 500, function () {
                $(this).remove();
            });
    }
}

$(document).ready(function () {
    submit_form_contact();
});
/*=========Report Game========*/

/*=========Favorite Game========*/
function favorite(e) {
    var image = $(e).data('image');
    var id = $(e).data('id');
    var slug = $(e).data("slug");
    var name = $(e).data("name");
    var url = $(e).data("url");

    var showAddText;

    if ($(e).hasClass('favorited')) {
        remove_wishlist_cookies(id);
        $(e).removeClass('favorited');
        showAddText = true;
    } else {
        save_wishlish_cookies(id, slug, image, name, url);
        $(e).addClass('favorited');
        showAddText = false;
    }
    notifical_show(id, name, image, slug, showAddText, e);
}

function notifical_show(id, name, image, slug, favorited, e) {
    let str = '';
    str += '<span class="svg-icon svg-icon--heart btn__icon" aria-hidden="true"> <svg class="svg-icon__link"> <use xlink:href="#icon-heart"></use> </svg> </span>';
    str += `
      <div class="g-footer__button-title">
        <span class="g-footer__button-title_text g-footer__button-title_first"></span>
        <span class="g-footer__button-title_text g-footer__button-title_last">
          ${favorited ? "Add" : "Remove"}
        </span>
      </div>
    `;
    $(e).find(".g-footer__button-title").remove();
    $(e).html(str);
    let html = '';
    html += '<div class="notification-success"> <div class="toastt"> <div class="content_notification"> <div class="icon"><img width="50" height="50" src="' + image + '" class="img-fluid" /></div> <div class="details"> <span>' + (favorited == true ? "Remove" : "Add") + ' Success</span> <p>' + name + '</p> </div> </div> </div> </div>'
    $('body').one("click", e, function () {
        notification(html, 1000)
    })
}

function notification(s, time) {
    $(s).appendTo('body').fadeTo(time, 1, function () {
        $(this).fadeTo(1000, 0, function () {
            $(this).addClass('hide');
            $(this).remove();
        });
    });
}

function remove_wishlist_cookies(_id) {
    if (!!readFromLocalStorage('favorite_game') && _id !== '') {
        var favorite_array = readFromLocalStorage('favorite_game');
        jQuery.each(favorite_array, function (key, value) {
            favorite_array = favorite_array.filter(function (element) {
                return element !== undefined;
            });
            if (value.id === _id && key > -1) {

                favorite_array.splice(key, 1);
            }
        });
        saveToLocalStorage('favorite_game', JSON.stringify(favorite_array));
        $(".favorites-add-" + _id).removeClass('favorited');
        $(".favorites-add-" + _id).html('<span class="svg-icon svg-icon--heart btn__icon" aria-hidden="true"> <svg class="svg-icon__link"> <use xlink:href="#icon-heart"></use> </svg> </span> <div class="g-footer__button-title"> <span class="g-footer__button-title_text g-footer__button-title_first"></span> <span class="g-footer__button-title_text g-footer__button-title_last">Add</span> </div>')
        load_wishlist_cookies();
    }
}

function save_wishlish_cookies(_id, _slug, _image, _name, _url) {
    var favorites_count = 10;
    if (!!readFromLocalStorage('favorite_game') && _slug !== '' && _image !== '' && _id !== '' && _name != '') {
        var favorite_array = readFromLocalStorage('favorite_game');
        let circle_html = '';
        jQuery.each(favorite_array, function (key, value) {
            if (value !== undefined && value.slug === _slug && key > -1) {
                favorite_array.splice(key, 1);
            }
        });
        favorite_array.push({
            "id": _id, "slug": _slug, "image": _image, "name": _name, "url": _url
        });
        if (favorite_array.length > favorites_count) {
            favorite_array.shift();
        }
        saveToLocalStorage('favorite_game', JSON.stringify(favorite_array));
    } else {
        var data = [];
        data.push({
            "id": _id, "slug": _slug, "image": _image, "name": _name, "url": _url
        });
        saveToLocalStorage('favorite_game', JSON.stringify(data));
    }
    load_wishlist_cookies();
}

function load_wishlist_cookies() {

    if (!!readFromLocalStorage('favorite_game')) {
        var favorites = readFromLocalStorage('favorite_game');
        let circle_html = '';
        if (favorites.length > 0) {
//Load checked compare
            var str_wishlist = '';
            let str = '';
            var $leng = favorites.length;
            str += '<span class="svg-icon svg-icon--heart btn__icon" aria-hidden="true"> <svg class="svg-icon__link"> <use xlink:href="#icon-heart"></use> </svg> </span>';
            for (var i = $leng - 1; i >= 0; i--) {
                var value = favorites[i];

                str_wishlist += '<a href="' + value.url + '" class="thumb-card relative group relative block h-full overflow-hidden rounded-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1.5 will-change-transform"><div class="w-full overflow-hidden"><img src="' + value.image + '" alt="' + value.name + '" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" class="object-cover" loading="lazy" style=""></div><div class="px-2 py-2 title-game"><span class="text-sm md:text-base font-medium text-[#007b43] group-hover:text-[#00a35a] transition-colors duration-300 line-clamp-2">' + value.name + '</span></div></a>'

                if (value.slug === game_config.current_slug && !$(".favorites-add-" + value.id).hasClass('favorited')) {
                    $(".favorites-add-" + value.id).addClass("favorited");
                }
            }
            if ($(".favorites_btn").hasClass('favorited')) {
                str += '<div class="g-footer__button-title"> <span class="g-footer__button-title_text g-footer__button-title_first"></span> <span class="g-footer__button-title_text g-footer__button-title_last">Remove</span> </div>';
            } else {
                str += '<div class="g-footer__button-title"> <span class="g-footer__button-title_text g-footer__button-title_first"></span> <span class="g-footer__button-title_text g-footer__button-title_last">Add</span> </div>';
            }

            $(".favorites_btn").html(str);
            if ($leng > 0) {
                $('.badge_number').css("display", "flex");
                circle_html += '<span class="nav-badge favourites_qty">' + $leng + '</span>';
            } else {
                $('.badge_number').hide();
            }

            if ($('.badge_number').find('.favourites_qty').length > 0) {

                $('.badge_number').find('.favourites_qty').remove();
                $('.badge_number').append(circle_html);
            }
            let html = '';
            if (str_wishlist != "") {
                jQuery("#favoriteGames").html(str_wishlist);

            }
            $(".empty_favorite").hide();
        } else {
            circle_html += '';
            $('.badge_number').css("display", "none");
            jQuery("#favoriteGames").html('');
            $(".empty_favorite").show();
            $(".empty_favorite").html('<center>No favorite game</center>');
        }

        jQuery(".favorite-link .count_num").html(circle_html);

    } else {
        $(".empty_favorite").show();
        $(".empty_favorite").html('<center>No favorite game</center>')
        jQuery("#favoriteGames").html('');
        $('.badge_number').css("display", "none");
    }

}

/*=========Favorite Game========*/

