import { ArrowBackIosNew } from "@mui/icons-material"
import ProjectStyles from "../styles/Project.module.css"
import ProgressIndicatorTag from "../../../components/ProgressIndicatorTag/ProgressIndicatorTag"
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";

export default function ProjectHeader(props: ProjectHeaderProps) {
    
    return <div className={ProjectStyles.header}>
        <IconButton sx={{aspectRatio: '1/ 1', margin: '12px'}}>
            <Link to="/projects" className={ProjectStyles.link}>
                <ArrowBackIosNew sx={{justifySelf: 'initial'}}/>
            </Link>
        </IconButton>
        <h3>{props.title}</h3>
        {/* <ProgressIndicatorTag progressType="Recibido"/>  */}
    </div>
} 

interface ProjectHeaderProps {
    title: string;
    isEnded: boolean;
}