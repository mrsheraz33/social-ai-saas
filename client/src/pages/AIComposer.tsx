import { useEffect, useState } from "react"
import { dummyGenerationData } from "../assets/assets"
import { ArrowRightIcon, Loader2Icon } from "lucide-react"


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

const handelGenerate = async ()=>{
  
}

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
     <div className="space-y-6 text-center mt-20">
      <h1 className="text-3xl text-slate-700 tracking-tight">What should we create today?</h1>
     </div>

     <div className="relative group mt-12">
      <textarea className="w-full px-6 py-6 bg-white border border-slate-300 rounded-xl
       text-slate-900 placeholder-slate-400 outline-none
      focus:border-slate-400 transition resize-none h-40"
       placeholder="Share your idea... (e.g., Big news! We are launching our new product today. Check it out now!)" 
       value={prompt} 
       onChange={(e)=> setPrompt(e.target.value)}/>

       <div className="absolute bottom-4 right-2.5 flex items-cente gap-3 text-sm">

      <button onClick={()=> setGenerateImage(!generateImage)}
       className="flex items-center gap-3 bg-red-50 py-2 px-3 rounded-lg">
            <span>AI Image</span>
          <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer
            rounded-full transition-colors duration-200 ease-in-out focus:outline-none
             ${generateImage ? "bg-red-500": "bg-slate-200"}`}>
            <span className={`pointer-events-auto size-4 transform translate-y-0.5
            rounded-full bg-white transition ${generateImage ? "translate-x-4.5": "translate-x-0.5"}`}/>
          </div>
      </button>

    <button onClick={handelGenerate}
     disabled={loading}
    className="bg-slate-900 hover:bg-slate-800 text-white flex 
    items-center gap-2 px4 py-2 rounded-lg">
      {
      loading ? 
      (
        <>
        <Loader2Icon className="size-4 animate-spin"/>
        <span>Generating...</span>
        </>
      )
      :(<>
      Generate
      <ArrowRightIcon className="size-4"/>
      </>)
    }
    </button>
   
       </div>
     </div>
    </div>
  )
}

export default AIComposer