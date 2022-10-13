import { createContext } from "react";
import { Data, DataChangeActions } from "./reducer";

export const StateContext = createContext<{ data: Data, dispatch: React.Dispatch<DataChangeActions> }>(
    {
        data: { currentPage: 0, email: '', idIssuer: '', taxResidency: '', termsAccepted: false },
        dispatch: () => { }
    })
