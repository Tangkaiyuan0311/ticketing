import "bootstrap/dist/css/bootstrap.css"; // global css
// globally including Bootstrap's styles across all pages in your application.

import buildClient from "../api/build-client";
import { handleAxiosError } from "../api/handle-exios-error";

// a layout component that wraps around all your page components

// Component: the exported component of actual page being rendered.
// pageProps: props that should be passed to the Component
// spread operator {...pageProps} is used to pass down all properties of pageProps as individual props to the Component.
const AppComponent = ({Component, pageProps, currentUser}) => {
    return <div>
        <h1>Header! {currentUser && currentUser.email}</h1>
        < Component {...pageProps} />
    </div>;
};

// get information about current user
// can be passed down to child component 

AppComponent.getInitialProps = async (appContext) => {
    // console.log(appContext);
    const configuredAxios = buildClient(appContext.ctx);
    let data;
    try {
        ({ data } = await configuredAxios.get("/api/users/currentuser"));
    } catch (error) {
        handleAxiosError(error);
    }

    // call the getInitialProps of child component
    // a problem of next itself
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx); // will not invoked in the child component automatically
    }

    return {
        pageProps, 
        currentUser: data.currentUser
    };

};

export default AppComponent;



