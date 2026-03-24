//const env = process.env
const env = import.meta.env

const url = new URL(window.location.href)

export default Object.freeze({
    API_DOC: env.VUE_APP_API_DOC,
    DOMAIN_HOST_TEMPLATE: env.VUE_APP_DOMAIN_HOST_TEMPLATE,
    API_HOST: env.VUE_APP_API_HOST,
    API_ROOT: env.VUE_APP_API_ROOT,
    API_PUBLIC_ROOT: env.VUE_APP_API_PUBLIC_ROOT,
    PROJECT_NAME: env.VUE_APP_PROJECT_NAME,
    PROJECT_INDEX: env.VUE_APP_PROJECT_INDEX,
    ID_TOKEN_COOKIE_DOMAIN: env.VUE_APP_ID_TOKEN_COOKIE_DOMAIN,
    URL: url,
    HOST: url.host,
    SUBDOMAIN: url.host.split('.')[0],
    DEFAULT_LANG: 'en',
})
