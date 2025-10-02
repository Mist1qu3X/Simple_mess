const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Начинаем сидирование базы данных...')

  // Очищаем существующие данные (опционально)
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  // Создаём тестовых пользователей
  const user1 = await prisma.user.create({
    data: {
      email: 'alex@example.com',
      name: 'Алексей Иванов',
      avatar: 'https://ui-avatars.com/api/?name=Алексей+Иванов&background=10b981&color=fff'
    }
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'maria@example.com',
      name: 'Мария Петрова',
      avatar: 'https://ui-avatars.com/api/?name=Мария+Петрова&background=8b5cf6&color=fff'
    }
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'dmitry@example.com',
      name: 'Дмитрий Сидоров', 
      avatar: 'https://ui-avatars.com/api/?name=Дмитрий+Сидоров&background=f59e0b&color=fff'
    }
  })

  // Создаём тестовые посты
  await prisma.post.createMany({
    data: [
      {
        content: 'Сегодня был на прекрасной выставке современного искусства. Рекомендую всем посетить!',
        authorId: user1.id
      },
      {
        content: 'Только что закончила работу над новым проектом. Очень довольна результатом! 🎉',
        authorId: user2.id
      },
      {
        content: 'Отличная погода для прогулки в парке! Кто со мной в следующий раз? 😊',
        authorId: user3.id
      }
    ]
  })

  console.log('✅ Тестовые данные успешно созданы!')
  console.log(`👥 Создано пользователей: 3`)
  console.log(`📝 Создано постов: 3`)
}

main()
  .catch(e => {
    console.error('❌ Ошибка при сидировании:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })