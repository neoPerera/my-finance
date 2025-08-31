import axios from 'axios';
import Swal from "sweetalert2";

const Authenticate = async () => {
    console.log("Auth function running");


    // Read JWT token from storage
    const jwtToken = localStorage.getItem('jwt_token');

    try {
        console.log("Checking token validity");
        const response = await axios.get(`${window.env?.REACT_APP_API_URL}api/main/user/validatejwt`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`, // Include the token in the Authorization header
            },
        });

        // Assuming the server returns a boolean indicating JWT validity
        //console.log(response);
        return response.data.isValid; // Return true if valid, false otherwise
    } catch (error) {
        //console.error('Error during Axios request:', error);
        // Swal.fire({
        //     icon: "error",
        //     title: "Oops...",
        //     text: "Something went wrong!",
        //     footer: '<p>Please Log in</p>',
        //   });
        localStorage.removeItem('jwt_token');
        return false; // Return false in case of an error or invalid JWT
    }
};

export default Authenticate;
