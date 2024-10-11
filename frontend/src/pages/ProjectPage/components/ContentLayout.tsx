import { Typography } from "@mui/material";
import ProjectStyles from "../styles/Project.module.css";
import { dto } from "../../../../wailsjs/go/models";
import ProgressIndicatorTag from "../../../components/ProgressIndicatorTag/ProgressIndicatorTag";

export default function ContentLayout(props: ContentLayoutProps) {
    
    return <div className={ProjectStyles.contentLayout}>
        <div>
            <StatusBar project={props.project}/>
            <Typography variant="h6" textAlign="start">
                Descripción
            </Typography>
            <Typography variant="body1" textAlign="start">
                {props.project.description}
            </Typography>
        </div>
    </div>
}

function StatusBar(props: ContentLayoutProps) {

    const createdAt = new Date(props.project.createdAt);
    const endetAt = new Date(props.project.endedAt);

    console.log(endetAt)

    return <div className={ProjectStyles.statusbar}>
        <Typography variant="caption" textAlign="start">
            Fecha de inicio: {createdAt.toLocaleString()}
        </Typography>
        <ProgressIndicatorTag progressType={endetAt.getFullYear() !== 0 ? "Terminado" : "Pendiente"} />
    </div>
}

interface ContentLayoutProps {
    project: dto.UserProjectDtoOut;
}