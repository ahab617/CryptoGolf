import styled from "styled-components";

export const Styles = styled.div`

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

    .wallet-lock {
        width: 0.8rem;
    }

    .social-icon {
        color: #2080e0;
        font-size: 20px;
    }

    .copyright {
        font-size: .8rem;
        font-family: "roboto";
    }

    .navbar-brand {
        display: inline-block;
        padding-top: .25rem;
        padding-bottom: .25rem;
        margin-right: 1rem;
        line-height: inherit;
        white-space: nowrap;
    }

    .copyright a {
        font-size: 0.8rem;
        font-family: "roboto";
        text-decoration: underline;
        font-weight: 600;
    }

    @media (max-width: 576px) {
        .connect-btn {
            width: 110px;
            height: 25px;
            font-size: 14px !important;
        }
    }
`;