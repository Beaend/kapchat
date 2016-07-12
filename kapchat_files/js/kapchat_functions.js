// podmienia wszystkie wystąpienia podciągu na przekazane wyrażenie
// opcjonalny trzeci parametr ustawiony na 'true' powoduje ignorowanie wielkosci liter
String.prototype.replaceAll = function(token, newToken, ignoreCase){
  var str = this + "";
  var i = -1;

  if(typeof token === "string"){

    if(ignoreCase ){

      token = token.toLowerCase();

      while((i = str.toLowerCase().indexOf(token, i >= 0 ? i + newToken.length : 0)) !== -1){
        str = str.substring( 0, i )+newToken+str.substring( i + token.length );
      }
    }
    else{
      return this.split(token).join(newToken);
    }
  }
  return str;
};

// funkcja sprawdza czy dana wartość znajduje się wśród podanej listy wartości
function isIn(value, list) {
  list = list.replaceAll(' ', '');
  var values = list.split(",");
  for(var i=0; i<values.length; i++)
    if(values[i] == value) return true;
  return false;
}

function setIframe(iframeSrc, videoUrl, website){
  var iframeSkeleton, result;
  iframeSkeleton = $('#kapchat_iframe_skeleton').html();
  result = iframeSkeleton.replace('{iframe_src}', iframeSrc);
  result = result.replace('{video_url}', videoUrl);
  result = result.replace('{website}', website);
  return result;
}

// funkcja zamienia w podanym stringu adresy url na klikalne linki
function parseLinks(message){
  if(kapchatShowLinks == true){
    var reg, found, i, iframeSkeleton;
    message = message.replaceAll('&amp;', '&');
    reg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
    found = message.match(reg);
    if(found) {
      for (i = 0; i < found.length; i++) {
        if(isIn(found[i].slice(-4), '.jpg,.png,.bmp,.gif,.svg') && kapchatShowImages == true)
          message = message.replace(found[i], '<img class="kapchat_image" src="' + found[i] + '"/>');
        else if(kapchatShowVideo == true && found[i].search('youtube.com/watch') != -1)
          message = message.replace(found[i], setIframe('https://www.youtube.com/embed/'+found[i].substr(found[i].search('v=')+2, 11), found[i], 'youtube'));
        else if(kapchatShowVideo == true && found[i].search('youtu.be/') != -1)
          message = message.replace(found[i], setIframe('https://www.youtube.com/embed/'+found[i].substr(found[i].search('.be/')+4, 11), found[i], 'youtube'));
        else if(kapchatShowVideo == true && found[i].search('vimeo.com/') != -1)
          message = message.replace(found[i], setIframe('https://player.vimeo.com/video/'+found[i].substr(-9), found[i], 'vimeo'));
        else if(kapchatShowVideo == true && found[i].search('dailymotion.com/video/') != -1)
          message = message.replace(found[i], setIframe('http://www.dailymotion.com/embed/video/'+found[i].substr(found[i].search('video/')+6, 7), found[i], 'dailymotion'));
        else if(kapchatShowVideo == true && found[i].search('dailymotion.com') != -1)
          message = message.replace(found[i], setIframe('http://www.dailymotion.com/embed/video/'+found[i].substr(found[i].search('video=')+6, 7), found[i], 'dailymotion'));
        else
          message = message.replace(found[i], '<a href="' + found[i] + '" target="_blank">' + found[i] + '</a>');
      }
    }
  }
  return message;
};

// funkcja zamienia w podanym stringu niecenzuralne slowa na *** wedlug przekazanej listy
String.prototype.parseCurse = function(curseList){
  var message = this + "";
  curseList = curseList.replaceAll(' ', '');
  var curse = curseList.split(",");
  for(var i=0; i<curse.length; i++){
    message = message.replaceAll(curse[i],'***', true);
  }

  return message;
};

// funkcja zamienia w podanym stringu zwykle emotikony na obrazki
String.prototype.parseEmots = function(folder, emotsArray){
  var message = this + "";

  for (var i in emotsArray) {
    message = message.replaceAll(emotsArray[i],'<img src="kapchat_files/images/emots/'+folder+'/'+i+'.png" />', true);
  }

  return message;
};

// pobiera timestamp w formacie uniksowym (w sekundach)
// zwraca różnicę czasu pomiędzy obecnym a podanym (np. 23d 15h 34m ago)
function ago(timestamp){
  var ago;
  var current = Math.floor((new Date()).getTime() / 1000);
  var seconds = current - timestamp;
  if(seconds <= 0)
    return '&nbsp;';
  var days = Math.floor(seconds/(60*60*24));
  var hours = Math.floor(seconds/(60*60)-days*24);
  var minutes = Math.floor(seconds/60-days*24*60-hours*60);
  if(days != 0)
    ago = days+'d '+hours+'h '+minutes+'m '+' ago';
  else if(hours != 0)
    ago = hours+'h '+minutes+'m '+' ago';
  else if(minutes != 0)
    ago = minutes+'m '+' ago';
  else
    ago = '&nbsp;';
  return ago;
}

// pobiera komentarze z bazy i wyświetla je na ekranie
function kapchat_showMessages(){

  $('.kapchat_ago').each(function(){
    var timestamp = $(this).attr('timestamp');
    if(timestamp != '{timestamp}')
      $(this).html(ago(timestamp));
  });

  function results(data, status){

    if(data.substr(0, 5) != 'false'){
      var id, color, nick, coloredNick;
      var json = JSON.parse(data);
      var content = '';
      var skeleton = $('div#kapchat_messages_skeleton').html();

      $.each(json, function(key, value){
        $sound.play();

        id = value.message_id;
        color = value.color;
        nick = value.nick;

        if(color != '' && isIn(color, '#b9714a,#fd6500,#ed1c24,#ff3577,#b04fb0,#9f40ff,#3f48cc,#00a2e8,#22b14c,#82a202'))
          coloredNick = '<span style="color: '+color+'">'+nick+'</span>';
        else
          coloredNick = nick;

        var message = '';
        message = skeleton.replace('{id}', id);
        message = message.replace('{nick}', coloredNick.parseCurse(kapchatCurseList));
        message = message.replace('{message}', parseLinks(value.message).parseCurse(kapchatCurseList).parseEmots(kapchatEmotsFolder, kapchatEmots));
        message = message.replace('{ago}', ago(value.timestamp));
        message = message.replace('{timestamp}', value.timestamp);

        if($('.kapchat_id option[value="'+id+'"]').length)
          return false;
        else
          $('div#kapchat_messages').prepend(message);
      });

    }
    else{
      $('div#kapchat_messages').html('Chat chwilowo niedostępny...');
    }
  }

  var lastResult = $('.kapchat_id:eq(1)').html();
  if(lastResult == undefined)
    lastResult = 0;
  $.post('kapchat_files/php/q_select_messages.php', { lastId: lastResult }, results);
}

// wczytaj emotikony do menu
function loadEmots(folder, emotsArray){
  for(var i in emotsArray){
    $('#kapchat_emoticons').append('<a class="kapchat_emoticon_link" href="'+i+'"><img class="kapchat_menu_emoticon" src="kapchat_files/images/emots/'+folder+'/'+i+'.png"/></a>')
  }
}
