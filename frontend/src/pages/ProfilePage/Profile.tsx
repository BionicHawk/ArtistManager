import { Box, Fab, TextField, Typography } from "@mui/material";
import { dto } from "../../../wailsjs/go/models";
import { useUserStore } from "../../store"
import ProfileStyles from "./styles/Profile.module.css";
import { Edit, EmailRounded } from "@mui/icons-material";
import { GetImage } from "./functions/files";
import UserEndpoints from "../../api/UserEndpoints";
import AssetImage from "../../components/AssetImage/AssetImage";

export const Profile = () => {
	const { user, setUser } = useUserStore();
	
	return (
		<div className="emergable">	
			<MainContent user={user!} onUpdate={setUser}/>
			<div>
				<Box sx={{display: 'flex', alignItems: 'center', gap: '8px'}}>
					<EmailRounded></EmailRounded>
					<TextField 
						variant="standard" 
						type="email"
						autoComplete="email"
						sx={{width: 300}}
						value={user?.email ?? ""}>

					</TextField>
				</Box>
			</div> 
		</div>
	)
}

function MainContent(props: MainContentProperties) {

	const UserController = new UserEndpoints();

	async function onEditImage() {
		const image = await GetImage();

		if (image) {
			const result = await UserController.UpdateUserImage(props.user.id, image);
			if (result) {
				alert('La imagen se subió correctamente');
				const userUpdate = await UserController.GetUser(props.user.id);
				if (userUpdate) {
					props.onUpdate(userUpdate);
				}
				
			} else {
				alert('La imagen no se pudo subir');
			}
		}
	}

	return <div className={ProfileStyles.container}>
		<div className={ProfileStyles.avatarContainer}>
			<div className={ProfileStyles.avatar}>
				<AssetImage bytes={props.user.profilePic?.toString()}/>
			</div>
			<Fab variant="circular" 
				size="small" 
				className={ProfileStyles.EditButton}
				onClick={onEditImage}>
				<Edit/>
			</Fab>
		</div>
		<Typography variant="h4">
			Hola, {props.user.name}	
		</Typography>
	</div>
}

interface MainContentProperties {
	user: dto.UserDtoOut,
	onUpdate: (user: dto.UserDtoOut) => void
}
