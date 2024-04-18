import { Icon } from "../Icon/Icon";
import { useGithubHandler } from "@/pages/api/github";
import { useGithubContext } from "../Context/GithubContext";

export default function GitHubAuthButton() {

  const { getUserData, loginWithGithub, logoutGithub } = useGithubHandler();
  const { githubLoggedIn, userData } = useGithubContext();

  const handleLogin = async () => {
    try {
      await loginWithGithub();
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogout = async () => {
    try {
      await logoutGithub();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    !githubLoggedIn 
    ?
    <button 
        className="auth-button"
        onClick={handleLogin}>
            <Icon className="btn-icon" src="./github.svg" alt="" />
        Connect with Github
    </button>
    : 
      <button 
        className="auth-button"
        onClick={handleLogout}>
            <Icon className="btn-icon" src="./github.svg" alt="" />
        Logout
      </button>
  )
}