// Copyright 2024 Patricia García Fernández.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Icon } from "../Icon/Icon";
import { useGithubHandler } from "@/pages/api/github";
import { useGithubContext } from "../Context/GithubContext";
import { useTranslation } from "react-i18next";

export default function GitHubAuthButton() {
  const { t } = useTranslation();
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
        {t('list.github')}
    </button>
    : 
      <button 
        className="auth-button"
        onClick={handleLogout}>
            <Icon className="btn-icon" src="./github.svg" alt="" />
        {t('home.logoutButton')}
      </button>
  )
}