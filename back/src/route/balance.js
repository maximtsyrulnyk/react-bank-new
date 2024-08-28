// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')
const { Session } = require('../class/session')
const { Balance } = require('../class/balance')
const { Transaction } = require('../class/transaction')
const { Notification } = require('../class/notification')

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки

router.post('/balance', function (req, res) {
  const { token, user } = req.body

  if (!token || !user) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }
  try {
    const sessionUser = Session.get(token)

    if (!sessionUser) {
      return res.status(400).json({
        message: 'Токен не вірний',
      })
    }

    const newUser = User.getById(user.id)

    if (!newUser) {
      return res.status(400).json({
        message: 'Користувач з таким id не існує',
      })
    }

    if (
      String(user.email).toLowerCase() !== newUser.email
    ) {
      return res.status(400).json({
        message: 'Email не вірний',
      })
    }

    const list = Transaction.getList(user.id)

    const balance = Balance.getData(user.id)

    if (list.length === 0) {
      return res.status(200).json({
        list: [],
        balance: balance,
      })
    }

    return res.status(200).json({
      list: list.map(
        ({ id, email, img, sum, title, type, date }) => ({
          id,
          email,
          img,
          sum,
          title,
          type,
          date,
        }),
      ),
      balance: balance,
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

router.post('/transaction', function (req, res) {
  const { token, user, id } = req.body

  console.log(token, user, id)

  if (!token || !user || !id) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }
  try {
    const sessionUser = Session.get(token)

    if (!sessionUser) {
      return res.status(400).json({
        message: 'Токен не вірний',
      })
    }

    const newUser = User.getById(user.id)

    if (!newUser) {
      return res.status(400).json({
        message: 'Користувач з таким id не існує',
      })
    }

    if (
      String(user.email).toLowerCase() !== newUser.email
    ) {
      return res.status(400).json({
        message: 'Email не вірний',
      })
    }

    const transaction = Transaction.getById(id)

    if (!transaction) {
      return res.status(400).json({
        message: 'Транзакції з таким id не існує',
      })
    }

    return res.status(200).json({
      transaction,
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

router.post('/recive', function (req, res) {
  const { sum, type, title, token, user } = req.body

  if ((!sum || !type || !title, !token || !user)) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const img = `../../../svg/logo-${title.toLowerCase()}.svg`

    const sessionUser = Session.get(token)

    if (!sessionUser) {
      return res.status(400).json({
        message: 'Токен не вірний',
      })
    }

    const newUser = User.getById(user.id)

    if (!newUser) {
      return res.status(400).json({
        message: 'Користувач з таким id не існує',
      })
    }

    if (
      String(user.email).toLowerCase() !== newUser.email
    ) {
      return res.status(400).json({
        message: 'Email не вірний',
      })
    }

    const transaction = Transaction.create({
      sum: sum,
      type: type,
      title: title,
      img: img,
      email: user.email,
      id: user.id,
    })

    if (!transaction) {
      return res.status(400).json({
        message: 'Помилка створення транзакції',
      })
    }

    Balance.setData(user.id, sum)

    const notification = Notification.create({
      type: 'Announcement',
      title: 'Поповнення',
      img: '../../../svg/not-bell.svg',
      id: user.id,
    })

    if (!notification) {
      return res.status(400).json({
        message: 'Помилка створення нотифікації',
      })
    }

    return res.status(200).json({
      message: 'Транзакція успішна',
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.post('/send', function (req, res) {
  const { sum, type, email, token, user } = req.body

  if ((!sum || !type || !email, !token || !user)) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }
  console.log(sum, type, email, token, user)

  try {
    const img = '../../../svg/user.svg'

    const sessionUser = Session.get(token)

    if (!sessionUser) {
      return res.status(400).json({
        message: 'Токен не вірний',
      })
    }

    const newUser = User.getById(user.id)

    if (!newUser) {
      return res.status(400).json({
        message: 'Користувач з таким id не існує',
      })
    }

    if (
      String(user.email).toLowerCase() !== newUser.email
    ) {
      return res.status(400).json({
        message: 'Email не вірний',
      })
    }

    const balUser = Balance.getData(user.id)

    if (balUser < sum) {
      return res.status(400).json({
        message:
          'Коштів на рахунку недостатньо для здійснення транзакції',
      })
    }

    const recipientUser = User.getByEmail(email)

    if (!recipientUser) {
      return res.status(400).json({
        message: 'Отримувача з таким email не існує',
      })
    }
    const transactionSend = Transaction.create({
      sum: -sum,
      type: type,
      title: email,
      img: img,
      email: email,
      id: user.id,
    })

    if (!transactionSend) {
      return res.status(400).json({
        message:
          'Помилка створення транзакції відправлення',
      })
    }

    Balance.setData(user.id, -sum)

    const transactionReceipt = Transaction.create({
      sum: sum,
      type: 'Receipt',
      title: user.email,
      img: img,
      email: user.email,
      id: recipientUser.id,
    })

    if (!transactionReceipt) {
      return res.status(400).json({
        message: 'Помилка створення транзакції отримання',
      })
    }

    Balance.setData(recipientUser.id, sum)

    const notificationSend = Notification.create({
      type: 'Announcement',
      title: 'Переказ',
      img: '../../../svg/not-bell.svg',
      id: user.id,
    })

    if (!notificationSend) {
      return res.status(400).json({
        message: 'Помилка створення нотифікації',
      })
    }

    const notificationReceipt = Notification.create({
      type: 'Announcement',
      title: 'Переказ',
      img: '../../../svg/not-bell.svg',
      id: recipientUser.id,
    })

    if (!notificationReceipt) {
      return res.status(400).json({
        message: 'Помилка створення нотифікації',
      })
    }

    return res.status(200).json({
      message: 'Транзакція успішна',
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки

router.post('/notifications', function (req, res) {
  const { token, user } = req.body

  if (!token || !user) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }
  try {
    const sessionUser = Session.get(token)

    if (!sessionUser) {
      return res.status(400).json({
        message: 'Токен не вірний',
      })
    }

    const newUser = User.getById(user.id)

    if (!newUser) {
      return res.status(400).json({
        message: 'Користувач з таким id не існує',
      })
    }

    if (
      String(user.email).toLowerCase() !== newUser.email
    ) {
      return res.status(400).json({
        message: 'Email не вірний',
      })
    }

    const list = Notification.getList(user.id)

    if (list.length === 0) {
      return res.status(200).json({
        list: [],
      })
    }

    return res.status(200).json({
      list: list.map(({ id, type, title, img, date }) => ({
        id,
        type,
        title,
        img,
        date,
      })),
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

// Підключаємо роутер до бек-енду
module.exports = router
