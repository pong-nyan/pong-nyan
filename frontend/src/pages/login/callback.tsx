import axios from "axios";
import { useRouter } from "next/router";

export default function LoginCallback() {
    const router = useRouter();
    const code = router.query.code;
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/login/token?code=${code}`);
    const result = axios.get(`${process.env.NEXT_PUBLIC_API_URL}/login/token?code=${code}`)
    console.log(result)
    return (
        <div>
            Login Callback
        </div>
    )
}