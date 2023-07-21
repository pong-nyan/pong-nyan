import { useRouter } from "next/router";

export default function OauthButton() {
    const router = useRouter();
    const loginWithRedirect = () => {
        const client_id = 'u-s4t2ud-0d6406d8666aa6e706225422720dc5b37bc3f0aadc6e808d1cae0369b1893629';
        const redirect_uri = 'http://localhost:3000/login';
        const secret_key = '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';
        router.push(
            `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`
        )
    }

    return (
        <button onClick={loginWithRedirect}>Login</button>
    )
}