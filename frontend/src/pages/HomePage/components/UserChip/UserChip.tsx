import { Link } from "react-router-dom";
import { dto } from "../../../../../wailsjs/go/models";
import AssetImage from "../../../../components/AssetImage/AssetImage";
import Styles from "./UserChip.module.css";

export default function TaskChip(props: { user: dto.UserDtoOut }) {
    const createdAt = new Date(props.user.createdAt);

    return <div className={Styles.chip}>
        <div className={Styles.mainInfo}>
            <AssetImage bytes={props.user.profilePic?.toString()}/>
            <div className={Styles.userName}>
                <Link to={`/user/${props.user.id}`}>
                    {props.user.name}
                </Link>
            </div>
        </div>
        <div className={Styles.detail}>Creado el {createdAt.toLocaleDateString()}</div>
    </div>;
}