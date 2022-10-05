import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { library } from "@fortawesome/fontawesome-svg-core"
import { faUser, faTemperatureHalf, faDroplet, faToggleOn, faToggleOff, faDeleteLeft } from "@fortawesome/free-solid-svg-icons"
import './Topic.css'


library.add(faUser, faTemperatureHalf, faDroplet, faToggleOn, faToggleOff, faDeleteLeft)


export default function Topic({data, changeRemovedTopic}) {
    return (
        <div className="topic">
            <div className="topic-icon">
                <FontAwesomeIcon icon={data.icon} />
            </div>
            <div className="topic-name">{data.name}</div>
            <div className="topic-value">{data.value}</div>        
            <div 
                className="delete-btn"
                onClick={() => changeRemovedTopic(data.name)}
            >
                <FontAwesomeIcon icon="delete-left" /> 
            </div>
        </div>
    )
}


