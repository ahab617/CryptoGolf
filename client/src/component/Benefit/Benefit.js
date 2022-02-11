import React from "react";
import { Chart } from "react-google-charts";
import { Styles } from "./styles";
import CheckImg from '../../assets/images/checkmark.png';
// import LockShieldImg from '../../assets/images/lockshield.png'
import LiquidityImg from '../../assets/images/liquidity.png'
import Piggybank from '../../assets/images/piggybank.png'
import PancakeImg from '../../assets/images/pancakeswap-logo.png'

const Benefit = () => {
    return (
        <Styles className="grey-bg">
            <div className="move container">
                <div id="tokenomics" className="d-block padding-top-7">
                    <div className="title-text col-12 Tanker mx-auto text-center">
                        <h2 className="pb-4">
                            <span className="color-green">CRYPTOGOLF</span> IS NOT JUST<br /> ANOTHER NFT
                        </h2>
                    </div>
                    <div className="details">
                        <div className="details-first">
                            <div className="details-first-title d-block d-lg-flex flex-row">
                                <p className="text-left mb-0 p-2 border-right border-bottom border-top-0 border-left-0 Tanker col-12 col-lg-6 color-green details-title">TOKENOMICS &amp; RARITY</p>
                                <div className="p-2 border-right-0 border-bottom border-top-0 border-left-0 details-crime col-12 col-lg-6">
                                    <p className="text-left mb-0 Tanker color-green txt1">BLOCKCHAIN</p>
                                    <p className="text-left mb-0 Tanker color-white txt2">BINANCE SMART CHAIN & ETHEREUM</p>
                                </div>
                            </div>
                            <div className="details-first-title d-block d-lg-flex flex-row">
                                <div className="p-2 border-right border-bottom-0 border-top-0 border-left-0 details-bail col-12 col-lg-6">
                                    <p className="text-left mb-0 Tanker color-green txt1">PUBLIC SALE 12.12.21</p>
                                    <p className="text-left mb-0 Tanker color-white txt2">0.5 BNB OR 0.07 ETH + GAS FEE</p>
                                </div>
                                <div className="p-2 border-right-0 border-bottom-0 border-top-0 border-left-0 details-amount col-12 col-lg-6">
                                    <p className="text-left mb-0 Tanker color-green txt1">TOTAL SUPPLY</p>
                                    <p className="text-left mb-0 Tanker color-white txt2">10,000 UNIQUELY GENERATED</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="benefit color-white pt-5">
                        <p className="text-left mb-0 about-description color-grey-light">
                            We bring values and benefits to our NFT holders with real-world use cases including but not limited to the following:
                            <br />
                            <br />
                            <img src={CheckImg} className="img-check" alt="" /> Free or discounted green fees at any of our partnered golf courses worldwide
                            <br />
                            <img src={CheckImg} className="img-check" alt="" /> Discounted pro shop merchandise purchases
                            <br />
                            <img src={CheckImg} className="img-check" alt="" /> Free entry to special events and tournaments including the annual GOLFPUNKS tournament
                            <br />
                            <img src={CheckImg} className="img-check" alt="" /> Online tee time bookings
                            <br />
                            <img src={CheckImg} className="img-check" alt="" /> A marketplace for trading your NFT
                            <br />
                            <img src={CheckImg} className="img-check" alt="" /> Passive Income. Simply hold your NFT and $GOLF tokens in your wallet and you will get more. Earning crypto was never this easy.
                            <br />
                            <br />
                            Please see our Roadmap for more details.
                            <br />
                            <br />
                            NFT. There are five classes of GOLGPUNKS and each class has different benefits.
                            The classes are PRO, BREAK 70, BREAK 80, BREAK 90 and BREAK 100.
                            The PRO classes are entitled to 25%, BREAK 70 20%, BREAK 80 15%, BREAK 90 10% and BREAK 100 5% discounts on green fees and pro shop merchandise purchases.
                            All classes have exclusive access and free entry to events and tournaments.
                            The PRO classes receive additional perks and benefits such as complimentary hotel stay during selected events and tournaments.
                            <br />
                            <br />
                            TOKEN. Our GOLF utility token is on the Binance Smart Chain (BSC) network and it will be used in our ecosystem as rewards,
                            for purchase of tee times and pro shop merchandises and in our NFT marketplace.
                            GOLF is currently available on PancakeSwap.
                        </p>
                    </div>
                    <div className="row mt-4 mx-0">
                        <div className="col-lg-3 col-12 p-3 p-2">
                            <div className="token-box h-100">
                                <Chart
                                    width={'100%'}
                                    height={'100%'}
                                    chartType="PieChart"
                                    loader={<div>Loading Chart</div>}
                                    data={[
                                        ['Task', 'Hours per Day'],
                                        ['Liquidity', 20],
                                        ['Marketing', 20],
                                        ['Development', 20],
                                        ['Rewards', 30],
                                        ['Team', 10],
                                    ]}
                                    options={{
                                        title: 'Token Destribution',
                                        backgroundColor: '#11131b',
                                        chartArea: { 'width': '100%', 'height': '80%' },
                                        legendTextStyle: { color: '#FFF' },
                                        titleTextStyle: {
                                            color: '#FFF',
                                            fontSize: '16'
                                        },
                                    }}
                                    rootProps={{ 'data-testid': '1' }}
                                />
                            </div>
                        </div>
                        <div className="col-lg-3 col-12 p-3 p-2">
                            <div className="token-box">
                                <div className="w-100 mt-3">
                                    <img src={Piggybank} alt="" width="40px" className="m-auto" />
                                </div>
                                <div className="w-100 my-3">
                                    <p className="text-center color-white font-small">PASSIVE INCOME</p>
                                </div>
                                <div className="w-100 mt-3 mb-4 passive-description">
                                    <p className="text-center color-gold font-small">2% auto reflection directly to all its holders.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-12 p-3 p-2">
                            <div className="token-box">
                                <div className="w-100 mt-3">
                                    <img src={LiquidityImg} alt="" width="40px" className="m-auto" />
                                </div>
                                <div className="w-100 my-3">
                                    <p className="text-center color-white font-small">LIQUIDITY POOL & STABILITY</p>
                                </div>
                                <div className="w-100 mt-3 mb-2">
                                    <p className="text-center color-gold font-small mb-0">
                                        2% auto-feeding liquidity pool to provide stability and the LP is locked. Verify&nbsp;
                                        <a href="https://dxsale.app/app/v3/dxlockview?id=0&add=0x4e74733D17a0DEd936715533477Ba174C6Df55b9&type=lplock&chain=BSC" target="_blank">here</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-12 p-3 p-2">
                            <a href="https://pancakeswap.finance/swap?outputCurrency=0x69685772d4ac0ffc2578f31f8a5c0009e900baf4" target="_blank" className="text-decoration-none">
                                <div className="token-box">
                                    <div className="w-100 mt-3">
                                        <img src={PancakeImg} alt="" width="40px" className="m-auto" />
                                    </div>
                                    <div className="w-100 my-3">
                                        <p className="text-center color-white font-small">BUY NOW</p>
                                    </div>
                                    <div className="w-100 mt-3 mb-2">
                                        <p className="text-center color-gold font-small mb-0" style={{ wordWrap: 'break-word' }}>Smart Contract Address<br />0x69685772d4ac0ffC2578F31F8A5c0009E900BAf4</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                        {/* <Pie data={data} width={50} height={50} options={options} /> */}
                    </div>
                </div>
            </div>
        </Styles>
    )
}

export default Benefit;