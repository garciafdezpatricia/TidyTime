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

export default function List() {
	const [reRender, setRerender] = useState(Math.random());
	const [firstRender, setFirstRender] = useState(true);
	const [isEditingTaskModalOpen, setIsEditingTaskModalOpen] = useState(false);
	const [isSyncingIssues, setIsSyncingIssues] = useState(false);
	const [loading, setLoading] = useState(false);

	const {setSelectedTaskId, listNames, setListNames, tasks, setTasks, selectedListId, setSelectedListId } = useTaskContext();
	const { getUserData, getIssuesOfUser } = useGithubHandler();
	const { githubLoggedIn, userData } = useGithubContext();
	const { solidSession } = useSessionContext();
	const { getSession, getLabels, getTasks } = useInruptHandler();
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
				toast.error("Error when connecting to the server");
			} else {
				if (error.message.includes('access not found') && githubLoggedIn) {
					toast.error("Please reconnect to GitHub");
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
				issues.items.map((issue:any, index:number) => {
					// get the repo of the issue (new task list name)
					const repo = issue.repository_url.substring(issue.repository_url.lastIndexOf("/") + 1);
					// if the list names doesn't contain the repo, add it
					if (!lists.includes(repo)) {
						lists = [...lists, repo];
					}
					// TODO:
					// if there's no task list created for this list, add it
					const listIndex = lists.indexOf(repo);
					if (!tasklists[listIndex]) {
						// TODO: update GH with new tasklist schema
						// @ts-ignore
						tasklists[listIndex] = [];
					}
					const task:Task = {
						title: issue.title,
						desc: issue.body,
						done: false,
						githubHtml: issue.html_url,
						githubUrl: issue.url,
						// @ts-ignore
						listIndex: listIndex,
						status: 0,
					};
					// @ts-ignore
					tasklists[listIndex].push(task); 
				});
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
						title="Connect to GitHub and sync your issues" 
						onClick={syncIssues}
						disabled={githubLoggedIn ? false : true}
						className="import-button">
							{isSyncingIssues && <div className="loader"></div>}
							Sync issues
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
