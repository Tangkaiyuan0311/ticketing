import { useState } from "react";
import useRequest from "../../hooks/use-request";


export default () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const navigate = useNavigate();
    //const [errors, setErrors] = useState([]); // an array of error objects
    const {doRequest, errors} = useRequest(
        {
            url: "https://ticketing.dev/api/users/signup", // make request from browser
            method: "post", 
            body: {
                email,
                password
            },
            onSuccessRoute: "/"
        }
    );

    const onSubmit = async (event) => {
        event.preventDefault(); // prevent the default form submission behavior: reload the page.

        // go through ingress server to reach auth service
        await doRequest();
    }

    return <form onSubmit={onSubmit}>
        <h1> Sign up </h1>
        <div className="form-group">
            <label> Email Address </label>
            <input
                value={email}
                onChange={ e => setEmail(e.target.value) } 
                className="form-control">
            </input>
        </div>
        <div className="form-group">
            <label> password </label>
            <input
                value={password}
                onChange={ e => setPassword(e.target.value) }
                type="password" className="form-control">
            </input>
        </div>
        { errors }
        <button className="btn btn-primary"> Sign up </button>
    </form>;
};