interface TagScore {
  tag: number,
  score: number
}

interface User {
  address: string,
  score: TagScore[]
}

class Mina {
  private users: User[]

  constructor() {}

  calculateScore(address: string, score: TagScore[]) {
    const isIn = this.users.findIndex((v) => {
      return v.address === address
    })

    if (isIn !== -1) {
      // add
      this.users.push({address, score})
      return
    }

    this.users[isIn].score = [...score]
  }

  getUser(address: string) {
    return this.users.find((v) => {
      return v.address === address
    })
  }
}
