import { useState } from "react";
import axios from "axios";
import Router from 'next/router';
import { handleAxiosError } from "../api/handle-exios-error";

// a hook is just a function with inputs, maintains states, and export some function and variables
// handling making http request through axios
// hooks can only be used in components

// make request from the browser
export default ({url, method, body, onSuccessRoute}) => {
    const [errors, setErrors] = useState(null); // rendered error responses
    
    const doRequest = async () => {
        try {
            setErrors(null); // reset error rendering for each request
            const response = await axios[method](url, body); // dynamic invocation & dynamic property accessor
            if (onSuccessRoute) {
                Router.push(onSuccessRoute);
            }
            return response.data;
        } catch (errs) {
            const errorCode = handleAxiosError(errs);
            // if error is related to request data
            if (errorCode != 404) {
                setErrors(
                    <div className="alert alert-danger">
                        <h4>Ooops...</h4>
                        <ul className="my-0"> {/* CustomError structure & error handler in auth */}
                            {errs.response.data.errors.map(error => (
                                <li key={error.message}>{error.message}</li>
                            ))}
                        </ul>
                    </div>
                );
            }
        }
    }

    return {doRequest, errors};
}