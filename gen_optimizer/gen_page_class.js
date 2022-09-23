class GenPageClass {
    constructor(pageClass) {
        this.pageClass = pageClass
    }

    static new (...arg) {
        return new this(...arg)
    }

    name() {
        return this.pageClass
    }
    
    sel() {
        return "." + this.pageClass
    }
}