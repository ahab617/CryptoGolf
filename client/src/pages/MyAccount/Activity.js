import { Styles } from "./styles";
import { Table } from "react-bootstrap";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getActivity } from "../../redux/actions";
import moment from "moment";
import EthImg from '../../assets/images/eth.png'
import BscImg from '../../assets/images/bsc.png'
import GolfImg from '../../assets/images/golf-token.png'

const Activity = () => {

    const dispatch = useDispatch(null)

    const { walletAddress } = useSelector(state => state.connect)
    const { activities } = useSelector(state => state.account)

    useEffect(() => {
        if (walletAddress !== null) {
            dispatch(getActivity(walletAddress))
        }
    }, [walletAddress])

    return (
        <Styles>
            <Table responsive striped borderless hover className="color-grey">
                <thead>
                    <tr>
                        <th className="font-small text-left">EVENT</th>
                        <th className="font-small text-left">ITEMS</th>
                        <th className="font-small text-left">FROM</th>
                        <th className="font-small text-left">TO</th>
                        <th className="font-small text-left">DATE</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(activities).length > 0 ? activities.map((activity, index) => (
                            <tr key={index}>
                                <td className="font-small text-left color-grey">
                                    {activity.event}
                                </td>
                                <td className="font-small text-left color-grey">
                                    <img src={activity.currency === 1 ? (activity.network === 'ether' ? EthImg : BscImg) : GolfImg} alt="" height="24px" />&nbsp;#{activity.tokenId}
                                </td>
                                <td className="font-small text-left color-grey">
                                    {(activity.from === '0x0000...0000' || activity.from === '') ? '' : `${activity.from.slice(0, 6)}...${activity.from.slice(
                                        activity.from.length - 4,
                                        activity.from.length
                                    )}`}
                                </td>
                                <td className="font-small text-left color-grey">
                                    {(activity.to === '0x0000...0000' || activity.to === '') ? '' : `${activity.to.slice(0, 6)}...${activity.to.slice(
                                        activity.to.length - 4,
                                        activity.to.length
                                    )}`}
                                </td>
                                <td className="font-small text-left color-grey">
                                    {moment(activity.date).format("ddd MMM DD YYYY")}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="font-small color-grey">
                                    No activities
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </Styles>
    )
}

export default Activity