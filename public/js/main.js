$('#chat').on('click', function() {
    $('.modal.small').modal('show');
});

$('#avatars img').on('click', function(){
    console.log('clicked');
});

$('.special.cards .image').dimmer({
  on: 'hover'
});
