$(function(){
    new WOW().init();
    $('.toggle-button').on('click',function(e){
        e.preventDefault();
        $('.menu-bar').toggleClass('menu-fadein');
    })
    $('.btn-close').on('click',function(e){
        e.preventDefault();
        $('.menu-bar').toggleClass('menu-fadein');
    })
    $('.product-box li img').hover(function(){
        console.log('in');
        var bigImg='./images/product_item_big_001.png';
        $(this).attr('src',bigImg)
    },function(){
        console.log('out');
        var smallImg='./images/product_item_small_001.png';
        $(this).attr('src',smallImg);
    })
})