export class RESTException extends Error {
    constructor(public httpStatusCode: number, public httpStatusMessage: string) {
        super(`${httpStatusCode} - ${httpStatusMessage}`);
    }
}
