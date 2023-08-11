import OauthButton from './OauthButton'
import styles from '../../styles/Login.module.css'

export default function Login() {
  return (
    <>
      <div className={styles.loginContainer}>
        <h1>Login</h1>
        <OauthButton />
      </div>
    </>
  )
}