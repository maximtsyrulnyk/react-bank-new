class Notification {
  static #list = []

  static #count = 1

  constructor({ id, type, title, img }) {
    this.id = Notification.#count++

    this.type = type
    this.title = title
    this.img = img

    this.user_id = id

    this.date = new Date().getTime()
  }

  static create(data) {
    const notification = new Notification(data)

    this.#list.push(notification)

    console.log(this.#list)

    return notification ? true : false
  }

  static getById(id) {
    return (
      this.#list.find(
        (notification) => notification.id === Number(id),
      ) || null
    )
  }

  static getList = (id) => {
    const list = this.#list.filter(
      (item) => item.user_id === Number(id),
    )

    return list
  }
}

module.exports = {
  Notification,
}
