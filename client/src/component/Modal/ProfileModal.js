import { useRef, useState } from "react"
import { Modal, Button, Row, Col, Form } from "react-bootstrap"
import useFileUpload from 'react-use-file-upload';
import { toast } from "react-toastify";
import { Styles } from "./styles"
import defaultImg from '../../assets/images/dicebear.svg'
import { useDispatch, useSelector } from "react-redux"
import { updateProfile } from "../../redux/actions"

const ProfileModal = ({
    show,
    handleClose,
    walletAddress,
    user
}) => {

    const {
        files,
        setFiles,
        clearAllFiles
    } = useFileUpload();

    const fileRef = useRef()
    const dispatch = useDispatch(null)

    const [username, setUsername] = useState("")
    // const [email, setEmail] = useState("")
    const [recvUpdates, setRecvUpdates] = useState(false)
    const [recvPromotions, setRecvPromotions] = useState(false)

    const handleUpdateProfile = (e) => {
        const formData = new FormData()
        formData.append("name", username)
        formData.append("recvUpdates", recvUpdates)
        formData.append("recvPromotions", recvPromotions)
        formData.append("address", walletAddress)
        if (files.length > 0) {
            formData.append("images", files[0]);
        }
        dispatch(updateProfile(formData))
        clearAllFiles();
        handleClose(e)
    }

    const handleChange = (e) => {
        if (!checkMimeType(e)) {
            toast.warning("Please select image file")
            return;
        }
        setFiles(e, 'a');
    }

    const checkMimeType = (event) => {
        let files = event.target.files
        let err = ''
        const types = ['image/jpg', 'image/jpeg', 'image/png'];
        for (let x = 0; x < files.length; x++) {
            if (types.every(type => files[x].type !== type)) {
                err += files[x].type + ' is not a supported format\n';
            }
        };

        if (err !== '') {
            return false;
        }
        return true;
    }

    return (
        <Styles>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="font-small">My Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4" style={{ padding: '1.5rem !important' }}>
                    <Row className="mx-2">
                        <Col lg="4" xs="4">
                            {
                                Object.keys(user).length > 0 && user.avatar !== '' ? (
                                    <img src={`upload/${user.avatar}`} alt="" width="100%" />
                                ) : (
                                    <img src={defaultImg} alt="" width="100%" />
                                )
                            }
                        </Col>
                        <Col lg="8" xs="8" className="d-flex align-items-center">
                            <div>
                                <div className="w-100 font-very-small">
                                    Allowed png, gif, jpg.
                                    <br />
                                    160*160px recommended
                                </div>
                                <div className="w-100 mt-2">
                                    <Button variant="outline-primary" size="sm" className="font-very-small" onClick={() => fileRef.current.click()}>
                                        Set Picture
                                    </Button>
                                    <input type="file" name="avatar" className="d-none" ref={fileRef} onChange={handleChange} />
                                </div>
                            </div>
                        </Col>
                        <Col lg="12" xs="12" className="mt-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label className="font-very-small"><span className="bold">Public Name</span> (will be used as your name)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Name"
                                    size="sm"
                                    className="font-small"
                                    onChange={(e) => setUsername(e.target.value)}
                                    value={user.name}
                                />
                            </Form.Group>
                        </Col>
                        {/* <Col lg="12" xs="12" className="mt-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label className="font-very-small"><span className="bold">Email</span> (for your trading notifications)</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter Email"
                                    size="sm"
                                    className="font-small"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                        </Col> */}
                        <Col lg="12" xs="12" className="mt-3">
                            <Form.Group id="formGridCheckbox">
                                <Form.Check
                                    type="checkbox"
                                    className="font-very-small"
                                    label="I want to receive updates from GOLFPUNKS"
                                    onChange={(e) => setRecvUpdates(e.target.checked)}
                                />
                                <Form.Check
                                    type="checkbox"
                                    className="font-very-small"
                                    label="I want to receive promotions from GOLFPUNKS"
                                    onChange={(e) => setRecvPromotions(e.target.checked)}
                                />
                            </Form.Group>
                        </Col>
                        <Col lg="12" xs="12" className="mb-4">
                            <Button variant="primary" className="w-100 btn-large" onClick={(e) => handleUpdateProfile(e)}>
                                Update Profile
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </Styles>
    )
}

export default ProfileModal