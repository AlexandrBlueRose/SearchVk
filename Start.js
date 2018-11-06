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
  await page.type("#quick_email", "login");

  //аналогично ,но для селектора пароля
  await page.type("#quick_pass", "password");

  //  nav_promice=page.waitForNavigation()

  //нажимаем на кнопку по селектору кнопки на сайте (кнопка войти)
  await page.click("#quick_login_button");

  //ожидаем 2 секунды(для прогрузки страницы)
  await page.waitFor(2000);

  //переход на страницу друзей
  await page.goto("https://vk.com/friends");

  //вызываем функцию пролистывания страницы(до конца вниз)
  await scroll_page(page);

  //блочим загрузки картинок со страницы для оптимизации
  await page.setRequestInterception(true);
  page.on("request", request => {
    if (request.resourceType() === "image") request.abort();
    else request.continue();
  });

  //вызываем функцию пролистывания страницы(до конца вниз)
  //параметры:
  //1)page:страница с которой работаем
  //2)дистанция на которую прокручивается страница
  //3)через сколько  повторится прокручивание(мкс)
  await scroll_page(page, 2000, 70);

  //ожидаем 2 секунды
  await page.waitFor(2000);

  //вызываем функцию для сбора обьектов исследования(имен людей,их ссылок их количества)
  //для дальнейшей работы с ними и записываем все в константу
  const info_all_pages = await collectFriends(page);

  //выводим в консоль в формате Json
  console.log(JSON.stringify(info_all_pages, null, 2));

  console.log("\nВывод информации о людях:\n");

  //переменная хранящая информацию о всех людях
  const info_peoples = new Array();
  for (let a = 0; a < info_all_pages.length; a++) {
    //переходим по ссылкам обьектов(людей)
    await page.goto(info_all_pages[a].href);

    //ожидаем 1 секунду для загрузки страницы
    await page.waitFor(1000);

    //вызываем функцию которая собирает информацию со страницы и помещаем эту информацию в массив
    info_peoples[a] = await get_info_page(page);

    //выводим собранную  информацию сразу
    console.log(JSON.stringify(info_all_pages[a].name, null, 2));
    console.log(JSON.stringify(info_peoples[a], null, 2));
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

//функция для сбора ссылок,имен и их колличества
function collectFriends(page) {
  //метод $$eval выполняет код на стороне браузера
  const mass = page.$$eval(".friends_user_info", postPreviews =>
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
  return mass;
}

//функция пролистывания страницы до нижней границы(параметр:переменная содержащая адрес страницы с которой мы работаем
//ее используем чтобы вызвать evaluate)
function scroll_page(page, dist, speed) {
  //метод evaluate позволяет использовать команды DOM такие как window,document и тд.
  page.evaluate(async function() {
    //функция promise
    //let scr = new Scroll(0, 2000, 0, 0);
    // scr.Scroll_;
    await new Promise(function(resolve, reject) {
      //function scr() {
      //переменная хранящая дистанцию которую мы проходим и суммируем
      let totalHeight = 0;

      //дистанция на которую прокручивается страница
      let distance = dist;

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
      }, speed); //!!
    });
  });
}

function get_info_page(page) {
  //метод $$eval выполняет код на стороне браузера
  //в inf сохраняем информацию которую взяли с одной страницы
  const inf = page.$$eval(
    "#page_info_wrap",

    postPreviews =>
      postPreviews.map(postPreview => ({
        info: postPreview
          .querySelector("#profile_short > div:nth-child(1) > div.labeled")
          .textContent.trim()
      }))
  );
  return inf;
}
