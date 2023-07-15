import axios from "axios"

export default function OauthButton() {
    const loginWithRedirect = async () => {
        const hello = await axios.get('http://localhost:4242/login')
        alert(hello.data);
    }
    
    return (
        <button onClick={loginWithRedirect}>Login</button>
    )
}