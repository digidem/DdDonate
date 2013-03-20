jQuery(function($){
  $('[data-numeric]').payment('restrictNumeric');
  $('#paymentNumber').payment('formatCardNumber');
  $('#paymentExpiry').payment('formatCardExpiry');
  $('#paymentCVC').payment('formatCardCVC');

$('input[name="amount"]').change(function(e) {
  $this = $(this);
  $this.parent().siblings(".active").toggleClass("active btn-success btn-primary");
  $this.parent().toggleClass("active btn-success btn-primary");
  $('#donate-button').text("Donate $" + $this.attr("value")/100)
  $('a[href="#name"]').tab('show');
});

$('#name-next-button').click(function(e) {
  e.preventDefault();
  $('a[href="#payment"]').tab('show');
})

$("#donate-form").submit(function(e) {
    e.preventDefault();
    $('input').removeClass('invalid');
    $('.validation').removeClass('passed failed');

    var cardType = $.payment.cardType($('#paymentNumber').val());

    $('#paymentNumber').toggleClass('invalid', !$.payment.validateCardNumber($('#paymentNumber').val()));
    $('#paymentExpiry').toggleClass('invalid', !$.payment.validateCardExpiry($('#paymentExpiry').payment('cardExpiryVal')));
    $('#paymentCVC').toggleClass('invalid', !$.payment.validateCardCVC($('#paymentCVC').val(), cardType));
    
    if ( $('input.invalid').length ) {
      $('.validation').addClass('failed');
    } else {
      $('.validation').addClass('passed');
      var formData = $(this).serialize();
      $(this).attr("disabled", "disabled");
      var amount = $('input:radio[name=amount]:checked').val()*100;
      var $response = $("#response").text("Getting card token from Stripe...");
    
      var stripeResponseHandler = function(status, res){
          console.log(res);
          $response.text("Charging card...");
          $.ajax({
              url: '/donate',
              crossDomain: true,
              data: formData + "&stripeToken=" + res.id,
              dataType: 'jsonp'
          }).done(function (data) {
            console.log(data);
            $response.text("Thank you " + data.name + " we just charged $" + (data.amount / 100) + " to your card and sent an email to " + data.email );
          });
      };
    
    
      Stripe.createToken({
          name: $('#paymentName').val(),
          number: $('#paymentNumber').val(),
          cvc: $('#paymentCVC').val(),
          exp_month: $("#paymentExpiry").payment('cardExpiryVal').month,
          exp_year: $("#paymentExpiry").payment('cardExpiryVal').year
      }, stripeResponseHandler);
      
    }
    
    return false;
});

});
