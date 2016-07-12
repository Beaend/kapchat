$(document).ready(function(){

// ZAINICJOWANIE KAP CHATA

   // załadowanie emotek do menu
   loadEmots(kapchatEmotsFolder, kapchatEmots);

   // wyswietlenie wiadomosci
   kapchat_showMessages();

   // ustawienie timera odswiezajacego wiadomosci
   if(kapchatRefresh == true){
      var timer = $.timer(function() {
         kapchat_showMessages();
      });
      timer.set({ time : kapchatRefreshInterval * 1000, autostart : true });
   }

   // pobranie ustawień z cookie (jesli istnieją)
   $('#kapchat_nick').val($.cookie('nick'));
   $('#kapchat_nick_color').val($.cookie('color'));
   $('#kapchat_nick').css('color', $.cookie('color'));

// OBSLUGA ZDARZEN

   // dodawanie wiadomosci
   $('#kapchat_add_mess').submit(function(){

      if($('#kapchat_mess').val() != '' && $('#kapchat_nick').val() != ''){

         var nick = $('#kapchat_nick').val();
         $.cookie('nick', nick);

         var formData = $(this).serialize();

         $.post('kapchat_files/php/q_insert_message.php', formData, function(data){
            if(data.slice(0, 5) == 'false'){
               if(data == 'false spam')
                  $('#kapchat_error_message').html('Nie możesz prowadzić monologu.');
               else
                  $('#kapchat_error_message').html('Błąd bazy danych. Spróbuj ponownie później.');
               $('#kapchat_error_box').css('display', 'block');
            }
            else
            {
               var skeleton = $('div#kapchat_messages_skeleton').html();
               var message = '';
               message = skeleton.replace('{id}', data);
               message = message.replace('{nick}', formData.nick.parseCurse(kapchatCurseList));
               message = message.replace('{message}', parseLinks(formData.message).parseCurse(kapchatCurseList).parseEmots(kapchatEmotsFolder, kapchatEmots));
               message = message.replace('{ago}', '');
               message = message.replace('{timestamp}', formData.timestamp);

               $('div#kapchat_messages').prepend(message);
            }
         });
      }

      $('#kapchat_mess').val('');

      return false;
   });

   // zamykanie komunikatow o bledach
   $('#kapchat_error_close').click(function(){
      $('#kapchat_error_box').css('display', 'none');
      return false;
   });

   // otwieranie emotikon
   $('#kapchat_emoticons_open').click(function(){
      $('#kapchat_emoticons_box').css('display', 'block');
      return false;
   });

   // otwieranie ustawien
   $('#kapchat_settings_open').click(function(){
      $('#kapchat_settings_box').css('display', 'block');
      return false;
   });

   // zamykanie emotikon
   $('#kapchat_emoticons_close').click(function(){
      $('#kapchat_emoticons_box').css('display', 'none');
      return false;
   });

   // zamykanie ustawien
   $('#kapchat_settings_close').click(function(){
      $('#kapchat_settings_box').css('display', 'none');
      return false;
   });

   // wstawianie emotki
   $('.kapchat_emoticon_link').click(function(){
      var current, emot, space, final;

      current = $('#kapchat_mess').val();
      if(current == undefined)
      {
         current = '';
         space = '';
      }
      else
         space = ' ';

      emot = kapchatEmots[$(this).attr('href')];
      if(emot == '&lt;3')
         emot = '<3';

      final = current+space+emot+' ';

      $('#kapchat_mess').val(final);
      $('#kapchat_emoticons_box').css('display', 'none');
      $('#kapchat_mess').focus();
      $('#kapchat_mess').val('');
      $('#kapchat_mess').val(final);
      return false;
   });

   // zmiana koloru nicku
   $('.kapchat_color').click(function(){
      var color = $(this).attr('href');
      $('#kapchat_nick_color').val(color);
      $('#kapchat_nick').css('color', color);
      $.cookie('color', color);
      $('.kapchat_color').removeClass('selected');
      $(this).addClass('selected');
      return false;
   });

});
