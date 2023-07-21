import { useRouter } from "next/router";

export default function OauthButton() {
    const router = useRouter();
    const loginWithRedirect = () => {
        const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
        const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI;
        router.push(
            `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`
        )
    }

    return (
        <button onClick={loginWithRedirect}>Login</button>
    )
}