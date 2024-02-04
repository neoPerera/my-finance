import { Navigate } from "react-router-dom";
function LogOut() {

    console.log("Logged Out");
    
    // Read JWT token from storage
    localStorage.removeItem('jwt_token');

    return(<Navigate to="/login" />);
}

export default LogOut;
