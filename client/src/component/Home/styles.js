import styled from "styled-components";

export const Styles = styled.div`

    .title-connect-wallet {
        position: absolute;
        bottom: 1rem;
        border-radius: 12px;
        left: 50%;
        transform: translate(-50%);
        background-color: rgba(0,0,0,.5843137254901961);
        border: 3px solid #fff;
    }

    .title-img {
        border: 2px solid #42a369 !important;
        border-radius: 3px;
        box-shadow: 0 0 5px #eee;
    }

    .public-text {
        font-size: 0.9rem;
        font-weight: 500;
        color: #fff;
    }

    .wallet-lock {
        width: 0.8rem;
    }

    .connect-btn {
        width: 160px;
        height: 35px;
        font-size: 20px !important;
    }

    .btn-login-wallet {
        color: #000;
        box-shadow: 0 4px 0 0 #2f9e5b;
        background-color: #52cc83;
        outline: none;
        border: none;
        cursor: pointer;
        opacity: 1;
    }

    .btn-login-wallet:hover {
        opacity: 0.8;
    }

    .title-text h2 {
        font-size: 5rem !important;
    }

    .position-relative > button {
        padding: 0.15rem 0.2rem !important;
        font-size: 0.66rem !important;
    }

    @media screen and (max-width: 992px) {
        .home-text {
            text-align: center !important;
        }

        .title-img {
            min-height: 30rem !important;
        }
    }

    @media screen and (max-width: 576px) {
        .title-text h2 {
            font-size: 5rem !important;
        }

        .connect-btn {
            width: 110px;
            height: 25px;
            font-size: 14px !important;
        }
    }
`;