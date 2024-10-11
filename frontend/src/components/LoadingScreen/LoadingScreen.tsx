import { CircularProgress, Typography } from "@mui/material"
import LoadingScreenStyles from "./styles/LoadingScreen.module.css";

export default function LoadingScreen(props: LoadingScreenProps) {

    return <div className={LoadingScreenStyles.screen}>
        <CircularProgress/>
        <Typography variant="body2"
            sx={{marginTop: '16px'}}>
            { props.message ?? 'Cargando...' }
        </Typography>
    </div>
}

interface LoadingScreenProps {
    message?: string;
}