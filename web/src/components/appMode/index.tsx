import { setAppMode } from "@/store/appModeSlice";
import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom"

const AppMode: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [searchParams] = useSearchParams();
    const appMode = searchParams.get("app_mode");
    const dispatch = useDispatch()

    useEffect(() => {
        if (!appMode) return
        dispatch(setAppMode({ appMode: appMode === 'true' }))
    }, [appMode, dispatch])

    return (
        <>{children}</>
    )
}

export default AppMode

