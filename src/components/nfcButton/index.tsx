import { EditButton } from "@refinedev/antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export const NfcButton: React.FC<{ setSerialNumber: (serialNumber: string) => void }> = ({ setSerialNumber }) => {
    const [isEditNfc, setIsEditNfc] = useState<boolean>(false)
    const [isScan, setIsScan] = useState<boolean>(false)
    const [reader, setReader] = useState<NDEFReader | null>(null)
    const [abortController] = useState(new AbortController());

    useEffect(() => {
        if (!("NDEFReader" in window)) return

        const newReader = new NDEFReader();
        setReader(newReader);
        setIsEditNfc(true);

        newReader.onreading = handleReading
        newReader.onreadingerror = handleError

        return () => {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            newReader.onreading = () => { }
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            newReader.onreadingerror = () => { }
            abortController.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleReading(event: any) {
        toast(`読み取りに成功しました`);
        const audio = new Audio('/sounds/success.mp3')
        audio.play();

        setSerialNumber(event.serialNumber);
        setIsScan(false);
        abortController.abort()
    }

    function handleError() {
        toast("読み取りに失敗しました");
    }

    const handleClick = async () => {
        if (!reader || isScan) return;

        try {
            await reader.scan();
            setIsScan(true);
        } catch (error) {
            abortController.abort()
        }
    }

    return (
        <EditButton disabled={!isEditNfc} onClick={handleClick}>{!isScan ? "タグ読取" : "起動中"}</EditButton>
    )
}
