import axios, { AxiosInstance } from "axios";
import parse from 'node-html-parser'

class WebScrapper {
    private instance?: AxiosInstance;
    constructor(path: string) {
        this.instance = axios.create({
            baseURL: path,
        });
    }

    async getHTML() {
        const response = await this.instance?.get("/");
        return parse(response?.data);
    }

    async getHTMLFromPath(path: string) {
        const response = await this.instance?.get(path);
        return parse(response?.data);
    }

    async getHTMLFromPathWithParams(path: string, params: any) {
        const response = await this.instance?.get(path, { params });
        return parse(response?.data);
    }

    async getHTMLFromPathWithHeaders(path: string, headers: any) {
        const response = await this.instance?.get(path, { headers });
        return parse(response?.data);
    }

    async getHTMLFromPathWithParamsAndHeaders(path: string, params: any, headers: any) {
        const response = await this.instance?.get(path, { params, headers });
        return parse(response?.data);
    }
}

export default WebScrapper;
