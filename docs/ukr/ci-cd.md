# CI/CD

`.github/workflows/ci-cd.yml` запускається для pull request у `main` і push у
`main`. Workflow встановлює залежності з lock-файла, генерує та перевіряє
Prisma Client, перевіряє межі модулів і TypeScript, запускає тести, build та
аудит залежностей. CI використовує тестові URL бази й не підключається до
реальної БД.

Після успішних перевірок push у `main` запускає деплой у Render через GitHub
Actions secret `RENDER_DEPLOY_HOOK_URL`. Додайте URL deploy hook сервісу в
**Settings → Secrets and variables → Actions**. Вимкніть автоматичний Git-деплой
у Render, щоб commit не розгортався до завершення CI.

Налаштуйте Render Web Service:

- Runtime: Node
- Гілка: `main`
- Build command: `npm ci && npx prisma generate && npm run build`
- Start command: `npm start`
- Версія Node.js: 22
- Змінні середовища: `DATABASE_URL`, `JWT_SECRET`,
  `ORIGIN_FRONTEND_URL`; за потреби `JWT_EXPIRES_IN` (типово `1d`)

Workflow навмисно не запускає `prisma migrate deploy`. Production-міграції
потрібно виконувати окремим перевіреним кроком після узгодження історії
міграцій і baseline. Додайте статус `Checks` як обов’язкову перевірку в правилах
захисту гілки `main`.
