import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IAppMode {
	appMode: boolean
}

const initialState: IAppMode = {
	appMode: false,
}

export const appModeSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setAppMode: (state, action: PayloadAction<IAppMode>) => {
			state.appMode = action.payload.appMode
			if (action.payload.appMode) {
				localStorage.setItem('app_mode', String(action.payload.appMode))
			}
		},
		resetAppMode: () => {
			localStorage.removeItem('app_mode')
			return initialState
		}
	}
})

export const { setAppMode, resetAppMode } = appModeSlice.actions

export default appModeSlice.reducer

