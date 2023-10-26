import { useEffect } from 'react';
import useRequest from "../../hooks/use-request";

export default () => {

    const {doRequest} = useRequest(
        {
            url: "https://ticketing.dev/api/users/signout", // make request from browser
            method: "get", 
            onSuccessRoute: "/"
        }
    );

    useEffect(() => {
        doRequest();
        // console.log("This will run once for the initial render.");
      }, []);

    return <div>Signing you out...</div>
}