import React from 'react'; //eslint-disable-line
import Comment from './Comment';
import ClearIcon from 'react-icons/lib/md/clear';
import FavoriteIcon from 'react-icons/lib/md/favorite-outline';
import EditIcon from 'react-icons/lib/md/edit';
import AddIcon from 'react-icons/lib/md/add-circle-outline';

const formatDate = (value, unit, suffix, date, defaultFormatter) => {
    return "commented " + defaultFormatter(value, unit, suffix, date);
}

const user = {
  _id: '12345',
  href: '/user/12345',
  name: 'Александр Пушкин',
  avatar: 'http://um.mos.ru/upload/resize_cache/iblock/11f/300_300_2/%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD_%D0%A2%D1%80%D0%BE%D0%BF%D0%B8%D0%BD%D0%B8%D0%BD.jpg',
};

const now = new Date();
var yesterday = new Date(now.getTime());
yesterday.setDate(now.getDate() - 1);

module.exports = function ({ storiesOf, action, knob }) {
  return storiesOf('Comment', module)
    .add('default', () => (
      <Comment user={user}>
        <Comment.Header userName={user.name} />
        <Comment.Content>Some content here</Comment.Content>
        <Comment.Footer date={new Date()} />
      </Comment>
    ))
    .add('with actions', () => (
      <Comment user={user}>
        <Comment.Header userName={user.name}>
          <Comment.Actions><ClearIcon /></Comment.Actions>
        </Comment.Header>
        <Comment.Content>Some content here</Comment.Content>
        <Comment.Footer date={new Date()}>
          <Comment.Actions><FavoriteIcon /></Comment.Actions>
        </Comment.Footer>
      </Comment>
    ))
    .add('time href', () => (
      <Comment user={user}>
        <Comment.Header userName={user.name} />
        <Comment.Content>Some content here</Comment.Content>
        <Comment.Footer date={new Date()} dateHref={"/comments/12345"}/>
      </Comment>
    ))
    .add('custom time format', () => (
      <Comment user={user}>
        <Comment.Header userName={user.name} />
        <Comment.Content>Some content here</Comment.Content>
        <Comment.Footer date={new Date()} timeFormatter={formatDate} />
      </Comment>
    ))
    .add('time ago', () => (
      <Comment user={user}>
        <Comment.Header userName={user.name} />
        <Comment.Content>Some content here</Comment.Content>
        <Comment.Footer date={yesterday} />
      </Comment>
    ))
    .add('info position', () => (
      <Comment user={user}>
        <Comment.Header date={yesterday} />
        <Comment.Content>Some content here</Comment.Content>
        <Comment.Footer userName={user.name} />
      </Comment>
    ))
    .add('with markdown content', () => (
      <Comment user={user}>
        <Comment.Header userName={user.name} />
        <Comment.Content md>## header</Comment.Content>
        <Comment.Footer date={new Date()} />
      </Comment>
    ))
    .add('with html content (as string)', () => (
      <Comment user={user}>
        <Comment.Header userName={user.name} />
        <Comment.Content html>{"<div>Some <b>html content</b> here</div>"}</Comment.Content>
        <Comment.Footer date={new Date()} />
      </Comment>
    ))
    .add('with jsx content', () => (
      <Comment user={user}>
        <Comment.Header userName={user.name} />
        <Comment.Content><a href="#">Link</a></Comment.Content>
        <Comment.Footer date={new Date()} />
      </Comment>
    ))
    .add('no data', () => <Comment />)
/*
    // by @isuvorov
    .add('sample', () => (
      <Comment
        user={user}
        href="/comment/12345" // Ссылка при клике на дату
        date={new Date('2017-02-14')}
        content="Буря мглою небо кроет, Вихри снежные крутя; То, как зверь, она завоет, То заплачет, как дитя."
      />
    ))
    .add('date=только что', () => (
      <Comment
        user={user}
        date={new Date()}
        content="Буря мглою небо кроет, Вихри снежные крутя; То, как зверь, она завоет, То заплачет, как дитя."
      />
    ))
    .add('date=10 минут назад', () => (
      <Comment
        user={user}
        date={new Date(Date.now() - 10 * 60 * 1000)}
        content="Буря мглою небо кроет, Вихри снежные крутя; То, как зверь, она завоет, То заплачет, как дитя."
      />
    ))
    .add('date=10 апр в 0:42', () => (
      <Comment
        user={user}
        date={new Date('2017-04-10 0:42:33')}
        content="Буря мглою небо кроет, Вихри снежные крутя; То, как зверь, она завоет, То заплачет, как дитя."

      />
    ))
    .add('date=10 апр 2016 в 0:42', () => (
      <Comment
        user={user}
        date={new Date('2016-04-10 0:42:33')}
        content="Буря мглою небо кроет, Вихри снежные крутя; То, как зверь, она завоет, То заплачет, как дитя."

      />
    ))
    .add('content as string', () => (
      <Comment
        user={user}
        content="Буря мглою небо кроет, Вихри снежные крутя; То, как зверь, она завоет, То заплачет, как дитя."
      />
    ))
    .add('content as string', () => (
      <Comment
        user={user}
        content="Будет ли у нас мультилайн? Нужно поразмышлять!

Буря мглою небо кроет,
Вихри снежные крутя;
То, как зверь, она завоет,
То заплачет, как дитя."
      />
    ))
    .add('content as jsx', () => (
      <Comment
        user={user}
        content={(
          <div>
            <h3>Стих 2</h3>
            <p>
              Наша ветхая лачужка
              И печальна и темна.
              Что же ты, моя старушка,
              Приумолкла у окна?
            </p>
          </div>
        )}
      />
    ))
    .add('content as html', () => (
      <Comment
        user={user}
        content={{
          html: ```
<h3>Стих 2</h3>
<p>
  Наша ветхая лачужка
  И печальна и темна.
  Что же ты, моя старушка,
  Приумолкла у окна?
</p>
```,
        }}
      />
    ))
    .add('content as markdown', () => (
      <Comment
        user={user}
        content={{
          md: ```
# Буря мглою небо кроет...

Буря мглою *небо* кроет,
Вихри снежные крутя...
```,
        }}
      />
    ))
    .add('empty', () => (
      <Comment />
    ))
    .add('content size=tiny', () => (
      <Comment
        content="Some word "
      />
    ))
    .add('content size=middile', () => (
      <Comment
        content="Any words any words  any wor ds  any words  any words  any wor ds  any words  any words  any wor ds  any words  any w rds  any words"
      />
    ))
    .add('content size=large', () => (
      <Comment
        content="Any words any words  any wor ds  any words  any words  any wor ds  any words  any words  any wor ds  any words  any w rds  any words Any words any words  any wor ds  any words  any words  any wor ds  any words  any words  any wor ds  any words  any w rds  any words Any words any words  any wor ds  any words  any words  any wor ds  any words  any words  any wor ds  any words  any w rds  any words Any words any words  any wor ds  any words  any words  any wor ds  any words  any words  any wor ds  any words  any w rds  any words Any words any words  any wor ds  any words  any words  any wor ds  any words  any words  any wor ds  any words  any w rds  any words Any words any words  any wor ds  any words  any words  any wor ds  any words  any words  any wor ds  any words  any w rds  any words"
      />
    ))
    .add('edit', () => (
      <Comment
        content="Any words any words  any wor ds  any words  any words  any wor ds  any words  any words  any wor ds  any words  any w rds  any words Any words any words  any wor ds  any words  any words  any wor ds  any words  any words  any wor ds  any words  any w rds  any words Any words any words  any wor ds  any words  any words  any wor ds  any words  any words  any wor ds  any words  any w rds  any words Any words any words  any wor ds  any words  any words  any wor ds  any words  any words  any wor ds  any words  any w rds  any words Any words any words  any wor ds  any words  any words  any wor ds  any words  any words  any wor ds  any words  any w rds  any words Any words any words  any wor ds  any words  any words  any wor ds  any words  any words  any wor ds  any words  any w rds  any words"
      />
    ))
    .add('panels', () => (
      <Comment
        topPanel={(
          <span>
            x
          </span>
        )}
        bottomPanel={(
          <div>
            <span style={{ float: 'left' }}>
              Ответить
            </span>
            <span style={{ float: 'right' }}>
              like
            </span>
          </div>
        )}
      />
    ))
    .add('panels with children', () => (
      <Comment
        topPanel={(
          <div>
            <span style={{ float: 'left' }}>
               редактирование комментария
            </span>
            <span style={{ float: 'right' }}>
              x
            </span>
          </div>
        )}
      >
        <form>
          <textarea />
          (Отмена)
          <input type="submit" />
        </form>
      </Comment>
    ))
    .add('knob', () => (
      <Comment
        text={knob.text('text')}
      />
    ))*/;
};
