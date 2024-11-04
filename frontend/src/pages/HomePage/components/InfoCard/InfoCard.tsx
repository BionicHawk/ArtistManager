import { Typography } from "@mui/material";
import Styles from "./InfoCard.module.css";

export default function InfoCard(props: {label: string, children?: React.ReactNode}) {
	return <div className={Styles.NavCard}>
		<Typography variant="h6">
            {props.label}
        </Typography>
		<div>
			{props.children}
		</div>
	</div>;
};