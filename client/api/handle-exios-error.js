// console log error message
// return error status code or undefined

export const handleAxiosError = (errs) => {
    if (errs.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Error Status Code:', errs.response.status);
        console.log('Error Response:', errs.response.data);
        return errs.response.status;
    } else if (errs.resquest) {
        // The request was made but no response was received
        console.log('Error Request: ', errs.request);
    }
    else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error in the requet setting: ', errs.message);
    }
};