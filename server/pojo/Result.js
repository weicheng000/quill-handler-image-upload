class Result {
    constructor(code, msg, data){
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

    static success(data){
        return new Result(1, "success", data);
    }

    static error(msg){
        return new Result(0, msg, null);
    }
}

module.exports = Result;