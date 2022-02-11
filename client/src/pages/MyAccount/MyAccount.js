import { Styles } from "./styles";
import { Tabs, Tab } from "react-bootstrap";
import Activity from "./Activity";
import List from "./List";
import OfferMade from "./OfferMade";
import OfferReceived from "./OfferReceived";

const MyAccount = () => {
    return (
        <Styles className="py-3">
            <div className="container">
                <Tabs
                    defaultActiveKey="activity"
                    transition={true}
                    id="noanim-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="activity" title="Activity">
                        <Activity />
                    </Tab>
                    <Tab eventKey="offer_received" title="Trade Offers Received">
                        <OfferReceived />
                    </Tab>
                    <Tab eventKey="offer_made" title="Trade Offers Made">
                        <OfferMade />
                    </Tab>
                    <Tab eventKey="listings" title="Listings">
                        <List />
                    </Tab>
                </Tabs>
            </div>
        </Styles>
    )
}

export default MyAccount