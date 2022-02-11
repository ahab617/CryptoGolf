import styled from "styled-components";

export const Styles = styled.div`

    .card-mine {
        border: 2px solid #ffb100 !important;
    }

    .card {
        border-radius: 5px !important;
        border: 2px solid #42a369;
        position: relative;
    }

    .card:hover {
        -webkit-transform: scale(0.99);
        transform: scale(0.99);
        transition: transform 0.1s;
    }

    .card-actions {
        display: none;
        position: absolute;
        top: 10px;
    }

    .btn-sell {
        font-size: 12px !important;
    }

    .golf-class {
        display: block;
    }

    .card:hover {
        .card-actions {
            display: flex !important;
        }
    }

    .card-img {
        border-radius: 5px 5px 0 0 !important;
        cursor: pointer;
    }

    .card-description {
        padding: 15px;
        background-color: #fff !important;
        border-radius: 0 0 3px 3px !important;
    }

    .card-text {
        font-size: 14px;
        font-weight: 500;
    }

    // .card:hover {
    //     cursor: pointer;
    //     -webkit-transform: scale(1.005);
    //     transform: scale(1.005);
    //     transition: transform 0.3s;
    // }

    .attribute-card {
        border: 1px solid #000;
        border-radius: 3px;
    }

    .attribute-card:hover {
        box-shadow: 0 0 3px #4e4a4a;
        cursor: pointer;
    }

    @media (max-width: 992px) {
        .card-text {
            font-size: 12px;
        }

        .card-description {
            padding: 12px;
        }

    }

    @media (max-width: 576px) {
        .card-text {
            font-size: 10px;
        }

        .card-description {
            padding: 8px;
        }

    }

`;