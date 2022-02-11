import styled from "styled-components";

export const Styles = styled.div`

    .key {
        width: 50px;
    }

    .left-border {
        border-left: 1px solid #fff;
        transform: translateX(-1px);
    }

    .right-border {
        border-right: 1px solid #fff;
    }

    .loadmap-key1, .loadmap-key2 {
        transform: translateY(-50%);
        background-color: hsla(0,0%,100%,.18823529411764706);
        border-radius: 50%;
        padding: 10px;
    }

    .loadmap-key1 {
        top: 10%;
        left: -36px;
        box-shadow: 0 0 10rem rgb(0 0 0 / 13%);
    }

    .translateY1 {
        transform: translateY(1.6rem)!important;
    }

    .loadmap-key2 {
        top: 14%;
        right: -36px;
        box-shadow: 0 0 10rem #eee;
    }

    .percent-text-color10, .percent-text-color25, .percent-text-color50, .percent-text-color80, .percent-text-color100 {
        background-image: linear-gradient(0deg,#52cc83,#52cc83 30%,#52cc83 0,#fff 0,#fff);
        background-color: #fff;
        background-size: 100%;
        background-repeat: repeat;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .percent-num {
        font-size: 1.6rem;
        border-right: 3px solid #fff;
        min-width: 3.5rem;
    }

    .percent-script {
        font-size: 1rem;
        line-height: 1.1!important;
        font-family: serif;
    }

    .percent-text-color25 {
        background-image: linear-gradient(0deg,#52cc83,#52cc83 37%,#52cc83 0,#fff 0,#fff);
    }

    .percent-text-color50 {
        background-image: linear-gradient(0deg,#52cc83,#52cc83 47%,#52cc83 0,#fff 0,#fff);
    }

    .percent-text-color80 {
        background-image: linear-gradient(0deg,#52cc83,#52cc83 64%,#52cc83 0,#fff 0,#fff);
    }

    .percent-text-color100 {
        background-image: linear-gradient(0deg,#52cc83,#52cc83 100%,#52cc83 0,#fff 0,#fff);
    }

    .roadmap-description {
        font-size: 2rem;
        font-family: "TANKER";
        line-height: 1.5!important;
    }

    .roadmap-description p {
        font-size: 4rem;
        font-family: "TANKER";
        line-height: 1!important;
    }

    .golf-img {
        position: sticky;
        top: 6rem;
        z-index: 1;
    }

    @media screen and (max-width: 992px) {
        .left-border {
            border-left: none;
            transform: translateX(0);
        }

        .right-border {
            border-right: none;
        }
    }
    
`;