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

    // This will run once after the initial render
    useEffect(() => {
        doRequest();
      }, []);

    return <div>Signing you out...</div>
}