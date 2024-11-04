import { Task } from "../../../../api/TaskEndpoints";
import Styles from "./TaskChip.module.css";

export default function TaskChip(props: { task: Task }) {
    return <div className={Styles.chip}>
        <div className={Styles.mainInfo}>
            <div className={Styles.taskName}>{props.task.activityName}</div>
            <div className={Styles.progressIndicator}>{ props.task.status === 'done' ? 'Terminado' : 'Pendiente' }</div>

        </div>
        <div className={Styles.detail}>Del proyecto "{props.task.project}" creado el {props.task.createdAt.toLocaleDateString()}</div>
    </div>;
}