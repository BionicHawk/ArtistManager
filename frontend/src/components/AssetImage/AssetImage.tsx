export default function AssetImage({bytes}: {bytes?: string}) {
    const url = `data:image/png;base64, ${bytes}`;

    if (!bytes) {
        return <img src="src/assets/images/avatar.png"></img>;
    }
    
    return <img src={url}></img>;
}