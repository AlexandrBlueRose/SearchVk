//подключаем библиотку puppeteer  позволяющая реализовать удаленное управление
//браузером
const puppeteer = require("puppeteer");

//подключаем свой модуль для обработки и сбора информации со страниц
const scraping = require("./engine/scraping.js");

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

  //переход на страницу друзей
  await page.goto("https://vk.com/friends");

  //метод evaluate позволяет использовать команды DOM такие как window,document и тд.
  await page.evaluate(async function() {
    //функция promise
    await new Promise(function(resolve, reject) {
      //переменная хранящая дистанцию которую мы проходим и суммируем
      let totalHeight = 0;

      //дистанция на которую прокручивается страница
      let distance = 2000;

      //таймер содержащий ссылку на метод SetInterval которая выполняет
      //функцию(это первый аргумент метода) ,регулярно повторяя ее через
      //указанный интервал времени(второй аргумент метода)
      let timer = setInterval(() => {
        //переменная содержащая возможную(максимальную) длину прокрутки
        let scrollHeight = document.body.scrollHeight;

        //метод который пролистывает страницу (первый аргумент это пролистывание по y ,второй по x)
        window.scrollBy(0, distance);

        //увеличиваем пройденную дистанцию на данный момент
        totalHeight += distance;

        //если пройденная дистанция больше или равна максимальной
        if (totalHeight >= scrollHeight) {
          //останавливаем повторение функции
          clearInterval(timer);

          //посылаем Promise-у что все успешно и вызодим
          resolve();
        }

        //Через сколько повторится функция(мкс)
      }, 70);
    });
  });

  //блочим загрузки картинок со страницы для оптимизации
  await page.setRequestInterception(true);
  page.on("request", request => {
    if (request.resourceType() === "image") request.abort();
    else request.continue();
  });

  //переменная счетчик
  let i = 0;

  //метод $$eval выполняет код на стороне браузера
  const div2 = await page.$$eval(".friends_user_info", postPreviews =>
    postPreviews.map(postPreview => ({
      name: postPreview
        .querySelector(".friends_field.friends_field_title")
        .textContent.trim(),
      numb: i++,
      href: postPreview.querySelector(".friends_field.friends_field_title > a")
        .href
      //student: postPreview.querySelector('#profile_full > div:nth-child(3) > div.profile_info > div > div.labeled > a:nth-child(1)').textContent.trim()
    }))
  );

  const divFin = new Array();
  for (let a = 0; a < div2.length; a++) {
    //let k = 1;

    await page.goto(div2[a].href);
    await page.waitFor(1000);
    divFin[a] = await page.$$eval(
      "#page_info_wrap",

      postPreviews =>
        postPreviews.map(postPreview => ({
          name: postPreview
            .querySelector("#profile_short > div:nth-child(1) > div.labeled")
            .textContent.trim()
        }))
    );
    console.log(JSON.stringify(divFin[a], null, 2));
    await page.click(
      "#profile_friends > a.module_header > div > span.header_label.fl_l"
    );
    await page.waitFor(1000);
    const div222 = await page.$$eval(".friends_user_info", postPreviews =>
      postPreviews.map(postPreview => ({
        name: postPreview
          .querySelector(".friends_field.friends_field_title")
          .textContent.trim(),
        numb: i++,
        href: postPreview.querySelector(
          ".friends_field.friends_field_title > a"
        ).href
        //student: postPreview.querySelector('#profile_full > div:nth-child(3) > div.profile_info > div > div.labeled > a:nth-child(1)').textContent.trim()
      }))
    );
    //await page.waitFor(10000);
  }

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

function collectFriends() {}
