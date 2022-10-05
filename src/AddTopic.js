import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { library } from "@fortawesome/fontawesome-svg-core"
import { faUser, faTemperatureHalf, faDroplet, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons"
import './Topic.css'
import {useState} from "react"

library.add(faUser, faTemperatureHalf, faDroplet, faToggleOn, faToggleOff)


function Input({label, isIcon, type, options, getter, setter, ...props}) {
    if (type === 'select') {
        return (
            <div className={`input-select`}>
                <div className="input-label">{label}</div>
                <select onChange={setter}>
                    {options.map(curr => (
                        <option 
                            value={curr}
                            key={curr}
                        >
                            {curr}
                        </option>
                    ))} 
                </select>
            </div>
        )
    }

    return (
        <div className={`input-${type}`}>
            <div className="input-label">{label}</div>
            <input type={type} value={getter} onChange={setter} {...props} />
        </div>
    )
}


function ButtonTool({handleSubmit, closeModal}) {
    return (
        <div className="submit-btn-group">
            <div onClick={handleSubmit} className="submit-btn btn">Submit</div>
            <div onClick={closeModal} className="cancel-btn btn">Cancel</div>
        </div>
    )
}

export const RemoveModal = ({closeModal, handleClickOnModal, removedTopic, removeTopic}) => {
    return (
        <div onClick={handleClickOnModal} className="modal">
            <form className="confirm-form">
                <div className="form-label-remove-topic">
                    Do you want to remove {removedTopic} 
                </div>
                <ButtonTool handleSubmit={() => removeTopic(removedTopic)} closeModal={closeModal}/>
            </form>
        </div>
    )
}

export default function AddTopic({handleClickOnModal, addTopic, closeModal}) {
    const [topicName, setTopicName] = useState("")
    const [topic, setTopic] = useState("")
    const [icon, setIcon] = useState("temperature-half")
    const [dataType, setDataType] = useState("integerValue")


    function submitData() {
        console.log("here")
        addTopic(
            topicName,
            topic,
            icon,
            dataType
        )
    }

    return (
        <div onClick={handleClickOnModal} className="modal">
            <form className="add-topic-form">
                <Input 
                    type="text" 
                    getter={topicName} 
                    setter={e => setTopicName(e.target.value)} 
                    label="Name" 
                    placeholder="E.x: Temperature" 
                />   

                <Input 
                    type="text" 
                    getter={topic} 
                    setter={e => setTopic(e.target.value)} 
                    label="Topic" 
                    placeholder="E.x: src/temperature"
                />   

                <Input 
                    type="select" 
                    getter={icon} 
                    setter={e => setIcon(e.target.value)} 
                    label="Icon" options={["temperature-half", "droplet", 'toggle-off']}
                />   

                <Input 
                    type="select" 
                    getter={dataType} 
                    setter={e => setDataType(e.target.value)} 
                    label="Data Type" 
                    options={["floatValue", "integerValue", "booleanValue"]} 
                />
                <ButtonTool closeModal={closeModal} handleSubmit={submitData}/>
            </form>
        </div>        
    )
}
