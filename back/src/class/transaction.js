class Transaction {
  static #list = []

  static #count = 1

  constructor({ id, email, type, sum, title, img }) {
    this.id = Transaction.#count++

    this.email = String(email).toLowerCase()
    this.type = type
    this.sum = Number(sum)
    this.title = title
    this.img = img
    this.user_id = id

    this.date = new Date().getTime()
  }

  static create(data) {
    const transaction = new Transaction(data)

    this.#list.push(transaction)

    console.log(this.#list)

    return transaction ? true : false
  }

  static getById(id) {
    return (
      this.#list.find(
        (transaction) => transaction.id === Number(id),
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
  Transaction,
}
