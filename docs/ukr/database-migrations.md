# Міграції бази даних

Baseline-міграція згенерована зі `prisma/schema.prisma`. Підтримуйте схему й
baseline узгодженими: попередній ланцюжок міграцій створював ключі `SERIAL`,
тоді як поточна схема використовує UUID.

Для `prisma migrate dev` задайте `SHADOW_DATABASE_URL` окремої тимчасової
PostgreSQL-бази. Вона не повинна вказувати на базу застосунку чи production.
`prisma.config.ts` використовує цю змінну, коли Prisma створює та скидає
shadow-схему.

## Повторне створення baseline для production

Зробіть резервну копію production і порівняйте її схему з baseline та всіма
наступними міграціями. Для наявної бази baseline лише позначається застосованим,
його SQL не виконується:

```powershell
npx prisma migrate resolve --applied 0_init
```

Після цього `prisma migrate status` може показувати успішні старі міграції,
файли яких відсутні в локальній squashed-історії. Залишайте ці записи в базі —
не видаляйте їх. Якщо остання спільна міграція — baseline, а pending є лише
очікувані нові зміни, застосуйте їх:

```powershell
npx prisma migrate deploy
```

Не запускайте SQL baseline або старих міграцій проти наявної бази. Перед
`resolve` чи `deploy` обов'язково зробіть backup і перевірте schema diff.
