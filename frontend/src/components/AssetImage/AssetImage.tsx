import foto from "./avatar.png";

export default function AssetImage({bytes}: {bytes?: string}) {
    const url = `data:image/png;base64, ${bytes}`;

    if (!bytes) {
        return <img src={foto}></img>;
    }
    
    return <img src={url}></img>;
}