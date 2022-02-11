import styled from "styled-components";

export const Styles = styled.div`

    .title-text h2 span {
        color: #42a369;
    }

    .nft-images img {
        border: 2px solid #42a369;
        border-radius: 5px;
        box-shadow: 0 0 3px #eee;
        cursor: pointer;
    }

    .nft-images img:hover {
        -webkit-transform: scale(1.02);
        transform: scale(1.02);
        transition: transform 0.4s;
    }
`;