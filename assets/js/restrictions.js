//Jquery validation instances.
$("form").ready(function(){
	$.validator.addMethod("lettersonly", function(value, element) {
    	return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);// Validate if values has only characters and spaces.
	});

	$.validator.addMethod("lettersSepcialChar", function(value, element) {
    	return this.optional(element) || value == value.match(/^[a-zA-Z\s\-.,&)(]+$/);// Validate if values has only characters and spaces.
	});

	$.validator.addMethod("numericSpecialChar", function(value, element) {
    	return this.optional(element) || value == value.match(/^[0-9\-.,+)(]+$/);// Validate if values has only characters and spaces.
	});

	$.validator.addMethod("numbersonly", function(value, element) {
    	return this.optional(element) || value == value.match(/^[0-9]+$/);// Validate if values is numbers.
	});

	$.validator.addMethod("isdate", function(value, element) {
    	return this.optional(element) || value == value.match(/^\d{4}-\d{2}-\d{2}$/);// Validate if values is date format yyyy-mm-dd.
	});

	$.validator.addMethod("isdate2", function(value, element) {
    	return this.optional(element) || value == value.match(/^\d{2}-\d{2}-\d{4}$/);// Validate if values is date format mm-dd-yyyy.
	});

	$.validator.addMethod("isSerialNumber", function(value, element) {
    	return this.optional(element) || value == value.match(/^[a-zA-Z\d*]+$/);// Validate if values is alphanumeric only.
	});

	$.validator.setDefaults({ ignore: ":hidden:not(.chosen-select, .chosen-select-location, .validate-hidden-text)" }) ;

	$.validator.addMethod("rgxToner", function(value, element) {
    	return this.optional(element) || value == value.match(/^[A-Za-z0-9\-\s]+$/);// Validate if toner codes contains only specified characters.
	});

	$.validator.addMethod("isAttrDataValueZero", function(value, element) { //Validate if auto suggest has attribute data-value of 0(Zero).
        return $(element).attr('data-value') != 0 && $(element).attr('data-value') != '' &&  $(element).attr('data-value') != undefined;
	});

});
