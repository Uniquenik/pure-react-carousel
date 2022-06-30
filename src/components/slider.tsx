import React, {MouseEventHandler, useEffect, useState} from 'react'
import './slider.scss'
import useWindowDimensions from "../hooks/useWindowDimensions";
import ArrowLeft from '../shared/arrow-left.svg'
import ArrowRight from '../shared/arrow-right.svg'
import {clearInterval} from "timers";

const Slider = (props:{children:React.ReactNode, title:string, infiniteLoop: boolean}) => {
    const fixedWidth = 260
    // задаем ширину карточки только в одном месте
    const margin = 40

    const {children , infiniteLoop} = props
    const { width } = useWindowDimensions();

    const [currentIndex, setCurrentIndex] = useState(0)
    const [length, setLength] = useState(React.Children.count(children))
    const [showSlides, setShowSlides] = useState(1)

    const [touchPosition, setTouchPosition] = useState<number | null>()

    useEffect(() => {
        setLength(React.Children.count(children))
    }, [children, infiniteLoop, showSlides])


    // useEffect(() => {
    //     let timer = setInterval(() => next(), 4000);
    // })

    useEffect(() => {
        setCurrentIndex(0)
        if (width < 2 * (fixedWidth + margin)) {
            setShowSlides(1)
            return
        }
        if (width > 2 * (fixedWidth + margin) && width < 3 * (fixedWidth + margin)) {
            setShowSlides(2)
            return
        }
        if (width > 3 * (fixedWidth + margin) && width < 4 * (fixedWidth + margin)) {
            setShowSlides(3)
            return
        }
        if (width > 4 * fixedWidth + margin * 3) {
            setShowSlides(4)
            return
        }
    }, [width])


    const next = () => {
        if (currentIndex < (length - showSlides)) {
            setCurrentIndex(currentIndex + 1)
        }
        else if (infiniteLoop) {
            setCurrentIndex(0)
        }
    }

    const prev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
        else if (infiniteLoop) {
            setCurrentIndex(length - showSlides)
        }
    }


    const handleMouseDown = (e:React.MouseEvent<Element, MouseEvent>) => {
        setTouchPosition(e.clientX)
    }

    const handleTouchStart = (e:React.TouchEvent) => {
        setTouchPosition(e.touches[0].clientX)
    }

    const handleTouchMove = (e:React.TouchEvent) => {
        pointsDiff(e.touches[0].clientX)
    }

    const pointsDiff = (point:number) => {
        const pointDown = touchPosition

        if(pointDown !== null) {
            // @ts-ignore
            const diff = pointDown - point

            if (diff > 5) {
                next()
            }

            if (diff < -5) {
                prev()
            }

            setTouchPosition(null)
        }
    }

    const handleMouseMove = (e:React.MouseEvent<Element, MouseEvent>) => {
        pointsDiff(e.clientX)
    }

    return (
        <div className={'slider-container'}>
            <div className="slider"
                 style={{width: showSlides * (fixedWidth + margin) }}>
                <div className={'slider-header'}>
                    <div>
                        {props.title}
                    </div>
                    <div className={'slider-header-grow'}> </div>
                    <div className={'slider-header-right'}>
                        <div className={'slider-header-bar'}>
                            <div className={'bar-track'}>
                                <div className={'bar'}
                                     style={{
                                         marginLeft: 360/(length-showSlides+1)*currentIndex,
                                         width: 360/(length-showSlides+1)
                                    }}>
                                </div>
                            </div>
                        </div>
                        <div className={'slider-header-buttons'}>
                            <button onClick={() => prev()} className={'slider-header-button'}>
                                <img src={ArrowLeft}/>
                            </button>
                            <button onClick={() => next()} className={'slider-header-button'}>
                                <img src={ArrowRight}/>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="slider-wrapper">
                    <div
                        className="slider-content-wrapper"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}>
                        <div
                            className={`slider-content show-${showSlides}`}
                            style={{
                                transform: `translateX(-${currentIndex * (100 / showSlides)}%)`,
                            }}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Slider