import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { dto } from "../../../wailsjs/go/models";
import ProjectEndpoints from "../../api/ProjectEndpoints";
import { useUserStore } from "../../store/useUserStore";
import { Card, CircularProgress, Typography } from "@mui/material";
import { ArrowBack, ArrowBackIosNew, ArrowBackOutlined, ArrowBackSharp, BackHand, Circle, DoorBackTwoTone, FlipToBack } from "@mui/icons-material";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import ProgressIndicatorTag from "../../components/ProgressIndicatorTag/ProgressIndicatorTag";
import ProjectHeader from "./components/ProjectHeader";
import ContentLayout from "./components/ContentLayout";

export default function Project() {
    const [ loading, setLoading ] = useState(true);
    const [ project, setProject ] = useState<dto.UserProjectDtoOut | null>(null);
    const { user } = useUserStore();
    const { id } = useParams<{id: string}>()

    const projectEndpoints = new ProjectEndpoints();

    useEffect(() => {
        if (!user) {
            return;
        }

        projectEndpoints.GetProjectWithUser(parseInt(id!))
            .then(project => {
                setProject(project);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
            })
    }, []);

    if (loading) {
        return <LoadingScreen message="Cargando la información..."/>
    }

    return (
        <div style={pageStyle} className="emergable">
            <ProjectHeader title={project!.name} isEnded={false}/>
            {
                project?
                    <ContentLayout project={project}/>
                :
                    <h1>No se encontró el proyecto</h1>
            }
        </div>
    )
}

const pageStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    width: '100%',
    height: '100%'
}