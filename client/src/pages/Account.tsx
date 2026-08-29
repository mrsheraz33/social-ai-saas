/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react"
import { PLATFORMS } from "../assets/assets"
import { PlusIcon } from "lucide-react"

function Account() {
  const [account , setAccount] = useState<any[]>([])
  const [connecting , setConnecting] = useState<string | null>(null)
  const [showPlateformPicker , setShowPlateformPicker] = useState(false)

  return (
    <div className="space-y-8 max-w-4xl">

  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">

    <div>
      <h2 className="text-xl text-slate-900">Connected Account</h2>
      <p className="text-sm text-slate-500 mt-0.5">{account.length} of {PLATFORMS.length} platforms connected</p>
    </div>

    <button onClick={()=> setShowPlateformPicker(true)}
      className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600
       text-white rounded-full font-medium transition-all w-full sm:w-auto justify-center">
      <PlusIcon className="size-4"/> Connect Account
    </button>
  </div>
    </div>
  )
}

export default Account