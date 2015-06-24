Handlebars.registerHelper('select', function( value, options ){
        var $el = $('<select />').html( options.fn(this) );
        $el.find('[value=' + value + ']').attr({'selected':'selected'});
        return $el.html();
    });


Handlebars.registerHelper('StockExist', function(product, options) {  
 
  if((product>0)) {
    return true
  }
  else{
  	return false
  }
});