import EditTaskModal from "@/src/components/Modal/EditModal/EditTaskModal";
import NewTaskForm from "../../src/components/Form/NewTaskForm/NewTaskForm";
import SearchBar from "../../src/components/SearchBar/SearchBar";
import Tab from "../../src/components/Tabs/Tab";
import { useEffect, useState } from "react";
import { useTaskContext } from "@/src/components/Context/TaskContext";
import GitHubAuthButton from "@/src/components/Auth/GitHubAuth";
import { useGithubHandler } from "../api/github";
import toast from "react-hot-toast";
import { useGithubContext } from "@/src/components/Context/GithubContext";
import { Task, TaskList } from "@/src/model/Scheme";

export default function List() {
	const [reRender, setRerender] = useState(Math.random());
	const [isEditingTaskModalOpen, setIsEditingTaskModalOpen] = useState(false);
	const [isSyncingIssues, setIsSyncingIssues] = useState(false);

	const {setSelectedTaskIndex, listNames, setListNames, tasks, setTasks} = useTaskContext();
	const { getUserData, getIssuesOfUser } = useGithubHandler();
	const { githubLoggedIn, userData } = useGithubContext();

	useEffect(() => {
		try {
			getUserData();
		} catch (error:any) {
			if (error.message === "Failed to fetch") {
				toast.error("Error when connecting to the server");
			} else {
				if (error.message.includes('access not found') && githubLoggedIn) {
					toast.error("Please reconnect to GitHub");
				}
			}
		}
	}, [reRender])
	
	/**
	 * Sets the selected task index to the index of the task being selected. Opens/closes edit modal
	 * @param index contains the task index
	 */
	const handleEditModal = (index:number) => {
		setSelectedTaskIndex(index);
		setIsEditingTaskModalOpen(true);
	}

	const syncIssues = async () => {
		if (userData.login !== null) {
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
					// if there's no task list created for this list, add it
					const listIndex = lists.indexOf(repo);
					if (!tasklists[listIndex]) {
						tasklists[listIndex] = [];
					}
					const task:Task = {
						title: issue.title,
						desc: issue.body,
						done: false,
						githubHtml: issue.html_url,
						githubUrl: issue.url,
						listIndex: listIndex
					};
					tasklists[listIndex].push(task); 
				});
				setListNames(lists);
				setTasks(tasklists);
			}
			setIsSyncingIssues(false);
		}
	}

	return (
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
					className="import-button">
						{isSyncingIssues && <div className="loader"></div>}
						Sync issues
				</button>
				<NewTaskForm />
			</div>
			{
				isEditingTaskModalOpen && (
					<EditTaskModal 
						isOpen={isEditingTaskModalOpen} 
						onClose={() => setIsEditingTaskModalOpen(false)}
					/>
				)
			}
		</div>
	);
}
