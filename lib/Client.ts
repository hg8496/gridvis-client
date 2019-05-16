import axios, {AxiosInstance} from "axios";

export interface Configuration {
    url: string;
    username?: string;
    password?: string;
}

export class GridVisClient {

    private _client: AxiosInstance;
    constructor(configuration: Configuration) {
        this._client = axios.create({
            auth: {
                password: configuration.password || "Janitza",
                username: configuration.username || "admin",
            },
            baseURL: configuration.url,
        });
    }

    async fetchGridVisVersion() {
        let result = "";
        try {
            const answer = await this._client.get('/rest/common/info/version/full');
            result = answer.data.value;
        } catch (e) {
            console.log(e);
        }
        return result;
    }
}