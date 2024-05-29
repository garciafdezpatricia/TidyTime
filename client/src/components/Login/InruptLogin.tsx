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
                    <p>TidyTime works with Solid PODs, ensuring your data is only controlled by you. Log in to your Inrupt Solid POD and start using the app!</p>
                    <button onClick={loginInrupt}>LOGIN</button>
                </section>
                <section className="inrupt-login-footer">
                    <p>Learn more about <a href="https://www.inrupt.com/products/enterprise-solid-server">Inrupt&apos;s ESS</a>
                    <br />Learn more about the <a href="https://solidproject.org/">Solid Project</a>
                    </p>
                </section>
            </article>
        }
        </section>
    )
}