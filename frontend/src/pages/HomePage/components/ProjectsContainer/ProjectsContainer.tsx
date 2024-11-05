import { models } from "../../../../../wailsjs/go/models";
import ProjectChip from "../ProjectChip/ProjectChip";
import Styles from "./ProjectsContainer.module.css";

export default function ProjectsContainer(props: { projects: models.Project[] }) {
    return <div className={Styles.projectsContainer}>
        {
            props.projects.length > 0 ?

                props.projects.map(p => (
                    <ProjectChip key={p.id} project={p}></ProjectChip>
                ))

                :

                <p>No se han encontrado proyectos abiertos</p>
        }
    </div>;
}