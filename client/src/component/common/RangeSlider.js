import { Range } from 'rc-slider'
import 'rc-slider/assets/index.css';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';

const RangeSlider = ({ onSliderChange }) => {
    const [min, setMin] = useState(0)
    const [max, setMax] = useState(100)

    const handleSliderChange = (val) => {
        setMin(val[0])
        setMax(val[1])
        onSliderChange(val)
    }

    const handleChangeMin = (e) => {
        setMin(+e.target.value)
        onSliderChange([+e.target.value, max])
    }

    const handleChangeMax = (e) => {
        setMax(+e.target.value)
        onSliderChange([min, +e.target.value])
    }

    return (
        <Row>
            <Col lg={6} xs={6}>
                <input type="number" value={min} onChange={handleChangeMin} className="w-100 background-transparent border-grey color-grey text-center font-small" placeholder={`${min}`} />
            </Col>
            <Col lg={6} xs={6}>
                <input type="number" value={max} onChange={handleChangeMax} className="w-100 background-transparent border-grey color-grey text-center font-small" placeholder={`${max}`} />
            </Col>
            <Col lg={12} xs={12} className="mt-2">
                <Range
                    defaultValue={[0, 100]}
                    min={0}
                    max={100}
                    value={[min, max]}
                    onChange={handleSliderChange}
                />
            </Col>
        </Row>
    )
}

export default RangeSlider;