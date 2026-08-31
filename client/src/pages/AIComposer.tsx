import { useEffect, useState } from "react"
import { dummyGenerationData } from "../assets/assets"


function AIComposer() {
  const [prompt, setPrompt] = useState("")
  const [tone, setTone] = useState("Professional")
  const [generateImage, setGenerateImage] = useState(true)
  const [loading, setLoading] = useState(false)
  const [generations, setGenerations] = useState<any[]>([])
  
  const [activeScheduler, setActiveScheduler] = useState<any>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")

  const [scheduling, setScheduling] = useState(false)

  const fetchGenerations = async ()=>{
    setGenerations(dummyGenerationData)
  }
  

  useEffect(()=>{
   fetchGenerations()
  },[])

const tones = [
  "Professional",
  "Casual",
  "Funny",
  "Creative",
  "Excited",
];

  return (
    <div>

    </div>
  )
}

export default AIComposer