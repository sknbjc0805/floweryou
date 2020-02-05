$(function () {

  /* ドロワー  */
  // ドロワーメニューの利用宣言 
  $('.drawer').drawer();

  $('.drawer-menu-item').click(function () {
    $('.drawer').drawer('close');
  });

  /* アコーディオン  */
  $(".qa").on("click", function () {

    $(this).find(".qa-a").slideToggle();

    $icon = $(this).find(".qa-q");

    if ($icon.hasClass('open')) {
      $icon.removeClass('open');
    } else {
      $icon.addClass('open');
    }
  });

  /* スライダー  */
  var mySwiper = new Swiper('.swiper-container', {
    // オプションパラメータ(一部のみ抜粋)
    loop: true, // 最後のスライドまで到達した場合、最初に戻らずに続けてスライド可能にするか。
    speed: 3000, // スライドが切り替わるトランジション時間(ミリ秒)。
    direction: 'horizontal',
    effect: 'slide',
    slidesPerView: 1.3,
    spaceBetween: 40,

    // レスポンシブ化条件
    breakpoints: {
      // 600ピクセル幅以上になったら
      600: {
        slidesPerView: 2.2,
        spaceBetween: 50,
      },
      // 1000ピクセル幅以上になったら
      1000: {
        slidesPerView: 3.3,
        spaceBetween: 60,
      },

      // 1200ピクセル幅以上になったら
      1200: {
        slidesPerView: 3.5,
        spaceBetween: 74,
      },
      // 1500ピクセル幅以上になったら
      1500: {
        slidesPerView: 4,
        spaceBetween: 100,
      }
    },

    // スライダーの自動再生
    // autoplay: true  のみなら既定値での自動再生
    autoplay: {
      delay: 1500, // スライドが切り替わるまでの表示時間(ミリ秒)
      stopOnLastSlide: true, // 最後のスライドまで表示されたら自動再生を中止するか
      disableOnInteraction: true // ユーザーのスワイプ操作を検出したら自動再生を中止するか
    },

    // ページネーションを表示する場合
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
  });

  /* wow */
  new WOW().init();

  /* 予約用ドロワー  */
  $('.reservation-open').click(function () {
    $('.reservation-content').addClass('open');

    $('.reservation-close').addClass('open');
    $('.reservation-overlay').addClass('open');
    //ドロワーopen時に文字が見えてしまうため、隠す
    $('.drawer-menu-list').hide();

  })

  $('.reservation-close, .reservation-decoration, .reservation-overlay').click(function () {
    $('.reservation-content').removeClass('open');

    $('.reservation-close').removeClass('open');
    $('.reservation-overlay').removeClass('open');
    $('.drawer-menu-list').show();
  })
});


$(window).on('load', function () {
  /* 予約はこちら */
  var reservationPc = $('.reservation-open--pc');
  var reservationSp = $('.reservation-open--sp');

  $(window).scroll(function () {
    if ($(this).scrollTop() > 500) {
      reservationPc.addClass('show');
      reservationSp.addClass('show');
    }
  });

  // sp版のみ、予約はこちらセクション以降のスクロールでは右下固定の「予約はこちら」を非表示（フッターメニューと重なるため）
  var contactOffset;
  var whyOffset;
  contactOffset = $('#contact').offset().top;
  whyOffset = $('#why').offset().top;

  var headerLogo = $('.header-logo');

  //whyセクションを過ぎたあたりでロゴを表示
  $(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() > contactOffset) {
      reservationSp.removeClass('show');
    } else {
      reservationSp.addClass('show');
    }

    if ($(window).scrollTop() > whyOffset) {
      headerLogo.addClass('show');
    } else {
      headerLogo.removeClass('show');
    }
  });
});
