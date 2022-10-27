import { FC, PropsWithChildren, useContext, useEffect, useLayoutEffect, useState } from "react"
import { StateContext } from "../stateContext"
import './step.scss'

export type MovingDirection = "moving-out" | "moving-in" | "moving-center"

export type StepAnimation = { from: MovingDirection, to: MovingDirection }

type StepProps = {
    header?: (disabled: boolean, onTransitionDone: boolean) => JSX.Element
    footer?: (disabled: boolean, onTransitionDone: boolean) => JSX.Element
    onEnter?: () => void
    className?: string
    disabled?: boolean
    animation?: StepAnimation
    onTransitionDone?: () => void
}

export const Step: FC<PropsWithChildren<StepProps>> = ({ children, header, footer, onEnter, className, disabled = false, animation, onTransitionDone }) => {
    const state = useContext(StateContext)
    const [animatedClass, setAnimatedClass] = useState<MovingDirection>()
    const [transitionDone, setTransitionDone] = useState(false)

    useLayoutEffect(() => {
        if (animation) {
            setAnimatedClass(animation.from)
        }
    }, [])

    useLayoutEffect(() => {
        if (animation) {
            setTimeout(() => {
                setAnimatedClass(animation.to)
            }, 0);
        }
    }, [animatedClass])

    useLayoutEffect(() => {
        setTimeout(() => {
            if (onTransitionDone && animatedClass === animation?.to) {
                onTransitionDone()
                setTransitionDone(true)
            }
        }, 250);
    }, [animatedClass, animation?.to])

    useEffect(() => {
        if (!onEnter || disabled) {
            return
        }

        const enterHndlr = ({ key }: KeyboardEvent) => {
            if (key === 'Enter') {
                onEnter()
            }
        }

        document.addEventListener('keyup', enterHndlr)

        return () => document.removeEventListener('keyup', enterHndlr)
    }, [onEnter, state, disabled])

    if (!state) {
        return <>Something went seriously wrong! Probably you did not provided the data! Check your data provider!</>
    }

    return <div className={`step${animatedClass ? ` ${animatedClass}` : ''} ${className}`} style={{ position: 'absolute' }}>
        <div>
            {header ? header(disabled, transitionDone) : null}
        </div>
        <div className={`step-body`} >
            {children}
        </div>
        <div className={`step-footer`}>
            {footer ? footer(disabled, transitionDone) : null}
        </div>
    </div>
}