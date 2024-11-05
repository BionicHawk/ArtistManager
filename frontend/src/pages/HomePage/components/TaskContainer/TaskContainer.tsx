import { Task } from "../../../../api/TaskEndpoints";
import TaskChip from "../TaskChip/TaskChip";
import Styles from "./TaskContainer.module.css";

export default function TaskContainer(props: { tasks: Task[] }) {
    return <div className={Styles.tasksContainer}>
        {
            props.tasks.length > 0 ?

                props.tasks.map(t => (
                    <TaskChip key={t.id} task={t}></TaskChip>
                ))

                :

                <p>No se han encontrado tareas recientes</p>
        }
    </div>;
}