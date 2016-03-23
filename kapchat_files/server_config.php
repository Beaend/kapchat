<?php
  $cfg_mysql = array();
  $cfg_postgres = array();

  // USTAWIENIA BAZY MYSQL(nazwy musza znajdowac sie miedzy apostrofmi!)
  $cfg_mysql['host'] = 'localhost'; // nazwa hosta
  $cfg_mysql['user'] = 'root'; // nazwa uzytkownika bazy
  $cfg_mysql['pass'] = 'haslo'; // haslo
  $cfg_mysql['base'] = 'test'; // nazwa bazy
  $cfg_mysql['port'] = ''; // port (zostaw puste jesli uzywasz domyslnego portu)

  // USTAWIENIA BAZY POSTGRESQL (póki co nieaktywne)
  $cfg_postgres['host'] = '';
  $cfg_postgres['user'] = '';
  $cfg_postgres['pass'] = '';
  $cfg_postgres['base'] = '';
  $cfg_postgres['port'] = '';

  // WYBOR RODZAJU BAZY (póki co dziala tylko mysql)
  $cfg_db_engine = 'mysql'; // mysql, postrges

  // ZAKRES POKAZYWANYCH WIADOMOSCI (w godzinach)
  $cfg_range = 24;

  // USTAWIENIA ANTYSPAMU (true - wlaczony, false - wylaczony)
  $cfg_antyspam = true;

  // SPRAWDZANIE PRZEGLADARKI UZYTKOWNIKA (true - wlaczony, false - wylaczony)
  // umozliwia kożystanie z antyspamu nawet gdy uzytkownicy maja wspolne IP
  // wlaczac tylko w razie wyraznej potrzeby
  $cfg_check_browser = false;

  // ILOSC WIADOMOSCI POD RZAD UZNAWANYCH BEDZIE ZA SPAM
  $cfg_max_messages = 5;
