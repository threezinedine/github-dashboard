import {useEffect, useState} from 'react';
import mqtt from 'mqtt/dist/mqtt'
import Topic from './Topic';
import AddTopic from './AddTopic';
import { RemoveModal } from './AddTopic';
import './Dashboard.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { library } from "@fortawesome/fontawesome-svg-core"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import './AddTopic.css'


library.add(faPlus)

const client = mqtt.connect("wss://test.mosquitto.org:8081", {protocol:'mqtt'})



export default function DashBoard() {
    const [connected, setConnected] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [topics, setTopics] = useState([
        {name: "Temperature", topic: "TEMPERATURE_TEST", icon: 'temperature-half', value: "0", dataType: "floatValue"},
        {name: "Humidity", topic: "HUMIDITY_TEST", icon: 'droplet', value: "0", dataType:"integerValue"},
        {name: "Light", topic: "LIGHT_CONTROL", icon: 'toggle-on', value: "0", dataType:"booleanValue"},
    ])

    const [removedTopic, setRemovedTopic] = useState()

    useEffect (
        () => {
            client.on('connect', () => {
                setConnected(true) 
                topics.forEach(topic => {client.subscribe(topic.topic)})
            })
        }
    , [])

    const updateValueFunctions = {
        floatValue: (topic, message) => {
            return {...topic, value:message.toString()}
        },
        integerValue: (topic, message) => {
            return {...topic, value:message.toString()}
        }, 
        booleanValue: (topic, message) => {
            const newValue = message.toString()
            const newIcon = newValue === '0' ? 'toggle-off' : 'toggle-on'

            return {...topic, value:message.toString(), icon: newIcon}
        }
    }

    function handleClickOnModal(e) {
        if (e.target.classList.contains("modal")) {
            setOpenModal(false)
            setRemovedTopic(null)
        }
    }


    function removeTopic(removedTopic) {
        setTopics([...topics].filter((topic, index) => topic.name !== removedTopic))
        setRemovedTopic(null)
    }


    function addTopic(name, topic, icon, dataType) {
        setTopics([
            ...topics,
            {
                name,
                topic, 
                icon,
                dataType,
                value: '0',
            }
        ])
        setOpenModal(false)
    }

    useEffect(() => {
        client.on('message', (receivedTopic, message) => {
            let updatedTopic = null
            let updatedIndex = 0
            const newTopics = [...topics]

            topics.forEach((topic, index) => {
                if (topic.topic === receivedTopic) {
                    updatedIndex = index
                    updatedTopic = updateValueFunctions[topic.dataType](topic, message)
                } 
            }) 

            if (updatedTopic) {
                newTopics[updatedIndex] = updatedTopic 
            }

            setTopics(newTopics)
        })
    }, [])

    return (
        <div className="dash-board">
            {topics.map(topic => (
                <Topic 
                    key={topic.topic} 
                    changeRemovedTopic={removedTopic => {
                        setRemovedTopic(removedTopic)
                    }} 
                    data={topic}
                />
            ))}
            {(openModal && <AddTopic 
                                closeModal={() => {setOpenModal(false)}} 
                                addTopic={addTopic} 
                                handleClickOnModal={handleClickOnModal} 
            />)}
            {
                removedTopic && <RemoveModal 
                    removeTopic={removeTopic}
                    removedTopic={removedTopic}
                    closeModal={() => setRemovedTopic(null)}
                    handleClickOnModal={handleClickOnModal}
                />
            }
            <div 
                onClick={e => {
                    setOpenModal(true)
                }}
                className="add-btn">
                <FontAwesomeIcon icon="plus" />
            </div>
        </div>
    )
}
