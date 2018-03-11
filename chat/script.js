function getParamValue(paramName)
{
    var url = window.location.search.substring(1); //get rid of "?" in querystring
    var qArray = url.split('&'); //get key-value pairs
    for (var i = 0; i < qArray.length; i++) 
    {
        var pArr = qArray[i].split('='); //split key and value
        if (pArr[0] == paramName) 
            return pArr[1]; //return value
    }
}

from_user = getParamValue("from_user");
to_user = getParamValue("to_user");
console.log(from_user, to_user);
var me = {};
me.avatar = "https://lh6.googleusercontent.com/-lr2nyjhhjXw/AAAAAAAAAAI/AAAAAAAARmE/MdtfUmC0M4s/photo.jpg?sz=48";

var you = {};
you.avatar = "https://a11.t26.net/taringa/avatares/9/1/2/F/7/8/Demon_King1/48x48_5C5.jpg";


function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}            

//-- No use time. It is a javaScript effect.
function insertChat(who, text, time, date){
    if (time === undefined){
        time = 0;
    }
    var control = "";
    var dt = formatAMPM(new Date(date));
    
    if (who == from_user){
        control = '<li style="width:100%">' +
                        '<div class="msj macro">' +
                        '<div class="avatar"><img class="img-circle" style="width:100%;" src="'+ me.avatar +'" /></div>' +
                            '<div class="text text-l">' +
                                '<p>'+ text +'</p>' +
                                '<p><small>'+dt+'</small></p>' +
                            '</div>' +
                        '</div>' +
                    '</li>';                    
    }else{
        control = '<li style="width:100%;">' +
                        '<div class="msj-rta macro">' +
                            '<div class="text text-r">' +
                                '<p>'+text+'</p>' +
                                '<p><small>'+dt+'</small></p>' +
                            '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="'+you.avatar+'" /></div>' +                                
                  '</li>';
    }
    setTimeout(
        function(){                        
            $("ul").append(control).scrollTop($("ul").prop('scrollHeight'));
        }, time);
    
}

function resetChat(){
    $("ul").empty();
}

$(".mytext").on("keydown", function(e){
    if (e.which == 13){
        var text = $(this).val();
        if (text !== ""){              
            $(this).val('');
            $.ajax({
              url: "http://localhost:8000/chat/api/",
              type: "POST",  
              data: {"from_user" : from_user, "to_user":to_user, "message":text},
              success: function(data){
                    date = new Date();
                    insertChat(from_user, text, 0, date.toString());
                    }
            });
        }
    }
});


//-- Clear Chat
resetChat();

setTimeout(
        function(){        
        console.log(from_user, "sdfdg");                
           $.ajax({
              url: "http://localhost:8000/chat/api/?to_user="+to_user+"&from_user="+from_user+"",
              crossDomain: true,
              cache: false,
              success: function(data){
                for(var i=0;i<data["message"].length;i++){
                    console.log(data["message"][i]["from_user"]);
                    insertChat(data["message"][i]["from_user"], data["message"][i]["message"], 1500, data["message"][i]["created"]);    
                }
              }
            });
        }, 300);

