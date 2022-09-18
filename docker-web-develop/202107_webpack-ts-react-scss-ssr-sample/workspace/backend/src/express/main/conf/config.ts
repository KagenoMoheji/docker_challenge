interface Config {
    IS_PROD: boolean;
    PORT: number;
    HTTPS_PROXY_DEV?: string;
    HTTPS_PROXY_PROD?: string;
}
const config: Config = {
    IS_PROD: false,
    PORT: 8760,
    // HTTPS_PROXY_DEV: "",
    // HTTPS_PROXY_PROD: "",
};
export default config;
