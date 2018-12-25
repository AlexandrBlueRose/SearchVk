//тут инфа по проге
/*
 * индексы тасков и сигналов и систем в менеджере начинаютя с 's' (s1, s2, s3 и т.д.)
 * коды сигналов:
 * 
 */
'use strict';
//инициализация

const puppeteer = require('puppeteer'); //пупетин
//файл
var fs = require('fs'); //файловая система/читалка/писалка в файл



//классы
class Human {
    constructor() { //это джаваскрипт, детка! свойства/переменные для лохов! конструктор пацанам!
        this.name = 'zero';
        this.gender = 'all'; // male/all/female
        this.age = -1;
        this.school = 'zero';
        this.school_class = 'zero';
        this.school_graduation = 'zero';
        this.University = 'zero';
        this.University_faculty = 'zero';
        this.University_graduation = 'zero';
        this.country = 'Россия';
        this.region = 'zero';
        this.img = 'zero';
        //флаги
        this.photo = false;
        this.on_website = false;
        //BD
        this.id = -1;
    };
    init(name,age,school,university){
        this.name = name;
        this.gender = 'male'; // male/all/female
        this.age = age;
        this.school = school;
        this.school_class = 11;
        this.school_graduation = 'full';
        this.University = university;
        this.University_faculty = 'Ipovs';
        this.University_graduation = 'partly';
        this.country = 'Russia';
        this.region = 'Zelenograd Moscow';
        this.img = null;
        //флаги
        this.photo = false;
        this.on_website = false;
        //BD
        this.id = 4;
    }
    create(data){
        this.name = data.name;
        this.gender = data.gender;
        this.age = data.age;
        this.school = data.school;
        this.school_class = data.school_class;
        this.school_graduation = data.school_graduation;
        this.University = data.University;
        this.University_faculty = data.University_faculty;
        this.University_graduation = data.University_graduation;
        this.country = data.country;
        this.region = data.region;
        this.img = data.img;
        this.photo = data.photo;
        this.on_website = data.on_website;
        this.id = data.id;
    }
    toString(){
        console.log('human.tostring:\'',JSON.stringify(this),'\'\n');
    }
}

class Meneger { //менеджер, BD - система s1, все id начинаются с s (т.к. нельзя ток цыфры, s - от system и signal)
    constructor(BD) {
        //очередь задач
        this.task_queue = new Array(0); //очередь из id'шников
        this.tasks = {}; //таски (по id'шникам)
        this.free_tasks_id = new Array(1); //пустые id
        this.free_tasks_id[0] = 3;
        this.tasks_max_id = 4; // max id'шник
        //очередь сигналов
        this.signal_queue = new Array(0);
        this.signals = {};
        this.free_signals_id = new Array(1);
        this.free_signals_id[0] = 0;
        this.signals_max_id = 1;
        //выполняемые
        this.runnings_tasks = new Array(0);
        //коды-приемники
        this.systems_ids = {};

        this.systems_ids.s0 = this;
        this.systems_ids.s1 = BD;
        this.systems_ids.tasks_start = 3; //с s3 начинаются task'и по id'шникам
    };
    
    new_serch_task(priority, human_base) { //новый таск на поиск
        let new_id = this.free_tasks_id.pop();
        if (new_id == undefined) {
            new_id = this.tasks_max_id;
            this.tasks_max_id++;
        }
        new_id = "s" + new_id;
        this.tasks[new_id] = new Task();
        this.tasks[new_id].priority = priority;
        this.tasks[new_id].objects[0] = human_base;
        this.tasks[new_id].core_func = core_serch_task;
        this.tasks[new_id].stop_func = stop_serch_task;
        this.tasks[new_id].system_id = new_id;
        this.tasks[new_id].run_func = run_serch_task;

        this.add_task_in_queue(new_id); //+ в очередь
    }
    new_human_base_task(priority, human) {
        let new_id = this.free_tasks_id.pop();
        if (new_id == undefined) {
            new_id = this.tasks_max_id;
            this.tasks_max_id++;
        }
        new_id = "s" + new_id;
        this.tasks[new_id] = new Task();
        this.tasks[new_id].priority = priority;
        this.tasks[new_id].objects[0] = human;
        this.tasks[new_id].core_func = core_new_human_base_task;
        this.tasks[new_id].stop_func = stop_new_human_base_task;
        this.tasks[new_id].system_id = new_id;
        this.tasks[new_id].run_func = run_new_human_base_task;

        this.add_task_in_queue(new_id); //+ в очередь
    }
    add_task_in_queue(task_id) { //добавляет такс в очередь в соответствии с приоритетом
        this.task_queue.push(task_id);
        let kk = " ";
        //учитываем приоритеты
        for (let i = 0; i < this.task_queue.length; i++) {
            if (this.tasks[this.task_queue[i]].priority < this.tasks[this.task_queue[this.task_queue.length - 1]].priority) {
                //меняем местами
                kk = this.task_queue[i];
                this.task_queue[i] = this.task_queue[this.task_queue.length - 1];
                this.task_queue[this.task_queue.length - 1] = kk;
            }
        }
    }
    run_next_task() {
        let task_id = this.task_queue.shift();
        this.tasks[task_id].run_flag = true;
        this.tasks[task_id].run_func();
    }
    
}

class Human_base { //человеко-шаблон
    constructor() {
        this.id = -1;
        this.ids = [-1,-2];
    };
    create(data){
        if(data != null){
        this.id = data.id;
        this.humans_ids = data.humans_ids;
        }
    }
    toString(){
        console.log('Human_base.tostring:\'',JSON.stringify(this),'\'\n');
    }
}

class Task { //задача
    constructor() {
        this.id = -1; //код задачи
        this.system_id = -1; //код приемника
        this.objects = new Array(0);
        this.core_func = () => { return null; };
        this.stop_func = () => { return null; };
        this.run_flag = false; //если false -> стоп опираций, сейв и выход
        this.run_info = new Array(0);
        this.priority = 0;
        this.run_func = () => { return null; };
    };
}

class Data_base { //BD
    constructor(humanPathinp,human_basePathinp) {
        this.humanPath = humanPathinp;
        this.human_basePath = human_basePathinp;
    };
    new_BD() {

    };

    load_human_base(id) {//поиск человека в файле по ид, если найден передается как обьект
        var human_basePath = 'KPO/human_bases.json';
        var fs = require('fs');
        function readLines(input, func) {//построчное считывание, 1 строка = 1 человек
            var remaining = '';        
            input.on('data', function(data) {
            remaining += data;
            var index = remaining.indexOf('\n');
            var last  = 0;
            while (index > -1) {
                var line = remaining.substring(last, index);
                last = index + 1;
                func(line);
                index = remaining.indexOf('\n', last);
            }        
            remaining = remaining.substring(last);
            });        
            input.on('end', function() {
            if (remaining.length > 0) {
                func(remaining);
            }
            });
        }
        function func(data) {//фунцкия обрабатывает 1 строку
            var parsedText = JSON.parse(data);
            if(parsedText.id == id){
                console.log('human found');
                return parsedText;
            }
        }
        var input = fs.createReadStream(human_basePath);
        readLines(input, func);
        console.log('human is not found');//не понятна очередность выполнения строк кода, это пишется когда нейден человек
        return null;
        
    }
    load_human(id) {//поиск человека в файле по ид, если найден передается как обьект
        var humanPath = 'KPO/humans.json';
        var fs = require('fs');
        function readLines(input, func) {//построчное считывание, 1 строка = 1 человек
            var remaining = '';        
            input.on('data', function(data) {
            remaining += data;
            var index = remaining.indexOf('\n');
            var last  = 0;
            while (index > -1) {
                var line = remaining.substring(last, index);
                last = index + 1;
                func(line);
                index = remaining.indexOf('\n', last);
            }        
            remaining = remaining.substring(last);
            });        
            input.on('end', function() {
            if (remaining.length > 0) {
                func(remaining);
            }
            });
        }
        function func(data) {//фунцкия обрабатывает 1 строку
            var parsedText = JSON.parse(data);
            if(parsedText.id == id){
                var human_0 = new Human();//создание обьекта человек
                human_0.create(parsedText);//заполнение данными из файла
                console.log('human found');
                human_0.toString();
                return human_0;
            }
        }
        var input = fs.createReadStream(humanPath);
        readLines(input, func);
        console.log('human is not found');//не понятна очередность выполнения строк кода, это пишется когда нейден человек
        return null;
        
    }

    delete_human() {

    }

    next_id() {
        var id = 0; //временно
        return 0;
    }

    add_human(human) {
        var humanPath = 'KPO/humans.json';
        var fs = require('fs');
        fs.appendFile(humanPath, '', function (err) {//создает файл если его нет
        if (err) throw err;
        });
        fs.open(humanPath, 'wx', (err,fd) => {
            if (err) {
              if (err.code === 'EEXIST') {
                console.error('human added');
                let fd2
                try {
                    fd2 = fs.openSync(humanPath, 'a');
                    fs.appendFileSync(fd2, '\n'+JSON.stringify(human), 'utf8');
                  } catch (err) {
                    /* Handle the error */
                  } finally {
                    if (fd2 !== undefined)
                      fs.closeSync(fd2);
                  }
                return;
              }
          
              throw err;
            }
          });
        }
    add_human_base(human_base) {
            var human_basePath = 'KPO/human_bases.json';
            var fs = require('fs');
            fs.appendFile(human_basePath, '', function (err) {//создает файл если его нет
            if (err) throw err;
            });
            fs.open(human_basePath, 'wx', (err,fd) => {
                if (err) {
                  if (err.code === 'EEXIST') {
                    console.error('human_base added');
                    let fd2
                    try {
                        fd2 = fs.openSync(human_basePath, 'a');
                        fs.appendFileSync(fd2, '\n'+JSON.stringify(human_base), 'utf8');
                      } catch (err) {
                        /* Handle the error */
                      } finally {
                        if (fd2 !== undefined)
                          fs.closeSync(fd2);
                      }
                    return;
                  }
              
                  throw err;
                }
            });
        }
}

class Search_system { //человеко-шаблон
    constructor() {

    };
}

//функции

//fs.writeFileSync("hello.txt", "Привет ми ми ми!") и асинхронная fs.writeFile("hello.txt", "Привет МИГ-29!") перезапись файла
//fs.appendFileSync("hello.txt", "Привет ми ми ми!"); и асинхрон fs.appendFile для дозаписи
//fs.readFileSync("hello.txt", "utf8"); и асинхрон: fs.readFile("hello.txt", "utf8", function(error,data){ });

//serch_task
async function core_serch_task() { //функция задачи - поиск
    let i = 0;
    while (i < 20) {
        console.log(this.objects[0].human.name);
        await setTimeout(() => { }, 1000)
        i++;
    }
    console.log('Time serch!');
    return 0;
}

async function stop_serch_task() { //останавливающая функция задачи - поиск
    return 0;
}

async function run_serch_task() { //запускающая функция задачи - поиск

    this.core_func();
    return 0;
}

//_new_human_base_task
async function core_new_human_base_task() { //функция задачи - поиск
    return 0;
}

async function stop_new_human_base_task() { //останавливающая функция задачи - поиск
    return 0;
}

async function run_new_human_base_task() { //запускающая функция задачи - поиск

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
    await page.keyboard.press('Enter'); //выбор первого найденного
    return 0;
}
//тестовая
async function Find_picture() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://yandex.ru').catch((e) => { throw e; });
    let ret = 0;
    //await page.screenshot({ path: 'skreen_yandex.png' }).catch((e) => { throw e; });
    //
    await page.waitFor(1000);//опустить можно
    await page.click("body > div.container.rows > div.row.rows__row.rows__row_main > div.col.main.widgets > div.container.container__search.container__line > div > div.col.col_home-arrow > div > div.home-arrow__tabs > div > a:nth-child(2)");
    await page.waitFor(1000);//опустить можно
    await page.click("#feed > div > div > div:nth-child(1) > div:nth-child(1) > div > a");

    //тест
    await page.waitFor(10);//опустить можно
    await page.screenshot({ path: 'skreen_yandex.png' }).catch((e) => { throw e; });
    ret = await page.evaluate(() => {
        return document.querySelector('.layout__desc__text').innerText;
    })
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
    let navigation_promise = page1.waitForNavigation({ timeout: 0}); //ждалка навигации
    await page1.goto('https://vk.com/', { timeout: 0 }).catch((e) => { throw e; }); //открываем ВК
    //
    //ввод логина, пороля
    await page1.type('#index_email', login, { delay: 100 }); //логин
    await page1.type('#index_pass', password, { delay: 100 }); //пароль
    await page1.waitFor(100);
    //чужей "компьютер"
    await page1.click('#index_expire'); //галочка "чужей"
    await page1.waitFor(100);
    //логиниться (вход)
    navigation_promise = page1.waitForNavigation({ timeout: 0 }); //обновляем ждалку навигации
    await page1.click('#index_login_button'); //вход
    await navigation_promise; //ждем завершения навигации (если кнопка нас не отправила - ждем вечно =) )
    //переход-поиск
    navigation_promise = page1.waitForNavigation({ timeout: 0 });
    await page1.click('#l_fr'); //друзья
    await navigation_promise;
    await page1.click('#ui_rmenu_find'); //поиск
    //расширенный поиск
    await page1.click('#friends_import_header > a'); //расширенный поиск
    //ввод - регион
    /*
    await page1.click('#cCountry'); //выбор страны
    await page1.type('#cCountry', human.country, { delay: 100 }); //ввод страны
    await page1.keyboard.press('Enter'); //выбор первого найденного
    */
    await dropdown_list(page1, '#cCountry', human.country);//выбор страны
    //await page1.waitFor(100);
    if (human.region !== null) {//город/область
        await dropdown_list(page1, '#cCity', human.region);
        if (human.school !== null) {//школа
            await dropdown_list(page1, '#school_filter', human.school);
            if (human.school_class !== null) {
                await dropdown_list(page1, '#cSchClass', human.school_class);
            }
            if (human.school_graduation !== null) {//!= временно не работает
                //await page1.select('#cSchYear', human.school_graduation + ''); //не проверено!
            }
        }
        if (human.University !== null) {//университет
            await dropdown_list(page1, '#uni_filter', human.University);
            if (human.University_faculty !== null) {
                await dropdown_list(page1, '#cFaculty', human.University_faculty);
            }
            if (human.University_graduation !== null) {//!=временно не работает
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
        await page1.click('#marital_filter > div.search_checkboxes > div.checkbox.on'); //выбор страны
    }
    //ввод - пол
    if (human.gender === 'male') {
        await page1.click('#cSex > div:nth-child(2)'); //мужчина
    }
    else {
        if (human.gender === 'female') {
            await page1.click('#cSex > div: nth - child(1)'); //женщина
        }
        else {
            //all
            await page1.click('#cSex > div.radiobtn.on'); //без разницы
        }
    }
    //ввод имени
    if (human.name !== null) { //если имя есть
        await page1.type('#search_query', human.name, { delay: 100 }); //ввод имени
        await page1.keyboard.press('Enter'); //поиск
    }
    else {//для безымянных лохов
        await page1.focus('#search_query');
        await page1.keyboard.press('Enter');
    }
    //тест
    await page1.waitFor(100);//опустить можно = ожидание для вида
    //await page1.screenshot({ path: 'skreen_VK.png' }).catch((e) => { throw e; }); //делаенм селфи (скриншет)
    //
    //await browser.close(); //закрываемся
    //
    return page1;
}

//снятие инфы с профиля
async function get_info_page(page) {
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

//функция для сбора ссылок,имен и их колличества в одинарный массив
//name - имя, numb - номер человека, href - ссылка
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

//код асинхронный
async function code_start() {
    
    /*let browser1 = await puppeteer.launch({ headless: false });
    let human1 = new Human();
    //чтение файла
    let file1 = fs.readFileSync('text1.txt', 'utf8');
    let file_lines = file1.split('\n');//разбиваем
    human1.name = file_lines[0];
    human1.country = file_lines[1];
    human1.region = file_lines[2];
    human1.University = file_lines[3];
    human1.gender = 'male';
    //human1.age = 20;

    human1.name = human1.name.substring(1, human1.name.length - 1); //чистим №0 элемент
    human1.country = human1.country.substring(0, human1.country.length - 1); //чистим так остальные (если в конце нет пустой строки, то последний не чистим)
    human1.region = human1.region.substring(0, human1.region.length - 1);
    human1.University = human1.University.substring(0, human1.University.length - 1);
    
    let page1 = await VK_Find("+79067432629", "Vasya211", human1, false, browser1);
    let akkaunts = await collectFriends(page1);
    let page_humm = await browser1.newPage();
    for (let i = 0; i < akkaunts.length; i++) {
        console.log('FOR!! ' + akkaunts[i].href);
        await page_humm.goto(akkaunts[i].href, { timeout: 0 }).catch((e) => { throw e; }); //открываем ВК
        let human_text = await get_info_page(page_humm);
        let human2 = human1;
        human2.age = human_text[0];
        console.log(human_text[0]);
        await page_humm.waitFor(5000);
        add_human(human2);
    }
    

    add_human(human1);
    let test_human = load_human(0);
    test_human.age = 99;
    add_human(test_human);

    console.log('Hello world3');
    browser1.close();
    
}

try {

    Find_picture().then((retu) => {
        console.log(retu);
        console.log('Hello world3');
    });

    //code_start();//старт проги
    let data_base = new Data_base();
    let meneger = new Meneger(data_base);
    let hum1 = new Human_base();
    hum1.human.name = "misha";
    let hum2 = new Human_base();
    hum2.human.name = "kolya";
    
    meneger.new_serch_task(0, hum1);
    meneger.new_serch_task(1, hum2);
    meneger.run_next_task();
    
}
catch (e) {
    console.log(e);
}

setTimeout(() => { console.log('Time!'); }, 10000)
console.log('Hello world2');*/

}
/*
Speed
NeDB is not intended to be a replacement of large-scale databases such as MongoDB, 
and as such was not designed for speed. That said, it is still pretty fast on the expected datasets, especially if you use indexing. On a typical, not-so-fast dev machine, for a collection containing 10,000 documents, with indexing:

Insert: 10,680 ops/s
Find: 43,290 ops/s
Update: 8,000 ops/s
Remove: 11,750 ops/s
You can run these simple benchmarks by executing the scripts in the benchmarks folder. 
Run them with the --help flag to see how they work.
*/
//обещанная скорость
//функции бд
//
const Datastore = require('nedb')
 //переменные для тестов и работы функций(все из тех что ты просил сделать(начинаются с 733))
var humans = new Datastore({ filename: 'humans.db', autoload: true });  
var human_base = new Datastore({ filename: 'human_base.db', autoload: true });  
var tasks = new Datastore({ filename: 'tasks.db', autoload: true });
//переменные для тестов (650-733)
var id_for_delete = {_id : 0} //id для удаления обьекта задавать именно так,чтобы работал поиск
var id_for_search = {_id : 0} //id для поиска обьекта
var human_base_constr = {id: 0, ids: []};

//запись человека
{
    var h = new Human();
    humans.insert(h, function(err, doc) {  
        if (err) console.log('1)error in creating: ',err)
        else  {
            console.log('1)Inserted', doc.name, 'with ID', id_for_delete._id = doc._id);
        }//поле
        //id в клессе human не нужно, эта библиотека сама создает _id
        //в esle можно записать в любую переменную doc._id
    });
}
//2) удалить человекобазу по id
{
        humans.remove(id_for_delete, function(err,numDeleted){
        if (err) console.log('2)error in deliting: ',err);
        else  {
            console.log('2)Deleted', numDeleted, 'human(s)');
            console.log('id_for_delete ',id_for_delete);
        }
        });
}
//2) найти (вернуть) человека по id
{
    var h = new Human();
    h.init('name','age','school','university')
    humans.insert(h, function(err, doc) {  
        if (err) console.log('2)error in creating: ',err);
        else  {
            human_base_constr.id = doc._id;
            console.log('2)Inserted', doc.name, 'with ID', id_for_search._id = doc._id);
            id_for_search = doc._id;//делаем новую запись в бд
        }//поле
        //id в клессе human не нужно, эта библиотека сама создает _id
        //в esle можно записать в любую переменную doc._id
    });
    
    console.log("search 1 el");
    humans.findOne(id_for_search, function(err,doc){//поиск 1 человека
        if (err) console.log('error in se: ',err)
        else if (doc == null) console.log('nothing founded ')
        else  {
            console.log('varible before search: ')
            founded_human.toString();
            founded_human.create(doc)
            console.log('varible after search: ')
            founded_human.toString();//в эту переменную записался результат поиска
            console.log('Found user:', doc.name);
        }
    });
    var founded_human = new Human()//хранит найденного человека
    var founded_humans = []
    console.log("search multiple elements");
    humans.find({name: {$in: ["null","name"]}}, function(err,docs){//поиск нескольких человек
        if (err) console.log('error in se: ',err)
        else if (docs == null) console.log('nothing founded ')
        else  {
            docs.forEach(d => {
                /*console.log('varible before multiplesearch: ')
                founded_human.toString();
                founded_human.create(d)
                console.log('varible after multiplesearch: ')
                founded_human.toString();//в эту переменную записался результат поиска
                console.log('Found user:', d.name);
                founded_humans.push(founded_human)*/
                //работает, но закоменчено, чтобы не было спама
            });
            
        }
    });
}
//3)найти human_base по id человека, вернуть id связанных людей
{
    var hb = new Human_base()
    human_base.insert(hb, function(err, doc) {  
        if (err) console.log('4)error in creating: ',err)
        else  {
            console.log('4)Inserted', doc.id, 'with ID', doc._id);
            console.log('чертова ява, про последовательность выполнения команд',
            ' вообще не знает, до этой строки с последовательностью не было проблем',
            'как дальше будет - хз');
        }//поле
        //id в классе human-base  нужно, в нем будет храниться _id humanа
        //в esle можно записать в любую переменную doc._id но тут это не особо нуджно
    });
}

//в виде функций
function addHuman(human){//1)
    humans.insert(human, function(err, doc) {  
        if (err) console.log('1)error in creating: ',err);
        else  {
            return doc._id;
        }
    });
}
function addHumanBase(humanBase){
    human_base.insert(humanBase, function(err, doc) {  
        if (err) console.log('1)error in creating: ',err);
        else  {
            return doc._id;//возвращает id записи, а не человека
        }
    });
}
function delHuman(human_id){//2)
    id = {_id: human_id}
    humans.remove(id, function(err,numDeleted){
        if (err) return false;
        else  
            if (numDeleted > 0) return true;//если удалена хотябы 1 запись
            else return false;
        });
}
function delHumanBase(human_id){//удаляет по id человека а не записи в базе
    id = {id: human_id}
    human_base.remove(id, function(err,numDeleted){
        if (err) return false;
        else  
            if (numDeleted > 0) return true;//если удалена хотябы 1 запись
            else return false;
        });
}
function findOneHuman(human_id){//3)
    id = {_id: human_id}
    humans.findOne(id, function(err,doc){//поиск 1 человека
        if (err) return false;
        else if (doc == null) return false;
        else  {            
            var founded_human = new Human();
            founded_human.create(doc);
            return founded_human;
        }
    });
}
function findOneHumanBase(human_id){//3)
    id = {id: human_id}
    human_base.findOne(id, function(err,doc){//поиск 1 человека
        if (err) return false;
        else if (doc == null) return false;
        else  {            
            var founded_human_base = new Human_base();
            founded_human_base.create(doc);
            return founded_human_base;
        }
    });
}
//4)
function updateHuman(human_id, new_human){//изменение данных человека с помощью id
    humans.update(findOneHuman(human_id),new_human,function(err,numUpdated){
        if (err) return false;
        else if (numUpdated > 0) return true;
        else  return false;
    });
}
function updateHumanBase(human_id, new_human_base){//изменение данных в humanbase с помощью id
    human_base.update(findOneHumanBase(human_id),new_human_base,function(err,numUpdated){
        if (err) return false;
        else if (numUpdated > 0) return true;
        else  return false;
    });
}
//5)
function findHumans(search_task){//example {name: {$in: ["null","name"]}

    console.log("search multiple elements");
    humans.find({name: {$in: ["null","name"]}}/*вместо этой записи search_task*/, function(err,docs){//поиск нескольких человек
        if (err) console.log('error in se: ',err)
        else if (docs == null) console.log('nothing founded ')
        else  {
            var founded_human = new Human();//хранит найденного человека
            var founded_humans = [];
            docs.forEach(d => {
                founded_human.create(d)
                founded_humans.push(founded_human)            
            });    
            return founded_humans;   
        }
    });
}
//6)
function findHumanBase(human_base_el){
    id = {id: human_base_el.id}
    human_base.findOne(id, function(err,doc){//поиск 1 человека
        if (err) return false;
        else if (doc == null) return false;
        else  {            
            return doc._id;//возвращает id записи в humanbase (не человека)
        }
    });
}
//7) я так понял подается id человека для изменения, и ids который нужно добавить в поле ids
function addHumanToBase(human_id,ids_for_adding){
    id = {id: human_id};
    var human_base_el_upd = findOneHumanBase(human_id);
    ids_for_adding.forEach(ids => {
        human_base_el_upd.ids.push(ids);
    });
    human_base.update(findOneHumanBase(human_id),human_base_el_upd,function(err,numUpdated){
        if (err) return false;
        else if (numUpdated > 0) return true;
        else  return false;
    });
}
//8)
function getConnectedHumans(human_id){//должна работать как с 1 id так и с их массивом
    var founded_humans = [];
    var founded_human_base = [];
    var id = {id: human_id};
    founded_human_base.push(findHumanBase(id));
    founded_human_base.forEach(founded_human_base_el => {
        founded_human_base_el.ids.forEach(human_id_from_hb =>{
            founded_humans.push(findOneHuman(human_id_from_hb));
        });
    });
    return founded_humans;
}
//9)
function delHumanBase(human_id){//удаляет по id человека а не записи в базе
    id = {id: human_id}
    human_base.remove(id, function(err,numDeleted){
        if (err) return false;
        else  
            if (numDeleted > 0) return true;//если удалена хотябы 1 запись
            else return false;
        });
}//когда обьект удаляется на его месте остается {"$$deleted":true,"_id":"mf9KOEszZC0hQNM9"}
// так что мы всегда сможем понять, что обьект существовал, но был удален
//10)
function addTask(task){//1)
    tasks.insert(task, function(err, doc) {  
        if (err) console.log('1)error in creating: ',err);
        else  {
            return task._id;
        }
    });
} 
{
    addTask(new Task());
}
//для корректной работы нужно создать файлы humans.db, human_base.db, tasks.db
//эти файлы должны находиться в открытом фолдере(папке выбранной через Open Folder...)