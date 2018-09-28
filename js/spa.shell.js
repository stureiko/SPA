/*
* spa.shell.js
* Модуль Shell для Spa
*/
/* Параметры jsLint */
/*jslint    browser : true, continue : true,
devel : true, indent : 2, maxerr : 50,
newcap : true, nomen : true, plusplus : true,
regexp : true, sloppy : true, vars : true,
white : true
*/
/*global $, spa */
spa.shell = (function () {
//--------- НАЧАЛО ПЕРЕМЕННЫХ В ОБЛАСТИ ВИДИМОСТИ МОДУЛЯ --------
  var
    configMap = {
      main_html : String()
      + '<div class="spa-shell-head">'
      + '<div class="spa-shell-head-logo"></div>'
      + '<div class="spa-shell-head-acct"></div>'
      + '<div class="spa-shell-head-search"></div>'
      +'</div>'
      +'<div class="spa-shell-main">'
      +  '<div class="spa-shell-main-nav"></div>'
      +  '<div class="spa-shell-main-content"></div>'
      +'</div>'
      +'<div class="spa-shell-foot"></div>'
      +'<div class="spa-shell-chat"></div>'
      +'<div class="spa-shell-modal"></div>',
      chat_extend_time: 1000,
      chat_retract_time: 300,
      chat_extend_height: 450,
      chat_retract_height: 15,
      chat_extend_title: 'Щелкните, чтобы свернуть',
      chat_retract_title: 'Щелкните, чтобы раскрыть'
    },
    stateMap = {
      $container: null,
      is_chat_retracted: true
    },
    jqueryMap = {},

    setJqueryMap, toggleChat, onClickChat, initModule;
//--------- КОНЕЦ ПЕРЕМЕННЫХ В ОБЛАСТИ ВИДИМОСТИ МОДУЛЯ --------

//----------------- НАЧАЛО СЛУЖЕБНЫХ МЕТОДОВ -------------------
//------------------ КОНЕЦ СЛУЖЕБНЫХ МЕТОДОВ -------------------

//-------------------- НАЧАЛО МЕТОДОВ DOM ----------------------
//*** начало метода DOM setJqueryMap ***
setJqueryMap = function(){
  var $container = stateMap.$container;
  jqueryMap = {
    $container: $container,
    $chat: $container.find('.spa-shell-chat')
  };
};
//*** конец метода DOM setJqueryMap ***

//*** Начало метода DOM /toggleChat/ ***
// Назначение : свернуть или раскрыть окно чата
// Аргументы :
// * do_extend – если true, раскрыть окно; если false – свернуть
// * callback – необязательная функция, которая вызывается в конце
// * анимации
// Параметры :
// * chat_extend_time, chat_retract_time
// * chat_extend_height, chat_retract_height
// Возвращает : булево значение
// * true – анимация окна чата начата
// * false – анимация окна чата не начата
// Состояние: устанавливает stateMap.is_chat_retracted
// *true - окно свернуто
// *false - окно раскрыто
//
toggleChat = function (do_extend, callback){
  var
    px_chat_ht = jqueryMap.$chat.height(),
    is_open = px_chat_ht === configMap.chat_extend_height,
    is_closed = px_chat_ht === configMap.chat_retract_height,
    is_sliding = ! is_open && ! is_closed;

    // во избежания гонки
    if(is_sliding) {return false;}

    // Начало раскрытия окна чата
    if (do_extend) {
      jqueryMap.$chat.animate(
        {height: configMap.chat_extend_height},
        configMap.chat_extend_time,
        function(){
          jqueryMap.$chat.attr(
            'title', configMap.chat_extend_title
          );
          stateMap.is_chat_retracted = false;
          if (callback) {callback(jqueryMap.$chat);}
        }
      );
      return true;
    }
    // Конец раскрытия окна чата

    // Начало сворачивания окна чата
    jqueryMap.$chat.animate(
      {height: configMap.chat_retract_height},
      configMap.chat_retract_time,
      function(){
        jqueryMap.$chat.attr(
          'title', configMap.chat_retract_title
        );
        stateMap.is_chat_retracted = true;
        if (callback) {callback (jqueryMap.$chat);}
      }
    );
    return true;
    // Конец сворачивания окна чата
};
//*** Конец метода DOM /toggleChat/ ***
//--------------------- КОНЕЦ МЕТОДОВ DOM ----------------------

//---------------- НАЧАЛО ОБРАБОТЧИКОВ СОБЫТИЙ -----------------
onClickChat = function (event){
  toggleChat(stateMap.is_chat_retracted);
  return false;
};
//----------------- КОНЕЦ ОБРАБОТЧИКОВ СОБЫТИЙ -----------------

//------------------- НАЧАЛО ОТКРЫТЫХ МЕТОДОВ ------------------
// *** Начало открытого метода initModule ***
initModule = function ($container){
  // загрузить html и кэшировать коллекции jQuery
  stateMap.$container = $container;
  $container.html(configMap.main_html);
  setJqueryMap();

  // инициализировать окно чата и привязать обработчик щелчка мыши
  stateMap.is_chat_retracted = true;
  jqueryMap.$chat
    .attr('title', configMap.chat_retract_title)
    .click(onClickChat);
};
// *** Конец открытого метода initModule ***

return {initModule: initModule};
//----------------- КОНЕЦ ОТКРЫТЫХ МЕТОДОВ -----------------
}());
