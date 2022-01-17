"use strict";

(function ($) {
  var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

  if (isIE11) {
    $('body').addClass('ie-11');
  }

  function siteCookie() {
    if (Cookies.get('agree')) {
      $('.cookie-block').remove();
    } else {
      $('.js-sticky').addClass('has-cookie');
      $('.cookie-block .cookie-link').on('click', function () {
        Cookies.set('agree', '1');
        $('.cookie-block').addClass('is-hidden');
        $('.js-sticky').removeClass('has-cookie');
        setTimeout(function () {
          $('.cookie-block').remove();
        }, 1000);
        return false;
      });
    }
  }

  function typing(block) {
    var _this = $(block),
        text = _this.text().trim(),
        i = 0;

    var scrollTop = $(window).width() <= 1280 ? $(document).scrollTop() + $(window).height() / 2 : $('body').height();

    if (text.length && _this.offset().top <= scrollTop && !_this.hasClass('typing')) {
      _this.addClass('typing').text(' ');

      var typingEffect = setInterval(function () {
        if (i < text.length) {
          _this[0].insertAdjacentHTML('beforeend', text.charAt(i));

          i++;
        } else {
          clearInterval(typingEffect);
        }
      }, 120);
    }
  }

  var lastDate = new Date(2020, 11, 31),
      progressDate = new Date(2020, 10, 9),
      today = new Date(),
      countDays = lastDate - today <= 0 ? '0' : parseInt((lastDate - today) / 86400000);
  $('.js-day').text(countDays);
  $(document).on('ready', function () {
    siteCookie();
    typing('.js-typing');
    $('.js-slider').slick({
      slidesToShow: 1,
      prevArrow: '<button type="button" class="icon-left slick-prev"></button>',
      nextArrow: '<button type="button" class="icon-right slick-next"></button>',
      margin: 10,
      infinite: true,
      responsive: [{
        breakpoint: 479,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          dots: false
        }
      }]
    });
    $('.js-info-slider').slick({
      slidesToShow: 3,
      prevArrow: '<button type="button" class="icon-left slick-prev"></button>',
      nextArrow: '<button type="button" class="icon-right slick-next"></button>',
      responsive: [{
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: true,
          dots: false
        }
      }]
    });
    var scrollTop = $(window).scrollTop();
    $('[data-animated]:not([class="is-visible"])').each(function (index) {
      var _this = $(this);

      setTimeout(function () {
        animatedText(_this, scrollTop);
      }, (index + 1) * 200);
    }); // var progressLine = $('.js-progress-line');
    //
    // function showProgress() {
    //     var displayProgress = parseInt(anim.progress() * parseInt(progressLine.attr('data-value')));
    //     $('.js-progress-value').text(displayProgress + '%');
    //     var countProgress = parseInt(anim.progress() * parseInt($('.js-count').attr('data-value')))
    //     $('.js-count').text(countProgress.toLocaleString())
    // }
    //
    // var anim = TweenMax.to( progressLine, 1.5, {css: {width: progressLine.attr('data-value') + '%'}, onUpdate: showProgress} );
  });

  function animatedText(item, scrollTop) {
    var item = $(item),
        itemTop = item.offset().top,
        i = $(window).width() <= 1280 ? 1 : 2;
    var scroll = $(window).width() <= 1280 ? scrollTop + $(window).height() / i : $('body').height();

    if (itemTop < scroll && !item.hasClass('is-visible')) {
      item.addClass('is-visible');
    }
  }

  $('.js-modal-link').on('click', function (e) {
    var target = $(this).attr('href');
    $(target + ',.js-modal-wrapper').addClass('open');
    e.preventDefault();
  });
  $('.js-close-modal').on('click', function (e) {
    $('.js-modal, .js-modal-wrapper').addClass('closing');
    setTimeout(function () {
      $('.js-modal, .js-modal-wrapper').removeClass('open closing');
    }, 500);
    e.preventDefault();
  });
  $.ajax({
    type: 'POST',
    url: 'formxml.php',
    dataType: 'json',
    success: function success(data) {
      if (today >= progressDate) {
        var showProgress = function showProgress() {
          var displayProgress = parseInt(anim.progress() * dataPrecent);
          $('.js-progress-value').text(displayProgress + '%');
          var countProgress = parseInt(anim.progress() * parseInt(data.sum));
          $('.js-count').text(countProgress.toLocaleString());
        };

        var progressLine = $('.js-progress-line'),
            dataPrecent = parseInt(data.sum / 1000);
        var anim = TweenMax.to(progressLine, 1.5, {
          css: {
            width: dataPrecent + '%'
          },
          onUpdate: showProgress
        });
      }
    }
  });
  $('.js-form').submit(function (event) {
    //html version
    var form = $(this);
    var mail = form.find('[name="email"]').val();
    form.find('[name="email"]').val('');
    $.ajax({
      type: 'POST',
      url: location.href + 'functions.php',
      data: {
        'email': mail
      },
      dataType: 'json',
      encode: true,
      success: function success(data) {
        // console.log(1);
      },
      error: function error(_error) {
        // console.log('error', _error);
      }
    }).done(function (data) {
      // console.log(data);
      $('#merci-modal,.js-modal-wrapper').addClass('open');
    });
    event.preventDefault();
  });

  function fixedBlock(block) {
    $(block).each(function () {
      var _this = $(this),
          top = _this.offset().top;

      if (top <= $('body').scrollTop()) {
        _this.addClass('fixed');
      } else {
        _this.removeClass('fixed');
      }
    });
  }

  $('body').on('scroll', function (e) {
    fixedBlock('.js-section');
    typing('.js-typing');
    var scrollTop = $(this).scrollTop();
    $('[data-animated]:not([class="is-visible"])').each(function (index) {
      var _this = $(this);

      // console.log(_this);
      setTimeout(function () {
        animatedText(_this, scrollTop);
      }, (index + 1) * 200);
    });

    if ($('.js-info-block').offset().top < $(window).height() && !$('.js-info-count').hasClass('is-visible')) {
      $('.js-info-count').each(function () {
        var _this = $(this),
            count = parseInt(_this.attr('data-value'));

        _this.addClass('is-visible');

        function showProgress() {
          var displayProgress = parseInt(anim.progress() * count);

          _this.text(displayProgress.toLocaleString() + '€');
        }

        var anim = TweenMax.to(_this, 1.5, {
          onUpdate: showProgress
        });
      });
    }
  });
  $(window).on('scroll', function (e) {
    var scrollTop = $(window).scrollTop();
    typing('.js-typing');

    if ($('.js-info-block').offset().top < $(document).scrollTop() + $(window).height() && !$('.js-info-count').hasClass('is-visible')) {
      $('.js-info-count').each(function () {
        var _this = $(this),
            count = parseInt(_this.attr('data-value'));

        _this.addClass('is-visible');

        function showProgress() {
          var displayProgress = parseInt(anim.progress() * count);

          _this.text(displayProgress.toLocaleString() + '€');
        }

        var anim = TweenMax.to(_this, 1.5, {
          onUpdate: showProgress
        });
      });
    }

    var scrollBlock = $(this).scrollTop();
    $('[data-animated]:not([class="is-visible"])').each(function (index) {
      var _this = $(this);

      setTimeout(function () {
        animatedText(_this, scrollBlock);
      }, (index + 1) * 200);
    });
  });
})(jQuery);