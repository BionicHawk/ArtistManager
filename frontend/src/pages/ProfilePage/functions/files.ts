export async function GetImage() {
    const input = document.createElement("input")
    input.type = "file"

    const file = await new Promise<File | undefined>((resolve, reject) => {
        input.onchange = (event) => {
            const inputFile = event.target as HTMLInputElement;
            const gotFile = inputFile.files?.item(0)

            resolve(gotFile ?? undefined);
        }

        input.onerror = reject;

        input.click();
    })

    input.remove();

    return file;
}