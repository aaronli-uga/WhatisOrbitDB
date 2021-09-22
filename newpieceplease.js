class NewPiecePlease {
    constructor (Ipfs, OrbitDB) {
      this.OrbitDB = OrbitDB
      this.Ipfs = Ipfs
    }
  
    async create() {
      this.node = await this.Ipfs.create({
        preload: { enabled: false },
        repo: './ipfs',
        EXPERIMENTAL: { pubsub: true },
        config: {
          Bootstrap: [],
          Addresses: { Swarm: [] }
        }
      })
  
      this._init()
    }
  
    async _init () {
      this.orbitdb = await this.OrbitDB.createInstance(this.node)
      this.defaultOptions = { accessController: {
        write: [this.orbitdb.identity.id]
        }
      }
      if(this.onready) this.onready();
    }
}



try {
    const Ipfs = require('ipfs')
    const OrbitDB = require('orbit-db')
    module.exports = exports = new NewPiecePlease(Ipfs, OrbitDB)
} catch (e) {
    window.NPP = new NewPiecePlease(window.Ipfs, window.OrbitDB)
}