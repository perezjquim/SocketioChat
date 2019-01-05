var vuePrChat,vuePubChat;
var m;
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
             vuePubChat.pubMessages.push(data);
             vuePubChat.$nextTick(() => {
               pubChat.scrollTop(pubChat.prop("scrollHeight"));
            })
    });

    socket.on('receiving private message', function(data){
      m.push(data);
      if(data.senderUsername == comboUser.val() || data.receiverUsername == comboUser.val()){
         vuePrChat.prMessages.push(data);
         vuePrChat.$nextTick(() => {
            prChat.scrollTop(prChat.prop("scrollHeight"));
         }) 
      }         
    }); 
 });

 function addVuePrChat(users,msg1,userLogged){
    m = msg1 ;
    vuePrChat=new Vue({
      el: '#privateChat',
      data: {
         selected:false,
         users: users,
         prMessages: []
      },
      methods:{
         filtarMeng:function(){
            var comboUsername=$("#comboUser").val();
               if(comboUsername == -1){
                  this.selected=false;
                  return this.prMessages=[];
               }
               this.selected=true;
               var loggedUsername=userLogged;
               this.prMessages=m.filter(function(msg){
                     return msg.senderUsername == comboUsername 
                           || msg.receiverUsername == comboUsername;
               });
               this.$nextTick(() => {
                  $("#prChat").scrollTop($("#prChat").prop("scrollHeight"));
               })                              
         }
   }
});
 }

 function addVuePubChat(pubMessages){
   vuePubChat=new Vue({
      el: '#publicChat',
      data: {
         pubMessages: pubMessages
      }
   });
   $("#pubChat").scrollTop($("#pubChat").prop("scrollHeight"));
 }