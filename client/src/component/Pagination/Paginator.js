import Styles from "./styles"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { Button, Form } from "react-bootstrap"

const Paginator = ({ pagenum, totalCount, handleNext, handlePrev, onChangePageNumber }) => {

    return (
        <Styles>
            <div className="d-flex justify-content-center align-items-center font-small">
                <Button
                    variant="outline-primary"
                    className={`background-transparent ${pagenum === 1 && 'disabled'}`}
                    onClick={handlePrev}
                >
                    <FaArrowLeft />
                </Button>
                &nbsp;Page&nbsp;
                <Form.Control
                    type="number"
                    className="background-transparent border-grey color-grey page_number text-center"
                    size="sm"
                    value={pagenum}
                    onChange={onChangePageNumber}
                />&nbsp;of {totalCount}&nbsp;
                <Button
                    variant="outline-primary"
                    className={`background-transparent ${pagenum === totalCount && 'disabled'}`}
                    onClick={handleNext}
                >
                    <FaArrowRight />
                </Button>
            </div>
        </Styles>
    )
}

export default Paginator