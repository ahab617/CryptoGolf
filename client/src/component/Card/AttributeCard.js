import { Styles } from './styles'

const AttributeCard = ({data}) => {
    return (
        <Styles>
            <div className="attribute-card py-2 align-items-center justify-content-center">
                <h6 className="font-very-small color-light-blue my-1">{data.trait_type}</h6>
                <h6 className="font-very-small color-grey my-1">{data.value}</h6>
            </div>
        </Styles>
    )
}

export default AttributeCard