import Head from "next/head";

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
    <p>Заполните данные человека </p>

    <p>
      <input maxlength="15" size="40" value="ФИО" />
    </p>
    <p>
      <input maxlength="15" size="40" value="Возраст" />
    </p>
    <p>
      <input maxlength="15" size="40" value="Институт" />
    </p>
    <p>
      <input maxlength="15" size="40" value="Школа" />
    </p>
    <p>
      <input maxlength="15" size="40" value="Страна проживания" />
    </p>
    <p>
      <input maxlength="15" size="40" value="Город" />
    </p>
    <p>
      <input type="button" value=" Отправить" />
    </p>
    <p>
      <textarea cols="30" rows="8" name="comment" />
    </p>
  </div>
);
