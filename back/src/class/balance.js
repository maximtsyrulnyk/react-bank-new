class Balance {
  static #list = []

  constructor(id) {
    this.id = id
    this.sum = 0
  }

  static create = (id) => {
    this.#list.push(new Balance(id))

    console.log(this.#list)
  }

  static delete = (id) => {
    const length = this.#list

    this.#list = this.#list.filter((item) => item.id !== id)

    return length > this.#list.length
  }

  static setData = (id, value) => {
    const obj = this.#list.find((item) => {
      if (item.id === id) {
        item.sum += Number(value)
        console.log(this.#list)
        return true
      }
      return false
    })
  }

  static getData = (id) => {
    const obj = this.#list.find((item) => item.id === id)

    return obj ? obj.sum : 0
  }
}

module.exports = {
  Balance,
}
