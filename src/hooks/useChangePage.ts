import { useCallback, useContext } from "react"
import { DataActionTypes, StateContext, StepID } from "@Components/stateContext"

export type Direction = "next" | "prev"

const useChangePage = () => {
  const { dispatch } = useContext(StateContext)

  return useCallback(
    (nextPage: StepID, currentPage?: StepID, direction: Direction = "next") => {
      dispatch({
        type: DataActionTypes.changePage,
        payload: {
          current: nextPage,
          [direction === "next" ? "prev" : "next"]: currentPage,
        },
      })
    },
    [dispatch]
  )
}

export default useChangePage
