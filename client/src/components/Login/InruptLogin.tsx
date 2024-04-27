import { useInruptHandler } from "@/pages/api/inrupt";
import { useSessionContext } from "../Context/SolidContext";
export default function Inrupt() {

    const { loginInrupt } = useInruptHandler();
    const { solidSession } = useSessionContext();

    return (
        <section className="inrupt-container">
        {
            !solidSession?.info.isLoggedIn && 
            <article className="inrupt-login">
                <section className="inrupt-login-header">
                    <div className="inrupt-logo"></div>
                </section>
                <section className="inrupt-login-body">
                    <h2>Welcome to TidyTime!</h2>
                    <p>TidyTime works with Solid pods, ensuring no user data is stored. Log in to your Inrupt Solid pod to start using the app.</p>
                    <button onClick={loginInrupt}>LOGIN</button>
                </section>
                <section className="inrupt-login-footer">
                    <p>Learn more about <a href="https://www.inrupt.com/products/enterprise-solid-server">Inrupt&apos;s Enterpise Solid Server</a>
                    <br />Learn more about the <a href="https://solidproject.org/">Solid Project</a>
                    </p>
                </section>
            </article>
        }
        </section>
    )
}