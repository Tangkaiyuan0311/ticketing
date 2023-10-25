import axios from "axios";

// build a pre-configured axios based on the environment the request is being made
export default (context) => {
    const isServer = (typeof window === 'undefined') ? true : false;
    if (isServer) {
        return axios.create(
            {
                // if server side rendering, for client pod, it can only access auth through cluserIP or ingress-nginx
                baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
                // get the request header: set Host, cookies, ....
                headers: context.req.headers
            }
        )
    }
    else {
        // we must be on the browser
        return axios.create(
            {
                baseURL: '/',
            }
        )
    }
}
