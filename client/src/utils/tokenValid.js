import jwt_decode from "jwt-decode";

export default function tokenValid(accessToken) {
    if(accessToken) {
        const token = accessToken && accessToken.split(' ')[1];

        const decodedToken = jwt_decode(token);
        const now = Date.now() / 1000;
        return now < (decodedToken.exp - 2);
    } else {
        return false;
    }

}