import EditTaskModal from "@/src/components/Modal/EditModal/EditTaskModal";
import NewTaskForm from "../../src/components/Form/NewTaskForm/NewTaskForm";
import SearchBar from "../../src/components/SearchBar/SearchBar";
import Tab from "../../src/components/Tabs/Tab";
import { useCallback, useEffect, useState } from "react";
import { useTaskContext } from "@/src/components/Context/TaskContext";
import GitHubAuthButton from "@/src/components/Auth/GitHubAuth";
import { useGithubHandler } from "../api/github";
import toast from "react-hot-toast";
import { useGithubContext } from "@/src/components/Context/GithubContext";
import { Task } from "@/src/model/Scheme";
import { useSessionContext } from "@/src/components/Context/SolidContext";
import { useRouter } from "next/router";
import { useInruptHandler } from "../api/inrupt";
import Loader from "@/src/components/Loading/Loading";
import { useTranslation } from "react-i18next";
import { uuid } from "uuidv4";

export default function List() {
	const { t } = useTranslation();
	const [reRender, setRerender] = useState(Math.random());
	const [firstRender, setFirstRender] = useState(true);
	const [isEditingTaskModalOpen, setIsEditingTaskModalOpen] = useState(false);
	const [isSyncingIssues, setIsSyncingIssues] = useState(false);
	const [loading, setLoading] = useState(false);

	const {setSelectedTaskId, listNames, setListNames, tasks, setTasks, selectedListId, setSelectedListId } = useTaskContext();
	const { getUserData, getIssuesOfUser } = useGithubHandler();
	const { githubLoggedIn, userData } = useGithubContext();
	const { solidSession } = useSessionContext();
	const { getSession, getLabels, getTasks, updateListNames, createTask } = useInruptHandler();
	const router = useRouter();

	const getSessionWrapper = async () => {
		await getSession();
	}

	useEffect(() => {
		getSessionWrapper();
	}, [reRender])

	useEffect(() => {
		checkAuth();
		if (solidSession?.info.isLoggedIn && firstRender) {
			fetchData();
			setFirstRender(false);
		}
	}, [solidSession])

	useEffect(() => {
		if (listNames && listNames.length > 0 && selectedListId === '' && tasks && tasks.length > 0 && tasks[0]) {
			setSelectedListId(tasks[0].key);
		}
	}, [listNames, tasks])

	useEffect(() => {
		if (listNames !== undefined) {
			setLoading(false);
		}
	}, [listNames])

	const checkAuth = async () => {
		if (solidSession === undefined) {
		} else {
			if (!solidSession?.info.isLoggedIn) {
				router.push("/");
			}
		}
	};

	const fetchData = async () => {
		setLoading(true);
		try {
			if (!userData) {
				await getUserData();
			}
		} catch (error:any) {
			if (error.message === "Failed to fetch") {
				toast.error(t('toast.serverError'));
			} else {
				if (error.message.includes('access not found') && githubLoggedIn) {
					toast.error(t('toast.reconnectGitHub'));
				}
			}
		}
		await getLabels();
		await getTasks();
	};
	
	/**
	 * Sets the selected task index to the index of the task being selected. Opens/closes edit modal
	 * @param index contains the task index
	 */
	const handleEditModal = (id:string) => {
		setSelectedTaskId(id);
		setIsEditingTaskModalOpen(true);
	}

	const syncIssues = async () => {
		if (userData.login !== null && listNames && tasks) {
			setIsSyncingIssues(true);
			const issues = await getIssuesOfUser(userData.login);
			if (issues.items && issues.items.length > 0) {
				// create copy of the task list names and the task lists.
				let lists = [...listNames];
				let tasklists = [...tasks];
				for (let index = 0; index < issues.items.length; index++) {
					const issue = issues.items[index];
					const repo = issue.repository_url.substring(issue.repository_url.lastIndexOf("/") + 1);
				
					if (!lists.includes(repo)) {
						lists = [...lists, repo];
					}
				
					const listIndex = lists.indexOf(repo);
				
					if (!tasklists[listIndex]) {
						tasklists[listIndex] = {key: uuid(), value: []};
						await updateListNames(lists, tasklists);
					}

					const repeatedIssue = tasklists[listIndex].value.some((task) => 
						task.githubHtml !== undefined 
						&& task.githubHtml === issue.html_url
						&& task.title === issue.title
					);
					if (!repeatedIssue) {
						const task:Task = {
							id: uuid(),
							title: issue.title,
							desc: issue.body,
							done: false,
							githubHtml: issue.html_url,
							githubUrl: issue.url,
							listIndex: tasklists[listIndex].key,
							status: 0,
						};
						await createTask(task);
						tasklists[listIndex].value.push(task); 
					}
				}				
				setListNames(lists);
				setTasks(tasklists);
			}
			setIsSyncingIssues(false);
		}
	}

	return (
		loading ?
		<Loader />
		:
		(
			solidSession?.info.isLoggedIn &&
			<div className='list-container'>
				<div className="list-header-section">
					<SearchBar />
					<GitHubAuthButton />
				</div>
				<Tab handleEditModal={handleEditModal}></Tab>
				<div className="list-footer-section">
					<button 
						title={t('list.syncIssuesTitle')}
						onClick={syncIssues}
						disabled={githubLoggedIn ? false : true}
						className="import-button">
							{isSyncingIssues && <div className="loader"></div>}
							{t('list.syncIssues')}
					</button>
					{tasks && tasks.length > 0 && <NewTaskForm />}
				</div>
				{isEditingTaskModalOpen && 
					<EditTaskModal 
						isOpen={isEditingTaskModalOpen} 
						onClose={() => setIsEditingTaskModalOpen(false)}
					/>
				}
			</div>
		)
	);
}
