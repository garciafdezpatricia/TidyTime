import { useSessionContext } from "@/src/components/Context/SolidContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useInruptHandler } from "../api/inrupt";
import Loader from "@/src/components/Loading/Loading";
import { useTaskContext } from "@/src/components/Context/TaskContext";
import { ScheduleItem, Task } from "@/src/model/Scheme";
import { RxClock } from "react-icons/rx";
import CheckableTaskList, { TasksPreview } from "@/src/components/List/CheckableTaskList";
import { earliestDeadlineFirst, mostDifficultyFirst } from "../../src/algorithms/tidier";
import { Icon } from "../../src/components/Icon/Icon";
import { GiFlatPlatform } from "react-icons/gi";
import { GrFormNext } from "react-icons/gr";

export default function Tidier() {

    const { solidSession } = useSessionContext();
    const { getSession, getTasks } = useInruptHandler();
    const { tasks, listNames } = useTaskContext();

    const [reRender, setRerender] = useState(Math.random());
    const [loading, setLoading] = useState(true);
    const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
    const [availableTime, setAvailableTime] = useState('');
    const [plan, setPlan] = useState<ScheduleItem[]>([]);

    const router = useRouter();

    const checkAuth = async () => {
		if (solidSession === undefined) {
		} else {
			if (!solidSession?.info.isLoggedIn) {
				router.push("/");
			}
		}
	};

    useEffect(() => {
        getSession();
    }, [reRender]);
    
    useEffect(() => {
        checkAuth();
        fetchData();
    }, [solidSession])

    const fetchData = async () => {
        await getTasks();
    }

    const handleTaskCheck = (task: Task) => {
        let index = selectedTasks.findIndex((selectedTask) => selectedTask.id === task.id);
        if (index !== -1) {
            setSelectedTasks(selectedTasks.filter((selectedTask) => selectedTask.id !== task.id))
        } else {
            setSelectedTasks([...selectedTasks, task])
        }
    }

    useEffect(() => {
        if (tasks && listNames) {
            setLoading(false);
        }
    }, [tasks, listNames])

    const handleFromHourChange = (event:any) => {
        const { value } = event.target;
        setAvailableTime(value);
    };

    const handleGeneratePlan = ({ variant = 'dueDate' } : {variant: 'dueDate' | 'difficulty'}) => {
        const [hoursStr, minutesStr] = availableTime.split(':');
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        let result;
        switch (variant) {
            case 'dueDate':
                result = earliestDeadlineFirst(selectedTasks, hours, minutes);
                break;
            case 'difficulty':
                result = mostDifficultyFirst(selectedTasks, hours, minutes)
            default:
                break;
        }
        // @ts-ignore
        setPlan(result);
    }

    return (
        loading ? 
        <Loader />
        :
        <div className="tidier-container">
            <section className="tidier-setup">
                <article className="tidier-header">
                    <h2>What shall get done today...</h2>
                </article>
                <CheckableTaskList selectedTasks={selectedTasks} handleTaskCheck={handleTaskCheck} />
                <section className="available-time">
                    <p>Available time:</p>
                    <div className="from-hour">
                        <div className="input-container">
                            <input type="time" className="input-from" value={availableTime} onChange={handleFromHourChange}/>
                            <RxClock className="clock-from"/>
                        </div>
                    </div>
                </section>
                <TasksPreview selectedTasks={selectedTasks} handleTaskCheck={handleTaskCheck} />
            </section>
            <section className="tidier-plan">
                <section className="tidier-generate">
                    <button onClick={() => handleGeneratePlan({variant: 'dueDate'})}>
                        Prioritize due date 
                        <RxClock />
                    </button>
                    <button onClick={() => handleGeneratePlan({variant: 'difficulty'})}>
                        Prioritize difficulty
                        <Icon src="menu/tidier.svg" alt="Brain icon" />
                    </button>
                </section>
                <section className="plan-result">
                    {
                        plan.map((slot, index) => {
                            return (
                                <article key={index} className="plan-item">
                                    <div className="line"></div>
                                    <p><RxClock /> {slot.hours} : {slot.minutes}</p>
                                    {slot.title}
                                    <div className="circle"></div>
                                </article>
                            )
                        })
                        
                    }
                </section>
            </section>
        </div>
    )
}