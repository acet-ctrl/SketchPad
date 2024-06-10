class Tool {
    id
    depencencies
    opts

    constructor(id, draw) {
        this.id = id
        this.draw = draw
    }
    apply(){
        this.opts()
    }
    onDeprecating()
}
