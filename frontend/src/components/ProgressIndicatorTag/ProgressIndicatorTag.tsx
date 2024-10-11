import { Circle } from "@mui/icons-material";
import { Card, Typography } from "@mui/material";
import ProgressIndicatorTagStyles from "./styles/ProgressIndicatorTag.module.css";

export default function ProgressIndicatorTag(props: ProgressIndicatorTagProps) {
    let color: string = '#202020'
    
    switch (props.progressType) {
        case 'Terminado':
            color = '#10eb3c'
            break;
        case 'Pendiente':
            color = '#eb7610'
            break;
        case 'Recibido':
            color = '#6810eb'
            break;
    }
    
    return <Card className={ProgressIndicatorTagStyles.SurroundingBox}>
        <Circle className={ProgressIndicatorTagStyles.circle} sx={{color: color}}/>
        <Typography variant="caption" width="100%">
            {props.progressType} 
        </Typography>
    </Card>
}

interface ProgressIndicatorTagProps {
    progressType: 'Terminado' | 'Pendiente' | 'Recibido';
}