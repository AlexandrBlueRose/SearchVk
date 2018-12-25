import Head from "next/head";
import { Hello } from "c:/Programmer/SearchVk/Start"; //

export default () => (
  <div>
    <Head>
      <title>My page title</title>
      <meta
        name="viewport"
        content="initial-scale=1.0, width=device-width"
        key="viewport"
      />
    </Head>
    <Head>
      <meta
        name="viewport"
        content="initial-scale=1.2, width=device-width"
        key="viewport"
      />
    </Head>
    <script src="test.js" />

    <h1>Поиск вручную </h1>
    <p>Заполните данные человека </p>
    <p>Фамилия</p>
    <p>
      <input maxlength="15" size="40" />
    </p>
    <p>Имя</p>
    <p>
      <input maxlength="15" size="40" />
    </p>
    <p>Пол</p>
    <p>
      <input maxlength="15" size="40" />
    </p>
    <p>Возраст</p>
    <p>
      <input maxlength="15" size="40" />
    </p>
    <p>Страна</p>
    <p>
      <input maxlength="15" size="40" />
    </p>
    <p>Регион</p>
    <p>
      <input maxlength="15" size="40" />
    </p>
    <p>Город</p>
    <p>
      <input maxlength="15" size="40" />
    </p>
    <p>Школа</p>
    <p>
      <input maxlength="15" size="40" />
    </p>
    <p>Класс</p>
    <p>
      <input maxlength="15" size="40" />
    </p>
    <p>Окончание школы</p>
    <p>
      <input maxlength="15" size="40" />
    </p>
    <p>ВУЗ</p>
    <p>
      <input maxlength="15" size="40" />
    </p>
    <p>Факультет</p>
    <p>
      <input maxlength="15" size="40" />
    </p>
    <p>Окончание высшего учебного заведения</p>
    <p>
      <input maxlength="15" size="40" />
    </p>
    <p>
      <p> ***</p>
      <input type="text" id="quantity" maxlength="15" />
      <input type="button" value="Заказать" id="zakazat" onClick={Hello} />
    </p>
    <h2>
      {" "}
      ****************************** Загрузка из файла
      *******************************************
    </h2>

    <p>
      <input type="button" value=" Выбрать файл" />
    </p>
    <p>
      <input type="button" value=" Начать поиск" />
    </p>
    <p>
      <input type="button" onClick={Hello} />
    </p>
    <p>
      {" "}
      ****************************** Вывод
      *******************************************
    </p>
    <p>
      <textarea name="outputH" />
    </p>
    <p>
      <input type="button" onClick={Hello} />
    </p>
    <h2>******************* Процессы ***********</h2>

    <h2>******************* Процессы ***********</h2>
    <h2>******************* Процессы ***********</h2>

    <table>
      <tr>
        <th>Имя</th>
        <th>Приоритет</th>
        <th>Статус выполнения</th>
      </tr>
      <tr>
        <td>первый</td>
        <td>важный</td>
        <td>начальный</td>
      </tr>
      <tr>
        <td>Centro comercial Moctezuma</td>
        <td>Francisco Chang</td>
        <td>Mexico</td>
      </tr>
      <tr>
        <td>Ernst Handel</td>
        <td>Roland Mendel</td>
        <td>Austria</td>
      </tr>
    </table>
  </div>
);

//в терминале npm run dev
//а после через ctrl нажать на адрес
// при добавлении чего либо оно динамически(без перезапуска ) обновиться
