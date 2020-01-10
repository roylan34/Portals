
(function(){

var thead = document.getElementById("table_head_all_stocks");
var tbody = document.getElementById("table_body_all_stocks");
	//Hide table thead
	thead.style.display = "none";

	//Clone the table thead and append to table tbody.
	tbody.querySelector('table').appendChild(thead.querySelector('thead'));
	
})();

