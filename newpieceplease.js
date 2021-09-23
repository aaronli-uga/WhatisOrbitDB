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

    async addNewPiece(hash, instrument = 'Piano') {
        // const existingPiece = this.getPieceByHash(hash)
        // if(existingPiece){
        //     await this.updatePieceByHash(hash, instrument)
        //     return
        // }

        const cid = await this.pieces.put({hash, instrument})
        return cid
    }
  
    async _init () {
        this.orbitdb = await this.OrbitDB.createInstance(this.node)
        this.defaultOptions = { accessController: { write: [this.orbitdb.identity.id]}}

        const docStoreOptions = {
            ...this.defaultOptions,
            indexBy: 'hash',
        }

        this.pieces = await this.orbitdb.docstore('pieces', docStoreOptions)
        await this.pieces.load()

        await this.onready();
    }
}


try {
    const Ipfs = require('ipfs')
    const OrbitDB = require('orbit-db')
    module.exports = exports = new NewPiecePlease(Ipfs, OrbitDB)
} catch (e) {
    window.NPP = new NewPiecePlease(window.Ipfs, window.OrbitDB)
}


const NPP = require('./newpieceplease')

NPP.onready = async () => {
    console.log(NPP.pieces.id)
    const cid = await NPP.addNewPiece("QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ")
    const content = await NPP.node.dag.get(cid)
    console.log(content.value.payload)
}

NPP.create()