 //Cookies global object with set, get and clear.
var Cookies = {
	set : function(name, value, days){
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			 expires = "; expires="+date.toGMTString();
		}
		//document.cookie = name+"="+ $.base64.encode(value) +expires+"; path=/";
		document.cookie = name+"="+ value +expires+"; path=/";
	},
	get: function(name){
		var cs = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			c = c.trim();
			// while (c.charAt(0)==' ') c = c.substring(1,c.length);
			//if (c.indexOf(cs) == 0) return $.base64.decode(c.substring(cs.length,c.length));
			if (c.indexOf(cs) == 0) return c.substring(cs.length,c.length);
		}
		return null;
	},
	clear: function(name){
		this.set(name,"",-1);
	}
};

//====================================== end of Cookies ==================
//Modal Prompt Messages
function promptMSG(type,messages,title,btn_type,set_delay,addClassOpen,callBackYes){
	var prompt_delay      = (set_delay === true ? true : false);
	var addClassModalOpen = ((addClassOpen === true || addClassOpen === null) ? true : false);
	var msg, titleh = ''; 
	var modal_type  = "mif-modal-warning";
	var result;
	var button_type = function(btn_type){
		if(btn_type == 'yn'){
			return '<button type="button" class="btn btn-sm btn-danger btn-yes" >Yes</button> <button type="button" class="btn btn-sm btn-primary" data-dismiss="modal">No</button>';
		}else{
			return '<button type="button" class="btn btn-xs btn-danger" data-dismiss="modal">Close</button>';
		}
	};

	if(type =="warning"){
		 msg    = "<strong>Warning!</strong> "+ messages;
		 titleh = "<i class='fa fa-warning'></i>";
	}
	if(type =="danger"){
		 msg 	= "<strong>Authentication failed!</strong></br>Please Reload or Relogin your account.";
		 titleh = "<i class='glyphicon glyphicon-fire'></i>";
		 modal_type = "mif-modal-danger";
	}
	if(type =="success-add"){
		msg = messages + " Has Been Successfuly Added.";
		titleh = "<i class='glyphicon glyphicon-check'></i>";
		modal_type = "mif-modal-success";
	}
	if(type =="success-retrieve"){
		msg = messages + " Has Been Successfully Moved to </br><strong>Current page</strong>.";
		titleh = "<i class='glyphicon glyphicon-check'></i>";
		modal_type = "mif-modal-success";
	}
	if(type =="success-update"){
		msg = messages + " Has Been Successfuly Updated.";
		titleh = "<i class='glyphicon glyphicon-check'></i>";
		modal_type = "mif-modal-success";
	}
	if(type =="remove"){
		msg = messages + " Has Been Moved to <strong>Archive page</strong>.";
		titleh = "<i class='glyphicon glyphicon-fire'></i>";
		modal_type = "mif-modal-danger";
	}
	if(type =="success-custom"){
		msg = messages;
		titleh = "<i class='glyphicon glyphicon-check'></i>";
		modal_type = "mif-modal-success";
	}
	if(type =="custom"){
		msg    = messages;
		titleh = title;
	}

	var template = '<div class="modal fade mif-modalPromptMSG '+modal_type+'" id="modalPromptMSG"  data-backdrop="static" data-keyboard="true" tabindex="-1" role="dialog" aria-labelledby="modaPromptMSG">' +
				   '<div class="modal-dialog" role="document"> ' +
				    '<div class="modal-content">' +
				      '<div class="modal-header">' +
				        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				        '<div class="modal-title" id="modaPromptMSG">'+ titleh +'</div>' +
				      '</div>' +
				      '<div class="modal-body text-center">' + msg +
				      '</div>' +
				      '<div class="modal-footer text-center">' + button_type(btn_type) +
				      '</div>' +
				    '</div>' +
				  '</div>' +
				'</div>';

		$(".displayPromptMSG").html(template);

		var delayPrompt = (function () {
		  var timer = 0;
		  return function () {
		    window.clearTimeout(timer);
		    timer = window.setTimeout(function(){$("#modalPromptMSG").modal('hide');},5000); 
		  };
		})();

		if($(".displayPromptMSG").children() != ''){
			$("#modalPromptMSG").modal('show');

		    if(prompt_delay === true){
		    	delayPrompt();
		    }
		    if(addClassModalOpen === true){
			    $("#modalPromptMSG").on('hidden.bs.modal',function(){ // For tuning, must check if the last modal active.
			    	$("body").addClass('modal-open');
			    });
			}
		    
    	}
    	//Callback function if Yes button is clicked.
    	if(btn_type == 'yn' && btn_type != undefined && btn_type != null && btn_type != ''){
    		$(".btn-yes").click(function(e){
    			e.preventDefault();
    			callBackYes();
    		});
    	}

    return $(template);
}

function isEmpty(val){
	  if(val == null  || val == 'null' || val == '' || val == 0 || typeof val == 'undefined'){
			return '';
		}
	return (typeof val === 'numeric' ? val : val.toUpperCase());
}

function isUpperCase(paramString){
	if(typeof paramString === 'string')
		return paramString.toUpperCase();
	return paramString;
}

function resetForm(targetForm){
	if($(targetForm).is('form'))
		$(targetForm).trigger('reset');
	return false;
}

function getTodayDate() {
   var tdate = new Date();
   var dd    = tdate.getDate(); //yields day
   var MM    = tdate.getMonth(); //yields month
   var yyyy  = tdate.getFullYear(); //yields year
   var xxx   = (MM+1) + "-" + dd + "-" + yyyy;
   return xxx;
}

function getTodayDateStandard() {
   var tdate = new Date();
   var dd    = tdate.getDate(); //yields day
   var MM    = tdate.getMonth(); //yields month
   var yyyy  = tdate.getFullYear(); //yields year
   var xxx   =  yyyy+"-" +(MM+1)+ "-"+dd;
   return xxx;
}

function getTodayTime(){
	var hour = new Date();
	var hh   = hour.getHours();// hour
	var mm   = hour.getMinutes(); //min
	var ss   = hour.getSeconds(); //sec
	var xxx  = hh + ":" +mm + ":" + ss;
	return xxx;
}

function convertToObj(arr){
	var a = arr; // Convert the string array to JS Object.
	if(isEmpty(a)){
		a = a.replace(/'/g,'"');
		a = JSON.parse(a);
		return a;
	}
	return '';
}

function removeDblQuote(str){
	var a = str; // Remove double quotes
	if(isEmpty(a)){
		a = a.toString().replace(/"/g, "");
		return a;
	}
	return '';
}

function formatNumber(num) { //Format whole number to decimal string
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function convertArrStrToInt(arrStr){ //Translate array string value to array int value using map.
	if(arrStr != null || arrStr != ''){
		return arrStr.toString().split(',').map(function(i){
            return parseInt(i, 10);
         });
	}
	return null;
	
}

function scrollTop(){
	//Check if page is on the top.
	$(window).scroll(function(){
		if($(this).scrollTop() > 500){
			$(".scrollToTop").fadeIn();
		}else{
			$(".scrollToTop").fadeOut();
		}
	});
	//Fire this event when invoke.
	setTimeout(function(){
		$(".scrollToTop").click(function(){
			$("html, body").animate({
				scrollTop: 0
			},700);
		});
	},1000);
}

function printReport(e_handler,tableToPrint){
  $(e_handler).click(function(e){
      e.preventDefault();
      var tablePrint = $(tableToPrint).html(); //get the html table.
      var newWin = window.open(''); //open new window blank.
      var link = document.createElement('link');
          link.setAttribute('rel','stylesheet');
          link.setAttribute('href',assets+'css/print.css');
          link.setAttribute('media','print');
          link.setAttribute('type','text/css');
      	if(newWin){
           newWin.document.write(tablePrint);
           newWin.document.head.appendChild(link);
           newWin.print();
           
       }
       newWin.close();
  });  
          
}
// ========== MRF ==========
//Get the multiple input value of the same element name.
function getMultipleValue(elem){  
	if(elem != undefined){
		return $(elem).map(
			function(){ 
				if($(this).val() != ''){ 
					return $(this).val() 
			} 
		}).get().join(',');
	}	
	console.log('Argument missing.');
}
//Get the table row input by values.
/*
* @elemTable - a table id, class or element.
* @selectorInput - for multiple input element just use a comma delimted Ex: input, select
* @inputElem {array} - input the want to get the data.
*            [{name : 'txt1', getValueByChosen: true|false},
			  {name : 'txt2'}]  
*/
function getTableRowValue(objData, flagColumn){
    var tableValues = {update: { }, insert: []};

    $(objData.elemTable+" tbody tr[data-row-num^='parentRow']").each(function() {
    	var $self = $(this);
    	var objVal = {};
    	var trID = $self.closest('tr').attr("data-"+objData.trAttr);

    	var trToner = $self.closest('tr').data("toner-values") || '';

			 $.each(objData.inputElem,function(k,val){
			    var inputElem = val;	 	
			    $self.find(objData.selectorInput).each(function(_k,_val){
			    	var attrName = $(_val).attr('name'); 

	              	if($(this)[0] instanceof HTMLElement && attrName == inputElem.name && inputElem.getValueByChosen == false && attrName != 'undefined') {
	              	    objVal[inputElem.name] = $(_val).val();                     
	            	}
	            	if($(this)[0] instanceof HTMLSelectElement && attrName == inputElem.name && inputElem.getValueByChosen == false){
	            		objVal[inputElem.name] = $(_val).find(':selected').val();
	            	}
	            	if(attrName == inputElem.name && inputElem.getValueByChosen == true){
	            		objVal[inputElem.name] = $(_val).chosen().val();  
	            	}
	            	
	          	 });	             	 	
	          });

			if(objData.getTrTonerAttr != undefined && objData.getTrTonerAttr == true)
    			objVal["s1_toner"] = trToner;  
      		
            if(trID != '' && trID != null && trID != undefined){
		   	 	tableValues.update[trID] = objVal;
		    }else{

		    	if(flagColumn != undefined && flagColumn != ''){ //Check object if flag column is not empty will push else not.		    		
		    	 	if(checkObjKeyEmpty(objVal,flagColumn) != false)   	
		    	 		tableValues.insert.push(objVal);		
		    	}else{  
		    		tableValues.insert.push(objVal);
		    	}			    	
		    } 

		    
    });
   return tableValues;
}
//Get table row input by plain text.
function getTableRowText(objData){
    var tableValues = {update: { }, insert: []};

    $(objData.elemTable+' tbody tr').each(function() {
    	var $self = $(this);
    	var objVal = {};
    	var trID = $self.closest('tr').attr("data-"+objData.trAttr);
    	var trToner = $self.closest('tr').data("toner-values") || '';

			 $.each(objData.inputElem,function(k,val){
			    var inputElem = val;	 	
			    $self.find(objData.selectorInput).each(function(_k,_val){
			    	var attrName = $(_val).attr('name'); 

	              	if($(this)[0] instanceof HTMLElement && attrName == inputElem.name && inputElem.getValueByChosen == false && attrName != 'undefined') {
	              	    objVal[inputElem.name] = $(_val).val();                     
	            	}
	            	if($(this)[0] instanceof HTMLSelectElement && attrName == inputElem.name && inputElem.getValueByChosen == false){
	            		objVal[inputElem.name] = $(_val).find(':selected').text();
	            	}
	            	if(attrName == inputElem.name && inputElem.getValueByChosen == true){
	            		objVal[inputElem.name] = $(_val).chosen().text();  
	            	}
	            	
	          	 });	             	 	
	          });

			if(objData.getTrTonerAttr != undefined && objData.getTrTonerAttr == true)
    			objVal["s1_toner"] = trToner;  
      		
            if(trID != '' && trID != null && trID != undefined){
		   	 	tableValues.update[trID] = objVal;
		    }else{
		    	tableValues.insert.push(objVal);
		    } 

		    
    });
   return tableValues;
}

function getTableRowArbitraryValue(objData){
    var tableValues = [];

    $(objData.elemTable+' tbody tr').each(function() {
    	var $self = $(this);
    	var trToner = $self.closest('tr').data(objData.trAttrToner);
            
            if(trToner != '' && trToner != null && trToner != undefined){
		    	tableValues.push(trToner);
		    } 
    });
   return tableValues;
}

function curIndex(){
	return $('.form-section').index($('.form-section').filter('.current'));
}

function curIndexLi(){
	return $('.link-navigation').index($('.form-section').filter('.current'));
}

function navigateForm(indexForm,isSubmitted){
  //Navigate form-section
	  $('.form-section')
      .removeClass('current')
      .eq(indexForm)
        .addClass('current');

     //Navigate main-link-navigation
     $('.link-navigation')
      .removeClass('current')
      .eq(indexForm)
        .addClass('current visited');

   //Show/Hide form navigation.
   $(".form-navigation .btn_prev").toggle( indexForm > 0);
   var atEnd = indexForm == $('.form-section').length - 1;
   $(".form-navigation .btn_submit").toggle( atEnd); 
   $(".form-navigation .btn_next").toggle( !atEnd );   

 //Remove the background color link of step 2 up.
 if(isSubmitted && isSubmitted != undefined){ 
     $.each($('.link-navigation'),function(e,val){
         if(!$(val).hasClass('current')){
             $(val).removeClass('visited');
         }  
     });
  }	
}

function hasData(elem){
	var $elem = elem;
	return $elem && typeof $elem.data($elem) !== 'undefined';
}

function randomNum(){
    return Math.floor(Math.random()*100);
} 

function removeEmptyObjectInArray(arr,column){
	var reformatS2Row = arr.map(function(obj, key, val){
		var objArr = [];

		if(obj[column] != "" || obj[column] > 0 || obj[column] != ""){
			return obj;		    					    					
		}

 	});

	var FilobjArr = reformatS2Row.filter(function(el){
	 	if(el != undefined && Object.keys(el).length > 0){
			return el;
		}
 	});
    return FilobjArr;
}

function checkObjKeyEmpty(obj,key){
	 return ( obj[key] && obj[key] != '' ? obj : false);
}

// Date From/To 
function datePickerFromTo(fromDate, toDate){
	var dateFormat = "yy-mm-dd";
	from = $(fromDate).datepicker({
		dateFormat: dateFormat,
		 changeMonth: true,
	 	 showOn: "both",
	     buttonImage: window.location.origin + window.location.pathname + "assets/img/calendar.gif",
	     buttonImageOnly: true,
	     buttonText: "Select date"
	}).on('change', function(){
		to.datepicker("option", "minDate", $(this).val());
	});

	to = $(toDate).datepicker({ 
		dateFormat: dateFormat,
		changeMonth: true,
		 showOn: "both",
	     buttonImage: window.location.origin + window.location.pathname + "assets/img/calendar.gif",
	     buttonImageOnly: true,
	     buttonText: "Select date"
	}).on('change', function(){
		from.datepicker("option", "maxDate", $(this).val());
	});
}