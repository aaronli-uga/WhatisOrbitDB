const NPP = require('./newpieceplease')

NPP.onready = async () => {
    console.log(NPP.pieces.id)
    const cid = await NPP.addNewPiece("QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ")
    console.log("cid:", cid)
    const content = NPP.node.dag.get(cid)
    console.log(content.value.payload)
 }
 
NPP.create()