<!-- <table id="subRowSerial">
	<thead>
		<tr>
			<th colspan="5">serials</th>
		</tr>
	</thead>
</table> -->
<!-- <div id="subRowSerial"></div>
<script type="text/javascript">
	
//Reference link: http://jsfiddle.net/9TN9W/335/

  var data = ['12','231','12','239','12','236','12','237','12','237','122','238','12','239','12','234','67ds'];
  var result = [],
        row,
        colLength = 5,
        i = 0;
    	
    //loop through items and push each item to a row array that gets pushed to the final result
    for ( i = 0, j = data.length; i < j; i++) {
        if (i % colLength === 0) {
            if (row) {
              result.push(row);   
            }
            row = [];
        }
        row.push(data[i]);
    }
    
    //push the final row  
    if (row) {
        result.push(row);
    }

    //Build table serial;
    var subTable = document.createElement('table')
    var tbody = document.createElement('tbody');
    var thead = document.createElement('thead');
    var th = document.createElement('th');
    var headRow = document.createElement("tr");

	subTable.className = "subTableStyle";
	th.appendChild(document.createTextNode('Serial Numbers'));
	th.setAttribute('colspan',colLength);
	headRow.appendChild(th);
	thead.appendChild(headRow);

	subTable.appendChild(thead);
    result.forEach(function(el,idx){
    	var tr = document.createElement('tr');
    	for(var i in el){
    		var td = document.createElement('td');
    		var txt = document.createTextNode(el[i]);
    		td.appendChild(txt);
    		tr.appendChild(td);
    	}
    	tbody.appendChild(tr);
    });
    subTable.appendChild(tbody);
  	var div = document.getElementById('subRowSerial');
  		div.appendChild(subTable);
</script> -->

<?php

function decrypt($text) 
{ 
	$private_key = "@gTSqK82GADBp.1";
    return trim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $private_key, base64_decode($text), MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND))); 
}



echo decrypt("Nyfb2X7K5i7PRxkc4QW8cSaTY+WJZvSVVZpyQKjpCVA=");




