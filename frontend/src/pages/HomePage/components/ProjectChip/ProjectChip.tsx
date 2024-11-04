import { useEffect, useState } from "react";
import { dto, models } from "../../../../../wailsjs/go/models";
import Styles from "./ProjectChip.module.css";
import UserEndpoints from "../../../../api/UserEndpoints";

export default function ProjectChip(props: {project: models.Project}) {
    const createdAt = new Date(props.project.createdAt);
    const [projectUser, serProjectUser] = useState<dto.UserDtoOut | null>();
    const userController = new UserEndpoints();

    useEffect(() => {
        userController.GetUser(props.project.userId)
            .then(user => {
                serProjectUser(user);
            })
            .catch(err => {
                console.error('Error getting user:', err);
            })
    })
    
    return <div className={Styles.chip}>
        <div className={Styles.mainInfo}>
            <div className={Styles.projectName}>{ props.project.name }</div>
            <div className={Styles.progressIndicator}>Progreso: { props.project.advancement }%</div>
        </div>
        <div>Asignado a {projectUser?.name ?? ''} el {createdAt.toLocaleDateString()}</div>
    </div>
}