//Global object
var companyInfo = {
	name: function(compId){
		var res = null;
		$.ajax({
            type: 'GET',
            url : assets+'php/company/getCompanyById.php',
            data: {idcompany: compId},
            dataType: 'json',
            async: false,
            success: function(data){
                $.each(data.aaData,function(key,val){
                    res = val.company_name;      
                }); 
            },
            error: function(data,xhr,status){ }
         });
		
        return res;
	}
};
