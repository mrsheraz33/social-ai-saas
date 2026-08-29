import { CheckCircleIcon, ExternalLinkIcon, XIcon } from "lucide-react"
import { PLATFORMS } from "../assets/assets"


interface PlatformPickerModelProps {
    connectedIds: string[]
    connecting: string | null
    onClose: () => void
    onConnect: (platformId: string) => void
}

function PlatformPickerModel({connectedIds, connecting, onClose, onConnect}:PlatformPickerModelProps) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40
    backdrop-blur">
  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100">
 
 <div className="flex items-center justify-between px-6 py-4 shadow"> 
<h3 className="text-slate-700">Choose a platform</h3>

<button
onClick={onClose}
 className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
    <XIcon className="size-4"/>
</button>
 </div>

<div className="p-6 flex flex-col gap-2">
{PLATFORMS.map((p)=>{
    const isConnected = connectedIds.includes(p.id)
    const isConnecting = connecting === p.id

    return (
        <button>
            <div className="p-2">
                <p.icon className={`size-5 ${isConnected ? "text-red-600" : "text-slate-500"}`}/>
            </div>

         <div className="flex-1 min-w-0">
            <div className={`text-sm ${isConnected ?  "text-red-670" : "text-slate-800"}`}>
                {p.name}
            </div>
           
           <div className="text-xs text-slate-500 truncate">
            {isConnected ? "Already connected": p.description}
           </div>

         </div>
      
        {isConnected && <CheckCircleIcon className="size-4 text-red-500 shrink-0"/>}
        {isConnected && <div className="size-4 shrink-0 border-2  border-red-600
         border-t-transparent rounded-full animate-spin"/>}

         {!isConnected && !isConnecting && <ExternalLinkIcon className="size-3.5 text-slate-400 shrink-0"/>}
        
        </button>
    )
})}
</div>

  </div>
    </div>
  )
}

export default PlatformPickerModel