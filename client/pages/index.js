import buildClient from "../api/build-client";
import handleExiosError from "../api/handle-exios-error";

const LandingPage = ({ currentUser }) => {
    // console.log("I am in the component");
    // console.log("current user: ", currentUser);
    return currentUser ? <h1>You are signed in</h1> : <h1>You are not signed in</h1>;
}


// context only defined in SSR
// contain info of the request from browser
LandingPage.getInitialProps = async (context) => {
    const isServer = (typeof window === 'undefined') ? true : false;

    if (isServer) {
        console.log("I am on the server side"); 
    }
    else {
        console.log("I am on the browser side");
    }
    
    const route = '/api/users/currentuser';

    let data = null;
    try {
        // configuredAxios differentiate whether in browser or in server
        const configuredAxios = buildClient(context);
        ({ data } = await configuredAxios.get(route));   
        console.log("current user: ", data.currentUser);
    } catch (errs) {
        handleExiosError(errs);
    }

    return data; // not null
    
}

export default LandingPage;