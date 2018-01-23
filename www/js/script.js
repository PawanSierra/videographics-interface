$(document).ready(function(){
  // $(".si-col").height($(window).height() - 100 + 'px');
  // $(".si-page.login .si-main").height( $(window).height() - 27 + 'px');

  if($('.swiper-container')) {
    var swiper = new Swiper('.swiper-container',{
      slidesPerView:10,
      nextButton:'.swiper-button-next',
      prevButton:'.swiper-button-prev'
    });
  }

  if($('.SI-select')) {

    $('.SI-select').SiSelect({
      searchText:"Search Here",
      search:true,
      selectAll:true,
      csvDispCount:5,

    });

  }


});
