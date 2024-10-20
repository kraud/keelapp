import React, { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Box, useMediaQuery } from "@mui/material"
// import { Swipeable } from "react-swipeable"

interface CarouselProps {
    images: string[]
    intervalTime: number // Time in ms
    showDots?: boolean
}

const Carousel: React.FC<CarouselProps> = ({ images, intervalTime, showDots = true }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const intervalRef = useRef<NodeJS.Timeout | null>(null) // Store the interval reference
    const isMobile = useMediaQuery("(max-width: 600px)")

    // Function to start the interval
    const startInterval = () => {
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
        }, intervalTime)
    }

    // Clear the interval
    const clearCurrentInterval = () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
    }

    // Start the interval on mount and reset on intervalTime change
    useEffect(() => {
        startInterval()
        return () => clearCurrentInterval() // Clear on unmount
    }, [images.length, intervalTime])

    // Handle swipe events (left and right)
    const handleSwipeLeft = () => {
        clearCurrentInterval() // Clear the current interval to avoid quick switch
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
        startInterval() // Restart the interval
    }

    const handleSwipeRight = () => {
        clearCurrentInterval()
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
        startInterval()
    }

    // Handle dot click and reset the interval
    const handleDotClick = (index: number) => {
        clearCurrentInterval() // Clear the current interval
        setCurrentIndex(index) // Set the clicked image
        startInterval() // Restart the interval after clicking
    }

    return (
        <Box sx={{ position: "relative", overflow: "hidden", width: "100%", height: "300px" }}>
            {/* Swipeable for mobile swipe gestures */}
            {/*<Swipeable onSwipedLeft={handleSwipeLeft} onSwipedRight={handleSwipeRight}>*/}
                <AnimatePresence initial={false}>
                    <motion.img
                        key={images[currentIndex]}
                        src={images[currentIndex]}
                        alt={`slide-${currentIndex}`}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                        style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }}
                    />
                </AnimatePresence>
            {/*</Swipeable>*/}

            {/* Dots navigation */}
            {showDots && (
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 10,
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    {images.map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                margin: "0 5px",
                                backgroundColor: currentIndex === index ? "black" : "gray",
                                cursor: "pointer",
                            }}
                            onClick={() => handleDotClick(index)} // Handle dot click and reset timer
                        />
                    ))}
                </Box>
            )}
        </Box>
    )
}

export default Carousel
