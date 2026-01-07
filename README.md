# timetable

## Просмотр в GitHub Pages

Проект запускается как статический сайт без сборки.

1. В настройках репозитория включите GitHub Pages для ветки `main` (root).
2. Откройте ссылку GitHub Pages — UI загрузится сразу.

## Локальный просмотр

Откройте `index.html` в браузере или запустите любой локальный статический сервер.
## Запуск локально

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
npm run preview
```

## Публикация на GitHub Pages

1. Соберите проект: `npm run build`.
2. Загрузите содержимое папки `dist/` в ветку `gh-pages` (например через `git subtree` или GitHub Actions).
3. В настройках репозитория включите GitHub Pages для ветки `gh-pages`.

> Vite настроен с `base: './'`, поэтому статическая сборка корректно работает из поддиректории GitHub Pages.
