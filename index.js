//@flow

import React from 'react'

import styled from 'styled-components/native'

import { Text, View, Image, TouchableOpacity } from 'react-native'

const AreaBase = styled.TouchableOpacity`
    height: 100%;
    width: 50%;
    top: 0;
    position: absolute;
    z-index: 22;
`

const LeftArea = styled(AreaBase)`
    /* border: 3px solid teal; */
    left: 0;
`
const RightArea = styled(AreaBase)`
    /* border: 3px solid purple; */
    right: 0;
`

const IndicatorBar = styled.View`
    /* border: 3px solid purple; */
    flex-direction: row;
    justify-content: space-between;
    z-index: 99;
    position: absolute;
`
const Indicator = styled.View`
    flex: 1;
    height: 5px;
    margin: 5px;
    position: relative;

    z-index: 100;
    border-radius: 4px;

    background-color: ${p => (p.active ? p.color || 'white' : 'black')};
    opacity: ${p => (p.active ? '1' : '.3')};
`

type ImageTapperProps = {
    images: Array<any>,
    indicatorLocation?: 'top' | 'bottom',
    indicatorColor?: string,
    handleAfterMove?: () => void,
    imageWidth?: any, //can be string (ie '100%') or a number
    imageHeight?: any, //can be string (ie '100%') or a number
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center',
}

type ImageTapperState = {
    activeImage?: number,
}

//NOTE put views in images keeps background trasnparent, not on top
//https://stackoverflow.com/questions/29300732/render-text-box-with-transparent-background-on-top-of-image-in-react-native-ios

export default class ImageTapper extends React.Component<
    ImageTapperProps,
    ImageTapperState
> {
    state = {
        activeImage: 0,
    }

    afterMove(direction: string) {
        const { handleAfterMove } = this.props

        handleAfterMove && handleAfterMove(direction, this.state.activeImage)
    }

    handleMove(direction: 'left' | 'right') {
        const { activeImage } = this.state

        const { images, handleAfterMove } = this.props

        if (!images && images.length > 1) return

        if (direction === 'left' && activeImage !== 0) {
            this.setState(
                {
                    activeImage: activeImage - 1,
                },
                () => this.afterMove(direction)
            )
        }

        if (direction === 'right' && activeImage !== images.length - 1) {
            this.setState(
                {
                    activeImage: activeImage + 1,
                },
                () => this.afterMove(direction)
            )
        }
    }

    render() {
        let { activeImage } = this.state
        let {
            images,
            indicatorLocation,
            indicatorColor,
            imageWidth,
            imageHeight,
            resizeMode,
            ...rest
        } = this.props

        if (!images) return null

        let barStyles = {}

        if (indicatorLocation && indicatorLocation === 'bottom')
            barStyles.bottom = 0

        const hasMultipleImages = images.length > 1

        return (
            <View {...rest}>
                <Image
                    style={{
                        width: imageWidth || '100%',
                        height: imageHeight || 300,
                    }}
                    source={images[activeImage]}
                    resizeMode={resizeMode || 'cover'}
                >
                    <LeftArea onPress={() => this.handleMove('left')} />
                    <RightArea onPress={() => this.handleMove('right')} />

                    {hasMultipleImages && (
                        <IndicatorBar style={barStyles}>
                            {images.map((imageNum, index) => (
                                <Indicator
                                    key={imageNum}
                                    color={indicatorColor}
                                    active={activeImage === index}
                                />
                            ))}
                        </IndicatorBar>
                    )}
                </Image>
            </View>
        )
    }
}
