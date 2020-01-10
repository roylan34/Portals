var comment = {
	auto_refresh: null,
	display: function(idMRF, id_user){
		//Display all messages sent.
		 var messages;
		 if(idMRF){
		 	 $.ajax({
		    	type: 'POST',
		    	dataType: 'json',
		    	url: assets+'php/mrf/comments.php',
		    	data: {action:'view-id', id_mrf:idMRF },
		    	beforeSend: function(){  $(".comment-box").empty(); },
		    	success: function(response){
		    		messages = "";
		    		if(response.aaData.length > 0){
		    			$.each(response.aaData,function(i,val){

		    				if(val.id_user_from != id_user){
		    					messages +="<div class='comment-msg left clearFix'>"+
						                    "<div class='comment-date'>"+val.date_sent+"</div>"+
						                    '<div class="comments-text-box"><span class="comment-name">'+val.from_name+'</span>: <span class="comments-text">'+val.comments+'</span></div>'+
						                  '</div>';
		    				}else{
		    					messages +="<div class='comment-msg right clearFix'>"+
						                    "<div class='comment-date'>"+val.date_sent+"</div>"+
						                    '<div class="comments-text-box"><span class="comments-text">'+val.comments+'</span> :<span class="comment-name">ME</span></div>'+
						                  '</div>';
		    				}

		    			});
		    		}else{
		    			messages = "<h5>No messages send.</h5>";
		    		}
		    		$(".comment-box").html(messages);
		    	}
		    });
		 }
		 else{
		 	alert('ID is not exist');
		 }

	},
	send: function(idMRF){
		 var comments = $("#txtComment").val() || '';
		 var id_user  = jwt.get('user_id');
		 var $btn = $("#btnCommentSubmit, #btnCommentClear");
		 if(idMRF != null && comments != ''){

		    $.ajax({
		    	type: 'POST',
		    	dataType: 'json',
		    	url: assets+'php/mrf/comments.php',
		    	data: {action:'add', id_mrf:idMRF, id_user: id_user, comments: comments },
		    	beforeSend: function(){ $btn.button('loading'); }, 
		    	success: function(response){
		    		if(response.aaData[0] == "success"){ //Refresh message display and empty the input message.
		    			self.comment.display(idMRF,id_user);
		    			$("#txtComment").val('');
		    		}
		    	},
		    	complete: function(){
		    		$btn.button('reset');
		    	}
		    });
		 }
		 else{
		 	alert('ID / message text is required.');
		 }
	}
};