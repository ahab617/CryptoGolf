import styled from "styled-components";

export const Styles = styled.div`

    .details-amount, .details-bail, .details-crime, .details-first, .details-title {
        border: 3px solid #fff;
    }

    .details-amount > .txt1, .details-bail > .txt1, .details-crime > .txt1 {
        font-size: 1.2rem;
        font-weight: 500;
    }

    .details-amount .txt2, .details-bail .txt2, .details-crime .txt2 {
        font-size: 1.8rem;
        font-weight: 500;
        line-height: 2.6rem!important;
    }

    .details-title {
        font-size: 2rem;
        font-weight: 500;
    }

    @media screen and (max-width: 992px) {
        .details-title {
            border: 3px solid #fff!important;
            border-right: none!important;
            border-left: none!important;
        }

        .details-first {
            border: none;
        }

        .details-amount, .details-bail, .details-crime {
            border-bottom: 3px solid #fff!important;
            border-left: none!important;
            border-right: none!important;
        }
    }

    .img-check {
        width: 0.85rem !important;
    }

    .contract-text {
        font-size: 16px;
        font-weight: 100;
    }

    .serif {
        font-family: serif;
    }

    .btn-buy-token {
        width: 160px;
        height: 35px;
        font-size: 20px !important;
        color: #000;
        box-shadow: 0 4px 0 0 #d98100;
        background-color: #f3b65d;
        outline: none;
        border: none;
        cursor: pointer;
        opacity: 1;
    }

    .btn-buy-token:hover {
        opacity: 0.8;
    }

    .btn-buy-token > span {
        margin-left: 22px;
    }

    .pancake-img {
        width: 23px;
    }

    .token-box {
        border: 1px solid #000;
        border-radius: 15px;
        background-color: #00000078 !important;
        padding: 10px;
        cursor: pointer;
    }

    .token-box:hover {
        box-shadow: 0 0 2px #eee;
    }

    @media screen and (max-width: 576px) {
        .pancake-img {
            width: 16px;
        }
        .btn-buy-token {
            width: 110px;
            height: 25px;
            font-size: 14px !important;
        }
        .btn-buy-token > span {
            margin-left: 14px;
        }
    }

    @media screen and (min-width: 992px) {
        .secure-description {
            margin-bottom: 0.5rem !important;
        }
        .secure-description > p {
            margin-bottom: 0 !important
        }
    }

    @media screen and (max-width: 1199px) {
        .secure-description {
            margin-bottom: 0.5rem !important;
        }
        .secure-description > p {
            margin-bottom: 0 !important
        }
    }

    @media screen and (min-width: 1200px) {
        .secure-description {
            margin-bottom: 1.5rem !important;
        }
        .secure-description > p {
            margin-bottom: 0 !important
        }
    }

    @media screen and (max-width: 522px) {
        .passive-description {
            margin-bottom: 0.5rem !important;
        }
        .passive-description > p {
            margin-bottom: 0 !important
        }
    }
`;