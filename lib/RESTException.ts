export class RESTException extends Error {
    constructor(
        public readonly httpStatusCode: number,
        public readonly httpStatusMessage: string,
        public readonly serverMessage: string = "",
    ) {
        super(`${httpStatusCode} - ${httpStatusMessage} - ${serverMessage}`);
    }
}
