//////////////////////////////////////////////////////////////
//тут инфа по проге
/*
 * ошибки:
 * при чтении массива human'ов в поиске возможно переполнение массива
 * //
 * индексы тасков и сигналов и систем в менеджере начинаютя с 's' (s1, s2, s3 и т.д.)
 * коды систем:
 * s0 = менеджер
 * s1 = BD
 * коды сигналов:
 * 0 = стоп, параметр: id останавливаемой системы/таска
 * -1 = пустой сигнал
 * 1 = добавить остановленный таск в очередь, парометры: [0] id таска
 * 2 = запрос к БД с поиском совпадений, параметры: [0] human_base
 * 3 = запрос к БД об записи human'а, параметры: [0] human; [1] human_base.id
 * 4 = сигнал окончания таска поиска, параметры: [0] end_humans_mass; [1] true/false успешность
 * 5 = сигнал к БД на поиск связей, параметры: [0] human_base
 */
"use strict";
//инициализация
console.log("Hello world1");
const puppeteer = require("puppeteer"); //пупетин
var browser_core; //браузер
//файл
var fs = require("fs"); //файловая система/читалка/писалка в файл

//классы

class Human {
  constructor() {
    //это джаваскрипт, детка! свойства/переменные для лохов! конструктор пацанам!
    this.name = null;
    this.gender = "all"; // male/all/female
    this.age = null;
    this.school = null;
    this.school_class = null;
    this.school_graduation = null;
    this.University = null;
    this.University_faculty = null;
    this.University_graduation = null;
    this.country = "Россия";
    this.region = null;
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
    if (signal.code == 4) {
      console.log("debag");
    }

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
        case 4: {
          // * 4 = сигнал окончания таска поиска, параметры: [0] end_humans_mass; [1] true/false успешность
          if (this.signals[signal_id].objects[1] == true) {
            console.log("great task!");
          } else {
            console.log("bad task!");
          }
          console.log(this.signals[signal_id].objects[0]);
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

  const find_href_count = 1; //поменял для дебага

  //можно собрать количество
  //let count = await page.$eval("#results", elem => elem.childElementCount);
  this.etap = 1.1;
  this.page_hum_find = await browser_core.newPage();
  let href_mass = undefined;
  this.href_step = 0;
  this.humans_mass = new Array(0);
  let human_base = this.objects[0];
  let min_accuracu = min_accuracy_base(human_base);
  let flag_end_task = false;
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
  this.etap = 1.2;
  //создаем страницу
  let page_1_2 = await browser_core.newPage();
  //старт поиска
  await vk_find_start(page_1_2, human_base.human);
  //поиск
  let flag_stop_find = true; //флаг есть ли ещё ссылки ссылкок
  while (flag_stop_find) {
    //проверка остановки
    if (this.run_flag == false) {
      this.stop_func();
      return null;
    }
    //берем ссылки
    href_mass = await vk_find(page_1_2, this.href_step, find_href_count);
    for (let i = 0; i < find_href_count; i++) {
      //проверяем ссылки
      if (href_mass[i] != undefined) {
        //обработка ссылки найденного человека
        this.humans_mass.push(
          await vk_info_page(this.page_hum_find, href_mass[i])
        );
        new_accuracy(this.humans_mass[this.humans_mass.length - 1], human_base); //проверка и выставление достоверности
        if (
          this.humans_mass[this.humans_mass.length - 1].accuracy > min_accuracu
        ) {
          //добавляем в БД
          let sign_bd_3 = new Signal();
          sign_bd_3.code = 3;
          sign_bd_3.objects[0] = this.humans_mass[this.humans_mass.length - 1];
          sign_bd_3.objects[1] = human_base.id;
          sign_bd_3.system_id = "s1";
          sign_bd_3.priority = 99;
          sign_bd_3.source = this.id;
          this.meneger.add_signal(sign_bd_3);
        }
        this.href_step++;
      } else {
        flag_stop_find = false; //найден пустой объект, ссылки кончились
        break;
      }
      //проверка остановки
      if (this.run_flag == false) {
        this.stop_func();
        return null;
      }
    }
  }
  //итог 1 этапа:
  this.etap = 1.3;
  let max_accuracy = max_accuracy_base(human_base);
  let end_humans_mass = new Array(0);
  for (let i = 0; i < this.humans_mass.length; i++) {
    if (this.humans_mass[i].accuracy > max_accuracy) {
      flag_end_task = true;
      end_humans_mass.push(this.humans_mass[i]);
    }
    //проверка остановки
    if (this.run_flag == false) {
      this.stop_func();
      return null;
    }
  }
  if (flag_end_task == true) {
    //конец таска!
    let sign_4 = new Signal();
    sign_4.code = 4;
    sign_4.objects[0] = end_humans_mass;
    sign_4.objects[1] = true;
    sign_4.system_id = "s0";
    sign_4.priority = 99;
    sign_4.source = this.id;
    this.meneger.add_signal(sign_4);
    this.run_flag = false;
    return 0;
  }
  //второй этап
  this.etap = 2;
  //проверка остановки
  if (this.run_flag == false) {
    this.stop_func();
    return null;
  }
  //сигнал к БД о поиске связей
  let sign_bd_2_1 = new Signal();
  sign_bd_2_1 = 5;
  sign_bd_2_1.objects[0] = human_base;
  sign_bd_2_1.system_id = "s1";
  sign_bd_2_1.priority = 97;
  sign_bd_2_1.source = this.id;
  this.meneger.add_signal(sign_bd_2_1);
  //продолжение этапа
  this.etap = 2.2;
  //проверка остановки
  if (this.run_flag == false) {
    this.stop_func();
    return null;
  }
  //копируем хумана
  let human_short = Object.assign({}, human_base.human);
  let page_2_2 = await browser_core.newPage();
  this.find_human = find_human; //добавляем функцию для использования
  let new_hum_mass = 0;
  //этап 2_2_+
  for (let i_et = 0; i < 3; i++) {
    human_short = Object.assign({}, human_base.human); //"откат"
    //проверка этапа
    if (i_et == 1) {
      this.etap = this.etap + 0.01;
      //отброс вуза
      if (human_short.University != null) {
        human_short.University = null;
        human_short.University_faculty = null;
        human_short.University_graduation = null;
        new_hum_mass = await this.find_human(
          human_base,
          human_short,
          page_2_2,
          min_accuracu,
          find_href_count
        );
        if (new_hum_mass.flag == false) {
          //стоп //проверка остановки
          if (this.run_flag == false) {
            this.stop_func();
            return null;
          }
        }
        //итог этапа:
        let end_humans_mass = new Array(0);
        for (let i = 0; i < new_hum_mass.mass.length; i++) {
          if (new_hum_mass.mass[i].accuracy > max_accuracy) {
            flag_end_task = true;
            end_humans_mass.push(new_hum_mass.mass[i]);
          }
          //проверка остановки
          if (this.run_flag == false) {
            this.stop_func();
            return null;
          }
        }
        if (flag_end_task == true) {
          //конец таска!
          let sign_4 = new Signal();
          sign_4.code = 4;
          sign_4.objects[0] = end_humans_mass;
          sign_4.objects[1] = true;
          sign_4.system_id = "s0";
          sign_4.priority = 99;
          sign_4.source = this.id;
          this.meneger.add_signal(sign_4);
          this.run_flag = false;
          return 0;
        }
        //запись полученных human'ов
        for (let i = 0; i < new_hum_mass.mass.length; i++) {
          if (new_hum_mass.mass[i].accuracy >= min_accuracu)
            this.humans_mass.push(new_hum_mass.mass[i]);
        }
        new_hum_mass = 0; //чистим
      } else {
        i_et++; //пропуск этапа
      }
    }
    if (i_et == 2) {
      this.etap = this.etap + 0.01;
      //отброс города
      if (human_short.region != null) {
        human_short.region = null;
        new_hum_mass = await this.find_human(
          human_base,
          human_short,
          page_2_2,
          min_accuracu,
          find_href_count
        );
        if (new_hum_mass.flag == false) {
          //стоп //проверка остановки
          if (this.run_flag == false) {
            this.stop_func();
            return null;
          }
        }
        //итог этапа:
        let end_humans_mass = new Array(0);
        for (let i = 0; i < new_hum_mass.mass.length; i++) {
          if (new_hum_mass.mass[i].accuracy > max_accuracy) {
            flag_end_task = true;
            end_humans_mass.push(new_hum_mass.mass[i]);
          }
          //проверка остановки
          if (this.run_flag == false) {
            this.stop_func();
            return null;
          }
        }
        if (flag_end_task == true) {
          //конец таска!
          let sign_4 = new Signal();
          sign_4.code = 4;
          sign_4.objects[0] = end_humans_mass;
          sign_4.objects[1] = true;
          sign_4.system_id = "s0";
          sign_4.priority = 99;
          sign_4.source = this.id;
          this.meneger.add_signal(sign_4);
          this.run_flag = false;
          return 0;
        }
        //запись полученных human'ов
        for (let i = 0; i < new_hum_mass.mass.length; i++) {
          if (new_hum_mass.mass[i].accuracy >= min_accuracu)
            this.humans_mass.push(new_hum_mass.mass[i]);
        }
        new_hum_mass = 0; //чистим
      } else {
        i_et++; //пропуск этапа
      }
    }
    //отброс школы
    {
      this.etap = this.etap + 0.01;
      if (human_short.school != null) {
        human_short.school = null;
        human_short.school_class = null;
        human_short.school_graduation = null;
        new_hum_mass = await this.find_human(
          human_base,
          human_short,
          page_2_2,
          min_accuracu,
          find_href_count
        );
        if (new_hum_mass.flag == false) {
          //стоп //проверка остановки
          if (this.run_flag == false) {
            this.stop_func();
            return null;
          }
        }
        //итог этапа:
        let end_humans_mass = new Array(0);
        for (let i = 0; i < new_hum_mass.mass.length; i++) {
          if (new_hum_mass.mass[i].accuracy > max_accuracy) {
            flag_end_task = true;
            end_humans_mass.push(new_hum_mass.mass[i]);
          }
          //проверка остановки
          if (this.run_flag == false) {
            this.stop_func();
            return null;
          }
        }
        if (flag_end_task == true) {
          //конец таска!
          let sign_4 = new Signal();
          sign_4.code = 4;
          sign_4.objects[0] = end_humans_mass;
          sign_4.objects[1] = true;
          sign_4.system_id = "s0";
          sign_4.priority = 99;
          sign_4.source = this.id;
          this.meneger.add_signal(sign_4);
          this.run_flag = false;
          return 0;
        }
        //запись полученных human'ов
        for (let i = 0; i < new_hum_mass.mass.length; i++) {
          if (new_hum_mass.mass[i].accuracy >= min_accuracu)
            this.humans_mass.push(new_hum_mass.mass[i]);
        }
        new_hum_mass = 0; //чистим
      }
    }
    //отброс возраста
    {
      this.etap = this.etap + 0.01;
      if (human_short.age != null) {
        human_short.age = null;
        new_hum_mass = await this.find_human(
          human_base,
          human_short,
          page_2_2,
          min_accuracu,
          find_href_count
        );
        if (new_hum_mass.flag == false) {
          //стоп //проверка остановки
          if (this.run_flag == false) {
            this.stop_func();
            return null;
          }
        }
        //итог этапа:
        let end_humans_mass = new Array(0);
        for (let i = 0; i < new_hum_mass.mass.length; i++) {
          if (new_hum_mass.mass[i].accuracy > max_accuracy) {
            flag_end_task = true;
            end_humans_mass.push(new_hum_mass.mass[i]);
          }
          //проверка остановки
          if (this.run_flag == false) {
            this.stop_func();
            return null;
          }
        }
        if (flag_end_task == true) {
          //конец таска!
          let sign_4 = new Signal();
          sign_4.code = 4;
          sign_4.objects[0] = end_humans_mass;
          sign_4.objects[1] = true;
          sign_4.system_id = "s0";
          sign_4.priority = 99;
          sign_4.source = this.id;
          this.meneger.add_signal(sign_4);
          this.run_flag = false;
          return 0;
        }
        //запись полученных human'ов
        for (let i = 0; i < new_hum_mass.mass.length; i++) {
          if (new_hum_mass.mass[i].accuracy >= min_accuracu)
            this.humans_mass.push(new_hum_mass.mass[i]);
        }
        new_hum_mass = 0; //чистим
      }
    }
  }
  //конец
  //конец таска!
  let sign_4 = new Signal();
  sign_4.code = 4;
  sign_4.objects[0] = null;
  sign_4.objects[1] = false;
  sign_4.system_id = "s0";
  sign_4.priority = 99;
  sign_4.source = this.id;
  this.meneger.add_signal(sign_4);
  this.run_flag = false;
  return 0;
}

//функция для поиска, вернет obj0.mass = массив human'ов и obj0.flag = false если не до конца дошел, производит запись в БД (сигналами), исключает уже найденных human'ов
async function find_human(
  human_base,
  human,
  page,
  min_accuracu,
  find_href_count
) {
  let humans_mass = new Array(0);
  let href_mass;
  let href_step = 0;
  //старт поиска
  await vk_find_start(page, human);
  //поиск
  let flag_stop_find = true; //флаг есть ли ещё ссылки ссылкок
  while (flag_stop_find) {
    //проверка остановки
    if (this.run_flag == false) {
      let obj0 = 0;
      obj0.mass = humans_mass;
      obj0.flag = false;
      return obj0;
    }
    //берем ссылки
    href_mass = await vk_find(page, href_step, find_href_count);
    for (let i = 0; i < find_href_count; i++) {
      //проверяем ссылки
      if (href_mass[i] != undefined) {
        if (is_rerun_human(href_mass[i], this.humans_mass) == false) {
          //обработка ссылки найденного человека
          humans_mass.push(
            await vk_info_page(this.page_hum_find, href_mass[i])
          );
          new_accuracy(humans_mass[humans_mass.length - 1], human_base); //проверка и выставление достоверности
          if (humans_mass[humans_mass.length - 1].accuracy > min_accuracu) {
            //добавляем в БД
            let sign_bd_3 = new Signal();
            sign_bd_3.code = 3;
            sign_bd_3.objects[0] = humans_mass[humans_mass.length - 1];
            sign_bd_3.objects[1] = human_base.id;
            sign_bd_3.system_id = "s1";
            sign_bd_3.priority = 99;
            sign_bd_3.source = this.id;
            this.meneger.add_signal(sign_bd_3);
          }
          href_step++;
        }
      } else {
        flag_stop_find = false; //найден пустой объект, ссылки кончились
        break;
      }
      //проверка остановки
      if (this.run_flag == false) {
        let obj0 = 0;
        obj0.mass = humans_mass;
        obj0.flag = false;
        return obj0;
      }
    }
  }
  let obj0 = 0;
  obj0.mass = humans_mass;
  obj0.flag = true;
  return obj0;
}
//проверяет наличие human'а с такой ссылкой (для исключения повторов)
function is_rerun_human(href, human_mass) {
  //доделать
  return false;
}

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

//функци поиска
//находит "коффициент достоверности" human
function new_accuracy(human, human_base) {
  //находит "коффициент достоверности" human
  human.accuracy = 99;
  return 99;
}
//находит минимальный коф достоверности базы
function min_accuracy_base(human_base) {
  return 10;
}
//находит макс коф достоверности базы
function max_accuracy_base(human_base) {
  return 90;
}
//с пустой странице перейдет к результатам поиска
async function vk_find_start(page, human) {
  //с пустой странице перейдет к результатам поиска
  await VK_Find("+79067432629", "Vasya211", human, false, page);
}
//вернет массив ссылок или undefined, page = страница с результатами поиска
async function vk_find(page, start, count) {
  //вернет массив ссылок или undefined, page = страница с результатами поиска
  //вернет массив ссылок или undefined
  //const step = kol;
  let infoHref = 0;
  //для отладки можно узнать кол-во эл-тов в селекторе(наследников)
  //count = await page.$eval("#results", elem => elem.childElementCount);
  //второй аргумент номер блока(страницы -начинающейся с 1)
  infoHref = await LinkedScripe(page, start + 1); //вторым аргументом не должен идти 0
  //infoHref = await collectFriendsParam(page, 0);
  //}
  if (infoHref !== null) {
    let mass = new Array();
    for (let i = 0; i < infoHref.length; i++) {
      mass.push(infoHref[i].href);
    }
    return mass;
  } else {
    return 0;
  }
}

async function LinkedScripe(page, index) {
  //Сейчас использую эту для сбора ссылок
  let st = index;
  const mass = await page.$$eval(
    "#results > div:nth-child(" + st + ")",
    postPreviews =>
      postPreviews.map(postPreview => ({
        href: postPreview.querySelector(
          "#results > div > div.info > div.labeled.name > a"
        ).href
      }))
  );
  return mass;
}
//функция для сбора ссылок
/*async function LinksScripe(page, index) {
    let st = index;
    //page.waitForSelector();
    let a = page.$eval(
        "#list_content > div:nth-child(" + st + ")",
        pp =>
            Array.from(pp.querySelectorAll(".friends_user_info")).map(link => ({
                href: link.querySelector(".friends_field.friends_field_title > a")
                    .href
            })),
        st
    );
    return a;
}*/
function LinksScripe(page, index) {
  let st = index + 1;
  //#results > div:nth-child(1)
  //.info
  //.labeled.name
  const a = page.$eval(
    "#results > div:nth-child(" + st + ")",
    pp =>
      Array.from(pp.querySelectorAll(".info")).map(link => ({
        name: link.querySelector(".labeled.name").href
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

//вернет human по ссылке
async function vk_info_page(page, href) {
  //вернет human
  let HumanList = new Human();
  const atribute1 = "День рождения:";
  const atribute2 = "Город:";
  const atribute3 = "Место учёбы:";
  await page.goto(href);
  let count = 0;
  count = await page.$eval("#profile_short", elem => elem.childElementCount);
  if (count == 0 || count == 1) {
    HumanList.age = "Не указано";
    HumanList.city = "Не указано";
    HumanList.University = "Не указано";
  } else {
    for (let j = 1; j < count; j++) {
      //
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
  return HumanList;
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
async function scrollBeta(page, step) {
  for (let i = 0; i < step; i++) {
    await page.keyboard.press("PageDown");
  }
}
async function dropdown_list(page, selector, value) {
  //тут ожидание ЗАГРУЗКИ выбора города, ПЕРЕДЕЛАТЬ!!!
  await page.waitFor(1000); //!!!
  await page.click(selector); //открытия списка
  await page.type(selector, value, { delay: 100 }); //вставка значения
  await page.waitFor(2000); //ожидание прогрузки ответов по возможности - переделать!!
  await page.keyboard.press("Enter"); //выбор первого найденного
  return 0;
}
async function VK_Find(login, password, human, with_img, page) {
  //
  //const browser = await puppeteer.launch({ headless: false });//новый браузер
  let page1 = page; //новая страница
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
  //await page1.waitFor(3000);
  await page1.waitForSelector("#friends_import_header > a");
  await page1.click("#friends_import_header > a"); //расширенный поиск
  await page1.waitFor(300);
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
    await page1.click(
      "#container17 > table > tbody > tr > td.selector > input.selector_input.selected"
    );
    //#list_options_container_17
    let counter = await page.$eval(
      "#list_options_container_17",
      elem => elem.childElementCount
    );
    //ot 14-80 do 14-80
    //#option_list_options_container_17_2
    //#option_list_options_container_17_3
    let str;
    //for (let i = 14; i < 80; i++) {
    //    let j = 0;
    //    j++;
    //    if (human.age == i) {
    //        str = j;
    //    }
    //}
    str = human.age - 14;
    await page1.click("#option_list_options_container_17_" + str);
    await page1.click(
      "#container18 > table > tbody > tr > td.selector > input.selector_input.selected"
    );
    await page1.click("#option_list_options_container_18_" + str);
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
  return page1;
}
//функция для сбора ссылок,имен и их колличества в одинарный массив
//name - имя, numb - номер человека, href - ссылка
/*
async function collectFriends(page) {
    //метод $$eval выполняет код на стороне браузера
    const mass = page.$$eval("#results", postPreviews =>
        postPreviews.map(postPreview => ({
            name: postPreview
                .querySelector("#results > div > div.info > div.labeled.name > a")
                .textContent.trim(),
            numb: i++,
            href: postPreview.querySelector("#results > div > div.info > div.labeled.name > a")
                .href
            //student: postPreview.querySelector('#profile_full > div:nth-child(3) > div.profile_info > div > div.labeled > a:nth-child(1)').textContent.trim()
        }))
    );
    return mass;
}
*/
var program_flag_test = true;
async function test_meneger() {
  browser_core = await puppeteer.launch({ headless: false });
  let data_base = new Data_base();
  let meneger = new Meneger(data_base);
  let hum1 = new Human_base();
  hum1.human.name = "Михаил Румянцев";
  hum1.human.country = "Россия";
  hum1.human.region = "Москва";
  hum1.human.University = "МИЭТ";
  meneger.new_serch_task(100, hum1);
  meneger.run_next_task();
  /*
    let yyyy = 0;
    while(yyyy<100000){
        yyyy++;
        setTimeout(() => {
            meneger.run_next_signal();
            meneger.run_next_task();
            if (program_flag_test == true)
                test_meneger(meneger);
        }, 1000);
    }
    browser_core.close();
    */
}

try {
  test_meneger();
} catch (e) {
  console.log(e);
}

setTimeout(() => {
  console.log("Time!");
  program_flag_test = false;
}, 120000);
console.log("Hello world2");
//waitFor(100000);
