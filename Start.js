//тут инфа по проге
/*
 * индексы тасков и сигналов и систем в менеджере начинаютя с 's' (s1, s2, s3 и т.д.)
 * коды систем:
 * s0 = менеджер
 * s1 = BD
 * коды сигналов:
 * 0 = стоп, параметр: id останавливаемой системы/таска
 * -1 = пустой сигнал
 * 1 = добавить остановленный таск в очередь, парометры: id таска
 * 2 = запрос к БД с начальным поиском совпадений, параметры: human_base
 */
"use strict";
//инициализация
console.log("Hello world1");
const puppeteer = require("puppeteer"); //пупетин
//файл
var fs = require("fs"); //файловая система/читалка/писалка в файл

//классы

class Human {
  constructor() {
    //это джаваскрипт, детка! свойства/переменные для лохов! конструктор пацанам!
    this.name = null;
    this.gender = "all"; // male/all/female
    this.age = -1;
    this.school = null;
    this.school_class = null;
    this.school_graduation = null;
    this.University = null;
    this.University_faculty = null;
    this.University_graduation = null;
    this.country = "Россия";
    this.region = null;
    this.city = null;
    this.img = null;
    //флаги
    this.photo = false;
    this.on_website = false;
    //BD
    this.accuracy = 0;
    this.id = -1;
  }
}

class Meneger {
  //менеджер, BD - система s1, все id начинаются с s (т.к. нельзя ток цыфры, s - от system и signal)
  constructor(BD) {
    //очередь задач
    this.task_queue = new Array(0); //очередь из id'шников
    this.tasks = {}; //таски (по id'шникам)
    this.free_tasks_id = new Array(1); //пустые id
    this.free_tasks_id[0] = 3;
    this.tasks_max_id = 4; // max id'шник
    //очередь сигналов
    this.signal_queue = new Array(0);
    this.signals = {}; //сигналы нумируются с ss + номер (ss1, ss2, ss3 и т.д.)
    this.free_signals_id = new Array(1);
    this.free_signals_id[0] = 0;
    this.signals_max_id = 1;
    //выполняемые
    //this.runnings_tasks = new Array(0);
    //коды-приемники
    this.systems_ids = {};

    this.systems_ids.s0 = this;
    this.systems_ids.s1 = BD;
    this.tasks_start = "s3"; //с s3 начинаются task'и по id'шникам
  }

  //tasks func
  new_serch_task(priority, human_base) {
    //новый таск на поиск
    let new_id = this.free_tasks_id.pop();
    if (new_id == undefined) {
      new_id = this.tasks_max_id;
      this.tasks_max_id++;
    }
    new_id = "s" + new_id;
    this.tasks[new_id] = new Task(this);
    this.tasks[new_id].priority = priority;
    this.tasks[new_id].objects[0] = human_base;
    this.tasks[new_id].core_func = core_serch_task;
    this.tasks[new_id].stop_func = stop_serch_task;
    this.tasks[new_id].system_id = new_id;
    this.tasks[new_id].id = new_id;
    this.tasks[new_id].run_func = run_serch_task;
    this.tasks[new_id].signals_func = signals_serch_task;

    this.add_task_in_queue(new_id); //+ в очередь
  }
  new_human_base_task(priority, human) {
    let new_id = this.free_tasks_id.pop();
    if (new_id == undefined) {
      new_id = this.tasks_max_id;
      this.tasks_max_id++;
    }
    new_id = "s" + new_id;
    this.tasks[new_id] = new Task(this);
    this.tasks[new_id].priority = priority;
    this.tasks[new_id].objects[0] = human;
    this.tasks[new_id].core_func = core_new_human_base_task;
    this.tasks[new_id].stop_func = stop_new_human_base_task;
    this.tasks[new_id].system_id = new_id;
    this.tasks[new_id].id = new_id;
    this.tasks[new_id].run_func = run_new_human_base_task;
    this.tasks[new_id].signals_func = signals_new_human_base_task;

    this.add_task_in_queue(new_id); //+ в очередь
  }
  add_task_in_queue(task_id) {
    //добавляет такс в очередь в соответствии с приоритетом
    this.task_queue.push(task_id);
    let kk = " ";
    //учитываем приоритеты
    for (let i = 0; i < this.task_queue.length; i++) {
      if (
        this.tasks[this.task_queue[i]].priority <
        this.tasks[this.task_queue[this.task_queue.length - 1]].priority
      ) {
        //меняем местами
        kk = this.task_queue[i];
        this.task_queue[i] = this.task_queue[this.task_queue.length - 1];
        this.task_queue[this.task_queue.length - 1] = kk;
      }
    }
  }
  run_next_task() {
    let task_id = this.task_queue.shift();
    if (task_id != undefined) {
      this.tasks[task_id].run_flag = true;
      this.tasks[task_id].run_func();
    }
  }
  stop_task(task_id) {
    if (this.tasks[task_id] != undefined) {
      this.tasks[task_id].run_flag = false;
    }
  }
  stop_all_tasks() {
    for (let i in this.tasks) {
      this.stop_task(i);
    }
  }
  //signals func
  add_signal(signal) {
    let new_id = this.free_signals_id.pop();
    if (new_id == undefined) {
      new_id = this.signals_max_id;
      this.signals_max_id++;
    }
    new_id = "ss" + new_id;
    this.signals[new_id] = signal;
    this.signals[new_id].id = new_id;
    this.signal_queue.push(new_id);
    let kk = " ";
    //учитываем приоритеты
    for (let i = 0; i < this.signal_queue.length; i++) {
      if (
        this.signals[this.signal_queue[i]].priority <
        this.signals[this.signal_queue[this.signal_queue.length - 1]].priority
      ) {
        //меняем местами
        kk = this.signal_queue[i];
        this.signal_queue[i] = this.signal_queue[this.signal_queue.length - 1];
        this.signal_queue[this.signal_queue.length - 1] = kk;
      }
    }
  }
  run_next_signal() {
    let signal_id = this.signal_queue.shift();
    if (signal_id != undefined) {
      switch (this.signals[signal_id].code) {
        case 0: {
          if (this.signals[signal_id].objects[0] >= this.tasks_start) {
            this.stop_task(this.signals[signal_id].objects[0]);
          }
          break;
        }
        case 1: {
          this.add_task_in_queue(this.signals[signal_id].objects[0]);
          break;
        }
        default:
          break;
      }
    }
  }
}

class Human_base {
  //человеко-шаблон
  constructor() {
    this.human = new Human();
    this.id = -1;
    this.humans_ids = null;
  }
}

class Task {
  //задача
  constructor(meneger0) {
    this.meneger = meneger0;
    this.id = -1; //код задачи
    this.system_id = -1; //код приемника
    this.objects = new Array(0);
    this.core_func = () => {
      return null;
    };
    this.stop_func = () => {
      return null;
    };
    this.run_flag = false; //если false -> стоп опираций, сейв и выход
    this.run_info = new Array(0);
    this.priority = 0;
    this.run_func = () => {
      return null;
    }; //???
    this.signals_func = () => {
      return null;
    };
  }
}

class Signal {
  constructor() {
    this.id = null; //выдается менеджером
    this.system_id = null;
    this.code = -1;
    this.objects = new Array(0);
    this.priority = 0;
    this.source = null; //кто отправляет сигнал
  }
}

class Data_base {
  //BD
  constructor() {}
  new_BD() {}

  load_human(id) {
    let text = fs.readFileSync("BD.txt", "utf8");
    let split_text = text.split("\n");
    let start = 0;
    for (let i = 0; i < split_text.length; i++) {
      let split0 = split_text[i].split("=");
      //console.log('s0= ' + split0[0] + '!');
      //console.log('s1= ' + split0[1] + '!');
      if (split0[0] == "<human_>") {
        if (split0[1] == id + "") {
          start = i;
          break;
        }
      }
    }
    let human0 = new Human();
    if (start != 0) {
      let split0 = split_text[start + 1].split("=");
      human0.name = split0[1]; //
      split0 = split_text[start + 2].split("=");
      human0.gender = split0[1]; //
      split0 = split_text[start + 3].split("=");
      human0.age = split0[1]; //
      split0 = split_text[start + 4].split("=");
      human0.school = split0[1]; //
      split0 = split_text[start + 5].split("=");
      human0.school_class = split0[1]; //
      split0 = split_text[start + 6].split("=");
      human0.school_graduation = split0[1]; //
      split0 = split_text[start + 7].split("=");
      human0.University = split0[1]; //
      split0 = split_text[start + 8].split("=");
      human0.University_faculty = split0[1]; //
      split0 = split_text[start + 9].split("=");
      human0.University_graduation = split0[1]; //
      split0 = split_text[start + 10].split("=");
      human0.country = split0[1]; //
      split0 = split_text[start + 11].split("=");
      human0.region = split0[1];
      split0 = split_text[start + 12].split("=");
      human0.img = split0[1];
      return human0;
    } else {
      return null;
    }
  }

  delete_human() {}

  next_id() {
    let id = 0; //временно
    return id;
  }

  add_human(human) {
    let id = next_id();
    let text = fs.readFileSync("BD.txt", "utf8") + "\n";
    //открытие
    text = text + "<human_>=" + id + "\n";
    //запись
    text = text + "<name>=" + human.name + "\n";
    text = text + "<gender>=" + human.gender + "\n";
    text = text + "<age>=" + human.age + "\n";
    text = text + "<school>=" + human.school + "\n";
    text = text + "<school_class>=" + human.school_class + "\n";
    text = text + "<school_graduation>=" + human.school_graduation + "\n";
    text = text + "<University>=" + human.University + "\n";
    text = text + "<University_faculty>=" + human.University_faculty + "\n";
    text =
      text + "<University_graduation>=" + human.University_graduation + "\n";
    text = text + "<country>=" + human.country + "\n";
    text = text + "<region>=" + human.region + "\n";
    text = text + "<img>=" + human.img + "\n";
    //закрытие
    text = text + "<end_human_>=" + id + "\n";
    //запись
    //console.log(text);
    fs.writeFileSync("BD.txt", text);
  }

  run_signal(signal) {
    return 0;
  }
}

class Search_system {
  //поисковик
  constructor() {}
}

//функции

//для записи и чтения в файл пометки
//fs.writeFileSync("hello.txt", "Привет ми ми ми!") и асинхронная fs.writeFile("hello.txt", "Привет МИГ-29!") перезапись файла
//fs.appendFileSync("hello.txt", "Привет ми ми ми!"); и асинхрон fs.appendFile для дозаписи
//fs.readFileSync("hello.txt", "utf8"); и асинхрон: fs.readFile("hello.txt", "utf8", function(error,data){ });

//функция ожидания ассинхронно
async function async_sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

//serch_task
async function core_serch_task() {
  //функция задачи - поиск
  /*
    let i = 0;
    while (i < 1000) {
        console.log(i);
        await async_sleep(1000);
        i++;
        if (this.run_flag == false) {
            this.stop_func();
            return null;
        }
    }
    console.log('Time serch!');
    */
  /*
    let etap = 0;
    let href_mass = undefined;
    let humans_mass = new Array(0);
    let human_base = this.objects[0];
    //первый этап
    //создание запроса к БД
    let sign_bd_1 = new Signal();
    sign_bd_1.code = 2;
    sign_bd_1.objects[0] = human_base;
    sign_bd_1.system_id = "s1";
    sign_bd_1.priority = 98;
    sign_bd_1.source = this.id;
    this.meneger.add_signal(sign_bd_1);
    //проверка остановки
    if (this.run_flag == false) {
        this.stop_func();
        return null;
    }
    //продолжаем этап
    etap = 1.2;
    href_mass = vk_find();
    for (let i = 0; i < href_mass; i++) {
        let hum = vk_info_page(href_mass[i]); //сбор инфы со страницы
        new_accuracy(hum, human_base); //проверка достоверности
        humans_mass.push(hum); //добвление в массив
    }
    */
  //console.log("serch!");

  let navigation_promise = null;
  const browser = await puppeteer.launch({ headless: false });
  const page1 = await browser.newPage();
  await page1.goto("https://vk.com").catch(e => {
    throw e;
  });
  let Human1 = new Human();
  //ввод логина, пороля
  await page1.type("#index_email", "+79859766033", { delay: 10 }); //логин
  await page1.type("#index_pass", "alexandrbluerose01", { delay: 10 }); //пароль
  await page1.waitFor(100);
  //чужей "компьютер"
  await page1.click("#index_expire"); //галочка "чужей"
  await page1.waitFor(100);
  //логиниться (вход)
  navigation_promise = page1.waitForNavigation({ timeout: 0 }); //обновляем ждалку навигации
  await page1.click("#index_login_button"); //вход
  await navigation_promise; //ждем завершения навигации (если кнопка нас не отправила - ждем вечно =) )
  //переход-поиск
  navigation_promise = page1.waitForNavigation({ timeout: 0 });
  await page1.click("#l_fr"); //друзья
  await navigation_promise;
  await page1.goto("https://vk.com/friends");
  const pages = await vk_find(page1, 1, 30);
  //в качетсве примера во 2 аргумент передан 0(1)элемент для теста(в последствии будет цикл)
  await vk_info_page(page1, pages[0], Human1);

  return 0;
}
async function scrollBeta(page, step) {
  for (let i = 0; i < step; i++) {
    await page.keyboard.press("PageDown");
  }
}
async function stop_serch_task() {
  //останавливающая функция задачи - поиск

  let signal1 = new Signal();
  signal1.objects[0] = this.id;
  signal1.code = 1;
  signal1.priority = 100;
  signal1.system_id = "s0"; //meneger
  signal1.source = this.id;
  this.meneger.add_signal(signal1);
  return 0;
}
//
function new_accuracy(human, human_base) {
  //находит "коффициент достоверности" human
  return 0;
}
//
//функци поиска
async function vk_find(page, index1, kol) {
  //вернет массив ссылок или undefined
  //const step=await page.querySelector('#search_header > div.page_block_header_inner._header_inner > span');

  const step = kol;
  await scrollBeta(page, step);
  // let count = 0;
  // count = await page.$eval("#list_content", elem => elem.childElementCount);
  //let infoHref = null;
  //for (let i = index1; i < count; i++) {
  let infoHref = 0;
  infoHref = await LinksScripe(page, index1);
  //infoHref = await collectFriendsParam(page, 0);
  //}
  if (infoHref !== null) {
    return infoHref;
  } else {
    return 0;
  }
}

//функция для сбора ссылок,имен и их колличества в одинарный массив
//name - имя, numb - номер человека, href - ссылка
function collectFriends(page) {
  //метод $$evaьь l выполняет код на стороне браузера
  //#friends_list
  //#friends_user_row110436895 > div.friends_user_info
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
function LinksScripe(page, index) {
  let st = index;
  const a = page.$eval(
    "#list_content > div:nth-child(" + st + ")",
    pp =>
      Array.from(pp.querySelectorAll(".friends_user_info")).map(link => ({
        name: link
          .querySelector(".friends_field.friends_field_title")
          .textContent.trim()
      })),
    st
  );
  return a;
}
async function get_info_for_get_info(page, str) {
  //метод $$eval выполняет код на стороне браузера
  //в inf сохраняем информацию которую взяли с одной страницы

  const inf = page.$$eval(
    "#page_info_wrap",
    (postPreviews, str) =>
      postPreviews.map(postPreview => ({
        info: postPreview
          .querySelector(
            "#profile_short > div:nth-child(" + str + ") > div.label.fl_l"
          )
          .textContent.trim()
      })),
    str
  );
  return inf;
}

async function get_info_from_page(page, str) {
  //метод $$eval выполняет код на стороне браузера
  //в inf сохраняем информацию которую взяли с одной страницы

  const inf = page.$$eval(
    "#page_info_wrap",
    (postPreviews, str) =>
      postPreviews.map(postPreview => ({
        info: postPreview
          .querySelector(
            "#profile_short > div:nth-child(" + str + ") > div.labeled"
          )
          .textContent.trim()
      })),
    str
  );
  return inf;
}

async function vk_info_page(page, info, HumanList) {
  //вернет human
  const atribute1 = "День рождения:";
  const atribute2 = "Город:";
  const atribute3 = "Место учёбы:";
  await page.goto(info.href);
  let count = 0;
  count = await page.$eval("#profile_short", elem => elem.childElementCount);
  if (count == 0 || count == 1) {
    HumanList.age = "Не указано";
    HumanList.city = "Не указано";
    HumanList.University = "Не указано";
  } else {
    for (let j = 1; j < count; j++) {
      const infoPage = await get_info_from_page(page, j);
      const infoBlock = await get_info_for_get_info(page, j);
      if (infoBlock[0].info == atribute1) {
        HumanList.age = infoPage[0].info;
      }
      if (infoBlock[0].info == atribute2) {
        HumanList.city = infoPage[0].info;
      }
      if (infoBlock[0].info == atribute3) {
        HumanList.University = infoPage[0].info;
      }
    }
  }
  console.log("ok");
  return 0;
}

//

async function run_serch_task() {
  //запускающая функция задачи - поиск

  this.core_func();
  return 0;
}

async function signals_serch_task(signal) {
  //запускающая функция задачи - поиск
  switch (signal.code) {
    case 0: {
      this.run_flag = false;
      meneger.stop_task(this.id);
      break;
    }
    default: {
      break;
    }
  }
  return 0;
}

//_new_human_base_task
async function core_new_human_base_task() {
  //функция задачи - поиск
  return 0;
}

async function stop_new_human_base_task() {
  //останавливающая функция задачи - поиск
  return 0;
}
async function signals_new_human_base_task(signal) {
  //останавливающая функция задачи - поиск
  return 0;
}

async function run_new_human_base_task() {
  //запускающая функция задачи - поиск

  this.core_func();
  return 0;
}
//иные
async function dropdown_list(page, selector, value) {
  //тут ожидание ЗАГРУЗКИ выбора города, ПЕРЕДЕЛАТЬ!!!
  await page.waitFor(1000); //!!!
  await page.click(selector); //открытия списка
  await page.type(selector, value, { delay: 100 }); //вставка значения
  await page.waitFor(2000); //ожидание прогрузки ответов по возможности - переделать!!
  await page.keyboard.press("Enter"); //выбор первого найденного
  return 0;
}
//тестовая
async function Find_picture() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://yandex.ru").catch(e => {
    throw e;
  });
  let ret = 0;
  //await page.screenshot({ path: 'skreen_yandex.png' }).catch((e) => { throw e; });
  //
  await page.waitFor(1000); //опустить можно
  await page.click(
    "body > div.container.rows > div.row.rows__row.rows__row_main > div.col.main.widgets > div.container.container__search.container__line > div > div.col.col_home-arrow > div > div.home-arrow__tabs > div > a:nth-child(2)"
  );
  await page.waitFor(1000); //опустить можно
  await page.click(
    "#feed > div > div > div:nth-child(1) > div:nth-child(1) > div > a"
  );

  //тест
  await page.waitFor(10); //опустить можно
  await page.screenshot({ path: "skreen_yandex.png" }).catch(e => {
    throw e;
  });
  ret = await page.evaluate(() => {
    return document.querySelector(".layout__desc__text").innerText;
  });
  //
  await browser.close();
  // console.log(ret);
  return ret;
  //console.log('Hello world2');
}

async function VK_Find(login, password, human, with_img, browser) {
  //
  //const browser = await puppeteer.launch({ headless: false });//новый браузер
  let page1 = await browser.newPage(); //новая страница
  let navigation_promise = page1.waitForNavigation({ timeout: 0 }); //ждалка навигации
  await page1.goto("https://vk.com/", { timeout: 0 }).catch(e => {
    throw e;
  }); //открываем ВК
  //
  //ввод логина, пороля
  await page1.type("#index_email", login, { delay: 100 }); //логин
  await page1.type("#index_pass", password, { delay: 100 }); //пароль
  await page1.waitFor(100);
  //чужей "компьютер"
  await page1.click("#index_expire"); //галочка "чужей"
  await page1.waitFor(100);
  //логиниться (вход)
  navigation_promise = page1.waitForNavigation({ timeout: 0 }); //обновляем ждалку навигации
  await page1.click("#index_login_button"); //вход
  await navigation_promise; //ждем завершения навигации (если кнопка нас не отправила - ждем вечно =) )
  //переход-поиск
  navigation_promise = page1.waitForNavigation({ timeout: 0 });
  await page1.click("#l_fr"); //друзья
  await navigation_promise;
  await page1.click("#ui_rmenu_find"); //поиск
  //расширенный поиск
  await page1.click("#friends_import_header > a"); //расширенный поиск
  //ввод - регион
  /*
    await page1.click('#cCountry'); //выбор страны
    await page1.type('#cCountry', human.country, { delay: 100 }); //ввод страны
    await page1.keyboard.press('Enter'); //выбор первого найденного
    */
  await dropdown_list(page1, "#cCountry", human.country); //выбор страны
  //await page1.waitFor(100);
  if (human.region !== null) {
    //город/область
    await dropdown_list(page1, "#cCity", human.region);
    if (human.school !== null) {
      //школа
      await dropdown_list(page1, "#school_filter", human.school);
      if (human.school_class !== null) {
        await dropdown_list(page1, "#cSchClass", human.school_class);
      }
      if (human.school_graduation !== null) {
        //!= временно не работает
        //await page1.select('#cSchYear', human.school_graduation + ''); //не проверено!
      }
    }
    if (human.University !== null) {
      //университет
      await dropdown_list(page1, "#uni_filter", human.University);
      if (human.University_faculty !== null) {
        await dropdown_list(page1, "#cFaculty", human.University_faculty);
      }
      if (human.University_graduation !== null) {
        //!=временно не работает
        //await page1.select('#cUniYear', human.school_graduation + ''); //не проверено!
      }
    }
  }
  //ввод возрата !=временно не работает
  if (human.age !== null) {
    //await page1.select('#container18 > table > tbody > tr > td.selector', human.school_graduation+''); //от
    //await page1.select('#container19 > table > tbody > tr > td.selector', human.school_graduation + ''); //до
  }
  //без фото
  if (with_img === false) {
    await page1.click(
      "#marital_filter > div.search_checkboxes > div.checkbox.on"
    ); //выбор страны
  }
  //ввод - пол
  if (human.gender === "male") {
    await page1.click("#cSex > div:nth-child(2)"); //мужчина
  } else {
    if (human.gender === "female") {
      await page1.click("#cSex > div: nth - child(1)"); //женщина
    } else {
      //all
      await page1.click("#cSex > div.radiobtn.on"); //без разницы
    }
  }
  //ввод имени
  if (human.name !== null) {
    //если имя есть
    await page1.type("#search_query", human.name, { delay: 100 }); //ввод имени
    await page1.keyboard.press("Enter"); //поиск
  } else {
    //для безымянных лохов
    await page1.focus("#search_query");
    await page1.keyboard.press("Enter");
  }
  //тест
  await page1.waitFor(100); //опустить можно = ожидание для вида
  //await page1.screenshot({ path: 'skreen_VK.png' }).catch((e) => { throw e; }); //делаенм селфи (скриншет)
  //
  //await browser.close(); //закрываемся
  //
  return page1;
}

//код асинхронный
async function code_start() {
  let browser1 = await puppeteer.launch({ headless: false });
  let human1 = new Human();
  //чтение файла

  human1.gender = "male";
  //human1.age = 20;

  human1.name = human1.name.substring(1, human1.name.length - 1); //чистим №0 элемент
  human1.country = human1.country.substring(0, human1.country.length - 1); //чистим так остальные (если в конце нет пустой строки, то последний не чистим)
  human1.region = human1.region.substring(0, human1.region.length - 1);
  human1.University = human1.University.substring(
    0,
    human1.University.length - 1
  );
  /*
    console.log(human1.name);
    console.log(human1.name.length);
    console.log(human1.country);
    console.log(human1.country.length);
    console.log(human1.region);
    console.log(human1.region.length);
    console.log(human1.University);
    console.log(human1.University.length);
    */

  let page1 = await VK_Find(
    "+79067432629",
    "Vasya211",
    human1,
    false,
    browser1
  );
  let akkaunts = await collectFriends(page1);
  let page_humm = await browser1.newPage();
  for (let i = 0; i < akkaunts.length; i++) {
    console.log("FOR!! " + akkaunts[i].href);
    await page_humm.goto(akkaunts[i].href, { timeout: 0 }).catch(e => {
      throw e;
    }); //открываем ВК
    let human_text = await get_info_page(page_humm);
    let human2 = human1;
    human2.age = human_text[0];
    console.log(human_text[0]);
    await page_humm.waitFor(5000);
    add_human(human2);
  }

  /*
    add_human(human1);
    let test_human = load_human(0);
    test_human.age = 99;
    add_human(test_human);
    */
  console.log("Hello world3");
  browser1.close();
}

var program_flag_test = true;
function test_meneger(meneger) {
  setTimeout(() => {
    meneger.run_next_signal();
    meneger.run_next_task();
    if (program_flag_test == true) test_meneger(meneger);
  }, 1000);
}

try {
  /*
    Find_picture().then((retu) => {
        console.log(retu);
        console.log('Hello world3');
    });
    */
  //code_start();//старт проги
  let data_base = new Data_base();
  let meneger = new Meneger(data_base);
  let hum1 = new Human_base();
  hum1.human.name = "misha";
  let hum2 = new Human_base();
  hum2.human.name = "kolya";
  test_meneger(meneger);
  meneger.new_serch_task(0, hum1);
  //meneger.new_serch_task(1, hum2);
  meneger.run_next_task();
  // async_sleep(4000).then(() => {
  //     meneger.stop_all_tasks();
  // })
} catch (e) {
  console.log(e);
}

setTimeout(() => {
  console.log("Time!");
  program_flag_test = false;
}, 10000);
console.log("Hello world2");
//waitFor(100000
