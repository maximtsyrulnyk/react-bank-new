// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')
const { Balance } = require('../class/balance')
const { Notification } = require('../class/notification')

// ================================================================

router.post('/signup', function (req, res) {
  const { email, password } = req.body

  console.log(email, password)

  if (!email || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message: 'Помилка. Такий користувач вже існує',
      })
    }

    const newUser = User.create({ email, password })
    Balance.create(newUser.id)

    const session = Session.create(newUser)

    Confirm.create(newUser.email)

    return res.status(200).json({
      message: 'Користувач успішно зареєстрований',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Помилка створення користувача',
    })
  }
})

// ================================================================

router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body
  console.log(code, token)
  if (!code || !token) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: 'Помилка. Ви не увійшли в акаунт',
      })
    }

    const email = Confirm.getData(Number(code))

    if (!email) {
      return res.status(400).json({
        message: 'Код не існує',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Код не дійсний',
      })
    }

    const user = User.getByEmail(session.user.email)
    user.isConfirm = true
    session.user.isConfirm = true

    return res.status(200).json({
      message: 'Ви підтвердили свою пошту',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ================================================================

router.post('/recovery', function (req, res) {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Користувач з таким email не існує',
      })
    }

    Confirm.create(email)

    return res.status(200).json({
      message: 'Код для відновлення паролю відправлено',
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ================================================================

router.post('/recovery-confirm', function (req, res) {
  const { password, code } = req.body

  console.log(password, code)

  if (!code || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const email = Confirm.getData(Number(code))

    if (!email) {
      return res.status(400).json({
        message: 'Код не існує',
      })
    }

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Користувач з таким email не існує',
      })
    }

    user.password = password

    console.log(user)

    const session = Session.create(user)

    if (!session.user.isConfirm) {
      Confirm.create(session.user.email)
    }

    const notification = Notification.create({
      type: 'Warning',
      title: 'Відновлення акаунту',
      img: '../../../svg/not-danger.svg',
      id: user.id,
    })

    if (!notification) {
      return res.status(400).json({
        message: 'Помилка створення нотифікації',
      })
    }

    return res.status(200).json({
      message: 'Пароль змінено',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ================================================================

router.post('/signin', function (req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message:
          'Помилка. Користувача з таким email не існує',
      })
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: 'Помилка. Пароль не підходить',
      })
    }

    const session = Session.create(user)

    if (!session.user.isConfirm) {
      Confirm.create(session.user.email)
    }

    const notification = Notification.create({
      type: 'Warning',
      title: 'Вхід в акаунт',
      img: '../../../svg/not-danger.svg',
      id: user.id,
    })

    if (!notification) {
      return res.status(400).json({
        message: 'Помилка створення нотифікації',
      })
    }

    return res.status(200).json({
      message: 'Ви увійшли',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.post('/settings-change-email', function (req, res) {
  const { email, password, token, user } = req.body

  if (!email || !password || !token || !user) {
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

    if (String(password) !== newUser.password) {
      return res.status(400).json({
        message: 'Password не вірний',
      })
    }

    newUser.email = email
    sessionUser.user.email = email

    const notification = Notification.create({
      type: 'Warning',
      title: 'Зміна пошти',
      img: '../../../svg/not-danger.svg',
      id: user.id,
    })

    if (!notification) {
      return res.status(400).json({
        message: 'Помилка створення нотифікації',
      })
    }

    return res.status(200).json({
      message: 'Email змінено',
      sessionUser,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ================================================================

router.post(
  '/settings-change-password',
  function (req, res) {
    const { oldPassword, newPassword, token, user } =
      req.body

    if (!oldPassword || !newPassword || !token || !user) {
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

      if (String(oldPassword) !== newUser.password) {
        return res.status(400).json({
          message: 'Password не вірний',
        })
      }

      newUser.password = newPassword

      const notification = Notification.create({
        type: 'Warning',
        title: 'Зміна пароля',
        img: '../../../svg/not-danger.svg',
        id: user.id,
      })

      if (!notification) {
        return res.status(400).json({
          message: 'Помилка створення нотифікації',
        })
      }

      console.log(newUser)

      return res.status(200).json({
        message: 'Пароль змінено',
      })
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      })
    }
  },
)

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
