jQuery(document).ready(function() {
    const socket = io.connect();

    const pubForm = jQuery('#pubForm');
    const pubChat = jQuery('#pubChat');
    const pubTxt = jQuery('#pubTxt');         

    const prForm = jQuery('#prForm');         
    const prChat = jQuery("#prChat");
    const prTxt = jQuery('#prTxt'); 
    const comboUser = jQuery('#comboUser');        

    pubForm.submit(function(e) {
       e.preventDefault();
       if(pubTxt.val())
       {
          socket.emit('sending public message', pubTxt.val());
          pubTxt.val('');
       }
    });
    prForm.submit(function(e) {
       e.preventDefault();
       if(prTxt.val())
       {
          socket.emit('sending private message', prTxt.val(), comboUser.val());
          prTxt.val('');
       }
    });         

    socket.on('receiving public message', function(data){
       pubChat.prepend('<div class="well">'+
                '<div style="float:left;">'+
                   (data.sender ? data.sender : "Desconhecido") +
                '</div>'+                     
                '<div style="display: inline-block; margin:0 auto;">'+
                   data.text+
                '</div>'+
                '<div style="float:right;">'+
                   '<i>'+
                      data.timestamp +
                   '</i>'+
                '</div>'+
             '</div>');
    });

    socket.on('receiving private message', function(data){
       prChat.prepend('<div class="well">'+
                '<p>'+
                   data.sender+
                '</p>'+                     
                '<p>'+
                   data.text+
                '</p>'+     
                '<p>'+
                   data.receiver+
                '</p>'+ 
                '<p>'+
                   data.timestamp+
                '</p>'+                              
             '</div>');
    });         
 });