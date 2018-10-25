//подключаем библиотку puppeteer  позволяющая реализовать удаленное управление
//браузером
const puppeteer = require("puppeteer");

("use struct");

//создаем константу вызова функции которая имеет ссылку на функцию
const scrape = async function() {
  //запуск браузера и запись в переменную ссылки на него ,
  //{ headless: false } позволяет  видеть ход выполнения программы
  //и это облегчает отладку
  const browser = await puppeteer.launch({ headless: false });

  //создаем новую вкладку в браузере и переменную в которой ссыока на него
  const page = await browser.newPage();

  //переходим по ссылке
  await page.goto("https://vk.com/id271572369");

  //берем селектор строки ввода на сайте и заполняем следующим параметром
  await page.type("#quick_email", "+79859766033");

  //аналогично ,но для селектора пароля
  await page.type("#quick_pass", "fantihon00");

  //нажимаем на кнопку по селектору кнопки на сайте (кнопка войти)
  await page.click("#quick_login_button");

  //ожидаем 2 секунды(для прогрузки страницы)
  await page.waitFor(2000);

  //закрываем браузер
  await browser.close();
  return "ok";
};

//обращаемся к функции ,функция then() используется для связывания
//функций ,которые должны быть вызваны Promise. При успешном
//выполнении выводит value,а при ошибке ничего(второго параметра нету,он
//для ошибок)
scrape().then(function(value) {
  console.log(value);
});
