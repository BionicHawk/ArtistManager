import { dto } from "../../../../../wailsjs/go/models";
import UserChip from "../UserChip/UserChip";
import Styles from "./UsersContainer.module.css";

export default function UsersContainer(props: { users: dto.UserDtoOut[] }) {
    return <div className={Styles.usersContainer}>
    {
        props.users.length > 0 ?

            props.users.map(u => (
                <UserChip key={u.id} user={u}></UserChip>
            ))

            :

            <p>No se han encontrado usuarios recientes</p>
    }
    </div>;
}