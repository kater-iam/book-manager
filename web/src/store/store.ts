import { configureStore } from "@reduxjs/toolkit"
import appModeReducer from './appModeSlice'

export const store = configureStore({
	reducer: {
		appMode: appModeReducer,
	}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
